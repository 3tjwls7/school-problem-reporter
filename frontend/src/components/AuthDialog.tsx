import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Checkbox } from "./ui/checkbox";

interface AuthDialogProps {
  open: boolean;                            // 모달 열림 여부
  onOpenChange: (open: boolean) => void;    // 모달 ON/OFF 제어
  onLogin: (username: string, password: string) => void;  // 로그인 핸들러 (부모로 전달)
  onSignup: (username: string, email: string, password: string, isAdmin: boolean) => void;  // 회원가입 핸들러
}

export function AuthDialog({
  open,
  onOpenChange,
  onLogin,
  onSignup,
}: AuthDialogProps) {
  // 입력값 상태 관리
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // 로그인 제출 처리
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 기본 유효성 검사
    if (loginUsername && loginPassword) {
      onLogin(loginUsername, loginPassword);  // 부모 컴포넌트(App)로 전달
      setLoginUsername("");
      setLoginPassword("");
    } else {
      alert("이메일과 비밀번호를 입력해주세요.");
    }
  };

  // 회원가입 제출 처리
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // 기본 유효성 검사
    if (signupUsername && signupEmail && signupPassword) {
      onSignup(signupUsername, signupEmail, signupPassword, isAdmin);
      // 입력값 초기화
      setSignupUsername("");
      setSignupEmail("");
      setSignupPassword("");
      setIsAdmin(false);
    } else {
      alert("모든 필드를 입력해주세요.");
    }
  };

  return (
    // 로그인/회원가입 모달 컴포넌트
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          fixed top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2
          bg-background border shadow-lg rounded-xl sm:max-w-[425px] p-6
        "
      >
        {/* 모달 상단 타이틀 영역 */}
        <DialogHeader>
          <DialogTitle>로그인 / 회원가입</DialogTitle>
          <DialogDescription>
            학교 계정으로 로그인하거나 새로운 계정을 만드세요.
          </DialogDescription>
        </DialogHeader>
        {/* 탭: 로그인 / 회원가입 전환 */}
        <Tabs defaultValue="login" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 p-1">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>

          {/* 로그인 탭 */}
          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-username">이메일</Label>
                <Input
                  id="login-username"
                  placeholder="이메일을 입력하세요"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">비밀번호</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="border-2"
                />
              </div>
              <Button type="submit" className="w-full shadow-sm" size="lg">
                로그인
              </Button>
            </form>
          </TabsContent>

          {/* 회원가입 탭 */}
          <TabsContent value="signup" className="mt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">아이디</Label>
                <Input
                  id="signup-username"
                  placeholder="아이디를 입력하세요"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">이메일</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">비밀번호</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="flex items-center space-x-2 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <Checkbox 
                  id="admin-checkbox" 
                  checked={isAdmin}
                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                    setIsAdmin(checked === true)
                  }
                />
                <Label 
                  htmlFor="admin-checkbox" 
                  className="cursor-pointer text-sm"
                >
                  관리자 계정으로 가입 (문제 상태를 관리할 수 있습니다)
                </Label>
              </div>
              <Button type="submit" className="w-full shadow-sm" size="lg">
                회원가입
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
