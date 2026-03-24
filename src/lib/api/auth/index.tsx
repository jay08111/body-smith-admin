import { axios } from "@/lib/api/axiosConfig";
import { LoginRequst } from "@/lib/api/auth/dto";

export const postLogin = async (userInfo: LoginRequst) => {
  const response = await axios.post(`/auth/login`, userInfo);
  return response.data;
};
