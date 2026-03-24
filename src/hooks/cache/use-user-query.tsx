import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserInfo, updateUserInfo } from "@/lib/api/user";
import { UpdateUserInfoRequest, UserInfoResponse } from "@/lib/api/user/dto";
import { USER_KEYS, STALE_TIME } from "@/hooks/cache/query-keys";
import { TOKEN_STRING } from "@/config/vars";
import { toast } from "sonner";

const useUserQuery = () => {
  const queryClient = useQueryClient();

  // 유저 정보 조회
  const {
    data: userInfo,
    isLoading,
    error,
    refetch,
  } = useQuery<UserInfoResponse>({
    queryKey: [USER_KEYS.USER_INFO],
    queryFn: () => {
      const token = localStorage.getItem(TOKEN_STRING);
      if (!token) {
        throw new Error("인증 토큰을 찾을 수 없습니다.");
      }
      return getUserInfo(token);
    },
    staleTime: STALE_TIME.FIVE_HOURS,
    retry: (failureCount, error) => {
      // 인증 오류시 재시도 하지 않음
      if (error?.message?.includes("401") || error?.message?.includes("인증")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // 유저 정보 업데이트
  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserInfoRequest) => {
      const token = localStorage.getItem(TOKEN_STRING);
      if (!token) {
        throw new Error("인증 토큰을 찾을 수 없습니다.");
      }
      const userInfo = await updateUserInfo(token, data);
      if (userInfo) {
        invalidateUserInfo();
      }

      return userInfo;
    },
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData([USER_KEYS.USER_INFO], data);
      toast.success("사용자 정보가 성공적으로 업데이트되었습니다.");
    },
    onError: (error) => {
      console.error("Failed to update user info:", error);
      toast.error("사용자 정보 업데이트에 실패했습니다.");
    },
  });

  // 캐시 무효화 함수
  const invalidateUserInfo = () => {
    queryClient.invalidateQueries({ queryKey: [USER_KEYS.USER_INFO] });
  };

  return {
    userInfo,
    isLoading,
    error,
    refetch,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    invalidateUserInfo,
  };
};

export default useUserQuery;
