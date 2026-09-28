import { withTrustedEnvProxyGuardedFetchMode } from "openclaw/plugin-sdk/fetch-runtime";
import { parseStrictFiniteNumber } from "openclaw/plugin-sdk/number-runtime";
import { buildLiveModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { asPositiveSafeInteger } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/vercel-ai-gateway/models.ts
const VERCEL_AI_GATEWAY_PROVIDER_ID = "vercel-ai-gateway";
const VERCEL_AI_GATEWAY_BASE_URL = "https://ai-gateway.vercel.sh";
const VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID = "anthropic/claude-opus-4.6";
const VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW = 2e5;
const VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS = 128e3;
const VERCEL_AI_GATEWAY_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const VERCEL_AI_GATEWAY_DISCOVERY_CACHE_TTL_MS = 6e4;
const VERCEL_AI_GATEWAY_DISCOVERY_TIMEOUT_MS = 5e3;
const STATIC_VERCEL_AI_GATEWAY_MODEL_CATALOG = [
	{
		id: "anthropic/claude-opus-4.6",
		name: "Claude Opus 4.6",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 1e6,
		maxTokens: 128e3,
		cost: {
			input: 5,
			output: 25,
			cacheRead: .5,
			cacheWrite: 6.25
		}
	},
	{
		id: "openai/gpt-5.4",
		name: "GPT 5.4",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 2e5,
		maxTokens: 128e3,
		cost: {
			input: 2.5,
			output: 15,
			cacheRead: .25
		}
	},
	{
		id: "openai/gpt-5.4-pro",
		name: "GPT 5.4 Pro",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 2e5,
		maxTokens: 128e3,
		cost: {
			input: 30,
			output: 180,
			cacheRead: 0
		}
	},
	{
		id: "moonshotai/kimi-k2.6",
		name: "Kimi K2.6",
		reasoning: true,
		input: ["text", "image"],
		contextWindow: 262144,
		maxTokens: 262144,
		cost: {
			input: .95,
			output: 4,
			cacheRead: .16
		}
	}
];
function toPerMillionCost(value) {
	const numeric = typeof value === "number" ? value : typeof value === "string" ? parseStrictFiniteNumber(value) : void 0;
	if (numeric === void 0 || numeric < 0) return 0;
	return numeric * 1e6;
}
function normalizeCost(pricing) {
	return {
		input: toPerMillionCost(pricing?.input),
		output: toPerMillionCost(pricing?.output),
		cacheRead: toPerMillionCost(pricing?.input_cache_read),
		cacheWrite: toPerMillionCost(pricing?.input_cache_write)
	};
}
function buildStaticModelDefinition(model) {
	return {
		id: model.id,
		name: model.name,
		reasoning: model.reasoning,
		input: model.input,
		contextWindow: model.contextWindow,
		maxTokens: model.maxTokens,
		cost: {
			...VERCEL_AI_GATEWAY_DEFAULT_COST,
			...model.cost
		}
	};
}
function getStaticFallbackModel(id) {
	const fallback = STATIC_VERCEL_AI_GATEWAY_MODEL_CATALOG.find((model) => model.id === id);
	return fallback ? buildStaticModelDefinition(fallback) : void 0;
}
/** Builds runtime metadata for models returned by the live gateway catalog. */
function resolveVercelAiGatewayDynamicModel(modelId) {
	return getStaticFallbackModel(modelId) ?? {
		id: modelId,
		name: modelId,
		reasoning: false,
		input: ["text"],
		contextWindow: 2e5,
		maxTokens: 128e3,
		cost: VERCEL_AI_GATEWAY_DEFAULT_COST
	};
}
function getStaticVercelAiGatewayModelCatalog() {
	return STATIC_VERCEL_AI_GATEWAY_MODEL_CATALOG.map(buildStaticModelDefinition);
}
function buildDiscoveredModelDefinition(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Vercel AI Gateway model list: malformed JSON response");
	const model = value;
	const id = typeof model.id === "string" ? model.id.trim() : "";
	if (!id || model.type !== void 0 && model.type !== "language") return null;
	const fallback = getStaticFallbackModel(id);
	const contextWindow = asPositiveSafeInteger(model.context_window) ?? fallback?.contextWindow ?? 2e5;
	const maxTokens = asPositiveSafeInteger(model.max_tokens) ?? fallback?.maxTokens ?? 128e3;
	const normalizedCost = normalizeCost(model.pricing);
	return {
		id,
		name: (typeof model.name === "string" ? model.name.trim() : "") || fallback?.name || id,
		reasoning: Array.isArray(model.tags) && model.tags.includes("reasoning") ? true : fallback?.reasoning ?? false,
		input: Array.isArray(model.tags) ? model.tags.includes("vision") ? ["text", "image"] : ["text"] : fallback?.input ?? ["text"],
		contextWindow,
		maxTokens,
		cost: normalizedCost.input > 0 || normalizedCost.output > 0 || normalizedCost.cacheRead > 0 || normalizedCost.cacheWrite > 0 ? normalizedCost : fallback?.cost ?? VERCEL_AI_GATEWAY_DEFAULT_COST
	};
}
async function discoverVercelAiGatewayModels(options = {}) {
	return (await buildLiveModelProviderConfig({
		...options,
		providerId: VERCEL_AI_GATEWAY_PROVIDER_ID,
		endpoint: `${VERCEL_AI_GATEWAY_BASE_URL}/v1/models`,
		providerConfig: {
			baseUrl: VERCEL_AI_GATEWAY_BASE_URL,
			api: "anthropic-messages"
		},
		models: getStaticVercelAiGatewayModelCatalog(),
		timeoutMs: VERCEL_AI_GATEWAY_DISCOVERY_TIMEOUT_MS,
		ttlMs: VERCEL_AI_GATEWAY_DISCOVERY_CACHE_TTL_MS,
		auditContext: "vercel-ai-gateway.models",
		fetchGuard: (params) => fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode(params)),
		projectRows: (rows) => rows.map(buildDiscoveredModelDefinition).filter((entry) => entry !== null)
	})).models;
}
//#endregion
export { VERCEL_AI_GATEWAY_BASE_URL, VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW, VERCEL_AI_GATEWAY_DEFAULT_COST, VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS, VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID, VERCEL_AI_GATEWAY_PROVIDER_ID, discoverVercelAiGatewayModels, getStaticVercelAiGatewayModelCatalog, resolveVercelAiGatewayDynamicModel };
