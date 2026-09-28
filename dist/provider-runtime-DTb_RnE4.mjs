import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-C5tDvNBc.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { n as resolveBundledProviderPolicySurface, r as resolveProviderPolicySurface } from "./provider-public-artifacts-Dm_p9SMS.mjs";
import { a as nativePluginBindings } from "./loader-runtime-load-DitY2Htf.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-CGngP_UC.mjs";
import { d as resolveOwningPluginIdsForProvider, f as resolveOwningPluginIdsForProviderRef, i as resolveCatalogHookProviderPluginIds, m as resolveUsageHookProviderPluginContracts, p as resolveProviderRefOwnership } from "./providers-Bx7WoFEI.mjs";
import { c as resolveGpt5SystemPromptContribution } from "./gpt5-prompt-overlay-BWi_VFCL.mjs";
import { n as getRegisteredAgentHarness } from "./registry-1lXXOteg.mjs";
import { n as mergePluginTextTransforms, t as applyPluginTextReplacements } from "./plugin-text-transforms-CuF3jf1R.mjs";
import { i as unwrapSecretSentinelsForProviderEgress } from "./provider-secret-egress-BkXZF4dA.mjs";
import { o as providerUsageLabel } from "./provider-usage.shared-DA20vxhR.mjs";
import { n as resolvePluginDiscoveryProvidersRuntime } from "./provider-discovery.runtime.js";
import { a as resolveLoadedProviderRuntimePlugin, c as resolveProviderHookPlugin, l as resolveProviderPluginsForHooks, n as ensureProviderRuntimePluginHandle, u as resolveProviderRuntimePlugin } from "./provider-hook-runtime-Czh46tAs.mjs";
import { t as resolveRuntimeTextTransforms } from "./text-transforms.runtime-AhvhghlM.mjs";
import "./provider-failover-Ckkg2-zr.mjs";
import { stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
//#region src/plugins/provider-synthetic-auth.ts
const scopes = /* @__PURE__ */ new WeakMap();
const restoredConfigs = /* @__PURE__ */ new WeakSet();
function scopeFor(config, options, create = false) {
	if (!config) return;
	const owner = restoredConfigs.has(config) ? config : options.preparationOwner ?? config;
	let environments = scopes.get(owner);
	if (!environments && create) {
		environments = /* @__PURE__ */ new WeakMap();
		scopes.set(owner, environments);
	}
	const env = options.env ?? process.env;
	let workspaces = environments?.get(env);
	if (!workspaces && create) {
		workspaces = /* @__PURE__ */ new Map();
		environments?.set(env, workspaces);
	}
	let scope = workspaces?.get(options.workspaceDir);
	if (!scope && create) {
		scope = { resolvers: /* @__PURE__ */ new WeakMap() };
		workspaces?.set(options.workspaceDir, scope);
	}
	return scope;
}
/** Captured resolver outcomes are authoritative before a worker loads any provider implementation. */
function readPreparedSyntheticAuthFact(context, options = {}) {
	const scope = scopeFor(context.config, options);
	if (context.config && restoredConfigs.has(context.config) && !scope?.restored) throw new Error("Prepared synthetic auth environment or workspace does not match");
	return scope?.restored?.get(normalizeProviderId(context.provider));
}
/** Read-only workers receive a closed generation: missing facts never start external work. */
function restorePreparedSyntheticAuthFacts(config, facts, options = {}) {
	const scope = scopeFor(config, options, true);
	restoredConfigs.add(config);
	scope.restored = new Map(facts.map((fact) => [normalizeProviderId(fact.providerRef), fact]));
}
function resolveSyntheticAuthWithProvider(provider, context, options = {}) {
	const captured = readPreparedSyntheticAuthFact(context, options);
	if (captured) return captured.result ?? void 0;
	if (!provider.prepareSyntheticAuth) return provider.resolveSyntheticAuth?.(context) ?? void 0;
	const scope = scopeFor(context.config, options);
	if (scope?.restored) throw new Error(`Prepared synthetic auth is missing for ${context.provider}`);
	return scope?.resolvers.get(provider.prepareSyntheticAuth)?.get(normalizeProviderId(context.provider))?.result ?? void 0;
}
async function prepareSyntheticAuthWithProvider(provider, context, options = {}) {
	options.signal?.throwIfAborted();
	const captured = readPreparedSyntheticAuthFact(context, options);
	if (captured) return captured.result ?? void 0;
	if (!provider.prepareSyntheticAuth) return provider.resolveSyntheticAuth?.(context) ?? void 0;
	const scope = scopeFor(context.config, options, true);
	if (scope?.restored) throw new Error(`Prepared synthetic auth is missing for ${context.provider}`);
	const ref = normalizeProviderId(context.provider);
	const prepare = provider.prepareSyntheticAuth;
	let entries = scope?.resolvers.get(prepare);
	if (!entries && scope) {
		entries = /* @__PURE__ */ new Map();
		scope.resolvers.set(prepare, entries);
	}
	const current = entries?.get(ref) ?? { pending: /* @__PURE__ */ new Map() };
	entries?.set(ref, current);
	let result = current.result;
	if (result === void 0) {
		let pending = current.pending.get(options.signal);
		if (!pending) {
			pending = Promise.resolve().then(() => {
				options.signal?.throwIfAborted();
				return prepare({
					...context,
					env: options.env,
					signal: options.signal,
					pluginRoot: provider.pluginRoot
				});
			}).then((prepared) => {
				options.signal?.throwIfAborted();
				return current.result = prepared ? Object.freeze({ ...prepared }) : null;
			}).finally(() => {
				current.pending.delete(options.signal);
			});
			current.pending.set(options.signal, pending);
		}
		result = await pending;
	}
	options.signal?.throwIfAborted();
	return result ?? void 0;
}
//#endregion
//#region src/plugins/provider-external-auth.ts
const { resolveExternalAuthProfilesWithPlugins } = nativePluginBindings.externalProfiles;
//#endregion
//#region src/plugins/provider-runtime.ts
function runtimeHook(name) {
	return (params) => {
		const plugin = resolveProviderRuntimePlugin(params);
		return (plugin?.[name])?.call(plugin, params.context);
	};
}
function normalizedRuntimeHook(name) {
	const invoke = runtimeHook(name);
	return (params) => invoke(params) ?? void 0;
}
function asyncRuntimeHook(name) {
	const invoke = runtimeHook(name);
	return async (params) => await Promise.resolve(invoke(params));
}
function toolSchemaHook(name) {
	return (params) => {
		const plugin = params.allowRuntimePluginLoad === false ? params.runtimeHandle?.plugin ?? resolveLoadedProviderRuntimePlugin(params) : ensureProviderRuntimePluginHandle(params).plugin;
		return (plugin?.[name])?.call(plugin, params.context) ?? void 0;
	};
}
function resolveProviderHookRefs(provider, providerConfig, modelApi) {
	const refs = [provider];
	const apiRef = normalizeOptionalString(modelApi ?? providerConfig?.api);
	if (apiRef && normalizeProviderId(apiRef) !== normalizeProviderId(provider)) refs.push(apiRef);
	return uniqueStrings(refs);
}
function matchesAnyProviderPluginRef(provider, providerRefs) {
	return providerRefs.some((providerRef) => matchesProviderPluginRef(provider, providerRef));
}
function hasExplicitProviderRuntimePluginActivation(params) {
	if (!params.config) return true;
	const ownerPluginIds = resolveOwningPluginIdsForProvider({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) ?? [];
	if (ownerPluginIds.length === 0) return false;
	const allow = new Set(params.config.plugins?.allow ?? []);
	const entries = params.config.plugins?.entries ?? {};
	return ownerPluginIds.some((pluginId) => allow.has(pluginId) || entries[pluginId] !== void 0);
}
function hasConfiguredModelProvider(params) {
	return findNormalizedProviderValue(params.config?.models?.providers, params.provider) !== void 0;
}
function resolveProviderPluginsForCatalogHooks(params) {
	const workspaceDir = params.workspaceDir ?? params.metadataSnapshot?.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	const env = params.env ?? process.env;
	const onlyPluginIds = resolveCatalogHookProviderPluginIds({
		config: params.config,
		workspaceDir,
		env,
		metadataSnapshot: params.metadataSnapshot
	});
	if (onlyPluginIds.length === 0 || params.providerIds?.length === 0) return [];
	const providers = resolveProviderPluginsForHooks({
		...params,
		workspaceDir,
		env,
		onlyPluginIds,
		providerRefs: params.providerIds,
		pluginMetadataSnapshot: params.metadataSnapshot
	});
	const providerIds = params.providerIds;
	return providerIds ? providers.filter((provider) => matchesAnyProviderPluginRef(provider, providerIds)) : providers;
}
const runProviderDynamicModel = normalizedRuntimeHook("resolveDynamicModel");
function resolveProviderSystemPromptContribution(params) {
	const plugin = ensureProviderRuntimePluginHandle(params).plugin;
	const baseOverlay = resolveGpt5SystemPromptContribution({
		config: params.context.config ?? params.config,
		providerId: params.context.provider ?? params.provider,
		modelId: params.context.modelId,
		trigger: params.context.trigger
	});
	return mergeProviderSystemPromptContributions(mergeProviderSystemPromptContributions(baseOverlay, plugin?.resolvePromptOverlay?.({
		...params.context,
		baseOverlay
	}) ?? void 0), plugin?.resolveSystemPromptContribution?.(params.context) ?? void 0);
}
function mergeProviderSystemPromptContributions(base, override) {
	if (!base) return override;
	if (!override) return base;
	const stablePrefix = mergeUniquePromptSections(base.stablePrefix, override.stablePrefix);
	const dynamicSuffix = mergeUniquePromptSections(base.dynamicSuffix, override.dynamicSuffix);
	return {
		...stablePrefix ? { stablePrefix } : {},
		...dynamicSuffix ? { dynamicSuffix } : {},
		sectionOverrides: {
			...base.sectionOverrides,
			...override.sectionOverrides
		}
	};
}
function mergeUniquePromptSections(...sections) {
	const uniqueSections = uniqueStrings(sections.filter((section) => Boolean(section?.trim())));
	return uniqueSections.length > 0 ? uniqueSections.join("\n\n") : void 0;
}
function transformProviderSystemPrompt(params) {
	const plugin = ensureProviderRuntimePluginHandle(params).plugin;
	const textTransforms = mergePluginTextTransforms(resolveRuntimeTextTransforms(), plugin?.textTransforms);
	const transformed = plugin?.transformSystemPrompt?.(params.context) ?? params.context.systemPrompt;
	return applyPluginTextReplacements(transformed, textTransforms?.input);
}
function resolveProviderTextTransforms(params) {
	return mergePluginTextTransforms(resolveRuntimeTextTransforms(), ensureProviderRuntimePluginHandle(params).plugin?.textTransforms);
}
const prepareProviderDynamicModel = asyncRuntimeHook("prepareDynamicModel");
function providerOwnsDynamicModelPreparation(params) {
	return resolveProviderRuntimePlugin(params)?.prepareDynamicModel !== void 0;
}
function shouldPreferProviderRuntimeResolvedModel(params) {
	return resolveProviderRuntimePlugin(params)?.preferRuntimeResolvedModel?.(params.context) ?? false;
}
function normalizeProviderResolvedModelWithPlugin(params) {
	const context = {
		...params.context,
		...params.context.config === void 0 && params.config !== void 0 ? { config: params.config } : {},
		...params.context.workspaceDir === void 0 && params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
	};
	return resolveProviderRuntimePlugin({
		...params,
		modelId: params.context.modelId
	})?.normalizeResolvedModel?.(context) ?? void 0;
}
function applyProviderResolvedTransportWithPlugin(params) {
	const config = params.context.config ?? params.config;
	const workspaceDir = params.context.workspaceDir ?? params.workspaceDir;
	const normalized = normalizeProviderTransportWithPlugin({
		provider: params.provider,
		config,
		workspaceDir,
		env: params.env,
		modelId: params.context.modelId,
		context: {
			...config !== void 0 ? { config } : {},
			...workspaceDir !== void 0 ? { workspaceDir } : {},
			provider: params.context.provider,
			modelId: params.context.modelId,
			api: params.context.model.api,
			baseUrl: params.context.model.baseUrl
		}
	});
	if (!normalized) return;
	const nextApi = normalized.api ?? params.context.model.api;
	const nextBaseUrl = normalized.baseUrl ?? params.context.model.baseUrl;
	if (nextApi === params.context.model.api && nextBaseUrl === params.context.model.baseUrl) return;
	return {
		...params.context.model,
		api: nextApi,
		baseUrl: nextBaseUrl
	};
}
function normalizeProviderTransportWithPlugin(params) {
	const hasTransportChange = (normalized) => (normalized.api ?? params.context.api) !== params.context.api || (normalized.baseUrl ?? params.context.baseUrl) !== params.context.baseUrl;
	const context = {
		...params.context,
		...params.context.config === void 0 && params.config !== void 0 ? { config: params.config } : {},
		...params.context.workspaceDir === void 0 && params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
	};
	const matchedPlugin = resolveProviderHookPlugin(params);
	const normalizedMatched = matchedPlugin?.normalizeTransport?.(context);
	if (normalizedMatched && hasTransportChange(normalizedMatched)) return normalizedMatched;
	if (hasConfiguredModelProvider(params)) return;
	for (const candidate of resolveProviderPluginsForHooks(params)) {
		if (!candidate.normalizeTransport || candidate === matchedPlugin) continue;
		const normalized = candidate.normalizeTransport(context);
		if (normalized && hasTransportChange(normalized)) return normalized;
	}
}
function normalizeProviderConfigWithPlugin(params) {
	const hasConfigChange = (normalized) => normalized !== params.context.providerConfig;
	const bundledSurface = resolveBundledProviderPolicySurface(params.provider, { manifestRegistry: params.manifestRegistry });
	if (bundledSurface?.normalizeConfig) {
		const normalized = bundledSurface.normalizeConfig(params.context);
		return normalized && hasConfigChange(normalized) ? normalized : void 0;
	}
	if (!hasExplicitProviderRuntimePluginActivation(params)) return;
	if (params.allowRuntimePluginLoad === false) return;
	const normalizedMatched = resolveProviderRuntimePlugin(params)?.normalizeConfig?.(params.context);
	return normalizedMatched && hasConfigChange(normalizedMatched) ? normalizedMatched : void 0;
}
function resolveProviderConfigApiKeyWithPlugin(params) {
	const bundledSurface = resolveBundledProviderPolicySurface(params.provider, { manifestRegistry: params.manifestRegistry });
	if (bundledSurface?.resolveConfigApiKey) return normalizeOptionalString(bundledSurface.resolveConfigApiKey(params.context));
	if (params.allowRuntimePluginLoad === false) return;
	return normalizeOptionalString(resolveProviderRuntimePlugin(params)?.resolveConfigApiKey?.(params.context));
}
const sanitizeProviderReplayHistoryWithPlugin = asyncRuntimeHook("sanitizeReplayHistory");
const validateProviderReplayTurnsWithPlugin = asyncRuntimeHook("validateReplayTurns");
const normalizeProviderToolSchemasWithPlugin = toolSchemaHook("normalizeToolSchemas");
const inspectProviderToolSchemasWithPlugin = toolSchemaHook("inspectToolSchemas");
function resolveProviderReasoningOutputModeWithPlugin(params) {
	const mode = ensureProviderRuntimePluginHandle({
		provider: params.provider,
		modelId: params.context.modelId,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		runtimeHandle: params.runtimeHandle
	}).plugin?.resolveReasoningOutputMode?.(params.context);
	return mode === "native" || mode === "tagged" ? mode : void 0;
}
function resolveProviderStreamFn(params) {
	const plugin = params.runtimeHandle?.provider === params.provider ? ensureProviderRuntimePluginHandle(params).plugin : params.allowRuntimePluginLoad === false ? resolveLoadedProviderRuntimePlugin(params) : resolveProviderRuntimePlugin(params);
	const streamFn = plugin?.createStreamFn?.(params.context);
	if (!streamFn || plugin?.supportsSystemPromptCacheBoundary) return streamFn ?? void 0;
	return (model, context, options) => streamFn(model, context.systemPrompt ? {
		...context,
		systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt)
	} : context, options);
}
function resolveProviderTransportTurnStateWithPlugin(params) {
	const plugin = params.runtimeHandle ? ensureProviderRuntimePluginHandle(params).plugin : params.allowRuntimePluginLoad === false ? resolveLoadedProviderRuntimePlugin(params) : resolveProviderRuntimePlugin(params);
	const turnState = plugin?.resolveTransportTurnState?.(params.context) ?? void 0;
	if (params.context.transport !== "websocket") return turnState;
	const legacyPolicy = plugin?.resolveWebSocketSessionPolicy?.(params.context);
	if (!legacyPolicy) return turnState;
	return {
		...turnState,
		websocket: {
			...legacyPolicy,
			...turnState?.websocket
		}
	};
}
async function prepareProviderRuntimeAuth(params) {
	const prepareRuntimeAuth = resolveProviderRuntimePlugin(params)?.prepareRuntimeAuth;
	if (!prepareRuntimeAuth) return;
	const preparedInput = unwrapSecretSentinelsForProviderEgress(params.context.apiKey, "provider runtime auth exchange");
	return await prepareRuntimeAuth({
		...params.context,
		apiKey: preparedInput
	});
}
const resolveUsageAuth = asyncRuntimeHook("resolveUsageAuth");
const resolveProviderUsageAuthWithPlugin = async (params) => await resolveUsageAuth(params) ?? void 0;
async function resolveProviderUsageSnapshotWithPlugin(params) {
	const providerHook = resolveProviderRuntimePlugin(params)?.fetchUsageSnapshot;
	if (providerHook) {
		const snapshot = await providerHook(params.context);
		if (snapshot != null) return snapshot;
	}
	if (params.provider === params.context.provider) return;
	const harness = getRegisteredAgentHarness(params.provider)?.harness;
	if (!harness) {
		const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState() ?? process.cwd();
		const { withAgentPluginRegistry } = await import("./runtime-plugins-DOEUYGBH.mjs");
		const { ensureSelectedAgentHarnessPlugin } = await import("./runtime-plugin-CpRpKYEp.mjs");
		return await withAgentPluginRegistry({
			config: params.config ?? {},
			...params.env ? { env: params.env } : {},
			selections: [{
				provider: params.context.provider,
				modelId: "",
				runtime: params.provider
			}],
			workspaceDir,
			run: async (pluginRegistry) => {
				await ensureSelectedAgentHarnessPlugin({
					provider: params.context.provider,
					modelId: "",
					config: params.config,
					agentHarnessId: params.provider,
					workspaceDir,
					pluginRegistry
				});
				return await getRegisteredAgentHarness(params.provider)?.harness.fetchUsageSnapshot?.(params.context);
			}
		});
	}
	return await harness?.fetchUsageSnapshot?.(params.context);
}
/** Lists provider plugins that own the complete usage auth + fetch lifecycle. */
function listProviderUsagePluginDescriptors(params) {
	const descriptors = /* @__PURE__ */ new Map();
	for (const contract of resolveUsageHookProviderPluginContracts(params)) for (const declaredProviderId of contract.providerIds) {
		const provider = normalizeProviderId(declaredProviderId);
		if (!provider || descriptors.has(provider)) continue;
		descriptors.set(provider, {
			provider,
			displayName: providerUsageLabel(provider) ?? provider
		});
	}
	return [...descriptors.values()].toSorted((a, b) => a.provider.localeCompare(b.provider));
}
const formatProviderAuthProfileApiKeyWithPlugin = runtimeHook("formatApiKey");
async function loginProviderOAuthWithPlugin(params) {
	const ownership = resolveProviderRefOwnership(params);
	const loginOAuth = resolveProviderRuntimePlugin(params)?.loginOAuth;
	if (!loginOAuth) return { status: ownership.status === "unowned" ? "unowned" : "configured-unavailable" };
	return {
		status: "available",
		credentials: await loginOAuth(params.context)
	};
}
async function resolveProviderOAuthCredentialWithPlugin(params) {
	const ownership = resolveProviderRefOwnership(params);
	const plugin = resolveProviderRuntimePlugin(params);
	if (!plugin) return { status: ownership.status === "unowned" ? "unowned" : "configured-unavailable" };
	let credential = params.credential;
	if (params.refresh) {
		const refreshOAuth = plugin.refreshOAuth;
		if (!refreshOAuth) return { status: "unhandled" };
		credential = await refreshOAuth(params.credential);
	}
	if (!credential) return { status: "unhandled" };
	const apiKey = plugin.formatApiKey?.(credential) ?? credential.access;
	if (typeof apiKey !== "string" || !apiKey) return { status: "unhandled" };
	return {
		status: "available",
		credential,
		apiKey
	};
}
/** Resolve whether the current provider plugin generation owns OAuth refresh. */
function resolveProviderOAuthRefreshCapabilityWithPlugin(params) {
	const ownership = resolveProviderRefOwnership(params);
	const plugin = resolveProviderRuntimePlugin(params);
	if (!plugin) return { status: ownership.status === "unowned" ? "unowned" : "configured-unavailable" };
	return plugin.refreshOAuth ? { status: "available" } : { status: "unhandled" };
}
const refreshProviderOAuthCredentialWithPlugin = asyncRuntimeHook("refreshOAuth");
const buildProviderAuthDoctorHintWithPlugin = asyncRuntimeHook("buildAuthDoctorHint");
const resolveProviderCacheTtlEligibility = runtimeHook("isCacheTtlEligible");
const resolveProviderModernModelRef = runtimeHook("isModernModelRef");
/** Returns provider-owned profile ids retired from generic credential resolution. */
function resolveProviderDeprecatedAuthProfileIds(params) {
	const metadataSnapshot = getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	});
	return resolveProviderPolicySurface(params.provider, { manifestRegistry: metadataSnapshot?.manifestRegistry })?.deprecatedProfileIds ?? resolveLoadedProviderRuntimePlugin(params)?.deprecatedProfileIds ?? [];
}
const buildProviderMissingAuthMessageWithPlugin = normalizedRuntimeHook("buildMissingAuthMessage");
const buildProviderUnknownModelHintWithPlugin = normalizedRuntimeHook("buildUnknownModelHint");
function* resolveSyntheticAuthProviders(params) {
	const providerRefs = resolveProviderHookRefs(params.provider, params.context.providerConfig, params.modelApi);
	const matchesSyntheticAuthProvider = (provider) => matchesAnyProviderPluginRef(provider, providerRefs) && Boolean(provider.resolveSyntheticAuth || provider.prepareSyntheticAuth);
	const discoveryPluginIds = [...new Set(providerRefs.flatMap((provider) => resolveOwningPluginIdsForProviderRef({
		provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) ?? []))];
	const discoveryProvider = (discoveryPluginIds.length > 0 ? resolvePluginDiscoveryProvidersRuntime({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: discoveryPluginIds,
		discoveryEntriesOnly: true,
		includeSyntheticAuthProviders: true,
		includeManifestModelCatalogProviders: false
	}) : []).find(matchesSyntheticAuthProvider);
	if (discoveryProvider) {
		yield discoveryProvider;
		return;
	}
	for (const providerRef of providerRefs) {
		const provider = resolveProviderRuntimePlugin({
			...params,
			provider: providerRef,
			applyAutoEnable: false
		});
		if (provider?.resolveSyntheticAuth || provider?.prepareSyntheticAuth) yield provider;
	}
	if (discoveryPluginIds.length === 0 && providerRefs.length === 1) {
		const fallbackProvider = resolvePluginDiscoveryProvidersRuntime({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			discoveryEntriesOnly: true,
			includeSyntheticAuthProviders: true,
			includeManifestModelCatalogProviders: false
		}).find(matchesSyntheticAuthProvider);
		if (fallbackProvider) yield fallbackProvider;
	}
}
function resolveProviderSyntheticAuthWithPlugin(params) {
	const captured = readPreparedSyntheticAuthFact(params.context, params);
	if (captured) return captured.result ?? void 0;
	for (const provider of resolveSyntheticAuthProviders(params)) {
		const resolved = resolveSyntheticAuthWithProvider(provider, params.context, params);
		if (resolved) return resolved;
	}
}
async function prepareSyntheticAuthProviders(providers, params) {
	params.signal?.throwIfAborted();
	for (const provider of providers) {
		const resolved = await prepareSyntheticAuthWithProvider(provider, params.context, params);
		if (resolved) return resolved;
	}
}
async function prepareProviderSyntheticAuthWithPlugin(params) {
	params.signal?.throwIfAborted();
	const captured = readPreparedSyntheticAuthFact(params.context, params);
	if (captured) return captured.result ?? void 0;
	return await prepareSyntheticAuthProviders(resolveSyntheticAuthProviders(params), params);
}
function resolveExternalSyntheticAuthProviders(params) {
	const providers = [...resolveSyntheticAuthProviders(params)];
	return providers.some((provider) => provider.prepareSyntheticAuth) ? providers : [];
}
/** Prepare external checks without evaluating pure-only hooks before their synchronous read. */
async function prepareProviderExternalAuthWithPlugin(params) {
	params.signal?.throwIfAborted();
	const captured = readPreparedSyntheticAuthFact(params.context, params);
	return captured ? captured.result ?? void 0 : await prepareSyntheticAuthProviders(resolveExternalSyntheticAuthProviders(params), params);
}
/** Capture a fresh, complete external-auth generation before dispatching read-only worker work. */
async function captureProviderSyntheticAuthFacts(params) {
	const preparationOwner = {};
	const facts = [];
	const providerRefs = [...new Set([...params.providerRefs].map(normalizeProviderId))].toSorted();
	for (const provider of providerRefs) {
		params.signal?.throwIfAborted();
		const lookup = {
			provider,
			config: params.config,
			env: params.env,
			workspaceDir: params.workspaceDir,
			context: {
				config: params.config,
				provider,
				providerConfig: findNormalizedProviderValue(params.config.models?.providers, provider)
			}
		};
		const providers = resolveExternalSyntheticAuthProviders(lookup);
		if (providers.length === 0) continue;
		const result = await prepareSyntheticAuthProviders(providers, {
			...lookup,
			signal: params.signal,
			preparationOwner
		});
		facts.push(Object.freeze({
			providerRef: provider,
			result: result ? Object.freeze({ ...result }) : null
		}));
	}
	params.signal?.throwIfAborted();
	return Object.freeze(facts);
}
function shouldDeferProviderSyntheticProfileAuthWithPlugin(params) {
	const providerRefs = resolveProviderHookRefs(params.provider, params.context.providerConfig, params.modelApi);
	for (const providerRef of providerRefs) {
		const resolved = resolveProviderRuntimePlugin({
			...params,
			provider: providerRef
		})?.shouldDeferSyntheticProfileAuth?.(params.context);
		if (resolved !== void 0) return resolved;
	}
}
async function augmentModelCatalogWithProviderPlugins(params) {
	const supplemental = [];
	for (const plugin of resolveProviderPluginsForCatalogHooks(params)) {
		const next = await plugin.augmentModelCatalog?.(params.context);
		if (!next || next.length === 0) continue;
		supplemental.push(...next);
	}
	return supplemental;
}
//#endregion
export { resolveProviderSystemPromptContribution as A, validateProviderReplayTurnsWithPlugin as B, resolveProviderDeprecatedAuthProfileIds as C, resolveProviderReasoningOutputModeWithPlugin as D, resolveProviderOAuthRefreshCapabilityWithPlugin as E, runProviderDynamicModel as F, prepareSyntheticAuthWithProvider as H, sanitizeProviderReplayHistoryWithPlugin as I, shouldDeferProviderSyntheticProfileAuthWithPlugin as L, resolveProviderTransportTurnStateWithPlugin as M, resolveProviderUsageAuthWithPlugin as N, resolveProviderStreamFn as O, resolveProviderUsageSnapshotWithPlugin as P, shouldPreferProviderRuntimeResolvedModel as R, resolveProviderConfigApiKeyWithPlugin as S, resolveProviderOAuthCredentialWithPlugin as T, restorePreparedSyntheticAuthFacts as U, resolveExternalAuthProfilesWithPlugins as V, prepareProviderRuntimeAuth as _, buildProviderUnknownModelHintWithPlugin as a, refreshProviderOAuthCredentialWithPlugin as b, inspectProviderToolSchemasWithPlugin as c, normalizeProviderConfigWithPlugin as d, normalizeProviderResolvedModelWithPlugin as f, prepareProviderExternalAuthWithPlugin as g, prepareProviderDynamicModel as h, buildProviderMissingAuthMessageWithPlugin as i, resolveProviderTextTransforms as j, resolveProviderSyntheticAuthWithPlugin as k, listProviderUsagePluginDescriptors as l, normalizeProviderTransportWithPlugin as m, augmentModelCatalogWithProviderPlugins as n, captureProviderSyntheticAuthFacts as o, normalizeProviderToolSchemasWithPlugin as p, buildProviderAuthDoctorHintWithPlugin as r, formatProviderAuthProfileApiKeyWithPlugin as s, applyProviderResolvedTransportWithPlugin as t, loginProviderOAuthWithPlugin as u, prepareProviderSyntheticAuthWithPlugin as v, resolveProviderModernModelRef as w, resolveProviderCacheTtlEligibility as x, providerOwnsDynamicModelPreparation as y, transformProviderSystemPrompt as z };
