export const formatKoreanTime = (isoString: string) => {
  const date = new Date(isoString);

  const koreaOffset = 9 * 60; // 분 단위
  const localOffset = date.getTimezoneOffset();
  const diff = (koreaOffset + localOffset) * 60 * 1000;

  const koreaTime = new Date(date.getTime() + diff);

  return koreaTime.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
