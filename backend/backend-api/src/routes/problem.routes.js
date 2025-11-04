import express from "express";
import {
  getProblems,
  createNewProblem,
  changeProblemStatus,
} from "../controllers/problem.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getProblems);
router.post("/", verifyToken, createNewProblem); //  로그인 필요
router.patch("/:id/status", verifyToken, changeProblemStatus); //  관리자만

export default router;
