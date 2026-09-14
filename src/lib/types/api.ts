export const USE_MOCK_API = true;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface ApiError {
  code: string;
  message: string;
  status?: number;
}

export interface ApiResult<T> {
  data?: T;
  error?: ApiError;
  loading: boolean;
}
