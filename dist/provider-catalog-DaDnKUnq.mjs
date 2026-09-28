import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as buildModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { r as normalizeConfiguredProviderCatalogModelId } from "./provider-model-id-normalization-CO2R6uEC.mjs";
import { t as normalizeModelCatalog } from "./model-catalog-normalize-B4Klvr97.mjs";
import { n as copyRecordEntries } from "./safe-record-CjQoFebO.mjs";
//#region src/plugins/provider-catalog.ts
function addApiKeyToProvider(provider, apiKey) {
	try {
		return {
			...provider,
			apiKey
		};
	} catch {
		return;
	}
}
/** Finds a provider catalog template entry by normalized provider and template id. */
function findCatalogTemplate(params) {
	let selected;
	params.templateIds.some((templateId) => {
		selected = params.entries.find((entry) => normalizeProviderId(entry.provider) === normalizeProviderId(params.providerId) && normalizeLowercaseStringOrEmpty(entry.id) === normalizeLowercaseStringOrEmpty(templateId));
		return selected !== void 0;
	});
	return selected;
}
/** Selects one complete auth result in caller-defined order, including unresolved secret markers. */
function resolveFirstProviderCatalogAuth(resolveProviderApiKey, providerIds) {
	for (const providerId of providerIds) {
		const auth = resolveProviderApiKey(providerId);
		if (auth.apiKey || auth.discoveryApiKey) return auth;
	}
}
/** Builds a provider catalog result for providers that share one API key. */
async function buildSingleProviderApiKeyCatalog(params) {
	const providerId = normalizeProviderId(params.providerId);
	const apiKey = params.ctx.resolveProviderApiKey(providerId).apiKey;
	if (!apiKey) return null;
	const explicitProvider = params.allowExplicitBaseUrl && params.ctx.config.models?.providers ? Object.entries(params.ctx.config.models.providers).find(([configuredProviderId]) => normalizeProviderId(configuredProviderId) === providerId)?.[1] : void 0;
	const explicitBaseUrl = normalizeOptionalString(explicitProvider?.baseUrl) ?? "";
	return { provider: {
		...await params.buildProvider(),
		...explicitBaseUrl ? { baseUrl: explicitBaseUrl } : {},
		apiKey
	} };
}
/** Builds a multi-provider catalog result backed by one provider API key. */
async function buildPairedProviderApiKeyCatalog(params) {
	const apiKey = params.ctx.resolveProviderApiKey(normalizeProviderId(params.providerId)).apiKey;
	if (!apiKey) return null;
	const providers = await params.buildProviders();
	return { providers: Object.fromEntries(copyRecordEntries(providers).flatMap(([id, provider]) => {
		const providerWithApiKey = addApiKeyToProvider(provider, apiKey);
		return providerWithApiKey ? [[id, providerWithApiKey]] : [];
	})) };
}
function countRawManifestCatalogModels(catalog) {
	if (!catalog || typeof catalog !== "object") return;
	const models = catalog.models;
	return Array.isArray(models) ? models.length : void 0;
}
/** Reads a provider's normalized manifest default as a fully qualified model ref. */
function readManifestProviderDefaultModelRef(manifest, providerId) {
	const catalog = manifest?.modelCatalog?.providers?.[providerId];
	const defaultModel = normalizeOptionalString(catalog?.defaultModel);
	return defaultModel ? buildModelCatalogRef(providerId, defaultModel) : void 0;
}
function cloneManifestCatalogTieredCost(tier) {
	return {
		input: tier.input,
		output: tier.output,
		cacheRead: tier.cacheRead,
		cacheWrite: tier.cacheWrite,
		range: tier.range.length === 1 ? [tier.range[0]] : [tier.range[0], tier.range[1]]
	};
}
function cloneManifestCatalogCost(cost) {
	return {
		input: cost.input ?? 0,
		output: cost.output ?? 0,
		cacheRead: cost.cacheRead ?? 0,
		cacheWrite: cost.cacheWrite ?? 0,
		...cost.tieredPricing ? { tieredPricing: cost.tieredPricing.map(cloneManifestCatalogTieredCost) } : {}
	};
}
function buildManifestCatalogModelInput(model, filterDocument = false) {
	if (!filterDocument && model.input?.includes("document")) throw new Error(`Manifest modelCatalog row ${model.id} uses unsupported runtime input document`);
	return model.input?.filter((item) => item !== "document") ?? ["text"];
}
function cloneManifestCatalogMediaInput(mediaInput) {
	if (!mediaInput?.image) return;
	return { image: { ...mediaInput.image } };
}
function buildManifestCatalogModel(model, options = {}) {
	if (model.contextWindow === void 0) throw new Error(`Manifest modelCatalog row ${model.id} is missing contextWindow`);
	if (model.maxTokens === void 0) throw new Error(`Manifest modelCatalog row ${model.id} is missing maxTokens`);
	const id = options.providerId ? normalizeConfiguredProviderCatalogModelId(options.providerId, model.id, /* @__PURE__ */ new Map()) : model.id;
	return {
		id,
		name: model.name ?? id,
		...model.api ? { api: model.api } : {},
		...model.baseUrl ? { baseUrl: model.baseUrl } : {},
		reasoning: model.reasoning ?? false,
		input: buildManifestCatalogModelInput(model, options.filterDocument),
		cost: cloneManifestCatalogCost(model.cost ?? {}),
		contextWindow: model.contextWindow,
		...model.contextWindows ? { contextWindows: model.contextWindows.map((option) => ({ ...option })) } : {},
		...model.contextWindowDefault ? { contextWindowDefault: model.contextWindowDefault } : {},
		...model.contextTokens !== void 0 ? { contextTokens: model.contextTokens } : {},
		maxTokens: model.maxTokens,
		...model.thinkingLevelMap ? { thinkingLevelMap: { ...model.thinkingLevelMap } } : {},
		...model.headers ? { headers: { ...model.headers } } : {},
		...model.compat ? { compat: { ...model.compat } } : {},
		...model.mediaInput ? { mediaInput: cloneManifestCatalogMediaInput(model.mediaInput) } : {}
	};
}
/**
* Converts a plugin manifest modelCatalog provider into runtime provider config.
*/
function buildManifestModelProviderConfig(params) {
	const catalog = normalizeModelCatalog({ providers: { [params.providerId]: params.catalog } }, { ownedProviders: /* @__PURE__ */ new Set([params.providerId]) })?.providers?.[params.providerId];
	if (!catalog) throw new Error(`Missing modelCatalog.providers.${params.providerId}`);
	if (!catalog.baseUrl) throw new Error(`Missing modelCatalog.providers.${params.providerId}.baseUrl`);
	const rawModelCount = countRawManifestCatalogModels(params.catalog);
	if (rawModelCount !== void 0 && rawModelCount !== catalog.models.length) throw new Error(`Invalid modelCatalog.providers.${params.providerId}.models`);
	return {
		baseUrl: catalog.baseUrl,
		...catalog.api ? { api: catalog.api } : {},
		...catalog.headers ? { headers: { ...catalog.headers } } : {},
		models: catalog.models.map((model) => buildManifestCatalogModel(model, { providerId: params.providerId }))
	};
}
/** Builds runtime provider config from planner-normalized manifest rows. */
function buildEffectiveManifestProviderConfig(rows) {
	const firstRow = rows[0];
	if (!firstRow?.baseUrl || !firstRow.api) return;
	const models = rows.flatMap((row) => !row.contextWindow || !row.maxTokens ? [] : [buildManifestCatalogModel(row, { filterDocument: true })]);
	return models.length > 0 ? {
		baseUrl: firstRow.baseUrl,
		api: firstRow.api,
		models
	} : void 0;
}
/** Projects an ordered family of manifest catalogs into static provider and model surfaces. */
function buildManifestProviderCatalogFamily(params) {
	const entries = params.surfaces.map((surface) => {
		const buildProvider = () => buildManifestModelProviderConfig({
			providerId: surface.id,
			catalog: surface.catalog
		});
		const provider = buildProvider();
		return {
			id: surface.id,
			label: surface.label,
			baseUrl: provider.baseUrl,
			models: provider.models,
			buildProvider
		};
	});
	return {
		entries,
		staticDiscovery: entries.map(({ id, label, buildProvider }) => ({
			id,
			label,
			docsPath: params.docsPath ?? "/providers/models",
			auth: [],
			staticCatalog: {
				order: "simple",
				run: async () => ({ provider: buildProvider() })
			}
		})),
		staticCatalog: async () => ({ providers: Object.fromEntries(entries.map(({ id, buildProvider }) => [id, buildProvider()])) }),
		augmentModelCatalog: () => entries.flatMap(({ id: provider, models }) => models.map((entry) => ({
			provider,
			id: entry.id,
			name: entry.name,
			reasoning: entry.reasoning,
			input: [...entry.input],
			contextWindow: entry.contextWindow
		})))
	};
}
//#endregion
export { buildSingleProviderApiKeyCatalog as a, resolveFirstProviderCatalogAuth as c, buildPairedProviderApiKeyCatalog as i, buildManifestModelProviderConfig as n, findCatalogTemplate as o, buildManifestProviderCatalogFamily as r, readManifestProviderDefaultModelRef as s, buildEffectiveManifestProviderConfig as t };
