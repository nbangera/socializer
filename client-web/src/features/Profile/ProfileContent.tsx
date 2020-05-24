import React from "react";
import { Tab } from "semantic-ui-react";
import { IProfile } from "../../app/models/Profile";
import { observer } from "mobx-react-lite";
import  ProfilePhoto from "./ProfilePhoto";
import ProfileDescription from "./ProfileDescription";
import ProfileActivities from "./ProfileActivities";

const panes = [
  { menuItem: "About", render: () => <Tab.Pane><ProfileDescription></ProfileDescription></Tab.Pane> },
  { menuItem: "Photos", render: () => <Tab.Pane><ProfilePhoto></ProfilePhoto> </Tab.Pane> },
  {
    menuItem: "Activities",
    render: () => <Tab.Pane><ProfileActivities/></Tab.Pane>,
  },
  {
    menuItem: "Followers",
    render: () => <Tab.Pane>Followers content</Tab.Pane>,
  },
  {
    menuItem: "Following",
    render: () => {
      return <Tab.Pane>Following content</Tab.Pane>;
    },
  },
];

interface IProps {

    profile : IProfile
}


const ProfileContent:React.FC<IProps> = ({profile}) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
    ></Tab>
  );
};
export default observer(ProfileContent);