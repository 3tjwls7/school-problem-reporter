import express from "express";
import { signup, login, verify, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// 회원가입
router.post("/signup", signup);
// 로그인
router.post("/login", login);
// JWT 검증
router.get("/verify", verify);
// 로그아웃
router.post("/logout", logout);

export default router;
