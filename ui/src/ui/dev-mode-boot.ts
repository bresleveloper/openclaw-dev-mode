// SEC-97 (dev-mode upgrade): persist the server-reported dev-mode flag to
// localStorage so the UI can pre-flip its initial render state before the
// config snapshot arrives, eliminating the "Quick Settings → flash → raw"
// jump on every page load. The localStorage value is a hint, not authority:
// once `config.get` resolves the live snapshot wins.

const STORAGE_KEY = "openclaw:devMode";

export function readBootDevModeFromStorage(): boolean {
  try {
    return globalThis.localStorage?.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function syncDevModeToStorage(devMode: boolean | null | undefined): void {
  try {
    if (devMode === true) {
      globalThis.localStorage?.setItem(STORAGE_KEY, "1");
    } else if (devMode === false) {
      globalThis.localStorage?.removeItem(STORAGE_KEY);
    }
    // null / undefined: server didn't report — leave any existing hint intact.
  } catch {
    // localStorage unavailable (private mode, SSR, tests) — ignore.
  }
}
