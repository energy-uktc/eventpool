import * as authService from '../../service/authService';

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = authService.LOGOUT;
export const REGISTER = "REGISTER";

const storeAuthentication = (jti) => {
  return {
    type: AUTHENTICATE,
    userId: userId,
  };
};

export const signup = (userData) => {
  return async (dispatch) => {
    const jti = await authService.signUp(userData);
    dispatch(storeAuthentication(userId));
  };
};