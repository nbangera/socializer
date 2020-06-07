import axios, { AxiosResponse } from "axios";
import { IActivity, IActivitiesEnvelope } from "../models/Activity";
import { history } from "../..";
import { toast } from "react-toastify";
import { IUser, IUserFormValues } from "../models/User";
import { IProfile, IPhoto } from "../models/Profile";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  var originalRequest = error.config;
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error detected");
  }
  const { status, config, data } = error.response;
  if (status === 404) {
    history.push("/notfound");
  }
  if (status === 401 && originalRequest.url.endsWith("refresh")) {
    window.localStorage.removeItem("jwt");
    window.localStorage.removeItem("refreshToken");
    history.push("/");
    toast.info("Your session has expired, please login again");
    return Promise.reject(error);
  }
  if (status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    return axios
      .post(`/user/refresh`, {
        token: window.localStorage.getItem("jwt"),
        refreshToken: window.localStorage.getItem("refreshToken"),
      })
      .then((res) => {
        window.localStorage.setItem("jwt", res.data.token);
        window.localStorage.setItem("refreshToken", res.data.refreshToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        return axios(originalRequest);
      });
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
  get: (url: string) => axios.get(url).then(responseBody),
  getByParams: (url: string, params: URLSearchParams) =>
    axios.get(url, { params: params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios
      .post(url, formData, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

const Activities = {
  // list: (limit?:number,page?:number): Promise<IActivitiesEnvelope> =>
  // request.get(`/activities?limit=${limit}&offset=${page?page*limit!:0}`),
  list: (params: URLSearchParams): Promise<IActivitiesEnvelope> =>
    request.getByParams(`/activities`, params),
  details: (id: string) => request.get(`/activities/${id}`),
  create: (activity: IActivity) => request.post("/activities/", activity),
  update: (activity: IActivity) =>
    request.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.delete(`/activities/${id}`),
  attend: (id: string) => request.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => request.delete(`/activities/${id}/unattend`),
};

const User = {
  current: (): Promise<IUser> => request.get("/user"),
  register: (user: IUserFormValues): Promise<IUser> =>
    request.post("/user/register", user),
  login: (user: IUserFormValues): Promise<IUser> =>
    request.post("/user/login", user),
  fbLogin: (accessToken: string) =>
    request.post("/user/facebook", { accessToken }),
  refreshToken: (token: string, refreshToken: string) => {
    return axios.post("/user/refresh", { token, refreshToken }).then((res) => {
      window.localStorage.setItem("jwt", res.data.token);
      window.localStorage.setItem("refreshToken", res.data.refreshToken);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      return res.data.token;
    });
  },
};

const Profiles = {
  get: (userName: string): Promise<IProfile> =>
    request.get(`/profiles/${userName}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    request.postForm(`/photos`, photo),
  setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => request.delete(`/photos/${id}`),
  updateProfile: (profile: Partial<IProfile>) =>
    request.put("/profiles", profile),
  follow: (userName: string) =>
    request.post(`/profiles/${userName}/follow`, {}),
  unfollow: (userName: string) =>
    request.delete(`/profiles/${userName}/follow`),
  listFollowings: (userName: string, predicate: string) =>
    request.get(`/profiles/${userName}/follow?predicate=${predicate}`),
  listUserActivities: (userName: string, predicate: string) =>
    request.get(`/profiles/${userName}/activities?predicate=${predicate}`),
};

export default {
  Activities,
  User,
  Profiles,
};
