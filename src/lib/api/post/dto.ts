export interface PostItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string | null;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface PostListResponse {
  items: PostItem[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PostPayload {
  title: string;
  content: string;
  thumbnail?: string | null;
  meta_title: string;
  meta_description: string;
}
