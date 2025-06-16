import axiosInstance from "./axios";
import { StorageKeys } from "../utils/constants.js";

const authService = {
  register: async (userdata) => {
    const response = await axiosInstance.post("/auth/register", userdata);
    return response.data;
  },
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);

    if (response.data?.data?.accessToken) {
      localStorage.setItem(
        StorageKeys.ACCESS_TOKEN,
        response.data.data.accessToken
      );
    }
    if (response.data?.data?.refreshToken) {
      localStorage.setItem(
        StorageKeys.REFRESH_TOKEN,
        response.data.data.accessToken
      );
    }

    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.get("/auth/logout", userdata);
    localStorage.removeItem(StorageKeys.ACCESS_TOKEN);
    localStorage.removeItem(StorageKeys.REFRESH_TOKEN);
    return response.data;
  },
  getCurrentUser: async (userdata) => {
    const response = await axiosInstance.post("/auth/current-user", userdata);
    return response.data;
  },
};

export default authService;
