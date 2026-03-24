import { createFileRoute } from "@tanstack/react-router";

import { CreatePostPage } from "@/features/posts/create-page";

export const Route = createFileRoute("/_authenticated/posts/new")({
  component: CreatePostPage,
});
