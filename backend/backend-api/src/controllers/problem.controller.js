import {
  getProblemsService,
  createProblemService,
  changeProblemStatusService,
  deleteProblemService,
  updateProblemService,
  getMyProblemsService,
} from "../services/problem.service.js";
import axios from "axios";

// 문제 목록 조회 
// - 로그인 X: hasVoted = false
// - 로그인 O: auth 서버에 토큰 검증 + 투표 여부 표시
export const getProblems = async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;

    if (authHeader) {
      try {
        // auth 서버에 토큰 검증 요청
        const verifyRes = await axios.get("http://backend-auth:4001/auth/verify", {
          headers: { Authorization: authHeader },
        });
        userId = verifyRes.data.user.id;
      } catch {
        userId = null; // 토큰이 유효하지 않아도 비로그인으로 처리
      }
    }

    const problems = await getProblemsService(userId);
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 문제 등록 (로그인 + 이미지 업로드 필수)
export const createNewProblem = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const authorId = req.user.id;

    // multer가 저장한 파일 확인
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

// 문제 상태 변경 (관리자 전용 기능)
export const changeProblemStatus = async (req, res) => {
  try {
    const { id } = req.params;        // 문제 ID
    const { status } = req.body;      // 변경될 상태
    const userRole = req.user.role;   // 권한 체크

    const result = await changeProblemStatusService(id, status, userRole);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 문제 삭제 (작성자 또는 관리자)
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

// 문제 수정
export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    // 이미지 변경 여부
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

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 내 신고글 조회
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
