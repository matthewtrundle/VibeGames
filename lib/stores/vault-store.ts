/**
 * Vault Store - localStorage persistence for vault path
 */

const VAULT_PATH_KEY = 'headless_horseman_vault_path';

/**
 * Save vault path to localStorage
 */
export function saveVaultPath(path: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(VAULT_PATH_KEY, path);
  } catch (error) {
    console.error('Failed to save vault path:', error);
  }
}

/**
 * Load vault path from localStorage
 */
export function loadVaultPath(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(VAULT_PATH_KEY);
  } catch (error) {
    console.error('Failed to load vault path:', error);
    return null;
  }
}

/**
 * Clear vault path from localStorage
 */
export function clearVaultPath(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(VAULT_PATH_KEY);
  } catch (error) {
    console.error('Failed to clear vault path:', error);
  }
}

/**
 * Check if vault path exists in localStorage
 */
export function hasVaultPath(): boolean {
  if (typeof window === 'undefined') return false;

  const path = loadVaultPath();
  return !!path && path.trim().length > 0;
}
