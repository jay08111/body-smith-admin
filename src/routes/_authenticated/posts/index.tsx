import { createFileRoute } from "@tanstack/react-router";

import { PostListPage } from "@/features/posts/list-page";

export const Route = createFileRoute("/_authenticated/posts/")({
  component: PostListPage,
});
