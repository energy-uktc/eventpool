import * as SecureStore from "expo-secure-store";
import { API_URL } from "../constants/api";
import axios from "axios";

const USER_URL = API_URL + "/api/v1/user";

export const getUser = async () => {
    const response = await axios.get(USER_URL);
    return {
        email: response.data.email,
        name: response.data.userNamed,
    };
};
