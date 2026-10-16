import { normalizeModelPricingCatalog, normalizeOpenRouterModelPricing } from "openclaw/plugin-sdk/model-catalog-pricing";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/cerebras/pricing-api.ts
function parseCerebrasPricingCatalog(payload) {
	return normalizeModelPricingCatalog(asOptionalRecord(payload)?.data, normalizeOpenRouterModelPricing);
}
//#endregion
export { parseCerebrasPricingCatalog };
