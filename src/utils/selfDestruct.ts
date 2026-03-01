/**
 * Self-destruct functionality for security
 * Clears all sensitive data and redirects
 */

export function selfDestruct(): void {
  try {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=');
      document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // Clear IndexedDB
    if (window.indexedDB) {
      window.indexedDB.databases?.().then((databases) => {
        databases.forEach((db) => {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name);
          }
        });
      });
    }

    // Reload to clear memory
    window.location.href = '/';
  } catch {
    // Silent fail
  }
}

export function triggerSelfDestruct(timeout: number = 0): void {
  if (timeout > 0) {
    setTimeout(selfDestruct, timeout);
  } else {
    selfDestruct();
  }
}
