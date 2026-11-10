import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as normalizeMainKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey, o as classifySessionKeyShape, s as isUnscopedSessionKeySentinel } from "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, _ as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey, t as resolvePersistedSessionStoreOwner } from "./session-store-owner-iJNKNMuJ.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { f as normalizeVerboseLevel, l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
import { i as resolveExplicitAgentSessionKey, n as canonicalizeMainSessionAlias } from "./main-session-CHYPkxYr.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { t as clearAllCliSessions } from "./cli-session-binding-Dx1VbkI8.mjs";
import { a as isModelSelectionLocked } from "./model-overrides-CgHG3YVT.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as readSessionEntryReadOnlyInWorker, u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as resolveSessionResetPolicy, i as evaluateSessionFreshness, n as resolveSessionResetType, t as resolveChannelResetConfig } from "./reset-DlE-iD9Z.mjs";
import { n as resolveSessionKey } from "./session-key-Sn5H-nwW.mjs";
import "./thinking-BCNoGfZ5.mjs";
import { t as hasProviderOwnedSession } from "./entry-freshness-kcEsDHPL.mjs";
import { n as resolveSessionLifecycleTimestampsAsync, t as hasTerminalMainSessionTranscriptNewerThanRegistryAsync } from "./lifecycle-read-BY2ebrMY.mjs";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-B3ptFjot.mjs";
import { r as clearBootstrapSnapshotOnSessionRollover } from "./bootstrap-cache-DPiLx4Sp.mjs";
import "./cli-session-CBCjrsL6.mjs";
import { s as transitionMainSessionRecovery } from "./main-session-recovery-state-sCZeKFHp.mjs";
import crypto from "node:crypto";
import path from "node:path";
//#region src/agents/session-reset-metadata.ts
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
		restartRecoveryOperatorSource: void 0,
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
//#endregion
//#region src/agents/command/session.ts
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
async function loadCommandSessionIdMatches(params) {
	return withSessionStoreReaderInWorker(params, async ({ reader, database, continuation }) => {
		return (await reader.readExactEntries({
			selection: {
				kind: "session-id-or-key",
				sessionIdOrKey: params.sessionId
			},
			projection: "list",
			env: database.env,
			continuation
		})).entries.filter(({ entry }) => entry.sessionId === params.sessionId);
	}, {
		backing: true,
		dataOnly: true
	});
}
async function readCommandSessionIdMatch(scope, sessionId) {
	const entry = await readSessionEntryReadOnlyInWorker(scope);
	if (entry?.sessionId !== sessionId) throw new Error("Stored session changed while resolving its ID. Retry the request.");
	return entry;
}
function buildExplicitSessionIdSessionKey(params) {
	return `agent:${normalizeAgentId(params.agentId)}:explicit:${params.sessionId.trim()}`;
}
async function collectSessionIdMatchesForRequest(opts) {
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
		const candidateStoreTarget = resolveUnsuffixedSqliteTargetFromSessionStorePath(candidateStorePath);
		for (const { sessionKey: candidateKey, entry: candidateEntry } of candidateEntries) {
			const normalizedCandidateAgentId = candidateAgentId ? normalizeAgentId(candidateAgentId) : void 0;
			const scopedCandidateAgentId = normalizedCandidateAgentId && configuredAgentIds.includes(normalizedCandidateAgentId) ? normalizedCandidateAgentId : void 0;
			const pathOwners = configuredStoreOwners.get(path.resolve(candidateStorePath));
			const pathOwnedAgentId = pathOwners?.size === 1 ? pathOwners.values().next().value : void 0;
			const parsedAgentId = parseAgentSessionKey(candidateKey)?.agentId;
			const normalizedParsedAgentId = parsedAgentId ? normalizeAgentId(parsedAgentId) : void 0;
			if (normalizedParsedAgentId && !configuredAgentIds.includes(normalizedParsedAgentId)) continue;
			const isLegacyUnscopedKey = classifySessionKeyShape(candidateKey) === "legacy_or_alias";
			const legacyUnscopedOwner = isLegacyUnscopedKey ? persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : persistedStoreOwner.kind === "retired" ? void 0 : (!candidateStoreTarget.shared ? scopedCandidateAgentId : void 0) ?? pathOwnedAgentId ?? (opts.searchOtherAgentStores ? void 0 : scopedCandidateAgentId) ?? compatibilityAgentId : void 0;
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
		addMatches(await loadCommandSessionIdMatches({
			agentId,
			storePath: candidateStorePath,
			sessionId: opts.sessionId
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
async function resolveStoredSessionKeyForSessionId(opts) {
	const sessionId = opts.sessionId.trim();
	const requestedAgentId = opts.agentId?.trim() ? normalizeAgentId(opts.agentId) : void 0;
	const persistedStoreOwner = resolvePersistedSessionStoreOwner(opts.cfg);
	const storeAgentId = requestedAgentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? tryResolveLegacyCompatibilityAgentId(opts.cfg) ?? resolveDefaultAgentId(opts.cfg, {
		surface: "stored session lookup",
		hint: "Pass an explicit agent id when looking up a session by id."
	});
	const storePath = resolveSessionStorePathCore(opts.cfg.session?.store, { agentId: storeAgentId });
	if (!sessionId) return {
		sessionKey: void 0,
		storePath
	};
	const sessionIdMatches = await loadCommandSessionIdMatches({
		storePath,
		agentId: storeAgentId,
		sessionId
	});
	const resolveMatchedAgentId = (sessionKey) => {
		const scopedAgentId = parseAgentSessionKey(sessionKey)?.agentId;
		if (scopedAgentId) return normalizeAgentId(scopedAgentId);
		const persistedRowOwner = resolvePersistedSessionStoreOwnerForKey(opts.cfg, sessionKey);
		return persistedRowOwner.kind === "configured" ? persistedRowOwner.agentId : persistedRowOwner.kind === "retired" ? void 0 : requestedAgentId ?? tryResolveLegacyCompatibilityAgentId(opts.cfg);
	};
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
		sessionEntry: await readCommandSessionIdMatch({
			agentId: resolvedAgentId,
			storePath,
			sessionKey
		}, sessionId),
		storePath
	};
}
async function resolveSessionKeyForRequestInternal(opts) {
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
	const sessionEntry = storeSessionKey && !isInternalSessionEffectsKey(storeSessionKey) && !(opts.prepareBoundEntry && captureSessionActorStorageOwner({
		agentId: storeAgentId,
		storePath,
		sessionKey: storeSessionKey
	}, {
		assertCurrent() {},
		authorize() {}
	})) ? await readSessionEntryReadOnlyInWorker({
		agentId: storeAgentId,
		storePath,
		sessionKey: storeSessionKey
	}) : void 0;
	if (requestedSessionId && (!explicitSessionKey || unownedBareSessionKey) && (!sessionKey || sessionEntry?.sessionId !== requestedSessionId)) {
		const { candidates, ownerConflict } = await collectSessionIdMatchesForRequest({
			cfg: opts.cfg,
			sessionEntries: await loadCommandSessionIdMatches({
				storePath,
				agentId: storeAgentId,
				sessionId: requestedSessionId
			}),
			storePath,
			storeAgentId,
			sessionId: requestedSessionId,
			searchOtherAgentStores: requestedAgentId === void 0
		});
		const selectedMatch = selectSessionIdMatchCandidate(candidates.filter((candidate) => candidate.resolution.agentId !== void 0), requestedSessionId);
		if (selectedMatch) return {
			...selectedMatch.resolution,
			sessionEntry: await readCommandSessionIdMatch(selectedMatch.resolution, requestedSessionId)
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
function resolveSessionKeyForRequestCore(opts) {
	return resolveSessionKeyForRequestInternal({
		...opts,
		createMissingSessionId: true
	});
}
async function resolveSession(opts) {
	const sessionCfg = opts.cfg.session;
	const { agentId: resolvedAgentId, sessionKey, sessionEntry: routedEntry, storePath } = await resolveSessionKeyForRequestInternal({
		...opts,
		createMissingSessionId: true,
		prepareBoundEntry: true
	});
	const scope = {
		agentId: resolvedAgentId,
		sessionKey: sessionKey ?? "",
		storePath
	};
	const memory = sessionKey && !isInternalSessionEffectsKey(sessionKey) ? captureSessionActorStorageOwner(scope, {
		assertCurrent() {
			opts.signal?.throwIfAborted();
			opts.assertCurrent?.();
		},
		authorize() {}
	}) : void 0;
	const sessionEntry = memory && sessionKey ? readCapturedSessionActorEntry(memory, normalizeStoreSessionKey(sessionKey)) : routedEntry;
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
	const terminalMainTranscriptNewerThanRegistry = sessionEntry && !requestedSessionId ? await hasTerminalMainSessionTranscriptNewerThanRegistryAsync({
		entry: sessionEntry,
		sessionScope: sessionCfg?.scope,
		sessionKey,
		agentId: sessionAgentId,
		mainKey: sessionCfg?.mainKey,
		storePath,
		signal: opts.signal
	}) : false;
	const lockedModelSelection = isModelSelectionLocked(sessionEntry);
	const skipImplicitExpiry = resetPolicy.configured !== true && hasProviderOwnedSession(sessionEntry);
	const freshness = sessionEntry && !lockedModelSelection && !terminalMainTranscriptNewerThanRegistry && !skipImplicitExpiry ? evaluateSessionFreshness({
		updatedAt: sessionEntry.updatedAt,
		...sessionKey ? await resolveSessionLifecycleTimestampsAsync({
			entry: sessionEntry,
			agentId: sessionAgentId,
			sessionKey,
			storePath,
			signal: opts.signal
		}) : {},
		now,
		policy: resetPolicy
	}) : void 0;
	const fresh = Boolean(sessionEntry && (lockedModelSelection || !terminalMainTranscriptNewerThanRegistry && (skipImplicitExpiry || freshness?.fresh)));
	opts.signal?.throwIfAborted();
	opts.assertCurrent?.();
	const isNewSession = !fresh && !requestedSessionId;
	const automaticReset = isNewSession && sessionEntry && freshness?.staleReason && !terminalMainTranscriptNewerThanRegistry ? {
		reason: freshness.staleReason,
		expectedLifecycleRevision: sessionEntry.lifecycleRevision
	} : void 0;
	const sessionId = requestedSessionId || (fresh || automaticReset ? sessionEntry?.sessionId : void 0) || crypto.randomUUID();
	const resolvedSessionEntry = isNewSession && sessionEntry ? clearRotatedSessionMetadata(sessionEntry) : sessionEntry;
	if (!automaticReset) clearBootstrapSnapshotOnSessionRollover({
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
		automaticReset,
		persistedThinking,
		persistedVerbose
	};
}
//#endregion
export { resolveStoredSessionKeyForSessionId as a, resolveSessionKeyForRequestCore as i, resolveExistingSessionKeyForRequest as n, clearRotatedSessionMetadata as o, resolveSession as r, buildExplicitSessionIdSessionKey as t };
