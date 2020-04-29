import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/Activity";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting,setSubmitting] = useState(false);
  const [target,setTarget] = useState('');

  // const handleEdit=(editMode2:boolean) =>
  // {
  //   console.log('clicked button');
  //   setEditMode(
  //      editMode2
  //   );
  // }

  const handleOpenCreateForm = () => {
    console.log("handleOpenCreateForm fired");
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleActivityCreate = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(()=>setSubmitting(false));
  };

  const handleActivityEdit = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(() => {
      setActivities([
        ...activities.filter((a) => a.id !== activity.id),
        activity,
      ]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(()=>setSubmitting(false));
  };

  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    setEditMode(false);
  };

  const handleActivityDelete = (event:SyntheticEvent<HTMLButtonElement>,id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter((a) => a.id !== id)]);
    }).then(()=>setSubmitting(false));
  };

  useEffect(() => {
    agent.Activities.list()
      .then((res) => {
        const activities = res;
        let activitiesData: IActivity[] = [];
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          activitiesData.push(activity);
        });
        setActivities(activitiesData);
      })
      .then(() => setLoading(false))
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  if (loading)
  return  <LoadingComponent content="Loading Activities...."></LoadingComponent>
  

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          submitting={submitting}
          activities={activities}
          selectActivity={handleSelectedActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          handleActivityCreate={handleActivityCreate}
          handleActivityEdit={handleActivityEdit}
          handleActivityDelete={handleActivityDelete}
          target={target}
        ></ActivityDashboard>
      </Container>)      
    </Fragment>
  );
};
export default App;
