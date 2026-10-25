import { apiRequest } from './client';
import type { TrackSummaryDto } from './types';

export function getTracks(): Promise<TrackSummaryDto[]> {
  return apiRequest<TrackSummaryDto[]>('/api/tracks');
}
