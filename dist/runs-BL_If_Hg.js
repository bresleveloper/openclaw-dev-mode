import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
import { a as markDiagnosticEmbeddedRunStarted, i as markDiagnosticEmbeddedRunEnded } from "./diagnostic-run-activity-dlxgTFfd.js";
import { S as isReplyRunStreamingForSessionId, _ as abortReplyRunBySessionId, a as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE, b as isReplyRunAbortableForCompaction, c as EMBEDDED_RUN_WAITERS, g as abortActiveReplyRuns, i as ACTIVE_EMBEDDED_RUNS, k as waitForReplyRunEndBySessionId, l as getActiveEmbeddedRunCount, n as ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE, o as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, r as ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY, s as ACTIVE_EMBEDDED_RUN_SNAPSHOTS, t as ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID, w as queueReplyRunMessage, x as isReplyRunActiveForSessionId, y as forceClearReplyRunBySessionId } from "./run-state-BS-BPKdq.js";
import { d as logSessionStateChange, s as logMessageQueued, w as updateDiagnosticSessionFile } from "./diagnostic-DMzd1_zu.js";
import { t as diagnosticLogger } from "./diagnostic-runtime-CbuKHwGn.js";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/embedded-agent-runner/session-file-key.ts
/**
* Resolves stable keys for embedded session transcript files.
*/
function resolveEmbeddedSessionFileKey(sessionFile) {
	const resolvedSessionFile = path.resolve(sessionFile);
	const realpathSync = fs.realpathSync.native ?? fs.realpathSync;
	try {
		return realpathSync(resolvedSessionFile);
	} catch {}
	const sessionDir = path.dirname(resolvedSessionFile);
	try {
		return path.join(realpathSync(sessionDir), path.basename(resolvedSessionFile));
	} catch {
		return resolvedSessionFile;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/runs.ts
/**
* Manages active embedded-agent run handles, queues, aborts, and waiters.
*/
function createQueueFailureOutcome(sessionId, reason, errorMessage) {
	return {
		queued: false,
		sessionId,
		reason,
		gatewayHealth: "live",
		...errorMessage ? { errorMessage } : {}
	};
}
function formatEmbeddedAgentQueueFailureSummary(outcome) {
	if (outcome.queued) return;
	const errorPart = outcome.errorMessage ? ` error=${outcome.errorMessage}` : "";
	return `queue_message_failed reason=${outcome.reason} sessionId=${outcome.sessionId} gatewayHealth=${outcome.gatewayHealth}${errorPart}`;
}
function setActiveRunSessionKey(sessionKey, sessionId) {
	const normalizedSessionKey = sessionKey?.trim();
	if (!normalizedSessionKey) return;
	ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.set(normalizedSessionKey, sessionId);
}
function clearActiveRunSessionKeys(sessionId, sessionKey) {
	const normalizedSessionKey = sessionKey?.trim();
	if (normalizedSessionKey) {
		if (ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey) === sessionId) ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.delete(normalizedSessionKey);
		return;
	}
	for (const [key, activeSessionId] of ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY) if (activeSessionId === sessionId) ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.delete(key);
}
function setActiveRunSessionFile(sessionFile, sessionId) {
	if (!sessionFile?.trim()) return;
	ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.set(resolveEmbeddedSessionFileKey(sessionFile), sessionId);
}
function clearEmbeddedRunAbandonmentBySessionId(sessionId) {
	const abandonedRun = ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.get(sessionId);
	if (!abandonedRun) return;
	ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.delete(sessionId);
	const normalizedSessionKey = abandonedRun.sessionKey?.trim();
	if (normalizedSessionKey && ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey) === sessionId) ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY.delete(normalizedSessionKey);
	const normalizedSessionFile = abandonedRun.sessionFile?.trim();
	if (normalizedSessionFile) {
		const sessionFileKey = resolveEmbeddedSessionFileKey(normalizedSessionFile);
		if (ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE.get(sessionFileKey) === sessionId) ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE.delete(sessionFileKey);
	}
}
function clearEmbeddedRunAbandonmentBySessionKey(sessionKey) {
	const normalizedSessionKey = sessionKey?.trim();
	if (!normalizedSessionKey) return;
	const sessionId = ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey);
	if (sessionId) clearEmbeddedRunAbandonmentBySessionId(sessionId);
}
function clearEmbeddedRunAbandonmentBySessionFile(sessionFile) {
	const normalizedSessionFile = sessionFile?.trim();
	if (!normalizedSessionFile) return;
	const sessionFileKey = resolveEmbeddedSessionFileKey(normalizedSessionFile);
	const sessionId = ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE.get(sessionFileKey);
	if (sessionId) clearEmbeddedRunAbandonmentBySessionId(sessionId);
}
function clearEmbeddedRunAbandonment(params) {
	const normalizedSessionId = params.sessionId?.trim();
	if (normalizedSessionId) clearEmbeddedRunAbandonmentBySessionId(normalizedSessionId);
	clearEmbeddedRunAbandonmentBySessionKey(params.sessionKey);
	clearEmbeddedRunAbandonmentBySessionFile(params.sessionFile);
}
function markEmbeddedRunAbandoned(params) {
	const sessionId = params.sessionId.trim();
	if (!sessionId) return;
	clearEmbeddedRunAbandonment({
		sessionId,
		sessionKey: params.sessionKey,
		sessionFile: params.sessionFile
	});
	const abandonedRun = {
		sessionId,
		abandonedAtMs: Date.now(),
		reason: params.reason,
		...params.sessionKey?.trim() ? { sessionKey: params.sessionKey.trim() } : {},
		...params.sessionFile?.trim() ? { sessionFile: params.sessionFile.trim() } : {}
	};
	ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.set(sessionId, abandonedRun);
	if (abandonedRun.sessionKey) ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY.set(abandonedRun.sessionKey, sessionId);
	if (abandonedRun.sessionFile) ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE.set(resolveEmbeddedSessionFileKey(abandonedRun.sessionFile), sessionId);
}
function markActiveEmbeddedRunAbandoned(params) {
	const sessionId = params.sessionId.trim();
	if (!sessionId || ACTIVE_EMBEDDED_RUNS.get(sessionId) !== params.handle) return false;
	markEmbeddedRunAbandoned(params);
	return true;
}
function isEmbeddedRunAbandoned(params) {
	const normalizedSessionId = params.sessionId?.trim();
	if (normalizedSessionId && ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.has(normalizedSessionId)) return true;
	const normalizedSessionKey = params.sessionKey?.trim();
	if (normalizedSessionKey && ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY.has(normalizedSessionKey)) return true;
	const normalizedSessionFile = params.sessionFile?.trim();
	return Boolean(normalizedSessionFile && ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE.has(resolveEmbeddedSessionFileKey(normalizedSessionFile)));
}
function clearActiveRunSessionFiles(sessionId, sessionFile) {
	const normalizedSessionFile = sessionFile?.trim();
	if (normalizedSessionFile) {
		const sessionFileKey = resolveEmbeddedSessionFileKey(normalizedSessionFile);
		if (ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.get(sessionFileKey) === sessionId) ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.delete(sessionFileKey);
	}
	for (const [sessionFileKey, activeSessionId] of ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE) if (activeSessionId === sessionId) ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.delete(sessionFileKey);
}
/**
* @deprecated Use queueEmbeddedAgentMessageWithOutcomeAsync for delivery decisions.
* This boolean helper only reports immediate queue eligibility; it cannot surface
* async runtime rejection from the active run.
*/
function queueEmbeddedAgentMessage(sessionId, text, options) {
	return queueEmbeddedAgentMessageWithOutcome(sessionId, text, options).queued;
}
/**
* @deprecated Prefer queueEmbeddedAgentMessageWithOutcomeAsync when callers need to
* know whether steering was accepted. This sync helper is fire-and-forget after
* initial eligibility and only logs later runtime rejection.
*/
function queueEmbeddedAgentMessageWithOutcome(sessionId, text, options) {
	const prepared = prepareEmbeddedAgentQueueMessage(sessionId, text, options);
	if (prepared.kind === "complete") return prepared.outcome;
	logMessageQueued({
		sessionId,
		source: "embedded-agent-runner"
	});
	prepared.handle.queueMessage(text, options ?? { steeringMode: "all" }).catch((err) => {
		diagnosticLogger.debug(`queue message rejected after enqueue: sessionId=${sessionId} err=${formatQueueError(err)}`);
	});
	return {
		queued: true,
		sessionId,
		target: "embedded_run",
		gatewayHealth: "live",
		enqueuedAtMs: Date.now()
	};
}
function formatQueueError(err) {
	return err instanceof Error ? err.message : String(err);
}
async function queueEmbeddedAgentMessageWithOutcomeAsync(sessionId, text, options) {
	const prepared = prepareEmbeddedAgentQueueMessage(sessionId, text, options);
	if (prepared.kind === "complete") return prepared.outcome;
	try {
		const enqueuedAtMs = Date.now();
		await prepared.handle.queueMessage(text, options ?? { steeringMode: "all" });
		const deliveredAtMs = options?.waitForTranscriptCommit ? Date.now() : void 0;
		logMessageQueued({
			sessionId,
			source: "embedded-agent-runner"
		});
		return {
			queued: true,
			sessionId,
			target: "embedded_run",
			gatewayHealth: "live",
			...deliveredAtMs !== void 0 ? { deliveredAtMs } : {},
			enqueuedAtMs
		};
	} catch (err) {
		const errorMessage = formatQueueError(err);
		diagnosticLogger.debug(`queue message rejected: sessionId=${sessionId} err=${errorMessage}`);
		return createQueueFailureOutcome(sessionId, "runtime_rejected", errorMessage);
	}
}
function prepareEmbeddedAgentQueueMessage(sessionId, text, options) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (!handle) {
		if (queueReplyRunMessage(sessionId, text)) {
			logMessageQueued({
				sessionId,
				source: "embedded-agent-runner"
			});
			return {
				kind: "complete",
				outcome: {
					queued: true,
					sessionId,
					target: "reply_run",
					gatewayHealth: "live",
					enqueuedAtMs: Date.now()
				}
			};
		}
		if (options?.waitForTranscriptCommit === true) {
			diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=transcript_commit_wait_unsupported`);
			return {
				kind: "complete",
				outcome: createQueueFailureOutcome(sessionId, "transcript_commit_wait_unsupported")
			};
		}
		diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=no_active_run`);
		return {
			kind: "complete",
			outcome: createQueueFailureOutcome(sessionId, "no_active_run")
		};
	}
	if (!handle.isStreaming()) {
		diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=not_streaming`);
		return {
			kind: "complete",
			outcome: createQueueFailureOutcome(sessionId, "not_streaming")
		};
	}
	if (handle.isCompacting()) {
		diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=compacting`);
		return {
			kind: "complete",
			outcome: createQueueFailureOutcome(sessionId, "compacting")
		};
	}
	if (options?.waitForTranscriptCommit === true && handle.supportsTranscriptCommitWait !== true) {
		diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=transcript_commit_wait_unsupported`);
		return {
			kind: "complete",
			outcome: createQueueFailureOutcome(sessionId, "transcript_commit_wait_unsupported")
		};
	}
	if (options?.sourceReplyDeliveryMode === "message_tool_only" && handle.sourceReplyDeliveryMode !== "message_tool_only") {
		diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=source_reply_delivery_mode_mismatch`);
		return {
			kind: "complete",
			outcome: createQueueFailureOutcome(sessionId, "source_reply_delivery_mode_mismatch")
		};
	}
	return {
		kind: "embedded_run",
		handle
	};
}
function abortEmbeddedAgentRun(sessionId, opts) {
	if (typeof sessionId === "string" && sessionId.length > 0) {
		const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
		if (!handle) {
			if (abortReplyRunBySessionId(sessionId)) return true;
			diagnosticLogger.debug(`abort failed: sessionId=${sessionId} reason=no_active_run`);
			return false;
		}
		diagnosticLogger.debug(`aborting run: sessionId=${sessionId}`);
		try {
			handle.abort(opts?.reason);
		} catch (err) {
			diagnosticLogger.warn(`abort failed: sessionId=${sessionId} err=${String(err)}`);
			return false;
		}
		return true;
	}
	const abortActiveEmbeddedRunHandles = (params) => {
		let aborted = false;
		for (const [id, handle] of ACTIVE_EMBEDDED_RUNS) {
			if (!params.shouldAbort(handle)) continue;
			diagnosticLogger.debug(params.formatDebugMessage(id));
			try {
				handle.abort(opts?.reason);
				aborted = true;
			} catch (err) {
				diagnosticLogger.warn(`abort failed: sessionId=${id} err=${String(err)}`);
			}
		}
		return aborted;
	};
	const mode = opts?.mode;
	if (mode === "compacting") {
		const aborted = abortActiveEmbeddedRunHandles({
			shouldAbort: (handle) => handle.isCompacting(),
			formatDebugMessage: (id) => `aborting compacting run: sessionId=${id}`
		});
		return abortActiveReplyRuns({ mode }) || aborted;
	}
	if (mode === "all") {
		const aborted = abortActiveEmbeddedRunHandles({
			shouldAbort: () => true,
			formatDebugMessage: (id) => `aborting run: sessionId=${id}`
		});
		return abortActiveReplyRuns({ mode }) || aborted;
	}
	return false;
}
function isEmbeddedAgentRunActive(sessionId) {
	const active = ACTIVE_EMBEDDED_RUNS.has(sessionId) || isReplyRunActiveForSessionId(sessionId);
	if (active) diagnosticLogger.debug(`run active check: sessionId=${sessionId} active=true`);
	return active;
}
function isEmbeddedAgentRunHandleActive(sessionId) {
	const active = ACTIVE_EMBEDDED_RUNS.has(sessionId);
	if (active) diagnosticLogger.debug(`run handle active check: sessionId=${sessionId} active=true`);
	return active;
}
function isEmbeddedAgentRunAbortableForCompaction(sessionId) {
	const active = ACTIVE_EMBEDDED_RUNS.has(sessionId) || isReplyRunAbortableForCompaction(sessionId);
	if (active) diagnosticLogger.debug(`run compact abort check: sessionId=${sessionId} active=true`);
	return active;
}
function isEmbeddedAgentRunStreaming(sessionId) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (!handle) return isReplyRunStreamingForSessionId(sessionId);
	return handle.isStreaming();
}
function resolveActiveEmbeddedRunHandleSessionId(sessionKey) {
	const normalizedSessionKey = sessionKey.trim();
	if (!normalizedSessionKey) return;
	return ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey);
}
function resolveActiveEmbeddedRunHandleSessionIdBySessionFile(sessionFile) {
	const normalizedSessionFile = sessionFile.trim();
	if (!normalizedSessionFile) return;
	return ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.get(resolveEmbeddedSessionFileKey(normalizedSessionFile));
}
function resolveActiveEmbeddedRunSessionIdBySessionFile(sessionFile) {
	return resolveActiveEmbeddedRunHandleSessionIdBySessionFile(sessionFile);
}
function getActiveEmbeddedRunSnapshot(sessionId) {
	return ACTIVE_EMBEDDED_RUN_SNAPSHOTS.get(sessionId);
}
/**
* Wait for active embedded runs to drain.
*
* Used during restarts so in-flight runs can release session write locks before
* the next lifecycle starts. If no timeout is passed, waits indefinitely.
*/
async function waitForActiveEmbeddedRuns(timeoutMs, opts) {
	const pollMs = resolveTimerTimeoutMs(opts?.pollMs ?? 250, 250, 10);
	if (timeoutMs !== void 0 && timeoutMs <= 0) return { drained: getActiveEmbeddedRunCount() === 0 };
	const maxWaitMs = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? Math.max(pollMs, Math.floor(timeoutMs)) : void 0;
	const startedAt = Date.now();
	while (true) {
		if (getActiveEmbeddedRunCount() === 0) return { drained: true };
		const elapsedMs = Date.now() - startedAt;
		if (maxWaitMs !== void 0 && elapsedMs >= maxWaitMs) {
			diagnosticLogger.warn(`wait for active embedded runs timed out: activeRuns=${getActiveEmbeddedRunCount()} timeoutMs=${maxWaitMs}`);
			return { drained: false };
		}
		await new Promise((resolve) => {
			setTimeout(resolve, pollMs);
		});
	}
}
function waitForEmbeddedAgentRunEnd(sessionId, timeoutMs = 15e3) {
	if (!sessionId) return Promise.resolve(true);
	if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) return waitForReplyRunEndBySessionId(sessionId, timeoutMs);
	diagnosticLogger.debug(`waiting for run end: sessionId=${sessionId} timeoutMs=${timeoutMs}`);
	return new Promise((resolve) => {
		const waiters = EMBEDDED_RUN_WAITERS.get(sessionId) ?? /* @__PURE__ */ new Set();
		const waiter = {
			resolve,
			timer: setTimeout(() => {
				waiters.delete(waiter);
				if (waiters.size === 0) EMBEDDED_RUN_WAITERS.delete(sessionId);
				diagnosticLogger.warn(`wait timeout: sessionId=${sessionId} timeoutMs=${timeoutMs}`);
				resolve(false);
			}, resolveTimerTimeoutMs(timeoutMs, 100, 100))
		};
		waiters.add(waiter);
		EMBEDDED_RUN_WAITERS.set(sessionId, waiters);
		if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) {
			waiters.delete(waiter);
			if (waiters.size === 0) EMBEDDED_RUN_WAITERS.delete(sessionId);
			clearTimeout(waiter.timer);
			resolve(true);
		}
	});
}
async function abortAndDrainEmbeddedAgentRun(params) {
	const settleMs = params.settleMs ?? 15e3;
	const aborted = abortEmbeddedAgentRun(params.sessionId);
	const drained = aborted ? await waitForEmbeddedAgentRunEnd(params.sessionId, settleMs) : false;
	return {
		aborted,
		drained,
		forceCleared: params.forceClear === true && (!aborted || !drained) ? forceClearEmbeddedAgentRun(params.sessionId, params.sessionKey, params.reason) : false
	};
}
function notifyEmbeddedRunEnded(sessionId) {
	const waiters = EMBEDDED_RUN_WAITERS.get(sessionId);
	if (!waiters || waiters.size === 0) return;
	EMBEDDED_RUN_WAITERS.delete(sessionId);
	diagnosticLogger.debug(`notifying waiters: sessionId=${sessionId} waiterCount=${waiters.size}`);
	for (const waiter of waiters) {
		clearTimeout(waiter.timer);
		waiter.resolve(true);
	}
}
function setActiveEmbeddedRun(sessionId, handle, sessionKey, sessionFile) {
	const wasActive = ACTIVE_EMBEDDED_RUNS.has(sessionId);
	clearEmbeddedRunAbandonment({
		sessionId,
		sessionKey,
		sessionFile
	});
	ACTIVE_EMBEDDED_RUNS.set(sessionId, handle);
	setActiveRunSessionKey(sessionKey, sessionId);
	clearActiveRunSessionFiles(sessionId);
	setActiveRunSessionFile(sessionFile, sessionId);
	logSessionStateChange({
		sessionId,
		sessionKey,
		sessionFile,
		state: "processing",
		reason: wasActive ? "run_replaced" : "run_started"
	});
	markDiagnosticEmbeddedRunStarted({
		sessionId,
		sessionKey
	});
	if (!sessionId.startsWith("probe-")) diagnosticLogger.debug(`run registered: sessionId=${sessionId} totalActive=${ACTIVE_EMBEDDED_RUNS.size}`);
}
function updateActiveEmbeddedRunSnapshot(sessionId, snapshot) {
	if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) return;
	ACTIVE_EMBEDDED_RUN_SNAPSHOTS.set(sessionId, snapshot);
}
function updateActiveEmbeddedRunSessionFile(sessionId, sessionFile) {
	if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) return;
	clearActiveRunSessionFiles(sessionId);
	setActiveRunSessionFile(sessionFile, sessionId);
	updateDiagnosticSessionFile({
		sessionId,
		sessionFile
	});
}
function clearActiveEmbeddedRun(sessionId, handle, sessionKey, sessionFile) {
	const activeHandle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (activeHandle === void 0) return;
	if (activeHandle === handle) {
		ACTIVE_EMBEDDED_RUNS.delete(sessionId);
		ACTIVE_EMBEDDED_RUN_SNAPSHOTS.delete(sessionId);
		clearActiveRunSessionKeys(sessionId, sessionKey);
		clearActiveRunSessionFiles(sessionId, sessionFile);
		logSessionStateChange({
			sessionId,
			sessionKey,
			sessionFile,
			state: "idle",
			reason: "run_completed"
		});
		markDiagnosticEmbeddedRunEnded({
			sessionId,
			sessionKey
		});
		if (!sessionId.startsWith("probe-")) diagnosticLogger.debug(`run cleared: sessionId=${sessionId} totalActive=${ACTIVE_EMBEDDED_RUNS.size}`);
		notifyEmbeddedRunEnded(sessionId);
	} else diagnosticLogger.debug(`run clear skipped: sessionId=${sessionId} reason=handle_mismatch`);
}
function forceClearEmbeddedAgentRun(sessionId, sessionKey, reason = "stuck_recovery") {
	let cleared = false;
	if (ACTIVE_EMBEDDED_RUNS.has(sessionId)) {
		ACTIVE_EMBEDDED_RUNS.delete(sessionId);
		ACTIVE_EMBEDDED_RUN_SNAPSHOTS.delete(sessionId);
		clearActiveRunSessionKeys(sessionId, sessionKey);
		clearActiveRunSessionFiles(sessionId);
		logSessionStateChange({
			sessionId,
			sessionKey,
			state: "idle",
			reason
		});
		markDiagnosticEmbeddedRunEnded({
			sessionId,
			sessionKey
		});
		notifyEmbeddedRunEnded(sessionId);
		cleared = true;
	}
	return forceClearReplyRunBySessionId(sessionId, /* @__PURE__ */ new Error(`Embedded run force-cleared by ${reason}`)) || cleared;
}
//#endregion
export { resolveEmbeddedSessionFileKey as C, waitForEmbeddedAgentRunEnd as S, resolveActiveEmbeddedRunSessionIdBySessionFile as _, getActiveEmbeddedRunSnapshot as a, updateActiveEmbeddedRunSnapshot as b, isEmbeddedAgentRunHandleActive as c, markActiveEmbeddedRunAbandoned as d, queueEmbeddedAgentMessage as f, resolveActiveEmbeddedRunHandleSessionIdBySessionFile as g, resolveActiveEmbeddedRunHandleSessionId as h, formatEmbeddedAgentQueueFailureSummary as i, isEmbeddedAgentRunStreaming as l, queueEmbeddedAgentMessageWithOutcomeAsync as m, abortEmbeddedAgentRun as n, isEmbeddedAgentRunAbortableForCompaction as o, queueEmbeddedAgentMessageWithOutcome as p, clearActiveEmbeddedRun as r, isEmbeddedAgentRunActive as s, abortAndDrainEmbeddedAgentRun as t, isEmbeddedRunAbandoned as u, setActiveEmbeddedRun as v, waitForActiveEmbeddedRuns as x, updateActiveEmbeddedRunSessionFile as y };
