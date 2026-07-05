type WebStorageKind = "local" | "session";

function getStore(kind: WebStorageKind): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    // Storage can throw on access in privacy modes / sandboxed frames.
    return null;
  }
}

/** Read a key from web storage, returning null when it is unavailable. */
export function safeStorageGet(
  kind: WebStorageKind,
  key: string
): string | null {
  const store = getStore(kind);
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

/** Write a key to web storage; silently no-ops when it is unavailable. */
export function safeStorageSet(
  kind: WebStorageKind,
  key: string,
  value: string
): void {
  const store = getStore(kind);
  if (!store) return;
  try {
    store.setItem(key, value);
  } catch {
    // Ignore quota-exceeded / privacy-mode write failures.
  }
}
