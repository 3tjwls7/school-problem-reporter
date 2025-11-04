import { useState } from "react";
import { ProblemCard, Problem } from "./ProblemCard";
import { Button } from "./ui/button";
import { ArrowUpDown, TrendingUp, Clock } from "lucide-react";

interface ProblemListProps {
  problems: Problem[];
  onVote: (id: number) => void;
  onProblemClick: (id: number) => void;
}

type SortType = "votes" | "recent";

export function ProblemList({ problems, onVote, onProblemClick }: ProblemListProps) {
  const [sortBy, setSortBy] = useState<SortType>("votes");

  const sortedProblems = [...problems].sort((a, b) => {
    if (sortBy === "votes") {
      return b.votes - a.votes;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="space-y-8">
      {/* Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ArrowUpDown className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm">정렬 기준</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "votes" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("votes")}
            className="gap-2 shadow-sm"
          >
            <TrendingUp className="h-4 w-4" />
            투표순
          </Button>
          <Button
            variant={sortBy === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("recent")}
            className="gap-2 shadow-sm"
          >
            <Clock className="h-4 w-4" />
            최근순
          </Button>
        </div>
      </div>

      {/* Problem Grid */}
      {sortedProblems.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed bg-secondary/30">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-muted-foreground">아직 신고된 문제가 없습니다.</p>
            <p className="text-sm text-muted-foreground">
              첫 번째 문제를 신고해보세요!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onVote={onVote}
              onClick={onProblemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
