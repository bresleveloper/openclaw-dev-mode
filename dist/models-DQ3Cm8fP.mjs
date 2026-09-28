import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-BQRtcdBp.mjs";
import { c as withTrustedEnvProxyGuardedFetchMode, i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-DaDnKUnq.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./fetch-runtime-CknSDlAV.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import { t as buildLiveModelProviderConfig } from "./provider-catalog-live-runtime-BAhXMc_e.mjs";
import "./provider-catalog-shared-D7_lTYyN.mjs";
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
const HUGGINGFACE_POLICY_SUFFIXES = ["cheapest", "fastest"];
const HUGGINGFACE_DISCOVERY_TIMEOUT_MS = 3e4;
const HUGGINGFACE_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const HUGGINGFACE_DEFAULT_CONTEXT_WINDOW = 131072;
const HUGGINGFACE_DEFAULT_MAX_TOKENS = 8192;
const HUGGINGFACE_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: "huggingface",
	catalog: HUGGINGFACE_MANIFEST_CATALOG
}).models;
function isHuggingfacePolicyLocked(modelRef) {
	const ref = modelRef.trim();
	return HUGGINGFACE_POLICY_SUFFIXES.some((suffix) => ref.endsWith(`:${suffix}`) || ref === suffix);
}
function isReasoningModelHeuristic(modelId) {
	const lower = normalizeLowercaseStringOrEmpty(modelId);
	return lower.includes("r1") || lower.includes("reason") || lower.includes("thinking") || lower.includes("reasoner") || lower.includes("grok") || lower.includes("qwq");
}
function displayNameFromApiEntry(entry) {
	const fromApi = typeof entry.name === "string" && entry.name.trim() || typeof entry.title === "string" && entry.title.trim() || typeof entry.display_name === "string" && entry.display_name.trim();
	if (fromApi) return fromApi;
	const base = entry.id.split("/").pop() ?? entry.id;
	if (typeof entry.owned_by === "string" && entry.owned_by.trim()) return `${entry.owned_by.trim()}/${base}`;
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
		const model = catalogById.get(id) ?? {
			id,
			name: displayNameFromApiEntry(entry),
			reasoning: isReasoningModelHeuristic(id),
			input: Array.isArray(modalities) && modalities.includes("image") ? ["text", "image"] : ["text"],
			cost: HUGGINGFACE_DEFAULT_COST,
			contextWindow: HUGGINGFACE_DEFAULT_CONTEXT_WINDOW,
			maxTokens: HUGGINGFACE_DEFAULT_MAX_TOKENS
		};
		models.push({
			...model,
			contextWindow: providerContexts.length > 0 ? Math.min(...providerContexts) : model.contextWindow,
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
export { isHuggingfacePolicyLocked as a, discoverHuggingfaceModels as i, HUGGINGFACE_MODEL_CATALOG as n, openclaw_plugin_default as o, HUGGINGFACE_POLICY_SUFFIXES as r, HUGGINGFACE_BASE_URL as t };
