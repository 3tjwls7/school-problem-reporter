import express from "express";
import {
  getProblems,
  createNewProblem,
  changeProblemStatus,
  deleteProblem,
  updateProblem
} from "../controllers/problem.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { toggleVote } from "../controllers/vote.controller.js";
import { upload } from "../middleware/upload.middleware.js"; 
import { getMyProblems } from "../controllers/problem.controller.js";


const router = express.Router();

router.get("/", getProblems);
router.post("/", verifyToken, upload.single("image"), createNewProblem);//  로그인 필요
router.patch("/:id/status", verifyToken, changeProblemStatus); //  관리자만
router.post("/:id/vote", verifyToken, toggleVote);
router.delete("/:id", verifyToken, deleteProblem);
router.patch("/:id", verifyToken, upload.single("image"), updateProblem);
router.get("/my", verifyToken, getMyProblems);

export default router;
