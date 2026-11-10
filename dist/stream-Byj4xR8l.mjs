import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { m as resolveOpenAIRequestReasoning } from "./llm-YCnSGJtn.mjs";
import { A as setQwenChatTemplateThinking, o as composeProviderStreamWrappers, p as createPayloadPatchStreamWrapper } from "./provider-stream-shared-Ond8mlRx.mjs";
import "./provider-model-metadata-DkObn07R.mjs";
import { t as wrapVllmPriorityStream } from "./priority-bhAt3R_E.mjs";
import { i as resolveVllmQwenThinkingFormatFromCompat, r as resolveVllmEffortProfile, t as isVllmNemotronThinkingModel } from "./thinking-policy-C8CEl-sL.mjs";
//#region extensions/vllm/stream.ts
function isCompletionsModel(model) {
	return model.api === "openai-completions";
}
function isVllmDeepSeekV4Model(modelId) {
	return /deepseek[-_]?v4(?:[-_](?:pro|flash))?\b/i.test(modelId);
}
function normalizeVllmResolvedModel({ model }) {
	if (model.api !== "openai-completions" || !model.reasoning || !resolveVllmQwenThinkingFormatFromCompat(model.compat)) return;
	const profile = resolveVllmEffortProfile(model);
	if (!profile) return;
	const thinkingLevelMap = { ...model.thinkingLevelMap };
	for (const { id } of profile.levels) {
		if (id === "off" || id === "adaptive" || id === "ultra") continue;
		const { effort } = resolveOpenAIRequestReasoning(model, id);
		if (effort !== void 0) thinkingLevelMap[id] = effort;
	}
	return {
		...model,
		thinkingLevelMap
	};
}
function setChatTemplateDefaults(payload, defaults) {
	const existing = payload.chat_template_kwargs;
	payload.chat_template_kwargs = existing && typeof existing === "object" && !Array.isArray(existing) ? {
		...defaults,
		...existing
	} : defaults;
}
function createVllmQwenThinkingWrapper(params) {
	return createPayloadPatchStreamWrapper(params.baseStreamFn, ({ payload: payloadObj, model, options }) => {
		if (!isCompletionsModel(model) || !(model.reasoning ?? true)) return;
		const reasoning = resolveOpenAIRequestReasoning({
			...model,
			reasoning: model.reasoning ?? true
		}, options?.reasoning ?? params.thinkingLevel);
		const enableThinking = reasoning.thinkingEnabled ?? true;
		const effort = enableThinking && resolveVllmEffortProfile(model) ? reasoning.effort : void 0;
		delete payloadObj.reasoning_effort;
		if (params.format === "chat-template") {
			const kwargs = setQwenChatTemplateThinking(payloadObj, enableThinking);
			if (effort !== void 0) kwargs.reasoning_effort = effort;
		} else {
			payloadObj.enable_thinking = enableThinking;
			if (effort !== void 0) payloadObj.reasoning_effort = effort;
		}
		delete payloadObj.reasoningEffort;
		delete payloadObj.reasoning;
	});
}
function wrapVllmProviderStream(ctx) {
	if (normalizeProviderId(ctx.provider) !== "vllm" || ctx.model && ctx.model.api !== "openai-completions") return;
	const qwenFormat = resolveVllmQwenThinkingFormatFromCompat(ctx.model?.compat);
	const deepSeek = !qwenFormat && isVllmDeepSeekV4Model(ctx.modelId);
	if (!qwenFormat && !deepSeek && !isVllmNemotronThinkingModel(ctx.modelId)) return wrapVllmPriorityStream(ctx);
	return composeProviderStreamWrappers(wrapVllmPriorityStream(ctx), qwenFormat && ((streamFn) => createVllmQwenThinkingWrapper({
		baseStreamFn: streamFn,
		format: qwenFormat,
		thinkingLevel: ctx.thinkingLevel
	})), (streamFn) => createPayloadPatchStreamWrapper(streamFn, ({ payload, model, options }) => {
		if (!isCompletionsModel(model) || normalizeProviderId(model.provider) !== "vllm") return;
		const level = options?.reasoning ?? ctx.thinkingLevel;
		if (model.reasoning && isVllmDeepSeekV4Model(model.id) && !resolveVllmQwenThinkingFormatFromCompat(model.compat)) {
			const reasoning = resolveOpenAIRequestReasoning(model, level);
			const enabled = reasoning.thinkingEnabled ?? true;
			setChatTemplateDefaults(payload, {
				thinking: enabled,
				enable_thinking: enabled,
				...enabled && reasoning.effort ? { reasoning_effort: reasoning.effort } : {}
			});
			delete payload.thinking;
			delete payload.reasoning_effort;
			delete payload.reasoning;
		} else if (level === "off" && isVllmNemotronThinkingModel(model.id)) setChatTemplateDefaults(payload, {
			enable_thinking: false,
			force_nonempty_content: true
		});
	}));
}
//#endregion
export { normalizeVllmResolvedModel as n, wrapVllmProviderStream as r, createVllmQwenThinkingWrapper as t };
