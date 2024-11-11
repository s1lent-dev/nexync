"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from "react";
import { axiosReducer, initialState } from "./axiosReducers";
import type { StateType, ActionType } from "./axiosReducers";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const MAX_RETRY_COUNT = 3;

const retryAttempts = new Map<string, number>();

const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("/auth/refresh-token", {
      withCredentials: true,
    });
    return response.data.accessToken;
  } catch (error) {
    console.error("Refresh token failed", error);
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${config.headers.Authorization}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (!originalRequest._retry && retryAttempts.get(originalRequest.url) === undefined) {
        const retryCount = retryAttempts.get(originalRequest.url) || 0;
        if (retryCount < MAX_RETRY_COUNT) {
          originalRequest._retry = true;
          retryAttempts.set(originalRequest.url, retryCount + 1);
          try {
            const newAccessToken = await refreshToken();
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            retryAttempts.delete(originalRequest.url);
            return Promise.reject(refreshError);
          }
        } else {
          retryAttempts.delete(originalRequest.url);
        }
      }
    }
    return Promise.reject(error);
  }
);

const AxiosContext = createContext<
  | {
    axios: typeof axiosInstance;
    state: StateType;
    dispatch: React.Dispatch<ActionType>;
  }
  | undefined
>(undefined);

const AxiosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(axiosReducer, initialState);

  return (
    <AxiosContext.Provider value={{ axios: axiosInstance, state, dispatch }}>
      {children}
    </AxiosContext.Provider>
  );
};

const useAxios = () => {
  const context = useContext(AxiosContext);
  if (context === undefined) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};

export { AxiosProvider, useAxios };
