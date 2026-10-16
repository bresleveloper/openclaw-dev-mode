import { i as normalizeXaiModelId, r as isXaiXhighModelId, t as isXaiFrontierModelId } from "./model-id-BCpLVsfx.mjs";
import { d as resolveXaiCatalogEntry } from "./model-definitions-BTg9V4Hq.mjs";
import { t as isXaiProviderId } from "./provider-id-BvdhW5fW.mjs";
import { t as resolveXaiFastModelId } from "./fast-mode-ili-NpA8.mjs";
//#region extensions/xai/provider-policy-api.ts
function resolveFastModeSupport(ctx) {
	if (!ctx.api || ctx.runtimeId !== "openclaw") return;
	return resolveXaiFastModelId({
		id: ctx.modelId,
		provider: ctx.provider,
		api: ctx.api
	}) !== void 0;
}
function resolveThinkingProfile(ctx) {
	const modelId = normalizeXaiModelId(ctx.modelId.trim().toLowerCase());
	const isGrok43 = modelId === "grok-latest" || modelId === "grok-4.3" || modelId.startsWith("grok-4.3-");
	const reasoning = ctx.reasoning ?? resolveXaiCatalogEntry(modelId)?.reasoning ?? isGrok43;
	if (!isXaiProviderId(ctx.provider) || !reasoning) return {
		levels: [{ id: "off" }],
		defaultLevel: "off"
	};
	if (isXaiFrontierModelId(modelId)) return {
		levels: isXaiXhighModelId(modelId) ? [
			{ id: "low" },
			{ id: "medium" },
			{ id: "high" },
			{ id: "xhigh" }
		] : [
			{ id: "low" },
			{ id: "medium" },
			{ id: "high" }
		],
		defaultLevel: "high"
	};
	if (!isGrok43) return {
		levels: [{ id: "off" }],
		defaultLevel: "off"
	};
	return {
		levels: [
			{ id: "off" },
			{ id: "minimal" },
			{ id: "low" },
			{ id: "medium" },
			{ id: "high" }
		],
		defaultLevel: "low"
	};
}
//#endregion
export { resolveThinkingProfile as n, resolveFastModeSupport as t };
