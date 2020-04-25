import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {Container } from "semantic-ui-react";
import { IActivity } from "../models/Activity";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode,setEditMode]  = useState(false);

  // const handleEdit=(editMode2:boolean) =>
  // {
  //   console.log('clicked button');
  //   setEditMode(
  //      editMode2
  //   );
  // }

  const handleOpenCreateForm=()=>{
    console.log("handleOpenCreateForm fired");
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleActivityCreate = (activity:IActivity) =>{

    setActivities([...activities,activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleActivityEdit = (activity:IActivity) =>{
    setActivities([...activities.filter(a=>a.id !== activity.id),activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleSelectedActivity = (id: string) => {

    setSelectedActivity(activities.filter((a) => (a.id === id))[0]);    
    setEditMode(false);
    
  };

  const handleActivityDelete = (id:string) =>{
    setActivities([...activities.filter(a=>a.id !== id)]);
  }

  useEffect(() => {
    axios
      .get<IActivity[]>("https://localhost:5001/api/activities")
      .then((res) => {
        const activities = res.data;
        let activitiesData:IActivity[] = [];
        activities.forEach(activity=>{
          activity.date = activity.date.split('.')[0];
          activitiesData.push(activity);
        }
      )
        setActivities(activitiesData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm}/>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard        
          activities={activities}
          selectActivity={handleSelectedActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          handleActivityCreate={handleActivityCreate}
          handleActivityEdit={handleActivityEdit}
          handleActivityDelete={handleActivityDelete}
        ></ActivityDashboard>
      </Container>
    </Fragment>
  );
};
export default App;
