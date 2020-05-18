import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import  ProfileContent  from "./ProfileContent";
import { RouteComponentProps } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import { LoadingComponent } from "../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface RouteParams {
  userName: string;
}
interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const { profile, loadingProfile, loadProfile } = rootStore.profileStore;

  useEffect(() => {    
    loadProfile(match.params.userName);
  }, [loadProfile, match]);

  if (loadingProfile)
    return <LoadingComponent content="loading profile ..."></LoadingComponent>;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!}></ProfileHeader>
        <ProfileContent profile={profile!}></ProfileContent>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
