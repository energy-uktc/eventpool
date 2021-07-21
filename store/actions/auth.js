import * as authService from '../../service/authService';

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = authService.LOGOUT;
export const REGISTER = "REGISTER";
export const RESTORE_TOKEN = 'RESTORE_TOKEN';
export const GET_AUTH_DATA = 'GET_AUTH_DATA';

const storeAuthentication = (authData) => {
  return {
    type: AUTHENTICATE,
    email: authData.email,
    scopes: authData.scopes
  };
};

export const signup = (userData) => {
  return async (dispatch) => {
    const jti = await authService.signUp(userData);
    dispatch(storeAuthentication(userId));
  };
};

export const login = (userData) => {
  return async (dispatch) => {
    const authData = await authService.login(userData);
    dispatch(storeAuthentication(authData));
  };
};

export const refreshToken = () => {
  return async (dispatch) => {
    const authData = await authService.refreshToken();
    dispatch(storeAuthentication(authData));
  };
};

export const logout = (userData) => {
  return async (dispatch) => {
    const jti = await authService.signUp(userData);
    dispatch(storeAuthentication(userId));
  };
};

export const getAuthData = () => {
  return async (dispatch) => {
    let authData = {}
    try {
      authData = await authService.getUserData()
      if (await authService.isTokenAboutToExpire()) {
        authData = await authService.refreshToken()
      }
    } catch (err) {
      authData = {
        email: "",
        scopes: ""
      }
    }
    dispatch({
      type: GET_AUTH_DATA,
      email: authData.email,
      scopes: authData.scopes,
      authenticated: !!authData.token && !!authData.email && !!authData.scopes
    })
  }
}