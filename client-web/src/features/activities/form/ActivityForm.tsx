import React, { useState, useContext, useEffect } from "react";
import {Segment,Form,Button, Grid} from "semantic-ui-react";
import {  ActivityFormValues } from "../../../app/models/Activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/categoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate'
import { RootStoreContext } from "../../../app/stores/rootStore";

const validate = combineValidators({
  title:isRequired({message:'Event title is required'}),
  description:composeValidators(
   isRequired('Description'),
   hasLengthGreaterThan(4)({message:'Description should be atleast 5 character'})
  )(),
  city:isRequired('City'),
  category:isRequired('Category'),
  venue:isRequired('Venue'),
  date:isRequired('D+ate'),
  time:isRequired('Time')
})

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
  } = rootStore.activityStore;

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);



  const handleFinalSubmitForm = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    console.log(values);
    debugger;
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(activity).then(() => history.push(`/edit/${activity.id}`));
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            onSubmit={handleFinalSubmitForm}
            initialValues={activity}
            validate={validate}
            render={({ handleSubmit,invalid,pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  placeholder="Title"
                  name="title"
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  placeholder="Description"
                  name="description"
                  value={activity.description}
                  component={TextAreaInput}
                  rows={3}
                />
                <Form.Group widths="equal">
                  <Field
                    placeholder="Date"
                    name="date"
                    date={true}
                    component={DateInput}
                    value={activity.date}
                  />
                  <Field
                    placeholder="Date"
                    name="time"
                    time={true}
                    component={DateInput}
                    value={activity.date}
                  />
                </Form.Group>

                <Field
                  placeholder="City"
                  name="city"
                  component={TextInput}
                  value={activity.city}
                />
                <Field
                  placeholder="Venue"
                  name="venue"
                  component={TextInput}
                  value={activity.venue}
                />
                <Field
                  placeholder="Category"
                  name="category"
                  component={SelectInput}
                  value={activity.category}
                  options={category}
                />
                <Button
                  floated="right"
                  positive
                  content="Submit"
                  type="submit"
                  disabled={loading || invalid || pristine }
                  loading={submitting}
                ></Button>
                <Button
                  onClick={() => {
                    activity.id
                      ? history.push(`/activities/${activity.id}`)
                      : history.push("/activities");
                  }}
                  disabled={loading}
                  content="Cancel"
                  floated="right"
                  type="Button"
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
