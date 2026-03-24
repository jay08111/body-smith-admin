import { IconArticle } from "@tabler/icons-react";
import { type SidebarData } from "../types";
import { NavGroup } from "@/components/layout/nav-group";
import { SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/layout/team-switcher";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  IconArticle,
};

export default function RenderSidebarContent() {
  const sidebarData: SidebarData = {
    navGroups: [
      {
        items: [
          {
            title: "블로그",
            icon: IconArticle,
            url: "/posts",
          },
        ],
      },
    ],
  };

  return (
    <>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {sidebarData.navGroups.map((props, index) => (
          <NavGroup key={index} {...props} />
        ))}
      </SidebarContent>
    </>
  );
}
