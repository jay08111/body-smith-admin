import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import HeaderMenu from "@/components/header-menu";

import { PostForm } from "./post-form";

export function CreatePostPage() {
  return (
    <>
      <Header>
        <div>
          <h1 className="text-base font-semibold">게시글 작성</h1>
          <p className="text-sm text-muted-foreground">
            새 블로그 게시글을 작성합니다.
          </p>
        </div>
        <HeaderMenu />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 md:gap-6">
        <PostForm mode="create" />
      </Main>
    </>
  );
}
