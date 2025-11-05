import {
  getCommentsByProblemId,
  addComment,
  deleteComment,
} from "../repositories/comment.repository.js";

export const fetchCommentsService = async (problemId) => {
  return await getCommentsByProblemId(problemId);
};

export const createCommentService = async (problemId, authorId, content) => {
  if (!content || content.trim() === "") {
    throw new Error("댓글 내용을 입력해주세요.");
  }

  await addComment(problemId, authorId, content);
  return { message: "댓글이 작성되었습니다!" };
};

export const deleteCommentService = async (commentId, authorId, role) => {
  const isAdmin = role === "admin";
  await deleteComment(commentId, authorId, isAdmin ? null : authorId);
  return { message: "댓글이 삭제되었습니다!" };
};
