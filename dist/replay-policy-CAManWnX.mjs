import { s as buildStrictAnthropicReplayPolicy } from "./provider-replay-helpers-CXnvOz8t.mjs";
import "./provider-model-shared-DwrT_ZjA.mjs";
//#region extensions/github-copilot/replay-policy.ts
const OMITTED_COPILOT_REASONING_TEXT = "[assistant reasoning omitted]";
function isCopilotAnthropicTransport(modelApi) {
	return modelApi === "anthropic-messages";
}
function isThinkingBlock(value) {
	if (!value || typeof value !== "object") return false;
	const type = value.type;
	return type === "thinking" || type === "redacted_thinking";
}
function stripCopilotAssistantThinkingMessages(messages) {
	let touched = false;
	const sanitized = messages.map((message) => {
		if (!message || typeof message !== "object") return message;
		const record = message;
		if (record.role !== "assistant" || !Array.isArray(record.content)) return message;
		const content = record.content.filter((block) => !isThinkingBlock(block));
		if (content.length === record.content.length) return message;
		touched = true;
		return {
			...message,
			content: content.length > 0 ? content : [{
				type: "text",
				text: OMITTED_COPILOT_REASONING_TEXT
			}]
		};
	});
	return touched ? sanitized : messages;
}
function buildGithubCopilotReplayPolicy(ctx) {
	if (!isCopilotAnthropicTransport(ctx.modelApi)) return;
	return buildStrictAnthropicReplayPolicy({
		dropThinkingBlocks: true,
		sanitizeToolCallIds: false
	});
}
function sanitizeGithubCopilotReplayHistory(ctx) {
	return ctx.modelApi === "openai-responses" || isCopilotAnthropicTransport(ctx.modelApi) ? stripCopilotAssistantThinkingMessages(ctx.messages) : ctx.messages;
}
//#endregion
export { sanitizeGithubCopilotReplayHistory as n, stripCopilotAssistantThinkingMessages as r, buildGithubCopilotReplayPolicy as t };
