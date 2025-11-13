// src/api/auth.ts
import axiosAuth from "./axiosAuth";

// 회원가입
export const signupAPI = async (
  username: string,
  email: string,
  password: string,
  isAdmin: boolean
) => {
  const role = isAdmin ? "admin" : "user";
  const res = await axiosAuth.post("/auth/signup", {
    username,
    email,
    password,
    role,
  });
  return res.data;
};

// 로그인
export const loginAPI = async (emailOrUsername: string, password: string) => {
  const res = await axiosAuth.post("/auth/login", {
    email: emailOrUsername,
    password,
  });

  const token = res.data.accessToken;
  localStorage.setItem("token", token);

  return res.data;
};
