import { isFireworksKimiModelId } from "./model-id.js";
import { l as isFireworksNativeModel } from "./.setup/provider-catalog-D1IIkEc_.mjs";
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
import { calculateCost, streamSimple } from "openclaw/plugin-sdk/llm";
import { createPayloadPatchStreamWrapper, transformProviderStreamMessages } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/fireworks/stream.ts
function isFireworksProviderId(providerId) {
	const normalized = normalizeProviderId(providerId);
	return normalized === "fireworks" || normalized === "fireworks-ai";
}
function wrapFireworksProviderStream(ctx) {
	if (!isFireworksProviderId(ctx.provider) || (ctx.sourceApi ?? ctx.model?.api) !== "openai-completions") return;
	const isKimi = isFireworksKimiModelId(ctx.modelId);
	const isNative = isFireworksNativeModel(ctx.model, ctx.sourceApi);
	if (!isKimi && !isNative) return;
	const underlying = isKimi ? createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload }) => {
		payload.thinking = { type: "disabled" };
		delete payload.reasoning;
		delete payload.reasoning_effort;
		delete payload.reasoningEffort;
	}) : ctx.streamFn ?? streamSimple;
	if (!isNative) return underlying;
	return async (model, context, options) => {
		let cache;
		const stream = await underlying(model, context, {
			...options,
			onResponse(response, responseModel) {
				const prompt = Number(response.headers["fireworks-prompt-tokens"]?.trim() || NaN);
				const read = Number(response.headers["fireworks-cached-prompt-tokens"]?.trim() || NaN);
				cache = Number.isSafeInteger(prompt) && Number.isSafeInteger(read) && read >= 0 && read <= prompt ? {
					prompt,
					read
				} : void 0;
				return options?.onResponse?.(response, responseModel);
			}
		});
		return transformProviderStreamMessages(stream, (message) => {
			const usage = message.usage;
			if (!cache || usage.cacheTelemetry?.state !== "unavailable" || usage.input + usage.cacheRead + usage.cacheWrite !== cache.prompt) return;
			usage.input -= cache.read;
			usage.cacheRead = cache.read;
			usage.cacheTelemetry = { state: "available" };
			const billedTotal = usage.cost.total;
			calculateCost(model, usage);
			if (usage.cost.totalOrigin === "provider-billed") usage.cost.total = billedTotal;
		});
	};
}
//#endregion
export { wrapFireworksProviderStream };
