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
import { ProblemCard } from "./components/ProblemCard";
import { EditProblemDialog } from "./components/EditProblemDialog";
import { MyPage } from "./components/MyPage";

import {
  getProblemsAPI,
  updateProblemAPI,
  deleteProblemAPI,
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false); // 마이페이지 상태 추가

  // 문제 목록 새로고침
  const handleProblemUpdated = async () => {
    try {
      const data = await getProblemsAPI();
      setProblems(data);
    } catch {
      toast.error("문제 목록을 새로고침하지 못했습니다.");
    }
  };

  // 문제 삭제
  const handleDeleteProblem = async (id: number) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const res = await deleteProblemAPI(id);
      setProblems(problems.filter((p) => p.id !== id));
      toast.success(res.message || "문제가 삭제되었습니다!");
      setSelectedProblemId(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "삭제 실패");
    }
  };

  // 수정 다이얼로그 열기
  const handleEditProblem = (id: number, problem: Problem) => {
    setEditingProblem(problem);
    setIsEditDialogOpen(true);
  };

  // 문제 수정
  const handleSubmitEdit = async (updatedData: {
    title: string;
    description: string;
    location: string;
    image?: File | null;
  }) => {
    if (!editingProblem) return;

    try {
      const formData = new FormData();
      formData.append("title", updatedData.title);
      formData.append("description", updatedData.description);
      formData.append("location", updatedData.location);
      if (updatedData.image) formData.append("image", updatedData.image);

      const updated = await updateProblemAPI(editingProblem.id, formData);

      toast.success("문제가 수정되었습니다!");

      setProblems((prev) =>
        prev.map((p) =>
          p.id === editingProblem.id
            ? {
                ...p,
                ...updated,
                imageUrl: `${updated.imageUrl}?t=${Date.now()}`, // 캐시 무효화
              }
            : p
        )
      );

      setIsEditDialogOpen(false);
      setSelectedProblemId(null);

      setTimeout(() => handleProblemUpdated(), 300);
    } catch (err) {
      console.error(err);
      toast.error("문제 수정 중 오류가 발생했습니다.");
    }
  };

  // 로그인 상태 확인 + 문제 목록 불러오기
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

    getProblemsAPI()
      .then(setProblems)
      .catch(() => toast.error("문제 목록을 불러오지 못했습니다."));
  }, []);

  // 댓글 목록 불러오기
  useEffect(() => {
    if (selectedProblemId) {
      getCommentsAPI(selectedProblemId)
        .then((data) => {
          const processed = data.map((c: any) => ({
            ...c,
            isOwn: c.username === currentUser,
          }));

          setComments((prev) => ({
            ...prev,
            [selectedProblemId]: processed,
          }));
        })
        .catch(() => toast.error("댓글 목록을 불러오지 못했습니다."));
    }
  }, [selectedProblemId, currentUser]);

  // 공감하기
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

  // 로그인
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await loginAPI(email, password);
      const { token, user } = res;
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

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentUser("");
    setIsAdmin(false);
    setIsMyPageOpen(false); // ✅ 로그아웃 시 마이페이지 닫기
    toast.success("로그아웃되었습니다.");

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // 회원가입
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

  // 댓글 작성
  const handleAddComment = async (content: string) => {
    if (!selectedProblemId) return;
    try {
      const newComment = await createCommentAPI(selectedProblemId, content);
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

  // 댓글 삭제
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

  // 상태 변경 (관리자)
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
    } catch {
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
        onMyPageClick={() => setIsMyPageOpen(true)} // 마이페이지 열기
        isLoggedIn={isLoggedIn}
        username={currentUser}
      />

      <main className="container px-4 py-8 md:py-12">
        {isMyPageOpen ? (
          <MyPage onBack={() => setIsMyPageOpen(false)} />
        ) : selectedProblem ? (
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
            onEditProblem={handleEditProblem}
            onDeleteProblem={handleDeleteProblem}
          />
        ) :  (
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

            {problems.some((p) => p.isOverdue) && (
              <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <p className="font-semibold text-red-700">
                      아직 해결되지 않은 문제가 있어요!
                    </p>
                    <p className="text-sm text-red-600">
                      일주일 이상 경과한 문제는 빠른 시일 내에 처리될 수 있도록 확인해주세요.
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4 max-h-[280px] overflow-y-auto pr-1">
                  {problems
                    .filter((p) => p.isOverdue)
                    .map((problem) => (
                      <div
                        key={problem.id}
                        className="scale-[0.9] transform"
                        style={{ minHeight: "180px" }}
                      >
                        <ProblemCard
                          problem={problem}
                          onVote={handleVote}
                          onClick={setSelectedProblemId}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            <ProblemList
              problems={problems}
              onVote={handleVote}
              onProblemClick={setSelectedProblemId}
            />
          </div>
        )}
      </main>

      {/* 신고 다이얼로그 */}
      <CreateProblemDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleProblemUpdated}
      />

      {editingProblem && (
        <EditProblemDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          problem={editingProblem}
          onSubmit={handleSubmitEdit}
        />
      )}

      {/* 로그인 / 회원가입 다이얼로그 */}
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
