import api from "./axiosAPI"; 

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

// 문제 수정
export const updateProblemAPI = async (
  id: number,
  data: FormData | { title: string; description: string; location: string; image?: File | null }
) => {
  const headers =
    data instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

  const res = await api.patch(`/problems/${id}`, data, { headers });
  return res.data;
};

// 문제 삭제
export const deleteProblemAPI = async (id: number) => {
  const res = await api.delete(`/problems/${id}`);
  return res.data;
};

export const getMyProblemsAPI = async () => {
  const res = await api.get("/problems/my");
  return res.data;
};
