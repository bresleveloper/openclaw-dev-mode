import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as composeProviderStreamWrappers, b as isOpenAICompatibleThinkingEnabled, f as createPayloadPatchStreamWrapper, k as setQwenChatTemplateThinking } from "./provider-stream-shared-D8q3R1a-.mjs";
import "./provider-model-metadata-fSBArSt7.mjs";
import { r as resolveVllmQwenThinkingFormatFromCompat, t as isVllmNemotronThinkingModel } from "./thinking-policy-CGihQkAh.mjs";
//#region extensions/vllm/stream.ts
function isVllmNemotronModel(model) {
	return model.api === "openai-completions" && typeof model.provider === "string" && normalizeProviderId(model.provider) === "vllm" && typeof model.id === "string" && isVllmNemotronThinkingModel(model.id);
}
function setNemotronThinkingOffChatTemplateKwargs(payload) {
	const defaults = {
		enable_thinking: false,
		force_nonempty_content: true
	};
	const existing = payload.chat_template_kwargs;
	payload.chat_template_kwargs = existing && typeof existing === "object" && !Array.isArray(existing) ? {
		...defaults,
		...existing
	} : defaults;
}
function createVllmQwenThinkingWrapper(params) {
	return createPayloadPatchStreamWrapper(params.baseStreamFn, ({ payload: payloadObj, options }) => {
		const enableThinking = isOpenAICompatibleThinkingEnabled({
			thinkingLevel: params.thinkingLevel,
			options
		});
		if (params.format === "chat-template") setQwenChatTemplateThinking(payloadObj, enableThinking);
		else payloadObj.enable_thinking = enableThinking;
		delete payloadObj.reasoning_effort;
		delete payloadObj.reasoningEffort;
		delete payloadObj.reasoning;
	}, { shouldPatch: ({ model }) => model.api === "openai-completions" && (model.reasoning ?? true) });
}
function wrapVllmProviderStream(ctx) {
	if (normalizeProviderId(ctx.provider) !== "vllm" || ctx.model && ctx.model.api !== "openai-completions") return;
	const qwenFormat = resolveVllmQwenThinkingFormatFromCompat(ctx.model?.compat);
	const shouldHandleNemotron = ctx.thinkingLevel === "off" && isVllmNemotronThinkingModel(ctx.modelId);
	if (!qwenFormat && !shouldHandleNemotron) return;
	return composeProviderStreamWrappers(ctx.streamFn, qwenFormat && ((streamFn) => createVllmQwenThinkingWrapper({
		baseStreamFn: streamFn,
		format: qwenFormat,
		thinkingLevel: ctx.thinkingLevel
	})), (streamFn) => createPayloadPatchStreamWrapper(streamFn, ({ payload }) => setNemotronThinkingOffChatTemplateKwargs(payload), { shouldPatch: ({ model }) => ctx.thinkingLevel === "off" && isVllmNemotronModel(model) }));
}
//#endregion
export { wrapVllmProviderStream as n, createVllmQwenThinkingWrapper as t };
