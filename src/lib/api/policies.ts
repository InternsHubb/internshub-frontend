import { apiRequest } from './client';
import type { PolicyDto } from './types';

export function getCurrentPolicies(): Promise<PolicyDto[]> {
  return apiRequest<PolicyDto[]>('/api/policies/current');
}
