import express from "express";
import { signup, login, verify, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verify);
router.post("/logout", logout);

export default router;
