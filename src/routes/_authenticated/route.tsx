import { createFileRoute } from "@tanstack/react-router";
import { SidebarLayout } from "@/components/layout/sidebar-layout";

export const Route = createFileRoute("/_authenticated")({
  component: SidebarLayout,
});
