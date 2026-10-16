//#region extensions/codex/src/app-server/session-binding-meta.ts
/** Process-stable plugin-state metadata for Codex app-server bindings. */
const CODEX_APP_SERVER_BINDING_NAMESPACE = "app-server-thread-bindings";
const CODEX_APP_SERVER_BINDING_MAX_ENTRIES = 5e4;
const CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS = 6e4;
const staleMs = 65e3;
const CODEX_APP_SERVER_BINDING_LEASE = {
	staleMs,
	waitMs: 7e4,
	retryIntervalMs: 1e3,
	renewIntervalMs: Math.floor(staleMs / 3)
};
const PHYSICAL_SESSION_RETIRE_TTL_MS = CODEX_APP_SERVER_BINDING_LEASE.waitMs;
//#endregion
export { PHYSICAL_SESSION_RETIRE_TTL_MS as a, CODEX_APP_SERVER_BINDING_NAMESPACE as i, CODEX_APP_SERVER_BINDING_LEASE as n, CODEX_APP_SERVER_BINDING_MAX_ENTRIES as r, CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS as t };
