import React, { useContext } from "react";
import { Segment, Item, Button, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { NavLink } from "react-router-dom";


const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore)
  const {activitiesByDate,submitting,target,deleteActivity} = activityStore;

  return (
    <Segment clearing>
      <Item.Group divided>
        {activitiesByDate.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
            <Item.Description>{activity.id}</Item.Description>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>{activity.description}</Item.Description>
              <Item.Description>
                {activity.venue}, {activity.city}
              </Item.Description>
              <Item.Extra>
                <Button
                  floated="right"
                  content="View"
                  color="blue"
                  as={NavLink} to={`/activities/${activity.id}`}
                ></Button>
                <Button
                  name={activity.id}
                  loading={target===activity.id  && submitting}
                  floated="right"
                  content="Delete"
                  color="red"
                  onClick={(e)=>deleteActivity(e,activity.id)}
                ></Button>
                <Label basic content={activity.category}></Label>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);