import { AUTHENTICATE, LOGOUT, REGISTER } from "../actions/auth";

const initialState = {
  jti: "",
  email: "",
  scopes: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case REGISTER:
      return {
        email: action.email,
      };
    case AUTHENTICATE:
      return {
        jti: action.jti,
        email: action.email,
        scopes: action.scopes
      };
    default:
      return state;
  }
};
