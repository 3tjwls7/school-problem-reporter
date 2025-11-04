// backend-auth/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

// ✅ 기본 테스트용 라우트
app.get("/", (req, res) => {
  res.send("🔐 backend-auth 서버 실행 중 (회원가입 / 로그인 API)");
});

// ✅ 회원가입 예시
app.post("/register", (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "필수 입력값이 없습니다." });
  }

  // 실제로는 DB에 저장해야 함
  console.log("🆕 회원가입 요청:", { email, name });
  res.status(201).json({ message: "회원가입 성공!", user: { email, name } });
});

// ✅ 로그인 예시
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "test@test.com" && password === "1234") {
    return res.status(200).json({ message: "로그인 성공!", token: "FAKE_JWT_TOKEN" });
  } else {
    return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
  }
});

app.listen(PORT, () => {
  console.log(`🔐 backend-auth running on http://localhost:${PORT}`);
});
