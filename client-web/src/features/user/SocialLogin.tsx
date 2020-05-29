import React, { Fragment } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Button, Icon } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
interface IProps {
  fbCallback: (response: any) => void;
  loading: boolean;
}

const SocialLogin: React.FC<IProps> = ({ fbCallback, loading }) => {
  const onFBError = (error: any) => {
    console.log(error);
  };



  return (
    <Fragment>
      <FacebookLogin
        appId="2313557942282736"
        fields="name,picture,email"
        callback={fbCallback}
        onFailure={onFBError}
        render={(renderProps: any) => (
          <Button
            type="button"
            fluid
            color="facebook"
            onClick={renderProps.onClick}
            loading={loading}
          >
            <Icon name="facebook"></Icon>Login test with Facebook
          </Button>
        )}
      />
    </Fragment>
  );
};

export default observer(SocialLogin);
