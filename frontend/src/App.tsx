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
import { toggleVoteAPI } from "./api/vote";
import {
  getProblemsAPI,
  updateProblemStatusAPI,
} from "./api/problem";
import {
  getCommentsAPI,
  createCommentAPI,
  deleteCommentAPI,
} from "./api/comment";

import api from "./api/axiosAuth";


export default function App() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
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


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/verify")
        .then((res) => {
          setIsLoggedIn(true);
          setCurrentUser(res.data.user.username);
          setIsAdmin(res.data.user.role === "admin");
        })
        .catch(() => localStorage.removeItem("token"));
    }

    // 문제 목록 불러오기
    getProblemsAPI()
      .then((data) => {
        setProblems(data);
      })
      .catch(() => toast.error("문제 목록을 불러오지 못했습니다."));
  }, []);

  useEffect(() => {
    if (selectedProblemId) {
      getCommentsAPI(selectedProblemId)
        .then((data) => {
          // 내가 쓴 댓글이면 isOwn = true 설정
          const processedComments = data.map((c: any) => ({
            ...c,
            isOwn: c.username === currentUser,
          }));

          setComments((prev) => ({
            ...prev,
            [selectedProblemId]: processedComments,
          }));
        })
        .catch(() => toast.error("댓글 목록을 불러오지 못했습니다."));
    }
  }, [selectedProblemId, currentUser]);



  const handleVote = async (id: number) => {
    try {
      const res = await toggleVoteAPI(id);
      setProblems(
        problems.map((p) =>
          p.id === id ? { ...p, votes: res.votes, hasVoted: res.voted } : p
        )
      );
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "공감 처리 실패");
    }
  };
  
  
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await loginAPI(email, password);
      const { token, user } = res; // user.username 읽힘

      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      setCurrentUser(user.username);
      setIsAdmin(user.role === "admin");
      setIsAuthDialogOpen(false);

      toast.success(`${user.username}님, 환영합니다!`);
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


  const handleAddComment = async (content: string) => {
    if (!selectedProblemId) return;

    try {
      const newComment = await createCommentAPI(selectedProblemId, content);

      // 내가 방금 쓴 댓글은 무조건 isOwn = true
      setComments({
        ...comments,
        [selectedProblemId]: [
          ...(comments[selectedProblemId] || []),
          { ...newComment, isOwn: true },
        ],
      });

      toast.success("댓글이 작성되었습니다!");
    } catch {
      toast.error("댓글 작성을 실패했습니다.");
    }
  };



  const handleDeleteComment = async (commentId: number) => {
    if (!selectedProblemId) return;

    try {
      await deleteCommentAPI(selectedProblemId, commentId);

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
    } catch {
      toast.error("댓글 삭제를 실패했습니다.");
    }
  };


  const handleStatusChange = async (
    problemId: number,
    newStatus: "pending" | "in-progress" | "resolved"
  ) => {
    try {
      const res = await updateProblemStatusAPI(problemId, newStatus);
      setProblems(
        problems.map((p) =>
          p.id === problemId ? { ...p, status: res.status } : p
        )
      );
      toast.success(`상태가 '${res.status}'로 변경되었습니다!`);
    } catch (err) {
      toast.error("상태 변경 실패");
    }
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
        onSubmit={() => {
          // 새로 등록된 문제 다시 불러오기
          // (또는 setProblems([...problems, newOne]) 로 수동 추가도 가능)
        }}
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
