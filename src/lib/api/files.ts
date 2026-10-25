import { ApiError, apiRequest } from './client';
import type {
  CreateUploadUrlCommand,
  DownloadUrlDto,
  FileDto,
  UploadUrlDto,
} from './types';

export function createUploadUrl(body: CreateUploadUrlCommand): Promise<UploadUrlDto> {
  return apiRequest<UploadUrlDto>('/api/files/upload-url', {
    method: 'POST',
    body,
    auth: true,
  });
}

export async function uploadToSignedUrl(
  upload: UploadUrlDto,
  file: Blob,
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch(upload.url, {
      method: upload.method,
      headers: upload.headers,
      body: file,
      signal,
    });
    if (!response.ok) {
      throw new ApiError(response.status, null, `Upload failed with status ${response.status}`);
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, null, 'Network request failed');
  }
}

export function confirmUpload(assetId: string): Promise<FileDto> {
  return apiRequest<FileDto>(`/api/files/${encodeURIComponent(assetId)}/confirm`, {
    method: 'POST',
    auth: true,
  });
}

export function getDownloadUrl(assetId: string): Promise<DownloadUrlDto> {
  return apiRequest<DownloadUrlDto>(`/api/files/${encodeURIComponent(assetId)}/download-url`, {
    auth: true,
  });
}
