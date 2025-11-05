import {
  fetchCommentsService,
  createCommentService,
  deleteCommentService,
} from "../services/comment.service.js";

export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await fetchCommentsService(id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    const result = await createCommentService(id, authorId, content);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeComment = async (req, res) => {
  try {
    const { cid } = req.params;        // 댓글 ID
    const { id: authorId, role } = req.user; // 로그인한 사용자

    const result = await deleteCommentService(cid, authorId, role);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
