import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { r as formatCompactTokenCount } from "./format-C1IjPxxo.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { o as isSilentReplyText } from "./tokens-BTKQYTUd.mjs";
import { r as isAnnounceSkip } from "./sessions-send-tokens-Dy3kgMtK.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import { a as readToolCallName, n as isContractToolCallBlock } from "./tool-block-contract-CJH3ADzt.mjs";
import { i as classifyAgentRunTerminalOutcome, o as isAbortedAgentStopReason } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { t as formatDurationCompact } from "./format-duration-CeDWULoS.mjs";
import { n as findTranscriptEvent } from "./session-accessor.sqlite-read-DO8t28O6.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-ByCc34Vn.mjs";
import { O as findSessionTranscriptArchiveEventReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { a as buildAgentRunTerminalOutcomeFromWaitResult } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import "./run-termination-Cd1iJzC7.mjs";
import { r as recordLatestSubagentRun } from "./subagent-run-generation-BpwN1g73.mjs";
import { t as extractStoredAssistantText } from "./chat-history-text-ZJR9s0Sl.mjs";
import { r as readSubagentRunAnnounceResultUsing, t as buildChildCompletionFindings } from "./subagent-announce-result-DDWhtoay.mjs";
import { a as readSessionMessagesAsync } from "./session-transcript-readers-nuptsJ6Q.mjs";
import { n as readSubagentSessionEntry, t as callSubagentLifecycleGateway } from "./subagent-announce.runtime.js";
//#region src/agents/subagents/subagent-terminal-outcome.ts
/** Subagents apply explicit cancellation ownership after canonical timeout attribution. */
function classifySubagentTerminalOutcome(outcome) {
	const classification = classifyAgentRunTerminalOutcome(outcome);
	return classification === "timeout" || !isAbortedAgentStopReason(outcome.stopReason) ? classification : "cancellation";
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-capture.ts
/**
* Helpers for capturing the latest subagent completion reply after a run ends.
*
* Completion output can lag behind lifecycle state, so callers can retry briefly
* before sending an empty or stale announcement.
*/
/** Reads subagent output repeatedly until non-empty text appears or the bounded wait expires. */
async function readLatestSubagentOutputWithRetryUsing(params) {
	const maxWaitMs = Math.max(0, Math.min(params.maxWaitMs, 15e3));
	if (!(maxWaitMs > 0)) return;
	const deadlineAt = performance.now() + maxWaitMs;
	for (;;) {
		const result = await params.readSubagentOutput(params.sessionKey, params.outcome);
		if (result?.trim()) return result;
		const remainingMs = deadlineAt - performance.now();
		if (remainingMs <= 0) return result;
		const sleepMs = Math.min(params.retryIntervalMs, remainingMs);
		await new Promise((resolve) => {
			setTimeout(resolve, sleepMs);
		});
	}
}
/** Captures immediate output first, then optionally waits for a delayed completion reply. */
async function captureSubagentCompletionReplyUsing(params) {
	const immediate = await params.readSubagentOutput(params.sessionKey);
	if (immediate?.trim()) return immediate;
	if (params.waitForReply === false) return;
	return await readLatestSubagentOutputWithRetryUsing({
		sessionKey: params.sessionKey,
		maxWaitMs: params.maxWaitMs,
		retryIntervalMs: params.retryIntervalMs,
		readSubagentOutput: params.readSubagentOutput
	});
}
//#endregion
//#region src/agents/subagents/announce/subagent-yield-output.ts
/**
* sessions_yield transcript detectors.
*
* Accepts provider-specific tool-call and tool-result shapes used by transcript repair and announce capture.
*/
/** Returns true when an assistant message requested the sessions_yield tool. */
function assistantCallsSessionsYield(message) {
	const record = asOptionalRecord(message);
	if (!record || record.role !== "assistant") return false;
	if (Array.isArray(record.content) && record.content.some((block) => isContractToolCallBlock(block) && readToolCallName(block) === "sessions_yield")) return true;
	return [record.toolCalls, record.tool_calls].some((toolCalls) => Array.isArray(toolCalls) && toolCalls.some((toolCall) => {
		const callRecord = asOptionalRecord(toolCall);
		return callRecord ? readToolCallName(callRecord) === "sessions_yield" : false;
	}));
}
function readStructuredToolPayload(content) {
	const record = asOptionalRecord(content);
	if (record) return record;
	if (typeof content === "string") return safeParseJsonRecord(content.trim());
	if (!Array.isArray(content)) return;
	for (const block of content) {
		const blockRecord = asOptionalRecord(block);
		if (!blockRecord) continue;
		const text = blockRecord.text;
		if (typeof text !== "string") continue;
		const parsed = safeParseJsonRecord(text.trim());
		if (parsed) return parsed;
	}
}
/** Returns true when a tool result represents a completed sessions_yield handoff. */
function isSessionsYieldToolResult(message, previousAssistantCalledYield) {
	const record = asOptionalRecord(message);
	if (!record || record.role !== "toolResult" && record.role !== "tool") return false;
	if (readToolCallName(record) === "sessions_yield") return true;
	if (!previousAssistantCalledYield) return false;
	if (asOptionalRecord(record.details)?.status === "yielded") return true;
	return readStructuredToolPayload(record.content)?.status === "yielded";
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-output.ts
/**
* Subagent completion output capture.
*
* Reads child session output, detects waiting states, and formats completion findings for announcements.
*/
const FAST_TEST_RETRY_INTERVAL_MS = 8;
function isFastTestMode() {
	return isFastTestRuntimeEnv();
}
function withSubagentOutcomeTiming(outcome, timing) {
	const startedAt = asFiniteNumber(timing.startedAt) ?? asFiniteNumber(outcome.startedAt);
	const endedAt = asFiniteNumber(timing.endedAt) ?? asFiniteNumber(outcome.endedAt);
	const nextTiming = {};
	if (typeof startedAt === "number") nextTiming.startedAt = startedAt;
	if (typeof endedAt === "number") nextTiming.endedAt = endedAt;
	if (typeof startedAt === "number" && typeof endedAt === "number") nextTiming.elapsedMs = Math.max(0, endedAt - startedAt);
	return {
		...outcome,
		...nextTiming
	};
}
function countAssistantToolCalls(message) {
	if (!message || typeof message !== "object") return 0;
	const content = message.content;
	const contentToolCalls = Array.isArray(content) ? content.filter((block) => isContractToolCallBlock(block)).length : 0;
	const toolCalls = message.toolCalls ?? message.tool_calls;
	return contentToolCalls + (Array.isArray(toolCalls) ? toolCalls.length : 0);
}
function summarizeSubagentOutputHistory(messages) {
	const snapshot = {};
	let previousAssistantCalledYield = false;
	for (const message of messages) {
		if (!message || typeof message !== "object") continue;
		const role = message.role;
		const provenance = message.provenance;
		if (role === "user" || provenance && typeof provenance === "object" && !Array.isArray(provenance) && provenance.kind === "inter_session") {
			snapshot.latestAssistantText = void 0;
			snapshot.latestSilentText = void 0;
			snapshot.latestToolCallCount = void 0;
			snapshot.waitingForContinuation = false;
			previousAssistantCalledYield = false;
			continue;
		}
		if (role === "assistant") {
			if (assistantCallsSessionsYield(message)) {
				snapshot.latestAssistantText = void 0;
				snapshot.latestSilentText = void 0;
				snapshot.waitingForContinuation = true;
				previousAssistantCalledYield = true;
				continue;
			}
			const toolCallCount = countAssistantToolCalls(message);
			if (toolCallCount > 0) {
				snapshot.latestAssistantText = void 0;
				snapshot.latestSilentText = void 0;
				snapshot.latestToolCallCount = (snapshot.latestToolCallCount ?? 0) + toolCallCount;
				snapshot.waitingForContinuation = false;
				previousAssistantCalledYield = false;
				continue;
			}
			const text = extractStoredAssistantText(message)?.trim();
			if (!text) {
				snapshot.waitingForContinuation = false;
				previousAssistantCalledYield = false;
				continue;
			}
			if (isAnnounceSkip(text) || isSilentReplyText(text, "NO_REPLY")) {
				snapshot.latestSilentText = text;
				snapshot.latestAssistantText = void 0;
				snapshot.waitingForContinuation = false;
				previousAssistantCalledYield = false;
				continue;
			}
			snapshot.latestSilentText = void 0;
			snapshot.latestAssistantText = text;
			snapshot.waitingForContinuation = false;
			previousAssistantCalledYield = false;
			continue;
		}
		if (isSessionsYieldToolResult(message, previousAssistantCalledYield)) {
			snapshot.latestAssistantText = void 0;
			snapshot.latestSilentText = void 0;
			snapshot.waitingForContinuation = true;
			previousAssistantCalledYield = false;
			continue;
		}
		previousAssistantCalledYield = false;
	}
	return snapshot;
}
function selectSubagentOutputText(snapshot, outcome) {
	if (snapshot.waitingForContinuation) return;
	if (snapshot.latestSilentText) return snapshot.latestSilentText;
	if (snapshot.latestAssistantText) return snapshot.latestAssistantText;
	if (outcome?.status === "timeout" && snapshot.latestToolCallCount && snapshot.latestToolCallCount > 0) return `${snapshot.latestToolCallCount} tool call(s) made without visible output.`;
}
async function readSubagentOutput(sessionKey, outcome, options) {
	let messages;
	if (options?.sessionTarget) messages = await readSessionMessagesAsync(options.sessionTarget, {
		mode: "recent",
		maxMessages: 100,
		maxBytes: 1048576
	});
	const history = messages === void 0 ? await callSubagentLifecycleGateway({
		method: "chat.history",
		params: {
			sessionKey,
			limit: 100
		}
	}) : void 0;
	const selected = selectSubagentOutputText(summarizeSubagentOutputHistory(messages ?? (Array.isArray(history?.messages) ? history.messages : [])), outcome);
	if (selected?.trim()) return selected;
}
async function readLatestSubagentOutputWithRetry(params) {
	return await readLatestSubagentOutputWithRetryUsing({
		sessionKey: params.sessionKey,
		maxWaitMs: params.maxWaitMs,
		outcome: params.outcome,
		retryIntervalMs: isFastTestMode() ? FAST_TEST_RETRY_INTERVAL_MS : 100,
		readSubagentOutput
	});
}
async function readSubagentTimeoutProgress(sessionKey, maxWaitMs, outcome) {
	const initial = await readSubagentOutput(sessionKey, outcome);
	const progress = initial?.trim() ? initial : await readLatestSubagentOutputWithRetry({
		sessionKey,
		maxWaitMs,
		outcome
	});
	return progress && !isAnnounceSkip(progress) && !isSilentReplyText(progress, "NO_REPLY") ? progress : void 0;
}
async function waitForSubagentRunOutcome(runId, timeoutMs) {
	const waitMs = Math.max(0, Math.floor(timeoutMs));
	return await callSubagentLifecycleGateway({
		method: "agent.wait",
		params: {
			runId,
			timeoutMs: waitMs
		},
		timeoutMs: waitMs + 2e3
	});
}
function applySubagentWaitOutcome(params) {
	const next = {
		outcome: params.outcome,
		startedAt: params.startedAt,
		endedAt: params.endedAt
	};
	if (typeof params.wait?.startedAt === "number" && typeof next.startedAt !== "number") next.startedAt = params.wait.startedAt;
	if (typeof params.wait?.endedAt === "number" && typeof next.endedAt !== "number") next.endedAt = params.wait.endedAt;
	const waitError = typeof params.wait?.error === "string" ? params.wait.error : void 0;
	const terminalOutcome = buildAgentRunTerminalOutcomeFromWaitResult(params.wait);
	let outcome = next.outcome;
	if (terminalOutcome) switch (classifySubagentTerminalOutcome(terminalOutcome)) {
		case "timeout": {
			const pendingErrorText = params.wait?.pendingError === true ? terminalOutcome.error ?? waitError : void 0;
			outcome = pendingErrorText ? {
				status: "timeout",
				error: pendingErrorText
			} : { status: "timeout" };
			break;
		}
		case "cancellation":
			outcome = {
				status: "error",
				error: "subagent run terminated"
			};
			break;
		case "failure":
			outcome = {
				status: "error",
				error: terminalOutcome.error ?? waitError
			};
			break;
		case "success": outcome = { status: "ok" };
	}
	next.outcome = outcome ? withSubagentOutcomeTiming(outcome, next) : void 0;
	return next;
}
async function captureSubagentCompletionReply(sessionKey, options) {
	return await captureSubagentCompletionReplyUsing({
		sessionKey,
		waitForReply: options?.waitForReply,
		maxWaitMs: isFastTestMode() ? 50 : 1500,
		retryIntervalMs: isFastTestMode() ? FAST_TEST_RETRY_INTERVAL_MS : 100,
		readSubagentOutput: async (nextSessionKey) => await readSubagentOutput(nextSessionKey, options?.outcome, { sessionTarget: options?.sessionTarget })
	});
}
async function readSubagentRunAnnounceResult(child) {
	return await readSubagentRunAnnounceResultUsing(child, {
		findTranscriptEvent,
		findSessionTranscriptArchiveEventReadOnly,
		getRuntimeConfig,
		readSubagentSessionEntry,
		resolveAgentIdFromSessionKey,
		resolveSessionStorePathCore
	});
}
/** Prepare complete result text without changing the bounded lifecycle evidence. */
async function readChildCompletionFindings(children) {
	const results = await Promise.all(children.map(async (child) => ({
		child,
		...await readSubagentRunAnnounceResult(child)
	})));
	const isCurrent = () => results.every((result) => result.isCurrent());
	if (!isCurrent()) throw new Error("A child result changed while preparing the completion batch.");
	return {
		text: buildChildCompletionFindings(results.map(({ child, text }) => ({
			childSessionKey: child.childSessionKey,
			task: child.task,
			taskName: child.taskName,
			label: child.label,
			createdAt: child.createdAt,
			execution: child.execution,
			endedReason: child.endedReason,
			completion: child.completion,
			announceResult: text
		}))),
		isCurrent
	};
}
function dedupeLatestChildCompletionRows(children) {
	const latestByChildSessionKey = /* @__PURE__ */ new Map();
	for (const child of children) recordLatestSubagentRun(latestByChildSessionKey, child.childSessionKey, child);
	return [...latestByChildSessionKey.values()];
}
function filterCurrentDirectChildCompletionRows(children, params) {
	if (typeof params.getLatestSubagentRunByChildSessionKey !== "function") return children;
	return children.filter((child) => {
		const latest = params.getLatestSubagentRunByChildSessionKey?.(child.childSessionKey);
		if (!latest) return true;
		return latest.runId === child.runId && latest.requesterSessionKey === params.requesterSessionKey && (!params.requesterAgentId || latest.requesterAgentId === params.requesterAgentId);
	});
}
function formatTokenCount(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "0";
	return formatCompactTokenCount(value);
}
async function buildCompactAnnounceStatsLine(params) {
	const cfg = getRuntimeConfig();
	const agentId = resolveAgentIdFromSessionKey(params.sessionKey);
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	let entry = readSubagentSessionEntry(storePath, params.sessionKey);
	const tokenWaitAttempts = isFastTestMode() ? 1 : 3;
	for (let attempt = 0; attempt < tokenWaitAttempts; attempt += 1) {
		if (typeof entry?.inputTokens === "number" || typeof entry?.outputTokens === "number" || resolveFreshSessionTotalTokens(entry) !== void 0) break;
		if (!isFastTestMode()) await new Promise((resolve) => {
			setTimeout(resolve, 150);
		});
		entry = readSubagentSessionEntry(storePath, params.sessionKey);
	}
	const input = entry?.inputTokens;
	const output = entry?.outputTokens;
	const hasDirectionalUsage = typeof input === "number" || typeof output === "number";
	const ioTotal = (input ?? 0) + (output ?? 0);
	const promptCache = resolveFreshSessionTotalTokens(entry);
	const runtimeMs = typeof params.startedAt === "number" && typeof params.endedAt === "number" ? Math.max(0, params.endedAt - params.startedAt) : void 0;
	const parts = [`runtime ${formatDurationCompact(runtimeMs) ?? "n/a"}`, hasDirectionalUsage ? `tokens ${formatTokenCount(ioTotal)} (in ${formatTokenCount(input)} / out ${formatTokenCount(output)})` : promptCache === void 0 ? "tokens unknown" : `tokens ${formatTokenCount(promptCache)} prompt/cache`];
	if (hasDirectionalUsage && typeof promptCache === "number" && promptCache > ioTotal) parts.push(`prompt/cache ${formatTokenCount(promptCache)}`);
	return `Stats: ${parts.join(" • ")}`;
}
//#endregion
export { filterCurrentDirectChildCompletionRows as a, readSubagentOutput as c, waitForSubagentRunOutcome as d, withSubagentOutcomeTiming as f, dedupeLatestChildCompletionRows as i, readSubagentRunAnnounceResult as l, buildCompactAnnounceStatsLine as n, readChildCompletionFindings as o, classifySubagentTerminalOutcome as p, captureSubagentCompletionReply as r, readLatestSubagentOutputWithRetry as s, applySubagentWaitOutcome as t, readSubagentTimeoutProgress as u };
