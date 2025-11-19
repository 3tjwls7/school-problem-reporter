import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

// 단독 이미지 업로드용 엔드포인트
router.post("/", upload.single("image"), uploadImage);

export default router;
