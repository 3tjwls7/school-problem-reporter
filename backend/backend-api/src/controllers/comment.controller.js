import {
  fetchCommentsService,
  createCommentService,
  deleteCommentService,
} from "../services/comment.service.js";

// 특정 문제의 댓글 목록 조회
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;    // 문제 ID
    const comments = await fetchCommentsService(id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 댓글 작성 (로그인 필요)
export const createComment = async (req, res) => {
  try {
    const { id } = req.params;    // 문제 ID
    const { content } = req.body;
    const authorId = req.user.id;

    const result = await createCommentService(id, authorId, content);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 댓글 삭제 (본인 또는 관리자)
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
