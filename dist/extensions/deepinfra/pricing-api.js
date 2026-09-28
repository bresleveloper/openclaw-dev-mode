import { asFiniteNumberInRange, asOptionalRecord, asPositiveSafeInteger } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeModelPricingCatalog } from "openclaw/plugin-sdk/model-catalog-pricing";
//#region extensions/deepinfra/pricing-api.ts
function normalizeDeepInfraTokenPricing(value) {
	const row = asOptionalRecord(value);
	if (!row || row.type !== void 0 && row.type !== "tokens") return;
	const discount = asFiniteNumberInRange(row.discount ?? 0, {
		min: 0,
		max: 1
	});
	const inputCents = asFiniteNumberInRange(row.cents_per_input_token, { min: 0 });
	const outputCents = asFiniteNumberInRange(row.cents_per_output_token, { min: 0 });
	const cacheRatio = asFiniteNumberInRange(row.rate_per_input_token_cached ?? 0, { min: 0 });
	const table = row.table == null ? void 0 : asOptionalRecord(row.table);
	const explicitWrites = row.rate_per_explicit_cache_write_token;
	const writeRates = explicitWrites == null ? void 0 : asOptionalRecord(explicitWrites);
	if (discount === void 0 || inputCents === void 0 || outputCents === void 0 || cacheRatio === void 0 || row.full != null && typeof row.full !== "string" || row.table != null && !table || row.discount_ends_at != null && !Number.isSafeInteger(row.discount_ends_at) || [
		"rate_per_input_token_cache_write",
		"rate_per_service_tier_priority",
		"rate_per_service_tier_flex"
	].some((key) => row[key] != null && asFiniteNumberInRange(row[key], { min: 0 }) === void 0) || explicitWrites != null && (!writeRates || Object.values(writeRates).some((rate) => asFiniteNumberInRange(rate, { min: 0 }) === void 0)) || row.explicit_cache_granularity_tokens != null && asPositiveSafeInteger(row.explicit_cache_granularity_tokens) === void 0) return;
	const input = inputCents * 1e4 * (1 - discount);
	const output = outputCents * 1e4 * (1 - discount);
	const cacheRead = input * cacheRatio;
	return [
		input,
		output,
		cacheRead
	].every(Number.isFinite) ? {
		input,
		output,
		cacheRead,
		cacheWrite: 0
	} : void 0;
}
/** Pure native price owner shared by hosted publication and chat discovery. */
function parseDeepInfraPricingCatalog(payload) {
	return normalizeModelPricingCatalog(payload, normalizeDeepInfraTokenPricing, {
		readModelId: (model) => model.model_name,
		readPricing: (model) => {
			const pricing = asOptionalRecord(model.pricing);
			return typeof pricing?.type === "string" && pricing.type !== "tokens" ? void 0 : model.pricing;
		},
		isSupportedPricing: (value) => {
			const row = asOptionalRecord(value);
			return row !== void 0 && !row.full && Object.keys(asOptionalRecord(row.table) ?? {}).length === 0 && row.discount_ends_at == null && row.rate_per_input_token_cache_write == null;
		}
	});
}
//#endregion
export { parseDeepInfraPricingCatalog };
