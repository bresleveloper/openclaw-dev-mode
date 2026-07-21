import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { t as createAbortError$1 } from "./abort-signal-BWW6Tk6w.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { c as isRecord$1 } from "./utils-CRO4LGEB.js";
import { o as emitTrustedDiagnosticEvent } from "./diagnostic-events-JZsXee1S.js";
import { p as resolveAgentIdFromSessionKey } from "./session-key-VWT_xzM9.js";
import { i as classifyFailoverReason } from "./errors-XbAR6hS3.js";
import { d as resolveFailoverStatus, l as isTimeoutError, t as FailoverError } from "./failover-error-B2zFYEnG.js";
import { B as resolveExecApprovalsFromFile, _ as minSecurity, b as normalizeExecAsk, h as maxAsk, m as loadExecApprovals } from "./exec-approvals-BIKWP8_V.js";
import "./embedded-agent-helpers-Umilw3Yn.js";
import { t as extractBalancedJsonFragments } from "./balanced-json-cZHIw6Jd.js";
import { h as prepareCliBundleMcpCaptureAttempt, t as buildClaudeOwnerKey } from "./helpers-C2vBBdNP.js";
import { i as formatCliBackendOutputDigest, r as cliBackendLog } from "./log-DNAHyzMi.js";
import crypto from "node:crypto";
//#region src/agents/cli-output.ts
/**
* Parses output from CLI-backed model providers. It supports plain text, JSON,
* JSONL streaming, Claude stream-json dialects, usage metadata, and tool event
* reconstruction.
*/
const CLI_STREAM_JSON_DEFAULT_MAX_TURN_RAW_CHARS = 8 * 1024 * 1024;
const CLI_STREAM_JSON_MIN_TURN_RAW_CHARS = 1024;
const CLI_STREAM_JSON_MAX_CONFIGURABLE_TURN_RAW_CHARS = 64 * 1024 * 1024;
const CLI_STREAM_JSON_DEFAULT_MAX_TURN_LINES = 2e4;
const CLI_STREAM_JSON_MIN_TURN_LINES = 100;
const CLI_STREAM_JSON_MAX_CONFIGURABLE_TURN_LINES = 1e5;
const CLI_STREAM_JSON_MISSING_RESULT_ERROR = "CLI stream-json output ended without a result event.";
function isClaudeCliProvider(providerId) {
	return normalizeLowercaseStringOrEmpty(providerId) === "claude-cli";
}
function isGeminiCliProvider(providerId) {
	return normalizeLowercaseStringOrEmpty(providerId) === "google-gemini-cli";
}
function isGeminiStreamJsonDialect(params) {
	return params.backend.jsonlDialect === "gemini-stream-json" || isGeminiCliProvider(params.providerId);
}
function isStreamJsonDialect(params) {
	return supportsCliJsonlToolEvents(params);
}
/** Returns whether JSONL output carries correlated provider tool events. */
function supportsCliJsonlToolEvents(params) {
	return params.backend.jsonlDialect === "claude-stream-json" || isClaudeCliProvider(params.providerId) || isGeminiStreamJsonDialect(params);
}
function isClaudeStreamJsonResult(params) {
	return supportsCliJsonlToolEvents(params) && params.parsed.type === "result";
}
function extractJsonObjectCandidates(raw) {
	return extractBalancedJsonFragments(raw, { openers: ["{"] }).map((fragment) => fragment.json);
}
function parseJsonRecordCandidates(raw) {
	const parsedRecords = [];
	const trimmed = raw.trim();
	if (!trimmed) return parsedRecords;
	try {
		const parsed = JSON.parse(trimmed);
		if (isRecord$1(parsed)) {
			parsedRecords.push(parsed);
			return parsedRecords;
		}
	} catch {}
	for (const candidate of extractJsonObjectCandidates(trimmed)) try {
		const parsed = JSON.parse(candidate);
		if (isRecord$1(parsed)) parsedRecords.push(parsed);
	} catch {}
	return parsedRecords;
}
function readNestedErrorMessage(parsed) {
	if (isRecord$1(parsed.error)) {
		const errorMessage = readNestedErrorMessage(parsed.error);
		if (errorMessage) return errorMessage;
	}
	if (typeof parsed.message === "string") {
		const trimmed = parsed.message.trim();
		if (trimmed) return trimmed;
	}
	if (typeof parsed.error === "string") {
		const trimmed = parsed.error.trim();
		if (trimmed) return trimmed;
	}
}
function unwrapCliErrorText(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	for (const parsed of parseJsonRecordCandidates(trimmed)) {
		const nested = readNestedErrorMessage(parsed);
		if (nested) return nested;
	}
	return trimmed;
}
function toCliUsage(raw) {
	const readNestedCached = (key) => {
		const nested = raw[key];
		if (!isRecord$1(nested)) return;
		return typeof nested.cached_tokens === "number" && nested.cached_tokens > 0 ? nested.cached_tokens : void 0;
	};
	const pick = (key) => typeof raw[key] === "number" && raw[key] > 0 ? raw[key] : void 0;
	const totalInput = pick("input_tokens") ?? pick("inputTokens");
	const output = pick("output_tokens") ?? pick("outputTokens");
	const nestedCached = readNestedCached("input_tokens_details") ?? readNestedCached("prompt_tokens_details");
	const cacheRead = pick("cache_read_input_tokens") ?? pick("cached_input_tokens") ?? pick("cacheRead") ?? pick("cached") ?? nestedCached;
	const input = pick("input") ?? ((Object.hasOwn(raw, "cached") || nestedCached !== void 0) && typeof totalInput === "number" ? Math.max(0, totalInput - (cacheRead ?? 0)) : totalInput);
	const cacheWrite = pick("cache_creation_input_tokens") ?? pick("cache_write_input_tokens") ?? pick("cacheWrite");
	const total = pick("total_tokens") ?? pick("total");
	if (!input && !output && !cacheRead && !cacheWrite && !total) return;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		total
	};
}
function readCliUsage(parsed) {
	if (isRecord$1(parsed.message) && isRecord$1(parsed.message.usage)) {
		const usage = toCliUsage(parsed.message.usage);
		if (usage) return usage;
	}
	if (isRecord$1(parsed.usage)) {
		const usage = toCliUsage(parsed.usage);
		if (usage) return usage;
	}
	if (isRecord$1(parsed.stats)) return toCliUsage(parsed.stats);
}
function collectCliText(value) {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map((entry) => collectCliText(entry)).join("");
	if (!isRecord$1(value)) return "";
	if (typeof value.response === "string") return value.response;
	if (typeof value.text === "string") return value.text;
	if (typeof value.result === "string") return value.result;
	if (typeof value.content === "string") return value.content;
	if (Array.isArray(value.content)) return value.content.map((entry) => collectCliText(entry)).join("");
	if (isRecord$1(value.message)) return collectCliText(value.message);
	return "";
}
function unwrapNestedCliResultText(raw) {
	let text = raw;
	for (let depth = 0; depth < 8; depth += 1) {
		const trimmed = text.trim();
		if (!trimmed.startsWith("{")) return text;
		try {
			const parsed = JSON.parse(trimmed);
			if (!isRecord$1(parsed) || typeof parsed.type !== "string" || parsed.type !== "result" || typeof parsed.result !== "string") return text;
			text = parsed.result;
		} catch {
			return text;
		}
	}
	return text;
}
function collectExplicitCliErrorText(parsed) {
	const subtype = typeof parsed.subtype === "string" ? parsed.subtype.trim() : "";
	if (parsed.is_error === true || parsed.type === "result" && (subtype.startsWith("error_") || parsed.status === "error")) {
		const text = collectCliText(parsed.result) || collectCliText(parsed.message) || collectCliText(parsed.content);
		if (text) return unwrapCliErrorText(text);
		const nested = readNestedErrorMessage(parsed);
		if (nested) return unwrapCliErrorText(nested);
		if (subtype) return `Claude CLI result subtype ${subtype}.`;
		return "CLI result was marked as an error.";
	}
	const nested = readNestedErrorMessage(parsed);
	if (nested) return unwrapCliErrorText(nested);
	if (parsed.type === "assistant") {
		const text = collectCliText(parsed.message);
		if (/^\s*API Error:/i.test(text)) return unwrapCliErrorText(text);
	}
	if (parsed.type === "error") return unwrapCliErrorText(collectCliText(parsed.message) || collectCliText(parsed.content) || collectCliText(parsed.result) || collectCliText(parsed));
	return "";
}
function pickCliSessionId(parsed, backend) {
	const fields = backend.sessionIdFields ?? [
		"session_id",
		"sessionId",
		"conversation_id",
		"conversationId"
	];
	for (const field of fields) {
		const value = parsed[field];
		if (typeof value === "string" && value.trim()) return value.trim();
	}
}
function shouldUnwrapNestedCliResultText(params) {
	if (!params.providerId || !isClaudeCliProvider(params.providerId)) return false;
	return !Object.hasOwn(params.parsed, "type") || params.parsed.type === "result";
}
function normalizePositiveInt(value, fallback, min, max) {
	if (typeof value !== "number" || !Number.isInteger(value)) return fallback;
	return Math.min(Math.max(value, min), max);
}
function resolveCliStreamJsonOutputLimits(backend) {
	const configured = backend.reliability?.outputLimits;
	const maxTurnRawChars = normalizePositiveInt(configured?.maxTurnRawChars, CLI_STREAM_JSON_DEFAULT_MAX_TURN_RAW_CHARS, CLI_STREAM_JSON_MIN_TURN_RAW_CHARS, CLI_STREAM_JSON_MAX_CONFIGURABLE_TURN_RAW_CHARS);
	return {
		maxTurnRawChars,
		maxPendingLineChars: maxTurnRawChars,
		maxTurnLines: normalizePositiveInt(configured?.maxTurnLines, CLI_STREAM_JSON_DEFAULT_MAX_TURN_LINES, CLI_STREAM_JSON_MIN_TURN_LINES, CLI_STREAM_JSON_MAX_CONFIGURABLE_TURN_LINES)
	};
}
function streamJsonOutputLimitErrorText(kind, limit) {
	if (kind === "line") return `CLI JSONL line exceeded ${limit} characters; refusing to parse output.`;
	if (kind === "lines") return `CLI JSONL output exceeded ${limit} lines; refusing to parse output.`;
	return `CLI JSONL output exceeded ${limit} characters; refusing to parse output.`;
}
function hasExplicitCliErrorPayload(parsed) {
	if (typeof parsed.error === "string") return Boolean(parsed.error.trim());
	if (isRecord$1(parsed.error)) return Boolean(readNestedErrorMessage(parsed.error));
	return false;
}
/** Parses JSON CLI output, including mixed stdout that contains embedded JSON objects. */
/** Parses a single JSON payload emitted by a CLI backend. */
function parseCliJson(raw, backend, providerId) {
	const parsedRecords = parseJsonRecordCandidates(raw);
	if (parsedRecords.length === 0) return null;
	let sessionId;
	let usage;
	let text = "";
	let sawStructuredOutput = false;
	for (const parsed of parsedRecords) {
		sessionId = pickCliSessionId(parsed, backend) ?? sessionId;
		usage = readCliUsage(parsed) ?? usage;
		const subtype = typeof parsed.subtype === "string" ? parsed.subtype.trim() : "";
		const errorText = parsed.is_error === true || parsed.type === "error" || parsed.type === "result" && (subtype.startsWith("error_") || parsed.status === "error" || hasExplicitCliErrorPayload(parsed)) ? collectExplicitCliErrorText(parsed) : "";
		if (errorText) return {
			text: "",
			sessionId,
			usage,
			errorText
		};
		const nextText = collectCliText(parsed.message) || collectCliText(parsed.content) || collectCliText(parsed.result) || collectCliText(parsed.response) || collectCliText(parsed);
		const trimmedText = (shouldUnwrapNestedCliResultText({
			providerId,
			parsed
		}) ? unwrapNestedCliResultText(nextText) : nextText).trim();
		if (trimmedText) {
			text = trimmedText;
			sawStructuredOutput = true;
			continue;
		}
		if (sessionId || usage) sawStructuredOutput = true;
	}
	if (!text && !sawStructuredOutput) return null;
	return {
		text,
		sessionId,
		usage
	};
}
function parseClaudeCliJsonlResult(params) {
	if (!supportsCliJsonlToolEvents(params)) return null;
	if (typeof params.parsed.type === "string" && params.parsed.type === "result") {
		const errorText = collectExplicitCliErrorText(params.parsed);
		if (errorText) return {
			text: "",
			sessionId: params.sessionId,
			usage: params.usage,
			errorText
		};
		if (typeof params.parsed.result !== "string") return null;
		const resultText = unwrapNestedCliResultText(params.parsed.result).trim();
		if (resultText) return {
			text: resultText,
			sessionId: params.sessionId,
			usage: params.usage
		};
		return {
			text: "",
			sessionId: params.sessionId,
			usage: params.usage
		};
	}
	return null;
}
function parseClaudeCliStreamingDelta(params) {
	if (!supportsCliJsonlToolEvents(params)) return null;
	if (params.parsed.type !== "stream_event" || !isRecord$1(params.parsed.event)) return null;
	const event = params.parsed.event;
	if (event.type !== "content_block_delta" || !isRecord$1(event.delta)) return null;
	const delta = event.delta;
	if (delta.type !== "text_delta" || typeof delta.text !== "string") return null;
	if (!delta.text) return null;
	return {
		text: `${params.textSoFar}${delta.text}`,
		delta: delta.text,
		sessionId: params.sessionId,
		usage: params.usage
	};
}
function createToolUseTracker() {
	return {
		pendingByIndex: /* @__PURE__ */ new Map(),
		nameById: /* @__PURE__ */ new Map(),
		startedIds: /* @__PURE__ */ new Set(),
		resultDeliveredIds: /* @__PURE__ */ new Set()
	};
}
function emitToolStartOnce(tracker, toolCallId, name, kind, args, onToolUseStart) {
	if (tracker.startedIds.has(toolCallId)) return;
	tracker.startedIds.add(toolCallId);
	tracker.nameById.set(toolCallId, name);
	onToolUseStart?.({
		toolCallId,
		name,
		kind,
		args
	});
}
function emitToolResultOnce(tracker, toolCallId, isError, result, onToolResult) {
	if (tracker.resultDeliveredIds.has(toolCallId)) return;
	tracker.resultDeliveredIds.add(toolCallId);
	onToolResult?.({
		toolCallId,
		name: tracker.nameById.get(toolCallId) ?? "",
		isError,
		result
	});
}
function isClaudeToolUseBlockType(type) {
	return type === "tool_use" || type === "server_tool_use" || type === "mcp_tool_use";
}
function isClaudeAssistantToolResultBlockType(type) {
	return typeof type === "string" && type.endsWith("_tool_result") && type !== "tool_result";
}
function isClaudeToolResultError(content) {
	return isRecord$1(content) && typeof content.type === "string" && content.type.endsWith("_error");
}
function parseToolInputJson(parts) {
	if (parts.length === 0) return {};
	try {
		const parsed = JSON.parse(parts.join(""));
		return isRecord$1(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
function dispatchClaudeCliStreamingToolEvent(params) {
	if (!supportsCliJsonlToolEvents(params)) return;
	const tracker = params.tracker;
	if (params.parsed.type === "stream_event" && isRecord$1(params.parsed.event)) {
		const event = params.parsed.event;
		if (event.type === "content_block_start" && typeof event.index === "number" && isRecord$1(event.content_block)) {
			const block = event.content_block;
			if (isClaudeToolUseBlockType(block.type)) {
				const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
				const name = typeof block.name === "string" ? block.name.trim() : "";
				if (toolCallId && name) tracker.pendingByIndex.set(event.index, {
					toolCallId,
					name,
					kind: block.type,
					inputJsonParts: []
				});
			} else if (isClaudeAssistantToolResultBlockType(block.type)) {
				const toolCallId = typeof block.tool_use_id === "string" ? block.tool_use_id.trim() : "";
				if (toolCallId) emitToolResultOnce(tracker, toolCallId, block.is_error === true || isClaudeToolResultError(block.content), block.content, params.onToolResult);
			}
			return;
		}
		if (event.type === "content_block_delta" && typeof event.index === "number" && isRecord$1(event.delta)) {
			if (event.delta.type === "input_json_delta" && typeof event.delta.partial_json === "string") tracker.pendingByIndex.get(event.index)?.inputJsonParts.push(event.delta.partial_json);
			return;
		}
		if (event.type === "content_block_stop" && typeof event.index === "number") {
			const pending = tracker.pendingByIndex.get(event.index);
			tracker.pendingByIndex.delete(event.index);
			if (pending) emitToolStartOnce(tracker, pending.toolCallId, pending.name, pending.kind, parseToolInputJson(pending.inputJsonParts), params.onToolUseStart);
			return;
		}
		return;
	}
	if (params.parsed.type === "assistant" && isRecord$1(params.parsed.message)) {
		const message = params.parsed.message;
		const content = Array.isArray(message.content) ? message.content : [];
		for (const block of content) {
			if (!isRecord$1(block)) continue;
			if (isClaudeToolUseBlockType(block.type)) {
				const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
				const name = typeof block.name === "string" ? block.name.trim() : "";
				if (!toolCallId || !name) continue;
				const args = isRecord$1(block.input) ? block.input : {};
				emitToolStartOnce(tracker, toolCallId, name, block.type, args, params.onToolUseStart);
			} else if (isClaudeAssistantToolResultBlockType(block.type)) {
				const toolCallId = typeof block.tool_use_id === "string" ? block.tool_use_id.trim() : "";
				if (!toolCallId) continue;
				emitToolResultOnce(tracker, toolCallId, block.is_error === true || isClaudeToolResultError(block.content), block.content, params.onToolResult);
			}
		}
		return;
	}
	if (params.parsed.type === "user" && isRecord$1(params.parsed.message)) {
		const message = params.parsed.message;
		const content = Array.isArray(message.content) ? message.content : [];
		for (const block of content) {
			if (!isRecord$1(block) || block.type !== "tool_result") continue;
			const toolCallId = typeof block.tool_use_id === "string" ? block.tool_use_id.trim() : "";
			if (!toolCallId) continue;
			emitToolResultOnce(tracker, toolCallId, block.is_error === true, block.content, params.onToolResult);
		}
	}
}
function createThinkingTracker() {
	return {
		streamedByIndex: /* @__PURE__ */ new Map(),
		emittedText: "",
		nextSyntheticBlockIndex: 0,
		progressTokens: 0
	};
}
function resetThinkingBlockState(tracker) {
	tracker.streamedByIndex.clear();
	tracker.emittedText = "";
	tracker.currentSyntheticBlockIndex = void 0;
	tracker.nextSyntheticBlockIndex = 0;
	tracker.progressTokens = 0;
}
function resetThinkingTrackerForMessage(tracker, messageId) {
	if (messageId && messageId === tracker.currentMessageId) return;
	if (messageId && tracker.currentMessageId === void 0) {
		tracker.currentMessageId = messageId;
		return;
	}
	resetThinkingBlockState(tracker);
	tracker.currentMessageId = messageId;
}
function beginClaudeContentBlock(tracker, index) {
	if (typeof index === "number") {
		tracker.currentSyntheticBlockIndex = index;
		tracker.nextSyntheticBlockIndex = Math.max(tracker.nextSyntheticBlockIndex, index + 1);
		return;
	}
	if (index !== void 0) {
		tracker.currentSyntheticBlockIndex = void 0;
		return;
	}
	tracker.currentSyntheticBlockIndex = tracker.nextSyntheticBlockIndex;
	tracker.nextSyntheticBlockIndex += 1;
}
function stopClaudeContentBlock(tracker) {
	tracker.currentSyntheticBlockIndex = void 0;
}
function resolveClaudeContentBlockIndex(tracker, index) {
	if (typeof index === "number") {
		tracker.nextSyntheticBlockIndex = Math.max(tracker.nextSyntheticBlockIndex, index + 1);
		return index;
	}
	if (index !== void 0) return null;
	return tracker.currentSyntheticBlockIndex ?? null;
}
function assembleThinkingTextByIndex(streamedByIndex) {
	return [...streamedByIndex.entries()].toSorted(([left], [right]) => left - right).map(([, text]) => text).join("");
}
function emitClaudeThinking(tracker, index, streamed, delta, onThinkingDelta) {
	tracker.streamedByIndex.set(index, `${streamed}${delta}`);
	tracker.emittedText = assembleThinkingTextByIndex(tracker.streamedByIndex);
	onThinkingDelta({
		text: tracker.emittedText,
		delta,
		isReasoningSnapshot: true
	});
}
function readThinkingProgressTokens(delta) {
	if (delta.type !== "thinking_delta" || delta.thinking !== "") return;
	const estimatedTokens = delta.estimated_tokens;
	if (typeof estimatedTokens !== "number" || !Number.isFinite(estimatedTokens)) return;
	return estimatedTokens > 0 ? estimatedTokens : void 0;
}
function emitClaudeThinkingProgress(tracker, progressTokensDelta, onThinkingProgress) {
	tracker.progressTokens += progressTokensDelta;
	onThinkingProgress({ progressTokens: tracker.progressTokens });
}
function dispatchClaudeCliThinking(params) {
	if (!supportsCliJsonlToolEvents(params)) return;
	const tracker = params.tracker;
	if (params.parsed.type === "stream_event" && isRecord$1(params.parsed.event)) {
		const event = params.parsed.event;
		if (event.type === "message_start") {
			const message = isRecord$1(event.message) ? event.message : void 0;
			resetThinkingTrackerForMessage(tracker, typeof message?.id === "string" ? message.id : void 0);
			return;
		}
		if (event.type === "content_block_start") {
			beginClaudeContentBlock(tracker, event.index);
			return;
		}
		if (event.type === "content_block_stop") {
			stopClaudeContentBlock(tracker);
			return;
		}
		if (event.type !== "content_block_delta" || !isRecord$1(event.delta)) return;
		const blockIndex = resolveClaudeContentBlockIndex(tracker, event.index);
		if (blockIndex === null) return;
		const progressTokensDelta = readThinkingProgressTokens(event.delta);
		if (progressTokensDelta !== void 0 && params.onThinkingProgress) {
			emitClaudeThinkingProgress(tracker, progressTokensDelta, params.onThinkingProgress);
			return;
		}
		if (event.delta.type !== "thinking_delta" || typeof event.delta.thinking !== "string") return;
		if (!event.delta.thinking) return;
		if (!params.onThinkingDelta) return;
		emitClaudeThinking(tracker, blockIndex, tracker.streamedByIndex.get(blockIndex) ?? "", event.delta.thinking, params.onThinkingDelta);
		return;
	}
	if (params.parsed.type === "assistant" && isRecord$1(params.parsed.message)) {
		resetThinkingTrackerForMessage(tracker, typeof params.parsed.message.id === "string" ? params.parsed.message.id : void 0);
		const content = Array.isArray(params.parsed.message.content) ? params.parsed.message.content : [];
		for (const [index, block] of content.entries()) {
			if (!isRecord$1(block) || block.type !== "thinking" || typeof block.thinking !== "string") continue;
			if (!params.onThinkingDelta) continue;
			tracker.streamedByIndex.set(index, block.thinking);
			const text = assembleThinkingTextByIndex(tracker.streamedByIndex);
			if (text === tracker.emittedText) continue;
			tracker.emittedText = text;
			params.onThinkingDelta({
				text,
				delta: block.thinking,
				isReasoningSnapshot: true
			});
		}
	}
}
function dispatchGeminiCliStreamingToolEvent(params) {
	if (!isGeminiStreamJsonDialect(params)) return;
	if (params.parsed.type === "tool_use") {
		const toolCallId = typeof params.parsed.tool_id === "string" ? params.parsed.tool_id.trim() : "";
		const name = typeof params.parsed.tool_name === "string" ? params.parsed.tool_name.trim() : "";
		if (!toolCallId || !name) return;
		const args = isRecord$1(params.parsed.parameters) ? params.parsed.parameters : {};
		emitToolStartOnce(params.tracker, toolCallId, name, "tool_use", args, params.onToolUseStart);
		return;
	}
	if (params.parsed.type === "tool_result") {
		const toolCallId = typeof params.parsed.tool_id === "string" ? params.parsed.tool_id.trim() : "";
		if (!toolCallId) return;
		const result = params.parsed.status === "error" && isRecord$1(params.parsed.error) ? params.parsed.error : params.parsed.output;
		emitToolResultOnce(params.tracker, toolCallId, params.parsed.status === "error", result, params.onToolResult);
	}
}
const GEMINI_CLI_ERROR_EVENT_FALLBACK = "Gemini CLI emitted an error event.";
const GEMINI_CLI_RESULT_ERROR_FALLBACK = "Gemini CLI result status was error.";
function isFallbackGeminiCliStreamJsonError(errorText) {
	return errorText === GEMINI_CLI_ERROR_EVENT_FALLBACK || errorText === GEMINI_CLI_RESULT_ERROR_FALLBACK;
}
function preferGeminiCliStreamJsonError(current, next) {
	if (!current) return next;
	if (isFallbackGeminiCliStreamJsonError(current) && !isFallbackGeminiCliStreamJsonError(next)) return next;
	return current;
}
function readGeminiCliStreamJsonError(parsed) {
	if (parsed.type === "error" && parsed.severity === "error") return collectExplicitCliErrorText(parsed) || GEMINI_CLI_ERROR_EVENT_FALLBACK;
	if (parsed.type === "result" && parsed.status === "error") return collectExplicitCliErrorText(parsed) || GEMINI_CLI_RESULT_ERROR_FALLBACK;
}
/** Creates a stateful parser for streaming JSONL CLI backend output. */
function createCliJsonlStreamingParser(params) {
	let lineBuffer = "";
	let assistantText = "";
	let pendingClaudeText = "";
	let sessionId;
	let usage;
	let output = null;
	let parseErrorText = "";
	let rawChars = 0;
	let rawLines = 0;
	const texts = [];
	const toolTracker = createToolUseTracker();
	const outputLimits = resolveCliStreamJsonOutputLimits(params.backend);
	const classifyClaudeCommentary = Boolean(params.onCommentaryText) && supportsCliJsonlToolEvents(params);
	const thinkingTracker = createThinkingTracker();
	const flushPendingClaudeAssistantText = () => {
		if (!pendingClaudeText) return;
		const delta = pendingClaudeText;
		pendingClaudeText = "";
		assistantText = `${assistantText}${delta}`;
		params.onAssistantDelta({
			text: assistantText,
			delta,
			sessionId,
			usage
		});
	};
	const flushPendingClaudeCommentaryText = () => {
		if (!pendingClaudeText) return;
		const text = pendingClaudeText.trim();
		pendingClaudeText = "";
		if (text) params.onCommentaryText?.(text);
	};
	const handleParsedRecord = (parsed) => {
		if (parseErrorText) return;
		sessionId = pickCliSessionId(parsed, params.backend) ?? sessionId;
		if (!sessionId && typeof parsed.thread_id === "string") sessionId = parsed.thread_id.trim();
		const nextUsage = readCliUsage(parsed);
		if (!isClaudeStreamJsonResult({
			backend: params.backend,
			providerId: params.providerId,
			parsed
		}) || !usage) usage = nextUsage ?? usage;
		const geminiErrorText = isGeminiStreamJsonDialect(params) ? readGeminiCliStreamJsonError(parsed) : void 0;
		if (geminiErrorText) {
			output = {
				text: "",
				sessionId,
				usage,
				errorText: preferGeminiCliStreamJsonError(output?.errorText, geminiErrorText)
			};
			return;
		}
		if (classifyClaudeCommentary && parsed.type === "result") flushPendingClaudeAssistantText();
		const result = parseClaudeCliJsonlResult({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			sessionId,
			usage
		});
		if (result) {
			output = result.text || result.errorText ? result : {
				...result,
				text: assistantText.trim() || texts.join("\n").trim()
			};
			return;
		}
		const item = isRecord$1(parsed.item) ? parsed.item : null;
		if (item && typeof item.text === "string") {
			const type = normalizeLowercaseStringOrEmpty(item.type);
			if (!type || type.includes("message")) texts.push(item.text);
		}
		if (classifyClaudeCommentary && parsed.type === "stream_event" && isRecord$1(parsed.event)) {
			const evt = parsed.event;
			if (evt.type === "content_block_start" && isRecord$1(evt.content_block) && isClaudeToolUseBlockType(evt.content_block.type)) flushPendingClaudeCommentaryText();
			else if (evt.type === "content_block_start" || evt.type === "message_stop") flushPendingClaudeAssistantText();
		}
		if (params.onThinkingDelta || params.onThinkingProgress) dispatchClaudeCliThinking({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			tracker: thinkingTracker,
			onThinkingDelta: params.onThinkingDelta,
			onThinkingProgress: params.onThinkingProgress
		});
		if (params.onToolUseStart || params.onToolResult) {
			dispatchGeminiCliStreamingToolEvent({
				backend: params.backend,
				providerId: params.providerId,
				parsed,
				tracker: toolTracker,
				onToolUseStart: params.onToolUseStart,
				onToolResult: params.onToolResult
			});
			dispatchClaudeCliStreamingToolEvent({
				backend: params.backend,
				providerId: params.providerId,
				parsed,
				tracker: toolTracker,
				onToolUseStart: params.onToolUseStart,
				onToolResult: params.onToolResult
			});
		}
		const delta = parseClaudeCliStreamingDelta({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			textSoFar: assistantText,
			sessionId,
			usage
		});
		if (!delta) {
			if (isGeminiStreamJsonDialect(params) && parsed.type === "message" && parsed.role === "assistant" && typeof parsed.content === "string") {
				const deltaText = parsed.content;
				if (deltaText) {
					assistantText = `${assistantText}${deltaText}`;
					params.onAssistantDelta({
						text: assistantText,
						delta: deltaText,
						sessionId,
						usage
					});
				}
			} else if (isGeminiStreamJsonDialect(params) && parsed.type === "result" && parsed.status === "success") output = {
				text: assistantText.trim(),
				sessionId,
				usage
			};
			return;
		}
		if (classifyClaudeCommentary) {
			pendingClaudeText = `${pendingClaudeText}${delta.delta}`;
			return;
		}
		assistantText = delta.text;
		params.onAssistantDelta(delta);
	};
	const flushLines = (flushPartial) => {
		while (true) {
			if (parseErrorText) return;
			const newlineIndex = lineBuffer.indexOf("\n");
			if (newlineIndex < 0) break;
			const line = lineBuffer.slice(0, newlineIndex).trim();
			lineBuffer = lineBuffer.slice(newlineIndex + 1);
			if (!line) continue;
			rawLines += 1;
			if (rawLines > outputLimits.maxTurnLines) {
				parseErrorText = streamJsonOutputLimitErrorText("lines", outputLimits.maxTurnLines);
				lineBuffer = "";
				return;
			}
			for (const parsed of parseJsonRecordCandidates(line)) handleParsedRecord(parsed);
		}
		if (!flushPartial) return;
		const tail = lineBuffer.trim();
		lineBuffer = "";
		if (!tail) return;
		for (const parsed of parseJsonRecordCandidates(tail)) handleParsedRecord(parsed);
	};
	return {
		push(chunk) {
			if (!chunk || parseErrorText) return;
			rawChars += chunk.length;
			if (rawChars > outputLimits.maxTurnRawChars) {
				parseErrorText = streamJsonOutputLimitErrorText("raw", outputLimits.maxTurnRawChars);
				lineBuffer = "";
				return;
			}
			if (lineBuffer.length + chunk.length > outputLimits.maxPendingLineChars) {
				parseErrorText = streamJsonOutputLimitErrorText("line", outputLimits.maxPendingLineChars);
				lineBuffer = "";
				return;
			}
			lineBuffer += chunk;
			flushLines(false);
		},
		finish() {
			if (parseErrorText) return;
			flushLines(true);
			if (classifyClaudeCommentary) flushPendingClaudeAssistantText();
		},
		getErrorText() {
			return parseErrorText || null;
		},
		getOutput() {
			if (parseErrorText) return {
				text: "",
				sessionId,
				usage,
				errorText: parseErrorText
			};
			if (output) return output;
			if (isStreamJsonDialect(params) && assistantText.trim()) return {
				text: assistantText.trim(),
				sessionId,
				usage
			};
			const text = texts.join("\n").trim();
			return text ? {
				text,
				sessionId,
				usage
			} : null;
		}
	};
}
/** Parses complete JSONL CLI output into the final assistant result and metadata. */
/** Parses complete JSONL output from a CLI backend into normalized text and metadata. */
function parseCliJsonl(raw, backend, providerId) {
	const lines = normalizeStringEntries(raw.split(/\r?\n/g));
	if (lines.length === 0) return null;
	let sessionId;
	let usage;
	const texts = [];
	let streamJsonText = "";
	let geminiErrorText;
	let sawGeminiStructuredOutput = false;
	const streamJsonDialect = isStreamJsonDialect({
		backend,
		providerId
	});
	for (const line of lines) for (const parsed of parseJsonRecordCandidates(line)) {
		sessionId = pickCliSessionId(parsed, backend) ?? sessionId;
		if (!sessionId && typeof parsed.thread_id === "string") sessionId = parsed.thread_id.trim();
		const nextUsage = readCliUsage(parsed);
		if (!isClaudeStreamJsonResult({
			backend,
			providerId,
			parsed
		}) || !usage) usage = nextUsage ?? usage;
		if (isGeminiStreamJsonDialect({
			backend,
			providerId
		})) {
			const nextGeminiErrorText = readGeminiCliStreamJsonError(parsed);
			if (nextGeminiErrorText) {
				geminiErrorText = preferGeminiCliStreamJsonError(geminiErrorText, nextGeminiErrorText);
				sawGeminiStructuredOutput = true;
				continue;
			}
			if (parsed.type === "message" && parsed.role === "assistant" && typeof parsed.content === "string") {
				streamJsonText = `${streamJsonText}${parsed.content}`;
				sawGeminiStructuredOutput = true;
				continue;
			}
			if (parsed.type === "tool_use" || parsed.type === "tool_result" || parsed.type === "result") sawGeminiStructuredOutput = true;
		}
		const claudeResult = parseClaudeCliJsonlResult({
			backend,
			providerId,
			parsed,
			sessionId,
			usage
		});
		if (claudeResult) {
			if (claudeResult.text || claudeResult.errorText) return claudeResult;
			return {
				...claudeResult,
				text: streamJsonText.trim() || texts.join("\n").trim()
			};
		}
		const claudeDelta = parseClaudeCliStreamingDelta({
			backend,
			providerId,
			parsed,
			textSoFar: streamJsonText,
			sessionId,
			usage
		});
		if (claudeDelta) {
			streamJsonText = claudeDelta.text;
			continue;
		}
		const item = isRecord$1(parsed.item) ? parsed.item : null;
		if (item && typeof item.text === "string") {
			const type = normalizeLowercaseStringOrEmpty(item.type);
			if (!type || type.includes("message")) texts.push(item.text);
		}
	}
	if (isGeminiStreamJsonDialect({
		backend,
		providerId
	}) && geminiErrorText) return {
		text: "",
		sessionId,
		usage,
		errorText: geminiErrorText
	};
	if (streamJsonDialect && (streamJsonText.trim() || sawGeminiStructuredOutput)) return {
		text: streamJsonText.trim(),
		sessionId,
		usage
	};
	if (streamJsonDialect) return {
		text: "",
		sessionId,
		usage,
		errorText: CLI_STREAM_JSON_MISSING_RESULT_ERROR
	};
	const text = texts.join("\n").trim();
	if (!text) return null;
	return {
		text,
		sessionId,
		usage
	};
}
/** Parses CLI output according to the backend output mode with text fallback. */
/** Parses CLI backend output using the configured JSON/JSONL/plain-text mode. */
function parseCliOutput(params) {
	const outputMode = params.outputMode ?? "text";
	if (outputMode === "text") return {
		text: params.raw.trim(),
		sessionId: params.fallbackSessionId
	};
	if (outputMode === "jsonl") {
		const parsed = parseCliJsonl(params.raw, params.backend, params.providerId);
		if (parsed) return parsed;
		if (isStreamJsonDialect(params)) return {
			text: "",
			sessionId: params.fallbackSessionId,
			errorText: CLI_STREAM_JSON_MISSING_RESULT_ERROR
		};
		return {
			text: params.raw.trim(),
			sessionId: params.fallbackSessionId
		};
	}
	return parseCliJson(params.raw, params.backend, params.providerId) ?? {
		text: params.raw.trim(),
		sessionId: params.fallbackSessionId
	};
}
/** Extracts the most specific structured CLI error message from mixed or JSON output. */
/** Extracts a human-readable error message from mixed CLI stderr/stdout text. */
function extractCliErrorMessage(raw) {
	const parsedRecords = parseJsonRecordCandidates(raw);
	if (parsedRecords.length === 0) return null;
	let errorText = "";
	for (const parsed of parsedRecords) {
		const next = collectExplicitCliErrorText(parsed);
		if (next) errorText = next;
	}
	return errorText || null;
}
//#endregion
//#region src/agents/cli-runner/claude-live-session.ts
/**
* Manages reusable Claude CLI stdio sessions for CLI-backed agent turns.
*/
const CLAUDE_LIVE_IDLE_TIMEOUT_MS = 600 * 1e3;
const CLAUDE_LIVE_ACTIVE_TOOL_PROGRESS_MS = 1e4;
const CLAUDE_LIVE_MAX_SESSIONS = 16;
const CLAUDE_LIVE_MAX_STDERR_CHARS = 64 * 1024;
const CLAUDE_LIVE_CLOSE_WAIT_TIMEOUT_MS = 5e3;
const liveSessions = /* @__PURE__ */ new Map();
const liveSessionCreates = /* @__PURE__ */ new Map();
function sha256(value) {
	return crypto.createHash("sha256").update(value).digest("hex");
}
async function waitForManagedRunExit(managedRun) {
	let timeout = null;
	try {
		await Promise.race([managedRun.wait().then(() => void 0, () => void 0), new Promise((resolve) => {
			timeout = setTimeout(resolve, CLAUDE_LIVE_CLOSE_WAIT_TIMEOUT_MS);
			timeout.unref?.();
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
/** Closes the live Claude session associated with a prepared run context, if one exists. */
async function closeClaudeLiveSessionForContext(context) {
	const key = buildClaudeLiveKey(context);
	const session = liveSessions.get(key);
	if (session) {
		closeLiveSession(session, "restart");
		await waitForManagedRunExit(session.managedRun);
	}
	liveSessionCreates.delete(key);
}
/** Close a tainted live process so its replacement gets a fresh MCP capture key. */
async function rotateClaudeLiveMcpCaptureKeyForContext(context) {
	await closeClaudeLiveSessionForContext(context);
}
/** Returns whether a prepared backend context is eligible for Claude live stdio reuse. */
function shouldUseClaudeLiveSession(context) {
	return context.backendResolved.id === "claude-cli" && context.preparedBackend.backend.liveSession === "claude-stdio" && context.preparedBackend.backend.output === "jsonl" && context.preparedBackend.backend.input === "stdin";
}
function upsertArgValue(args, flag, value) {
	const normalized = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i] ?? "";
		if (arg === flag) {
			i += 1;
			continue;
		}
		if (arg.startsWith(`${flag}=`)) continue;
		normalized.push(arg);
	}
	normalized.push(flag, value);
	return normalized;
}
function appendArg(args, flag) {
	return args.includes(flag) ? args : [...args, flag];
}
function stripLiveProcessArgs(args, backend, stripSystemPrompt) {
	const liveProcessFlags = new Set([
		backend.sessionArg,
		"--session-id",
		stripSystemPrompt ? backend.systemPromptArg : void 0,
		stripSystemPrompt ? backend.systemPromptFileArg : void 0
	].filter((entry) => typeof entry === "string" && entry.length > 0));
	const stripped = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i] ?? "";
		if (liveProcessFlags.has(arg)) {
			i += 1;
			continue;
		}
		if ([...liveProcessFlags].some((flag) => arg.startsWith(`${flag}=`))) continue;
		stripped.push(arg);
	}
	return stripped;
}
/** Builds Claude CLI args for stream-json live sessions, stripping one-shot session flags. */
function buildClaudeLiveArgs(params) {
	const liveArgs = appendArg(upsertArgValue(upsertArgValue(upsertArgValue(stripLiveProcessArgs(params.args, params.backend, params.useResume && params.backend.systemPromptWhen !== "always"), "--input-format", "stream-json"), "--output-format", "stream-json"), "--permission-prompt-tool", "stdio"), "--replay-user-messages");
	return params.permissionMode ? upsertArgValue(liveArgs, "--permission-mode", params.permissionMode) : liveArgs;
}
function buildClaudeLiveKey(context) {
	return `${context.backendResolved.id}:${buildClaudeOwnerKey({
		agentAccountId: context.params.agentAccountId,
		agentId: context.params.agentId,
		authProfileId: context.effectiveAuthProfileId,
		sessionId: context.params.sessionId,
		sessionKey: context.params.sessionKey
	})}`;
}
function buildClaudeLiveFingerprint(params) {
	const normalizeMcpConfigPath = Boolean(params.context.preparedBackend.mcpConfigHash);
	const skillSnapshot = params.context.params.skillsSnapshot;
	const skillsFingerprint = skillSnapshot ? sha256(JSON.stringify({
		promptHash: sha256(skillSnapshot.prompt),
		skillFilter: skillSnapshot.skillFilter,
		skills: skillSnapshot.skills,
		resolvedSkills: (skillSnapshot.resolvedSkills ?? []).map((skill) => ({
			name: skill.name,
			description: skill.description,
			filePath: skill.filePath,
			sourceInfo: skill.sourceInfo
		})),
		version: skillSnapshot.version
	})) : void 0;
	const normalizePluginDir = Boolean(skillsFingerprint);
	const omittedValueFlags = new Set([
		params.context.preparedBackend.backend.systemPromptArg,
		params.context.preparedBackend.backend.systemPromptFileArg,
		"--resume",
		"-r"
	].filter((entry) => typeof entry === "string" && entry.length > 0));
	const unstableValueFlags = new Set([
		params.context.preparedBackend.backend.sessionArg,
		"--session-id",
		normalizeMcpConfigPath ? "--mcp-config" : void 0,
		normalizePluginDir ? "--plugin-dir" : void 0
	].filter((entry) => typeof entry === "string" && entry.length > 0));
	const stableArgv = [];
	for (let i = 0; i < params.argv.length; i += 1) {
		const entry = params.argv[i] ?? "";
		if (omittedValueFlags.has(entry)) {
			i += 1;
			continue;
		}
		if ([...omittedValueFlags].some((flag) => entry.startsWith(`${flag}=`))) continue;
		if (unstableValueFlags.has(entry)) {
			stableArgv.push("<unstable>");
			i += 1;
			continue;
		}
		if ([...unstableValueFlags].some((flag) => entry.startsWith(`${flag}=`))) {
			stableArgv.push("<unstable>");
			continue;
		}
		stableArgv.push(entry);
	}
	return JSON.stringify({
		command: params.context.preparedBackend.backend.command,
		workspaceDirHash: sha256(params.context.workspaceDir),
		cwdHash: params.context.cwdHash ?? sha256(params.context.cwd ?? params.context.workspaceDir),
		provider: params.context.params.provider,
		model: params.context.normalizedModel,
		systemPromptHash: sha256(params.context.systemPrompt),
		authProfileIdHash: params.context.effectiveAuthProfileId ? sha256(params.context.effectiveAuthProfileId) : void 0,
		authEpochHash: params.context.authEpoch ? sha256(params.context.authEpoch) : void 0,
		extraSystemPromptHash: params.context.extraSystemPromptHash,
		promptToolNamesHash: params.context.promptToolNamesHash,
		mcpConfigHash: params.context.preparedBackend.mcpConfigHash,
		skillsFingerprint,
		argv: stableArgv,
		env: Object.keys(params.env).toSorted().map((key) => [key, params.env[key] ? sha256(params.env[key]) : ""])
	});
}
function createAbortError(reason) {
	if (reason instanceof Error && isTimeoutError(reason)) return reason;
	if (reason === void 0) return createAbortError$1("CLI run aborted");
	const error = new Error(reason instanceof Error ? reason.message : typeof reason === "string" ? reason : "CLI run aborted", reason instanceof Error ? { cause: reason } : void 0);
	error.name = "AbortError";
	return error;
}
function clearTurnTimers(turn) {
	if (turn.noOutputTimer) {
		clearTimeout(turn.noOutputTimer);
		turn.noOutputTimer = null;
	}
	if (turn.timeoutTimer) {
		clearTimeout(turn.timeoutTimer);
		turn.timeoutTimer = null;
	}
	if (turn.activeToolTimer) {
		clearInterval(turn.activeToolTimer);
		turn.activeToolTimer = null;
	}
}
function finishTurn(session, output) {
	const turn = session.currentTurn;
	if (!turn) return;
	cliBackendLog.info(`claude live session turn: provider=${session.providerId} model=${session.modelId} durationMs=${Date.now() - turn.startedAtMs} rawLines=${turn.rawLines.length} ${formatCliBackendOutputDigest(output.text)}`);
	turn.streamingParser.finish();
	failActiveClaudeLiveTools(turn, /* @__PURE__ */ new Error("Tool result missing before turn completed"));
	clearTurnTimers(turn);
	session.currentTurn = null;
	turn.resolve(output);
	scheduleIdleClose(session);
}
function failTurn(session, error) {
	const turn = session.currentTurn;
	if (!turn) return;
	const errorKind = error instanceof Error ? error.name : typeof error;
	cliBackendLog.warn(`claude live session turn failed: provider=${session.providerId} model=${session.modelId} durationMs=${Date.now() - turn.startedAtMs} error=${errorKind}`);
	turn.streamingParser.finish();
	failActiveClaudeLiveTools(turn, error);
	clearTurnTimers(turn);
	session.currentTurn = null;
	turn.reject(error);
}
function abortTurn(session, error) {
	if (!session.currentTurn) return;
	closeLiveSession(session, "abort", error);
}
function cleanupLiveSession(session) {
	if (!session.cleanupPromise) session.cleanupPromise = session.cleanup().catch((error) => {
		cliBackendLog.warn(`Claude live session cleanup failed: ${formatErrorMessage(error)}`);
	});
	return session.cleanupPromise;
}
function closeLiveSession(session, reason, error) {
	if (session.closing) return;
	cliBackendLog.info(`claude live session close: provider=${session.providerId} model=${session.modelId} reason=${reason}`);
	session.closing = true;
	if (session.idleTimer) {
		clearTimeout(session.idleTimer);
		session.idleTimer = null;
	}
	if (liveSessions.get(session.key) === session) liveSessions.delete(session.key);
	if (error) failTurn(session, error);
	session.managedRun.cancel("manual-cancel");
	cleanupLiveSession(session);
}
function scheduleIdleClose(session) {
	if (session.idleTimer) clearTimeout(session.idleTimer);
	session.idleTimer = setTimeout(() => {
		if (!session.currentTurn) closeLiveSession(session, "idle");
	}, CLAUDE_LIVE_IDLE_TIMEOUT_MS);
}
function createTimeoutError(session, message, code) {
	return new FailoverError(message, {
		reason: "timeout",
		provider: session.providerId,
		model: session.modelId,
		status: resolveFailoverStatus("timeout"),
		code
	});
}
function createOutputLimitError(session, message) {
	return new FailoverError(message, {
		reason: "format",
		provider: session.providerId,
		model: session.modelId,
		status: resolveFailoverStatus("format")
	});
}
function diagnosticToolSourceForClaudeLiveTool(toolName) {
	return toolName.startsWith("mcp__") ? "mcp" : "core";
}
function claudeLiveDiagnosticBase(turn) {
	return {
		runId: turn.diagnosticRefs.runId,
		sessionId: turn.diagnosticRefs.sessionId,
		...turn.diagnosticRefs.sessionKey ? { sessionKey: turn.diagnosticRefs.sessionKey } : {},
		...turn.diagnosticRefs.agentId ? { agentId: turn.diagnosticRefs.agentId } : {}
	};
}
function emitClaudeLiveProgress(turn, reason) {
	emitTrustedDiagnosticEvent({
		type: "run.progress",
		...claudeLiveDiagnosticBase(turn),
		reason
	});
}
function summarizeClaudeLiveToolInput(input) {
	if (input === void 0) return;
	if (input === null) return { kind: "null" };
	if (Array.isArray(input)) return {
		kind: "array",
		length: input.length
	};
	switch (typeof input) {
		case "object": return { kind: "object" };
		case "string": return {
			kind: "string",
			length: input.length
		};
		case "number": return { kind: "number" };
		case "boolean": return { kind: "boolean" };
		case "undefined": return { kind: "undefined" };
		default: return { kind: "other" };
	}
}
function startClaudeLiveActiveToolHeartbeat(turn) {
	if (turn.activeToolTimer || turn.activeTools.size === 0) return;
	turn.activeToolTimer = setInterval(() => {
		if (turn.activeTools.size === 0) {
			if (turn.activeToolTimer) {
				clearInterval(turn.activeToolTimer);
				turn.activeToolTimer = null;
			}
			return;
		}
		emitClaudeLiveProgress(turn, "cli_live:tool_running");
	}, CLAUDE_LIVE_ACTIVE_TOOL_PROGRESS_MS);
	turn.activeToolTimer.unref?.();
}
function stopClaudeLiveActiveToolHeartbeatIfIdle(turn) {
	if (turn.activeTools.size > 0 || !turn.activeToolTimer) return;
	clearInterval(turn.activeToolTimer);
	turn.activeToolTimer = null;
}
function markClaudeLiveToolStarted(turn, tool) {
	if (turn.completedToolCallIds.has(tool.toolCallId) || turn.activeTools.has(tool.toolCallId)) return;
	const now = Date.now();
	turn.activeTools.set(tool.toolCallId, {
		toolName: tool.name,
		toolCallId: tool.toolCallId,
		kind: tool.kind,
		startedAt: now
	});
	turn.toolEventCount += 1;
	emitTrustedDiagnosticEvent({
		type: "tool.execution.started",
		...claudeLiveDiagnosticBase(turn),
		toolName: tool.name,
		toolSource: diagnosticToolSourceForClaudeLiveTool(tool.name),
		toolOwner: "claude-cli",
		toolCallId: tool.toolCallId,
		paramsSummary: summarizeClaudeLiveToolInput(tool.args)
	});
	emitClaudeLiveProgress(turn, "cli_live:tool_started");
	startClaudeLiveActiveToolHeartbeat(turn);
}
function markClaudeLiveToolCompleted(turn, result, terminalOutcome) {
	if (turn.completedToolCallIds.has(result.toolCallId)) return;
	turn.toolEventCount += 1;
	const activeTool = turn.activeTools.get(result.toolCallId);
	if (!activeTool) {
		emitClaudeLiveProgress(turn, "cli_live:tool_result");
		return;
	}
	turn.activeTools.delete(result.toolCallId);
	turn.completedToolCallIds.add(result.toolCallId);
	const event = {
		...claudeLiveDiagnosticBase(turn),
		toolName: activeTool.toolName,
		toolSource: diagnosticToolSourceForClaudeLiveTool(activeTool.toolName),
		toolOwner: "claude-cli",
		toolCallId: activeTool.toolCallId,
		durationMs: Math.max(0, Date.now() - activeTool.startedAt)
	};
	if (terminalOutcome?.outcome === "blocked") emitTrustedDiagnosticEvent({
		type: "tool.execution.blocked",
		...event,
		deniedReason: terminalOutcome.deniedReason,
		reason: terminalOutcome.reason ?? "blocked by before-tool policy"
	});
	else if (terminalOutcome?.outcome === "unknown") emitTrustedDiagnosticEvent({
		type: "tool.execution.error",
		...event,
		errorCategory: "cli_tool_ambiguous",
		errorCode: "tool_outcome_unknown"
	});
	else if (terminalOutcome || result.isError) {
		const terminalReason = terminalOutcome?.outcome ?? "failed";
		emitTrustedDiagnosticEvent({
			type: "tool.execution.error",
			...event,
			errorCategory: terminalReason === "cancelled" ? "aborted" : "tool_failed",
			terminalReason
		});
	} else emitTrustedDiagnosticEvent({
		type: "tool.execution.completed",
		...event
	});
	emitClaudeLiveProgress(turn, "cli_live:tool_result");
	stopClaudeLiveActiveToolHeartbeatIfIdle(turn);
}
function markClaudeLiveToolDenied(turn, tool) {
	markClaudeLiveToolStarted(turn, tool);
	markClaudeLiveToolCompleted(turn, {
		toolCallId: tool.toolCallId,
		name: tool.name,
		isError: true
	}, {
		outcome: "blocked",
		deniedReason: "cli_live_exec_policy",
		reason: "blocked by CLI live execution policy"
	});
}
function failActiveClaudeLiveTools(turn, error) {
	const timedOut = isTimeoutError(error) || error instanceof FailoverError && error.reason === "timeout";
	const aborted = error instanceof Error && error.name === "AbortError";
	const errorCategory = timedOut ? "timeout" : aborted ? "aborted" : "error";
	const terminalReason = timedOut ? "timed_out" : aborted ? "cancelled" : "failed";
	for (const activeTool of turn.activeTools.values()) {
		const event = {
			...claudeLiveDiagnosticBase(turn),
			toolName: activeTool.toolName,
			toolSource: diagnosticToolSourceForClaudeLiveTool(activeTool.toolName),
			toolOwner: "claude-cli",
			toolCallId: activeTool.toolCallId,
			durationMs: Math.max(0, Date.now() - activeTool.startedAt)
		};
		if (activeTool.kind === "server_tool_use") {
			emitTrustedDiagnosticEvent({
				type: "tool.execution.error",
				...event,
				errorCategory: "cli_tool_ambiguous",
				errorCode: "tool_outcome_unknown"
			});
			continue;
		}
		emitTrustedDiagnosticEvent({
			type: "tool.execution.error",
			...event,
			errorCategory,
			terminalReason
		});
	}
	turn.activeTools.clear();
}
function noteClaudeLiveProgress(turn, parsed, sawToolEvent) {
	if (parsed.type === "result") {
		emitClaudeLiveProgress(turn, "cli_live:result");
		return;
	}
	if (sawToolEvent) return;
	emitClaudeLiveProgress(turn, "cli_live:stream_progress");
}
function resetNoOutputTimer(session) {
	const turn = session.currentTurn;
	if (!turn) return;
	if (turn.noOutputTimer) clearTimeout(turn.noOutputTimer);
	turn.noOutputTimer = setTimeout(() => {
		closeLiveSession(session, "abort", createTimeoutError(session, `CLI produced no output for ${Math.round(session.noOutputTimeoutMs / 1e3)}s and was terminated.`));
	}, session.noOutputTimeoutMs);
}
function parseSessionId(parsed) {
	return (typeof parsed.session_id === "string" ? parsed.session_id.trim() : typeof parsed.sessionId === "string" ? parsed.sessionId.trim() : "") || void 0;
}
function readConfiguredExecPolicy(context) {
	const agentId = context.params.agentId ?? resolveAgentIdFromSessionKey(context.params.sessionKey);
	const exec = context.params.config?.agents?.list?.find((agent) => agent.id === agentId)?.tools?.exec ?? context.params.config?.tools?.exec;
	const security = exec?.security ?? "full";
	const configuredAsk = exec?.ask ?? "off";
	const sessionAsk = normalizeExecAsk(context.params.sessionEntry?.execAsk);
	return {
		agentId,
		security,
		ask: sessionAsk ? maxAsk(configuredAsk, sessionAsk) : configuredAsk
	};
}
function resolveClaudeLiveExecPermission(context) {
	const configured = readConfiguredExecPolicy(context);
	const approvals = resolveExecApprovalsFromFile({
		file: loadExecApprovals(),
		agentId: configured.agentId,
		overrides: {
			security: configured.security,
			ask: configured.ask
		}
	});
	const security = minSecurity(configured.security, approvals.agent.security);
	const ask = maxAsk(configured.ask, approvals.agent.ask);
	return {
		security,
		ask,
		permissionMode: security === "full" && ask === "off" ? "bypassPermissions" : "default"
	};
}
function parseClaudeLiveJsonLine(session, trimmed) {
	const maxPendingLineChars = session.currentTurn?.outputLimits.maxPendingLineChars ?? 8388608;
	if (trimmed.length > maxPendingLineChars) {
		closeLiveSession(session, "abort", createOutputLimitError(session, "Claude CLI JSONL line exceeded output limit."));
		return null;
	}
	let parsed;
	try {
		parsed = JSON.parse(trimmed);
	} catch {
		return null;
	}
	return isRecord(parsed) ? parsed : null;
}
function createParsedOutputError(session, output) {
	const message = output.errorText || "Claude CLI failed.";
	const reason = classifyFailoverReason(message, { provider: session.providerId }) ?? "unknown";
	const code = reason === "context_overflow" ? "cli_context_overflow" : void 0;
	return new FailoverError(message, {
		reason,
		provider: session.providerId,
		model: session.modelId,
		status: resolveFailoverStatus(reason),
		code
	});
}
function writeClaudeLiveControlResponse(session, response) {
	const stdin = session.managedRun.stdin;
	if (!stdin) throw new Error("Claude CLI live session stdin is unavailable");
	stdin.write(`${JSON.stringify(response)}\n`);
}
function handleClaudeLiveControlRequest(session, turn, parsed) {
	if (parsed.type !== "control_request" || !isRecord(parsed.request)) return;
	const request = parsed.request;
	if (request.subtype !== "can_use_tool") return;
	const requestId = typeof parsed.request_id === "string" ? parsed.request_id : "";
	if (!requestId) return;
	const toolUseId = typeof request.tool_use_id === "string" ? request.tool_use_id : void 0;
	const toolName = typeof request.tool_name === "string" ? request.tool_name.trim() : "";
	const toolInput = isRecord(request.input) ? request.input : {};
	const allowed = turn.execPermission.security === "full" && turn.execPermission.ask === "off";
	if (!allowed && toolUseId && toolName) markClaudeLiveToolDenied(turn, {
		toolCallId: toolUseId,
		name: toolName,
		kind: "tool_use",
		args: toolInput
	});
	writeClaudeLiveControlResponse(session, {
		type: "control_response",
		response: {
			subtype: "success",
			request_id: requestId,
			response: allowed ? {
				behavior: "allow",
				updatedInput: toolInput,
				...toolUseId ? { toolUseID: toolUseId } : {}
			} : {
				behavior: "deny",
				decisionClassification: "user_reject",
				message: `OpenClaw exec policy denied Claude native tool use (security=${turn.execPermission.security}, ask=${turn.execPermission.ask}).`
			}
		}
	});
}
function handleClaudeLiveLine(session, line) {
	const turn = session.currentTurn;
	const trimmed = line.trim();
	if (!trimmed) return;
	const parsed = parseClaudeLiveJsonLine(session, trimmed);
	if (turn) turn.observedStdout = true;
	if (!parsed) return;
	if (!turn) return;
	turn.rawChars += trimmed.length + 1;
	if (turn.rawChars > turn.outputLimits.maxTurnRawChars || turn.rawLines.length >= turn.outputLimits.maxTurnLines) {
		closeLiveSession(session, "abort", createOutputLimitError(session, "Claude CLI turn output exceeded limit."));
		return;
	}
	turn.rawLines.push(trimmed);
	const toolEventCountBefore = turn.toolEventCount;
	turn.streamingParser.push(`${trimmed}\n`);
	turn.sessionId = parseSessionId(parsed) ?? turn.sessionId;
	noteClaudeLiveProgress(turn, parsed, turn.toolEventCount !== toolEventCountBefore);
	handleClaudeLiveControlRequest(session, turn, parsed);
	if (parsed.type !== "result") return;
	const raw = turn.rawLines.join("\n");
	const output = turn.streamingParser.getOutput() ?? parseCliOutput({
		raw,
		backend: turn.backend,
		providerId: session.providerId,
		outputMode: "jsonl",
		fallbackSessionId: turn.sessionId
	});
	if (output.errorText) {
		failTurn(session, createParsedOutputError(session, output));
		scheduleIdleClose(session);
		return;
	}
	finishTurn(session, output);
}
function handleClaudeStdout(session, chunk) {
	resetNoOutputTimer(session);
	session.stdoutBuffer += chunk;
	const maxPendingLineChars = session.currentTurn?.outputLimits.maxPendingLineChars ?? 8388608;
	if (session.stdoutBuffer.length > maxPendingLineChars) {
		closeLiveSession(session, "abort", createOutputLimitError(session, "Claude CLI JSONL line exceeded output limit."));
		return;
	}
	const lines = session.stdoutBuffer.split(/\r?\n/g);
	session.stdoutBuffer = lines.pop() ?? "";
	try {
		for (const line of lines) handleClaudeLiveLine(session, line);
	} catch (error) {
		closeLiveSession(session, "abort", error);
	}
}
function handleClaudeExit(session, exitCode) {
	session.closing = true;
	if (session.idleTimer) {
		clearTimeout(session.idleTimer);
		session.idleTimer = null;
	}
	if (liveSessions.get(session.key) === session) liveSessions.delete(session.key);
	cleanupLiveSession(session);
	if (!session.currentTurn) return;
	if (session.stdoutBuffer.trim()) {
		try {
			handleClaudeLiveLine(session, session.stdoutBuffer);
		} catch (error) {
			session.stdoutBuffer = "";
			failTurn(session, error);
			return;
		}
		session.stdoutBuffer = "";
	}
	if (!session.currentTurn) return;
	const stderr = session.stderr.trim();
	const fallbackMessage = exitCode === 0 ? "Claude CLI exited before completing the turn." : "Claude CLI failed.";
	const message = extractCliErrorMessage(stderr) ?? (stderr || fallbackMessage);
	if (exitCode === 0 && !stderr) {
		const turn = session.currentTurn;
		const retryCode = turn && !turn.observedStdout && turn.rawLines.length === 0 ? "cli_unknown_empty_failure" : void 0;
		failTurn(session, new FailoverError(message, {
			reason: "empty_response",
			provider: session.providerId,
			model: session.modelId,
			status: resolveFailoverStatus("empty_response"),
			code: retryCode
		}));
		return;
	}
	const reason = classifyFailoverReason(message, { provider: session.providerId }) ?? "unknown";
	const code = reason === "context_overflow" ? "cli_context_overflow" : void 0;
	failTurn(session, new FailoverError(message, {
		reason,
		provider: session.providerId,
		model: session.modelId,
		status: resolveFailoverStatus(reason),
		code
	}));
}
function createClaudeUserInputMessage(content) {
	return `${JSON.stringify({
		type: "user",
		session_id: "",
		parent_tool_use_id: null,
		message: {
			role: "user",
			content
		}
	})}\n`;
}
async function writeTurnInput(session, prompt) {
	const stdin = session.managedRun.stdin;
	if (!stdin) throw new Error("Claude CLI live session stdin is unavailable");
	await new Promise((resolve, reject) => {
		stdin.write(createClaudeUserInputMessage(prompt), (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}
async function createClaudeLiveSession(params) {
	let session = null;
	const mcpCaptureAttempt = await prepareCliBundleMcpCaptureAttempt({
		mode: params.context.backendResolved.bundleMcpMode,
		backend: params.context.preparedBackend.backend,
		env: params.env,
		captureKey: params.mcpCaptureKey
	});
	let managedRun;
	try {
		managedRun = await params.supervisor.spawn({
			sessionId: params.context.params.sessionId,
			backendId: params.context.backendResolved.id,
			scopeKey: `claude-live:${params.key}`,
			replaceExistingScope: true,
			mode: "child",
			argv: params.argv,
			cwd: params.context.cwd ?? params.context.workspaceDir,
			env: mcpCaptureAttempt.env ?? params.env,
			stdinMode: "pipe-open",
			captureOutput: false,
			onStdout: (chunk) => {
				if (session) handleClaudeStdout(session, chunk);
			},
			onStderr: (chunk) => {
				if (session) {
					session.stderr += chunk;
					if (session.stderr.length > CLAUDE_LIVE_MAX_STDERR_CHARS) {
						closeLiveSession(session, "abort", createOutputLimitError(session, "Claude CLI stderr exceeded limit."));
						return;
					}
					resetNoOutputTimer(session);
				}
			}
		});
	} catch (error) {
		await mcpCaptureAttempt.cleanup?.();
		throw error;
	}
	session = {
		key: params.key,
		fingerprint: params.fingerprint,
		managedRun,
		providerId: params.context.params.provider,
		modelId: params.context.modelId,
		noOutputTimeoutMs: params.noOutputTimeoutMs,
		stderr: "",
		stdoutBuffer: "",
		currentTurn: null,
		idleTimer: null,
		cleanup: async () => {
			await mcpCaptureAttempt.cleanup?.();
			await params.cleanup();
		},
		cleanupPromise: null,
		closing: false,
		mcpCaptureKey: params.mcpCaptureKey
	};
	managedRun.wait().then((exit) => handleClaudeExit(session, exit.exitCode), (error) => {
		if (session) closeLiveSession(session, "abort", error);
	});
	liveSessions.set(params.key, session);
	cliBackendLog.info(`claude live session start: provider=${session.providerId} model=${session.modelId} activeSessions=${liveSessions.size}`);
	return session;
}
function createTurn(params) {
	const turn = {
		backend: params.context.preparedBackend.backend,
		diagnosticRefs: {
			runId: params.context.params.runId,
			sessionId: params.context.params.sessionId,
			...params.context.params.sessionKey ? { sessionKey: params.context.params.sessionKey } : {},
			...params.context.params.agentId ? { agentId: params.context.params.agentId } : {}
		},
		outputLimits: resolveCliStreamJsonOutputLimits(params.context.preparedBackend.backend),
		startedAtMs: Date.now(),
		rawLines: [],
		rawChars: 0,
		noOutputTimer: null,
		timeoutTimer: null,
		activeToolTimer: null,
		activeTools: /* @__PURE__ */ new Map(),
		observedStdout: false,
		completedToolCallIds: /* @__PURE__ */ new Set(),
		toolEventCount: 0,
		streamingParser: createCliJsonlStreamingParser({
			backend: params.context.preparedBackend.backend,
			providerId: params.context.backendResolved.id,
			onAssistantDelta: params.onAssistantDelta,
			onThinkingDelta: params.onThinkingDelta,
			onThinkingProgress: params.onThinkingProgress,
			onToolUseStart: (delta) => {
				markClaudeLiveToolStarted(turn, delta);
				params.onToolUseStart?.(delta);
			},
			onToolResult: (delta) => {
				markClaudeLiveToolCompleted(turn, delta, params.resolveToolResultTerminalOutcome?.(delta));
				params.onToolResult?.(delta);
			},
			onCommentaryText: params.onCommentaryText
		}),
		execPermission: params.execPermission,
		resolve: params.resolve,
		reject: params.reject
	};
	turn.noOutputTimer = setTimeout(() => {
		closeLiveSession(params.session, "abort", createTimeoutError(params.session, `CLI produced no output for ${Math.round(params.noOutputTimeoutMs / 1e3)}s and was terminated.`, "cli_no_output_timeout"));
	}, params.noOutputTimeoutMs);
	turn.timeoutTimer = setTimeout(() => {
		closeLiveSession(params.session, "abort", createTimeoutError(params.session, `CLI exceeded timeout (${Math.round(params.context.params.timeoutMs / 1e3)}s) and was terminated.`));
	}, params.context.params.timeoutMs);
	return turn;
}
function closeOldestIdleSession() {
	for (const session of liveSessions.values()) if (!session.currentTurn) {
		closeLiveSession(session, "idle");
		return true;
	}
	return false;
}
function ensureLiveSessionCapacity(key, context) {
	if (liveSessions.has(key) || liveSessionCreates.has(key) || liveSessions.size + liveSessionCreates.size < CLAUDE_LIVE_MAX_SESSIONS) return;
	if (closeOldestIdleSession()) return;
	throw new FailoverError("Too many Claude CLI live sessions are active.", {
		reason: "rate_limit",
		provider: context.params.provider,
		model: context.modelId,
		status: resolveFailoverStatus("rate_limit")
	});
}
/** Runs one prompt through a reusable Claude CLI live session. */
async function runClaudeLiveSessionTurn(params) {
	const key = buildClaudeLiveKey(params.context);
	const resumeCapable = Boolean(params.context.preparedBackend.backend.resumeArgs?.length);
	const execPermission = resolveClaudeLiveExecPermission(params.context);
	const argv = [params.context.preparedBackend.backend.command, ...buildClaudeLiveArgs({
		args: params.args,
		backend: params.context.preparedBackend.backend,
		systemPrompt: params.context.systemPrompt,
		useResume: params.useResume,
		permissionMode: execPermission.permissionMode
	})];
	const fingerprint = buildClaudeLiveFingerprint({
		context: params.context,
		argv,
		env: params.env
	});
	let cleanupDone = false;
	const cleanup = async () => {
		if (cleanupDone) return;
		cleanupDone = true;
		await params.cleanup();
	};
	let session = liveSessions.get(key) ?? null;
	if (session && resumeCapable && !params.useResume) {
		closeLiveSession(session, "restart");
		session = null;
	}
	if (session && session.fingerprint !== fingerprint) {
		closeLiveSession(session, "restart");
		session = null;
	}
	let cleanupTurnArtifacts = Boolean(session);
	try {
		ensureLiveSessionCapacity(key, params.context);
	} catch (error) {
		await cleanup();
		throw error;
	}
	if (!session) {
		const pendingSession = liveSessionCreates.get(key);
		if (pendingSession) {
			try {
				session = await pendingSession;
			} catch (error) {
				await cleanup();
				throw error;
			}
			if (session.fingerprint !== fingerprint) {
				closeLiveSession(session, "restart");
				session = null;
			} else if (resumeCapable && !params.useResume) {
				closeLiveSession(session, "restart");
				session = null;
			} else cleanupTurnArtifacts = true;
		}
		if (!session) {
			const createSession = createClaudeLiveSession({
				context: params.context,
				argv,
				env: params.env,
				fingerprint,
				key,
				mcpCaptureKey: params.context.mcpDeliveryCapture ? crypto.randomUUID() : void 0,
				noOutputTimeoutMs: params.noOutputTimeoutMs,
				supervisor: params.getProcessSupervisor(),
				cleanup
			}).finally(() => {
				if (liveSessionCreates.get(key) === createSession) liveSessionCreates.delete(key);
			});
			liveSessionCreates.set(key, createSession);
			try {
				session = await createSession;
			} catch (error) {
				await cleanup();
				throw error;
			}
		}
	}
	if (cleanupTurnArtifacts && session) {
		await cleanup();
		if (session.idleTimer) {
			clearTimeout(session.idleTimer);
			session.idleTimer = null;
		}
		cliBackendLog.info(`claude live session reuse: provider=${session.providerId} model=${session.modelId}`);
	}
	if (session.closing) {
		await cleanup();
		throw new Error("Claude CLI live session closed before handling the turn");
	}
	if (session.currentTurn) throw new Error("Claude CLI live session is already handling a turn");
	const liveSession = session;
	if (liveSession.mcpCaptureKey) params.onMcpCaptureReady?.(liveSession.mcpCaptureKey);
	liveSession.noOutputTimeoutMs = params.noOutputTimeoutMs;
	liveSession.stderr = "";
	const outputPromise = new Promise((resolve, reject) => {
		liveSession.currentTurn = createTurn({
			context: params.context,
			noOutputTimeoutMs: params.noOutputTimeoutMs,
			onAssistantDelta: params.onAssistantDelta,
			onThinkingDelta: params.onThinkingDelta,
			onThinkingProgress: params.onThinkingProgress,
			onToolUseStart: params.onToolUseStart,
			onToolResult: params.onToolResult,
			resolveToolResultTerminalOutcome: params.resolveToolResultTerminalOutcome,
			onCommentaryText: params.onCommentaryText,
			session: liveSession,
			execPermission,
			resolve,
			reject
		});
	});
	outputPromise.catch(() => void 0);
	const abort = () => abortTurn(liveSession, createAbortError(params.context.params.abortSignal?.reason));
	let replyBackendCompleted = false;
	const replyBackendHandle = params.context.params.replyOperation ? {
		kind: "cli",
		cancel: abort,
		isStreaming: () => !replyBackendCompleted
	} : void 0;
	params.context.params.abortSignal?.addEventListener("abort", abort, { once: true });
	if (replyBackendHandle) params.context.params.replyOperation?.attachBackend(replyBackendHandle);
	try {
		if (params.context.params.abortSignal?.aborted) abort();
		else try {
			await Promise.race([writeTurnInput(liveSession, params.prompt), outputPromise]);
		} catch (error) {
			closeLiveSession(liveSession, "abort", error);
		}
		return { output: await outputPromise };
	} finally {
		replyBackendCompleted = true;
		params.context.params.abortSignal?.removeEventListener("abort", abort);
		try {
			if (replyBackendHandle) params.context.params.replyOperation?.detachBackend(replyBackendHandle);
		} finally {
			if (liveSession.mcpCaptureKey) {
				closeLiveSession(liveSession, "restart");
				await waitForManagedRunExit(liveSession.managedRun);
				await cleanupLiveSession(liveSession);
			}
		}
	}
}
//#endregion
export { shouldUseClaudeLiveSession as a, parseCliOutput as c, runClaudeLiveSessionTurn as i, closeClaudeLiveSessionForContext as n, createCliJsonlStreamingParser as o, rotateClaudeLiveMcpCaptureKeyForContext as r, extractCliErrorMessage as s, buildClaudeLiveArgs as t };
