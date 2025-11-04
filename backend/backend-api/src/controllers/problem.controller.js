import { getAllProblems, createProblem, updateProblemStatus } from "../repositories/problem.repository.js";

export const getProblems = async (req, res) => {
  try {
    const problems = await getAllProblems();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNewProblem = async (req, res) => {
  try {
    const { title, description, location, imageUrl } = req.body;
    const authorId = req.user.id; // 로그인 사용자
    await createProblem({ title, description, location, imageUrl, authorId });
    res.status(201).json({ message: "문제가 등록되었습니다!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const changeProblemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "관리자만 변경할 수 있습니다." });
    }
    await updateProblemStatus(id, status);
    res.json({ message: "문제 상태가 변경되었습니다." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
