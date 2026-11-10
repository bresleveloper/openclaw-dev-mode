import { d as sanitizeOpenAIReasoningSignature } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { a as projectWorkerAssistantContent, r as projectWorkerProviderReplay, s as projectWorkerTokenUsage } from "./transcript-message-CWBx4ChQ.mjs";
//#region src/gateway/worker-environments/inference-terminal-message.ts
const ERROR_MESSAGES = {
	"model-not-approved": "Model is not approved for this agent.",
	"invalid-context": "Inference context is invalid.",
	"epoch-mismatch": "Worker run epoch does not match.",
	"session-not-attached": "Worker session is not attached.",
	"provider-error": "Model provider request failed.",
	cancelled: "Inference request was cancelled."
};
function inferenceError(reason, usage, message = ERROR_MESSAGES[reason], retryAfterMs) {
	return {
		type: "error",
		reason,
		message,
		...usage ? { usage: structuredClone(usage) } : {},
		...retryAfterMs === void 0 ? {} : { retryAfterMs }
	};
}
function projectWorkerInferenceTerminalMessage(params) {
	const usage = params.message.usage;
	const projected = {
		role: "assistant",
		content: params.message.content.map((part) => {
			if (part.type !== "text" && part.type !== "thinking" && part.type !== "toolCall") throw new Error("Unsupported assistant terminal content");
			const content = projectWorkerAssistantContent(part);
			if (content.type === "thinking" && content.thinkingSignature) content.thinkingSignature = sanitizeOpenAIReasoningSignature(content.thinkingSignature, params.modelIdentity) ?? content.thinkingSignature;
			return content;
		}),
		api: params.modelIdentity.api,
		provider: params.modelIdentity.provider,
		model: params.modelIdentity.model,
		...params.message.responseModel ? { responseModel: params.message.responseModel } : {},
		...params.message.responseId ? { responseId: params.message.responseId } : {},
		usage: {
			...projectWorkerTokenUsage(usage),
			...usage.contextUsage?.state === "available" ? { contextUsage: {
				state: usage.contextUsage.state,
				promptTokens: usage.contextUsage.promptTokens,
				totalTokens: usage.contextUsage.totalTokens
			} } : usage.contextUsage?.state === "unavailable" ? { contextUsage: { state: usage.contextUsage.state } } : {}
		},
		stopReason: params.stopReason,
		timestamp: params.message.timestamp
	};
	return projectWorkerProviderReplay({
		message: projected,
		providerReplay: params.message.providerReplay,
		purpose: "transcript"
	});
}
//#endregion
export { inferenceError as n, projectWorkerInferenceTerminalMessage as r, ERROR_MESSAGES as t };
