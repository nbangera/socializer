import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { Header, Icon, List } from "semantic-ui-react";

class App extends Component {
  state = {
    Users: [],
  };

  componentDidMount() {
    axios
      .get("https://localhost:5001/api/user")
      .then((res) => {
        const users = res.data;
        this.setState({ Users: users });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div className="App">       
        <Header as="h2">
          <Icon name="settings" />
          <Header.Content>
           Socializer
            <Header.Subheader>Manage your preferences</Header.Subheader>
          </Header.Content>
        </Header>
        <List>
          {this.state.Users.map((user: any) => (
            <List.Item key={user.id}>
              {user.id} {user.firstName}
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default App;
