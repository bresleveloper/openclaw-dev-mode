import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { a as resolveSessionStoreKey, r as resolveSessionStoreAgentId } from "./session-store-key-Ci099tm9.mjs";
import { c as getSubagentSessionListReadSnapshotIdentity, f as prepareOptionalSubagentSessionListReadCache } from "./subagent-registry-state-CVSclnHX.mjs";
import { i as getLatestLiveSubagentRunByChildSessionKey, t as buildLatestSubagentSessionListReadIndex } from "./subagent-registry-read-BE_xWkJl.mjs";
import "./operator-approval-store-cPImwg80.mjs";
//#region src/gateway/approval-session-audience.ts
function canonicalizeAudienceSessionKey(sources, sessionKey, relativeToSessionKey) {
	const raw = sessionKey?.trim();
	if (!raw) return null;
	return sources.canonicalizeSessionKey(raw, relativeToSessionKey)?.trim() || null;
}
/** Resolves the source session and its operator-visible ancestor audience. */
function resolveApprovalSessionAudienceFromSources(params) {
	const sourceSessionKey = canonicalizeAudienceSessionKey(params.sources, params.sourceSessionKey);
	if (!sourceSessionKey) return [];
	const queued = /* @__PURE__ */ new Set([sourceSessionKey]);
	const pending = [sourceSessionKey];
	const enqueue = (sessionKey) => {
		if (!sessionKey || queued.has(sessionKey) || pending.length >= 64) return;
		queued.add(sessionKey);
		pending.push(sessionKey);
	};
	for (const sessionKey of pending) {
		const subagentLineage = params.sources.getLatestSubagentLineage(sessionKey);
		const registryParents = [subagentLineage?.controllerSessionKey, subagentLineage?.requesterSessionKey].map((parent) => canonicalizeAudienceSessionKey(params.sources, parent, sessionKey)).filter((candidate) => Boolean(candidate));
		if (registryParents.length > 0) {
			for (const parentSessionKey of registryParents) enqueue(parentSessionKey);
			continue;
		}
		const storedLineage = params.sources.getStoredSessionLineage(sessionKey);
		const parentSessionKey = storedLineage?.parentSessionKey?.trim() ? storedLineage.parentSessionKey : storedLineage?.spawnedBy;
		enqueue(canonicalizeAudienceSessionKey(params.sources, parentSessionKey, sessionKey));
	}
	return pending;
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
