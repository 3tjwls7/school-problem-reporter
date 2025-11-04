import { signupService, loginService } from "../services/auth.service.js";
import { verifyJWT } from "../utils/jwt.js";

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
    res.json(result); // { message, token, user }
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// 토큰 검증
export const verify = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "토큰이 없습니다." });

  const token = authHeader.split(" ")[1];
  const decoded = verifyJWT(token);

  if (!decoded)
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });

  res.json({ message: "유효한 토큰입니다.", user: decoded });
};
