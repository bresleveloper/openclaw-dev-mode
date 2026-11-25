import { t as codexProviderRefusalDiagnostics } from "./event-projector-values-BxTVI6kj.mjs";
import { t as resolveCodexLocalRuntimeAttribution } from "./local-runtime-attribution-yAS2KyDP.mjs";
import { AgentHarnessModelRequestPolicyError, formatErrorMessage } from "openclaw/plugin-sdk/agent-harness-runtime";
import { createAgentHarnessAssistantMessage } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
// extensions/codex/src/app-server/event-projector-assistant-message.ts
/** Apply final failure enrichment before transcript hooks consume this turn's rows. */
function applyCodexAssistantTerminalOutcome(message, aborted, promptError) {
	if (message?.role !== "assistant") return;
	if (message.diagnostics?.some((diagnostic) => diagnostic.type === "provider_refusal") && !aborted && !promptError) return;
	message.stopReason = aborted ? "aborted" : promptError ? "error" : "stop";
	if (promptError instanceof AgentHarnessModelRequestPolicyError) message.errorCode = promptError.code;
	else if (message.errorCode === "model_request_policy_denied") delete message.errorCode;
	message.errorMessage = promptError ? formatErrorMessage(promptError) : void 0;
}
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
function createAssistantAsyncDelivery(params, text, itemId, timestamp, questions) {
	if (!text?.trim() || timestamp === void 0) return;
	return {
		itemId,
		message: {
			...createNonterminalAssistantMessage(params, [{
				type: "text",
				text
			}], timestamp),
			openclawAsyncDelivery: {
				itemId,
				...questions ? { questions } : {}
			}
		},
		text
	};
}
function createAssistantReasoningMessage(params, text, timestamp) {
	return createNonterminalAssistantMessage(params, [{
		type: "thinking",
		thinking: text
	}], timestamp);
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
export { createAssistantReasoningMessage as a, createAssistantMessage as i, createAssistantAsyncDelivery as n, createAttributedCodexAssistantMessage as o, createAssistantCommentaryMessage as r, applyCodexAssistantTerminalOutcome as t };
