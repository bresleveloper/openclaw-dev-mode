import { fetchLiveProviderModelRows } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { asFiniteNumberInRange, asOptionalRecord, asPositiveSafeInteger, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/radius/catalog.ts
const RADIUS_BASE_URL = "https://radius.pi.dev/v1";
const THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
function readRates(value) {
	const row = asOptionalRecord(value);
	const input = asFiniteNumberInRange(row?.input, { min: 0 });
	const output = asFiniteNumberInRange(row?.output, { min: 0 });
	const cacheRead = asFiniteNumberInRange(row?.cacheRead, { min: 0 });
	const cacheWrite = asFiniteNumberInRange(row?.cacheWrite, { min: 0 });
	return input !== void 0 && output !== void 0 && cacheRead !== void 0 && cacheWrite !== void 0 ? {
		input,
		output,
		cacheRead,
		cacheWrite
	} : void 0;
}
function readCost(value) {
	const rates = readRates(value);
	if (!rates) return;
	const tiers = asOptionalRecord(value)?.tiers;
	if (tiers === void 0) return rates;
	if (!Array.isArray(tiers)) return;
	const thresholds = [{
		start: 0,
		rates
	}];
	for (const tier of tiers) {
		const tierRates = readRates(tier);
		const threshold = asFiniteNumberInRange(asOptionalRecord(tier)?.inputTokensAbove, { min: 0 });
		if (!tierRates || threshold === void 0 || !Number.isSafeInteger(threshold + 1)) return;
		thresholds.push({
			start: threshold + 1,
			rates: tierRates
		});
	}
	thresholds.sort((left, right) => left.start - right.start);
	if (thresholds.some((tier, index) => index > 0 && tier.start === thresholds[index - 1]?.start)) return;
	return {
		...rates,
		...tiers.length > 0 ? { tieredPricing: thresholds.map((tier, index) => {
			const next = thresholds[index + 1];
			const range = next ? [tier.start, next.start] : [tier.start];
			return Object.assign({}, tier.rates, { range });
		}) } : {}
	};
}
function readModel(value) {
	const row = asOptionalRecord(value);
	const id = normalizeOptionalString(row?.id);
	const name = normalizeOptionalString(row?.name);
	const cost = readCost(row?.cost);
	const contextWindow = asPositiveSafeInteger(row?.contextWindow);
	const maxTokens = asPositiveSafeInteger(row?.maxTokens);
	if (!row || !id || !name || !cost || !contextWindow || !maxTokens || row.enabled === false || typeof row.reasoning !== "boolean" || !Array.isArray(row.input) || row.input.length === 0 || row.input.some((input) => input !== "text" && input !== "image")) return;
	const input = row.input.filter((item) => item === "text" || item === "image");
	let thinkingLevelMap;
	if (row.thinkingLevelMap !== void 0) {
		const levels = asOptionalRecord(row.thinkingLevelMap);
		if (!levels) return;
		thinkingLevelMap = {};
		for (const level of THINKING_LEVELS) {
			const mapped = levels[level];
			if (mapped !== void 0) {
				if (mapped !== null && typeof mapped !== "string") return;
				thinkingLevelMap[level] = mapped;
			}
		}
	}
	return {
		id,
		name,
		reasoning: row.reasoning,
		input,
		cost,
		contextWindow,
		maxTokens,
		...thinkingLevelMap ? { thinkingLevelMap } : {}
	};
}
async function fetchRadiusCatalog(apiKey, signal) {
	const documents = await fetchLiveProviderModelRows({
		providerId: "radius",
		endpoint: `${RADIUS_BASE_URL}/config`,
		discoveryApiKey: apiKey,
		signal,
		requireHttps: true,
		readRows: (body) => [body]
	});
	const config = asOptionalRecord(documents[0]);
	const baseUrl = normalizeOptionalString(config?.baseUrl);
	if (!baseUrl || !Array.isArray(config?.models)) throw new Error("Invalid Radius catalog: expected baseUrl and models");
	const endpoint = new URL(baseUrl);
	if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) throw new Error("Invalid Radius catalog base URL");
	return {
		baseUrl: baseUrl.replace(/\/+$/u, ""),
		api: "pi-messages",
		models: config.models.map(readModel).filter((model) => model !== void 0)
	};
}
//#endregion
export { RADIUS_BASE_URL, fetchRadiusCatalog };
