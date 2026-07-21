// [dev-mode] SEC-97 client half — caches the server's devMode flag so the very
// first paint after a reload lands directly on Advanced + Raw with sensitive
// values revealed (no Quick-Settings flash). The flag itself always comes from
// the server config snapshot (src/config/redact-snapshot.ts exposes `devMode`);
// localStorage is only a first-paint hint and self-heals back to stock behavior
// when the server stops reporting dev-mode.
const DEV_MODE_STORAGE_KEY = "openclaw:devMode";

export function isDevModeCached(): boolean {
  try {
    return globalThis.localStorage?.getItem(DEV_MODE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function updateDevModeCache(devMode: unknown): void {
  try {
    if (devMode === true) {
      globalThis.localStorage?.setItem(DEV_MODE_STORAGE_KEY, "1");
    } else if (devMode === false) {
      globalThis.localStorage?.removeItem(DEV_MODE_STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable (private browsing etc.) — the hint is best-effort
  }
}
