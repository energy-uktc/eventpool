import * as userService from "../../service/userService";

export const GET_USER = "GET_USER";
export const UPDATE_NAME = "UPDATE_NAME";

export const getUser = () => {
  return async (dispatch) => {
    const user = await userService.getUser();
    dispatch({
      type: GET_USER,
      user: user,
    });
  };
};

export const updateName = (name) => {
  return async (dispatch) => {
    const updatedName = await userService.updateName(name);
    dispatch({
      type: UPDATE_NAME,
      name: updatedName,
    });
  };
};
