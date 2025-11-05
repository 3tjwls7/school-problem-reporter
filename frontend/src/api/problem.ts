import api from "./axiosAPI"; // baseURL: http://localhost:4002

// 모든 문제 목록 조회
export const getProblemsAPI = async () => {
  const res = await api.get("/problems");
  return res.data;
};

// 문제 생성 (파일 업로드 포함)
export const createProblemAPI = async (formData: FormData) => {
  const res = await api.post("/problems", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 문제 상태 변경 (Admin 전용)
export const updateProblemStatusAPI = async (
  id: number,
  newStatus: "pending" | "in-progress" | "resolved"
) => {
  const res = await api.patch(`/problems/${id}/status`, { status: newStatus });
  return res.data;
};
