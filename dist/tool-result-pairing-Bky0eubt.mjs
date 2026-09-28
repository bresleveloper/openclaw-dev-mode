import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region packages/agent-core/src/harness/session/tool-result-pairing.ts
const TOOL_CALL_TYPES = /* @__PURE__ */ new Set([
	"toolCall",
	"toolUse",
	"functionCall"
]);
const SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY = "openclawSyntheticMissingToolResult";
const DEFAULT_MISSING_TOOL_RESULT_TEXT = "[openclaw] missing tool result in session history; inserted synthetic error result for transcript repair.";
/** Tracks repeated provider ids by occurrence instead of collapsing them into a set. */
function createToolCallOccurrenceQueue() {
	const pendingById = /* @__PURE__ */ new Map();
	let pendingCount = 0;
	return {
		add(id, occurrence) {
			const pending = pendingById.get(id);
			if (pending) pending.push(occurrence);
			else pendingById.set(id, [occurrence]);
			pendingCount += 1;
		},
		claim(id) {
			const pending = pendingById.get(id);
			const occurrence = pending?.shift();
			if (!occurrence) return;
			pendingCount -= 1;
			if (pending?.length === 0) pendingById.delete(id);
			return occurrence;
		},
		clear() {
			pendingById.clear();
			pendingCount = 0;
		},
		get size() {
			return pendingCount;
		}
	};
}
function readToolCall(block) {
	if (!block || typeof block !== "object") return;
	const record = block;
	if (typeof record.type !== "string" || !TOOL_CALL_TYPES.has(record.type) || typeof record.id !== "string" || !record.id) return;
	return {
		id: record.id,
		name: typeof record.name === "string" ? record.name : void 0
	};
}
function extractToolCallsFromAssistant(message) {
	return Array.isArray(message.content) ? message.content.flatMap((block) => readToolCall(block) ?? []) : [];
}
function extractToolResultIds(message) {
	const record = message;
	const ids = [];
	for (const value of [
		record.toolCallId,
		record.toolUseId,
		record.tool_call_id,
		record.tool_use_id,
		record.callId,
		record.call_id
	]) {
		if (typeof value !== "string") continue;
		const id = value.trim();
		if (id && !ids.includes(id)) ids.push(id);
	}
	return ids;
}
function extractToolResultId(message) {
	return extractToolResultIds(message)[0] ?? null;
}
function makeMissingToolResult(params) {
	return {
		role: "toolResult",
		toolCallId: params.toolCallId,
		toolName: params.toolName ?? "unknown",
		content: [{
			type: "text",
			text: params.text ?? "[openclaw] missing tool result in session history; inserted synthetic error result for transcript repair."
		}],
		details: {
			[SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY]: true,
			reason: "missing_tool_result"
		},
		isError: true,
		timestamp: Date.now()
	};
}
function isSyntheticMissingToolResult(message) {
	if (!message.isError) return false;
	const details = message.details;
	if (details && typeof details === "object" && details["openclawSyntheticMissingToolResult"] === true) return true;
	const content = message.content;
	return Array.isArray(content) && content.some((block) => typeof block === "object" && block !== null && block.type === "text" && block.text === "[openclaw] missing tool result in session history; inserted synthetic error result for transcript repair.");
}
function normalizeToolResultName(message, fallbackName) {
	const rawToolName = message.toolName;
	const normalizedToolName = normalizeOptionalString(rawToolName);
	if (normalizedToolName) return rawToolName === normalizedToolName ? message : {
		...message,
		toolName: normalizedToolName
	};
	const normalizedFallback = normalizeOptionalString(fallbackName);
	if (normalizedFallback) return {
		...message,
		toolName: normalizedFallback
	};
	return typeof rawToolName === "string" ? {
		...message,
		toolName: "unknown"
	} : message;
}
function normalizeLegacyToolResultId(message, toolCalls) {
	if (extractToolResultId(message) || toolCalls.length !== 1) return message;
	const toolCall = toolCalls[0];
	if (!toolCall) return message;
	const resultName = normalizeOptionalString(message.toolName);
	const callName = normalizeOptionalString(toolCall.name);
	if (resultName && callName && resultName !== callName) return message;
	return {
		...message,
		toolCallId: toolCall.id,
		isError: true
	};
}
/** Classifies call/result ownership without reordering or synthesizing transcript messages. */
function classifyToolUseResultPairing(messages, options) {
	const frameStartIndexes = messages.flatMap((message, index) => message?.role === "assistant" && extractToolCallsFromAssistant(message).length > 0 ? [index] : []);
	let droppedDuplicateCount = 0;
	let droppedOrphanCount = 0;
	const droppedResults = [];
	const preserveUnframed = options?.preserveUnframedToolResults === true;
	const frameRecords = frameStartIndexes.map((startIndex, frameIndex) => {
		const assistant = messages[startIndex];
		const toolCalls = [];
		const occurrences = [];
		const pending = createToolCallOccurrenceQueue();
		const syntheticById = /* @__PURE__ */ new Map();
		for (const [contentIndex, block] of assistant.content.entries()) {
			const toolCall = readToolCall(block);
			if (!toolCall) continue;
			toolCalls.push(toolCall);
			const occurrence = {
				...toolCall,
				contentIndex
			};
			occurrences.push(occurrence);
			pending.add(toolCall.id, occurrence);
		}
		const endIndex = frameStartIndexes[frameIndex + 1] ?? messages.length;
		const remainder = [];
		const unclaimedResults = [];
		for (let index = startIndex + 1; index < endIndex; index += 1) {
			const message = messages[index];
			if (!message || typeof message !== "object") continue;
			if (message.role !== "toolResult") {
				remainder.push(message);
				continue;
			}
			const normalized = normalizeLegacyToolResultId(message, toolCalls);
			const id = extractToolResultId(normalized);
			const occurrence = id ? pending.claim(id) : void 0;
			if (occurrence) {
				occurrence.result = normalizeToolResultName(normalized, occurrence.name);
				occurrence.sourceResult = message;
				occurrence.sourceResultIndex = index;
				if (isSyntheticMissingToolResult(occurrence.result)) {
					const synthetic = syntheticById.get(occurrence.id);
					if (synthetic) synthetic.push(occurrence);
					else syntheticById.set(occurrence.id, [occurrence]);
				}
				continue;
			}
			if (!id || !occurrences.some((candidate) => candidate.id === id)) {
				unclaimedResults.push({
					result: normalized,
					sourceResult: message,
					index,
					id: id ?? void 0
				});
				if (preserveUnframed) remainder.push(normalized);
				continue;
			}
			droppedDuplicateCount += 1;
			if (!isSyntheticMissingToolResult(normalized)) {
				const replaceable = syntheticById.get(id)?.shift();
				if (replaceable) {
					const discardedSource = replaceable.sourceResult;
					if (discardedSource) droppedResults.push({
						message: discardedSource,
						index: replaceable.sourceResultIndex ?? index
					});
					replaceable.result = normalizeToolResultName(normalized, replaceable.name);
					replaceable.sourceResult = message;
					replaceable.sourceResultIndex = index;
				} else droppedResults.push({
					message,
					index
				});
			} else droppedResults.push({
				message,
				index
			});
		}
		const stopReason = assistant.stopReason;
		return {
			startIndex,
			endIndex,
			assistant,
			remainder,
			unclaimedResults,
			occurrences,
			failed: stopReason === "error" || stopReason === "aborted"
		};
	});
	const unresolvedById = /* @__PURE__ */ new Map();
	for (const frame of frameRecords) {
		for (const occurrence of frame.occurrences) if (!occurrence.result || isSyntheticMissingToolResult(occurrence.result)) {
			const unresolved = unresolvedById.get(occurrence.id);
			if (unresolved) unresolved.push(occurrence);
			else unresolvedById.set(occurrence.id, [occurrence]);
		}
		for (const record of frame.unclaimedResults) {
			const candidates = record.id ? (unresolvedById.get(record.id) ?? []).filter((candidate) => !candidate.result || isSyntheticMissingToolResult(candidate.result) && !isSyntheticMissingToolResult(record.result)) : [];
			if (candidates.length !== 1) {
				droppedOrphanCount += preserveUnframed ? 0 : 1;
				if (!preserveUnframed) droppedResults.push({
					message: record.sourceResult,
					index: record.index
				});
				continue;
			}
			const candidate = candidates[0];
			if (!candidate) continue;
			droppedDuplicateCount += candidate.result ? 1 : 0;
			if (candidate.result && isSyntheticMissingToolResult(candidate.result)) {
				const discardedSource = candidate.sourceResult;
				if (discardedSource) droppedResults.push({
					message: discardedSource,
					index: candidate.sourceResultIndex ?? record.index
				});
			}
			candidate.result = normalizeToolResultName(record.result, candidate.name);
			candidate.sourceResult = record.sourceResult;
			candidate.sourceResultIndex = record.index;
			if (preserveUnframed) frame.remainder = frame.remainder.filter((message) => message !== record.result);
		}
	}
	return {
		frames: frameRecords,
		droppedDuplicateCount,
		droppedOrphanCount,
		droppedResults
	};
}
/** Select actual completed occurrences, never unmatched calls or synthesized missing results. */
function collectCompletedToolCallBlocks(messages) {
	const completed = /* @__PURE__ */ new Set();
	for (const frame of classifyToolUseResultPairing(messages).frames) for (const occurrence of frame.occurrences) if (occurrence.sourceResult && !isSyntheticMissingToolResult(occurrence.sourceResult)) {
		const block = frame.assistant.content[occurrence.contentIndex];
		if (block && typeof block === "object") completed.add(block);
	}
	return completed;
}
/** Select reset-tail model context without changing persisted entry bytes or order. */
function selectResetKeptEntries(entries) {
	const pairing = classifyToolUseResultPairing(entries.flatMap((entry) => entry.type === "message" ? [entry.message] : []));
	const pairedResults = new Set(pairing.frames.flatMap((frame) => frame.occurrences.flatMap((occurrence) => occurrence.sourceResult ? [occurrence.sourceResult] : [])));
	return entries.filter((entry) => entry.type === "message" && (entry.message.role === "user" || entry.message.role === "assistant" || entry.message.role === "toolResult" && pairedResults.has(entry.message)));
}
//#endregion
export { createToolCallOccurrenceQueue as a, extractToolResultIds as c, normalizeLegacyToolResultId as d, selectResetKeptEntries as f, collectCompletedToolCallBlocks as i, isSyntheticMissingToolResult as l, SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY as n, extractToolCallsFromAssistant as o, classifyToolUseResultPairing as r, extractToolResultId as s, DEFAULT_MISSING_TOOL_RESULT_TEXT as t, makeMissingToolResult as u };
