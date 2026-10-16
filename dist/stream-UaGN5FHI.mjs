import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import { S as normalizeOpenAICompatibleReasoningReplay, a as composeProviderStreamWrappers, f as createPayloadPatchStreamWrapper, j as stripTrailingAssistantPrefillMessages } from "./provider-stream-shared-D8q3R1a-.mjs";
import { n as buildProviderStreamFamilyHooks } from "./provider-stream-CPGCn_Ra.mjs";
import "./provider-stream-family-B6dW08sH.mjs";
import { t as OPENROUTER_BASE_URL } from "./provider-defaults-ilQX6q3J.mjs";
import { i as normalizeOpenRouterBaseUrl, r as isOpenRouterProxyReasoningUnsupportedModel } from "./provider-catalog-CtJ2DVzZ.mjs";
import { i as normalizeOpenRouterModelFamilyId, t as isOpenRouterDeepSeekV4ModelId } from "./models-DNvPaErb.mjs";
//#region extensions/openrouter/stream.ts
const log = createSubsystemLogger("openrouter-stream");
const openRouterThinkingStreamHooks = buildProviderStreamFamilyHooks("openrouter-thinking");
function normalizeOpenRouterStringPreservingEmpty(value) {
	return readStringValue(value)?.trim();
}
function isVerifiedOpenRouterRoute(model) {
	const provider = normalizeOpenRouterStringPreservingEmpty(model.provider)?.toLowerCase();
	const baseUrl = normalizeOpenRouterStringPreservingEmpty(model.baseUrl);
	if (baseUrl) return normalizeOpenRouterBaseUrl(baseUrl) === OPENROUTER_BASE_URL;
	return provider === "openrouter";
}
function shouldPatchOpenRouterPayload(model, sourceApi) {
	const api = normalizeOpenRouterStringPreservingEmpty(sourceApi ?? model.api);
	return (api === void 0 || api === "openai-completions") && isVerifiedOpenRouterRoute(model);
}
function mergeOpenRouterAuthHeaders(options) {
	const apiKey = normalizeOpenRouterStringPreservingEmpty(options?.apiKey);
	if (!apiKey) return options;
	const headers = new Headers(options?.headers);
	if (!headers.has("authorization")) headers.set("Authorization", `Bearer ${apiKey}`);
	return {
		...options,
		headers: Object.fromEntries(headers.entries())
	};
}
function createOpenRouterAuthHeaderWrapper(baseStreamFn) {
	if (!baseStreamFn) return baseStreamFn;
	return (model, context, options) => baseStreamFn(model, context, isVerifiedOpenRouterRoute(model) ? mergeOpenRouterAuthHeaders(options) : options);
}
function isEnabledReasoningValue(value) {
	if (value === void 0 || value === null || value === false) return false;
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		return normalized !== "" && normalized !== "off" && normalized !== "none";
	}
	if (typeof value === "object" && !Array.isArray(value)) {
		const reasoning = value;
		if (reasoning.enabled === false) return false;
		return typeof reasoning.effort !== "string" || isEnabledReasoningValue(reasoning.effort);
	}
	return true;
}
function isOpenRouterReasoningPayloadEnabled(payload) {
	return isEnabledReasoningValue(payload.reasoning) || isEnabledReasoningValue(payload.reasoning_effort);
}
function injectOpenRouterRouting(baseStreamFn, providerRouting, sourceApi) {
	const routedStreamFn = (model, context, options) => {
		if (!baseStreamFn) throw new Error(`OpenRouter routing wrapper requires an underlying streamFn for ${model.id}.`);
		return baseStreamFn({
			...model,
			compat: {
				...model.compat,
				openRouterRouting: providerRouting
			}
		}, context, options);
	};
	return createPayloadPatchStreamWrapper(routedStreamFn, ({ payload }) => {
		if (payload.provider === void 0) payload.provider = providerRouting;
	}, { shouldPatch: ({ model }) => shouldPatchOpenRouterPayload(model, sourceApi) });
}
function createOpenRouterAnthropicPrefillWrapper(baseStreamFn, sourceApi) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload }) => {
		if (!isOpenRouterReasoningPayloadEnabled(payload)) return;
		const stripped = stripTrailingAssistantPrefillMessages(payload);
		if (stripped > 0) log.warn(`removed ${stripped} trailing assistant prefill message${stripped === 1 ? "" : "s"} because OpenRouter-routed Anthropic reasoning requires conversations to end with a user turn`);
	}, { shouldPatch: ({ model }) => shouldPatchOpenRouterPayload(model, sourceApi) && normalizeOpenRouterModelFamilyId(model.id)?.startsWith("anthropic/") === true });
}
function createOpenRouterDeepSeekV4ReplayWrapper(baseStreamFn, thinkingLevel, sourceApi) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, model, options }) => {
		delete payload.thinking;
		delete payload.reasoning_effort;
		const compat = asNonArrayRecord(model.compat);
		if (compat.supportsReasoningEffort !== false && !compat.supportedReasoningEfforts) {
			const requestedLevel = options?.reasoning ?? thinkingLevel;
			payload.reasoning = {
				...asNonArrayRecord(payload.reasoning),
				effort: requestedLevel === "off" ? "none" : requestedLevel === "max" || requestedLevel === "xhigh" ? "xhigh" : "high"
			};
		}
		normalizeOpenAICompatibleReasoningReplay(payload, {
			thinkingEnabled: payload.reasoning === void 0 || isOpenRouterReasoningPayloadEnabled(payload),
			shouldBackfillAssistantMessage: (message) => !Array.isArray(message.tool_calls) || message.tool_calls.length === 0
		});
	}, { shouldPatch: ({ model }) => shouldPatchOpenRouterPayload(model, sourceApi) && isOpenRouterDeepSeekV4ModelId(model.id) });
}
function wrapOpenRouterProviderStream(ctx) {
	const providerRouting = ctx.extraParams?.provider != null && typeof ctx.extraParams.provider === "object" ? ctx.extraParams.provider : void 0;
	const routedStreamFn = providerRouting ? injectOpenRouterRouting(ctx.streamFn, providerRouting, ctx.sourceApi) : ctx.streamFn;
	const wrapStreamFn = openRouterThinkingStreamHooks.wrapStreamFn ?? void 0;
	return composeProviderStreamWrappers(routedStreamFn, wrapStreamFn && ((streamFn) => wrapStreamFn({
		...ctx,
		modelId: normalizeOpenRouterModelFamilyId(ctx.modelId) ?? ctx.modelId,
		streamFn,
		thinkingLevel: isOpenRouterProxyReasoningUnsupportedModel(ctx.modelId) ? void 0 : ctx.thinkingLevel
	}) ?? void 0), (streamFn) => createOpenRouterDeepSeekV4ReplayWrapper(streamFn, ctx.thinkingLevel, ctx.sourceApi), createOpenRouterAuthHeaderWrapper, (streamFn) => createOpenRouterAnthropicPrefillWrapper(streamFn, ctx.sourceApi));
}
//#endregion
export { wrapOpenRouterProviderStream as t };
