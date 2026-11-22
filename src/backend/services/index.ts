import { BackendNotConnectedError } from '../client/errors';

/**
 * Helper used by feature service placeholders so unimplemented backend operations
 * fail explicitly and predictably instead of silently succeeding with fake data.
 */
export function notConnected(feature: string, operation: string): Promise<never> {
  return Promise.reject(new BackendNotConnectedError(feature, operation));
}
