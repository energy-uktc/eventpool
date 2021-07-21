import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native"
import LoadingControl from "../components/UI/LoadingControl";
import * as authActions from "../store/actions/auth";
import axios from 'axios'
import { API_URL } from '../constants/api'
import * as authService from '../service/authService'
import Colors from '../constants/colors'

export default SplashScreen = (props) => {
  const authenticated = useSelector(state => state.auth.authenticated)
  const dispatch = useDispatch();

  const handleAuthError = useCallback(err => {
    Alert.alert(`Authentication Error`, `${err.message} The App will logout`, [
      {
        text: "Okay",
        onPress: async () => {
          dispatch(authActions.logout)
        },
      },
    ])
  }, [dispatch, authActions])

  useEffect(() => {
    const setupAxios = async () => {
      axios.defaults.baseURL = API_URL;
      axios.interceptors.request.use(async config => {
        if (config.url.indexOf(`/auth/`) > 0) {
          return config;
        }
        let token = ""
        try {
          if (await authService.isTokenAboutToExpire()) {
            await dispatch(authActions.refreshToken())
          }
          token = await authService.getAuthToken()
        } catch (err) {
          console.log(err)
        }
        config.headers.Authorization = `Bearer ${token}`
        return config;
      });

      axios.interceptors.response.use(response => {
        return response;
      }, error => {
        const status = error.response && error.response.status;
        if (status === 401) {
          handleAuthError(error.response);
        }
        if (status >= 500) {
          console.error(error);
          return Promise.reject("Something went wrong");
        }
        return Promise.reject(error.response.data.error)
      })
    }
    setupAxios();
  }, [dispatch, authActions, handleAuthError])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch(authActions.getAuthData());
      } catch (err) {
        console.log(err.message);
        handleAuthError(error.response);
      }
    };
    checkAuth();
  }, [handleAuthError, authActions, dispatch]);
  return (
    <View style={{ backgroundColor: Colors.mint, flex: 1 }}>
      <LoadingControl />
    </View>
  )
};
