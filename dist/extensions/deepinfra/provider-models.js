import { t as modelCatalog } from "./.setup/openclaw.plugin-BRaVociw.mjs";
import { DEEPINFRA_BASE_URL, DEEPINFRA_TTS_FALLBACK_CATALOG } from "./media-models.js";
import { DEEPINFRA_MODEL_CATALOG, buildDeepInfraModelDefinition } from "./provider-static-catalog.js";
import { parseDeepInfraPricingCatalog } from "./pricing-api.js";
import { asPositiveSafeInteger, isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { fetchLiveProviderModelRows } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { getCachedLiveCatalogValue } from "openclaw/plugin-sdk/provider-catalog-shared";
import { withTrustedEnvProxyGuardedFetchMode } from "openclaw/plugin-sdk/fetch-runtime";
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/deepinfra/provider-models.ts
const log = createSubsystemLogger("deepinfra-models");
const DEEPINFRA_MODELS_URL = `${DEEPINFRA_BASE_URL}/models?sort_by=openclaw&filter=with_meta`;
const DEEPINFRA_PRICING_URL = "https://api.deepinfra.com/models/list";
const DEEPINFRA_DEFAULT_CONTEXT_WINDOW = 128e3;
const DEEPINFRA_DEFAULT_MAX_TOKENS = 8192;
const DISCOVERY_TIMEOUT_MS = 5e3;
const DISCOVERY_CACHE_TTL_MS = 3e5;
const SURFACE_FOR_TAG = {
	chat: "chat",
	vlm: "vlm",
	embed: "embed",
	"image-gen": "image-gen",
	"video-gen": "video-gen",
	tts: "tts",
	stt: "stt"
};
function entryToSurfaceModel(entry) {
	const id = typeof entry?.id === "string" ? entry.id.trim() : "";
	if (!id) return null;
	const metadata = entry.metadata;
	if (metadata === null) return null;
	if (!isRecord(metadata) || !Array.isArray(metadata.tags) || metadata.tags.some((tag) => typeof tag !== "string")) throw new Error("DeepInfra model metadata discovery unavailable.");
	const pricing = metadata.pricing ?? {};
	return {
		id,
		name: id,
		description: typeof metadata.description === "string" ? metadata.description : void 0,
		tags: metadata.tags,
		contextWindow: asPositiveSafeInteger(metadata.context_length),
		maxTokens: asPositiveSafeInteger(metadata.max_tokens),
		pricing,
		defaultWidth: asPositiveSafeInteger(metadata.default_width),
		defaultHeight: asPositiveSafeInteger(metadata.default_height),
		defaultIterations: asPositiveSafeInteger(metadata.default_iterations)
	};
}
function bucketBySurface(models) {
	const catalog = {
		chat: [],
		vlm: [],
		embed: [],
		imageGen: [],
		videoGen: [],
		tts: [],
		stt: [],
		live: true
	};
	const buckets = {
		chat: catalog.chat,
		vlm: catalog.vlm,
		embed: catalog.embed,
		"image-gen": catalog.imageGen,
		"video-gen": catalog.videoGen,
		tts: catalog.tts,
		stt: catalog.stt
	};
	for (const model of models) {
		const seen = /* @__PURE__ */ new Set();
		for (const tag of model.tags) {
			const surface = SURFACE_FOR_TAG[tag];
			if (surface && !seen.has(surface)) {
				seen.add(surface);
				buckets[surface].push(model);
			}
		}
	}
	return catalog;
}
function manifestChatEntryToSurfaceModel(entry) {
	const cost = entry.cost ?? {};
	const pricing = {};
	if (typeof cost.input === "number") pricing.input_tokens = cost.input;
	if (typeof cost.output === "number") pricing.output_tokens = cost.output;
	if (typeof cost.cacheRead === "number" && cost.cacheRead > 0) pricing.cache_read_tokens = cost.cacheRead;
	const tags = ["chat"];
	if (entry.input?.includes("image")) tags.push("vlm");
	if (entry.reasoning) tags.push("reasoning");
	return {
		id: entry.id,
		name: entry.name ?? entry.id,
		tags,
		contextWindow: entry.contextWindow,
		maxTokens: entry.maxTokens,
		pricing
	};
}
const STATIC_NON_CHAT_FALLBACK = [
	{
		id: "black-forest-labs/FLUX-1-schnell",
		name: "black-forest-labs/FLUX-1-schnell",
		tags: ["image-gen"],
		pricing: { per_image_unit: .003 },
		defaultWidth: 1024,
		defaultHeight: 1024,
		defaultIterations: 4
	},
	{
		id: "black-forest-labs/FLUX-1-dev",
		name: "black-forest-labs/FLUX-1-dev",
		tags: ["image-gen"],
		pricing: { per_image_unit: .025 },
		defaultWidth: 1024,
		defaultHeight: 1024,
		defaultIterations: 28
	},
	{
		id: "Qwen/Qwen-Image-Max",
		name: "Qwen/Qwen-Image-Max",
		tags: ["image-gen"],
		pricing: { per_image_unit: .075 },
		defaultWidth: 1024,
		defaultHeight: 1024,
		defaultIterations: 28
	},
	{
		id: "stabilityai/sdxl-turbo",
		name: "stabilityai/sdxl-turbo",
		tags: ["image-gen"],
		pricing: { per_image_unit: 2e-4 },
		defaultWidth: 1024,
		defaultHeight: 1024,
		defaultIterations: 4
	},
	...DEEPINFRA_TTS_FALLBACK_CATALOG,
	{
		id: "openai/whisper-large-v3-turbo",
		name: "openai/whisper-large-v3-turbo",
		tags: ["stt"],
		pricing: { input_seconds: 4e-5 }
	},
	{
		id: "BAAI/bge-m3",
		name: "BAAI/bge-m3",
		tags: ["embed"],
		pricing: { input_tokens: .01 },
		maxTokens: 8192,
		contextWindow: 8192
	}
];
function manifestFallbackCatalog() {
	const catalog = bucketBySurface([...(modelCatalog.providers.deepinfra.models ?? []).map(manifestChatEntryToSurfaceModel), ...STATIC_NON_CHAT_FALLBACK]);
	catalog.live = false;
	return catalog;
}
function getDeepInfraSurfaceFallbackCatalog() {
	return manifestFallbackCatalog();
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
		maxTokens: model.maxTokens ?? DEEPINFRA_DEFAULT_MAX_TOKENS
	};
}
function canDiscoverDeepInfra(options) {
	if (options?.hasApiKey !== void 0) return options.hasApiKey;
	const fromEnv = (options?.env ?? process.env).DEEPINFRA_API_KEY;
	return typeof fromEnv === "string" && fromEnv.trim() !== "" || isProviderApiKeyConfigured({
		provider: "deepinfra",
		agentDir: options?.agentDir
	});
}
async function discoverDeepInfraSurfaces(options) {
	if (canDiscoverDeepInfra(options)) try {
		return await loadDeepInfraSurfaces();
	} catch (error) {
		log.warn(`Model metadata discovery unavailable: ${String(error)}`);
	}
	return manifestFallbackCatalog();
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
				buildRequestHeaders: () => ({ Accept: "application/json" }),
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
			return bucketBySurface(surfaceModels);
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
				buildRequestHeaders: () => ({ Accept: "application/json" }),
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
	if (!canDiscoverDeepInfra(options)) return DEEPINFRA_MODEL_CATALOG.map(buildDeepInfraModelDefinition);
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
//#endregion
export { discoverDeepInfraModels, discoverDeepInfraSurfaces, getDeepInfraSurfaceFallbackCatalog };
