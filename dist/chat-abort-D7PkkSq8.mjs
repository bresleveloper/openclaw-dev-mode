import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { S as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { x as releaseAgentRunDelegatedAuthority } from "./agent-run-registry-DO6Dg2r0.mjs";
import { i as emitAgentEvent, l as getAgentEventLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { n as resolveRequestedSessionAgentId, o as resolveSessionSubscriptionKey, s as resolveSessionSubscriptionKeys } from "./session-request-agent-DN7PUqhR.mjs";
import { t as AGENT_RUN_TERMINAL_RETRY_GRACE_MS } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { o as createAgentRunRestartAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { i as readToolValidationErrorSummary } from "./tool-error-summary-Sp1u0x3c.mjs";
import { n as isAbortRequestText } from "./abort-primitives-BbtQkqTs.mjs";
import { n as appendChatCanvasBlocksToMessage } from "./chat-display-projection.canvas-C78Q4iVY.mjs";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-HbcABEVb.mjs";
import { l as projectLiveAssistantBufferedText, n as createChatAbortMarker } from "./server-chat-state-DfVYc1CX.mjs";
//#region src/gateway/chat-abort-lifecycle-internal.ts
const terminalPersistenceErrorByEntry = /* @__PURE__ */ new WeakMap();
const terminalDispatchByEntry = /* @__PURE__ */ new WeakMap();
const removalWaitersByEntry = /* @__PURE__ */ new WeakMap();
/** Retain the subscription owner's receipt on the exact captured registration. */
function bindChatAbortTerminalDispatch(entries, settled, captured) {
	if (!entries || !captured) return;
	const dispatch = Object.assign(captured, { settled });
	for (const entry of entries) terminalDispatchByEntry.set(entry, dispatch);
}
function markChatAbortTerminalPersistenceError(entry, error) {
	if (error === void 0) {
		terminalPersistenceErrorByEntry.delete(entry);
		return;
	}
	terminalPersistenceErrorByEntry.set(entry, error);
}
function notifyChatAbortControllerRemoved(entry) {
	const waiters = removalWaitersByEntry.get(entry);
	removalWaitersByEntry.delete(entry);
	for (const resolve of waiters ?? []) resolve();
}
/** Cancellation joins terminal dispatch before inspecting its write or intentional no-write. */
async function waitForChatAbortTerminalPersistence(entry) {
	const dispatch = terminalDispatchByEntry.get(entry);
	const preparedPersistence = entry.projectSessionTerminalPersistence;
	if (dispatch) await dispatch.settled;
	const persistence = preparedPersistence ?? entry.projectSessionTerminalPersistence;
	if (persistence) await persistence;
	if (!persistence && terminalPersistenceErrorByEntry.has(entry)) throw terminalPersistenceErrorByEntry.get(entry);
	if (dispatch?.failure) throw dispatch.failure.error;
	if (!persistence && entry.projectSessionTerminalPending === true) throw new Error("Session cancellation has no terminal persistence owner");
}
/** Waits for captured run registrations and their terminal persistence owner to leave. */
async function waitForChatAbortControllerRemoval(params) {
	const terminalOwnersSettled = () => params.targets.every(({ entry }) => entry.projectSessionTerminalPending !== true && entry.projectSessionTerminalPersistence === void 0 && !terminalPersistenceErrorByEntry.has(entry));
	const registeredWaiters = [];
	const removals = params.targets.flatMap(({ runId, entry }) => {
		if (params.entries.get(runId) !== entry) return [];
		return [new Promise((resolve) => {
			const waiters = removalWaitersByEntry.get(entry) ?? /* @__PURE__ */ new Set();
			waiters.add(resolve);
			removalWaitersByEntry.set(entry, waiters);
			registeredWaiters.push({
				entry,
				resolve
			});
		})];
	});
	if (removals.length === 0) return terminalOwnersSettled();
	let timer;
	try {
		return await Promise.race([Promise.all(removals).then(() => true), new Promise((resolve) => {
			timer = setTimeout(() => resolve(false), Math.max(0, params.timeoutMs));
			timer.unref?.();
		})]) && terminalOwnersSettled();
	} finally {
		if (timer) clearTimeout(timer);
		for (const { entry, resolve } of registeredWaiters) {
			const waiters = removalWaitersByEntry.get(entry);
			waiters?.delete(resolve);
			if (waiters?.size === 0) removalWaitersByEntry.delete(entry);
		}
	}
}
//#endregion
//#region src/gateway/chat-abort.ts
const DEFAULT_CHAT_RUN_ABORT_GRACE_MS = 6e4;
function projectInFlightRunSnapshot(params) {
	const run = params.chatRunState.runs.get(params.runId);
	const projected = projectLiveAssistantBufferedText(params.chatRunState.resolveBuffer(params.runId).text, { suppressLeadFragments: true });
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
function isChatStopCommandText(text) {
	return isAbortRequestText(text);
}
function createChatAbortSignalReason(stopReason) {
	if (stopReason === "restart") return createAgentRunRestartAbortError();
	if (stopReason !== "timeout") return;
	const reason = /* @__PURE__ */ new Error("chat run timed out");
	reason.name = "TimeoutError";
	return reason;
}
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
	const graceMs = Math.max(0, params.graceMs ?? DEFAULT_CHAT_RUN_ABORT_GRACE_MS);
	return resolveChatRunExpiresAtMs({
		now: params.now,
		timeoutMs: params.timeoutMs,
		graceMs,
		minMs: graceMs,
		maxMs: Math.max(0, params.timeoutMs) + graceMs
	});
}
function registerChatAbortController(params) {
	const controller = new AbortController();
	const bindAgentRunDelegatedAuthority = (authority) => {
		const entry = params.chatAbortControllers.get(params.runId);
		if (entry?.controller !== controller || !entry.operationalRunInstance || authority.operationalRunInstance !== entry.operationalRunInstance) throw new Error("agent run authority does not belong to this controller registration");
		if (entry.agentRunDelegatedAuthority && entry.agentRunDelegatedAuthority !== authority) throw new Error("agent run controller already owns a different authority");
		entry.agentRunDelegatedAuthority = authority;
	};
	let executionStarted = false;
	const markExecutionStarted = () => {
		if (executionStarted) return false;
		const entry = params.chatAbortControllers.get(params.runId);
		if (entry?.controller !== controller || controller.signal.aborted) return false;
		executionStarted = true;
		entry.executionStarted = true;
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
		const entry = params.chatAbortControllers.get(params.runId);
		if (entry?.controller === controller) {
			if (entry.agentRunDelegatedAuthority) releaseAgentRunDelegatedAuthority(entry.agentRunDelegatedAuthority);
			entry.registrationCleanupRequested = true;
			entry.pendingTimeoutCompletion = void 0;
			if (entry.projectSessionTerminalPending === true) return;
			const persistence = entry.projectSessionTerminalPersistence;
			if (persistence) {
				persistence.then(() => {
					if (params.chatAbortControllers.get(params.runId)?.controller === controller && entry.projectSessionTerminalPersistence === persistence) {
						entry.projectSessionTerminalPersistence = void 0;
						removeChatAbortControllerEntry(params.chatAbortControllers, params.runId, entry);
					}
				}).catch(() => {
					if (params.chatAbortControllers.get(params.runId)?.controller === controller && entry.projectSessionTerminalPersistence === persistence) removeChatAbortControllerEntry(params.chatAbortControllers, params.runId, entry);
				});
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
	const rawNow = params.now ?? Date.now();
	const now = resolveDateTimestampMs(rawNow, 0);
	const explicitExpiresAtMs = params.expiresAtMs === void 0 ? void 0 : asDateTimestampMs(params.expiresAtMs) ?? 0;
	const entry = {
		controller,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		lifecycleGeneration: params.lifecycleGeneration ?? getAgentEventLifecycleGeneration(),
		operationalRunInstance: params.operationalRunInstance,
		agentId: normalizeActiveAgentId(params.agentId),
		startedAtMs: now,
		executionStarted: false,
		expiresAtMs: explicitExpiresAtMs ?? resolveChatRunExpiresAtMs({
			now: rawNow,
			timeoutMs: params.timeoutMs
		}),
		ownerConnId: params.ownerConnId,
		ownerDeviceId: params.ownerDeviceId,
		providerId: normalizeProviderIdForActiveRun(params.providerId),
		authProviderId: normalizeProviderIdForActiveRun(params.authProviderId),
		controlUiVisible: params.controlUiVisible,
		isAbortable: params.isAbortable,
		onRemoved: params.onRemoved,
		projectSessionActive: params.projectSessionActive ?? true,
		kind: params.kind,
		turnKind: params.turnKind
	};
	params.chatAbortControllers.set(params.runId, entry);
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
function normalizeProviderIdForActiveRun(providerId) {
	return providerId?.trim().toLowerCase() || void 0;
}
function normalizeActiveAgentId(agentId) {
	return agentId?.trim().toLowerCase() || void 0;
}
/**
* Snapshot the live assistant text of any in-flight run for a session+agent. Used
* by chat.history so a run that kept streaming while the client was switched away
* — whose deltas the gateway delivered to a delivery key this client is no longer
* subscribed to — is restored on switch-back.
*
* Matches a run the same way sessions.list's active-run projection does: an abort
* entry can hold the requested key while chat run state holds the canonical store
* key, so accept a match on EITHER `requestedSessionKey` or `canonicalSessionKey`,
* scoping the shared "global" session by agent. Only runs still projected active
* (`projectSessionActive !== false`, matching sessions.list; the terminal lifecycle
* flips it to false), not aborted, and visible chat-send runs are returned, so a
* finalized run — already in persisted history — is not duplicated and hidden
* agent runs cannot be adopted by chat clients that will not receive their final
* events.
*/
function resolveInFlightRunSnapshot(params) {
	const matchesKey = (entry, key) => {
		if (entry.sessionKey !== key) return false;
		if (key !== "global") return true;
		const requestedAgentId = normalizeActiveAgentId(params.agentId) ?? normalizeActiveAgentId(params.defaultAgentId);
		if (!requestedAgentId) return false;
		return (normalizeActiveAgentId(entry.agentId) ?? normalizeActiveAgentId(params.defaultAgentId)) === requestedAgentId;
	};
	if (!(params.chatAbortControllers instanceof Map)) return;
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
function boundInFlightRunSnapshotForChatHistory(params) {
	if (!params.snapshot) return;
	const messagesBytes = params.getMessagesBytes?.() ?? jsonUtf8Bytes(params.messages);
	if (messagesBytes + jsonUtf8Bytes(params.snapshot) <= params.maxBytes) return params.snapshot;
	let bounded = {
		runId: params.snapshot.runId,
		text: "",
		...params.snapshot.sessionAbortable ? { sessionAbortable: true } : {},
		...params.snapshot.events ? { events: [] } : {},
		...params.snapshot.plan ? { plan: { steps: [] } } : {}
	};
	if (params.snapshot.startedAt !== void 0) {
		const candidate = {
			...bounded,
			startedAt: params.snapshot.startedAt
		};
		if (messagesBytes + jsonUtf8Bytes(candidate) <= params.maxBytes) bounded = candidate;
	}
	if (params.snapshot.events) {
		const events = params.snapshot.events;
		let start = 0;
		let end = events.length;
		let middle = 0;
		while (start < end) {
			const candidate = {
				...bounded,
				events: events.slice(middle)
			};
			if (messagesBytes + jsonUtf8Bytes(candidate) <= params.maxBytes) {
				bounded = candidate;
				end = middle;
			} else start = middle + 1;
			middle = Math.floor((start + end) / 2);
		}
	}
	if (params.snapshot.plan) {
		const candidate = {
			...bounded,
			plan: params.snapshot.plan
		};
		if (messagesBytes + jsonUtf8Bytes(candidate) <= params.maxBytes) bounded = candidate;
	}
	if (params.snapshot.text) {
		const candidate = {
			...bounded,
			text: params.snapshot.text
		};
		if (messagesBytes + jsonUtf8Bytes(candidate) <= params.maxBytes) bounded = candidate;
	}
	return bounded;
}
function resolveChatAbortDeliverySessionKeys(ops, sessionKey, agentId) {
	const scopedAgentId = normalizeActiveAgentId(agentId);
	if (!scopedAgentId) return [sessionKey];
	const canonicalKey = resolveSessionSubscriptionKey(sessionKey, scopedAgentId);
	if (canonicalKey === sessionKey) return [canonicalKey];
	return resolveSessionSubscriptionKeys(sessionKey, scopedAgentId, resolveDefaultGlobalAgentId(ops));
}
function broadcastChatAborted(ops, params) {
	const { runId, sessionKey, stopReason } = params;
	const errorMessage = readToolValidationErrorSummary(params.errorMessage);
	const explicitAgentId = normalizeActiveAgentId(params.agentId);
	const defaultGlobalAgentId = sessionKey === "global" && !explicitAgentId ? normalizeActiveAgentId(resolveDefaultGlobalAgentId(ops)) : void 0;
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
function removeChatAbortControllerEntry(entries, runId, expectedEntry) {
	const entry = entries.get(runId);
	if (!entry || expectedEntry && entry !== expectedEntry) return false;
	const pending = entry.pendingTimeoutCompletion;
	if (pending) {
		if (isFutureDateTimestampMs(pending.expiresAtMs, { nowMs: Date.now() })) return false;
		entry.pendingTimeoutCompletion = void 0;
		pending.settle();
		if (entries.get(runId) !== entry) return false;
	}
	entries.delete(runId);
	try {
		entry.onRemoved?.();
	} catch {} finally {
		notifyChatAbortControllerRemoved(entry);
	}
	return true;
}
function abortChatRunById(ops, params) {
	const { runId, sessionKey, stopReason } = params;
	const active = ops.chatAbortControllers.get(runId);
	if (!active) return { aborted: false };
	if (active.sessionKey !== sessionKey) return { aborted: false };
	if (!isChatAbortControllerEntryAbortable(active)) return { aborted: false };
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
	active.projectSessionActive = false;
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
	emitAgentEvent({
		runId,
		...active.lifecycleGeneration ? { lifecycleGeneration: active.lifecycleGeneration } : {},
		sessionKey,
		sessionId: active.sessionId,
		agentId: active.agentId,
		stream: "lifecycle",
		data: {
			phase: "end",
			status: "cancelled",
			aborted: true,
			stopReason,
			...active.toolErrorSummary ? { toolErrorSummary: active.toolErrorSummary } : {},
			startedAt: active.executionStarted === false ? void 0 : active.startedAtMs,
			endedAt: Date.now()
		}
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
	entry.providerId = normalizeProviderIdForActiveRun(params.providerId);
	entry.authProviderId = normalizeProviderIdForActiveRun(params.authProviderId);
	return true;
}
function abortChatRunsForProvider(ops, params) {
	const providerId = normalizeProviderIdForActiveRun(params.providerId);
	const agentId = normalizeActiveAgentId(params.agentId);
	if (!providerId) return { runIds: [] };
	const compatibilityOwnerAgentId = agentId && tryResolveLegacyCompatibilityAgentId(params.cfg);
	const matches = [...ops.chatAbortControllers.entries()].filter(([, entry]) => {
		if (normalizeProviderIdForActiveRun(entry.authProviderId) !== providerId && normalizeProviderIdForActiveRun(entry.providerId) !== providerId) return false;
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
export { isChatStopCommandText as a, removeChatAbortControllerEntry as c, resolveInFlightRunSnapshot as d, updateChatRunProvider as f, waitForChatAbortTerminalPersistence as g, waitForChatAbortControllerRemoval as h, isChatAbortControllerEntryAbortable as i, resolveAgentRunExpiresAtMs as l, markChatAbortTerminalPersistenceError as m, abortChatRunsForProvider as n, projectInFlightRunSnapshot as o, bindChatAbortTerminalDispatch as p, boundInFlightRunSnapshotForChatHistory as r, registerChatAbortController as s, abortChatRunById as t, resolveChatRunExpiresAtMs as u };
