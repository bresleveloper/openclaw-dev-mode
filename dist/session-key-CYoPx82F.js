import { b as toAgentStoreSessionKey } from "./session-key-pTKRJb0m.js";
import { t as canonicalizeMainSessionAlias } from "./main-session-DWI7gPJU.js";
//#region src/cron/isolated-agent/session-key.ts
/** Canonicalizes cron session keys into agent-scoped session-store keys. */
/** Resolves a cron session key into the canonical agent-scoped session-store key. */
function resolveCronAgentSessionKey(params) {
	const raw = toAgentStoreSessionKey({
		agentId: params.agentId,
		requestKey: params.sessionKey.trim(),
		mainKey: params.mainKey
	});
	return canonicalizeMainSessionAlias({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: raw
	});
}
//#endregion
export { resolveCronAgentSessionKey as t };
