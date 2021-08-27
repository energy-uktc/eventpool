import { GET_CURRENT_ACTIVITY, UPDATE_ACTIVITY, CLEAR_CURRENT_ACTIVITY } from "../actions/activity";
const initialState = {
  currentActivity: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CURRENT_ACTIVITY:
      return {
        ...state,
        currentActivity: action.activity,
      };
    case CLEAR_CURRENT_ACTIVITY:
      return {
        ...state,
        currentActivity: {},
      };
    case UPDATE_ACTIVITY:
      return {
        ...state,
        currentActivity: action.activity,
      };
    default:
      return state;
  }
};
