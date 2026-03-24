import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  NavLink as NavLinkType,
  NavCollapsible as NavCollapsibleType,
} from "./types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavCollapsible, NavItem, NavLink, type NavGroup } from "./types";

export function NavGroup({ title, items }: NavGroup) {
  const { state, isMobile } = useSidebar();
  const href = useLocation({ select: (location) => location.href });

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}

      <SidebarMenu>
        {items.map((item, index: number) => {
          const key = `${index}-${item.url}`;

          if (!item.items) {
            return (
              <SidebarMenuLink
                key={key}
                item={item as NavLinkType}
                href={href}
              />
            );
          }

          if (state === "collapsed" && !isMobile) {
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item as NavCollapsibleType}
                href={href}
              />
            );
          }

          return (
            <SidebarMenuCollapsible
              key={key}
              item={item as NavCollapsibleType}
              href={href}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
);

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) => {
  const { setOpenMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(() => checkIsActive(href, item));

  // URL 변경 시 활성 상태에 따라 열림 상태를 설정
  useEffect(() => {
    setIsOpen(checkIsActive(href, item));
  }, [href, item]); // href와 item이 변경될 때마다 실행

  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(href, subItem)}
                >
                  <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(href, item)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items?.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                to={sub.url}
                className={`${checkIsActive(href, sub) ? "bg-secondary" : ""}`}
              >
                {sub.icon && <sub.icon />}
                <span className="max-w-52 text-wrap">{sub.title}</span>
                {sub.badge && (
                  <span className="ml-auto text-xs">{sub.badge}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

function checkIsActive(href: string, item: NavItem, mainNav = false): boolean {
  const cleanHref = href.split("?")[0];
  const itemUrl = item.url?.split("?")[0] ?? "";

  // 하위 메뉴가 있는 경우, 하위 메뉴 중 하나라도 활성화되어 있으면 부모 메뉴도 활성화
  if (item?.items?.some((i) => checkIsActive(cleanHref, i))) {
    return true;
  }

  // 정확히 일치하는 경우
  if (cleanHref === itemUrl) {
    return true;
  }

  // 현재 경로가 메뉴 URL로 시작하는 경우 (하위 경로 포함)
  // 단, 메뉴 URL이 비어있지 않고, 경로가 / 로 구분되는 하위 경로인 경우만
  if (itemUrl && cleanHref.startsWith(itemUrl)) {
    const remainingPath = cleanHref.slice(itemUrl.length);
    // 정확히 일치하거나, / 로 시작하는 하위 경로인 경우
    return remainingPath === "" || remainingPath.startsWith("/");
  }

  return false;
}
