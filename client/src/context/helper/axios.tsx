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
import Cookies from "js-cookie";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Function to get the access token from cookies
const getAccessToken = () => {
  return Cookies.get("accessToken");
};

// Axios interceptor to add authorization headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to refresh the access token
const refreshToken = async () => {
  try {
    await axiosInstance.post("/auth/refresh-token", {
      withCredentials: true,
    });
    return Cookies.get("accessToken");
  } catch (error) {
    console.error("Refresh token failed", error);
    throw error;
  }
};

// Axios interceptor to handle 401 errors and refresh tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Create context
const AxiosContext = createContext<
  | {
      axios: typeof axiosInstance;
      state: StateType;
      dispatch: React.Dispatch<ActionType>;
    }
  | undefined
>(undefined);

// AxiosProvider component
const AxiosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(axiosReducer, initialState);

  return (
    <AxiosContext.Provider value={{ axios: axiosInstance, state, dispatch }}>
      {children}
    </AxiosContext.Provider>
  );
};

// Custom hook to use AxiosContext
const useAxios = () => {
  const context = useContext(AxiosContext);
  if (context === undefined) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};

export { AxiosProvider, useAxios };
