import { verifyJWT } from "../../../backend-auth/src/utils/jwt.js";


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyJWT(token);

  if (!decoded) {
    return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
  }

  req.user = decoded; // id, username, role 등
  next();
};
