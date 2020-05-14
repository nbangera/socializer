import { observable, action, computed, runInAction } from "mobx";
import { IActivity, IAttendee } from "../models/Activity";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { setActivityProps, createAttendee } from "../common/util/util";
import { toast } from "react-toastify";

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();
  @observable loadingInitial: boolean = false;
  @observable activity: IActivity | null = null;
  @observable submitting: boolean = false;
  @observable loading: boolean = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate = (activites: IActivity[]) => {
    const sortedActivities = activites.sort(
      (a, b) => a.date.getTime() - b.date!.getTime()
    );

    const groupedActivities = Object.entries(
      sortedActivities.reduce((activityEntries, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        //console.log(activityEntries);
        activityEntries[date] = activityEntries[date]
          ? [...activityEntries[date], activity]
          : [activity];
        return activityEntries;
      }, {} as { [key: string]: IActivity[] })
    );

    return groupedActivities;
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("loading activities error", () => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
          this.activity = activity;
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction("get activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  @action createActivity = async (activity: IActivity) => {
    try {
      this.submitting = true;
      await agent.Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user!)
      let attendees : IAttendee [] = []
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.isHost = true;
      runInAction("create Activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("create Activity error", () => {
        console.log(error);
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    try {
      this.submitting = true;
      this.target = event.currentTarget.name;
      await agent.Activities.delete(id);
      runInAction("delete Activity", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction("delete Activity error", () => {
        this.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    try {
      this.submitting = true;
      await agent.Activities.update(activity);
      runInAction("edit Activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction("edit Activity error", () => {
        this.submitting = false;
      });
    }
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction("attend Activity", () => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction("attend Activity error", () => {
        this.loading = false;
        toast.error("Problem in joining the attendee");
      });
    }
  };

  @action cancelActivity = async () => {
    this.loading = true;
    try {      
      await agent.Activities.unattend(this.activity!.id);
      runInAction("cancel activity", () => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.userName !== this.rootStore.userStore.user!.userName
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction("cancel activity error", () => {
        this.loading = false;
        toast.error("Problem in cancelling the attendee");
      });
    }
  };
}
