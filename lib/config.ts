/**
 * Validate required environment variables
 */
export function validateEnv(): void {
  const required = ['OPENROUTER_API_KEY'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Safe config access
 */
export const config = {
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  isDev: process.env.NODE_ENV === 'development'
};

// Validate on module load (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    console.warn('Environment validation warning:', error);
  }
}
