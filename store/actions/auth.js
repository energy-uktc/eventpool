import * as authService from "../../service/authService";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const RESTORE_TOKEN = "RESTORE_TOKEN";
export const GET_AUTH_DATA = "GET_AUTH_DATA";

const storeAuthentication = (authData) => {
    return {
        type: AUTHENTICATE,
        scopes: authData.scopes,
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

export const logout = () => {
    return async (dispatch) => {
        await authService.logout();
        dispatch({
            type: LOGOUT,
        });
    };
};

export const getAuthData = () => {
    return async (dispatch) => {
        let authData = {};
        try {
            authData = await authService.getUserData();
            if (await authService.isTokenAboutToExpire()) {
                authData = await authService.refreshToken();
            }
        } catch (err) {
            authData = {
                scopes: "",
                token: "",
            };
        }
        dispatch({
            type: GET_AUTH_DATA,
            scopes: authData.scopes,
            authenticated: !!authData.token && !!authData.scopes,
        });
    };
};
