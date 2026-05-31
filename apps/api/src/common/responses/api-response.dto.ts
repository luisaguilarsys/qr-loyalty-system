export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ResponseMeta {
  timestamp: string;
  version: string;
  path: string;
  pagination?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
  meta: ResponseMeta | null;
  error: ApiError | null;
  errors?: ApiError[];
}