import * as activityService from "../../service/activityService";

export const GET_CURRENT_ACTIVITY = "GET_CURRENT_ACTIVITY";
export const UPDATE_ACTIVITY = "UPDATE_ACTIVITY";
export const CLEAR_CURRENT_ACTIVITY = "CLEAR_CURRENT_ACTIVITY";

export const clearCurrentActivity = () => {
  return {
    type: CLEAR_CURRENT_ACTIVITY,
  };
};

export const getCurrentActivity = (eventId, activityId) => {
  return async (dispatch) => {
    const activity = await activityService.getActivity(eventId, activityId);
    dispatch({
      type: GET_CURRENT_ACTIVITY,
      activity: activity,
    });
  };
};

export const updateActivity = (eventId, activityToUpdate) => {
  return async (dispatch) => {
    const activity = await activityService.updateActivity(eventId, activityToUpdate);
    dispatch({
      type: UPDATE_ACTIVITY,
      activity: activity,
    });
  };
};
