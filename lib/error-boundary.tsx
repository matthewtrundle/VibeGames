'use client'

import React, { Component, ReactNode } from 'react';

// ============================================================================
// Error Boundary Props & State
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ============================================================================
// Spooky Themed Error Boundary Component
// ============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error boundary when resetKeys change
    if (this.state.hasError && this.props.resetKeys) {
      const prevKeys = prevProps.resetKeys || [];
      const currentKeys = this.props.resetKeys;

      if (prevKeys.length !== currentKeys.length ||
          prevKeys.some((key, index) => key !== currentKeys[index])) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetErrorBoundary);
      }

      // Default spooky-themed error UI
      return (
        <SpookyErrorFallback
          error={this.state.error}
          resetError={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Default Spooky Error Fallback UI
// ============================================================================

interface SpookyErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function SpookyErrorFallback({ error, resetError }: SpookyErrorFallbackProps) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black flex items-center justify-center p-6"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-2xl w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="text-9xl mb-4 animate-bounce">👻</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            A Spooky Error Occurred!
          </h1>
          <p className="text-xl text-gray-400">
            The spirits have encountered a disturbance...
          </p>
        </div>

        {/* Error Card */}
        <div className="bg-gray-900/80 border border-orange-500/30 rounded-2xl p-8 backdrop-blur space-y-6">
          {/* Error Message */}
          <div>
            <h2 className="text-lg font-semibold text-orange-400 mb-2">
              Error Message
            </h2>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-red-400 border border-red-500/20">
              {error.message || 'An unknown error occurred'}
            </div>
          </div>

          {/* Stack Trace (Development Only) */}
          {isDev && error.stack && (
            <div>
              <h2 className="text-lg font-semibold text-orange-400 mb-2">
                Stack Trace (Development Only)
              </h2>
              <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-gray-400 border border-gray-700 max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{error.stack}</pre>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={resetError}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Try again"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Reload page"
            >
              🏠 Reload Page
            </button>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-800">
            If this issue persists, try refreshing the page or clearing your browser cache.
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center space-x-4 text-4xl opacity-30">
          <span className="inline-block animate-pulse">🕸️</span>
          <span className="inline-block animate-pulse delay-100">🪦</span>
          <span className="inline-block animate-pulse delay-200">🎃</span>
          <span className="inline-block animate-pulse delay-300">🦇</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Convenience Hook for Error Boundaries
// ============================================================================

/**
 * Hook to throw errors that will be caught by error boundary
 * Useful for async errors or event handlers
 */
export function useErrorHandler() {
  const [, setError] = React.useState<Error | null>(null);

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

// ============================================================================
// Utility Function for Logging Errors
// ============================================================================

export interface ErrorLogData {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

/**
 * Log error to external service (to be implemented)
 * @param error - The error object
 * @param errorInfo - React error info with component stack
 */
export function logErrorToService(error: Error, errorInfo?: React.ErrorInfo): void {
  const errorData: ErrorLogData = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack ?? undefined,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // Development: Log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorData);
  }

  // Production: Send to error tracking service
  // TODO: Implement with Sentry, LogRocket, or custom endpoint
  // Example:
  // fetch('/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorData),
  // }).catch(console.error);
}

// ============================================================================
// Exports
// ============================================================================

export default ErrorBoundary;
