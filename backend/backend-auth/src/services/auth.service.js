import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../repositories/auth.repository.js";
import { generateToken } from "../utils/jwt.js";

// 회원가입 로직
export const signupService = async (username, email, password, role) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("이미 가입된 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 기본값은 'user', 하지만 요청에 'admin'이 들어오면 허용
  const finalRole = role === "admin" ? "admin" : "user";

  await createUser(username, email, hashedPassword, finalRole);

  return { message: `${finalRole} 회원가입이 완료되었습니다!` };
};


// 로그인 로직
export const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");
  }

  const token = generateToken({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  });

  return {
    message: "로그인 성공",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};
