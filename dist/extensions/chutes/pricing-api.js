import { asFiniteNumberInRange, asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeModelPricingCatalog } from "openclaw/plugin-sdk/model-catalog-pricing";
//#region extensions/chutes/pricing-api.ts
/** Chutes publishes numeric USD-per-million rates, not OpenRouter's per-token strings. */
function normalizeChutesModelPricing(value) {
	const pricing = asOptionalRecord(value);
	const input = asFiniteNumberInRange(pricing?.prompt, { min: 0 });
	const output = asFiniteNumberInRange(pricing?.completion, { min: 0 });
	const cacheRead = pricing?.input_cache_read === void 0 ? 0 : asFiniteNumberInRange(pricing.input_cache_read, { min: 0 });
	if (input === void 0 || output === void 0 || cacheRead === void 0) return;
	return {
		input,
		output,
		cacheRead,
		cacheWrite: 0
	};
}
function parseChutesPricingCatalog(payload) {
	return normalizeModelPricingCatalog(asOptionalRecord(payload)?.data, normalizeChutesModelPricing);
}
//#endregion
export { normalizeChutesModelPricing, parseChutesPricingCatalog };
