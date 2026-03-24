import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { APP_NAME } from "@/config/vars";

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex justify-center pb-2 mx-1">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
