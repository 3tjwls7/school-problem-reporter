import { useState } from "react";
import { ProblemCard, Problem } from "./ProblemCard";
import { Button } from "./ui/button";
import { ArrowUpDown, TrendingUp, Clock, Filter } from "lucide-react";

interface ProblemListProps {
  problems: Problem[];
  onVote: (id: number) => void;
  onProblemClick: (id: number) => void;
}

type SortType = "votes" | "recent";
type FilterType = "all" | "pending" | "in-progress" | "resolved";

export function ProblemList({
  problems,
  onVote,
  onProblemClick,
}: ProblemListProps) {
  const [sortBy, setSortBy] = useState<SortType>("votes");
  const [filterBy, setFilterBy] = useState<FilterType>("all");

  // 카드에서 쓰는 색상계열 재활용
  const filterColors = {
    all: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800",
    pending:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
    "in-progress":
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
    resolved:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  };

  // 상태 필터
  const filteredProblems = problems.filter((p) => {
    if (filterBy === "all") return true;
    return p.status === filterBy;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* 필터 + 정렬 컨트롤 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-sm">
        {/* 왼쪽: 상태 필터 */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Filter className="h-4 w-4 text-primary" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "전체" },
              { key: "pending", label: "대기중" },
              { key: "in-progress", label: "처리중" },
              { key: "resolved", label: "해결완료" },
            ].map(({ key, label }) => (
              <Button
                key={key}
                size="sm"
                onClick={() => setFilterBy(key as FilterType)}
                className={`h-7 text-xs gap-1 border shadow-sm ${
                  filterBy === key
                    ? `${filterColors[key as FilterType]}`
                    : "bg-transparent border-muted text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* 오른쪽: 정렬 */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <ArrowUpDown className="h-4 w-4 text-primary" />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "votes" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("votes")}
              className="h-7 text-xs gap-1 shadow-sm"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              투표순
            </Button>
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("recent")}
              className="h-7 text-xs gap-1 shadow-sm"
            >
              <Clock className="h-3.5 w-3.5" />
              최근순
            </Button>
          </div>
        </div>
      </div>

      {/* 문제 카드 리스트 */}
      {sortedProblems.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed bg-secondary/30">
          <div className="text-center text-sm">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-muted-foreground">해당 상태의 문제가 없습니다.</p>
            <p className="text-xs text-muted-foreground">
              새로운 문제를 등록해보세요!
            </p>
          </div>
        </div>
      ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-start">
            {sortedProblems.map((problem) => (
              <div key={problem.id} className="h-full">
                <ProblemCard
                  problem={problem}
                  onVote={onVote}
                  onClick={onProblemClick}
                />
              </div>
            ))}
          </div>

      )}
    </div>
  );
}
