import { API_URL } from "../constants/api";
import axios from "axios";

const EVENTS_URL = API_URL + "/api/v1/events";

export const getEvents = async () => {
  const response = await axios.get(EVENTS_URL);
  return response.data;
};

export const getActiveEvents = async () => {
  const response = await axios.get(EVENTS_URL + "?active=true");
  return response.data;
};

export const getEvent = async (eventId) => {
  const response = await axios.get(`${EVENTS_URL}/${eventId}`);
  return response.data;
};

export const updateEvent = async (event) => {
  let updateEvent = {
    title: event.title,
    description: event.description,
    startDate: event.startDate,
  };
  if (event.endDate) {
    updateEvent.endDate = event.endDate;
  }
  if (event.location) {
    updateEvent.location = event.location;
  }
  const response = await axios.put(`${EVENTS_URL}/${event.id}`, updateEvent, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const createEvent = async (event) => {
  let createEvent = {
    title: event.title,
    description: event.description,
    startDate: event.startDate,
  };
  if (event.endDate) {
    createEvent.endDate = event.endDate;
  }

  const response = await axios.post(EVENTS_URL, createEvent, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
