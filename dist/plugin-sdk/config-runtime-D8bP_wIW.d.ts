import { v as loadSessionStore$1 } from "./transcript-B5JEOgTb.js";
//#region src/plugin-sdk/config-runtime.d.ts
/**
 * @deprecated Use getSessionEntry/listSessionEntries for reads and
 * patchSessionEntry/upsertSessionEntry for writes. This whole-store helper is
 * kept only during the transition before SQLite migration. Callers must
 * migrate away from reading sessions.json directly.
 */
declare const loadSessionStore: typeof loadSessionStore$1;
//#endregion
export { loadSessionStore as t };