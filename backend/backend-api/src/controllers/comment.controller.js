import { getCommentsByProblemId, addComment, deleteComment } from "../repositories/comment.repository.js";

export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await getCommentsByProblemId(id);
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

    await addComment(id, authorId, content);
    res.status(201).json({ message: "댓글이 작성되었습니다!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeComment = async (req, res) => {
  try {
    const { id, cid } = req.params;
    const authorId = req.user.id;
    const role = req.user.role;

    await deleteComment(cid, authorId, role);
    res.json({ message: "댓글이 삭제되었습니다!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
