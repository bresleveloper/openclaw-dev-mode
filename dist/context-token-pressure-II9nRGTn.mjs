import { n as estimateStringChars } from "./cjk-chars-D02XG87t.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as stripToolResultDetails } from "./model-context-message-CFPsc6fp.mjs";
import { a as bashExecutionToText, i as COMPACTION_SUMMARY_SUFFIX, n as BRANCH_SUMMARY_SUFFIX, r as COMPACTION_SUMMARY_PREFIX, t as BRANCH_SUMMARY_PREFIX } from "./messages-Cdi_z_94.mjs";
import { a as IMAGE_BLOCK_TOKENS, u as estimateTokens } from "./agent-core-BbGXCiXw.mjs";
import { _ as stripRuntimeContextCustomMessages } from "./internal-runtime-context-DLJtDQoI.mjs";
import "./session-transcript-repair-BTNxtQ4j.mjs";
//#region src/agents/compaction-planning.ts
/** Buffer for estimateTokens() inaccuracy. */
const SAFETY_MARGIN = 1.2;
/** Removes runtime-only context and tool-result details before token estimates or summaries. */
function sanitizeCompactionMessages(messages) {
	return stripToolResultDetails(stripRuntimeContextCustomMessages(messages));
}
function estimateMessagesTokens(messages) {
	return sanitizeCompactionMessages(messages).reduce((sum, message) => sum + estimateTokens(message), 0);
}
const TOOL_RESULT_CHARS_PER_TOKEN = 2;
const JSON_PAYLOAD_CHARS_PER_TOKEN = 3;
const MESSAGE_BOUNDARY_OVERHEAD_TOKENS = 12;
const CONTENT_BLOCK_OVERHEAD_TOKENS = 6;
function estimateStringTokenPressure(text, charsPerToken = 4, mode = "general") {
	const estimatedTokens = Math.ceil(estimateStringChars(text) / charsPerToken);
	return mode === "tool-result" ? Math.max(Math.ceil(text.length / TOOL_RESULT_CHARS_PER_TOKEN), estimatedTokens) : estimatedTokens;
}
function estimateJsonPayloadTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN, mode = "general") {
	try {
		const serialized = JSON.stringify(value);
		return typeof serialized === "string" ? estimateStringTokenPressure(serialized, charsPerToken, mode) : 1;
	} catch {
		return 256;
	}
}
/** Count model-facing definitions; runtime output schemas and metadata never reach the provider. */
function estimateToolSchemaTokens(tools) {
	return tools?.length ? estimateJsonPayloadTokenPressure(tools.map(({ name, description, parameters }) => ({
		name,
		description,
		parameters
	}))) : 0;
}
function estimateIdentifierTokenPressure(value) {
	if (value == null) return 0;
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return estimateStringTokenPressure(String(value), JSON_PAYLOAD_CHARS_PER_TOKEN);
	return estimateJsonPayloadTokenPressure(value);
}
function estimateContentBlockTokenPressure(block, mode = "general") {
	if (typeof block === "string") return estimateStringTokenPressure(block, 4, mode);
	if (!isRecord(block)) return estimateJsonPayloadTokenPressure(block, 4, mode);
	const type = block.type;
	const text = type === "text" ? block.text : type === "thinking" ? block.thinking : void 0;
	if (typeof text === "string") return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateStringTokenPressure(text, 4, mode);
	if (type === "image") return IMAGE_BLOCK_TOKENS;
	return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateJsonPayloadTokenPressure(block, 4, mode);
}
function estimateAssistantToolCallTokenPressure(block) {
	const args = block.arguments ?? block.input ?? block.args ?? {};
	return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateIdentifierTokenPressure(block.name) + estimateJsonPayloadTokenPressure(args, JSON_PAYLOAD_CHARS_PER_TOKEN);
}
function estimateContentTokenPressure(content, mode = "general") {
	if (typeof content === "string") return estimateStringTokenPressure(content, 4, mode);
	if (Array.isArray(content)) return content.reduce((sum, block) => sum + estimateContentBlockTokenPressure(block, mode), 0);
	if (content !== void 0) return estimateJsonPayloadTokenPressure(content, mode === "tool-result" ? 4 : JSON_PAYLOAD_CHARS_PER_TOKEN, mode);
	return 0;
}
function estimateMessageTokenPressure(message) {
	if ("excludeFromContext" in message && message.excludeFromContext === true) return 0;
	const legacy = isRecord(message) ? message : {};
	let tokens = MESSAGE_BOUNDARY_OVERHEAD_TOKENS;
	if (message.role === "toolResult" || legacy.role === "tool" || legacy.type === "toolResult") {
		const content = message.role === "toolResult" ? message.content : legacy.content;
		const toolName = message.role === "toolResult" ? message.toolName : legacy.toolName;
		tokens += estimateContentTokenPressure(content, "tool-result");
		tokens += estimateIdentifierTokenPressure(toolName ?? legacy.tool_name);
		return tokens;
	}
	if (message.role === "bashExecution") {
		tokens += estimateStringTokenPressure(bashExecutionToText(message));
		return tokens;
	}
	if (message.role === "branchSummary" || message.role === "compactionSummary") {
		const [prefix, suffix] = message.role === "branchSummary" ? [BRANCH_SUMMARY_PREFIX, BRANCH_SUMMARY_SUFFIX] : [COMPACTION_SUMMARY_PREFIX, COMPACTION_SUMMARY_SUFFIX];
		return tokens + estimateStringTokenPressure(prefix + message.summary + suffix);
	}
	if (message.role === "assistant") {
		if (Array.isArray(message.content)) for (const block of message.content) {
			if (isRecord(block)) {
				const blockType = block.type;
				if (blockType === "toolCall" || blockType === "tool_use") {
					tokens += estimateAssistantToolCallTokenPressure(block);
					continue;
				}
			}
			tokens += estimateContentBlockTokenPressure(block);
		}
		else tokens += estimateContentTokenPressure(message.content);
		const toolCalls = legacy.toolCalls ?? legacy.tool_calls;
		if (Array.isArray(toolCalls)) for (const toolCall of toolCalls) tokens += isRecord(toolCall) ? estimateAssistantToolCallTokenPressure(toolCall) : estimateJsonPayloadTokenPressure(toolCall);
		return tokens;
	}
	tokens += estimateContentTokenPressure(legacy.content);
	return tokens;
}
function estimateRenderedPromptTokens(params) {
	return (typeof params.systemPrompt === "string" && params.systemPrompt.trim().length > 0 ? MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.systemPrompt) : 0) + MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.prompt);
}
/** Prepare fixed request costs before estimating its pending input or replacement history. */
function createFreshLlmBoundaryTokenEstimator(params) {
	const toolTokens = estimateToolSchemaTokens(params.tools);
	const fixedPromptTokens = estimateRenderedPromptTokens({
		systemPrompt: params.systemPrompt,
		prompt: ""
	});
	return (request) => Math.ceil((fixedPromptTokens + estimateStringTokenPressure(request.prompt) + toolTokens + (request.imageCount ?? 0) * IMAGE_BLOCK_TOKENS + request.messages.reduce((total, message) => total + estimateMessageTokenPressure(message), 0)) * SAFETY_MARGIN);
}
//#endregion
export { estimateStringTokenPressure as a, estimateMessagesTokens as c, estimateRenderedPromptTokens as i, sanitizeCompactionMessages as l, estimateJsonPayloadTokenPressure as n, estimateToolSchemaTokens as o, estimateMessageTokenPressure as r, SAFETY_MARGIN as s, createFreshLlmBoundaryTokenEstimator as t };
