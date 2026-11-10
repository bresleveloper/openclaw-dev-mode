import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./io-DIF-KW3P.mjs";
import { s as resolveSystemMainSessionKey } from "./main-session-CHYPkxYr.mjs";
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
	return resolveSystemMainSessionKey(readRuntimeConfig());
}
//#endregion
export { resolveMainSessionKeyFromConfig as t };
