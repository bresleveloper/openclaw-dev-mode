import { a as isXaiXhighModelId, c as resolveXaiIdReasoningEfforts, n as isXaiFrontierModelId, o as normalizeXaiModelId, r as isXaiGrok43ModelId, s as normalizeXaiReasoningEfforts } from "./model-id-BJIzSd6n.mjs";
import { d as resolveXaiCatalogEntry } from "./model-definitions-Bv0caRc4.mjs";
import { t as isXaiProviderId } from "./provider-id-BklI9wmC.mjs";
import { t as resolveXaiFastModelId } from "./fast-mode-DmJ8IQCo.mjs";
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
	const isGrok43 = isXaiGrok43ModelId(modelId);
	const reasoning = ctx.reasoning ?? resolveXaiCatalogEntry(modelId)?.reasoning ?? isGrok43;
	if (!isXaiProviderId(ctx.provider) || !reasoning) return {
		levels: [{ id: "off" }],
		defaultLevel: "off"
	};
	const listedEfforts = normalizeXaiReasoningEfforts(ctx.compat?.supportedReasoningEfforts ?? []);
	if (listedEfforts.length > 0 && listedEfforts.join(",") !== resolveXaiIdReasoningEfforts(modelId).join(",")) {
		const levels = listedEfforts.map((effort) => ({ id: effort === "none" ? "off" : effort }));
		return {
			levels,
			defaultLevel: listedEfforts.includes("high") ? "high" : levels.at(-1)?.id
		};
	}
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
