import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function UnauthorisedError() {
  const router = useRouter();
  const { history } = router;
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">401</h1>
        <span className="font-medium">인증이 필요합니다</span>
        <p className="text-muted-foreground text-center">
          이 페이지에 접근하려면 <br /> 로그인이 필요합니다.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
            이전 페이지
          </Button>
          <Button onClick={() => router.navigate({ to: "/" })}>홈으로 이동</Button>
        </div>
      </div>
    </div>
  );
}
