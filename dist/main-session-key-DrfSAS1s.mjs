import { n as buildAgentMainSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
//#region src/config/sessions/main-session-key.ts
/** Resolves the configured main session identity for one agent and session scope. */
function resolveCanonicalMainSessionKey(params) {
	return params.sessionScope === "global" ? "global" : buildAgentMainSessionKey(params);
}
/** Preserve canonical-first lookup order while checking requested and legacy main aliases. */
function collectCanonicalSessionLookupKeys(params) {
	const targets = /* @__PURE__ */ new Set();
	if (params.canonicalKey) targets.add(params.canonicalKey);
	if (params.requestedKey && params.requestedKey !== params.canonicalKey) targets.add(params.requestedKey);
	if (params.canonicalKey === "global" || params.canonicalKey === "unknown") return [...targets];
	if (params.canonicalKey === buildAgentMainSessionKey(params)) targets.add(`agent:${params.agentId}:main`);
	return [...targets];
}
//#endregion
export { resolveCanonicalMainSessionKey as n, collectCanonicalSessionLookupKeys as t };
