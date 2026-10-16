import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { d as asPositiveSafeInteger } from "./number-coercion-CuVhdCBs.mjs";
import { f as readProviderJsonArrayFieldResponse } from "./provider-http-errors-DmewLLH7.mjs";
import { i as normalizeModelCompat } from "./provider-model-compat-DQ2tKK7m.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./provider-model-shared-BZZnLgoM.mjs";
import "./provider-http-CuRGJD0L.mjs";
import { m as LiveModelCatalogHttpError } from "./provider-catalog-live-runtime-NaavztHY.mjs";
import { a as resolveStaticCopilotModelOverride, i as resolveCopilotTransportApi, n as resolveCopilotModelCompat, r as resolveCopilotThinkingLevelMap } from "./model-metadata-DcfNVGd3.mjs";
import { t as buildCopilotRuntimeHeaders } from "./runtime-identity-BcPuqdRw.mjs";
//#region extensions/github-copilot/models.ts
const PROVIDER_ID = "github-copilot";
const DEFAULT_CONTEXT_WINDOW = 128e3;
const DEFAULT_MAX_TOKENS = 8192;
function isCopilotCodexModelId(modelId) {
	return /(?:^|[-_.])codex(?:$|[-_.])/.test(modelId);
}
function resolveCopilotForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	if (!trimmedModelId) return;
	const lowerModelId = normalizeOptionalLowercaseString(trimmedModelId) ?? "";
	if (ctx.modelRegistry.find("github-copilot", lowerModelId)) return;
	const staticOverride = resolveStaticCopilotModelOverride(lowerModelId);
	const reasoning = staticOverride ? staticOverride.reasoning ?? false : /^o[13](\b|$)/.test(lowerModelId) || isCopilotCodexModelId(lowerModelId);
	const compat = staticOverride?.compat ?? resolveCopilotModelCompat(trimmedModelId);
	return normalizeModelCompat({
		id: trimmedModelId,
		name: staticOverride?.name ?? trimmedModelId,
		provider: PROVIDER_ID,
		api: staticOverride?.api ?? resolveCopilotTransportApi(trimmedModelId),
		reasoning,
		input: staticOverride?.input ?? ["text", "image"],
		cost: staticOverride?.cost ?? {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: staticOverride?.contextWindow ?? DEFAULT_CONTEXT_WINDOW,
		...staticOverride?.contextWindow === void 0 ? { contextWindowSource: "synthetic" } : {},
		...staticOverride?.contextTokens !== void 0 ? { contextTokens: staticOverride.contextTokens } : {},
		maxTokens: staticOverride?.maxTokens ?? DEFAULT_MAX_TOKENS,
		...staticOverride?.thinkingLevelMap ? { thinkingLevelMap: staticOverride.thinkingLevelMap } : {},
		...compat ? { compat } : {}
	});
}
const copilotModelSelectionMetadata = /* @__PURE__ */ new WeakMap();
function isCopilotCatalogModelVisible(model) {
	const metadata = copilotModelSelectionMetadata.get(model);
	return Boolean(metadata?.pickerEnabled && metadata.policyState !== "disabled" && metadata.policyState !== "unconfigured");
}
function isCopilotCatalogModelSelectable(model) {
	const metadata = copilotModelSelectionMetadata.get(model);
	return Boolean(isCopilotCatalogModelVisible(model) && metadata?.streaming !== false && metadata?.toolCalls);
}
const COPILOT_STARTER_CATEGORY_RANK = /* @__PURE__ */ new Map([
	["versatile", 0],
	["lightweight", 1],
	["powerful", 2]
]);
function compareCopilotStarterCandidates(left, right) {
	const leftMetadata = copilotModelSelectionMetadata.get(left);
	const rightMetadata = copilotModelSelectionMetadata.get(right);
	const previewDelta = Number(leftMetadata?.preview === true) - Number(rightMetadata?.preview === true);
	if (previewDelta !== 0) return previewDelta;
	const categoryDelta = (COPILOT_STARTER_CATEGORY_RANK.get(leftMetadata?.category ?? "") ?? Number.MAX_SAFE_INTEGER) - (COPILOT_STARTER_CATEGORY_RANK.get(rightMetadata?.category ?? "") ?? Number.MAX_SAFE_INTEGER);
	if (categoryDelta !== 0) return categoryDelta;
	const contextDelta = (right.contextWindow ?? Math.max(right.contextTokens ?? 0, DEFAULT_CONTEXT_WINDOW)) - (left.contextWindow ?? Math.max(left.contextTokens ?? 0, DEFAULT_CONTEXT_WINDOW));
	if (contextDelta !== 0) return contextDelta;
	const outputDelta = right.maxTokens - left.maxTokens;
	if (outputDelta !== 0) return outputDelta;
	return left.id.localeCompare(right.id);
}
function selectCopilotStarterModel(models, preferredModelId) {
	const selectable = models.filter(isCopilotCatalogModelSelectable);
	return selectable.find((model) => model.id === preferredModelId) ?? selectable.toSorted(compareCopilotStarterCandidates)[0];
}
const COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS = 1e4;
const COPILOT_ROUTER_ID_PREFIX = "accounts/";
function resolveCopilotApiForVendor(vendor, modelId) {
	if (vendor && vendor.toLowerCase() === "anthropic") return "anthropic-messages";
	return resolveCopilotTransportApi(modelId);
}
function mergeCopilotCompat(base, reasoningEfforts) {
	if (!Array.isArray(reasoningEfforts)) return base;
	return {
		...base,
		supportedReasoningEfforts: [...new Set(reasoningEfforts.map((effort) => normalizeOptionalLowercaseString(effort)).filter((effort) => Boolean(effort)))]
	};
}
function mapCopilotApiModelToDefinition(entry) {
	const id = entry.id?.trim();
	if (!id) return;
	if (entry.object && entry.object !== "model") return;
	if (entry.capabilities?.type && entry.capabilities.type !== "chat") return;
	if (id.startsWith(COPILOT_ROUTER_ID_PREFIX)) return;
	const limits = entry.capabilities?.limits;
	const supports = entry.capabilities?.supports;
	const reasoning = Array.isArray(supports?.reasoning_effort) ? supports.reasoning_effort.length > 0 : false;
	const input = supports?.vision === true ? ["text", "image"] : ["text"];
	const nativeContextWindow = asPositiveSafeInteger(limits?.max_context_window_tokens);
	const contextTokens = asPositiveSafeInteger(limits?.max_prompt_tokens);
	const maxTokens = asPositiveSafeInteger(limits?.max_output_tokens) ?? DEFAULT_MAX_TOKENS;
	const compat = mergeCopilotCompat(resolveCopilotModelCompat(id), supports?.reasoning_effort);
	const api = resolveCopilotApiForVendor(entry.vendor, id);
	const thinkingLevelMap = resolveCopilotThinkingLevelMap(id, compat, api);
	const definition = {
		id,
		name: entry.name?.trim() || id,
		api,
		reasoning,
		input,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		...nativeContextWindow !== void 0 ? { contextWindow: nativeContextWindow } : {},
		...contextTokens !== void 0 ? { contextTokens } : {},
		maxTokens,
		...thinkingLevelMap ? { thinkingLevelMap } : {},
		...compat ? { compat } : {}
	};
	copilotModelSelectionMetadata.set(definition, {
		category: normalizeOptionalLowercaseString(entry.model_picker_category),
		pickerEnabled: entry.model_picker_enabled === true,
		policyState: normalizeOptionalLowercaseString(entry.policy?.state),
		preview: entry.preview === true,
		streaming: supports?.streaming,
		toolCalls: supports?.tool_calls === true
	});
	return definition;
}
function asCopilotApiModelEntry(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Copilot /models: malformed JSON response");
	return value;
}
/**
* Fetch the live Copilot model catalog from `${baseUrl}/models` and project it
* into `ModelDefinitionConfig[]`. Used by the plugin's discovery hook so the
* runtime catalog tracks per-account entitlements + accurate context windows
* without manifest churn.
*
* Filters out non-chat objects (embeddings, routers) and internal router ids.
* Failures propagate so the catalog owner can publish a truthful outcome.
*/
async function fetchCopilotModelCatalog(params) {
	const fetchImpl = params.fetchImpl ?? fetch;
	const trimmedBase = params.baseUrl.replace(/\/+$/, "");
	if (!trimmedBase) throw new Error("fetchCopilotModelCatalog: baseUrl required");
	if (!params.copilotApiToken.trim()) throw new Error("fetchCopilotModelCatalog: copilotApiToken required");
	const url = `${trimmedBase}/models`;
	const controller = params.signal ? void 0 : new AbortController();
	const timeoutId = controller ? setTimeout(() => controller.abort(), COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS) : void 0;
	try {
		const res = await fetchImpl(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
				...buildCopilotRuntimeHeaders({ headers: params.headers }),
				Authorization: `Bearer ${params.copilotApiToken}`
			},
			signal: params.signal ?? controller?.signal
		});
		if (!res.ok) {
			await res.body?.cancel().catch(() => void 0);
			throw new LiveModelCatalogHttpError(PROVIDER_ID, res.status);
		}
		const data = await readProviderJsonArrayFieldResponse(res, "Copilot /models", "data");
		const seen = /* @__PURE__ */ new Set();
		const out = [];
		for (const rawEntry of data) {
			const def = mapCopilotApiModelToDefinition(asCopilotApiModelEntry(rawEntry));
			if (!def || seen.has(def.id)) continue;
			seen.add(def.id);
			out.push(def);
		}
		return out;
	} finally {
		if (timeoutId !== void 0) clearTimeout(timeoutId);
	}
}
//#endregion
export { resolveCopilotForwardCompatModel as a, isCopilotCatalogModelVisible as i, PROVIDER_ID as n, selectCopilotStarterModel as o, fetchCopilotModelCatalog as r, COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS as t };
