import { h as finiteSecondsToTimerSafeMilliseconds, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { E as waitForPluginCacheRetirement, c as getPluginCacheRetirementSignal, d as getPluginMetadataSnapshotCache, x as retainPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as hasRetainedPluginRuntimeCloseError, t as PluginRuntimeCloseRetainedError } from "./runtime-close-error-CYO2S35x.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as buildModelCatalogMergeKey } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as normalizeConfiguredProviderCatalogModelId } from "./provider-model-id-normalization-CO2R6uEC.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { s as normalizeStaticProviderModelId } from "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import "./defaults-BbU4k6fu.mjs";
import { n as resolveCatalogOwnedModelCompat, t as modelTransportRoutesMatch } from "./model-compat-catalog-DU9GPmr_.mjs";
import { r as findConfiguredProviderModel } from "./model-provider-config-BbSyhfVf.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-D2uZ1zpS.mjs";
import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-Dm_p9SMS.mjs";
import { a as resolveProviderModelRoutes, t as createProviderModelCatalogIdNormalizer } from "./provider-model-routes-CNgNpH_2.mjs";
import { a as createModelVisibilityPolicyWithFallbacks, u as listModelAliasCandidates } from "./model-selection-shared-0uvJbX1M.mjs";
import { t as findNormalizedProviderValue$1 } from "./model-selection-normalize-Dij_chYC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime, r as canonicalizeOpenAIModelId } from "./openai-routing-BspGC-O6.mjs";
import { b as materializeConfiguredProviderModelRows } from "./validation-core-DwJVlxTe.mjs";
import { t as mergeModelCost } from "./model-cost-BNQWuFdo.mjs";
import { _ as markPluginRegistryActive, a as capturePluginRegistryLifecycleEpoch, h as isPluginRegistryRetired, i as capturePluginLifecycleAuthority, l as getPluginRegistryLifetime, n as bindPluginRegistryLifetime, o as capturePluginRegistryLifecycleSignal, u as getPluginRegistryResourceOwner } from "./registry-lifecycle-BhTDZAHB.mjs";
import { o as disposePluginRegistryInstances } from "./runtime-BvdPUus5.mjs";
import { l as isOAuthRefreshFence } from "./credential-state-CWZ_V0ds.mjs";
import { C as isAmbientCredentialAllowedByProviderAuthPin } from "./store-CTvq6MSF.mjs";
import { k as AuthProfileRuntimeReadStaleError } from "./runtime-snapshots-CBozwlR0.mjs";
import { n as resolveProviderEndpoint } from "./provider-attribution-DUtJJsHV.mjs";
import { n as attachModelProviderRequestRouteFacts, p as sanitizeConfiguredModelProviderRequest, r as attachModelProviderRequestTransport, s as inheritModelProviderRequestRouteFacts, u as resolveProviderRequestConfig } from "./provider-request-config-DOrVD029.mjs";
import { o as registryContainsRuntimePluginIds } from "./active-runtime-registry-BttqxLSq.mjs";
import { f as getPluginRegistryInspectionResources, m as collectRegistryInvocationInstances } from "./registry-Bqh30cGD.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-BbOBKQM3.mjs";
import { a as resolveAuthProfileOrder } from "./order-BQhYF772.mjs";
import { m as resolveProviderEnvAuthLookupMaps, p as listProviderEnvAuthLookupKeys } from "./model-auth-markers-BfYDKFYI.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore, s as loadAuthProfileStoreForRuntimeAsync } from "./store-runtime-BcoYkagW.mjs";
import { r as normalizeResolvedPricing } from "./usage-cost-Va5dwVFW.mjs";
import "./src-BpANEEBH.mjs";
import { t as modelCatalogRowToEntry } from "./model-catalog-entry-CgZk9Ht4.mjs";
import { t as buildPreparedModelCatalogSnapshot } from "./model-catalog-Bg5BjnVl.mjs";
import { a as resolveLoadedProviderRuntimePlugin } from "./provider-hook-runtime-BGP4teSf.mjs";
import { F as runProviderDynamicModel, R as shouldPreferProviderRuntimeResolvedModel, a as buildProviderUnknownModelHintWithPlugin, f as normalizeProviderResolvedModelWithPlugin, h as prepareProviderDynamicModel, k as resolveProviderSyntheticAuthWithPlugin, m as normalizeProviderTransportWithPlugin, t as applyProviderResolvedTransportWithPlugin, v as prepareProviderSyntheticAuthWithPlugin } from "./provider-runtime-BofzCM_V.mjs";
import { i as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { c as resolveModelPluginMetadataSnapshot, i as AuthStorage, t as ModelRegistry } from "./model-registry-DrVlc5_5.mjs";
import { i as normalizeModelCompat } from "./provider-model-compat-D1iLDbYW.mjs";
import { t as attachModelProviderLocalService } from "./provider-local-service-Bc1IFUkA.mjs";
import { a as sanitizeModelHeaders, i as resolveProviderModelInput, r as normalizeResolvedTransportApi, t as buildInlineProviderModels } from "./model.inline-provider-BrhnLKm5.mjs";
import { i as shouldUnconditionallySuppress, n as buildSuppressedBuiltInModelError, r as resolveBuiltInModelSuppressionFromManifest } from "./model-suppression-BVXq4y94.mjs";
import { a as resolveBundledStaticCatalogModel, l as resolveProviderTransport, o as resolveManifestModelCatalogProviderAliasMetadata } from "./model.static-catalog-BlMsrqKa.mjs";
import "./auth-profiles-CYVlYrag.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { t as createSelectedAuthProfileUnavailableError } from "./selection-error-COiCGJ2G.mjs";
import { n as augmentPreparedModelCatalogWithAgentHarness } from "./model-catalog-ClJoThWR.mjs";
import { i as resolveAgentRuntimePluginLoadPlan } from "./runtime-plugin-load-plan-DrtegO6g.mjs";
import { n as capturePreparedModelRuntimeLifetime, o as registerPreparedPluginRetirement, s as retirePreparedModelRuntimeGeneration } from "./prepared-model-runtime.lifecycle-348wygR7.mjs";
import { a as releaseRuntimePluginWork, o as retainRuntimePluginWork, t as acquireAgentRuntimePluginRegistry } from "./runtime-plugins-C7qW3xTp.mjs";
import path from "node:path";
//#region src/agents/agent-auth-credentials.ts
/** Converts auth-profile credentials into agent runtime credential maps. */
const AGENT_SECRET_REF_CONFIGURED_MARKER = "openclaw-secret-ref-configured";
/** Records only credential modes whose secret material is usable by a prepared runtime owner. */
function resolveUsableAgentCredentialModes(credentials) {
	const modes = {};
	for (const [rawProvider, credential] of Object.entries(credentials)) {
		const provider = normalizeProviderId(rawProvider);
		if (!provider) continue;
		if (credential.type === "api_key" && credential.key && credential.key !== AGENT_SECRET_REF_CONFIGURED_MARKER) {
			const native = credential.nativeAuth;
			if (!native || normalizeProviderId(native.runtime) === provider) modes[provider] = native ? Object.freeze({
				source: "native",
				mode: native.mode === "api-key" ? "api_key" : native.mode
			}) : "api_key";
		} else if (credential.type === "token" && credential.token && (credential.expires === void 0 || credential.expires > Date.now())) modes[provider] = "token";
		else if (credential.type === "oauth" && !isOAuthRefreshFence(credential) && credential.access && credential.refresh && credential.expires > 0) modes[provider] = "oauth";
	}
	return Object.freeze(modes);
}
function hasConfiguredSecretRef(value) {
	return coerceSecretRef(value) !== null;
}
function secretRefPlaceholder(options) {
	if (options?.includeSecretRefPlaceholders === true) return {
		type: "api_key",
		key: AGENT_SECRET_REF_CONFIGURED_MARKER
	};
	return null;
}
function convertAuthProfileCredentialToAgent(cred, options) {
	if (cred.type === "api_key") {
		const key = normalizeOptionalString(cred.key) ?? "";
		if (!key) return hasConfiguredSecretRef(cred.keyRef) ? secretRefPlaceholder(options) : null;
		return {
			type: "api_key",
			key
		};
	}
	if (cred.type === "token") {
		if (cred.expires !== void 0) {
			const expires = asDateTimestampMs(cred.expires);
			if (expires === void 0 || Date.now() >= expires) return null;
		}
		const token = normalizeOptionalString(cred.token) ?? "";
		if (!token) return hasConfiguredSecretRef(cred.tokenRef) ? secretRefPlaceholder(options) : null;
		return {
			type: "api_key",
			key: token
		};
	}
	if (cred.type === "oauth") {
		if (isOAuthRefreshFence(cred)) return null;
		const access = normalizeOptionalString(cred.access) ?? "";
		const refresh = normalizeOptionalString(cred.refresh) ?? "";
		const expires = asDateTimestampMs(cred.expires);
		if (!access || !refresh || expires === void 0 || expires <= 0) return null;
		return {
			type: "oauth",
			access,
			refresh,
			expires
		};
	}
	return null;
}
/** Build one canonically selected credential per normalized provider. */
function resolveAgentCredentialMapFromStore(store, options) {
	const credentials = {};
	for (const credential of Object.values(store.profiles)) {
		const provider = normalizeProviderId(credential.provider ?? "");
		if (!provider) continue;
		if (credentials[provider]) continue;
		const profileIds = resolveAuthProfileOrder({
			cfg: options?.config,
			store,
			provider,
			...options?.includeSecretRefPlaceholders === true ? { readinessMode: "read-only" } : {}
		});
		for (const profileId of profileIds) {
			const profile = store.profiles[profileId];
			if (!profile) continue;
			const converted = convertAuthProfileCredentialToAgent(profile, options);
			if (converted) {
				credentials[provider] = converted;
				break;
			}
		}
	}
	return credentials;
}
//#endregion
//#region src/agents/agent-auth-discovery-core.ts
/** Adds provider credentials resolvable from env/config without mutating existing credentials. */
function addEnvBackedAgentCredentials(credentials, options = {}) {
	const env = options.env ?? process.env;
	const lookupParams = {
		config: options.config,
		workspaceDir: options.workspaceDir,
		env
	};
	const { aliasMap, envCandidateMap: candidateMap, authEvidenceMap } = resolveProviderEnvAuthLookupMaps(lookupParams);
	const next = { ...credentials };
	for (const provider of listProviderEnvAuthLookupKeys({
		envCandidateMap: candidateMap,
		authEvidenceMap
	})) {
		if (next[provider]) continue;
		const resolved = resolveEnvApiKey(provider, env, {
			config: options.config,
			workspaceDir: options.workspaceDir,
			aliasMap,
			candidateMap,
			authEvidenceMap
		});
		if (!resolved?.apiKey) continue;
		next[provider] = {
			type: "api_key",
			key: resolved.apiKey
		};
	}
	return next;
}
//#endregion
//#region src/agents/agent-auth-discovery.ts
/** Discovers agent runtime credentials from auth profiles, env, and synthetic providers. */
function resolveAmbientCredentialInputs(options) {
	const credentials = addEnvBackedAgentCredentials({}, options);
	const syntheticAuthProviderRefs = options.syntheticAuthProviderRefs ?? resolveRuntimeSyntheticAuthProviderRefs();
	const authoritativeSyntheticAuthProviderRefs = new Set([...options.authoritativeSyntheticAuthProviderRefs ?? []].map(normalizeProviderId).filter(Boolean));
	for (const provider of authoritativeSyntheticAuthProviderRefs) delete credentials[provider];
	const providers = [];
	for (const provider of syntheticAuthProviderRefs) {
		const normalizedProvider = normalizeProviderId(provider);
		if (!authoritativeSyntheticAuthProviderRefs.has(normalizedProvider) && credentials[provider]) continue;
		if (!isAmbientCredentialAllowedByProviderAuthPin({
			config: options.config,
			authAliasLookupParams: {
				...options.env ? { env: options.env } : {},
				...options.workspaceDir ? { workspaceDir: options.workspaceDir } : {}
			},
			provider,
			type: "api_key"
		})) continue;
		providers.push(provider);
	}
	return {
		credentials,
		providers
	};
}
function syntheticAuthParams(options, provider) {
	return {
		config: options.config,
		workspaceDir: options.workspaceDir,
		env: options.env,
		provider,
		context: {
			config: options.config,
			provider,
			providerConfig: options.config?.models?.providers?.[provider]
		}
	};
}
function addSyntheticCredential(credentials, provider, resolved) {
	const apiKey = resolved?.apiKey?.trim();
	if (apiKey) credentials[normalizeProviderId(provider) || provider] = {
		type: "api_key",
		key: apiKey,
		...resolved?.nativeAuth ? { nativeAuth: resolved.nativeAuth } : {}
	};
}
/** Reads prepared workspace/config/env credentials independently of agent-local profiles. */
function resolveAmbientAgentCredentialsForDiscovery(options = {}) {
	const { credentials, providers } = resolveAmbientCredentialInputs(options);
	for (const provider of providers) addSyntheticCredential(credentials, provider, options.resolveSyntheticAuth ? options.resolveSyntheticAuth(provider) : resolveProviderSyntheticAuthWithPlugin(syntheticAuthParams(options, provider)));
	return credentials;
}
/** Prepares external availability before publishing a generation's synchronous auth facts. */
async function prepareAmbientAgentCredentialsForDiscovery(options = {}) {
	const { credentials, providers } = resolveAmbientCredentialInputs(options);
	for (const provider of providers) {
		options.signal?.throwIfAborted();
		const resolved = options.resolveSyntheticAuth ? await options.resolveSyntheticAuth(provider) : await prepareProviderSyntheticAuthWithPlugin({
			...syntheticAuthParams(options, provider),
			signal: options.signal
		});
		options.signal?.throwIfAborted();
		addSyntheticCredential(credentials, provider, resolved);
	}
	return credentials;
}
/** Resolves the effective auth store and provider credentials for one discovery generation. */
function resolveAgentDiscoveryAuthFacts(agentDir, options) {
	const storeOptions = {
		allowKeychainPrompt: false,
		...options?.config ? { config: options.config } : {},
		...options?.externalCli ? { externalCli: options.externalCli } : {},
		...options?.inheritedAuthDir ? { inheritedAuthDir: options.inheritedAuthDir } : {}
	};
	const store = options?.preparedStore ? options.preparedStore : options?.skipExternalAuthProfiles === true ? ensureAuthProfileStoreWithoutExternalProfiles(agentDir, {
		allowKeychainPrompt: false,
		...options?.inheritedAuthDir ? { inheritedAuthDir: options.inheritedAuthDir } : {},
		...options?.readOnly === true ? { readOnly: true } : {}
	}) : ensureAuthProfileStore(agentDir, {
		...storeOptions,
		...options?.readOnly === true ? { readOnly: true } : {}
	});
	const credentials = resolveAgentCredentialMapFromStore(store, {
		includeSecretRefPlaceholders: options?.readOnly === true,
		config: options?.config
	});
	const ambientCredentials = options?.ambientCredentials ?? resolveAmbientAgentCredentialsForDiscovery({
		config: options?.config,
		workspaceDir: options?.workspaceDir,
		env: options?.env,
		syntheticAuthProviderRefs: options?.syntheticAuthProviderRefs
	});
	for (const [provider, credential] of Object.entries(ambientCredentials)) {
		if (credentials[provider]) continue;
		credentials[provider] = credential;
	}
	return {
		store,
		credentials
	};
}
//#endregion
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
		modelId: model.id,
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
		modelId: model.id,
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
function createOpenClawModelRegistry(authStorage, modelsJsonPath, agentDir, options) {
	const pluginMetadataSnapshot = resolveModelPluginMetadataSnapshot({
		...options?.config ? { config: options.config } : {},
		...options?.pluginMetadataSnapshot ? { pluginMetadataSnapshot: options.pluginMetadataSnapshot } : {},
		...options?.workspaceDir ? { workspaceDir: options.workspaceDir } : {},
		allowWorkspaceScopedCurrent: options?.workspaceDir === void 0,
		useRuntimeConfig: options?.config === void 0
	});
	const registryOptions = {
		config: options?.config,
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {},
		...options?.includePluginCatalogs !== void 0 ? { includePluginCatalogs: options.includePluginCatalogs } : {},
		...options?.modelsJsonContents !== void 0 ? { modelsJsonContents: options.modelsJsonContents } : {},
		...options?.pluginCatalogs !== void 0 ? { pluginCatalogs: options.pluginCatalogs } : {},
		staticProviderConfigs: options?.staticProviderConfigs
	};
	const registry = ModelRegistry.create(authStorage, modelsJsonPath, registryOptions);
	const getAll = registry.getAll.bind(registry);
	const getAvailable = registry.getAvailable.bind(registry);
	const find = registry.find.bind(registry);
	const refresh = registry.refresh.bind(registry);
	const providerFilter = options?.providerFilter ? normalizeProviderId(options.providerFilter) : "";
	const matchesProviderFilter = (entry) => !providerFilter || normalizeProviderId(entry.provider) === providerFilter;
	const shouldNormalize = options?.normalizeModels !== false;
	const findCache = /* @__PURE__ */ new Map();
	const normalizeEntry = (entry) => {
		if (!shouldNormalize) return entry;
		if (!agentDir) throw new Error("agent directory is required for model normalization");
		return normalizeDiscoveredAgentModel(entry, agentDir, {
			...options,
			...pluginMetadataSnapshot?.owners ? { providerMetadataOwners: pluginMetadataSnapshot.owners } : {}
		});
	};
	registry.getAll = () => {
		const entries = getAll().filter((entry) => matchesProviderFilter(entry));
		return shouldNormalize ? entries.map(normalizeEntry) : entries;
	};
	registry.getAvailable = () => {
		const entries = getAvailable().filter((entry) => matchesProviderFilter(entry));
		return shouldNormalize ? entries.map(normalizeEntry) : entries;
	};
	registry.find = (provider, modelId) => {
		const key = `${normalizeProviderId(provider)}\0${modelId}`;
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
	return registry;
}
/** Captures the effective profile store and its AuthStorage projection as one generation. */
function discoverAuthStorageFacts(agentDir, options) {
	const facts = options?.skipCredentials === true ? {
		store: {
			version: 1,
			profiles: {}
		},
		credentials: {}
	} : resolveAgentDiscoveryAuthFacts(agentDir, options);
	return {
		...facts,
		authStorage: AuthStorage.inMemory(facts.credentials)
	};
}
/** Creates the model registry used by agent model discovery. */
/** Creates a model registry for one agent directory, optionally filtered and plugin-normalized. */
function discoverModels(authStorage, agentDir, options) {
	return createOpenClawModelRegistry(authStorage, path.join(agentDir, "models.json"), agentDir, options);
}
/**
* Parses complete lifecycle-captured sources without retaining an agent-directory dependency.
* Callers may share the resulting immutable catalog snapshot across exact source generations.
*/
function discoverModelsFromCapturedSources(authStorage, options) {
	return createOpenClawModelRegistry(authStorage, CAPTURED_MODELS_JSON_SOURCE_PATH, void 0, {
		...options,
		normalizeModels: false
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/model.compat.ts
function mergeModelMediaInput(base, override) {
	if (!base) return override;
	if (!override) return base;
	return {
		...base,
		...override,
		image: base.image || override.image ? {
			...base.image,
			...override.image
		} : void 0
	};
}
function resolveConfiguredFallbackReasoning(params) {
	return resolveConfiguredModelReasoning(params) ?? false;
}
function resolveConfiguredModelReasoning(params) {
	if (params.reasoning !== void 0) return params.reasoning;
	return isVllmQwenThinkingCompat(params) ? true : void 0;
}
function resolveMergedConfiguredModelReasoning(params) {
	if (params.configuredReasoning !== void 0) return params.configuredReasoning;
	if (isVllmQwenThinkingCompat({
		provider: params.provider,
		compat: params.configuredCompat
	})) return true;
	return resolveConfiguredModelReasoning({
		provider: params.provider,
		compat: params.resolvedCompat,
		reasoning: params.discoveredReasoning
	}) ?? false;
}
function isVllmQwenThinkingCompat(params) {
	const thinkingFormat = readCompatThinkingFormat(params.compat);
	return normalizeProviderId(params.provider) === "vllm" && (thinkingFormat === "qwen" || thinkingFormat === "qwen-chat-template");
}
function readCompatThinkingFormat(compat) {
	if (!compat || typeof compat !== "object" || Array.isArray(compat)) return;
	const thinkingFormat = compat.thinkingFormat;
	return typeof thinkingFormat === "string" ? thinkingFormat : void 0;
}
function mergeModelCompat(base, override) {
	if (!base) return override;
	if (!override) return base;
	return {
		...base,
		...override
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/model.provider-normalization.ts
/**
* Applies provider compatibility normalization to a resolved model record.
*/
function normalizeResolvedProviderModel(params) {
	return normalizeModelCompat(params.model);
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
function canonicalizeLegacyResolvedModel(params) {
	const canonicalModelId = canonicalizeOpenAIModelId(params.provider, params.model.id);
	if (canonicalModelId === params.model.id) return params.model;
	return {
		...params.model,
		id: canonicalModelId,
		name: canonicalizeOpenAIModelId(params.provider, params.model.name) === canonicalModelId ? canonicalModelId : params.model.name
	};
}
function applyResolvedTransportFallback(params) {
	const normalized = params.runtimeHooks.normalizeProviderTransportWithPlugin({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		modelId: params.model.id,
		context: {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			modelId: params.model.id,
			api: params.model.api,
			baseUrl: params.model.baseUrl
		}
	});
	if (!normalized) return;
	const nextApi = normalizeResolvedTransportApi(normalized.api) ?? params.model.api;
	const nextBaseUrl = normalized.baseUrl ?? params.model.baseUrl;
	if (nextApi === params.model.api && nextBaseUrl === params.model.baseUrl) return;
	return {
		...params.model,
		api: nextApi,
		baseUrl: nextBaseUrl
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
		const input = typeof record.input === "number" && Number.isFinite(record.input) ? record.input : 0;
		const output = typeof record.output === "number" && Number.isFinite(record.output) ? record.output : 0;
		const cacheRead = typeof record.cacheRead === "number" && Number.isFinite(record.cacheRead) ? record.cacheRead : 0;
		const cacheWrite = typeof record.cacheWrite === "number" && Number.isFinite(record.cacheWrite) ? record.cacheWrite : 0;
		if (input === record.input && output === record.output && cacheRead === record.cacheRead && cacheWrite === record.cacheWrite) return record;
		return {
			...cost,
			input,
			output,
			cacheRead,
			cacheWrite
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
	const pluginNormalized = runtimeHooks.normalizeProviderResolvedModelWithPlugin({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			modelId: normalizedInputModel.id,
			model: normalizedInputModel
		}
	});
	const fallbackTransportNormalized = runtimeHooks.applyProviderResolvedTransportWithPlugin?.({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			modelId: normalizedInputModel.id,
			model: pluginNormalized ?? normalizedInputModel
		}
	}) ?? applyResolvedTransportFallback({
		provider: params.provider,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		runtimeHooks,
		model: pluginNormalized ?? normalizedInputModel
	});
	const normalizedModel = normalizeResolvedProviderModel({
		provider: params.provider,
		model: fallbackTransportNormalized ?? pluginNormalized ?? normalizedInputModel
	});
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
	return inheritModelProviderRequestRouteFacts(params.model, canonicalizeLegacyResolvedModel({
		provider: params.provider,
		model: modelWithToolSearch
	}));
}
function normalizeTransportBaseUrl(baseUrl) {
	return normalizeOptionalString(baseUrl);
}
function resolveProviderRequestTimeoutMs(timeoutSeconds) {
	return finiteSecondsToTimerSafeMilliseconds(timeoutSeconds, { floorSeconds: true });
}
//#endregion
//#region src/agents/embedded-agent-runner/model.configured-overrides.ts
/** A native transport change needs support from its model or provider route owner. */
function hasConfiguredModelRouteSupport(params) {
	if (params.configuredModel) return true;
	const endpoint = resolveProviderEndpoint(params.route.baseUrl, params.providerMetadataOwners);
	if (endpoint.endpointClass === "custom" || endpoint.endpointClass === "local") return true;
	if (!params.catalogModel) return false;
	if (modelTransportRoutesMatch(params.catalogModel, params.route)) return true;
	const aliasTransport = params.manifestAlias.transport;
	if (aliasTransport && (!aliasTransport.api || aliasTransport.api === params.route.api) && (!aliasTransport.baseUrl || modelTransportRoutesMatch({
		...params.catalogModel,
		...aliasTransport
	}, params.route))) return true;
	const routes = resolveProviderModelRoutes({
		provider: params.provider,
		modelId: params.modelId,
		config: params.cfg,
		api: normalizeResolvedTransportApi(params.route.api),
		baseUrl: params.route.baseUrl
	});
	return routes?.kind === "routes" && routes.routes.some((route) => modelTransportRoutesMatch(route, params.route));
}
function shouldSuppressConfiguredModel(params) {
	if (shouldUnconditionallySuppress({
		provider: params.provider,
		id: params.modelId,
		...params.cfg ? { config: params.cfg } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	})) return true;
	const suppression = resolveBuiltInModelSuppressionFromManifest({
		provider: params.provider,
		id: params.modelId,
		...params.cfg ? { config: params.cfg } : {},
		...params.baseUrl ? { baseUrl: params.baseUrl } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	return Boolean(suppression?.retirement || normalizeProviderId(params.provider) === "openai" && normalizeLowercaseStringOrEmpty(params.modelId) === "gpt-5.3-codex-spark" && suppression?.suppress);
}
function resolveConfiguredProviderDefaultApi(params) {
	const { providerConfig } = params;
	const explicit = normalizeResolvedTransportApi(providerConfig?.api);
	if (explicit) return explicit;
	const providerConfiguredBaseUrl = normalizeTransportBaseUrl(providerConfig?.baseUrl);
	if (!providerConfiguredBaseUrl) return;
	return resolveProviderTransport({
		provider: params.provider,
		api: void 0,
		baseUrl: providerConfiguredBaseUrl,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		runtimeHooks: params.runtimeHooks
	}).api ?? "openai-completions";
}
function findInlineModelMatch(params) {
	const inlineModels = params.preparedModels ?? buildInlineProviderModels(params.providers);
	const normalizedProvider = normalizeProviderId(params.provider);
	const providers = /* @__PURE__ */ new Set([params.provider, ...inlineModels.filter((entry) => normalizeProviderId(entry.provider) === normalizedProvider).map((entry) => entry.provider)]);
	const find = (providerKeys, normalizeModelId) => {
		for (const provider of providerKeys) {
			const match = findConfiguredProviderModel({ models: inlineModels.filter((entry) => entry.provider === provider) }, provider, params.modelId, normalizeModelId);
			if (match) return match;
		}
	};
	const rawMatch = find(providers);
	return find(rawMatch ? [rawMatch.provider] : providers, createProviderModelCatalogIdNormalizer(params.provider));
}
function resolveConfiguredProviderConfig(cfg, provider) {
	const configuredProviders = cfg?.models?.providers;
	if (!configuredProviders) return;
	return configuredProviders[provider] ?? findNormalizedProviderValue$1(configuredProviders, provider);
}
function isModelsAddMetadataModel(params) {
	return params.model?.metadataSource === "models-add";
}
/** Merge authored rates after discovery; runtime defaults must not become price pins. */
function mergeConfiguredModelCost(params) {
	let authoredCost = params.configuredModel?.cost;
	if (params.cfg && params.configuredModel) {
		const source = projectConfigOntoRuntimeSourceSnapshot(params.cfg);
		if (source !== params.cfg) {
			const modelId = params.configuredModel.id.trim();
			const sourceModel = materializeConfiguredProviderModelRows({ models: resolveConfiguredProviderConfig(source, params.provider)?.models ?? [] }, (id) => normalizeConfiguredProviderCatalogModelId(params.provider, id, params.providerMetadataOwners?.modelIdNormalizationPolicies)).models.find((model) => model.id === modelId);
			if (sourceModel) authoredCost = sourceModel.cost;
		}
	}
	return normalizeResolvedPricing(mergeModelCost(params.catalogCost, authoredCost) ?? {});
}
function mergeStaticCatalogInlineModel(staticCatalogModel, inlineModel) {
	if (!staticCatalogModel) return inlineModel;
	const compat = resolveCatalogOwnedModelCompat({
		catalogRoute: staticCatalogModel,
		catalogCompat: staticCatalogModel.compat,
		configuredRoute: inlineModel,
		configuredCompat: inlineModel.compat
	});
	const mediaInput = mergeModelMediaInput(staticCatalogModel.mediaInput, inlineModel.mediaInput);
	const params = mergeModelParams(asOptionalRecord(staticCatalogModel.params), asOptionalRecord(inlineModel.params));
	return {
		...staticCatalogModel,
		...inlineModel,
		api: inlineModel.api ?? staticCatalogModel.api,
		baseUrl: normalizeTransportBaseUrl(inlineModel.baseUrl) ?? normalizeTransportBaseUrl(staticCatalogModel.baseUrl),
		headers: inlineModel.headers ?? staticCatalogModel.headers,
		...compat ? { compat } : {},
		...mediaInput ? { mediaInput } : {},
		...params ? { params } : {}
	};
}
function mergeModelParams(...entries) {
	const merged = Object.assign({}, ...entries.filter(Boolean));
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function findConfiguredAgentModelParams(params) {
	const configuredModels = params.cfg?.agents?.defaults?.models;
	if (!configuredModels) return;
	const directKeys = [modelKey(params.provider, params.modelId), `${params.provider}/${params.modelId}`];
	for (const key of directKeys) {
		const direct = asOptionalRecord(configuredModels[key]?.params);
		if (direct) return direct;
	}
	const normalizedProvider = normalizeProviderId(params.provider);
	const normalizedModelId = normalizeStaticProviderModelId(normalizedProvider, params.modelId).trim().toLowerCase();
	for (const [rawKey, entry] of Object.entries(configuredModels)) {
		const slashIndex = rawKey.indexOf("/");
		if (slashIndex <= 0) continue;
		const candidateProvider = rawKey.slice(0, slashIndex);
		const candidateModelId = rawKey.slice(slashIndex + 1);
		if (normalizeProviderId(candidateProvider) === normalizedProvider && normalizeStaticProviderModelId(normalizedProvider, candidateModelId).trim().toLowerCase() === normalizedModelId) return asOptionalRecord(entry.params);
	}
}
function mergeConfiguredRuntimeModelParams(params) {
	return mergeModelParams(asOptionalRecord(params.discoveredParams), asOptionalRecord(params.providerParams), findConfiguredAgentModelParams({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.modelId
	}), asOptionalRecord(params.configuredParams));
}
function markDiscoveredMaxTokensSource(model) {
	if (model.maxTokens === void 0 || model.maxTokensSource !== void 0) return model;
	return {
		...model,
		maxTokensSource: "discovered"
	};
}
function clampModelMaxTokensToContextWindow(maxTokens, contextWindow) {
	if (typeof maxTokens !== "number" || !Number.isFinite(maxTokens)) return;
	return typeof contextWindow === "number" && Number.isFinite(contextWindow) ? Math.min(maxTokens, contextWindow) : maxTokens;
}
function applyConfiguredProviderOverrides(params) {
	const { providerConfig, modelId } = params;
	const discoveredModel = attachModelProviderRequestRouteFacts(markDiscoveredMaxTokensSource(params.discoveredModel), params.providerMetadataOwners);
	const manifestAliasTransport = params.manifestAlias.transport;
	const requestTimeoutMs = resolveProviderRequestTimeoutMs(providerConfig?.timeoutSeconds);
	const defaultModelParams = findConfiguredAgentModelParams({
		cfg: params.cfg,
		provider: params.provider,
		modelId
	});
	if (!providerConfig) {
		const resolvedParams = mergeModelParams(asOptionalRecord(discoveredModel.params), defaultModelParams);
		const discoveredHeaders = sanitizeModelHeaders(discoveredModel.headers, { stripSecretRefMarkers: true });
		const aliasTransport = manifestAliasTransport ? resolveProviderTransport({
			provider: params.provider,
			modelId,
			api: manifestAliasTransport.api ?? discoveredModel.api,
			baseUrl: normalizeTransportBaseUrl(manifestAliasTransport.baseUrl) ?? discoveredModel.baseUrl,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir,
			runtimeHooks: params.runtimeHooks
		}) : void 0;
		const requestConfig = resolveProviderRequestConfig({
			provider: params.provider,
			api: aliasTransport?.api ?? discoveredModel.api,
			baseUrl: aliasTransport?.baseUrl ?? discoveredModel.baseUrl,
			...params.providerMetadataOwners ? { providerMetadataOwners: params.providerMetadataOwners } : {},
			discoveredHeaders,
			capability: "llm",
			transport: "stream"
		});
		if (!hasConfiguredModelRouteSupport({
			...params,
			catalogModel: discoveredModel,
			route: requestConfig
		})) return;
		return {
			...discoveredModel,
			...manifestAliasTransport ? {
				provider: params.provider,
				api: requestConfig.api ?? discoveredModel.api,
				baseUrl: requestConfig.baseUrl ?? discoveredModel.baseUrl
			} : {},
			...resolvedParams ? { params: resolvedParams } : {},
			headers: requestConfig.headers
		};
	}
	const normalizeModelId = createProviderModelCatalogIdNormalizer(params.provider);
	const configuredModel = findConfiguredProviderModel(providerConfig, params.provider, modelId, normalizeModelId) ?? (discoveredModel.id !== modelId ? findConfiguredProviderModel(providerConfig, params.provider, discoveredModel.id, normalizeModelId) : void 0);
	const configuredStaticCatalogModel = configuredModel && (params.staticCatalogModel ?? params.getStaticCatalogModel?.());
	const metadataOverrideModel = params.preferDiscoveredModelMetadata && isModelsAddMetadataModel({ model: configuredModel }) ? void 0 : configuredModel;
	const discoveredHeaders = sanitizeModelHeaders(discoveredModel.headers, { stripSecretRefMarkers: true });
	const providerHeaders = sanitizeModelHeaders(providerConfig.headers, { stripSecretRefMarkers: true });
	const providerRequest = sanitizeConfiguredModelProviderRequest(providerConfig.request);
	const configuredHeaders = sanitizeModelHeaders(configuredModel?.headers, { stripSecretRefMarkers: true });
	const providerParams = asOptionalRecord(providerConfig.params);
	const passthroughRequestConfig = resolveProviderRequestConfig({
		provider: params.provider,
		api: discoveredModel.api,
		baseUrl: discoveredModel.baseUrl,
		...params.providerMetadataOwners ? { providerMetadataOwners: params.providerMetadataOwners } : {},
		discoveredHeaders,
		providerHeaders,
		modelHeaders: configuredHeaders,
		authHeader: providerConfig.authHeader,
		request: providerRequest,
		capability: "llm",
		transport: "stream"
	});
	if (!configuredModel && !providerConfig.baseUrl && !providerConfig.api && providerConfig.maxTokens === void 0 && requestTimeoutMs === void 0 && !providerHeaders && !providerRequest && !providerParams && !providerConfig.localService && !manifestAliasTransport) {
		const resolvedParams = mergeModelParams(asOptionalRecord(discoveredModel.params), defaultModelParams);
		return {
			...discoveredModel,
			...resolvedParams ? { params: resolvedParams } : {},
			headers: passthroughRequestConfig.headers,
			...providerConfig.authHeader !== void 0 ? { authHeader: providerConfig.authHeader } : {}
		};
	}
	const resolvedParams = mergeModelParams(asOptionalRecord(configuredStaticCatalogModel?.params), asOptionalRecord(discoveredModel.params), providerParams, defaultModelParams, asOptionalRecord(configuredModel?.params));
	const normalizedInput = resolveProviderModelInput({
		provider: params.provider,
		modelId,
		modelName: metadataOverrideModel?.name ?? discoveredModel.name,
		input: metadataOverrideModel?.input,
		fallbackInput: discoveredModel.input
	});
	const providerDefaultApi = resolveConfiguredProviderDefaultApi({
		provider: params.provider,
		providerConfig,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		runtimeHooks: params.runtimeHooks
	});
	const metadataOverrideBaseUrl = normalizeTransportBaseUrl(metadataOverrideModel?.baseUrl);
	const providerConfiguredBaseUrl = normalizeTransportBaseUrl(providerConfig.baseUrl);
	const discoveredBaseUrl = normalizeTransportBaseUrl(discoveredModel.baseUrl);
	const configuredStaticCatalogBaseUrl = normalizeTransportBaseUrl(configuredStaticCatalogModel?.baseUrl);
	const manifestAliasBaseUrl = normalizeTransportBaseUrl(manifestAliasTransport?.baseUrl);
	const preferDiscoveredTransport = params.preferDiscoveredTransport && !manifestAliasTransport;
	const resolvedTransportApi = preferDiscoveredTransport ? discoveredModel.api ?? metadataOverrideModel?.api ?? providerConfig.api ?? configuredStaticCatalogModel?.api ?? providerDefaultApi : metadataOverrideModel?.api ?? providerConfig.api ?? manifestAliasTransport?.api ?? discoveredModel.api ?? configuredStaticCatalogModel?.api ?? providerDefaultApi;
	const resolvedTransportBaseUrl = preferDiscoveredTransport ? discoveredBaseUrl ?? metadataOverrideBaseUrl ?? providerConfiguredBaseUrl ?? configuredStaticCatalogBaseUrl : metadataOverrideBaseUrl ?? providerConfiguredBaseUrl ?? manifestAliasBaseUrl ?? discoveredBaseUrl ?? configuredStaticCatalogBaseUrl;
	const resolvedTransport = resolveProviderTransport({
		provider: params.provider,
		modelId: discoveredModel.id,
		api: resolvedTransportApi,
		baseUrl: resolvedTransportBaseUrl,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		runtimeHooks: params.runtimeHooks
	});
	if (!hasConfiguredModelRouteSupport({
		...params,
		configuredModel,
		catalogModel: discoveredModel,
		route: resolvedTransport
	})) return;
	const contextWindow = metadataOverrideModel?.contextWindow ?? discoveredModel.contextWindow;
	const configuredMaxTokens = metadataOverrideModel?.maxTokens ?? providerConfig.maxTokens;
	const normalizedResolvedMaxTokens = clampModelMaxTokensToContextWindow(configuredMaxTokens ?? discoveredModel.maxTokens, contextWindow);
	const catalogCompat = mergeModelCompat(configuredStaticCatalogModel?.compat, discoveredModel.compat);
	const hasCatalogOwnedModel = configuredStaticCatalogModel !== void 0 || discoveredModel.maxTokensSource !== "configured";
	const resolvedCompat = resolveCatalogOwnedModelCompat({
		...hasCatalogOwnedModel ? { catalogRoute: {
			api: discoveredModel.api ?? configuredStaticCatalogModel?.api,
			baseUrl: discoveredModel.baseUrl ?? configuredStaticCatalogModel?.baseUrl
		} } : {},
		catalogCompat,
		configuredRoute: {
			api: resolvedTransport.api,
			baseUrl: resolvedTransport.baseUrl
		},
		configuredCompat: metadataOverrideModel?.compat
	});
	const resolvedReasoning = resolveMergedConfiguredModelReasoning({
		provider: params.provider,
		configuredCompat: resolvedCompat,
		resolvedCompat,
		configuredReasoning: metadataOverrideModel?.reasoning,
		discoveredReasoning: discoveredModel.reasoning
	});
	const requestConfig = resolveProviderRequestConfig({
		provider: params.provider,
		api: resolvedTransport.api ?? normalizeResolvedTransportApi(configuredStaticCatalogModel?.api) ?? normalizeResolvedTransportApi(discoveredModel.api) ?? providerDefaultApi ?? "openai-responses",
		baseUrl: resolvedTransport.baseUrl ?? configuredStaticCatalogModel?.baseUrl ?? discoveredModel.baseUrl,
		...params.providerMetadataOwners ? { providerMetadataOwners: params.providerMetadataOwners } : {},
		discoveredHeaders,
		providerHeaders,
		modelHeaders: configuredHeaders,
		authHeader: providerConfig.authHeader,
		request: providerRequest,
		capability: "llm",
		transport: "stream"
	});
	return attachModelProviderRequestRouteFacts(attachModelProviderLocalService(attachModelProviderRequestTransport({
		...discoveredModel,
		provider: params.provider,
		api: requestConfig.api ?? "openai-responses",
		baseUrl: requestConfig.baseUrl ?? discoveredModel.baseUrl,
		reasoning: resolvedReasoning,
		input: normalizedInput,
		cost: mergeConfiguredModelCost({
			provider: params.provider,
			cfg: params.cfg,
			configuredModel: metadataOverrideModel,
			catalogCost: discoveredModel.cost,
			providerMetadataOwners: params.providerMetadataOwners
		}),
		contextWindow,
		contextTokens: metadataOverrideModel?.contextTokens ?? discoveredModel.contextTokens,
		...normalizedResolvedMaxTokens !== void 0 ? {
			maxTokens: normalizedResolvedMaxTokens,
			maxTokensSource: configuredMaxTokens !== void 0 ? "configured" : discoveredModel.maxTokensSource ?? "discovered"
		} : {},
		...resolvedParams ? { params: resolvedParams } : {},
		...requestTimeoutMs !== void 0 ? { requestTimeoutMs } : {},
		headers: requestConfig.headers,
		...providerConfig.authHeader !== void 0 ? { authHeader: providerConfig.authHeader } : {},
		compat: resolvedCompat,
		mediaInput: mergeModelMediaInput(mergeModelMediaInput(configuredStaticCatalogModel?.mediaInput, discoveredModel.mediaInput), metadataOverrideModel?.mediaInput)
	}, providerRequest), providerConfig.localService), params.providerMetadataOwners);
}
//#endregion
//#region src/agents/embedded-agent-runner/model.configured-fallback.ts
function buildConfiguredFallbackModel(params) {
	const { provider, modelId, cfg, agentDir, workspaceDir, runtimeHooks } = params;
	const providerConfig = resolveConfiguredProviderConfig(cfg, provider);
	const requestTimeoutMs = resolveProviderRequestTimeoutMs(providerConfig?.timeoutSeconds);
	const configuredModel = findConfiguredProviderModel(providerConfig, provider, modelId, createProviderModelCatalogIdNormalizer(provider));
	if (!configuredModel && !providerConfig?.baseUrl?.trim()) return;
	const staticCatalogModel = params.getStaticCatalogModel?.();
	const metadataModel = configuredModel ?? staticCatalogModel;
	const fallbackMediaInput = mergeModelMediaInput(staticCatalogModel?.mediaInput, configuredModel?.mediaInput);
	const providerHeaders = sanitizeModelHeaders(providerConfig?.headers, { stripSecretRefMarkers: true });
	const providerRequest = sanitizeConfiguredModelProviderRequest(providerConfig?.request);
	const staticCatalogHeaders = sanitizeModelHeaders(staticCatalogModel?.headers, { stripSecretRefMarkers: true });
	const modelHeaders = sanitizeModelHeaders(configuredModel?.headers, { stripSecretRefMarkers: true });
	const resolvedParams = mergeConfiguredRuntimeModelParams({
		cfg,
		provider,
		modelId,
		discoveredParams: staticCatalogModel?.params,
		providerParams: providerConfig?.params,
		configuredParams: configuredModel?.params
	});
	const providerConfiguredApi = normalizeResolvedTransportApi(providerConfig?.api);
	const configuredModelBaseUrl = normalizeTransportBaseUrl(configuredModel?.baseUrl);
	const providerConfiguredBaseUrl = normalizeTransportBaseUrl(providerConfig?.baseUrl);
	const manifestAliasTransport = params.manifestAlias.transport;
	const manifestAliasBaseUrl = normalizeTransportBaseUrl(manifestAliasTransport?.baseUrl);
	const staticCatalogBaseUrl = normalizeTransportBaseUrl(staticCatalogModel?.baseUrl);
	const fallbackTransport = resolveProviderTransport({
		provider,
		modelId,
		api: normalizeResolvedTransportApi(configuredModel?.api) ?? providerConfiguredApi ?? manifestAliasTransport?.api ?? normalizeResolvedTransportApi(staticCatalogModel?.api) ?? resolveConfiguredProviderDefaultApi({
			provider,
			providerConfig,
			cfg,
			workspaceDir,
			runtimeHooks
		}) ?? "openai-responses",
		baseUrl: configuredModelBaseUrl ?? providerConfiguredBaseUrl ?? manifestAliasBaseUrl ?? staticCatalogBaseUrl,
		cfg,
		workspaceDir,
		runtimeHooks
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
		configuredRoute: {
			api: fallbackTransport.api,
			baseUrl: fallbackTransport.baseUrl
		},
		configuredCompat: configuredModel?.compat
	});
	if (configuredModel && shouldSuppressConfiguredModel({
		provider,
		modelId,
		cfg,
		workspaceDir,
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
	const fallbackReasoning = resolveConfiguredFallbackReasoning({
		provider,
		compat: fallbackCompat,
		reasoning: metadataModel?.reasoning
	});
	const configuredFallbackMaxTokens = configuredModel?.maxTokens ?? providerConfig?.maxTokens;
	const resolvedFallbackMaxTokens = configuredFallbackMaxTokens ?? staticCatalogModel?.maxTokens;
	const resolvedFallbackContextWindow = configuredModel?.contextWindow ?? staticCatalogModel?.contextWindow ?? 2e5;
	const normalizedResolvedFallbackMaxTokens = clampModelMaxTokensToContextWindow(resolvedFallbackMaxTokens, resolvedFallbackContextWindow);
	return normalizeResolvedModel({
		provider,
		cfg,
		agentDir,
		workspaceDir,
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
				provider,
				cfg,
				configuredModel,
				catalogCost: staticCatalogModel?.cost,
				providerMetadataOwners: params.providerMetadataOwners
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
		}, providerRequest), providerConfig?.localService), params.providerMetadataOwners),
		runtimeHooks
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/model.registry-resolution.ts
function getRegistryProviderMetadataOwners(modelRegistry) {
	return modelRegistry.getProviderMetadataOwners?.();
}
function resolveExplicitModelWithRegistry(params) {
	const { provider, modelId, modelRegistry, cfg, agentDir, workspaceDir, runtimeHooks } = params;
	if (params.manifestAlias.ambiguous) return { kind: "unavailable" };
	if (shouldUnconditionallySuppress({
		provider,
		id: modelId,
		config: cfg,
		workspaceDir
	})) return { kind: "suppressed" };
	const providerMetadataOwners = getRegistryProviderMetadataOwners(modelRegistry);
	const providerConfig = resolveConfiguredProviderConfig(cfg, provider);
	const inlineMatch = findInlineModelMatch({
		providers: cfg?.models?.providers ?? {},
		preparedModels: params.preparedInlineProviderModels,
		provider,
		modelId
	});
	const inlineModel = inlineMatch?.api ? inlineMatch : void 0;
	const registryModel = params.preparedCatalogModel ?? modelRegistry.find(provider, modelId);
	const staticCatalogModel = inlineModel ? params.getStaticCatalogModel?.() : void 0;
	const discoveredModel = inlineModel ? {
		...mergeStaticCatalogInlineModel(staticCatalogModel, inlineModel),
		cost: registryModel?.cost ?? staticCatalogModel?.cost ?? inlineModel.cost
	} : registryModel;
	if (!discoveredModel) {
		if (inlineMatch) return;
		const error = buildSuppressedBuiltInModelError({
			provider,
			id: modelId,
			config: cfg,
			baseUrl: providerConfig?.baseUrl,
			workspaceDir
		});
		return error ? {
			kind: "suppressed",
			error
		} : void 0;
	}
	const overriddenModel = applyConfiguredProviderOverrides({
		provider,
		discoveredModel,
		providerConfig,
		modelId,
		cfg,
		manifestAlias: params.manifestAlias,
		providerMetadataOwners,
		runtimeHooks,
		workspaceDir,
		preferDiscoveredTransport: Boolean(inlineModel),
		staticCatalogModel,
		getStaticCatalogModel: params.getStaticCatalogModel
	});
	if (!overriddenModel) return;
	const model = normalizeResolvedModel({
		provider,
		cfg,
		agentDir,
		workspaceDir,
		model: overriddenModel,
		runtimeHooks
	});
	if (!inlineModel || shouldSuppressConfiguredModel({
		provider,
		modelId,
		cfg,
		workspaceDir,
		baseUrl: model.baseUrl
	})) {
		const error = buildSuppressedBuiltInModelError({
			provider,
			id: modelId,
			config: cfg,
			baseUrl: model.baseUrl,
			workspaceDir
		});
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
	const readStore = () => {
		params.abortSignal?.throwIfAborted();
		return loadAuthProfileStoreForRuntimeAsync(agentDir, readOptions);
	};
	const providers = listOpenAIAuthProfileProvidersForAgentRuntime({
		provider: params.provider,
		config: params.cfg
	});
	const store = await readStore().catch(async (error) => {
		if (!(error instanceof AuthProfileRuntimeReadStaleError)) throw error;
		await error.waitForSettlement?.(params.abortSignal);
		return readStore();
	});
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
	const overriddenDynamicModel = applyConfiguredProviderOverrides({
		provider,
		discoveredModel: pluginDynamicModel,
		providerConfig,
		modelId,
		cfg,
		manifestAlias: params.manifestAlias,
		providerMetadataOwners: getRegistryProviderMetadataOwners(modelRegistry),
		runtimeHooks,
		workspaceDir,
		preferDiscoveredModelMetadata: shouldCompareProviderRuntimeResolvedModel({
			...params,
			runtimeHooks
		}),
		getStaticCatalogModel: params.getStaticCatalogModel
	});
	if (!overriddenDynamicModel) return;
	return normalizeResolvedModel({
		provider,
		cfg,
		agentDir,
		workspaceDir,
		model: overriddenDynamicModel,
		runtimeHooks
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
function shouldDropRuntimePreferredExplicitMiss(params) {
	return params.explicitModel.kind === "resolved" && params.explicitModel.source === "registry" && params.explicitModel.dropOnRuntimeMiss;
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
	if (explicitModel?.kind === "resolved") {
		if (!shouldCompareProviderRuntimeResolvedModel({
			...params,
			runtimeHooks
		})) return explicitModel.model;
		const pluginDynamicModel = await resolvePluginDynamicModelWithRegistry(params);
		params.assertCurrent?.();
		return pluginDynamicModel ?? (shouldDropRuntimePreferredExplicitMiss({
			provider: params.provider,
			modelId: params.modelId,
			explicitModel
		}) ? void 0 : explicitModel.model);
	}
	const pluginDynamicModel = await resolvePluginDynamicModelWithRegistry(params);
	params.assertCurrent?.();
	if (pluginDynamicModel) return pluginDynamicModel;
	return params.skipConfiguredFallback ? void 0 : buildConfiguredFallbackModel({
		...params,
		providerMetadataOwners: getRegistryProviderMetadataOwners(params.modelRegistry)
	});
}
async function resolveModelWithRegistry(params) {
	const workspaceDir = params.workspaceDir ?? params.cfg?.agents?.defaults?.workspace;
	const normalizedRef = normalizeProviderModelRef({
		...params,
		workspaceDir
	});
	let staticCatalogResolved = false;
	let staticCatalogModel;
	const getStaticCatalogModel = () => {
		if (!staticCatalogResolved) {
			staticCatalogResolved = true;
			staticCatalogModel = resolveBundledStaticCatalogModel({
				provider: normalizedRef.provider,
				modelId: normalizedRef.model,
				cfg: params.cfg,
				workspaceDir,
				includeRuntimeDiscovery: true
			});
		}
		return staticCatalogModel;
	};
	return resolveModelWithPreparedRegistry({
		...params,
		provider: normalizedRef.provider,
		modelId: normalizedRef.model,
		manifestAlias: normalizedRef.manifestAlias,
		getStaticCatalogModel,
		...workspaceDir !== void 0 ? { workspaceDir } : {}
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
		const seen = /* @__PURE__ */ new Set();
		for (const ref of configuredModelRefs) {
			const { provider, modelId } = ref;
			const key = buildModelCatalogMergeKey(provider, modelId);
			if (seen.has(key)) continue;
			seen.add(key);
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
//#region src/agents/prepared-model-runtime.resources.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.ephemeralPreparedRegistryResources"), () => ({
	views: /* @__PURE__ */ new Set(),
	registries: /* @__PURE__ */ new WeakMap()
}));
/** The original view stays authoritative until ordinary retirement or explicit process close. */
var PreparedRegistryResources = class {
	constructor(acquired) {
		this.acquired = acquired;
		this.completion = createDeferredCore();
		this.releases = /* @__PURE__ */ new Set();
		this.failures = [];
		this.claims = 0;
		this.closed = false;
		this.finishing = false;
		state.views.add(this);
		state.registries.set(acquired.registry, this);
		this.completion.promise.then(() => state.views.delete(this), () => {});
	}
	get primaryRegistry() {
		return this.acquired.primaryRegistry;
	}
	assertOpen() {
		if (this.closed) throw new Error("Prepared plugin registry resources have been released");
	}
	retain() {
		this.assertOpen();
		const claim = this.acquired.resources.retain();
		this.claims++;
		let release;
		return { release: () => {
			if (!release) {
				const completion = createDeferredCore();
				release = completion.promise;
				const pending = this.trackRelease(claim.release);
				this.claims--;
				(this.claims === 0 ? this.close() : pending).then(completion.resolve, completion.reject);
			}
			return release;
		} };
	}
	close() {
		if (!this.closed) {
			this.closed = true;
			this.trackRelease(this.acquired.releaseRegistry);
		}
		if (this.claims === 0 && !this.finishing) {
			this.finishing = true;
			(async () => {
				while (this.releases.size > 0) await Promise.all(this.releases);
				if (this.failures.length > 0) this.completion.reject(new AggregateError(this.failures, "Prepared plugin resources failed to close"));
				else this.completion.resolve();
			})();
		}
		return this.completion.promise;
	}
	trackRelease(release) {
		const operation = createDeferredCore();
		const pending = operation.promise.catch((error) => {
			this.failures.push(error);
		}).finally(() => this.releases.delete(pending));
		this.releases.add(pending);
		try {
			operation.resolve(release());
		} catch (error) {
			operation.reject(error);
		}
		return pending;
	}
};
/** Batch scopes retain selected sources through later catalog work; idle publication owns custody only. */
var PreparedModelRuntimeBuildResources = class {
	constructor(retainPhysicalRegistry) {
		this.retainPhysicalRegistry = retainPhysicalRegistry;
		this.registries = /* @__PURE__ */ new Set();
		this.releases = new AsyncDisposableStack();
	}
	assertOpen() {
		if (this.releases.disposed) throw new Error("Prepared registry construction resources have been released");
	}
	retainRegistry(registry) {
		this.assertOpen();
		if (this.registries.has(registry)) return;
		const release = this.retainPhysicalRegistry(registry);
		let releaseWork = () => {};
		let completion;
		const releaseClaim = () => completion ??= releaseRuntimePluginWork(release, releaseWork);
		this.releases.defer(releaseClaim);
		try {
			releaseWork = retainRuntimePluginWork([registry]);
		} catch (error) {
			releaseClaim().catch(() => {});
			throw error;
		}
		this.registries.add(registry);
	}
	retainGeneration(generation) {
		for (const registry of [generation?.pluginRegistry, generation?.inboundPluginRegistry]) if (registry) this.retainRegistry(registry);
	}
	async load(params, onPrimaryRegistry) {
		this.assertOpen();
		const assertLifetime = capturePreparedModelRuntimeLifetime();
		const acquired = await acquireAgentRuntimePluginRegistry(params);
		if ("resources" in acquired) {
			const resources = new PreparedRegistryResources(acquired);
			try {
				assertLifetime();
				this.retainRegistry(acquired.registry);
				acquired.releaseWork();
			} catch (error) {
				await releaseRuntimePluginWork(() => resources.close(), acquired.releaseWork);
				throw error;
			}
		} else this.retainRegistry(acquired.registry);
		onPrimaryRegistry(state.registries.get(acquired.registry)?.primaryRegistry ?? acquired.primaryRegistry);
		return acquired.registry;
	}
	[Symbol.asyncDispose]() {
		this.registries.clear();
		return this.releases.disposeAsync();
	}
};
/** Borrow the immutable view's prepared owner, including its adopted donor registrations. */
function retainPreparedModelRuntimeSnapshotResources(snapshot) {
	const resources = snapshot.pluginRegistry && state.registries.get(snapshot.pluginRegistry);
	if (!resources) return;
	return {
		release: resources.retain().release,
		assertOpen: () => resources.assertOpen()
	};
}
/** Fence owned views before joining builds or the callers that still hold physical claims. */
async function closeEphemeralPreparedModelRuntimeResources() {
	const failures = (await Promise.allSettled([...state.views].map(async (view) => {
		try {
			await view.close();
		} catch (error) {
			if (hasRetainedPluginRuntimeCloseError(error) || state.views.delete(view)) throw error;
		}
	}))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length > 0) throw new AggregateError(failures, "Prepared plugin resources failed to close");
}
//#endregion
//#region src/agents/prepared-model-runtime.plugin-lifetime.ts
const log = createSubsystemLogger("agents/prepared-model-runtime");
const { generations, active, retirements, publications } = resolveGlobalSingleton(Symbol.for("openclaw.preparedPluginLifetimes"), () => ({
	generations: /* @__PURE__ */ new WeakMap(),
	active: /* @__PURE__ */ new Set(),
	retirements: /* @__PURE__ */ new Set(),
	publications: /* @__PURE__ */ new WeakMap()
}));
function createLifetime(dispose, retainWork) {
	const cleanupWork = new AsyncWorkScope();
	const references = /* @__PURE__ */ new Set();
	let closing;
	let disposing = false;
	const lifetime = {
		get referenced() {
			return references.size > 0;
		},
		retain(work = false) {
			if (closing) throw new Error("Prepared plugin generation has retired");
			const releaseWork = work ? retainWork?.() : void 0;
			const reference = {};
			references.add(reference);
			let releaseCompletion;
			return () => {
				if (references.delete(reference)) {
					const completion = references.size === 0 ? lifetime.close() : void 0;
					releaseCompletion = releaseWork ? releaseRuntimePluginWork(() => completion, releaseWork) : completion;
				}
				return releaseCompletion;
			};
		},
		close() {
			if (!closing) {
				const completion = closing = createDeferredCore();
				retirements.add(completion.promise);
				completion.promise.then(() => {
					active.delete(lifetime);
					retirements.delete(completion.promise);
				}, (error) => {
					if (!hasRetainedPluginRuntimeCloseError(error)) active.delete(lifetime);
				});
			}
			if (references.size === 0 && !disposing) {
				disposing = true;
				const completion = closing;
				(async () => {
					try {
						await cleanupWork.track(dispose);
					} finally {
						await cleanupWork.run(() => cleanupWork.drain());
					}
				})().then(() => completion.resolve(), completion.reject);
			}
			return closing.promise;
		}
	};
	active.add(lifetime);
	return lifetime;
}
/** Retain physical registry custody for construction or publication, independent of active work. */
function retainPreparedPluginRegistry(registryView) {
	registerPreparedPluginLifetime();
	const prepared = retainPreparedModelRuntimeSnapshotResources({ pluginRegistry: registryView });
	if (prepared) return prepared.release;
	const inspection = getPluginRegistryInspectionResources(registryView);
	if (inspection) return inspection.retain().release;
	const registry = getPluginRegistryResourceOwner(registryView);
	let lifetime = getPluginRegistryLifetime(registry);
	if (!lifetime) {
		if (capturePluginRegistryLifecycleEpoch(registry)) return;
		if (isPluginRegistryRetired(registry)) throw new Error("Prepared plugin registry has retired");
		markPluginRegistryActive(registry);
		lifetime = createLifetime(async () => {
			try {
				return await disposePluginRegistryInstances(registry);
			} catch (error) {
				throw new PluginRuntimeCloseRetainedError(error);
			}
		});
		bindPluginRegistryLifetime(registry, lifetime);
	}
	return lifetime.retain();
}
/** Construction registers the same final owner before an awaited inspection can finish. */
function registerPreparedPluginLifetime() {
	registerPreparedPluginRetirement(closePreparedPluginGenerations);
}
function ownPreparedPluginGeneration(generation) {
	const existing = generations.get(generation);
	if (existing) return existing;
	registerPreparedPluginLifetime();
	const releaseMetadata = retainPluginCache(getPluginMetadataSnapshotCache(generation.pluginMetadataSnapshot));
	const releases = [];
	const selectedRegistries = new Set([generation.pluginRegistry, generation.inboundPluginRegistry].filter((registry) => registry !== void 0));
	const acquisitionFailures = [];
	const lifetime = createLifetime(async () => {
		const results = await Promise.allSettled(releases.map(async (release) => await release()));
		releaseMetadata();
		const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length) throw new AggregateError([...acquisitionFailures, ...failures], "Prepared plugin generation cleanup failed");
	}, () => retainRuntimePluginWork(selectedRegistries));
	try {
		for (const registry of selectedRegistries) {
			const release = retainPreparedPluginRegistry(registry);
			if (release) releases.push(release);
		}
	} catch (error) {
		acquisitionFailures.push(error);
		lifetime.close().catch(() => {});
		throw error;
	}
	generations.set(generation, lifetime);
	return lifetime;
}
function retainPreparedPluginGeneration(generation) {
	const release = ownPreparedPluginGeneration(generation).retain(true);
	return async () => {
		await release();
	};
}
/** Publishing replaces one reference, while admitted leases retain their exact generation. */
function publishPreparedPluginGeneration(owner, generation) {
	const previous = publications.get(owner);
	const instances = new Set([generation.pluginRegistry, generation.inboundPluginRegistry].flatMap((registry) => registry ? [...collectRegistryInvocationInstances(registry)].filter((instance) => !instance.owner || instance.owner.record.status === "loaded") : []));
	const cacheSignal = getPluginCacheRetirementSignal(getPluginMetadataSnapshotCache(generation.pluginMetadataSnapshot));
	const isCurrent = () => !cacheSignal.aborted && [...instances].every((instance) => instance.acceptingCalls);
	if (!isCurrent()) throw new Error("Prepared plugin generation retired before publication");
	const release = ownPreparedPluginGeneration(generation).retain();
	const version = owner.generation;
	let signal;
	const unsubscribe = () => signal?.removeEventListener("abort", observe);
	const observe = () => {
		unsubscribe();
		if (!isCurrent()) {
			if (owner.generation === version) {
				owner.generation++;
				retirePreparedModelRuntimeGeneration(owner);
				owner.needsRefresh = true;
				owner.refreshError = /* @__PURE__ */ new Error("Prepared model runtime plugin generation retired");
				owner.pluginGeneration = void 0;
			}
			releasePreparedPluginPublication(owner);
			return;
		}
		signal = AbortSignal.any([cacheSignal, ...[...instances].flatMap((instance) => {
			const registry = instance.owner?.registry;
			const current = registry && capturePluginRegistryLifecycleSignal(registry, capturePluginRegistryLifecycleEpoch(registry), { scopedRuntime: true });
			return current ? [current] : [];
		})]);
		signal.addEventListener("abort", observe, { once: true });
	};
	publications.set(owner, {
		generation,
		release: () => {
			unsubscribe();
			return Promise.resolve(release());
		}
	});
	observe();
	previous?.release()?.catch(() => {});
}
function releasePreparedPluginPublication(owner) {
	const previous = publications.get(owner);
	publications.delete(owner);
	previous?.release()?.catch(() => {});
}
/** Failed unpublished builds release only their own generations, never a sibling's cache. */
async function discardPreparedPluginGeneration(generation) {
	const lifetime = generations.get(generation);
	if (lifetime && !lifetime.referenced) await lifetime.close();
}
/** Process shutdown owns every outstanding generation and any earlier cleanup failure. */
async function closePreparedPluginGenerations() {
	const resourcesClosed = Promise.allSettled([closeEphemeralPreparedModelRuntimeResources()]);
	const pending = new Set([...active].map((lifetime) => lifetime.close()));
	for (const completion of retirements) pending.add(completion);
	for (const completion of pending) retirements.delete(completion);
	const results = await Promise.allSettled(pending);
	results.push(...await resourcesClosed);
	const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	let retained = failures.some(hasRetainedPluginRuntimeCloseError);
	try {
		await waitForPluginCacheRetirement(true);
	} catch (reason) {
		retained = true;
		failures.push(reason);
	}
	if (retained) throw new AggregateError(failures, "Prepared plugin generations failed to close");
	if (failures.length) log.warn(formatErrorMessage(new AggregateError(failures, "Prepared plugin cleanup completed with failures")));
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
	return {
		providers: {
			mediaUnderstandingProviders: providers.mediaUnderstandingProviders?.map((provider) => invocations.wrap(provider)),
			imageGenerationProviders: providers.imageGenerationProviders?.map((provider) => invocations.wrap(provider)),
			videoGenerationProviders: providers.videoGenerationProviders?.map((provider) => invocations.wrap(provider)),
			musicGenerationProviders: providers.musicGenerationProviders?.map((provider) => invocations.wrap(provider))
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
	const plan = resolveAgentRuntimePluginLoadPlan({
		config: input.config,
		workspaceDir: generation.pluginMetadataSnapshot.workspaceDir ?? input.workspaceDir ?? process.cwd(),
		selections: input.runtimePluginSelections,
		metadataSnapshot: generation.pluginMetadataSnapshot
	});
	return registry !== void 0 && (plan.pluginIds ?? []).every((id) => registry.plugins.some((plugin) => plugin.id === id && (plugin.status === "error" || plugin.status === "disabled")) || registryContainsRuntimePluginIds(registry, [id]));
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
async function buildPreparedPluginModelCatalog(params) {
	const { credentials, input } = params.agentFacts;
	const { pluginMetadataSnapshot: metadataSnapshot, pluginRegistry } = params.pluginGeneration;
	return await withPluginRuntimeGenerationScope({
		metadataSnapshot,
		pluginRegistry
	}, async () => {
		const snapshot = await buildPreparedModelCatalogSnapshot({
			agentDir: input.agentDir,
			authCredentials: credentials,
			config: input.config,
			modelRegistry: params.modelRegistry,
			metadataSnapshot,
			providerOutcomes: params.providerOutcomes,
			includeProviderPluginAugmentation: params.catalogMode === "live",
			providerIds: params.providerIds,
			...input.env ? { env: input.env } : {},
			...input.readOnly ? { readOnly: true } : {},
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
		});
		return params.catalogMode === "live" && params.includeNative !== false ? await augmentPreparedModelCatalogWithAgentHarness({
			input,
			snapshot,
			pluginRegistry
		}) : snapshot;
	});
}
//#endregion
export { mergeModelMediaInput as A, resolveRuntimePreferredSuppressedModel as C, resolveConfiguredProviderConfig as D, applyConfiguredProviderOverrides as E, resolveAmbientAgentCredentialsForDiscovery as F, resolveAgentCredentialMapFromStore as I, resolveUsableAgentCredentialModes as L, discoverModels as M, discoverModelsFromCapturedSources as N, normalizeResolvedModel as O, prepareAmbientAgentCredentialsForDiscovery as P, resolveModelWithRegistry as S, buildConfiguredFallbackModel as T, prepareConfiguredModelAliases as _, preparedPluginGenerationSupportsSelections as a, resolveExplicitModelWithRegistry as b, publishPreparedPluginGeneration as c, retainPreparedPluginGeneration as d, retainPreparedPluginRegistry as f, completeConfiguredRuntimeModels as g, retainPreparedModelRuntimeSnapshotResources as h, preparedPluginGenerationReusesBase as i, discoverAuthStorageFacts as j, resolveRuntimeHooks as k, registerPreparedPluginLifetime as l, closeEphemeralPreparedModelRuntimeResources as m, buildPreparedPluginModelCatalog as n, discardPreparedPluginGeneration as o, PreparedModelRuntimeBuildResources as p, createPreparedPluginGeneration as r, ownPreparedPluginGeneration as s, acquirePreparedMediaCapabilityProviders as t, releasePreparedPluginPublication as u, normalizeProviderModelRef as v, shouldCompareProviderRuntimeResolvedModel as w, resolveModelWithPreparedRegistry as x, resolveDynamicModelAuthProfile as y };
