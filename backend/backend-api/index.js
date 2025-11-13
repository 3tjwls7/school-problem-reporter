import express from "express";
import cors from "cors";
import problemRoutes from "./src/routes/problem.route.js";
import commentRoutes from "./src/routes/comment.route.js";
import uploadRoutes from "./src/routes/upload.route.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("file-storage")));

app.use("/problems", problemRoutes);
app.use("/problems", commentRoutes);
app.use("/uploads", uploadRoutes);

const PORT = process.env.API_PORT || 4002;
app.listen(PORT, () => console.log(`✅ API server running on port ${PORT}`));
