import { asFiniteNumberInRange, asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeModelPricingCatalog } from "openclaw/plugin-sdk/model-catalog-pricing";
//#region extensions/venice/pricing-api.ts
function readVeniceRates(value) {
	const row = asOptionalRecord(value);
	const [input, output, cacheRead, cacheWrite] = [
		"input",
		"output",
		"cache_input",
		"cache_write"
	].map((field, index) => {
		if (index >= 2 && row?.[field] === void 0) return 0;
		return asFiniteNumberInRange(asOptionalRecord(row?.[field])?.usd, { min: 0 });
	});
	if (input === void 0 || output === void 0 || cacheRead === void 0 || cacheWrite === void 0) return;
	return {
		input,
		output,
		cacheRead,
		cacheWrite
	};
}
/** Venice's public /models prices are USD per million tokens, for the whole request. */
function parseVeniceModelPricing(value) {
	const row = asOptionalRecord(value);
	const base = readVeniceRates(row);
	if (!base || row?.extended === void 0) return base;
	const extended = asOptionalRecord(row.extended);
	const rates = readVeniceRates(extended);
	const threshold = asFiniteNumberInRange(extended?.context_token_threshold, {
		min: 0,
		max: Number.MAX_SAFE_INTEGER,
		maxExclusive: true
	});
	if (!rates || threshold === void 0) return;
	if (["cache_input", "cache_write"].some((field) => row[field] !== void 0 && extended?.[field] === void 0)) return;
	const start = Math.floor(threshold) + 1;
	return {
		...base,
		tieredPricing: [{
			...base,
			range: [0, start]
		}, {
			...rates,
			range: [start]
		}]
	};
}
/** Public lightweight publisher entrypoint; vendor payload interpretation stays in this plugin. */
function parseVenicePricingCatalog(payload) {
	return normalizeModelPricingCatalog(asOptionalRecord(payload)?.data, parseVeniceModelPricing, { readPricing: (model) => model.type === "text" ? asOptionalRecord(model.model_spec)?.pricing : void 0 });
}
//#endregion
export { parseVeniceModelPricing, parseVenicePricingCatalog };
