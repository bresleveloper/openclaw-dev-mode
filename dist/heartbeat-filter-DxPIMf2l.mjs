import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as MESSAGE_TOOL_DELIVERY_HINTS } from "./message-tool-delivery-hints-8OSBEg_c.mjs";
import "./strip-inbound-meta-Cqak81y4.mjs";
import { n as SILENT_REPLY_TOKEN, t as HEARTBEAT_TOKEN } from "./tokens-BTKQYTUd.mjs";
import { a as readToolCallName, n as isContractToolCallBlock, r as isContractToolResultBlock, t as collectToolCallIds } from "./tool-block-contract-CJH3ADzt.mjs";
import { a as INTERNAL_WAKE_TRANSCRIPT_PROMPTS, i as HEARTBEAT_RESPONSE_TOOL_PROMPT, l as resolveHeartbeatPromptForResponseTool, o as isHeartbeatAcknowledgementText, r as HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS } from "./heartbeat-vWflpIwS.mjs";
import { t as HEARTBEAT_RESPONSE_TOOL_NAME } from "./heartbeat-tool-response-C3vGkDX4.mjs";
//#region src/auto-reply/heartbeat-filter.ts
const HEARTBEAT_TASK_PROMPT_PREFIX = "Run the following periodic tasks (only those due based on their intervals):";
const HEARTBEAT_TASK_PROMPT_COMPLETIONS = [
	...[HEARTBEAT_TOKEN, SILENT_REPLY_TOKEN].map((token) => `After completing all due tasks, reply ${token}.`),
	HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS,
	`After completing all due tasks, use ${HEARTBEAT_RESPONSE_TOOL_NAME}`
];
function collectToolCallBlocks(content) {
	if (!Array.isArray(content)) return [];
	return content.filter(isContractToolCallBlock);
}
function collectToolResultBlocks(content) {
	if (!Array.isArray(content)) return [];
	return content.filter(isContractToolResultBlock);
}
function readNestedToolCallArguments(record) {
	const value = record.function;
	if (!isRecord(value)) return;
	return value.arguments ?? value.args ?? value.input;
}
function readToolCallArguments(block) {
	return block.arguments ?? block.args ?? block.input ?? readNestedToolCallArguments(block);
}
function parseToolCallArguments(value) {
	if (isRecord(value)) return value;
	if (typeof value !== "string" || !value.trim()) return;
	try {
		const parsed = JSON.parse(value);
		return isRecord(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
function isVisibleHeartbeatResponseToolCall(block) {
	const args = parseToolCallArguments(readToolCallArguments(block));
	if (!args) return false;
	return args.notify === true || args.notify === "true";
}
function collectVisibleHeartbeatResponseToolCalls(message) {
	if (message.role !== "assistant") return [];
	return [...collectMessageToolCalls(message), ...collectToolCallBlocks(message.content)].filter((block) => readToolCallName(block) === "heartbeat_respond" && isVisibleHeartbeatResponseToolCall(block));
}
function collectMessageToolCalls(message) {
	const toolCalls = message.tool_calls;
	if (!Array.isArray(toolCalls)) return [];
	return toolCalls.filter((call) => isRecord(call));
}
function hasAssistantToolCall(message) {
	return message.role === "assistant" && (collectMessageToolCalls(message).length > 0 || collectToolCallBlocks(message.content).length > 0);
}
function isRemovableHeartbeatResponseToolCall(message) {
	if (message.role !== "assistant") return false;
	for (const call of collectMessageToolCalls(message)) if (readToolCallName(call) === "heartbeat_respond" && !isVisibleHeartbeatResponseToolCall(call)) return true;
	return collectToolCallBlocks(message.content).some((block) => readToolCallName(block) === "heartbeat_respond" && !isVisibleHeartbeatResponseToolCall(block));
}
function hasVisibleHeartbeatResponseToolCall(message) {
	return collectVisibleHeartbeatResponseToolCalls(message).length > 0;
}
function isEmbeddedToolResultOnlyContent(content) {
	return Array.isArray(content) && content.length > 0 && content.every((block) => isContractToolResultBlock(block));
}
function isToolResultMessage(message) {
	return message.role === "toolResult" || message.role === "tool" || message.role === "user" && isEmbeddedToolResultOnlyContent(message.content);
}
function isFailedToolResultRecord(record) {
	return record.isError === true || record.is_error === true || normalizeOptionalString(record.type) === "tool_result_error";
}
function hasSuccessfulToolResultMessage(message) {
	const resultBlocks = collectToolResultBlocks(message.content);
	if (resultBlocks.length > 0) return resultBlocks.some((block) => !isFailedToolResultRecord(block));
	if (!isToolResultMessage(message)) return false;
	return !isFailedToolResultRecord(message);
}
function collectSuccessfulToolResultCallIds(message) {
	const record = message;
	const resultBlocks = collectToolResultBlocks(message.content);
	const ids = [];
	if (resultBlocks.length === 0) {
		if (!isFailedToolResultRecord(record)) ids.push(...[
			normalizeOptionalString(record.toolCallId),
			normalizeOptionalString(record.tool_call_id),
			normalizeOptionalString(record.toolUseId),
			normalizeOptionalString(record.tool_use_id),
			normalizeOptionalString(record.call_id),
			normalizeOptionalString(record.id)
		].filter((id) => Boolean(id)));
	} else for (const block of resultBlocks) {
		if (isFailedToolResultRecord(block)) continue;
		ids.push(...collectToolCallIds(block));
	}
	return [...new Set(ids)];
}
function isRealNonHeartbeatUserMessage(message, heartbeatPrompt) {
	return message.role === "user" && !isEmbeddedToolResultOnlyContent(message.content) && !isHeartbeatUserMessage(message, heartbeatPrompt);
}
function matchesHeartbeatPromptText(text, prompt) {
	const normalized = prompt?.trim();
	return Boolean(normalized) && (text === normalized || text.startsWith(`${normalized}\n`));
}
function resolveMessageText(content) {
	if (typeof content === "string") return {
		text: content,
		hasNonTextContent: false
	};
	if (!Array.isArray(content)) return {
		text: "",
		hasNonTextContent: content != null
	};
	let hasNonTextContent = false;
	let text = "";
	for (const block of content) {
		if (typeof block !== "object" || block === null || !("type" in block)) {
			hasNonTextContent = true;
			continue;
		}
		if (block.type === "thinking" || block.type === "reasoning" || block.type === "redacted_thinking") continue;
		if (block.type !== "text" && block.type !== "input_text" && block.type !== "output_text") {
			hasNonTextContent = true;
			continue;
		}
		const blockText = block.text;
		if (typeof blockText !== "string") {
			hasNonTextContent = true;
			continue;
		}
		text += blockText;
	}
	return {
		text,
		hasNonTextContent
	};
}
/** Return whether a user message is an internal heartbeat prompt. */
function isHeartbeatUserMessage(message, heartbeatPrompt) {
	if (message.role !== "user") return false;
	const { text } = resolveMessageText(message.content);
	const trimmed = text.trim();
	if (!trimmed) return false;
	const normalizedHeartbeatPrompt = heartbeatPrompt?.trim();
	const transcriptPrompts = Object.values(INTERNAL_WAKE_TRANSCRIPT_PROMPTS);
	if (transcriptPrompts.some((prompt) => trimmed === prompt)) return true;
	if (MESSAGE_TOOL_DELIVERY_HINTS.some((prefix) => trimmed.startsWith(prefix)) && transcriptPrompts.some((prompt) => trimmed.endsWith(prompt))) return true;
	if (matchesHeartbeatPromptText(trimmed, normalizedHeartbeatPrompt)) return true;
	if (matchesHeartbeatPromptText(trimmed, HEARTBEAT_RESPONSE_TOOL_PROMPT)) return true;
	if (normalizedHeartbeatPrompt && matchesHeartbeatPromptText(trimmed, resolveHeartbeatPromptForResponseTool(normalizedHeartbeatPrompt))) return true;
	return trimmed.startsWith(HEARTBEAT_TASK_PROMPT_PREFIX) && HEARTBEAT_TASK_PROMPT_COMPLETIONS.some((completion) => trimmed.includes(completion));
}
/** Return whether an assistant message is only a heartbeat acknowledgement. */
function isHeartbeatOkResponse(message, ackMaxChars) {
	if (message.role !== "assistant") return false;
	if (hasAssistantToolCall(message)) return false;
	const { text, hasNonTextContent } = resolveMessageText(message.content);
	if (hasNonTextContent) return false;
	return isHeartbeatAcknowledgementText(text, ackMaxChars);
}
function advancePastAdjacentToolResults(messages, startIndex) {
	let index = startIndex;
	while (index < messages.length) {
		const message = messages.at(index);
		if (!message || !isToolResultMessage(message)) break;
		index++;
	}
	return index;
}
function isToolResultCompletionCandidate(message) {
	return isToolResultMessage(message) || collectToolResultBlocks(message.content).length > 0;
}
function hasCompletedVisibleHeartbeatResponseToolCall(messages, index) {
	const message = messages.at(index);
	if (!message) return false;
	const visibleCalls = collectVisibleHeartbeatResponseToolCalls(message);
	if (visibleCalls.length === 0) return false;
	const callIds = new Set(visibleCalls.flatMap((call) => collectToolCallIds(call)));
	for (let resultIndex = index + 1; resultIndex < messages.length; resultIndex++) {
		const result = expectDefined(messages[resultIndex], "messages entry at resultIndex");
		if (!isToolResultCompletionCandidate(result)) break;
		if (!hasSuccessfulToolResultMessage(result)) continue;
		if (callIds.size === 0) return true;
		for (const resultId of collectSuccessfulToolResultCallIds(result)) if (callIds.has(resultId)) return true;
	}
	return false;
}
function resolveHeartbeatArtifactSpanEnd(messages, startIndex, ackMaxChars, heartbeatPrompt) {
	let index = startIndex + 1;
	let sawTerminalHeartbeatArtifact = false;
	let sawNonTerminalAssistantOutput = false;
	while (index < messages.length) {
		const message = messages.at(index);
		if (!message) break;
		if (isRealNonHeartbeatUserMessage(message, heartbeatPrompt)) break;
		if (isHeartbeatUserMessage(message, heartbeatPrompt)) break;
		if (isHeartbeatOkResponse(message, ackMaxChars)) {
			sawTerminalHeartbeatArtifact = true;
			index = advancePastAdjacentToolResults(messages, index + 1);
			continue;
		}
		if (hasVisibleHeartbeatResponseToolCall(message)) {
			if (hasCompletedVisibleHeartbeatResponseToolCall(messages, index)) return;
			index++;
			continue;
		}
		if (isRemovableHeartbeatResponseToolCall(message)) {
			sawTerminalHeartbeatArtifact = true;
			index = advancePastAdjacentToolResults(messages, index + 1);
			continue;
		}
		if (sawTerminalHeartbeatArtifact) {
			index++;
			continue;
		}
		if (isToolResultMessage(message) || hasAssistantToolCall(message)) {
			index++;
			continue;
		}
		if (message.role === "assistant") {
			sawNonTerminalAssistantOutput = true;
			index++;
			continue;
		}
		return;
	}
	if (sawNonTerminalAssistantOutput && !sawTerminalHeartbeatArtifact) return;
	return index;
}
/** Remove heartbeat-only prompt, ack, and silent tool artifacts from a transcript. */
function filterHeartbeatTranscriptArtifacts(messages, ackMaxChars, heartbeatPrompt) {
	if (messages.length === 0) return messages;
	const result = [];
	let i = 0;
	while (i < messages.length) {
		if (!isHeartbeatUserMessage(expectDefined(messages[i], "messages entry at i"), heartbeatPrompt)) {
			result.push(expectDefined(messages[i], "messages entry at i"));
			i++;
			continue;
		}
		const next = resolveHeartbeatArtifactSpanEnd(messages, i, ackMaxChars, heartbeatPrompt);
		if (next === void 0) {
			result.push(expectDefined(messages[i], "messages entry at i"));
			i++;
			continue;
		}
		i = next;
	}
	return result;
}
//#endregion
export { isHeartbeatOkResponse as n, isHeartbeatUserMessage as r, filterHeartbeatTranscriptArtifacts as t };
