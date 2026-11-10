import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { o as resolveDefaultModelMaxTokens } from "./defaults-Bg930vxE.mjs";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-D0GOHaAj.mjs";
import { h as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-K50Tjeok.mjs";
import { i as fetchWithSsrFGuard, s as withTrustedEnvProxyGuardedFetchMode } from "./fetch-guard-DRapCKeS.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./fetch-runtime-Dg4wMDiG.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./provider-model-shared-B_4afNJ5.mjs";
import "./ssrf-runtime-z2wN0VZP.mjs";
import { t as buildLiveModelProviderConfig, y as readLiveModelCatalogStringField } from "./provider-catalog-live-runtime-BILEsjga.mjs";
import "./provider-catalog-shared-Di2nlF3g.mjs";
//#region extensions/huggingface/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "huggingface",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["huggingface"],
	modelCatalog: {
		"providers": { "huggingface": {
			"baseUrl": "https://router.huggingface.co/v1",
			"api": "openai-completions",
			"models": [
				{
					"id": "deepseek-ai/DeepSeek-R1",
					"name": "DeepSeek R1",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 131072,
					"maxTokens": 8192,
					"cost": {
						"input": 3,
						"output": 7,
						"cacheRead": 3,
						"cacheWrite": 3
					}
				},
				{
					"id": "deepseek-ai/DeepSeek-V3.1",
					"name": "DeepSeek V3.1",
					"reasoning": false,
					"input": ["text"],
					"contextWindow": 131072,
					"maxTokens": 8192,
					"cost": {
						"input": .6,
						"output": 1.25,
						"cacheRead": .6,
						"cacheWrite": .6
					}
				},
				{
					"id": "openai/gpt-oss-120b",
					"name": "GPT-OSS 120B",
					"reasoning": false,
					"input": ["text"],
					"contextWindow": 131072,
					"maxTokens": 8192,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					}
				}
			]
		} },
		"discovery": { "huggingface": "refreshable" }
	},
	modelIdNormalization: { "providers": { "huggingface": { "stripPrefixes": ["huggingface/"] } } },
	setup: { "providers": [{
		"id": "huggingface",
		"envVars": ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"]
	}] },
	providerAuthChoices: [{
		"provider": "huggingface",
		"method": "api-key",
		"choiceId": "huggingface-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Hugging Face API key",
		"choiceHint": "Inference API (HF token)",
		"groupId": "huggingface",
		"groupLabel": "Hugging Face",
		"groupHint": "Inference API (HF token)",
		"optionKey": "huggingfaceApiKey",
		"cliFlag": "--huggingface-api-key",
		"cliOption": "--huggingface-api-key <key>",
		"cliDescription": "Hugging Face API key (HF token)"
	}],
	configGroups: [{
		"id": "model-discovery",
		"title": "Model discovery",
		"order": 10,
		"properties": ["discovery"]
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": { "discovery": {
			"type": "object",
			"additionalProperties": false,
			"properties": { "enabled": { "type": "boolean" } }
		} }
	},
	uiHints: {
		"discovery": {
			"label": "Model Discovery",
			"help": "Plugin-owned controls for Hugging Face model auto-discovery."
		},
		"discovery.enabled": {
			"label": "Enable Discovery",
			"help": "When false, OpenClaw keeps the Hugging Face plugin available but skips implicit startup discovery from ambient Hugging Face credentials."
		}
	}
};
//#endregion
//#region extensions/huggingface/models.ts
const HUGGINGFACE_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.huggingface;
const HUGGINGFACE_BASE_URL = HUGGINGFACE_MANIFEST_CATALOG.baseUrl;
const HUGGINGFACE_DISCOVERY_TIMEOUT_MS = 3e4;
const HUGGINGFACE_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const HUGGINGFACE_DEFAULT_CONTEXT_WINDOW = 131072;
const HUGGINGFACE_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: "huggingface",
	catalog: HUGGINGFACE_MANIFEST_CATALOG
}).models;
function isReasoningModelHeuristic(modelId) {
	const lower = normalizeLowercaseStringOrEmpty(modelId);
	return [
		"r1",
		"reason",
		"thinking",
		"grok",
		"qwq"
	].some((hint) => lower.includes(hint));
}
function displayNameFromApiEntry(entry) {
	const fromApi = readLiveModelCatalogStringField(entry, [
		"name",
		"title",
		"display_name"
	]);
	if (fromApi) return fromApi;
	const base = entry.id.split("/").pop() ?? entry.id;
	const owner = readLiveModelCatalogStringField(entry, "owned_by");
	if (owner) return `${owner}/${base}`;
	return base.replace(/-/g, " ").replace(/\b(\w)/g, (c) => c.toUpperCase());
}
function readHuggingfaceModelRows(body) {
	const data = body?.data;
	if (!Array.isArray(data)) throw new Error("Hugging Face model discovery response must contain a data array");
	return data;
}
function projectHuggingfaceModels(rows) {
	const catalogById = new Map(HUGGINGFACE_MODEL_CATALOG.map((model) => [model.id, model]));
	const seen = /* @__PURE__ */ new Set();
	const models = [];
	for (const row of rows) {
		const entry = row;
		const id = typeof entry?.id === "string" ? entry.id.trim() : "";
		if (!entry || !id || seen.has(id)) continue;
		seen.add(id);
		const modalities = entry?.architecture?.input_modalities;
		const providers = Array.isArray(entry?.providers) ? entry.providers.filter((provider) => provider?.status !== "error") : [];
		const providerContexts = providers.map((provider) => provider?.context_length).filter((context) => typeof context === "number" && context > 0);
		const servedContextWindow = providerContexts.length > 0 ? Math.min(...providerContexts) : void 0;
		const model = catalogById.get(id) ?? {
			id,
			name: displayNameFromApiEntry(entry),
			reasoning: isReasoningModelHeuristic(id),
			input: Array.isArray(modalities) && modalities.includes("image") ? ["text", "image"] : ["text"],
			cost: HUGGINGFACE_DEFAULT_COST,
			contextWindow: HUGGINGFACE_DEFAULT_CONTEXT_WINDOW,
			maxTokens: resolveDefaultModelMaxTokens(servedContextWindow ?? HUGGINGFACE_DEFAULT_CONTEXT_WINDOW)
		};
		models.push({
			...model,
			contextWindow: servedContextWindow ?? model.contextWindow,
			...providers.some((provider) => provider?.supports_tools === false) ? { compat: {
				...model.compat,
				supportsTools: false
			} } : {}
		});
	}
	return models;
}
async function discoverHuggingfaceModels(apiKey, timeoutMs = HUGGINGFACE_DISCOVERY_TIMEOUT_MS, options = {}) {
	const trimmedKey = apiKey?.trim();
	if (!trimmedKey) return HUGGINGFACE_MODEL_CATALOG.map((model) => Object.assign({}, model));
	const requestTimeoutMs = resolveTimerTimeoutMs(timeoutMs, HUGGINGFACE_DISCOVERY_TIMEOUT_MS);
	return (await buildLiveModelProviderConfig({
		...options,
		providerId: "huggingface",
		endpoint: `${HUGGINGFACE_BASE_URL}/models`,
		providerConfig: {
			baseUrl: HUGGINGFACE_BASE_URL,
			api: "openai-completions"
		},
		models: HUGGINGFACE_MODEL_CATALOG.map((model) => Object.assign({}, model)),
		discoveryApiKey: trimmedKey,
		signal: AbortSignal.timeout(requestTimeoutMs),
		timeoutMs: requestTimeoutMs,
		ttlMs: 0,
		readRows: readHuggingfaceModelRows,
		buildRequestHeaders: () => ({
			Authorization: `Bearer ${trimmedKey}`,
			"Content-Type": "application/json"
		}),
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(HUGGINGFACE_BASE_URL),
		auditContext: "huggingface-model-discovery",
		fetchGuard: (params) => fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode(params)),
		projectRows: projectHuggingfaceModels
	})).models;
}
//#endregion
export { openclaw_plugin_default as i, HUGGINGFACE_MODEL_CATALOG as n, discoverHuggingfaceModels as r, HUGGINGFACE_BASE_URL as t };
