import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./io-DIF-KW3P.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { i as resolveSessionStoreAgentId, o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { c as getSubagentSessionListReadSnapshotIdentity, f as prepareOptionalSubagentSessionListReadCache } from "./subagent-registry-state-DBdy-FdI.mjs";
import { i as getLatestLiveSubagentRunByChildSessionKey, t as buildLatestSubagentSessionListReadIndex } from "./subagent-registry-read-DY0g8fGW.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import "./operator-approval-store-CHMiK9vK.mjs";
//#region src/gateway/approval-session-audience.ts
/** Resolves the source session and its operator-visible ancestor audience. */
async function resolveApprovalSessionAudience(cfg, persisted, source, sourceAgentId, sourceMemory) {
	const canonicalize = (sessionKey, relativeToSessionKey) => {
		const raw = sessionKey?.trim();
		if (!raw) return null;
		if (!relativeToSessionKey) return canonicalizeApprovalSourceStreamKey(cfg, raw, sourceAgentId).trim() || null;
		const relativeAgentId = resolveSessionStoreAgentId(cfg, relativeToSessionKey);
		const canonical = resolveSessionStoreKey({
			cfg,
			sessionKey: raw,
			storeAgentId: relativeAgentId
		});
		return (canonical ? resolveApprovalSourceStreamKey(canonical, relativeAgentId) : canonical).trim() || null;
	};
	const sourceSessionKey = canonicalize(source);
	if (!sourceSessionKey) return [];
	const queued = /* @__PURE__ */ new Set([sourceSessionKey]);
	const pending = [sourceSessionKey];
	const enqueue = (sessionKey) => {
		if (!sessionKey || queued.has(sessionKey) || pending.length >= 64) return;
		queued.add(sessionKey);
		pending.push(sessionKey);
	};
	for (const sessionKey of pending) {
		const subagentLineage = persisted ? buildLatestSubagentSessionListReadIndex([sessionKey]).getLatestSubagentRun(sessionKey) : getLatestLiveSubagentRunByChildSessionKey(sessionKey);
		const registryParents = [subagentLineage?.controllerSessionKey, subagentLineage?.requesterSessionKey].map((parent) => canonicalize(parent, sessionKey)).filter((candidate) => Boolean(candidate));
		if (registryParents.length > 0) {
			for (const parentSessionKey of registryParents) enqueue(parentSessionKey);
			continue;
		}
		const parsed = parseAgentSessionKey(sessionKey);
		const target = parsed?.rest.toLowerCase() === "global" ? {
			agentId: normalizeAgentId(parsed.agentId),
			sessionKey: "global"
		} : {
			agentId: resolveSessionStoreAgentId(cfg, sessionKey),
			sessionKey
		};
		const memory = isIncognitoSessionKey(sessionKey) ? sessionKey === sourceSessionKey ? sourceMemory : captureSessionEntryMetadataRead(target, () => getAsyncWorkSignal()?.throwIfAborted()) : void 0;
		const storedLineage = memory ? memory.readCurrent() : await readSessionEntryReadOnlyInWorker({
			...target,
			storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId: target.agentId }),
			clone: false,
			hydrateSkillPromptRefs: false
		});
		enqueue(canonicalize(storedLineage?.parentSessionKey?.trim() ? storedLineage.parentSessionKey : storedLineage?.spawnedBy, sessionKey));
	}
	return pending;
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
	const memory = captureSessionEntryMetadataRead({
		sessionKey: sourceSessionKey,
		...sourceAgentId ? { agentId: sourceAgentId } : {}
	}, () => getAsyncWorkSignal()?.throwIfAborted());
	const initial = memory?.readCurrent();
	let persisted;
	do {
		persisted = await prepareOptionalSubagentSessionListReadCache();
		getAsyncWorkSignal()?.throwIfAborted();
	} while (persisted && !getSubagentSessionListReadSnapshotIdentity());
	if (memory) {
		const current = memory.readCurrent();
		if (current?.sessionId !== initial?.sessionId || current?.lifecycleRevision !== initial?.lifecycleRevision) throw new Error("Approval source session changed during preparation");
	}
	try {
		return await resolveApprovalSessionAudience(readRuntimeConfig(), persisted, sourceSessionKey, sourceAgentId, memory);
	} catch {
		return [resolveApprovalFallbackAudienceSessionKey(sourceSessionKey, sourceAgentId)];
	}
}
function resolveApprovalFallbackAudienceSessionKey(sourceSessionKey, sourceAgentId) {
	try {
		return canonicalizeApprovalSourceStreamKey(readRuntimeConfig(), sourceSessionKey, sourceAgentId);
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
