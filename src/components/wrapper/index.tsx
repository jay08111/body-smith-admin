import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import useProjectQuery from "@/hooks/cache/use-project-query";
import ForbiddenError from "@/features/errors/forbidden";
import { TOKEN_STRING } from "@/config/vars";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { APP_NAME } from "@/config/vars";

const Wrapper = ({ children }: React.PropsWithChildren<{}>) => {
  const location = useLocation();
  const _pathname = location.pathname;
  const isSignIn = _pathname === "/sign-in";
  const token = localStorage.getItem(TOKEN_STRING);
  const isProjectQueryEnabled = !isSignIn && !!token;
  const { projectInfo, projectPm, isProjectPmLoading } = useProjectQuery({
    enabled: isProjectQueryEnabled,
  });

  useEffect(() => {
    const title = document.querySelector("title");

    if (!title) {
      return;
    }

    if (isSignIn) {
      title.textContent = `로그인 - ${APP_NAME}`;
    } else {
      title.textContent = projectInfo?.name
        ? `${projectInfo.name} - 관리자 페이지`
        : APP_NAME;
    }
  }, [isSignIn, projectInfo?.name]);

  if (!isSignIn && token && projectPm?.hasPermission === false) {
    return <ForbiddenError />;
  }

  if (!isSignIn && token && isProjectPmLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Card className="w-full max-w-lg border-muted/50">
          <CardContent className="flex items-center gap-5 p-8">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold">권한 확인 중</p>
              <p className="text-sm text-muted-foreground">
                보안을 위해 현재 계정의 접근 권한을 확인하고 있습니다.
              </p>
              <p className="text-sm text-muted-foreground">잠시만 기다려 주세요.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default Wrapper;
