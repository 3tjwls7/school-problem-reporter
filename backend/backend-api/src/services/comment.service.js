import {
  getCommentsByProblemId,
  addComment,
  deleteComment,
} from "../repositories/comment.repository.js";

// 댓글 조회 서비스
export const fetchCommentsService = async (problemId) => {
  return await getCommentsByProblemId(problemId);
};

// 댓글 생성 서비스: 공백 검사 + DB 저장 
export const createCommentService = async (problemId, authorId, content) => {
  if (!content || content.trim() === "") {
    throw new Error("댓글 내용을 입력해주세요.");
  }

  const newComment = await addComment(problemId, authorId, content);
  return newComment;
};

// 댓글 삭제: 역할/작성자 검증 로직을 repository에게 위임
export const deleteCommentService = async (commentId, authorId, role) => {
  await deleteComment(commentId, authorId, role);
  return { message: "댓글이 삭제되었습니다!" };
};
