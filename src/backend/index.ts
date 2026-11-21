export {
  BACKEND_CONFIG,
  isAnyBackendTransportActive,
  isApiProxyConfigured,
  isBackendConfigured,
} from './config/env';
export {
  BackendError,
  BackendNotConnectedError,
  BackendTimeoutError,
  getBackendErrorKey,
  isBackendNotConnectedError,
  isBackendTimeoutError,
} from './client/errors';
export {
  addRequestInterceptor,
  addResponseInterceptor,
  httpRequest,
  type RequestInterceptor,
  type ResponseInterceptor,
} from './client/httpClient';
export { ENDPOINTS } from './endpoints';
export { notConnected } from './services';
export { adaptList, type DtoAdapter } from './adapters';
export type {
  ApiErrorPayload,
  ApiResponse,
  HttpMethod,
  PaginatedResult,
  RequestConfig,
} from './types/common';
