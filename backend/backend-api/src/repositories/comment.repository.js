import db from "../../db.js";

// 특정 문제의 댓글 전체 조회
export const getCommentsByProblemId = async (problemId) => {
  const [rows] = await db.execute(
    `SELECT c.*, u.username 
     FROM comments c 
     JOIN users u ON c.authorId = u.id 
     WHERE c.problemId = ? 
     ORDER BY c.createdAt ASC`,
    [problemId]
  );
  return rows;
};

// 댓글 추가 후, 방금 추가된 댓글 데이터 다시 조회하여 반환
export const addComment = async (problemId, authorId, content) => {
  const [result] = await db.execute(
    "INSERT INTO comments (problemId, authorId, content) VALUES (?, ?, ?)",
    [problemId, authorId, content]
  );
  const [rows] = await db.execute(
    `SELECT c.*, u.username 
     FROM comments c 
     JOIN users u ON c.authorId = u.id 
     WHERE c.id = ?`,
    [result.insertId]
  );
  return rows[0];
};

// 댓글 삭제 (관리자는 누구든 삭제 가능 / 일반 사용자는 본인 댓글만) 
export const deleteComment = async (commentId, authorId, role) => {
  if (role === "admin") {
    // 관리자 → 모든 댓글 삭제 가능
    await db.execute("DELETE FROM comments WHERE id = ?", [commentId]);
  } else {
    // 일반 사용자 → 자기 댓글만 삭제 가능
    const [result] = await db.execute(
      "DELETE FROM comments WHERE id = ? AND authorId = ?",
      [commentId, authorId]
    );
    if (result.affectedRows === 0) {
      throw new Error("본인이 작성한 댓글만 삭제할 수 있습니다.");
    }
  }
};