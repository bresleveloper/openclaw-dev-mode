import { d as resolveProviderRequestHeaders } from "./provider-request-config-WdycwKIG.mjs";
import { c as createDeepSeekV4OpenAICompatibleThinkingWrapper, f as createOpenAICompatibleCompletionsThinkingOffWrapper, p as createPayloadPatchStreamWrapper } from "./provider-stream-shared-Ond8mlRx.mjs";
import "./provider-http-BuV15s4V.mjs";
import { n as isOpencodeGoKimiNoReasoningModelId, t as isOpencodeGoFixedAnthropicReasoningModelId } from "./provider-policy-api-DjDiACJy.mjs";
import { t as stripOpencodeGoKimiReasoningPayload } from "./reasoning-sanitizer-CbBTmI3v.mjs";
import { t as createOpencodeGoStalledStreamWrapper } from "./stream-termination-B3HEuj1s.mjs";
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
	return createOpencodeGoStalledStreamWrapper(wrapped);
}
//#endregion
export { createOpencodeGoWrapper as n, createOpencodeGoWireWrapper as t };
