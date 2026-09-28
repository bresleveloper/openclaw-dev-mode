import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { s as isLoopbackHost } from "./net-DU4aWKLv.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { l as selectPreferredLocalModelId } from "./provider-model-shared-DUNuGxOQ.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import { h as runLiveProviderCatalog } from "./provider-catalog-live-runtime-BAhXMc_e.mjs";
import "./secret-input-runtime-C01-y7l7.mjs";
import { a as OLLAMA_DEFAULT_API_KEY, h as normalizeOllamaCloudModelId, o as OLLAMA_DEFAULT_BASE_URL, p as isHostedOllamaCloud } from "./defaults-Dkg1KktH.mjs";
import { t as readProviderBaseUrl } from "./provider-base-url-Crmh7W8f.mjs";
import { c as enrichOllamaModelsWithContext, f as isOllamaEmbeddingOnlyModel, h as mergeOllamaModelShowInfo, m as isReasoningModelHeuristic, p as isOllamaRemoteModel, r as buildOllamaModelDefinition, t as buildDefaultOllamaCloudModelDefinition, u as fetchOllamaModels, v as readOllamaModelShowInfo, y as resolveOllamaApiBase } from "./provider-models-DGKSrDJa.mjs";
import { isIPv4 } from "node:net";
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
//#region extensions/ollama/src/setup-model-selection.ts
const OLLAMA_CONTEXT_ENRICH_LIMIT = 200;
const OLLAMA_TOOLS_SCAN_CONCURRENCY = 8;
const OLLAMA_APP_GUIDED_MIN_CONTEXT_TOKENS = 16384;
function normalizeOllamaModelName(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	return trimmed.toLowerCase().startsWith("ollama/") ? trimmed.slice(7).trim() || void 0 : trimmed;
}
function getOllamaLatestDedupeKey(name) {
	const normalized = name.trim().toLowerCase();
	return normalized.endsWith(":latest") ? normalized.slice(0, -7) : normalized;
}
function mergeUniqueModelNames(...groups) {
	const mergedByKey = /* @__PURE__ */ new Map();
	for (const group of groups) for (const name of group) {
		const key = getOllamaLatestDedupeKey(name);
		const existing = mergedByKey.get(key);
		if (existing === void 0 || !existing.trim().toLowerCase().endsWith(":latest") && name.trim().toLowerCase().endsWith(":latest")) mergedByKey.set(key, name);
	}
	return [...mergedByKey.values()];
}
function findAvailableOllamaModelName(modelName, availableModelNames) {
	const wantedKey = getOllamaLatestDedupeKey(modelName);
	for (const available of availableModelNames) if (getOllamaLatestDedupeKey(available) === wantedKey) return available;
}
function orderPreferredOllamaModelIds(modelIds) {
	const remaining = [...modelIds];
	const ordered = [];
	while (remaining.length > 0) {
		const preferredId = selectPreferredLocalModelId(remaining);
		const preferredIndex = preferredId ? remaining.indexOf(preferredId) : 0;
		const [candidate] = remaining.splice(Math.max(preferredIndex, 0), 1);
		if (candidate) ordered.push(candidate);
	}
	return ordered;
}
function selectAppGuidedOllamaModelId(models) {
	const eligible = [...models].filter((model) => model.supportsTools === true && model.contextWindow !== void 0 && model.contextWindow >= 16384);
	const nonReasoning = eligible.filter((model) => model.reasoning !== true);
	const pool = nonReasoning.length > 0 ? nonReasoning : eligible;
	const measuredSizes = pool.map((model) => model.size).filter((size) => typeof size === "number" && size > 0);
	const smallestSize = measuredSizes.length > 0 ? Math.min(...measuredSizes) : void 0;
	return orderPreferredOllamaModelIds((smallestSize === void 0 ? pool : pool.filter((model) => model.size === smallestSize)).map((model) => model.id))[0];
}
function isOllamaToolsCapableModel(model) {
	return !isOllamaEmbeddingOnlyModel(model) && model.capabilities?.includes("tools") === true;
}
function selectAppGuidedOllamaModelFromDiscovery(models) {
	return selectAppGuidedOllamaModelId([...models].map((model) => ({
		id: model.name,
		contextWindow: model.contextWindow,
		supportsTools: isOllamaToolsCapableModel(model),
		reasoning: model.capabilities?.includes("thinking") ?? isReasoningModelHeuristic(model.name),
		size: model.size
	})));
}
function buildOllamaModelsConfig(modelNames, discoveredModelsByName, defaultModels = []) {
	return modelNames.map((name) => {
		const discovered = discoveredModelsByName?.get(name);
		const defaultModel = defaultModels.find((model) => model.id === normalizeOllamaCloudModelId(name));
		if (defaultModel && !discovered && defaultModel.id === name) return buildDefaultOllamaCloudModelDefinition(defaultModel);
		const capabilities = discovered?.capabilities ?? (defaultModel ? [...defaultModel.capabilities] : void 0);
		return buildOllamaModelDefinition(name, discovered?.contextWindow ?? defaultModel?.contextWindow, capabilities, { showInspectionFailed: discovered?.showInspectionFailed });
	});
}
async function inspectOllamaModelsForSetup(baseUrl, models, signal) {
	const apiBase = resolveOllamaApiBase(baseUrl);
	const inspected = [];
	const inspectionFailures = [];
	for (let index = 0; index < models.length; index += OLLAMA_TOOLS_SCAN_CONCURRENCY) {
		signal?.throwIfAborted();
		const batch = models.slice(index, index + OLLAMA_TOOLS_SCAN_CONCURRENCY);
		const results = await Promise.all(batch.map(async (model) => {
			try {
				const showInfo = await readOllamaModelShowInfo(apiBase, model.name, {
					timeoutMs: 3e3,
					signal,
					auditContext: "ollama-setup.tools-scan"
				});
				return mergeOllamaModelShowInfo(model, showInfo);
			} catch (error) {
				signal?.throwIfAborted();
				inspectionFailures.push(`${model.name}: ${formatErrorMessage(error)}`);
				return mergeOllamaModelShowInfo(model, { showInspectionFailed: true });
			}
		}));
		inspected.push(...results);
	}
	return {
		inspected,
		inspectionFailures
	};
}
async function discoverOllamaModelsForSetup(params) {
	const { reachable, models: listedModels } = await fetchOllamaModels(params.baseUrl, { signal: params.signal });
	const models = params.includeRemoteModels === false ? listedModels.filter((model) => !isOllamaRemoteModel(model)) : listedModels;
	const firstModels = models.slice(0, OLLAMA_CONTEXT_ENRICH_LIMIT);
	const inspection = !reachable ? {
		inspected: [],
		inspectionFailures: []
	} : params.inspectTools ? await inspectOllamaModelsForSetup(params.baseUrl, firstModels, params.signal) : {
		inspected: await enrichOllamaModelsWithContext(params.baseUrl, firstModels, { signal: params.signal }),
		inspectionFailures: []
	};
	if (params.inspectTools && !inspection.inspected.some(isOllamaToolsCapableModel) && models.length > OLLAMA_CONTEXT_ENRICH_LIMIT) {
		const remainingScan = await inspectOllamaModelsForSetup(params.baseUrl, models.slice(OLLAMA_CONTEXT_ENRICH_LIMIT), params.signal);
		inspection.inspected.push(...remainingScan.inspected);
		inspection.inspectionFailures.push(...remainingScan.inspectionFailures);
	}
	return {
		reachable,
		models,
		inspectedModels: inspection.inspected,
		discoveredModelsByName: new Map(inspection.inspected.map((model) => [model.name, model])),
		inspectionFailures: inspection.inspectionFailures,
		hasToolsCapableModel: inspection.inspected.some(isOllamaToolsCapableModel)
	};
}
//#endregion
export { inspectOllamaModelsForSetup as a, orderPreferredOllamaModelIds as c, isLocalOllamaBaseUrl as d, resolveOllamaDiscoveryResult as f, findAvailableOllamaModelName as i, selectAppGuidedOllamaModelFromDiscovery as l, shouldUseSyntheticOllamaAuth as m, buildOllamaModelsConfig as n, mergeUniqueModelNames as o, resolveOllamaRuntimeBaseUrl as p, discoverOllamaModelsForSetup as r, normalizeOllamaModelName as s, OLLAMA_APP_GUIDED_MIN_CONTEXT_TOKENS as t, OLLAMA_PROVIDER_ID as u };
