import { r as getAsyncWorkSignal } from "./async-work-scope-CWk2dk1h.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { i as resolveSessionStoreKey, n as resolveSessionStoreAgentId } from "./session-store-key-BoleEY7N.mjs";
import { E as getSubagentSessionListReadSnapshotIdentity, M as prepareOptionalSubagentSessionListReadCache, a as getLatestLiveSubagentRunByChildSessionKey, t as buildLatestSubagentSessionListReadIndex } from "./subagent-registry-read-C2SIiLpb.mjs";
import "./operator-approval-store-ZXCDEDUV.mjs";
//#region src/gateway/approval-session-audience.ts
const MAX_APPROVAL_AUDIENCE_SESSIONS = 64;
function canonicalizeAudienceSessionKey(sources, sessionKey, relativeToSessionKey) {
	const raw = sessionKey?.trim();
	if (!raw) return null;
	return sources.canonicalizeSessionKey(raw, relativeToSessionKey)?.trim() || null;
}
/** Resolves the source session and its operator-visible ancestor audience. */
function resolveApprovalSessionAudienceFromSources(params) {
	const sourceSessionKey = canonicalizeAudienceSessionKey(params.sources, params.sourceSessionKey);
	if (!sourceSessionKey) return [];
	const audience = [];
	const queued = /* @__PURE__ */ new Set([sourceSessionKey]);
	const pending = [sourceSessionKey];
	const enqueue = (sessionKey) => {
		if (!sessionKey || queued.has(sessionKey) || pending.length >= MAX_APPROVAL_AUDIENCE_SESSIONS) return;
		queued.add(sessionKey);
		pending.push(sessionKey);
	};
	for (const sessionKey of pending) {
		audience.push(sessionKey);
		const subagentLineage = params.sources.getLatestSubagentLineage(sessionKey);
		const registryParents = [canonicalizeAudienceSessionKey(params.sources, subagentLineage?.controllerSessionKey, sessionKey), canonicalizeAudienceSessionKey(params.sources, subagentLineage?.requesterSessionKey, sessionKey)].filter((candidate) => Boolean(candidate));
		if (registryParents.length > 0) {
			for (const parentSessionKey of registryParents) enqueue(parentSessionKey);
			continue;
		}
		const storedLineage = params.sources.getStoredSessionLineage(sessionKey);
		const parentSessionKey = storedLineage?.parentSessionKey?.trim() ? storedLineage.parentSessionKey : storedLineage?.spawnedBy;
		enqueue(canonicalizeAudienceSessionKey(params.sources, parentSessionKey, sessionKey));
	}
	return audience;
}
function createRuntimeApprovalSessionAudienceSources(cfg, persisted, sourceAgentId) {
	const resolveStorageTarget = (sessionKey) => {
		const parsed = parseAgentSessionKey(sessionKey);
		if (parsed?.rest.toLowerCase() === "global") return {
			agentId: normalizeAgentId(parsed.agentId),
			sessionKey: "global"
		};
		return {
			agentId: resolveSessionStoreAgentId(cfg, sessionKey),
			sessionKey
		};
	};
	return {
		canonicalizeSessionKey: (sessionKey, relativeToSessionKey) => {
			if (!relativeToSessionKey) return canonicalizeApprovalSourceStreamKey(cfg, sessionKey, sourceAgentId);
			const relativeAgentId = resolveSessionStoreAgentId(cfg, relativeToSessionKey);
			const canonical = resolveSessionStoreKey({
				cfg,
				sessionKey,
				storeAgentId: relativeAgentId
			});
			return canonical ? resolveApprovalSourceStreamKey(canonical, relativeAgentId) : canonical;
		},
		getLatestSubagentLineage: (sessionKey) => persisted ? buildLatestSubagentSessionListReadIndex([sessionKey]).getLatestSubagentRun(sessionKey) : getLatestLiveSubagentRunByChildSessionKey(sessionKey),
		getStoredSessionLineage: (sessionKey) => {
			const target = resolveStorageTarget(sessionKey);
			return loadSessionEntryReadOnly({
				agentId: target.agentId,
				clone: false,
				hydrateSkillPromptRefs: false,
				sessionKey: target.sessionKey
			});
		}
	};
}
/** Canonicalize one source key against config: agent scoping, main-key aliases, global sentinel. */
function canonicalizeApprovalSourceStreamKey(cfg, sessionKey, sourceAgentId) {
	const ownerAgentId = normalizeAgentId(sourceAgentId ?? resolveDefaultAgentId(cfg));
	const lowered = sessionKey.trim().toLowerCase();
	const scoped = parseAgentSessionKey(sessionKey) || lowered === "global" || lowered === "unknown" ? sessionKey : `agent:${ownerAgentId}:${sessionKey}`;
	return resolveApprovalSourceStreamKey(resolveSessionStoreKey({
		cfg,
		sessionKey: scoped
	}), ownerAgentId);
}
/** Preserves source routing when lineage is unavailable, after read preparation settles. */
async function resolveApprovalSessionAudienceWithFallback(sourceSessionKey, sourceAgentId) {
	let persisted;
	do {
		persisted = await prepareOptionalSubagentSessionListReadCache();
		getAsyncWorkSignal()?.throwIfAborted();
	} while (persisted && !getSubagentSessionListReadSnapshotIdentity());
	try {
		return resolveApprovalSessionAudienceFromSources({
			sourceSessionKey,
			sources: createRuntimeApprovalSessionAudienceSources(getRuntimeConfig(), persisted, sourceAgentId)
		});
	} catch {
		return [resolveApprovalFallbackAudienceSessionKey(sourceSessionKey, sourceAgentId)];
	}
}
function resolveApprovalFallbackAudienceSessionKey(sourceSessionKey, sourceAgentId) {
	try {
		return canonicalizeApprovalSourceStreamKey(getRuntimeConfig(), sourceSessionKey, sourceAgentId);
	} catch {
		return resolveApprovalSourceStreamKey(sourceSessionKey, sourceAgentId);
	}
}
/** Best-effort stream key used when lineage lookup is unavailable. */
function resolveApprovalSourceStreamKey(sourceSessionKey, sourceAgentId) {
	const normalizedSessionKey = sourceSessionKey.trim();
	const lowered = normalizedSessionKey.toLowerCase();
	if (!sourceAgentId || lowered === "unknown" || parseAgentSessionKey(normalizedSessionKey)) return normalizedSessionKey;
	const agentId = normalizeAgentId(sourceAgentId);
	return lowered === "global" ? `agent:${agentId}:global` : `agent:${agentId}:${normalizedSessionKey}`;
}
//#endregion
export { resolveApprovalSourceStreamKey as n, resolveApprovalSessionAudienceWithFallback as t };
