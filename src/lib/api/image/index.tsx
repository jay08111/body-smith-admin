import axios from "axios";

interface ImageFormData {
  file: File | File[] | FileList | null;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export const postImageFTPGabia = async (
  token: string,
  formData: ImageFormData,
  type: string = "tests"
) => {
  // 파일 존재 확인
  if (!formData.file) {
    throw new Error("No file provided");
  }

  console.log("Original formData.file:", formData.file);
  console.log("Is array?", Array.isArray(formData.file));
  console.log("Type of file:", typeof formData.file);

  const formDataWithFiles = new FormData();

  // 배열이든 단일 파일이든 처리
  if (Array.isArray(formData.file)) {
    console.log("Processing as array, length:", formData.file.length);
    formData.file.forEach((file, index) => {
      console.log(`File ${index}:`, file);
      formDataWithFiles.append("files", file);
    });
  } else {
    // 단일 파일인 경우
    console.log("Processing as single file:", formData.file);
    if (formData.file instanceof FileList) {
      Array.from(formData.file).forEach((file) => {
        formDataWithFiles.append("files", file);
      });
    } else {
      formDataWithFiles.append("files", formData.file);
    }
  }

  formDataWithFiles.append("type", type);

  // FormData 내용 확인
  console.log("FormData entries:");
  for (let [key, value] of formDataWithFiles.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await axios.post(
      `/api/upload/ftp-multi`,
      formDataWithFiles,
      {
        headers: {
          // Content-Type을 명시하지 않는 것이 좋음 (axios가 자동으로 boundary 설정)
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const postImageToS3 = async (
  token: string,
  formData: ImageFormData,
  type: string
) => {
  if (!formData.file) {
    throw new Error("No file provided");
  }

  if (!type) {
    throw new Error("Type is required for S3 upload");
  }

  console.log("Original formData.file:", formData.file);
  console.log("Is array?", Array.isArray(formData.file));
  console.log("Type of file:", typeof formData.file);

  const fileToUpload = Array.isArray(formData.file)
    ? formData.file[0]
    : formData.file instanceof FileList
      ? formData.file[0]
      : formData.file;

  if (!fileToUpload) {
    throw new Error("No file provided");
  }

  const formDataWithFiles = new FormData();
  formDataWithFiles.append("files", fileToUpload);
  formDataWithFiles.append("type", type);

  for (let [key, value] of formDataWithFiles.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await axios.post(
      `/api/upload/seah`,
      formDataWithFiles,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
