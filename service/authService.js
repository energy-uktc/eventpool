import * as SecureStore from 'expo-secure-store';

export const LOGOUT = "LOGOUT";
const USER_AUTH_DATA = "USER_AUTH_DATA"

const getUserData = async () => {
  let result = await SecureStore.getItemAsync(USER_AUTH_DATA);
  if (!result) {
    throw new Error("User information not found");
  }

  const userData = JSON.parse(result);
  if (!userData) {
    throw new Error("User information not found");
  }
  return userData;
}

const isTokenAboutToExpired = (token) => {
  if (new Date() >= new Date(expirationDate)) {
    return true;
  }
  return false;
};