import React, { useContext } from "react";
import { Menu, Button, Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../app/stores/activityStore";

const NavBar: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { openCreateForm } = activityStore;

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item>
          <img src="assets/logo.png" alt="logo" />
          Socializer
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button
            positive
            content="Create Activity"
            onClick={() => openCreateForm()}
          ></Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
