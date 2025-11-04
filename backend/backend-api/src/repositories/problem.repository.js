import db from "../../../db.js";

export const getAllProblems = async () => {
  const [rows] = await db.execute("SELECT * FROM problems ORDER BY createdAt DESC");
  return rows;
};

export const createProblem = async ({ title, description, location, imageUrl, authorId }) => {
  await db.execute(
    "INSERT INTO problems (title, description, location, imageUrl, authorId) VALUES (?, ?, ?, ?, ?)",
    [title, description, location, imageUrl, authorId]
  );
};

export const updateProblemStatus = async (id, status) => {
  await db.execute("UPDATE problems SET status = ? WHERE id = ?", [status, id]);
};
