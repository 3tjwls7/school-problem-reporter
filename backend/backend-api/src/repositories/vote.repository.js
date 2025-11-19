import db from "../../db.js";

// 사용자가 특정 문제에 공감했는지 확인
export const checkUserVoted = async (userId, problemId) => {
  const [rows] = await db.execute(
    "SELECT * FROM votes WHERE userId = ? AND problemId = ?",
    [userId, problemId]
  );
  return rows.length > 0;
};

// 공감 추가 + 문제 테이블 votes 카운트 증가
export const addVote = async (userId, problemId) => {
  await db.execute(
    "INSERT INTO votes (userId, problemId, createdAt) VALUES (?, ?, NOW())",
    [userId, problemId]
  );
  await db.execute("UPDATE problems SET votes = votes + 1 WHERE id = ?", [problemId]);
};

// 공감 취소 + votes 카운트 감소 (0 이하로 내려가지 않도록 보호)
export const removeVote = async (userId, problemId) => {
  await db.execute("DELETE FROM votes WHERE userId = ? AND problemId = ?", [
    userId,
    problemId,
  ]);
  await db.execute("UPDATE problems SET votes = GREATEST(votes - 1, 0) WHERE id = ?", [
    problemId,
  ]);
};

// 현재 문제의 최신 공감 수 가져오기
export const getVoteCount = async (problemId) => {
  const [rows] = await db.execute(
    "SELECT votes FROM problems WHERE id = ?",
    [problemId]
  );
  return rows.length > 0 ? rows[0].votes : 0;
};