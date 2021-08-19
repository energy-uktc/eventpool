import { GET_USER } from "../actions/user";

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
        default:
            return state;
    }
};
