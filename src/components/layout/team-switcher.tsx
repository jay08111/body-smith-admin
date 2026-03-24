import { Command, LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useProjectQuery from "@/hooks/cache/use-project-query";
import useUserQuery from "@/hooks/cache/use-user-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { TOKEN_STRING } from "@/config/vars";

export function TeamSwitcher() {
  const navigate = useNavigate();
  const { state, isMobile } = useSidebar();
  const { projectInfo } = useProjectQuery();
  const { userInfo } = useUserQuery();
  const isCollapsed = state === "collapsed" && !isMobile;

  const onClickPushSignOut = () => {
    localStorage.removeItem(TOKEN_STRING);
    navigate({ to: "/sign-in" });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className={`flex rounded-xl border border-sidebar-border/60 bg-sidebar-accent/40 p-3 ${
            isCollapsed ? "justify-center" : "items-center gap-3"
          }`}
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-9 shrink-0 items-center justify-center rounded-lg">
            <Command className="size-4" />
          </div>
          {!isCollapsed ? (
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold">
                {projectInfo?.name || "Body Smith"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {userInfo?.email || "admin@bodysmith.com"}
              </p>
            </div>
          ) : null}
        </div>
        <Button
          className={`mt-3 ${isCollapsed ? "size-9 px-0" : "w-full"}`}
          variant="outline"
          onClick={onClickPushSignOut}
          title="로그아웃"
        >
          <LogOut className="size-4 shrink-0" />
          {!isCollapsed ? <span>로그아웃</span> : <span className="sr-only">로그아웃</span>}
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
