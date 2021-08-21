import { GET_USER, UPDATE_NAME } from "../actions/user";

const initialState = {
  email: "",
  name: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        email: action.user.email,
        name: action.user.name,
      };
    case UPDATE_NAME:
      return {
        ...state,
        name: action.name,
      };
    default:
      return state;
  }
};
