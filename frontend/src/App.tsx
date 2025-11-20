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
import { EditProblemDialog } from "./components/EditProblemDialog";
import { MyPage } from "./components/MyPage";
import { ProblemCard } from "./components/ProblemCard";

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

import axiosAuth from "./api/axiosAuth";

export default function App() {
  // 전역 상태 관리
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
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);

  // 문제 목록 갱신
  const handleProblemUpdated = async () => {
    try {
      const list = await getProblemsAPI();
      setProblems(list);
    } catch {
      toast.error("문제 목록 로딩 실패");
    }
  };

  // 문제 삭제
  const handleDeleteProblem = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await deleteProblemAPI(id);
      setProblems((prev) => prev.filter((p) => p.id !== id));
      toast.success(res.message || "삭제되었습니다!");

      setSelectedProblemId(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "삭제 실패");
    }
  };

  // 문제 수정 제출
  const handleSubmitEdit = async (updatedData: {
    title: string;
    description: string;
    location: string;
    image?: File | null;
  }) => {
    if (!editingProblem) return;

    try {
      // FormData 구성
      const formData = new FormData();
      formData.append("title", updatedData.title);
      formData.append("description", updatedData.description);
      formData.append("location", updatedData.location);
      if (updatedData.image) formData.append("image", updatedData.image);

      const updated = await updateProblemAPI(editingProblem.id, formData);

      // UI 업데이트
      setProblems((prev) =>
        prev.map((p) =>
          p.id === editingProblem.id
            ? { ...p, ...updated, imageUrl: `${updated.imageUrl}?t=${Date.now()}` }
            : p
        )
      );

      toast.success("문제가 수정되었습니다!");

      setIsEditDialogOpen(false);
      setSelectedProblemId(null);

      setTimeout(handleProblemUpdated, 300);
    } catch {
      toast.error("수정 실패");
    }
  };

  // 로그인 상태 체크 + 문제 목록 로딩
  useEffect(() => {
    const token = localStorage.getItem("token");

    // 로그인 검증
    if (token) {
      axiosAuth
        .get("/auth/verify")
        .then((res) => {
          setIsLoggedIn(true);
          setCurrentUser(res.data.user.username);
          setIsAdmin(res.data.user.role === "admin");
        })
        .catch(() => localStorage.removeItem("token"));
    }

    handleProblemUpdated();
  }, []);

  // 문제 상세 → 댓글 목록 로딩
  useEffect(() => {
    if (!selectedProblemId) return;

    getCommentsAPI(selectedProblemId)
      .then((data) => {
        const mapped = data.map((c: any) => ({
          ...c,
          isOwn: c.username === currentUser, // 본인 댓글 여부
        }));

        setComments((prev) => ({
          ...prev,
          [selectedProblemId]: mapped,
        }));
      })
      .catch(() => toast.error("댓글 로딩 실패"));
  }, [selectedProblemId, currentUser]);

  // 공감 처리
  const handleVote = async (id: number) => {
    try {
      const result = await toggleVoteAPI(id);

      // votes + voted 상태 업데이트
      setProblems((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, votes: result.votes, hasVoted: result.voted } : p
        )
      );

      toast.success(result.message);
    } catch {
      toast.error("공감 실패");
    }
  };

  // 로그인
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await loginAPI(email, password);

      localStorage.setItem("token", res.accessToken);
      setIsLoggedIn(true);
      setCurrentUser(res.user.username);
      setIsAdmin(res.user.role === "admin");

      setIsAuthDialogOpen(false);
      toast.success(`${res.user.username}님 환영합니다!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "로그인 실패");
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await axiosAuth.post("/auth/logout");
    } catch {}

    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentUser("");
    setIsAdmin(false);
    setIsMyPageOpen(false);

    toast.success("로그아웃되었습니다.");

    // 상태 초기화를 위해 새로고침
    setTimeout(() => window.location.reload(), 300);
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
      toast.success("회원가입 완료!");
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

      setComments((prev) => ({
        ...prev,
        [selectedProblemId]: [
          ...(prev[selectedProblemId] || []),
          { ...newComment, isOwn: true },
        ],
      }));

      toast.success("댓글 작성 완료");
    } catch {
      toast.error("댓글 작성 실패");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!selectedProblemId) return;

    try {
      await deleteCommentAPI(selectedProblemId, commentId);

      setComments((prev) => ({
        ...prev,
        [selectedProblemId]: prev[selectedProblemId].filter(
          (c) => c.id !== commentId
        ),
      }));

      toast.success("댓글 삭제 완료");
    } catch {
      toast.error("댓글 삭제 실패");
    }
  };

  // 관리자: 문제 상태 변경
  const handleStatusChange = async (
    id: number,
    newStatus: "pending" | "in-progress" | "resolved"
  ) => {
    try {
      const res = await updateProblemStatusAPI(id, newStatus);
      setProblems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: res.status } : p))
      );
      toast.success("상태 변경 완료");
    } catch {
      toast.error("상태 변경 실패");
    }
  };
  // 현재 선택한 문제 객체
  const selectedProblem = problems.find((p) => p.id === selectedProblemId);

  // UI 렌더링
  return (
    <div className="min-h-screen bg-background">
      {/* 네비바 */}
      <Navbar
        onCreateClick={() => {
          if (!isLoggedIn) {
            toast.error("로그인이 필요합니다.");
            setIsAuthDialogOpen(true);
          } else setIsCreateDialogOpen(true);
        }}
        onLoginClick={() => setIsAuthDialogOpen(true)}
        onLogoutClick={handleLogout}
        onMyPageClick={() => setIsMyPageOpen(true)}
        isLoggedIn={isLoggedIn}
        username={currentUser}
      />

        <main className="container px-4 py-8">

          {/* 마이페이지 */}
          {isMyPageOpen ? (
            <MyPage onBack={() => setIsMyPageOpen(false)} />
          ) : 
          /* 문제 상세 화면 */
          selectedProblem ? (
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
              onEditProblem={(id: number, p: Problem) => {
                setEditingProblem(p);
                setIsEditDialogOpen(true);
              }}
              onDeleteProblem={handleDeleteProblem}
            />

          ) : (
            // 기본 화면(문제 목록 + overdue 영역)
            <div className="space-y-8">
              {/* 상단 안내 카드 */}
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
              {/* 해결되지 않은 문제(overdue) 영역 */}
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
  

              {/* 전체 문제 리스트 */}
              <ProblemList
                problems={problems}
                onVote={handleVote}
                onProblemClick={setSelectedProblemId}
              />
            </div>
          )}

        </main>

      {/* 문제 작성 모달 */}
      <CreateProblemDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleProblemUpdated}
      />
      {/* 문제 수정 모달 */}
      {editingProblem && (
        <EditProblemDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          problem={editingProblem}
          onSubmit={handleSubmitEdit}   // 수정 핸들러 연결
        />
      )}
      {/* 로그인/회원가입 모달 */}
      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
      {/* 전역 Toast UI */}
      <Toaster />
    </div>
  );
}
