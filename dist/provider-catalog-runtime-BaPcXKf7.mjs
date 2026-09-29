import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as buildLiveModelProviderConfig } from "./provider-catalog-live-runtime-8rOzIDOV.mjs";
import { a as resolveGoogleStaticModelId, n as isGoogleTextGenerationModelId } from "./provider-models-C7kay9Ti.mjs";
import { a as buildGoogleStaticCatalogProvider, i as GOOGLE_GEMINI_TEXT_MODEL_IDS, n as GOOGLE_GEMINI_MANIFEST_PROVIDER, r as GOOGLE_GEMINI_TEXT_MODEL_BY_ID, t as GOOGLE_GEMINI_COST } from "./provider-catalog-DqlBFSWN.mjs";
//#region extensions/google/provider-catalog-runtime.ts
const GOOGLE_GEMINI_MODELS_CACHE_TTL_MS = 6e4;
const GOOGLE_GEMINI_MODELS_ENDPOINT = `${GOOGLE_GEMINI_MANIFEST_PROVIDER.baseUrl}/models?pageSize=1000`;
function readGoogleLiveModels(body) {
	const record = asOptionalRecord(body);
	if (!record || record.models !== void 0 && !Array.isArray(record.models)) throw new Error("Google models.list returned an invalid model list");
	return record.models ?? [];
}
function googleLiveModelInput(id) {
	if (!id.startsWith("gemma-")) return [
		"text",
		"image",
		"video"
	];
	return /^gemma-3-(?:4b|12b|27b)(?:-|$)/.test(id) || id.startsWith("gemma-3n-") || id.startsWith("gemma-4-") ? ["text", "image"] : ["text"];
}
function buildGoogleLiveModel(row) {
	const record = asOptionalRecord(row);
	if (!record) throw new Error("Google models.list returned an invalid model row");
	const resourceName = normalizeOptionalString(record.name);
	const id = resourceName?.startsWith("models/") ? resourceName.slice(7) : void 0;
	const methods = record.supportedGenerationMethods;
	const contextWindow = asPositiveSafeInteger(record.inputTokenLimit);
	const maxTokens = asPositiveSafeInteger(record.outputTokenLimit);
	if (!id || !isGoogleTextGenerationModelId(id) || !Array.isArray(methods) || !methods.includes("generateContent") || !contextWindow || !maxTokens) return;
	const staticId = resolveGoogleStaticModelId(id, GOOGLE_GEMINI_TEXT_MODEL_IDS);
	const staticModel = staticId ? GOOGLE_GEMINI_TEXT_MODEL_BY_ID.get(staticId) : void 0;
	return {
		id,
		name: normalizeOptionalString(record.displayName) ?? id,
		reasoning: record.thinking === true,
		input: googleLiveModelInput(id),
		cost: GOOGLE_GEMINI_COST,
		contextWindow,
		maxTokens,
		...staticModel?.compat ? { compat: { ...staticModel.compat } } : {},
		...staticModel?.thinkingLevelMap ? { thinkingLevelMap: { ...staticModel.thinkingLevelMap } } : {}
	};
}
function parseGoogleLiveModels(rows) {
	const models = rows.map(buildGoogleLiveModel).filter((model) => Boolean(model));
	return [...new Map(models.map((model) => [model.id, model])).values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
async function buildGoogleLiveCatalogProvider(params) {
	const { models, ...providerConfig } = buildGoogleStaticCatalogProvider();
	return await buildLiveModelProviderConfig({
		providerId: "google",
		endpoint: GOOGLE_GEMINI_MODELS_ENDPOINT,
		providerConfig,
		models,
		...params,
		ttlMs: GOOGLE_GEMINI_MODELS_CACHE_TTL_MS,
		auditContext: "google-model-discovery",
		readRows: readGoogleLiveModels,
		buildRequestHeaders: ({ discoveryApiKey, apiKey }) => ({
			Accept: "application/json",
			...discoveryApiKey ?? apiKey ? { "x-goog-api-key": discoveryApiKey ?? apiKey } : {}
		}),
		projectRows: parseGoogleLiveModels
	});
}
//#endregion
export { buildGoogleLiveCatalogProvider as t };
