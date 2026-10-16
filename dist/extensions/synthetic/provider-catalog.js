import { SYNTHETIC_BASE_URL, SYNTHETIC_MODEL_CATALOG, buildSyntheticModelDefinition } from "./models.js";
import { asOptionalRecord, asPositiveSafeInteger, filterStringEntries, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/synthetic/provider-catalog.ts
function buildSyntheticProvider() {
	return {
		baseUrl: SYNTHETIC_BASE_URL,
		api: "anthropic-messages",
		models: SYNTHETIC_MODEL_CATALOG.map(buildSyntheticModelDefinition)
	};
}
function readTokenPrice(value) {
	const raw = normalizeOptionalString(value)?.replace(/^\$/, "");
	const price = raw ? Number(raw) * 1e6 : NaN;
	return Number.isFinite(price) && price >= 0 ? Number(price.toFixed(9)) : void 0;
}
function projectSyntheticModels(rows, fallback) {
	const seeds = new Map(fallback.models.map((model) => [model.id, model]));
	const models = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const record = asOptionalRecord(row);
		const id = normalizeOptionalString(record?.id);
		const contextWindow = asPositiveSafeInteger(record?.context_length);
		const input = filterStringEntries(record?.input_modalities);
		if (!record || !id || id.length > 512 || /[\s\p{Cc}]/u.test(id) || !contextWindow || !input.includes("text") || !filterStringEntries(record.output_modalities).includes("text") || record.deprecated === true || record.active === false) continue;
		const seed = seeds.get(id);
		const features = filterStringEntries(record.supported_features);
		const efforts = filterStringEntries(asOptionalRecord(record.reasoning_parameters)?.efforts);
		const pricing = asOptionalRecord(record.pricing);
		models.set(id, {
			...seed,
			id,
			name: normalizeOptionalString(record.name) ?? id,
			reasoning: features.includes("reasoning") || efforts.some((effort) => effort !== "none"),
			input: input.includes("image") ? ["text", "image"] : ["text"],
			contextWindow,
			maxTokens: Math.min(asPositiveSafeInteger(record.max_output_length) ?? seed?.maxTokens ?? 8192, contextWindow),
			cost: {
				input: readTokenPrice(pricing?.prompt) ?? seed?.cost.input ?? 0,
				output: readTokenPrice(pricing?.completion) ?? seed?.cost.output ?? 0,
				cacheRead: readTokenPrice(pricing?.input_cache_reads) ?? seed?.cost.cacheRead ?? 0,
				cacheWrite: readTokenPrice(pricing?.input_cache_writes) ?? seed?.cost.cacheWrite ?? 0
			},
			...Array.isArray(record.supported_features) ? { compat: {
				...seed?.compat,
				supportsTools: features.includes("tools")
			} } : {}
		});
	}
	return [...models.values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
const SYNTHETIC_MODEL_DISCOVERY = {
	endpointUrl: {
		url: "https://api.synthetic.new/openai/v1/models",
		requireBaseUrl: SYNTHETIC_BASE_URL
	},
	projectRows: projectSyntheticModels
};
//#endregion
export { SYNTHETIC_MODEL_DISCOVERY, buildSyntheticProvider };
