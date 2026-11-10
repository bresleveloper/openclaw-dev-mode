import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { h as finiteSecondsToTimerSafeMilliseconds, s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { s as normalizeStaticProviderModelId } from "./model-ref-shared-BRJ3VRZV.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as buildModelCatalogMergeKey } from "./model-catalog-refs-D3xvQZh0.mjs";
import { t as captureRemoteModelCatalogSnapshot } from "./remote-overlay-ClWDV070.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CjTFYNkp.mjs";
import { r as findConfiguredProviderModel } from "./model-provider-config-wdC9jpCz.mjs";
import { n as indexFirstByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import "./defaults-Bg930vxE.mjs";
import { a as resolveCatalogOwnedModelCompat, n as modelTransportRoutesMatch } from "./model-compat-catalog-VI3Psdyr.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-C49Gg9BA.mjs";
import { t as createProviderModelCatalogIdNormalizer } from "./provider-model-routes-CmpBxrCV.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { a as createModelVisibilityPolicyWithFallbacks, u as listModelAliasCandidates } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime, r as canonicalizeOpenAIModelId } from "./openai-routing-Bm7d8DH8.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { a as resolveAuthProfileOrder } from "./order-CElLtwMu.mjs";
import { a as registryContainsRuntimePluginIds } from "./active-runtime-registry-BrXk-dcA.mjs";
import { r as modelCatalogRowToEntry } from "./model-catalog-entry-BWd5zbsm.mjs";
import { n as attachModelProviderRequestRouteFacts, p as sanitizeConfiguredModelProviderRequest, r as attachModelProviderRequestTransport, s as inheritModelProviderRequestRouteFacts, u as resolveProviderRequestConfig } from "./provider-request-config-WdycwKIG.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kYfv_bUN.mjs";
import { f as loadAuthProfileStoreForRuntimeAsync } from "./store-runtime-CwqGD12G.mjs";
import { a as resolveLoadedProviderRuntimePlugin } from "./provider-hook-runtime-DHSjZAkW.mjs";
import { a as buildProviderUnknownModelHintWithPlugin, d as normalizeProviderResolvedModelWithPlugin, j as shouldPreferProviderRuntimeResolvedModel, k as runProviderDynamicModel, m as prepareProviderDynamicModel, p as normalizeProviderTransportWithPlugin, t as applyProviderResolvedTransportWithPlugin } from "./provider-runtime-DZ8luukj.mjs";
import { f as resolveAgentDiscoveryAuthFacts, n as ownPreparedPluginGeneration } from "./prepared-model-runtime.plugin-lifetime-Ck5dh_-n.mjs";
import { r as resolveModelPluginMetadataSnapshot, t as ModelRegistry } from "./model-registry-pyM1O0Zs.mjs";
import { i as normalizeModelCompat } from "./provider-model-compat-JoOGepWg.mjs";
import { t as AuthStorage } from "./auth-storage-DHC97REI.mjs";
import { t as attachModelProviderLocalService } from "./provider-local-service-Cze7fsuy.mjs";
import { a as sanitizeModelHeaders, i as resolveProviderModelInput, r as normalizeResolvedTransportApi } from "./model.inline-provider-DwjZUIZW.mjs";
import { i as shouldUnconditionallySuppress, n as buildSuppressedBuiltInModelError } from "./model-suppression-BWbx1-dY.mjs";
import { t as resolveProviderTransport } from "./model.provider-transport-1LpjfXEc.mjs";
import { o as resolveManifestModelCatalogProviderAliasMetadata } from "./model.static-catalog-JSpbzt04.mjs";
import { a as mergeCatalogInlineModel, c as resolveConfiguredProviderConfig, d as mergeModelMediaInput, f as resolveMergedConfiguredModelReasoning, i as hasConfiguredModelRouteSupport, l as resolveConfiguredProviderDefaultApi, n as clampModelMaxTokensToContextWindow, o as mergeConfiguredModelCost, r as findInlineModelMatch, s as mergeConfiguredRuntimeModelParams, t as applyConfiguredProviderOverrides, u as shouldSuppressConfiguredModel } from "./model.configured-overrides-D557qnhf.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { t as createSelectedAuthProfileUnavailableError } from "./selection-error-AB1aZh_J.mjs";
import { a as resolveAgentRuntimePluginSelectionOwners } from "./runtime-plugin-load-plan-Cjd4Pbax.mjs";
import path from "node:path";
//#region src/agents/model-discovery-normalize.ts
/** Applies plugin model normalization and transport hooks to discovered agent models. */
function normalizeDiscoveredAgentModel(value, agentDir, options) {
	if (!isRecord(value)) return value;
	if (typeof value.id !== "string" || typeof value.name !== "string" || typeof value.provider !== "string") return value;
	const model = value;
	const runtimeContext = {
		...options?.config !== void 0 ? { config: options.config } : {},
		...options?.workspaceDir !== void 0 ? { workspaceDir: options.workspaceDir } : {}
	};
	const pluginNormalized = normalizeProviderResolvedModelWithPlugin({
		provider: model.provider,
		...runtimeContext,
		context: {
			provider: model.provider,
			modelId: model.id,
			model,
			agentDir
		}
	}) ?? model;
	const transportNormalized = applyProviderResolvedTransportWithPlugin({
		provider: model.provider,
		...runtimeContext,
		context: {
			provider: model.provider,
			modelId: model.id,
			model: pluginNormalized,
			agentDir
		}
	}) ?? pluginNormalized;
	if (!isRecord(transportNormalized) || typeof transportNormalized.id !== "string" || typeof transportNormalized.name !== "string" || typeof transportNormalized.provider !== "string" || typeof transportNormalized.api !== "string") return value;
	return normalizeModelCompat(transportNormalized, options?.providerMetadataOwners);
}
//#endregion
//#region src/agents/agent-model-discovery.ts
/** Discovers agent models and auth storage with provider/plugin normalization hooks. */
const CAPTURED_MODELS_JSON_SOURCE_PATH = "captured:models.json";
function prepareModelRegistryOptions(options) {
	const pluginMetadataSnapshot = resolveModelPluginMetadataSnapshot({
		...options?.config ? { config: options.config } : {},
		...options?.pluginMetadataSnapshot ? { pluginMetadataSnapshot: options.pluginMetadataSnapshot } : {},
		...options?.workspaceDir ? { workspaceDir: options.workspaceDir } : {},
		allowWorkspaceScopedCurrent: options?.workspaceDir === void 0
	});
	return {
		config: options?.config,
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {},
		...options?.includePluginCatalogs !== void 0 ? { includePluginCatalogs: options.includePluginCatalogs } : {},
		...options?.modelsJsonContents !== void 0 ? { modelsJsonContents: options.modelsJsonContents } : {},
		...options?.pluginCatalogs !== void 0 ? { pluginCatalogs: options.pluginCatalogs } : {},
		staticProviderConfigs: options?.staticProviderConfigs
	};
}
function normalizeOpenClawModelRegistry(registry, agentDir, options) {
	const providerMetadataOwners = registry.getProviderMetadataOwners();
	const getAll = registry.getAll.bind(registry);
	const getAvailable = registry.getAvailable.bind(registry);
	const find = registry.find.bind(registry);
	const refresh = registry.refresh.bind(registry);
	const refreshAsync = registry.refreshAsync.bind(registry);
	const shouldNormalize = options?.normalizeModels !== false;
	const findCache = /* @__PURE__ */ new Map();
	const normalizeEntry = (entry) => {
		if (!shouldNormalize) return entry;
		if (!agentDir) throw new Error("agent directory is required for model normalization");
		return normalizeDiscoveredAgentModel(entry, agentDir, {
			...options,
			...providerMetadataOwners ? { providerMetadataOwners } : {}
		});
	};
	registry.getAll = () => getAll().map(normalizeEntry);
	registry.getAvailable = () => getAvailable().map(normalizeEntry);
	registry.find = (provider, modelId) => {
		const key = `${provider}\0${modelId}`;
		if (findCache.has(key)) return findCache.get(key);
		const fallbackEntry = find(provider, modelId);
		const resolved = fallbackEntry ? normalizeEntry(fallbackEntry) : void 0;
		findCache.set(key, resolved);
		return resolved;
	};
	registry.refresh = () => {
		findCache.clear();
		return refresh();
	};
	registry.refreshAsync = async () => {
		await refreshAsync();
		findCache.clear();
	};
	return registry;
}
/** Captures the effective profile store and its AuthStorage projection as one generation. */
async function discoverAuthStorageFacts(agentDir, options) {
	const facts = options?.skipCredentials === true ? {
		store: {
			version: 1,
			profiles: {}
		},
		credentials: {}
	} : await resolveAgentDiscoveryAuthFacts(agentDir, options);
	return {
		...facts,
		authStorage: AuthStorage.inMemory(facts.credentials)
	};
}
/** Discover persisted catalogs off the Gateway thread before publishing normalized models. */
async function discoverModelsAsync(authStorage, agentDir, options) {
	return normalizeOpenClawModelRegistry(await ModelRegistry.createAsync(authStorage, path.join(agentDir, "models.json"), prepareModelRegistryOptions(options)), agentDir, options);
}
/**
* Parses complete lifecycle-captured sources without retaining an agent-directory dependency.
* Callers may share the resulting immutable catalog snapshot across exact source generations.
*/
function discoverModelsFromCapturedSources(authStorage, options) {
	return normalizeOpenClawModelRegistry(ModelRegistry.fromCapturedSources(authStorage, CAPTURED_MODELS_JSON_SOURCE_PATH, {
		...prepareModelRegistryOptions(options),
		pluginCatalogs: options.pluginCatalogs
	}), void 0, {
		...options,
		normalizeModels: false
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/model.provider-hooks.ts
let targetProviderRuntimeHooks;
let defaultProviderRuntimeHooks;
const STATIC_PROVIDER_RUNTIME_HOOKS = {
	applyProviderResolvedTransportWithPlugin: () => void 0,
	buildProviderUnknownModelHintWithPlugin: () => void 0,
	prepareProviderDynamicModel: async () => {},
	runProviderDynamicModel: () => void 0,
	normalizeProviderResolvedModelWithPlugin: () => void 0,
	normalizeProviderTransportWithPlugin: () => void 0
};
function resolveRuntimeHooks(params) {
	if (params?.skipProviderRuntimeHooks) return STATIC_PROVIDER_RUNTIME_HOOKS;
	if (params?.runtimeHooks) return params.runtimeHooks;
	targetProviderRuntimeHooks ??= {
		resolveToolSearchMode: (context) => {
			const metadata = { manifestRegistry: getCurrentPluginMetadataSnapshot({
				allowScopedSnapshot: true,
				allowWorkspaceScopedSnapshot: true
			})?.manifestRegistry };
			return (resolveProviderPolicySurface(context.provider, metadata)?.resolveToolSearchMode ?? (context.api !== context.provider ? resolveProviderPolicySurface(context.api, metadata)?.resolveToolSearchMode : void 0))?.(context);
		},
		buildProviderUnknownModelHintWithPlugin,
		prepareProviderDynamicModel,
		runProviderDynamicModel,
		shouldPreferProviderRuntimeResolvedModel,
		normalizeProviderResolvedModelWithPlugin,
		applyProviderResolvedTransportWithPlugin: () => void 0,
		normalizeProviderTransportWithPlugin: () => void 0
	};
	if (params?.skipAgentDiscovery) return targetProviderRuntimeHooks;
	return defaultProviderRuntimeHooks ??= {
		...targetProviderRuntimeHooks,
		applyProviderResolvedTransportWithPlugin,
		normalizeProviderTransportWithPlugin
	};
}
function normalizeResolvedModel(params) {
	const normalizeModelCost = (cost) => {
		if (!cost || typeof cost !== "object" || Array.isArray(cost)) return {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		};
		const record = cost;
		const normalized = {
			input: asFiniteNumber(record.input) ?? 0,
			output: asFiniteNumber(record.output) ?? 0,
			cacheRead: asFiniteNumber(record.cacheRead) ?? 0,
			cacheWrite: asFiniteNumber(record.cacheWrite) ?? 0
		};
		return [
			"input",
			"output",
			"cacheRead",
			"cacheWrite"
		].every((key) => normalized[key] === record[key]) ? record : {
			...cost,
			...normalized
		};
	};
	const normalizedInputModel = {
		...params.model,
		input: resolveProviderModelInput({
			provider: params.provider,
			modelId: params.model.id,
			modelName: params.model.name,
			input: params.model.input
		}),
		cost: normalizeModelCost(params.model.cost)
	};
	const runtimeHooks = params.runtimeHooks ?? resolveRuntimeHooks();
	const hookParams = {
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir
	};
	const modelContext = {
		...hookParams,
		agentDir: params.agentDir,
		modelId: normalizedInputModel.id,
		model: normalizedInputModel
	};
	const pluginModel = runtimeHooks.normalizeProviderResolvedModelWithPlugin({
		...hookParams,
		context: { ...modelContext }
	}) ?? normalizedInputModel;
	let transportNormalized = runtimeHooks.applyProviderResolvedTransportWithPlugin?.({
		...hookParams,
		context: {
			...modelContext,
			modelId: normalizedInputModel.id,
			model: pluginModel
		}
	});
	if (transportNormalized == null) {
		const normalized = runtimeHooks.normalizeProviderTransportWithPlugin({
			...hookParams,
			modelId: pluginModel.id,
			context: {
				...hookParams,
				modelId: pluginModel.id,
				api: pluginModel.api,
				baseUrl: pluginModel.baseUrl
			}
		});
		const api = normalizeResolvedTransportApi(normalized?.api) ?? pluginModel.api;
		const baseUrl = normalized?.baseUrl ?? pluginModel.baseUrl;
		if (api !== pluginModel.api || baseUrl !== pluginModel.baseUrl) transportNormalized = {
			...pluginModel,
			api,
			baseUrl
		};
	}
	const normalizedModel = normalizeModelCompat(transportNormalized ?? pluginModel);
	const modelWithProviderTimeout = normalizedModel.requestTimeoutMs === void 0 && normalizedInputModel.requestTimeoutMs !== void 0 ? {
		...normalizedModel,
		requestTimeoutMs: normalizedInputModel.requestTimeoutMs
	} : normalizedModel;
	const providerConfig = findNormalizedProviderValue(params.cfg?.models?.providers, params.provider);
	const toolSearchMode = runtimeHooks.resolveToolSearchMode?.({
		provider: params.provider,
		modelId: modelWithProviderTimeout.id,
		api: modelWithProviderTimeout.api,
		baseUrl: modelWithProviderTimeout.baseUrl
	}) ?? (providerConfig?.localService && modelTransportRoutesMatch({ baseUrl: providerConfig.baseUrl }, { baseUrl: modelWithProviderTimeout.baseUrl }) ? "tools" : void 0);
	const modelWithToolSearch = {
		...modelWithProviderTimeout,
		toolSearchMode
	};
	const canonicalModelId = canonicalizeOpenAIModelId(params.provider, modelWithToolSearch.id);
	return inheritModelProviderRequestRouteFacts(params.model, canonicalModelId === modelWithToolSearch.id ? modelWithToolSearch : {
		...modelWithToolSearch,
		id: canonicalModelId,
		name: canonicalizeOpenAIModelId(params.provider, modelWithToolSearch.name) === canonicalModelId ? canonicalModelId : modelWithToolSearch.name
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/model.configured-fallback.ts
function buildConfiguredFallbackModel(params) {
	const { provider, modelId, cfg } = params;
	const providerConfig = resolveConfiguredProviderConfig(cfg, provider);
	const requestTimeoutMs = finiteSecondsToTimerSafeMilliseconds(providerConfig?.timeoutSeconds, { floorSeconds: true });
	const configuredModel = findConfiguredProviderModel(providerConfig, provider, modelId, createProviderModelCatalogIdNormalizer(provider));
	if (!configuredModel && !providerConfig?.baseUrl?.trim()) return;
	const staticCatalogModel = params.getStaticCatalogModel?.();
	const metadataModel = configuredModel ?? staticCatalogModel;
	const fallbackMediaInput = mergeModelMediaInput(staticCatalogModel?.mediaInput, configuredModel?.mediaInput);
	const providerHeaders = sanitizeModelHeaders(providerConfig?.headers);
	const providerRequest = sanitizeConfiguredModelProviderRequest(providerConfig?.request);
	const staticCatalogHeaders = sanitizeModelHeaders(staticCatalogModel?.headers);
	const modelHeaders = sanitizeModelHeaders(configuredModel?.headers);
	const resolvedParams = mergeConfiguredRuntimeModelParams({
		...params,
		discoveredParams: staticCatalogModel?.params,
		providerParams: providerConfig?.params,
		configuredParams: configuredModel?.params
	});
	const providerConfiguredApi = normalizeResolvedTransportApi(providerConfig?.api);
	const configuredModelBaseUrl = normalizeOptionalString(configuredModel?.baseUrl);
	const providerConfiguredBaseUrl = normalizeOptionalString(providerConfig?.baseUrl);
	const manifestAliasTransport = params.manifestAlias.transport;
	const manifestAliasBaseUrl = normalizeOptionalString(manifestAliasTransport?.baseUrl);
	const staticCatalogBaseUrl = normalizeOptionalString(staticCatalogModel?.baseUrl);
	const fallbackTransport = resolveProviderTransport({
		...params,
		api: normalizeResolvedTransportApi(configuredModel?.api) ?? providerConfiguredApi ?? manifestAliasTransport?.api ?? normalizeResolvedTransportApi(staticCatalogModel?.api) ?? resolveConfiguredProviderDefaultApi({
			...params,
			providerConfig
		}) ?? "openai-responses",
		baseUrl: configuredModelBaseUrl ?? providerConfiguredBaseUrl ?? manifestAliasBaseUrl ?? staticCatalogBaseUrl
	});
	if (!hasConfiguredModelRouteSupport({
		...params,
		configuredModel,
		catalogModel: staticCatalogModel,
		route: fallbackTransport
	})) return;
	const fallbackCompat = resolveCatalogOwnedModelCompat({
		...staticCatalogModel ? { catalogRoute: staticCatalogModel } : {},
		catalogCompat: staticCatalogModel?.compat,
		configuredRoute: fallbackTransport,
		configuredCompat: configuredModel?.compat
	});
	if (configuredModel && shouldSuppressConfiguredModel({
		...params,
		baseUrl: fallbackTransport.baseUrl
	})) return;
	const requestConfig = resolveProviderRequestConfig({
		provider,
		api: fallbackTransport.api ?? "openai-responses",
		baseUrl: fallbackTransport.baseUrl,
		...params.providerMetadataOwners ? { providerMetadataOwners: params.providerMetadataOwners } : {},
		discoveredHeaders: staticCatalogHeaders,
		providerHeaders,
		modelHeaders,
		authHeader: providerConfig?.authHeader,
		request: providerRequest,
		capability: "llm",
		transport: "stream"
	});
	const fallbackReasoning = resolveMergedConfiguredModelReasoning({
		provider,
		compat: fallbackCompat,
		configuredReasoning: metadataModel?.reasoning
	});
	const configuredFallbackMaxTokens = configuredModel?.maxTokens ?? providerConfig?.maxTokens;
	const resolvedFallbackMaxTokens = configuredFallbackMaxTokens ?? staticCatalogModel?.maxTokens;
	const resolvedFallbackContextWindow = configuredModel?.contextWindow ?? staticCatalogModel?.contextWindow ?? 2e5;
	const normalizedResolvedFallbackMaxTokens = clampModelMaxTokensToContextWindow(resolvedFallbackMaxTokens, resolvedFallbackContextWindow);
	return normalizeResolvedModel({
		...params,
		model: attachModelProviderRequestRouteFacts(attachModelProviderLocalService(attachModelProviderRequestTransport({
			id: modelId,
			name: metadataModel?.name ?? modelId,
			api: requestConfig.api ?? "openai-responses",
			provider,
			baseUrl: requestConfig.baseUrl,
			reasoning: fallbackReasoning,
			input: resolveProviderModelInput({
				provider,
				modelId,
				modelName: metadataModel?.name ?? modelId,
				input: metadataModel?.input
			}),
			...configuredModel?.thinkingLevelMap !== void 0 ? { thinkingLevelMap: configuredModel.thinkingLevelMap } : {},
			cost: mergeConfiguredModelCost({
				...params,
				configuredModel,
				catalogCost: staticCatalogModel?.cost
			}),
			contextWindow: resolvedFallbackContextWindow,
			contextTokens: configuredModel?.contextTokens ?? staticCatalogModel?.contextTokens,
			...normalizedResolvedFallbackMaxTokens !== void 0 ? {
				maxTokens: normalizedResolvedFallbackMaxTokens,
				maxTokensSource: configuredFallbackMaxTokens !== void 0 ? "configured" : "discovered"
			} : {},
			...resolvedParams ? { params: resolvedParams } : {},
			...requestTimeoutMs !== void 0 ? { requestTimeoutMs } : {},
			headers: requestConfig.headers,
			...providerConfig?.authHeader !== void 0 ? { authHeader: providerConfig.authHeader } : {},
			compat: fallbackCompat,
			mediaInput: fallbackMediaInput
		}, providerRequest), providerConfig?.localService), params.providerMetadataOwners)
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/model.registry-resolution.ts
function getRegistryProviderMetadataOwners(modelRegistry) {
	return modelRegistry.getProviderMetadataOwners?.();
}
function normalizeConfiguredProviderModel(params) {
	const model = applyConfiguredProviderOverrides(params);
	return model ? normalizeResolvedModel({
		...params,
		model
	}) : void 0;
}
function resolveExplicitModelWithRegistry(params) {
	const { provider, modelId, modelRegistry, cfg, workspaceDir } = params;
	if (params.manifestAlias.ambiguous) return { kind: "unavailable" };
	if (shouldUnconditionallySuppress({
		provider,
		id: modelId,
		config: cfg,
		workspaceDir
	})) return { kind: "suppressed" };
	const providerMetadataOwners = getRegistryProviderMetadataOwners(modelRegistry);
	const providerConfig = resolveConfiguredProviderConfig(cfg, provider);
	const suppressionError = (baseUrl) => buildSuppressedBuiltInModelError({
		provider,
		id: modelId,
		config: cfg,
		baseUrl,
		workspaceDir
	});
	const inlineMatch = findInlineModelMatch({
		providers: cfg?.models?.providers ?? {},
		preparedModels: params.preparedInlineProviderModels,
		provider,
		modelId
	});
	const inlineModel = inlineMatch?.api ? inlineMatch : void 0;
	const registryModel = params.preparedCatalogModel ?? modelRegistry.find(provider, modelId);
	const staticCatalogModel = inlineModel ? params.getStaticCatalogModel?.() : void 0;
	const catalogModel = inlineModel && registryModel && modelTransportRoutesMatch(registryModel, inlineModel) ? registryModel : staticCatalogModel;
	const discoveredModel = inlineModel ? {
		...mergeCatalogInlineModel(catalogModel, inlineModel),
		cost: registryModel?.cost ?? staticCatalogModel?.cost ?? inlineModel.cost
	} : registryModel;
	if (!discoveredModel) {
		if (inlineMatch) return;
		const error = suppressionError(providerConfig?.baseUrl);
		return error ? {
			kind: "suppressed",
			error
		} : void 0;
	}
	const model = normalizeConfiguredProviderModel({
		...params,
		discoveredModel,
		providerConfig,
		providerMetadataOwners,
		preferDiscoveredTransport: Boolean(inlineModel),
		staticCatalogModel: catalogModel
	});
	if (!model) return;
	if (!inlineModel || shouldSuppressConfiguredModel({
		provider,
		modelId,
		cfg,
		workspaceDir,
		baseUrl: model.baseUrl
	})) {
		const error = suppressionError(model.baseUrl);
		if (error) return {
			kind: "suppressed",
			error
		};
	}
	return inlineModel ? {
		kind: "resolved",
		source: "configured",
		model
	} : {
		kind: "resolved",
		source: "registry",
		model,
		dropOnRuntimeMiss: normalizeProviderId(provider) === "openai" && modelId.trim().toLowerCase() === "gpt-5.3-codex-spark" && !(providerConfig?.baseUrl ?? discoveredModel.baseUrl)
	};
}
async function resolveDynamicModelAuthProfile(params) {
	params.abortSignal?.throwIfAborted();
	const explicitProfileId = params.authProfileId?.trim() || void 0;
	if (params.authProfileMode) return {
		...explicitProfileId ? { authProfileId: explicitProfileId } : {},
		authProfileMode: params.authProfileMode
	};
	const agentDir = params.agentDir;
	const readOptions = {
		readOnly: true,
		migrationProvider: params.provider,
		allowKeychainPrompt: false,
		profileId: explicitProfileId,
		config: params.cfg,
		externalCli: externalCliDiscoveryForProviderAuth({
			cfg: params.cfg,
			provider: params.provider,
			profileId: explicitProfileId,
			preferredProfile: params.preferredProfile
		})
	};
	const providers = listOpenAIAuthProfileProvidersForAgentRuntime({
		provider: params.provider,
		config: params.cfg
	});
	const store = await loadAuthProfileStoreForRuntimeAsync(agentDir, readOptions);
	params.abortSignal?.throwIfAborted();
	const profileId = explicitProfileId ?? providers.flatMap((provider) => resolveAuthProfileOrder({
		cfg: params.cfg,
		store,
		provider,
		preferredProfile: params.preferredProfile,
		forModel: params.modelId,
		includePendingOAuthRefresh: true
	}))[0];
	if (!profileId) return {};
	const credential = store.profiles[profileId];
	const configuredMode = params.cfg?.auth?.profiles?.[profileId]?.mode;
	if (explicitProfileId && !credential && configuredMode !== "aws-sdk") throw createSelectedAuthProfileUnavailableError({
		provider: params.provider,
		modelId: params.modelId,
		profileId
	});
	return {
		authProfileId: profileId,
		...credential?.type || configuredMode ? { authProfileMode: credential?.type ?? configuredMode } : {}
	};
}
async function resolvePluginDynamicModelWithRegistry(params) {
	const { provider, modelId, modelRegistry, cfg, agentDir, workspaceDir } = params;
	const runtimeHooks = params.runtimeHooks ?? resolveRuntimeHooks();
	const providerConfig = resolveConfiguredProviderConfig(cfg, provider);
	let pluginDynamicModel = params.preparedDynamicModel;
	if (!pluginDynamicModel) {
		const authProfile = params.preparedAuthProfile ?? await resolveDynamicModelAuthProfile(params);
		params.assertCurrent?.();
		const agentHarnessPolicy = resolveAgentHarnessPolicy({
			provider,
			modelId,
			config: cfg
		});
		const inferredAgentRuntimeId = agentHarnessPolicy.runtimeSource !== "implicit" || cfg?.plugins?.entries?.codex?.enabled === true ? agentHarnessPolicy.runtime : void 0;
		const agentRuntimeId = params.agentRuntimeId ?? inferredAgentRuntimeId;
		pluginDynamicModel = runtimeHooks.runProviderDynamicModel({
			provider,
			config: cfg,
			workspaceDir,
			context: {
				config: cfg,
				agentDir,
				workspaceDir,
				...agentRuntimeId ? { agentRuntimeId } : {},
				provider,
				modelId,
				modelRegistry,
				providerConfig,
				...authProfile
			}
		});
	}
	if (!pluginDynamicModel) return;
	return normalizeConfiguredProviderModel({
		...params,
		discoveredModel: pluginDynamicModel,
		providerConfig,
		providerMetadataOwners: getRegistryProviderMetadataOwners(modelRegistry),
		runtimeHooks,
		preferDiscoveredModelMetadata: shouldCompareProviderRuntimeResolvedModel({
			...params,
			runtimeHooks
		})
	});
}
async function resolveRuntimePreferredSuppressedModel(params) {
	params.assertCurrent?.();
	const runtimeHooks = params.runtimeHooks ?? resolveRuntimeHooks();
	if (!shouldCompareProviderRuntimeResolvedModel({
		...params,
		runtimeHooks
	})) return;
	return resolvePluginDynamicModelWithRegistry({
		...params,
		runtimeHooks
	});
}
function shouldCompareProviderRuntimeResolvedModel(params) {
	return params.runtimeHooks.shouldPreferProviderRuntimeResolvedModel?.({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			provider: params.provider,
			modelId: params.modelId,
			config: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		}
	}) ?? false;
}
function normalizeProviderModelRef(params) {
	const manifestAlias = resolveManifestModelCatalogProviderAliasMetadata({
		provider: params.provider,
		modelId: params.modelId,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir
	});
	return {
		provider: manifestAlias.provider,
		model: params.modelIdSource === "selected" ? params.modelId : normalizeStaticProviderModelId(normalizeProviderId(manifestAlias.provider), params.modelId),
		manifestAlias
	};
}
async function resolveModelWithPreparedRegistry(params) {
	params.assertCurrent?.();
	const runtimeHooks = params.runtimeHooks ?? resolveRuntimeHooks();
	const explicitModel = resolveExplicitModelWithRegistry(params);
	if (explicitModel?.kind === "unavailable") return;
	if (explicitModel?.kind === "suppressed") return resolveRuntimePreferredSuppressedModel(params);
	if (explicitModel?.kind === "resolved" && !shouldCompareProviderRuntimeResolvedModel({
		...params,
		runtimeHooks
	})) return explicitModel.model;
	const pluginDynamicModel = await resolvePluginDynamicModelWithRegistry(params);
	params.assertCurrent?.();
	if (explicitModel?.kind === "resolved") return pluginDynamicModel ?? (explicitModel.source === "registry" && explicitModel.dropOnRuntimeMiss ? void 0 : explicitModel.model);
	if (pluginDynamicModel) return pluginDynamicModel;
	return params.skipConfiguredFallback ? void 0 : buildConfiguredFallbackModel({
		...params,
		providerMetadataOwners: getRegistryProviderMetadataOwners(params.modelRegistry)
	});
}
//#endregion
//#region src/agents/prepared-model-runtime.configured-completion.ts
function completeConfiguredRuntimeModels(agentFacts, pluginGeneration, modelRegistry) {
	if (!pluginGeneration.pluginRegistry) return agentFacts.configuredRuntimeModels;
	const { input, configuredModelRefs, configuredRuntimeModels, env } = agentFacts;
	const { config, agentDir, workspaceDir } = input;
	return withPluginRuntimeGenerationScope({
		metadataSnapshot: pluginGeneration.pluginMetadataSnapshot,
		pluginRegistry: pluginGeneration.pluginRegistry
	}, () => {
		const existing = new Map(configuredRuntimeModels.map((configured) => [buildModelCatalogMergeKey(configured.provider, configured.modelId), configured]));
		const completed = [];
		for (const [key, ref] of indexFirstByKey(configuredModelRefs, ({ provider, modelId }) => buildModelCatalogMergeKey(provider, modelId))) {
			const { provider, modelId } = ref;
			const model = existing.get(key)?.model ?? resolveLoadedProviderRuntimePlugin({
				provider,
				modelId,
				config,
				workspaceDir,
				env
			})?.resolveDynamicModel?.({
				config,
				agentDir,
				workspaceDir,
				provider,
				modelId,
				modelRegistry,
				providerConfig: config.models?.providers?.[provider] ?? findNormalizedProviderValue(config.models?.providers, provider)
			});
			if (model) completed.push({
				...ref,
				model
			});
		}
		return completed;
	});
}
/** Prepare prompt aliases without promoting execution defaults into catalog metadata. */
function prepareConfiguredModelAliases(agentFacts, pluginGeneration, modelRegistry, models) {
	const { config, agentId, agentDir, workspaceDir } = agentFacts.input;
	if (listModelAliasCandidates(config, agentId).length === 0) return [];
	return withPluginRuntimeGenerationScope({
		metadataSnapshot: pluginGeneration.pluginMetadataSnapshot,
		pluginRegistry: pluginGeneration.pluginRegistry
	}, () => {
		const selection = {
			cfg: config,
			agentId,
			allowPluginNormalization: false,
			manifestPlugins: pluginGeneration.pluginMetadataSnapshot.plugins
		};
		const defaults = resolveDefaultModelForAgent({
			...selection,
			allowManifestNormalization: false
		});
		const policy = createModelVisibilityPolicyWithFallbacks({
			...selection,
			defaultProvider: defaults.provider,
			defaultModel: defaults,
			catalog: [...modelRegistry.getAll().map(modelCatalogRowToEntry), ...models.map(({ model }) => modelCatalogRowToEntry(model))],
			fallbackModels: []
		});
		const prepared = new Map(models.map((entry) => [modelKey(entry.provider, entry.modelId), entry.model]));
		return [...policy.selectionAliasIndex.byAlias.values()].flatMap(({ alias, ref }) => {
			if (!policy.allows(ref)) return [];
			const manifestAlias = resolveManifestModelCatalogProviderAliasMetadata({
				provider: ref.provider,
				modelId: ref.model,
				cfg: config,
				workspaceDir
			});
			const resolved = resolveExplicitModelWithRegistry({
				provider: ref.provider,
				modelId: ref.model,
				preparedCatalogModel: prepared.get(modelKey(ref.provider, ref.model)),
				modelRegistry,
				cfg: config,
				agentDir,
				workspaceDir,
				manifestAlias
			});
			return (resolved ? resolved.kind === "resolved" : buildConfiguredFallbackModel({
				provider: ref.provider,
				modelId: ref.model,
				cfg: config,
				agentDir,
				workspaceDir,
				providerMetadataOwners: pluginGeneration.pluginMetadataSnapshot.owners,
				manifestAlias
			})) ? [{
				alias,
				...ref
			}] : [];
		});
	});
}
//#endregion
//#region src/agents/prepared-model-runtime.plugin-generation.ts
/** Retains the original source and checks its captured authority only for new admission. */
function acquirePreparedMediaCapabilityProviders(source, providers, registry) {
	const isCurrent = capturePluginLifecycleAuthority(source.registry, void 0, { scopedRuntime: true });
	let released = false;
	const assertOpen = () => {
		if (released || !isCurrent?.()) throw new Error("The media provider setup changed before generation started. Retry the request with the current provider setup.");
	};
	assertOpen();
	const invocations = source.resources.createInvocationScope(registry);
	const claim = source.resources.retain();
	const wrapProvider = (provider) => invocations.wrap(provider);
	return {
		providers: {
			mediaUnderstandingProviders: providers.mediaUnderstandingProviders?.map(wrapProvider),
			imageGenerationProviders: providers.imageGenerationProviders?.map(wrapProvider),
			videoGenerationProviders: providers.videoGenerationProviders?.map(wrapProvider),
			musicGenerationProviders: providers.musicGenerationProviders?.map(wrapProvider)
		},
		assertOpen,
		release: () => {
			released = true;
			invocations.release();
			return claim.release();
		}
	};
}
const derivedGenerationBases = /* @__PURE__ */ new WeakMap();
/** Borrowing may narrow a prepared selection, but cannot acquire a different plugin owner. */
function preparedPluginGenerationSupportsSelections(generation, input) {
	if (!input.runtimePluginSelections) return true;
	const registry = generation.pluginRegistry;
	const selection = resolveAgentRuntimePluginSelectionOwners({
		config: input.config,
		workspaceDir: generation.pluginMetadataSnapshot.workspaceDir ?? input.workspaceDir ?? process.cwd(),
		selections: input.runtimePluginSelections,
		metadataSnapshot: generation.pluginMetadataSnapshot
	});
	return registry !== void 0 && selection.pluginIds.every((id) => registry.plugins.some((plugin) => plugin.id === id && (plugin.status === "error" || plugin.status === "disabled")) || registryContainsRuntimePluginIds(registry, [id]));
}
function preparedPluginGenerationReusesBase(generation, base) {
	return generation === base || generation !== void 0 && derivedGenerationBases.get(generation) === base;
}
function createPreparedPluginGeneration(params) {
	const reusable = params.reusablePluginGeneration;
	if (reusable) {
		if (params.pluginMetadataSnapshot === reusable.pluginMetadataSnapshot && params.runtimePluginRegistry === reusable.pluginRegistry) return reusable;
		const derived = Object.freeze({
			...reusable,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot,
			pluginRegistry: params.runtimePluginRegistry,
			mediaCapabilityProviders: params.mediaCapabilityProviders,
			mediaCapabilityProviderSource: params.mediaCapabilityProviderSource,
			messageToolCatalog: params.messageToolCatalog,
			preparedStaticProviderCatalog: params.preparedStaticProviderCatalog
		});
		if (params.pluginMetadataSnapshot === reusable.pluginMetadataSnapshot) derivedGenerationBases.set(derived, reusable);
		ownPreparedPluginGeneration(derived);
		return derived;
	}
	const generation = Object.freeze({
		remoteCatalog: captureRemoteModelCatalogSnapshot(),
		pluginMetadataSnapshot: params.pluginMetadataSnapshot,
		inlineProviderModels: Object.freeze([...params.inlineProviderModels]),
		configuredCatalogEntries: Object.freeze([...params.configuredCatalogEntries]),
		...params.messageToolCatalog ? { messageToolCatalog: params.messageToolCatalog } : {},
		...params.runtimePluginRegistry ? { pluginRegistry: params.runtimePluginRegistry } : {},
		...params.inboundPluginRegistry ? { inboundPluginRegistry: params.inboundPluginRegistry } : {},
		...params.preferBuiltPluginArtifacts ? { preferBuiltPluginArtifacts: true } : {},
		...params.mediaCapabilityProviders ? { mediaCapabilityProviders: params.mediaCapabilityProviders } : {},
		...params.mediaCapabilityProviderSource ? { mediaCapabilityProviderSource: params.mediaCapabilityProviderSource } : {},
		...params.preparedStaticProviderCatalog ? { preparedStaticProviderCatalog: params.preparedStaticProviderCatalog } : {},
		...params.catalogMode === "live" ? { providerStaticModels: Object.freeze([...params.providerStaticModels ?? []]) } : {}
	});
	ownPreparedPluginGeneration(generation);
	return generation;
}
//#endregion
export { discoverModelsAsync as _, completeConfiguredRuntimeModels as a, normalizeProviderModelRef as c, resolveModelWithPreparedRegistry as d, resolveRuntimePreferredSuppressedModel as f, discoverAuthStorageFacts as g, resolveRuntimeHooks as h, preparedPluginGenerationSupportsSelections as i, resolveDynamicModelAuthProfile as l, buildConfiguredFallbackModel as m, createPreparedPluginGeneration as n, prepareConfiguredModelAliases as o, shouldCompareProviderRuntimeResolvedModel as p, preparedPluginGenerationReusesBase as r, normalizeConfiguredProviderModel as s, acquirePreparedMediaCapabilityProviders as t, resolveExplicitModelWithRegistry as u, discoverModelsFromCapturedSources as v };
