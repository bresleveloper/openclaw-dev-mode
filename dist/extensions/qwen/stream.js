import { H as isQwenTokenPlanGlmModelId, K as supportsQwenTokenPlanGlmMaxThinking, R as isQwen38ModelId, U as isQwenTokenPlanKimiModelId, V as isQwenTokenPlanDeepSeekV4ModelId, W as isQwenTokenPlanThinkingOnlyModelId, k as QWEN_TOKEN_PLAN_PROVIDER_ID } from "./.setup/models-BHyvoc6Y.mjs";
import { asOptionalObjectRecord, asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { streamSimple } from "openclaw/plugin-sdk/llm";
import { normalizeProviderId, resolveProviderEndpoint } from "openclaw/plugin-sdk/provider-model-shared";
import { createPayloadPatchStreamWrapper, isOpenAICompatibleThinkingEnabled, normalizeOpenAICompatibleReasoningReplay, setQwenChatTemplateThinking, wrapProviderPayloadHook } from "openclaw/plugin-sdk/provider-stream-shared";
// extensions/qwen/stream.ts
function resolveQwenThinkingLevel(thinkingLevel, options) {
	const runtimeOptions = options ?? {};
	return normalizeQwenThinkingLevel(runtimeOptions.reasoningEffort ?? runtimeOptions.reasoning ?? thinkingLevel, thinkingLevel);
}
function normalizeQwenThinkingLevel(raw, fallback) {
	if (typeof raw !== "string") return fallback;
	const normalized = raw.trim().toLowerCase();
	if (normalized === "none") return "off";
	switch (normalized) {
		case "off":
		case "minimal":
		case "low":
		case "medium":
		case "high":
		case "xhigh":
		case "max": return normalized;
		default: return fallback;
	}
}
function isQwenProviderId(providerId) {
	const normalized = normalizeProviderId(providerId);
	return normalized === "qwen" || normalized === "qwen-token-plan" || normalized === "bailian-token-plan" || normalized === "modelstudio" || normalized === "qwencloud" || normalized === "dashscope";
}
function isQwenTokenPlanProviderId(providerId) {
	const normalized = normalizeProviderId(providerId);
	return normalized === "qwen-token-plan" || normalized === "bailian-token-plan";
}
function resolveQwenStreamProviderId(ctx) {
	if (isQwenProviderId(ctx.provider)) return ctx.provider;
	const endpoint = resolveProviderEndpoint(ctx.model?.baseUrl);
	if (endpoint.endpointClass !== "modelstudio-native") return;
	return endpoint.hostname === new URL("https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1").hostname || endpoint.hostname === new URL("https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1").hostname ? QWEN_TOKEN_PLAN_PROVIDER_ID : "qwen";
}
function resolveQwenThinkingContract(providerId, modelId) {
	if (isQwen38ModelId(modelId)) return { family: "qwen-3.8" };
	if (!isQwenTokenPlanProviderId(providerId)) return;
	if (isQwenTokenPlanDeepSeekV4ModelId(modelId)) return { family: "deepseek-v4" };
	if (isQwenTokenPlanKimiModelId(modelId)) return { family: "kimi" };
	if (isQwenTokenPlanGlmModelId(modelId)) return {
		family: "glm",
		supportsMax: supportsQwenTokenPlanGlmMaxThinking(modelId)
	};
}
function patchQwen38Payload(payload, thinkingLevel, enableThinking) {
	delete payload.thinking;
	if (!enableThinking || payload.thinking_budget !== void 0) {
		delete payload.reasoning_effort;
		return;
	}
	payload.reasoning_effort = thinkingLevel === "minimal" || thinkingLevel === "low" ? "low" : thinkingLevel === "medium" ? "medium" : "xhigh";
}
function patchTokenPlanDeepSeekV4Payload(payload, thinkingLevel, enableThinking) {
	delete payload.thinking;
	if (!enableThinking) delete payload.reasoning_effort;
	else payload.reasoning_effort = thinkingLevel === "xhigh" || thinkingLevel === "max" ? "max" : "high";
	normalizeOpenAICompatibleReasoningReplay(payload, { thinkingEnabled: enableThinking });
}
function patchTokenPlanKimiPayload(payload, enableThinking) {
	delete payload.thinking;
	delete payload.reasoning_effort;
	if (enableThinking) normalizeOpenAICompatibleReasoningReplay(payload, {
		thinkingEnabled: true,
		shouldBackfillAssistantMessage: (message) => Array.isArray(message.tool_calls) && message.tool_calls.length > 0
	});
}
function patchTokenPlanGlmPayload(payload, thinkingLevel, enableThinking, supportsMax) {
	delete payload.thinking;
	if (!enableThinking) {
		delete payload.reasoning_effort;
		return;
	}
	switch (thinkingLevel) {
		case "minimal":
		case "low":
		case "medium":
		case "high":
		case "xhigh":
			payload.reasoning_effort = thinkingLevel;
			return;
		case "max":
			payload.reasoning_effort = supportsMax ? "max" : "xhigh";
			return;
		default: delete payload.reasoning_effort;
	}
}
function readQwenThinkingFormatFromModel(model, sourceApi) {
	if ((sourceApi ?? model.api) !== "openai-completions") return;
	const compat = asOptionalObjectRecord(model.compat);
	return typeof compat?.thinkingFormat === "string" ? compat.thinkingFormat : void 0;
}
function createQwenThinkingPayloadPatch(thinkingLevel, thinkingFormat, forceThinking, tokenPlanContract, sourceApi) {
	return ({ payload: payloadObj, model, options }) => {
		const effectiveThinkingLevel = resolveQwenThinkingLevel(thinkingLevel, options);
		const enableThinking = forceThinking || isOpenAICompatibleThinkingEnabled({
			thinkingLevel,
			options
		});
		const effectiveThinkingFormat = thinkingFormat ?? readQwenThinkingFormatFromModel(model, sourceApi);
		if (effectiveThinkingFormat === "qwen-chat-template") {
			setQwenChatTemplateThinking(payloadObj, enableThinking);
			delete payloadObj.enable_thinking;
		} else payloadObj.enable_thinking = enableThinking;
		if (isQwen38ModelId(model.id) && effectiveThinkingFormat === void 0) patchQwen38Payload(payloadObj, effectiveThinkingLevel, enableThinking);
		else if (tokenPlanContract?.family === "deepseek-v4") patchTokenPlanDeepSeekV4Payload(payloadObj, effectiveThinkingLevel, enableThinking);
		else if (tokenPlanContract?.family === "kimi") patchTokenPlanKimiPayload(payloadObj, false);
		else if (tokenPlanContract?.family === "glm") patchTokenPlanGlmPayload(payloadObj, effectiveThinkingLevel, enableThinking, tokenPlanContract.supportsMax);
		else delete payloadObj.reasoning_effort;
		delete payloadObj.reasoningEffort;
		delete payloadObj.reasoning;
	};
}
function createQwenThinkingWrapper(baseStreamFn, thinkingLevel, thinkingFormat, forceThinking = false, tokenPlanContract, sourceApi) {
	return createPayloadPatchStreamWrapper(baseStreamFn, createQwenThinkingPayloadPatch(thinkingLevel, thinkingFormat, forceThinking, tokenPlanContract, sourceApi), { shouldPatch: ({ model }) => (sourceApi ?? model.api) === "openai-completions" && (model.reasoning || forceThinking) });
}
function wrapQwenProviderStream(ctx) {
	const sourceApi = ctx.sourceApi ?? ctx.model?.api;
	if (sourceApi && sourceApi !== "openai-completions") return;
	const streamProviderId = resolveQwenStreamProviderId(ctx);
	if (!streamProviderId) return;
	const thinkingFormat = ctx.model ? readQwenThinkingFormatFromModel(ctx.model, sourceApi) : void 0;
	const explicitLegacyThinkingFormat = normalizeProviderId(ctx.provider) === "bailian-token-plan" && thinkingFormat !== void 0;
	if (explicitLegacyThinkingFormat && thinkingFormat !== "qwen-chat-template") return ctx.streamFn;
	const tokenPlanContract = explicitLegacyThinkingFormat ? void 0 : resolveQwenThinkingContract(streamProviderId, ctx.modelId);
	const useWireConstraints = (isQwenTokenPlanProviderId(streamProviderId) || tokenPlanContract?.family === "qwen-3.8") && !explicitLegacyThinkingFormat && thinkingFormat === void 0;
	const forceThinking = useWireConstraints && isQwenTokenPlanThinkingOnlyModelId(ctx.modelId);
	if (useWireConstraints) {
		const underlying = ctx.streamFn ?? streamSimple;
		const thinkingLevel = ctx.thinkingLevel;
		const wireSourceApi = ctx.sourceApi;
		const patchPayload = createQwenThinkingPayloadPatch(thinkingLevel, void 0, forceThinking, tokenPlanContract, wireSourceApi);
		return (model, context, options) => {
			if ((wireSourceApi ?? model.api) !== "openai-completions" || !model.reasoning && !forceThinking) return underlying(model, context, options);
			const requestedThinkingLevel = resolveQwenThinkingLevel(thinkingLevel, options);
			const requestedEnableThinking = forceThinking || isOpenAICompatibleThinkingEnabled({
				thinkingLevel,
				options
			});
			return underlying(model, context, {
				...options,
				onPayload: wrapProviderPayloadHook(options?.onPayload, (originalPayload, value) => {
					const payload = asOptionalRecord(value) ?? asOptionalRecord(originalPayload);
					if (payload) {
						const hasPayloadThinking = typeof payload.enable_thinking === "boolean";
						let enableThinking = forceThinking || (hasPayloadThinking ? payload.enable_thinking !== false : requestedEnableThinking);
						const rawThinkingLevel = typeof payload.reasoning_effort === "string" ? payload.reasoning_effort : hasPayloadThinking ? void 0 : requestedThinkingLevel;
						if (!forceThinking && (rawThinkingLevel === "off" || tokenPlanContract?.family === "qwen-3.8" && rawThinkingLevel === "none")) enableThinking = false;
						payload.enable_thinking = enableThinking;
						if (enableThinking) {
							const toolChoice = payload.tool_choice;
							const toolChoiceType = asOptionalRecord(toolChoice)?.type;
							if (toolChoiceType === "auto" || toolChoiceType === "none") payload.tool_choice = toolChoiceType;
							else if (!(toolChoice == null || toolChoice === "auto" || toolChoice === "none")) {
								if (!forceThinking && (toolChoiceType === "tool" || toolChoiceType === "function")) {
									payload.enable_thinking = false;
									enableThinking = false;
								} else payload.tool_choice = "auto";
							}
						}
						if (tokenPlanContract?.family === "qwen-3.8") patchQwen38Payload(payload, normalizeQwenThinkingLevel(rawThinkingLevel), enableThinking);
						else if (tokenPlanContract?.family === "deepseek-v4") patchTokenPlanDeepSeekV4Payload(payload, rawThinkingLevel === "xhigh" || rawThinkingLevel === "max" ? "max" : "high", enableThinking);
						else if (tokenPlanContract?.family === "kimi") patchTokenPlanKimiPayload(payload, enableThinking);
						else if (tokenPlanContract?.family === "glm") {
							if (Array.isArray(payload.tools) && payload.tools.length > 0) payload.tool_stream = true;
							if (rawThinkingLevel === "none" && enableThinking) delete payload.thinking;
							else patchTokenPlanGlmPayload(payload, normalizeQwenThinkingLevel(rawThinkingLevel), enableThinking, tokenPlanContract.supportsMax);
						} else {
							delete payload.thinking;
							delete payload.reasoning_effort;
						}
						delete payload.reasoningEffort;
						delete payload.reasoning;
					}
					return value;
				}, (payload) => {
					const payloadObj = asOptionalRecord(payload);
					if (payloadObj) patchPayload({
						payload: payloadObj,
						model,
						context,
						options
					});
				})
			});
		};
	}
	return createQwenThinkingWrapper(ctx.streamFn, ctx.thinkingLevel, thinkingFormat, forceThinking, tokenPlanContract, ctx.sourceApi);
}
export { createQwenThinkingWrapper, wrapQwenProviderStream };
