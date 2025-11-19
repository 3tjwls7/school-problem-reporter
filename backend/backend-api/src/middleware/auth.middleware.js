import axios from "axios";
import redis from "../../redis.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "토큰이 없습니다." });

  const token = authHeader.split(" ")[1];

  try {
    // 1) auth 서버로 토큰 검증
    const response = await axios.get("http://backend-auth:4001/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = response.data.user; // { id, username, email, role }

    // 2) Redis 세션 있는지 확인
    const session = await redis.get(`session:${user.id}`);

    if (session) {
      req.user = JSON.parse(session);
      return next();
    }

    // 3) 없으면 세션 저장 (2시간)
    await redis.set(
      `session:${user.id}`,
      JSON.stringify(user),
      "EX",
      3600 * 2
    );

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "유효하지 않은 토큰입니다.",
    });
  }
};
