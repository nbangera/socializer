import { RootStore } from "./rootStore";
import { action, observable, runInAction, computed, reaction } from "mobx";
import agent from "../api/agent";
import { IProfile, IPhoto, IUserActivity } from "../models/Profile";
import { toast } from "react-toastify";

//configure({ enforceActions: "always" });
export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      (activeIndex) => {
        this.tabChanged(activeIndex);
        // if (activeIndex === 3 || activeIndex === 4) {
        //   const predicate = activeIndex === 3 ? "followers" : "following";
        //   this.loadFollowings(predicate);
        // } else {
        //   this.followings = [];
        // }
      }
    );
  }

  @observable loadingProfile = true;
  @observable profile: IProfile | null = null;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable userActivities: IUserActivity[] = [];
  @observable loadingUserActivities: boolean = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.userName === this.profile.userName;
    } else {
      return false;
    }
  }

  @action tabChanged= (activeIndex:number)=>{
    if (activeIndex === 3 || activeIndex === 4) {
      const predicate = activeIndex === 3 ? "followers" : "following";
      this.loadFollowings(predicate);
    } else {
      this.followings = [];
    }

  }


  @action loadProfile = async (userName: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(userName);
      runInAction("loadProfile", () => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction("loadProfile error", () => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction("uploadPhoto", () => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading image");
      runInAction("Error uploadPhoto", () => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);

      runInAction("setMainPhoto", () => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find((x) => x.isMain)!.isMain = false;
        this.profile!.photos.find((x) => x.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      runInAction("setMainPhoto Error", () => {
        toast.error("Error setting the main photo");
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction("deletePhoto", () => {
        this.profile!.photos = this.profile!.photos.filter(
          (x) => x.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      runInAction("setMainPhoto", () => {
        toast.error("Error deleting the photo");
        this.loading = false;
      });
    }
  };

  @action updateProfile = async (profile: Partial<IProfile>) => {
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        this.profile = { ...this.profile!, ...profile };
      });
    } catch (error) {
      toast.error("Problem updating profile");
    }
  };

  @action loadUserActivities = async (userName: string, predicate?: string) => {
    this.loadingUserActivities = true;
    try {      
      const userActivities = await agent.Profiles.listUserActivities(
        userName,
        predicate!
      );
      runInAction("loadUserActivities", () => {
        this.userActivities = userActivities;
        this.loadingUserActivities = false;
      });
    } catch (error) {
      runInAction("loadUserActivities Error", () => {
        toast.error("Error loading user activities");
        this.loadingUserActivities = false;
      });
    }
  };

  @action follow = async (userName: string) => {
    this.loading = true;
    try {
      await agent.Profiles.follow(userName);
      runInAction("follow", () => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem following user");
      runInAction("follow error", () => {
        this.loading = false;
      });
    }
  };

  @action unfollow = async (userName: string) => {
    this.loading = true;
    try {
      await agent.Profiles.unfollow(userName);
      runInAction("unfollow", () => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem unfollowing user");
      runInAction("unfollow error", () => {
        this.loading = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.loading = true;
    try {
      const profiles = await agent.Profiles.listFollowings(
        this.profile!.userName,
        predicate
      );
      runInAction("loadfollowings", () => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      runInAction("loadfollowings error", () => {
        toast.error("problem loading followings");
        this.loading = false;
      });
    }
  };

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };
}
