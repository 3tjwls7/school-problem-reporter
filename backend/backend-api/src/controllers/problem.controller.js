import {
  getProblemsService,
  createProblemService,
  changeProblemStatusService,
} from "../services/problem.service.js";

import { verifyJWT } from "../../../backend-auth/src/utils/jwt.js";

export const getProblems = async (req, res) => {
  try {
    let userId = null;

    // 토큰이 있으면 사용자 식별
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyJWT(token);
      if (decoded) userId = decoded.id;
    }

    // 서비스 계층에 userId 전달
    const problems = await getProblemsService(userId);
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNewProblem = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const authorId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "이미지 파일이 없습니다." });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // multer가 만든 파일 경로 사용

    const result = await createProblemService({
      title,
      description,
      location,
      imageUrl,
      authorId,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("❌ 문제 등록 에러:", err);
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
