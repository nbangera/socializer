import React, { useContext } from "react";
import { RouteComponentProps, Route, Redirect, RouteProps } from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from "mobx-react-lite";

interface IProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}

const PrivateRoute: React.FC<IProps> = ({ component: Component, ...rest }) => {
  const rootContext = useContext(RootStoreContext);
  const { isLoggedIn } = rootContext.userStore;
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default observer(PrivateRoute);
