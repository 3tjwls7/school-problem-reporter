import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" }); 
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};
