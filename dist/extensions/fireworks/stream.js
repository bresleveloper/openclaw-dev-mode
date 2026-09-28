import { isFireworksKimiModelId } from "./model-id.js";
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
import { createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/fireworks/stream.ts
function isFireworksProviderId(providerId) {
	const normalized = normalizeProviderId(providerId);
	return normalized === "fireworks" || normalized === "fireworks-ai";
}
function wrapFireworksProviderStream(ctx) {
	if (!isFireworksProviderId(ctx.provider) || ctx.model?.api !== "openai-completions" || !isFireworksKimiModelId(ctx.modelId)) return;
	return createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload }) => {
		payload.thinking = { type: "disabled" };
		delete payload.reasoning;
		delete payload.reasoning_effort;
		delete payload.reasoningEffort;
	});
}
//#endregion
export { wrapFireworksProviderStream };
