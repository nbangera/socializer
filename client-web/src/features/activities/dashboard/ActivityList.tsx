import React, { useContext, Fragment } from "react";
import { Segment, Item, Button, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { NavLink } from "react-router-dom";
import ActivityListItem from "./ActivityItem";

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {
    activitiesByDate,
    submitting,
    target,
    deleteActivity,
  } = activityStore;

  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment>
          <Label size={"large"} color={"blue"}> {group}</Label>        
            <Item.Group divided>
              {activities.map((activity) => (
                <ActivityListItem
                  key={activity.id}
                  activity={activity}
                ></ActivityListItem>
              ))}
            </Item.Group>
        
        </Fragment>
      ))};
    </Fragment>
  );
};

export default observer(ActivityList);
