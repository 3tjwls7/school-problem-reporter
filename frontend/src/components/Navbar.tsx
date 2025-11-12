import { Button } from "./ui/button";
import { PlusCircle, User, Menu, LogOut, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";

interface NavbarProps {
  onCreateClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onMyPageClick: () => void;
  isLoggedIn: boolean;
  username?: string;
}

export function Navbar({
  onCreateClick,
  onLoginClick,
  onLogoutClick,
  onMyPageClick,
  isLoggedIn,
  username,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary/10 via-background to-primary/10 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* 로고 영역 */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => window.location.reload()}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
            <span className="text-xl text-primary-foreground">🏫</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">
              School Problem Reporter
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">
              학교 시설 문제 신고 플랫폼
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Button
                variant="secondary"
                onClick={onCreateClick}
                className="gap-2 hover:scale-[1.02] transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                문제 신고
              </Button>

              <Button
                variant="outline"
                onClick={onMyPageClick}
                className="gap-2 border-primary/40 hover:bg-primary/10 transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                마이페이지
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2 rounded-full border bg-secondary px-4 py-1.5 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-medium">
                  {username ? username.charAt(0).toUpperCase() : "?"}
                </div>
                <span className="text-sm font-medium">{username}</span>
              </div>

              <Button
                variant="ghost"
                onClick={onLogoutClick}
                className="gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </>
          ) : (
            <Button
              onClick={onLoginClick}
              className="bg-primary text-primary-foreground px-5 hover:brightness-105 transition-all"
            >
              로그인
            </Button>
          )}
        </div>

        {/* 모바일 메뉴 */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shadow-sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6 space-y-5">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 rounded-lg border bg-secondary p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{username}</p>
                      <p className="text-xs text-muted-foreground">로그인됨</p>
                    </div>
                  </div>

                  <Button
                    onClick={onMyPageClick}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    마이페이지
                  </Button>

                  <Button
                    onClick={onCreateClick}
                    className="w-full gap-2 bg-primary text-primary-foreground hover:brightness-105"
                  >
                    <PlusCircle className="h-5 w-5" />
                    문제 신고
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={onLogoutClick}
                    className="w-full gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <Button
                  onClick={onLoginClick}
                  className="w-full bg-primary text-primary-foreground hover:brightness-105"
                >
                  로그인
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
