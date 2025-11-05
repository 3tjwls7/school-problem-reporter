import {
  getAllProblems,
  createProblem,
  updateProblemStatus,
} from "../repositories/problem.repository.js";

export const getProblemsService = async () => {
  return await getAllProblems();
};

export const createProblemService = async ({
  title,
  description,
  location,
  imageUrl,
  authorId,
}) => {
  if (!title || !description) {
    throw new Error("제목과 내용을 모두 입력해주세요.");
  }

  await createProblem({ title, description, location, imageUrl, authorId });
  return { message: "문제가 등록되었습니다!" };
};

export const changeProblemStatusService = async (id, status, userRole) => {
  if (userRole !== "admin") {
    throw new Error("관리자만 상태를 변경할 수 있습니다.");
  }

  await updateProblemStatus(id, status);
  return { message: "문제 상태가 변경되었습니다." };
};
