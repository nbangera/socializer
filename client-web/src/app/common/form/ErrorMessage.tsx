import React from "react";
import { Message } from "semantic-ui-react";
import { AxiosResponse } from "axios";

interface IProps {
  error: AxiosResponse;
  text?: string;
}

export const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  return (
    <Message error>
      {error.data && Object.keys(error.data.errors).length > 0 && (
        <Message.List>
          {Object.values(error.data.errors)
            .flat()
            .map((err, i) => (
              <Message.Item key={i}>{err}</Message.Item>
            ))}
        </Message.List>
      )}
      {text && <Message.Content content={text} />}
    </Message>
  );
};
