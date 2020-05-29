import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button,Header, Divider } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/User";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import SocialLogin from './SocialLogin'
import { observer } from "mobx-react-lite";

const LoginForm: React.FC<RouteComponentProps> = ({ history }) => {
  const rootStore = useContext(RootStoreContext);
  const { login,fbLogin,loading } = rootStore.userStore;
  const { closeModal } = rootStore.modalStore;

  const validate = combineValidators({
    email: isRequired("Email"),
    password: isRequired("Password"),
  });

  const handleSubmitForm = (values: IUserFormValues) => {
    return login(values)
      .then(() => {
        closeModal();
        history.push("/activities");
      })
      .catch((error) => ({        
        [FORM_ERROR]: error,
      }));

    // return login(values).catch((error) => {
    //   console.log(error);
    //   return { [FORM_ERROR]: error };
    // });
  };

  return (
    <FinalForm
      onSubmit={handleSubmitForm}
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        form,
        invalid,
        pristine,
        dirtySinceLastSubmit,
        submitError
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            textAlign="center"
            as="h2"
            color="teal"
            content="LOGIN"
          ></Header>
          <Field component={TextInput} name="email" placeholder="Email" />
          <Field
            component={TextInput}
            name="password"
            placeholder="Password"
            type="password"
          />        
          {submitError && !dirtySinceLastSubmit && (            
            <ErrorMessage error={submitError} text='Invalid email or password'/>
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            content="Login"
            positive
            fluid
            color={"teal"}
          ></Button>
          {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
          <Divider horizontal>Or</Divider>
          <SocialLogin fbCallback={fbLogin}  loading={loading}></SocialLogin>
        </Form>
      )}
    ></FinalForm>
  );
};

export default withRouter(observer(LoginForm));
