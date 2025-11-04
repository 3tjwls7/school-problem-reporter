import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ThumbsUp, MessageCircle, MapPin, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Problem {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  votes: number;
  commentCount: number;
  createdAt: string;
  author: string;
  hasVoted?: boolean;
  status?: "pending" | "in-progress" | "resolved";
}

interface ProblemCardProps {
  problem: Problem;
  onVote: (id: number) => void;
  onClick: (id: number) => void;
}

export function ProblemCard({ problem, onVote, onClick }: ProblemCardProps) {
  const statusColors = {
    pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
    resolved: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  };

  const statusLabels = {
    pending: "대기중",
    "in-progress": "처리중",
    resolved: "해결완료",
  };

  return (
    <Card className="group overflow-hidden border-2 transition-all duration-200 hover:border-primary/50 hover:shadow-xl">
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden bg-muted"
        onClick={() => onClick(problem.id)}
      >
        <ImageWithFallback
          src={problem.imageUrl}
          alt={problem.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
        {problem.status && (
          <Badge
            className={`absolute right-3 top-3 border shadow-sm ${statusColors[problem.status]}`}
          >
            {statusLabels[problem.status]}
          </Badge>
        )}
      </div>
      <CardHeader className="cursor-pointer space-y-3 pb-3" onClick={() => onClick(problem.id)}>
        <h3 className="line-clamp-2 transition-colors group-hover:text-primary">{problem.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {problem.description}
        </p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <span>{problem.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <span>{problem.createdAt}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-secondary/30 pt-4">
        <Button
          variant={problem.hasVoted ? "default" : "outline"}
          size="sm"
          className="gap-2 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onVote(problem.id);
          }}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{problem.votes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => onClick(problem.id)}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{problem.commentCount}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
