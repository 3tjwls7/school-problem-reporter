import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ProblemList } from "./components/ProblemList";
import { ProblemDetail, Comment } from "./components/ProblemDetail";
import { CreateProblemDialog } from "./components/CreateProblemDialog";
import { AuthDialog } from "./components/AuthDialog";
import { Problem } from "./components/ProblemCard";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { loginAPI, signupAPI } from "./api/auth";
import api from "./api/axios";

// Mock data
const initialProblems: Problem[] = [
  {
    id: 1,
    title: "본관 3층 화장실 문 고장",
    description: "3층 남자 화장실 첫 번째 칸 문이 잠기지 않습니다. 손잡이가 헐거워져서 사용이 불편합니다.",
    location: "본관 3층",
    imageUrl: "https://images.unsplash.com/photo-1729799959058-bda08177a84c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBmYWNpbGl0eSUyMHByb2JsZW18ZW58MXx8fHwxNzYyMTY0NTc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    votes: 24,
    commentCount: 5,
    createdAt: "2024-11-01",
    author: "김민준",
    hasVoted: false,
    status: "in-progress",
  },
  {
    id: 2,
    title: "도서관 의자 파손",
    description: "도서관 2층 열람실 의자 여러 개가 파손되어 있습니다. 앉으면 삐걱거리고 불안정합니다.",
    location: "도서관",
    imageUrl: "https://images.unsplash.com/photo-1673180022058-308ce2f35d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBkZXNrJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2MjE2NDU3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    votes: 18,
    commentCount: 3,
    createdAt: "2024-10-30",
    author: "이서연",
    hasVoted: false,
    status: "pending",
  },
  {
    id: 3,
    title: "체육관 조명 고장",
    description: "체육관 왼쪽 구역 조명 3개가 깜빡거리고 있습니다. 운동할 때 눈이 피로합니다.",
    location: "체육관",
    imageUrl: "https://images.unsplash.com/photo-1706969151544-dfefd704a3b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidWlsZGluZyUyMG1haW50ZW5hbmNlfGVufDF8fHx8MTc2MjE2NDU3NXww&ixlib=rb-4.1.0&q=80&w=1080",
    votes: 31,
    commentCount: 8,
    createdAt: "2024-10-28",
    author: "박지호",
    hasVoted: false,
    status: "pending",
  },
];

const mockComments: { [key: number]: Comment[] } = {
  1: [
    {
      id: 1,
      author: "홍길동",
      content: "저도 이 문제 겪었어요. 빨리 수리되면 좋겠습니다.",
      createdAt: "2024-11-01",
    },
    {
      id: 2,
      author: "김영희",
      content: "어제부터 처리중이라고 공지가 올라왔어요!",
      createdAt: "2024-11-02",
    },
  ],
  2: [
    {
      id: 3,
      author: "정민수",
      content: "여기 의자들 정말 오래됐죠. 교체가 필요할 것 같아요.",
      createdAt: "2024-10-31",
    },
  ],
  3: [
    {
      id: 4,
      author: "최수진",
      content: "운동 동아리 활동할 때 너무 불편해요.",
      createdAt: "2024-10-29",
    },
    {
      id: 5,
      author: "강태희",
      content: "같은 문제 공감합니다!",
      createdAt: "2024-10-30",
    },
  ],
};

