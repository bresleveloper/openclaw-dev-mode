import { isIPv4 } from "node:net";
import { LiveModelCatalogHttpError, runLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { coerceSecretRef } from "openclaw/plugin-sdk/secret-input-runtime";
import { fetchWithSsrFGuard, isLoopbackHost } from "openclaw/plugin-sdk/ssrf-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { isCloudModelRef } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/ollama/src/defaults.ts
const OLLAMA_DEFAULT_BASE_URL = "http://127.0.0.1:11434";
const OLLAMA_DEFAULT_API_KEY = "ollama-local";
function isHostedOllamaCloud(baseUrl) {
	const host = baseUrl ? URL.parse(baseUrl)?.hostname.toLowerCase() : void 0;
	return host !== void 0 && (host === "ollama.com" || host.endsWith(".ollama.com"));
}
/**
* Order is a contract: cloud onboarding merges this list ahead of live discovery and takes
* the first name as `defaultModel` (`setup.runtime.ts`). Reordering this array changes what
* every new setup selects, so keep the intended default at index 0.
*/
const OLLAMA_CLOUD_DEFAULT_MODELS = [
	{
		id: "minimax-m2.7",
		contextWindow: 196608,
		capabilities: [
			"completion",
			"thinking",
			"tools"
		]
	},
	{
		id: "minimax-m3",
		contextWindow: 524288,
		capabilities: [
			"completion",
			"thinking",
			"tools",
			"vision"
		]
	},
	{
		id: "kimi-k3",
		contextWindow: 1048576,
		capabilities: [
			"completion",
			"thinking",
			"tools",
			"vision"
		]
	},
	{
		id: "glm-5.1",
		contextWindow: 202752,
		capabilities: [
			"completion",
			"thinking",
			"tools"
		]
	},
	{
		id: "glm-5.2",
		contextWindow: 1e6,
		capabilities: [
			"completion",
			"thinking",
			"tools"
		]
	}
];
/** Cloud models are referenced bare, `:cloud`-suffixed, and `-cloud`-suffixed. */
function normalizeOllamaCloudModelId(modelId) {
	return modelId.trim().toLowerCase().replace(/(?::cloud|-cloud)$/, "");
}
const OLLAMA_LOCAL_CONTEXT_TOKENS = 32768;
const OLLAMA_DEFAULT_MAX_TOKENS = 8192;
const OLLAMA_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
//#endregion
//#region extensions/ollama/src/provider-base-url.ts
function readProviderBaseUrl(provider) {
	if (!provider) return;
	if (Object.hasOwn(provider, "baseUrl") && typeof provider.baseUrl === "string" && provider.baseUrl.trim()) return provider.baseUrl.trim();
	const alternate = provider;
	if (Object.hasOwn(alternate, "baseURL") && typeof alternate.baseURL === "string" && alternate.baseURL.trim()) return alternate.baseURL.trim();
}
//#endregion
//#region extensions/ollama/src/model-reasoning.ts
function supportsOllamaCloudFullThinkingEffort(modelId) {
	const normalized = normalizeOllamaCloudModelId(modelId);
	return normalized === "glm-5.2" || /^deepseek-v4-(?:flash|pro)$/.test(normalized);
}
//#endregion
//#region extensions/ollama/src/provider-models.ts
const OLLAMA_SHOW_CONCURRENCY = 8;
const OLLAMA_CONTEXT_ENRICH_LIMIT = 200;
const OLLAMA_SHOW_TIMEOUT_MS = 3e3;
const OLLAMA_TAGS_TIMEOUT_MS = 5e3;
const MAX_OLLAMA_DISCOVERY_PROBES = 800;
const MAX_OLLAMA_SHOW_CACHE_ENTRIES = 256;
const ollamaModelShowInfoCache = /* @__PURE__ */ new Map();
const OLLAMA_ALWAYS_BLOCKED_HOSTNAMES = /* @__PURE__ */ new Set(["metadata.google.internal"]);
function buildOllamaBaseUrlSsrFPolicy(baseUrl) {
	const trimmed = baseUrl.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		if (OLLAMA_ALWAYS_BLOCKED_HOSTNAMES.has(parsed.hostname)) return;
		return {
			hostnameAllowlist: [parsed.hostname],
			allowPrivateNetwork: true
		};
	} catch {
		return;
	}
}
function resolveOllamaApiBase(configuredBaseUrl) {
	if (!configuredBaseUrl) return OLLAMA_DEFAULT_BASE_URL;
	return configuredBaseUrl.replace(/\/+$/, "").replace(/\/v1$/i, "");
}
const mergeOllamaModelShowInfo = (model, info) => {
	const incomplete = info.capabilities === void 0 && model.capabilities !== void 0 && isOllamaRemoteModel(model) && !isOllamaEmbeddingOnlyModel(model);
	return {
		...model,
		...info,
		contextWindow: info.contextWindow ?? model.contextWindow ?? model.details?.context_length,
		capabilities: incomplete ? [.../* @__PURE__ */ new Set([
			...model.capabilities ?? [],
			...info.showInspectionFailed ? [] : ["tools"],
			...isReasoningModelHeuristic(model.name) ? ["thinking"] : []
		])] : info.capabilities ?? model.capabilities,
		...incomplete ? { capabilitiesFromList: true } : {}
	};
};
const OLLAMA_FAILED_SHOW_INFO = Object.freeze({ showInspectionFailed: true });
function throwIfOllamaRequestAborted(signal) {
	if (signal?.aborted) throw toErrorObject(signal.reason, "Ollama request aborted");
}
function buildOllamaModelShowCacheKey(apiBase, model, apiKey) {
	const version = model.digest?.trim() || model.modified_at?.trim();
	if (!version) return;
	const authScope = apiKey ? createHash("sha256").update(apiKey).digest("hex") : "anonymous";
	return `${resolveOllamaApiBase(apiBase)}|${model.name}|${version}|${authScope}`;
}
function setOllamaModelShowCacheEntry(key, value) {
	if (ollamaModelShowInfoCache.size >= MAX_OLLAMA_SHOW_CACHE_ENTRIES) {
		const oldestKey = ollamaModelShowInfoCache.keys().next().value;
		if (typeof oldestKey === "string") ollamaModelShowInfoCache.delete(oldestKey);
	}
	ollamaModelShowInfoCache.set(key, value);
}
function hasCachedOllamaModelShowInfo(info) {
	return typeof info.contextWindow === "number" || (info.capabilities?.length ?? 0) > 0;
}
function parseOllamaNumCtxParameter(parameters) {
	if (typeof parameters !== "string" || !parameters.trim()) return;
	let lastValue;
	for (const rawLine of parameters.split(/\r?\n/)) {
		const match = rawLine.trim().match(/^num_ctx\s+(-?\d+)\b/);
		if (!match) continue;
		const rawValue = match[1];
		if (!rawValue) continue;
		const parsed = Number.parseInt(rawValue, 10);
		if (Number.isFinite(parsed) && parsed > 0) lastValue = parsed;
	}
	return lastValue;
}
async function readOllamaModelShowInfo(apiBase, modelName, opts) {
	const normalizedApiBase = resolveOllamaApiBase(apiBase);
	const auditContext = opts?.auditContext ?? "ollama-provider-models.show";
	const headers = { "Content-Type": "application/json" };
	if (opts?.apiKey) headers.Authorization = `Bearer ${opts.apiKey}`;
	const { response, release } = await fetchWithSsrFGuard({
		url: `${normalizedApiBase}/api/show`,
		init: {
			method: "POST",
			headers,
			body: JSON.stringify({ model: modelName })
		},
		timeoutMs: Math.min(opts?.timeoutMs ?? OLLAMA_SHOW_TIMEOUT_MS, OLLAMA_SHOW_TIMEOUT_MS),
		...opts?.signal ? { signal: opts.signal } : {},
		policy: buildOllamaBaseUrlSsrFPolicy(normalizedApiBase),
		auditContext
	});
	try {
		if (!response.ok) {
			response.body?.cancel().catch(() => void 0);
			throw new Error(`Ollama model inspection failed with HTTP ${response.status}`);
		}
		const data = await readProviderJsonResponse(response, auditContext);
		let contextWindow;
		if (data.model_info) {
			for (const [key, value] of Object.entries(data.model_info)) if (key.endsWith(".context_length") && typeof value === "number" && Number.isFinite(value)) {
				const ctx = Math.floor(value);
				if (ctx > 0) {
					contextWindow = ctx;
					break;
				}
			}
		}
		const paramCtx = parseOllamaNumCtxParameter(data.parameters);
		if (paramCtx !== void 0 && (contextWindow === void 0 || paramCtx > contextWindow)) contextWindow = paramCtx;
		const capabilities = Array.isArray(data.capabilities) ? data.capabilities.filter((capability) => typeof capability === "string") : void 0;
		return {
			contextWindow,
			capabilities
		};
	} finally {
		await release();
	}
}
async function queryOllamaModelShowInfo(apiBase, modelName, opts) {
	try {
		return await readOllamaModelShowInfo(apiBase, modelName, opts);
	} catch {
		throwIfOllamaRequestAborted(opts?.signal);
		return OLLAMA_FAILED_SHOW_INFO;
	}
}
async function queryOllamaModelShowInfoCached(apiBase, model, opts) {
	const normalizedApiBase = resolveOllamaApiBase(apiBase);
	const cacheKey = buildOllamaModelShowCacheKey(normalizedApiBase, model, opts?.apiKey);
	if (!cacheKey || opts?.timeoutMs !== void 0 || opts?.signal) return await queryOllamaModelShowInfo(normalizedApiBase, model.name, opts);
	const cached = ollamaModelShowInfoCache.get(cacheKey);
	if (cached) return await cached;
	const pending = queryOllamaModelShowInfo(normalizedApiBase, model.name, opts).then((result) => {
		if (!hasCachedOllamaModelShowInfo(result)) ollamaModelShowInfoCache.delete(cacheKey);
		return result;
	});
	setOllamaModelShowCacheEntry(cacheKey, pending);
	return await pending;
}
async function enrichOllamaModelsWithContext(apiBase, models, opts) {
	const concurrency = Math.max(1, Math.floor(opts?.concurrency ?? OLLAMA_SHOW_CONCURRENCY));
	const enriched = [];
	for (let index = 0; index < models.length; index += concurrency) {
		throwIfOllamaRequestAborted(opts?.signal);
		const probes = models.slice(index, index + concurrency).map(async (model) => {
			const showInfo = await queryOllamaModelShowInfoCached(apiBase, model, opts);
			return mergeOllamaModelShowInfo(model, showInfo);
		});
		try {
			enriched.push(...await Promise.all(probes));
		} catch (error) {
			await Promise.allSettled(probes);
			throw error;
		}
	}
	return enriched;
}
async function enrichOllamaCompletionModels(apiBase, models, opts) {
	const completionModels = [];
	const probeLimit = Math.min(models.length, MAX_OLLAMA_DISCOVERY_PROBES);
	for (let index = 0; index < probeLimit && completionModels.length < OLLAMA_CONTEXT_ENRICH_LIMIT; index += OLLAMA_SHOW_CONCURRENCY) {
		throwIfOllamaRequestAborted(opts?.signal);
		const batch = await enrichOllamaModelsWithContext(apiBase, models.slice(index, Math.min(index + OLLAMA_SHOW_CONCURRENCY, probeLimit)), opts);
		for (const model of batch) {
			const canComplete = model.capabilities?.includes("completion");
			if (isOllamaEmbeddingOnlyModel(model) || !canComplete && (opts?.requireCompletionCapability || model.capabilities && !model.capabilitiesFromList)) continue;
			completionModels.push(model);
			if (completionModels.length === OLLAMA_CONTEXT_ENRICH_LIMIT) break;
		}
	}
	return completionModels;
}
function isOllamaCloudModel(modelName) {
	return isCloudModelRef(modelName);
}
function isOllamaEmbeddingOnlyModel(model) {
	return model.capabilities?.includes("embedding") === true && !model.capabilities.includes("completion");
}
function isOllamaRemoteModel(model) {
	return Boolean(model.remote_host?.trim() || model.remote_model?.trim()) || isOllamaCloudModel(model.name);
}
/**
* Cloud models are referenced both bare (`kimi-k3`) and suffixed (`kimi-k3:cloud`).
* Both spellings must reach the same known context window, or a suffixed ref silently
* falls back to the generic default whenever live inspection is unavailable.
*/
function resolveOllamaCloudDefaultModel(modelId) {
	const normalized = normalizeOllamaCloudModelId(modelId);
	return OLLAMA_CLOUD_DEFAULT_MODELS.find((model) => model.id === normalized);
}
function isReasoningModelHeuristic(modelId) {
	return /r1|reasoning|think|reason/i.test(modelId);
}
function buildOllamaModelDefinition(modelId, contextWindow, capabilities, opts) {
	return {
		id: modelId,
		name: modelId,
		reasoning: supportsOllamaCloudFullThinkingEffort(modelId) || (capabilities === void 0 ? isReasoningModelHeuristic(modelId) : capabilities.includes("thinking")),
		input: capabilities?.includes("vision") ? ["text", "image"] : ["text"],
		cost: OLLAMA_DEFAULT_COST,
		contextWindow: contextWindow ?? resolveOllamaCloudDefaultModel(modelId)?.contextWindow ?? 128e3,
		maxTokens: OLLAMA_DEFAULT_MAX_TOKENS,
		compat: {
			supportsTools: capabilities?.includes("tools") ?? opts?.showInspectionFailed !== true,
			supportsUsageInStreaming: true,
			supportsJsonSchemaResponseFormat: !isOllamaCloudModel(modelId)
		}
	};
}
function capLocalOllamaModelContext(model, baseUrl) {
	if (isHostedOllamaCloud(baseUrl) || isOllamaCloudModel(model.id) || typeof model.contextWindow !== "number") return model;
	return {
		...model,
		contextTokens: Math.min(OLLAMA_LOCAL_CONTEXT_TOKENS, model.contextWindow)
	};
}
function capLocalOllamaProviderContext(provider) {
	return {
		...provider,
		models: provider.models?.map((model) => capLocalOllamaModelContext(model, provider.baseUrl))
	};
}
async function fetchOllamaModelRows(params) {
	try {
		const apiBase = resolveOllamaApiBase(params.baseUrl);
		const auditContext = `ollama-provider-models.${params.endpoint}`;
		const { response, release } = await fetchWithSsrFGuard({
			url: `${apiBase}/api/${params.endpoint}`,
			init: { headers: params.opts?.apiKey ? { Authorization: `Bearer ${params.opts.apiKey}` } : void 0 },
			timeoutMs: Math.min(params.opts?.timeoutMs ?? OLLAMA_TAGS_TIMEOUT_MS, OLLAMA_TAGS_TIMEOUT_MS),
			...params.opts?.signal ? { signal: params.opts.signal } : {},
			policy: buildOllamaBaseUrlSsrFPolicy(apiBase),
			auditContext,
			...params.deps?.fetchImpl ? { fetchImpl: params.deps.fetchImpl } : {},
			...params.deps?.lookupFn ? { lookupFn: params.deps.lookupFn } : {}
		});
		try {
			if (!response.ok) {
				response.body?.cancel().catch(() => void 0);
				if (params.opts?.discoveryMode === "strict") throw new LiveModelCatalogHttpError("ollama", response.status);
				return {
					reachable: true,
					models: []
				};
			}
			const data = await readProviderJsonResponse(response, auditContext);
			if (params.opts?.discoveryMode === "strict" && !Array.isArray(data.models)) throw new Error("Ollama model discovery response must contain models[]");
			return {
				reachable: true,
				models: Array.isArray(data.models) ? data.models : []
			};
		} finally {
			await release();
		}
	} catch (error) {
		throwIfOllamaRequestAborted(params.opts?.signal);
		if (params.opts?.discoveryMode === "strict") throw error;
		return {
			reachable: false,
			models: []
		};
	}
}
async function fetchOllamaModels(baseUrl, opts, deps) {
	const result = await fetchOllamaModelRows({
		baseUrl,
		endpoint: "tags",
		opts,
		deps
	});
	return {
		reachable: result.reachable,
		models: result.models.filter((model) => typeof model.name === "string" && Boolean(model.name))
	};
}
async function buildOllamaProvider(configuredBaseUrl, opts) {
	const apiBase = resolveOllamaApiBase(configuredBaseUrl);
	const auth = opts?.apiKey ? { apiKey: opts.apiKey } : void 0;
	const { reachable, models } = await fetchOllamaModels(apiBase, opts);
	if (!reachable && !opts?.quiet) console.warn(`Ollama could not be reached at ${apiBase}.`);
	return {
		baseUrl: apiBase,
		api: "ollama",
		models: (await enrichOllamaCompletionModels(apiBase, models, auth)).map((model) => buildOllamaModelDefinition(model.name, model.contextWindow, model.capabilities, { showInspectionFailed: model.showInspectionFailed }))
	};
}
//#endregion
//#region extensions/ollama/src/discovery-shared.ts
const OLLAMA_PROVIDER_ID = "ollama";
function readOllamaStringValue(value) {
	if (typeof value === "string") return normalizeOptionalString(value);
	if (value && typeof value === "object" && "value" in value) return normalizeOptionalString(value.value);
}
function isOllamaApiKeyMarker(value) {
	return value === "OLLAMA_API_KEY" || value === "ollama-local";
}
function resolveOllamaRuntimeBaseUrl(params) {
	if (params.configuredBaseUrl && params.api && params.api !== "ollama") return params.configuredBaseUrl;
	return params.discoveredBaseUrl;
}
function resolveOllamaDiscoveryAuth(params) {
	const envValue = normalizeOptionalString(params.env.OLLAMA_API_KEY);
	const resolvedApiKey = normalizeOptionalString(params.resolvedAuth.apiKey);
	const resolvedDiscoveryApiKey = normalizeOptionalString(params.resolvedAuth.discoveryApiKey);
	const explicitRef = coerceSecretRef(params.explicitApiKey);
	const explicitApiKey = explicitRef ? resolvedDiscoveryApiKey : readOllamaStringValue(params.explicitApiKey);
	if (explicitRef && !explicitApiKey) return null;
	if (explicitApiKey && (explicitRef || !isOllamaApiKeyMarker(explicitApiKey))) return {
		apiKey: explicitRef ?? explicitApiKey,
		discoveryApiKey: explicitApiKey
	};
	if (!isLocalOllamaBaseUrl(params.baseUrl)) {
		if (resolvedDiscoveryApiKey) return {
			apiKey: resolvedApiKey,
			discoveryApiKey: resolvedDiscoveryApiKey
		};
		if (resolvedApiKey && !isOllamaApiKeyMarker(resolvedApiKey)) return {
			apiKey: resolvedApiKey,
			discoveryApiKey: resolvedApiKey
		};
		return envValue && envValue !== "ollama-local" ? {
			apiKey: "OLLAMA_API_KEY",
			discoveryApiKey: envValue
		} : {};
	}
	if (resolvedApiKey && resolvedApiKey !== envValue && !isOllamaApiKeyMarker(resolvedApiKey)) return {
		apiKey: resolvedApiKey,
		discoveryApiKey: resolvedDiscoveryApiKey ?? resolvedApiKey
	};
	return { apiKey: OLLAMA_DEFAULT_API_KEY };
}
const LOCAL_OLLAMA_HOSTNAMES = /* @__PURE__ */ new Set([
	"localhost",
	"0.0.0.0",
	"::1",
	"::",
	"docker.orb.internal",
	"host.docker.internal",
	"host.orb.internal"
]);
const LOOPBACK_OLLAMA_HOSTNAMES = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"0.0.0.0",
	"::1",
	"::"
]);
function isIpv4PrivateRange(host) {
	const [firstOctet, secondOctet] = host.split(".");
	return isIPv4(host) && (firstOctet === "10" || firstOctet === "172" && Number(secondOctet) >= 16 && Number(secondOctet) <= 31 || firstOctet === "192" && secondOctet === "168");
}
function isIpv6LocalRange(host) {
	const lower = host.toLowerCase();
	return /^fe[89ab][0-9a-f]:/.test(lower) || /^f[cd][0-9a-f]{2}:/.test(lower);
}
function isLocalOllamaBaseUrl(baseUrl) {
	if (!baseUrl) return true;
	let parsed;
	try {
		parsed = new URL(baseUrl);
	} catch {
		return false;
	}
	let host = parsed.hostname.toLowerCase();
	if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
	return LOCAL_OLLAMA_HOSTNAMES.has(host) || isLoopbackHost(host) || host.endsWith(".local") || isIpv4PrivateRange(host) || isIpv6LocalRange(host) || !host.includes(".") && !host.includes(":");
}
function isLoopbackOllamaBaseUrl(baseUrl) {
	if (!baseUrl) return true;
	let parsed;
	try {
		parsed = new URL(baseUrl);
	} catch {
		return false;
	}
	let host = parsed.hostname.toLowerCase();
	if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
	return LOOPBACK_OLLAMA_HOSTNAMES.has(host) || isLoopbackHost(host);
}
function hasExplicitRemoteOllamaApiProvider(providers) {
	if (!providers) return false;
	for (const [providerId, provider] of Object.entries(providers)) {
		if (providerId === "ollama" || !provider) continue;
		if (normalizeOptionalString(provider.api)?.toLowerCase() !== "ollama") continue;
		const baseUrl = readProviderBaseUrl(provider);
		if (baseUrl && !isLoopbackOllamaBaseUrl(baseUrl)) return true;
	}
	return false;
}
function shouldUseSyntheticOllamaAuth(providerConfig) {
	const apiKey = readOllamaStringValue(providerConfig?.apiKey);
	if (coerceSecretRef(providerConfig?.apiKey) || apiKey && !isOllamaApiKeyMarker(apiKey) || !hasMeaningfulExplicitOllamaConfig(providerConfig)) return false;
	return isLocalOllamaBaseUrl(readProviderBaseUrl(providerConfig));
}
function hasMeaningfulExplicitOllamaConfig(providerConfig) {
	if (!providerConfig) return false;
	if (Array.isArray(providerConfig.models) && providerConfig.models.length > 0) return true;
	const baseUrl = readProviderBaseUrl(providerConfig);
	if (baseUrl) return resolveOllamaApiBase(baseUrl) !== OLLAMA_DEFAULT_BASE_URL;
	if (readOllamaStringValue(providerConfig.apiKey)) return true;
	if (providerConfig.auth) return true;
	if (typeof providerConfig.authHeader === "boolean") return true;
	if (providerConfig.headers && typeof providerConfig.headers === "object" && Object.keys(providerConfig.headers).length > 0) return true;
	if (providerConfig.request) return true;
	if (typeof providerConfig.injectNumCtxForOpenAICompat === "boolean") return true;
	return false;
}
async function resolveOllamaDiscoveryResult(params) {
	if (params.ctx.providerIds && !params.ctx.providerIds.includes("ollama")) return null;
	const explicit = params.ctx.config.models?.providers?.ollama;
	const hasExplicitModels = Array.isArray(explicit?.models) && explicit.models.length > 0;
	const hasMeaningfulExplicitConfig = hasMeaningfulExplicitOllamaConfig(explicit);
	const hasRemoteOllamaApiProvider = hasExplicitRemoteOllamaApiProvider(params.ctx.config.models?.providers);
	const discoveryEnabled = params.pluginConfig.discovery?.enabled;
	if (!hasExplicitModels && discoveryEnabled === false) return null;
	const configuredBaseUrl = readProviderBaseUrl(explicit);
	if (!hasExplicitModels && configuredBaseUrl && isHostedOllamaCloud(configuredBaseUrl)) return null;
	const resolvedOllamaAuth = params.ctx.resolveProviderApiKey(OLLAMA_PROVIDER_ID);
	const ollamaKey = resolvedOllamaAuth.apiKey;
	const hasOllamaDiscoveryOptIn = typeof ollamaKey === "string" && ollamaKey.trim().length > 0;
	const auth = resolveOllamaDiscoveryAuth({
		env: params.ctx.env,
		baseUrl: configuredBaseUrl,
		explicitApiKey: explicit?.apiKey,
		resolvedAuth: resolvedOllamaAuth
	});
	if (!auth) return null;
	const { apiKey, discoveryApiKey } = auth;
	if (hasExplicitModels && explicit) {
		const discoveredBaseUrl = resolveOllamaApiBase(configuredBaseUrl);
		const api = explicit.api ?? "ollama";
		return { provider: {
			...explicit,
			models: explicit.models ?? [],
			baseUrl: resolveOllamaRuntimeBaseUrl({
				api,
				configuredBaseUrl,
				discoveredBaseUrl
			}),
			api,
			...apiKey ? { apiKey } : {}
		} };
	}
	if (!hasMeaningfulExplicitConfig && hasRemoteOllamaApiProvider) return null;
	if (!hasOllamaDiscoveryOptIn && !hasMeaningfulExplicitConfig) return null;
	return await runLiveProviderCatalog({
		providerId: OLLAMA_PROVIDER_ID,
		profileId: resolvedOllamaAuth.profileId,
		run: async () => {
			const provider = await params.buildProvider(configuredBaseUrl, {
				discoveryMode: "strict",
				...discoveryApiKey ? { apiKey: discoveryApiKey } : {}
			});
			const api = explicit?.api ?? provider.api;
			return { provider: {
				...provider,
				baseUrl: resolveOllamaRuntimeBaseUrl({
					api,
					configuredBaseUrl,
					discoveredBaseUrl: provider.baseUrl
				}),
				api,
				...apiKey ? { apiKey } : {}
			} };
		}
	});
}
//#endregion
//#region extensions/ollama/provider-discovery.ts
function resolveOllamaPluginConfig(ctx) {
	return (ctx.config.plugins?.entries ?? {}).ollama?.config ?? {};
}
async function runOllamaDiscovery(ctx) {
	return await resolveOllamaDiscoveryResult({
		ctx,
		pluginConfig: resolveOllamaPluginConfig(ctx),
		buildProvider: async (...args) => capLocalOllamaProviderContext(await buildOllamaProvider(...args))
	});
}
const ollamaProviderDiscovery = {
	id: OLLAMA_PROVIDER_ID,
	label: "Ollama",
	docsPath: "/providers/ollama",
	envVars: ["OLLAMA_API_KEY"],
	auth: [],
	resolveSyntheticAuth: ({ provider, providerConfig }) => {
		if (!shouldUseSyntheticOllamaAuth(providerConfig)) return;
		return {
			apiKey: OLLAMA_DEFAULT_API_KEY,
			source: `models.providers.${provider ?? "ollama"} (synthetic local key)`,
			mode: "api-key"
		};
	},
	catalog: {
		order: "late",
		run: runOllamaDiscovery
	}
};
//#endregion
export { ollamaProviderDiscovery as default, ollamaProviderDiscovery };
