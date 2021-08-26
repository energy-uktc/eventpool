import { GET_EVENTS, GET_ACTIVE_EVENTS, GET_CURRENT_EVENT, UPDATE_EVENT } from "../actions/event";
const initialState = {
  events: [],
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
      return {
        ...state,
        currentEvent: action.event,
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
    default:
      return state;
  }
};
