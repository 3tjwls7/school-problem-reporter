import db from "../../../db.js";

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

export const addComment = async (problemId, authorId, content) => {
  await db.execute(
    "INSERT INTO comments (problemId, authorId, content) VALUES (?, ?, ?)",
    [problemId, authorId, content]
  );
};

export const deleteComment = async (commentId, authorId, isAdmin) => {
  if (isAdmin) {
    await db.execute("DELETE FROM comments WHERE id = ?", [commentId]);
  } else {
    await db.execute("DELETE FROM comments WHERE id = ? AND authorId = ?", [
      commentId,
      authorId,
    ]);
  }
};
