/**
 * useChatMessages - TanStack Query mutation for AI chat
 */

import { useMutation } from '@tanstack/react-query';
import { sendChatMessage } from '../api/client';
import type { ChatRequest, ChatResponse } from '../api/types';

interface UseChatMessagesOptions {
  onSuccess?: (data: ChatResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Mutation hook for sending chat messages
 * Handles loading states and error handling
 */
export function useChatMessages(options: UseChatMessagesOptions = {}) {
  const { onSuccess, onError } = options;

  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: async (request: ChatRequest) => {
      return sendChatMessage(request);
    },
    onSuccess,
    onError,
    retry: 1, // Retry once on failure
    retryDelay: 1000,
  });
}
