import React from "react";
import {
  Item,
  Button,
  SegmentGroup,
  Segment,
  Icon,
  Label,
} from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { NavLink, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { format } from "date-fns";
import ActivityAttendeesItem from "./ActivityAttendeesItem";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => { 

  const host = activity.attendees.filter((x) => x.isHost)[0];
  return (
    <SegmentGroup>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src={host.image || '/assets/user.png'}
              style={{marginBottom:3}}
            ></Item.Image>
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>              
              <Item.Description>Hosted by <Link to={`/profile/${host.userName}`}>{host.displayName}</Link></Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="orange"
                    content="You are hosting this activity"
                  />
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="green"
                    content="You are attending this activity"
                  />
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" />
        {format(activity.date, "h:mm a")}
        <Icon name="marker"></Icon>
        {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>
        <ActivityAttendeesItem attendees={activity.attendees} />
      </Segment>
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
