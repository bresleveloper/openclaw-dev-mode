import { buildLiveModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { ssrfPolicyFromHttpBaseUrlAllowedHostname } from "openclaw/plugin-sdk/ssrf-runtime";
import { asPositiveSafeInteger, normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/kilocode/provider-models.ts
const KILOCODE_BASE_URL = "https://api.kilo.ai/api/gateway/";
const KILOCODE_DEFAULT_MODEL_ID = "kilo-auto/balanced";
const KILOCODE_DEFAULT_MODEL_REF = `kilocode/${KILOCODE_DEFAULT_MODEL_ID}`;
const KILOCODE_DEFAULT_MODEL_NAME = "Auto Balanced";
const KILOCODE_MODEL_CATALOG = [{
	id: KILOCODE_DEFAULT_MODEL_ID,
	name: KILOCODE_DEFAULT_MODEL_NAME,
	input: ["text", "image"],
	reasoning: true
}];
const KILOCODE_DEFAULT_CONTEXT_WINDOW = 1e6;
const KILOCODE_DEFAULT_MAX_TOKENS = 65536;
const KILOCODE_DEFAULT_COST = {
	input: .325,
	output: 1.95,
	cacheRead: .0325,
	cacheWrite: .40625
};
const KILOCODE_MODELS_URL = `${KILOCODE_BASE_URL}models`;
const DISCOVERY_TIMEOUT_MS = 5e3;
function toPricePerMillion(perToken, fallback = 0) {
	const num = Number(perToken);
	return Number.isFinite(num) && num >= 0 ? num * 1e6 : fallback;
}
function parseModality(entry) {
	const modalities = entry.architecture?.input_modalities;
	if (!Array.isArray(modalities)) return ["text"];
	return modalities.some((m) => typeof m === "string" && normalizeLowercaseStringOrEmpty(m) === "image") ? ["text", "image"] : ["text"];
}
function parseReasoning(entry) {
	const params = entry.supported_parameters;
	if (!Array.isArray(params)) return false;
	return params.includes("reasoning") || params.includes("include_reasoning");
}
function toModelDefinition(entry) {
	const fallbackCost = entry.id === "kilo-auto/balanced" ? KILOCODE_DEFAULT_COST : void 0;
	return {
		id: entry.id,
		name: entry.name || entry.id,
		reasoning: parseReasoning(entry),
		input: parseModality(entry),
		cost: {
			input: toPricePerMillion(entry.pricing.prompt, fallbackCost?.input),
			output: toPricePerMillion(entry.pricing.completion, fallbackCost?.output),
			cacheRead: toPricePerMillion(entry.pricing.input_cache_read),
			cacheWrite: toPricePerMillion(entry.pricing.input_cache_write)
		},
		contextWindow: asPositiveSafeInteger(entry.top_provider?.context_length) ?? asPositiveSafeInteger(entry.context_length) ?? 1e6,
		maxTokens: asPositiveSafeInteger(entry.top_provider?.max_completion_tokens) ?? 65536
	};
}
function buildStaticCatalog() {
	return KILOCODE_MODEL_CATALOG.map((model) => ({
		id: model.id,
		name: model.name,
		reasoning: model.reasoning,
		input: model.input,
		cost: KILOCODE_DEFAULT_COST,
		contextWindow: model.contextWindow ?? 1e6,
		maxTokens: model.maxTokens ?? 65536
	}));
}
function asGatewayModelEntry(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Kilocode model list: malformed JSON response");
	const entry = value;
	if (typeof entry.id !== "string" || typeof entry.pricing !== "object" || entry.pricing === null || Array.isArray(entry.pricing)) throw new Error("Kilocode model list: malformed JSON response");
	return value;
}
function readGatewayModelId(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return "";
	const id = value.id;
	return typeof id === "string" ? id.trim() : "";
}
function readGatewayModelRows(body) {
	const data = body?.data;
	if (!Array.isArray(data)) throw new Error("Kilocode model list: malformed JSON response");
	return data;
}
function projectKilocodeModels(rows) {
	const models = [];
	const discoveredIds = /* @__PURE__ */ new Set();
	for (const rawEntry of rows) {
		const id = readGatewayModelId(rawEntry);
		try {
			const entry = asGatewayModelEntry(rawEntry);
			if (!id || discoveredIds.has(id) || entry.architecture?.output_modalities?.includes("image")) continue;
			models.push(toModelDefinition(entry));
			discoveredIds.add(id);
		} catch {}
	}
	for (const staticModel of models.length > 0 ? buildStaticCatalog() : []) if (!discoveredIds.has(staticModel.id)) models.unshift(staticModel);
	return models;
}
async function discoverKilocodeModels(options = {}) {
	return (await buildLiveModelProviderConfig({
		...options,
		providerId: "kilocode",
		endpoint: KILOCODE_MODELS_URL,
		providerConfig: {
			baseUrl: KILOCODE_BASE_URL,
			api: "openai-completions"
		},
		models: buildStaticCatalog(),
		timeoutMs: DISCOVERY_TIMEOUT_MS,
		ttlMs: 0,
		readRows: readGatewayModelRows,
		buildRequestHeaders: () => ({ Accept: "application/json" }),
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(KILOCODE_BASE_URL),
		auditContext: "kilocode.model_discovery",
		projectRows: projectKilocodeModels
	})).models;
}
function buildKilocodeModelDefinition() {
	return {
		id: KILOCODE_DEFAULT_MODEL_ID,
		name: KILOCODE_DEFAULT_MODEL_NAME,
		reasoning: true,
		input: ["text", "image"],
		cost: KILOCODE_DEFAULT_COST,
		contextWindow: KILOCODE_DEFAULT_CONTEXT_WINDOW,
		maxTokens: KILOCODE_DEFAULT_MAX_TOKENS
	};
}
//#endregion
export { KILOCODE_BASE_URL, KILOCODE_DEFAULT_CONTEXT_WINDOW, KILOCODE_DEFAULT_COST, KILOCODE_DEFAULT_MAX_TOKENS, KILOCODE_DEFAULT_MODEL_ID, KILOCODE_DEFAULT_MODEL_NAME, KILOCODE_DEFAULT_MODEL_REF, KILOCODE_MODELS_URL, KILOCODE_MODEL_CATALOG, buildKilocodeModelDefinition, discoverKilocodeModels };
