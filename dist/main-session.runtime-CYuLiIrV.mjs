import { r as getRuntimeConfig } from "./io.runtime-CwE7Ks5y.mjs";
import "./io-D61ne4z2.mjs";
import { s as resolveSystemMainSessionKey } from "./main-session-De-bcoks.mjs";
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
	return resolveSystemMainSessionKey(getRuntimeConfig());
}
//#endregion
export { resolveMainSessionKeyFromConfig as t };
