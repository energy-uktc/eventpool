import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import LoadingControl from "../components/UI/LoadingControl";
import * as authActions from "../store/actions/auth";
import axios from "axios";
import { API_URL } from "../constants/api";
import * as authService from "../service/authService";
import colors from "../constants/colors";

export default SplashScreen = (props) => {
  const dispatch = useDispatch();

  const handleAuthError = useCallback(
    (err) => {
      Alert.alert(`Authentication Error`, `${err.message} The App will logout`, [
        {
          text: "Ok",
          onPress: async () => {
            await dispatch(authActions.logout);
          },
        },
      ]);
    },
    [dispatch, authActions]
  );

  useEffect(() => {
    const setupAxios = async () => {
      axios.defaults.baseURL = API_URL;
      axios.interceptors.request.use(async (config) => {
        if (config.url.indexOf(`/auth/`) > 0) {
          return config;
        }
        let token = "";
        try {
          if (await authService.isTokenAboutToExpire()) {
            await dispatch(authActions.refreshToken());
          }
          token = await authService.getAuthToken();
        } catch (err) {
          console.log(err);
        }
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });

      axios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          const status = error.response && error.response.status;

          if (status === 401) {
            handleAuthError(error.response);
            return Promise.reject("");
          }
          if (status === 500) {
            console.error(error);
            return Promise.reject("Something went wrong");
          }
          if (status > 500) {
            console.error(error);
            props.onNoConnection(status);
            return Promise.reject("");
          }
          if (error.response && error.response.data && error.response.data.error) {
            return Promise.reject(error.response.data.error);
          }
          if (status > 401) {
            console.error(error);
            return Promise.reject("Something went wrong");
          }
          props.onNoConnection(error.message);
          return Promise.reject("");
        }
      );
    };
    setupAxios();
  }, [dispatch, authActions, handleAuthError]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch(await authActions.getAuthData());
      } catch (err) {
        console.log(err.message);
        handleAuthError(error.response);
      }
    };
    checkAuth();
  }, [handleAuthError, authActions, dispatch]);
  return (
    <View style={{ backgroundColor: colors.mint, flex: 1 }}>
      <LoadingControl />
    </View>
  );
};
