import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps, NavLink } from "react-router-dom";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import  ActivityDetailHeader  from "./ActivityDetailHeader";
import  ActivityDetailInfo from "./ActivityDetailInfo";
import ActivityDetailChat from "./ActivityDetailChat";
import ActivityDetailSidebar from "./ActivityDetailSidebar";

interface DetailParams {
  id: string;
}

const ActivityDetail: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const { activity, loadActivity, loadingInitial } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loadingInitial || !activity)
    return (
      <LoadingComponent content="loading activity detail"></LoadingComponent>
    );

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailHeader activity={activity} />
        <ActivityDetailInfo activity={activity} />
        <ActivityDetailChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailSidebar />
      </Grid.Column>
    </Grid>
    // <Card fluid>
    //   <Image
    //     src={`/assets/categoryimages/${activity!.category}.jpg`}
    //     wrapped
    //     ui={false}
    //   />
    //   <Card.Content>
    //     <Card.Header>{activity!.title}</Card.Header>
    //     <Card.Meta>
    //       <span className="date">{activity!.date}</span>
    //     </Card.Meta>
    //     <Card.Description>{activity!.description}</Card.Description>
    //   </Card.Content>
    //   <Card.Content extra>
    //     <Button.Group width={2}>
    //       <Button
    //         as={NavLink}
    //         to={`/edit/${activity!.id}`}
    //         basic
    //         color="blue"
    //         content="Edit"
    //       ></Button>
    //       <Button
    //         basic
    //         onClick={() => history.push("/activities")}
    //         color="grey"
    //         content="Cancel"
    //       ></Button>
    //     </Button.Group>
    //   </Card.Content>
    // </Card>
  );
};

export default observer(ActivityDetail);
