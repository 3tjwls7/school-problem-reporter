import {
  getProblemsService,
  createProblemService,
  changeProblemStatusService,
  deleteProblemService,
  updateProblemService,
  getMyProblemsService,
} from "../services/problem.service.js";
import { verifyJWT } from "../../../backend-auth/src/utils/jwt.js";

/** 문제 목록 조회 */
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

    const problems = await getProblemsService(userId);
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** 문제 등록 */
export const createNewProblem = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const authorId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "이미지 파일이 없습니다." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

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

/** 문제 상태 변경 (관리자 전용) */
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

/** 문제 삭제 */
export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await deleteProblemService(id, userId, userRole);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/** 문제 수정 */
export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // 새 이미지 파일이 있으면 업로드 경로 설정
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const updated = await updateProblemService(
      id,
      title,
      description,
      location,
      imageUrl,
      userId,
      userRole
    );

    res.json(updated); // 수정된 문제 데이터 전체 반환
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyProblems = async (req, res) => {
  try {
    const userId = req.user.id;
    const problems = await getMyProblemsService(userId);
    res.json(problems);
  } catch (err) {
    console.error("❌ 내 신고글 불러오기 실패:", err);
    res.status(500).json({ message: "내 신고글을 불러오지 못했습니다." });
  }
};