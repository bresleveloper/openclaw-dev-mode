import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { w as releaseAgentRunDelegatedAuthority } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration, y as reserveAgentTerminalEvent } from "./agent-events-Bf3Js0D3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { a as createAgentRunDirectAbortError, o as createAgentRunRestartAbortError } from "./run-termination-Dwf1ksjA.mjs";
import { i as readToolValidationErrorSummary } from "./tool-error-summary-CezRoLUS.mjs";
import { c as resolveSessionSubscriptionKey, l as resolveSessionSubscriptionKeys, r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { t as notifyGatewayWorkMetricsChanged } from "./gateway-work-metrics-events-SooEjUbR.mjs";
import { t as AGENT_RUN_TERMINAL_RETRY_GRACE_MS } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-BB6L4tWc.mjs";
import { n as createChatAbortMarker } from "./server-chat-state-BW_LW3dq.mjs";
import { t as registerAgentRunDeadlineRenewer } from "./agent-run-deadline-DOxupoZB.mjs";
import { l as removeChatAbortControllerEntry, s as markChatAbortTerminalOutcome } from "./chat-abort-lifecycle-internal-EU815r6Q.mjs";
import { n as appendChatCanvasBlocksToMessage } from "./chat-display-projection.canvas-CwC0V7fB.mjs";
//#region src/gateway/chat-inflight-snapshot.ts
function projectInFlightRunSnapshot(params) {
	const run = params.chatRunState.runs.get(params.runId);
	const projected = params.chatRunState.resolveBuffer(params.runId);
	const plan = run?.planSnapshot;
	const events = run?.progressSnapshot?.events;
	return {
		runId: params.runId,
		text: projected.suppress ? "" : projected.text,
		...params.startedAtMs === void 0 ? {} : { startedAt: params.startedAtMs },
		...params.sessionAbortable ? { sessionAbortable: true } : {},
		...plan ? { plan } : {},
		...events?.length ? { events } : {}
	};
}
//#endregion
//#region src/gateway/chat-run-deadline.ts
const DEFAULT_CHAT_RUN_ABORT_GRACE_MS = 6e4;
function resolveChatRunExpiresAtMs(params) {
	const { now, timeoutMs, graceMs = DEFAULT_CHAT_RUN_ABORT_GRACE_MS, minMs = 12e4, maxMs = 864e5 } = params;
	const safeNow = asDateTimestampMs(now);
	if (safeNow === void 0) return 0;
	const targetDurationMs = Math.max(0, timeoutMs) + graceMs;
	const target = resolveExpiresAtMsFromDurationMs(targetDurationMs, { nowMs: safeNow });
	const min = resolveExpiresAtMsFromDurationMs(minMs, { nowMs: safeNow });
	const max = resolveExpiresAtMsFromDurationMs(maxMs, { nowMs: safeNow });
	if (target === void 0 || min === void 0 || max === void 0) return 0;
	return Math.min(max, Math.max(min, target));
}
function resolveAgentRunExpiresAtMs(params) {
	return resolveChatRunExpiresAtMs({
		...params,
		graceMs: DEFAULT_CHAT_RUN_ABORT_GRACE_MS,
		minMs: DEFAULT_CHAT_RUN_ABORT_GRACE_MS,
		maxMs: Math.max(0, params.timeoutMs) + DEFAULT_CHAT_RUN_ABORT_GRACE_MS
	});
}
/** A new candidate cannot revive a cancelled, expired, or replaced execution. */
function renewChatRunExecutionDeadline(params) {
	const entry = params.entries.get(params.runId);
	if (entry?.controller !== params.controller || params.controller.signal.aborted) return false;
	if (entry.executionStarted !== true) return false;
	const now = params.now ?? Date.now();
	if (!isFutureDateTimestampMs(entry.expiresAtMs, { nowMs: now })) return false;
	const nextExpiresAtMs = resolveAgentRunExpiresAtMs({
		now,
		timeoutMs: params.timeoutMs
	});
	if (nextExpiresAtMs <= entry.expiresAtMs) return false;
	entry.expiresAtMs = nextExpiresAtMs;
	return true;
}
//#endregion
//#region src/gateway/chat-abort.ts
function createChatAbortSignalReason(stopReason) {
	if (stopReason === "restart") return createAgentRunRestartAbortError();
	if (stopReason !== "timeout") return createAgentRunDirectAbortError();
	const reason = /* @__PURE__ */ new Error("chat run timed out");
	reason.name = "TimeoutError";
	return reason;
}
function registerChatAbortController(params) {
	const rawNow = params.now ?? Date.now();
	const queueDeadlineMs = resolveExpiresAtMsFromDurationMs(params.timeoutMs, { nowMs: rawNow });
	const controller = new AbortController();
	let queueTimer;
	const isStopped = (entry) => entry.registrationCleanupRequested || controller.signal.aborted || entry.abortStopReason !== void 0 || entry.projectSessionTerminalPending === true || entry.projectSessionTerminalObservedAt !== void 0;
	const onAbort = () => {
		clearTimeout(queueTimer);
		notifyGatewayWorkMetricsChanged();
	};
	const bindAgentRunDelegatedAuthority = (authority) => {
		const entry = params.chatAbortControllers.get(params.runId);
		if (entry?.controller !== controller || entry.registrationCleanupRequested || !entry.operationalRunInstance || authority.operationalRunInstance !== entry.operationalRunInstance) throw new Error("agent run authority does not belong to this controller registration");
		if (entry.agentRunDelegatedAuthority && entry.agentRunDelegatedAuthority !== authority) throw new Error("agent run controller already owns a different authority");
		entry.agentRunDelegatedAuthority = authority;
	};
	let executionStarted = false;
	const markExecutionStarted = () => {
		if (executionStarted) return false;
		const entry = params.chatAbortControllers.get(params.runId);
		if (entry?.controller !== controller || isStopped(entry)) return false;
		if (params.onQueueTimeout && !isFutureDateTimestampMs(queueDeadlineMs, { nowMs: Date.now() })) {
			params.onQueueTimeout(entry);
			return false;
		}
		executionStarted = true;
		entry.executionStarted = true;
		clearTimeout(queueTimer);
		if (entry.kind !== "agent") return true;
		const now = Date.now();
		if (!isFutureDateTimestampMs(entry.expiresAtMs, { nowMs: now })) return true;
		entry.expiresAtMs = resolveAgentRunExpiresAtMs({
			now,
			timeoutMs: params.timeoutMs
		});
		return true;
	};
	const cleanup = () => {
		clearTimeout(queueTimer);
		const entry = params.chatAbortControllers.get(params.runId);
		if (entry?.controller === controller) {
			if (entry.agentRunDelegatedAuthority) releaseAgentRunDelegatedAuthority(entry.agentRunDelegatedAuthority);
			entry.registrationCleanupRequested = true;
			entry.projectSessionActive = false;
			entry.pendingTimeoutCompletion = void 0;
			notifyGatewayWorkMetricsChanged();
			if (entry.projectSessionTerminalPending === true) return;
			const persistence = entry.projectSessionTerminalPersistence;
			if (persistence) {
				const removeAfterPersistence = (persisted) => {
					if (params.chatAbortControllers.get(params.runId)?.controller === controller && entry.projectSessionTerminalPersistence === persistence) {
						if (persisted) entry.projectSessionTerminalPersistence = void 0;
						removeChatAbortControllerEntry(params.chatAbortControllers, params.runId, entry);
					}
				};
				persistence.then(() => removeAfterPersistence(true)).catch(() => removeAfterPersistence(false));
				return;
			}
			removeChatAbortControllerEntry(params.chatAbortControllers, params.runId, entry);
		}
	};
	if (!params.sessionKey || params.chatAbortControllers.has(params.runId)) return {
		controller,
		registered: false,
		deferTimeoutCompletion: () => false,
		markExecutionStarted,
		bindAgentRunDelegatedAuthority,
		cleanup
	};
	const now = resolveDateTimestampMs(rawNow, 0);
	const explicitExpiresAtMs = params.expiresAtMs === void 0 ? void 0 : asDateTimestampMs(params.expiresAtMs) ?? 0;
	const entry = {
		controller,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		lifecycleGeneration: params.lifecycleGeneration ?? getAgentEventLifecycleGeneration(),
		operationalRunInstance: params.operationalRunInstance,
		agentId: normalizeOptionalLowercaseString(params.agentId),
		startedAtMs: now,
		executionStarted: false,
		expiresAtMs: explicitExpiresAtMs ?? resolveChatRunExpiresAtMs({
			now: rawNow,
			timeoutMs: params.timeoutMs
		}),
		ownerConnId: params.ownerConnId,
		ownerDeviceId: params.ownerDeviceId,
		providerId: normalizeOptionalLowercaseString(params.providerId),
		authProviderId: normalizeOptionalLowercaseString(params.authProviderId),
		controlUiVisible: params.controlUiVisible,
		isAbortable: params.isAbortable,
		resolveTerminalProducer: params.resolveTerminalProducer ? () => params.resolveTerminalProducer?.(entry) : void 0,
		onRemoved: () => {
			unregisterDeadline();
			clearTimeout(queueTimer);
			controller.signal.removeEventListener("abort", onAbort);
			notifyGatewayWorkMetricsChanged();
			params.onRemoved?.();
		},
		projectSessionActive: params.projectSessionActive ?? true,
		kind: params.kind,
		turnKind: params.turnKind
	};
	params.chatAbortControllers.set(params.runId, entry);
	const unregisterDeadline = registerAgentRunDeadlineRenewer(params.runId, () => !isStopped(entry) && renewChatRunExecutionDeadline({
		entries: params.chatAbortControllers,
		runId: params.runId,
		controller,
		timeoutMs: params.timeoutMs
	}));
	if (params.onQueueTimeout) {
		queueTimer = setTimeout(() => {
			if (params.chatAbortControllers.get(params.runId) === entry && entry.executionStarted === false && !isStopped(entry)) params.onQueueTimeout?.(entry);
		}, params.timeoutMs);
		queueTimer.unref();
	}
	controller.signal.addEventListener("abort", onAbort, { once: true });
	notifyGatewayWorkMetricsChanged();
	return {
		controller,
		registered: true,
		entry,
		deferTimeoutCompletion: (settle) => {
			if (params.chatAbortControllers.get(params.runId) !== entry) return false;
			entry.pendingTimeoutCompletion = {
				expiresAtMs: Date.now() + AGENT_RUN_TERMINAL_RETRY_GRACE_MS,
				settle
			};
			return true;
		},
		markExecutionStarted,
		bindAgentRunDelegatedAuthority,
		cleanup
	};
}
/** Restore the newest visible run when chat.history switches back to its session.
* Match requested and canonical keys, with agent scoping for the shared global row.
*/
function resolveInFlightRunSnapshot(params) {
	const matchesKey = (entry, key) => {
		if (entry.sessionKey !== key) return false;
		if (key !== "global") return true;
		const requestedAgentId = normalizeOptionalLowercaseString(params.agentId) ?? normalizeOptionalLowercaseString(params.defaultAgentId);
		if (!requestedAgentId) return false;
		return (normalizeOptionalLowercaseString(entry.agentId) ?? normalizeOptionalLowercaseString(params.defaultAgentId)) === requestedAgentId;
	};
	let best;
	for (const [runId, entry] of params.chatAbortControllers) {
		if (entry.projectSessionActive === false || entry.controlUiVisible === false || entry.controller.signal.aborted || entry.kind === "agent") continue;
		if (!matchesKey(entry, params.requestedSessionKey) && !matchesKey(entry, params.canonicalSessionKey)) continue;
		const newer = best === void 0 || entry.startedAtMs > best.startedAtMs;
		const tie = best !== void 0 && entry.startedAtMs === best.startedAtMs && runId > best.runId;
		if (newer || tie) best = {
			runId,
			startedAtMs: entry.startedAtMs
		};
	}
	if (best === void 0) return;
	return projectInFlightRunSnapshot({
		chatRunState: params.chatRunState,
		runId: best.runId,
		startedAtMs: best.startedAtMs
	});
}
function resolveChatAbortDeliverySessionKeys(ops, sessionKey, agentId) {
	const scopedAgentId = normalizeOptionalLowercaseString(agentId);
	if (!scopedAgentId) return [sessionKey];
	const canonicalKey = resolveSessionSubscriptionKey(sessionKey, scopedAgentId);
	if (canonicalKey === sessionKey) return [canonicalKey];
	return resolveSessionSubscriptionKeys(sessionKey, scopedAgentId, resolveDefaultGlobalAgentId(ops));
}
function broadcastChatAborted(ops, params) {
	const { runId, sessionKey, stopReason } = params;
	const errorMessage = readToolValidationErrorSummary(params.errorMessage);
	const explicitAgentId = normalizeOptionalLowercaseString(params.agentId);
	const defaultGlobalAgentId = sessionKey === "global" && !explicitAgentId ? normalizeOptionalLowercaseString(resolveDefaultGlobalAgentId(ops)) : void 0;
	const payloadAgentId = sessionKey === "global" ? explicitAgentId ?? defaultGlobalAgentId : explicitAgentId;
	const payload = {
		runId,
		sessionKey,
		...payloadAgentId ? { agentId: payloadAgentId } : {},
		seq: (ops.agentRunSeq.get(runId) ?? 0) + 1,
		state: "aborted",
		stopReason,
		...errorMessage ? { errorMessage } : {},
		message: params.message ? {
			...params.message,
			timestamp: Date.now()
		} : void 0
	};
	const deliverySessionKeys = resolveChatAbortDeliverySessionKeys(ops, sessionKey, payloadAgentId);
	ops.broadcast("chat", payload, {
		sessionKeys: deliverySessionKeys,
		...params.liveTextGroup ? { liveText: { group: params.liveTextGroup } } : {}
	});
	for (const deliverySessionKey of deliverySessionKeys) ops.nodeSendToSession(deliverySessionKey, "chat", payload);
}
function resolveDefaultGlobalAgentId(ops) {
	const cfg = ops.getRuntimeConfig?.();
	if (!cfg) return;
	const resolved = resolveRequestedSessionAgentId(cfg, "global");
	return resolved.ok ? resolved.agentId : void 0;
}
function isChatAbortControllerEntryAbortable(entry) {
	if (entry.controller.signal.aborted) return false;
	try {
		return entry.isAbortable?.(entry) !== false;
	} catch {
		return false;
	}
}
function abortChatRunById(ops, params) {
	const { runId, sessionKey, stopReason } = params;
	const active = ops.chatAbortControllers.get(runId);
	if (!active) return { aborted: false };
	if (active.sessionKey !== sessionKey) return { aborted: false };
	if (active.registrationCleanupRequested || !isChatAbortControllerEntryAbortable(active)) return { aborted: false };
	const bufferedText = ops.chatRunState.resolveBuffer(runId, { final: true }).text;
	const run = ops.chatRunState.runs.get(runId);
	const liveTextGroup = run?.liveTextGroup?.signal;
	const partialText = bufferedText && bufferedText.trim() ? bufferedText : void 0;
	const canvasBlocks = run?.bufferIsCurrent?.() !== false && (partialText || !(run?.rawBuffer ?? run?.buffer ?? "").trim()) ? run?.canvasBlocks ?? [] : [];
	const message = appendChatCanvasBlocksToMessage(partialText || canvasBlocks.length ? {
		role: "assistant",
		content: partialText ? [{
			type: "text",
			text: partialText
		}] : []
	} : void 0, canvasBlocks);
	ops.chatRunState.getOrCreate(runId).abortMarker = createChatAbortMarker();
	if (stopReason) active.abortStopReason = stopReason;
	active.abortDiagnosticReason = params.diagnosticReason;
	const emitTerminal = reserveAgentTerminalEvent({
		runId,
		...active.lifecycleGeneration ? { lifecycleGeneration: active.lifecycleGeneration } : {},
		sessionKey,
		sessionId: active.sessionId,
		agentId: active.agentId
	});
	try {
		params.onAbortCommitted?.();
	} catch {}
	active.projectSessionActive = false;
	markChatAbortTerminalOutcome(active);
	active.projectSessionTerminalPending = true;
	active.projectSessionTerminalObservedAt = void 0;
	active.registrationCleanupRequested = true;
	if (active.agentRunDelegatedAuthority) releaseAgentRunDelegatedAuthority(active.agentRunDelegatedAuthority);
	try {
		ops.onRunAborted?.(runId);
	} catch {}
	active.controller.abort(createChatAbortSignalReason(stopReason));
	ops.chatRunState.clearRun(runId);
	const removed = ops.removeChatRun(runId, runId, sessionKey);
	if (active.controlUiVisible !== false) broadcastChatAborted(ops, {
		runId,
		sessionKey,
		agentId: active.agentId,
		stopReason,
		message,
		errorMessage: active.toolErrorSummary,
		liveTextGroup
	});
	emitTerminal({
		phase: "end",
		status: "cancelled",
		aborted: true,
		stopReason,
		...active.toolErrorSummary ? { toolErrorSummary: active.toolErrorSummary } : {},
		startedAt: active.executionStarted === false ? void 0 : active.startedAtMs,
		...active.executionStarted === false ? {
			executionStarted: false,
			providerStarted: false,
			...stopReason === "timeout" ? { timeoutPhase: "queue" } : {}
		} : {},
		endedAt: Date.now()
	});
	if (ops.chatAbortControllers.get(runId) === active && active.projectSessionTerminalObservedAt === void 0 && !active.projectSessionTerminalPersistence) {
		active.projectSessionTerminalPending = false;
		removeChatAbortControllerEntry(ops.chatAbortControllers, runId, active);
	}
	ops.agentRunSeq.delete(runId);
	if (removed?.clientRunId) ops.agentRunSeq.delete(removed.clientRunId);
	return { aborted: true };
}
function updateChatRunProvider(chatAbortControllers, params) {
	const entry = chatAbortControllers.get(params.runId);
	if (!entry) return false;
	entry.providerId = normalizeOptionalLowercaseString(params.providerId);
	entry.authProviderId = normalizeOptionalLowercaseString(params.authProviderId);
	return true;
}
function abortChatRunsForProvider(ops, params) {
	const providerId = normalizeOptionalLowercaseString(params.providerId);
	const agentId = normalizeOptionalLowercaseString(params.agentId);
	if (!providerId) return { runIds: [] };
	const compatibilityOwnerAgentId = agentId && tryResolveLegacyCompatibilityAgentId(params.cfg);
	const matches = [...ops.chatAbortControllers.entries()].filter(([, entry]) => {
		if (normalizeOptionalLowercaseString(entry.authProviderId) !== providerId && normalizeOptionalLowercaseString(entry.providerId) !== providerId) return false;
		return !agentId || resolveChatRunOwnerAgentId({
			agentId: entry.agentId,
			sessionKey: entry.sessionKey,
			defaultAgentId: compatibilityOwnerAgentId
		}) === agentId;
	});
	const runIds = [];
	for (const [runId, entry] of matches) if (abortChatRunById(ops, {
		runId,
		sessionKey: entry.sessionKey,
		stopReason: params.stopReason
	}).aborted) runIds.push(runId);
	return { runIds };
}
//#endregion
export { resolveInFlightRunSnapshot as a, resolveChatRunExpiresAtMs as c, registerChatAbortController as i, projectInFlightRunSnapshot as l, abortChatRunsForProvider as n, updateChatRunProvider as o, isChatAbortControllerEntryAbortable as r, resolveAgentRunExpiresAtMs as s, abortChatRunById as t };
