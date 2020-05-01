import React from "react";
import { Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

export const home = () => { 
  return (
    <Container style={{ marginTop: "7em" }}>
      <h1>Welcome Home Page</h1>

      <h3>
        Go to <Link to={"/activities"}>Activities</Link>
      </h3>
    </Container>
  );
};
