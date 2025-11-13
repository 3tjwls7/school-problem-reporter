import db from "../../db.js";

// 유저 조회
export const findUserByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// 유저 생성
export const createUser = async (username, email, hashedPassword, role = "user") => {
  await db.execute(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, role]
  );
};

