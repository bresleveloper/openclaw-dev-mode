import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as trackAsyncWork } from "./async-work-scope-BYeX3gh6.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { T as parseCronRunScopeSuffix } from "./session-key-C09ow4h0.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { l as getAgentEventLifecycleGeneration } from "./agent-events-GvNTkbe3.mjs";
import { d as withOwnedSessionTranscriptWrites } from "./transcript-write-context-m7NE2aEm.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Ccvy5spR.mjs";
import { s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { a as sessionEntryForkedFromParent } from "./session-entry-lineage-Dms9xZt1.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { d as buildUpdatedSessionGoalStatus } from "./goals-operations-DSJHMBAH.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { n as projectMainSessionRecoveryLifecycle } from "./main-session-recovery-lifecycle-Bj9fhVK-.mjs";
import { et as deriveSessionUnread } from "./session-row-prepared-read-eHG52FnK.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-BX-eWQU_.mjs";
import { n as resolveSessionRunError, t as recordGatewaySessionRunFailure } from "./session-run-error-D6x6GLBv.mjs";
import { n as readAgentRunProviderReview } from "./provider-review-terminal-B13AtO4A.mjs";
import "./session-utils-CwljFiKR.mjs";
import { t as isAgentLifecycleYieldedWaiting } from "./agent-lifecycle-parent-state-DbD_93hn.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-lifecycle-state.ts
const restartRecoveryLog = createSubsystemLogger("main-session-restart-recovery");
function isFiniteTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolveLifecyclePhase(event) {
	const phase = event.data?.phase;
	return phase === "start" || phase === "end" || phase === "error" ? phase : null;
}
const SESSION_STATUS_BY_TERMINAL_CLASSIFICATION = {
	success: "done",
	timeout: "timeout",
	cancellation: "killed",
	failure: "failed"
};
function resolveTerminalOutcome(event) {
	return buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: event.data?.phase === "error" ? "error" : "end",
		data: event.data,
		endedAt: event.data?.endedAt ?? event.ts
	});
}
function resolveSettledLifecycleTerminalOutcome(event) {
	const phase = resolveLifecyclePhase(event);
	if (phase !== "end" && phase !== "error") return;
	const outcome = resolveTerminalOutcome(event);
	return isAgentLifecycleYieldedWaiting({
		phase,
		yielded: event.data?.yielded,
		livenessState: event.data?.livenessState,
		stopReason: outcome.stopReason,
		aborted: event.data?.aborted,
		status: event.data?.status,
		timeoutPhase: event.data?.timeoutPhase,
		error: event.data?.error
	}) ? void 0 : outcome;
}
function resolveLifecycleTimestamp(...values) {
	return values.find(isFiniteTimestamp);
}
function resolveRuntimeMs(params) {
	const { startedAt, endedAt, existingRuntimeMs } = params;
	if (isFiniteTimestamp(startedAt) && isFiniteTimestamp(endedAt)) return Math.max(0, endedAt - startedAt);
	if (typeof existingRuntimeMs === "number" && Number.isFinite(existingRuntimeMs) && existingRuntimeMs >= 0) return existingRuntimeMs;
}
function deriveGatewaySessionLifecycleSnapshot(params) {
	const phase = resolveLifecyclePhase(params.event);
	if (!phase) return {};
	const existing = params.session ?? void 0;
	const startedAt = resolveLifecycleTimestamp(params.event.data?.startedAt, existing?.startedAt, params.event.ts);
	if (phase === "start") return {
		updatedAt: startedAt ?? existing?.updatedAt,
		status: "running",
		lastRunError: void 0,
		startedAt,
		endedAt: void 0,
		runtimeMs: void 0,
		abortedLastRun: false
	};
	const endedAt = resolveLifecycleTimestamp(params.event.data?.endedAt, params.event.ts);
	const updatedAt = endedAt ?? existing?.updatedAt;
	const terminal = resolveSettledLifecycleTerminalOutcome(params.event);
	const interruptedForRestart = terminal?.reason === "cancelled" && terminal.stopReason === "restart";
	const status = terminal && !interruptedForRestart ? SESSION_STATUS_BY_TERMINAL_CLASSIFICATION[classifyAgentRunTerminalOutcome(terminal)] : "running";
	return {
		updatedAt,
		status,
		lastRunError: terminal ? resolveSessionRunError({
			...terminal,
			errorKind: params.event.data?.errorKind
		}, status) : void 0,
		startedAt,
		endedAt: interruptedForRestart ? void 0 : endedAt,
		runtimeMs: interruptedForRestart ? void 0 : resolveRuntimeMs({
			startedAt,
			endedAt,
			existingRuntimeMs: existing?.runtimeMs
		}),
		...terminal && !interruptedForRestart && params.event.controlUiVisible === true && params.event.isHeartbeat !== true && endedAt !== void 0 ? { lastActivityAt: Math.max(existing?.lastActivityAt ?? 0, endedAt) } : {},
		abortedLastRun: interruptedForRestart || status === "killed"
	};
}
function derivePersistedSessionLifecyclePatch(params) {
	const phase = resolveLifecyclePhase(params.event);
	if ((phase === "end" || phase === "error") && params.event.data?.executionStarted === false) return {};
	const snapshot = deriveGatewaySessionLifecycleSnapshot({
		session: params.entry ? {
			...params.entry,
			status: params.entry.status === "interrupted" ? "failed" : params.entry.status
		} : void 0,
		event: params.event
	});
	const snapshotPatch = {
		...snapshot,
		updatedAt: typeof snapshot.updatedAt === "number" ? snapshot.updatedAt : void 0,
		...snapshot.status === "running" && snapshot.abortedLastRun === true ? { restartRecoveryForceSafeTools: true } : {}
	};
	const projection = projectMainSessionRecoveryLifecycle({
		currentLifecycleGeneration: getAgentEventLifecycleGeneration(),
		entry: params.entry,
		event: params.event,
		snapshotPatch
	});
	if (projection.action === "suppress") return {};
	const runId = normalizeOptionalString(params.event.runId);
	const clientRunId = normalizeOptionalString(params.event.clientRunId) ?? runId;
	return {
		...projection.patch,
		...phase === "start" ? {
			lifecycleRunId: runId,
			lastRunId: void 0
		} : projection.patch.status && projection.patch.status !== "running" ? {
			lifecycleRunId: void 0,
			lastRunId: clientRunId
		} : {}
	};
}
function deriveGatewaySessionLifecycleProjectionPatch(params) {
	const { restartRecoveryRuns: _restartRecoveryRuns, restartRecoveryForceSafeTools: _restartRecoveryForceSafeTools, lifecycleRunId: _lifecycleRunId, ...patch } = derivePersistedSessionLifecyclePatch(params);
	const { status, ...fields } = patch;
	return Object.hasOwn(patch, "status") ? {
		...fields,
		status: status === "interrupted" ? "failed" : status
	} : fields;
}
/**
* Reject pre-reset runs and explicitly older runs sharing one session so late
* lifecycle events cannot overwrite a newer run's authoritative state.
*/
function isStaleLifecycleEventForSession(params) {
	if (params.owningSessionId && params.currentSessionId && params.owningSessionId !== params.currentSessionId) return true;
	const eventRunId = normalizeOptionalString(params.eventRunId);
	const currentRunId = normalizeOptionalString(params.currentRunId);
	if (eventRunId && currentRunId && eventRunId === currentRunId) return false;
	return isFiniteTimestamp(params.eventStartedAt) && isFiniteTimestamp(params.currentStartedAt) && params.eventStartedAt < params.currentStartedAt;
}
function acceptsCronRunContinuationLifecycleEvent(params) {
	const marker = params.entry.cronRunContinuation;
	if (marker?.phase === "running") return true;
	const runId = params.event.runId?.trim();
	return Boolean(marker?.phase === "continuing" && runId && marker.ownerRunId === runId);
}
function matchesProviderReviewWriter(entry, fact) {
	return entry.sessionId === fact.target.sessionId && entry.lifecycleRevision === fact.target.lifecycleRevision && (entry.activeWriterRunId === fact.expectedWriterRunId || entry.lifecycleRunId === fact.expectedWriterRunId) && (entry.activeWriterRunId === void 0 || entry.activeWriterRunId === fact.expectedWriterRunId) && (entry.lifecycleRunId === void 0 || entry.lifecycleRunId === fact.expectedWriterRunId) && (!entry.providerReview || isDeepStrictEqual(entry.providerReview, fact.review));
}
async function persistGatewaySessionLifecycleEvent(params) {
	const phase = resolveLifecyclePhase(params.event);
	if (!phase) return;
	const sessionEntry = loadGatewaySessionEntry(params.sessionKey, {
		...params.agentId ? { agentId: params.agentId } : {},
		clone: false
	});
	if (!sessionEntry.entry) return;
	const terminalReview = (phase === "error" || phase === "end" && params.event.data?.stopReason === "error") && isIncognitoSessionKey(sessionEntry.canonicalKey) && params.event.runId ? readAgentRunProviderReview(params.event.runId) : void 0;
	const providerReview = terminalReview && terminalReview.target.sessionKey === sessionEntry.canonicalKey && terminalReview.target.storePath === sessionEntry.storePath && terminalReview.target.sessionId === params.event.sessionId && terminalReview.review.runId === params.event.runId && terminalReview.lifecycleGeneration === params.event.lifecycleGeneration && params.event.ts >= terminalReview.capturedAtMs && (terminalReview.lifecycleStartedAt === void 0 || terminalReview.lifecycleStartedAt === params.event.data?.startedAt) && matchesProviderReviewWriter(sessionEntry.entry, terminalReview) ? terminalReview : void 0;
	const owningSessionId = typeof params.event.sessionId === "string" && params.event.sessionId ? params.event.sessionId : void 0;
	const exactCronRun = parseCronRunScopeSuffix(sessionEntry.canonicalKey).runId !== void 0;
	let terminalRecovery;
	let failedRun;
	const persisted = await patchSessionEntryCore({
		storePath: sessionEntry.storePath,
		sessionKey: sessionEntry.canonicalKey
	}, async (storedEntry) => {
		terminalRecovery = void 0;
		failedRun = void 0;
		const entry = storedEntry;
		if (providerReview && !matchesProviderReviewWriter(entry, providerReview)) return null;
		const expected = params.expectedWriter;
		if (expected && (entry.sessionId !== expected.sessionId || entry.lifecycleRevision !== expected.lifecycleRevision || entry.activeWriterRunId !== expected.runId && entry.lifecycleRunId !== expected.runId || entry.activeWriterRunId !== void 0 && entry.activeWriterRunId !== expected.runId || entry.lifecycleRunId !== void 0 && entry.lifecycleRunId !== expected.runId)) return null;
		if (exactCronRun && !acceptsCronRunContinuationLifecycleEvent({
			entry,
			event: params.event
		})) return null;
		if (isStaleLifecycleEventForSession({
			owningSessionId,
			currentSessionId: entry.sessionId,
			eventRunId: params.event.runId,
			currentRunId: entry.lifecycleRunId,
			eventStartedAt: params.event.data?.startedAt,
			currentStartedAt: entry.startedAt
		})) return null;
		const eventRunId = normalizeOptionalString(params.event.runId);
		const eventClientRunId = normalizeOptionalString(params.event.clientRunId);
		const terminalRunId = normalizeOptionalString(entry.lastRunId);
		if (phase === "start" && entry.status !== "running" && terminalRunId !== void 0 && (eventRunId === terminalRunId || eventClientRunId === terminalRunId)) return null;
		const patch = derivePersistedSessionLifecyclePatch({
			entry,
			event: params.event
		});
		if (providerReview && Object.keys(patch).length > 0) patch.providerReview = providerReview.review;
		const endedAt = patch.endedAt ?? params.event.ts;
		if ((patch.status === "failed" || patch.status === "timeout") && entry.goal?.status === "active" && entry.goal.updatedAt <= endedAt) patch.goal = buildUpdatedSessionGoalStatus(entry, {
			status: "paused",
			note: `Paused after an error. Resume to continue. ${patch.lastRunError ?? (patch.status === "timeout" ? "Run timed out." : "Run failed.")}`
		}, endedAt);
		if ((phase === "error" || phase === "end") && eventRunId && (patch.status === "failed" || patch.status === "timeout")) failedRun = {
			runId: eventRunId,
			errorKind: params.event.data?.errorKind === "state_contention" ? "state_contention" : void 0,
			error: resolveTerminalOutcome(params.event).error ?? (patch.status === "timeout" ? "Run timed out" : void 0)
		};
		const terminalOutcome = params.event.mainSessionRestartRecovery === true && params.event.lifecycleGeneration === getAgentEventLifecycleGeneration() && eventRunId !== void 0 && (phase === "end" || phase === "error") ? resolveSettledLifecycleTerminalOutcome(params.event) : void 0;
		if (terminalOutcome && eventRunId && Object.keys(patch).length > 0) terminalRecovery = {
			runId: eventRunId,
			outcome: terminalOutcome
		};
		return Object.keys(patch).length > 0 ? patch : null;
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true,
		requireWriteSuccess: true,
		...providerReview ? { providerReviewMutation: true } : {},
		onCommitted: () => sessionChanges.emit({
			sessionKey: sessionEntry.canonicalKey,
			agentId: sessionEntry.agentId,
			storePath: sessionEntry.storePath,
			facts: { kind: "unchanged" }
		}),
		...params.assertCommitAllowed || providerReview ? { assertCommitAllowed: () => {
			params.assertCommitAllowed?.();
			providerReview?.assertCurrent();
		} } : {}
	});
	if (persisted && terminalRecovery) {
		const message = `main-session restart recovery terminal: session=${sessionEntry.canonicalKey} run=${terminalRecovery.runId} status=${terminalRecovery.outcome.status} reason=${terminalRecovery.outcome.reason}`;
		restartRecoveryLog[terminalRecovery.outcome.status === "ok" ? "info" : "warn"](message);
	}
	if (persisted && failedRun) {
		const { runId, error, errorKind } = failedRun;
		const receipt = {
			target: {
				agentId: sessionEntry.agentId,
				storePath: sessionEntry.storePath,
				sessionKey: sessionEntry.canonicalKey,
				sessionId: persisted.sessionId,
				expectedLifecycleRevision: persisted.lifecycleRevision,
				expectedWriterRunId: persisted.activeWriterRunId
			},
			runId,
			error,
			errorKind,
			assertCommitAllowed: params.assertCommitAllowed
		};
		await withOwnedSessionTranscriptWrites({
			sessionTarget: receipt.target,
			assertCommitAllowed: params.assertCommitAllowed,
			withTranscriptWrite: trackAsyncWork
		}, () => recordGatewaySessionRunFailure(receipt));
	}
}
//#endregion
//#region src/gateway/session-event-payload.ts
/**
* Project a catalog-less session row for websocket merge events.
* Picker metadata comes from catalog-backed list/patch responses; emitting a
* locally reconstructed subset here would replace richer client state.
* Null tombstones and false flags clear subscribed metadata during reconciliation.
*/
function buildGatewaySessionEventFields(params) {
	const { sessionRow } = params;
	const omitUnscopedGlobalGoal = sessionRow.key === "global" && !params.agentId;
	const omitUnscopedSwarm = (sessionRow.key === "global" || sessionRow.key === "unknown") && !params.agentId;
	return {
		updatedAt: sessionRow.updatedAt ?? void 0,
		sessionId: sessionRow.sessionId,
		createdActor: sessionRow.createdActor ?? null,
		owner: sessionRow.owner ?? null,
		participants: sessionRow.participants ?? [],
		participantCount: sessionRow.participantCount ?? 0,
		kind: sessionRow.kind,
		visibility: sessionRow.visibility,
		channel: sessionRow.channel,
		subject: sessionRow.subject,
		groupChannel: sessionRow.groupChannel,
		space: sessionRow.space,
		chatType: sessionRow.chatType,
		origin: sessionRow.origin,
		conversationLink: sessionRow.conversationLink,
		archived: sessionRow.archived ?? false,
		archivedAt: sessionRow.archivedAt ?? null,
		archivedBy: sessionRow.archivedBy ?? null,
		archiveReason: sessionRow.archiveReason ?? null,
		pinned: sessionRow.pinned ?? false,
		pinnedAt: sessionRow.pinnedAt ?? null,
		snoozedUntil: sessionRow.snoozedUntil ?? null,
		snoozedAt: sessionRow.snoozedAt ?? null,
		unread: sessionRow.unread ?? false,
		lastReadAt: sessionRow.lastReadAt,
		markedUnreadAt: sessionRow.markedUnreadAt ?? null,
		agentStatus: sessionRow.agentStatus ?? null,
		observerDigest: sessionRow.observerDigest ?? null,
		...sessionRow.activitySummary ? { activitySummary: sessionRow.activitySummary } : {},
		lastActivityAt: sessionRow.lastActivityAt,
		spawnedBy: sessionRow.spawnedBy,
		controlOwnerSessionKey: sessionRow.controlOwnerSessionKey ?? null,
		swarmGroupId: sessionRow.swarmGroupId,
		...!Object.hasOwn(sessionRow, "swarm") || omitUnscopedSwarm ? {} : { swarm: sessionRow.swarm ? {
			...sessionRow.swarm,
			groups: sessionRow.swarm.groups.map(({ children: _children, ...counts }) => counts)
		} : null },
		spawnedWorkspaceDir: sessionRow.spawnedWorkspaceDir,
		spawnedCwd: sessionRow.spawnedCwd,
		permissionMode: sessionRow.permissionMode ?? null,
		permissionModePending: sessionRow.permissionModePending ?? false,
		...sessionRow.permissionMode !== void 0 && sessionRow.sessionRoot !== void 0 ? { sessionRoot: sessionRow.sessionRoot } : {},
		forkedFromParent: sessionEntryForkedFromParent(sessionRow) ? true : void 0,
		spawnDepth: sessionRow.spawnDepth,
		subagentRole: sessionRow.subagentRole,
		subagentControlScope: sessionRow.subagentControlScope,
		createdVia: sessionRow.createdVia,
		createdAt: sessionRow.createdAt,
		forkSource: sessionRow.forkSource,
		previousSessionId: sessionRow.previousSessionId,
		label: params.label ?? sessionRow.label ?? null,
		autoLabel: sessionRow.autoLabel ?? null,
		icon: sessionRow.icon ?? null,
		color: sessionRow.color ?? null,
		channelAvatarUrl: sessionRow.channelAvatarUrl ?? null,
		category: sessionRow.category ?? null,
		boardPresentation: sessionRow.boardPresentation ?? null,
		displayName: params.displayName ?? sessionRow.displayName ?? null,
		deliveryContext: sessionRow.deliveryContext,
		parentSessionKey: params.parentSessionKey ?? sessionRow.parentSessionKey,
		childSessions: sessionRow.childSessions,
		thinkingLevel: sessionRow.thinkingLevel ?? null,
		fastMode: sessionRow.fastMode,
		effectiveFastMode: sessionRow.effectiveFastMode,
		effectiveFastModeSource: sessionRow.effectiveFastModeSource,
		fastAutoOnSeconds: sessionRow.fastAutoOnSeconds,
		toolOverrides: sessionRow.toolOverrides ?? null,
		verboseLevel: sessionRow.verboseLevel,
		traceLevel: sessionRow.traceLevel,
		reasoningLevel: sessionRow.reasoningLevel,
		elevatedLevel: sessionRow.elevatedLevel,
		sendPolicy: sessionRow.sendPolicy,
		systemSent: sessionRow.systemSent,
		abortedLastRun: sessionRow.abortedLastRun,
		restartRecoveryStatus: sessionRow.restartRecoveryStatus ?? null,
		inputTokens: sessionRow.inputTokens,
		outputTokens: sessionRow.outputTokens,
		lastChannel: sessionRow.lastChannel,
		lastTo: sessionRow.lastTo,
		lastAccountId: sessionRow.lastAccountId,
		lastThreadId: sessionRow.lastThreadId,
		totalTokens: sessionRow.totalTokens,
		totalTokensFresh: sessionRow.totalTokensFresh,
		...omitUnscopedGlobalGoal ? {} : { goal: sessionRow.goal ?? null },
		contextTokens: sessionRow.contextTokens,
		contextBudgetStatus: sessionRow.contextBudgetStatus ?? null,
		estimatedCostUsd: sessionRow.estimatedCostUsd,
		responseUsage: sessionRow.responseUsage,
		effectiveResponseUsage: sessionRow.effectiveResponseUsage,
		modelProvider: sessionRow.modelProvider,
		model: sessionRow.model,
		activeModelProvider: sessionRow.activeModelProvider ?? null,
		activeModel: sessionRow.activeModel ?? null,
		modelOverrideSource: sessionRow.modelOverrideSource,
		agentRuntime: sessionRow.agentRuntime,
		runtimeSelectionLocked: sessionRow.runtimeSelectionLocked,
		status: params.status ?? sessionRow.status,
		lastRunError: sessionRow.lastRunError ?? null,
		providerReview: sessionRow.providerReview ?? null,
		lastRunId: sessionRow.lastRunId ?? null,
		hasAutomation: sessionRow.hasAutomation ?? false,
		...params.hasActiveRun === void 0 ? {} : { hasActiveRun: params.hasActiveRun },
		...params.activeRunIds === void 0 ? {} : { activeRunIds: params.activeRunIds },
		startedAt: sessionRow.startedAt,
		endedAt: sessionRow.endedAt ?? null,
		runtimeMs: sessionRow.runtimeMs ?? null,
		pluginExtensions: sessionRow.pluginExtensions
	};
}
function buildGatewaySessionSnapshot(params) {
	const { event, sessionRow: storedRow } = params;
	if (!storedRow) return {};
	const lifecycleRow = event ? {
		...storedRow,
		updatedAt: storedRow.updatedAt ?? void 0
	} : void 0;
	const patch = event && !isStaleLifecycleEventForSession({
		owningSessionId: event.sessionId,
		currentSessionId: storedRow.sessionId,
		eventRunId: event.runId,
		currentRunId: params.lifecycleRunId,
		eventStartedAt: event.data?.startedAt,
		currentStartedAt: storedRow.startedAt
	}) ? deriveGatewaySessionLifecycleProjectionPatch({
		entry: lifecycleRow,
		event
	}) : {};
	const sessionRow = {
		...storedRow,
		...patch
	};
	if (Object.hasOwn(patch, "lastActivityAt")) sessionRow.unread = deriveSessionUnread(sessionRow);
	for (const key of [
		"thinkingLevels",
		"thinkingOptions",
		"thinkingDefault"
	]) delete sessionRow[key];
	if (params.lifecycle && sessionRow.totalTokensFresh !== true) {
		delete sessionRow.totalTokens;
		delete sessionRow.totalTokensFresh;
		delete sessionRow.contextTokens;
		delete sessionRow.estimatedCostUsd;
	}
	const activeStatus = params.activeRunState?.active ? params.activeRunState.status ?? "running" : void 0;
	const status = params.status ?? patch.status ?? activeStatus;
	const eventFields = buildGatewaySessionEventFields({
		sessionRow,
		agentId: params.agentId,
		label: params.label,
		displayName: params.displayName,
		parentSessionKey: params.parentSessionKey,
		status,
		hasActiveRun: params.activeRunState?.active,
		activeRunIds: params.activeRunState ? params.activeRunState.runIds ?? null : void 0
	});
	if (params.lifecycle) for (const field of [
		"modelProvider",
		"model",
		"activeModelProvider",
		"activeModel",
		"modelOverrideSource",
		"agentRuntime",
		"runtimeSelectionLocked"
	]) {
		delete sessionRow[field];
		delete eventFields[field];
	}
	const session = params.includeSession ? Object.assign(sessionRow, Object.fromEntries(Object.entries(eventFields).filter(([, value]) => value !== void 0))) : void 0;
	if (session && sessionRow.key === "global" && !params.agentId) delete session.goal;
	if (session && (sessionRow.key === "global" || sessionRow.key === "unknown") && !params.agentId) delete session.swarm;
	return {
		...session ? { session } : {},
		...eventFields,
		subagentRunState: sessionRow.subagentRunState,
		hasActiveSubagentRun: sessionRow.hasActiveSubagentRun
	};
}
//#endregion
export { deriveGatewaySessionLifecycleSnapshot as n, persistGatewaySessionLifecycleEvent as r, buildGatewaySessionSnapshot as t };
