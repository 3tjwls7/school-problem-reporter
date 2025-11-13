// backend-api/src/middleware/auth.middleware.js
import axios from "axios";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  try {
    // backend-auth 서버의 /auth/verify 엔드포인트로 요청
    const response = await axios.get("http://backend-auth:4001/auth/verify", {
      headers: { Authorization: authHeader },
    });

    req.user = response.data.user; // ✅ 유저 정보 저장
    next();
  } catch (error) {
    return res.status(403).json({
      message: error.response?.data?.message || "유효하지 않은 토큰입니다.",
    });
  }
};
