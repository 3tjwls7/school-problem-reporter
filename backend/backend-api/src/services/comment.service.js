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

  const newComment = await addComment(problemId, authorId, content);
  return newComment;
};

export const deleteCommentService = async (commentId, authorId, role) => {
  await deleteComment(commentId, authorId, role);
  return { message: "댓글이 삭제되었습니다!" };
};
