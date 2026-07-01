import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import "./agent-scope-CDZXADgT.js";
import { i as resolveAgentContextLimits } from "./agent-scope-config-C3ijpoNo.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-BFG5Kqze.js";
import { s as resolveSessionWriteLockOptions, t as acquireSessionWriteLock } from "./session-write-lock-B7bsl0mX.js";
import "./sessions-DP0wANEo.js";
import { t as log } from "./logger-DibNup0x.js";
import { c as readTranscriptFileState, n as rewriteTranscriptEntriesInSessionManager, r as rewriteTranscriptEntriesInState, s as persistTranscriptStateMutation } from "./transcript-rewrite-CO2KuAHs.js";
//#region src/agents/embedded-agent-runner/context-truncation-notice.ts
/**
* Shared truncation notice text for context payloads capped by provider or tool limits.
*/
const CONTEXT_LIMIT_TRUNCATION_NOTICE = "more characters truncated";
const CONTEXT_LIMIT_TRUNCATION_HINT = "rerun with narrower args if needed";
/** Formats a compact notice that preserves the approximate number of omitted characters. */
function formatContextLimitTruncationNotice(truncatedChars) {
	return `[... ${Math.max(1, Math.floor(truncatedChars))} ${CONTEXT_LIMIT_TRUNCATION_NOTICE}; ${CONTEXT_LIMIT_TRUNCATION_HINT}]`;
}
//#endregion
//#region src/agents/embedded-agent-runner/tool-result-truncation.ts
/**
* Truncates oversized tool-result content in messages and transcripts.
*/
/**
* Maximum share of the context window a single tool result should occupy.
* This is intentionally conservative – a single tool result should not
* consume more than 30% of the context window even without other messages.
*/
const MAX_TOOL_RESULT_CONTEXT_SHARE = .3;
/**
* Low-context default cap for a single live tool result text block.
*
* The session runtime already truncates tool results aggressively when serializing old history
* for compaction summaries. For the live request path we still keep a bounded
* request-local ceiling so oversized tool output cannot dominate the next turn.
*/
const DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS = 16e3;
const LARGE_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS = 32e3;
const XL_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS = 64e3;
const LARGE_CONTEXT_TOOL_RESULT_TOKENS = 1e5;
const XL_CONTEXT_TOOL_RESULT_TOKENS = 2e5;
/**
* Minimum characters to keep when truncating.
* We always keep at least the first portion so the model understands
* what was in the content.
*/
const MIN_KEEP_CHARS = 2e3;
const RECOVERY_MIN_KEEP_CHARS = 0;
const DEFAULT_SUFFIX = (truncatedChars) => formatContextLimitTruncationNotice(truncatedChars);
const COMPACT_RECOVERY_SUFFIX = (truncatedChars) => `[... ${Math.max(1, Math.floor(truncatedChars))} chars truncated; narrow args]`;
function resolveSuffixFactory(suffix) {
	if (typeof suffix === "function") return suffix;
	if (typeof suffix === "string") return () => suffix;
	return DEFAULT_SUFFIX;
}
function resolveEffectiveMinKeepChars(params) {
	const suffixFloor = params.suffixFactory(1).length;
	return Math.max(0, Math.min(params.minKeepChars, Math.max(0, params.maxChars - suffixFloor)));
}
function appendBoundedTruncationSuffix(params) {
	const build = (keptText) => keptText + params.suffixFactory(Math.max(1, params.originalTextLength - keptText.length));
	let keptText = params.keptText;
	while (true) {
		const finalText = build(keptText);
		if (finalText.length <= params.maxChars) return finalText;
		if (keptText.length === 0) return finalText.slice(0, params.maxChars);
		const overflow = finalText.length - params.maxChars;
		const nextKeptText = keptText.slice(0, Math.max(0, keptText.length - overflow));
		keptText = nextKeptText.length < keptText.length ? nextKeptText : keptText.slice(0, -1);
	}
}
/**
* Marker inserted between head and tail when using head+tail truncation.
*/
const MIDDLE_OMISSION_MARKER = "\n\n⚠️ [... middle content omitted — showing head and tail ...]\n\n";
/**
* Detect whether text likely contains error/diagnostic content near the end,
* which should be preserved during truncation.
*/
function hasImportantTail(text) {
	const tail = normalizeLowercaseStringOrEmpty(text.slice(-2e3));
	return /\b(error|exception|failed|fatal|traceback|panic|stack trace|errno|exit code)\b/.test(tail) || /\}\s*$/.test(tail.trim()) || /\b(total|summary|result|complete|finished|done)\b/.test(tail);
}
/**
* Truncate a single text string to fit within maxChars.
*
* Uses a head+tail strategy when the tail contains important content
* (errors, results, JSON structure), otherwise preserves the beginning.
* This ensures error messages and summaries at the end of tool output
* aren't lost during truncation.
*/
function truncateToolResultText(text, maxChars, options = {}) {
	const suffixFactory = resolveSuffixFactory(options.suffix);
	const minKeepChars = resolveEffectiveMinKeepChars({
		maxChars,
		minKeepChars: options.minKeepChars ?? MIN_KEEP_CHARS,
		suffixFactory
	});
	if (text.length <= maxChars) return text;
	const defaultSuffix = suffixFactory(Math.max(1, text.length - maxChars));
	const budget = Math.max(minKeepChars, maxChars - defaultSuffix.length);
	if (hasImportantTail(text) && budget > minKeepChars * 2) {
		const tailBudget = Math.min(Math.floor(budget * .3), 4e3);
		const headBudget = budget - tailBudget - 63;
		if (headBudget > minKeepChars) {
			let headCut = headBudget;
			const headNewline = text.lastIndexOf("\n", headBudget);
			if (headNewline > headBudget * .8) headCut = headNewline;
			let tailStart = text.length - tailBudget;
			const tailNewline = text.indexOf("\n", tailStart);
			if (tailNewline !== -1 && tailNewline < tailStart + tailBudget * .2) tailStart = tailNewline + 1;
			return appendBoundedTruncationSuffix({
				keptText: text.slice(0, headCut) + MIDDLE_OMISSION_MARKER + text.slice(tailStart),
				originalTextLength: text.length,
				maxChars,
				suffixFactory
			});
		}
	}
	let cutPoint = budget;
	const lastNewline = text.lastIndexOf("\n", budget);
	if (lastNewline > budget * .8) cutPoint = lastNewline;
	return appendBoundedTruncationSuffix({
		keptText: text.slice(0, cutPoint),
		originalTextLength: text.length,
		maxChars,
		suffixFactory
	});
}
/**
* Calculate the maximum allowed characters for a single tool result
* based on the model's context window tokens.
*
* Uses a rough 4 chars ≈ 1 token heuristic (conservative for English text;
* actual ratio varies by tokenizer).
*/
function calculateMaxToolResultChars(contextWindowTokens) {
	return calculateMaxToolResultCharsWithCap(contextWindowTokens, resolveAutoLiveToolResultMaxChars(contextWindowTokens));
}
function resolveAutoLiveToolResultMaxChars(contextWindowTokens) {
	if (!Number.isFinite(contextWindowTokens)) return DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
	const tokens = Math.floor(contextWindowTokens);
	if (tokens >= XL_CONTEXT_TOOL_RESULT_TOKENS) return XL_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS;
	if (tokens >= LARGE_CONTEXT_TOOL_RESULT_TOKENS) return LARGE_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS;
	return DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
}
function calculateMaxToolResultCharsWithCap(contextWindowTokens, hardCapChars) {
	const maxChars = Math.floor(contextWindowTokens * MAX_TOOL_RESULT_CONTEXT_SHARE) * 4;
	return Math.min(maxChars, Math.max(1, hardCapChars));
}
function resolveLiveToolResultMaxChars(params) {
	const cap = resolveAgentContextLimits(params.cfg, params.agentId)?.toolResultMaxChars ?? resolveAutoLiveToolResultMaxChars(params.contextWindowTokens);
	return calculateMaxToolResultCharsWithCap(params.contextWindowTokens, cap);
}
/**
* Get the total character count of text content blocks in a tool result message.
*/
function getToolResultTextLength(msg) {
	if (!msg || msg.role !== "toolResult") return 0;
	const content = msg.content;
	if (!Array.isArray(content)) return 0;
	let totalLength = 0;
	for (const block of content) if (isToolResultTextBlock(block)) {
		const text = block.text;
		if (typeof text === "string") totalLength += text.length;
	}
	return totalLength;
}
/**
* Truncate a tool result message's text content blocks to fit within maxChars.
* Returns a new message (does not mutate the original).
*/
function truncateToolResultMessage(msg, maxChars, options = {}) {
	const suffixFactory = resolveSuffixFactory(options.suffix);
	const minKeepChars = resolveEffectiveMinKeepChars({
		maxChars,
		minKeepChars: options.minKeepChars ?? MIN_KEEP_CHARS,
		suffixFactory
	});
	const content = msg.content;
	if (!Array.isArray(content)) return msg;
	const totalTextChars = getToolResultTextLength(msg);
	if (totalTextChars <= maxChars) return msg;
	const newContent = content.map((block) => {
		if (!isToolResultTextBlock(block)) return block;
		const textBlock = block;
		if (typeof textBlock.text !== "string") return block;
		const blockShare = textBlock.text.length / totalTextChars;
		const defaultSuffix = suffixFactory(Math.max(1, textBlock.text.length - Math.floor(maxChars * blockShare)));
		const proportionalBudget = Math.floor(maxChars * blockShare);
		const blockBudget = Math.max(1, Math.min(maxChars, Math.max(minKeepChars + defaultSuffix.length, proportionalBudget)));
		const truncatedText = truncateToolResultText(textBlock.text, blockBudget, {
			suffix: suffixFactory,
			minKeepChars
		});
		const nextBlock = Object.assign({}, textBlock, { text: truncatedText });
		if (typeof textBlock.content === "string") nextBlock.content = truncatedText;
		return nextBlock;
	});
	return {
		...msg,
		content: newContent
	};
}
function isToolResultTextBlock(block) {
	if (!block || typeof block !== "object") return false;
	const type = block.type;
	return (type === "text" || type === "toolResult") && typeof block.text === "string";
}
/**
* Truncate oversized tool results in an array of messages (in-memory).
* Returns a new array with truncated messages.
*
* This is used as a pre-emptive guard before sending messages to the LLM,
* without modifying the session file.
*/
function truncateOversizedToolResultsInMessages(messages, contextWindowTokens, maxCharsOverride, aggregateMaxCharsOverride, projectionState) {
	const maxChars = Math.max(1, maxCharsOverride ?? calculateMaxToolResultChars(contextWindowTokens));
	const aggregateBudgetChars = calculateRecoveryAggregateToolResultChars(contextWindowTokens, maxChars, aggregateMaxCharsOverride);
	const projectionKeys = projectionState ? getToolResultProjectionKeys(messages, projectionState) : [];
	const branch = messages.map((message, index) => {
		const projectionKey = projectionKeys[index];
		const projectedMessage = projectionKey ? projectionState?.replacements.get(projectionKey) : void 0;
		if (projectionKey && projectionState && !projectionState.sourceTextByKey.has(projectionKey)) projectionState.sourceTextByKey.set(projectionKey, getToolResultTextBlocks(message));
		const mergedMessage = projectedMessage ? mergeProjectedToolResultMessage(message, projectedMessage, projectionState?.sourceTextByKey.get(projectionKey ?? "")) : message;
		return {
			id: `message-${index}`,
			type: "message",
			message: mergedMessage,
			aggregateEligible: !projectionKey || !projectionState?.frozen.has(projectionKey) || projectedMessage !== void 0 && mergedMessage === message
		};
	});
	const plan = buildToolResultReplacementPlan({
		branch,
		maxChars,
		aggregateBudgetChars,
		minKeepChars: RECOVERY_MIN_KEEP_CHARS
	});
	if (projectionState) for (const [index] of messages.entries()) {
		const projectionKey = projectionKeys[index];
		if (projectionKey) projectionState.frozen.add(projectionKey);
	}
	if (plan.replacements.length === 0) {
		const projectedMessages = branch.map((entry) => entry.message);
		return {
			messages: projectedMessages.some((message, index) => message !== messages[index]) ? projectedMessages : messages,
			truncatedCount: 0
		};
	}
	const replacementIds = new Set(plan.replacements.map((replacement) => replacement.entryId));
	const replacedBranch = applyToolResultReplacementsToBranch(branch, plan.replacements);
	if (projectionState) for (const [index, originalMessage] of messages.entries()) {
		const projectedMessage = replacedBranch[index]?.message;
		const projectionKey = projectionKeys[index];
		if (projectionKey) {
			projectionState.frozen.add(projectionKey);
			if (projectedMessage && projectedMessage !== originalMessage) projectionState.replacements.set(projectionKey, projectedMessage);
		}
	}
	return {
		messages: replacedBranch.map((entry) => entry.message),
		truncatedCount: replacementIds.size
	};
}
function calculateRecoveryAggregateToolResultChars(contextWindowTokens, maxCharsOverride, aggregateMaxCharsOverride) {
	return Math.max(1, aggregateMaxCharsOverride ?? maxCharsOverride ?? calculateMaxToolResultChars(contextWindowTokens));
}
function createToolResultPromptProjectionState() {
	return {
		replacements: /* @__PURE__ */ new Map(),
		frozen: /* @__PURE__ */ new Set(),
		ambiguousBaseKeys: /* @__PURE__ */ new Set(),
		sourceTextByKey: /* @__PURE__ */ new Map()
	};
}
function getToolResultProjectionBaseKey(message) {
	if (message.role !== "toolResult") return;
	const toolCallId = message.toolCallId;
	const timestamp = message.timestamp;
	const timestampKey = typeof timestamp === "number" ? `:${timestamp}` : "";
	if (typeof toolCallId === "string" && toolCallId.length > 0) return `tool:${toolCallId}${timestampKey}`;
	return typeof timestamp === "number" ? `timestamp:${timestamp}` : void 0;
}
function getToolResultProjectionKeys(messages, projectionState) {
	const baseKeys = messages.map((message) => getToolResultProjectionBaseKey(message));
	const baseKeyCounts = /* @__PURE__ */ new Map();
	for (const baseKey of baseKeys) if (baseKey) baseKeyCounts.set(baseKey, (baseKeyCounts.get(baseKey) ?? 0) + 1);
	for (const [baseKey, count] of baseKeyCounts) if (count > 1) projectionState.ambiguousBaseKeys.add(baseKey);
	const occurrences = /* @__PURE__ */ new Map();
	return baseKeys.map((baseKey) => {
		if (!baseKey) return;
		if (projectionState.ambiguousBaseKeys.has(baseKey)) return;
		const occurrence = occurrences.get(baseKey) ?? 0;
		occurrences.set(baseKey, occurrence + 1);
		return `${baseKey}:${occurrence}`;
	});
}
function mergeProjectedToolResultMessage(message, projectedMessage, sourceText) {
	if (message.role !== "toolResult" || projectedMessage.role !== "toolResult") return projectedMessage;
	const currentContent = message.content;
	const projectedContent = projectedMessage.content;
	if (!Array.isArray(currentContent) || !Array.isArray(projectedContent)) return projectedMessage;
	const projectedText = projectedContent.filter((block) => Boolean(block) && typeof block === "object" && block.type === "text" && typeof block.text === "string");
	const currentText = getToolResultTextBlocks(message);
	if (sourceText && currentText.some((text, index) => text !== sourceText[index])) return message;
	if (currentContent.filter((block) => Boolean(block) && typeof block === "object" && block.type === "text").length !== projectedText.length) return message;
	let textIndex = 0;
	const mergedContent = currentContent.map((block) => {
		if (!block || typeof block !== "object" || block.type !== "text") return block;
		const projectedBlock = projectedText[textIndex++];
		return projectedBlock ? Object.assign({}, block, { text: projectedBlock.text }) : block;
	});
	return {
		...message,
		content: mergedContent
	};
}
function getToolResultTextBlocks(message) {
	const content = message.content;
	if (!Array.isArray(content)) return [];
	return content.flatMap((block) => block && typeof block === "object" && block.type === "text" ? [typeof block.text === "string" ? block.text : ""] : []);
}
function buildAggregateToolResultReplacements(params) {
	const minKeepChars = params.minKeepChars ?? MIN_KEEP_CHARS;
	const candidates = params.branch.map((entry, index) => ({
		entry,
		index
	})).filter((item) => item.entry.type === "message" && Boolean(item.entry.message) && item.entry.message.role === "toolResult").map((item) => ({
		index: item.index,
		entryId: item.entry.id,
		message: item.entry.message,
		textLength: getToolResultTextLength(item.entry.message),
		aggregateEligible: item.entry.aggregateEligible !== false
	})).filter((item) => item.textLength > 0);
	if (candidates.length < 2) return [];
	const suffixFactory = minKeepChars === RECOVERY_MIN_KEEP_CHARS && params.aggregateBudgetChars < candidates.length * DEFAULT_SUFFIX(1).length ? COMPACT_RECOVERY_SUFFIX : DEFAULT_SUFFIX;
	const minTruncatedTextChars = minKeepChars + suffixFactory(1).length;
	const totalChars = candidates.reduce((sum, item) => sum + item.textLength, 0);
	if (totalChars <= params.aggregateBudgetChars) return [];
	let remainingReduction = totalChars - params.aggregateBudgetChars;
	const replacements = [];
	for (const candidate of candidates.filter((item) => item.aggregateEligible).toSorted((a, b) => {
		if (a.index !== b.index) return a.index - b.index;
		return b.textLength - a.textLength;
	})) {
		if (remainingReduction <= 0) break;
		const reducibleChars = Math.max(0, candidate.textLength - minTruncatedTextChars);
		if (reducibleChars <= 0) continue;
		const requestedReduction = Math.min(reducibleChars, remainingReduction);
		const targetChars = Math.max(minTruncatedTextChars, candidate.textLength - requestedReduction);
		const truncatedMessage = truncateToolResultMessage(candidate.message, targetChars, {
			minKeepChars,
			suffix: suffixFactory
		});
		const newLength = getToolResultTextLength(truncatedMessage);
		const actualReduction = Math.max(0, candidate.textLength - newLength);
		if (actualReduction <= 0) continue;
		replacements.push({
			entryId: candidate.entryId,
			message: truncatedMessage
		});
		remainingReduction -= actualReduction;
	}
	if (remainingReduction > 0) for (const candidate of candidates.filter((item) => item.aggregateEligible)) {
		if (remainingReduction <= 0) break;
		const emptyMessage = clearToolResultText(replacements.find((replacement) => replacement.entryId === candidate.entryId)?.message ?? candidate.message);
		const actualReduction = Math.max(0, candidate.textLength - getToolResultTextLength(emptyMessage));
		if (actualReduction <= 0) continue;
		const replacement = {
			entryId: candidate.entryId,
			message: emptyMessage
		};
		const existingIndex = replacements.findIndex((existing) => existing.entryId === candidate.entryId);
		if (existingIndex >= 0) replacements[existingIndex] = replacement;
		else replacements.push(replacement);
		remainingReduction -= actualReduction;
	}
	return replacements;
}
function clearToolResultText(message) {
	const content = message.content;
	if (!Array.isArray(content)) return message;
	return {
		...message,
		content: content.map((block) => block && typeof block === "object" && block.type === "text" ? Object.assign({}, block, { text: "" }) : block)
	};
}
function buildOversizedToolResultReplacements(params) {
	const minKeepChars = params.minKeepChars ?? MIN_KEEP_CHARS;
	const replacements = [];
	for (const entry of params.branch) {
		if (entry.type !== "message" || !entry.message) continue;
		const msg = entry.message;
		if (msg.role !== "toolResult") continue;
		if (getToolResultTextLength(msg) <= params.maxChars) continue;
		replacements.push({
			entryId: entry.id,
			message: truncateToolResultMessage(msg, params.maxChars, { minKeepChars })
		});
	}
	return replacements;
}
function calculateReplacementReduction(branch, replacements) {
	if (replacements.length === 0) return 0;
	const branchById = new Map(branch.map((entry) => [entry.id, entry]));
	let reduction = 0;
	for (const replacement of replacements) {
		const entry = branchById.get(replacement.entryId);
		if (!entry?.message) continue;
		reduction += Math.max(0, getToolResultTextLength(entry.message) - getToolResultTextLength(replacement.message));
	}
	return reduction;
}
function applyToolResultReplacementsToBranch(branch, replacements) {
	if (replacements.length === 0) return branch;
	const replacementsById = new Map(replacements.map((replacement) => [replacement.entryId, replacement]));
	return branch.map((entry) => {
		const replacement = replacementsById.get(entry.id);
		if (!replacement || entry.type !== "message") return entry;
		return {
			...entry,
			message: replacement.message
		};
	});
}
function buildToolResultReplacementPlan(params) {
	const minKeepChars = params.minKeepChars ?? MIN_KEEP_CHARS;
	const oversizedReplacements = buildOversizedToolResultReplacements({
		branch: params.branch,
		maxChars: params.maxChars,
		minKeepChars
	});
	const oversizedReducibleChars = calculateReplacementReduction(params.branch, oversizedReplacements);
	const oversizedTrimmedBranch = applyToolResultReplacementsToBranch(params.branch, oversizedReplacements);
	const aggregateReplacements = buildAggregateToolResultReplacements({
		branch: oversizedTrimmedBranch,
		aggregateBudgetChars: params.aggregateBudgetChars,
		minKeepChars
	});
	const aggregateReducibleChars = calculateReplacementReduction(oversizedTrimmedBranch, aggregateReplacements);
	return {
		replacements: [...oversizedReplacements, ...aggregateReplacements],
		oversizedReplacementCount: oversizedReplacements.length,
		aggregateReplacementCount: aggregateReplacements.length,
		oversizedReducibleChars,
		aggregateReducibleChars
	};
}
function estimateToolResultReductionPotential(params) {
	const { messages, contextWindowTokens } = params;
	const maxChars = Math.max(1, params.maxCharsOverride ?? calculateMaxToolResultChars(contextWindowTokens));
	const aggregateBudgetChars = calculateRecoveryAggregateToolResultChars(contextWindowTokens, maxChars, params.aggregateMaxCharsOverride);
	const branch = messages.map((message, index) => ({
		id: `message-${index}`,
		type: "message",
		message
	}));
	let toolResultCount = 0;
	let totalToolResultChars = 0;
	for (const msg of messages) {
		if (msg.role !== "toolResult") continue;
		const textLength = getToolResultTextLength(msg);
		if (textLength <= 0) continue;
		toolResultCount += 1;
		totalToolResultChars += textLength;
	}
	const plan = buildToolResultReplacementPlan({
		branch,
		maxChars,
		aggregateBudgetChars,
		minKeepChars: RECOVERY_MIN_KEEP_CHARS
	});
	const maxReducibleChars = plan.oversizedReducibleChars + plan.aggregateReducibleChars;
	return {
		maxChars,
		aggregateBudgetChars,
		toolResultCount,
		totalToolResultChars,
		oversizedCount: plan.oversizedReplacementCount,
		oversizedReducibleChars: plan.oversizedReducibleChars,
		aggregateReducibleChars: plan.aggregateReducibleChars,
		maxReducibleChars
	};
}
function truncateOversizedToolResultsInExistingSessionManager(params) {
	const { sessionManager, contextWindowTokens } = params;
	const maxChars = Math.max(1, params.maxCharsOverride ?? calculateMaxToolResultChars(contextWindowTokens));
	const aggregateBudgetChars = calculateRecoveryAggregateToolResultChars(contextWindowTokens, maxChars, params.aggregateMaxCharsOverride);
	const branch = sessionManager.getBranch();
	if (branch.length === 0) return {
		truncated: false,
		truncatedCount: 0,
		reason: "empty session"
	};
	const plan = buildToolResultReplacementPlan({
		branch,
		maxChars,
		aggregateBudgetChars,
		minKeepChars: RECOVERY_MIN_KEEP_CHARS
	});
	if (plan.replacements.length === 0) return {
		truncated: false,
		truncatedCount: 0,
		reason: "no oversized or aggregate tool results"
	};
	const rewriteResult = rewriteTranscriptEntriesInSessionManager({
		sessionManager,
		replacements: plan.replacements
	});
	if (rewriteResult.changed && params.sessionFile) emitSessionTranscriptUpdate({
		sessionFile: params.sessionFile,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.sessionId && params.sessionKey && params.agentId ? { target: {
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		} } : {}
	});
	log.info(`[tool-result-truncation] Truncated ${rewriteResult.rewrittenEntries} tool result(s) in session (contextWindow=${contextWindowTokens} maxChars=${maxChars} aggregateBudgetChars=${aggregateBudgetChars} oversized=${plan.oversizedReplacementCount} aggregate=${plan.aggregateReplacementCount}) sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"}`);
	return {
		truncated: rewriteResult.changed,
		truncatedCount: rewriteResult.rewrittenEntries,
		reason: rewriteResult.reason
	};
}
async function truncateOversizedToolResultsInTranscriptState(params) {
	const { state, contextWindowTokens } = params;
	const maxChars = Math.max(1, params.maxCharsOverride ?? calculateMaxToolResultChars(contextWindowTokens));
	const aggregateBudgetChars = calculateRecoveryAggregateToolResultChars(contextWindowTokens, maxChars, params.aggregateMaxCharsOverride);
	const branch = state.getBranch();
	if (branch.length === 0) return {
		truncated: false,
		truncatedCount: 0,
		reason: "empty session"
	};
	const plan = buildToolResultReplacementPlan({
		branch,
		maxChars,
		aggregateBudgetChars,
		minKeepChars: RECOVERY_MIN_KEEP_CHARS
	});
	if (plan.replacements.length === 0) return {
		truncated: false,
		truncatedCount: 0,
		reason: "no oversized or aggregate tool results"
	};
	const rewriteResult = rewriteTranscriptEntriesInState({
		state,
		replacements: plan.replacements
	});
	if (rewriteResult.changed) {
		await persistTranscriptStateMutation({
			sessionFile: params.sessionFile,
			state,
			appendedEntries: rewriteResult.appendedEntries
		});
		emitSessionTranscriptUpdate({
			sessionFile: params.sessionFile,
			sessionKey: params.sessionKey,
			...params.agentId ? { agentId: params.agentId } : {},
			...params.sessionId && params.sessionKey && params.agentId ? { target: {
				agentId: params.agentId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey
			} } : {}
		});
	}
	log.info(`[tool-result-truncation] Truncated ${rewriteResult.rewrittenEntries} tool result(s) in session (contextWindow=${contextWindowTokens} maxChars=${maxChars} aggregateBudgetChars=${aggregateBudgetChars} oversized=${plan.oversizedReplacementCount} aggregate=${plan.aggregateReplacementCount}) sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"}`);
	return {
		truncated: rewriteResult.changed,
		truncatedCount: rewriteResult.rewrittenEntries,
		reason: rewriteResult.reason
	};
}
function truncateOversizedToolResultsInSessionManager(params) {
	try {
		return truncateOversizedToolResultsInExistingSessionManager(params);
	} catch (err) {
		const errMsg = formatErrorMessage(err);
		log.warn(`[tool-result-truncation] Failed to truncate: ${errMsg}`);
		return {
			truncated: false,
			truncatedCount: 0,
			reason: errMsg
		};
	}
}
/**
* Truncates a named transcript file artifact.
*/
async function truncateOversizedToolResultsInSession(params) {
	const { sessionFile, contextWindowTokens } = params;
	let sessionLock;
	try {
		sessionLock = await acquireSessionWriteLock({
			sessionFile,
			...resolveSessionWriteLockOptions(params.config)
		});
		return await truncateOversizedToolResultsInTranscriptState({
			state: await readTranscriptFileState(sessionFile),
			contextWindowTokens,
			maxCharsOverride: params.maxCharsOverride,
			aggregateMaxCharsOverride: params.aggregateMaxCharsOverride,
			sessionFile,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		});
	} catch (err) {
		const errMsg = formatErrorMessage(err);
		log.warn(`[tool-result-truncation] Failed to truncate: ${errMsg}`);
		return {
			truncated: false,
			truncatedCount: 0,
			reason: errMsg
		};
	} finally {
		await sessionLock?.release();
	}
}
function sessionLikelyHasOversizedToolResults(params) {
	const estimate = estimateToolResultReductionPotential(params);
	return estimate.oversizedCount > 0 || estimate.aggregateReducibleChars > 0;
}
//#endregion
export { resolveAutoLiveToolResultMaxChars as a, truncateOversizedToolResultsInMessages as c, truncateToolResultMessage as d, formatContextLimitTruncationNotice as f, estimateToolResultReductionPotential as i, truncateOversizedToolResultsInSession as l, calculateMaxToolResultCharsWithCap as n, resolveLiveToolResultMaxChars as o, createToolResultPromptProjectionState as r, sessionLikelyHasOversizedToolResults as s, DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS as t, truncateOversizedToolResultsInSessionManager as u };
