import { T as hasSessionAutoModelFallbackProvenance } from "./agent-scope-B2Pk_xhT.js";
import { S as loadSessionStore } from "./store-Cvp82S16.js";
import { d as resolveStorePath } from "./paths-C2C4lJH6.js";
import { y as loadSessionEntry } from "./session-accessor-CwhXEUId.js";
import { c as resolveSessionWorkStartError, s as resolveSessionLifecycleTimestamps } from "./lifecycle-BS_t5emX.js";
import { c as resolveSessionResetPolicy, o as evaluateSessionFreshness } from "./reset-DE-TpJ-C.js";
import { t as hasProviderOwnedSession } from "./entry-freshness-BXBwABcM.js";
import { n as clearBootstrapSnapshotOnSessionRollover } from "./bootstrap-cache-BQ7ebKvJ.js";
import crypto from "node:crypto";
//#region src/cron/isolated-agent/session.ts
/** Resolves session rollover and carried state for isolated cron runs. */
const FRESH_CRON_CARRIED_PREFERENCE_FIELDS = [
	"heartbeatTaskState",
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
	"channel",
	"groupId",
	"subject",
	"groupChannel",
	"space",
	"origin",
	"acp"
];
function cloneSessionField(value) {
	return globalThis.structuredClone(value);
}
function copySessionFields(target, entry, fields) {
	for (const field of fields) if (entry[field] !== void 0) target[field] = cloneSessionField(entry[field]);
}
function preserveNonAutoModelOverride(target, entry) {
	const recoveredAutoFallbackOverride = entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry);
	if (entry.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) {
		let preservedModelSelection = false;
		if (entry.modelOverride !== void 0) {
			target.modelOverride = entry.modelOverride;
			preservedModelSelection = true;
		}
		if (entry.providerOverride !== void 0) target.providerOverride = entry.providerOverride;
		if (entry.modelOverrideSource !== void 0) target.modelOverrideSource = entry.modelOverrideSource;
		if (preservedModelSelection && entry.agentRuntimeOverride !== void 0) target.agentRuntimeOverride = entry.agentRuntimeOverride;
	}
}
function preserveUserAuthOverride(target, entry) {
	if (entry.authProfileOverrideSource === "user") {
		if (entry.authProfileOverride !== void 0) target.authProfileOverride = entry.authProfileOverride;
		target.authProfileOverrideSource = entry.authProfileOverrideSource;
		if (entry.authProfileOverrideCompactionCount !== void 0) target.authProfileOverrideCompactionCount = entry.authProfileOverrideCompactionCount;
	}
}
function sanitizeFreshCronSessionEntry(entry, options) {
	const next = {};
	copySessionFields(next, entry, FRESH_CRON_CARRIED_PREFERENCE_FIELDS);
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
/** Resolves or rolls over the cron session entry for one isolated-agent run. */
function resolveCronSession(params) {
	const sessionCfg = params.cfg.session;
	const storePath = resolveStorePath(sessionCfg?.store, { agentId: params.agentId });
	const store = params.store ?? loadSessionStore(storePath);
	const entry = store[params.sessionKey];
	const archivedSessionError = resolveSessionWorkStartError(params.sessionKey, entry);
	if (archivedSessionError) throw new Error(archivedSessionError);
	let sessionId;
	let isNewSession;
	let systemSent;
	if (!params.forceNew && entry?.sessionId) {
		const resetPolicy = resolveSessionResetPolicy({
			sessionCfg,
			resetType: "direct"
		});
		if ((resetPolicy.configured !== true && hasProviderOwnedSession(entry) ? { fresh: true } : evaluateSessionFreshness({
			updatedAt: entry.updatedAt,
			...resolveSessionLifecycleTimestamps({
				entry,
				agentId: params.agentId,
				storePath
			}),
			now: params.nowMs,
			policy: resetPolicy
		})).fresh) {
			sessionId = entry.sessionId;
			isNewSession = false;
			systemSent = entry.systemSent ?? false;
		} else {
			sessionId = crypto.randomUUID();
			isNewSession = true;
			systemSent = false;
		}
	} else {
		sessionId = crypto.randomUUID();
		isNewSession = true;
		systemSent = false;
	}
	const previousSessionId = isNewSession ? entry?.sessionId : void 0;
	clearBootstrapSnapshotOnSessionRollover({
		sessionKey: params.sessionKey,
		previousSessionId
	});
	const baseEntry = entry ? isNewSession ? sanitizeFreshCronSessionEntry(entry, { preserveAmbientContext: !params.forceNew }) : entry : void 0;
	const lifecycleRevision = crypto.randomUUID();
	return {
		storePath,
		store,
		sessionEntry: {
			...baseEntry,
			sessionId,
			lifecycleRevision,
			updatedAt: params.nowMs,
			sessionStartedAt: isNewSession ? params.nowMs : baseEntry?.sessionStartedAt ?? resolveSessionLifecycleTimestamps({
				entry,
				agentId: params.agentId,
				storePath
			}).sessionStartedAt,
			lastInteractionAt: isNewSession ? params.nowMs : baseEntry?.lastInteractionAt,
			systemSent
		},
		lifecycleRevision,
		systemSent,
		isNewSession,
		previousSessionId,
		initialSessionEntry: entry
	};
}
//#endregion
export { resolveCronSession as n, loadCronSessionEntryLatest as t };
