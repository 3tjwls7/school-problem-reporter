import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../repositories/auth.repository.js";
import { generateToken } from "../utils/jwt.js";
import redis from "../../redis.js";

// 회원가입
export const signupService = async (username, email, password, role) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error("이미 가입된 이메일입니다.");

  const hashedPassword = await bcrypt.hash(password, 10);
  const finalRole = role === "admin" ? "admin" : "user";

  await createUser(username, email, hashedPassword, finalRole);

  return { message: "회원가입 성공" };
};

// 로그인
export const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  const accessToken = generateToken(payload);

  // 🔥 Redis에 사용자 정보 저장
  await redis.set(
    `session:${user.id}`,
    JSON.stringify(payload),
    "EX",
    3600 * 2      // 2시간
  );

  // 🔥 Redis에 access token 저장
  await redis.set(
    `access:${user.id}`,
    accessToken,
    "EX",
    3600 * 2      // 2시간
  );

  return {
    message: "로그인 성공",
    accessToken,
    user: payload,
  };
};

// 로그아웃 → Redis에서 둘 다 삭제 + 블랙리스트 처리
export const logoutService = async (token, userId) => {
  await redis.del(`session:${userId}`);
  await redis.del(`access:${userId}`);

  await redis.set(`blacklist:${token}`, "1", "EX", 60 * 60 * 2); // 2시간

  return { message: "로그아웃 완료" };
};
