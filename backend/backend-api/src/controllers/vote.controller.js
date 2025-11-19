import { toggleVoteService } from "../services/vote.service.js";

// 공감 토글 API
// 이미 눌렀으면 취소
// 안 눌렀으면 추가
export const toggleVote = async (req, res) => {
  try {
    const { id: problemId } = req.params;
    const userId = req.user.id;

    console.log("userId:", userId);
    console.log("problemId:", problemId);
    console.log("req.user:", req.user);

    const result = await toggleVoteService(userId, problemId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
