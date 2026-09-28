import { B as markCoreSemanticRunProgressDiagnosticEvent, R as resolveToolExecutionLivenessDiagnosticMetadata, U as CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY, W as markCoreModelRequestLifecycleDiagnosticEvent, h as onInternalDiagnosticEvent, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData, u as getInternalDiagnosticEventSequence, z as CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY } from "./diagnostic-events-CVabF32H.mjs";
//#region src/infra/diagnostic-model-request.ts
/** Emits a request attempt from the core boundary that owns provider streaming. */
function emitCoreModelRequestStartedDiagnosticEvent(event, generation, requestTimeoutMs, privateData) {
	const startedEvent = {
		...event,
		type: "model.call.started",
		observationUnit: "request"
	};
	emitTrustedDiagnosticEventWithPrivateData(generation ? markCoreModelRequestLifecycleDiagnosticEvent(startedEvent, {
		generation,
		phase: "started",
		...requestTimeoutMs !== void 0 ? { requestTimeoutMs } : {}
	}) : startedEvent, privateData);
}
/** Emits a terminal owned by the same core model-request generation as its start. */
function emitCoreModelRequestEndedDiagnosticEvent(event, generation, privateData) {
	emitTrustedDiagnosticEventWithPrivateData(generation ? markCoreModelRequestLifecycleDiagnosticEvent(event, {
		generation,
		phase: "ended"
	}) : event, privateData);
}
/** Returns exact core lifecycle provenance assigned by the dispatcher. */
function resolveCoreModelRequestLifecycleDiagnosticMetadata(metadata) {
	return metadata[CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY];
}
//#endregion
//#region src/infra/diagnostic-semantic-run-progress.ts
/** Emits semantic run progress from the core boundary that validated the model result. */
function emitCoreSemanticRunProgressDiagnosticEvent(event) {
	emitTrustedDiagnosticEvent(markCoreSemanticRunProgressDiagnosticEvent({
		...event,
		type: "run.progress"
	}));
}
/** Returns whether core validated the semantic model result that produced this progress event. */
function isCoreSemanticRunProgressDiagnosticMetadata(metadata) {
	return metadata[CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY] === true;
}
//#endregion
//#region src/logging/diagnostic-embedded-run-index.ts
function resolveCurrentDiagnosticRunId(owners) {
	let currentOwner;
	for (const owner of owners) if (!currentOwner || owner.sequence > currentOwner.sequence) currentOwner = owner;
	return currentOwner?.runId;
}
function createDiagnosticEmbeddedRunIndex(runIdIndex) {
	const remove = (activity, workKey) => {
		const embeddedRun = activity.activeEmbeddedRuns.get(workKey);
		if (!embeddedRun) return;
		activity.activeEmbeddedRuns.delete(workKey);
		if (!Array.from(activity.activeEmbeddedRuns.values()).some((candidate) => candidate.runId === embeddedRun.runId) && runIdIndex.get(embeddedRun.runId) === activity) runIdIndex.delete(embeddedRun.runId);
		return embeddedRun;
	};
	const clear = (activity) => {
		for (const { runId } of activity.activeEmbeddedRuns.values()) if (runIdIndex.get(runId) === activity) runIdIndex.delete(runId);
		activity.activeEmbeddedRuns.clear();
	};
	return {
		clear,
		remove
	};
}
//#endregion
//#region src/logging/diagnostic-argument-churn-activity.ts
const ARGUMENT_CHURN_CONTINUITY_WINDOW_MS = 6e4;
let diagnosticActivitySequence = 0;
function nextDiagnosticActivitySequence() {
	diagnosticActivitySequence += 1;
	return diagnosticActivitySequence;
}
function recordDiagnosticActivityProgress(activity) {
	activity.lastProgressSequence = nextDiagnosticActivitySequence();
}
function hasArgumentChurnContinuityExpired(activity, now) {
	const observationAt = activity.argumentChurnObservationAt;
	const lastProgressAt = activity.lastProgressAt;
	const observationSequence = activity.argumentChurnObservationSequence;
	const lastProgressSequence = activity.lastProgressSequence;
	return observationAt !== void 0 && (observationSequence !== void 0 && lastProgressSequence !== void 0 ? lastProgressSequence > observationSequence : lastProgressAt !== void 0 && observationAt !== void 0 && lastProgressAt > observationAt) && now - observationAt >= ARGUMENT_CHURN_CONTINUITY_WINDOW_MS;
}
function resolveArgumentChurnProgress(activity, currentOwnerRunId, now) {
	if (currentOwnerRunId !== void 0 && activity.argumentChurnPolicyWaitRunId === currentOwnerRunId && (activity.argumentChurnPolicyWaitTokens?.size ?? 0) > 0) return {
		lastProgressAt: now,
		lastProgressReason: "tool_policy:pending"
	};
	const startedAt = activity.argumentChurnStartedAt;
	if (!(startedAt !== void 0 && currentOwnerRunId === activity.argumentChurnRunId)) return {
		lastProgressAt: activity.lastProgressAt,
		lastProgressReason: activity.lastProgressReason
	};
	if (hasArgumentChurnContinuityExpired(activity, now)) return {
		lastProgressAt: activity.lastProgressAt,
		lastProgressReason: activity.lastProgressReason
	};
	return {
		lastProgressAt: startedAt,
		lastProgressReason: "tool_loop:argument_churn"
	};
}
function recordArgumentChurnActivityObservation(activity, params) {
	if (params.existingOnly && (activity.argumentChurnStartedAt === void 0 || activity.argumentChurnRunId !== params.runId)) return;
	if (!params.active) {
		if (activity.argumentChurnRunId === params.runId) clearArgumentChurnActivity(activity, params);
		return;
	}
	const continuityExpired = hasArgumentChurnContinuityExpired(activity, params.now);
	if (activity.argumentChurnStartedAt === void 0 || activity.argumentChurnRunId !== params.runId || continuityExpired) {
		activity.argumentChurnStartedAt = params.now;
		activity.argumentChurnRunId = params.runId;
	}
	activity.argumentChurnObservationAt = params.now;
	activity.argumentChurnObservationSequence = nextDiagnosticActivitySequence();
}
function updateArgumentChurnPolicyWait(activity, params) {
	if (params.action === "enter") {
		if (activity.argumentChurnPolicyWaitRunId !== params.runId) {
			activity.argumentChurnPolicyWaitRunId = params.runId;
			activity.argumentChurnPolicyWaitTokens = /* @__PURE__ */ new Set();
		}
		activity.argumentChurnPolicyWaitTokens?.add(params.token);
		return;
	}
	if (activity.argumentChurnPolicyWaitRunId !== params.runId) return;
	activity.argumentChurnPolicyWaitTokens?.delete(params.token);
	if (activity.argumentChurnPolicyWaitTokens?.size === 0) {
		activity.argumentChurnPolicyWaitRunId = void 0;
		activity.argumentChurnPolicyWaitTokens = void 0;
	}
}
function clearArgumentChurnPolicyWaits(activity, params = {}) {
	if (params.runId !== void 0 && activity.argumentChurnPolicyWaitRunId !== params.runId) return false;
	const cleared = (activity.argumentChurnPolicyWaitTokens?.size ?? 0) > 0;
	activity.argumentChurnPolicyWaitRunId = void 0;
	activity.argumentChurnPolicyWaitTokens = void 0;
	return cleared;
}
function applyArgumentChurnObservation(activity, owners, params) {
	const now = params.now ?? Date.now();
	const runId = params.runId?.trim() || void 0;
	const currentOwnerRunId = resolveCurrentDiagnosticRunId(owners);
	if (currentOwnerRunId !== void 0 && currentOwnerRunId !== runId) return;
	if (params.policyWait) {
		if (params.policyWaitToken) updateArgumentChurnPolicyWait(activity, {
			action: params.policyWait,
			runId,
			token: params.policyWaitToken
		});
		return;
	}
	recordArgumentChurnActivityObservation(activity, {
		runId,
		active: params.active === true,
		existingOnly: params.existingOnly,
		now
	});
}
function mergeArgumentChurnActivity(target, source) {
	const sourceObservationSequence = source.argumentChurnObservationSequence;
	const targetObservationSequence = target.argumentChurnObservationSequence;
	const sourceClearsAtSameTime = sourceObservationSequence === void 0 && targetObservationSequence === void 0 && source.argumentChurnObservationAt !== void 0 && source.argumentChurnObservationAt === target.argumentChurnObservationAt && source.argumentChurnStartedAt === void 0 && target.argumentChurnStartedAt !== void 0;
	const sourceIsNewer = sourceObservationSequence !== void 0 ? targetObservationSequence === void 0 || sourceObservationSequence > targetObservationSequence : targetObservationSequence === void 0 && source.argumentChurnObservationAt !== void 0 && (target.argumentChurnObservationAt === void 0 || source.argumentChurnObservationAt > target.argumentChurnObservationAt || sourceClearsAtSameTime);
	if (source.argumentChurnStartedAt !== void 0 && source.argumentChurnRunId === target.argumentChurnRunId && target.argumentChurnStartedAt !== void 0) {
		target.argumentChurnStartedAt = Math.min(target.argumentChurnStartedAt, source.argumentChurnStartedAt);
		if (source.argumentChurnObservationAt !== void 0 && (sourceIsNewer || sourceObservationSequence === void 0 && source.argumentChurnObservationAt >= (target.argumentChurnObservationAt ?? 0))) {
			target.argumentChurnObservationAt = source.argumentChurnObservationAt;
			target.argumentChurnObservationSequence = sourceObservationSequence;
		}
	} else if (sourceIsNewer) {
		target.argumentChurnStartedAt = source.argumentChurnStartedAt;
		target.argumentChurnObservationAt = source.argumentChurnObservationAt;
		target.argumentChurnObservationSequence = sourceObservationSequence;
		target.argumentChurnRunId = source.argumentChurnRunId;
	}
	if ((source.argumentChurnPolicyWaitTokens?.size ?? 0) === 0) return;
	if (target.argumentChurnPolicyWaitRunId !== source.argumentChurnPolicyWaitRunId) {
		if ((target.argumentChurnPolicyWaitTokens?.size ?? 0) === 0) {
			target.argumentChurnPolicyWaitRunId = source.argumentChurnPolicyWaitRunId;
			target.argumentChurnPolicyWaitTokens = new Set(source.argumentChurnPolicyWaitTokens);
		}
		return;
	}
	target.argumentChurnPolicyWaitTokens ??= /* @__PURE__ */ new Set();
	for (const token of source.argumentChurnPolicyWaitTokens ?? []) target.argumentChurnPolicyWaitTokens.add(token);
}
function clearArgumentChurnActivity(activity, params = {}) {
	const cleared = activity.argumentChurnStartedAt !== void 0;
	activity.argumentChurnStartedAt = void 0;
	activity.argumentChurnObservationAt = params.now ?? Date.now();
	activity.argumentChurnObservationSequence = nextDiagnosticActivitySequence();
	activity.argumentChurnRunId = params.runId;
	return cleared;
}
//#endregion
//#region src/logging/diagnostic-repeated-request-activity.ts
let mutationSequence = 0;
function nextMutationSequence() {
	mutationSequence += 1;
	return mutationSequence;
}
function recordRepeatedRequestObservation(activity, owners, params) {
	if (params.observationUnit === "turn") return;
	const currentOwnerRunId = resolveCurrentDiagnosticRunId(owners);
	const runId = params.runId?.trim();
	if (currentOwnerRunId === void 0 || !runId || currentOwnerRunId !== runId) return;
	if (activity.repeatedRequestOwnerRunId !== runId) {
		activity.repeatedRequestOwnerRunId = runId;
		activity.repeatedRequestFirstStartedAt = params.now ?? Date.now();
		activity.repeatedRequestCount = 1;
	} else activity.repeatedRequestCount = (activity.repeatedRequestCount ?? 0) + 1;
	activity.repeatedRequestMutationSequence = nextMutationSequence();
}
function clearRepeatedRequestActivity(activity, params = {}) {
	if (params.runId !== void 0 && activity.repeatedRequestOwnerRunId !== void 0 && activity.repeatedRequestOwnerRunId !== params.runId) return false;
	const cleared = activity.repeatedRequestCount !== void 0;
	if (!cleared && params.runId !== void 0) return false;
	activity.repeatedRequestOwnerRunId = void 0;
	activity.repeatedRequestFirstStartedAt = void 0;
	activity.repeatedRequestCount = void 0;
	activity.repeatedRequestMutationSequence = nextMutationSequence();
	return cleared;
}
function mergeRepeatedRequestActivity(target, source) {
	if (source.repeatedRequestMutationSequence === void 0 || (target.repeatedRequestMutationSequence ?? 0) >= source.repeatedRequestMutationSequence) return;
	target.repeatedRequestOwnerRunId = source.repeatedRequestOwnerRunId;
	target.repeatedRequestFirstStartedAt = source.repeatedRequestFirstStartedAt;
	target.repeatedRequestCount = source.repeatedRequestCount;
	target.repeatedRequestMutationSequence = source.repeatedRequestMutationSequence;
}
function resolveRepeatedRequestNoProgressAgeMs(activity, currentOwnerRunId, now) {
	if (currentOwnerRunId === void 0 || currentOwnerRunId !== activity.repeatedRequestOwnerRunId || (activity.repeatedRequestCount ?? 0) < 2 || activity.repeatedRequestFirstStartedAt === void 0) return;
	return Math.max(0, now - activity.repeatedRequestFirstStartedAt);
}
//#endregion
//#region src/logging/diagnostic-run-activity-snapshot.ts
function buildDiagnosticSessionActivitySnapshot(activity, now) {
	let activeCoreModelCallCount = 0;
	let activeModelCallRequestTimeoutMs;
	for (const calls of activity.activeCoreModelCalls.values()) {
		activeCoreModelCallCount += calls.size;
		for (const call of calls.values()) if (call.requestTimeoutMs !== void 0 && (activeModelCallRequestTimeoutMs === void 0 || call.requestTimeoutMs > activeModelCallRequestTimeoutMs)) activeModelCallRequestTimeoutMs = call.requestTimeoutMs;
	}
	const activeWorkKind = activity.activeTools.size > 0 ? "tool_call" : activity.activeModelCalls.size > 0 || activeCoreModelCallCount > 0 ? "model_call" : activity.activeEmbeddedRuns.size > 0 ? "embedded_run" : void 0;
	let activeTool;
	let activeToolDeadlineAtMs;
	const currentOwnerRunId = resolveCurrentDiagnosticRunId(activity.activeEmbeddedRuns.values());
	for (const tool of activity.activeTools.values()) {
		if (!activeTool || tool.startedAt < activeTool.startedAt) activeTool = tool;
		if (currentOwnerRunId !== void 0 && tool.runId === currentOwnerRunId) {
			const deadline = tool.deadlineAtMs;
			if (deadline !== void 0) activeToolDeadlineAtMs = Math.max(activeToolDeadlineAtMs ?? deadline, deadline);
		}
	}
	const churnProgress = resolveArgumentChurnProgress(activity, currentOwnerRunId, now);
	return {
		activeWorkKind,
		...activity.activeEmbeddedRuns.size > 0 ? { hasActiveEmbeddedRun: true } : {},
		activeToolName: activeTool?.toolName,
		activeToolCallId: activeTool?.toolCallId,
		activeToolAgeMs: activeTool ? Math.max(0, now - activeTool.startedAt) : void 0,
		activeToolDeadlineAtMs: currentOwnerRunId === void 0 ? activeTool?.deadlineAtMs : activeToolDeadlineAtMs,
		lastProgressAgeMs: Math.max(0, now - churnProgress.lastProgressAt),
		lastProgressReason: churnProgress.lastProgressReason,
		repeatedRequestNoProgressAgeMs: resolveRepeatedRequestNoProgressAgeMs(activity, currentOwnerRunId, now),
		activeModelCallRequestTimeoutMs
	};
}
const BLOCKED_TOOL_CALL_ABORT_FLOOR_MS = 9e5;
/** Process expiry starts cancellation; give its result the ordinary stalled-tool window. */
function resolveToolExecutionRecoveryDeadlineAtMs(executionDeadlineAtMs) {
	return executionDeadlineAtMs === void 0 ? void 0 : executionDeadlineAtMs + BLOCKED_TOOL_CALL_ABORT_FLOOR_MS;
}
const RUN_STALE_TAKEOVER_MS = 6e5;
function resolveRunStaleThresholdMs(activity, evidenceAgeMs = activity.lastProgressAgeMs ?? 0, minimumMs = RUN_STALE_TAKEOVER_MS) {
	const retryWaitThresholdMs = activity.activeRetryWaitDeadlineAtMs === void 0 ? 0 : evidenceAgeMs + activity.activeRetryWaitDeadlineAtMs - Date.now();
	if (activity.activeToolDeadlineAtMs !== void 0) return Math.max(0, evidenceAgeMs + activity.activeToolDeadlineAtMs - Date.now(), retryWaitThresholdMs);
	if (activity.activeWorkKind === "tool_call") return Math.max(minimumMs, BLOCKED_TOOL_CALL_ABORT_FLOOR_MS, retryWaitThresholdMs);
	const backendThresholdMs = activity.activeBackendLivenessDeadlineAtMs === void 0 ? 0 : evidenceAgeMs + activity.activeBackendLivenessDeadlineAtMs - Date.now();
	return Math.max(minimumMs, activity.activeModelCallRequestTimeoutMs ?? 0, backendThresholdMs, retryWaitThresholdMs);
}
//#endregion
//#region src/logging/diagnostic-run-activity-state.ts
const activityByRef = /* @__PURE__ */ new Map();
const activityByRunId = /* @__PURE__ */ new Map();
const embeddedRunIndex = createDiagnosticEmbeddedRunIndex(activityByRunId);
const activeDiagnosticOwners = /* @__PURE__ */ new Map();
function sessionRefs(params) {
	const refs = [];
	const sessionId = params.sessionId?.trim();
	const sessionKey = params.sessionKey?.trim();
	if (sessionId) refs.push(`id:${sessionId}`);
	if (sessionKey) refs.push(`key:${sessionKey}`);
	return refs;
}
function registerSessionActivityRefs(activity, params) {
	activity.sessionId ??= params.sessionId;
	activity.sessionKey ??= params.sessionKey;
	for (const ref of sessionRefs(params)) activityByRef.set(ref, activity);
	if (params.runId) activityByRunId.set(params.runId, activity);
}
function replaceSessionActivityReferences(source, target) {
	for (const [ref, activity] of activityByRef) if (activity === source) activityByRef.set(ref, target);
	for (const [runId, activity] of activityByRunId) if (activity === source) activityByRunId.set(runId, target);
}
function mergeSessionActivity(target, source) {
	target.sessionId ??= source.sessionId;
	target.sessionKey ??= source.sessionKey;
	for (const [key, embeddedRun] of source.activeEmbeddedRuns) {
		const existing = target.activeEmbeddedRuns.get(key);
		if (existing && existing.runId !== embeddedRun.runId) embeddedRunIndex.remove(target, key);
		target.activeEmbeddedRuns.set(key, embeddedRun);
	}
	for (const [key, tool] of source.activeTools) target.activeTools.set(key, tool);
	for (const [key, modelCall] of source.activeModelCalls) target.activeModelCalls.set(key, modelCall);
	for (const [generation, modelCalls] of source.activeCoreModelCalls) target.activeCoreModelCalls.set(generation, modelCalls);
	for (const registration of activeDiagnosticOwners.values()) if (registration.activity === source) registration.activity = target;
	for (const [ownerRef, cutoff] of source.recoveredOwnerStartEventCutoffs) target.recoveredOwnerStartEventCutoffs.set(ownerRef, Math.max(cutoff, target.recoveredOwnerStartEventCutoffs.get(ownerRef) ?? 0));
	if (source.lastProgressSequence !== void 0 ? target.lastProgressSequence === void 0 || source.lastProgressSequence > target.lastProgressSequence : target.lastProgressSequence === void 0 && source.lastProgressAt > target.lastProgressAt) {
		target.lastProgressAt = source.lastProgressAt;
		target.lastProgressReason = source.lastProgressReason;
		target.lastProgressSequence = source.lastProgressSequence;
	}
	mergeArgumentChurnActivity(target, source);
	mergeRepeatedRequestActivity(target, source);
	replaceSessionActivityReferences(source, target);
}
function resolveSessionActivity(params) {
	let activity;
	if (params.runId) {
		const byRun = activityByRunId.get(params.runId);
		if (byRun) activity = byRun;
	}
	for (const ref of sessionRefs(params)) {
		const byRef = activityByRef.get(ref);
		if (!byRef) continue;
		if (!activity) activity = byRef;
		else if (activity !== byRef) mergeSessionActivity(activity, byRef);
	}
	if (activity) {
		registerSessionActivityRefs(activity, params);
		return activity;
	}
	if (!params.create) return;
	const created = {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		activeEmbeddedRuns: /* @__PURE__ */ new Map(),
		activeTools: /* @__PURE__ */ new Map(),
		activeModelCalls: /* @__PURE__ */ new Map(),
		activeCoreModelCalls: /* @__PURE__ */ new Map(),
		recoveredOwnerStartEventCutoffs: /* @__PURE__ */ new Map(),
		lastProgressAt: Date.now()
	};
	registerSessionActivityRefs(created, params);
	return created;
}
function touchSessionActivity(activity, reason, now = Date.now()) {
	activity.lastProgressAt = now;
	activity.lastProgressReason = reason;
	recordDiagnosticActivityProgress(activity);
}
//#endregion
//#region src/logging/diagnostic-owned-activity.ts
function resolveCurrentDiagnosticOwner(owner, assertCurrent) {
	const registration = activeDiagnosticOwners.get(owner.generation);
	if (registration?.owner !== owner) return;
	try {
		assertCurrent?.();
	} catch {
		return;
	}
	return activeDiagnosticOwners.get(owner.generation) === registration && registration.activity.activeEmbeddedRuns.get(owner.workKey)?.generation === owner.generation ? registration : void 0;
}
/** Retains a provider wait only while its logical run still owns this attempt. */
function beginDiagnosticRetryWait(params) {
	const assertCurrent = () => {
		params.signal.throwIfAborted();
		params.assertCurrent();
	};
	const registration = resolveCurrentDiagnosticOwner(params.owner, assertCurrent);
	if (!registration) return () => false;
	registration.retryWait?.close();
	const close = (completed = false) => {
		const resumed = completed && registration.retryWait === wait && resolveCurrentDiagnosticOwner(params.owner, assertCurrent) === registration;
		if (registration.retryWait === wait) registration.retryWait = void 0;
		params.signal.removeEventListener("abort", onAbort);
		if (resumed) touchSessionActivity(registration.activity, "retry_wait:ended");
		return resumed;
	};
	const onAbort = () => {
		close();
	};
	const wait = {
		deadlineAtMs: params.deadlineAtMs,
		assertCurrent,
		close
	};
	registration.retryWait = wait;
	params.signal.addEventListener("abort", onAbort, { once: true });
	return close;
}
/** Binds one backend attempt's quiet allowance to its exact live core owner. */
function beginDiagnosticBackendActivity(params) {
	const { owner, noOutputTimeoutMs, assertCurrent } = params;
	let quietAllowanceMs = noOutputTimeoutMs;
	const registration = resolveCurrentDiagnosticOwner(owner, assertCurrent);
	const backendActivity = {
		deadlineAtMs: Date.now() + noOutputTimeoutMs,
		assertCurrent
	};
	if (registration) registration.backendActivity = backendActivity;
	const currentActivity = () => {
		const current = resolveCurrentDiagnosticOwner(owner, assertCurrent);
		return current?.backendActivity === backendActivity ? current.activity : void 0;
	};
	return {
		observeOutput: (modelProgress) => {
			const activity = currentActivity();
			if (!activity) return false;
			const now = Date.now();
			backendActivity.deadlineAtMs = now + quietAllowanceMs;
			if (!modelProgress || activity.activeTools.size > 0) return false;
			touchSessionActivity(activity, "model_call:stream_progress", now);
			return true;
		},
		setOutstandingWork: (active) => {
			if (!currentActivity()) return;
			const allowanceMs = active ? Math.max(noOutputTimeoutMs, BLOCKED_TOOL_CALL_ABORT_FLOOR_MS) : noOutputTimeoutMs;
			backendActivity.deadlineAtMs += allowanceMs - quietAllowanceMs;
			quietAllowanceMs = allowanceMs;
		},
		close: () => {
			const current = activeDiagnosticOwners.get(owner.generation);
			if (current?.owner === owner && current.backendActivity === backendActivity) delete current.backendActivity;
		}
	};
}
//#endregion
//#region src/logging/diagnostic-run-activity-recovery.ts
function ownerRefsForRecovery(params) {
	return new Set([params.activeSessionId?.trim(), params.sessionId?.trim()].filter((ref) => Boolean(ref)));
}
function ownerRefsForStartedEvent(event) {
	return [event.runId?.trim(), event.sessionId?.trim()].filter((ref) => Boolean(ref));
}
function markerBelongsToRecoveredOwner(marker, ownerRefs) {
	return marker.runId !== void 0 && ownerRefs.has(marker.runId) || marker.sessionId !== void 0 && ownerRefs.has(marker.sessionId);
}
function embeddedRunStartedAfter(embeddedRun, sequence) {
	return sequence !== void 0 && embeddedRun.sequence > sequence;
}
function activityMarkerStartedAfter(marker, sequence) {
	return sequence !== void 0 && marker.sequence !== void 0 && marker.sequence > sequence;
}
function clearRecoveredOwnerEmbeddedRuns(activity, ownerRefs, recoveryStartedAfterSequence, removeEmbeddedRun) {
	if (ownerRefs.size === 0) return;
	for (const [key, embeddedRun] of activity.activeEmbeddedRuns) if (embeddedRun.sessionId !== void 0 && ownerRefs.has(embeddedRun.sessionId) && !embeddedRunStartedAfter(embeddedRun, recoveryStartedAfterSequence)) removeEmbeddedRun(key);
}
function hasEmbeddedRunStartedAfter(activity, sequence) {
	if (sequence === void 0) return activity.activeEmbeddedRuns.size > 0;
	for (const embeddedRun of activity.activeEmbeddedRuns.values()) if (embeddedRun.sequence > sequence) return true;
	return false;
}
function clearRecoveredOwnerMarkers(activity, ownerRefs, recoveryStartedAfterSequence) {
	if (ownerRefs.size === 0) return;
	for (const [key, tool] of activity.activeTools) if (markerBelongsToRecoveredOwner(tool, ownerRefs) && !activityMarkerStartedAfter(tool, recoveryStartedAfterSequence)) activity.activeTools.delete(key);
	for (const [key, modelCall] of activity.activeModelCalls) if (markerBelongsToRecoveredOwner(modelCall, ownerRefs) && !activityMarkerStartedAfter(modelCall, recoveryStartedAfterSequence)) activity.activeModelCalls.delete(key);
	for (const [generation, modelCalls] of activity.activeCoreModelCalls) {
		for (const [callId, modelCall] of modelCalls) if (markerBelongsToRecoveredOwner(modelCall, ownerRefs) && !activityMarkerStartedAfter(modelCall, recoveryStartedAfterSequence)) modelCalls.delete(callId);
		if (modelCalls.size === 0) activity.activeCoreModelCalls.delete(generation);
	}
}
function pruneActivityStartedBeforeRecoveryCutoff(activity, recoveryStartedAfterEmbeddedRunSequence, recoveryStartedAfterDiagnosticEventSequence, removeEmbeddedRun) {
	if (recoveryStartedAfterEmbeddedRunSequence === void 0 && recoveryStartedAfterDiagnosticEventSequence === void 0) return;
	for (const [key, embeddedRun] of activity.activeEmbeddedRuns) if (!embeddedRunStartedAfter(embeddedRun, recoveryStartedAfterEmbeddedRunSequence)) removeEmbeddedRun(key);
	for (const [key, tool] of activity.activeTools) if (!activityMarkerStartedAfter(tool, recoveryStartedAfterDiagnosticEventSequence)) activity.activeTools.delete(key);
	for (const [key, modelCall] of activity.activeModelCalls) if (!activityMarkerStartedAfter(modelCall, recoveryStartedAfterDiagnosticEventSequence)) activity.activeModelCalls.delete(key);
	for (const [generation, modelCalls] of activity.activeCoreModelCalls) {
		for (const [callId, modelCall] of modelCalls) if (!activityMarkerStartedAfter(modelCall, recoveryStartedAfterDiagnosticEventSequence)) modelCalls.delete(callId);
		if (modelCalls.size === 0) activity.activeCoreModelCalls.delete(generation);
	}
}
function countActiveCoreModelCalls(activity) {
	let count = 0;
	for (const calls of activity.activeCoreModelCalls.values()) count += calls.size;
	return count;
}
function rememberRecoveredOwnerStartEventCutoffs(activity, ownerRefs, recoveryStartedAfterSequence) {
	if (recoveryStartedAfterSequence === void 0) return;
	for (const ownerRef of ownerRefs) activity.recoveredOwnerStartEventCutoffs.set(ownerRef, Math.max(recoveryStartedAfterSequence, activity.recoveredOwnerStartEventCutoffs.get(ownerRef) ?? 0));
}
function shouldIgnoreRecoveredOwnerStartEvent(activity, event) {
	if (event.seq === void 0) return false;
	for (const ownerRef of ownerRefsForStartedEvent(event)) {
		const cutoff = activity.recoveredOwnerStartEventCutoffs.get(ownerRef);
		if (cutoff !== void 0 && event.seq <= cutoff) return true;
	}
	return false;
}
//#endregion
//#region src/logging/diagnostic-run-activity.ts
const closedDiagnosticOwnerGenerations = /* @__PURE__ */ new WeakSet();
let embeddedRunSequence = 0;
function touchSemanticSessionActivity(activity, reason, params = {}) {
	clearRepeatedRequestActivity(activity, { runId: params.runId });
	touchSessionActivity(activity, reason, params.now);
}
function toolKey(event) {
	return `${event.runId ?? event.sessionId ?? event.sessionKey ?? "unknown"}:${event.toolCallId ?? event.toolName}`;
}
function modelCallKey(event) {
	return `${event.runId ?? "unknown"}:${event.provider ?? "provider"}:${event.model ?? "model"}`;
}
function recordToolStarted(event, liveness) {
	const activity = resolveSessionActivity({
		...event,
		create: true
	});
	if (!activity || shouldIgnoreRecoveredOwnerStartEvent(activity, event)) return;
	const now = Date.now();
	activity.activeTools.set(toolKey(event), {
		runId: event.runId,
		sessionId: event.sessionId,
		sessionKey: event.sessionKey,
		sequence: event.seq,
		toolName: event.toolName,
		toolCallId: event.toolCallId,
		startedAt: now,
		lastProgressAt: now,
		get deadlineAtMs() {
			return resolveToolExecutionRecoveryDeadlineAtMs(liveness?.deadlineAtMs) ?? event.deadlineAtMs;
		}
	});
	touchSessionActivity(activity, `tool:${event.toolName}:started`, now);
}
function recordToolEnded(event) {
	const activity = resolveSessionActivity(event);
	if (!activity) return;
	activity.activeTools.delete(toolKey(event));
	touchSessionActivity(activity, `tool:${event.toolName}:ended`);
}
function markDiagnosticOwnedToolActivity(owner, event) {
	if (activeDiagnosticOwners.get(owner.generation)?.owner === owner) (event.phase === "start" ? recordToolStarted : recordToolEnded)({
		...event,
		...owner
	});
}
function hasDiagnosticActivityOwner(activity) {
	if (!activity) return false;
	for (const registration of activeDiagnosticOwners.values()) if (registration.activity === activity && resolveCurrentDiagnosticOwner(registration.owner) === registration) return true;
	return false;
}
function hasDiagnosticOwnerForRefs(params) {
	return params.runId && hasDiagnosticActivityOwner(activityByRunId.get(params.runId)) || sessionRefs(params).some((ref) => hasDiagnosticActivityOwner(activityByRef.get(ref)));
}
function recordModelStarted(event, provenance, coreRequestForTest = false) {
	const registration = provenance ? activeDiagnosticOwners.get(provenance.generation) : void 0;
	if (provenance && (provenance.phase !== "started" || !registration || registration.owner.runId !== event.runId || registration.owner.sessionId !== event.sessionId)) return;
	const activity = registration?.activity ?? resolveSessionActivity({
		...event,
		create: true
	});
	if (!activity) return;
	if (!provenance && !coreRequestForTest && hasDiagnosticActivityOwner(activity)) return;
	if (shouldIgnoreRecoveredOwnerStartEvent(activity, event)) return;
	if (provenance?.phase === "started" && registration) {
		recordRepeatedRequestObservation(activity, activity.activeEmbeddedRuns.values(), event);
		const calls = activity.activeCoreModelCalls.get(provenance.generation) ?? /* @__PURE__ */ new Map();
		calls.set(event.callId, {
			runId: event.runId,
			sessionId: event.sessionId,
			sessionKey: event.sessionKey,
			sequence: event.seq,
			requestTimeoutMs: provenance.requestTimeoutMs
		});
		activity.activeCoreModelCalls.set(provenance.generation, calls);
		touchSessionActivity(activity, "model_call:started");
		return;
	}
	if (coreRequestForTest) recordRepeatedRequestObservation(activity, activity.activeEmbeddedRuns.values(), event);
	activity.activeModelCalls.set(modelCallKey(event), {
		runId: event.runId,
		sessionId: event.sessionId,
		sessionKey: event.sessionKey,
		sequence: event.seq
	});
	touchSessionActivity(activity, "model_call:started");
}
function recordModelEnded(event, provenance) {
	const registration = provenance ? activeDiagnosticOwners.get(provenance.generation) : void 0;
	if (provenance && (provenance.phase !== "ended" || !registration)) return;
	const activity = registration?.activity ?? resolveSessionActivity(event);
	if (!activity) return;
	if (!provenance && hasDiagnosticActivityOwner(activity)) {
		activity.activeModelCalls.delete(modelCallKey(event));
		return;
	}
	if (provenance?.phase === "ended" && registration) {
		const calls = activity.activeCoreModelCalls.get(provenance.generation);
		if (!calls?.delete(event.callId)) return;
		if (calls.size === 0) activity.activeCoreModelCalls.delete(provenance.generation);
		touchSessionActivity(activity, "model_call:ended");
		return;
	}
	activity.activeModelCalls.delete(modelCallKey(event));
	touchSessionActivity(activity, "model_call:ended");
}
function markDiagnosticArgumentChurnObservation(params) {
	const activity = resolveSessionActivity({
		...params,
		create: params.active === true
	});
	if (activity) applyArgumentChurnObservation(activity, activity.activeEmbeddedRuns.values(), params);
}
const markDiagnosticRunProgress = applyRunProgress;
function applyRunProgress(params, provenance = "direct") {
	const runId = params.runId?.trim() || void 0;
	if (provenance === "unbound" && hasDiagnosticOwnerForRefs({
		...params,
		runId
	})) return;
	const activity = resolveSessionActivity({
		...params,
		runId,
		create: true
	});
	if (!activity) return;
	if (provenance !== "semantic" || !runId) {
		touchSessionActivity(activity, params.reason);
		return;
	}
	touchSemanticSessionActivity(activity, params.reason, { runId });
}
function recordRunCompleted(event) {
	if (hasDiagnosticOwnerForRefs(event)) return;
	const activity = resolveSessionActivity(event);
	if (!activity) return;
	activity.activeTools.clear();
	activity.activeModelCalls.clear();
	activityByRunId.delete(event.runId);
	if (activity.repeatedRequestOwnerRunId === event.runId) {
		touchSessionActivity(activity, "run:attempt_completed");
		return;
	}
	embeddedRunIndex.clear(activity);
	clearArgumentChurnActivity(activity, { runId: event.runId });
	clearArgumentChurnPolicyWaits(activity, { runId: event.runId });
	touchSemanticSessionActivity(activity, "run:completed", { runId: event.runId });
}
function createDiagnosticEmbeddedRunOwner(params) {
	return Object.freeze({
		generation: Object.freeze({}),
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.runId ? { runId: params.runId } : {},
		workKey: resolveEmbeddedRunWorkKey(params)
	});
}
function markDiagnosticEmbeddedRunStarted(params) {
	if (params.owner && closedDiagnosticOwnerGenerations.has(params.owner.generation)) return;
	const ownerRunId = params.runId?.trim() || params.sessionId.trim();
	const activity = resolveSessionActivity({
		...params,
		runId: ownerRunId,
		create: true
	});
	if (activity.repeatedRequestOwnerRunId !== ownerRunId) clearRepeatedRequestActivity(activity);
	if (activity.argumentChurnStartedAt !== void 0) clearArgumentChurnActivity(activity, { runId: ownerRunId });
	clearArgumentChurnPolicyWaits(activity);
	const workKey = resolveEmbeddedRunWorkKey(params);
	const existing = activity.activeEmbeddedRuns.get(workKey);
	if (existing && existing.runId !== ownerRunId) embeddedRunIndex.remove(activity, workKey);
	activity.activeEmbeddedRuns.set(workKey, {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		runId: ownerRunId,
		sequence: ++embeddedRunSequence,
		generation: params.owner?.generation
	});
	if (params.owner) activeDiagnosticOwners.set(params.owner.generation, {
		activity,
		owner: params.owner
	});
	touchSessionActivity(activity, "embedded_run:started");
}
/** Synchronously retires one exact queue owner before its handle authority is lost. */
function closeDiagnosticEmbeddedRunOwner(owner) {
	const registration = activeDiagnosticOwners.get(owner.generation);
	if (!registration || registration.owner !== owner) return;
	const { activity } = registration;
	registration.retryWait?.close();
	activeDiagnosticOwners.delete(owner.generation);
	closedDiagnosticOwnerGenerations.add(owner.generation);
	activity.activeCoreModelCalls.delete(owner.generation);
	if (activity.activeEmbeddedRuns.get(owner.workKey)?.generation !== owner.generation) return;
	const cutoff = getInternalDiagnosticEventSequence();
	const ownerRefs = new Set(ownerRefsForStartedEvent(owner));
	rememberRecoveredOwnerStartEventCutoffs(activity, ownerRefs, cutoff);
	embeddedRunIndex.remove(activity, owner.workKey);
	for (const [key, tool] of activity.activeTools) if (markerBelongsToRecoveredOwner(tool, ownerRefs) && !activityMarkerStartedAfter(tool, cutoff)) activity.activeTools.delete(key);
	if (activity.activeEmbeddedRuns.size === 0) {
		clearArgumentChurnActivity(activity);
		clearArgumentChurnPolicyWaits(activity);
	}
	touchSessionActivity(activity, "embedded_run:ended");
}
function isDiagnosticEmbeddedRunOwnerClosed(owner) {
	return closedDiagnosticOwnerGenerations.has(owner.generation);
}
function markDiagnosticEmbeddedRunEnded(params) {
	const activity = resolveSessionActivity(params);
	if (!activity) return;
	embeddedRunIndex.remove(activity, resolveEmbeddedRunWorkKey(params));
	if (params.clearRunActivity !== false) {
		activity.activeTools.clear();
		activity.activeModelCalls.clear();
		activity.activeCoreModelCalls.clear();
	}
	if (activity.activeEmbeddedRuns.size === 0) {
		clearArgumentChurnActivity(activity);
		clearArgumentChurnPolicyWaits(activity);
	}
	touchSessionActivity(activity, "embedded_run:ended");
}
function resolveEmbeddedRunWorkKey(params) {
	return params.workKey ?? params.sessionId;
}
function clearDiagnosticEmbeddedRunActivityForSession(params) {
	const shouldCreateCutoffActivity = params.recoveryStartedAfterDiagnosticEventSequence !== void 0;
	const activity = resolveSessionActivity({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		runId: params.activeSessionId,
		create: shouldCreateCutoffActivity
	});
	if (!activity) return {
		cleared: false,
		blockedByActiveEmbeddedRun: false
	};
	if (params.activeSessionId) registerSessionActivityRefs(activity, {
		sessionId: params.activeSessionId,
		sessionKey: params.sessionKey,
		runId: params.activeSessionId
	});
	const ownerRefs = ownerRefsForRecovery(params);
	rememberRecoveredOwnerStartEventCutoffs(activity, ownerRefs, params.recoveryStartedAfterDiagnosticEventSequence);
	if (activity.activeEmbeddedRuns.size === 0 && activity.activeTools.size === 0 && activity.activeModelCalls.size === 0 && countActiveCoreModelCalls(activity) === 0) {
		const clearedChurn = clearArgumentChurnActivity(activity, { runId: params.activeSessionId });
		const clearedPolicyWait = clearArgumentChurnPolicyWaits(activity, { runId: params.activeSessionId });
		const clearedRepeatedRequests = clearRepeatedRequestActivity(activity);
		return {
			cleared: clearedChurn || clearedPolicyWait || clearedRepeatedRequests,
			blockedByActiveEmbeddedRun: false
		};
	}
	clearRecoveredOwnerEmbeddedRuns(activity, ownerRefs, params.recoveryStartedAfterEmbeddedRunSequence, (key) => embeddedRunIndex.remove(activity, key));
	clearRecoveredOwnerMarkers(activity, ownerRefs, params.recoveryStartedAfterDiagnosticEventSequence);
	if (activity.activeEmbeddedRuns.size > 0) {
		if (hasEmbeddedRunStartedAfter(activity, params.recoveryStartedAfterEmbeddedRunSequence)) {
			pruneActivityStartedBeforeRecoveryCutoff(activity, params.recoveryStartedAfterEmbeddedRunSequence, params.recoveryStartedAfterDiagnosticEventSequence, (key) => embeddedRunIndex.remove(activity, key));
			touchSessionActivity(activity, "embedded_run:recovery_skipped_active_owner");
			return {
				cleared: false,
				blockedByActiveEmbeddedRun: true
			};
		}
		embeddedRunIndex.clear(activity);
	}
	activity.activeTools.clear();
	activity.activeModelCalls.clear();
	activity.activeCoreModelCalls.clear();
	clearArgumentChurnActivity(activity, { runId: params.activeSessionId });
	clearArgumentChurnPolicyWaits(activity, { runId: params.activeSessionId });
	clearRepeatedRequestActivity(activity);
	touchSemanticSessionActivity(activity, "embedded_run:ended");
	return {
		cleared: true,
		blockedByActiveEmbeddedRun: false
	};
}
function getDiagnosticSessionActivitySnapshot(params, now = Date.now()) {
	const activity = resolveSessionActivity(params);
	if (!activity) return {};
	let activeBackendLivenessDeadlineAtMs;
	let activeRetryWaitDeadlineAtMs;
	for (const embeddedRun of activity.activeEmbeddedRuns.values()) {
		const registration = embeddedRun.generation ? activeDiagnosticOwners.get(embeddedRun.generation) : void 0;
		const retryWait = registration?.retryWait;
		if (registration && retryWait && resolveCurrentDiagnosticOwner(registration.owner, retryWait.assertCurrent) === registration && registration.activity === activity && registration.retryWait === retryWait) activeRetryWaitDeadlineAtMs = Math.max(activeRetryWaitDeadlineAtMs ?? retryWait.deadlineAtMs, retryWait.deadlineAtMs);
		const backendActivity = registration?.backendActivity;
		if (!registration || !backendActivity || resolveCurrentDiagnosticOwner(registration.owner, backendActivity.assertCurrent) !== registration || registration.activity !== activity || registration.backendActivity !== backendActivity) continue;
		activeBackendLivenessDeadlineAtMs = Math.max(activeBackendLivenessDeadlineAtMs ?? backendActivity.deadlineAtMs, backendActivity.deadlineAtMs);
	}
	return {
		...buildDiagnosticSessionActivitySnapshot(activity, now),
		...activeBackendLivenessDeadlineAtMs !== void 0 ? { activeBackendLivenessDeadlineAtMs } : {},
		...activeRetryWaitDeadlineAtMs !== void 0 ? { activeRetryWaitDeadlineAtMs } : {}
	};
}
function getDiagnosticEmbeddedRunActivitySequence() {
	return embeddedRunSequence;
}
function markDiagnosticModelStartedForTest(params) {
	recordModelStarted(params, void 0, true);
}
function resetDiagnosticRunActivityForTest() {
	stopDiagnosticRunActivityTracking();
	installDiagnosticRunActivityTestApi();
}
function installDiagnosticRunActivityTestApi() {
	globalThis[Symbol.for("openclaw.diagnosticRunActivityTestApi")] = {
		markDiagnosticModelStartedForTest,
		markDiagnosticToolStartedForTest: recordToolStarted
	};
}
let unregisterDiagnosticRunActivityListener;
function startDiagnosticRunActivityTracking() {
	if (unregisterDiagnosticRunActivityListener) return;
	const startAfterEventSequence = getInternalDiagnosticEventSequence();
	unregisterDiagnosticRunActivityListener = onInternalDiagnosticEvent((event, metadata) => {
		if (event.seq <= startAfterEventSequence) return;
		switch (event.type) {
			case "tool.execution.started": return recordToolStarted(event, resolveToolExecutionLivenessDiagnosticMetadata(metadata));
			case "tool.execution.completed":
			case "tool.execution.error":
			case "tool.execution.blocked": return recordToolEnded(event);
			case "model.call.started":
				recordModelStarted(event, resolveCoreModelRequestLifecycleDiagnosticMetadata(metadata));
				return;
			case "model.call.completed":
			case "model.call.error":
				recordModelEnded(event, resolveCoreModelRequestLifecycleDiagnosticMetadata(metadata));
				return;
			case "run.progress": return applyRunProgress(event, isCoreSemanticRunProgressDiagnosticMetadata(metadata) ? "semantic" : "unbound");
			case "run.completed": return recordRunCompleted(event);
		}
	}, { include: [
		"tool.execution.started",
		"tool.execution.completed",
		"tool.execution.error",
		"tool.execution.blocked",
		"model.call.started",
		"model.call.completed",
		"model.call.error",
		"run.progress",
		"run.completed"
	] });
}
function stopDiagnosticRunActivityTracking() {
	unregisterDiagnosticRunActivityListener?.();
	unregisterDiagnosticRunActivityListener = void 0;
	activityByRef.clear();
	activityByRunId.clear();
	activeDiagnosticOwners.clear();
	embeddedRunSequence = 0;
}
if (process.env.VITEST || false) installDiagnosticRunActivityTestApi();
//#endregion
export { emitCoreModelRequestStartedDiagnosticEvent as S, BLOCKED_TOOL_CALL_ABORT_FLOOR_MS as _, getDiagnosticSessionActivitySnapshot as a, emitCoreSemanticRunProgressDiagnosticEvent as b, markDiagnosticEmbeddedRunEnded as c, markDiagnosticRunProgress as d, resetDiagnosticRunActivityForTest as f, beginDiagnosticRetryWait as g, beginDiagnosticBackendActivity as h, getDiagnosticEmbeddedRunActivitySequence as i, markDiagnosticEmbeddedRunStarted as l, stopDiagnosticRunActivityTracking as m, closeDiagnosticEmbeddedRunOwner as n, isDiagnosticEmbeddedRunOwnerClosed as o, startDiagnosticRunActivityTracking as p, createDiagnosticEmbeddedRunOwner as r, markDiagnosticArgumentChurnObservation as s, clearDiagnosticEmbeddedRunActivityForSession as t, markDiagnosticOwnedToolActivity as u, RUN_STALE_TAKEOVER_MS as v, emitCoreModelRequestEndedDiagnosticEvent as x, resolveRunStaleThresholdMs as y };
