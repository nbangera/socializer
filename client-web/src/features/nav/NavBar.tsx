import React from "react";
import { Menu, Button, Container } from "semantic-ui-react";

interface IProps {
  openCreateForm: () => void;
}

export const NavBar: React.FC<IProps> = ({openCreateForm}) => {
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
            onClick={openCreateForm}
          ></Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};
