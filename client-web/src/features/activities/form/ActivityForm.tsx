import React, { useState,FormEvent } from "react";
import { Segment, Form, Button, TextArea, Input } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { v4 as uuid } from "uuid";

interface IProps {
  activity: IActivity;
  setEditMode: (editMode: boolean) => void;
  handleActivityCreate: (activity: IActivity) => void;
  handleActivityEdit: (activity: IActivity) => void;
  submitting:boolean;
}

export const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initialiseFormState,
  handleActivityCreate,
  handleActivityEdit,
  submitting
}) => {
  const initializeCreateForm = () => {
    if (initialiseFormState) return initialiseFormState;
    else {
      return {
        id: "",
        title: "",
        category: "",
        description: "",
        city: "",
        venue: "",
        date: "",
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeCreateForm);

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
      handleActivityCreate(newActivity);
    } else {
      handleActivityEdit(activity);
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
          onClick={() => setEditMode(false)}
          content="Cancel"
          floated="right"
          type="Button"
          loading={submitting}
        />
      </Form>
    </Segment>
  );
};
