import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { r as createAssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import "./llm-CezOo0-6.js";
import { r as createDeepSeekV4OpenAICompatibleThinkingWrapper, s as createPayloadPatchStreamWrapper } from "./provider-stream-shared-CDfVnM8B.js";
import { r as assertOkOrThrowHttpError } from "./provider-http-errors-DLfoTBpx.js";
import { o as fetchWithTimeoutGuarded } from "./shared-Bt45vaP6.js";
import "./runtime-env-oOti2yy7.js";
import "./provider-http-B13K4lug.js";
import { o as OPENROUTER_THINKING_STREAM_HOOKS } from "./provider-stream-CYYSMhbk.js";
import "./provider-stream-family-DPKI-ky1.js";
import { i as normalizeOpenRouterBaseUrl, r as isOpenRouterProxyReasoningUnsupportedModel, t as OPENROUTER_BASE_URL } from "./provider-catalog-Dya4CIwt.js";
import { t as isOpenRouterDeepSeekV4ModelId } from "./models-Dp2IHCH5.js";
//#region extensions/openrouter/stream.ts
const log = createSubsystemLogger("openrouter-stream");
const OPENROUTER_GENERATION_LOOKUP_TIMEOUT_MS = 2e3;
function readString(value) {
	return typeof value === "string" ? value.trim() : void 0;
}
function isOpenRouterAnthropicModelId(modelId) {
	const normalized = readString(modelId)?.toLowerCase();
	return normalized?.startsWith("anthropic/") === true || normalized?.startsWith("openrouter/anthropic/") === true;
}
function isVerifiedOpenRouterRoute(model) {
	const provider = readString(model.provider)?.toLowerCase();
	const baseUrl = readString(model.baseUrl);
	if (baseUrl) return normalizeOpenRouterBaseUrl(baseUrl) === OPENROUTER_BASE_URL;
	return provider === "openrouter";
}
function shouldPatchAnthropicOpenRouterPayload(model) {
	const api = readString(model.api);
	return (api === void 0 || api === "openai-completions") && isOpenRouterAnthropicModelId(model.id) && isVerifiedOpenRouterRoute(model);
}
function shouldPatchDeepSeekV4OpenRouterPayload(model) {
	const api = readString(model.api);
	return (api === void 0 || api === "openai-completions") && isOpenRouterDeepSeekV4ModelId(model.id) && isVerifiedOpenRouterRoute(model);
}
function shouldPatchOpenRouterRoutingPayload(model) {
	const api = readString(model.api);
	return (api === void 0 || api === "openai-completions") && isVerifiedOpenRouterRoute(model);
}
function resolveOpenRouterGenerationUrl(model, responseId) {
	const baseUrl = readString(model.baseUrl) || "https://openrouter.ai/api/v1";
	const url = new URL("generation", `${baseUrl.replace(/\/$/, "")}/`);
	url.searchParams.set("id", responseId);
	return url.href;
}
function readOpenRouterTotalCost(payload) {
	const totalCost = payload.data?.total_cost;
	if (typeof totalCost !== "number" || !Number.isFinite(totalCost) || totalCost < 0) return;
	return totalCost;
}
function isDoneEvent(event) {
	return event.type === "done";
}
async function fetchOpenRouterGenerationTotalCost(params) {
	const { response, release } = await fetchWithTimeoutGuarded(resolveOpenRouterGenerationUrl(params.model, params.responseId), {
		method: "GET",
		headers: {
			Authorization: `Bearer ${params.apiKey}`,
			"HTTP-Referer": "https://openclaw.ai",
			"X-OpenRouter-Title": "OpenClaw"
		}
	}, OPENROUTER_GENERATION_LOOKUP_TIMEOUT_MS, fetch, { auditContext: "openrouter-generation-cost" });
	try {
		await assertOkOrThrowHttpError(response, "OpenRouter generation metadata request failed");
		return readOpenRouterTotalCost(await response.json());
	} finally {
		await release();
	}
}
async function applyOpenRouterBilledCost(params) {
	const apiKey = readString(params.apiKey);
	const responseId = readString(params.message.responseId);
	if (!apiKey || !responseId || !params.message.usage?.cost) return;
	try {
		const totalCost = await fetchOpenRouterGenerationTotalCost({
			apiKey,
			model: params.model,
			responseId
		});
		if (totalCost !== void 0) params.message.usage.cost.total = totalCost;
	} catch (error) {
		log.debug?.(`kept streamed OpenRouter cost estimate because generation metadata lookup failed: ${error instanceof Error ? error.message : String(error)}`);
	}
}
function createOpenRouterBilledCostWrapper(baseStreamFn) {
	if (!baseStreamFn) return baseStreamFn;
	return async (model, context, options) => {
		const source = await baseStreamFn(model, context, options);
		if (!isVerifiedOpenRouterRoute(model)) return source;
		const output = createAssistantMessageEventStream();
		const stream = output;
		(async () => {
			try {
				for await (const event of source) {
					if (isDoneEvent(event)) await applyOpenRouterBilledCost({
						apiKey: options?.apiKey,
						message: event.message,
						model
					});
					stream.push(event);
				}
			} catch (error) {
				stream.push({
					type: "error",
					reason: "error",
					error: {
						role: "assistant",
						content: [],
						stopReason: "error",
						errorMessage: error instanceof Error ? error.message : String(error)
					}
				});
			} finally {
				stream.end();
			}
		})();
		return output;
	};
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
function resolveOpenRouterDeepSeekV4ReasoningEffort(thinkingLevel) {
	switch (thinkingLevel) {
		case "minimal":
		case "low":
		case "medium":
		case "high":
		case "xhigh": return thinkingLevel;
		case "max": return "xhigh";
		case "adaptive": return "medium";
		case "off":
		case void 0: return "high";
	}
	return "high";
}
function isEnabledReasoningValue(value) {
	if (value === void 0 || value === null || value === false) return false;
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		return normalized !== "" && normalized !== "off" && normalized !== "none";
	}
	return true;
}
function isOpenRouterReasoningPayloadEnabled(payload) {
	return isEnabledReasoningValue(payload.reasoning) || isEnabledReasoningValue(payload.reasoning_effort);
}
function injectOpenRouterRouting(baseStreamFn, providerRouting) {
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
	}, { shouldPatch: ({ model }) => shouldPatchOpenRouterRoutingPayload(model) });
}
function createOpenRouterAnthropicPrefillWrapper(baseStreamFn) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload }) => {
		if (!isOpenRouterReasoningPayloadEnabled(payload)) return;
		const stripped = stripTrailingOpenRouterAssistantPrefillMessages(payload);
		if (stripped > 0) log.warn(`removed ${stripped} trailing assistant prefill message${stripped === 1 ? "" : "s"} because OpenRouter-routed Anthropic reasoning requires conversations to end with a user turn`);
	}, { shouldPatch: ({ model }) => shouldPatchAnthropicOpenRouterPayload(model) });
}
function createOpenRouterDeepSeekV4ThinkingWrapper(baseStreamFn, thinkingLevel) {
	return createDeepSeekV4OpenAICompatibleThinkingWrapper({
		baseStreamFn,
		thinkingLevel,
		shouldPatchModel: shouldPatchDeepSeekV4OpenRouterPayload,
		resolveReasoningEffort: resolveOpenRouterDeepSeekV4ReasoningEffort,
		shouldBackfillAssistantReasoningContent: (message) => !assistantMessageHasOpenAIToolCalls(message)
	});
}
function wrapOpenRouterProviderStream(ctx) {
	const providerRouting = ctx.extraParams?.provider != null && typeof ctx.extraParams.provider === "object" ? ctx.extraParams.provider : void 0;
	const routedStreamFn = providerRouting ? injectOpenRouterRouting(ctx.streamFn, providerRouting) : ctx.streamFn;
	const wrapStreamFn = OPENROUTER_THINKING_STREAM_HOOKS.wrapStreamFn ?? void 0;
	if (!wrapStreamFn) return createOpenRouterBilledCostWrapper(createOpenRouterAnthropicPrefillWrapper(createOpenRouterDeepSeekV4ThinkingWrapper(routedStreamFn, ctx.thinkingLevel)));
	return createOpenRouterBilledCostWrapper(createOpenRouterAnthropicPrefillWrapper(createOpenRouterDeepSeekV4ThinkingWrapper(wrapStreamFn({
		...ctx,
		streamFn: routedStreamFn,
		thinkingLevel: isOpenRouterProxyReasoningUnsupportedModel(ctx.modelId) ? void 0 : ctx.thinkingLevel
	}) ?? void 0, ctx.thinkingLevel)));
}
//#endregion
export { wrapOpenRouterProviderStream as t };
