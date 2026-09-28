import { u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { r as extractBalancedJsonFragments } from "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as isAbortError, t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { i as getPluginValueInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { i as runOwnedAgentCleanup } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { t as applyPluginTextReplacements } from "./plugin-text-transforms-CuF3jf1R.mjs";
import { a as isFailoverError, t as FailoverError } from "./error-ON38hPhx.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-B5EyWEOm.mjs";
import { i as scanReasoningTags, t as createReasoningTagTextPartitioner } from "./reasoning-tags-Du_476pm.mjs";
import { u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { f as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-BNasoszr.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-B0RY23Zf.mjs";
import { p as resolveFailoverStatus, r as coerceToFailoverError } from "./failover-error-BwAkMLuL.mjs";
import { n as cliBackendLog } from "./log-lbZDIx37.mjs";
//#region src/agents/cli-runner/cleanup.ts
/** Join CLI cleanup; replacement requires closure before any provider can proceed. */
async function runCliCleanup(params, step, cleanup, settlement) {
	try {
		await runOwnedAgentCleanup({
			...params,
			step,
			cleanup,
			settlement,
			log: cliBackendLog
		});
	} catch (error) {
		if (settlement !== "required") throw error;
		const failure = toErrorObject(error, "CLI resource cleanup failed");
		recordModelFallbackStop(failure);
		throw failure;
	}
}
//#endregion
//#region src/agents/cli-runner/execution-target.ts
/** Capture both the admitted run and any narrower caller-owned execution authority. */
function createCliRunCurrentAssertion(params, signal = params.abortSignal) {
	const assertCallerCurrent = params.assertCurrent;
	const assertAdmitted = resolveAdmittedRunActiveAssertion(params.admittedRunContext, signal);
	return () => {
		assertCallerCurrent?.();
		if (signal?.aborted) throw createAbortError("CLI run aborted");
		if (!assertAdmitted) throw new Error("CLI run authority is no longer active");
		assertAdmitted();
	};
}
/** Preparation and execution must agree on the owner of private prompt context. */
function resolveCliExecutionTarget(context) {
	const entry = context.params.sessionEntry;
	if (context.backendId === "claude-cli" && entry?.execHost === "node") {
		const nodeId = entry.execNode?.trim();
		if (!nodeId) throw new Error("node-placed Claude CLI session is missing execNode");
		return {
			kind: "node",
			placement: {
				nodeId,
				...entry.execCwd?.trim() ? { cwd: entry.execCwd.trim() } : {}
			}
		};
	}
	return context.execute && context.params.controlOperation !== "compact" ? {
		kind: "plugin",
		execute: context.execute
	} : { kind: "process" };
}
/**
* A plugin hot reload retires the previous backend instance after a bounded call
* drain and then rejects its calls, which discarded turns that finished later.
* A retained consumer keeps every plugin call of one prepared turn (execution
* stream, lifecycle parser, text transforms, cleanup) admitted on that instance
* until the turn's cleanup releases it; the owner's physical cleanup waits for it.
*/
function retainCliPluginExecutionConsumer(execute) {
	const owner = execute ? getPluginValueInstance(execute) : void 0;
	if (!owner) return;
	try {
		return owner.retainConsumer();
	} catch {
		return;
	}
}
//#endregion
//#region src/agents/cli-output-records.ts
function isClaudeCliProvider(providerId) {
	return normalizeLowercaseStringOrEmpty(providerId) === "claude-cli";
}
function isGeminiCliProvider(providerId) {
	return normalizeLowercaseStringOrEmpty(providerId) === "google-gemini-cli";
}
function isGeminiStreamJsonDialect(params) {
	return params.backend.jsonlDialect === "gemini-stream-json" || isGeminiCliProvider(params.providerId);
}
function isClaudeStreamJsonDialect(params) {
	if (params.backend.jsonlDialect) return params.backend.jsonlDialect === "claude-stream-json";
	return isClaudeCliProvider(params.providerId);
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
function isClaudeSyntheticNoResponse(parsed) {
	if (parsed.type !== "assistant" || !isRecord(parsed.message)) return false;
	const message = parsed.message;
	return message.model === "<synthetic>" && Array.isArray(message.content) && message.content.length === 1 && isRecord(message.content[0]) && message.content[0].type === "text" && message.content[0].text === "No response requested.";
}
function decodeCliRecords(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return [];
	const fullRecord = safeParseJsonRecord(trimmed);
	if (fullRecord) return [fullRecord];
	const parsedRecords = [];
	for (const { json } of extractBalancedJsonFragments(trimmed, {
		openers: ["{"],
		skipQuotedOpeners: true
	})) {
		const parsed = safeParseJsonRecord(json);
		if (parsed) parsedRecords.push(parsed);
	}
	return parsedRecords;
}
function readNestedErrorMessage(parsed) {
	if (isRecord(parsed.error)) {
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
	for (const parsed of decodeCliRecords(trimmed)) {
		const nested = readNestedErrorMessage(parsed);
		if (nested) return nested;
	}
	return trimmed;
}
function normalizeCliUsageRecord(raw) {
	if (!isRecord(raw)) return;
	const usageRaw = raw;
	const usage = normalizeUsage(usageRaw);
	if (!usage) return;
	const reportedInputTotal = [
		usageRaw.inputTokens,
		usageRaw.input_tokens,
		usageRaw.promptTokens,
		usageRaw.prompt_tokens
	].some((value) => typeof value === "number" && value > 0);
	const cliUsage = {
		input: usage.input === 0 && reportedInputTotal && Boolean(usage.cacheRead || usage.cacheWrite) ? 0 : usage.input || void 0,
		output: usage.output || void 0,
		cacheRead: usage.cacheRead || void 0,
		cacheWrite: usage.cacheWrite || void 0,
		total: usage.total || void 0
	};
	return Object.values(cliUsage).some((value) => typeof value === "number" && value > 0) ? cliUsage : void 0;
}
function readCliUsage(parsed) {
	return normalizeCliUsageRecord(isRecord(parsed.message) ? parsed.message.usage : void 0) ?? normalizeCliUsageRecord(parsed.usage) ?? normalizeCliUsageRecord(parsed.stats);
}
function collectCliText(value) {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map((entry) => collectCliText(entry)).join("");
	if (!isRecord(value)) return "";
	if (typeof value.response === "string") return value.response;
	if (typeof value.text === "string") return value.text;
	if (typeof value.result === "string") return value.result;
	if (typeof value.content === "string") return value.content;
	if (Array.isArray(value.content)) return value.content.map((entry) => collectCliText(entry)).join("");
	if (isRecord(value.message)) return collectCliText(value.message);
	return "";
}
function unwrapNestedCliResultText(raw) {
	let text = raw;
	for (let depth = 0; depth < 8; depth += 1) {
		const trimmed = text.trim();
		if (!trimmed.startsWith("{")) return text;
		try {
			const parsed = JSON.parse(trimmed);
			if (!isRecord(parsed) || typeof parsed.type !== "string" || parsed.type !== "result" || typeof parsed.result !== "string") return text;
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
		const text = readClaudeResultErrorsText(parsed) || collectCliText(parsed.result) || collectCliText(parsed.message) || collectCliText(parsed.content);
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
const CLI_TERMINAL_REASON_MAX_CHARS = 64;
function normalizeCliTerminalReason(raw) {
	return truncateUtf16Safe(raw.replace(/[\p{Cc}\p{Cf}\s]+/gu, " ").trim(), CLI_TERMINAL_REASON_MAX_CHARS);
}
function describeClaudeTurnStop(failure) {
	const stopReason = failure.stopReason ? `, stop_reason: ${failure.stopReason}` : "";
	return `Claude CLI ended the turn without a reply (terminal_reason: ${failure.terminalReason}${stopReason}).`;
}
const CLAUDE_TURN_STOP_REASONS = /* @__PURE__ */ new Set([
	"hook_stopped",
	"stop_hook_prevented",
	"aborted_tools",
	"aborted_streaming",
	"budget_exhausted"
]);
/** Reads a reply-less Claude result that the backend deliberately stopped. */
function readClaudeTurnStop(parsed) {
	const terminalReason = typeof parsed.terminal_reason === "string" ? normalizeCliTerminalReason(parsed.terminal_reason) : "";
	if (parsed.type !== "result" || !terminalReason || terminalReason === "completed" || terminalReason === "max_turns" || terminalReason === "background_requested" || !CLAUDE_TURN_STOP_REASONS.has(terminalReason) || unwrapNestedCliResultText(collectCliText(parsed.result)).trim() || collectExplicitCliErrorText(parsed)) return;
	const stopReason = typeof parsed.stop_reason === "string" ? normalizeCliTerminalReason(parsed.stop_reason) : "";
	return {
		terminalReason,
		...stopReason ? { stopReason } : {}
	};
}
function readClaudeTerminalFailure(parsed) {
	const subtype = typeof parsed.subtype === "string" ? parsed.subtype.trim() : "";
	const terminalReason = typeof parsed.terminal_reason === "string" ? parsed.terminal_reason.trim() : "";
	if (subtype !== "error_max_turns" && terminalReason !== "max_turns") {
		const stop = readClaudeTurnStop(parsed);
		return stop ? {
			reason: "turn_stopped",
			...stop
		} : void 0;
	}
	const errors = Array.isArray(parsed.errors) ? parsed.errors : [];
	for (const error of errors) {
		if (typeof error !== "string") continue;
		const match = error.match(/maximum number of turns\s*\((\d+)\)/i);
		if (match) {
			const limit = Number.parseInt(match[1] ?? "", 10);
			if (Number.isSafeInteger(limit) && limit > 0) return {
				reason: "max_turns",
				limit
			};
		}
	}
	return { reason: "max_turns" };
}
function readClaudeResultErrorsText(parsed) {
	if (!Array.isArray(parsed.errors)) return;
	for (const error of parsed.errors) {
		const text = typeof error === "string" ? error.trim() : "";
		if (text && !text.startsWith("[ede_diagnostic]")) return text;
	}
}
function resolveCliTerminalErrorText(parsed, terminalFailure) {
	const explicit = collectExplicitCliErrorText(parsed);
	if (explicit || !terminalFailure) return explicit;
	return terminalFailure.reason === "turn_stopped" ? describeClaudeTurnStop(terminalFailure) : "Reached maximum number of turns.";
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
function isClaudeSubagentRecord(parsed) {
	return parsed.parent_tool_use_id != null;
}
function pickCliResumeCheckpointId(params) {
	if (!isClaudeStreamJsonDialect(params) || params.parsed.type !== "assistant" || isClaudeSubagentRecord(params.parsed)) return;
	return (typeof params.parsed.uuid === "string" ? params.parsed.uuid.trim() : "") || void 0;
}
function shouldUnwrapNestedCliResultText(params) {
	if (!params.providerId || !isClaudeCliProvider(params.providerId)) return false;
	return !Object.hasOwn(params.parsed, "type") || params.parsed.type === "result";
}
function hasExplicitCliErrorPayload(parsed) {
	if (typeof parsed.error === "string") return Boolean(parsed.error.trim());
	if (isRecord(parsed.error)) return Boolean(readNestedErrorMessage(parsed.error));
	return false;
}
/** Parses a single JSON payload emitted by a CLI backend. */
function parseCliJson(raw, backend, providerId) {
	const parsedRecords = decodeCliRecords(raw);
	if (parsedRecords.length === 0) return null;
	let sessionId;
	let usage;
	let text = "";
	let sawStructuredOutput = false;
	for (const parsed of parsedRecords) {
		sessionId = pickCliSessionId(parsed, backend) ?? sessionId;
		usage = readCliUsage(parsed) ?? usage;
		const terminalFailure = isClaudeStreamJsonDialect({
			backend,
			providerId: providerId ?? ""
		}) ? readClaudeTerminalFailure(parsed) : void 0;
		if (terminalFailure && !(terminalFailure.reason === "turn_stopped" && text.trim())) return {
			text: "",
			sessionId,
			usage,
			errorText: resolveCliTerminalErrorText(parsed, terminalFailure),
			terminalFailure
		};
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
		const terminalFailure = isClaudeStreamJsonDialect(params) ? readClaudeTerminalFailure(params.parsed) : void 0;
		const errorText = resolveCliTerminalErrorText(params.parsed, terminalFailure);
		if (errorText) return {
			text: "",
			sessionId: params.sessionId,
			usage: params.usage,
			errorText,
			...terminalFailure ? { terminalFailure } : {}
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
function preferStreamedClaudeTextOverResult(params) {
	return Boolean(params.resultText) && params.streamedText !== params.resultText && params.finalMessageText === params.resultText;
}
function missingMessageBoundarySeparator(previousText, nextDelta) {
	if (!previousText) return "";
	const trailing = previousText.slice(-2).match(/\n*$/u)?.[0].length ?? 0;
	const leading = nextDelta.slice(0, 2).match(/^\n*/u)?.[0].length ?? 0;
	return "\n".repeat(Math.max(0, 2 - trailing - leading));
}
function parseClaudeCliStreamingDelta(params) {
	if (!supportsCliJsonlToolEvents(params)) return null;
	if (params.parsed.type === "stream_event" && isRecord(params.parsed.event)) {
		const event = params.parsed.event;
		if (event.type !== "content_block_delta" || !isRecord(event.delta)) return null;
		const delta = event.delta;
		return delta.type === "text_delta" && typeof delta.text === "string" && delta.text ? delta.text : null;
	}
	if (!isClaudeStreamJsonDialect(params) || params.parsed.type !== "assistant" || isClaudeSubagentRecord(params.parsed) || !isRecord(params.parsed.message) || params.parsed.message.stop_reason !== null) return null;
	const snapshot = (Array.isArray(params.parsed.message.content) ? params.parsed.message.content : []).map((block) => isRecord(block) && block.type === "text" && typeof block.text === "string" ? block.text : "").join("");
	return snapshot.startsWith(params.previousText) ? snapshot.slice(params.previousText.length) || null : null;
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
//#endregion
//#region src/agents/cli-output-echoed-binary.ts
/** Drops Claude's echoed binary bytes before they enter retained tool/transcript state. */
function normalizeClaudeCliStreamJsonRecord(parsed) {
	if (parsed.type !== "user" || !isRecord(parsed.message)) return;
	let normalized = false;
	let omittedRawChars = 0;
	const pending = [parsed];
	while (pending.length > 0) {
		const node = pending.pop();
		if (Array.isArray(node)) {
			for (const item of node) pending.push(item);
			continue;
		}
		if (!isRecord(node)) continue;
		const source = node.source;
		const data = isRecord(source) && source.type === "base64" ? source.data : void 0;
		if (typeof data === "string" && isRecord(source) && (node.type === "image" || node.type === "document" && source.media_type === "application/pdf")) {
			const { data: _omitted, ...rest } = source;
			node.source = rest;
			node.omitted = true;
			node.bytes = estimateBase64DecodedBytes(data);
			omittedRawChars += data.length;
			normalized = true;
		}
		const directBase64Outputs = [
			node.file,
			...Array.isArray(node.images) ? node.images : [],
			...Array.isArray(node.documents) ? node.documents : []
		];
		for (const output of directBase64Outputs) {
			if (!isRecord(output) || typeof output.base64 !== "string") continue;
			const base64 = output.base64;
			delete output.base64;
			output.omitted = true;
			output.bytes = estimateBase64DecodedBytes(base64);
			omittedRawChars += base64.length;
			normalized = true;
		}
		for (const value of Object.values(node)) pending.push(value);
	}
	if (!normalized) return;
	try {
		return {
			line: JSON.stringify(parsed),
			omittedRawChars
		};
	} catch {
		return;
	}
}
//#endregion
//#region src/agents/cli-output-events.ts
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
function projectCliBackendEvent(params) {
	const { event, state } = params;
	if (state.output?.errorText && event.kind !== "sessionId" && event.kind !== "result") return;
	state.sawCustomJsonlEvent = true;
	if (event.kind === "sessionId") {
		const sessionId = event.sessionId.trim();
		if (sessionId && sessionId !== state.sessionId) {
			state.sessionId = sessionId;
			params.onSessionId?.(sessionId);
		}
		if (state.output) state.output = {
			...state.output,
			sessionId: state.sessionId
		};
		return;
	}
	if (event.kind === "text") {
		if (!event.text) return;
		state.assistantText += event.text;
		params.onAssistantDelta({
			text: state.assistantText,
			delta: event.text,
			sessionId: state.sessionId,
			usage: state.usage
		});
		return;
	}
	if (event.kind === "thinking") {
		if (!event.text || !params.onThinkingDelta) return;
		state.customThinkingText += event.text;
		params.onThinkingDelta({
			text: state.customThinkingText,
			delta: event.text,
			isReasoningSnapshot: true
		});
		return;
	}
	if (event.kind === "toolStart") {
		emitToolStartOnce(params.toolTracker, event.toolCallId, event.name, "tool_use", event.args ?? {}, params.onDisplayToolUseStart ?? params.onToolUseStart);
		return;
	}
	if (event.kind === "toolResult") {
		if (event.name) params.toolTracker.nameById.set(event.toolCallId, event.name);
		emitToolResultOnce(params.toolTracker, event.toolCallId, event.isError === true, event.result, params.onDisplayToolResult ?? params.onToolResult);
		return;
	}
	const normalizedSessionId = event.sessionId?.trim();
	if (normalizedSessionId && normalizedSessionId !== state.sessionId) {
		state.sessionId = normalizedSessionId;
		params.onSessionId?.(normalizedSessionId);
	}
	if (event.usage) {
		state.usage = event.usage;
		params.onUsage?.(event.usage, true);
	}
	const existingErrorText = state.output?.errorText;
	const resultText = !existingErrorText && event.text?.trim() || state.output?.text.trim() || params.texts.join("\n").trim() || state.assistantText.trim();
	const errorText = existingErrorText || event.errorText;
	state.output = {
		...state.output,
		text: resultText,
		sessionId: state.sessionId,
		usage: state.usage,
		...errorText ? { errorText } : {}
	};
}
function projectCliTaggedReasoning(params) {
	let text = params.currentText;
	for (const delta of params.deltas) {
		if (delta.kind === "text") {
			params.onVisibleText(delta.text);
			continue;
		}
		text += delta.text;
		if (!params.hasNativeThinking) params.onThinkingDelta?.({
			text,
			delta: delta.text,
			isReasoningSnapshot: true
		});
	}
	return text;
}
function isClaudeToolUseBlockType(type) {
	return type === "tool_use" || type === "server_tool_use" || type === "mcp_tool_use";
}
function isClaudeAssistantToolResultBlockType(type) {
	return typeof type === "string" && type.endsWith("_tool_result") && type !== "tool_result";
}
function isClaudeToolResultError(content) {
	return isRecord(content) && typeof content.type === "string" && content.type.endsWith("_error");
}
function parseToolInputJson(parts) {
	if (parts.length === 0) return {};
	try {
		const parsed = JSON.parse(parts.join(""));
		return isRecord(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
function dispatchClaudeCliStreamingToolEvent(params) {
	if (!supportsCliJsonlToolEvents(params) || isClaudeSubagentRecord(params.parsed)) return;
	const tracker = params.tracker;
	if (params.parsed.type === "stream_event" && isRecord(params.parsed.event)) {
		const event = params.parsed.event;
		if (event.type === "content_block_start" && typeof event.index === "number" && isRecord(event.content_block)) {
			const block = event.content_block;
			if (isClaudeToolUseBlockType(block.type)) {
				const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
				const name = typeof block.name === "string" ? block.name.trim() : "";
				if (toolCallId && name) tracker.pendingByIndex.set(event.index, {
					toolCallId,
					name,
					kind: block.type,
					inputJsonParts: [],
					...isRecord(block.input) ? { blockInput: block.input } : {}
				});
			} else if (isClaudeAssistantToolResultBlockType(block.type)) {
				const toolCallId = typeof block.tool_use_id === "string" ? block.tool_use_id.trim() : "";
				if (toolCallId) emitToolResultOnce(tracker, toolCallId, block.is_error === true || isClaudeToolResultError(block.content), block.content, params.onToolResult);
			}
			return;
		}
		if (event.type === "content_block_delta" && typeof event.index === "number" && isRecord(event.delta)) {
			if (event.delta.type === "input_json_delta" && typeof event.delta.partial_json === "string") tracker.pendingByIndex.get(event.index)?.inputJsonParts.push(event.delta.partial_json);
			return;
		}
		if (event.type === "content_block_stop" && typeof event.index === "number") {
			const pending = tracker.pendingByIndex.get(event.index);
			tracker.pendingByIndex.delete(event.index);
			if (pending) {
				const args = pending.inputJsonParts.length > 0 ? parseToolInputJson(pending.inputJsonParts) : pending.blockInput ?? {};
				emitToolStartOnce(tracker, pending.toolCallId, pending.name, pending.kind, args, params.onToolUseStart);
			}
			return;
		}
		return;
	}
	if (params.parsed.type === "assistant" && isRecord(params.parsed.message)) {
		const message = params.parsed.message;
		const content = Array.isArray(message.content) ? message.content : [];
		for (const block of content) {
			if (!isRecord(block)) continue;
			if (isClaudeToolUseBlockType(block.type)) {
				const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
				const name = typeof block.name === "string" ? block.name.trim() : "";
				if (!toolCallId || !name) continue;
				const args = isRecord(block.input) ? block.input : {};
				emitToolStartOnce(tracker, toolCallId, name, block.type, args, params.onToolUseStart);
			} else if (isClaudeAssistantToolResultBlockType(block.type)) {
				const toolCallId = typeof block.tool_use_id === "string" ? block.tool_use_id.trim() : "";
				if (!toolCallId) continue;
				emitToolResultOnce(tracker, toolCallId, block.is_error === true || isClaudeToolResultError(block.content), block.content, params.onToolResult);
			}
		}
		return;
	}
	if (params.parsed.type === "user" && isRecord(params.parsed.message)) {
		const message = params.parsed.message;
		const content = Array.isArray(message.content) ? message.content : [];
		for (const block of content) {
			if (!isRecord(block) || block.type !== "tool_result") continue;
			const toolCallId = typeof block.tool_use_id === "string" ? block.tool_use_id.trim() : "";
			if (!toolCallId) continue;
			emitToolResultOnce(tracker, toolCallId, block.is_error === true, block.content, params.onToolResult);
		}
	}
}
function createThinkingTracker() {
	return {
		streamedByIndex: /* @__PURE__ */ new Map(),
		highestStreamedIndex: Number.NEGATIVE_INFINITY,
		emittedText: "",
		nextSyntheticBlockIndex: 0,
		progressTokens: 0
	};
}
function resetThinkingBlockState(tracker) {
	tracker.streamedByIndex.clear();
	tracker.highestStreamedIndex = Number.NEGATIVE_INFINITY;
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
	const appendToAggregate = index >= tracker.highestStreamedIndex;
	tracker.streamedByIndex.set(index, `${streamed}${delta}`);
	tracker.highestStreamedIndex = Math.max(tracker.highestStreamedIndex, index);
	tracker.emittedText = appendToAggregate ? `${tracker.emittedText}${delta}` : assembleThinkingTextByIndex(tracker.streamedByIndex);
	onThinkingDelta({
		text: tracker.emittedText,
		delta,
		isReasoningSnapshot: true
	});
}
function readThinkingProgressTokens(delta) {
	if (delta.type !== "thinking_delta" || delta.thinking !== "") return;
	return asPositiveFiniteNumber(delta.estimated_tokens);
}
function emitClaudeThinkingProgress(tracker, progressTokensDelta, onThinkingProgress) {
	tracker.progressTokens += progressTokensDelta;
	onThinkingProgress({ progressTokens: tracker.progressTokens });
}
function dispatchClaudeCliThinking(params) {
	if (!supportsCliJsonlToolEvents(params) || isClaudeSubagentRecord(params.parsed)) return;
	const tracker = params.tracker;
	if (params.parsed.type === "stream_event" && isRecord(params.parsed.event)) {
		const event = params.parsed.event;
		if (event.type === "message_start") {
			const message = isRecord(event.message) ? event.message : void 0;
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
		if (event.type !== "content_block_delta" || !isRecord(event.delta)) return;
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
	if (params.parsed.type === "assistant" && isRecord(params.parsed.message)) {
		resetThinkingTrackerForMessage(tracker, typeof params.parsed.message.id === "string" ? params.parsed.message.id : void 0);
		const content = Array.isArray(params.parsed.message.content) ? params.parsed.message.content : [];
		for (const [index, block] of content.entries()) {
			if (!isRecord(block) || block.type !== "thinking" || typeof block.thinking !== "string") continue;
			if (!params.onThinkingDelta) continue;
			tracker.streamedByIndex.set(index, block.thinking);
			tracker.highestStreamedIndex = Math.max(tracker.highestStreamedIndex, index);
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
		const args = isRecord(params.parsed.parameters) ? params.parsed.parameters : {};
		emitToolStartOnce(params.tracker, toolCallId, name, "tool_use", args, params.onToolUseStart);
		return;
	}
	if (params.parsed.type === "tool_result") {
		const toolCallId = typeof params.parsed.tool_id === "string" ? params.parsed.tool_id.trim() : "";
		if (!toolCallId) return;
		const result = params.parsed.status === "error" && isRecord(params.parsed.error) ? params.parsed.error : params.parsed.output;
		emitToolResultOnce(params.tracker, toolCallId, params.parsed.status === "error", result, params.onToolResult);
	}
}
function partitionLeadingTaggedReasoning(text, final) {
	const first = text.search(/\S/u);
	if (first === -1) return final ? {
		pending: false,
		reasoningText: "",
		visibleText: text
	} : {
		pending: true,
		openWithoutPendingTag: false
	};
	if (text.charAt(first) !== "<") return {
		pending: false,
		reasoningText: "",
		visibleText: text
	};
	const scan = scanReasoningTags(text, final);
	let depth = 0;
	let end = -1;
	for (const tag of scan.tags) {
		if (depth === 0) {
			const expectedStart = end === -1 ? first : end;
			if (text.slice(expectedStart, tag.index).trim() || tag.isClose || tag.isSelfClosing) break;
		}
		depth += tag.isClose ? -1 : tag.isSelfClosing ? 0 : 1;
		if (depth === 0 && tag.isClose) end = tag.index + tag.text.length;
	}
	const pendingTagAfterBlock = end !== -1 && scan.pendingStart !== void 0 && !text.slice(end, scan.pendingStart).trim();
	if (end === -1) {
		const pendingLeadingTag = scan.pendingStart !== void 0 && !text.slice(first, scan.pendingStart).trim();
		return !final && (depth > 0 || pendingLeadingTag) ? {
			pending: true,
			openWithoutPendingTag: depth > 0 && scan.pendingStart === void 0
		} : {
			pending: false,
			reasoningText: "",
			visibleText: text
		};
	}
	if (!final && (depth > 0 || pendingTagAfterBlock || !text.slice(end).trim())) return {
		pending: true,
		openWithoutPendingTag: depth > 0 && scan.pendingStart === void 0
	};
	const partitioner = createReasoningTagTextPartitioner();
	const reasoningText = [...partitioner.pushVisible(text.slice(0, end)), ...partitioner.flush()].filter((delta) => delta.kind === "thinking").map((delta) => delta.text).join("");
	return reasoningText ? {
		pending: false,
		reasoningText,
		visibleText: text.slice(end)
	} : {
		pending: false,
		reasoningText: "",
		visibleText: text
	};
}
function createLeadingTaggedReasoningRouter() {
	let pending = "";
	let settled = false;
	let openWithoutPendingTag = false;
	const consume = (chunk, final) => {
		if (settled) return chunk ? [{
			kind: "text",
			text: chunk
		}] : [];
		pending += chunk;
		if (!final && openWithoutPendingTag && !chunk.includes("<")) return [];
		const result = partitionLeadingTaggedReasoning(pending, final);
		if (result.pending) {
			openWithoutPendingTag = result.openWithoutPendingTag;
			return [];
		}
		settled = true;
		pending = "";
		return [...result.reasoningText ? [{
			kind: "thinking",
			text: result.reasoningText
		}] : [], ...result.visibleText ? [{
			kind: "text",
			text: result.visibleText
		}] : []];
	};
	return {
		push: (chunk) => consume(chunk, false),
		finish: () => consume("", true)
	};
}
/** Creates a stateful parser for streaming JSONL CLI backend output. */
//#endregion
//#region src/agents/cli-output-lifecycle.ts
function parseCliBackendLifecycleLine(params) {
	if (!params.parse) return;
	try {
		const parsed = params.parse(params.line, {
			backendId: params.backendId,
			backend: params.backend
		});
		if (parsed == null) return;
		return { events: "kind" in parsed ? [parsed] : parsed };
	} catch (error) {
		return { errorText: truncateUtf16Safe(`CLI backend ${params.backendId} JSONL lifecycle parser failed: ${formatErrorMessage(error)}`, 500) };
	}
}
function projectCliBackendLifecycleEvent(event) {
	return event.phase === "start" ? { phase: "start" } : {
		phase: "end",
		completed: event.completed
	};
}
//#endregion
//#region src/agents/cli-output-results.ts
function transformCliResultText(output, replacements) {
	return {
		...output,
		rawText: output.text,
		text: applyPluginTextReplacements(output.text, replacements),
		...output.textParts ? { textParts: output.textParts.map((text) => applyPluginTextReplacements(text, replacements)) } : {}
	};
}
/** Keep completed answers distinct while retaining cumulative transcript text. */
function appendCliResultText(previous, nextText) {
	const previousText = previous?.text.trim() ?? "";
	const previousParts = previous?.textParts ?? (previousText ? [previousText] : []);
	const completedText = nextText === previousParts.at(-1) ? "" : nextText;
	return {
		text: completedText ? previousText ? `${previousText}\n${completedText}` : completedText : previousText,
		textParts: completedText ? [...previousParts, completedText] : previousParts,
		completedText
	};
}
//#endregion
//#region src/agents/cli-output-stream-limits.ts
const CLI_STREAM_JSON_DEFAULT_MAX_TURN_RAW_CHARS = 8388608;
const CLI_STREAM_JSON_OUTPUT_LIMITS = Object.freeze({
	maxTurnRawChars: CLI_STREAM_JSON_DEFAULT_MAX_TURN_RAW_CHARS,
	maxPendingLineChars: CLI_STREAM_JSON_DEFAULT_MAX_TURN_RAW_CHARS,
	maxTurnLines: 2e4
});
/** Frames arbitrary stdout chunks while bounding each individual raw JSONL line. */
function frameBoundedCliJsonlChunk(state, chunk, maxLineChars, onLine) {
	for (let offset = 0; offset < chunk.length;) {
		const newlineIndex = chunk.indexOf("\n", offset);
		const lineEnd = newlineIndex === -1 ? chunk.length : newlineIndex;
		if (state.pending.length + (lineEnd - offset) > maxLineChars) {
			state.pending = "";
			return false;
		}
		state.pending += chunk.slice(offset, lineEnd);
		if (newlineIndex === -1) return true;
		const line = state.pending;
		state.pending = "";
		offset = newlineIndex + 1;
		if (onLine(line) === false) return true;
	}
	return true;
}
function streamJsonOutputLimitErrorText(kind, limit) {
	if (kind === "line") return `CLI JSONL line exceeded ${limit} characters; refusing to parse output.`;
	if (kind === "lines") return `CLI JSONL output exceeded ${limit} lines; refusing to parse output.`;
	return `CLI JSONL output exceeded ${limit} characters; refusing to parse output.`;
}
//#endregion
//#region src/agents/cli-output-stream.ts
const CLI_STREAM_JSON_MISSING_RESULT_ERROR = "CLI stream-json output ended without a result event.";
const CLAUDE_SYNTHETIC_NO_RESPONSE_ERROR = "Claude CLI returned a synthetic no-response result.";
function createCliJsonlStreamingParser(params) {
	const lineBuffer = { pending: "" };
	let assistantText = "";
	let customThinkingText = "";
	let pendingClaudeText = "";
	let currentClaudeMessageId;
	let currentClaudeMessageText = "";
	let pendingMessageSeparator = false;
	let currentMessageStart = 0;
	let segmentStart = 0;
	let preserveFrom = 0;
	let sawToolUseSinceText = false;
	let currentMessageHadToolUse = false;
	let previousMessageHadToolUse = false;
	let sessionId;
	let resumeCheckpointId;
	let usage;
	let diagnosticUsage;
	let output = null;
	let parseErrorText = "";
	let rawChars = 0;
	let rawLines = 0;
	const texts = [];
	let sawCustomJsonlEvent = false;
	let sawGeminiStructuredOutput = false;
	let sawTerminalResult = false;
	let sawClaudeSyntheticNoResponse = false;
	const toolTracker = createToolUseTracker();
	const outputLimits = CLI_STREAM_JSON_OUTPUT_LIMITS;
	const classifyClaudeCommentary = Boolean(params.onCommentaryText) && supportsCliJsonlToolEvents(params);
	const thinkingTracker = createThinkingTracker();
	const claudeStreamJson = isClaudeStreamJsonDialect(params);
	let taggedReasoningRouter = createLeadingTaggedReasoningRouter();
	let currentTaggedReasoningText = "";
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
	const emitClaudeVisibleText = (delta) => {
		if (!delta) return;
		if (classifyClaudeCommentary) {
			pendingClaudeText = `${pendingClaudeText}${delta}`;
			return;
		}
		const boundaryPending = pendingMessageSeparator || sawToolUseSinceText;
		const isToolSplitBoundary = pendingMessageSeparator ? previousMessageHadToolUse : sawToolUseSinceText;
		const separator = boundaryPending && assistantText ? missingMessageBoundarySeparator(assistantText, delta) : "";
		if (boundaryPending && assistantText) {
			currentMessageStart = assistantText.length + separator.length;
			if (!isToolSplitBoundary) preserveFrom = currentMessageStart;
		}
		pendingMessageSeparator = false;
		sawToolUseSinceText = false;
		const deltaText = `${separator}${delta}`;
		assistantText = `${assistantText}${deltaText}`;
		params.onAssistantDelta({
			text: assistantText,
			delta: deltaText,
			sessionId,
			usage
		});
	};
	const routeTaggedReasoningDeltas = (deltas) => {
		currentTaggedReasoningText = projectCliTaggedReasoning({
			deltas,
			currentText: currentTaggedReasoningText,
			hasNativeThinking: Boolean(thinkingTracker.emittedText),
			onThinkingDelta: params.onThinkingDelta,
			onVisibleText: emitClaudeVisibleText
		});
	};
	const finishTaggedReasoningMessage = () => {
		if (claudeStreamJson) routeTaggedReasoningDeltas(taggedReasoningRouter.finish());
	};
	const beginTaggedReasoningMessage = () => {
		finishTaggedReasoningMessage();
		taggedReasoningRouter = createLeadingTaggedReasoningRouter();
		currentTaggedReasoningText = "";
	};
	const beginClaudeMessage = (messageId) => {
		beginTaggedReasoningMessage();
		pendingMessageSeparator = true;
		previousMessageHadToolUse = currentMessageHadToolUse;
		currentMessageHadToolUse = false;
		currentClaudeMessageId = messageId;
		currentClaudeMessageText = "";
	};
	const handleCustomJsonlEvent = (event) => {
		const state = {
			assistantText,
			customThinkingText,
			sessionId,
			usage,
			output,
			sawCustomJsonlEvent
		};
		projectCliBackendEvent({
			...params,
			event,
			state,
			texts,
			toolTracker
		});
		({assistantText, customThinkingText, sessionId, usage, output, sawCustomJsonlEvent} = state);
	};
	const accountClaudeJsonlLine = (lineChars) => {
		rawChars += lineChars + 1;
		if (rawChars <= outputLimits.maxTurnRawChars) return true;
		parseErrorText = streamJsonOutputLimitErrorText("raw", outputLimits.maxTurnRawChars);
		lineBuffer.pending = "";
		return false;
	};
	const observeSessionId = (parsed) => {
		const parsedSessionId = pickCliSessionId(parsed, params.backend);
		if (parsedSessionId && parsedSessionId !== sessionId) {
			sessionId = parsedSessionId;
			params.onSessionId?.(parsedSessionId);
		}
	};
	const handleCustomJsonlLine = (line, rawLine) => {
		if (parseErrorText) return true;
		const lifecycle = parseCliBackendLifecycleLine({
			line,
			backendId: params.providerId,
			backend: params.backend,
			parse: params.parseJsonlLifecycleEvent
		});
		if (lifecycle) {
			if ("errorText" in lifecycle) parseErrorText = lifecycle.errorText;
			else {
				if (claudeStreamJson && !accountClaudeJsonlLine(rawLine.length)) return true;
				for (const parsed of decodeCliRecords(line)) observeSessionId(parsed);
				for (const event of lifecycle.events) params.onCompaction?.(projectCliBackendLifecycleEvent(event));
			}
			return true;
		}
		if (!params.parseJsonlEvent) return false;
		let parsed;
		try {
			parsed = params.parseJsonlEvent(line, {
				backendId: params.providerId,
				backend: params.backend
			});
		} catch (error) {
			parseErrorText = truncateUtf16Safe(`CLI backend ${params.providerId} JSONL parser failed: ${formatErrorMessage(error)}`, 500);
			return true;
		}
		if (parsed == null) return false;
		if (claudeStreamJson && !accountClaudeJsonlLine(rawLine.length)) return true;
		for (const event of Array.isArray(parsed) ? parsed : [parsed]) {
			if (event.kind === "result") sawTerminalResult = true;
			handleCustomJsonlEvent(event);
		}
		return true;
	};
	const handleParsedRecord = (parsed) => {
		if (parseErrorText) return;
		if (claudeStreamJson && parsed.type === "system" && parsed.subtype === "init" && !isClaudeSubagentRecord(parsed)) try {
			params.onNativeTools?.(parsed.tools);
		} catch (error) {
			parseErrorText = truncateUtf16Safe(formatErrorMessage(error), 500);
			return;
		}
		if (parsed.type === "result" && parsed.openclaw_interim_result !== true && isStreamJsonDialect(params)) sawTerminalResult = true;
		observeSessionId(parsed);
		const nextUsage = readCliUsage(parsed);
		const isClaudeTerminalResult = isClaudeStreamJsonDialect({
			backend: params.backend,
			providerId: params.providerId
		}) && parsed.type === "result";
		if (isClaudeTerminalResult && nextUsage && usage) diagnosticUsage = nextUsage;
		if (nextUsage) params.onUsage?.(nextUsage, isClaudeTerminalResult);
		if (!isClaudeStreamJsonResult({
			backend: params.backend,
			providerId: params.providerId,
			parsed
		}) || !usage) usage = nextUsage ?? usage;
		if (parsed.type === "assistant" && isRecord(parsed.message) && !isClaudeSubagentRecord(parsed)) {
			if (claudeStreamJson) {
				const messageId = typeof parsed.message.id === "string" ? parsed.message.id : void 0;
				if (messageId && messageId !== currentClaudeMessageId) {
					if (currentClaudeMessageId === void 0) currentClaudeMessageId = messageId;
					else beginClaudeMessage(messageId);
				}
			}
			resumeCheckpointId = pickCliResumeCheckpointId({
				...params,
				parsed
			}) ?? resumeCheckpointId;
			params.onAssistantMessage?.(parsed.message);
			if (claudeStreamJson && isClaudeSyntheticNoResponse(parsed)) sawClaudeSyntheticNoResponse = true;
		}
		const geminiErrorText = isGeminiStreamJsonDialect(params) ? readGeminiCliStreamJsonError(parsed) : void 0;
		if (isGeminiStreamJsonDialect(params) && (parsed.type === "tool_use" || parsed.type === "tool_result" || parsed.type === "result")) sawGeminiStructuredOutput = true;
		if (geminiErrorText) {
			output = {
				text: "",
				sessionId,
				usage,
				errorText: preferGeminiCliStreamJsonError(output?.errorText, geminiErrorText)
			};
			return;
		}
		if (classifyClaudeCommentary && parsed.type === "result") {
			finishTaggedReasoningMessage();
			flushPendingClaudeAssistantText();
		} else if (parsed.type === "result") finishTaggedReasoningMessage();
		let result = parseClaudeCliJsonlResult({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			sessionId,
			usage
		});
		if (result) {
			const stoppedTurn = result.terminalFailure?.reason === "turn_stopped" ? result.terminalFailure : void 0;
			const stoppedTurnErrorText = stoppedTurn ? result.errorText ?? "" : "";
			if (stoppedTurn) {
				const delivered = { ...result };
				delete delivered.errorText;
				delete delivered.terminalFailure;
				result = delivered;
			} else if (result.errorText) {
				output = result;
				return;
			}
			if (claudeStreamJson && result.text) {
				const taggedResult = partitionLeadingTaggedReasoning(result.text, true);
				if (!taggedResult.pending && taggedResult.reasoningText) {
					if (!thinkingTracker.emittedText && taggedResult.reasoningText !== currentTaggedReasoningText) currentTaggedReasoningText = projectCliTaggedReasoning({
						deltas: [{
							kind: "thinking",
							text: taggedResult.reasoningText
						}],
						currentText: "",
						hasNativeThinking: false,
						onThinkingDelta: params.onThinkingDelta,
						onVisibleText: emitClaudeVisibleText
					});
					result = {
						...result,
						text: taggedResult.visibleText.trim()
					};
				}
			}
			const streamedText = assistantText.slice(segmentStart).trim();
			const preservedCandidate = assistantText.slice(preserveFrom).trim();
			const nextText = (preferStreamedClaudeTextOverResult({
				streamedText: preservedCandidate,
				finalMessageText: assistantText.slice(currentMessageStart).trim(),
				resultText: result.text
			}) ? preservedCandidate : result.text || streamedText || texts.join("\n").trim()).trim();
			const { text, textParts, completedText } = appendCliResultText(output, nextText);
			const syntheticNoResponse = sawClaudeSyntheticNoResponse && parsed.subtype === "success" && !text && toolTracker.pendingByIndex.size === 0 && toolTracker.startedIds.size === 0 && toolTracker.resultDeliveredIds.size === 0;
			output = {
				...result,
				text,
				...(textParts.length > 1 || output?.textParts || parsed.openclaw_interim_result === true) && !(stoppedTurn && !nextText) ? { textParts } : {},
				...syntheticNoResponse ? {
					errorText: CLAUDE_SYNTHETIC_NO_RESPONSE_ERROR,
					terminalFailure: { reason: "synthetic_no_response" }
				} : {},
				...stoppedTurn && !nextText ? {
					text: "",
					errorText: stoppedTurnErrorText,
					terminalFailure: stoppedTurn
				} : {},
				...resumeCheckpointId ? { resumeCheckpointId } : {},
				...diagnosticUsage ? { diagnosticUsage } : {}
			};
			if (parsed.openclaw_interim_result === true && completedText && !output.errorText && !output.terminalFailure) params.onCompletedReply?.(completedText, textParts.length - 1);
			segmentStart = assistantText.length;
			currentMessageStart = segmentStart;
			preserveFrom = segmentStart;
			pendingMessageSeparator = false;
			sawToolUseSinceText = false;
			currentMessageHadToolUse = false;
			previousMessageHadToolUse = false;
			return;
		}
		const item = isRecord(parsed.item) ? parsed.item : null;
		if (item && typeof item.text === "string") {
			const type = normalizeLowercaseStringOrEmpty(item.type);
			if (!type || type.includes("message")) texts.push(item.text);
		}
		if (parsed.type === "stream_event" && isRecord(parsed.event)) {
			const evt = parsed.event;
			if (evt.type === "message_start") {
				const message = isRecord(evt.message) ? evt.message : void 0;
				beginClaudeMessage(typeof message?.id === "string" ? message.id : void 0);
			} else if (evt.type === "message_stop") finishTaggedReasoningMessage();
			const isToolUseBlockStart = evt.type === "content_block_start" && isRecord(evt.content_block) && isClaudeToolUseBlockType(evt.content_block.type);
			if (isToolUseBlockStart) {
				sawToolUseSinceText = true;
				currentMessageHadToolUse = true;
			}
			if (classifyClaudeCommentary) {
				if (isToolUseBlockStart) flushPendingClaudeCommentaryText();
				else if (evt.type === "content_block_start" || evt.type === "message_stop") flushPendingClaudeAssistantText();
			}
		}
		if (params.onThinkingDelta || params.onThinkingProgress) dispatchClaudeCliThinking({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			tracker: thinkingTracker,
			onThinkingDelta: params.onThinkingDelta,
			onThinkingProgress: params.onThinkingProgress
		});
		const delta = parseClaudeCliStreamingDelta({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			previousText: currentClaudeMessageText
		});
		if (delta) {
			currentClaudeMessageText = `${currentClaudeMessageText}${delta}`;
			if (claudeStreamJson) routeTaggedReasoningDeltas(taggedReasoningRouter.push(delta));
			else emitClaudeVisibleText(delta);
		}
		if (params.onToolUseStart || params.onToolResult) dispatchGeminiCliStreamingToolEvent({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			tracker: toolTracker,
			onToolUseStart: params.onToolUseStart,
			onToolResult: params.onToolResult
		});
		if (claudeStreamJson || params.onToolUseStart || params.onToolResult) {
			const onToolUseStart = claudeStreamJson && parsed.type === "assistant" ? (tool) => {
				sawToolUseSinceText = true;
				currentMessageHadToolUse = true;
				if (classifyClaudeCommentary) flushPendingClaudeCommentaryText();
				params.onToolUseStart?.(tool);
			} : params.onToolUseStart;
			dispatchClaudeCliStreamingToolEvent({
				backend: params.backend,
				providerId: params.providerId,
				parsed,
				tracker: toolTracker,
				onToolUseStart,
				onToolResult: params.onToolResult
			});
		}
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
		}
	};
	const handleJsonlLine = (rawLine) => {
		if (parseErrorText) return;
		const line = rawLine.trim();
		if (!line && !claudeStreamJson) return;
		rawLines += 1;
		if (rawLines > outputLimits.maxTurnLines) {
			parseErrorText = streamJsonOutputLimitErrorText("lines", outputLimits.maxTurnLines);
			lineBuffer.pending = "";
			return;
		}
		if (!line) {
			accountClaudeJsonlLine(rawLine.length);
			return;
		}
		if (handleCustomJsonlLine(line, rawLine)) return;
		const parsedRecords = decodeCliRecords(line);
		if (claudeStreamJson) {
			const normalized = parsedRecords.length === 1 ? normalizeClaudeCliStreamJsonRecord(parsedRecords[0]) : void 0;
			const retainedChars = normalized ? Math.max(normalized.line.length, rawLine.length - normalized.omittedRawChars) : rawLine.length;
			if (!accountClaudeJsonlLine(retainedChars)) return;
		}
		for (const parsed of parsedRecords) handleParsedRecord(parsed);
	};
	return {
		push(chunk) {
			if (!chunk || parseErrorText) return;
			if (!claudeStreamJson) {
				rawChars += chunk.length;
				if (rawChars > outputLimits.maxTurnRawChars) {
					parseErrorText = streamJsonOutputLimitErrorText("raw", outputLimits.maxTurnRawChars);
					lineBuffer.pending = "";
					return;
				}
			}
			if (!frameBoundedCliJsonlChunk(lineBuffer, chunk, outputLimits.maxPendingLineChars, (line) => {
				handleJsonlLine(line);
				return !parseErrorText;
			})) parseErrorText = streamJsonOutputLimitErrorText("line", outputLimits.maxPendingLineChars);
		},
		finish() {
			if (parseErrorText) return;
			const tail = lineBuffer.pending;
			lineBuffer.pending = "";
			if (tail) handleJsonlLine(tail);
			finishTaggedReasoningMessage();
			if (classifyClaudeCommentary) flushPendingClaudeAssistantText();
		},
		getErrorText() {
			return parseErrorText || null;
		},
		hasTerminalResult() {
			return sawTerminalResult;
		},
		getOutput() {
			if (parseErrorText) return {
				text: "",
				sessionId,
				usage,
				...diagnosticUsage ? { diagnosticUsage } : {},
				errorText: parseErrorText
			};
			if (output) return output;
			if (rawLines === 0) return null;
			if (sawCustomJsonlEvent) return {
				text: texts.join("\n").trim() || assistantText.trim(),
				sessionId,
				usage
			};
			if (isStreamJsonDialect(params) && assistantText.trim()) return {
				text: assistantText.trim(),
				sessionId,
				usage,
				...resumeCheckpointId ? { resumeCheckpointId } : {}
			};
			if (isGeminiStreamJsonDialect(params) && sawGeminiStructuredOutput) return {
				text: "",
				sessionId,
				usage
			};
			if (isStreamJsonDialect(params)) return {
				text: "",
				sessionId,
				usage,
				errorText: CLI_STREAM_JSON_MISSING_RESULT_ERROR
			};
			const text = texts.join("\n").trim();
			return text ? {
				text,
				sessionId,
				usage,
				...resumeCheckpointId ? { resumeCheckpointId } : {}
			} : null;
		}
	};
}
//#endregion
//#region src/agents/cli-output.ts
/**
* Parses output from CLI-backed model providers. It supports plain text, JSON,
* JSONL streaming, Claude stream-json dialects, usage metadata, and tool event
* reconstruction.
*/
function normalizeCliContextValue(value) {
	const normalized = value?.trim().replace(/\s+/g, " ");
	return normalized ? truncateUtf16Safe(normalized, 200) : void 0;
}
function formatCliOutputError(output, attribution = {}) {
	const terminalFailure = output.terminalFailure;
	if (terminalFailure?.reason !== "max_turns" && terminalFailure?.reason !== "turn_stopped") return output.errorText || "CLI failed.";
	const runId = normalizeCliContextValue(attribution.runId);
	const sessionId = normalizeCliContextValue(attribution.sessionId);
	const cliSessionId = normalizeCliContextValue(output.sessionId);
	const context = [
		runId ? `OpenClaw run: ${runId}.` : void 0,
		sessionId ? `OpenClaw session: ${sessionId}.` : void 0,
		cliSessionId ? `Claude session: ${cliSessionId}.` : void 0
	].filter((entry) => Boolean(entry));
	if (terminalFailure.reason === "max_turns") {
		const limit = terminalFailure.limit;
		return [
			`Claude CLI stopped after reaching the maximum number of turns${limit ? ` (limit: ${limit})` : ""}.`,
			...context,
			"Tool actions may already have run; verify their effects before retrying.",
			"Retry with a higher --max-turns value or a narrower task."
		].join(" ");
	}
	const hookStopped = terminalFailure.terminalReason === "hook_stopped" || terminalFailure.terminalReason === "stop_hook_prevented";
	return [
		describeClaudeTurnStop(terminalFailure),
		...context,
		"Tool actions may already have run; verify their effects before retrying.",
		...hookStopped ? ["A Claude Code hook stopped this turn; user-scope hooks (including plugin hooks) apply to headless runs — move or disable that hook."] : []
	].join(" ");
}
/** Parses CLI backend output using the configured JSON/JSONL/plain-text mode. */
function parseCliOutput(params) {
	const outputMode = params.outputMode ?? "text";
	if (outputMode === "text") return {
		text: params.raw.trim(),
		sessionId: params.fallbackSessionId
	};
	if (outputMode === "jsonl") {
		const parser = createCliJsonlStreamingParser({
			backend: params.backend,
			providerId: params.providerId,
			parseJsonlEvent: params.parseJsonlEvent,
			parseJsonlLifecycleEvent: params.parseJsonlLifecycleEvent,
			onAssistantDelta: () => {}
		});
		parser.push(params.raw);
		parser.finish();
		const parsed = parser.getOutput();
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
/** Extracts a human-readable error message from mixed CLI stderr/stdout text. */
function extractCliErrorMessage(raw) {
	const parsedRecords = decodeCliRecords(raw);
	if (parsedRecords.length === 0) return null;
	let errorText = "";
	for (const parsed of parsedRecords) {
		const next = collectExplicitCliErrorText(parsed);
		if (next) errorText = next;
	}
	return errorText || null;
}
//#endregion
//#region src/agents/cli-runner/exit-error.ts
function createCliFailoverError(message, reason, context, options) {
	return new FailoverError(message, {
		reason,
		...context,
		status: resolveFailoverStatus(reason),
		...options
	});
}
function resolveCliResumeAtError(error, resumeAtArg, context) {
	if (!resumeAtArg || isFailoverError(error) || isAbortError(error)) return;
	const message = formatErrorMessage(error).toLowerCase();
	if (!message.includes(resumeAtArg.toLowerCase()) || !/\b(?:unknown|unexpected|unrecognized)\b|\bnot\s+recognized\b/.test(message)) return;
	return createCliFailoverError("CLI backend cannot resume from the stored checkpoint.", "session_expired", context, {
		code: "cli_resume_at_unsupported",
		cause: error
	});
}
function createCliExitFailoverError(params) {
	const candidates = params.candidates.map((candidate) => candidate.trim()).filter(Boolean);
	const structuredError = candidates.map((candidate) => extractCliErrorMessage(candidate)).find(Boolean) ?? null;
	const resumeAtError = resolveCliResumeAtError(structuredError || candidates[0] || params.fallbackMessage, params.resumeAtArg, params.context);
	if (resumeAtError) return resumeAtError;
	const classified = [structuredError, ...candidates].flatMap((candidate) => candidate ? [coerceToFailoverError(candidate, params.context)] : []).find((error) => error !== null);
	const message = structuredError || classified?.message || candidates[0] || params.fallbackMessage;
	const reason = classified?.reason ?? (candidates.length === 0 ? params.emptyReason : void 0) ?? "unknown";
	const code = reason === "context_overflow" ? "cli_context_overflow" : candidates.length === 0 && params.retryEmptyFailure ? "cli_unknown_empty_failure" : void 0;
	return createCliFailoverError(message, reason, params.context, { code });
}
//#endregion
//#region src/agents/cli-runner/live-session-fingerprint.ts
/** Fingerprints every process-stable input without retaining secrets or volatile artifact paths. */
function buildCliLiveSessionFingerprint(params) {
	const context = params.context;
	const managedGrant = context.preparedBackend.mcpClientGrantCapture;
	const normalizeGrantToken = params.env.OPENCLAW_MCP_TOKEN === managedGrant?.transportToken;
	const normalizeMcpConfigPath = Boolean(context.preparedBackend.mcpConfigHash);
	const skillSnapshot = context.params.skillsSnapshot;
	const skillsFingerprint = skillSnapshot ? sha256Hex(JSON.stringify({
		promptHash: sha256Hex(skillSnapshot.prompt),
		skillFilter: skillSnapshot.skillFilter,
		skills: skillSnapshot.skills,
		librarySelections: skillSnapshot.librarySelections,
		resolvedSkills: (skillSnapshot.resolvedSkills ?? []).map((skill) => ({
			name: skill.name,
			description: skill.description,
			contentHash: skill.contentHash,
			filePath: skill.filePath,
			sourceInfo: skill.sourceInfo
		})),
		version: skillSnapshot.resolvedSkills?.every((skill) => Boolean(skill.contentHash)) ? void 0 : skillSnapshot.version
	})) : void 0;
	const omittedValueFlags = new Set([
		context.preparedBackend.backend.systemPromptArg,
		context.preparedBackend.backend.systemPromptFileArg,
		"--session-id",
		"--resume",
		"-r"
	].filter((entry) => typeof entry === "string" && entry.length > 0));
	const unstableValueFlags = new Set([
		normalizeMcpConfigPath ? "--mcp-config" : void 0,
		skillsFingerprint ? "--plugin-dir" : void 0,
		skillsFingerprint ? "--plugin-dir-no-mcp" : void 0
	].filter((entry) => typeof entry === "string" && entry.length > 0));
	const argv = [];
	for (let index = 0; index < params.argv.length; index += 1) {
		const value = params.argv[index] ?? "";
		if (omittedValueFlags.has(value)) {
			index += 1;
			continue;
		}
		if ([...omittedValueFlags].some((flag) => value.startsWith(`${flag}=`))) continue;
		if (unstableValueFlags.has(value)) {
			argv.push("<unstable>");
			index += 1;
			continue;
		}
		if ([...unstableValueFlags].some((flag) => value.startsWith(`${flag}=`))) {
			argv.push("<unstable>");
			continue;
		}
		argv.push(value);
	}
	return sha256Hex(JSON.stringify({
		argv,
		argv0: params.argv0,
		workspaceDirHash: sha256Hex(context.workspaceDir),
		cwdHash: context.cwdHash ?? sha256Hex(context.cwd ?? context.workspaceDir),
		provider: context.params.provider,
		model: context.normalizedModel,
		systemPromptHash: sha256Hex(context.systemPrompt),
		authProfileIdHash: context.effectiveAuthProfileId ? sha256Hex(context.effectiveAuthProfileId) : void 0,
		authEpochHash: context.authEpoch ? sha256Hex(context.authEpoch) : void 0,
		extraSystemPromptHash: context.extraSystemPromptHash,
		promptToolNamesHash: context.promptToolNamesHash,
		mcpResumeHash: context.preparedBackend.mcpResumeHash ?? context.preparedBackend.mcpConfigHash,
		credentialFingerprint: context.preparedBackend.secretInput?.fingerprint,
		skillsFingerprint,
		env: Object.keys(params.env).toSorted().filter((key) => key !== "OPENCLAW_MCP_CLI_CAPTURE_KEY").map((key) => [key, key === "OPENCLAW_MCP_TOKEN" && normalizeGrantToken ? "<managed-mcp-grant>" : params.env[key] ? sha256Hex(params.env[key]) : ""])
	}));
}
//#endregion
//#region src/agents/cli-runner/cli-live-session-registry.ts
const MAX_LIVE_SESSIONS = 16;
const liveSessions = /* @__PURE__ */ new Map();
const retiredSessionCleanup = /* @__PURE__ */ new Map();
const retiringSessionHandles = /* @__PURE__ */ new WeakSet();
function buildCliLiveRegistryKey(owner) {
	return `${owner.backendId}:${buildCliLiveOwnerKey(owner)}`;
}
/** Hashes the account/agent/auth/session tuple shared by queue and registry ownership. */
function buildCliLiveOwnerKey(input) {
	return sha256Hex(JSON.stringify({
		agentAccountId: input.agentAccountId,
		agentId: input.agentId,
		authProfileId: input.authProfileId,
		sessionId: input.sessionId,
		sessionKey: input.sessionKey
	}));
}
function buildCliLiveSessionKey(context) {
	return buildCliLiveRegistryKey({
		backendId: context.backendResolved.id,
		agentAccountId: context.params.agentAccountId,
		agentId: context.params.agentId,
		authProfileId: context.effectiveAuthProfileId,
		sessionId: context.params.sessionId,
		sessionKey: context.params.sessionKey
	});
}
/** Returns whether this owner still has an in-process plugin-owned session. */
function hasCliLiveSession(owner) {
	return getCliLiveSessionGeneration(owner) !== void 0;
}
/** Returns the opaque generation of this owner's registered execution session. */
function getCliLiveSessionGeneration(owner) {
	return liveSessions.get(buildCliLiveRegistryKey(owner))?.handle.generation;
}
/** Reads owner-private standing approvals only from this exact current live process. */
function getCliLiveSessionApprovalGrants(context) {
	return liveSessions.get(buildCliLiveSessionKey(context))?.approvalGrants;
}
/** Closes the live execution session associated with a prepared run context, if one exists. */
async function closeCliLiveSession(context, reason) {
	await runCliCleanup(context.params, "cli-live-session-close", async () => {
		await context.preparedBackend.closeLiveSession?.(reason);
	});
}
/** Explicit fresh/fork execution owns replacement of the current idle process. */
async function restartCliLiveSession(context, signal = context.params.abortSignal) {
	const assertActive = createCliRunCurrentAssertion(context.params, signal);
	assertActive();
	const key = buildCliLiveSessionKey(context);
	const record = liveSessions.get(key);
	const pendingCleanup = retiredSessionCleanup.get(key);
	await runCliCleanup(context.params, "cli-live-session-close", async () => {
		assertActive();
		await context.preparedBackend.closeLiveSession?.("restart");
		await pendingCleanup;
	}, "required");
	if (record) await runCliCleanup(context.params, "cli-live-session-restart", () => {
		assertActive();
		return closeRecord(record, "restart");
	}, "required");
	assertActive();
}
async function closeRecord(record, reason) {
	if (!record.cleanupPromise) record.handle.close(reason);
	await (record.cleanupPromise ?? record.handle.waitForExit());
}
function retainCleanup(context, record) {
	const owner = context.preparedBackend;
	record.owner = owner;
	owner.closeLiveSession = async (reason) => {
		if (record.owner === owner || record.cleanupPromise) await closeRecord(record, reason);
	};
}
function ensureCliLiveSessionCapacity(context) {
	if (liveSessions.size < MAX_LIVE_SESSIONS) return;
	for (const { handle } of liveSessions.values()) if (handle.isIdle()) {
		handle.close("idle");
		return;
	}
	throw createCliFailoverError("Too many CLI live sessions are active.", "rate_limit", {
		provider: context.params.provider,
		model: context.modelId,
		sessionId: context.params.sessionId,
		lane: context.params.lane
	});
}
/** Returns whether this prepared local plugin transport may retain its execution process. */
function acceptsCliLiveSession(context) {
	return context.executionTarget.kind === "plugin" && context.preparedBackend.backend.liveSession !== void 0 && context.preparedBackend.backend.output === "jsonl" && context.preparedBackend.backend.input === "stdin";
}
/** Creates host-owned lifecycle authority without exposing owner keys or bearer material. */
function createCliLiveSessionCapability(params) {
	const ownerKey = buildCliLiveSessionKey(params.context);
	const fingerprint = buildCliLiveSessionFingerprint({
		context: params.context,
		argv: params.argv,
		argv0: params.argv0,
		env: params.env
	});
	const grant = params.context.preparedBackend.mcpClientGrantCapture;
	if (Boolean(grant) !== Boolean(params.captureKey)) throw new Error("CLI live process and current turn disagree about MCP capture ownership.");
	const requiredSessionError = (code) => createCliFailoverError("Managed CLI live session is no longer reusable.", "session_expired", {
		provider: params.context.params.provider,
		model: params.context.modelId,
		sessionId: params.context.params.sessionId,
		lane: params.context.params.lane
	}, { code });
	const assertActive = createCliRunCurrentAssertion(params.context.params, params.abortSignal);
	const requireRegisteredRecord = (handle) => {
		assertActive();
		const record = liveSessions.get(ownerKey);
		if (handle.fingerprint !== fingerprint || record?.handle !== handle) throw new Error("CLI live session no longer belongs to this admitted run.");
		if (params.requiredGeneration && params.requiredGeneration !== handle.generation) throw requiredSessionError("cli_live_session_changed");
		return record;
	};
	return Object.freeze({
		fingerprint,
		current: () => {
			assertActive();
			const handle = liveSessions.get(ownerKey)?.handle;
			if (params.requiredGeneration && handle?.generation !== params.requiredGeneration) throw requiredSessionError(handle ? "cli_live_session_changed" : "cli_live_session_missing");
			if (params.requiredGeneration && handle?.fingerprint !== fingerprint) throw requiredSessionError("cli_live_session_changed");
			return handle;
		},
		restart: async () => {
			assertActive();
			if (params.requiredGeneration) throw requiredSessionError("cli_live_session_changed");
			await restartCliLiveSession(params.context, params.abortSignal);
		},
		register: (handle) => {
			assertActive();
			if (retiredSessionCleanup.has(ownerKey)) throw new Error("Previous CLI live session cleanup has not settled.");
			if (params.requiredGeneration) throw requiredSessionError("cli_live_session_changed");
			if (handle.fingerprint !== fingerprint || !handle.generation.trim() || liveSessions.has(ownerKey) || retiringSessionHandles.has(handle) || Array.from(liveSessions.values()).some((record) => record.handle === handle)) throw new Error("CLI live session registration does not match its admitted owner.");
			ensureCliLiveSessionCapacity(params.context);
			const cleanup = params.claimResources?.();
			const record = {
				handle,
				owner: params.context.preparedBackend,
				approvalGrants: /* @__PURE__ */ new Set(),
				...cleanup ? { cleanup } : {},
				...grant && params.captureKey ? { capture: {
					token: grant.transportToken,
					key: params.captureKey,
					revoke: grant.revokeProcessToken
				} } : {}
			};
			liveSessions.set(ownerKey, record);
			retainCleanup(params.context, record);
			cliBackendLog.info(`cli live session start: provider=${params.context.backendResolved.id} model=${params.context.normalizedModel} activeSessions=${liveSessions.size}`);
		},
		activate: (handle) => {
			const record = requireRegisteredRecord(handle);
			if (Boolean(record.capture) !== Boolean(grant)) throw new Error("CLI live session MCP topology changed across admitted turns.");
			if (record.capture && grant) {
				grant.adoptProcessToken(record.capture.token);
				requireRegisteredRecord(handle);
				params.beginCapture(record.capture.key);
			}
			retainCleanup(params.context, record);
		},
		remove: (handle) => {
			const record = liveSessions.get(ownerKey);
			if (record?.handle !== handle) return;
			record.capture?.revoke();
			liveSessions.delete(ownerKey);
			record.approvalGrants.clear();
			retiringSessionHandles.add(handle);
			record.cleanupPromise = Promise.resolve().then(() => handle.waitForExit()).then(() => record.cleanup?.()).then(() => {
				retiringSessionHandles.delete(handle);
				if (retiredSessionCleanup.get(ownerKey) === record.cleanupPromise) retiredSessionCleanup.delete(ownerKey);
			});
			retiredSessionCleanup.set(ownerKey, record.cleanupPromise);
			record.cleanupPromise.catch((error) => {
				cliBackendLog.warn(`cli live session cleanup failed: ${String(error)}`);
			});
		}
	});
}
//#endregion
export { resolveCliExecutionTarget as _, getCliLiveSessionApprovalGrants as a, restartCliLiveSession as c, resolveCliResumeAtError as d, formatCliOutputError as f, createCliRunCurrentAssertion as g, transformCliResultText as h, createCliLiveSessionCapability as i, createCliExitFailoverError as l, createCliJsonlStreamingParser as m, buildCliLiveOwnerKey as n, getCliLiveSessionGeneration as o, parseCliOutput as p, closeCliLiveSession as r, hasCliLiveSession as s, acceptsCliLiveSession as t, createCliFailoverError as u, retainCliPluginExecutionConsumer as v, runCliCleanup as y };