export default function App() {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>(mockComments);
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/verify")
        .then((res) => {
          setIsLoggedIn(true);
          setCurrentUser(res.data.user.email);
          setIsAdmin(res.data.user.role === "admin");
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);


  const handleVote = (id: number) => {
    setProblems(
      problems.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            votes: p.hasVoted ? p.votes - 1 : p.votes + 1,
            hasVoted: !p.hasVoted,
          };
        }
        return p;
      })
    );
    toast.success(
      problems.find((p) => p.id === id)?.hasVoted
        ? "공감을 취소했습니다"
        : "공감했습니다!"
    );
  };

  const handleCreateProblem = (newProblem: {
    title: string;
    description: string;
    location: string;
    imageUrl: string;
  }) => {
    const problem: Problem = {
      id: Math.max(...problems.map((p) => p.id)) + 1,
      ...newProblem,
      votes: 0,
      commentCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      author: currentUser,
      hasVoted: false,
      status: "pending",
    };
    setProblems([...problems, problem]);
    setIsCreateDialogOpen(false);
    toast.success("문제가 신고되었습니다!");
  };

  
  
  const handleLogin = async (username: string, password: string) => {
    try {
      const res = await loginAPI(username, password);
      localStorage.setItem("token", res.token); // JWT 저장
      setIsLoggedIn(true);
      setCurrentUser(username);
      setIsAuthDialogOpen(false);
      toast.success(`${username}님, 환영합니다!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "로그인 실패");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // JWT 삭제
    setIsLoggedIn(false);
    setCurrentUser("");
    setIsAdmin(false);
    toast.success("로그아웃되었습니다.");
  };

  const handleSignup = async (
    username: string,
    email: string,
    password: string,
    isAdminRole: boolean
  ) => {
    try {
      await signupAPI(username, email, password, isAdminRole);
      toast.success("회원가입이 완료되었습니다! 로그인해주세요.");
      setIsAuthDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "회원가입 실패");
    }
  };


  const handleAddComment = (content: string) => {
    if (!selectedProblemId) return;

    const newComment: Comment = {
      id: Date.now(),
      author: currentUser,
      content,
      createdAt: new Date().toISOString().split("T")[0],
      isOwn: true,
    };

    setComments({
      ...comments,
      [selectedProblemId]: [
        ...(comments[selectedProblemId] || []),
        newComment,
      ],
    });

    setProblems(
      problems.map((p) =>
        p.id === selectedProblemId
          ? { ...p, commentCount: p.commentCount + 1 }
          : p
      )
    );

    toast.success("댓글이 작성되었습니다!");
  };

  const handleDeleteComment = (commentId: number) => {
    if (!selectedProblemId) return;

    setComments({
      ...comments,
      [selectedProblemId]: comments[selectedProblemId].filter(
        (c) => c.id !== commentId
      ),
    });

    setProblems(
      problems.map((p) =>
        p.id === selectedProblemId
          ? { ...p, commentCount: p.commentCount - 1 }
          : p
      )
    );

    toast.success("댓글이 삭제되었습니다!");
  };

  const handleStatusChange = (problemId: number, newStatus: "pending" | "in-progress" | "resolved") => {
    setProblems(
      problems.map((p) =>
        p.id === problemId ? { ...p, status: newStatus } : p
      )
    );
    
    const statusLabels = {
      pending: "대기중",
      "in-progress": "처리중",
      resolved: "해결완료",
    };
    
    toast.success(`상태가 '${statusLabels[newStatus]}'로 변경되었습니다!`);
  };

  const selectedProblem = problems.find((p) => p.id === selectedProblemId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onCreateClick={() => {
          if (!isLoggedIn) {
            setIsAuthDialogOpen(true);
            toast.error("로그인이 필요합니다.");
          } else {
            setIsCreateDialogOpen(true);
          }
        }}
        onLoginClick={() => setIsAuthDialogOpen(true)}
        onLogoutClick={handleLogout}
        isLoggedIn={isLoggedIn}
        username={currentUser}
      />

      <main className="container px-4 py-8 md:py-12">
        {selectedProblem ? (
          <ProblemDetail
            problem={selectedProblem}
            comments={comments[selectedProblem.id] || []}
            currentUser={currentUser}
            isAdmin={isAdmin}
            onVote={handleVote}
            onBack={() => setSelectedProblemId(null)}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="space-y-8">
            <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary shadow-md">
                  <span className="text-3xl">📢</span>
                </div>
                <div>
                  <h1>학교 문제 신고</h1>
                  <p className="mt-2 text-muted-foreground">
                    학교 시설의 문제를 신고하고 공감을 표현하세요. 많은 공감을 받은
                    문제는 우선적으로 처리됩니다.
                  </p>
                </div>
              </div>
            </div>
            <ProblemList
              problems={problems}
              onVote={handleVote}
              onProblemClick={setSelectedProblemId}
            />
          </div>
        )}
      </main>

      <CreateProblemDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateProblem}
      />

      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />

      <Toaster />
    </div>
  );
}
