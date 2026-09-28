import "./src-CZ2wJvNB.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { g as readStringValue } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeLegacyToolResultId, r as classifyToolUseResultPairing, u as makeMissingToolResult$1 } from "./tool-result-pairing-Bky0eubt.mjs";
import { n as isContractToolCallBlock, t as collectToolCallIds } from "./tool-block-contract-CJH3ADzt.mjs";
import { i as hasToolCallInput, r as extractToolResultIds, s as isThinkingLikeBlock, t as extractToolCallsFromAssistant } from "./tool-call-id-Dp16BALg.mjs";
import { n as isAllowedToolCallName, r as normalizeAllowedToolNames, t as createCompletedToolCallPredicate } from "./tool-call-shared-B1OM3EZi.mjs";
import { replaceCompactionReplayOwnerContent } from "@openclaw/ai/transports";
//#region src/agents/session-transcript-repair.ts
/**
* Transcript repair helpers for tool-call replay.
*
* Normalizes raw tool-call blocks and synthesizes missing tool results without rewriting trusted local payloads.
*/
function hasToolCallId(block) {
	return collectToolCallIds(block).length > 0;
}
function hasPartialJson(block) {
	return typeof block.partialJson === "string";
}
function isCompleteJsonObject(value) {
	return safeParseJsonRecord(value) !== void 0;
}
function isFinalizedOpenAIResponsesToolCall(message, block) {
	if (message.role !== "assistant" || !("stopReason" in message) || message.stopReason !== "toolUse" || !hasPartialJson(block) || typeof block.id !== "string" || "input" in block || !block.arguments || typeof block.arguments !== "object" || Array.isArray(block.arguments) || !isCompleteJsonObject(block.partialJson) && (block.partialJson.trim() !== "" || Object.keys(block.arguments).length > 0)) return false;
	const separator = block.id.indexOf("|");
	return separator > 0 && separator < block.id.length - 1;
}
function sanitizeToolCallBlock(block) {
	const rawName = readStringValue(block.name);
	const trimmedName = rawName?.trim();
	const hasTrimmedName = typeof trimmedName === "string" && trimmedName.length > 0;
	const normalizedName = hasTrimmedName ? trimmedName : void 0;
	const nameChanged = hasTrimmedName && rawName !== trimmedName;
	if (!nameChanged) return block;
	const next = { ...block };
	if (nameChanged && normalizedName) next.name = normalizedName;
	return next;
}
function countRawToolCallBlocks(content) {
	let count = 0;
	for (const block of content) if (isContractToolCallBlock(block)) count += 1;
	return count;
}
function isReplaySafeThinkingAssistantTurn(content, allowedToolNames, isCompleted) {
	let sawToolCall = false;
	const seenToolCallIds = /* @__PURE__ */ new Set();
	for (const block of content) {
		if (!isContractToolCallBlock(block)) continue;
		sawToolCall = true;
		const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
		if (!hasToolCallInput(block) || hasPartialJson(block) || !toolCallId || seenToolCallIds.has(toolCallId) || !isAllowedToolCallName(block.name, isCompleted(block) ? null : allowedToolNames)) return false;
		seenToolCallIds.add(toolCallId);
		if (sanitizeToolCallBlock(block) !== block) return false;
	}
	return sawToolCall;
}
function hasSessionsSpawnAttachmentToolCall(content) {
	for (const block of content) {
		if (!isContractToolCallBlock(block) || block.name !== "sessions_spawn") continue;
		const input = block.input;
		if (!input || typeof input !== "object") continue;
		const attachments = input.attachments;
		if (Array.isArray(attachments) && attachments.length > 0) return true;
	}
	return false;
}
function makeMissingToolResult(params) {
	return makeMissingToolResult$1(params);
}
function collectFollowingToolResults(messages, index) {
	const ids = /* @__PURE__ */ new Set();
	const assistant = messages[index];
	const currentToolCalls = assistant && typeof assistant === "object" && assistant.role === "assistant" ? extractToolCallsFromAssistant(assistant) : [];
	let sawNonToolResult = false;
	let displaced = false;
	for (let nextIndex = index + 1; nextIndex < messages.length; nextIndex += 1) {
		const message = messages[nextIndex];
		if (!message || typeof message !== "object") {
			sawNonToolResult = true;
			continue;
		}
		if (message.role === "assistant" && extractToolCallsFromAssistant(message).length > 0) break;
		if (message.role === "toolResult") {
			const normalizedLegacyResult = normalizeLegacyToolResultId(message, currentToolCalls);
			const resultIds = extractToolResultIds(normalizedLegacyResult);
			for (const id of resultIds) ids.add(id);
			displaced ||= resultIds.length > 0 && sawNonToolResult;
			continue;
		}
		sawNonToolResult = true;
	}
	return {
		ids,
		displaced
	};
}
function repairToolCallInputs(messages, options) {
	let droppedToolCalls = 0;
	let droppedAssistantMessages = 0;
	let changed = false;
	const out = [];
	const allowedToolNames = normalizeAllowedToolNames(options?.allowedToolNames);
	const isCompleted = createCompletedToolCallPredicate(messages);
	const allowProviderOwnedThinkingReplay = options?.allowProviderOwnedThinkingReplay === true;
	const preservedThinkingToolCallIds = /* @__PURE__ */ new Set();
	const priorToolCallIds = /* @__PURE__ */ new Set();
	for (const [index, msg] of messages.entries()) {
		if (!msg || typeof msg !== "object") {
			changed = true;
			continue;
		}
		if (msg.role !== "assistant" || !Array.isArray(msg.content)) {
			out.push(msg);
			continue;
		}
		if (allowProviderOwnedThinkingReplay && msg.content.some((block) => isThinkingLikeBlock(block)) && countRawToolCallBlocks(msg.content) > 0) {
			const replaySafeToolCalls = extractToolCallsFromAssistant(msg);
			const followingToolResults = collectFollowingToolResults(messages, index);
			const hasSpawnAttachments = hasSessionsSpawnAttachmentToolCall(msg.content);
			if (isReplaySafeThinkingAssistantTurn(msg.content, allowedToolNames, isCompleted) && replaySafeToolCalls.every((toolCall) => !preservedThinkingToolCallIds.has(toolCall.id) && (!hasSpawnAttachments || followingToolResults.ids.has(toolCall.id)) && (!followingToolResults.displaced || !priorToolCallIds.has(toolCall.id)))) {
				for (const toolCall of replaySafeToolCalls) {
					preservedThinkingToolCallIds.add(toolCall.id);
					priorToolCallIds.add(toolCall.id);
				}
				changed ||= followingToolResults.displaced;
				out.push(msg);
			} else {
				droppedToolCalls += countRawToolCallBlocks(msg.content);
				droppedAssistantMessages += 1;
				changed = true;
			}
			continue;
		}
		const nextContent = [];
		let messageChanged = false;
		for (const block of msg.content) {
			if (isContractToolCallBlock(block)) {
				const rawBlock = block;
				if (!hasToolCallInput(block) || !hasToolCallId(block) || !isAllowedToolCallName(rawBlock.name, isCompleted(rawBlock) ? null : allowedToolNames)) {
					droppedToolCalls += 1;
					changed = true;
					messageChanged = true;
					continue;
				}
			}
			let workBlock = block;
			if (isContractToolCallBlock(block) && hasPartialJson(block)) {
				if (!isFinalizedOpenAIResponsesToolCall(msg, block)) {
					droppedToolCalls += 1;
					changed = true;
					messageChanged = true;
					continue;
				}
				const stripped = { ...block };
				delete stripped.partialJson;
				workBlock = stripped;
				changed = true;
				messageChanged = true;
			}
			if (isContractToolCallBlock(workBlock)) {
				const sanitized = sanitizeToolCallBlock(workBlock);
				if (sanitized !== workBlock) {
					changed = true;
					messageChanged = true;
				}
				nextContent.push(sanitized);
				continue;
			}
			nextContent.push(workBlock);
		}
		if (messageChanged) {
			if (nextContent.length === 0) {
				droppedAssistantMessages += 1;
				continue;
			}
			const nextMessage = replaceCompactionReplayOwnerContent(msg, nextContent);
			for (const toolCall of extractToolCallsFromAssistant(nextMessage)) priorToolCallIds.add(toolCall.id);
			out.push(nextMessage);
			continue;
		}
		for (const toolCall of extractToolCallsFromAssistant(msg)) priorToolCallIds.add(toolCall.id);
		out.push(msg);
	}
	return {
		messages: changed ? out : messages,
		droppedToolCalls,
		droppedAssistantMessages
	};
}
function sanitizeToolCallInputs(messages, options) {
	return repairToolCallInputs(messages, options).messages;
}
function sanitizeToolUseResultPairing(messages, options) {
	return repairToolUseResultPairing(messages, options).messages;
}
function sanitizeToolUseResultPairingForModel(messages, isOpenAIResponsesApi) {
	return sanitizeToolUseResultPairing(messages, {
		erroredAssistantResultPolicy: "drop",
		...isOpenAIResponsesApi ? { missingToolResultText: "aborted" } : {}
	});
}
function shouldDropErroredAssistantResults(options) {
	return options?.erroredAssistantResultPolicy === "drop";
}
function repairToolUseResultPairing(messages, options) {
	const added = [];
	const preserveUnframed = options?.preserveUnframedToolResults === true;
	const pairing = classifyToolUseResultPairing(messages, { preserveUnframedToolResults: preserveUnframed });
	const { frames } = pairing;
	const droppedDuplicateCount = pairing.droppedDuplicateCount;
	let droppedOrphanCount = pairing.droppedOrphanCount;
	const discarded = pairing.droppedResults.map(({ message, index }) => ({
		message,
		index
	}));
	const out = [];
	let cursor = 0;
	const pushUnframedRange = (endIndex) => {
		for (; cursor < endIndex; cursor += 1) {
			const sourceIndex = cursor;
			const message = messages[cursor];
			if (!message || typeof message !== "object") continue;
			if (message.role === "toolResult" && !preserveUnframed) {
				droppedOrphanCount += 1;
				discarded.push({
					message,
					index: sourceIndex
				});
				continue;
			}
			out.push(message);
		}
	};
	for (const frame of frames) {
		pushUnframedRange(frame.startIndex);
		cursor = frame.endIndex;
		if (!(frame.failed && shouldDropErroredAssistantResults(options))) {
			out.push(frame.assistant);
			for (const occurrence of frame.occurrences) {
				if (occurrence.result) {
					out.push(occurrence.result);
					continue;
				}
				if (frame.failed) continue;
				const missing = makeMissingToolResult({
					toolCallId: occurrence.id,
					toolName: occurrence.name,
					text: options?.missingToolResultText
				});
				occurrence.result = missing;
				added.push(missing);
				out.push(missing);
			}
		} else for (const occurrence of frame.occurrences) if (occurrence.sourceResult) discarded.push({
			message: occurrence.sourceResult,
			index: occurrence.sourceResultIndex ?? messages.indexOf(occurrence.sourceResult)
		});
		out.push(...frame.remainder);
	}
	pushUnframedRange(messages.length);
	const changed = out.length !== messages.length || out.some((message, index) => message !== messages[index]);
	discarded.sort((left, right) => left.index - right.index);
	return {
		messages: changed ? out : messages,
		added,
		discarded: discarded.map(({ message }) => message),
		droppedDuplicateCount,
		droppedOrphanCount,
		moved: changed
	};
}
//#endregion
export { sanitizeToolUseResultPairingForModel as a, sanitizeToolUseResultPairing as i, repairToolUseResultPairing as n, sanitizeToolCallInputs as r, makeMissingToolResult as t };
