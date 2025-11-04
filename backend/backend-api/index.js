// backend-api/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// ✅ 기본 테스트 라우트
app.get("/", (req, res) => {
  res.send("✅ backend-api 서버 실행 중 (문제 신고 / 댓글 API)");
});

// ✅ 예시: 문제 목록 불러오기
app.get("/issues", (req, res) => {
  const dummyIssues = [
    { id: 1, title: "교실 전등이 꺼져요", status: "대기중", votes: 12 },
    { id: 2, title: "체육관 바닥 미끄러움", status: "처리중", votes: 8 },
  ];
  res.json(dummyIssues);
});

app.listen(PORT, () => {
  console.log(`🚀 backend-api running on http://localhost:${PORT}`);
});
