import express from "express";
import {
  getProblems,
  createNewProblem,
  changeProblemStatus,
  deleteProblem,
  updateProblem,
  getMyProblems,
} from "../controllers/problem.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { toggleVote } from "../controllers/vote.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// 전체 문제 목록
router.get("/", getProblems);
// 신규 신고글
router.post("/", verifyToken, upload.single("image"), createNewProblem);
// 상태 변경(관리자)
router.patch("/:id/status", verifyToken, changeProblemStatus);
// 공감 토글
router.post("/:id/vote", verifyToken, toggleVote);
// 삭제
router.delete("/:id", verifyToken, deleteProblem);
// 수정
router.patch("/:id", verifyToken, upload.single("image"), updateProblem);
// 내 신고글 목록
router.get("/my", verifyToken, getMyProblems);

export default router;
