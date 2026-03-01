const STORAGE_PREFIX = 'sg_';

export function encryptAndStore(key: string, data: unknown): boolean {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, json);
    return true;
  } catch {
    return false;
  }
}

export function decryptAndRetrieve<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function removeEncrypted(key: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

export function clearAllStorage(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
