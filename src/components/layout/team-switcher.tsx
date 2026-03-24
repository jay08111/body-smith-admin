import { Command } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useProjectQuery from "@/hooks/cache/use-project-query";
import useUserQuery from "@/hooks/cache/use-user-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { TOKEN_STRING } from "@/config/vars";

export function TeamSwitcher() {
  const navigate = useNavigate();
  const { projectInfo } = useProjectQuery();
  const { userInfo } = useUserQuery();

  const onClickPushSignOut = () => {
    localStorage.removeItem(TOKEN_STRING);
    navigate({ to: "/sign-in" });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/40 p-3">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-lg">
            <Command className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {projectInfo?.name || "Body Smith"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {userInfo?.email || "admin@bodysmith.com"}
            </p>
          </div>
        </div>
        <Button className="mt-3 w-full" variant="outline" onClick={onClickPushSignOut}>
          로그아웃
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
