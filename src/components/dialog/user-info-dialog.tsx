import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, UserIcon, Building2Icon, EditIcon, EyeIcon, EyeOffIcon } from "lucide-react";

import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { format, parseISO } from "date-fns";
import useUserQuery from "@/hooks/cache/use-user-query";

const userInfoSchema = z.object({
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .max(100, "비밀번호는 100자를 초과할 수 없습니다")
    .optional()
    .or(z.literal("")),
});

type UserInfoFormData = z.infer<typeof userInfoSchema>;

interface UserInfoDialogProps {
  trigger?: React.ReactNode;
  onModalOpen?: () => void;
}

export function UserInfoDialog({ trigger, onModalOpen }: UserInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // React Query 훅 사용
  const { userInfo, isLoading, updateUser, isUpdating } = useUserQuery();

  const form = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      password: "",
    },
  });

  const {
    formState: { isDirty, errors },
  } = form;

  // 폼 제출
  const onSubmit = (data: UserInfoFormData) => {
    // 비밀번호가 비어있으면 업데이트 하지 않음
    if (data.password && data.password.trim() !== "") {
      const updateData = { password: data.password };
      updateUser(updateData);
      setOpen(false);
    }
  };

  // 디바운스된 폼 제출
  const debouncedSubmit = useDebouncedCallback(() => {
    form.handleSubmit(onSubmit)();
  }, 200);

  // userInfo가 변경될 때 폼 리셋
  useEffect(() => {
    if (userInfo) {
      form.reset({
        password: "",
      });
    }
  }, [userInfo, form]);

  // 모달이 열릴 때 데이터 로드
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // 모달이 열릴 때 부모 컴포넌트에 알림 (드롭다운 닫기용)
      onModalOpen?.();
    } else {
      // 모달이 닫힐 때 폼 리셋
      form.reset({
        password: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center space-x-2">
            <EditIcon className="h-4 w-4" />
            <span>계정 정보 수정</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            계정 정보
          </DialogTitle>
          <DialogDescription>
            사용자 계정 정보를 확인하고 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        ) : userInfo ? (
          <div className="space-y-6">
            {/* 읽기 전용 정보 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UserIcon className="h-4 w-4" />
                기본 정보
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">계정명</label>
                  <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                    <Badge variant="secondary">{userInfo.account}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">생성일</label>
                  <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(
                        parseISO(userInfo.created_at.toString()),
                        "yyyy-MM-dd"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {userInfo.project && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">프로젝트</label>
                  <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                    <Building2Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {userInfo.project.name || "프로젝트 이름 없음"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* 수정 가능한 폼 */}
            <div className="space-y-4">
              <div className="text-sm font-medium">비밀번호 변경</div>
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    debouncedSubmit();
                  }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="새 비밀번호 (변경하지 않으려면 비워두세요)"
                              {...field}
                              className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <EyeIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-sm">
                          비밀번호를 변경하려면 새 비밀번호를 입력하세요.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              사용자 정보를 찾을 수 없습니다.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={() => debouncedSubmit()}
            disabled={!isDirty || isUpdating || isLoading}
            className="flex items-center space-x-2"
          >
            <span>{isUpdating ? "저장 중..." : "저장"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
