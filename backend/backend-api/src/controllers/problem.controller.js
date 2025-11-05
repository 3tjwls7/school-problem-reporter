import {
  getProblemsService,
  createProblemService,
  changeProblemStatusService,
} from "../services/problem.service.js";

export const getProblems = async (req, res) => {
  try {
    const problems = await getProblemsService();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNewProblem = async (req, res) => {
  try {
    const { title, description, location, imageUrl } = req.body;
    const authorId = req.user.id;

    const result = await createProblemService({
      title,
      description,
      location,
      imageUrl,
      authorId,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const changeProblemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user.role;

    const result = await changeProblemStatusService(id, status, userRole);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
