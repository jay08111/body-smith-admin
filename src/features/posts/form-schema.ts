import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해주세요."),
  content: z.string().trim().min(1, "본문을 입력해주세요."),
  thumbnail: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export const emptyPostValues: PostFormValues = {
  title: "",
  content: "",
  thumbnail: "",
  meta_title: "",
  meta_description: "",
};
