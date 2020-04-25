  import React, { Component } from "react";
  import axios from "axios";
  import { Header, Icon, List } from "semantic-ui-react";
  import { IActivity } from "../models/Activity";

  interface IState {
    activities: IActivity[];
  }

  class App extends Component<{}, IState> {
    readonly state: IState = {
      activities: [],
    };

    componentDidMount() {
      axios
        .get<IActivity[]>("https://localhost:5001/api/activities")
        .then((res) => {
          const activities = res.data;
          this.setState({ activities: activities });
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
            {this.state.activities.map((activity) => (
              <List.Item key={activity.id}>{activity.title}</List.Item>
            ))}
          </List>
        </div>
      );
    }
  }

  export default App;
