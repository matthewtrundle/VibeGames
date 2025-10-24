/**
 * useFileContent - TanStack Query hook for single file content
 */

import { useQuery } from '@tanstack/react-query';
import { readFile } from '../api/client';
import type { ReadFileResponse } from '../api/types';

interface UseFileContentOptions {
  fileId?: string;
  vaultPath?: string;
  enabled?: boolean;
  staleTime?: number;
}

/**
 * Query hook for fetching file content
 * Automatically caches individual files
 */
export function useFileContent(options: UseFileContentOptions = {}) {
  const {
    fileId,
    vaultPath,
    enabled = true,
    staleTime = 10 * 60 * 1000, // 10 minutes
  } = options;

  return useQuery<ReadFileResponse, Error>({
    queryKey: ['file-content', fileId, vaultPath],
    queryFn: async () => {
      if (!fileId || !vaultPath) {
        throw new Error('File ID and vault path are required');
      }
      return readFile(fileId, vaultPath);
    },
    enabled: enabled && !!fileId && !!vaultPath,
    staleTime,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Query key factory for file content
 */
export const fileContentQueryKey = (fileId?: string, vaultPath?: string) =>
  ['file-content', fileId, vaultPath];
