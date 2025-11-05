import {
  checkUserVoted,
  addVote,
  removeVote,
  getVoteCount, // 새로 추가할 함수
} from "../repositories/vote.repository.js";

export const toggleVoteService = async (userId, problemId) => {
  const alreadyVoted = await checkUserVoted(userId, problemId);

  if (alreadyVoted) {
    await removeVote(userId, problemId);
  } else {
    await addVote(userId, problemId);
  }

  // 최신 votes 수 조회
  const votes = await getVoteCount(problemId);

  return {
    message: alreadyVoted ? "공감이 취소되었습니다." : "공감되었습니다!",
    voted: !alreadyVoted,
    votes, // 프론트에 최신 공감 수 전달
  };
};
