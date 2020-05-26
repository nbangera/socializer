import { IActivity, IAttendee } from "../../models/Activity";
import { IUser } from "../../models/User";

export const combineDateAndTime = (date: Date, time: Date) => {
//   const timeString = time.getHours() + ":" + time.getMinutes() + ":00";

//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const day = date.getDate();
//   const dateString = `${year}-${month}-${day}`;
  //To Fix Safari time issue
  const dateString = date.toISOString().split('T')[0];
  const timeString = time.toISOString().split('T')[1];

  return new Date(dateString + "T" + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    (a) => a.userName === user.userName
  );
  activity.isHost = activity.attendees.some(
    (a) => a.isHost === true && a.userName === user.userName
  );
  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
  const attendee = {
    userName: user.userName,
    displayName: user.displayName,
    image: user.image!,
    isHost: false,
  };
  return attendee;
};
