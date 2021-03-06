import React, { Fragment, useContext, useEffect } from "react";
import { Segment, Header, Form, Button, Comment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import { Link } from "react-router-dom";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import { formatDistance } from "date-fns";

const ActivityDetailChat = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    addComment,
    stopConnection,
    activity,
    createHubConnection,
  } = rootStore.activityStore;

  useEffect(() => {
    createHubConnection(activity!.id);

    return () => stopConnection();
  }, [createHubConnection, stopConnection,activity]);

  return (
    <Fragment>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {activity &&
            activity.comments &&
            activity.comments.map((comment, index) =>  { 
              console.log(comment)
              return (<Comment key={comment.id}>
                <Comment.Avatar src={comment.image || "/assets/user.png"} />
                <Comment.Content>
                  <Comment.Author
                    as={Link}
                    to={`/profiles/${comment.username}`}
                  >
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistance(comment.createdAt, new Date())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                </Comment.Content>
              </Comment>)
          })}
          <FinalForm
            onSubmit={addComment}
            render={({ submitting, handleSubmit, pristine, form }) => (
              <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                <Field
                  name="body"
                  component={TextAreaInput}
                  rows={2}
                  placeholder="Add your comment"
                ></Field>
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  loading={submitting}
                />
              </Form>
            )}
          ></FinalForm>
        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailChat);
