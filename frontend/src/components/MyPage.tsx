import { useEffect, useState } from "react";
import { ProblemCard, Problem } from "./ProblemCard";
import { Button } from "./ui/button";
import { Filter, ArrowLeft, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";
import { getMyProblemsAPI } from "../api/problem";

interface MyPageProps {
  onBack: () => void;
}

export function MyPage({ onBack }: MyPageProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filterBy, setFilterBy] = useState<
    "all" | "pending" | "in-progress" | "resolved"
  >("all");

  const filterColors = {
    all: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800",
    pending:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
    "in-progress":
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
    resolved:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  };

  useEffect(() => {
    const fetchMyProblems = async () => {
      try {
        const data = await getMyProblemsAPI();
        setProblems(data);
      } catch (err) {
        console.error("❌ 내 신고글 불러오기 실패:", err);
      }
    };
    fetchMyProblems();
  }, []);

  const filteredProblems = problems.filter((p) =>
    filterBy === "all" ? true : p.status === filterBy
  );

  const totalCount = problems.length;
  const pendingCount = problems.filter((p) => p.status === "pending").length;
  const progressCount = problems.filter((p) => p.status === "in-progress").length;
  const resolvedCount = problems.filter((p) => p.status === "resolved").length;

  return (
    <div className="space-y-8">
      {/* 상단 헤더 */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-sm hover:scale-[1.02] transition-all"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
              목록으로
            </Button>
            <h2 className="text-xl font-semibold">📋 내 신고 내역</h2>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white dark:bg-gray-900 border p-4 shadow-sm hover:shadow-md transition-all">
            <p className="text-xs text-muted-foreground mb-1">총 신고 수</p>
            <p className="text-2xl font-bold text-primary">{totalCount}</p>
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 p-4 shadow-sm hover:shadow-md transition-all">
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">대기중</p>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">{pendingCount}</p>
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 p-4 shadow-sm hover:shadow-md transition-all">
            <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">처리중</p>
            <div className="flex items-center gap-1">
              <Clock3 className="h-4 w-4 text-blue-600" />
              <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">{progressCount}</p>
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 p-4 shadow-sm hover:shadow-md transition-all">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">해결완료</p>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">{resolvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-sm">
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
                onClick={() => setFilterBy(key as typeof filterBy)}
                className={`h-7 text-xs gap-1 border shadow-sm ${
                  filterBy === key
                    ? `${filterColors[key as keyof typeof filterColors]}`
                    : "bg-transparent border-muted text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 신고 카드 리스트 */}
      {filteredProblems.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed bg-secondary/30">
          <div className="text-center text-sm">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-muted-foreground">
              아직 신고한 문제가 없습니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="transition-transform duration-200 hover:scale-[1.02]"
            >
              <ProblemCard
                problem={problem}
                onVote={() => {}}
                onClick={() => {}}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
