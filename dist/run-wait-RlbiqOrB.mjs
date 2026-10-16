import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, a as addTimerTimeoutGraceMs, b as parseFiniteNumber, m as clampTimerTimeoutMs, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { c as normalizeAgentRunTimeoutPhase, l as normalizeProviderStarted } from "./agent-run-terminal-outcome-Ccvy5spR.mjs";
import { t as hasRetryableConnectionErrorCode } from "./retryable-network-errors-D2gJmBqw.mjs";
import { n as stripToolMessages, t as extractStoredAssistantText } from "./chat-history-text-DMESwvkV.mjs";
import { o as isOpenClawMessageToolMirrorAssistantMessage, s as isTranscriptOnlyOpenClawAssistantMessage } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { Q as normalizeAgentRunTerminalReplySnapshot, nt as normalizeAgentRunTerminalReceipt } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { a as buildAgentRunTerminalOutcomeFromWaitResult, d as normalizeBlockedLivenessWaitStatus } from "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-Dcrh-ATi.mjs";
import { setTimeout } from "node:timers/promises";
//#region src/agents/run-wait.ts
const AGENT_RUN_WAIT_RETRY_DELAY_MS = 100;
function resolveRunWaitTimeoutMs(value) {
	return clampTimerTimeoutMs(parseFiniteNumber(value) ?? 1) ?? 1;
}
function resolveRunWaitDeadlineAtMs(params) {
	if (params.deadlineAtMs !== void 0) return asDateTimestampMs(params.deadlineAtMs) ?? resolveDateTimestampMs(Date.now());
	return resolveExpiresAtMsFromDurationMs(resolveRunWaitTimeoutMs(params.timeoutMs)) ?? resolveDateTimestampMs(Date.now());
}
function normalizeAgentWaitResult(status, runId, wait) {
	const receipt = normalizeAgentRunTerminalReceipt(wait?.terminalReceipt);
	const stopReason = typeof wait?.stopReason === "string" ? wait.stopReason : void 0;
	const normalized = normalizeTerminalOutcomeForWait(buildAgentRunTerminalOutcomeFromWaitResult({
		...wait,
		status
	}), status, wait?.livenessState);
	return {
		status: normalized.status,
		error: normalized.error,
		startedAt: typeof wait?.startedAt === "number" ? wait.startedAt : void 0,
		endedAt: typeof wait?.endedAt === "number" ? wait.endedAt : void 0,
		stopReason,
		livenessState: typeof wait?.livenessState === "string" ? wait.livenessState : void 0,
		yielded: wait?.yielded === true ? true : void 0,
		pendingError: wait?.pendingError === true ? true : void 0,
		timeoutPhase: normalizeAgentRunTimeoutPhase(wait?.timeoutPhase),
		providerStarted: normalizeProviderStarted(wait?.providerStarted),
		terminalReply: normalizeAgentRunTerminalReplySnapshot(wait?.terminalReply),
		sourceReplyDelivered: receipt?.runId === runId && receipt.sourceReplyDelivered === true ? true : void 0
	};
}
function normalizeTerminalOutcomeForWait(outcome, fallbackStatus, livenessState) {
	if (outcome?.reason === "hard_timeout") return {
		status: outcome.status,
		error: outcome.error
	};
	return normalizeBlockedLivenessWaitStatus({
		status: outcome?.status ?? fallbackStatus,
		livenessState,
		error: outcome?.error
	});
}
const RECOVERABLE_AGENT_WAIT_ERROR_PATTERNS = [
	/gateway closed \(1006/i,
	/transport close/i,
	/connection loss/i,
	/connection closed/i,
	/gateway not connected/i,
	/no active .* listener/i,
	/socket hang up/i
];
/** Return true for transient gateway/transport failures that callers may retry. */
function isRecoverableAgentWaitError(error) {
	const message = error?.trim();
	if (!message) return false;
	if (message.includes("gateway timeout") || message.includes("gateway request timeout")) return false;
	return hasRetryableConnectionErrorCode(message) || RECOVERABLE_AGENT_WAIT_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}
function normalizePendingRunIds(runIds) {
	return new Set(normalizeStringEntries([...runIds]));
}
function isAssistantReplyTranscriptArtifact(message) {
	return isTranscriptOnlyOpenClawAssistantMessage(message) || isOpenClawMessageToolMirrorAssistantMessage(message) || isRecord(message) && isRecord(message.provenance) && (message.provenance.kind === "inter_session" || message.provenance.kind === "internal_system");
}
function readOpenClawMessageMeta(message) {
	const meta = isRecord(message) ? message["__openclaw"] : void 0;
	return isRecord(meta) ? meta : void 0;
}
/** Read the latest model-authored assistant text from session history. */
async function readLatestAssistantReply(params) {
	const callGateway = params.callGateway ?? bindAgentToolGatewayRequest({ hostedOnly: true });
	const agentParams = params.agentId ? { agentId: params.agentId } : {};
	const history = await callGateway({
		method: "chat.history",
		params: {
			sessionKey: params.sessionKey,
			...agentParams,
			limit: params.limit ?? 50
		}
	});
	const messages = stripToolMessages(Array.isArray(history?.messages) ? history.messages : []);
	for (let i = messages.length - 1; i >= 0; i -= 1) {
		const message = messages[i];
		if (isAssistantReplyTranscriptArtifact(message)) continue;
		const text = extractStoredAssistantText(message);
		if (!text?.trim()) continue;
		const meta = readOpenClawMessageMeta(message);
		if (meta?.truncated !== true) return text;
		if (typeof meta.id !== "string" || !meta.id) return;
		const full = await callGateway({
			method: "chat.message.get",
			params: {
				sessionKey: params.sessionKey,
				...agentParams,
				messageId: meta.id
			}
		}).catch(() => void 0);
		return full?.ok === true && readOpenClawMessageMeta(full.message)?.truncated !== true ? extractStoredAssistantText(full.message) : void 0;
	}
}
/** Wait for one agent run through the gateway and normalize timeout/error states. */
async function waitForAgentRun(params) {
	const timeoutMs = resolveRunWaitTimeoutMs(params.timeoutMs);
	try {
		const wait = await (params.callGateway ?? bindAgentToolGatewayRequest({ hostedOnly: true }))({
			method: "agent.wait",
			params: {
				runId: params.runId,
				timeoutMs
			},
			timeoutMs: addTimerTimeoutGraceMs(timeoutMs, 2e3),
			...params.signal ? { signal: params.signal } : {}
		});
		const status = wait?.status;
		return normalizeAgentWaitResult(status === "timeout" || status === "pending" || status === "error" ? status : "ok", params.runId, wait);
	} catch (err) {
		const error = formatErrorMessage(err);
		return {
			status: error.includes("gateway timeout") || error.includes("gateway request timeout") ? "timeout" : "error",
			error,
			...isRecoverableAgentWaitError(error) ? { retryableTransportError: true } : {}
		};
	}
}
/** Retry-grace and observation timeouts do not settle the accepted run. */
function isTerminalAgentWaitTimeout(wait) {
	return wait.status === "timeout" && wait.pendingError !== true && (wait.endedAt !== void 0 || Boolean(wait.stopReason || wait.livenessState) || buildAgentRunTerminalOutcomeFromWaitResult(wait)?.reason === "hard_timeout");
}
/** Read the completed run's reply without inferring delivery from display history. */
async function waitForAgentRunReply(params) {
	const scopeSignal = getAsyncWorkSignal();
	const signal = params.untilTerminal ? AbortSignal.any([getGatewayRestartDrainSignal(), ...scopeSignal ? [scopeSignal] : []]) : void 0;
	let wait;
	for (;;) {
		signal?.throwIfAborted();
		wait = await waitForAgentRun({
			...params,
			signal
		});
		signal?.throwIfAborted();
		if (!params.untilTerminal || !(wait.status === "pending" || wait.status === "timeout" && wait.timeoutPhase !== "gateway_draining" && !isTerminalAgentWaitTimeout(wait) && (wait.pendingError === true || !wait.error))) break;
		await setTimeout(AGENT_RUN_WAIT_RETRY_DELAY_MS, void 0, {
			signal,
			ref: false
		});
	}
	return wait.status === "ok" && wait.terminalReply?.disposition === "visible" ? {
		...wait,
		replyText: wait.terminalReply.text
	} : wait;
}
/** Wait until the current and newly spawned pending run IDs are drained or timed out. */
async function waitForAgentRunsToDrain(params) {
	const deadlineAtMs = resolveRunWaitDeadlineAtMs(params);
	const callGateway = params.callGateway ?? bindAgentToolGatewayRequest({ hostedOnly: true });
	let pendingRunIds = normalizePendingRunIds(params.initialPendingRunIds ?? await params.getPendingRunIds());
	while (pendingRunIds.size > 0 && Date.now() < deadlineAtMs) {
		const remainingMs = Math.max(1, deadlineAtMs - Date.now());
		await Promise.allSettled([...pendingRunIds].map((runId) => waitForAgentRun({
			runId,
			timeoutMs: remainingMs,
			callGateway
		})));
		const previousRunIds = pendingRunIds;
		pendingRunIds = normalizePendingRunIds(await params.getPendingRunIds());
		const retryDelayMs = Math.min(AGENT_RUN_WAIT_RETRY_DELAY_MS, deadlineAtMs - Date.now());
		if (retryDelayMs > 0 && pendingRunIds.size > 0 && pendingRunIds.size === previousRunIds.size && [...pendingRunIds].every((runId) => previousRunIds.has(runId))) {
			await sleep(retryDelayMs);
			pendingRunIds = normalizePendingRunIds(await params.getPendingRunIds());
		}
	}
	return {
		timedOut: pendingRunIds.size > 0,
		pendingRunIds: [...pendingRunIds],
		deadlineAtMs
	};
}
//#endregion
export { waitForAgentRunsToDrain as a, waitForAgentRunReply as i, readLatestAssistantReply as n, waitForAgentRun as r, isTerminalAgentWaitTimeout as t };
