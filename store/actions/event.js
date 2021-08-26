import * as eventService from "../../service/eventService";

export const GET_EVENTS = "GET_EVENTS";
export const GET_ACTIVE_EVENTS = "GET_ACTIVE_EVENTS";
export const GET_CURRENT_EVENT = "GET_CURRENT_EVENT";
export const UPDATE_EVENT = "UPDATE_EVENT";

export const getEvents = () => {
  return async (dispatch) => {
    const events = await eventService.getEvents();
    const eventsObj = events.reduce((obj, event) => {
      obj[event.id] = event;
      return obj;
    }, {});
    dispatch({
      type: GET_EVENTS,
      events: eventsObj,
    });
  };
};

export const getActiveEvents = () => {
  return async (dispatch) => {
    const events = await eventService.getActiveEvents();
    const eventsObj = events.reduce((obj, event) => {
      obj[event.id] = event;
      return obj;
    }, {});
    dispatch({
      type: GET_ACTIVE_EVENTS,
      events: eventsObj,
    });
  };
};

export const getCurrentEvent = (eventId) => {
  return async (dispatch) => {
    const event = await eventService.getEvent(eventId);
    dispatch({
      type: GET_CURRENT_EVENT,
      event: event,
    });
  };
};

export const updateEvent = (eventToUpdate) => {
  return async (dispatch) => {
    const event = await eventService.updateEvent(eventToUpdate);
    dispatch({
      type: UPDATE_EVENT,
      event: event,
    });
  };
};
