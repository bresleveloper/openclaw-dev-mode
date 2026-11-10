import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { s as isFastTestRuntimeEnv } from "./env-DbG527wb.mjs";
import "./src-Djeo9OvP.mjs";
import { r as formatCompactTokenCount } from "./format-C1IjPxxo.mjs";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BGDhC4_W.mjs";
import { o as isSilentReplyText } from "./tokens-DHFPcfdZ.mjs";
import { t as extractStoredAssistantText } from "./chat-history-text-BbisCKtB.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as findSessionTranscriptArchiveEventReadOnly } from "./session-accessor.sqlite-history-DHJfVW84.mjs";
import "./session-history-BKt1cI8X.mjs";
import { t as findTranscriptEvent } from "./session-transcript-match-CM2tniQA.mjs";
import { r as resolveSubagentChildAgentId } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { N as recordLatestSubagentRun, k as isSameSubagentRunOwner } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns } from "./subagent-registry-memory-DE7WJHOr.mjs";
import "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { h as prepareSubagentRunsSnapshotForRunIds } from "./subagent-registry-state-DBdy-FdI.mjs";
import { a as readToolCallName, n as isContractToolCallBlock } from "./tool-block-contract-CgqnHcSD.mjs";
import { t as formatDurationCompact } from "./format-duration-CyyGVUjR.mjs";
import { n as truncateUtf16WithEllipsis } from "./text-truncate-DrDnz8rI.mjs";
import { l as readSessionMessagesAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import { r as wrapPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { a as isRequesterCompletionCohortCurrent } from "./subagent-requester-settle-identity-BXTgIS3Y.mjs";
import { t as withSubagentSessionSource } from "./subagent-session-source-b7OOANca.mjs";
import { t as resolveSubagentCompletionResultText } from "./subagent-completion-result-0vYVKpy4.mjs";
import { n as readSubagentSessionEntry, t as callSubagentLifecycleGateway } from "./subagent-announce.runtime.js";
//#region src/agents/subagents/announce/subagent-announce-result.ts
const MAX_CHILD_COMPLETION_FIELD_CHARS = 256;
const MIN_CHILD_COMPLETION_RESULT_CHARS = 64;
var SubagentAnnouncePreparationConflictError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SubagentAnnouncePreparationConflictError";
	}
};
/** Read the final assistant message from the transcript identity owned by this run. */
async function readSubagentRunAnnounceResultUsing(observed, deps) {
	const child = deps.readSubagentRun(observed.runId);
	if (!child || !isSameSubagentRunOwner(child, observed)) throw new SubagentAnnouncePreparationConflictError("The completed child run's owner changed before announcement.");
	const isCurrent = () => {
		const current = deps.readSubagentRun(child.runId);
		return isSameSubagentRunOwner(current, child) && current?.endedReason === child.endedReason && current?.execution.outcome?.status === child.execution.outcome?.status;
	};
	const terminalReply = child.completion?.terminalReply;
	const capturedResult = resolveSubagentCompletionResultText(child);
	if (!capturedResult || terminalReply?.disposition !== "visible" || child.execution.outcome?.status !== "ok") return {
		text: capturedResult,
		isCurrent
	};
	const runId = child.runId;
	const childSessionKey = child.childSessionKey;
	const childAgentId = resolveSubagentChildAgentId(child);
	if (!childAgentId) return {
		text: capturedResult,
		isCurrent
	};
	const target = child.execution.transcriptTarget;
	const agentId = target?.agentId ?? childAgentId;
	const storePath = target?.storePath ?? deps.resolveSessionStorePathCore(deps.getRuntimeConfig().session?.store, { agentId });
	const sessionKey = target?.sessionKey ?? childSessionKey;
	return withSubagentSessionSource({
		agentId,
		storePath,
		sessionKey
	}, async (source) => {
		const sourcePath = source?.path ?? storePath;
		const sessionId = target?.sessionId ?? (await deps.readSubagentSessionEntry(sourcePath, sessionKey, agentId))?.sessionId;
		const scope = {
			agentId,
			storePath: sourcePath,
			sessionKey
		};
		let event = (sessionId && (source || !isIncognitoSessionKey(sessionKey)) ? await deps.findTranscriptEvent({
			...scope,
			sessionId
		}, {
			kind: "visible-final",
			runId
		}) : void 0)?.event;
		if (!event && !isIncognitoSessionKey(sessionKey)) event = (await deps.findSessionTranscriptArchiveEventReadOnly({
			...scope,
			sessionId
		}, runId))?.event;
		if (!isCurrent()) throw new SubagentAnnouncePreparationConflictError("The completed child run's transcript identity changed during announcement.");
		const answer = isRecord(event) ? extractStoredAssistantText(event.message) : void 0;
		if (!answer) return {
			text: `[truncated-by-retention: complete child answer unavailable]\n${terminalReply.text}`,
			isCurrent
		};
		return {
			text: answer,
			isCurrent
		};
	});
}
function describeSubagentOutcome(child) {
	const outcome = child.execution.outcome;
	if (child.endedReason === "subagent-killed") {
		const error = outcome?.error?.trim();
		return error ? `cancelled: ${error}` : "cancelled";
	}
	if (child.execution.interruptionReason === "gateway-restart") {
		const error = outcome?.error?.trim();
		return error ? `interrupted by gateway restart: ${error}` : "interrupted by gateway restart";
	}
	if (!outcome) return "unknown";
	if (outcome.status === "ok") return "ok";
	if (outcome.status === "timeout" || outcome.status === "error") {
		const error = outcome.error?.trim();
		return error ? `${outcome.status}: ${error}` : outcome.status;
	}
	return "unknown";
}
function buildChildCompletionFindings(children) {
	const sorted = children.toSorted((a, b) => {
		if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
		const aEnded = a.execution.endedAt ?? Number.MAX_SAFE_INTEGER;
		const bEnded = b.execution.endedAt ?? Number.MAX_SAFE_INTEGER;
		if (aEnded !== bEnded) return aEnded - bEnded;
		return a.childSessionKey < b.childSessionKey ? -1 : a.childSessionKey > b.childSessionKey ? 1 : 0;
	});
	const resultFrameChars = wrapPromptDataBlock({
		label: "Child result",
		text: "x"
	}).length - 1;
	const sections = [];
	for (const [index, child] of sorted.entries()) {
		const resultText = child.announceResult ?? resolveSubagentCompletionResultText(child);
		const outcome = describeSubagentOutcome(child);
		if (child.execution.outcome?.status === "ok" && !resultText && child.completion?.required !== true && child.completion?.terminalReply?.disposition !== "empty" && (child.completion?.terminalReply || child.completion?.resultText?.trim() || child.completion?.fallbackResultText?.trim())) continue;
		const title = child.taskName?.trim() || child.label?.trim() || child.task.trim() || child.childSessionKey.trim() || `child ${index + 1}`;
		const displayIndex = sections.length + 1;
		const result = {
			label: "Child result",
			text: resultText?.trim() || "(no output)",
			truncationMarker: `[result truncated; sessions_history sessionKey=${JSON.stringify(child.childSessionKey)} (text fields truncated to 4,000 characters)]`
		};
		const resultBlock = wrapPromptDataBlock(result) || "Child result: (no output)";
		sections.push({
			result,
			childSessionKey: child.childSessionKey,
			resultBlock,
			minimumChars: (wrapPromptDataBlock({
				...result,
				maxEscapedChars: wrapPromptDataBlock({
					...result,
					text: result.truncationMarker
				}).length - resultFrameChars + MIN_CHILD_COMPLETION_RESULT_CHARS
			}) || resultBlock).length,
			header: [wrapPromptDataBlock({
				label: `${displayIndex}. Child task`,
				text: title,
				maxEscapedChars: MAX_CHILD_COMPLETION_FIELD_CHARS,
				truncationMarker: "…"
			}), `status: ${truncateUtf16WithEllipsis(outcome, MAX_CHILD_COMPLETION_FIELD_CHARS)}`].join("\n")
		});
	}
	if (sections.length === 0) return;
	const heading = "Child completion results:\n\n";
	const available = 159973;
	let minimumChars = sections.reduce((total, section) => total + section.header.length + section.minimumChars + 3, 0);
	let included = sections.length;
	let summary = "";
	for (const omitted of sections.toReversed()) {
		if (minimumChars + (summary ? summary.length + 2 : 0) <= available) break;
		included -= 1;
		minimumChars -= omitted.header.length + omitted.minimumChars + 3;
		const keys = wrapPromptDataBlock({
			label: "First child session keys",
			text: JSON.stringify(sections.slice(included, included + 3).map((row) => row.childSessionKey)),
			maxEscapedChars: MAX_CHILD_COMPLETION_FIELD_CHARS,
			truncationMarker: "…"
		}).replaceAll("\n", " ");
		summary = `${sections.length - included} additional child results omitted; ${keys}. Inspect remaining children with the session tools available to you.`;
	}
	let remaining = available - minimumChars - (summary ? summary.length + 2 : 0);
	const visible = sections.slice(0, included);
	const bySize = visible.toSorted((a, b) => a.resultBlock.length - a.minimumChars - (b.resultBlock.length - b.minimumChars));
	for (const [index, section] of bySize.entries()) {
		const share = section.minimumChars + Math.floor(remaining / (bySize.length - index));
		if (section.resultBlock.length > share) section.resultBlock = wrapPromptDataBlock({
			...section.result,
			maxEscapedChars: share - resultFrameChars
		});
		remaining -= section.resultBlock.length - section.minimumChars;
	}
	return [
		heading,
		...visible.map(({ header, resultBlock }) => `${header}\n${resultBlock}`),
		...summary ? [summary] : []
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
		const text = asOptionalRecord(block)?.text;
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
			const toolCalls = record.toolCalls ?? record.tool_calls;
			const toolCallCount = (Array.isArray(record.content) ? record.content.filter(isContractToolCallBlock).length : 0) + (Array.isArray(toolCalls) ? toolCalls.length : 0);
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
async function readSubagentOutput(sessionKey, outcome, options) {
	const agentId = options?.sessionTarget?.agentId ?? resolveSubagentChildAgentId({
		childSessionKey: sessionKey,
		childAgentId: options?.childAgentId
	});
	if (!agentId) return;
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
			limit: 100,
			agentId
		}
	}) : void 0;
	const snapshot = summarizeSubagentOutputHistory(messages ?? (Array.isArray(history?.messages) ? history.messages : []));
	if (snapshot.waitingForContinuation) return;
	if (snapshot.latestText) return snapshot.latestText;
	if (outcome?.status === "timeout" && (snapshot.latestToolCallCount ?? 0) > 0) return `${snapshot.latestToolCallCount} tool call(s) made without visible output.`;
}
async function readOutputWithRetry(maxWaitMs, retryIntervalMs, readOutput) {
	const waitMs = Math.max(0, Math.min(maxWaitMs, 15e3));
	if (!(waitMs > 0)) return;
	const deadlineAt = performance.now() + waitMs;
	for (;;) {
		const result = await readOutput();
		if (result?.trim()) return result;
		const remainingMs = deadlineAt - performance.now();
		if (remainingMs <= 0) return result;
		await sleep(Math.min(retryIntervalMs, remainingMs));
	}
}
async function readLatestSubagentOutputWithRetry(params) {
	return await readOutputWithRetry(params.maxWaitMs, isFastTestRuntimeEnv() ? FAST_TEST_RETRY_INTERVAL_MS : 100, () => readSubagentOutput(params.sessionKey, params.outcome, { childAgentId: params.childAgentId }));
}
async function readSubagentTimeoutProgress(sessionKey, maxWaitMs, outcome, childAgentId) {
	const initial = await readSubagentOutput(sessionKey, outcome, { childAgentId });
	const progress = initial?.trim() ? initial : await readLatestSubagentOutputWithRetry({
		sessionKey,
		childAgentId,
		maxWaitMs,
		outcome
	});
	return progress && !isSilentReplyText(progress, "NO_REPLY") ? progress : void 0;
}
async function captureSubagentCompletionReply(sessionKey, options) {
	const waitForReply = options?.waitForReply;
	const maxWaitMs = isFastTestRuntimeEnv() ? 50 : 1500;
	const retryIntervalMs = isFastTestRuntimeEnv() ? FAST_TEST_RETRY_INTERVAL_MS : 100;
	const readOutput = () => readSubagentOutput(sessionKey, options?.outcome, { sessionTarget: options?.sessionTarget });
	const immediate = await readOutput();
	if (immediate?.trim()) return immediate;
	if (waitForReply === false) return;
	return await readOutputWithRetry(maxWaitMs, retryIntervalMs, readOutput);
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
		getRuntimeConfig: readRuntimeConfig,
		readSubagentSessionEntry,
		resolveSessionStorePathCore
	});
}
/** Prepare complete result text without changing the bounded lifecycle evidence. */
async function readChildCompletionFindings(children, readSubagentRun) {
	const readCurrent = readSubagentRun ?? await prepareAnnounceRunReader(children.map((child) => child.runId));
	const results = await Promise.all(children.map(async (observed) => {
		const prepared = await readSubagentRunAnnounceResult(observed, readCurrent);
		const child = readCurrent(observed.runId);
		if (!child) throw new SubagentAnnouncePreparationConflictError("A child result changed while preparing the completion batch.");
		return {
			child,
			...prepared
		};
	}));
	const isCurrent = () => results.every((result) => result.isCurrent());
	if (!isCurrent()) throw new SubagentAnnouncePreparationConflictError("A child result changed while preparing the completion batch.");
	return {
		text: buildChildCompletionFindings(results.map(({ child, text }) => Object.assign({}, child, { announceResult: text }))),
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
function selectCurrentRequesterCompletionRows(params) {
	if (params.frozenBatch) return params.rows.filter((entry) => isRequesterCompletionCohortCurrent(entry, params.latestForSession));
	return dedupeLatestChildCompletionRows(filterCurrentDirectChildCompletionRows(params.rows, {
		requesterSessionKey: params.requesterSessionKey,
		requesterAgentId: params.requesterAgentId,
		getLatestSubagentRunByChildSessionKey: (childSessionKey, childAgentId) => params.latestForSession(childSessionKey, void 0, childAgentId)
	}));
}
function formatTokenCount(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "0";
	return formatCompactTokenCount(value);
}
async function buildCompactAnnounceStatsLine(params) {
	const cfg = readRuntimeConfig();
	const agentId = resolveSubagentChildAgentId({
		childSessionKey: params.sessionKey,
		childAgentId: params.childAgentId
	});
	const storePath = agentId ? resolveSessionStorePathCore(cfg.session?.store, { agentId }) : void 0;
	const entry = storePath ? await readSubagentSessionEntry(storePath, params.sessionKey, agentId) : void 0;
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
export { readChildCompletionFindings as a, readSubagentRunAnnounceResult as c, withSubagentOutcomeTiming as d, SubagentAnnouncePreparationConflictError as f, filterCurrentDirectChildCompletionRows as i, readSubagentTimeoutProgress as l, captureSubagentCompletionReply as n, readLatestSubagentOutputWithRetry as o, dedupeLatestChildCompletionRows as r, readSubagentOutput as s, buildCompactAnnounceStatsLine as t, selectCurrentRequesterCompletionRows as u };
