/**
 * useVaultFiles - TanStack Query hook for vault file list
 */

import { useQuery } from '@tanstack/react-query';
import { scanVault } from '../api/client';
import type { ScanVaultResponse } from '../api/types';

interface UseVaultFilesOptions {
  vaultPath?: string;
  enabled?: boolean;
  staleTime?: number;
}

/**
 * Query hook for fetching vault files
 * Automatically caches results for 5 minutes
 */
export function useVaultFiles(options: UseVaultFilesOptions = {}) {
  const {
    vaultPath,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  return useQuery<ScanVaultResponse, Error>({
    queryKey: ['vault-files', vaultPath],
    queryFn: async () => {
      if (!vaultPath) {
        throw new Error('Vault path is required');
      }
      return scanVault(vaultPath);
    },
    enabled: enabled && !!vaultPath,
    staleTime,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Invalidate vault files cache
 */
export const vaultFilesQueryKey = (vaultPath?: string) => ['vault-files', vaultPath];
