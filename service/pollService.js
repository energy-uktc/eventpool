import { API_URL } from "../constants/api";
import axios from "axios";

const POLLS_URL = (eventId) => API_URL + `/api/v1/events/${eventId}/polls`;

export const createPoll = async (eventId, poll) => {
  const request = {
    type: poll.type,
    endTime: poll.endTime,
    question: poll.question,
    options: poll.options,
  };

  const response = await axios.post(POLLS_URL(eventId), request, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};
