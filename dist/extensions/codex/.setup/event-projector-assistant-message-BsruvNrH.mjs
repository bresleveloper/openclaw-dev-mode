import { g as codexProviderRefusalDetails } from "./event-projector-items-C6L_5ZiT.mjs";
import { t as resolveCodexLocalRuntimeAttribution } from "./local-runtime-attribution-B_2mnqhb.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/event-projector-assistant-message.ts
const ZERO_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	totalTokens: 0,
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		total: 0
	}
};
function createAssistantMessage(params, text, options) {
	return createAttributedCodexAssistantMessage({
		...resolveCodexLocalRuntimeAttribution(params),
		modelId: params.modelId
	}, text, options);
}
/** Creates a Codex assistant row when a bounded call already owns attribution. */
function createAttributedCodexAssistantMessage(attribution, text, options) {
	const usage = options.tokenUsage ? {
		input: options.tokenUsage.input ?? 0,
		output: options.tokenUsage.output ?? 0,
		cacheRead: options.tokenUsage.cacheRead ?? 0,
		cacheWrite: options.tokenUsage.cacheWrite ?? 0,
		...options.tokenUsage.reasoningTokens !== void 0 ? { reasoningTokens: options.tokenUsage.reasoningTokens } : {},
		...options.tokenUsage.contextUsage ? { contextUsage: options.tokenUsage.contextUsage } : {},
		totalTokens: options.tokenUsage.total ?? (options.tokenUsage.input ?? 0) + (options.tokenUsage.output ?? 0) + (options.tokenUsage.cacheRead ?? 0) + (options.tokenUsage.cacheWrite ?? 0),
		cost: ZERO_USAGE.cost
	} : ZERO_USAGE;
	const refusal = options.providerRefusal;
	return {
		role: "assistant",
		content: [{
			type: "text",
			text
		}],
		api: attribution.api ?? "openai-chatgpt-responses",
		provider: attribution.provider,
		model: attribution.modelId,
		usage,
		stopReason: options.aborted ? "aborted" : options.promptError || refusal ? "error" : "stop",
		errorMessage: refusal?.message ?? (options.promptError ? formatErrorMessage(options.promptError) : void 0),
		...refusal ? { diagnostics: [{
			type: "provider_refusal",
			timestamp: Date.now(),
			details: codexProviderRefusalDetails(refusal)
		}] } : {},
		timestamp: Date.now()
	};
}
function createAssistantCommentaryMessage(params, text, itemId, timestamp) {
	return {
		...createNonterminalAssistantMessage(params, [{
			type: "text",
			text
		}], timestamp),
		openclawStreamFallback: {
			replacementText: text,
			source: "segment",
			itemId
		}
	};
}
function createAssistantAsyncMessage(params, text, itemId, timestamp, questions) {
	return {
		...createNonterminalAssistantMessage(params, [{
			type: "text",
			text
		}], timestamp),
		openclawAsyncDelivery: {
			itemId,
			...questions ? { questions } : {}
		}
	};
}
function createAssistantReasoningMessage(params, text) {
	return createNonterminalAssistantMessage(params, [{
		type: "thinking",
		thinking: text
	}]);
}
function createNonterminalAssistantMessage(params, content, timestamp) {
	const attribution = resolveCodexLocalRuntimeAttribution(params);
	return {
		role: "assistant",
		content,
		api: attribution.api ?? "openai-chatgpt-responses",
		provider: attribution.provider,
		model: params.modelId,
		usage: ZERO_USAGE,
		stopReason: "stop",
		timestamp: timestamp ?? Date.now()
	};
}
//#endregion
export { createAttributedCodexAssistantMessage as a, createAssistantReasoningMessage as i, createAssistantCommentaryMessage as n, createAssistantMessage as r, createAssistantAsyncMessage as t };
