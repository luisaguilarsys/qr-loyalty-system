import { ApiError, ApiResponse, PaginationMeta, ResponseMeta } from './api-response.dto';

const VERSION = process.env.API_VERSION ?? '1.0.0';

function buildMeta(path: string, pagination?: PaginationMeta): ResponseMeta {
  return {
    timestamp: new Date().toISOString(),
    version: VERSION,
    path,
    ...(pagination && { pagination }),
  };
}

export class ResponseFactory {
  static success<T>(
    data: T,
    message: string,
    status = 200,
    path?: string,
  ): ApiResponse<T> {
    return {
      success: true,
      status,
      message,
      data,
      meta: path ? buildMeta(path) : null,
      error: null,
    };
  }

  static paginated<T>(
    data: T[],
    message: string,
    pagination: PaginationMeta,
    path: string,
    status = 200,
  ): ApiResponse<T[]> {
    return {
      success: true,
      status,
      message,
      data,
      meta: buildMeta(path, pagination),
      error: null,
    };
  }

  static error(
    message: string,
    status: number,
    code: string,
  ): ApiResponse<null> {
    return {
      success: false,
      status,
      message,
      data: null,
      meta: null,
      error: { code, message },
    };
  }

  static validationError(
    errors: ApiError[],
    message = 'Validation failed',
    status = 422,
  ): ApiResponse<null> {
    return {
      success: false,
      status,
      message,
      data: null,
      meta: null,
      error: null,
      errors,
    };
  }
}