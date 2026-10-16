import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { c as extractToolResultIds, d as normalizeLegacyToolResultId, o as extractToolCallsFromAssistant, r as classifyToolUseResultPairing, u as makeMissingToolResult } from "./tool-result-pairing-DxxMHOQj.mjs";
import { n as isContractToolCallBlock, t as collectToolCallIds } from "./tool-block-contract-CgqnHcSD.mjs";
import { i as isThinkingLikeBlock, t as hasToolCallInput } from "./tool-call-id-CutFFA5a.mjs";
import { n as isAllowedToolCallName, r as normalizeAllowedToolNames, t as createCompletedToolCallPredicate } from "./tool-call-shared-Dr7Cjipm.mjs";
import { replaceCompactionReplayOwnerContent } from "@openclaw/ai/transports";
//#region src/agents/session-transcript-repair.ts
function hasPartialJson(block) {
	return typeof block.partialJson === "string";
}
function isFinalizedOpenAIResponsesToolCall(message, block) {
	if (message.role !== "assistant" || !("stopReason" in message) || message.stopReason !== "toolUse" || !hasPartialJson(block) || typeof block.id !== "string" || "input" in block || !block.arguments || typeof block.arguments !== "object" || Array.isArray(block.arguments) || safeParseJsonRecord(block.partialJson) === void 0 && (block.partialJson.trim() !== "" || Object.keys(block.arguments).length > 0)) return false;
	const separator = block.id.indexOf("|");
	return separator > 0 && separator < block.id.length - 1;
}
function sanitizeToolCallBlock(block) {
	const rawName = readStringValue(block.name);
	const name = rawName?.trim();
	return name && name !== rawName ? {
		...block,
		name
	} : block;
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
function sanitizeToolCallInputs(messages, options) {
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
		if (allowProviderOwnedThinkingReplay && msg.content.some((block) => isThinkingLikeBlock(block)) && msg.content.some(isContractToolCallBlock)) {
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
			} else changed = true;
			continue;
		}
		const nextContent = [];
		let messageChanged = false;
		for (const block of msg.content) {
			if (!isContractToolCallBlock(block)) {
				nextContent.push(block);
				continue;
			}
			if (!hasToolCallInput(block) || collectToolCallIds(block).length === 0 || !isAllowedToolCallName(block.name, isCompleted(block) ? null : allowedToolNames)) {
				messageChanged = true;
				continue;
			}
			let workBlock = block;
			if (hasPartialJson(block)) {
				if (!isFinalizedOpenAIResponsesToolCall(msg, block)) {
					messageChanged = true;
					continue;
				}
				const stripped = { ...block };
				delete stripped.partialJson;
				workBlock = stripped;
				messageChanged = true;
			}
			const sanitized = sanitizeToolCallBlock(workBlock);
			messageChanged ||= sanitized !== workBlock;
			nextContent.push(sanitized);
		}
		changed ||= messageChanged;
		if (messageChanged && nextContent.length === 0) continue;
		const nextMessage = messageChanged ? replaceCompactionReplayOwnerContent(msg, nextContent) : msg;
		for (const toolCall of extractToolCallsFromAssistant(nextMessage)) priorToolCallIds.add(toolCall.id);
		out.push(nextMessage);
	}
	return changed ? out : messages;
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
		if (!(frame.failed && options?.erroredAssistantResultPolicy === "drop")) {
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
export { sanitizeToolUseResultPairingForModel as i, sanitizeToolCallInputs as n, sanitizeToolUseResultPairing as r, repairToolUseResultPairing as t };
