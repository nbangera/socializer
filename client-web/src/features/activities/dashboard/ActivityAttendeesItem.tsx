import React from "react";
import { List, Image, Popup } from "semantic-ui-react";
import { IAttendee } from "../../../app/models/Activity";
import { observer } from "mobx-react-lite";

interface IProps {
  attendees: IAttendee[];
}

const ActivityAttendeesItem: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((attendee, index) => (
        <List.Item key={`attendee.userName_${index}`}>
          <Popup
            header={attendee.displayName}
            trigger={
              <Image
                size="mini"
                circular
                src={attendee.image || "/assets/user.png"}
              ></Image>
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default observer(ActivityAttendeesItem);