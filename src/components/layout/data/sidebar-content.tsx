import {
  IconLayoutDashboard,
  IconArticle,
} from "@tabler/icons-react";
import { type SidebarData } from "../types";
import { NavGroup } from "@/components/layout/nav-group";
import {
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import useProjectQuery from "@/hooks/cache/use-project-query";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  IconLayoutDashboard,
  IconArticle,
};
const processMenuItems = (items: any[]): any[] => {
  return items.map((item) => ({
    ...item,
    url: typeof item.url === "string" ? item.url : item.url,
    icon:
      item.icon && ICON_MAP[String(item.icon)]
        ? ICON_MAP[String(item.icon)]
        : undefined,
    items: item.items ? processMenuItems(item.items) : undefined,
  }));
};

export default function RenderSidebarContent() {
  const { projectInfo } = useProjectQuery();

  const sidebarData: SidebarData = {
    navGroups: [
      {
        items: [
          { title: "블로그", url: "/", icon: IconArticle },
          ...(projectInfo?.attribute
            ? processMenuItems(projectInfo.attribute)
            : []),
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
