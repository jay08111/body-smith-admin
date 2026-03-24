import { createFileRoute } from "@tanstack/react-router";

import { EditPostPage } from "@/features/posts/edit-page";

export const Route = createFileRoute("/_authenticated/posts/$postId/edit")({
  component: EditPostPage,
});
