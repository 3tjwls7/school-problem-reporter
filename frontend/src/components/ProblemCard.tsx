import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ThumbsUp, MessageCircle, MapPin, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
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
  isOverdue?: boolean; // 백엔드에서 추가된 필드
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
    <Card className="group overflow-hidden border transition-all duration-200 hover:border-primary/50 hover:shadow-md text-sm">
      {/* ---------- 이미지 영역 ---------- */}
      <div
        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-muted"
        onClick={() => onClick(problem.id)}
      >
        <ImageWithFallback
          src={
            problem.imageUrl.startsWith("http")
              ? problem.imageUrl
              : `http://localhost:4002${problem.imageUrl}?t=${Date.now()}`
          }
          alt={problem.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* 마우스 오버시 어둡게 */}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

        {/* 상태 배지 */}
        {problem.status && (
          <Badge
            className={`absolute right-2 top-2 border text-[10px] px-2 py-0.5 shadow-sm ${statusColors[problem.status]}`}
          >
            {statusLabels[problem.status]}
          </Badge>
        )}

        {/* 7일 이상 경과 배지 */}
        {problem.status === "pending" && problem.isOverdue && (
          <div className="absolute left-2 top-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm animate-pulse">
            🔥 7일 이상 경과
          </div>
        )}
      </div>

      {/* ---------- 카드 본문 ---------- */}
      <CardHeader
        className="cursor-pointer space-y-1.5 px-3 py-2"
        onClick={() => onClick(problem.id)}
      >
        <h3 className="text-sm font-semibold line-clamp-1 transition-colors group-hover:text-primary">
          {problem.title}
        </h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {problem.description}
        </p>
      </CardHeader>

      {/* ---------- 카드 하단 ---------- */}
      <CardContent className="px-3 py-1.5">
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{problem.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{formatKoreanTime(problem.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-secondary/30 px-3 py-2">
        <Button
          variant={problem.hasVoted ? "default" : "outline"}
          size="sm"
          className="gap-1 text-xs h-7 px-2"
          onClick={(e) => {
            e.stopPropagation();
            onVote(problem.id);
          }}
        >
          <ThumbsUp className="h-3 w-3" />
          <span>{problem.votes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs h-7 px-2"
          onClick={() => onClick(problem.id)}
        >
          <MessageCircle className="h-3 w-3" />
          <span>{problem.commentCount}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
