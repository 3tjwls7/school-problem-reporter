import { toggleVoteService } from "../services/vote.service.js";

export const toggleVote = async (req, res) => {
  try {
    const { id: problemId } = req.params;
    const userId = req.user.id;

    const result = await toggleVoteService(userId, problemId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
