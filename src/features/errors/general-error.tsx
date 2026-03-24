import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean;
}

export default function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const router = useRouter();
  const { history } = router;
  return (
    <div className={cn("h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && (
          <h1 className="text-[7rem] leading-tight font-bold">500</h1>
        )}
        <span className="font-medium">문제가 발생했습니다 {`:')`}</span>
        <p className="text-muted-foreground text-center">
          불편을 드려 죄송합니다. <br /> 잠시 후 다시 시도해주세요.
        </p>
        {!minimal && (
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => history.go(-1)}>
              이전 페이지
            </Button>
            <Button onClick={() => router.navigate({ to: "/" })}>홈으로 이동</Button>
          </div>
        )}
      </div>
    </div>
  );
}
