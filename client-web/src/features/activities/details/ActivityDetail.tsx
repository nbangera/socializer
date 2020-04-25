import React from "react";
import { IActivity } from "../../../app/models/Activity";
import { Card, Image, Button } from "semantic-ui-react";

interface IProp {
  activity: IActivity;
  setEditMode:(editMode:boolean)=>void;
  setSelectedActivity:(activity:IActivity|null)=> void
}

export const ActivityDetail: React.FC<IProp> = ({ activity,setEditMode,setSelectedActivity }) => {
  return (
    <Card fluid>
      <Image src={`/assets/categoryimages/${activity.category}.jpg`} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span className="date">{activity.date}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group width={2}>
          <Button onClick={()=>setEditMode(true)} basic color="blue" content="Edit"></Button>
          <Button basic onClick={()=>setSelectedActivity(null)} color="grey" content="Cancel"></Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};
