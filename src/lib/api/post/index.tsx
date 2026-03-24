import { axios } from "@/lib/api/axiosConfig";
import { PostItem, PostListResponse, PostPayload } from "@/lib/api/post/dto";

export const getAdminPosts = async (
 token: string,
 page: number,
 perPage: number
): Promise<PostListResponse> => {
  const response = await axios.get(`/admin/posts?page=${page}&per_page=${perPage}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as PostListResponse;
};

export const getAdminPost = async (
  token: string,
  id: number
): Promise<PostItem> => {
  const response = await axios.get(`/admin/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as PostItem;
};

export const createPost = async (
  token: string,
  payload: PostPayload
): Promise<PostItem> => {
  const response = await axios.post(`/admin/posts`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as PostItem;
};

export const updatePost = async (
  token: string,
  id: number,
  payload: PostPayload
): Promise<PostItem> => {
  const response = await axios.put(`/admin/posts/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as PostItem;
};

export const deletePost = async (token: string, id: number): Promise<void> => {
  await axios.delete(`/admin/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
