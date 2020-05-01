import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, TextArea, Input } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
    activity: initialFormState,
    clearActivity,
  } = activityStore;

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }

    return () => {
      clearActivity();
    };
  }, [loadActivity, clearActivity, match.params.id, initialFormState]);

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    city: "",
    venue: "",
    date: "",
  });

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //console.log(event.currentTarget);
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(activity).then(() =>
        history.push(`/activities/edit/${activity.id}`)
      );
    }
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Title</label>
          <input
            placeholder="Title"
            name="title"
            onChange={handleInputChange}
            value={activity.title}
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <TextArea
            placeholder="Description"
            name="description"
            onChange={handleInputChange}
            value={activity.description}
          />
        </Form.Field>
        <Form.Field>
          <label>Date</label>
          <Input
            placeholder="Date"
            type="datetime-local"
            name="date"
            onChange={handleInputChange}
            value={activity.date}
          />
        </Form.Field>
        <Form.Field>
          <label>City</label>
          <Input
            placeholder="City"
            name="city"
            onChange={handleInputChange}
            value={activity.city}
          />
        </Form.Field>
        <Form.Field>
          <label>Venue</label>
          <Input
            placeholder="Venue"
            name="venue"
            onChange={handleInputChange}
            value={activity.venue}
          />
        </Form.Field>
        <Form.Field>
          <label>Category</label>
          <Input
            placeholder="Category"
            name="category"
            onChange={handleInputChange}
            value={activity.category}
          />
        </Form.Field>
        <Button
          floated="right"
          positive
          content="Submit"
          type="submit"
          loading={submitting}
        ></Button>
        <Button
          onClick={() => history.push("/activities")}
          content="Cancel"
          floated="right"
          type="Button"
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
