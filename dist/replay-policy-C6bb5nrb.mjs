import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { s as buildStrictAnthropicReplayPolicy } from "./provider-replay-helpers-Da6bKlcZ.mjs";
import "./provider-model-shared-CgZ78XZA.mjs";
//#region extensions/github-copilot/replay-policy.ts
const OMITTED_COPILOT_REASONING_TEXT = "[assistant reasoning omitted]";
function isThinkingBlock(value) {
	const type = asOptionalObjectRecord(value)?.type;
	return type === "thinking" || type === "redacted_thinking";
}
function stripCopilotAssistantThinkingMessages(messages) {
	let touched = false;
	const sanitized = messages.map((message) => {
		const record = asOptionalObjectRecord(message);
		if (record?.role !== "assistant" || !Array.isArray(record.content)) return message;
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
	if (ctx.modelApi !== "anthropic-messages") return;
	return buildStrictAnthropicReplayPolicy({
		dropThinkingBlocks: true,
		sanitizeToolCallIds: false
	});
}
function sanitizeGithubCopilotReplayHistory(ctx) {
	return ctx.modelApi === "openai-responses" || ctx.modelApi === "anthropic-messages" ? stripCopilotAssistantThinkingMessages(ctx.messages) : ctx.messages;
}
//#endregion
export { sanitizeGithubCopilotReplayHistory as n, stripCopilotAssistantThinkingMessages as r, buildGithubCopilotReplayPolicy as t };
