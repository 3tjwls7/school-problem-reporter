import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import problemRoutes from "./src/routes/problem.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import path from "path";

dotenv.config({ path: "../.env" });
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.resolve("file-storage")));

app.use("/problems", problemRoutes);
app.use("/problems", commentRoutes);
app.use("/upload", uploadRoutes); // ✅ 추가

app.listen(process.env.API_PORT || 4002, () =>
  console.log(`✅ API server running on port ${process.env.API_PORT || 4002}`)
);
