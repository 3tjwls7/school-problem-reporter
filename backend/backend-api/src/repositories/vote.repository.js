import db from "../../../db.js";

// 사용자가 이미 공감했는지 확인
export const checkUserVoted = async (userId, problemId) => {
  const [rows] = await db.execute(
    "SELECT * FROM votes WHERE userId = ? AND problemId = ?",
    [userId, problemId]
  );
  return rows.length > 0;
};

// 공감 추가
export const addVote = async (userId, problemId) => {
  await db.execute(
    "INSERT INTO votes (userId, problemId, createdAt) VALUES (?, ?, NOW())",
    [userId, problemId]
  );
  await db.execute("UPDATE problems SET votes = votes + 1 WHERE id = ?", [problemId]);
};

// 공감 취소
export const removeVote = async (userId, problemId) => {
  await db.execute("DELETE FROM votes WHERE userId = ? AND problemId = ?", [
    userId,
    problemId,
  ]);
  await db.execute("UPDATE problems SET votes = GREATEST(votes - 1, 0) WHERE id = ?", [
    problemId,
  ]);
};
