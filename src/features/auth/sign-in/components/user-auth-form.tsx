import { HTMLAttributes, useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { postLogin } from "@/lib/api/auth";
import { toast } from "sonner";
import { PROJECT_KEYS, USER_KEYS } from "@/hooks/cache/query-keys";
import { TOKEN_STRING } from "@/config/vars";
import { handleServerError } from "@/utils/handle-server-error";

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>;

const REMEMBER_EMAIL_KEY = "remembered_email";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  rememberEmail: z.boolean(),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberEmail: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      toast.dismiss(); // 이전 토스트 메시지 제거
      const response = await postLogin({
        email: data.email,
        password: data.password,
      });

      if (!response.access_token && response.code) {
        toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      if (response.access_token) {
        localStorage.setItem(TOKEN_STRING, response.access_token);
        invalidateProjectInfoQuries();

        if (data.rememberEmail) {
          localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
        } else {
          localStorage.removeItem(REMEMBER_EMAIL_KEY);
        }

        navigate({ to: "/", replace: true });
      }
    } catch (error) {
      handleServerError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 시 캐시 비울 정보
  const invalidateProjectInfoQuries = () => {
    const _qArr = [PROJECT_KEYS.PROJECT_INFO, PROJECT_KEYS.PROJECT_PERMISSION, USER_KEYS.USER_INFO];
    for (const v of _qArr) {
      queryClient.invalidateQueries({ queryKey: [v] });
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      form.setValue("rememberEmail", true);
    }
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberEmail"
          render={({ field }) => (
            <FormItem className="flex items-center space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal cursor-pointer">
                이메일 기억하기
              </FormLabel>
            </FormItem>
          )}
        />

        <Button className="mt-2" disabled={isLoading}>
          로그인
        </Button>
      </form>
    </Form>
  );
}
