import { T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CnfJSmam.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
//#region src/agents/subagent-requester-owner.ts
/** Resolves the durable requester owner for legacy rows that predate requesterAgentId. */
function resolveSubagentRequesterAgentId(cfg, entry) {
	if (entry.requesterAgentId) return entry.requesterAgentId;
	const parsedAgentId = parseAgentSessionKey(entry.requesterSessionKey)?.agentId;
	if (parsedAgentId) return parsedAgentId;
	const persisted = resolvePersistedSessionStoreOwnerForKey(cfg, entry.requesterSessionKey);
	return persisted.kind === "configured" ? persisted.agentId : persisted.kind === "none" ? tryResolveLegacyCompatibilityAgentId(cfg) : void 0;
}
//#endregion
export { resolveSubagentRequesterAgentId as t };
