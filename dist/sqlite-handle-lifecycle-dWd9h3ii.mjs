//#region src/infra/sqlite-handle-lifecycle.ts
/** Idle native connections share one retention window across SQLite owners. */
const SQLITE_IDLE_HANDLE_TTL_MS = 18e5;
//#endregion
export { SQLITE_IDLE_HANDLE_TTL_MS as t };
