export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
  /** Optional per-request timeout override in milliseconds (defaults to BACKEND_CONFIG.timeoutMs). */
  timeoutMs?: number;
  /** Set to true when the endpoint requires authenticated credentials/headers. */
  requiresAuth?: boolean;
}

export interface ApiErrorPayload {
  code?: string;
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  totalCount?: number;
}
