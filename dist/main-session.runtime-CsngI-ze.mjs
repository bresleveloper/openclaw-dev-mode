import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { s as resolveSystemMainSessionKey } from "./main-session-00MgEWj5.mjs";
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
	return resolveSystemMainSessionKey(getRuntimeConfig());
}
//#endregion
export { resolveMainSessionKeyFromConfig as t };
