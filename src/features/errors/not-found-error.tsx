import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TOKEN_STRING } from "@/config/vars";

export default function NotFoundError() {
  const router = useRouter();
  const { history } = router;

  const onClickLogout = () => {
    localStorage.removeItem(TOKEN_STRING);
    router.navigate({ to: "/sign-in" });
  };

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">404</h1>
        <span className="font-medium">페이지를 찾을 수 없습니다.</span>
        <p className="text-muted-foreground text-center">
          요청하신 페이지가 존재하지 않거나 <br />
          삭제되었을 수 있습니다.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
            이전 페이지로 돌아가기
          </Button>
          <Button onClick={onClickLogout}>로그아웃</Button>
        </div>
      </div>
    </div>
  );
}
