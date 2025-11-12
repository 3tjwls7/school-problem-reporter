import dayjs from "dayjs";
import db from "../../../db.js";
import {
  getAllProblems,
  createProblem,
  updateProblemStatus,
  deleteProblem,
  updateProblem,
} from "../repositories/problem.repository.js";

/**
 * 문제 목록 조회 서비스
 * - 로그인 여부에 따라 hasVoted 표시
 * - 7일 이상 경과 && 미해결 상태면 isOverdue = true
 */
export const getProblemsService = async (userId = null) => {
  const problems = await getAllProblems();
  const now = dayjs();

  // 오래된 미해결 문제 플래그 추가
  const problemsWithFlags = problems.map((p) => {
    const created = dayjs(p.createdAt);
    const isOverdue = p.status !== "resolved" && now.diff(created, "day") >= 7;
    return { ...p, isOverdue };
  });

  // 로그인 안 한 경우
  if (!userId) {
    return problemsWithFlags.map((p) => ({ ...p, hasVoted: false }));
  }

  // 로그인한 경우 → 투표 여부 표시
  const [votedRows] = await db.execute(
    "SELECT problemId FROM votes WHERE userId = ?",
    [userId]
  );
  const votedIds = votedRows.map((v) => v.problemId);

  return problemsWithFlags.map((p) => ({
    ...p,
    hasVoted: votedIds.includes(p.id),
  }));
};

/**
 * 문제 등록
 */
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

/**
 * 문제 상태 변경 (관리자 전용)
 */
export const changeProblemStatusService = async (id, status, userRole) => {
  if (userRole !== "admin") {
    throw new Error("관리자만 상태를 변경할 수 있습니다.");
  }

  await updateProblemStatus(id, status);
  return { status, message: "문제 상태가 변경되었습니다." };
};

/**
 * 문제 삭제
 */
export const deleteProblemService = async (id, userId, userRole) => {
  await deleteProblem(id, userId, userRole);
  return { message: "문제가 삭제되었습니다." };
};

/**
 * 문제 수정
 */
export const updateProblemService = async (
  id,
  title,
  description,
  location,
  imageUrl,
  userId,
  userRole
) => {
  if (!title || !description) {
    throw new Error("제목과 내용을 모두 입력해주세요.");
  }

  await updateProblem(id, title, description, location, imageUrl, userId, userRole);

  // 수정된 문제 데이터를 다시 조회해서 반환
  const [rows] = await db.execute(
    `SELECT p.*, u.username 
     FROM problems p 
     JOIN users u ON p.authorId = u.id 
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
};
