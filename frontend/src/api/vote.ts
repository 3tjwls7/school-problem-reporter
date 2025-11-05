import api from "./axiosAPI";

// 공감 토글 (좋아요 / 취소)
export const toggleVoteAPI = async (problemId: number) => {
  const res = await api.post(`/problems/${problemId}/vote`);
  return res.data; // { message: "...", voted: true/false }
};
