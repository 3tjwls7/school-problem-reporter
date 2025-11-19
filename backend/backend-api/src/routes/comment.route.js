import express from "express";
import {
  getComments,
  createComment,
  removeComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// 특정 문제 댓글 목록
router.get("/:id/comments", getComments);
// 댓글 작성 (로그인 필수)
router.post("/:id/comments", verifyToken, createComment);
// 댓글 삭제
router.delete("/:id/comments/:cid", verifyToken, removeComment);

export default router;
