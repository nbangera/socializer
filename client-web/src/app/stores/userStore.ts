import { observable, computed, action, runInAction, configure } from "mobx";
import { IUser, IUserFormValues } from "../models/User";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { history } from "../..";

configure({ enforceActions: "always" });
export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action getUser = async () => {
    try {
      const user = await agent.User.current();      
      runInAction("get current user", () => {        
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);      
      runInAction("login", () => {
        this.rootStore.commonStore.setToken(user.token);
        this.user = user;
      });    
    } catch (error) {
      //console.log(error);
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.register(values);
      runInAction("register", () => {
        this.rootStore.commonStore.setToken(user.token);
        this.user = user;
      });    
    } catch (error) {
      //console.log(error);
      throw error;
    }
  };

  @action logout = async () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };

  @action fbLogin = async(response:any)=>
  {
    console.log(response);
  }
}