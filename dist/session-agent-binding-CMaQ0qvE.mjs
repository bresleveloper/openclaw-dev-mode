import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as normalizeMainKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CnfJSmam.mjs";
//#region src/agents/session-agent-binding.ts
/**
* Session-to-agent binding resolver.
*
* Derives the trusted active agent from explicit agent ids, agent session keys, or configured main-session aliases.
*/
/**
* Resolve the trusted active agent bound to a host-owned session reference.
*/
function resolveBoundAgentIdForSession(params) {
	const config = params.config ?? {};
	const agentId = normalizeOptionalString(params.agentId);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!agentId && !sessionKey) return;
	if (agentId) return resolveSessionAgentId({
		config,
		sessionKey,
		agentId
	});
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(config, sessionKey);
	const loweredSessionKey = normalizeLowercaseStringOrEmpty(sessionKey);
	const mainKey = normalizeMainKey(config.session?.mainKey);
	return Boolean(parseAgentSessionKey(sessionKey)?.agentId) || persistedOwner.kind !== "none" || loweredSessionKey === "main" || loweredSessionKey === mainKey ? resolveSessionAgentId({
		config,
		sessionKey
	}) : void 0;
}
//#endregion
export { resolveBoundAgentIdForSession as t };
