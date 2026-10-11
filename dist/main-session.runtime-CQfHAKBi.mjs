import { r as getRuntimeConfig } from "./io.runtime-CXaC-ufL.mjs";
import "./io-fx22Mnq2.mjs";
import { s as resolveSystemMainSessionKey } from "./main-session-De-bcoks.mjs";
//#region src/config/sessions/main-session.runtime.ts
/** Resolves the main session key from the active runtime config. */
function resolveMainSessionKeyFromConfig() {
	return resolveSystemMainSessionKey(getRuntimeConfig());
}
//#endregion
export { resolveMainSessionKeyFromConfig as t };
