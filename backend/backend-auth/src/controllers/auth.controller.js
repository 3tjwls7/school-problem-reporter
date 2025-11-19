import { signupService, loginService, logoutService } from "../services/auth.service.js";
import redis from "../../redis.js";
import { verifyToken } from "../utils/jwt.js";

// 회원가입
export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const result = await signupService(username, email, password, role);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 로그인
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginService(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// 토큰 검증
export const verify = async (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "토큰 없음" });

  let token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  // 블랙리스트 확인
  const blacklisted = await redis.get(`blacklist:${token}`);
  if (blacklisted) return res.status(401).json({ message: "로그아웃된 토큰" });

  // JWT 유효성 검사
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "유효하지 않은 토큰" });

  res.json({ message: "유효한 토큰", user: decoded });
};

// 로그아웃
export const logout = async (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(400).json({ message: "토큰 없음" });

  const token = header.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) return res.status(401).json({ message: "유효하지 않은 토큰" });

  const result = await logoutService(token, decoded.id);
  res.json(result);
};
