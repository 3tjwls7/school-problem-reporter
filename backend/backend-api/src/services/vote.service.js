import {
  checkUserVoted,
  addVote,
  removeVote,
  getVoteCount, // 새로 추가할 함수
} from "../repositories/vote.repository.js";

/**
 * 공감(좋아요) 토글
 * - 이미 눌렀으면 삭제
 * - 안 눌렀으면 추가
 * - 반영 후 최신 votes 수 반환
 */
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
