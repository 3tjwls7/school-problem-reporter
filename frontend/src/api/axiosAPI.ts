import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL // 메인 API 서버
});

// JWT 자동 헤더 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
