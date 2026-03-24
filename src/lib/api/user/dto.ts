import { ProjectResponse } from "@/lib/api/project/dto";

export interface UserInfoRequest {
  access_token: string;
}

export interface UserInfoResponse {
  id: number;
  email: string;
  account: string;
  created_at: string;
  project?: ProjectResponse;
}

export interface UpdateUserInfoRequest {
  email?: string;
  password?: string;
}
