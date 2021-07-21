import { AUTHENTICATE, GET_AUTH_DATA, LOGOUT, REGISTER, RESTORE_TOKEN } from "../actions/auth";

const initialState = {
  loading: true,
  authenticated: "",
  email: "",
  scopes: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case REGISTER:
      return {
        ...state,
        email: action.email,
      };
    case RESTORE_TOKEN:
      return {
        ...state,
        scopes: action.scopes
      };
    case AUTHENTICATE:
      return {
        ...state,
        authenticated: true,
        email: action.email,
        scopes: action.scopes
      };
    case GET_AUTH_DATA:
      return {
        ...state,
        email: action.email,
        scopes: action.scopes,
        loading: false,
        authenticated: action.authenticated
      }
    default:
      return state;
  }
};
