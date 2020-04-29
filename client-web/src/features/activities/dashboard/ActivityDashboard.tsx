import React, { SyntheticEvent } from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { ActivityList } from "./ActivityList";
import { ActivityDetail } from "../details/ActivityDetail";
import { ActivityForm } from "../form/ActivityForm";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  selectedActivity: IActivity | null;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
  setSelectedActivity: (activity: IActivity | null) => void;
  handleActivityCreate: (activity: IActivity) => void;
  handleActivityEdit: (activity: IActivity) => void;
  handleActivityDelete: (e:SyntheticEvent<HTMLButtonElement>,id:string) => void;
  target:string
  submitting:boolean;
}

export const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity,
  editMode,
  setEditMode,
  setSelectedActivity,
  handleActivityCreate,
  handleActivityEdit,
  handleActivityDelete,
  submitting,
  target
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={handleActivityDelete}
          submitting={submitting}
          target={target}
        ></ActivityList>
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetail
            activity={selectedActivity}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
          ></ActivityDetail>
        )}
        {editMode && (
          <ActivityForm
            key={selectedActivity && selectedActivity.id || 0}
            setEditMode={setEditMode}
            activity={selectedActivity!}
            handleActivityCreate={handleActivityCreate}
            handleActivityEdit={handleActivityEdit}
            submitting={submitting}
          ></ActivityForm>
        )}
      </Grid.Column>
    </Grid>
  );
};
