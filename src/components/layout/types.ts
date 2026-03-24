import { LinkProps } from "@tanstack/react-router";

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  order?: number;
}

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items?: (BaseNavItem & { url: string })[];
  url?: string;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  title?: string;
  items: NavItem[];
}

interface SidebarData {
  // teams: Team[];
  navGroups: NavGroup[];
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink };
