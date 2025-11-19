import dayjs from "dayjs";
import db from "../../db.js";
import {
  getAllProblems,
  createProblem,
  updateProblemStatus,
  deleteProblem,
  updateProblem,
  getMyProblemsRepo
} from "../repositories/problem.repository.js";


/**
 * 전체 문제 조회 서비스
 * - 7일 이상 미해결이면 isOverdue = true
 * - 로그인 시 자신의 투표 여부 hasVoted 포함
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

  // 로그인 X → 투표 여부 false
  if (!userId) {
    return problemsWithFlags.map((p) => ({ ...p, hasVoted: false }));
  }

  // 로그인 O → DB에서 본인 투표 내역 조회
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

// 문제 등록 (입력 검증 + repository 호출)
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

// 관리자만 상태 변경 가능 
export const changeProblemStatusService = async (id, status, userRole) => {
  if (userRole !== "admin") {
    throw new Error("관리자만 상태를 변경할 수 있습니다.");
  }

  await updateProblemStatus(id, status);
  return { status, message: "문제 상태가 변경되었습니다." };
};

// 문제 삭제
export const deleteProblemService = async (id, userId, userRole) => {
  await deleteProblem(id, userId, userRole);
  return { message: "문제가 삭제되었습니다." };
};

// 문제 수정
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

export const getMyProblemsService = async (userId) => {
  return await getMyProblemsRepo(userId);
};