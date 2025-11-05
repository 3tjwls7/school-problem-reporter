import {
  checkUserVoted,
  addVote,
  removeVote,
} from "../repositories/vote.repository.js";

export const toggleVoteService = async (userId, problemId) => {
  const alreadyVoted = await checkUserVoted(userId, problemId);

  if (alreadyVoted) {
    await removeVote(userId, problemId);
    return { message: "공감이 취소되었습니다.", voted: false };
  } else {
    await addVote(userId, problemId);
    return { message: "공감되었습니다!", voted: true };
  }
};
