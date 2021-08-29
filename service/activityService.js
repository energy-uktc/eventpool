import { API_URL } from "../constants/api";
import axios from "axios";

const ACTIVITIES_URL = (eventId) => API_URL + `/api/v1/events/${eventId}/activities`;

export const getActivities = async (eventId) => {
  const response = await axios.get(ACTIVITIES_URL(eventId));
  return response.data;
};

export const getActivity = async (eventId, activityId) => {
  const response = await axios.get(`${ACTIVITIES_URL(eventId)}/${activityId}`);
  return response.data;
};

export const updateActivity = async (eventId, activity) => {
  let updateActivity = {
    title: activity.title,
    description: activity.description,
    dateTime: activity.dateTime,
  };

  if (activity.location) {
    updateActivity.location = activity.location;
  }
  const response = await axios.put(`${ACTIVITIES_URL(eventId)}/${activity.id}`, updateActivity, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const deleteActivity = async (eventId, activityId) => {
  await axios.delete(`${ACTIVITIES_URL(eventId)}/${activityId}`);
};

export const createActivity = async (eventId, activity) => {
  let newActivity = {
    title: activity.title,
    description: activity.description,
    dateTime: activity.dateTime,
  };

  if (activity.location) {
    newActivity.location = activity.location;
  }
  console.log(newActivity);
  const response = await axios.post(ACTIVITIES_URL(eventId), newActivity, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
