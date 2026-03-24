import { axios } from "@/lib/api/axiosConfig";
import { UserInfoResponse, UpdateUserInfoRequest } from "@/lib/api/user/dto";
import { getProjectInfo } from "@/lib/api/project";

export const getUserInfo = async (token: string): Promise<UserInfoResponse> => {
  const response = await axios.get(`/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const project = await getProjectInfo(token);

  return {
    ...response.data.user,
    account: response.data.user.email,
    created_at: new Date().toISOString(),
    project,
  } as UserInfoResponse;
};

export const updateUserInfo = async (
  _token: string,
  _data: UpdateUserInfoRequest
): Promise<UserInfoResponse> => {
  throw new Error("사용자 정보 수정은 현재 지원하지 않습니다.");
};
