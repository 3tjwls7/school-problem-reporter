import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const db = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "123456",
  database: process.env.DB_NAME || "school_report",
  connectionLimit: 10, // 동시에 최대 연결 수
  queueLimit: 0,
});

console.log("✅ MySQL connected successfully!");

export default db;
