import { BACKEND_CONFIG, isBackendConfigured } from '../config/env';
import type { ApiErrorPayload, RequestConfig } from '../types/common';
import { BackendError, BackendNotConnectedError, BackendTimeoutError } from './errors';

export type RequestInterceptor = (
  url: string,
  init: RequestInit,
  config: RequestConfig,
) => Promise<RequestInit> | RequestInit;

export type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

/**
 * Register a request interceptor (e.g., to attach auth headers when the new backend is wired).
 */
export function addRequestInterceptor(interceptor: RequestInterceptor): () => void {
  requestInterceptors.push(interceptor);
  return () => {
    const idx = requestInterceptors.indexOf(interceptor);
    if (idx !== -1) requestInterceptors.splice(idx, 1);
  };
}

/**
 * Register a response interceptor (e.g., for global 401 handling when the new backend is wired).
 */
export function addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
  responseInterceptors.push(interceptor);
  return () => {
    const idx = responseInterceptors.indexOf(interceptor);
    if (idx !== -1) responseInterceptors.splice(idx, 1);
  };
}

function buildUrl(path: string, query?: RequestConfig['query']): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = `${BACKEND_CONFIG.baseUrl}${normalizedPath}`;
  if (!query) return base;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('json')) return text;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

/**
 * Clean HTTP client foundation for future backend integration.
 * - Fails explicitly with `BackendNotConnectedError` until `VITE_API_BASE_URL` is configured.
 * - Enforces request timeouts via `AbortController` (`config.timeoutMs ?? BACKEND_CONFIG.timeoutMs`),
 *   throwing `BackendTimeoutError` on timeout while preserving caller-provided `AbortSignal` cancellation.
 */
export async function httpRequest<T>(path: string, config: RequestConfig = {}): Promise<T> {
  if (!isBackendConfigured()) {
    throw new BackendNotConnectedError('backend', `${config.method ?? 'GET'} ${path}`);
  }

  const url = buildUrl(path, config.query);
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...config.headers,
  };
  if (config.body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  }

  const timeoutMs = config.timeoutMs ?? BACKEND_CONFIG.timeoutMs;
  const controller = new AbortController();
  let timedOut = false;

  const onCallerAbort = () => {
    controller.abort(config.signal?.reason);
  };

  if (config.signal) {
    if (config.signal.aborted) {
      controller.abort(config.signal.reason);
    } else {
      config.signal.addEventListener('abort', onCallerAbort, { once: true });
    }
  }

  const timeoutId =
    timeoutMs > 0
      ? globalThis.setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, timeoutMs)
      : undefined;

  let init: RequestInit = {
    method: config.method ?? 'GET',
    headers,
    body: config.body !== undefined ? JSON.stringify(config.body) : undefined,
    signal: controller.signal,
  };

  try {
    for (const interceptor of requestInterceptors) {
      init = await interceptor(url, init, config);
    }

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (error) {
      if (timedOut) {
        throw new BackendTimeoutError(timeoutMs);
      }
      if (config.signal?.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
        throw error;
      }
      throw new BackendError(0, { code: 'NETWORK_ERROR' }, 'Network request failed');
    }

    for (const interceptor of responseInterceptors) {
      response = await interceptor(response);
    }

    const body = await parseResponseBody(response);
    if (!response.ok) {
      const payload = typeof body === 'object' && body !== null ? (body as ApiErrorPayload) : null;
      throw new BackendError(response.status, payload);
    }

    return body as T;
  } finally {
    if (timeoutId !== undefined) {
      globalThis.clearTimeout(timeoutId);
    }
    config.signal?.removeEventListener('abort', onCallerAbort);
  }
}
