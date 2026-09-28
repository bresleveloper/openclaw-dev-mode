import { n as estimateStringChars } from "./cjk-chars-6ld30jSx.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { m as stripRuntimeContextCustomMessages } from "./internal-runtime-context-BH-o1oq1.mjs";
import { a as createToolCallOccurrenceQueue } from "./tool-result-pairing-Bky0eubt.mjs";
import { r as stripToolResultDetails } from "./model-context-message-BQc0E7_M.mjs";
import { l as estimateTokens } from "./compaction-CAzwgOuQ.mjs";
import { n as extractToolResultId, t as extractToolCallsFromAssistant } from "./tool-call-id-Dp16BALg.mjs";
import { n as repairToolUseResultPairing } from "./session-transcript-repair-rV_-0RVP.mjs";
//#region src/agents/compaction-planning-projection.ts
/** Builds bounded transcript projections for compaction worker planning. */
const TEXT_TRUNCATE_THRESHOLD_CHARS = 32768;
const TEXT_SAMPLE_CHARS = 8192;
const PLANNING_MAX_CHARS = 262144;
const MAX_ARGUMENT_ESTIMATE_CHARS = 1e6;
const UNMEASURABLE_ARGUMENT_OMITTED_CHARS = Number.MAX_SAFE_INTEGER;
const OMITTED_CHARS_FIELD = "__openclawCompactionPlanningOmittedChars";
function readCompactionPlanningOmittedChars(message) {
	const value = Reflect.get(message, OMITTED_CHARS_FIELD);
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}
function projectText(text, budget) {
	if (text.length <= TEXT_TRUNCATE_THRESHOLD_CHARS && text.length <= budget.remainingChars) {
		budget.remainingChars -= text.length;
		return null;
	}
	const sample = truncateUtf16Safe(text, Math.min(TEXT_SAMPLE_CHARS, budget.remainingChars));
	budget.remainingChars -= sample.length;
	return {
		text: sample,
		omittedChars: estimateStringChars(text.slice(sample.length))
	};
}
function jsonStringLengthWithin(text, maxChars, estimate) {
	let length = 2;
	for (let index = 0; index < text.length; index += 1) {
		const char = text[index] ?? "";
		const code = text.charCodeAt(index);
		const nextCode = text.charCodeAt(index + 1);
		const pairedSurrogate = code >= 55296 && code <= 56319 && nextCode >= 56320 && nextCode <= 57343;
		length += pairedSurrogate ? 2 : code >= 55296 && code <= 57343 ? 6 : char === "\"" || char === "\\" || code === 8 || code === 9 || code === 10 || code === 12 || code === 13 ? 2 : code < 32 ? 6 : 1;
		if (pairedSurrogate) index += 1;
		if (length > maxChars) return;
	}
	estimate.cjkChars += estimateStringChars(text) - text.length;
	return length;
}
function jsonLengthWithin(value, maxChars, estimate, seen = /* @__PURE__ */ new Set()) {
	if (typeof value === "string") return jsonStringLengthWithin(value, maxChars, estimate);
	if (value === null) return 4;
	if (typeof value === "number" || typeof value === "boolean") {
		const length = String(value).length;
		return length <= maxChars ? length : void 0;
	}
	if (!value || typeof value !== "object" || seen.has(value)) return;
	seen.add(value);
	let length = 2;
	if (Array.isArray(value)) for (const entry of value) {
		const separatorLength = length === 2 ? 0 : 1;
		const entryLength = jsonLengthWithin(entry, maxChars - length - separatorLength, estimate, seen);
		if (entryLength === void 0) return;
		length += separatorLength + entryLength;
		if (length > maxChars) return;
	}
	else {
		const record = value;
		for (const key in record) {
			if (!Object.hasOwn(record, key)) continue;
			const separatorLength = length === 2 ? 0 : 1;
			const keyLength = jsonStringLengthWithin(key, maxChars - length - separatorLength, estimate);
			const entryLength = jsonLengthWithin(record[key], maxChars - length - separatorLength - (keyLength ?? 0) - 1, estimate, seen);
			if (keyLength === void 0 || entryLength === void 0) return;
			length += separatorLength + keyLength + entryLength + 1;
			if (length > maxChars) return;
		}
	}
	seen.delete(value);
	return length;
}
function projectToolArguments(value, budget) {
	const estimate = { cjkChars: 0 };
	const length = jsonLengthWithin(value, MAX_ARGUMENT_ESTIMATE_CHARS, estimate);
	if (length !== void 0 && length <= budget.remainingChars) {
		budget.remainingChars -= length;
		return;
	}
	budget.remainingChars = 0;
	return length === void 0 ? UNMEASURABLE_ARGUMENT_OMITTED_CHARS : length + estimate.cjkChars - 2;
}
function projectContentBlock(block, budget) {
	if (!block || typeof block !== "object") return {
		block,
		omittedChars: 0,
		changed: false
	};
	const record = block;
	const type = typeof record.type === "string" ? record.type : "";
	if (type === "image" && typeof record.data === "string" && record.data.length > 0) return {
		block: {
			...record,
			data: ""
		},
		omittedChars: 0,
		changed: true
	};
	const hasText = typeof record.text === "string" && record.text.length > 0;
	const textIsModelVisible = type === "text" || (type === "toolResult" || type === "tool_result") && hasText;
	const contentIsModelVisible = (type === "toolResult" || type === "tool_result") && !hasText && typeof record.content === "string";
	let next;
	let omittedChars = 0;
	for (const field of [
		"text",
		"content",
		"thinking"
	]) {
		if (field === "thinking" && type !== "thinking") continue;
		const value = record[field];
		const projected = typeof value === "string" ? projectText(value, budget) : null;
		if (!projected) continue;
		next ??= { ...record };
		next[field] = projected.text;
		omittedChars += field === "thinking" || (field === "text" ? textIsModelVisible : contentIsModelVisible) ? projected.omittedChars : 0;
	}
	if (type === "toolCall") {
		const omittedArguments = projectToolArguments(record.arguments, budget);
		if (omittedArguments !== void 0) {
			next ??= { ...record };
			next.arguments = {};
			omittedChars += omittedArguments;
		}
	}
	for (const signature of [
		"textSignature",
		"thinkingSignature",
		"thoughtSignature"
	]) if (signature in record) {
		next ??= { ...record };
		delete next[signature];
	}
	return next ? {
		block: next,
		omittedChars,
		changed: true
	} : {
		block,
		omittedChars,
		changed: false
	};
}
function projectStringFields(message, fields, budget) {
	let omittedChars = readCompactionPlanningOmittedChars(message);
	let next;
	for (const field of fields) {
		const value = Reflect.get(message, field);
		if (typeof value !== "string") continue;
		const projected = projectText(value, budget);
		if (!projected) continue;
		next ??= { ...message };
		Reflect.set(next, field, projected.text);
		omittedChars += projected.omittedChars;
	}
	return next ? Object.assign(next, { [OMITTED_CHARS_FIELD]: omittedChars }) : message;
}
function projectMessage(message, budget) {
	let source = message;
	if (message.role === "assistant") source = {
		role: message.role,
		content: message.content,
		stopReason: message.stopReason,
		timestamp: message.timestamp
	};
	else if (message.role === "bashExecution") {
		const { fullOutputPath: _, ...rest } = message;
		source = rest;
	} else if (message.role === "compactionSummary" || message.role === "custom") {
		const { details: _, ...rest } = message;
		source = rest;
	}
	const content = source.content;
	if (typeof content === "string") return projectStringFields(source, ["content"], budget);
	if (!Array.isArray(content)) switch (source.role) {
		case "bashExecution": return projectStringFields(source, ["command", "output"], budget);
		case "branchSummary":
		case "compactionSummary": return projectStringFields(source, ["summary"], budget);
		default: return source;
	}
	let omittedChars = 0;
	let changed = false;
	const projectedContent = content.map((block) => {
		const projected = projectContentBlock(block, budget);
		omittedChars += projected.omittedChars;
		changed ||= projected.changed;
		return projected.block;
	});
	if (!changed) return source;
	return Object.assign({}, source, {
		content: projectedContent,
		[OMITTED_CHARS_FIELD]: readCompactionPlanningOmittedChars(source) + omittedChars
	});
}
function projectCompactionPlanningMessages(messages) {
	const budget = { remainingChars: PLANNING_MAX_CHARS };
	return messages.map((message) => projectMessage(message, budget));
}
//#endregion
//#region src/agents/compaction-planning.ts
/**
* Planning helpers for transcript compaction. The module estimates sanitized
* token usage, chooses chunking strategy, and preserves active tool-use pairs
* while splitting history for summaries.
*/
/** Default share of context window targeted for compaction chunks. */
const BASE_CHUNK_RATIO = .4;
/** Lower bound for adaptive compaction chunk sizing. */
const MIN_CHUNK_RATIO = .15;
/** Buffer for estimateTokens() inaccuracy. */
const SAFETY_MARGIN = 1.2;
const DEFAULT_PARTS = 2;
/**
* Overhead reserved for summary prompt, system prompt, prior summary, wrapper
* tags, and high-reasoning summary generation.
*/
const SUMMARIZATION_OVERHEAD_TOKENS = 4096;
/** Estimates compaction tokens after removing fields that must not reach summarization. */
function estimateMessagesTokens(messages) {
	return sanitizeCompactionMessages(messages).reduce((sum, message) => sum + estimateCompactionPlanningTokens(message), 0);
}
/**
* Per-original-message token estimates, aligned 1:1 to the input array. Sanitizes
* the full array once instead of wrapping and re-cloning each message in its own
* 1-element array. Runtime-context entries are not model-visible, so they estimate
* to 0 here just as sanitizeCompactionMessages([msg]) would drop them.
*/
function estimatePerMessageTokens(messages) {
	const detailStripped = stripToolResultDetails(messages);
	const modelVisible = new Set(stripRuntimeContextCustomMessages(detailStripped));
	return detailStripped.map((message) => modelVisible.has(message) ? estimateCompactionPlanningTokens(message) : 0);
}
/** Removes runtime-only context and tool-result details before token estimates or summaries. */
function sanitizeCompactionMessages(messages) {
	return stripToolResultDetails(stripRuntimeContextCustomMessages(messages));
}
function estimateCompactionPlanningTokens(message) {
	return estimateTokens(message) + Math.ceil(readCompactionPlanningOmittedChars(message) / 4);
}
/** Builds a bounded planning projection that preserves token pressure accounting. */
function projectCompactionMessagesForPlanning(messages) {
	return projectCompactionPlanningMessages(sanitizeCompactionMessages(messages));
}
/** Clamps requested split parts to a usable count for the available messages. */
function normalizeCompactionParts(parts, messageCount) {
	if (!Number.isFinite(parts) || parts <= 1) return 1;
	return Math.min(Math.max(1, Math.floor(parts)), Math.max(1, messageCount));
}
function forEachCompactionMessageGroup(messages, perMessageTokens, visit) {
	let start = 0;
	let currentTokens = 0;
	let pendingToolCalls = createToolCallOccurrenceQueue();
	for (const [index, message] of messages.entries()) {
		currentTokens += perMessageTokens[index];
		if (message.role === "assistant") {
			const stopReason = message.stopReason;
			const toolCalls = stopReason === "aborted" || stopReason === "error" ? [] : extractToolCallsFromAssistant(message);
			pendingToolCalls = createToolCallOccurrenceQueue();
			for (const toolCall of toolCalls) pendingToolCalls.add(toolCall.id, true);
		} else if (message.role === "toolResult" && pendingToolCalls.size > 0) {
			const resultId = extractToolResultId(message);
			if (resultId) pendingToolCalls.claim(resultId);
			else pendingToolCalls.clear();
		}
		if (pendingToolCalls.size === 0) {
			visit(start, index + 1, currentTokens);
			start = index + 1;
			currentTokens = 0;
		}
	}
	if (start < messages.length) visit(start, messages.length, currentTokens);
}
/** Chunks atomic tool-call groups without splitting a provider-visible call/result pair. */
function chunkCompactionMessageGroups(messages, maxTokens, perMessageTokens, maxChunks = Number.POSITIVE_INFINITY) {
	const chunks = [];
	let chunkStart = 0;
	let currentTokens = 0;
	forEachCompactionMessageGroup(messages, perMessageTokens, (start, _end, tokens) => {
		if (start > chunkStart && chunks.length < maxChunks - 1 && currentTokens + tokens > maxTokens) {
			chunks.push(messages.slice(chunkStart, start));
			chunkStart = start;
			currentTokens = 0;
		}
		currentTokens += tokens;
	});
	if (chunkStart < messages.length) chunks.push(messages.slice(chunkStart));
	return chunks;
}
/**
* Compute adaptive chunk ratio based on average message size.
* When messages are large, we use smaller chunks to avoid exceeding model limits.
*/
function computeAdaptiveChunkRatio(messages, contextWindow) {
	if (messages.length === 0) return BASE_CHUNK_RATIO;
	const avgRatio = estimateMessagesTokens(messages) / messages.length * SAFETY_MARGIN / contextWindow;
	if (avgRatio > .1) {
		const reduction = Math.min(avgRatio * 2, .25);
		return Math.max(MIN_CHUNK_RATIO, BASE_CHUNK_RATIO - reduction);
	}
	return BASE_CHUNK_RATIO;
}
/** Builds sanitized chunks for summarization prompts. */
function buildSummaryChunks(params) {
	const safeMessages = sanitizeCompactionMessages(params.messages);
	return chunkCompactionMessageGroups(safeMessages, Math.max(1, Math.floor(params.maxChunkTokens / SAFETY_MARGIN)), estimatePerMessageTokens(safeMessages));
}
/** Separates messages too large to summarize and emits compact placeholder notes for them. */
function buildOversizedFallbackPlan(params) {
	const smallMessages = [];
	const oversizedNotes = [];
	const perMessageTokens = estimatePerMessageTokens(params.messages);
	const oversizedThreshold = params.contextWindow * .5;
	forEachCompactionMessageGroup(params.messages, perMessageTokens, (start, end) => {
		let omitToolBatch = false;
		for (let index = start; index < end; index++) {
			const message = params.messages[index];
			const tokens = perMessageTokens[index];
			if (tokens * 1.2 > oversizedThreshold) {
				oversizedNotes.push(`[Large ${message.role} (~${Math.round(tokens / 1e3)}K tokens) omitted from summary]`);
				omitToolBatch ||= message.role === "assistant" || message.role === "toolResult";
			}
		}
		for (let index = start; index < end; index++) {
			if (perMessageTokens[index] * 1.2 > oversizedThreshold) continue;
			const message = params.messages[index];
			if (!omitToolBatch || message.role !== "assistant" && message.role !== "toolResult") smallMessages.push(message);
		}
	});
	return {
		smallMessages,
		oversizedNotes
	};
}
/** Plans whether to split a summarization stage based on message count and token budget. */
function buildStageSplitPlan(params) {
	const minMessagesForSplit = Math.max(2, params.minMessagesForSplit ?? 4);
	const parts = normalizeCompactionParts(params.parts ?? DEFAULT_PARTS, params.messages.length);
	if (parts <= 1 || params.messages.length < minMessagesForSplit) return { mode: "single" };
	const perMessageTokens = estimatePerMessageTokens(params.messages);
	const totalTokens = perMessageTokens.reduce((sum, tokens) => sum + tokens, 0);
	if (totalTokens <= params.maxChunkTokens) return { mode: "single" };
	const chunks = chunkCompactionMessageGroups(params.messages, totalTokens / parts, perMessageTokens, parts);
	return chunks.length > 1 ? {
		mode: "split",
		chunks
	} : { mode: "single" };
}
/** Drops oldest token-share chunks until history fits the requested context share. */
function pruneHistoryForContextShare(params) {
	const budgetTokens = Math.max(1, Math.floor(params.maxContextTokens * params.maxHistoryShare));
	let keptMessages = params.messages;
	const allDroppedMessages = [];
	let droppedChunks = 0;
	const parts = normalizeCompactionParts(params.parts ?? DEFAULT_PARTS, keptMessages.length);
	const originalMessageIndexes = new Map(params.messages.map((message, index) => [message, index]));
	while (keptMessages.length > 0) {
		const splitPlan = buildStageSplitPlan({
			messages: keptMessages,
			maxChunkTokens: budgetTokens,
			minMessagesForSplit: 2,
			parts
		});
		if (splitPlan.mode === "single") break;
		const dropped = splitPlan.chunks[0];
		const retained = splitPlan.chunks.slice(1).flat();
		const repairReport = repairToolUseResultPairing(retained);
		const repairedDropped = repairReport.discarded;
		droppedChunks += 1;
		allDroppedMessages.push(...dropped, ...repairedDropped);
		keptMessages = repairReport.messages;
	}
	allDroppedMessages.sort((left, right) => (originalMessageIndexes.get(left) ?? params.messages.length) - (originalMessageIndexes.get(right) ?? params.messages.length));
	return {
		messages: keptMessages,
		droppedMessagesList: allDroppedMessages,
		droppedChunks,
		droppedMessages: allDroppedMessages.length,
		droppedTokens: estimateMessagesTokens(allDroppedMessages),
		keptTokens: estimateMessagesTokens(keptMessages),
		budgetTokens
	};
}
/** Computes whether new content exceeds the history budget and plans pruning when needed. */
function buildHistoryPrunePlan(params) {
	const summarizableTokens = estimateMessagesTokens(params.messagesToSummarize) + estimateMessagesTokens(params.turnPrefixMessages);
	const newContentTokens = Math.max(0, Math.floor(params.tokensBefore - summarizableTokens));
	const maxHistoryTokens = Math.floor(params.contextWindowTokens * params.maxHistoryShare * SAFETY_MARGIN);
	const plan = {
		summarizableTokens,
		newContentTokens,
		maxHistoryTokens
	};
	return newContentTokens <= maxHistoryTokens ? plan : {
		...plan,
		pruned: pruneHistoryForContextShare({
			messages: params.messagesToSummarize,
			maxContextTokens: params.contextWindowTokens,
			maxHistoryShare: params.maxHistoryShare,
			parts: params.parts
		})
	};
}
//#endregion
export { buildHistoryPrunePlan as a, buildSummaryChunks as c, projectCompactionMessagesForPlanning as d, sanitizeCompactionMessages as f, SUMMARIZATION_OVERHEAD_TOKENS as i, computeAdaptiveChunkRatio as l, MIN_CHUNK_RATIO as n, buildOversizedFallbackPlan as o, SAFETY_MARGIN as r, buildStageSplitPlan as s, BASE_CHUNK_RATIO as t, estimateMessagesTokens as u };
