import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { i as resolveSessionAuthProfileOverrideSource } from "./auth-profile-override-provenance-B84_9MMh.mjs";
import { E as hasSessionAutoModelFallbackProvenance } from "./agent-scope-CTuYDtny.mjs";
import { t as clearAllCliSessions } from "./cli-session-binding-BhV_HbVa.mjs";
import { a as preserveCreationStamp } from "./session-entry-provenance-C-JyMH54.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { i as readSessionEntriesFromStoreInWorker } from "./session-accessor-C05KQ5A3.mjs";
import { d as resolveSessionWorkStartError } from "./lifecycle-CQXOIBZ7.mjs";
import { n as resolveSessionResetPolicy, t as evaluateSessionFreshness } from "./reset-policy-e-dYr0YY.mjs";
import { t as hasProviderOwnedSession } from "./entry-freshness-CRaGtTIX.mjs";
import "./cli-session-CeXeyPue.mjs";
import crypto from "node:crypto";
//#region src/cron/isolated-agent/session.ts
/** Resolves session rollover and carried state for isolated cron runs. */
const FRESH_CRON_CARRIED_PREFERENCE_FIELDS = [
	"chatType",
	"thinkingLevel",
	"fastMode",
	"verboseLevel",
	"traceLevel",
	"reasoningLevel",
	"ttsAuto",
	"responseUsage",
	"pinnedAt",
	"label",
	"displayName"
];
const AMBIENT_SESSION_CONTEXT_FIELDS = [
	"elevatedLevel",
	"groupActivation",
	"groupActivationNeedsSystemIntro",
	"sendPolicy",
	"queueMode",
	"queueDebounceMs",
	"queueCap",
	"queueDrop",
	"groupId",
	"subject",
	"groupChannel",
	"space",
	"acp"
];
function cloneSessionField(value) {
	return globalThis.structuredClone(value);
}
function copySessionFields(target, entry, fields) {
	for (const field of fields) if (entry[field] !== void 0) target[field] = cloneSessionField(entry[field]);
}
function preserveNonAutoModelOverride(target, entry) {
	if (entry.modelOverrideSource === "default") {
		target.modelOverrideSource = "default";
		return;
	}
	const recoveredAutoFallbackOverride = entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry);
	if (entry.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) {
		let preservedModelSelection = false;
		if (entry.modelOverride !== void 0) {
			target.modelOverride = entry.modelOverride;
			preservedModelSelection = true;
		}
		if (entry.providerOverride !== void 0) target.providerOverride = entry.providerOverride;
		if (entry.modelOverrideSource !== void 0) target.modelOverrideSource = entry.modelOverrideSource;
		if (entry.modelOverrideRouteResolution !== void 0) target.modelOverrideRouteResolution = entry.modelOverrideRouteResolution;
		if (preservedModelSelection && entry.agentRuntimeOverride !== void 0) target.agentRuntimeOverride = entry.agentRuntimeOverride;
	}
}
function preserveUserAuthOverride(target, entry) {
	const source = resolveSessionAuthProfileOverrideSource(entry);
	if (source === "user") {
		if (entry.authProfileOverride !== void 0) target.authProfileOverride = entry.authProfileOverride;
		target.authProfileOverrideSource = source;
		if (entry.authProfileOverrideCompactionCount !== void 0) target.authProfileOverrideCompactionCount = entry.authProfileOverrideCompactionCount;
	}
}
function sanitizeFreshCronSessionEntry(entry, options) {
	const next = {};
	copySessionFields(next, entry, FRESH_CRON_CARRIED_PREFERENCE_FIELDS);
	if (entry.skillLibrarySelections) next.skillLibrarySelections = entry.skillLibrarySelections.map((selection) => ({ ...selection }));
	if (options.preserveAmbientContext) copySessionFields(next, entry, AMBIENT_SESSION_CONTEXT_FIELDS);
	preserveNonAutoModelOverride(next, entry);
	preserveUserAuthOverride(next, entry);
	return next;
}
/**
* Reads the current cron session row without an in-process cache snapshot.
* Lifecycle admission guards compare this against the run's initial entry, so
* the read must bypass cached store snapshots (accessor readConsistency
* "latest"). Cron keys are canonicalized before use, so accessor key
* resolution selects the same row the cron persist path writes.
*/
function loadCronSessionEntryLatest(storePath, sessionKey) {
	return loadSessionEntry({
		sessionKey,
		storePath,
		readConsistency: "latest"
	});
}
async function prepareCronSession(params) {
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	const sourceSessionKey = params.sourceSessionKey?.trim();
	const prepared = await readSessionEntriesFromStoreInWorker({
		agentId: params.agentId,
		storePath,
		sessionKeys: [params.sessionKey, ...sourceSessionKey ? [sourceSessionKey] : []].filter((sessionKey) => !isInternalSessionEffectsKey(sessionKey)),
		lifecycleSessionKey: params.forceNew ? void 0 : sourceSessionKey || params.sessionKey
	});
	return resolveCronSession({
		...params,
		store: Object.fromEntries(prepared.entries.map(({ sessionKey, entry }) => [sessionKey, entry])),
		lifecycleTimestamps: prepared.lifecycleTimestamps,
		storePath
	});
}
/** Resolves prepared rows; heartbeat can supply its writer-owned current row. */
function resolveCronSession(params) {
	const sessionCfg = params.cfg.session;
	const storePath = params.storePath ?? resolveSessionStorePathCore(sessionCfg?.store, { agentId: params.agentId });
	const store = params.store;
	const sourceSessionKey = params.sourceSessionKey?.trim();
	const sourceSessionDiffers = Boolean(sourceSessionKey && sourceSessionKey !== params.sessionKey);
	const targetEntry = store[params.sessionKey];
	const entry = store[sourceSessionKey || params.sessionKey];
	const canRollArchivedHeartbeat = params.forceNew === true && targetEntry?.archivedAt !== void 0 && targetEntry.initializationPending !== true && Boolean(targetEntry.heartbeatIsolatedBaseSessionKey?.trim());
	const sessionWorkStartError = resolveSessionWorkStartError(params.sessionKey, targetEntry);
	if (sessionWorkStartError && !canRollArchivedHeartbeat) throw new Error(sessionWorkStartError);
	let sessionId;
	let isNewSession;
	let systemSent;
	let resetBoundaryPending;
	if (!params.forceNew && entry?.sessionId) {
		const resetPolicy = resolveSessionResetPolicy({
			sessionCfg,
			resetType: "direct"
		});
		if ((resetPolicy.configured !== true && hasProviderOwnedSession(entry) ? { fresh: true } : evaluateSessionFreshness({
			updatedAt: entry.updatedAt,
			...params.lifecycleTimestamps,
			now: params.nowMs,
			policy: resetPolicy
		})).fresh) {
			sessionId = entry.sessionId;
			isNewSession = false;
			systemSent = entry.systemSent ?? false;
		} else {
			sessionId = sourceSessionDiffers ? crypto.randomUUID() : entry.sessionId;
			isNewSession = true;
			systemSent = false;
			if (!sourceSessionDiffers) resetBoundaryPending = {
				reason: "cron-stale",
				sessionFile: params.sessionKey
			};
		}
	} else {
		sessionId = crypto.randomUUID();
		isNewSession = true;
		systemSent = false;
	}
	const previousSessionId = isNewSession && !sourceSessionDiffers && !resetBoundaryPending ? entry?.sessionId : void 0;
	const baseEntry = entry ? isNewSession ? sanitizeFreshCronSessionEntry(entry, { preserveAmbientContext: !params.forceNew }) : entry : void 0;
	const lifecycleRevision = crypto.randomUUID();
	const sessionEntry = {
		...baseEntry,
		skillLibrarySelections: structuredClone(targetEntry?.skillLibrarySelections ?? params.skillLibrarySelections ?? baseEntry?.skillLibrarySelections),
		sessionId,
		lifecycleRevision,
		updatedAt: params.nowMs,
		sessionStartedAt: isNewSession ? params.nowMs : baseEntry?.sessionStartedAt ?? params.lifecycleTimestamps.sessionStartedAt,
		lastInteractionAt: isNewSession ? params.nowMs : baseEntry?.lastInteractionAt,
		...params.hookExternalContentSource ? { hookExternalContentSource: params.hookExternalContentSource } : {},
		systemSent
	};
	if (resetBoundaryPending) {
		clearAllCliSessions(sessionEntry);
		sessionEntry.agentHarnessId = void 0;
		sessionEntry.compactionCount = 0;
	}
	return {
		storePath,
		store,
		sessionEntry: preserveCreationStamp(sessionEntry, targetEntry),
		lifecycleRevision,
		systemSent,
		isNewSession,
		previousSessionId,
		resetBoundaryPending,
		initialSessionEntry: targetEntry
	};
}
//#endregion
export { prepareCronSession as n, resolveCronSession as r, loadCronSessionEntryLatest as t };
