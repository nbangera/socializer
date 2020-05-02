import React from "react";
import {
  Item,
  Button,
  Label,
  SegmentGroup,
  Segment,
  Icon,
} from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  return (
    <SegmentGroup>
      <Segment>
        <Item.Group>
        <Item>
          <Item.Image size="tiny" circular src="/assets/user.png"></Item.Image>
          <Item.Content>
            <Item.Header as="a">{activity.title}</Item.Header>
            <Item.Description>Hosted by Nishank</Item.Description>            
          </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock"></Icon>
        {activity.date}
        <Icon name="marker"></Icon>
        {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>Section for Attendees</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          floated="right"
          content="View"
          color="blue"
          as={NavLink}
          to={`/activities/${activity.id}`}
        ></Button>
      </Segment>
    </SegmentGroup>
  );
};

export default observer(ActivityListItem);
