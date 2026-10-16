import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import "./src-CdRlGRnW.mjs";
import { r as formatCompactTokenCount } from "./format-C1IjPxxo.mjs";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import { t as formatDurationCompact } from "./format-duration-BIQQYTeV.mjs";
import { s as isSilentReplyText } from "./tokens-D4ghQG_g.mjs";
import { a as readToolCallName, n as isContractToolCallBlock } from "./tool-block-contract-CgqnHcSD.mjs";
import { t as extractStoredAssistantText } from "./chat-history-text-DMESwvkV.mjs";
import { t as findSessionTranscriptArchiveEventReadOnly } from "./session-accessor.sqlite-history-QWpdLpwt.mjs";
import { S as isSameSubagentRunOwner, T as recordLatestSubagentRun } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BZlUzQZy.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { t as findTranscriptEvent } from "./session-transcript-match-BACU-BTR.mjs";
import { n as truncateUtf16WithEllipsis } from "./text-truncate-DrDnz8rI.mjs";
import { s as readSessionMessagesAsync } from "./session-transcript-readers-CDyCeaj9.mjs";
import { u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { r as wrapPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { m as prepareSubagentRunsSnapshotForRunIds } from "./subagent-registry-state-CVSclnHX.mjs";
import { t as resolveSubagentCompletionResultText } from "./subagent-completion-result-DSDgX1aR.mjs";
import { n as readSubagentSessionEntry, t as callSubagentLifecycleGateway } from "./subagent-announce.runtime.js";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/subagents/announce/subagent-announce-capture.ts
async function readLatestSubagentOutputWithRetryUsing(params) {
	const maxWaitMs = Math.max(0, Math.min(params.maxWaitMs, 15e3));
	if (!(maxWaitMs > 0)) return;
	const deadlineAt = performance.now() + maxWaitMs;
	for (;;) {
		const result = await params.readSubagentOutput(params.sessionKey, params.outcome);
		if (result?.trim()) return result;
		const remainingMs = deadlineAt - performance.now();
		if (remainingMs <= 0) return result;
		await sleep(Math.min(params.retryIntervalMs, remainingMs));
	}
}
async function captureSubagentCompletionReplyUsing(params) {
	const immediate = await params.readSubagentOutput(params.sessionKey);
	if (immediate?.trim()) return immediate;
	if (params.waitForReply === false) return;
	return await readLatestSubagentOutputWithRetryUsing(params);
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-result.ts
const MAX_CHILD_COMPLETION_FIELD_CHARS = 256;
function announceResultFacts(child) {
	return {
		task: child.task,
		taskName: child.taskName,
		label: child.label,
		endedReason: child.endedReason,
		status: child.execution.status,
		endedAt: child.execution.endedAt,
		outcome: child.execution.outcome,
		interruptionReason: child.execution.interruptionReason,
		transcriptTarget: child.execution.transcriptTarget,
		terminalReply: child.completion?.terminalReply,
		resultText: child.completion?.resultText,
		fallbackResultText: child.completion?.fallbackResultText
	};
}
function captureAnnounceResultAuthority(child, readSubagentRun) {
	const facts = structuredClone(announceResultFacts(child));
	const runId = child.runId;
	return () => {
		const current = readSubagentRun(runId);
		return Boolean(current && isSameSubagentRunOwner(current, child) && isDeepStrictEqual(announceResultFacts(current), facts));
	};
}
/** Read the final assistant message from the transcript identity owned by this run. */
async function readSubagentRunAnnounceResultUsing(observed, deps) {
	const child = deps.readSubagentRun(observed.runId);
	if (!child || !isSameSubagentRunOwner(child, observed)) throw new Error("The completed child run's owner changed before announcement.");
	const isCurrent = captureAnnounceResultAuthority(child, deps.readSubagentRun);
	const terminalReply = child.completion?.terminalReply;
	const capturedResult = resolveSubagentCompletionResultText(child);
	if (!capturedResult || terminalReply?.disposition !== "visible" || child.execution.outcome?.status !== "ok") return {
		text: capturedResult,
		isCurrent
	};
	const runId = child.runId;
	const childSessionKey = child.childSessionKey;
	const target = child.execution.transcriptTarget;
	const agentId = target?.agentId ?? deps.resolveAgentIdFromSessionKey(childSessionKey);
	const storePath = target?.storePath ?? deps.resolveSessionStorePathCore(deps.getRuntimeConfig().session?.store, { agentId });
	const sessionKey = target?.sessionKey ?? childSessionKey;
	const sessionId = target?.sessionId ?? deps.readSubagentSessionEntry(storePath, sessionKey)?.sessionId;
	const scope = {
		agentId,
		storePath,
		sessionKey
	};
	let event = (sessionId ? await deps.findTranscriptEvent({
		...scope,
		sessionId
	}, {
		kind: "visible-final",
		runId
	}) : void 0)?.event;
	if (!event) event = (await deps.findSessionTranscriptArchiveEventReadOnly({
		...scope,
		sessionId
	}, runId))?.event;
	if (!isCurrent()) throw new Error("The completed child run's transcript identity changed during announcement.");
	const answer = isRecord(event) ? extractStoredAssistantText(event.message) : void 0;
	if (!answer) return {
		text: `[truncated-by-retention: complete child answer unavailable]\n${terminalReply.text}`,
		isCurrent
	};
	return {
		text: answer,
		isCurrent
	};
}
function describeSubagentOutcome(child) {
	const outcome = child.execution.outcome;
	if (child.endedReason === "subagent-killed") {
		const error = outcome?.error?.trim();
		return error ? `cancelled: ${error}` : "cancelled";
	}
	if (child.execution.interruptionReason === "gateway-restart") return "interrupted by gateway restart";
	if (!outcome) return "unknown";
	if (outcome.status === "ok") return "ok";
	if (outcome.status === "timeout" || outcome.status === "error") {
		const error = outcome.error?.trim();
		return error ? `${outcome.status}: ${error}` : outcome.status;
	}
	return "unknown";
}
function formatChildResultData(resultText) {
	return wrapPromptDataBlock({
		label: "Child result",
		text: resultText?.trim() || "(no output)"
	}) || "Child result: (no output)";
}
function buildChildCompletionFindings(children) {
	const sorted = children.toSorted((a, b) => {
		if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
		const aEnded = typeof a.execution.endedAt === "number" ? a.execution.endedAt : Number.MAX_SAFE_INTEGER;
		const bEnded = typeof b.execution.endedAt === "number" ? b.execution.endedAt : Number.MAX_SAFE_INTEGER;
		if (aEnded !== bEnded) return aEnded - bEnded;
		return a.childSessionKey < b.childSessionKey ? -1 : a.childSessionKey > b.childSessionKey ? 1 : 0;
	});
	const sections = [];
	for (const [index, child] of sorted.entries()) {
		const resultText = child.announceResult ?? resolveSubagentCompletionResultText(child);
		const outcome = describeSubagentOutcome(child);
		if (child.execution.outcome?.status === "ok" && !resultText && child.completion?.required !== true && child.completion?.terminalReply?.disposition !== "empty" && (child.completion?.terminalReply || child.completion?.resultText?.trim() || child.completion?.fallbackResultText?.trim())) continue;
		const title = child.taskName?.trim() || child.label?.trim() || child.task.trim() || child.childSessionKey.trim() || `child ${index + 1}`;
		const displayIndex = sections.length + 1;
		sections.push([
			wrapPromptDataBlock({
				label: `${displayIndex}. Child task`,
				text: title,
				maxEscapedChars: MAX_CHILD_COMPLETION_FIELD_CHARS,
				truncationMarker: "…"
			}),
			`status: ${truncateUtf16WithEllipsis(outcome, MAX_CHILD_COMPLETION_FIELD_CHARS)}`,
			formatChildResultData(resultText)
		].join("\n"));
	}
	if (sections.length === 0) return;
	return [
		"Child completion results:",
		"",
		...sections
	].join("\n\n");
}
//#endregion
//#region src/agents/subagents/announce/subagent-yield-output.ts
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
const FAST_TEST_RETRY_INTERVAL_MS = 8;
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
	const record = asOptionalObjectRecord(message);
	const content = record?.content;
	const contentToolCalls = Array.isArray(content) ? content.filter((block) => isContractToolCallBlock(block)).length : 0;
	const toolCalls = record?.toolCalls ?? record?.tool_calls;
	return contentToolCalls + (Array.isArray(toolCalls) ? toolCalls.length : 0);
}
function summarizeSubagentOutputHistory(messages) {
	const snapshot = {};
	let previousAssistantCalledYield = false;
	for (const message of messages) {
		const record = asOptionalObjectRecord(message);
		if (!record) continue;
		const { role, provenance } = record;
		if (role === "user" || isRecord(provenance) && provenance.kind === "inter_session") {
			snapshot.latestText = void 0;
			snapshot.latestToolCallCount = void 0;
			snapshot.waitingForContinuation = false;
			previousAssistantCalledYield = false;
			continue;
		}
		if (role === "assistant") {
			previousAssistantCalledYield = assistantCallsSessionsYield(message);
			snapshot.waitingForContinuation = previousAssistantCalledYield;
			if (previousAssistantCalledYield) {
				snapshot.latestText = void 0;
				continue;
			}
			const toolCallCount = countAssistantToolCalls(message);
			if (toolCallCount > 0) {
				snapshot.latestText = void 0;
				snapshot.latestToolCallCount = (snapshot.latestToolCallCount ?? 0) + toolCallCount;
				continue;
			}
			const text = extractStoredAssistantText(message)?.trim();
			if (text) snapshot.latestText = text;
			continue;
		}
		if (isSessionsYieldToolResult(message, previousAssistantCalledYield)) {
			snapshot.latestText = void 0;
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
	if (snapshot.latestText) return snapshot.latestText;
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
	return selectSubagentOutputText(summarizeSubagentOutputHistory(messages ?? (Array.isArray(history?.messages) ? history.messages : [])), outcome);
}
async function readLatestSubagentOutputWithRetry(params) {
	return await readLatestSubagentOutputWithRetryUsing({
		sessionKey: params.sessionKey,
		maxWaitMs: params.maxWaitMs,
		outcome: params.outcome,
		retryIntervalMs: isFastTestRuntimeEnv() ? FAST_TEST_RETRY_INTERVAL_MS : 100,
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
	return progress && !isSilentReplyText(progress, "NO_REPLY") ? progress : void 0;
}
async function captureSubagentCompletionReply(sessionKey, options) {
	return await captureSubagentCompletionReplyUsing({
		sessionKey,
		waitForReply: options?.waitForReply,
		maxWaitMs: isFastTestRuntimeEnv() ? 50 : 1500,
		retryIntervalMs: isFastTestRuntimeEnv() ? FAST_TEST_RETRY_INTERVAL_MS : 100,
		readSubagentOutput: async (nextSessionKey) => await readSubagentOutput(nextSessionKey, options?.outcome, { sessionTarget: options?.sessionTarget })
	});
}
async function prepareAnnounceRunReader(runIds) {
	const prepared = await prepareSubagentRunsSnapshotForRunIds(subagentRuns, runIds);
	return (runId) => {
		const current = prepared.consume((runs) => runs.get(runId));
		return current.ready ? current.value : void 0;
	};
}
async function readSubagentRunAnnounceResult(child, readSubagentRun) {
	return await readSubagentRunAnnounceResultUsing(child, {
		readSubagentRun: readSubagentRun ?? await prepareAnnounceRunReader([child.runId]),
		findTranscriptEvent,
		findSessionTranscriptArchiveEventReadOnly,
		getRuntimeConfig,
		readSubagentSessionEntry,
		resolveAgentIdFromSessionKey,
		resolveSessionStorePathCore
	});
}
/** Prepare complete result text without changing the bounded lifecycle evidence. */
async function readChildCompletionFindings(children, readSubagentRun) {
	const readCurrent = readSubagentRun ?? await prepareAnnounceRunReader(children.map((child) => child.runId));
	const results = await Promise.all(children.map(async (observed) => {
		const prepared = await readSubagentRunAnnounceResult(observed, readCurrent);
		const child = readCurrent(observed.runId);
		if (!child || !prepared.isCurrent()) throw new Error("A child result changed while preparing the completion batch.");
		return {
			child,
			...prepared
		};
	}));
	const isCurrent = () => results.every((result) => result.isCurrent());
	if (!isCurrent()) throw new Error("A child result changed while preparing the completion batch.");
	return {
		text: buildChildCompletionFindings(results.map(({ child, text }) => ({
			childSessionKey: child.childSessionKey,
			task: child.task,
			taskName: child.taskName,
			label: child.label,
			createdAt: child.createdAt,
			endedReason: child.endedReason,
			execution: child.execution,
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
	return children.filter((child) => {
		const latest = params.getLatestSubagentRunByChildSessionKey(child.childSessionKey, child.childAgentId);
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
	const tokenWaitAttempts = isFastTestRuntimeEnv() ? 1 : 3;
	for (let attempt = 0; attempt < tokenWaitAttempts; attempt += 1) {
		if (typeof entry?.inputTokens === "number" || typeof entry?.outputTokens === "number" || resolveFreshSessionTotalTokens(entry) !== void 0) break;
		if (!isFastTestRuntimeEnv()) await new Promise((resolve) => {
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
export { readChildCompletionFindings as a, readSubagentRunAnnounceResult as c, filterCurrentDirectChildCompletionRows as i, readSubagentTimeoutProgress as l, captureSubagentCompletionReply as n, readLatestSubagentOutputWithRetry as o, dedupeLatestChildCompletionRows as r, readSubagentOutput as s, buildCompactAnnounceStatsLine as t, withSubagentOutcomeTiming as u };
