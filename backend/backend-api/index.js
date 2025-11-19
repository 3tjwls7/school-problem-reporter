import express from "express";
import cors from "cors";
import problemRoutes from "./src/routes/problem.route.js";
import commentRoutes from "./src/routes/comment.route.js";
import uploadRoutes from "./src/routes/upload.route.js";
import path from "path";

const app = express();

// CORS 허용
app.use(cors());
// json 파싱
app.use(express.json());
// 이미지 정적 경로 제공
// file-storage 폴더에 저장된 파일을 /uploads 경로로 접근 가능
app.use("/uploads", express.static(path.resolve("file-storage")));

// 라우터 연결
app.use("/problems", problemRoutes);
app.use("/problems", commentRoutes);
app.use("/uploads", uploadRoutes);

// 서버 시작
const PORT = process.env.API_PORT || 4002;
app.listen(PORT, () => console.log(`✅ API server running on port ${PORT}`));
