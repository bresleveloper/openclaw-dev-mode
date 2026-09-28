import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, S as tryResolveLegacyCompatibilityAgentId, m as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import { i as normalizeMainKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, l as resolveAgentIdFromSessionKey, o as classifySessionKeyShape, s as isUnscopedSessionKeySentinel } from "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey, t as resolvePersistedSessionStoreOwner } from "./session-store-owner-DBafeUlR.mjs";
import { s as normalizeThinkLevel, u as normalizeVerboseLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { i as resolveExplicitAgentSessionKey, n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import "./thinking-B1p5pEC8.mjs";
import { t as clearAllCliSessions } from "./cli-session-binding-BhV_HbVa.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { s as isModelSelectionLocked } from "./model-overrides-FXSJttoI.mjs";
import { s as hasTerminalMainSessionTranscriptNewerThanRegistrySync, u as resolveSessionLifecycleTimestamps } from "./lifecycle-CQXOIBZ7.mjs";
import { n as resolveSessionResetPolicy, t as evaluateSessionFreshness } from "./reset-policy-e-dYr0YY.mjs";
import { n as resolveSessionResetType, t as resolveChannelResetConfig } from "./reset-DqhvvJAq.mjs";
import { n as resolveSessionKey } from "./session-key-BiOR3qX7.mjs";
import { t as hasProviderOwnedSession } from "./entry-freshness-CRaGtTIX.mjs";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-CJjzDrhT.mjs";
import { r as clearBootstrapSnapshotOnSessionRollover } from "./bootstrap-cache-D3fnu3yg.mjs";
import "./cli-session-CeXeyPue.mjs";
import { c as transitionMainSessionRecovery } from "./main-session-recovery-state-uW-wldbD.mjs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/agents/command/session.ts
/**
* Resolves command session ids, keys, stores, and persisted thinking state.
*/
function clearRotatedSessionMetadata(entry) {
	const next = {
		...entry,
		sessionFile: void 0,
		status: void 0,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		startedAt: void 0,
		endedAt: void 0,
		runtimeMs: void 0,
		abortedLastRun: void 0,
		restartRecoveryForceSafeTools: void 0,
		restartRecoveryDeliveryContext: void 0,
		restartRecoveryDeliveryMediaUrls: void 0,
		restartRecoveryDisableMessageTool: void 0,
		restartRecoverySuppressTextDelivery: void 0,
		restartRecoveryDeliveryRequestFingerprint: void 0,
		restartRecoveryDeliveryRunId: void 0,
		restartRecoveryDeliverySourceRunId: void 0,
		restartRecoveryBeforeAgentReplyState: void 0,
		restartRecoveryDeliveryReceiptState: void 0,
		restartRecoveryDeliveryToolCallId: void 0,
		restartRecoveryRequesterAccountId: void 0,
		restartRecoveryRequesterSenderId: void 0,
		restartRecoverySameChannelThreadRequired: void 0,
		restartRecoverySourceIngress: void 0,
		restartRecoverySourceReplyDeliveryMode: void 0,
		restartRecoveryTerminalDeliveryEvidence: void 0,
		restartRecoveryTerminalRunIds: void 0,
		sessionStartedAt: void 0,
		sessionDiffBaseline: void 0,
		sessionDiffBaselineCapture: void 0,
		lastInteractionAt: void 0,
		pendingTranscriptRepair: void 0
	};
	transitionMainSessionRecovery(next, { kind: "clear" });
	clearAllCliSessions(next);
	return next;
}
function selectSessionIdMatchCandidate(candidates, sessionId) {
	const selection = resolveSessionIdMatchSelection(candidates.map((candidate) => [candidate.sessionKey, candidate.entry]), sessionId);
	if (selection.kind !== "selected") return;
	return candidates.filter((candidate) => candidate.sessionKey === selection.sessionKey).toSorted((left, right) => {
		const updatedAt = (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0);
		if (updatedAt !== 0) return updatedAt;
		if (left.primary !== right.primary) return left.primary ? -1 : 1;
		return (left.resolution.agentId ?? "").localeCompare(right.resolution.agentId ?? "");
	})[0];
}
function loadCommandSessionEntries(params) {
	return listSessionEntriesReadOnly({
		storePath: params.storePath,
		...params.agentId ? { agentId: params.agentId } : {},
		clone: false
	});
}
/** Builds the synthetic session key used for explicit session-id runs. */
function buildExplicitSessionIdSessionKey(params) {
	return `agent:${normalizeAgentId(params.agentId)}:explicit:${params.sessionId.trim()}`;
}
function collectSessionIdMatchesForRequest(opts) {
	const candidates = [];
	let ownerConflict = false;
	const configuredAgentIds = listAgentIds(opts.cfg).map(normalizeAgentId);
	const compatibilityAgentId = tryResolveLegacyCompatibilityAgentId(opts.cfg);
	const persistedStoreOwner = resolvePersistedSessionStoreOwner(opts.cfg);
	const configuredStoreOwners = /* @__PURE__ */ new Map();
	for (const agentId of configuredAgentIds) {
		const configuredStorePath = path.resolve(resolveSessionStorePathCore(opts.cfg.session?.store, { agentId }));
		const owners = configuredStoreOwners.get(configuredStorePath) ?? /* @__PURE__ */ new Set();
		owners.add(agentId);
		configuredStoreOwners.set(configuredStorePath, owners);
	}
	const addMatches = (candidateEntries, candidateStorePath, candidateAgentId, options) => {
		for (const { sessionKey: candidateKey, entry: candidateEntry } of candidateEntries) {
			if (candidateEntry?.sessionId !== opts.sessionId) continue;
			const normalizedCandidateAgentId = candidateAgentId ? normalizeAgentId(candidateAgentId) : void 0;
			const scopedCandidateAgentId = normalizedCandidateAgentId && configuredAgentIds.includes(normalizedCandidateAgentId) ? normalizedCandidateAgentId : void 0;
			const pathOwners = configuredStoreOwners.get(path.resolve(candidateStorePath));
			const pathOwnedAgentId = pathOwners?.size === 1 ? pathOwners.values().next().value : void 0;
			const parsedAgentId = parseAgentSessionKey(candidateKey)?.agentId;
			const normalizedParsedAgentId = parsedAgentId ? normalizeAgentId(parsedAgentId) : void 0;
			if (normalizedParsedAgentId && !configuredAgentIds.includes(normalizedParsedAgentId)) continue;
			const isLegacyUnscopedKey = classifySessionKeyShape(candidateKey) === "legacy_or_alias";
			const legacyUnscopedOwner = isLegacyUnscopedKey ? persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : persistedStoreOwner.kind === "retired" ? void 0 : pathOwnedAgentId ?? (opts.searchOtherAgentStores ? void 0 : scopedCandidateAgentId) ?? compatibilityAgentId : void 0;
			const matchedAgentId = normalizedParsedAgentId ?? (isLegacyUnscopedKey ? legacyUnscopedOwner : scopedCandidateAgentId ?? compatibilityAgentId);
			if (isLegacyUnscopedKey && persistedStoreOwner.kind === "retired") {
				ownerConflict = true;
				continue;
			}
			if (!opts.searchOtherAgentStores && scopedCandidateAgentId && matchedAgentId && normalizeAgentId(matchedAgentId) !== scopedCandidateAgentId) {
				ownerConflict = true;
				continue;
			}
			candidates.push({
				sessionKey: candidateKey,
				entry: candidateEntry,
				primary: options?.primary === true,
				resolution: {
					...matchedAgentId ? { agentId: normalizeAgentId(matchedAgentId) } : {},
					sessionKey: candidateKey,
					storePath: candidateStorePath
				}
			});
		}
	};
	addMatches(opts.sessionEntries, opts.storePath, opts.storeAgentId, { primary: true });
	if (!opts.searchOtherAgentStores) return {
		candidates,
		ownerConflict
	};
	for (const agentId of configuredAgentIds) {
		if (agentId === opts.storeAgentId) continue;
		const candidateStorePath = resolveSessionStorePathCore(opts.cfg.session?.store, { agentId });
		addMatches(loadCommandSessionEntries({
			agentId,
			storePath: candidateStorePath
		}), candidateStorePath, agentId);
	}
	return {
		candidates,
		ownerConflict
	};
}
/**
* Resolve an existing stored session key for a session id from a specific agent store.
* This scopes the lookup to the target store without implicitly converting `agentId`
* into that agent's main session key.
*/
function resolveStoredSessionKeyForSessionId(opts) {
	const sessionId = opts.sessionId.trim();
	const requestedAgentId = opts.agentId?.trim() ? normalizeAgentId(opts.agentId) : void 0;
	const persistedStoreOwner = resolvePersistedSessionStoreOwner(opts.cfg);
	const storeAgentId = requestedAgentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? tryResolveLegacyCompatibilityAgentId(opts.cfg) ?? resolveDefaultAgentId(opts.cfg, {
		surface: "stored session lookup",
		hint: "Pass an explicit agent id when looking up a session by id."
	});
	const storePath = resolveSessionStorePathCore(opts.cfg.session?.store, { agentId: storeAgentId });
	const sessionEntries = loadCommandSessionEntries({
		storePath,
		agentId: storeAgentId
	});
	if (!sessionId) return {
		sessionKey: void 0,
		storePath
	};
	const resolveMatchedAgentId = (sessionKey) => {
		const scopedAgentId = parseAgentSessionKey(sessionKey)?.agentId;
		if (scopedAgentId) return normalizeAgentId(scopedAgentId);
		const persistedRowOwner = resolvePersistedSessionStoreOwnerForKey(opts.cfg, sessionKey);
		return persistedRowOwner.kind === "configured" ? persistedRowOwner.agentId : persistedRowOwner.kind === "retired" ? void 0 : requestedAgentId ?? tryResolveLegacyCompatibilityAgentId(opts.cfg);
	};
	const sessionIdMatches = sessionEntries.filter(({ entry }) => entry.sessionId === sessionId);
	const selectionMatches = requestedAgentId ? sessionIdMatches.filter(({ sessionKey }) => resolveMatchedAgentId(sessionKey) === requestedAgentId) : sessionIdMatches;
	if (requestedAgentId && selectionMatches.length === 0 && sessionIdMatches.length > 0) throw new AgentSelectionRequiredError(listAgentIds(opts.cfg), {
		surface: `stored session id "${sessionId}"`,
		hint: `The matching rows belong to a different agent than agent "${requestedAgentId}".`
	});
	const selection = resolveSessionIdMatchSelection(selectionMatches.map(({ sessionKey, entry }) => [sessionKey, entry]), sessionId);
	if (selection.kind !== "selected") return {
		agentId: requestedAgentId,
		sessionKey: void 0,
		storePath
	};
	const sessionKey = selection.sessionKey;
	const persistedRowOwner = resolvePersistedSessionStoreOwnerForKey(opts.cfg, sessionKey);
	const resolvedAgentId = resolveMatchedAgentId(sessionKey);
	if (!resolvedAgentId) throw new AgentSelectionRequiredError(listAgentIds(opts.cfg), {
		surface: `stored session key "${sessionKey}"`,
		hint: persistedRowOwner.kind === "retired" ? `The shared fixed-store row belongs to retired agent "${persistedRowOwner.agentId}".` : "Pass an explicit agent id when looking up an unscoped session by id."
	});
	if (requestedAgentId && requestedAgentId !== resolvedAgentId) throw new AgentSelectionRequiredError(listAgentIds(opts.cfg), {
		surface: `stored session key "${sessionKey}"`,
		hint: `The matching row belongs to agent "${resolvedAgentId}", not agent "${requestedAgentId}".`
	});
	return {
		agentId: resolvedAgentId,
		sessionKey,
		sessionEntry: structuredClone(selectionMatches.find((match) => match.sessionKey === sessionKey)?.entry),
		storePath
	};
}
function resolveSessionKeyForRequestInternal(opts) {
	const sessionCfg = opts.cfg.session;
	const scope = sessionCfg?.scope ?? "per-sender";
	const mainKey = normalizeMainKey(sessionCfg?.mainKey);
	const requestedAgentId = opts.agentId?.trim() ? normalizeAgentId(opts.agentId) : void 0;
	const requestedSessionId = opts.sessionId?.trim() || void 0;
	const requestedSessionKey = opts.sessionKey?.trim() || void 0;
	const toSessionKey = !requestedSessionKey && !requestedSessionId && classifySessionKeyShape(opts.to) === "agent" ? opts.to?.trim() : void 0;
	const explicitSessionKey = requestedSessionKey || toSessionKey || (!requestedSessionId ? resolveExplicitAgentSessionKey({
		cfg: opts.cfg,
		agentId: requestedAgentId
	}) : void 0);
	const scopedSessionAgentId = parseAgentSessionKey(explicitSessionKey)?.agentId;
	const explicitKeyStoreOwner = resolvePersistedSessionStoreOwnerForKey(opts.cfg, explicitSessionKey);
	if (explicitKeyStoreOwner.kind === "configured" && requestedAgentId && requestedAgentId !== explicitKeyStoreOwner.agentId) throw new AgentSelectionRequiredError(listAgentIds(opts.cfg), {
		surface: `session key "${explicitSessionKey}"`,
		hint: `The shared fixed-store row belongs to agent "${explicitKeyStoreOwner.agentId}", not --agent "${requestedAgentId}".`
	});
	if (explicitKeyStoreOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(opts.cfg), {
		surface: `session key "${explicitSessionKey}"`,
		hint: `The shared fixed-store row belongs to retired agent "${explicitKeyStoreOwner.agentId}".`
	});
	const knownAgentId = requestedAgentId ?? scopedSessionAgentId ?? (explicitKeyStoreOwner.kind === "configured" ? explicitKeyStoreOwner.agentId : void 0) ?? tryResolveLegacyCompatibilityAgentId(opts.cfg);
	const unownedBareSessionKey = Boolean(requestedSessionId && explicitSessionKey && classifySessionKeyShape(explicitSessionKey) === "legacy_or_alias" && !knownAgentId);
	const sessionIdScanAnchor = requestedSessionId ? knownAgentId ?? listAgentIds(opts.cfg)[0] : void 0;
	const defaultAgentId = knownAgentId ? normalizeAgentId(knownAgentId) : requestedSessionId ? void 0 : normalizeAgentId(resolveDefaultAgentId(opts.cfg, {
		surface: "agent command session routing",
		hint: "Pass --agent <id> or an agent-prefixed --session-key."
	}));
	const storeAgentId = explicitSessionKey ? unownedBareSessionKey ? sessionIdScanAnchor : isUnscopedSessionKeySentinel(explicitSessionKey) ? requestedAgentId ?? defaultAgentId : resolveAgentIdFromSessionKey(explicitSessionKey, defaultAgentId) : requestedAgentId ?? defaultAgentId ?? sessionIdScanAnchor;
	if (!storeAgentId) throw new AgentSelectionRequiredError(listAgentIds(opts.cfg), {
		surface: "agent command session routing",
		hint: "Pass --agent <id> or an agent-prefixed --session-key."
	});
	const storePath = resolveSessionStorePathCore(sessionCfg?.store, { agentId: storeAgentId });
	const ctx = opts.to?.trim() ? { From: opts.to } : void 0;
	let sessionKey = (!unownedBareSessionKey && explicitSessionKey ? canonicalizeMainSessionAlias({
		cfg: opts.cfg,
		agentId: storeAgentId,
		sessionKey: explicitSessionKey
	}) : void 0) ?? (!unownedBareSessionKey && ctx ? resolveSessionKey(scope, ctx, mainKey, storeAgentId) : void 0);
	const storeSessionKey = sessionKey ? normalizeStoreSessionKey(sessionKey) : void 0;
	const sessionEntry = storeSessionKey && !isInternalSessionEffectsKey(storeSessionKey) ? loadExactSessionEntryReadOnly({
		agentId: storeAgentId,
		storePath,
		sessionKey: storeSessionKey
	})?.entry : void 0;
	if (requestedSessionId && (!explicitSessionKey || unownedBareSessionKey) && (!sessionKey || sessionEntry?.sessionId !== requestedSessionId)) {
		const { candidates, ownerConflict } = collectSessionIdMatchesForRequest({
			cfg: opts.cfg,
			sessionEntries: loadCommandSessionEntries({
				storePath,
				agentId: storeAgentId
			}),
			storePath,
			storeAgentId,
			sessionId: requestedSessionId,
			searchOtherAgentStores: requestedAgentId === void 0
		});
		const selectedMatch = selectSessionIdMatchCandidate(candidates.filter((candidate) => candidate.resolution.agentId !== void 0), requestedSessionId);
		if (selectedMatch) return {
			...selectedMatch.resolution,
			sessionEntry: structuredClone(selectedMatch.entry)
		};
		if (ownerConflict) throw new AgentSelectionRequiredError(listAgentIds(opts.cfg), {
			surface: `session id "${requestedSessionId}"`,
			hint: requestedAgentId ? `The matching session belongs to a different agent than --agent "${requestedAgentId}".` : "The matching unscoped session belongs to a retired fixed-store owner."
		});
	}
	if (requestedSessionId && !sessionKey && opts.createMissingSessionId) {
		const explicitSessionAgentId = requestedAgentId ?? tryResolveLegacyCompatibilityAgentId(opts.cfg) ?? resolveDefaultAgentId(opts.cfg, {
			surface: "agent command session creation",
			hint: "Pass --agent <id> when creating a session from --session-id."
		});
		sessionKey = buildExplicitSessionIdSessionKey({
			sessionId: requestedSessionId,
			agentId: explicitSessionAgentId
		});
		return {
			agentId: explicitSessionAgentId,
			sessionKey,
			storePath
		};
	}
	return {
		agentId: storeAgentId,
		sessionKey,
		sessionEntry,
		storePath
	};
}
/** Resolves an existing session-id row across agent stores without creating a fallback key. */
function resolveExistingSessionKeyForRequest(opts) {
	return resolveSessionKeyForRequestInternal({
		...opts,
		createMissingSessionId: false
	});
}
/** Resolves the session key/store targeted by one command request. */
function resolveSessionKeyForRequest(opts) {
	return resolveSessionKeyForRequestInternal({
		...opts,
		createMissingSessionId: true
	});
}
/** Core alias retained for runtime owners that bypass the public library facade. */
function resolveSessionKeyForRequestCore(opts) {
	return resolveSessionKeyForRequest(opts);
}
/** Resolves or creates the session used by one agent command request. */
function resolveSession(opts) {
	const sessionCfg = opts.cfg.session;
	const { agentId: resolvedAgentId, sessionKey, sessionEntry, storePath } = resolveSessionKeyForRequestCore({
		cfg: opts.cfg,
		to: opts.to,
		sessionId: opts.sessionId,
		sessionKey: opts.sessionKey,
		agentId: opts.agentId
	});
	const now = Date.now();
	const sessionAgentId = (opts.agentId?.trim() ? normalizeAgentId(opts.agentId) : void 0) ?? resolvedAgentId ?? parseAgentSessionKey(sessionKey)?.agentId ?? tryResolveLegacyCompatibilityAgentId(opts.cfg) ?? resolveDefaultAgentId(opts.cfg, {
		surface: "agent command session ownership",
		hint: "Pass --agent <id> or an agent-prefixed --session-key."
	});
	const resetType = resolveSessionResetType({ sessionKey });
	const channelReset = resolveChannelResetConfig({
		sessionCfg,
		channel: sessionDeliveryChannel(sessionEntry)
	});
	const resetPolicy = resolveSessionResetPolicy({
		sessionCfg,
		resetType,
		resetOverride: channelReset
	});
	const requestedSessionId = opts.sessionId?.trim() || void 0;
	const terminalMainTranscriptNewerThanRegistry = sessionEntry && !requestedSessionId ? hasTerminalMainSessionTranscriptNewerThanRegistrySync({
		entry: sessionEntry,
		sessionScope: sessionCfg?.scope,
		sessionKey,
		agentId: sessionAgentId,
		mainKey: sessionCfg?.mainKey,
		storePath
	}) : false;
	const lockedModelSelection = isModelSelectionLocked(sessionEntry);
	const skipImplicitExpiry = resetPolicy.configured !== true && hasProviderOwnedSession(sessionEntry);
	const fresh = sessionEntry ? lockedModelSelection || !terminalMainTranscriptNewerThanRegistry && (skipImplicitExpiry || evaluateSessionFreshness({
		updatedAt: sessionEntry.updatedAt,
		...resolveSessionLifecycleTimestamps({
			entry: sessionEntry,
			agentId: sessionAgentId,
			sessionKey,
			storePath
		}),
		now,
		policy: resetPolicy
	}).fresh) : false;
	const sessionId = requestedSessionId || (fresh ? sessionEntry?.sessionId : void 0) || crypto.randomUUID();
	const isNewSession = !fresh && !requestedSessionId;
	const resolvedSessionEntry = isNewSession && sessionEntry ? clearRotatedSessionMetadata(sessionEntry) : sessionEntry;
	clearBootstrapSnapshotOnSessionRollover({
		sessionKey,
		previousSessionId: isNewSession ? sessionEntry?.sessionId : void 0
	});
	const persistedThinking = sessionEntry?.thinkingLevel ? normalizeThinkLevel(sessionEntry.thinkingLevel) : void 0;
	const persistedVerbose = sessionEntry?.verboseLevel ? normalizeVerboseLevel(sessionEntry.verboseLevel) : void 0;
	return {
		sessionAgentId,
		sessionId,
		sessionKey,
		sessionEntry: resolvedSessionEntry,
		storePath,
		isNewSession,
		previousSessionId: isNewSession ? sessionEntry?.sessionId : void 0,
		persistedThinking,
		persistedVerbose
	};
}
//#endregion
export { resolveSessionKeyForRequestCore as a, resolveSession as i, clearRotatedSessionMetadata as n, resolveStoredSessionKeyForSessionId as o, resolveExistingSessionKeyForRequest as r, buildExplicitSessionIdSessionKey as t };
