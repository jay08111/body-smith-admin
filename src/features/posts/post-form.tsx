import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import RichTextEditor from "@/components/text-editor";
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
import { Textarea } from "@/components/ui/textarea";
import { TOKEN_STRING } from "@/config/vars";
import { createPost, updatePost } from "@/lib/api/post";
import type { PostItem, PostPayload } from "@/lib/api/post/dto";

import { emptyPostValues, postFormSchema, type PostFormValues } from "./form-schema";

const POSTS_QUERY_KEY = "body-smith-posts";

type PostFormProps = {
  mode: "create" | "edit";
  post?: PostItem;
};

export function PostForm({ mode, post }: PostFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem(TOKEN_STRING) ?? "";

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: emptyPostValues,
  });

  useEffect(() => {
    if (!post) {
      form.reset(emptyPostValues);
      return;
    }

    form.reset({
      title: post.title,
      content: post.content,
      thumbnail: post.thumbnail ?? "",
      meta_title: post.meta_title,
      meta_description: post.meta_description,
    });
  }, [form, post]);

  const createMutation = useMutation({
    mutationFn: (payload: PostPayload) => createPost(token, payload),
    onSuccess: () => {
      toast.success("게시글을 생성했습니다.");
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
      navigate({ to: "/posts" });
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
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
      navigate({ to: "/posts" });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? "게시글 수정에 실패했습니다.");
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: PostFormValues) {
    const payload: PostPayload = {
      title: values.title.trim(),
      content: values.content.trim(),
      thumbnail: values.thumbnail?.trim() || null,
      meta_title: values.meta_title?.trim() || values.title.trim(),
      meta_description: values.meta_description?.trim() || "",
    };

    if (mode === "edit" && post) {
      updateMutation.mutate({ id: post.id, payload });
      return;
    }

    createMutation.mutate(payload);
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>{mode === "edit" ? "게시글 수정" : "새 게시글 작성"}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            저장 시 슬러그는 백엔드에서 자동 생성됩니다.
          </p>
        </div>
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
                {mode === "edit" ? "수정 저장" : "게시글 생성"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: "/posts" })}>
                취소
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
