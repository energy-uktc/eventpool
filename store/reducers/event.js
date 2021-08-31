import { GET_EVENTS, GET_ACTIVE_EVENTS, GET_CURRENT_EVENT, UPDATE_EVENT, CLEAR_CURRENT, CREATE_EVENT } from "../actions/event";
import { LOGOUT } from "../actions/auth";
const initialState = {
  events: {},
  currentEvent: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        events: action.events,
      };
    case GET_ACTIVE_EVENTS:
      return {
        ...state,
        events: {
          ...state.events,
          ...action.events,
        },
      };
    case GET_CURRENT_EVENT:
      let events = state.events;
      if (events[action.event.id]) {
        events = {
          ...state.events,
          [action.event.id]: action.event,
        };
      }
      return {
        ...state,
        events: events,
        currentEvent: action.event,
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        currentEvent: {},
      };
    case UPDATE_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          [action.event.id]: action.event,
        },
        currentEvent: action.event,
      };
    case CREATE_EVENT: {
      return {
        ...state,
        events: {
          ...state.events,
          [action.event.id]: action.event,
        },
      };
    }
    case LOGOUT: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
