// src/api/axiosAPI.ts
import axios from "axios";

const axiosAPI = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

axiosAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosAPI;
