import React, { SyntheticEvent } from "react";
import { Segment, Item, Button, Label } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (e:SyntheticEvent<HTMLButtonElement>,id: string) => void;
  target:string,
  submitting:boolean;
}

export const ActivityList: React.FC<IProps> = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
  target
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map((activity) => (
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
                  onClick={()=>selectActivity(activity.id)}
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
