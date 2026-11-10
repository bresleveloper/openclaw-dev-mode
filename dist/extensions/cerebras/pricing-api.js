import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeModelPricingCatalog, normalizeOpenRouterModelPricing } from "openclaw/plugin-sdk/model-catalog-pricing";
//#region extensions/cerebras/pricing-api.ts
function normalizeCerebrasModelPricing(value) {
	const pricing = asOptionalRecord(value);
	return pricing ? normalizeOpenRouterModelPricing({
		...pricing,
		input_cache_read: pricing.input_cache_read ?? pricing.prompt
	}) : void 0;
}
function parseCerebrasPricingCatalog(payload) {
	return normalizeModelPricingCatalog(asOptionalRecord(payload)?.data, normalizeCerebrasModelPricing);
}
//#endregion
export { normalizeCerebrasModelPricing, parseCerebrasPricingCatalog };
