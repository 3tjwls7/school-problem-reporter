import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ThumbsUp, MessageCircle, MapPin, Calendar } from "lucide-react";
import { formatKoreanTime } from "../utils/dateFormat";

export interface Problem {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  votes: number;
  commentCount: number;
  createdAt: string;
  username?: string;
  hasVoted?: boolean;
  status?: "pending" | "in-progress" | "resolved";
  isOverdue?: boolean;
}

interface ProblemCardProps {
  problem: Problem;
  onVote: (id: number) => void;
  onClick: (id: number) => void;
}

export function ProblemCard({ problem, onVote, onClick }: ProblemCardProps) {
  const statusColors = {
    pending:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
    "in-progress":
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
    resolved:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  };

  const statusLabels = {
    pending: "대기중",
    "in-progress": "처리중",
    resolved: "해결완료",
  };

  return (
    <Card
      onClick={() => onClick(problem.id)}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-white text-sm shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md"
    >
      {/* ✅ 이미지 영역 — 비율 고정 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={
            problem.imageUrl.startsWith("http")
              ? problem.imageUrl
              : `http://localhost:4002${problem.imageUrl}`
          }
          alt={problem.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* 상태 배지 */}
        {problem.status && (
          <Badge
            className={`absolute right-2 top-2 border text-[10px] px-2 py-0.5 shadow-sm ${
              statusColors[problem.status]
            }`}
          >
            {statusLabels[problem.status]}
          </Badge>
        )}

        {/* 7일 이상 경과 배지 */}
        {problem.status === "pending" && problem.isOverdue && (
          <div className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm animate-pulse">
            🔥 7일 이상 경과
          </div>
        )}
      </div>

      {/* 본문 내용 */}
      <CardContent className="flex flex-grow flex-col justify-between p-4">
        <div className="space-y-1.5">
          <h3 className="line-clamp-1 font-semibold text-gray-900 transition-colors group-hover:text-primary">
            {problem.title}
          </h3>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {problem.description}
          </p>
        </div>

        <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{problem.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatKoreanTime(problem.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      {/* 하단 영역 */}
      <CardFooter className="flex items-center justify-between border-t bg-secondary/30 px-3 py-2">
        <Button
          variant={problem.hasVoted ? "default" : "outline"}
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onVote(problem.id);
          }}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{problem.votes}</span>
        </Button>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MessageCircle className="h-3.5 w-3.5" />
          <span className="text-xs">{problem.commentCount}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
