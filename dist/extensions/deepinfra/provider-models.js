import { DEEPINFRA_BASE_URL } from "./media-models.js";
import { DEEPINFRA_MODEL_CATALOG, buildDeepInfraModelDefinition } from "./provider-static-catalog.js";
import { parseDeepInfraPricingCatalog } from "./pricing-api.js";
import { resolveDefaultModelMaxTokens } from "openclaw/plugin-sdk/provider-model-shared";
import { asPositiveSafeInteger, isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { fetchLiveProviderModelRows } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { getCachedLiveCatalogValue } from "openclaw/plugin-sdk/provider-catalog-shared";
import { isStringArray } from "openclaw/plugin-sdk/collection-input-runtime";
import { withTrustedEnvProxyGuardedFetchMode } from "openclaw/plugin-sdk/fetch-runtime";
import { isProviderApiKeyConfiguredAsync } from "openclaw/plugin-sdk/provider-auth";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
// extensions/deepinfra/provider-models.ts
const log = createSubsystemLogger("deepinfra-models");
const DEEPINFRA_MODELS_URL = `${DEEPINFRA_BASE_URL}/models?sort_by=openclaw&filter=with_meta`;
const DEEPINFRA_PRICING_URL = "https://api.deepinfra.com/models/list";
const DEEPINFRA_DEFAULT_CONTEXT_WINDOW = 128e3;
const DISCOVERY_TIMEOUT_MS = 5e3;
const DISCOVERY_CACHE_TTL_MS = 3e5;
function entryToSurfaceModel(entry) {
	const id = typeof entry?.id === "string" ? entry.id.trim() : "";
	if (!id) return null;
	const metadata = entry.metadata;
	if (metadata === null) return null;
	if (!isRecord(metadata) || !isStringArray(metadata.tags)) throw new Error("DeepInfra model metadata discovery unavailable.");
	return {
		id,
		name: id,
		tags: metadata.tags,
		contextWindow: asPositiveSafeInteger(metadata.context_length),
		maxTokens: asPositiveSafeInteger(metadata.max_tokens)
	};
}
function chatSurfaceModelToModelDefinition(model) {
	const manifestModel = DEEPINFRA_MODEL_CATALOG.find((entry) => entry.id === model.id);
	const input = model.tags.includes("vlm") ? ["text", "image"] : ["text"];
	const reasoning = model.tags.includes("reasoning") || model.tags.includes("reasoning_effort");
	return {
		id: model.id,
		name: model.name,
		reasoning: manifestModel?.reasoning ?? reasoning,
		input,
		...manifestModel?.compat ? { compat: manifestModel.compat } : {},
		contextWindow: model.contextWindow ?? DEEPINFRA_DEFAULT_CONTEXT_WINDOW,
		maxTokens: model.maxTokens ?? resolveDefaultModelMaxTokens(model.contextWindow ?? DEEPINFRA_DEFAULT_CONTEXT_WINDOW)
	};
}
async function canDiscoverDeepInfra(options) {
	if (options?.hasApiKey !== void 0) return options.hasApiKey;
	const fromEnv = (options?.env ?? process.env).DEEPINFRA_API_KEY;
	return Boolean(fromEnv?.trim()) || await isProviderApiKeyConfiguredAsync({
		provider: "deepinfra",
		agentDir: options?.agentDir
	});
}
async function discoverDeepInfraSurfaces(options) {
	if (await canDiscoverDeepInfra(options)) try {
		return await loadDeepInfraSurfaces();
	} catch (error) {
		log.warn(`Model metadata discovery unavailable: ${String(error)}`);
	}
	return null;
}
async function loadDeepInfraSurfaces() {
	return getCachedLiveCatalogValue({
		keyParts: [
			"deepinfra",
			"surfaces",
			DEEPINFRA_MODELS_URL
		],
		ttlMs: DISCOVERY_CACHE_TTL_MS,
		load: async () => {
			const data = await fetchLiveProviderModelRows({
				providerId: "deepinfra",
				endpoint: DEEPINFRA_MODELS_URL,
				timeoutMs: DISCOVERY_TIMEOUT_MS,
				auditContext: "deepinfra-model-discovery",
				fetchGuard: (params) => fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode(params))
			});
			const seenIds = /* @__PURE__ */ new Set();
			const surfaceModels = [];
			for (const entry of data) {
				const model = entryToSurfaceModel(entry);
				if (!model || seenIds.has(model.id)) continue;
				seenIds.add(model.id);
				surfaceModels.push(model);
			}
			if (data.length > 0 && surfaceModels.length === 0) throw new Error("DeepInfra model metadata discovery unavailable.");
			const catalog = {
				chat: [],
				vlm: [],
				imageGen: [],
				videoGen: []
			};
			const buckets = /* @__PURE__ */ new Map([
				["chat", catalog.chat],
				["vlm", catalog.vlm],
				["image-gen", catalog.imageGen],
				["video-gen", catalog.videoGen]
			]);
			for (const model of surfaceModels) for (const tag of new Set(model.tags)) buckets.get(tag)?.push(model);
			return catalog;
		}
	});
}
async function discoverDeepInfraPricing() {
	return await getCachedLiveCatalogValue({
		keyParts: [
			"deepinfra",
			"native-pricing",
			DEEPINFRA_PRICING_URL
		],
		ttlMs: DISCOVERY_CACHE_TTL_MS,
		load: async () => {
			const rows = await fetchLiveProviderModelRows({
				providerId: "deepinfra",
				endpoint: DEEPINFRA_PRICING_URL,
				timeoutMs: DISCOVERY_TIMEOUT_MS,
				auditContext: "deepinfra-pricing-discovery",
				fetchGuard: (params) => fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode(params)),
				readRows: (body) => {
					if (!Array.isArray(body)) throw new Error("Native DeepInfra pricing response must be an array");
					return body;
				}
			});
			const prices = parseDeepInfraPricingCatalog(rows);
			if (!prices) throw new Error("Native DeepInfra pricing is malformed or has no usable schedules");
			return prices;
		}
	});
}
async function discoverDeepInfraModels(options) {
	if (!await canDiscoverDeepInfra(options)) return DEEPINFRA_MODEL_CATALOG.map(buildDeepInfraModelDefinition);
	const strict = options?.discoveryMode !== "advisory";
	const [metadata, pricing] = await Promise.allSettled([loadDeepInfraSurfaces(), discoverDeepInfraPricing()]);
	if (metadata.status === "rejected") {
		if (strict) throw metadata.reason;
		if (pricing.status === "rejected") return DEEPINFRA_MODEL_CATALOG.map(buildDeepInfraModelDefinition);
	}
	const catalog = metadata.status === "fulfilled" ? metadata.value : void 0;
	const chatModels = catalog ? catalog.chat.length > 0 ? catalog.chat : catalog.vlm : [];
	if (strict && chatModels.length === 0) return [];
	if (strict && pricing.status === "rejected") throw pricing.reason;
	const prices = pricing.status === "fulfilled" ? pricing.value : void 0;
	const models = chatModels.map(chatSurfaceModelToModelDefinition);
	if (!strict) {
		const discovered = new Set(models.map((model) => model.id));
		models.push(...DEEPINFRA_MODEL_CATALOG.filter((model) => !discovered.has(model.id)));
	}
	const unknownPrices = models.filter((model) => !prices?.has(model.id)).length;
	if (unknownPrices > 0) log.warn(`Native pricing unavailable or qualified for ${unknownPrices} models; keeping metadata with unknown estimates. Configure explicit model costs if needed.`);
	return models.map((model) => buildDeepInfraModelDefinition({
		...model,
		cost: prices?.get(model.id) ?? {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		}
	}));
}
export { discoverDeepInfraModels, discoverDeepInfraSurfaces };
