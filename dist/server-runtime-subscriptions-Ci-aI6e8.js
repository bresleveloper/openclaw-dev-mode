import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { n as createLazyPromise } from "./lazy-promise-10KxeiYV.js";
import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { v as resolveStateDir } from "./paths-BMBAvkNf.js";
import { _ as onTrustedToolExecutionEvent } from "./diagnostic-events-JZsXee1S.js";
import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import { t as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-CIiPwqG3.js";
import "./agent-scope-B2Pk_xhT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-A-JGvyXu.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-BxAUeF6t.js";
import { i as getRuntimeConfig } from "./io-DxnOT4sF.js";
import { h as onAgentEvent, i as clearAgentRunContext, m as onAgentAuditEvent } from "./agent-events-CRggPZCM.js";
import { n as onInternalSessionTranscriptUpdate } from "./transcript-events-BMKJWjgY.js";
import { t as isAllowedToolCallName } from "./tool-call-shared-BoRDqDVC.js";
import { a as mergeAgentRunTerminalOutcome, n as buildAgentRunTerminalOutcome, o as normalizeAgentRunTimeoutPhase } from "./agent-run-terminal-outcome-Dv8Iorx2.js";
import { n as onSessionLifecycleEvent } from "./session-lifecycle-events-Ch4Mykew.js";
import { r as onHeartbeatEvent } from "./heartbeat-events-DlT3VAUF.js";
import { c as removeChatAbortControllerEntry } from "./chat-abort-BIKxT7ef.js";
import { r as resolveVisibleActiveSessionRunState } from "./session-active-runs-BhZGmpNB.js";
import { t as mapTaskSummary } from "./task-summary-CnT4L5A1.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import { Worker } from "node:worker_threads";
//#region src/audit/audit-event-writer.ts
/** Non-blocking worker-thread writer for Gateway audit metadata. */
const MAX_PENDING_AUDIT_EVENTS = 4096;
const AUDIT_WRITER_SHUTDOWN_TIMEOUT_MS = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS + 5e3;
function resolveAuditEventWriterUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "audit", "audit-event-writer.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./audit-event-writer.worker${extension}`, currentModuleUrl);
}
/** Start one bounded worker queue. SQLite contention never blocks the agent-event callback. */
function createAuditEventWriter(options = {}) {
	const workerUrl = options.workerUrl ?? resolveAuditEventWriterUrl();
	const sourceWorkerExecArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	const maxPending = Math.max(1, Math.floor(options.maxPending ?? MAX_PENDING_AUDIT_EVENTS));
	let worker;
	try {
		worker = new Worker(workerUrl, {
			workerData: { stateDir: options.stateDir ?? resolveStateDir(process.env) },
			execArgv: sourceWorkerExecArgv
		});
	} catch (error) {
		options.onError?.(error instanceof Error ? error.message : String(error));
		return {
			ready: Promise.resolve(),
			record: () => false,
			stop: async () => {}
		};
	}
	worker.unref?.();
	let pending = 0;
	let stopped = false;
	let unavailable = false;
	let readyResolved = false;
	let resolveReady;
	const ready = new Promise((resolve) => {
		resolveReady = resolve;
	});
	let resolveStop;
	let stopTimer;
	const markReady = () => {
		if (!readyResolved) {
			readyResolved = true;
			resolveReady();
		}
	};
	const finishStop = () => {
		if (stopTimer) {
			clearTimeout(stopTimer);
			stopTimer = void 0;
		}
		const finish = resolveStop;
		resolveStop = void 0;
		finish?.();
	};
	const fail = (error) => {
		options.onError?.(error instanceof Error ? error.message : String(error));
	};
	worker.on("message", (message) => {
		switch (message.type) {
			case "ready":
				markReady();
				return;
			case "recorded":
				pending = Math.max(0, pending - 1);
				return;
			case "record-error":
				pending = Math.max(0, pending - 1);
				fail(message.error);
				return;
			case "maintenance-error":
				fail(message.error);
				return;
			case "stopped":
				pending = 0;
				markReady();
				finishStop();
		}
	});
	worker.on("error", (error) => {
		unavailable = true;
		fail(error);
		markReady();
		finishStop();
	});
	worker.on("exit", (code) => {
		unavailable = true;
		if (!stopped) fail(`audit event writer exited with code ${code}`);
		markReady();
		finishStop();
	});
	return {
		ready,
		record: (input) => {
			if (stopped || unavailable || pending >= maxPending) {
				if (!stopped) fail(unavailable ? "audit event writer is unavailable; dropping metadata" : `audit event queue is full (${maxPending}); dropping metadata`);
				return false;
			}
			pending += 1;
			try {
				worker.postMessage({
					type: "record",
					input
				});
				return true;
			} catch (error) {
				pending -= 1;
				unavailable = true;
				fail(error);
				return false;
			}
		},
		stop: async () => {
			if (stopped) return;
			stopped = true;
			if (unavailable) return;
			await new Promise((resolve) => {
				resolveStop = resolve;
				stopTimer = setTimeout(() => {
					fail("audit event writer shutdown timed out; pending metadata may be lost");
					worker.terminate();
					finishStop();
				}, AUDIT_WRITER_SHUTDOWN_TIMEOUT_MS);
				try {
					worker.postMessage({ type: "stop" });
				} catch (error) {
					fail(error);
					finishStop();
				}
			});
		}
	};
}
//#endregion
//#region src/audit/agent-event-audit.ts
/** Redaction-safe projection from live agent events into durable audit metadata. */
const runProvenance = /* @__PURE__ */ new Map();
const MAX_TRACKED_RUN_PROVENANCE = 1024;
const log = createSubsystemLogger("audit/events");
let persistenceFailureWarned = false;
function nonEmptyString(value) {
	return typeof value === "string" && value.length > 0 ? value : void 0;
}
function auditToolName(value) {
	const toolName = nonEmptyString(value)?.trim();
	if (!toolName) return;
	return isAllowedToolCallName(toolName, null) ? toolName : "unknown";
}
function auditToolCallId(value) {
	const toolCallId = nonEmptyString(value);
	if (!toolCallId) return;
	return `sha256:${createHash("sha256").update(toolCallId).digest("hex")}`;
}
function rememberRunProvenance(runId, provenance) {
	runProvenance.delete(runId);
	runProvenance.set(runId, provenance);
	while (runProvenance.size > MAX_TRACKED_RUN_PROVENANCE) {
		const oldestRunId = runProvenance.keys().next().value;
		if (oldestRunId === void 0) break;
		runProvenance.delete(oldestRunId);
	}
}
function resolveProvenance(runId, event) {
	const remembered = runProvenance.get(runId);
	const sessionKey = nonEmptyString(event.sessionKey) ?? remembered?.sessionKey;
	const sessionId = nonEmptyString(event.sessionId) ?? remembered?.sessionId;
	const eventAgentId = nonEmptyString(event.agentId);
	const sessionAgentId = sessionKey ? parseAgentSessionKey(sessionKey)?.agentId : void 0;
	const agentId = eventAgentId ?? sessionAgentId ?? remembered?.agentId ?? "unknown";
	return {
		actorType: eventAgentId || sessionAgentId ? "agent" : remembered?.actorType ?? "system",
		agentId,
		sessionKey,
		sessionId
	};
}
function resolveToolProvenance(runId, event) {
	const observed = resolveProvenance(runId, event);
	const remembered = runProvenance.get(runId);
	if (!remembered) return observed;
	return {
		...remembered,
		sessionKey: remembered.sessionKey ?? observed.sessionKey,
		sessionId: remembered.sessionId ?? observed.sessionId
	};
}
function classifyRunTerminal(data, phase) {
	const stopReason = nonEmptyString(data.stopReason);
	const timeoutPhase = normalizeAgentRunTimeoutPhase(data.timeoutPhase);
	const terminalStatus = normalizeOptionalLowercaseString(data.status);
	const explicitlyTimedOut = stopReason === "timeout" || timeoutPhase !== void 0 || terminalStatus === "timeout" || terminalStatus === "timed_out";
	const explicitlyCancelled = !explicitlyTimedOut && (data.aborted === true || stopReason === "aborted" || terminalStatus === "cancelled" || terminalStatus === "canceled" || terminalStatus === "aborted");
	const outcome = buildAgentRunTerminalOutcome({
		status: explicitlyTimedOut ? "timeout" : phase === "error" ? "error" : explicitlyCancelled ? "error" : "ok",
		stopReason: explicitlyCancelled && !explicitlyTimedOut ? "stop" : stopReason,
		livenessState: data.livenessState,
		timeoutPhase,
		providerStarted: data.providerStarted,
		startedAt: data.startedAt,
		endedAt: data.endedAt
	});
	if (outcome.reason === "cancelled" || outcome.reason === "aborted") return {
		outcome,
		status: "cancelled",
		errorCode: "run_cancelled"
	};
	if (outcome.reason === "hard_timeout" || outcome.reason === "timed_out") return {
		outcome,
		status: "timed_out",
		errorCode: "run_timed_out"
	};
	if (outcome.reason === "blocked") return {
		outcome,
		status: "blocked",
		errorCode: "run_blocked"
	};
	return outcome.reason === "completed" ? {
		outcome,
		status: "succeeded"
	} : {
		outcome,
		status: "failed",
		errorCode: "run_failed"
	};
}
function projectAgentEvent(event) {
	const runId = nonEmptyString(event.runId);
	const phase = nonEmptyString(event.data.phase);
	if (!runId || !phase) return;
	const provenance = resolveProvenance(runId, event);
	if (event.stream === "lifecycle" && phase === "start") {
		rememberRunProvenance(runId, provenance);
		return { input: {
			sourceSequence: event.seq,
			occurredAt: asDateTimestampMs(event.data.startedAt) ?? event.ts,
			kind: "agent_run",
			action: "agent.run.started",
			status: "started",
			actorType: provenance.actorType,
			actorId: provenance.agentId,
			agentId: provenance.agentId,
			...provenance.sessionKey ? { sessionKey: provenance.sessionKey } : {},
			...provenance.sessionId ? { sessionId: provenance.sessionId } : {},
			runId
		} };
	}
	if (event.stream === "lifecycle" && (phase === "end" || phase === "error")) {
		rememberRunProvenance(runId, provenance);
		const { outcome, ...terminal } = classifyRunTerminal(event.data, phase);
		return {
			input: {
				sourceSequence: event.seq,
				occurredAt: asDateTimestampMs(event.data.endedAt) ?? event.ts,
				kind: "agent_run",
				action: "agent.run.finished",
				...terminal,
				actorType: provenance.actorType,
				actorId: provenance.agentId,
				agentId: provenance.agentId,
				...provenance.sessionKey ? { sessionKey: provenance.sessionKey } : {},
				...provenance.sessionId ? { sessionId: provenance.sessionId } : {},
				runId
			},
			terminal: {
				outcome,
				phase
			}
		};
	}
}
/** Project the complete trusted tool-execution lifecycle without private diagnostic content. */
function projectToolExecutionEventToAudit(event) {
	if (event.type === "tool.execution.blocked" && event.deniedReason === "unsupported_tool_schema" && !nonEmptyString(event.toolCallId)) return;
	const runId = nonEmptyString(event.runId);
	const toolName = auditToolName(event.toolName);
	if (!runId || !toolName) return;
	const toolCallId = auditToolCallId(event.toolCallId);
	const provenance = resolveToolProvenance(runId, event);
	const errorCategory = event.type === "tool.execution.error" ? normalizeOptionalLowercaseString(event.errorCategory) : void 0;
	const terminalReason = event.type === "tool.execution.error" ? event.terminalReason : void 0;
	const diagnosticErrorCode = event.type === "tool.execution.error" ? normalizeOptionalLowercaseString(event.errorCode) : void 0;
	const toolCancelled = terminalReason === "cancelled" || terminalReason === void 0 && (errorCategory === "aborted" || errorCategory === "aborterror" || errorCategory === "cancelled" || errorCategory === "canceled");
	const toolTimedOut = terminalReason === "timed_out";
	const terminal = event.type === "tool.execution.started" ? { status: "started" } : event.type === "tool.execution.completed" ? { status: "succeeded" } : event.type === "tool.execution.blocked" ? {
		status: "blocked",
		errorCode: "tool_blocked"
	} : diagnosticErrorCode === "tool_outcome_unknown" ? {
		status: "unknown",
		errorCode: "tool_outcome_unknown"
	} : toolCancelled ? {
		status: "cancelled",
		errorCode: "tool_cancelled"
	} : toolTimedOut ? {
		status: "timed_out",
		errorCode: "tool_timed_out"
	} : {
		status: "failed",
		errorCode: "tool_failed"
	};
	return {
		sourceSequence: event.seq,
		occurredAt: asDateTimestampMs(event.sourceTimestampMs) ?? event.ts,
		kind: "tool_action",
		action: event.type === "tool.execution.started" ? "tool.action.started" : "tool.action.finished",
		...terminal,
		actorType: provenance.actorType,
		actorId: provenance.agentId,
		agentId: provenance.agentId,
		...provenance.sessionKey ? { sessionKey: provenance.sessionKey } : {},
		...provenance.sessionId ? { sessionId: provenance.sessionId } : {},
		runId,
		...toolCallId ? { toolCallId } : {},
		toolName
	};
}
/** Create the Gateway-owned non-blocking audit projection and persistence handle. */
function createAgentEventAuditRecorder(options) {
	const writer = options?.writer ?? createAuditEventWriter({
		...options?.stateDir ? { stateDir: options.stateDir } : {},
		onError: (error) => {
			if (!persistenceFailureWarned) {
				persistenceFailureWarned = true;
				log.warn(`audit event persistence failed: ${error}`);
			}
		}
	});
	const terminalSettleMs = Math.max(0, Math.floor(options?.terminalSettleMs ?? 15e3));
	const pendingTerminals = /* @__PURE__ */ new Map();
	const openRunInstances = /* @__PURE__ */ new Set();
	const settledRunInstances = /* @__PURE__ */ new Set();
	const rememberSettled = (runInstance) => {
		settledRunInstances.delete(runInstance);
		settledRunInstances.add(runInstance);
		if (settledRunInstances.size > MAX_TRACKED_RUN_PROVENANCE) {
			const oldest = settledRunInstances.values().next().value;
			if (oldest !== void 0) settledRunInstances.delete(oldest);
		}
	};
	const clearPending = (runInstance) => {
		const pending = pendingTerminals.get(runInstance);
		if (!pending) return;
		clearTimeout(pending.timer);
		pendingTerminals.delete(runInstance);
	};
	const flushPending = (runInstance) => {
		const pending = pendingTerminals.get(runInstance);
		if (!pending) return;
		clearPending(runInstance);
		openRunInstances.delete(runInstance);
		if (writer.record(pending.input)) rememberSettled(runInstance);
	};
	const scheduleTerminal = (runInstance, incoming) => {
		const existing = pendingTerminals.get(runInstance);
		let selected = incoming;
		if (existing) {
			if (existing.phase === "error" && incoming.phase === "end" && incoming.outcome.reason === "completed") selected = existing;
			else selected = mergeAgentRunTerminalOutcome(existing.outcome, incoming.outcome) === existing.outcome ? existing : incoming;
			clearTimeout(existing.timer);
		}
		const timer = setTimeout(() => flushPending(runInstance), terminalSettleMs);
		timer.unref?.();
		pendingTerminals.delete(runInstance);
		pendingTerminals.set(runInstance, {
			...selected,
			timer
		});
		if (pendingTerminals.size > MAX_TRACKED_RUN_PROVENANCE) {
			const oldest = pendingTerminals.keys().next().value;
			if (oldest !== void 0) flushPending(oldest);
		}
	};
	return {
		record: (event) => {
			const projection = projectAgentEvent(event);
			if (!projection) return;
			const runInstance = `${event.lifecycleGeneration ?? "unknown"}\0${event.runId}`;
			if (!projection.terminal) {
				const alreadyOpen = openRunInstances.has(runInstance);
				clearPending(runInstance);
				settledRunInstances.delete(runInstance);
				if (alreadyOpen) return;
				openRunInstances.add(runInstance);
				writer.record(projection.input);
				return;
			}
			if (settledRunInstances.has(runInstance)) return;
			if (projection.terminal.outcome.reason === "completed" && !pendingTerminals.has(runInstance)) {
				openRunInstances.delete(runInstance);
				if (writer.record(projection.input)) rememberSettled(runInstance);
				return;
			}
			scheduleTerminal(runInstance, {
				input: projection.input,
				...projection.terminal
			});
		},
		recordTool: (event) => {
			const input = projectToolExecutionEventToAudit(event);
			if (input) writer.record(input);
		},
		stop: async () => {
			for (const runInstance of pendingTerminals.keys()) flushPending(runInstance);
			await writer.stop();
		}
	};
}
//#endregion
//#region src/audit/audit-config.ts
/**
* The ledger is on by default: an audit trail enabled only after an incident
* cannot explain the incident. `audit.enabled: false` stops new writes;
* existing records remain readable through `audit.list` until they expire.
*/
function isAuditLedgerEnabled(cfg) {
	return cfg?.audit?.enabled !== false;
}
//#endregion
//#region src/gateway/server-runtime-subscriptions.ts
function dispatchEventHandler(params) {
	params.loadHandler().then((handler) => handler(params.event)).catch((error) => {
		params.log.warn(params.failureMessage, {
			...params.context,
			error
		});
	});
}
/** Register gateway runtime event subscriptions and return unsubscribe handles. */
function startGatewayEventSubscriptions(params) {
	const auditRecorder = isAuditLedgerEnabled(getRuntimeConfig()) ? createAgentEventAuditRecorder() : void 0;
	const unsubscribePrivateAuditEvents = auditRecorder ? onAgentAuditEvent(auditRecorder.record) : void 0;
	const unsubscribeToolAuditEvents = auditRecorder ? onTrustedToolExecutionEvent(auditRecorder.recordTool) : void 0;
	const getAgentEventHandler = createLazyPromise(() => {
		return Promise.all([import("./server-chat--hM5PKDB.js"), import("./server-session-key-DX9VlRBW.js")]).then(([{ createAgentEventHandler }, { resolveSessionKeyForRun }]) => createAgentEventHandler({
			broadcast: params.broadcast,
			broadcastToConnIds: params.broadcastToConnIds,
			nodeSendToSession: params.nodeSendToSession,
			agentRunSeq: params.agentRunSeq,
			chatRunState: params.chatRunState,
			resolveSessionKeyForRun,
			clearAgentRunContext,
			toolEventRecipients: params.toolEventRecipients,
			sessionEventSubscribers: params.sessionEventSubscribers,
			sessionMessageSubscribers: params.sessionMessageSubscribers,
			updateRunToolErrorSummary: ({ runId, clientRunId, summary }) => {
				for (const candidateRunId of /* @__PURE__ */ new Set([runId, clientRunId])) {
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) entry.toolErrorSummary = summary;
				}
			},
			clearTrackedActiveRun: ({ runId, clientRunId }) => {
				const candidateRunIds = runId === clientRunId ? [runId] : [runId, clientRunId];
				for (const candidateRunId of candidateRunIds) {
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) {
						entry.projectSessionActive = false;
						entry.projectSessionTerminalPending = false;
						entry.projectSessionTerminalPersisted = false;
						queueMicrotask(() => {
							if (params.chatAbortControllers.get(candidateRunId) === entry && entry.registrationCleanupRequested === true && !entry.projectSessionTerminalPersistence) removeChatAbortControllerEntry(params.chatAbortControllers, candidateRunId, entry);
						});
					}
				}
			},
			markTrackedRunTerminalPersisted: ({ runId, clientRunId }) => {
				const candidateRunIds = runId === clientRunId ? [runId] : [runId, clientRunId];
				for (const candidateRunId of candidateRunIds) {
					params.restartRecoveryCandidates.delete(candidateRunId);
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) {
						entry.projectSessionTerminalPending = false;
						entry.projectSessionTerminalPersisted = true;
						entry.projectSessionTerminalPersistence = void 0;
					}
				}
			},
			trackTrackedRunTerminalPersistence: ({ runId, clientRunId, sessionId: terminalSessionId, observedAt, persistence }) => {
				const candidateRunIds = runId === clientRunId ? [runId] : [runId, clientRunId];
				for (const candidateRunId of candidateRunIds) {
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) {
						entry.projectSessionTerminalPending = false;
						entry.projectSessionTerminalPersistence = persistence;
						if (entry.registrationCleanupRequested === true) persistence.catch(() => void 0).then(() => {
							if (params.chatAbortControllers.get(candidateRunId) === entry) removeChatAbortControllerEntry(params.chatAbortControllers, candidateRunId, entry);
						});
						const lifecycleGeneration = entry.lifecycleGeneration?.trim();
						const sessionKey = entry.sessionKey.trim();
						const sessionId = terminalSessionId?.trim() || entry.sessionId.trim();
						if (entry.controlUiVisible !== false && lifecycleGeneration && sessionKey && sessionId) persistence.catch(() => {
							params.restartRecoveryCandidates.set(candidateRunId, {
								runId: candidateRunId,
								lifecycleGeneration,
								sessionKey,
								sessionId,
								observedAt
							});
						});
					}
				}
			},
			isChatSendRunActive: (runId) => {
				const entry = params.chatAbortControllers.get(runId);
				return entry !== void 0 && entry.kind !== "agent";
			},
			resolveActiveLifecycleGenerationForRun: (runId) => params.chatAbortControllers.get(runId)?.lifecycleGeneration,
			resolveSessionActiveRunState: (session) => resolveVisibleActiveSessionRunState({
				context: params,
				...session,
				defaultAgentId: resolveDefaultAgentId(getRuntimeConfig())
			})
		}));
	}, { cacheRejections: true });
	const getSessionEventsModule = createLazyPromise(() => import("./server-session-events-BDghXkGL.js"), { cacheRejections: true });
	let transcriptUpdateHandlerPromise = null;
	const getTranscriptUpdateHandler = () => {
		transcriptUpdateHandlerPromise ??= getSessionEventsModule().then(({ createTranscriptUpdateBroadcastHandler }) => createTranscriptUpdateBroadcastHandler({
			broadcastToConnIds: params.broadcastToConnIds,
			sessionEventSubscribers: params.sessionEventSubscribers,
			sessionMessageSubscribers: params.sessionMessageSubscribers,
			chatAbortControllers: params.chatAbortControllers
		}));
		return transcriptUpdateHandlerPromise;
	};
	let lifecycleEventHandlerPromise = null;
	const getLifecycleEventHandler = () => {
		lifecycleEventHandlerPromise ??= getSessionEventsModule().then(({ createLifecycleEventBroadcastHandler }) => createLifecycleEventBroadcastHandler({
			broadcastToConnIds: params.broadcastToConnIds,
			sessionEventSubscribers: params.sessionEventSubscribers,
			chatAbortControllers: params.chatAbortControllers
		}));
		return lifecycleEventHandlerPromise;
	};
	const unsubscribeAgentEvents = onAgentEvent((evt) => {
		auditRecorder?.record(evt);
		const lifecyclePhase = evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : void 0;
		if (lifecyclePhase === "end" || lifecyclePhase === "error") {
			const clientRunId = params.chatRunState.registry.peek(evt.runId)?.clientRunId ?? evt.runId;
			const candidateRunIds = evt.runId === clientRunId ? [evt.runId] : [evt.runId, clientRunId];
			for (const candidateRunId of candidateRunIds) {
				const entry = params.chatAbortControllers.get(candidateRunId);
				const eventLifecycleGeneration = evt.lifecycleGeneration?.trim();
				if (entry && (!eventLifecycleGeneration || !entry.lifecycleGeneration || entry.lifecycleGeneration === eventLifecycleGeneration)) {
					entry.projectSessionTerminalPending = true;
					entry.projectSessionTerminalObservedAt = typeof evt.data.endedAt === "number" && Number.isFinite(evt.data.endedAt) ? evt.data.endedAt : evt.ts;
				}
			}
		} else if (lifecyclePhase === "start") {
			const clientRunId = params.chatRunState.registry.peek(evt.runId)?.clientRunId ?? evt.runId;
			const candidateRunIds = evt.runId === clientRunId ? [evt.runId] : [evt.runId, clientRunId];
			const eventLifecycleGeneration = evt.lifecycleGeneration?.trim();
			for (const candidateRunId of candidateRunIds) {
				const entry = params.chatAbortControllers.get(candidateRunId);
				if (entry && (!eventLifecycleGeneration || !entry.lifecycleGeneration || entry.lifecycleGeneration === eventLifecycleGeneration)) {
					entry.projectSessionTerminalPending = false;
					entry.projectSessionTerminalObservedAt = void 0;
				}
			}
		}
		dispatchEventHandler({
			loadHandler: getAgentEventHandler,
			event: evt,
			log: params.log,
			failureMessage: "Agent event dispatch failed",
			context: {
				runId: evt.runId,
				stream: evt.stream
			}
		});
	});
	const agentUnsub = async () => {
		unsubscribeAgentEvents();
		unsubscribePrivateAuditEvents?.();
		unsubscribeToolAuditEvents?.();
		await auditRecorder?.stop();
	};
	const heartbeatUnsub = onHeartbeatEvent((evt) => {
		params.broadcast("heartbeat", evt, { dropIfSlow: true });
	});
	const transcriptUnsub = onInternalSessionTranscriptUpdate((evt) => {
		dispatchEventHandler({
			loadHandler: getTranscriptUpdateHandler,
			event: evt,
			log: params.log,
			failureMessage: "Transcript update dispatch failed",
			context: { sessionKey: evt.sessionKey }
		});
	});
	const lifecycleUnsub = onSessionLifecycleEvent((evt) => {
		dispatchEventHandler({
			loadHandler: getLifecycleEventHandler,
			event: evt,
			log: params.log,
			failureMessage: "Lifecycle event dispatch failed",
			context: { sessionKey: evt.sessionKey }
		});
	});
	let taskObserverDisposed = false;
	const taskObservers = { onEvent: (event) => {
		let payload;
		switch (event.kind) {
			case "upserted":
				payload = {
					action: "upserted",
					task: mapTaskSummary(event.task)
				};
				break;
			case "deleted":
				payload = {
					action: "deleted",
					taskId: event.taskId
				};
				break;
			case "restored":
				payload = { action: "restored" };
				break;
		}
		params.broadcast("task", payload, { dropIfSlow: true });
	} };
	const taskObserverRuntimePromise = import("./task-registry.store-B47fV4EE.js").then((module) => {
		if (!taskObserverDisposed) module.configureTaskRegistryRuntime({ observers: taskObservers });
		return module;
	});
	taskObserverRuntimePromise.catch((error) => {
		params.log.warn("Task registry observer registration failed", { error });
	});
	const taskUnsub = () => {
		taskObserverDisposed = true;
		return taskObserverRuntimePromise.then((module) => {
			if (module.getTaskRegistryObservers() === taskObservers) module.configureTaskRegistryRuntime({ observers: null });
		}).catch(() => void 0);
	};
	return {
		agentUnsub,
		heartbeatUnsub,
		transcriptUnsub,
		lifecycleUnsub,
		taskUnsub
	};
}
//#endregion
export { startGatewayEventSubscriptions };
