import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import RichTextEditor from "@/components/text-editor";
import HeaderMenu from "@/components/header-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { TOKEN_STRING } from "@/config/vars";
import {
  createPost,
  deletePost,
  getAdminPosts,
  updatePost,
} from "@/lib/api/post";
import type { PostItem, PostPayload } from "@/lib/api/post/dto";

const POSTS_QUERY_KEY = "body-smith-posts";
const PER_PAGE = 10;

const postFormSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해주세요."),
  content: z.string().trim().min(1, "본문을 입력해주세요."),
  thumbnail: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

const emptyValues: PostFormValues = {
  title: "",
  content: "",
  thumbnail: "",
  meta_title: "",
  meta_description: "",
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem(TOKEN_STRING) ?? "";
  const [page, setPage] = useState(1);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: emptyValues,
  });

  const postsQuery = useQuery({
    queryKey: [POSTS_QUERY_KEY, page],
    queryFn: () => getAdminPosts(token, page, PER_PAGE),
    enabled: Boolean(token),
  });

  const createMutation = useMutation({
    mutationFn: (payload: PostPayload) => createPost(token, payload),
    onSuccess: () => {
      toast.success("게시글을 생성했습니다.");
      resetEditor();
      invalidatePosts();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? "게시글 생성에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PostPayload }) =>
      updatePost(token, id, payload),
    onSuccess: () => {
      toast.success("게시글을 수정했습니다.");
      resetEditor();
      invalidatePosts();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? "게시글 수정에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePost(token, id),
    onSuccess: () => {
      toast.success("게시글을 삭제했습니다.");
      invalidatePosts();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? "게시글 삭제에 실패했습니다.");
    },
  });

  useEffect(() => {
    if (!editingPost) {
      form.reset(emptyValues);
      return;
    }

    form.reset({
      title: editingPost.title,
      content: editingPost.content,
      thumbnail: editingPost.thumbnail ?? "",
      meta_title: editingPost.meta_title,
      meta_description: editingPost.meta_description,
    });
  }, [editingPost, form]);

  const posts = postsQuery.data?.items ?? [];
  const totalPages = postsQuery.data?.total_pages ?? 1;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  function invalidatePosts() {
    queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
  }

  function resetEditor() {
    setEditingPost(null);
    form.reset(emptyValues);
  }

  function onEdit(post: PostItem) {
    setEditingPost(post);
  }

  function onDelete(post: PostItem) {
    if (!window.confirm(`"${post.title}" 게시글을 삭제할까요?`)) {
      return;
    }
    deleteMutation.mutate(post.id);
  }

  function onSubmit(values: PostFormValues) {
    const payload: PostPayload = {
      title: values.title.trim(),
      content: values.content.trim(),
      thumbnail: values.thumbnail?.trim() || null,
      meta_title: values.meta_title?.trim() || values.title.trim(),
      meta_description: values.meta_description?.trim() || "",
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, payload });
      return;
    }

    createMutation.mutate(payload);
  }

  return (
    <>
      <Header>
        <div>
          <h1 className="text-base font-semibold">블로그 관리</h1>
          <p className="text-sm text-muted-foreground">
            게시글 작성, 수정, 삭제와 공개 블로그 노출 정보를 관리합니다.
          </p>
        </div>
        <HeaderMenu />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-3">
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
                <Edit3 className="size-4" />
                현재 상태
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {editingPost ? "게시글 수정 중" : "새 게시글 작성 중"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Plus className="size-4" />
                페이지
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {page} / {Math.max(totalPages, 1)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(380px,0.8fr)]">
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>게시글 목록</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  최신 글 순으로 정렬됩니다.
                </p>
              </div>
              <Button variant="outline" onClick={resetEditor}>
                새 글 작성
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
                        <TableCell className="max-w-[280px]">
                          <div className="flex flex-col gap-1">
                            <span className="truncate font-medium">{post.title}</span>
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
                            <Button size="sm" variant="outline" onClick={() => onEdit(post)}>
                              수정
                            </Button>
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

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>{editingPost ? "게시글 수정" : "새 게시글 작성"}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  저장 시 슬러그는 백엔드에서 자동 생성됩니다.
                </p>
              </div>
              {editingPost ? <Badge>Editing</Badge> : null}
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제목</FormLabel>
                        <FormControl>
                          <Input placeholder="지속 가능한 운동 루틴 만들기" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>본문</FormLabel>
                        <FormControl>
                          <div className="overflow-hidden rounded-md border">
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              height="460px"
                              placeholder="게시글 본문을 입력하세요."
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>썸네일 URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO 제목</FormLabel>
                        <FormControl>
                          <Input placeholder="검색 엔진 노출용 제목" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO 설명</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-24"
                            placeholder="검색 결과에 노출될 설명"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button disabled={isSaving} type="submit">
                      {editingPost ? "수정 저장" : "게시글 생성"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetEditor}>
                      초기화
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
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
