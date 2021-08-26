import moment from "moment";

export const formatDate = (date) => {
  return moment(date).calendar({
    sameDay: "[Today at] HH:mm",
    nextDay: "[Tomorrow at] HH:mm",
    nextWeek: "dddd [at] HH:mm",
    lastDay: "[Yesterday at] HH:mm ",
    lastWeek: "[Last] dddd [at] HH:mm",
    sameElse: "YYYY-MM-DD HH:mm",
  });
};

export const formatAttendeesText = (number) => {
  if (number > 1) {
    return `${number} people in this event`;
  }
  if (number <= 0) {
    return "No attendees";
  }

  return "1 person in this event";
};

export const formatActivitiesText = (number) => {
  if (number > 1) {
    return `${number} activities in this event`;
  }
  if (number <= 0) {
    return "No activities in this event";
  }

  return "1 activity in this event";
};
