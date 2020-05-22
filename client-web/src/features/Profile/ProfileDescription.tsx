import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Tab, Grid, Header, Button } from "semantic-ui-react";
import ProfileEditForm from "./ProfileEditForm";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { updateProfile, profile, isCurrentUser } = rootStore.profileStore;
  const [editMode, setEditMode] = useState(false);
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            content={`About ${profile!.displayName}`}
            icon="user"
          ></Header>
          {isCurrentUser && (
            <Button
              basic
              floated="right"
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={()=>setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm
              profile={profile!}
              updateProfile={updateProfile}
            ></ProfileEditForm>
          ) : (
            <span>{profile!.bio}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};
export default observer(ProfileDescription);
