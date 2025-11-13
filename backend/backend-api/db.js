import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: process.env.DB_HOST || "school-mysql",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "123456",
  database: process.env.DB_NAME || "school_report",
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("✅ MySQL connected successfully!");

export default db;
