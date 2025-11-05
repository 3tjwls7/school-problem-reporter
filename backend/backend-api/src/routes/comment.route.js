import express from "express";
import {
  getComments,
  createComment,
  removeComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id/comments", getComments);
router.post("/:id/comments", verifyToken, createComment);
router.delete("/:id/comments/:cid", verifyToken, removeComment);

export default router;
