import db from "../../db.js";

// 이메일로 사용자 조회
export const findUserByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// 신규 사용자 생성
export const createUser = async (username, email, password, role) => {
  await db.execute(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, password, role]
  );
};
