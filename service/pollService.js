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

export const deletePoll = async (eventId, pollId) => {
  const response = await axios.delete(`${POLLS_URL(eventId)}/${pollId}`);
  return response;
};

export const vote = async (eventId, pollId, optionId) => {
  const response = await axios.post(`${POLLS_URL(eventId)}/${pollId}/options/${optionId}/vote`);
  return response;
};

export const removeVote = async (eventId, pollId, optionId) => {
  const response = await axios.delete(`${POLLS_URL(eventId)}/${pollId}/options/${optionId}/vote`);
  return response;
};
