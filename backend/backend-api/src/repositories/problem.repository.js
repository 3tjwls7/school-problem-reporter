import db from "../../db.js";

/** 전체 문제 조회 */
export const getAllProblems = async () => {
  const [rows] = await db.execute(`
    SELECT 
      p.*, 
      u.username
    FROM problems p
    JOIN users u ON p.authorId = u.id
    ORDER BY p.createdAt DESC
  `);
  return rows;
};

/** 문제 등록 */
export const createProblem = async ({
  title,
  description,
  location,
  imageUrl,
  authorId,
}) => {
  await db.execute(
    "INSERT INTO problems (title, description, location, imageUrl, authorId) VALUES (?, ?, ?, ?, ?)",
    [title, description, location, imageUrl, authorId]
  );
};

/** 문제 상태 변경 */
export const updateProblemStatus = async (id, status) => {
  await db.execute("UPDATE problems SET status = ? WHERE id = ?", [status, id]);
};

/** 문제 삭제 */
export const deleteProblem = async (id, authorId, userRole) => {
  if (userRole === "admin") {
    await db.execute("DELETE FROM problems WHERE id = ?", [id]);
  } else {
    const [result] = await db.execute(
      "DELETE FROM problems WHERE id = ? AND authorId = ?",
      [id, authorId]
    );
    if (result.affectedRows === 0) {
      throw new Error("본인이 작성한 문제만 삭제할 수 있습니다.");
    }
  }
};

/** 문제 수정 */
export const updateProblem = async (
  id,
  title,
  description,
  location,
  imageUrl,
  authorId,
  userRole
) => {
  const query =
    imageUrl
      ? "UPDATE problems SET title=?, description=?, location=?, imageUrl=? WHERE id=?"
      : "UPDATE problems SET title=?, description=?, location=? WHERE id=?";

  const params = imageUrl
    ? [title, description, location, imageUrl, id]
    : [title, description, location, id];

  if (userRole === "admin") {
    await db.execute(query, params);
  } else {
    const [result] = await db.execute(
      imageUrl
        ? `${query} AND authorId=?`
        : `${query} AND authorId=?`,
      imageUrl ? [...params, authorId] : [...params, authorId]
    );
    if (result.affectedRows === 0) {
      throw new Error("본인이 작성한 문제만 수정할 수 있습니다.");
    }
  }
};

export const getMyProblemsRepo = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM problems WHERE authorId = ? ORDER BY createdAt DESC",
    [userId]
  );
  return rows;
};