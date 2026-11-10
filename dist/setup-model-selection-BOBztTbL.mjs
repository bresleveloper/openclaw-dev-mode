import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as coerceSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { s as isLoopbackHost } from "./net-CjQwRK-V.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { s as selectPreferredLocalModelId } from "./provider-model-shared-B_4afNJ5.mjs";
import "./ssrf-runtime-z2wN0VZP.mjs";
import { h as runLiveProviderCatalog } from "./provider-catalog-live-runtime-BILEsjga.mjs";
import "./secret-input-runtime-D_NUng8k.mjs";
import { a as OLLAMA_DEFAULT_API_KEY, f as isHostedOllamaCloud, o as OLLAMA_DEFAULT_BASE_URL } from "./defaults-CDpC0pZy.mjs";
import { t as readProviderBaseUrl } from "./provider-base-url-CJ296Qbv.mjs";
import { n as getOllamaLatestDedupeKey, r as normalizeOllamaWireModelId, t as findAvailableOllamaModelName } from "./model-id-C2JO-_3r.mjs";
import { c as enrichOllamaModelsWithContext, f as isOllamaEmbeddingOnlyModel, h as mergeOllamaModelShowInfo, m as isReasoningModelHeuristic, p as isOllamaRemoteModel, r as buildOllamaModelDefinition, u as fetchOllamaModels, v as readOllamaModelShowInfo, y as resolveOllamaApiBase } from "./provider-models-CAeiI0VX.mjs";
import { isIPv4 } from "node:net";
//#region extensions/ollama/src/discovery-shared.ts
const OLLAMA_PROVIDER_ID = "ollama";
const getUnlistedOllamaConfiguredModelIds = (catalog, configuredModels) => configuredModels.filter((model) => model.provider === "ollama" && (!model.baseUrl || resolveOllamaApiBase(model.baseUrl) === resolveOllamaApiBase(catalog.baseUrl)) && !findAvailableOllamaModelName(normalizeOllamaWireModelId(model.modelId), catalog.modelIds)).map((model) => model.modelId);
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
	const host = readOllamaHostname(baseUrl);
	if (host === void 0) return false;
	return LOCAL_OLLAMA_HOSTNAMES.has(host) || isLoopbackHost(host) || host.endsWith(".local") || isIpv4PrivateRange(host) || isIpv6LocalRange(host) || !host.includes(".") && !host.includes(":");
}
function isLoopbackOllamaBaseUrl(baseUrl) {
	if (!baseUrl) return true;
	const host = readOllamaHostname(baseUrl);
	return host !== void 0 && (LOOPBACK_OLLAMA_HOSTNAMES.has(host) || isLoopbackHost(host));
}
function readOllamaHostname(baseUrl) {
	const host = URL.parse(baseUrl)?.hostname.toLowerCase();
	return host?.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
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
	return Boolean(readOllamaStringValue(providerConfig.apiKey) || providerConfig.auth || typeof providerConfig.authHeader === "boolean" || providerConfig.headers && typeof providerConfig.headers === "object" && Object.keys(providerConfig.headers).length > 0 || providerConfig.request || typeof providerConfig.injectNumCtxForOpenAICompat === "boolean");
}
async function resolveOllamaDiscoveryResult(params) {
	if (params.ctx.providerIds && !params.ctx.providerIds.includes("ollama")) return null;
	const explicit = params.ctx.config.models?.providers?.ollama;
	const hasExplicitModels = Array.isArray(explicit?.models) && explicit.models.length > 0;
	const hasMeaningfulExplicitConfig = hasMeaningfulExplicitOllamaConfig(explicit);
	const hasRemoteOllamaApiProvider = hasExplicitRemoteOllamaApiProvider(params.ctx.config.models?.providers);
	const configuredBaseUrl = readProviderBaseUrl(explicit);
	const skipDiscovery = params.pluginConfig.discovery?.enabled === false || Boolean(configuredBaseUrl && isHostedOllamaCloud(configuredBaseUrl));
	if (skipDiscovery && !hasExplicitModels) return null;
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
	if (skipDiscovery && explicit) {
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
			let modelIds;
			const provider = await params.buildProvider(configuredBaseUrl, {
				onListedModels: (names) => {
					modelIds = names;
				},
				discoveryMode: "strict",
				...discoveryApiKey ? { apiKey: discoveryApiKey } : {}
			});
			const api = explicit?.api ?? provider.api;
			const configuredModels = new Map(explicit?.models?.map((model) => [model.id, model]));
			return {
				...modelIds ? { outcomes: [{
					provider: OLLAMA_PROVIDER_ID,
					profileId: resolvedOllamaAuth.profileId,
					status: "ready",
					modelIdCatalog: {
						baseUrl: resolveOllamaApiBase(configuredBaseUrl),
						modelIds
					}
				}] } : {},
				provider: {
					...provider,
					models: provider.models.flatMap((model) => {
						const configured = configuredModels.get(model.id);
						if (configured) {
							const sameEndpoint = !configured.baseUrl || resolveOllamaApiBase(configured.baseUrl) === resolveOllamaApiBase(provider.baseUrl);
							return (configured.api ?? api) === "ollama" && sameEndpoint && configured.thinkingLevelMap === void 0 && model.thinkingLevelMap ? [{
								...configured,
								thinkingLevelMap: model.thinkingLevelMap
							}] : [];
						}
						return [api !== "ollama" && model.thinkingLevelMap ? Object.assign({}, model, { thinkingLevelMap: void 0 }) : model];
					}),
					baseUrl: resolveOllamaRuntimeBaseUrl({
						api,
						configuredBaseUrl,
						discoveredBaseUrl: provider.baseUrl
					}),
					api,
					...apiKey ? { apiKey } : {}
				}
			};
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
function mergeUniqueModelNames(...groups) {
	const mergedByKey = /* @__PURE__ */ new Map();
	for (const group of groups) for (const name of group) {
		const key = getOllamaLatestDedupeKey(name);
		const existing = mergedByKey.get(key);
		if (existing === void 0 || !existing.trim().toLowerCase().endsWith(":latest") && name.trim().toLowerCase().endsWith(":latest")) mergedByKey.set(key, name);
	}
	return [...mergedByKey.values()];
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
function isOllamaToolsCapableModel(model) {
	return !isOllamaEmbeddingOnlyModel(model) && model.capabilities?.includes("tools") === true;
}
function selectAppGuidedOllamaModelFromDiscovery(models) {
	const eligible = [...models].filter((model) => isOllamaToolsCapableModel(model) && model.contextWindow !== void 0 && model.contextWindow >= 16384);
	const nonReasoning = eligible.filter((model) => !(model.capabilities?.includes("thinking") ?? isReasoningModelHeuristic(model.name)));
	const pool = nonReasoning.length > 0 ? nonReasoning : eligible;
	const measuredSizes = pool.map((model) => model.size).filter((size) => typeof size === "number" && size > 0);
	const smallestSize = measuredSizes.length > 0 ? Math.min(...measuredSizes) : void 0;
	return orderPreferredOllamaModelIds((smallestSize === void 0 ? pool : pool.filter((model) => model.size === smallestSize)).map((model) => model.name))[0];
}
function buildOllamaModelsConfig(modelNames, discoveredModelsByName, baseUrl) {
	return modelNames.flatMap((name) => {
		const discovered = discoveredModelsByName?.get(name);
		if (discovered && isOllamaEmbeddingOnlyModel(discovered)) return [];
		return [buildOllamaModelDefinition(name, discovered?.contextWindow, discovered?.capabilities, {
			...discovered,
			remote: isHostedOllamaCloud(baseUrl) || Boolean(discovered && isOllamaRemoteModel(discovered))
		})];
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
export { mergeUniqueModelNames as a, selectAppGuidedOllamaModelFromDiscovery as c, isLocalOllamaBaseUrl as d, isOllamaApiKeyMarker as f, shouldUseSyntheticOllamaAuth as g, resolveOllamaRuntimeBaseUrl as h, inspectOllamaModelsForSetup as i, OLLAMA_PROVIDER_ID as l, resolveOllamaDiscoveryResult as m, buildOllamaModelsConfig as n, normalizeOllamaModelName as o, readOllamaStringValue as p, discoverOllamaModelsForSetup as r, orderPreferredOllamaModelIds as s, OLLAMA_APP_GUIDED_MIN_CONTEXT_TOKENS as t, getUnlistedOllamaConfiguredModelIds as u };
