import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/api'
import axios from 'axios'

export const LOGOUT = "LOGOUT";
const USER_AUTH_DATA = "USER_AUTH_DATA"
const AUTH_URL = API_URL + "/auth"

export const getUserData = async () => {
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

export const isTokenAboutToExpire = async () => {
  const authData = await getUserData();
  if (new Date() >= new Date(authData.expirationTime * 1000 - 5000)) {
    return true;
  }
  return false;
};

export const register = async userData => {
  const response = await axios.post(AUTH_URL + "/register", {
    userName: userData.name,
    email: userData.email,
    password: userData.password
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const resendVerificationEmail = async userData => {
  const response = await axios.post(AUTH_URL + "/resendVerificationCode", {
    email: userData.email,
    password: userData.password
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const login = async userData => {
  const response = await axios.post(AUTH_URL + "/token", {
    email: userData.email,
    password: userData.password
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const authData = {
    email: userData.email,
    token: response.data.token,
    jti: response.data.jti,
    expirationTime: response.data.expiration_time,
    scopes: response.data.scope,
    refreshToken: response.data.refresh_token
  }
  await SecureStore.setItemAsync(USER_AUTH_DATA, JSON.stringify(authData))
  return authData;
}

export const refreshToken = async () => {
  try {
    const authData = await getUserData();
    const response = await axios.post(AUTH_URL + "/refreshToken", {
      token: authData.token,
      refresh_token: authData.refreshToken
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const updatedAuthData = {
      email: authData.email,
      token: response.data.token,
      jti: response.data.jti,
      expirationTime: response.data.expiration_time,
      scopes: response.data.scope,
      refreshToken: response.data.refresh_token
    }
    await SecureStore.setItemAsync(USER_AUTH_DATA, JSON.stringify(updatedAuthData))
    return updatedAuthData;
  } catch (err) {
    throw new Error(`Failed to refresh the token. ${err}`)
  }
}

export const getAuthToken = async () => {
  const { token } = await getUserData()
  return token
}