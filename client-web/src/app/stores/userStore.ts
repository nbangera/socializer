import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../models/User";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { history } from "../..";

//configure({ enforceActions: "always" });
export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;
  @observable loading: boolean = false;

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
        this.rootStore.commonStore.setRefreshToken(user.refreshToken);
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
        this.rootStore.commonStore.setRefreshToken(user.refreshToken);
        this.user = user;
      });
    } catch (error) {
      //console.log(error);
      throw error;
    }
  };

  @action logout = async () => {
    this.rootStore.commonStore.setToken(null);
    this.rootStore.commonStore.setRefreshToken(null);
    this.user = null;
    history.push("/");
  };

  @action fbLogin = async (response: any) => {
    this.loading = true;
    try {
      var user = await agent.User.fbLogin(response.accessToken);
      runInAction("fbLogin", () => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token);
        this.rootStore.commonStore.setRefreshToken(user.refreshToken);
        this.rootStore.modalStore.closeModal();
        history.push("/activities");
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
      throw error;
    }
  };
}
