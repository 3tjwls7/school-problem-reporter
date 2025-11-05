import {
  getAllProblems,
  createProblem,
  updateProblemStatus,
} from "../repositories/problem.repository.js";
import db from "../../../db.js";

export const getProblemsService = async (userId = null) => {
  const problems = await getAllProblems();

  if (!userId) {
    return problems.map((p) => ({ ...p, hasVoted: false }));
  }

  const [votedRows] = await db.execute(
    "SELECT problemId FROM votes WHERE userId = ?",
    [userId]
  );
  const votedIds = votedRows.map((v) => v.problemId);

  return problems.map((p) => ({
    ...p,
    hasVoted: votedIds.includes(p.id),
  }));
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
  return { status, message: "문제 상태가 변경되었습니다." }; 
};