import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as normalizeOptionalLowercaseString, h as readNonEmptyStringPreservingWhitespace } from "./string-coerce-CIXf7egm.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import { n as isAllowedToolCallName } from "./tool-call-shared-B1OM3EZi.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { n as isExecutionIdentityCollectionEnabled, r as resolveAuditMessageMode, t as isAuditLedgerEnabled } from "./audit-config-BXFCjLO0.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { t as mergeAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-merge-DXNYLPhQ.mjs";
import { n as parseExecutionDecisionWork } from "./execution-decision-work-2rlltydX.mjs";
import { n as formatAuditWriterRequestError, t as formatAuditWriterError } from "./audit-event-writer.errors-D1EE-LzM.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/audit/agent-event-audit.ts
/** Redaction-safe projection from live agent events into durable audit metadata. */
const MAX_TRACKED_RUN_INSTANCES = 1024;
function auditToolName(value) {
	const toolName = readNonEmptyStringPreservingWhitespace(value)?.trim();
	if (!toolName) return;
	return isAllowedToolCallName(toolName, null) ? toolName : "unknown";
}
function auditToolCallId(value) {
	const toolCallId = readNonEmptyStringPreservingWhitespace(value);
	if (!toolCallId) return;
	return `sha256:${createHash("sha256").update(toolCallId).digest("hex")}`;
}
function legacyAuditSourceId(params) {
	return `${params.runId}:${params.sourceSequence}:${params.occurredAt}:${params.action}`;
}
function projectExplicitAttribution(event) {
	const eventAgentId = readNonEmptyStringPreservingWhitespace(event.agentId);
	return {
		actorType: eventAgentId ? "agent" : "system",
		agentId: eventAgentId ?? "unknown",
		sessionKey: readNonEmptyStringPreservingWhitespace(event.sessionKey),
		sessionId: readNonEmptyStringPreservingWhitespace(event.sessionId)
	};
}
const AUDIT_TERMINAL_BY_CLASSIFICATION = {
	success: { status: "succeeded" },
	timeout: {
		status: "timed_out",
		errorCode: "run_timed_out"
	},
	cancellation: {
		status: "cancelled",
		errorCode: "run_cancelled"
	},
	failure: {
		status: "failed",
		errorCode: "run_failed"
	}
};
function classifyRunTerminal(data, phase) {
	const outcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase,
		data
	});
	if (outcome.reason === "blocked") return {
		outcome,
		status: "blocked",
		errorCode: "run_blocked"
	};
	return {
		outcome,
		...AUDIT_TERMINAL_BY_CLASSIFICATION[classifyAgentRunTerminalOutcome(outcome)]
	};
}
function projectAgentEvent(event) {
	const runId = readNonEmptyStringPreservingWhitespace(event.runId);
	const phase = readNonEmptyStringPreservingWhitespace(event.data.phase);
	if (!runId || !phase) return;
	const provenance = projectExplicitAttribution(event);
	if (event.stream === "lifecycle" && phase === "start") {
		const occurredAt = asDateTimestampMs(event.data.startedAt) ?? event.ts;
		const action = "agent.run.started";
		return { input: {
			sourceId: legacyAuditSourceId({
				runId,
				sourceSequence: event.seq,
				occurredAt,
				action
			}),
			sourceSequence: event.seq,
			occurredAt,
			kind: "agent_run",
			action,
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
		const { outcome, ...terminal } = classifyRunTerminal(event.data, phase);
		const occurredAt = asDateTimestampMs(event.data.endedAt) ?? event.ts;
		const action = "agent.run.finished";
		return {
			input: {
				sourceId: legacyAuditSourceId({
					runId,
					sourceSequence: event.seq,
					occurredAt,
					action
				}),
				sourceSequence: event.seq,
				occurredAt,
				kind: "agent_run",
				action,
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
	if (event.type === "tool.execution.blocked" && event.deniedReason === "unsupported_tool_schema" && !readNonEmptyStringPreservingWhitespace(event.toolCallId)) return;
	const runId = readNonEmptyStringPreservingWhitespace(event.runId);
	const toolName = auditToolName(event.toolName);
	if (!runId || !toolName) return;
	const toolCallId = auditToolCallId(event.toolCallId);
	const provenance = projectExplicitAttribution(event);
	const occurredAt = asDateTimestampMs(event.sourceTimestampMs) ?? event.ts;
	const attribution = {
		sourceSequence: event.seq,
		occurredAt,
		kind: "tool_action",
		actorType: provenance.actorType,
		actorId: provenance.agentId,
		agentId: provenance.agentId,
		...provenance.sessionKey ? { sessionKey: provenance.sessionKey } : {},
		...provenance.sessionId ? { sessionId: provenance.sessionId } : {},
		runId,
		...toolCallId ? { toolCallId } : {},
		toolName
	};
	if (event.type === "tool.execution.started") {
		const action = "tool.action.started";
		return {
			sourceId: legacyAuditSourceId({
				runId,
				sourceSequence: event.seq,
				occurredAt,
				action
			}),
			...attribution,
			action,
			status: "started"
		};
	}
	const errorCategory = event.type === "tool.execution.error" ? normalizeOptionalLowercaseString(event.errorCategory) : void 0;
	const terminalReason = event.type === "tool.execution.error" ? event.terminalReason : void 0;
	const diagnosticErrorCode = event.type === "tool.execution.error" ? normalizeOptionalLowercaseString(event.errorCode) : void 0;
	const toolCancelled = terminalReason === "cancelled" || terminalReason === void 0 && (errorCategory === "aborted" || errorCategory === "aborterror" || errorCategory === "cancelled" || errorCategory === "canceled");
	const toolTimedOut = terminalReason === "timed_out";
	const terminal = event.type === "tool.execution.completed" ? { status: "succeeded" } : event.type === "tool.execution.blocked" ? {
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
	const action = "tool.action.finished";
	return {
		sourceId: legacyAuditSourceId({
			runId,
			sourceSequence: event.seq,
			occurredAt,
			action
		}),
		...attribution,
		action,
		...terminal
	};
}
/** Create the Gateway-owned non-blocking audit projection and persistence handle. */
function createAgentEventAuditRecorder(options) {
	const { writer } = options;
	const terminalSettleMs = Math.max(0, Math.floor(options.terminalSettleMs ?? 15e3));
	const pendingTerminals = /* @__PURE__ */ new Map();
	const openRunInstances = /* @__PURE__ */ new Set();
	const settledRunInstances = /* @__PURE__ */ new Set();
	const rememberSettled = (runInstance) => {
		settledRunInstances.delete(runInstance);
		settledRunInstances.add(runInstance);
		if (settledRunInstances.size > MAX_TRACKED_RUN_INSTANCES) {
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
		if (pendingTerminals.size > MAX_TRACKED_RUN_INSTANCES) {
			const oldest = pendingTerminals.keys().next().value;
			if (oldest !== void 0) flushPending(oldest);
		}
	};
	return {
		record: (event) => {
			const runInstance = `${event.lifecycleGeneration ?? "unknown"}\0${event.runId}`;
			if (!isAuditLedgerEnabled(options.getConfig())) {
				openRunInstances.delete(runInstance);
				return;
			}
			const projection = projectAgentEvent(event);
			if (!projection) return;
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
			if (!isAuditLedgerEnabled(options.getConfig())) return;
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
//#region src/audit/audit-event-writer.ts
const MAX_PENDING_AUDIT_EVENTS = 4096;
const AUDIT_MAINTENANCE_INTERVAL_MS = 36e5;
const AUDIT_LOCK_RETRY_DELAY_MS = 25;
const AUDIT_LOCK_RETRY_MAX_DELAY_MS = 1e3;
const AUDIT_LOCK_CONTENTION_REPORT_MS = 1e3;
const AUDIT_WRITER_SHUTDOWN_TIMEOUT_MS = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS + 5e3;
/** Start one bounded queue; retain the owner environment or claimed state rejects its writes. */
function createAuditEventWriter(options = {}) {
	const database = { env: {
		...process.env,
		OPENCLAW_STATE_DIR: options.stateDir ?? resolveStateDir(process.env)
	} };
	const maxPending = Math.max(1, Math.floor(options.maxPending ?? MAX_PENDING_AUDIT_EVENTS));
	const queue = [];
	let stopped = false;
	let draining = false;
	let shutdownExpired = false;
	let unavailable = false;
	let maintenancePending = true;
	let readyPending = true;
	let scheduled;
	let retryTimer;
	let lockRetryAttempt = 0;
	let lockContentionDelayMs = 0;
	let lockContentionReported = false;
	let resolveReady;
	const ready = new Promise((resolve) => {
		resolveReady = resolve;
	});
	let stopPromise;
	let resolveStop;
	let stopTimer;
	const fail = (error) => {
		options.onError?.(formatAuditWriterError(error));
	};
	const reportContention = (message) => {
		options.onContention?.(formatAuditWriterError(message));
	};
	const execute = async (command) => {
		const context = captureOpenClawStateWorkerContext(database);
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
		if (shutdownExpired) return { status: "settled" };
		return await runOpenClawStateWorkerOperation(context, (scope) => shutdownExpired ? Promise.resolve({ status: "settled" }) : scope.execute(command), { existingOnly: true }) ?? runOpenClawStateWorkerOperation(context, (scope) => shutdownExpired ? Promise.resolve({ status: "settled" }) : scope.execute(command));
	};
	const observeLockContention = () => {
		lockRetryAttempt += 1;
	};
	const resetLockContention = () => {
		lockRetryAttempt = 0;
		lockContentionDelayMs = 0;
		lockContentionReported = false;
	};
	const reportMaintenance = async () => {
		let more = false;
		for (const family of [
			"events",
			"identity",
			"decisions",
			"progress"
		]) {
			if (shutdownExpired) break;
			try {
				const result = await execute({
					type: "audit.writer.prune",
					input: family
				});
				if (result.status === "retry") {
					observeLockContention();
					return "retry";
				}
				if (result.error !== void 0) fail(result.error);
				more = (result.deleted ?? 0) > 0 || more;
			} catch (error) {
				fail(error);
			}
		}
		return more ? "more" : "settled";
	};
	const processRequest = async (request) => {
		try {
			return await execute({
				type: "audit.writer.process",
				input: request
			});
		} catch (error) {
			return {
				status: "settled",
				error: formatAuditWriterRequestError(request, error)
			};
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
	const schedule = () => {
		if (draining || shutdownExpired) return;
		if (retryTimer) {
			if (stopped) retryTimer.ref?.();
			return;
		}
		if (scheduled) {
			if (stopped) scheduled.ref?.();
			return;
		}
		scheduled = setImmediate(() => {
			drainOne();
		});
		if (!stopped) scheduled.unref?.();
	};
	const scheduleRetry = () => {
		const delayMs = Math.min(AUDIT_LOCK_RETRY_MAX_DELAY_MS, AUDIT_LOCK_RETRY_DELAY_MS * 2 ** Math.min(6, Math.max(0, lockRetryAttempt - 1)));
		lockContentionDelayMs += delayMs;
		if (!lockContentionReported && lockContentionDelayMs >= AUDIT_LOCK_CONTENTION_REPORT_MS) {
			lockContentionReported = true;
			reportContention("audit event persistence delayed by SQLite lock contention");
		}
		retryTimer = setTimeout(() => {
			retryTimer = void 0;
			drainOne();
		}, delayMs);
		if (!stopped) retryTimer.unref?.();
	};
	async function drainOne() {
		scheduled = void 0;
		if (draining || shutdownExpired) return;
		draining = true;
		let retry = false;
		try {
			if (maintenancePending) {
				maintenancePending = false;
				const maintenance = await reportMaintenance();
				if (readyPending) {
					readyPending = false;
					resolveReady();
				}
				maintenancePending ||= maintenance !== "settled";
				if (maintenance === "retry") {
					retry = true;
					return;
				}
				resetLockContention();
			}
			if (shutdownExpired) return;
			const request = queue[0];
			if (request) {
				const result = await processRequest(request);
				if (result.status === "retry") {
					observeLockContention();
					retry = true;
				} else {
					queue.shift();
					resetLockContention();
					if (result.error !== void 0) fail(result.error);
				}
			}
		} finally {
			draining = false;
			if (shutdownExpired) finishStop();
			else if (retry) scheduleRetry();
			else if (queue.length > 0 || maintenancePending) schedule();
			else if (stopped) finishStop();
		}
	}
	const maintenanceTimer = setInterval(() => {
		maintenancePending = true;
		schedule();
	}, AUDIT_MAINTENANCE_INTERVAL_MS);
	maintenanceTimer.unref?.();
	schedule();
	const enqueue = (message) => {
		if (stopped || unavailable || queue.length >= maxPending) {
			if (!stopped) fail(unavailable ? "audit event writer is unavailable; dropping metadata" : `audit event queue is full (${maxPending}); dropping metadata`);
			return false;
		}
		try {
			const boundedMessage = message.type === "record-execution-decision-work" ? {
				...message,
				work: parseExecutionDecisionWork(message.work)
			} : message;
			queue.push(structuredClone(boundedMessage));
			schedule();
			return true;
		} catch (error) {
			if (message.type !== "record-event") fail(message.type === "record-execution-identity" ? "audit execution identity envelope could not be queued" : "audit execution decision receipt could not be queued");
			else {
				unavailable = true;
				fail(error);
			}
			return false;
		}
	};
	return {
		ready,
		record: (input) => enqueue({
			type: "record-event",
			input
		}),
		recordExecutionIdentity: (work) => enqueue({
			type: "record-execution-identity",
			work
		}),
		recordExecutionDecision: (receipt) => enqueue({
			type: "record-execution-decision",
			receipt
		}),
		recordExecutionDecisionWork: (work) => enqueue({
			type: "record-execution-decision-work",
			work
		}),
		stop: () => {
			if (stopPromise) return stopPromise;
			stopped = true;
			clearInterval(maintenanceTimer);
			maintenancePending = true;
			stopPromise = new Promise((resolve) => {
				resolveStop = resolve;
				stopTimer = setTimeout(() => {
					shutdownExpired = true;
					maintenancePending = false;
					queue.length = 0;
					if (scheduled) {
						clearImmediate(scheduled);
						scheduled = void 0;
					}
					if (retryTimer) {
						clearTimeout(retryTimer);
						retryTimer = void 0;
					}
					fail("audit event writer shutdown timed out; pending metadata may be lost");
					if (readyPending && !draining) {
						readyPending = false;
						resolveReady();
					}
					if (!draining) finishStop();
				}, AUDIT_WRITER_SHUTDOWN_TIMEOUT_MS);
				stopTimer.unref?.();
				schedule();
			});
			return stopPromise;
		}
	};
}
//#endregion
//#region src/audit/audit-recorder.ts
/** Gateway-owned recorder joining trusted run, tool, and message lifecycle streams. */
const log = createSubsystemLogger("audit/events");
let persistenceFailureWarned = false;
function createAuditEventRecorder(options) {
	let nextAcceptedMessageSequence = 0;
	const writer = options.writer ?? createAuditEventWriter({
		...options.stateDir ? { stateDir: options.stateDir } : {},
		onContention: (message) => log.warn(message),
		onError: (error) => {
			if (!persistenceFailureWarned) {
				persistenceFailureWarned = true;
				log.warn(`audit event persistence failed: ${error}`);
			}
		}
	});
	return {
		...createAgentEventAuditRecorder({
			writer,
			getConfig: options.getConfig,
			terminalSettleMs: options.terminalSettleMs
		}),
		recordExecutionIdentity: (work) => isExecutionIdentityCollectionEnabled(options.getConfig()) && writer.recordExecutionIdentity(work),
		recordExecutionDecision: (receipt) => isExecutionIdentityCollectionEnabled(options.getConfig()) && writer.recordExecutionDecision(receipt),
		recordExecutionDecisionWork: (work) => isExecutionIdentityCollectionEnabled(options.getConfig()) && writer.recordExecutionDecisionWork(work),
		recordMessage: (event) => {
			const config = options.getConfig();
			const messageMode = resolveAuditMessageMode(config);
			if (!isAuditLedgerEnabled(config) || messageMode === "off") return;
			if (messageMode === "direct" && event.conversationKind !== "direct") return;
			nextAcceptedMessageSequence += 1;
			writer.record({
				...event,
				sourceId: event.sourceId?.trim() || `message:${randomUUID()}`,
				sourceSequence: nextAcceptedMessageSequence
			});
		}
	};
}
//#endregion
export { createAuditEventRecorder as t };
