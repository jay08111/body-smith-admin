import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { NavGroup } from "@/components/layout/nav-group";
// import { NavUser } from "@/components/layout/nav-user";
// import { TeamSwitcher } from "@/components/layout/team-switcher";
import RenderSidebarContent from "./data/sidebar-content";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <RenderSidebarContent />
      <SidebarRail />
    </Sidebar>
  );
}
