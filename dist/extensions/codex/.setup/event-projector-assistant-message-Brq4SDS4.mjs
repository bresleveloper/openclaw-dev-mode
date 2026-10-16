import { t as codexProviderRefusalDiagnostics } from "./event-projector-values-DTqZHizf.mjs";
import { o as resolveCodexLocalRuntimeAttribution } from "./native-subagent-monitor-BXClJlaW.mjs";
import { createAgentHarnessAssistantMessage } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
//#region extensions/codex/src/app-server/event-projector-assistant-message.ts
function createAssistantMessage(params, text, options) {
	return createAttributedCodexAssistantMessage({
		...resolveCodexLocalRuntimeAttribution(params),
		modelId: params.modelId
	}, text, options);
}
/** Creates a Codex assistant row when a bounded call already owns attribution. */
function createAttributedCodexAssistantMessage(attribution, text, options) {
	const refusal = options.providerRefusal;
	return createAgentHarnessAssistantMessage({
		...attribution,
		api: attribution.api ?? "openai-chatgpt-responses"
	}, text, {
		tokenUsage: options.tokenUsage,
		aborted: options.aborted,
		promptError: options.promptError,
		errorMessage: refusal?.message,
		...refusal ? codexProviderRefusalDiagnostics(refusal, Date.now()) : {}
	});
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
	return createAgentHarnessAssistantMessage({
		...attribution,
		api: attribution.api ?? "openai-chatgpt-responses",
		modelId: params.modelId
	}, "", {
		content,
		aborted: false,
		timestamp
	});
}
//#endregion
export { createAttributedCodexAssistantMessage as a, createAssistantReasoningMessage as i, createAssistantCommentaryMessage as n, createAssistantMessage as r, createAssistantAsyncMessage as t };
