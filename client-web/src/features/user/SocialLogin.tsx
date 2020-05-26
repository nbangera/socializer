import React, { Fragment } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Button, Icon } from "semantic-ui-react";
interface IProps {
  fbCallback: (response: any) => void;
}

const SocialLogin: React.FC<IProps> = ({ fbCallback }) => {
  const onFBError = (error: any) => {
    console.log(error);
  };

  const onFBClick = (error: any) => {
    console.log(error);
  };

  return (
    <Fragment>
      {/* <Button
          type="button"
          fluid
          color="facebook"
          onClick={onFBClick}>         
          <Icon name="facebook"></Icon>Login with Facebook
        </Button> */}
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
          >
            <Icon name="facebook"></Icon>Login test with Facebook
          </Button>
        )}
      />
    </Fragment>
  );
};

export default SocialLogin
