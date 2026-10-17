import { d as resolveProviderRequestHeaders } from "./provider-request-config-By9R9pyt.mjs";
import { d as createOpenAICompatibleCompletionsThinkingOffWrapper, f as createPayloadPatchStreamWrapper, s as createDeepSeekV4OpenAICompatibleThinkingWrapper } from "./provider-stream-shared-CU7Z6wj0.mjs";
import "./provider-http-CuRGJD0L.mjs";
import { n as isOpencodeGoKimiNoReasoningModelId, t as isOpencodeGoFixedAnthropicReasoningModelId } from "./provider-policy-api-CoTNAtCt.mjs";
import { t as stripOpencodeGoKimiReasoningPayload } from "./reasoning-sanitizer-C0WUTAfb.mjs";
import { n as OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT, r as createOpencodeGoStalledStreamWrapper, t as OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT } from "./stream-termination-CVh91Ujt.mjs";
//#region extensions/opencode-go/stream.ts
function createOpencodeGoAttributionWrapper(baseStreamFn, sourceApi) {
	return (model, context, options) => {
		const api = sourceApi ?? model.api;
		if (model.provider !== "opencode-go" || api !== "anthropic-messages") return baseStreamFn(model, context, options);
		return baseStreamFn(model, context, {
			...options,
			headers: resolveProviderRequestHeaders({
				provider: model.provider,
				api,
				baseUrl: model.baseUrl,
				capability: "llm",
				transport: "stream",
				callerHeaders: options?.headers,
				precedence: "defaults-win"
			})
		});
	};
}
function createOpencodeGoDeepSeekWrapper(baseStreamFn, thinkingLevel) {
	const flashStreamFn = createDeepSeekV4OpenAICompatibleThinkingWrapper({
		baseStreamFn,
		thinkingLevel,
		shouldPatchModel: (model) => model.provider === "opencode-go" && model.id === "deepseek-v4-flash",
		resolveReasoningEffort: (level) => level === "low" ? "low" : level === "max" ? "max" : "high"
	});
	return createDeepSeekV4OpenAICompatibleThinkingWrapper({
		baseStreamFn: flashStreamFn,
		thinkingLevel,
		shouldPatchModel: (model) => model.provider === "opencode-go" && model.id === "deepseek-v4-pro"
	}) ?? baseStreamFn;
}
function createOpencodeGoWireWrapper(ctx) {
	const { streamFn: baseStreamFn, thinkingLevel } = ctx;
	if (!baseStreamFn) return;
	const payloadStreamFn = createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, model }) => {
		if (isOpencodeGoKimiNoReasoningModelId(model.id)) stripOpencodeGoKimiReasoningPayload(payload);
		else if (isOpencodeGoFixedAnthropicReasoningModelId(model.id)) {
			delete payload.thinking;
			delete payload.output_config;
		}
	}, { shouldPatch: ({ model }) => model.provider === "opencode-go" });
	const thinkingOff = createOpenAICompatibleCompletionsThinkingOffWrapper(payloadStreamFn, thinkingLevel, ctx.sourceApi);
	return createOpencodeGoAttributionWrapper(createOpencodeGoDeepSeekWrapper((model, context, options) => model.provider === "opencode-go" && model.id === "kimi-k3" ? thinkingOff(model, context, options) : payloadStreamFn(model, context, options), thinkingLevel), ctx.sourceApi);
}
function createOpencodeGoWrapper(ctx) {
	const wrapped = createOpencodeGoWireWrapper(ctx);
	if (!wrapped) return;
	return createOpencodeGoStalledStreamWrapper(wrapped, {
		provider: "opencode-go",
		idleTimeoutMs: OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT,
		firstEventTimeoutMs: OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT
	});
}
//#endregion
export { createOpencodeGoWrapper as n, createOpencodeGoWireWrapper as t };
