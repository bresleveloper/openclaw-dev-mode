import { d as resolveProviderRequestHeaders } from "./provider-request-config-DOrVD029.mjs";
import { d as createPayloadPatchStreamWrapper, i as composeProviderStreamWrappers, o as createDeepSeekV4OpenAICompatibleThinkingWrapper, u as createOpenAICompatibleCompletionsThinkingOffWrapper } from "./provider-stream-shared-BtT7wZpQ.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { r as isOpencodeGoKimiNoReasoningModelId } from "./provider-catalog-6YKUwAOs.mjs";
import { t as isOpencodeGoFixedAnthropicReasoningModelId } from "./provider-policy-api-DFDI0g_1.mjs";
import { t as stripOpencodeGoKimiReasoningPayload } from "./reasoning-sanitizer-BA49xp2a.mjs";
import { n as OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT, r as createOpencodeGoStalledStreamWrapper, t as OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT } from "./stream-termination-Bx8s6cqI.mjs";
//#region extensions/opencode-go/stream.ts
function createOpencodeGoAttributionWrapper(baseStreamFn, sourceApi) {
	if (!baseStreamFn) return;
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
	});
}
function createOpencodeGoWireWrapper(ctx) {
	const { streamFn: baseStreamFn, thinkingLevel } = ctx;
	if (!baseStreamFn) return;
	return composeProviderStreamWrappers(baseStreamFn, (streamFn) => createPayloadPatchStreamWrapper(streamFn, ({ payload, model }) => {
		if (isOpencodeGoKimiNoReasoningModelId(model.id)) stripOpencodeGoKimiReasoningPayload(payload);
		else if (isOpencodeGoFixedAnthropicReasoningModelId(model.id)) {
			delete payload.thinking;
			delete payload.output_config;
		}
	}, { shouldPatch: ({ model }) => model.provider === "opencode-go" }), (streamFn) => {
		if (!streamFn) return;
		const thinkingOff = createOpenAICompatibleCompletionsThinkingOffWrapper(streamFn, thinkingLevel, ctx.sourceApi);
		return (model, context, options) => model.provider === "opencode-go" && model.id === "kimi-k3" ? thinkingOff(model, context, options) : streamFn(model, context, options);
	}, (streamFn) => createOpencodeGoDeepSeekWrapper(streamFn, thinkingLevel), (streamFn) => createOpencodeGoAttributionWrapper(streamFn, ctx.sourceApi)) ?? baseStreamFn;
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
