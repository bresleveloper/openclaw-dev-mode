import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { a as formatUncaughtError, c as readErrorName } from "./errors-DCRXIYSQ.js";
import { n as isAbortError } from "./unhandled-rejections-QMGVkiWd.js";
import { _ as uniqueStrings, l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import "./agent-scope-CDZXADgT.js";
import { c as parseAgentSessionKey, l as parseRawSessionConversationRef, n as isAcpSessionKey, u as parseThreadSessionSuffix } from "./session-key-utils-C7uT9A4s.js";
import { p as resolveAgentIdFromSessionKey, s as classifySessionKeyShape, u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-C3ijpoNo.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-CNlVI3wV.js";
import { a as hasGatewayClientCap, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-CcqJJIan.js";
import { t as setSafeTimeout } from "./timer-delay-T0mHtzex.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-CS3xdS-V.js";
import "./method-scopes-D5SEXRvS.js";
import { i as resolveAssistantAvatarUrl } from "./control-ui-shared-B5mhV7Dw.js";
import { i as clearAgentRunContext, p as onAgentEvent, r as claimAgentRunContext, t as assertAgentRunLifecycleGenerationCurrent, u as getAgentEventLifecycleGeneration } from "./agent-events-7y1r8HOP.js";
import { n as resolveAgentMainSessionKey, r as resolveExplicitAgentSessionKey } from "./main-session-DWI7gPJU.js";
import { H as resolveMaintenanceConfigFromInput, _ as updateSessionStore, it as resolveSessionStoreKey, nt as canonicalizeSpawnedByForAgent } from "./store-DJ7wx5_V.js";
import { i as mergeDeliveryContext, o as normalizeDeliveryContext, s as normalizeSessionDeliveryFields } from "./delivery-context.shared-D36KNc_D.js";
import { n as isInternalNonDeliveryChannel } from "./message-channel-constants-Z0pS5ykd.js";
import { a as resolveSessionFilePath, o as resolveSessionFilePathOptions } from "./paths-CHZBIGhF.js";
import { i as normalizeMessageChannel, n as isGatewayMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { r as mergeSessionEntry } from "./types-CoDcFuoc.js";
import { t as asBoolean } from "./boolean-CrriykWV.js";
import { a as normalizeAgentRunTimeoutPhase, i as mergeAgentRunTerminalOutcome, t as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-D2FNsPKZ.js";
import { a as isAgentRunRestartAbortReason, n as AGENT_RUN_RESTART_ABORT_STOP_REASON } from "./run-termination-CgLu4sKB.js";
import { i as createRunningTaskRun, o as finalizeTaskRunByRunId } from "./detached-task-runtime-BFt5Tdox.js";
import { t as resolveAgentTimeoutMs } from "./timeout-Drw0_zOv.js";
import { r as readAcpSessionMeta } from "./session-meta-SVmmuxkv.js";
import "./sessions-gBZPP61K.js";
import { a as resolveTerminalMainSessionTranscriptRegistryCheck, i as resolveSessionLifecycleTimestamps, n as hasTerminalMainSessionTranscriptNewerThanRegistrySync } from "./lifecycle-Bt8jrZbf.js";
import { c as resolveSessionResetPolicy, n as resolveChannelResetConfig, o as evaluateSessionFreshness, r as resolveSessionResetType } from "./reset-BZdKvPn-.js";
import { c as shouldPreserveUserFacingSessionStateForInputProvenance, n as annotateInterSessionPromptText, s as normalizeInputProvenance } from "./input-provenance-CQSqbDss.js";
import { b as resolveSessionModelRef, d as migrateAndPruneGatewaySessionStoreKey, g as resolveGatewaySessionStoreTarget, h as resolveGatewayModelSupportsImages, u as loadSessionEntry } from "./session-utils-CWlrm3MP.js";
import { n as resolveSendPolicy } from "./send-policy-D_O9N501.js";
import { l as isTimeoutError } from "./failover-error-CZc6_Wx_.js";
import { s as resolveTrustedGroupId } from "./agent-tools.policy-CPsCsTmX.js";
import { c as resolveIngressWorkspaceOverrideForSpawnedRun, s as normalizeSpawnedRunMetadata } from "./subagent-spawn-plan-_-imzziC.js";
import "./subagent-announce-origin-CXc2u3vi.js";
import { n as shouldDowngradeDeliveryToSessionOnly } from "./best-effort-delivery-CLcrGAgu.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-DAY9l73H.js";
import { t as clearAllCliSessions } from "./cli-session-Despdu3U.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { i as validateAgentWaitParams, n as validateAgentIdentityParams, r as validateAgentParams, t as formatValidationErrors } from "./src-CSp7rUPX.js";
import { l as updateChatRunProvider, o as registerChatAbortController, s as resolveAgentRunExpiresAtMs } from "./chat-abort-CHoKqMso.js";
import { a as emitGatewaySessionEndPluginHook, c as performGatewaySessionReset, o as emitGatewaySessionStartPluginHook } from "./session-reset-service-v0ubqhFU.js";
import { n as resolvePublicAgentAvatarSource, t as resolveAgentAvatar } from "./identity-avatar-BxrNJNQm.js";
import { n as agentCommandFromIngress } from "./agent-command-7tLn36m_.js";
import { n as resolveAgentDeliveryPlanWithSessionRoute, r as resolveAgentOutboundTarget } from "./agent-delivery-bpHtMooN.js";
import { t as formatForLog } from "./ws-log-UD7Od6QM.js";
import "./agent-DhuBHzU3.js";
import { i as parseExecApprovalFollowupApprovalId, n as consumeExecApprovalFollowupRuntimeHandoff, r as isExecApprovalFollowupSessionRebound } from "./bash-tools.exec-approval-followup-state-BoIXP4tQ.js";
import { a as resolveChatAttachmentMaxBytes, i as parseMessageWithAttachments, n as MediaOffloadError, t as normalizeRpcAttachmentsToChatAttachments } from "./attachment-normalize-B8ReSd6S.js";
import { i as waitForTerminalGatewayDedupe, n as readTerminalSnapshotFromGatewayDedupe, r as setGatewayDedupeEntry, t as emitSessionsChanged } from "./session-change-event-DxFUuE-m.js";
import { r as resolveVoiceWakeRouteByTrigger, t as loadVoiceWakeRoutingConfig } from "./voicewake-routing-Cr2NsSKp.js";
import { n as resolveAssistantIdentity } from "./assistant-identity-BJOaexsg.js";
import { t as reactivateCompletedSubagentSession } from "./session-subagent-reactivation-DSXh8es7.js";
import { existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/agent-job.ts
const AGENT_RUN_CACHE_TTL_MS = 10 * 6e4;
/**
* Embedded runs can emit transient lifecycle `error` events while auth/model
* failover is still in progress. Give errors a short grace window so a
* subsequent `start` event can cancel premature terminal snapshots.
*/
const AGENT_RUN_ERROR_RETRY_GRACE_MS = 15e3;
/**
* Some embedded runtimes emit an intermediate lifecycle `end` with
* `aborted=true` immediately before retrying the same run. Hold timeout
* snapshots briefly so `agent.wait` does not resolve to a stale timeout when a
* final success is about to arrive.
*/
const AGENT_RUN_TIMEOUT_RETRY_GRACE_MS = 15e3;
const agentRunCache = /* @__PURE__ */ new Map();
const agentRunStarts = /* @__PURE__ */ new Map();
const pendingAgentRunErrors = /* @__PURE__ */ new Map();
const pendingAgentRunTimeouts = /* @__PURE__ */ new Map();
const agentRunWaiterCounts = /* @__PURE__ */ new Map();
let agentRunListenerStarted = false;
function pruneAgentRunCache(now = Date.now()) {
	for (const [runId, entry] of agentRunCache) if (now - entry.ts > AGENT_RUN_CACHE_TTL_MS) agentRunCache.delete(runId);
}
function recordAgentRunSnapshot(entry) {
	pruneAgentRunCache(entry.ts);
	const existing = agentRunCache.get(entry.runId);
	if (existing && shouldPreserveTerminalSnapshot(existing, entry)) {
		agentRunCache.set(entry.runId, {
			...existing,
			ts: entry.ts
		});
		return;
	}
	agentRunCache.set(entry.runId, entry);
}
function shouldPreserveTerminalSnapshot(existing, incoming) {
	const existingOutcome = terminalOutcomeFromSnapshot(existing);
	const incomingOutcome = terminalOutcomeFromSnapshot(incoming);
	if (!existingOutcome) return false;
	if (!incomingOutcome) return false;
	return mergeAgentRunTerminalOutcome(existingOutcome, incomingOutcome) === existingOutcome;
}
function terminalOutcomeFromSnapshot(snapshot) {
	if (snapshot.pendingError) return;
	return buildAgentRunTerminalOutcome(snapshot);
}
function clearPendingAgentRunError(runId) {
	const pending = pendingAgentRunErrors.get(runId);
	if (!pending) return;
	clearTimeout(pending.timer);
	pendingAgentRunErrors.delete(runId);
}
function clearPendingAgentRunTimeout(runId) {
	const pending = pendingAgentRunTimeouts.get(runId);
	if (!pending) return;
	clearTimeout(pending.timer);
	pendingAgentRunTimeouts.delete(runId);
}
function schedulePendingAgentRunError(snapshot) {
	const pendingTimeout = pendingAgentRunTimeouts.get(snapshot.runId);
	if (pendingTimeout && shouldPreserveTerminalSnapshot(pendingTimeout.snapshot, snapshot)) return;
	clearPendingAgentRunTimeout(snapshot.runId);
	clearPendingAgentRunError(snapshot.runId);
	const dueAt = Date.now() + AGENT_RUN_ERROR_RETRY_GRACE_MS;
	const timer = setTimeout(() => {
		const pending = pendingAgentRunErrors.get(snapshot.runId);
		if (!pending) return;
		pendingAgentRunErrors.delete(snapshot.runId);
		recordAgentRunSnapshot(pending.snapshot);
	}, AGENT_RUN_ERROR_RETRY_GRACE_MS);
	timer.unref?.();
	pendingAgentRunErrors.set(snapshot.runId, {
		snapshot,
		dueAt,
		timer
	});
}
function schedulePendingAgentRunTimeout(snapshot) {
	const pendingTimeout = pendingAgentRunTimeouts.get(snapshot.runId);
	if (pendingTimeout && shouldPreserveTerminalSnapshot(pendingTimeout.snapshot, snapshot)) return;
	clearPendingAgentRunError(snapshot.runId);
	clearPendingAgentRunTimeout(snapshot.runId);
	const dueAt = Date.now() + AGENT_RUN_TIMEOUT_RETRY_GRACE_MS;
	const timer = setTimeout(() => {
		const pending = pendingAgentRunTimeouts.get(snapshot.runId);
		if (!pending) return;
		pendingAgentRunTimeouts.delete(snapshot.runId);
		recordAgentRunSnapshot(pending.snapshot);
	}, AGENT_RUN_TIMEOUT_RETRY_GRACE_MS);
	timer.unref?.();
	pendingAgentRunTimeouts.set(snapshot.runId, {
		snapshot,
		dueAt,
		timer
	});
}
function getPendingAgentRunError(runId) {
	const pending = pendingAgentRunErrors.get(runId);
	if (!pending) return;
	return {
		snapshot: pending.snapshot,
		dueAt: pending.dueAt
	};
}
function getPendingAgentRunTimeout(runId) {
	const pending = pendingAgentRunTimeouts.get(runId);
	if (!pending) return;
	return {
		snapshot: pending.snapshot,
		dueAt: pending.dueAt
	};
}
function createPendingErrorTimeoutSnapshot(snapshot) {
	return {
		runId: snapshot.runId,
		status: "timeout",
		startedAt: snapshot.startedAt,
		error: snapshot.error,
		pendingError: true,
		...snapshot.providerStarted !== void 0 ? { providerStarted: snapshot.providerStarted } : {},
		ts: Date.now()
	};
}
function createSnapshotFromLifecycleEvent(params) {
	const { runId, phase, data } = params;
	const startedAt = typeof data?.startedAt === "number" ? data.startedAt : agentRunStarts.get(runId);
	const endedAt = typeof data?.endedAt === "number" ? data.endedAt : void 0;
	const error = typeof data?.error === "string" ? data.error : void 0;
	const stopReason = typeof data?.stopReason === "string" ? data.stopReason : void 0;
	const livenessState = typeof data?.livenessState === "string" ? data.livenessState : void 0;
	const terminalOutcome = buildAgentRunTerminalOutcome({
		status: phase === "error" ? "error" : data?.aborted ? "timeout" : "ok",
		error,
		stopReason,
		livenessState,
		timeoutPhase: data?.timeoutPhase,
		providerStarted: data?.providerStarted,
		startedAt,
		endedAt
	});
	return {
		runId,
		status: terminalOutcome.status,
		startedAt,
		endedAt,
		error: terminalOutcome.error,
		stopReason,
		livenessState,
		...data?.yielded === true ? { yielded: true } : {},
		...terminalOutcome.timeoutPhase ? { timeoutPhase: terminalOutcome.timeoutPhase } : {},
		...terminalOutcome.providerStarted !== void 0 ? { providerStarted: terminalOutcome.providerStarted } : {},
		ts: Date.now()
	};
}
function ensureAgentRunListener() {
	if (agentRunListenerStarted) return;
	agentRunListenerStarted = true;
	onAgentEvent((evt) => {
		if (!evt) return;
		if (evt.stream !== "lifecycle") return;
		const phase = evt.data?.phase;
		if (phase === "start") {
			const startedAt = typeof evt.data?.startedAt === "number" ? evt.data.startedAt : void 0;
			agentRunStarts.set(evt.runId, startedAt ?? Date.now());
			clearPendingAgentRunError(evt.runId);
			clearPendingAgentRunTimeout(evt.runId);
			agentRunCache.delete(evt.runId);
			return;
		}
		if (phase !== "end" && phase !== "error") return;
		const snapshot = createSnapshotFromLifecycleEvent({
			runId: evt.runId,
			phase,
			data: evt.data
		});
		agentRunStarts.delete(evt.runId);
		if (phase === "error") {
			schedulePendingAgentRunError(snapshot);
			return;
		}
		if (snapshot.status === "timeout") {
			schedulePendingAgentRunTimeout(snapshot);
			return;
		}
		const pendingTimeout = pendingAgentRunTimeouts.get(evt.runId);
		if (pendingTimeout && shouldPreserveTerminalSnapshot(pendingTimeout.snapshot, snapshot)) return;
		clearPendingAgentRunError(evt.runId);
		clearPendingAgentRunTimeout(evt.runId);
		recordAgentRunSnapshot(snapshot);
	});
}
function getCachedAgentRun(runId) {
	pruneAgentRunCache();
	return agentRunCache.get(runId);
}
function addAgentRunWaiter(runId) {
	agentRunWaiterCounts.set(runId, (agentRunWaiterCounts.get(runId) ?? 0) + 1);
	let removed = false;
	return () => {
		if (removed) return;
		removed = true;
		const nextCount = (agentRunWaiterCounts.get(runId) ?? 1) - 1;
		if (nextCount <= 0) {
			agentRunWaiterCounts.delete(runId);
			return;
		}
		agentRunWaiterCounts.set(runId, nextCount);
	};
}
async function waitForAgentJob(params) {
	const { runId, timeoutMs, signal, ignoreCachedSnapshot = false } = params;
	ensureAgentRunListener();
	const cached = ignoreCachedSnapshot ? void 0 : getCachedAgentRun(runId);
	if (cached) return cached;
	if (timeoutMs <= 0 || signal?.aborted) return null;
	return await new Promise((resolve) => {
		let settled = false;
		let pendingErrorTimer;
		let pendingTimeoutTimer;
		let pendingTimeoutSnapshot;
		let removeWaiter = () => {};
		const clearPendingErrorTimer = () => {
			if (!pendingErrorTimer) return;
			clearTimeout(pendingErrorTimer);
			pendingErrorTimer = void 0;
		};
		const clearPendingTimeoutTimer = () => {
			if (!pendingTimeoutTimer) return;
			clearTimeout(pendingTimeoutTimer);
			pendingTimeoutTimer = void 0;
			pendingTimeoutSnapshot = void 0;
		};
		const finish = (entry) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			clearPendingErrorTimer();
			clearPendingTimeoutTimer();
			unsubscribe();
			removeWaiter();
			if (onAbort) signal?.removeEventListener("abort", onAbort);
			resolve(entry);
		};
		const scheduleTerminalFinish = (kind, snapshot, delayMs) => {
			if (pendingTimeoutSnapshot && shouldPreserveTerminalSnapshot(pendingTimeoutSnapshot, snapshot)) return;
			clearPendingErrorTimer();
			clearPendingTimeoutTimer();
			const timerRef = setSafeTimeout(() => {
				const latest = ignoreCachedSnapshot ? void 0 : getCachedAgentRun(runId);
				if (latest) {
					finish(latest);
					return;
				}
				recordAgentRunSnapshot(snapshot);
				finish(snapshot);
			}, delayMs);
			timerRef.unref?.();
			if (kind === "error") pendingErrorTimer = timerRef;
			else {
				pendingTimeoutTimer = timerRef;
				pendingTimeoutSnapshot = snapshot;
			}
		};
		const scheduleErrorFinish = (snapshot, delayMs = AGENT_RUN_ERROR_RETRY_GRACE_MS) => {
			scheduleTerminalFinish("error", snapshot, delayMs);
		};
		const scheduleTimeoutFinish = (snapshot, delayMs = AGENT_RUN_TIMEOUT_RETRY_GRACE_MS) => {
			scheduleTerminalFinish("timeout", snapshot, delayMs);
		};
		if (!ignoreCachedSnapshot) {
			const pendingError = getPendingAgentRunError(runId);
			if (pendingError) scheduleErrorFinish(pendingError.snapshot, pendingError.dueAt - Date.now());
			const pendingTimeout = getPendingAgentRunTimeout(runId);
			if (pendingTimeout) scheduleTimeoutFinish(pendingTimeout.snapshot, pendingTimeout.dueAt - Date.now());
		}
		const unsubscribe = onAgentEvent((evt) => {
			if (!evt || evt.stream !== "lifecycle") return;
			if (evt.runId !== runId) return;
			const phase = evt.data?.phase;
			if (phase === "start") {
				clearPendingErrorTimer();
				clearPendingTimeoutTimer();
				return;
			}
			if (phase !== "end" && phase !== "error") return;
			const latest = ignoreCachedSnapshot ? void 0 : getCachedAgentRun(runId);
			if (latest) {
				if (pendingTimeoutSnapshot && shouldPreserveTerminalSnapshot(pendingTimeoutSnapshot, latest)) return;
				finish(latest);
				return;
			}
			const snapshot = createSnapshotFromLifecycleEvent({
				runId: evt.runId,
				phase,
				data: evt.data
			});
			if (phase === "error") {
				scheduleErrorFinish(snapshot);
				return;
			}
			if (snapshot.status === "timeout") {
				scheduleTimeoutFinish(snapshot);
				return;
			}
			if (pendingTimeoutSnapshot && shouldPreserveTerminalSnapshot(pendingTimeoutSnapshot, snapshot)) return;
			recordAgentRunSnapshot(snapshot);
			finish(snapshot);
		});
		removeWaiter = addAgentRunWaiter(runId);
		const timer = setSafeTimeout(() => {
			const pendingError = getPendingAgentRunError(runId);
			finish(pendingError ? createPendingErrorTimeoutSnapshot(pendingError.snapshot) : null);
		}, timeoutMs);
		const onAbort = () => finish(null);
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
ensureAgentRunListener();
//#endregion
//#region src/gateway/server-methods/agent.ts
const RESET_COMMAND_RE = /^\/(new|reset)(?:\s+([\s\S]*))?$/i;
function formatAttachmentFailureForLog(err) {
	const primary = formatUncaughtError(err);
	const cause = err instanceof Error ? err.cause : void 0;
	if (cause === void 0) return primary;
	const causeText = formatUncaughtError(cause);
	if (!causeText || causeText === primary) return primary;
	return `${primary}\nCaused by: ${causeText}`;
}
function logAttachmentFailure(logGateway, label, err) {
	logGateway.error(label, {
		error: formatAttachmentFailureForLog(err),
		consoleMessage: `${label}: ${formatForLog(err)}`
	});
}
function clientHasAdminScope(client) {
	return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
}
function resolveAllowModelOverrideFromClient(client) {
	return clientHasAdminScope(client) || client?.internal?.allowModelOverride === true;
}
function resolveCanUseInternalRuntimeHandoff(client) {
	return client?.connect?.client?.mode === GATEWAY_CLIENT_MODES.BACKEND;
}
function emitAgentSendSessionLifecycleTransition(transition) {
	if (!transition) return;
	if (transition.previousSessionId) emitGatewaySessionEndPluginHook({
		cfg: transition.cfg,
		sessionKey: transition.sessionKey,
		sessionId: transition.previousSessionId,
		storePath: transition.storePath,
		sessionFile: transition.previousSessionFile,
		agentId: transition.agentId,
		reason: transition.previousEndReason ?? "unknown",
		nextSessionId: transition.sessionId,
		nextSessionKey: transition.sessionKey
	});
	emitGatewaySessionStartPluginHook({
		cfg: transition.cfg,
		sessionKey: transition.sessionKey,
		sessionId: transition.sessionId,
		resumedFrom: transition.previousSessionId,
		storePath: transition.storePath,
		sessionFile: transition.sessionFile,
		agentId: transition.agentId
	});
}
async function runSessionResetFromAgent(params) {
	const result = await performGatewaySessionReset({
		key: params.key,
		...params.agentId ? { agentId: params.agentId } : {},
		reason: params.reason,
		commandSource: "gateway:agent",
		assertCurrent: params.assertCurrent,
		onCommitted: params.onCommitted
	});
	if (!result.ok) return result;
	return {
		ok: true,
		key: result.key,
		sessionId: result.entry.sessionId
	};
}
function sessionResetAckText(reason) {
	return reason === "new" ? "✅ New session started." : "✅ Session reset.";
}
function buildBareSessionResetResult(params) {
	return {
		payloads: [{ text: params.ackText ?? sessionResetAckText(params.reason) }],
		meta: {
			durationMs: 0,
			...params.sessionId ? { agentMeta: { sessionId: params.sessionId } } : {}
		}
	};
}
function buildBareSessionResetResponse(params) {
	return {
		runId: params.runId,
		status: "ok",
		summary: "completed",
		result: params.result
	};
}
async function deliverBareSessionResetResult(params) {
	const { deliverAgentCommandResult } = await import("./delivery.runtime.js");
	params.assertCurrent?.();
	const result = buildBareSessionResetResult({
		reason: params.reason,
		sessionId: params.sessionId,
		ackText: params.ackText
	});
	return await deliverAgentCommandResult({
		cfg: params.cfg,
		deps: params.context.deps,
		runtime: defaultRuntime,
		opts: {
			message: params.ackText ?? sessionResetAckText(params.reason),
			...params.agentId ? { agentId: params.agentId } : {},
			...params.sessionId ? { sessionId: params.sessionId } : {},
			sessionKey: params.sessionKey,
			deliver: true,
			replyTo: params.request.replyTo,
			to: params.request.to,
			replyChannel: params.request.replyChannel,
			channel: params.request.channel,
			replyAccountId: params.request.replyAccountId,
			accountId: params.request.accountId,
			threadId: params.request.threadId,
			deliveryTargetMode: params.deliveryTargetMode,
			bestEffortDeliver: params.bestEffortDeliver,
			runId: params.runId,
			messageChannel: params.originMessageChannel,
			runContext: {
				messageChannel: params.originMessageChannel,
				accountId: params.request.replyAccountId ?? params.request.accountId,
				currentThreadTs: params.request.threadId != null ? String(params.request.threadId) : void 0
			},
			allowModelOverride: false
		},
		outboundSession: void 0,
		sessionEntry: params.sessionEntry,
		result,
		payloads: result.payloads,
		assertDeliveryCurrent: params.assertCurrent
	});
}
async function resolveBareSessionResetResult(params) {
	params.assertCurrent?.();
	if (params.request.deliver !== true) return buildBareSessionResetResult({
		reason: params.reason,
		sessionId: params.sessionId,
		ackText: params.ackText
	});
	if (resolveSendPolicy({
		cfg: params.cfg,
		entry: params.sessionEntry,
		sessionKey: params.sessionKey,
		channel: params.sessionEntry?.channel,
		chatType: params.sessionEntry?.chatType
	}) === "deny") throw new Error("send blocked by session policy");
	const deliveryPlan = await resolveAgentDeliveryPlanWithSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		currentSessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		requestedChannel: normalizeOptionalString(params.request.replyChannel) ?? normalizeOptionalString(params.request.channel),
		explicitTo: normalizeOptionalString(params.request.replyTo) ?? normalizeOptionalString(params.request.to),
		explicitThreadId: normalizeOptionalString(params.request.threadId),
		accountId: normalizeOptionalString(params.request.replyAccountId) ?? normalizeOptionalString(params.request.accountId),
		wantsDelivery: true,
		turnSourceChannel: normalizeOptionalString(params.request.channel),
		turnSourceTo: normalizeOptionalString(params.request.to),
		turnSourceAccountId: normalizeOptionalString(params.request.accountId),
		turnSourceThreadId: normalizeOptionalString(params.request.threadId)
	});
	params.assertCurrent?.();
	const mainSessionKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey)
	});
	const bestEffortDeliver = typeof params.request.bestEffortDeliver === "boolean" ? params.request.bestEffortDeliver : params.sessionKey === mainSessionKey || params.sessionKey === "global" ? true : void 0;
	return await deliverBareSessionResetResult({
		cfg: params.cfg,
		context: params.context,
		reason: params.reason,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		sessionEntry: params.sessionEntry,
		request: {
			...params.request,
			channel: deliveryPlan.resolvedChannel,
			to: deliveryPlan.resolvedTo ?? deliveryPlan.baseDelivery.to,
			accountId: deliveryPlan.resolvedAccountId ?? deliveryPlan.baseDelivery.accountId,
			threadId: deliveryPlan.resolvedThreadId
		},
		bestEffortDeliver,
		deliveryTargetMode: deliveryPlan.deliveryTargetMode ?? deliveryPlan.baseDelivery.mode,
		originMessageChannel: params.originMessageChannel ?? deliveryPlan.resolvedChannel,
		runId: params.runId,
		assertCurrent: params.assertCurrent,
		ackText: params.ackText
	});
}
function loadBareSessionResetDeliverySession(params) {
	const selectedGlobalAgentId = params.sessionKey === "global" && params.agentId ? params.agentId : void 0;
	const loaded = loadSessionEntry(params.sessionKey, {
		clone: false,
		...selectedGlobalAgentId ? { agentId: selectedGlobalAgentId } : {}
	});
	const loadedCfg = loaded?.cfg ?? params.cfg;
	return {
		cfg: loadedCfg,
		entry: loaded?.entry,
		agentId: selectedGlobalAgentId ?? resolveAgentIdFromSessionKey(params.sessionKey) ?? resolveDefaultAgentId(loadedCfg)
	};
}
function resolveSessionRuntimeCwd(params) {
	return normalizeOptionalString(params.sessionEntry?.spawnedCwd);
}
function normalizeTrustedGroupMetadata(value) {
	return {
		groupId: normalizeOptionalString(value?.groupId),
		groupChannel: normalizeOptionalString(value?.groupChannel),
		groupSpace: normalizeOptionalString(value?.groupSpace ?? value?.space)
	};
}
function resolveSessionKeyGroupId(sessionKey) {
	const { baseSessionKey } = parseThreadSessionSuffix(sessionKey);
	const conversation = parseRawSessionConversationRef(baseSessionKey ?? sessionKey);
	if (!conversation || conversation.kind !== "group" && conversation.kind !== "channel") return;
	return conversation.rawId;
}
function resolveTrustedGroupMetadata(params) {
	return {
		groupId: params.stored.groupId ?? params.inherited?.groupId ?? resolveSessionKeyGroupId(params.sessionKey) ?? (params.spawnedBy ? resolveSessionKeyGroupId(params.spawnedBy) : void 0),
		groupChannel: params.stored.groupChannel ?? params.inherited?.groupChannel,
		groupSpace: params.stored.groupSpace ?? params.inherited?.groupSpace
	};
}
function requestGroupMatchesTrusted(params) {
	const requestGroupId = params.requestGroupId?.trim();
	if (!requestGroupId) return true;
	return Boolean(params.trustedGroupId && requestGroupId === params.trustedGroupId);
}
function resolveGatewayAgentTaskTrackingMode(params) {
	if (!params.sessionKey?.trim() || params.inputProvenance?.kind === "inter_session") return "none";
	return params.client?.internal?.agentRunTracking === "plugin_subagent" ? "plugin_subagent" : "cli";
}
async function registerPluginSubagentRunFromGateway(params) {
	const childSessionKey = params.childSessionKey.trim();
	if (!childSessionKey) return;
	const ownerSessionKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: resolveAgentIdFromSessionKey(childSessionKey)
	});
	const { registerSubagentRun } = await import("./subagent-registry-BM4p5DMc.js");
	registerSubagentRun({
		runId: params.runId,
		childSessionKey,
		controllerSessionKey: ownerSessionKey,
		requesterSessionKey: ownerSessionKey,
		requesterOrigin: params.requesterOrigin,
		requesterDisplayKey: "main",
		task: params.task,
		cleanup: "keep",
		...params.pluginId ? { label: `plugin:${params.pluginId}` } : {},
		expectsCompletionMessage: false,
		spawnMode: "run"
	});
}
function resolveFailedTrackedAgentTaskStatus(error) {
	return isAbortError(error) || isTimeoutError(error) ? "timed_out" : "failed";
}
function tryFinalizeTrackedAgentTask(params) {
	try {
		finalizeTaskRunByRunId({
			runId: params.runId,
			runtime: "cli",
			status: params.status,
			endedAt: Date.now(),
			...params.error !== void 0 ? { error: params.error } : {},
			...params.terminalSummary !== void 0 ? { terminalSummary: params.terminalSummary } : {}
		});
	} catch (err) {
		params.log.warn(`failed to finalize tracked agent task ${params.runId}: ${formatForLog(err)}`);
	}
}
function resolveAgentDedupeKeys(params) {
	const keys = [`agent:${params.idempotencyKey}`];
	const approvalId = params.execApprovalFollowupApprovalId?.trim();
	if (approvalId) keys.push(`agent:exec-approval-followup:${approvalId}`);
	return uniqueStrings(keys);
}
function readGatewayDedupeEntry(params) {
	for (const key of params.keys) {
		const entry = params.dedupe.get(key);
		if (entry) return entry;
	}
}
function isAcceptedAgentDedupePayload(payload) {
	return typeof payload === "object" && payload !== null && payload.status === "accepted";
}
function isPreRegistrationAbortedAgentDedupePayload(payload) {
	const stopReason = payload?.stopReason;
	return typeof payload === "object" && payload !== null && payload.status === "timeout" && (stopReason === "rpc" || stopReason === "stop");
}
function isPreRegistrationAbortedAgentDedupeEntryForSession(params) {
	if (!params.entry?.ok || !isPreRegistrationAbortedAgentDedupePayload(params.entry.payload)) return false;
	const payload = params.entry.payload;
	const payloadRunId = typeof payload.runId === "string" ? payload.runId.trim() : "";
	if (payloadRunId && payloadRunId !== params.runId) return false;
	const payloadSessionKey = typeof payload.sessionKey === "string" && payload.sessionKey.trim() ? payload.sessionKey.trim() : void 0;
	const expectedSessionKeys = new Set([params.sessionKey, ...params.alternateSessionKeys ?? []].filter((value) => Boolean(value?.trim())));
	return !payloadSessionKey || expectedSessionKeys.size === 0 || expectedSessionKeys.has(payloadSessionKey);
}
function setGatewayDedupeEntries(params) {
	for (const key of params.keys) setGatewayDedupeEntry({
		dedupe: params.dedupe,
		key,
		entry: params.entry
	});
}
function setAbortedAgentDedupeEntries(params) {
	setGatewayDedupeEntries({
		dedupe: params.dedupe,
		keys: params.keys,
		entry: {
			ts: Date.now(),
			ok: true,
			payload: {
				runId: params.runId,
				...params.agentId ? { agentId: params.agentId } : {},
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				status: "timeout",
				summary: "aborted",
				stopReason: params.stopReason,
				timeoutPhase: "queue",
				providerStarted: false
			}
		}
	});
}
function readAgentRunTimeoutAttribution(meta) {
	const record = meta && typeof meta === "object" && !Array.isArray(meta) ? meta : void 0;
	return {
		timeoutPhase: normalizeAgentRunTimeoutPhase(record?.timeoutPhase),
		providerStarted: asBoolean(record?.providerStarted)
	};
}
function isGatewayAbortSignalReason(reason) {
	return reason === void 0 || isAbortError(reason) || readErrorName(reason) === "TimeoutError";
}
function isGatewayAgentAbortRejection(error, signal) {
	if (!signal.aborted) return false;
	if (isAgentRunRestartAbortReason(signal.reason)) return true;
	if (readErrorName(signal.reason) === "TimeoutError") return true;
	if (!isGatewayAbortSignalReason(signal.reason)) return false;
	return isAbortError(error) || readErrorName(error) === "TimeoutError";
}
function resolveGatewayAgentAbortStopReason(signal) {
	if (isAgentRunRestartAbortReason(signal.reason)) return "restart";
	return readErrorName(signal.reason) === "TimeoutError" ? "timeout" : "rpc";
}
function resolveAbortedAgentStopReason(entry) {
	return entry?.abortStopReason?.trim() || "rpc";
}
function deleteGatewayDedupeEntries(params) {
	for (const key of params.keys) params.dedupe.delete(key);
}
function dispatchAgentRunFromGateway(params) {
	const shouldTrackTask = params.taskTrackingMode === "cli";
	let taskTracked = false;
	if (shouldTrackTask) try {
		taskTracked = Boolean(createRunningTaskRun({
			runtime: "cli",
			sourceId: params.runId,
			ownerKey: params.ingressOpts.sessionKey,
			scopeKind: "session",
			requesterOrigin: normalizeDeliveryContext({
				channel: params.ingressOpts.channel,
				to: params.ingressOpts.to,
				accountId: params.ingressOpts.accountId,
				threadId: params.ingressOpts.threadId
			}),
			childSessionKey: params.ingressOpts.sessionKey,
			runId: params.runId,
			task: params.ingressOpts.message,
			deliveryStatus: "not_applicable",
			startedAt: Date.now()
		}));
	} catch (err) {
		params.context.logGateway.warn(`failed to start tracked agent task ${params.runId}: ${formatForLog(err)}`);
	}
	agentCommandFromIngress(params.ingressOpts, defaultRuntime, params.context.deps).then((result) => {
		const aborted = result?.meta?.aborted === true;
		const timeoutAttribution = readAgentRunTimeoutAttribution(result?.meta);
		if (taskTracked) tryFinalizeTrackedAgentTask({
			runId: params.runId,
			status: aborted ? "timed_out" : "succeeded",
			terminalSummary: aborted ? "aborted" : "completed",
			log: params.context.logGateway
		});
		const payload = {
			runId: params.runId,
			status: aborted ? "timeout" : "ok",
			summary: aborted ? "aborted" : "completed",
			...aborted ? { stopReason: result?.meta?.stopReason ?? "rpc" } : {},
			...aborted && timeoutAttribution.timeoutPhase ? { timeoutPhase: timeoutAttribution.timeoutPhase } : {},
			...aborted && timeoutAttribution.providerStarted !== void 0 ? { providerStarted: timeoutAttribution.providerStarted } : {},
			result
		};
		setGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.dedupeKeys,
			entry: {
				ts: Date.now(),
				ok: true,
				payload
			}
		});
		params.respond(true, payload, void 0, { runId: params.runId });
	}).catch((err) => {
		const aborted = isGatewayAgentAbortRejection(err, params.abortController.signal);
		const renderedErr = formatForLog(err);
		if (taskTracked) tryFinalizeTrackedAgentTask({
			runId: params.runId,
			status: aborted ? "timed_out" : resolveFailedTrackedAgentTaskStatus(err),
			error: renderedErr,
			terminalSummary: renderedErr,
			log: params.context.logGateway
		});
		const error = errorShape(ErrorCodes.UNAVAILABLE, renderedErr);
		const stopReason = resolveGatewayAgentAbortStopReason(params.abortController.signal);
		const payload = {
			runId: params.runId,
			status: aborted ? "timeout" : "error",
			summary: aborted ? "aborted" : renderedErr,
			...aborted ? {
				stopReason,
				timeoutPhase: "gateway_draining"
			} : {}
		};
		setGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.dedupeKeys,
			entry: {
				ts: Date.now(),
				ok: aborted,
				payload,
				...aborted ? {} : { error }
			}
		});
		params.respond(aborted, payload, aborted ? void 0 : error, {
			runId: params.runId,
			...aborted ? {} : { error: formatForLog(err) }
		});
	}).finally(() => {
		clearAgentRunContext(params.runId, params.ingressOpts.lifecycleGeneration);
		params.cleanupAbortController();
	});
}
function shouldSuppressAgentPromptPersistence(params) {
	if (params.inputProvenance?.kind !== "inter_session" || params.inputProvenance.sourceTool !== "subagent_announce") return false;
	return params.internalEvents?.some((event) => event.type === "task_completion" && event.source === "subagent") === true;
}
function yieldAfterAgentAcceptedAck() {
	return new Promise((resolve) => {
		setTimeout(resolve, 10);
	});
}
const agentHandlers = {
	agent: async ({ params, respond, context, client, isWebchatConnect }) => {
		const p = params;
		if (!validateAgentParams(p)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent params: ${formatValidationErrors(validateAgentParams.errors)}`));
			return;
		}
		const request = p;
		const allowModelOverride = resolveAllowModelOverrideFromClient(client);
		const canUseInternalRuntimeHandoff = resolveCanUseInternalRuntimeHandoff(client);
		const requestedModelOverride = Boolean(request.provider || request.model);
		const requestedInternalSessionEffects = request.sessionEffects === "internal";
		const requestedPromptPersistenceSuppression = request.suppressPromptPersistence === true;
		const isRawModelRun = request.modelRun === true || request.promptMode === "none";
		if (requestedModelOverride && !allowModelOverride) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "provider/model overrides are not authorized for this caller."));
			return;
		}
		if ((requestedInternalSessionEffects || requestedPromptPersistenceSuppression) && !canUseInternalRuntimeHandoff) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "internal session-effect controls are reserved for backend callers."));
			return;
		}
		const providerOverride = allowModelOverride ? request.provider : void 0;
		const modelOverride = allowModelOverride ? request.model : void 0;
		const cfg = context.getRuntimeConfig();
		const idem = request.idempotencyKey;
		const runId = idem;
		const lifecycleGeneration = getAgentEventLifecycleGeneration();
		const execApprovalFollowupApprovalId = parseExecApprovalFollowupApprovalId(idem);
		if (execApprovalFollowupApprovalId && !canUseInternalRuntimeHandoff) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approval followup idempotency keys are reserved for backend callers."));
			return;
		}
		const normalizedSpawned = normalizeSpawnedRunMetadata({
			groupId: request.groupId,
			groupChannel: request.groupChannel,
			groupSpace: request.groupSpace
		});
		let resolvedGroupId = normalizedSpawned.groupId;
		let resolvedGroupChannel = normalizedSpawned.groupChannel;
		let resolvedGroupSpace = normalizedSpawned.groupSpace;
		let spawnedByValue;
		const inputProvenance = normalizeInputProvenance(request.inputProvenance);
		const preserveUserFacingSessionModelState = canUseInternalRuntimeHandoff && shouldPreserveUserFacingSessionStateForInputProvenance(inputProvenance);
		const sessionEffects = requestedInternalSessionEffects ? "internal" : request.sessionEffects;
		const suppressVisibleSessionEffects = sessionEffects === "internal";
		const agentDedupeKeys = resolveAgentDedupeKeys({
			idempotencyKey: idem,
			execApprovalFollowupApprovalId
		});
		const cached = readGatewayDedupeEntry({
			dedupe: context.dedupe,
			keys: agentDedupeKeys
		});
		if (cached) {
			if (cached.ok && isAcceptedAgentDedupePayload(cached.payload)) {
				const cachedRunId = typeof cached.payload.runId === "string" && cached.payload.runId.trim() ? cached.payload.runId.trim() : runId;
				const cachedSessionKey = typeof cached.payload.sessionKey === "string" && cached.payload.sessionKey.trim() ? cached.payload.sessionKey.trim() : void 0;
				const cachedAgentId = cachedSessionKey === "global" && typeof cached.payload.agentId === "string" && cached.payload.agentId.trim() ? cached.payload.agentId.trim() : void 0;
				respond(true, {
					runId: cachedRunId,
					status: "in_flight",
					...cachedSessionKey ? { sessionKey: cachedSessionKey } : {},
					...cachedAgentId ? { agentId: cachedAgentId } : {}
				}, void 0, {
					cached: true,
					runId: cachedRunId
				});
				return;
			}
			respond(cached.ok, cached.payload, cached.error, { cached: true });
			return;
		}
		let agentDedupeReserved = false;
		let agentRunAccepted = false;
		let committedResetCompletion;
		const ownerConnId = typeof client?.connId === "string" ? client.connId : void 0;
		const ownerDeviceId = typeof client?.connect?.device?.id === "string" ? client.connect.device.id : void 0;
		const reservePreAcceptedAgentDedupe = (sessionKey, dedupeAgentId) => {
			if (agentDedupeReserved || !sessionKey) return;
			const dedupeSessionResolvesGlobal = resolveSessionStoreKey({
				cfg,
				sessionKey
			}) === "global";
			const acceptedAt = Date.now();
			const pendingTimeoutMs = resolveAgentTimeoutMs({
				cfg,
				overrideSeconds: typeof request.timeout === "number" ? request.timeout : void 0
			});
			setGatewayDedupeEntries({
				dedupe: context.dedupe,
				keys: agentDedupeKeys,
				entry: {
					ts: acceptedAt,
					ok: true,
					payload: {
						runId,
						status: "accepted",
						sessionKey,
						...dedupeSessionResolvesGlobal && dedupeAgentId ? { agentId: dedupeAgentId } : {},
						controlUiVisible: !suppressVisibleSessionEffects,
						acceptedAt,
						dedupeKeys: agentDedupeKeys,
						expiresAtMs: resolveAgentRunExpiresAtMs({
							now: acceptedAt,
							timeoutMs: pendingTimeoutMs
						}),
						ownerConnId,
						ownerDeviceId
					}
				}
			});
			agentDedupeReserved = true;
		};
		const clearUnacceptedExecApprovalFollowupDedupe = () => {
			if (!agentDedupeReserved || agentRunAccepted) return;
			if (isPreRegistrationAbortedAgentDedupeEntryForSession({
				entry: readGatewayDedupeEntry({
					dedupe: context.dedupe,
					keys: agentDedupeKeys
				}),
				runId
			})) return;
			deleteGatewayDedupeEntries({
				dedupe: context.dedupe,
				keys: agentDedupeKeys
			});
			agentDedupeReserved = false;
		};
		const abortForLifecycleRotation = (target) => {
			if (lifecycleGeneration === getAgentEventLifecycleGeneration()) return false;
			if (committedResetCompletion) {
				const completion = committedResetCompletion;
				const responsePayload = buildBareSessionResetResponse({
					runId,
					result: buildBareSessionResetResult({
						reason: completion.reason,
						sessionId: completion.sessionId,
						ackText: completion.followUpPending ? `${sessionResetAckText(completion.reason)} Gateway restarted before the follow-up ran; send the follow-up message again.` : void 0
					})
				});
				agentRunAccepted = true;
				setGatewayDedupeEntries({
					dedupe: context.dedupe,
					keys: agentDedupeKeys,
					entry: {
						ts: Date.now(),
						ok: true,
						payload: responsePayload
					}
				});
				respond(true, responsePayload, void 0, { runId });
				emitSessionsChanged(context, {
					sessionKey: completion.sessionKey,
					...completion.sessionKey === "global" && completion.agentId ? { agentId: completion.agentId } : {},
					reason: completion.reason
				});
				return true;
			}
			const stopReason = AGENT_RUN_RESTART_ABORT_STOP_REASON;
			agentRunAccepted = true;
			setAbortedAgentDedupeEntries({
				dedupe: context.dedupe,
				keys: agentDedupeKeys,
				agentId: target?.agentId,
				sessionKey: target?.sessionKey,
				runId,
				stopReason
			});
			respond(true, {
				runId,
				status: "timeout",
				summary: "aborted",
				stopReason,
				timeoutPhase: "queue",
				providerStarted: false
			}, void 0, { runId });
			return true;
		};
		const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(request.attachments);
		const requestedBestEffortDeliver = typeof request.bestEffortDeliver === "boolean" ? request.bestEffortDeliver : void 0;
		const knownAgents = listAgentIds(cfg);
		const agentIdRaw = normalizeOptionalString(request.agentId) ?? "";
		let agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
		if (agentId && !knownAgents.includes(agentId)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent params: unknown agent id "${request.agentId}"`));
			return;
		}
		const requestedSessionKeyParam = normalizeOptionalString(request.sessionKey);
		const requestedSessionId = normalizeOptionalString(request.sessionId);
		const requestedToRaw = normalizeOptionalString(request.to);
		const sessionKeyFromTo = !requestedSessionKeyParam && !requestedSessionId && classifySessionKeyShape(requestedToRaw) === "agent" ? requestedToRaw : void 0;
		const requestedSessionKeyRaw = requestedSessionKeyParam ?? sessionKeyFromTo;
		if (requestedSessionKeyRaw && classifySessionKeyShape(requestedSessionKeyRaw) === "malformed_agent") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent params: malformed session key "${requestedSessionKeyRaw}"`));
			return;
		}
		if (!agentId && requestedSessionKeyRaw) {
			const parsed = parseAgentSessionKey(requestedSessionKeyRaw);
			const inferredAgentId = parsed && resolveSessionStoreKey({
				cfg,
				sessionKey: requestedSessionKeyRaw
			}) === "global" ? normalizeAgentId(parsed.agentId) : void 0;
			if (inferredAgentId) {
				if (!knownAgents.includes(inferredAgentId)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent params: unknown agent id "${parsed?.agentId}"`));
					return;
				}
				agentId = inferredAgentId;
			}
		}
		if (execApprovalFollowupApprovalId && requestedSessionKeyRaw) {
			const expectedSessionId = normalizeOptionalString(request.execApprovalFollowupExpectedSessionId);
			let currentSessionId;
			try {
				currentSessionId = normalizeOptionalString(loadSessionEntry(requestedSessionKeyRaw).entry?.sessionId);
			} catch {
				currentSessionId = void 0;
			}
			if (isExecApprovalFollowupSessionRebound({
				expectedSessionId,
				resolvedSessionId: currentSessionId
			})) {
				context.logGateway.info(`Dropping stale exec approval followup ${execApprovalFollowupApprovalId}: session ${requestedSessionKeyRaw} rebound (expected ${expectedSessionId}, current ${currentSessionId}) before the approval resolved`);
				const droppedPayload = {
					runId,
					status: "ok",
					summary: "exec approval followup dropped: session was reset before the approval resolved"
				};
				setGatewayDedupeEntries({
					dedupe: context.dedupe,
					keys: agentDedupeKeys,
					entry: {
						ts: Date.now(),
						ok: true,
						payload: droppedPayload
					}
				});
				respond(true, droppedPayload, void 0, { runId });
				return;
			}
		}
		let requestedSessionKey = requestedSessionKeyRaw ?? (!requestedSessionId ? resolveExplicitAgentSessionKey({
			cfg,
			agentId
		}) : void 0);
		if (agentId && requestedSessionKeyRaw) {
			const parsedRequestedSessionKey = parseAgentSessionKey(requestedSessionKeyRaw);
			const requestedCanonicalKey = resolveSessionStoreKey({
				cfg,
				sessionKey: requestedSessionKeyRaw
			});
			const sessionAgentId = parsedRequestedSessionKey?.agentId ? normalizeAgentId(parsedRequestedSessionKey.agentId) : requestedCanonicalKey === "global" ? agentId : resolveAgentIdFromSessionKey(requestedSessionKeyRaw);
			if (sessionAgentId !== agentId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent params: agent "${request.agentId}" does not match session key agent "${sessionAgentId}"`));
				return;
			}
		}
		const preAcceptedReservedSessionKey = requestedSessionKey && resolveSessionStoreKey({
			cfg,
			sessionKey: requestedSessionKey
		}) === "global" ? "global" : requestedSessionKey;
		reservePreAcceptedAgentDedupe(preAcceptedReservedSessionKey, agentId);
		try {
			let message = (request.message ?? "").trim();
			if (!isRawModelRun) message = annotateInterSessionPromptText(message, inputProvenance);
			let images = [];
			let imageOrder = [];
			if (normalizedAttachments.length > 0) {
				let baseProvider;
				let baseModel;
				let requestedAcpMeta;
				if (requestedSessionKeyRaw) {
					const { cfg: sessCfg, entry: sessEntry, canonicalKey: sessCanonicalKey } = loadSessionEntry(requestedSessionKeyRaw, {
						...agentId ? { agentId } : {},
						clone: false
					});
					const modelRef = resolveSessionModelRef(sessCfg, sessEntry, sessCanonicalKey === "global" && agentId ? agentId : resolveAgentIdFromSessionKey(sessCanonicalKey));
					baseProvider = modelRef.provider;
					baseModel = modelRef.model;
					requestedAcpMeta = readAcpSessionMeta({ sessionKey: sessCanonicalKey });
				}
				const effectiveProvider = providerOverride || baseProvider;
				const effectiveModel = modelOverride || baseModel;
				const supportsInlineImages = request.acpTurnSource === "manual_spawn" && isAcpSessionKey(requestedSessionKeyRaw) && requestedAcpMeta != null ? true : await resolveGatewayModelSupportsImages({
					loadGatewayModelCatalog: context.loadGatewayModelCatalog,
					provider: effectiveProvider,
					model: effectiveModel
				});
				try {
					const parsed = await parseMessageWithAttachments(message, normalizedAttachments, {
						maxBytes: resolveChatAttachmentMaxBytes(cfg),
						log: context.logGateway,
						supportsInlineImages,
						acceptNonImage: false
					});
					message = parsed.message.trim();
					images = parsed.images;
					imageOrder = parsed.imageOrder;
				} catch (err) {
					logAttachmentFailure(context.logGateway, "agent attachment parse failed", err);
					respond(false, void 0, errorShape(err instanceof MediaOffloadError ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, String(err)));
					return;
				}
			}
			const isKnownGatewayChannel = (value) => isGatewayMessageChannel(value) || isInternalNonDeliveryChannel(value);
			const channelHints = normalizeStringEntries([request.channel, request.replyChannel].filter((value) => typeof value === "string"));
			for (const rawChannel of channelHints) {
				const normalized = normalizeMessageChannel(rawChannel);
				if (normalized && normalized !== "last" && !isKnownGatewayChannel(normalized)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent params: unknown channel: ${normalized}`));
					return;
				}
			}
			const voiceWakeTrigger = normalizeOptionalString(request.voiceWakeTrigger) ?? "";
			const replyTo = normalizeOptionalString(request.replyTo) ?? "";
			const to = sessionKeyFromTo ? "" : requestedToRaw ?? "";
			const explicitVoiceWakeSessionTarget = !agentId && requestedSessionKeyRaw ? (() => {
				const { cfg: sessionCfg, canonicalKey } = loadSessionEntry(requestedSessionKeyRaw, { clone: false });
				const routedAgentId = resolveAgentIdFromSessionKey(canonicalKey);
				if (routedAgentId !== normalizeAgentId(resolveDefaultAgentId(sessionCfg))) return true;
				return canonicalKey !== resolveAgentMainSessionKey({
					cfg: sessionCfg,
					agentId: routedAgentId
				});
			})() : false;
			const canAutoRouteVoiceWake = !agentId && !explicitVoiceWakeSessionTarget && !requestedSessionId && !replyTo && !to;
			if (Object.hasOwn(request, "voiceWakeTrigger") && canAutoRouteVoiceWake) try {
				const routingConfig = await loadVoiceWakeRoutingConfig();
				const route = resolveVoiceWakeRouteByTrigger({
					trigger: voiceWakeTrigger || void 0,
					config: routingConfig
				});
				if ("agentId" in route) if (knownAgents.includes(route.agentId)) {
					agentId = route.agentId;
					requestedSessionKey = resolveExplicitAgentSessionKey({
						cfg,
						agentId
					});
				} else context.logGateway.warn(`voicewake routing ignored unknown agentId="${route.agentId}" trigger="${voiceWakeTrigger}"`);
				else if ("sessionKey" in route) if (classifySessionKeyShape(route.sessionKey) !== "malformed_agent") {
					const canonicalRouteSession = loadSessionEntry(route.sessionKey, { clone: false }).canonicalKey;
					const routedAgentId = resolveAgentIdFromSessionKey(canonicalRouteSession);
					if (knownAgents.includes(routedAgentId)) {
						requestedSessionKey = canonicalRouteSession;
						agentId = routedAgentId;
					} else context.logGateway.warn(`voicewake routing ignored unknown session agent="${routedAgentId}" sessionKey="${canonicalRouteSession}" trigger="${voiceWakeTrigger}"`);
				} else context.logGateway.warn(`voicewake routing ignored malformed sessionKey="${route.sessionKey}" trigger="${voiceWakeTrigger}"`);
			} catch (err) {
				context.logGateway.warn(`voicewake routing load failed: ${formatForLog(err)}`);
			}
			let resolvedSessionId = requestedSessionId;
			let sessionEntry;
			let bestEffortDeliver = requestedBestEffortDeliver ?? false;
			let cfgForAgent;
			let resolvedSessionKey = requestedSessionKey;
			let resolvedSessionAgentId;
			let isNewSession = false;
			let skipAgentInitialSessionTouch = false;
			let pendingChatRun;
			const resetCommandMatch = message.match(RESET_COMMAND_RE);
			if (resetCommandMatch && requestedSessionKey) {
				if (abortForLifecycleRotation({
					sessionKey: requestedSessionKey,
					agentId
				})) return;
				const postResetMessage = normalizeOptionalString(resetCommandMatch[2]) ?? "";
				if (!clientHasAdminScope(client)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `missing scope: ${ADMIN_SCOPE}`));
					return;
				}
				const resetReason = normalizeOptionalLowercaseString(resetCommandMatch[1]) === "new" ? "new" : "reset";
				let resetResult;
				try {
					resetResult = await runSessionResetFromAgent({
						key: requestedSessionKey,
						...requestedSessionKey === "global" && agentId ? { agentId } : {},
						reason: resetReason,
						assertCurrent: () => assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration),
						onCommitted: (commit) => {
							committedResetCompletion = {
								reason: resetReason,
								sessionId: commit.sessionId,
								sessionKey: commit.key,
								agentId,
								followUpPending: Boolean(postResetMessage)
							};
						}
					});
				} catch (err) {
					if (abortForLifecycleRotation({
						sessionKey: requestedSessionKey,
						agentId
					})) return;
					throw err;
				}
				if (!resetResult.ok) {
					respond(false, void 0, resetResult.error);
					return;
				}
				requestedSessionKey = resetResult.key;
				resolvedSessionId = resetResult.sessionId ?? resolvedSessionId;
				committedResetCompletion = {
					reason: resetReason,
					sessionId: resetResult.sessionId,
					sessionKey: resetResult.key,
					agentId,
					followUpPending: Boolean(postResetMessage)
				};
				if (postResetMessage) {
					if (abortForLifecycleRotation({
						sessionKey: resetResult.key,
						agentId
					})) return;
					message = postResetMessage;
				} else {
					let resetAckResult;
					try {
						const deliverySession = request.deliver === true ? loadBareSessionResetDeliverySession({
							cfg,
							sessionKey: resetResult.key,
							...agentId ? { agentId } : {}
						}) : void 0;
						resetAckResult = await resolveBareSessionResetResult({
							cfg: deliverySession?.cfg ?? cfg,
							context,
							reason: resetReason,
							sessionId: resetResult.sessionId,
							sessionKey: resetResult.key,
							agentId: deliverySession?.agentId ?? agentId,
							sessionEntry: deliverySession?.entry,
							request: sessionKeyFromTo ? {
								...request,
								to: void 0
							} : request,
							runId,
							assertCurrent: () => assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration)
						});
					} catch (err) {
						if (abortForLifecycleRotation({
							sessionKey: resetResult.key,
							agentId
						})) return;
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
						return;
					}
					const responsePayload = buildBareSessionResetResponse({
						runId,
						result: resetAckResult
					});
					agentRunAccepted = true;
					setGatewayDedupeEntries({
						dedupe: context.dedupe,
						keys: agentDedupeKeys,
						entry: {
							ts: Date.now(),
							ok: true,
							payload: responsePayload
						}
					});
					respond(true, responsePayload, void 0, { runId });
					emitSessionsChanged(context, {
						sessionKey: resetResult.key,
						...resetResult.key === "global" && agentId ? { agentId } : {},
						reason: resetReason
					});
					return;
				}
			}
			if (requestedSessionKey) {
				const sessionLoadOptions = {
					...agentId ? { agentId } : {},
					clone: false
				};
				const { cfg: cfgLocal, storePath, entry, canonicalKey } = loadSessionEntry(requestedSessionKey, sessionLoadOptions);
				cfgForAgent = cfgLocal;
				const sessionMaintenanceConfig = resolveMaintenanceConfigFromInput(cfgLocal.session?.maintenance);
				const canonicalSessionAgentId = canonicalKey === "global" ? agentId ?? resolveDefaultAgentId(cfgLocal) : resolveAgentIdFromSessionKey(canonicalKey);
				const now = Date.now();
				const resetPolicy = resolveSessionResetPolicy({
					sessionCfg: cfgLocal.session,
					resetType: resolveSessionResetType({ sessionKey: canonicalKey }),
					resetOverride: resolveChannelResetConfig({
						sessionCfg: cfgLocal.session,
						channel: entry?.lastChannel ?? entry?.channel ?? request.channel
					})
				});
				const lifecycleTimestamps = entry ? resolveSessionLifecycleTimestamps({
					entry,
					storePath,
					agentId: canonicalSessionAgentId
				}) : void 0;
				let freshness = entry ? evaluateSessionFreshness({
					updatedAt: entry.updatedAt,
					...lifecycleTimestamps,
					now,
					policy: resetPolicy
				}) : void 0;
				const resolveFailedSessionTranscriptMissingForEntry = (candidateEntry) => {
					if (candidateEntry?.status !== "failed" || !candidateEntry.sessionId?.trim()) return false;
					try {
						const sessionPathOpts = resolveSessionFilePathOptions({
							storePath,
							agentId: canonicalSessionAgentId
						});
						return !existsSync(resolveSessionFilePath(candidateEntry.sessionId, candidateEntry, sessionPathOpts));
					} catch {
						return true;
					}
				};
				const failedSessionTranscriptMissing = resolveFailedSessionTranscriptMissingForEntry(entry);
				const mainSessionKeyForRequest = resolveAgentMainSessionKey({
					cfg: cfgLocal,
					agentId: canonicalSessionAgentId
				});
				const isSystemGatewayRun = request.bootstrapContextRunKind === "cron" || request.bootstrapContextRunKind === "heartbeat";
				const requestedSessionMatchesEntry = Boolean(requestedSessionId && entry?.sessionId?.trim() === requestedSessionId);
				const terminalMainTranscriptNewerThanRegistry = (isSystemGatewayRun || requestedSessionMatchesEntry ? void 0 : resolveTerminalMainSessionTranscriptRegistryCheck({
					entry,
					sessionScope: cfgLocal.session?.scope,
					sessionKey: canonicalKey,
					agentId: canonicalSessionAgentId,
					mainKey: cfgLocal.session?.mainKey,
					storePath
				})) ? hasTerminalMainSessionTranscriptNewerThanRegistrySync({
					entry,
					sessionScope: cfgLocal.session?.scope,
					sessionKey: canonicalKey,
					agentId: canonicalSessionAgentId,
					mainKey: cfgLocal.session?.mainKey,
					storePath
				}) : false;
				const canReuseSession = Boolean(entry?.sessionId) && (freshness?.fresh ?? false) && !failedSessionTranscriptMissing && !terminalMainTranscriptNewerThanRegistry;
				let usableRequestedSessionId = requestedSessionId && (!entry?.sessionId || canReuseSession) ? requestedSessionId : void 0;
				const sessionId = usableRequestedSessionId ? usableRequestedSessionId : (canReuseSession ? entry?.sessionId : void 0) ?? randomUUID();
				isNewSession = !entry || !canReuseSession && !usableRequestedSessionId || Boolean(usableRequestedSessionId && entry?.sessionId !== usableRequestedSessionId);
				let rotatedSessionId = Boolean(entry?.sessionId && entry.sessionId !== sessionId);
				const touchInteraction = !isSystemGatewayRun && !request.internalEvents?.length;
				const sessionAgent = canonicalSessionAgentId;
				const requestDeliveryHint = normalizeDeliveryContext({
					channel: request.channel?.trim(),
					to,
					accountId: request.accountId?.trim(),
					threadId: request.threadId
				});
				const buildSessionPatch = (freshEntry) => {
					const freshSpawnedBy = canonicalizeSpawnedByForAgent(cfgLocal, sessionAgent, freshEntry?.spawnedBy);
					const storedGroup = normalizeTrustedGroupMetadata(freshEntry);
					let inheritedGroup;
					if (freshSpawnedBy && (!storedGroup.groupId || !storedGroup.groupChannel || !storedGroup.groupSpace)) try {
						const parentEntry = loadSessionEntry(freshSpawnedBy)?.entry;
						inheritedGroup = normalizeTrustedGroupMetadata({
							groupId: parentEntry?.groupId,
							groupChannel: parentEntry?.groupChannel,
							groupSpace: parentEntry?.space
						});
					} catch {
						inheritedGroup = void 0;
					}
					const trustedGroup = resolveTrustedGroupMetadata({
						sessionKey: canonicalKey,
						spawnedBy: freshSpawnedBy,
						stored: storedGroup,
						inherited: inheritedGroup
					});
					const nextGroup = (trustedGroup.groupId ? resolveTrustedGroupId({
						groupId: trustedGroup.groupId,
						sessionKey: canonicalKey,
						spawnedBy: freshSpawnedBy
					}) : void 0)?.dropped === true ? {
						groupId: void 0,
						groupChannel: void 0,
						groupSpace: void 0
					} : (() => {
						const trustRequestSelectors = Boolean(trustedGroup.groupId) && requestGroupMatchesTrusted({
							requestGroupId: normalizedSpawned.groupId,
							trustedGroupId: trustedGroup.groupId
						});
						return {
							groupId: trustedGroup.groupId,
							groupChannel: trustedGroup.groupChannel ?? (trustRequestSelectors ? normalizedSpawned.groupChannel : void 0),
							groupSpace: trustedGroup.groupSpace ?? (trustRequestSelectors ? normalizedSpawned.groupSpace : void 0)
						};
					})();
					const deliveryFields = normalizeSessionDeliveryFields(freshEntry);
					const effectiveDelivery = mergeDeliveryContext(deliveryFields.deliveryContext, requestDeliveryHint);
					const effectiveDeliveryFields = normalizeSessionDeliveryFields({
						route: deliveryFields.route,
						deliveryContext: effectiveDelivery
					});
					const labelValue = normalizeOptionalString(request.label) || freshEntry?.label;
					const channelValue = freshEntry?.channel ?? request.channel?.trim();
					const pluginOwnerId = freshEntry === void 0 ? normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId) : void 0;
					const freshSessionRotatedSinceLoad = Boolean(entry?.sessionId && freshEntry?.sessionId && freshEntry.sessionId !== entry.sessionId);
					const freshLifecycleTimestamps = freshEntry ? resolveSessionLifecycleTimestamps({
						entry: freshEntry,
						storePath,
						agentId: sessionAgent
					}) : void 0;
					const freshFreshness = freshEntry ? evaluateSessionFreshness({
						updatedAt: freshEntry.updatedAt,
						...freshLifecycleTimestamps,
						now,
						policy: resetPolicy
					}) : void 0;
					const freshRequestedSessionMatchesEntry = Boolean(requestedSessionId && freshEntry?.sessionId?.trim() === requestedSessionId);
					const freshTerminalMainTranscriptNewerThanRegistry = isSystemGatewayRun || freshRequestedSessionMatchesEntry ? false : hasTerminalMainSessionTranscriptNewerThanRegistrySync({
						entry: freshEntry,
						sessionScope: cfgLocal.session?.scope,
						sessionKey: canonicalKey,
						agentId: sessionAgent,
						mainKey: cfgLocal.session?.mainKey,
						storePath
					});
					const freshFailedSessionTranscriptMissing = resolveFailedSessionTranscriptMissingForEntry(freshEntry);
					const freshCanReuseSession = Boolean(freshEntry?.sessionId) && (freshFreshness?.fresh ?? false) && !freshFailedSessionTranscriptMissing && !freshTerminalMainTranscriptNewerThanRegistry;
					const freshUsableRequestedSessionId = requestedSessionId && (!freshEntry?.sessionId || freshCanReuseSession) ? requestedSessionId : void 0;
					const freshSessionId = freshUsableRequestedSessionId ? freshUsableRequestedSessionId : (freshCanReuseSession ? freshEntry?.sessionId : void 0) ?? sessionId;
					const freshIsNewSession = !freshEntry || !freshCanReuseSession && !freshUsableRequestedSessionId || Boolean(freshUsableRequestedSessionId && freshEntry?.sessionId !== freshUsableRequestedSessionId);
					const freshRotatedSessionId = Boolean(freshEntry?.sessionId && freshEntry.sessionId !== freshSessionId);
					const patchSessionId = freshSessionRotatedSinceLoad ? freshEntry?.sessionId : freshSessionId;
					const shouldClearRotatedState = freshRotatedSessionId && !freshSessionRotatedSinceLoad;
					const patch = {
						sessionId: patchSessionId,
						updatedAt: now,
						...freshIsNewSession && !freshSessionRotatedSinceLoad ? { sessionStartedAt: now } : {},
						...touchInteraction ? { lastInteractionAt: now } : {},
						...effectiveDeliveryFields.route ? { route: effectiveDeliveryFields.route } : {},
						...effectiveDeliveryFields.deliveryContext ? { deliveryContext: effectiveDeliveryFields.deliveryContext } : {},
						...effectiveDeliveryFields.lastChannel ? { lastChannel: effectiveDeliveryFields.lastChannel } : {},
						...effectiveDeliveryFields.lastTo ? { lastTo: effectiveDeliveryFields.lastTo } : {},
						...effectiveDeliveryFields.lastAccountId ? { lastAccountId: effectiveDeliveryFields.lastAccountId } : {},
						...effectiveDeliveryFields.lastThreadId != null ? { lastThreadId: effectiveDeliveryFields.lastThreadId } : {},
						...labelValue ? { label: labelValue } : {},
						...freshSpawnedBy ? { spawnedBy: freshSpawnedBy } : {},
						...channelValue ? { channel: channelValue } : {},
						groupId: nextGroup.groupId,
						groupChannel: nextGroup.groupChannel,
						space: nextGroup.groupSpace,
						...pluginOwnerId ? { pluginOwnerId } : {},
						...shouldClearRotatedState ? {
							status: void 0,
							startedAt: void 0,
							endedAt: void 0,
							runtimeMs: void 0,
							abortedLastRun: void 0,
							sessionFile: void 0
						} : {}
					};
					if (shouldClearRotatedState) clearAllCliSessions(patch);
					return {
						patch,
						spawnedBy: freshSpawnedBy,
						groupId: nextGroup.groupId,
						groupChannel: nextGroup.groupChannel,
						groupSpace: nextGroup.groupSpace,
						freshSessionRotatedSinceLoad,
						isNewSession: freshIsNewSession,
						rotatedSessionId: freshRotatedSessionId,
						usableRequestedSessionId: freshUsableRequestedSessionId,
						freshness: freshFreshness
					};
				};
				let patchBuild = buildSessionPatch(entry);
				isNewSession = patchBuild.isNewSession;
				rotatedSessionId = patchBuild.rotatedSessionId;
				usableRequestedSessionId = patchBuild.usableRequestedSessionId;
				freshness = patchBuild.freshness;
				sessionEntry = mergeSessionEntry(entry, patchBuild.patch);
				resolvedSessionId = sessionEntry?.sessionId ?? sessionId;
				const canonicalSessionKey = canonicalKey;
				resolvedSessionKey = canonicalSessionKey;
				const sessionAgentId = canonicalSessionAgentId;
				resolvedSessionAgentId = sessionAgentId;
				const mainSessionKey = mainSessionKeyForRequest;
				const recoveredSessionStartedAt = !isNewSession && entry !== void 0 && entry.sessionStartedAt === void 0 ? resolveSessionLifecycleTimestamps({
					entry,
					storePath,
					agentId: sessionAgentId
				}).sessionStartedAt : void 0;
				if (storePath && !suppressVisibleSessionEffects) {
					if (abortForLifecycleRotation({
						sessionKey: canonicalSessionKey,
						agentId
					})) return;
					const requestedStoreKey = requestedSessionKey;
					let deniedBySendPolicy = false;
					let singleEntryPersistence;
					let persisted;
					try {
						persisted = await updateSessionStore(storePath, (store) => {
							assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
							const storeKeysBeforeMigration = new Set(Object.keys(store));
							const preMigrationTarget = resolveGatewaySessionStoreTarget({
								cfg: cfgLocal,
								key: requestedStoreKey,
								store,
								...sessionAgentId ? { agentId: sessionAgentId } : {}
							});
							const hadLegacyStoreKey = preMigrationTarget.storeKeys.some((storeKey) => storeKey !== preMigrationTarget.canonicalKey && Object.hasOwn(store, storeKey));
							const { target, primaryKey } = migrateAndPruneGatewaySessionStoreKey({
								cfg: cfgLocal,
								key: requestedStoreKey,
								store
							});
							const prunedStoreKey = [...storeKeysBeforeMigration].some((storeKey) => !Object.hasOwn(store, storeKey));
							const freshEntry = store[primaryKey];
							patchBuild = buildSessionPatch(freshEntry);
							const merged = mergeSessionEntry(freshEntry, recoveredSessionStartedAt !== void 0 && freshEntry?.sessionStartedAt === void 0 && freshEntry?.sessionId === entry?.sessionId ? {
								...patchBuild.patch,
								sessionStartedAt: recoveredSessionStartedAt
							} : patchBuild.patch);
							if ((request.deliver === true ? resolveSendPolicy({
								cfg: cfgLocal,
								entry: merged,
								sessionKey: canonicalKey,
								channel: merged?.channel,
								chatType: merged?.chatType
							}) : "allow") === "deny") {
								deniedBySendPolicy = true;
								return merged;
							}
							store[primaryKey] = merged;
							const canonicalKeyChanged = target.canonicalKey !== preMigrationTarget.canonicalKey;
							singleEntryPersistence = freshEntry && !hadLegacyStoreKey && !canonicalKeyChanged && !prunedStoreKey ? {
								sessionKey: primaryKey,
								entry: merged
							} : void 0;
							return merged;
						}, {
							takeCacheOwnership: true,
							maintenanceConfig: sessionMaintenanceConfig,
							resolveSingleEntryPersistence: () => singleEntryPersistence
						});
					} catch (err) {
						if (abortForLifecycleRotation({
							sessionKey: canonicalSessionKey,
							agentId
						})) return;
						throw err;
					}
					if (abortForLifecycleRotation({
						sessionKey: canonicalSessionKey,
						agentId
					})) return;
					if (persisted) {
						sessionEntry = persisted;
						resolvedSessionId = sessionEntry.sessionId;
					}
					skipAgentInitialSessionTouch = touchInteraction;
					if (deniedBySendPolicy) {
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "send blocked by session policy"));
						return;
					}
				}
				isNewSession = patchBuild.isNewSession;
				rotatedSessionId = patchBuild.rotatedSessionId;
				usableRequestedSessionId = patchBuild.usableRequestedSessionId;
				freshness = patchBuild.freshness;
				spawnedByValue = patchBuild.spawnedBy;
				resolvedGroupId = patchBuild.groupId;
				resolvedGroupChannel = patchBuild.groupChannel;
				resolvedGroupSpace = patchBuild.groupSpace;
				if (!suppressVisibleSessionEffects && isNewSession && resolvedSessionId && storePath && !patchBuild.freshSessionRotatedSinceLoad) {
					const previousSessionId = rotatedSessionId ? entry?.sessionId : void 0;
					emitAgentSendSessionLifecycleTransition({
						cfg: cfgLocal,
						sessionKey: canonicalSessionKey,
						sessionId: resolvedSessionId,
						storePath,
						sessionFile: sessionEntry?.sessionFile,
						agentId: sessionAgentId,
						previousSessionId,
						previousSessionFile: previousSessionId ? entry?.sessionFile : void 0,
						previousEndReason: previousSessionId ? freshness?.staleReason ?? (usableRequestedSessionId && entry?.sessionId !== usableRequestedSessionId ? "new" : "unknown") : void 0
					});
				}
				if (request.deliver === true) {
					if (resolveSendPolicy({
						cfg: cfgLocal,
						entry: sessionEntry,
						sessionKey: canonicalKey,
						channel: sessionEntry?.channel,
						chatType: sessionEntry?.chatType
					}) === "deny") {
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "send blocked by session policy"));
						return;
					}
				}
				if (!suppressVisibleSessionEffects && (canonicalSessionKey === mainSessionKey || canonicalSessionKey === "global")) {
					const selectedGlobalAgentId = canonicalSessionKey === "global" ? sessionAgentId : void 0;
					pendingChatRun = {
						sessionKey: canonicalSessionKey,
						...selectedGlobalAgentId ? { agentId: selectedGlobalAgentId } : {}
					};
					if (requestedBestEffortDeliver === void 0) bestEffortDeliver = true;
				}
			}
			const activeSessionAgentId = resolvedSessionKey === "global" && resolvedSessionAgentId ? resolvedSessionAgentId : resolvedSessionKey ? resolveAgentIdFromSessionKey(resolvedSessionKey) : agentId ?? resolveDefaultAgentId(cfgForAgent ?? cfg);
			const connId = typeof client?.connId === "string" ? client.connId : void 0;
			const wantsToolEvents = hasGatewayClientCap(client?.connect?.caps, GATEWAY_CLIENT_CAPS.TOOL_EVENTS);
			if (connId && wantsToolEvents) {
				context.registerToolEventRecipient(runId, connId);
				for (const [activeRunId, active] of context.chatAbortControllers) {
					const sameSession = active.sessionKey === resolvedSessionKey;
					const sameSelectedGlobalAgent = resolvedSessionKey === "global" ? active.agentId === activeSessionAgentId : true;
					if (activeRunId !== runId && sameSession && sameSelectedGlobalAgent) context.registerToolEventRecipient(activeRunId, connId);
				}
			}
			const wantsDelivery = request.deliver === true;
			const explicitTo = replyTo || to || void 0;
			const explicitThreadId = normalizeOptionalString(request.threadId);
			const turnSourceChannel = normalizeOptionalString(request.channel);
			const turnSourceTo = to || void 0;
			const turnSourceAccountId = normalizeOptionalString(request.accountId);
			const deliveryPlan = await resolveAgentDeliveryPlanWithSessionRoute({
				cfg: cfgForAgent ?? cfg,
				agentId: activeSessionAgentId,
				currentSessionKey: resolvedSessionKey,
				sessionEntry,
				requestedChannel: request.replyChannel ?? request.channel,
				explicitTo,
				explicitThreadId,
				accountId: request.replyAccountId ?? request.accountId,
				wantsDelivery,
				turnSourceChannel,
				turnSourceTo,
				turnSourceAccountId,
				turnSourceThreadId: explicitThreadId
			});
			let resolvedChannel = deliveryPlan.resolvedChannel;
			let deliveryTargetMode = deliveryPlan.deliveryTargetMode;
			const resolvedAccountId = deliveryPlan.resolvedAccountId;
			let resolvedTo = deliveryPlan.resolvedTo;
			let effectivePlan = deliveryPlan;
			let deliveryDowngradeReason = null;
			let deliveryTargetResolutionError;
			if (wantsDelivery && resolvedChannel === "webchat") {
				const cfgResolved = cfgForAgent ?? cfg;
				try {
					resolvedChannel = (await resolveMessageChannelSelection({ cfg: cfgResolved })).channel;
					deliveryTargetMode = deliveryTargetMode ?? "implicit";
					effectivePlan = {
						...deliveryPlan,
						resolvedChannel,
						deliveryTargetMode,
						resolvedAccountId
					};
				} catch (err) {
					if (!shouldDowngradeDeliveryToSessionOnly({
						wantsDelivery,
						bestEffortDeliver,
						resolvedChannel
					})) {
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
						return;
					}
					deliveryDowngradeReason = String(err);
				}
			}
			if (!resolvedTo && isDeliverableMessageChannel(resolvedChannel)) {
				const fallback = resolveAgentOutboundTarget({
					cfg: cfgForAgent ?? cfg,
					plan: effectivePlan,
					targetMode: deliveryTargetMode ?? "implicit",
					validateExplicitTarget: false
				});
				if (fallback.resolvedTarget?.ok) resolvedTo = fallback.resolvedTo;
				else if (fallback.resolvedTarget && !fallback.resolvedTarget.ok) deliveryTargetResolutionError = fallback.resolvedTarget.error;
			}
			if (wantsDelivery && isDeliverableMessageChannel(resolvedChannel) && !resolvedTo) {
				if (!bestEffortDeliver) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, deliveryTargetResolutionError ? String(deliveryTargetResolutionError) : `delivery target is required for ${resolvedChannel}: pass --to/--reply-to or configure a default target`));
					return;
				}
				context.logGateway.info(deliveryTargetResolutionError ? `agent delivery target missing (bestEffortDeliver): ${String(deliveryTargetResolutionError)}` : "agent delivery target missing (bestEffortDeliver): no deliverable target");
			}
			if (wantsDelivery && resolvedChannel === "webchat") {
				if (!shouldDowngradeDeliveryToSessionOnly({
					wantsDelivery,
					bestEffortDeliver,
					resolvedChannel
				})) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "delivery channel is required: pass --channel/--reply-channel or use a main session with a previous channel"));
					return;
				}
				context.logGateway.info(deliveryDowngradeReason ? `agent delivery downgraded to session-only (bestEffortDeliver): ${deliveryDowngradeReason}` : "agent delivery downgraded to session-only (bestEffortDeliver): no deliverable channel");
			}
			const normalizedTurnSource = normalizeMessageChannel(turnSourceChannel);
			const originMessageChannel = (normalizedTurnSource && isKnownGatewayChannel(normalizedTurnSource) ? normalizedTurnSource : void 0) ?? (client?.connect && isWebchatConnect(client.connect) ? "webchat" : resolvedChannel);
			const deliver = request.deliver === true && resolvedChannel !== "webchat";
			const preRegistrationAbort = readGatewayDedupeEntry({
				dedupe: context.dedupe,
				keys: agentDedupeKeys
			});
			if (isPreRegistrationAbortedAgentDedupeEntryForSession({
				entry: preRegistrationAbort,
				runId,
				sessionKey: resolvedSessionKey,
				alternateSessionKeys: [preAcceptedReservedSessionKey, requestedSessionKey]
			})) {
				agentRunAccepted = true;
				respond(true, preRegistrationAbort?.payload, void 0, {
					cached: true,
					runId
				});
				return;
			}
			if (abortForLifecycleRotation({
				sessionKey: resolvedSessionKey,
				agentId: resolvedSessionKey === "global" ? activeSessionAgentId : void 0
			})) return;
			const now = Date.now();
			const timeoutMs = resolveAgentTimeoutMs({
				cfg: cfgForAgent ?? cfg,
				overrideSeconds: typeof request.timeout === "number" ? request.timeout : void 0
			});
			const activeModelProvider = providerOverride ?? resolveSessionModelRef(cfgForAgent ?? cfg, sessionEntry, activeSessionAgentId).provider;
			const activeAuthProvider = resolveProviderIdForAuth(activeModelProvider, { config: cfgForAgent ?? cfg });
			const activeRunAbort = registerChatAbortController({
				chatAbortControllers: context.chatAbortControllers,
				runId,
				sessionId: resolvedSessionId ?? runId,
				sessionKey: resolvedSessionKey,
				agentId: resolvedSessionKey === "global" ? activeSessionAgentId : void 0,
				timeoutMs,
				now,
				expiresAtMs: resolveAgentRunExpiresAtMs({
					now,
					timeoutMs
				}),
				ownerConnId,
				ownerDeviceId,
				providerId: activeModelProvider,
				authProviderId: activeAuthProvider,
				controlUiVisible: !suppressVisibleSessionEffects,
				kind: "agent",
				lifecycleGeneration
			});
			const existingRunAbort = context.chatAbortControllers.get(runId);
			if (!activeRunAbort.registered && existingRunAbort) {
				agentRunAccepted = existingRunAbort.kind === "agent";
				respond(true, {
					runId,
					status: "in_flight"
				}, void 0, {
					cached: true,
					runId
				});
				return;
			}
			if (activeRunAbort.registered) {
				if (pendingChatRun) context.addChatRun(runId, {
					...pendingChatRun,
					clientRunId: runId
				});
				if (resolvedSessionKey) claimAgentRunContext(runId, suppressVisibleSessionEffects ? {
					isControlUiVisible: false,
					lifecycleGeneration
				} : {
					sessionKey: resolvedSessionKey,
					lifecycleGeneration
				});
			}
			const resolvedThreadId = explicitThreadId ?? deliveryPlan.resolvedThreadId;
			const taskTrackingMode = resolveGatewayAgentTaskTrackingMode({
				client,
				sessionKey: resolvedSessionKey,
				inputProvenance
			});
			let dispatchTaskTrackingMode = taskTrackingMode === "cli" ? "cli" : "none";
			if (taskTrackingMode === "plugin_subagent" && resolvedSessionKey) try {
				await registerPluginSubagentRunFromGateway({
					cfg,
					runId,
					childSessionKey: resolvedSessionKey,
					task: request.message.trim(),
					requesterOrigin: normalizeDeliveryContext({
						channel: resolvedChannel,
						to: resolvedTo,
						accountId: resolvedAccountId,
						threadId: resolvedThreadId
					}),
					pluginId: normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId)
				});
			} catch (err) {
				context.logGateway.warn(`failed to register plugin subagent run ${runId}; falling back to cli task tracking: ${formatForLog(err)}`);
				dispatchTaskTrackingMode = "cli";
			}
			const accepted = {
				runId,
				sessionKey: resolvedSessionKey,
				...resolvedSessionKey === "global" ? { agentId: activeSessionAgentId } : {},
				status: "accepted",
				acceptedAt: Date.now()
			};
			const acceptedDedupePayload = {
				...accepted,
				controlUiVisible: !suppressVisibleSessionEffects,
				dedupeKeys: agentDedupeKeys,
				ownerConnId,
				ownerDeviceId
			};
			agentRunAccepted = true;
			setGatewayDedupeEntries({
				dedupe: context.dedupe,
				keys: agentDedupeKeys,
				entry: {
					ts: Date.now(),
					ok: true,
					payload: acceptedDedupePayload
				}
			});
			respond(true, accepted, void 0, { runId });
			(async () => {
				await yieldAfterAgentAcceptedAck();
				let dispatched = false;
				try {
					if (activeRunAbort.controller.signal.aborted) {
						const stopReason = resolveAbortedAgentStopReason(activeRunAbort.entry);
						setAbortedAgentDedupeEntries({
							dedupe: context.dedupe,
							keys: agentDedupeKeys,
							agentId: resolvedSessionKey === "global" ? activeSessionAgentId : void 0,
							runId,
							stopReason
						});
						respond(true, {
							runId,
							status: "timeout",
							summary: "aborted",
							stopReason,
							timeoutPhase: "queue",
							providerStarted: false
						}, void 0, { runId });
						return;
					}
					if (resolvedSessionKey) await reactivateCompletedSubagentSession({
						sessionKey: resolvedSessionKey,
						runId
					});
					if (requestedSessionKey && resolvedSessionKey && isNewSession) emitSessionsChanged(context, {
						sessionKey: resolvedSessionKey,
						...resolvedSessionKey === "global" ? { agentId: activeSessionAgentId } : {},
						reason: "create"
					});
					if (resolvedSessionKey) emitSessionsChanged(context, {
						sessionKey: resolvedSessionKey,
						...resolvedSessionKey === "global" ? { agentId: activeSessionAgentId } : {},
						reason: "send"
					});
					if (!isRawModelRun) message = annotateInterSessionPromptText(message, inputProvenance);
					const ingressAgentId = resolvedSessionKey === "global" ? activeSessionAgentId : agentId && (!resolvedSessionKey || resolveAgentIdFromSessionKey(resolvedSessionKey) === agentId) ? agentId : void 0;
					let execApprovalFollowupRuntimeHandoff = canUseInternalRuntimeHandoff && execApprovalFollowupApprovalId ? consumeExecApprovalFollowupRuntimeHandoff({
						handoffId: request.internalRuntimeHandoffId,
						approvalId: execApprovalFollowupApprovalId,
						idempotencyKey: idem,
						sessionKey: resolvedSessionKey
					}) : void 0;
					if (!execApprovalFollowupRuntimeHandoff && canUseInternalRuntimeHandoff && execApprovalFollowupApprovalId && requestedSessionKeyRaw && requestedSessionKeyRaw !== resolvedSessionKey) execApprovalFollowupRuntimeHandoff = consumeExecApprovalFollowupRuntimeHandoff({
						handoffId: request.internalRuntimeHandoffId,
						approvalId: execApprovalFollowupApprovalId,
						idempotencyKey: idem,
						sessionKey: requestedSessionKeyRaw
					});
					const execApprovalFollowupElevatedDefaults = execApprovalFollowupRuntimeHandoff?.bashElevated;
					dispatchAgentRunFromGateway({
						ingressOpts: {
							message,
							images,
							imageOrder,
							agentId: ingressAgentId,
							provider: providerOverride,
							model: modelOverride,
							to: resolvedTo,
							sessionId: resolvedSessionId,
							sessionKey: resolvedSessionKey,
							thinking: request.thinking,
							deliver,
							deliveryTargetMode,
							channel: resolvedChannel,
							accountId: resolvedAccountId,
							threadId: resolvedThreadId,
							runContext: {
								messageChannel: originMessageChannel,
								accountId: resolvedAccountId,
								groupId: resolvedGroupId,
								groupChannel: resolvedGroupChannel,
								groupSpace: resolvedGroupSpace,
								currentThreadTs: resolvedThreadId != null ? String(resolvedThreadId) : void 0
							},
							...execApprovalFollowupElevatedDefaults ? { bashElevated: execApprovalFollowupElevatedDefaults } : {},
							groupId: resolvedGroupId,
							groupChannel: resolvedGroupChannel,
							groupSpace: resolvedGroupSpace,
							spawnedBy: spawnedByValue,
							timeout: request.timeout?.toString(),
							bestEffortDeliver,
							messageChannel: originMessageChannel,
							runId,
							lane: request.lane,
							modelRun: request.modelRun === true,
							promptMode: request.promptMode,
							extraSystemPrompt: request.extraSystemPrompt,
							bootstrapContextMode: request.bootstrapContextMode,
							bootstrapContextRunKind: request.bootstrapContextRunKind,
							acpTurnSource: request.acpTurnSource,
							internalEvents: request.internalEvents,
							inputProvenance,
							senderIsOwner: clientHasAdminScope(client),
							sessionEffects,
							skipInitialSessionTouch: skipAgentInitialSessionTouch,
							preserveUserFacingSessionModelState,
							sourceReplyDeliveryMode: request.sourceReplyDeliveryMode,
							disableMessageTool: request.disableMessageTool,
							suppressPromptPersistence: requestedPromptPersistenceSuppression || shouldSuppressAgentPromptPersistence({
								inputProvenance,
								internalEvents: request.internalEvents
							}),
							cleanupBundleMcpOnRunEnd: request.cleanupBundleMcpOnRunEnd,
							abortSignal: activeRunAbort.controller.signal,
							lifecycleGeneration,
							onActiveModelSelected: ({ provider }) => {
								updateChatRunProvider(context.chatAbortControllers, {
									runId,
									providerId: provider,
									authProviderId: resolveProviderIdForAuth(provider, { config: cfgForAgent ?? cfg })
								});
							},
							onSessionIdChanged: (sessionId) => {
								if (activeRunAbort.entry) activeRunAbort.entry.sessionId = sessionId;
							},
							workspaceDir: resolveIngressWorkspaceOverrideForSpawnedRun({
								spawnedBy: spawnedByValue,
								workspaceDir: sessionEntry?.spawnedWorkspaceDir
							}),
							cwd: resolveSessionRuntimeCwd({
								spawnedBy: spawnedByValue,
								sessionEntry
							}),
							allowModelOverride
						},
						runId,
						dedupeKeys: agentDedupeKeys,
						abortController: activeRunAbort.controller,
						cleanupAbortController: activeRunAbort.cleanup,
						respond,
						context,
						taskTrackingMode: dispatchTaskTrackingMode
					});
					dispatched = true;
				} catch (err) {
					const error = errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err));
					const payload = {
						runId,
						status: "error",
						summary: formatForLog(err)
					};
					setGatewayDedupeEntries({
						dedupe: context.dedupe,
						keys: agentDedupeKeys,
						entry: {
							ts: Date.now(),
							ok: false,
							payload,
							error
						}
					});
					respond(false, payload, error, {
						runId,
						error: formatForLog(err)
					});
				} finally {
					if (!dispatched) activeRunAbort.cleanup({ force: true });
				}
			})();
		} finally {
			clearUnacceptedExecApprovalFollowupDedupe();
		}
	},
	"agent.identity.get": ({ params, respond, context }) => {
		if (!validateAgentIdentityParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent.identity.get params: ${formatValidationErrors(validateAgentIdentityParams.errors)}`));
			return;
		}
		const p = params;
		const agentIdRaw = normalizeOptionalString(p.agentId) ?? "";
		const sessionKeyRaw = normalizeOptionalString(p.sessionKey) ?? "";
		let agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
		if (sessionKeyRaw) {
			if (classifySessionKeyShape(sessionKeyRaw) === "malformed_agent") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent.identity.get params: malformed session key "${sessionKeyRaw}"`));
				return;
			}
			const resolved = resolveAgentIdFromSessionKey(sessionKeyRaw);
			if (agentId && resolved !== agentId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent.identity.get params: agent "${agentIdRaw}" does not match session key agent "${resolved}"`));
				return;
			}
			agentId = resolved;
		}
		const cfg = context.getRuntimeConfig();
		const identity = resolveAssistantIdentity({
			cfg,
			agentId
		});
		const avatarValue = resolveAssistantAvatarUrl({
			avatar: identity.avatar,
			agentId: identity.agentId,
			basePath: cfg.gateway?.controlUi?.basePath
		}) ?? identity.avatar;
		const avatarResolution = resolveAgentAvatar(cfg, identity.agentId, { includeUiOverride: true });
		respond(true, {
			...identity,
			avatar: avatarValue,
			avatarSource: resolvePublicAgentAvatarSource(avatarResolution),
			avatarStatus: avatarResolution.kind,
			avatarReason: avatarResolution.kind === "none" ? avatarResolution.reason : void 0
		}, void 0);
	},
	"agent.wait": async ({ params, respond, context }) => {
		if (!validateAgentWaitParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent.wait params: ${formatValidationErrors(validateAgentWaitParams.errors)}`));
			return;
		}
		const p = params;
		const runId = (p.runId ?? "").trim();
		const timeoutMs = typeof p.timeoutMs === "number" && Number.isFinite(p.timeoutMs) ? Math.max(0, Math.floor(p.timeoutMs)) : 3e4;
		const activeChatEntry = context.chatAbortControllers.get(runId);
		const hasActiveChatRun = activeChatEntry !== void 0 && activeChatEntry.kind !== "agent";
		const cachedGatewaySnapshot = readTerminalSnapshotFromGatewayDedupe({
			dedupe: context.dedupe,
			runId,
			ignoreAgentTerminalSnapshot: hasActiveChatRun
		});
		if (cachedGatewaySnapshot) {
			respond(true, {
				runId,
				status: cachedGatewaySnapshot.status,
				startedAt: cachedGatewaySnapshot.startedAt,
				endedAt: cachedGatewaySnapshot.endedAt,
				error: cachedGatewaySnapshot.error,
				stopReason: cachedGatewaySnapshot.stopReason,
				livenessState: cachedGatewaySnapshot.livenessState,
				yielded: cachedGatewaySnapshot.yielded,
				pendingError: cachedGatewaySnapshot.pendingError,
				timeoutPhase: cachedGatewaySnapshot.timeoutPhase,
				providerStarted: cachedGatewaySnapshot.providerStarted
			});
			return;
		}
		const lifecycleAbortController = new AbortController();
		const dedupeAbortController = new AbortController();
		const dedupePromise = waitForTerminalGatewayDedupe({
			dedupe: context.dedupe,
			runId,
			timeoutMs,
			signal: dedupeAbortController.signal,
			ignoreAgentTerminalSnapshot: hasActiveChatRun
		});
		if (hasActiveChatRun) {
			const snapshot = await dedupePromise;
			dedupeAbortController.abort();
			if (!snapshot) {
				respond(true, {
					runId,
					status: "timeout",
					timeoutPhase: "gateway_draining"
				});
				return;
			}
			respond(true, {
				runId,
				status: snapshot.status,
				startedAt: snapshot.startedAt,
				endedAt: snapshot.endedAt,
				error: snapshot.error,
				stopReason: snapshot.stopReason,
				livenessState: snapshot.livenessState,
				yielded: snapshot.yielded,
				pendingError: snapshot.pendingError,
				timeoutPhase: snapshot.timeoutPhase,
				providerStarted: snapshot.providerStarted
			});
			return;
		}
		const lifecyclePromise = waitForAgentJob({
			runId,
			timeoutMs,
			signal: lifecycleAbortController.signal
		});
		const first = await Promise.race([lifecyclePromise.then((snapshot) => ({
			source: "lifecycle",
			snapshot
		})), dedupePromise.then((snapshot) => ({
			source: "dedupe",
			snapshot
		}))]);
		let snapshot = first.snapshot;
		if (snapshot) if (first.source === "lifecycle") dedupeAbortController.abort();
		else lifecycleAbortController.abort();
		else {
			snapshot = first.source === "lifecycle" ? await dedupePromise : await lifecyclePromise;
			lifecycleAbortController.abort();
			dedupeAbortController.abort();
		}
		if (!snapshot) {
			const activeRunRegistered = activeChatEntry !== void 0;
			respond(true, {
				runId,
				status: "timeout",
				timeoutPhase: activeRunRegistered ? "gateway_draining" : "queue",
				...activeRunRegistered ? {} : { providerStarted: false }
			});
			return;
		}
		respond(true, {
			runId,
			status: snapshot.status,
			startedAt: snapshot.startedAt,
			endedAt: snapshot.endedAt,
			error: snapshot.error,
			stopReason: snapshot.stopReason,
			livenessState: snapshot.livenessState,
			yielded: snapshot.yielded,
			pendingError: snapshot.pendingError,
			timeoutPhase: snapshot.timeoutPhase,
			providerStarted: snapshot.providerStarted
		});
	}
};
//#endregion
export { agentHandlers };
