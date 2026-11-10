import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Fn as object, Jn as string, Ln as partialRecord, Lt as boolean, Nt as array, Pn as number, Un as record, Yt as discriminatedUnion, nr as tuple, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as MODEL_CATALOG_THINKING_LEVELS, t as MODEL_CATALOG_APIS } from "./model-catalog-types-VH0V5RHR.mjs";
import "./model-catalog-normalize-XcxRiFN_.mjs";
import { n as buildModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { createRequire } from "node:module";
//#region src/model-catalog/bundled-catalog-stamp.ts
const BUILD_INFO_CANDIDATES = [
	"../build-info.json",
	"../../build-info.json",
	"./build-info.json"
];
/** Reads the package build stamp once through Node's JSON module cache. */
function bundledCatalogGeneratedAt(moduleUrl = import.meta.url) {
	const require = createRequire(moduleUrl);
	for (const candidate of BUILD_INFO_CANDIDATES) try {
		const info = require(candidate);
		if (typeof info.builtAt !== "string") continue;
		const generatedAt = Date.parse(info.builtAt);
		if (Number.isFinite(generatedAt) && generatedAt > 0) return generatedAt;
	} catch {}
}
//#endregion
//#region packages/model-catalog-core/src/remote-catalog-bundle.ts
const REMOTE_CATALOG_MAX_FUTURE_SKEW_MS = 864e5;
const stringMapSchema = record(string(), string());
const pricingTierSchema = object({
	input: number().finite().nonnegative(),
	output: number().finite().nonnegative(),
	cacheRead: number().finite().nonnegative(),
	cacheWrite: number().finite().nonnegative(),
	range: union([tuple([number().finite().nonnegative()]), tuple([number().finite().nonnegative(), number().finite().nonnegative()])])
}).strict();
const costSchema = pricingTierSchema.omit({ range: true }).partial().extend({ tieredPricing: array(pricingTierSchema).optional() });
const hostedPricingSchema = costSchema.extend({
	input: pricingTierSchema.shape.input,
	output: pricingTierSchema.shape.output
});
const contextWindowOptionSchema = object({
	id: string().trim().min(1),
	label: string().trim().min(1),
	contextWindow: number().int().positive()
}).strict();
const modelFieldsSchema = object({
	id: string().trim().min(1),
	name: string().optional(),
	api: _enum(MODEL_CATALOG_APIS).optional(),
	baseUrl: string().optional(),
	headers: stringMapSchema.optional(),
	input: array(_enum([
		"text",
		"image",
		"video",
		"document"
	])).optional(),
	reasoning: boolean().optional(),
	contextWindow: number().finite().positive().optional(),
	contextWindows: array(contextWindowOptionSchema).max(16).optional(),
	contextWindowDefault: string().trim().min(1).optional(),
	contextTokens: number().int().positive().optional(),
	maxTokens: number().finite().positive().optional(),
	thinkingLevelMap: partialRecord(_enum(MODEL_CATALOG_THINKING_LEVELS), string().nullable()).optional(),
	cost: costSchema.optional(),
	compat: record(string(), unknown()).optional(),
	mediaInput: record(string(), unknown()).optional(),
	status: _enum([
		"available",
		"preview",
		"deprecated",
		"disabled"
	]).optional(),
	statusReason: string().optional(),
	replaces: array(string()).optional(),
	replacedBy: string().optional(),
	tags: array(string()).optional()
});
function validateContextWindowDefault(model, context) {
	if (model.contextWindowDefault && !model.contextWindows?.some((option) => option.id === model.contextWindowDefault)) context.addIssue({
		code: "custom",
		message: "contextWindowDefault must reference a declared contextWindows option",
		path: ["contextWindowDefault"]
	});
}
const modelSchema = modelFieldsSchema.superRefine(validateContextWindowDefault);
const remoteModelCatalogProviderSchema = object({
	baseUrl: string().optional(),
	api: _enum(MODEL_CATALOG_APIS).optional(),
	headers: stringMapSchema.optional(),
	defaultModel: string().optional(),
	defaultUtilityModel: string().optional(),
	models: array(modelSchema).min(1)
}).strict().superRefine((provider, context) => {
	const seen = /* @__PURE__ */ new Set();
	for (const [index, model] of provider.models.entries()) {
		if (seen.has(model.id)) context.addIssue({
			code: "custom",
			message: `duplicate model id: ${model.id}`,
			path: [
				"models",
				index,
				"id"
			]
		});
		seen.add(model.id);
	}
});
const remoteModelCatalogBundleSchema = object({
	schemaVersion: literal(1),
	generatedAt: number().int().positive().refine((value) => value <= Date.now() + REMOTE_CATALOG_MAX_FUTURE_SKEW_MS, { message: "generatedAt is implausibly far in the future" }),
	minVersion: string().trim().min(1).optional(),
	sourceCommit: string().trim().min(1),
	providers: record(string().trim().min(1), remoteModelCatalogProviderSchema),
	pricing: record(string().trim().min(1), hostedPricingSchema).optional()
}).strict();
const knownPricingV2Schema = costSchema.extend({
	status: literal("known"),
	currency: literal("USD"),
	unit: literal("million_tokens"),
	source: string().trim().min(1).optional()
}).refine((pricing) => pricing.input !== void 0 || pricing.output !== void 0 || pricing.cacheRead !== void 0 || pricing.cacheWrite !== void 0 || Boolean(pricing.tieredPricing?.length), { message: "known pricing must contain rates" });
const pricingV2Schema = discriminatedUnion("status", [knownPricingV2Schema, object({
	status: _enum(["unknown", "unavailable"]),
	source: string().trim().min(1).optional()
}).strict()]);
const sourcedPricingV2Schema = hostedPricingSchema.extend({ source: string().trim().min(1) }).strict();
const upstreamPricingV2Schema = sourcedPricingV2Schema.extend({
	passthroughOnly: literal(true).optional(),
	alternatives: array(sourcedPricingV2Schema).min(1).optional()
}).strict();
const standalonePricingKeySchema = string().regex(/^[^/\s]+\/\S+$/u, "standalone pricing keys must be provider/model");
const modelV2Schema = modelFieldsSchema.omit({
	cost: true,
	baseUrl: true,
	headers: true
}).extend({
	provider: string().trim().min(1),
	pricing: pricingV2Schema
}).strict().superRefine(validateContextWindowDefault);
const remoteModelCatalogBundleV2Schema = remoteModelCatalogBundleSchema.omit({
	providers: true,
	pricing: true
}).extend({
	schemaVersion: literal(2),
	providers: record(string().trim().min(1), object({
		api: _enum(MODEL_CATALOG_APIS).optional(),
		defaultModel: string().optional(),
		defaultUtilityModel: string().optional(),
		recommendedModels: array(string().trim().min(1)).refine((ids) => new Set(ids).size === ids.length, "duplicate recommended model id").optional()
	}).strict()),
	models: array(modelV2Schema).min(1),
	upstreamPricing: record(standalonePricingKeySchema, upstreamPricingV2Schema).optional(),
	providerPricing: record(standalonePricingKeySchema, sourcedPricingV2Schema).optional()
}).superRefine((bundle, context) => {
	const providers = /* @__PURE__ */ new Map();
	for (const [index, model] of bundle.models.entries()) {
		if (!Object.hasOwn(bundle.providers, model.provider)) context.addIssue({
			code: "custom",
			message: `undeclared model provider: ${model.provider}`,
			path: [
				"models",
				index,
				"provider"
			]
		});
		const ids = providers.get(model.provider) ?? /* @__PURE__ */ new Set();
		if (ids.has(model.id)) context.addIssue({
			code: "custom",
			message: `duplicate provider/model: ${model.provider}/${model.id}`,
			path: [
				"models",
				index,
				"id"
			]
		});
		ids.add(model.id);
		providers.set(model.provider, ids);
	}
	for (const [provider, entry] of Object.entries(bundle.providers)) for (const [index, id] of (entry.recommendedModels ?? []).entries()) if (!providers.get(provider)?.has(id)) context.addIssue({
		code: "custom",
		message: `recommended model must reference a model of provider ${provider}: ${id}`,
		path: [
			"providers",
			provider,
			"recommendedModels",
			index
		]
	});
});
function parseRemoteModelCatalogBundleV2(value) {
	return remoteModelCatalogBundleV2Schema.parse(value);
}
function parseRemoteModelCatalogBundle(value) {
	return remoteModelCatalogBundleSchema.parse(value);
}
function stripRemoteTransportOverrides(value) {
	if (Array.isArray(value)) return value.map(stripRemoteTransportOverrides);
	if (!value || typeof value !== "object") return value;
	const entries = Object.entries(value);
	let kept = 0;
	for (const entry of entries) if (entry[0] !== "baseUrl" && entry[0] !== "headers") {
		entry[1] = stripRemoteTransportOverrides(entry[1]);
		entries[kept++] = entry;
	}
	entries.length = kept;
	return Object.fromEntries(entries);
}
/** Removes every transport endpoint/header override before remote data reaches persistence. */
function sanitizeRemoteModelCatalogBundle(bundle) {
	return stripRemoteTransportOverrides(bundle);
}
function validateAndSanitizeRemoteModelCatalogBundle(value) {
	return sanitizeRemoteModelCatalogBundle(parseRemoteModelCatalogBundle(value));
}
function validateAndSanitizeRemoteModelCatalogBundleV2(value) {
	const bundle = parseRemoteModelCatalogBundleV2(value);
	return {
		...bundle,
		models: bundle.models.map((model) => {
			return stripRemoteTransportOverrides(model);
		})
	};
}
//#endregion
//#region src/model-catalog/remote-bundle.ts
/** Configured v1 mirrors remain a public input contract; runtime uses one projection. */
function parseRemoteModelCatalogWireBundle(value) {
	return isRecord(value) && value.schemaVersion === 2 ? validateAndSanitizeRemoteModelCatalogBundleV2(value) : validateAndSanitizeRemoteModelCatalogBundle(value);
}
function projectRemoteModelCatalog(bundle) {
	if (bundle.schemaVersion === 1) return {
		providers: bundle.providers,
		pricing: Object.fromEntries(Object.entries(bundle.pricing ?? {}).map(([key, cost]) => [key, {
			cost,
			explicit: false
		}])),
		upstreamPricing: {}
	};
	const providers = Object.fromEntries(Object.entries(bundle.providers).map(([id, provider]) => [id, {
		...provider,
		models: []
	}]));
	const rowKeys = new Set(bundle.models.map(({ provider, id }) => buildModelCatalogRef(provider, id)));
	const prices = Object.entries(bundle.providerPricing ?? {}).filter(([key]) => !rowKeys.has(key)).map(([key, { source: _source, ...cost }]) => [key, {
		cost,
		explicit: false
	}]);
	for (const { provider, pricing, ...model } of bundle.models) {
		let cost;
		if (pricing.status === "known") {
			const { status: _status, currency: _currency, unit: _unit, source: _source, ...rates } = pricing;
			cost = rates;
			prices.push([buildModelCatalogRef(provider, model.id), {
				cost,
				explicit: true
			}]);
		}
		providers[provider].models.push({
			...model,
			...cost ? { cost } : {}
		});
	}
	return {
		providers,
		pricing: Object.fromEntries(prices),
		upstreamPricing: Object.fromEntries(Object.entries(bundle.upstreamPricing ?? {}).map(([key, { source, passthroughOnly = false, alternatives = [], ...cost }]) => [key, {
			rates: [{
				source,
				cost
			}, ...alternatives.map(({ source: alternative, ...rates }) => ({
				source: alternative,
				cost: rates
			}))],
			passthroughOnly: passthroughOnly || rowKeys.has(key)
		}]))
	};
}
//#endregion
//#region src/model-catalog/remote-config.ts
const DEFAULT_REMOTE_MODEL_CATALOG_URL = "https://catalog.openclaw.ai/models/v2/catalog.json";
const RETIRED_DEFAULT_REMOTE_MODEL_CATALOG_URL = "https://catalog.openclaw.ai/models/v1/catalog.json";
function isRemoteModelCatalogRefreshEnabled(config) {
	return config.models?.catalogRefresh?.enabled !== false;
}
function resolveRemoteCatalogUrl(config) {
	return config.models?.catalogRefresh?.url?.trim() || DEFAULT_REMOTE_MODEL_CATALOG_URL;
}
/** Whether a catalog downloaded from `sourceUrl` may serve the configured source. */
function isRemoteCatalogSourceActive(config, sourceUrl) {
	const url = resolveRemoteCatalogUrl(config);
	return sourceUrl === url || url === DEFAULT_REMOTE_MODEL_CATALOG_URL && sourceUrl === RETIRED_DEFAULT_REMOTE_MODEL_CATALOG_URL;
}
//#endregion
export { projectRemoteModelCatalog as a, parseRemoteModelCatalogWireBundle as i, isRemoteModelCatalogRefreshEnabled as n, bundledCatalogGeneratedAt as o, resolveRemoteCatalogUrl as r, isRemoteCatalogSourceActive as t };
