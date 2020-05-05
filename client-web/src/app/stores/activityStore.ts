import { observable, action, computed, configure, runInAction } from "mobx";
import { IActivity } from "../models/Activity";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";

configure({ enforceActions: "always" });
class ActivityStore {
  @observable activityRegistry = new Map();
  @observable loadingInitial: boolean = false;
  @observable activity: IActivity | null = null;
  @observable submitting: boolean = false;
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
          activity.date = new Date(activity.date);
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
          activity.date = new Date(activity.date);
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
}

export default createContext(new ActivityStore());
