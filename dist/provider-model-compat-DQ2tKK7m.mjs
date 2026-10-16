import { i as normalizeModelTransportBaseUrl } from "./model-compat-catalog-Dfj3P1T4.mjs";
import { i as resolveProviderRequestCapabilities } from "./provider-attribution-DCsKu1Yv.mjs";
import { a as getModelProviderRequestRouteFacts } from "./provider-request-config-By9R9pyt.mjs";
import { resolveOpenAICompletionsCompat } from "@openclaw/ai/internal/openai-completions-compat";
import { resolveUnsupportedToolSchemaKeywords } from "@openclaw/ai/internal/tool-schema";
//#region src/plugins/provider-model-compat.ts
function extractModelCompat(modelOrCompat) {
	if (!modelOrCompat || typeof modelOrCompat !== "object") return;
	if ("compat" in modelOrCompat) {
		const compat = modelOrCompat.compat;
		return compat && typeof compat === "object" ? compat : void 0;
	}
	return modelOrCompat;
}
/** @deprecated Provider-owned model compat helper; do not use from third-party plugins. */
function applyModelCompatPatch(model, patch) {
	const nextCompat = {
		...model.compat,
		...patch
	};
	const currentCompat = model.compat;
	if (model.compat && Object.entries(patch).every(([key, value]) => currentCompat?.[key] === value)) return model;
	return {
		...model,
		compat: nextCompat
	};
}
function hasToolSchemaProfile(modelOrCompat, profile) {
	return extractModelCompat(modelOrCompat)?.toolSchemaProfile === profile;
}
function resolveToolCallArgumentsEncoding(modelOrCompat) {
	return extractModelCompat(modelOrCompat)?.toolCallArgumentsEncoding;
}
function isOpenAiCompletionsModel(model) {
	return model.api === "openai-completions";
}
function normalizeModelCompat(model, providerMetadataOwners) {
	const baseUrl = model.baseUrl ?? "";
	const normalized = normalizeModelTransportBaseUrl(model.api, baseUrl);
	if (normalized !== baseUrl) return {
		...model,
		baseUrl: normalized
	};
	if (!isOpenAiCompletionsModel(model)) return model;
	const compat = model.compat ?? void 0;
	if (!baseUrl) return model;
	const resolvedProviderMetadataOwners = providerMetadataOwners ?? getModelProviderRequestRouteFacts(model)?.providerMetadataOwners;
	const resolved = resolveOpenAICompletionsCompat(model, (input) => resolveProviderRequestCapabilities({
		...input,
		...resolvedProviderMetadataOwners ? { providerMetadataOwners: resolvedProviderMetadataOwners } : {}
	}));
	if (resolved.supportsDeveloperRole && resolved.supportsUsageInStreaming && resolved.supportsStrictMode) return model;
	const patch = {
		...compat?.supportsDeveloperRole === void 0 ? { supportsDeveloperRole: resolved.supportsDeveloperRole } : {},
		...compat?.supportsUsageInStreaming === void 0 ? { supportsUsageInStreaming: resolved.supportsUsageInStreaming } : {},
		...compat?.supportsStrictMode === void 0 ? { supportsStrictMode: resolved.supportsStrictMode } : {}
	};
	if (Object.keys(patch).length === 0) return model;
	return {
		...model,
		compat: {
			...compat,
			...patch
		}
	};
}
//#endregion
export { resolveToolCallArgumentsEncoding as a, normalizeModelCompat as i, extractModelCompat as n, resolveUnsupportedToolSchemaKeywords as o, hasToolSchemaProfile as r, applyModelCompatPatch as t };
