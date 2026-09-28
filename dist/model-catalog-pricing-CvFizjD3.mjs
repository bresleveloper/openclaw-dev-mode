import { c as asFiniteNumberInRange, d as asPositiveSafeInteger, l as asNonNegativeFiniteNumber, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
const MODEL_PRICING_SOURCES = [
	{
		id: "openCode",
		label: "OpenCode",
		url: "https://models.opencode.ai/api.json",
		authoritative: true
	},
	{
		id: "venice",
		label: "Venice",
		url: "https://api.venice.ai/api/v1/models",
		authoritative: true
	},
	{
		id: "chutes",
		label: "Chutes",
		url: "https://llm.chutes.ai/v1/models",
		authoritative: true
	},
	{
		id: "cerebras",
		label: "Cerebras",
		url: "https://api.cerebras.ai/public/v1/models",
		authoritative: true
	},
	{
		id: "deepinfra",
		label: "DeepInfra",
		url: "https://api.deepinfra.com/models/list",
		authoritative: true
	},
	{
		id: "openRouter",
		label: "OpenRouter",
		url: "https://openrouter.ai/api/v1/models",
		authoritative: false
	},
	{
		id: "liteLLM",
		label: "LiteLLM",
		url: "https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json",
		authoritative: false
	}
];
/** Normalize source policy without deciding which plugin owns the provider. */
function normalizeModelPricingProvider(value) {
	const record = asOptionalRecord(value);
	if (!record) return;
	const policy = typeof record.external === "boolean" ? { external: record.external } : {};
	for (const { id: sourceId } of MODEL_PRICING_SOURCES) {
		const raw = record[sourceId];
		if (raw === false) {
			policy[sourceId] = false;
			continue;
		}
		const row = asOptionalRecord(raw);
		const provider = normalizeProviderId(normalizeOptionalString(row?.provider) ?? "");
		const modelIdTransforms = normalizeTrimmedStringList(row?.modelIdTransforms).filter((entry) => entry === "version-dots");
		const source = {
			...provider ? { provider } : {},
			...row?.passthroughProviderModel === true ? { passthroughProviderModel: true } : {},
			...modelIdTransforms.length > 0 ? { modelIdTransforms } : {}
		};
		if (Object.keys(source).length > 0) policy[sourceId] = source;
	}
	return Object.keys(policy).length > 0 ? policy : void 0;
}
/** Keep unavailable prices distinct from malformed native catalogs and declared rates. */
function normalizeModelPricingCatalog(rows, normalizePricing, { readModelId = (model) => model.id, readPricing = (model) => model.pricing, isSupportedPricing = () => true } = {}) {
	if (!Array.isArray(rows)) return;
	const prices = /* @__PURE__ */ new Map();
	const ids = /* @__PURE__ */ new Set();
	for (const value of rows) {
		const model = asOptionalRecord(value);
		const id = model && normalizeOptionalString(readModelId(model));
		if (!model || !id || ids.has(id)) return;
		ids.add(id);
		const rawPricing = readPricing(model);
		if (rawPricing === void 0) continue;
		const pricing = normalizePricing(rawPricing);
		if (!pricing) return;
		if (isSupportedPricing(rawPricing)) prices.set(id, pricing);
	}
	return prices.size > 0 ? prices : void 0;
}
function readPricingCost(value, source) {
	const row = asOptionalRecord(value);
	const perToken = source === "openRouter";
	const [input, output, cacheRead, cacheWrite] = (perToken ? [
		"prompt",
		"completion",
		"input_cache_read",
		"input_cache_write"
	] : [
		"input",
		"output",
		"cache_read",
		"cache_write"
	]).map((field, index) => {
		const raw = row?.[field];
		if (index >= 2 && raw === void 0) return 0;
		const rate = perToken ? parseStrictFiniteNumber(raw) : asNonNegativeFiniteNumber(raw);
		return rate === void 0 ? void 0 : asNonNegativeFiniteNumber(rate * (perToken ? 1e6 : 1));
	});
	if (input === void 0 || output === void 0 || cacheRead === void 0 || cacheWrite === void 0) return;
	return {
		input,
		output,
		cacheRead,
		cacheWrite
	};
}
function withContextPrices(cost, tiers) {
	if (!cost) return;
	tiers.sort((left, right) => left.size - right.size);
	const firstTier = tiers[0];
	if (!firstTier) return cost;
	const tieredPricing = [{
		...cost,
		range: [0, firstTier.size]
	}];
	for (const [index, tier] of tiers.entries()) {
		if (!tier.cost) return;
		const next = tiers[index + 1]?.size;
		if (next === tier.size) return;
		tieredPricing.push({
			...tier.cost,
			range: next ? [tier.size, next] : [tier.size]
		});
	}
	return {
		...cost,
		tieredPricing
	};
}
const OPENROUTER_PRICE_FIELDS = /* @__PURE__ */ new Set([
	"prompt",
	"completion",
	"request",
	"image",
	"web_search",
	"internal_reasoning",
	"input_cache_read",
	"input_cache_write",
	"audio",
	"input_audio_cache",
	"input_cache_write_1h",
	"image_output",
	"audio_output"
]);
/** Read native OpenRouter per-token prices and static prompt-length overrides. */
function normalizeOpenRouterModelPricing(value) {
	const row = asOptionalRecord(value);
	const overrides = [];
	for (const raw of Array.isArray(row?.overrides) ? row.overrides : []) {
		const override = asOptionalRecord(raw);
		if (!override || Object.keys(override).some((key) => key !== "min_prompt_tokens" && !OPENROUTER_PRICE_FIELDS.has(key))) continue;
		const threshold = asFiniteNumberInRange(override.min_prompt_tokens, {
			min: 0,
			max: Number.MAX_SAFE_INTEGER,
			maxExclusive: true
		});
		if (threshold !== void 0) overrides.push({
			size: Math.floor(threshold) + 1,
			prices: override
		});
	}
	const tiers = [...new Set(overrides.map(({ size }) => size))].map((size) => {
		const prices = { ...row };
		for (const override of overrides) if (size >= override.size) Object.assign(prices, override.prices);
		return {
			size,
			cost: readPricingCost(prices, "openRouter")
		};
	});
	return withContextPrices(readPricingCost(value, "openRouter"), tiers);
}
/** Read upstream per-million prices, preferring modern context tiers over context_over_200k. */
function normalizeUpstreamModelPricing(value) {
	const row = asOptionalRecord(value);
	const tiers = [];
	for (const raw of Array.isArray(row?.tiers) ? row.tiers : []) {
		const price = asOptionalRecord(raw);
		const tier = asOptionalRecord(price?.tier);
		const size = asPositiveSafeInteger(tier?.size);
		if (tier?.type === "context" && size) tiers.push({
			size,
			cost: readPricingCost(price, "upstream")
		});
	}
	if (tiers.length === 0 && asOptionalRecord(row?.context_over_200k)) tiers.push({
		size: 2e5,
		cost: readPricingCost(row?.context_over_200k, "upstream")
	});
	return withContextPrices(readPricingCost(value, "upstream"), tiers);
}
//#endregion
export { normalizeUpstreamModelPricing as a, normalizeOpenRouterModelPricing as i, normalizeModelPricingCatalog as n, normalizeModelPricingProvider as r, MODEL_PRICING_SOURCES as t };
