import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import { buildLiveModelProviderConfig, readLiveModelCatalogStringField } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { ssrfPolicyFromHttpBaseUrlAllowedHostname } from "openclaw/plugin-sdk/ssrf-runtime";
import { asPositiveSafeInteger, isRecord, normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/kilocode/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "kilocode",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["kilocode"],
	modelPricing: { "providers": { "kilocode": {
		"modelsDev": { "passthroughProviderModel": true },
		"openRouter": { "passthroughProviderModel": true },
		"liteLLM": { "passthroughProviderModel": true }
	} } },
	setup: { "providers": [{
		"id": "kilocode",
		"envVars": ["KILOCODE_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "kilocode",
		"method": "api-key",
		"choiceId": "kilocode-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Kilo Gateway API key",
		"choiceHint": "API key (OpenRouter-compatible)",
		"groupId": "kilocode",
		"groupLabel": "Kilo Gateway",
		"groupHint": "API key (OpenRouter-compatible)",
		"optionKey": "kilocodeApiKey",
		"cliFlag": "--kilocode-api-key",
		"cliOption": "--kilocode-api-key <key>",
		"cliDescription": "Kilo Gateway API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	},
	modelCatalog: {
		"modelsDev": { "kilocode": "kilo" },
		"providers": { "kilocode": {
			"baseUrl": "https://api.kilo.ai/api/gateway/",
			"api": "openai-completions",
			"models": [{
				"id": "kilo-auto/balanced",
				"name": "Auto Balanced",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": .325,
					"output": 1.95,
					"cacheRead": .0325,
					"cacheWrite": .40625
				},
				"contextWindow": 1e6,
				"maxTokens": 65536
			}]
		} },
		"discovery": { "kilocode": "refreshable" }
	}
};
//#endregion
//#region extensions/kilocode/provider-models.ts
const KILOCODE_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.kilocode;
const KILOCODE_DEFAULT_MODEL = buildManifestModelProviderConfig({
	providerId: "kilocode",
	catalog: KILOCODE_MANIFEST_CATALOG
}).models[0];
const KILOCODE_BASE_URL = KILOCODE_MANIFEST_CATALOG.baseUrl;
const KILOCODE_DEFAULT_MODEL_ID = KILOCODE_DEFAULT_MODEL.id;
const KILOCODE_DEFAULT_MODEL_REF = `kilocode/${KILOCODE_DEFAULT_MODEL_ID}`;
const KILOCODE_DEFAULT_MODEL_NAME = KILOCODE_DEFAULT_MODEL.name;
const KILOCODE_MODEL_CATALOG = [{
	id: KILOCODE_DEFAULT_MODEL_ID,
	name: KILOCODE_DEFAULT_MODEL_NAME,
	input: ["text", "image"],
	reasoning: true
}];
const KILOCODE_DEFAULT_CONTEXT_WINDOW = KILOCODE_DEFAULT_MODEL.contextWindow;
const KILOCODE_DEFAULT_MAX_TOKENS = KILOCODE_DEFAULT_MODEL.maxTokens;
const KILOCODE_DEFAULT_COST = KILOCODE_DEFAULT_MODEL.cost;
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
	const fallbackCost = entry.id === KILOCODE_DEFAULT_MODEL_ID ? KILOCODE_DEFAULT_COST : void 0;
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
		contextWindow: asPositiveSafeInteger(entry.top_provider?.context_length) ?? asPositiveSafeInteger(entry.context_length) ?? KILOCODE_DEFAULT_CONTEXT_WINDOW,
		maxTokens: asPositiveSafeInteger(entry.top_provider?.max_completion_tokens) ?? KILOCODE_DEFAULT_MAX_TOKENS
	};
}
function buildStaticCatalog() {
	return KILOCODE_MODEL_CATALOG.map((model) => ({
		id: model.id,
		name: model.name,
		reasoning: model.reasoning,
		input: model.input,
		cost: KILOCODE_DEFAULT_COST,
		contextWindow: model.contextWindow ?? KILOCODE_DEFAULT_CONTEXT_WINDOW,
		maxTokens: model.maxTokens ?? KILOCODE_DEFAULT_MAX_TOKENS
	}));
}
function asGatewayModelEntry(value) {
	if (!isRecord(value)) throw new Error("Kilocode model list: malformed JSON response");
	const entry = value;
	if (typeof entry.id !== "string" || !isRecord(entry.pricing)) throw new Error("Kilocode model list: malformed JSON response");
	return entry;
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
		const id = readLiveModelCatalogStringField(rawEntry, "id");
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
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(KILOCODE_BASE_URL),
		auditContext: "kilocode.model_discovery",
		projectRows: projectKilocodeModels
	})).models;
}
function buildKilocodeModelDefinition() {
	return {
		...KILOCODE_DEFAULT_MODEL,
		input: [...KILOCODE_DEFAULT_MODEL.input]
	};
}
//#endregion
export { KILOCODE_DEFAULT_MODEL_ID as a, KILOCODE_MODELS_URL as c, discoverKilocodeModels as d, openclaw_plugin_default as f, KILOCODE_DEFAULT_MAX_TOKENS as i, KILOCODE_MODEL_CATALOG as l, KILOCODE_DEFAULT_CONTEXT_WINDOW as n, KILOCODE_DEFAULT_MODEL_NAME as o, KILOCODE_DEFAULT_COST as r, KILOCODE_DEFAULT_MODEL_REF as s, KILOCODE_BASE_URL as t, buildKilocodeModelDefinition as u };
