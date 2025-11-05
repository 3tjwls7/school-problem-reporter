import api from "./axiosAPI";

export const getCommentsAPI = async (problemId: number) => {
  const res = await api.get(`/problems/${problemId}/comments`);
  return res.data; // [{ id, author, content, createdAt, ... }]
};

export const createCommentAPI = async (problemId: number, content: string) => {
  const res = await api.post(`/problems/${problemId}/comments`, { content });
  return res.data; // 새 댓글 객체
};

export const deleteCommentAPI = async (problemId: number, commentId: number) => {
  const res = await api.delete(`/problems/${problemId}/comments/${commentId}`);
  return res.data; // { success: true }
};
