import api from "./axiosAuth";

// 회원가입 요청
export const signupAPI = async (
  username: string,
  email: string,
  password: string,
  isAdmin: boolean
) => {
  const role = isAdmin ? "admin" : "user";
  const res = await api.post("/auth/signup", {
    username,
    email,
    password,
    role,
  });
  return res.data;
};

// 로그인 요청
export const loginAPI = async (emailOrUsername: string, password: string) => {
  // 백엔드가 이메일 기반 로그인이라면 email로 보내면 됨
  const res = await api.post("/auth/login", {
    email: emailOrUsername,
    password,
  });
  return res.data;
};

