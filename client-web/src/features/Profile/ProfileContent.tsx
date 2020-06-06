import React from "react";
import { Tab } from "semantic-ui-react";
import ProfilePhoto from "./ProfilePhoto";
import ProfileDescription from "./ProfileDescription";
import ProfileActivities from "./ProfileActivities";
import ProfileFollowings from "./ProfileFollowings";

const panes = [
  {
    menuItem: "About",
    render: () => <ProfileDescription></ProfileDescription>,
  },
  { menuItem: "Photos", render: () => <ProfilePhoto></ProfilePhoto> },
  {
    menuItem: "Activities",
    render: () => <ProfileActivities />,
  },
  {
    menuItem: "Followers",
    render: () => <ProfileFollowings />,
  },
  {
    menuItem: "Following",
    render: () => <ProfileFollowings></ProfileFollowings>,
  },
];

interface IProps {
  setActiveTab: (activeIndex:any)=>void
}

const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e,data)=>setActiveTab(data.activeIndex)}
    ></Tab>
  );
};
export default ProfileContent;
