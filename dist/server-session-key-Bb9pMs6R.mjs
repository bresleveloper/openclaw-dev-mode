import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as resolvePersistedSessionStoreOwner } from "./session-store-owner-CnfJSmam.mjs";
import { l as getAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-Ci8Mz1ow.mjs";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution--80nkk68.mjs";
//#region src/gateway/server-session-key.ts
function sessionKeyMatchesAgent(sessionKey, agentId, cfg) {
	const normalizedAgentId = normalizeAgentId(agentId);
	if (!parseAgentSessionKey(sessionKey) && sessionKey.trim().toLowerCase().startsWith("agent:")) return false;
	try {
		return resolveSessionStoreIdentity({
			cfg,
			sessionKey,
			agentId,
			preserveQualifiedAddress: true
		}).agentId === normalizedAgentId;
	} catch (error) {
		if (error instanceof AgentSelectionRequiredError) return false;
		throw error;
	}
}
/** Resolves the selected run owner and unchanged key without storage reads. */
function resolveSessionForRun(runId, opts = {}) {
	const context = getAgentRunContext(runId);
	if (context && !context.sessionKey) return;
	const explicitAgentId = opts.agentId?.trim() ? normalizeAgentId(opts.agentId) : void 0;
	const cached = context?.sessionKey;
	const cachedAgentId = resolveChatRunOwnerAgentId(context ?? {});
	if (cached) {
		if (!cachedAgentId) return;
		if (!explicitAgentId) return {
			sessionKey: cached,
			agentId: cachedAgentId
		};
	}
	const cfg = getRuntimeConfig();
	const storeOwner = explicitAgentId ? void 0 : resolvePersistedSessionStoreOwner(cfg);
	const requestedAgentId = explicitAgentId ?? (storeOwner?.kind === "configured" ? storeOwner.agentId : normalizeAgentId(resolveDefaultAgentId(cfg)));
	if (cached && (!context?.agentId?.trim() || cachedAgentId === requestedAgentId) && sessionKeyMatchesAgent(cached, requestedAgentId, cfg)) return {
		sessionKey: cached,
		agentId: cachedAgentId ?? requestedAgentId
	};
	const matches = [];
	for (const row of opts.projection?.findBySessionId({
		sessionId: runId,
		agentId: requestedAgentId,
		federated: true
	}) ?? []) {
		const entry = row.sharingEntry ?? row.entry;
		if (entry?.sessionId === runId && (!explicitAgentId || row.agentId === explicitAgentId) && sessionKeyMatchesAgent(row.key, row.agentId, cfg)) matches.push({
			key: row.key,
			entry,
			agentId: row.agentId
		});
	}
	const storeKey = resolvePreferredSessionKeyForSessionIdMatches(matches.map(({ key, entry }) => [key, entry]), runId);
	const selected = matches.find(({ key }) => key === storeKey);
	return selected ? {
		sessionKey: selected.key,
		agentId: selected.agentId
	} : void 0;
}
//#endregion
export { resolveSessionForRun as t };
