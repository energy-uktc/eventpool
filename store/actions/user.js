import * as userService from "../../service/userService";

export const GET_USER = "GET_USER";

export const getUser = () => {
    return async (dispatch) => {
        const user = await userService.getUser();
        dispatch({
            type: GET_USER,
            user: user,
        });
    };
};