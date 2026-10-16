import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { n as HEARTBEAT_TOKEN, r as SILENT_REPLY_TOKEN } from "./tokens-D4ghQG_g.mjs";
import { a as readToolCallName, n as isContractToolCallBlock, r as isContractToolResultBlock, t as collectToolCallIds } from "./tool-block-contract-CgqnHcSD.mjs";
import { a as INTERNAL_WAKE_TRANSCRIPT_PROMPTS, i as HEARTBEAT_RESPONSE_TOOL_PROMPT, l as resolveHeartbeatPromptForResponseTool, o as isHeartbeatAcknowledgementText, r as HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS } from "./heartbeat-BjLIgeQc.mjs";
import { n as MESSAGE_TOOL_DELIVERY_HINTS } from "./message-tool-delivery-hints-8OSBEg_c.mjs";
import "./delivery-hints-v8S7vGqh.mjs";
import { t as HEARTBEAT_RESPONSE_TOOL_NAME } from "./heartbeat-tool-response-BAjLTEaX.mjs";
//#region src/auto-reply/heartbeat-filter.ts
const HEARTBEAT_TASK_PROMPT_PREFIX = "Run the following periodic tasks (only those due based on their intervals):";
const HEARTBEAT_TASK_PROMPT_COMPLETIONS = [
	...[HEARTBEAT_TOKEN, SILENT_REPLY_TOKEN].map((token) => `After completing all due tasks, reply ${token}.`),
	HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS,
	`After completing all due tasks, use ${HEARTBEAT_RESPONSE_TOOL_NAME}`
];
function collectToolResultBlocks(content) {
	if (!Array.isArray(content)) return [];
	return content.filter(isContractToolResultBlock);
}
function isVisibleHeartbeatResponseToolCall(block) {
	const nested = isRecord(block.function) ? block.function : void 0;
	const value = block.arguments ?? block.args ?? block.input ?? nested?.arguments ?? nested?.args ?? nested?.input;
	const args = isRecord(value) ? value : typeof value === "string" ? safeParseJsonRecord(value) : void 0;
	return args?.notify === true || args?.notify === "true";
}
function collectAssistantToolCalls(message) {
	if (message.role !== "assistant") return [];
	const toolCalls = message.tool_calls;
	return [...Array.isArray(toolCalls) ? toolCalls.filter(isRecord) : [], ...Array.isArray(message.content) ? message.content.filter(isContractToolCallBlock) : []];
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
	if (matchesHeartbeatPromptText(trimmed, normalizedHeartbeatPrompt) || matchesHeartbeatPromptText(trimmed, HEARTBEAT_RESPONSE_TOOL_PROMPT) || normalizedHeartbeatPrompt && matchesHeartbeatPromptText(trimmed, resolveHeartbeatPromptForResponseTool(normalizedHeartbeatPrompt))) return true;
	return trimmed.startsWith(HEARTBEAT_TASK_PROMPT_PREFIX) && HEARTBEAT_TASK_PROMPT_COMPLETIONS.some((completion) => trimmed.includes(completion));
}
/** Return whether an assistant message is only a heartbeat acknowledgement. */
function isHeartbeatOkResponse(message, ackMaxChars) {
	if (message.role !== "assistant" || collectAssistantToolCalls(message).length > 0) return false;
	const { text, hasNonTextContent } = resolveMessageText(message.content);
	return !hasNonTextContent && isHeartbeatAcknowledgementText(text, ackMaxChars);
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
function hasCompletedVisibleHeartbeatResponseToolCall(messages, index, visibleCalls) {
	const callIds = new Set(visibleCalls.flatMap((call) => collectToolCallIds(call)));
	for (let resultIndex = index + 1; resultIndex < messages.length; resultIndex++) {
		const result = expectDefined(messages[resultIndex], "messages entry at resultIndex");
		const blocks = collectToolResultBlocks(result.content);
		if (blocks.length === 0 && !isToolResultMessage(result)) break;
		if ((blocks.length > 0 ? blocks : [result]).some((record) => !isFailedToolResultRecord(record) && (callIds.size === 0 || collectToolCallIds(record).some((id) => callIds.has(id))))) return true;
	}
	return false;
}
function resolveHeartbeatArtifactSpanEnd(messages, startIndex, ackMaxChars) {
	let index = startIndex + 1;
	let sawTerminalHeartbeatArtifact = false;
	let sawNonTerminalAssistantOutput = false;
	while (index < messages.length) {
		const message = messages.at(index);
		if (!message) break;
		if (message.role === "user" && !isEmbeddedToolResultOnlyContent(message.content)) break;
		if (isHeartbeatOkResponse(message, ackMaxChars)) {
			sawTerminalHeartbeatArtifact = true;
			index = advancePastAdjacentToolResults(messages, index + 1);
			continue;
		}
		const toolCalls = collectAssistantToolCalls(message);
		const heartbeatCalls = toolCalls.filter((block) => readToolCallName(block) === HEARTBEAT_RESPONSE_TOOL_NAME);
		const visibleCalls = heartbeatCalls.filter(isVisibleHeartbeatResponseToolCall);
		if (visibleCalls.length > 0) {
			if (hasCompletedVisibleHeartbeatResponseToolCall(messages, index, visibleCalls)) return;
			index++;
			continue;
		}
		if (heartbeatCalls.length > 0) {
			sawTerminalHeartbeatArtifact = true;
			index = advancePastAdjacentToolResults(messages, index + 1);
			continue;
		}
		if (sawTerminalHeartbeatArtifact || isToolResultMessage(message) || toolCalls.length > 0) {
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
		const message = expectDefined(messages[i], "messages entry at i");
		const next = isHeartbeatUserMessage(message, heartbeatPrompt) ? resolveHeartbeatArtifactSpanEnd(messages, i, ackMaxChars) : void 0;
		if (next === void 0) {
			result.push(message);
			i++;
		} else i = next;
	}
	return result;
}
//#endregion
export { isHeartbeatOkResponse as n, isHeartbeatUserMessage as r, filterHeartbeatTranscriptArtifacts as t };
