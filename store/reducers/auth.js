import { AUTHENTICATE, GET_AUTH_DATA, LOGOUT, RESTORE_TOKEN } from "../actions/auth";

const initialState = {
  loading: true,
  authenticated: "",
  scopes: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case RESTORE_TOKEN:
      return {
        ...state,
        scopes: action.scopes
      };
    case AUTHENTICATE:
      return {
        ...state,
        authenticated: true,
        scopes: action.scopes
      };
    case GET_AUTH_DATA:
      return {
        ...state,
        scopes: action.scopes,
        loading: false,
        authenticated: action.authenticated
      }
    default:
      return state;
  }
};
