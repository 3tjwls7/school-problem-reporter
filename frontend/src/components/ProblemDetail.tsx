import { useState } from "react";
import { Problem } from "./ProblemCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ThumbsUp,
  MapPin,
  Calendar,
  User,
  ArrowLeft,
  Send,
  Trash2,
  Shield,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  isOwn?: boolean;
}

interface ProblemDetailProps {
  problem: Problem;
  comments: Comment[];
  currentUser: string;
  isAdmin: boolean;
  onVote: (id: number) => void;
  onBack: () => void;
  onAddComment: (content: string) => void;
  onDeleteComment: (commentId: number) => void;
  onStatusChange: (problemId: number, newStatus: "pending" | "in-progress" | "resolved") => void;
}

export function ProblemDetail({
  problem,
  comments,
  currentUser,
  isAdmin,
  onVote,
  onBack,
  onAddComment,
  onDeleteComment,
  onStatusChange,
}: ProblemDetailProps) {
  const [commentText, setCommentText] = useState("");

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

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="gap-2 shadow-sm">
        <ArrowLeft className="h-4 w-4" />
        목록으로
      </Button>

      {/* Problem Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 shadow-lg">
        <ImageWithFallback
          src={
            problem.imageUrl.startsWith("http")
              ? problem.imageUrl
              : `http://localhost:4002${problem.imageUrl}`
          }
          alt={problem.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {problem.status && (
          <Badge
            className={`absolute right-4 top-4 border shadow-sm ${statusColors[problem.status]}`}
          >
            {statusLabels[problem.status]}
          </Badge>
        )}
      </div>

      {/* Problem Info */}
      <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
        <div>
          <h1>{problem.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{problem.author}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{problem.location}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{problem.createdAt}</span>
            </div>
          </div>
        </div>

        <Separator />

        <p className="whitespace-pre-wrap leading-relaxed">{problem.description}</p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button
            variant={problem.hasVoted ? "default" : "outline"}
            onClick={() => onVote(problem.id)}
            className="gap-2 shadow-sm"
            size="lg"
          >
            <ThumbsUp className="h-5 w-5" />
            공감하기 ({problem.votes})
          </Button>
        </div>
      </div>

      {/* Admin Status Control */}
      {isAdmin && (
        <div className="space-y-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg">관리자 전용</h3>
              <p className="text-sm text-muted-foreground">문제 처리 상태를 변경할 수 있습니다</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-sm">처리 상태:</Label>
            <Select
              value={problem.status}
              onValueChange={(value: "pending" | "in-progress" | "resolved") =>
                onStatusChange(problem.id, value)
              }
            >
              <SelectTrigger className="w-[200px] border-2 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">대기중</SelectItem>
                <SelectItem value="in-progress">처리중</SelectItem>
                <SelectItem value="resolved">해결완료</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-xl">💬</span>
          </div>
          <h2>댓글 ({comments.length})</h2>
        </div>

        {/* Add Comment */}
        <div className="space-y-3 rounded-xl border bg-secondary/30 p-4">
          <Textarea
            placeholder="댓글을 입력하세요..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            className="border-0 bg-card shadow-sm"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitComment} className="gap-2 shadow-sm">
              <Send className="h-4 w-4" />
              댓글 작성
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed bg-secondary/30 p-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <span className="text-2xl">💭</span>
              </div>
              <p className="text-muted-foreground">
                아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-2 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {comment.createdAt}
                    </span>
                  </div>
                  {comment.isOwn && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <p className="text-sm leading-relaxed">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
