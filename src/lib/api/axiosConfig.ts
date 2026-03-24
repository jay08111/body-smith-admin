import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_API_URL?.trim() || "http://localhost:8080/api/v1";

// Axios 기본 설정
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

// API 응답 타입 정의
interface ApiResponse<T = any> {
  success?: boolean;
  code?: string | number;
  message?: string;
  data?: T;
}

// 커스텀 에러 클래스
export class ApiError extends Error {
  code?: string | number;
  apiResponse?: ApiResponse;

  constructor(
    message: string,
    code?: string | number,
    apiResponse?: ApiResponse
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.apiResponse = apiResponse;
  }
}

// Axios 전역 에러 처리 인터셉터
axios.interceptors.response.use(
  (response) => {
    // 응답이 성공했지만 success: false인 경우 에러로 처리
    const data: ApiResponse = response.data;

    if (
      data &&
      typeof data === "object" &&
      "success" in data &&
      data.success === false
    ) {
      throw new ApiError(
        data.message || "요청이 실패했습니다.",
        data.code,
        data
      );
    }

    return response;
  },
  (error) => {
    // 네트워크 에러나 HTTP 에러 처리
    console.error("에러가 발생하였습니다. 문의해주세요.", error);

    return Promise.reject(
      new ApiError(
        error.message || "네트워크 오류가 발생했습니다.",
        error.response?.status,
        error.response?.data
      )
    );
  }
);

export { axios, BASE_URL };
