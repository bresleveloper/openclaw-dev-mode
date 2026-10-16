import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/agents/auth-profiles/legacy-oauth-ref.ts
/**
* Legacy OAuth reference recognizer.
* Used by migration/health code to detect older Codex/OpenClaw credential
* sidecar references without accepting arbitrary ref-like objects.
*/
/** Legacy OAuth ref source persisted by older credential stores. */
const LEGACY_OAUTH_REF_SOURCE = "openclaw-credentials";
/** Legacy OAuth ref provider persisted by older credential stores. */
const LEGACY_OAUTH_REF_PROVIDER = "openai-codex";
/** Return true for the legacy OAuth reference shape persisted by older stores. */
function isLegacyOAuthRef(value) {
	if (!isRecord(value)) return false;
	return value.source === LEGACY_OAUTH_REF_SOURCE && value.provider === "openai-codex" && typeof value.id === "string" && /^[a-f0-9]{32}$/.test(value.id);
}
//#endregion
export { isLegacyOAuthRef as n, LEGACY_OAUTH_REF_PROVIDER as t };
