import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import HeaderMenu from "@/components/header-menu";
import { Card, CardContent } from "@/components/ui/card";
import { TOKEN_STRING } from "@/config/vars";
import { getAdminPost } from "@/lib/api/post";

import { PostForm } from "./post-form";

export function EditPostPage() {
  const { postId } = useParams({ from: "/_authenticated/posts/$postId/edit" });
  const token = localStorage.getItem(TOKEN_STRING) ?? "";

  const postQuery = useQuery({
    queryKey: ["body-smith-post", postId],
    queryFn: () => getAdminPost(token, Number(postId)),
    enabled: Boolean(token),
  });

  return (
    <>
      <Header>
        <div>
          <h1 className="text-base font-semibold">게시글 수정</h1>
          <p className="text-sm text-muted-foreground">
            기존 블로그 게시글을 수정합니다.
          </p>
        </div>
        <HeaderMenu />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 md:gap-6">
        {postQuery.isLoading ? (
          <Card className="shadow-none">
            <CardContent className="py-10 text-center text-muted-foreground">
              게시글을 불러오는 중입니다.
            </CardContent>
          </Card>
        ) : postQuery.data ? (
          <PostForm mode="edit" post={postQuery.data} />
        ) : (
          <Card className="shadow-none">
            <CardContent className="py-10 text-center text-muted-foreground">
              게시글을 찾을 수 없습니다.
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  );
}
