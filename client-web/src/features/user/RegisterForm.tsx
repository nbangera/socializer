import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button,Header } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/User";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";

const RegisterForm: React.FC<RouteComponentProps> = ({ history }) => {
  const rootStore = useContext(RootStoreContext);
  const { register } = rootStore.userStore;
  const { closeModal } = rootStore.modalStore;

  const validate = combineValidators({
    email: isRequired("Email"),
    userName: isRequired("UserName"),
    displayName: isRequired("DisplayName"),
    password: isRequired("Password"),
  });

  const handleSubmitForm = (values: IUserFormValues) => {
    return register(values)
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
            content="REGISTER"
          ></Header>
          <Field component={TextInput} name="userName" placeholder="Username" />
          <Field component={TextInput} name="displayName" placeholder="Display Name" />
          <Field component={TextInput} name="email" placeholder="Email" />
          <Field
            component={TextInput}
            name="password"
            placeholder="Password"
            type="password"
          />        
          {submitError && !dirtySinceLastSubmit && (            
            <ErrorMessage error={submitError}/>
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            content="Register"
            positive
            fluid
            color={"teal"}
          ></Button>
          {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
        </Form>
      )}
    ></FinalForm>
  );
};

export default withRouter(RegisterForm);
