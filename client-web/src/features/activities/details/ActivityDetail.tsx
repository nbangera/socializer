import React, { useContext } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";

export const ActivityDetail: React.FC = () => {

  const activityStore = useContext(ActivityStore)
  const {selectedActivity:activity,openEditForm,cancelDetailForm} = activityStore;
  
  return (
    <Card fluid>
      <Image src={`/assets/categoryimages/${activity!.category}.jpg`} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span className="date">{activity!.date}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group width={2}>
          <Button onClick={()=>openEditForm(activity!.id)} basic color="blue" content="Edit"></Button>
          <Button basic onClick={()=>cancelDetailForm()} color="grey" content="Cancel"></Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};
