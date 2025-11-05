import { Button } from "./ui/button";
import { PlusCircle, User, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface NavbarProps {
  onCreateClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  isLoggedIn: boolean;
  username?: string;
}

export function Navbar({ onCreateClick, onLoginClick, onLogoutClick, isLoggedIn, username }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
            <span className="text-xl">🏫</span>
          </div>
          <div>
            <h1 className="text-lg">School Problem Reporter</h1>
            <p className="text-xs text-muted-foreground">학교 시설 문제 신고</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Button onClick={onCreateClick} className="gap-2 shadow-sm">
                <PlusCircle className="h-4 w-4" />
                문제 신고
              </Button>
              <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm">{username}</span>
              </div>
              <Button
                variant="outline"
                onClick={onLogoutClick} //  로그아웃 이벤트 연결
                className="shadow-sm"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Button onClick={onLoginClick}>
              로그인
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn && (
            <Button onClick={onCreateClick} size="sm" className="gap-2 shadow-sm">
              <PlusCircle className="h-4 w-4" />
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mt-8 flex flex-col gap-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span>{username}</span>
                    </div>
                    <Button onClick={onCreateClick} className="w-full gap-2">
                      <PlusCircle className="h-5 w-5" />
                      문제 신고
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onLogoutClick} //  로그아웃 이벤트 연결
                      className="w-full"
                    >
                      로그아웃
                    </Button>

                  </>
                ) : (
                  <Button onClick={onLoginClick} className="w-full">
                    로그인
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
