import axios, { AxiosResponse } from "axios";
import { IActivity } from "../models/Activity";
import { history } from "../..";
import { toast } from "react-toastify";
import { IUser, IUserFormValues } from "../models/User";
import { IProfile, IPhoto } from "../models/Profile";

axios.defaults.baseURL = "https://localhost:5001/api";

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) 
    {
      config.headers.Authorization = `Bearer ${token}`;      
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error detected");
  }
  const { status, config, data } = error.response;
  if (status === 404) {
    history.push("/notfound");
  }
  //for handling invalid guid
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/notfound");
  }
  if (status === 500) {
    toast.error("Server error");
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => {
      resolve(response);
    }, ms)
  );

// const get = (url: string) => axios.get(url).then(sleep(1000)).then(responseBody);
// const post = (url: string,body:{}) => axios.post(url,post).then(sleep(1000)).then(responseBody);

const request = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(1000)).then(responseBody),
  postForm:(url:string,file:Blob) => {
    let formData =  new FormData();
    formData.append('File',file);
    return axios.post(url,formData,{headers:{'content-type':'multipart/form-data'}}).then(responseBody);
  }
};

const Activities = {
  list: (): Promise<IActivity[]> => request.get("/activities/"),
  details: (id: string) => request.get(`/activities/${id}`),
  create: (activity: IActivity) => request.post("/activities/", activity),
  update: (activity: IActivity) =>
    request.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.delete(`/activities/${id}`),
  attend:(id:string) =>request.post(`/activities/${id}/attend`,{}),
  unattend:(id:string) =>request.delete(`/activities/${id}/unattend`), 
};

const User = {
  current: (): Promise<IUser> => request.get("/user"),
  register: (user: IUserFormValues): Promise<IUser> =>
    request.post("/user/register", user),
  login: (user: IUserFormValues): Promise<IUser> =>
    request.post("/user/login", user),
};

const Profiles = {
  get: (userName:string): Promise<IProfile> => request.get(`/profiles/${userName}`) ,
  uploadPhoto :(photo:Blob):Promise<IPhoto>=>request.postForm(`/photos`,photo),
  setMainPhoto :(id:string)=>request.post(`/photos/${id}/setMain`,{}),
  deletePhoto:(id:string)=>request.delete(`/photos/${id}`),
  updateProfile:(profile:Partial<IProfile>)=>request.put('/profiles',profile)
};

export default {
  Activities,
  User,
  Profiles
};
