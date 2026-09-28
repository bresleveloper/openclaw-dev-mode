import { t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue } from "./string-coerce-CIXf7egm.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import { d as createPayloadPatchStreamWrapper, i as composeProviderStreamWrappers, x as normalizeOpenAICompatibleReasoningReplay } from "./provider-stream-shared-BtT7wZpQ.mjs";
import { c as buildProviderStreamFamilyHooks } from "./provider-stream-BqU4Fzur.mjs";
import "./provider-stream-family-C-4EZwwP.mjs";
import { t as OPENROUTER_BASE_URL } from "./provider-defaults-ilQX6q3J.mjs";
import { i as normalizeOpenRouterBaseUrl, r as isOpenRouterProxyReasoningUnsupportedModel } from "./provider-catalog-CQkKDTwf.mjs";
import { i as normalizeOpenRouterModelFamilyId, t as isOpenRouterDeepSeekV4ModelId } from "./models-DFeYq0pM.mjs";
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
	if (!headers.has("http-referer")) headers.set("HTTP-Referer", "https://openclaw.ai");
	if (!headers.has("x-openrouter-title")) headers.set("X-OpenRouter-Title", "OpenClaw");
	return {
		...options,
		headers: Object.fromEntries(headers.entries())
	};
}
function createOpenRouterAuthHeaderWrapper(baseStreamFn) {
	if (!baseStreamFn) return baseStreamFn;
	return (model, context, options) => baseStreamFn(model, context, isVerifiedOpenRouterRoute(model) ? mergeOpenRouterAuthHeaders(options) : options);
}
function assistantMessageHasOpenAIToolCalls(message) {
	return Array.isArray(message.tool_calls) && message.tool_calls.length > 0;
}
function isAnthropicToolCallContentBlock(value) {
	return value !== null && typeof value === "object" && (value.type === "tool_use" || value.type === "toolCall");
}
function assistantMessageHasAnthropicToolUse(message) {
	const content = message.content;
	return Array.isArray(content) && content.some(isAnthropicToolCallContentBlock);
}
function shouldStripOpenRouterTrailingMessage(value) {
	if (!value || typeof value !== "object") return false;
	const message = value;
	return message.role === "assistant" && !assistantMessageHasOpenAIToolCalls(message) && !assistantMessageHasAnthropicToolUse(message);
}
function stripTrailingOpenRouterAssistantPrefillMessages(payload) {
	const messages = payload.messages;
	if (!Array.isArray(messages)) return 0;
	let keep = messages.length;
	while (keep > 0 && shouldStripOpenRouterTrailingMessage(messages[keep - 1])) keep -= 1;
	if (keep === messages.length) return 0;
	const stripped = messages.length - keep;
	messages.splice(keep);
	return stripped;
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
		const effort = reasoning.effort;
		if (typeof effort === "string") {
			const normalized = effort.trim().toLowerCase();
			return normalized !== "" && normalized !== "off" && normalized !== "none";
		}
	}
	return true;
}
function isOpenRouterReasoningPayloadEnabled(payload) {
	return isEnabledReasoningValue(payload.reasoning) || isEnabledReasoningValue(payload.reasoning_effort);
}
function injectOpenRouterRouting(baseStreamFn, providerRouting, sourceApi) {
	if (!providerRouting) return baseStreamFn;
	const routedStreamFn = (model, context, options) => (baseStreamFn ?? ((nextModel) => {
		throw new Error(`OpenRouter routing wrapper requires an underlying streamFn for ${nextModel.id}.`);
	}))({
		...model,
		compat: {
			...model.compat,
			openRouterRouting: providerRouting
		}
	}, context, options);
	return createPayloadPatchStreamWrapper(routedStreamFn, ({ payload }) => {
		if (payload.provider === void 0) payload.provider = providerRouting;
	}, { shouldPatch: ({ model }) => shouldPatchOpenRouterPayload(model, sourceApi) });
}
function createOpenRouterAnthropicPrefillWrapper(baseStreamFn, sourceApi) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload }) => {
		if (!isOpenRouterReasoningPayloadEnabled(payload)) return;
		const stripped = stripTrailingOpenRouterAssistantPrefillMessages(payload);
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
			shouldBackfillAssistantMessage: (message) => !assistantMessageHasOpenAIToolCalls(message)
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
