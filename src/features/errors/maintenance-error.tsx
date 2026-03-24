import { Button } from "@/components/ui/button";

export default function MaintenanceError() {
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">503</h1>
        <span className="font-medium">서비스 점검 중입니다!</span>
        <p className="text-muted-foreground text-center">
          현재 시스템 점검으로 인해 서비스를 이용하실 수 없습니다. <br />
          빠른 시일 내에 정상 서비스를 제공하겠습니다.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline">자세히 보기</Button>
        </div>
      </div>
    </div>
  );
}
