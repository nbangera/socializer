import React, { useContext } from "react";
import { Menu, Button, Container, Dropdown, Image } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink, Link, RouteComponentProps, withRouter } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";

const NavBar: React.FC<RouteComponentProps> = ({history}) => {
  const rootStore = useContext(RootStoreContext);
  const {user, logout } = rootStore.userStore;
  const handleLogout = () => {
    logout().then(() => history.push("/"));
  };
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item as={NavLink} exact to="/">
          <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }}  />
          Socializer
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} to={"/activities"} />
        <Menu.Item>
          <Button
            positive
            content="Create Activity"
            as={NavLink}
            to={"/createActivity"}
          ></Button>
        </Menu.Item>
        {user && (
          <Menu.Item position="right">
            <Image
              avatar
              spaced="right"
              src={user.image || "/assets/user.png"}
            />
            <Dropdown pointing="top left" text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${user.userName}`}
                  text="My profile"
                  icon="user"
                />
                <Dropdown.Item
                  onClick={handleLogout}
                  text="Logout"
                  icon="power"
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

export default withRouter(observer(NavBar));
