import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import HeaderMenu from "@/components/header-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TOKEN_STRING } from "@/config/vars";
import { deletePost, getAdminPosts } from "@/lib/api/post";
import type { PostItem } from "@/lib/api/post/dto";

const POSTS_QUERY_KEY = "body-smith-posts";
const PER_PAGE = 10;

export function PostListPage() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem(TOKEN_STRING) ?? "";
  const [page, setPage] = useState(1);

  const postsQuery = useQuery({
    queryKey: [POSTS_QUERY_KEY, page],
    queryFn: () => getAdminPosts(token, page, PER_PAGE),
    enabled: Boolean(token),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePost(token, id),
    onSuccess: () => {
      toast.success("게시글을 삭제했습니다.");
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? "게시글 삭제에 실패했습니다.");
    },
  });

  const posts = postsQuery.data?.items ?? [];
  const totalPages = postsQuery.data?.total_pages ?? 1;

  function onDelete(post: PostItem) {
    if (!window.confirm(`"${post.title}" 게시글을 삭제할까요?`)) {
      return;
    }
    deleteMutation.mutate(post.id);
  }

  return (
    <>
      <Header>
        <div>
          <h1 className="text-base font-semibold">블로그 목록</h1>
          <p className="text-sm text-muted-foreground">
            게시글 목록을 확인하고 수정, 삭제할 수 있습니다.
          </p>
        </div>
        <HeaderMenu />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <FileText className="size-4" />
                전체 게시글
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{postsQuery.data?.total ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Plus className="size-4" />
                바로가기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/posts/new">새 게시글 작성</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>게시글 목록</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                최신 글 순으로 정렬됩니다.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/posts/new">새 글 작성</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>슬러그</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postsQuery.isLoading ? (
                  <TableRow>
                    <TableCell className="py-10 text-center text-muted-foreground" colSpan={4}>
                      게시글을 불러오는 중입니다.
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-10 text-center text-muted-foreground" colSpan={4}>
                      아직 등록된 게시글이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="max-w-[320px]">
                        <div className="flex flex-col gap-1">
                          <Link
                            to="/posts/$postId/edit"
                            params={{ postId: String(post.id) }}
                            className="truncate font-medium hover:underline"
                          >
                            {post.title}
                          </Link>
                          {post.meta_title ? (
                            <span className="truncate text-xs text-muted-foreground">
                              SEO: {post.meta_title}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.slug}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(post.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDelete(post)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                총 {postsQuery.data?.total ?? 0}개 게시글
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  이전
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  다음
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
