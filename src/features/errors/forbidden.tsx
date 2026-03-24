import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TOKEN_STRING } from "@/config/vars";

export default function ForbiddenError() {
  const router = useRouter();
  const { history } = router;

  const onClickLogout = () => {
    localStorage.removeItem(TOKEN_STRING);
    router.navigate({ to: "/sign-in" });
  };

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">403</h1>
        <span className="font-medium">접근 금지</span>
        <p className="text-muted-foreground text-center">
          이 페이지에 접근할 권한이 없습니다. <br />
          관리자에게 문의하세요.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
            이전 페이지
          </Button>
          <Button onClick={onClickLogout}>로그아웃</Button>
        </div>
      </div>
    </div>
  );
}
