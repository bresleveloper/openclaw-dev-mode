import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-CJrzFzqU.mjs";
import { v as sortUniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { N as computeModelPolicyAllowlist, h as resolveDefaultAgentDir, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { l as toAgentModelListLike, n as normalizeAgentModelMapForConfig, o as resolveAgentModelFallbackValues, r as normalizeAgentModelRefForConfig, s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CG17uXFn.mjs";
import { o as normalizeModelRef, r as formatLiteralProviderPrefixedModelRef } from "./model-ref-shared-KBg0y299.mjs";
import { d as hashRuntimeConfigValue } from "./runtime-snapshot-DYptB0Cf.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { h as resolveConfiguredModelRef, i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-DKlQ1p0S.mjs";
import { r as openAIModelCatalogRoutePolicy } from "./openai-model-routes-CVmOODN3.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-Rdb47msF.mjs";
import { f as resolveOwningPluginIdsForProviderRef } from "./providers-DQUFJKZx.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-Qx0DZ2Si.mjs";
import "./model-selection-D3_rVb38.mjs";
import "./auth-profiles-BIPn3mmc.mjs";
import { n as createModelPickerVisibleProviderPredicate } from "./model-runtime-aliases-B5N-I0ib.mjs";
import { i as createRuntimeProviderAuthLookup } from "./model-auth-provider-BYw8loNa.mjs";
import "./model-auth-efmtIdn2.mjs";
import { r as resolveManifestProviderAuthChoice } from "./provider-auth-choices-BWz3K_lG.mjs";
import { n as buildProviderPluginMethodChoice } from "./provider-plugin-choice-BugOkW_k.mjs";
import { n as loadPreparedModelCatalogView } from "./model-catalog-view-9sJ2V6c7.mjs";
import { r as t } from "./i18n-Cuh2pEdZ.mjs";
import "./provider-model-primary-CBQXA_V3.mjs";
import { m as formatTokenK } from "./shared-CP4E7wPe.mjs";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-IckkXX2-.mjs";
import { n as resolveLogicalModelCatalogEntryState, r as resolveLogicalVisibleModelCatalog } from "./model-catalog-visibility-BvwFg0Xd.mjs";
//#region src/agents/model-provider-auth.ts
/** Route-aware auth checks for model-picker callers. */
/** Creates a cached provider-auth evaluator bound to one agent/runtime context. */
function createProviderAuthChecker(params) {
	const authCache = /* @__PURE__ */ new Map();
	let modelAuthResolver;
	const resolveModelAuthResolver = () => {
		if (modelAuthResolver) return modelAuthResolver;
		const authStore = ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, { allowKeychainPrompt: false });
		const runtimeAuthLookup = createRuntimeProviderAuthLookup({
			cfg: params.cfg,
			workspaceDir: params.workspaceDir,
			env: params.env,
			includePluginSyntheticAuth: true
		});
		modelAuthResolver = createModelAuthAvailabilityResolver({
			cfg: params.cfg ?? {},
			agentId: params.agentId,
			authStore,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			env: params.env,
			allowPreparedRuntimeAuth: true,
			syntheticAuthProviderRefs: runtimeAuthLookup.syntheticAuthProviderRefs,
			externalCliProviderIds: ["openai"]
		});
		return modelAuthResolver;
	};
	const evaluateModelAuth = (provider, ref) => {
		const key = normalizeProviderId(provider);
		const cacheKey = `${key}\0${hashRuntimeConfigValue(ref)}`;
		return getOrCreatePromise(authCache, cacheKey, () => Promise.resolve().then(() => resolveModelAuthResolver().evaluateModelAuth(key, ref)), { cacheRejections: false });
	};
	return Object.assign(async (provider, ref) => (await evaluateModelAuth(provider, ref)).availability === true, { evaluateModelAuth });
}
//#endregion
//#region src/flows/model-picker-provider-setup.ts
const loadResolvedModelPickerRuntime = createLazyRuntimeNamedExport(() => import("./model-picker.runtime.js"), "modelPickerRuntime");
async function resolveProviderPluginSetupOptions(params) {
	return (await loadResolvedModelPickerRuntime()).resolveProviderModelPickerEntries({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env
	}).map(({ value, label, hint }) => Object.assign({
		value,
		label
	}, hint ? { hint } : void 0)).toSorted((left, right) => left.label.localeCompare(right.label) || left.value.localeCompare(right.value));
}
async function maybeHandleProviderPluginSelection(params) {
	let pluginResolution = null;
	let pluginProviders = [];
	if (params.selection.startsWith("provider-plugin:")) pluginResolution = params.selection;
	else if (!params.selection.includes("/")) {
		const { resolvePluginProviders } = await loadResolvedModelPickerRuntime();
		pluginProviders = resolvePluginProviders({
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			env: params.env,
			mode: "setup"
		});
		pluginResolution = pluginProviders.some((provider) => normalizeProviderId(provider.id) === normalizeProviderId(params.selection)) ? params.selection : null;
	}
	if (!pluginResolution) return null;
	if (!params.agentDir || !params.runtime) {
		await params.prompter.note(t("wizard.model.providerSetupUnavailable"), t("wizard.model.providerSetupUnavailableTitle"));
		return {};
	}
	const { resolvePluginProviders, resolveProviderPluginChoice, runProviderModelSelectedHook, runProviderPluginAuthMethod } = await loadResolvedModelPickerRuntime();
	if (pluginProviders.length === 0) pluginProviders = resolvePluginProviders({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		mode: "setup"
	});
	const resolved = resolveProviderPluginChoice({
		providers: pluginProviders,
		choice: pluginResolution,
		resolveManifestMethodChoice: (provider, method) => provider.pluginId ? resolveManifestProviderAuthChoice(buildProviderPluginMethodChoice(provider.id, method.id), {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			env: params.env,
			pluginId: provider.pluginId,
			includeUntrustedWorkspacePlugins: false
		}) : void 0,
		manifestChoice: resolveManifestProviderAuthChoice(pluginResolution, {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			env: params.env,
			includeUntrustedWorkspacePlugins: false
		})
	});
	if (!resolved) return {};
	if (resolved.wizard?.modelTarget === "utility" || resolved.method.wizard?.modelTarget === "utility") {
		await params.prompter.note("This provider configures utility inference. Select it in onboarding; choose a regular model here.", "Utility model");
		return {};
	}
	const applied = await runProviderPluginAuthMethod({
		config: params.cfg,
		providerId: resolved.provider.id,
		runtime: params.runtime,
		prompter: params.prompter,
		method: resolved.method,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	if (applied.defaultModel) await runProviderModelSelectedHook({
		config: applied.config,
		model: applied.defaultModel,
		prompter: params.prompter,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	return {
		model: applied.defaultModel,
		config: applied.config
	};
}
//#endregion
//#region src/flows/model-picker.ts
const KEEP_VALUE = "__keep__";
const MANUAL_VALUE = "__manual__";
const BROWSE_VALUE = "__browse__";
const PROVIDER_FILTER_THRESHOLD = 30;
const EMPTY_LITERAL_PREFIX_PROVIDERS = /* @__PURE__ */ new Set();
const HIDDEN_ROUTER_MODELS = /* @__PURE__ */ new Set(["openrouter/auto"]);
function formatKeepCurrentModelLabel(params) {
	return params.configuredRaw ? t("wizard.model.keepCurrent", { value: params.configuredLabel }) : t("wizard.model.keepCurrentDefault", { value: params.resolvedKey });
}
function formatModelRefLabel(params) {
	const providerId = normalizeProviderId(params.provider);
	const modelId = params.model.trim().toLowerCase();
	return providerId && params.literalPrefixProviders.has(providerId) && modelId.startsWith(`${providerId}/`) ? formatLiteralProviderPrefixedModelRef(params.provider, params.key) : params.key;
}
function resolveConfiguredModelKeys(cfg) {
	const models = cfg.agents?.defaults?.models ?? {};
	return Object.keys(models).map((key) => key.trim()).filter((key) => key.length > 0);
}
function resolveModelPickerConfig(cfg, agentId) {
	if (!agentId) return cfg;
	const agent = resolveAgentConfig(cfg, agentId);
	if (agent?.model === void 0 && agent?.models === void 0) return cfg;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				...agent.model !== void 0 ? { model: {
					...toAgentModelListLike(agent.model),
					primary: resolveAgentEffectiveModelPrimary(cfg, agentId)
				} } : {},
				...agent.models !== void 0 ? { models: {
					...cfg.agents?.defaults?.models,
					...agent.models
				} } : {}
			}
		}
	};
}
async function resolvePickerLogicalCatalog(params) {
	const sourceOrder = /* @__PURE__ */ new Map();
	for (const entry of params.catalog) {
		const key = openAIModelCatalogRoutePolicy.resolveIdentity(entry)?.key ?? modelCatalogEntryKey(entry);
		if (!sourceOrder.has(key)) sourceOrder.set(key, sourceOrder.size);
	}
	return (await resolveLogicalVisibleModelCatalog({
		cfg: params.cfg,
		catalog: params.catalog,
		defaultProvider: params.defaultProvider,
		...params.defaultModel ? { defaultModel: params.defaultModel } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		...params.view ? { view: params.view } : {},
		routePolicy: openAIModelCatalogRoutePolicy,
		routeVariants: params.routeVariants,
		evaluateEntry: async (entry, routeVariants) => {
			const identity = openAIModelCatalogRoutePolicy.resolveIdentity(entry);
			const evaluation = await params.hasAuth.evaluateModelAuth(entry.provider, {
				modelId: identity?.id ?? entry.id,
				observedRoutes: routeVariants.map((variant) => ({
					api: variant.api,
					baseUrl: variant.baseUrl
				}))
			});
			return resolveLogicalModelCatalogEntryState({
				evaluation,
				routePolicy: openAIModelCatalogRoutePolicy
			});
		}
	})).toSorted((left, right) => {
		const leftKey = openAIModelCatalogRoutePolicy.resolveIdentity(left)?.key ?? modelCatalogEntryKey(left);
		const rightKey = openAIModelCatalogRoutePolicy.resolveIdentity(right)?.key ?? modelCatalogEntryKey(right);
		return (sourceOrder.get(leftKey) ?? Number.MAX_SAFE_INTEGER) - (sourceOrder.get(rightKey) ?? Number.MAX_SAFE_INTEGER);
	});
}
function normalizeModelKeys(values) {
	return [...new Set(Array.from(values, normalizeAgentModelRefForConfig).filter(Boolean))];
}
function resolveFallbackModelKeys(params) {
	return normalizeModelKeys(params.rawFallbacks.flatMap((value) => {
		const raw = normalizeOptionalString(value);
		if (!raw) return [];
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			raw,
			defaultProvider: params.defaultProvider,
			aliasIndex: params.aliasIndex
		});
		return resolved ? [modelKey(resolved.ref.provider, resolved.ref.model)] : [];
	}));
}
function createModelRouteRuntimeResolver(params) {
	const cache = /* @__PURE__ */ new Map();
	return (route) => {
		const baseUrlKey = typeof route.baseUrl === "string" ? route.baseUrl : route.baseUrl == null ? "" : typeof route.baseUrl;
		const key = [
			route.provider,
			route.modelId,
			route.api ?? "",
			baseUrlKey
		].join("\0");
		if (cache.has(key)) return cache.get(key);
		const policy = resolveAgentHarnessPolicy({
			provider: route.provider,
			modelId: route.modelId,
			modelApi: route.api,
			modelBaseUrl: route.baseUrl,
			config: params.config,
			env: params.env
		});
		const runtime = policy.runtime === "codex" ? "codex" : policy.runtime === "openclaw" ? "openclaw" : void 0;
		cache.set(key, runtime);
		return runtime;
	};
}
async function resolveLiteralPrefixProviderIds(params) {
	const { resolvePluginProviders } = await loadResolvedModelPickerRuntime();
	const providers = resolvePluginProviders({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		activate: false,
		cache: false,
		includeUntrustedWorkspacePlugins: false,
		...params.providerRefs?.length ? { providerRefs: params.providerRefs } : {}
	});
	const ids = /* @__PURE__ */ new Set();
	for (const provider of providers) {
		if (!provider.preserveLiteralProviderPrefix) continue;
		const id = normalizeProviderId(provider.id);
		if (id) ids.add(id);
		for (const alias of provider.aliases ?? []) {
			const aliasId = normalizeProviderId(alias);
			if (aliasId) ids.add(aliasId);
		}
	}
	return ids;
}
function modelCatalogEntryKey(entry) {
	const normalizedRef = normalizeModelRef(entry.provider, entry.id);
	return modelKey(normalizedRef.provider, normalizedRef.model);
}
async function addModelSelectOption(params) {
	const normalizedRef = normalizeModelRef(params.entry.provider, params.entry.id);
	const key = modelKey(normalizedRef.provider, normalizedRef.model);
	if (params.seen.has(key) || HIDDEN_ROUTER_MODELS.has(key) || !params.isVisibleProvider(normalizedRef.provider)) return;
	const hints = [];
	if (params.entry.name && params.entry.name !== params.entry.id) hints.push(params.entry.name);
	if (params.entry.contextWindow) hints.push(`ctx ${formatTokenK(params.entry.contextWindow)}`);
	if (params.entry.reasoning) hints.push("reasoning");
	const aliases = params.aliasIndex.byKey.get(key);
	if (aliases?.length) hints.push(`alias: ${aliases.join(", ")}`);
	if (normalizeProviderId(normalizedRef.provider) === "openai") {
		const route = params.resolveModelRouteRuntime({
			provider: normalizedRef.provider,
			modelId: normalizedRef.model,
			api: params.entry.api,
			baseUrl: params.entry.baseUrl
		});
		if (route) hints.push(route === "codex" ? "Codex runtime route" : "OpenClaw runtime route");
	}
	if (!await params.hasAuth(normalizedRef.provider, {
		modelId: normalizedRef.model,
		api: params.entry.api,
		baseUrl: params.entry.baseUrl
	})) return;
	const label = formatModelRefLabel({
		provider: normalizedRef.provider,
		model: normalizedRef.model,
		key,
		literalPrefixProviders: params.literalPrefixProviders ?? EMPTY_LITERAL_PREFIX_PROVIDERS
	});
	params.options.push({
		value: key,
		label,
		hint: hints.length > 0 ? hints.join(" · ") : params.fallbackHint
	});
	params.seen.add(key);
}
function splitModelKey(key) {
	const slashIndex = key.indexOf("/");
	if (slashIndex <= 0 || slashIndex >= key.length - 1) return;
	return {
		provider: key.slice(0, slashIndex),
		id: key.slice(slashIndex + 1)
	};
}
function createPreferredProviderMatcher(params) {
	const normalizedPreferredProvider = normalizeProviderId(params.preferredProvider);
	const preferredOwnerPluginIds = resolveOwningPluginIdsForProviderRef({
		provider: normalizedPreferredProvider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const preferredOwnerPluginIdSet = preferredOwnerPluginIds ? new Set(preferredOwnerPluginIds) : void 0;
	const entryProviderCache = /* @__PURE__ */ new Map();
	return (entryProvider) => {
		const normalizedEntryProvider = normalizeProviderId(entryProvider);
		if (normalizedEntryProvider === normalizedPreferredProvider) return true;
		const cached = entryProviderCache.get(normalizedEntryProvider);
		if (cached !== void 0) return cached;
		if (!preferredOwnerPluginIdSet) {
			entryProviderCache.set(normalizedEntryProvider, false);
			return false;
		}
		const value = resolveOwningPluginIdsForProviderRef({
			provider: normalizedEntryProvider,
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			env: params.env
		})?.some((pluginId) => preferredOwnerPluginIdSet.has(pluginId)) ?? false;
		entryProviderCache.set(normalizedEntryProvider, value);
		return value;
	};
}
async function promptManualModel(params) {
	const model = (await params.prompter.text({
		message: params.allowBlank ? t("wizard.model.defaultModelBlankToKeep") : t("wizard.model.defaultModel"),
		initialValue: params.initialValue,
		placeholder: "provider/model",
		validate: params.allowBlank ? void 0 : (value) => normalizeOptionalString(value) ? void 0 : t("common.required")
	}) ?? "").trim();
	if (!model) return {};
	return { model: normalizeAgentModelRefForConfig(model) };
}
async function maybeFilterModelsByProvider(params) {
	let next = params.models.filter((entry) => params.isVisibleProvider(entry.provider));
	const providerCounts = /* @__PURE__ */ new Map();
	for (const { provider } of next) providerCounts.set(provider, (providerCounts.get(provider) ?? 0) + 1);
	const { matchesPreferredProvider } = params;
	if (!matchesPreferredProvider && providerCounts.size > 1 && next.length > PROVIDER_FILTER_THRESHOLD) {
		const selection = await params.prompter.select({
			message: t("wizard.model.filterByProvider"),
			options: [{
				value: "*",
				label: t("wizard.model.allProviders")
			}, ...sortUniqueStrings(providerCounts.keys()).map((provider) => {
				const count = providerCounts.get(provider);
				return {
					value: provider,
					label: provider,
					hint: t("wizard.model.modelCount", {
						count,
						plural: count === 1 ? "" : "s"
					})
				};
			})],
			searchable: true
		});
		if (selection !== "*") next = next.filter((entry) => entry.provider === selection);
	}
	if (matchesPreferredProvider) {
		const filtered = next.filter((entry) => matchesPreferredProvider(entry.provider));
		if (filtered.length > 0) next = filtered;
	}
	return next;
}
async function promptDefaultModel(params) {
	const cfg = params.config;
	const pickerConfig = resolveModelPickerConfig(cfg, params.agentId);
	const pickerAgentDir = params.agentDir ?? resolveDefaultAgentDir(cfg, params.env ?? process.env);
	const allowKeep = params.allowKeep ?? true;
	const includeProviderPluginSetups = params.includeProviderPluginSetups ?? false;
	const loadCatalog = params.loadCatalog ?? true;
	const browseCatalogOnDemand = params.browseCatalogOnDemand ?? false;
	const ignoreAllowlist = params.ignoreAllowlist ?? false;
	const preferredProviderRaw = normalizeOptionalString(params.preferredProvider);
	const preferredProvider = preferredProviderRaw ? normalizeProviderId(preferredProviderRaw) : void 0;
	const providerScopedCatalog = Boolean(browseCatalogOnDemand && preferredProvider);
	const configuredRaw = resolveAgentModelPrimaryValue(pickerConfig.agents?.defaults?.model) ?? "";
	const resolved = resolveConfiguredModelRef({
		cfg: pickerConfig,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: !loadCatalog || browseCatalogOnDemand ? false : void 0
	});
	const resolvedKey = modelKey(resolved.provider, resolved.model);
	const configuredKey = configuredRaw ? resolvedKey : "";
	const promptManual = (allowBlank = allowKeep) => promptManualModel({
		prompter: params.prompter,
		allowBlank,
		initialValue: configuredRaw || resolvedKey || void 0
	});
	let literalPrefixProvidersCache;
	const resolveCachedLiteralPrefixProviders = async () => {
		if (!literalPrefixProvidersCache) literalPrefixProvidersCache = await resolveLiteralPrefixProviderIds({
			cfg,
			workspaceDir: params.workspaceDir,
			env: params.env,
			...providerScopedCatalog && preferredProvider ? { providerRefs: [preferredProvider] } : {}
		});
		return literalPrefixProvidersCache;
	};
	const resolveConfiguredDisplayLabel = async () => {
		if (!normalizeProviderId(resolved.provider)) return configuredRaw || resolvedKey;
		const literalPrefixProviders = await resolveCachedLiteralPrefixProviders();
		return formatModelRefLabel({
			provider: resolved.provider,
			model: resolved.model,
			key: configuredRaw || resolvedKey,
			literalPrefixProviders
		});
	};
	const offerCatalogBrowse = loadCatalog && browseCatalogOnDemand && allowKeep && (!preferredProvider || normalizeProviderId(resolved.provider) === preferredProvider);
	if (offerCatalogBrowse || !loadCatalog) {
		const configuredLabel = await resolveConfiguredDisplayLabel();
		const options = [];
		if (allowKeep) options.push({
			value: KEEP_VALUE,
			label: formatKeepCurrentModelLabel({
				configuredRaw,
				configuredLabel,
				resolvedKey
			}),
			hint: configuredRaw && configuredRaw !== resolvedKey ? t("wizard.model.resolvesTo", { value: resolvedKey }) : void 0
		});
		options.push({
			value: MANUAL_VALUE,
			label: t("wizard.model.enterManually")
		});
		if (offerCatalogBrowse) options.push({
			value: BROWSE_VALUE,
			label: t("wizard.model.browseAll"),
			hint: t("wizard.model.loadsProviderCatalogs")
		});
		else if (configuredKey && !options.some((option) => option.value === configuredKey)) options.push({
			value: configuredKey,
			label: configuredKey,
			hint: t("wizard.model.current")
		});
		const selection = await params.prompter.select({
			message: params.message ?? t("wizard.model.defaultModel"),
			options,
			initialValue: allowKeep ? KEEP_VALUE : configuredKey || MANUAL_VALUE,
			searchable: false
		});
		if (selection === KEEP_VALUE) return {};
		if (selection === MANUAL_VALUE) return promptManual(false);
		if (!offerCatalogBrowse || selection !== BROWSE_VALUE) return { model: selection };
	}
	const catalogProgress = params.prompter.progress(t("wizard.model.loadingModels"));
	let catalogSnapshot;
	try {
		catalogSnapshot = (await loadPreparedModelCatalogView({
			kind: "picker",
			config: cfg,
			preferredProvider: providerScopedCatalog ? preferredProvider : void 0,
			preferLiveProviderCatalog: providerScopedCatalog,
			providerScoped: providerScopedCatalog,
			agentDir: pickerAgentDir,
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
			...params.env !== void 0 ? { env: params.env } : {}
		})).snapshot;
	} finally {
		catalogProgress.stop();
	}
	const catalog = catalogSnapshot.entries;
	if (catalog.length === 0) return promptManual();
	const aliasIndex = buildModelAliasIndex({
		cfg: pickerConfig,
		defaultProvider: DEFAULT_PROVIDER
	});
	const hasAuth = createProviderAuthChecker({
		cfg,
		agentId: params.agentId,
		workspaceDir: params.workspaceDir,
		agentDir: pickerAgentDir,
		env: params.env
	});
	const resolveModelRouteRuntime = createModelRouteRuntimeResolver({
		config: cfg,
		env: params.env
	});
	const models = await resolvePickerLogicalCatalog({
		cfg: pickerConfig,
		catalog,
		routeVariants: catalogSnapshot.routeVariants,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: resolved,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		...ignoreAllowlist ? { view: "all" } : {},
		hasAuth
	});
	if (models.length === 0) return promptManual();
	const isVisibleProvider = createModelPickerVisibleProviderPredicate({
		config: cfg,
		env: params.env,
		includeSetupRegistry: !providerScopedCatalog
	});
	const matchesPreferredProvider = preferredProvider ? createPreferredProviderMatcher({
		preferredProvider,
		cfg,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) : void 0;
	const filteredModels = await maybeFilterModelsByProvider({
		models,
		matchesPreferredProvider,
		prompter: params.prompter,
		isVisibleProvider
	});
	if (filteredModels.length === 0) return promptManual();
	const literalPrefixProviders = await resolveCachedLiteralPrefixProviders();
	const configuredLabel = formatModelRefLabel({
		provider: resolved.provider,
		model: resolved.model,
		key: configuredRaw || resolvedKey,
		literalPrefixProviders
	});
	const options = [];
	if (allowKeep) options.push({
		value: KEEP_VALUE,
		label: formatKeepCurrentModelLabel({
			configuredRaw,
			configuredLabel,
			resolvedKey
		})
	});
	options.push({
		value: MANUAL_VALUE,
		label: t("wizard.model.enterManually")
	});
	if (includeProviderPluginSetups && params.agentDir && !providerScopedCatalog) options.push(...await resolveProviderPluginSetupOptions({
		cfg,
		workspaceDir: params.workspaceDir,
		env: params.env
	}));
	const seen = /* @__PURE__ */ new Set();
	for (const entry of filteredModels) await addModelSelectOption({
		entry,
		options,
		seen,
		aliasIndex,
		hasAuth,
		literalPrefixProviders,
		isVisibleProvider,
		resolveModelRouteRuntime
	});
	if (configuredKey && !seen.has(configuredKey)) options.push({
		value: configuredKey,
		label: configuredLabel,
		hint: t("wizard.model.currentNotInCatalog")
	});
	const firstPreferredModel = preferredProvider ? filteredModels.find((entry) => matchesPreferredProvider?.(entry.provider)) : void 0;
	const firstPreferredModelKey = firstPreferredModel ? modelCatalogEntryKey(firstPreferredModel) : void 0;
	let initialValue = allowKeep ? KEEP_VALUE : configuredKey || void 0;
	if (!allowKeep && firstPreferredModelKey) initialValue = firstPreferredModelKey;
	else if (allowKeep && firstPreferredModelKey && preferredProvider && !matchesPreferredProvider?.(resolved.provider)) initialValue = firstPreferredModelKey;
	const selectedValue = await params.prompter.select({
		message: params.message ?? t("wizard.model.defaultModel"),
		options,
		initialValue,
		searchable: true
	}) ?? "";
	if (selectedValue === KEEP_VALUE) return {};
	if (selectedValue === MANUAL_VALUE) return promptManual(false);
	const providerPluginResult = await maybeHandleProviderPluginSelection({
		selection: selectedValue,
		cfg,
		prompter: params.prompter,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		env: params.env,
		runtime: params.runtime
	});
	if (providerPluginResult) return providerPluginResult;
	const model = normalizeAgentModelRefForConfig(selectedValue);
	const { runProviderModelSelectedHook } = await loadResolvedModelPickerRuntime();
	await runProviderModelSelectedHook({
		config: cfg,
		model,
		prompter: params.prompter,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	return { model };
}
async function promptModelAllowlist(params) {
	const cfg = resolveModelPickerConfig(params.config, params.agentId);
	const pickerAgentDir = params.agentDir ?? resolveDefaultAgentDir(cfg, params.env ?? process.env);
	const existingKeys = resolveConfiguredModelKeys(cfg);
	const configuredRaw = resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ?? "";
	const allowedKeys = normalizeModelKeys(params.allowedKeys ?? []);
	const preferredProviderRaw = normalizeOptionalString(params.preferredProvider);
	const preferredProvider = preferredProviderRaw ? normalizeProviderId(preferredProviderRaw) : void 0;
	const resolved = resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const resolvedKey = modelKey(resolved.provider, resolved.model);
	const aliasIndex = buildModelAliasIndex({
		cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	const fallbackAliasIndex = resolved.provider === "openai" ? aliasIndex : buildModelAliasIndex({
		cfg,
		defaultProvider: resolved.provider
	});
	const fallbackKeys = resolveFallbackModelKeys({
		cfg,
		rawFallbacks: resolveAgentModelFallbackValues(cfg.agents?.defaults?.model),
		defaultProvider: resolved.provider,
		aliasIndex: fallbackAliasIndex
	});
	const initialSeeds = normalizeModelKeys([
		...existingKeys,
		resolvedKey,
		...fallbackKeys,
		...params.initialSelections ?? []
	]);
	const hasRealSeed = existingKeys.length > 0 || fallbackKeys.length > 0 || (params.initialSelections?.length ?? 0) > 0 || configuredRaw.length > 0;
	const hasAuth = createProviderAuthChecker({
		cfg,
		agentId: params.agentId,
		workspaceDir: params.workspaceDir,
		agentDir: pickerAgentDir,
		env: params.env
	});
	const resolveModelRouteRuntime = createModelRouteRuntimeResolver({
		config: cfg,
		env: params.env
	});
	const matchesPreferredProvider = preferredProvider ? createPreferredProviderMatcher({
		preferredProvider,
		cfg,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) : void 0;
	const loadCatalog = params.loadCatalog ?? true;
	const promptSelection = async (options, initialKeys, scopeKeys) => {
		if (options.length === 0) return {};
		const selected = normalizeModelKeys(await params.prompter.multiselect({
			message: params.message ?? t("wizard.model.allowlistPicker"),
			options,
			initialValues: initialKeys.length > 0 ? initialKeys : void 0,
			searchable: true
		}));
		if (selected.length === 0 && (scopeKeys || existingKeys.length > 0)) {
			if (!await params.prompter.confirm({
				message: t(scopeKeys ? "wizard.model.removeProviderModels" : "wizard.model.clearAllowlist"),
				initialValue: false
			})) return {};
		}
		return {
			models: selected,
			...scopeKeys ? { scopeKeys } : {}
		};
	};
	const scopedFastKeys = allowedKeys.length > 0 ? allowedKeys : !loadCatalog && preferredProvider && hasRealSeed ? initialSeeds.filter((key) => {
		const entry = splitModelKey(key);
		return entry ? matchesPreferredProvider?.(entry.provider) === true : false;
	}) : [];
	if (scopedFastKeys.length > 0) {
		const isVisibleProvider = createModelPickerVisibleProviderPredicate({
			config: cfg,
			env: params.env,
			includeSetupRegistry: true
		});
		const scopeKeys = allowedKeys.length > 0 ? allowedKeys : scopedFastKeys;
		const scopeKeySet = new Set(scopeKeys);
		const initialKeys = normalizeModelKeys(initialSeeds.filter((key) => scopeKeySet.has(key)));
		const options = [];
		const seen = /* @__PURE__ */ new Set();
		for (const key of scopeKeys) {
			const entry = splitModelKey(key);
			if (!entry) continue;
			await addModelSelectOption({
				entry,
				options,
				seen,
				aliasIndex,
				hasAuth,
				isVisibleProvider,
				resolveModelRouteRuntime,
				fallbackHint: allowedKeys.length > 0 ? t("wizard.model.allowed") : t("wizard.model.configured")
			});
		}
		return promptSelection(options, initialKeys, scopeKeys);
	}
	if (!loadCatalog) return {};
	const allowlistProgress = params.prompter.progress(t("wizard.model.loadingModels"));
	let catalogSnapshot;
	try {
		catalogSnapshot = (await loadPreparedModelCatalogView({
			kind: "picker",
			config: cfg,
			preferredProvider,
			preferLiveProviderCatalog: Boolean(preferredProvider),
			providerScoped: Boolean(preferredProvider && params.providerScopedCatalog),
			allowStaticFallbackCatalog: !params.providerScopedCatalog,
			includeConfiguredProvider: matchesPreferredProvider,
			agentDir: pickerAgentDir,
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
			...params.env !== void 0 ? { env: params.env } : {}
		})).snapshot;
	} finally {
		allowlistProgress.stop();
	}
	let catalog = catalogSnapshot.entries;
	catalog = await resolvePickerLogicalCatalog({
		cfg,
		catalog,
		routeVariants: catalogSnapshot.routeVariants,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: resolved,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		view: "all",
		hasAuth
	});
	if (catalog.length === 0) {
		const noCatalogInitialKeys = existingKeys.length > 0 ? normalizeModelKeys([...existingKeys, ...fallbackKeys]) : [];
		const parsed = (await params.prompter.text({
			message: params.message ?? t("wizard.model.allowlistText"),
			initialValue: noCatalogInitialKeys.join(", "),
			placeholder: "provider/model, other-provider/model"
		}) ?? "").split(",").map((value) => value.trim()).filter((value) => value.length > 0);
		if (parsed.length === 0) return {};
		return { models: normalizeModelKeys(parsed) };
	}
	const literalPrefixProviders = await resolveLiteralPrefixProviderIds({
		cfg,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const isVisibleProvider = createModelPickerVisibleProviderPredicate({
		config: cfg,
		env: params.env,
		includeSetupRegistry: true
	});
	const isVisibleModelRef = (ref) => {
		const separatorIndex = ref.indexOf("/");
		return separatorIndex <= 0 || isVisibleProvider(ref.slice(0, separatorIndex));
	};
	const options = [];
	const seen = /* @__PURE__ */ new Set();
	const allowedCatalog = catalog.filter((entry) => isVisibleProvider(entry.provider));
	const filteredCatalog = preferredProvider && allowedCatalog.some((entry) => matchesPreferredProvider?.(entry.provider)) ? allowedCatalog.filter((entry) => matchesPreferredProvider?.(entry.provider)) : allowedCatalog;
	const scopedConfiguredKeys = preferredProvider ? existingKeys.filter((key) => {
		if (!isVisibleModelRef(key)) return false;
		const entry = splitModelKey(key);
		return entry ? matchesPreferredProvider?.(entry.provider) === true : false;
	}) : [];
	const scopeKeys = preferredProvider ? normalizeModelKeys([...filteredCatalog.map((entry) => modelKey(entry.provider, entry.id)), ...scopedConfiguredKeys]) : void 0;
	const scopeKeySet = scopeKeys ? new Set(scopeKeys) : null;
	const initialKeys = (scopeKeySet ? initialSeeds.filter((key) => scopeKeySet.has(key)) : initialSeeds).filter(isVisibleModelRef);
	for (const entry of filteredCatalog) await addModelSelectOption({
		entry,
		options,
		seen,
		aliasIndex,
		hasAuth,
		literalPrefixProviders,
		isVisibleProvider,
		resolveModelRouteRuntime
	});
	for (const key of initialKeys) {
		if (seen.has(key)) continue;
		options.push({
			value: key,
			label: key,
			hint: t("wizard.model.configuredNotInCatalog")
		});
		seen.add(key);
	}
	return promptSelection(options, initialKeys, scopeKeys);
}
function applyModelAllowlist(cfg, models, opts = {}) {
	const defaults = cfg.agents?.defaults;
	const normalized = normalizeModelKeys(models);
	const scopeKeys = opts.scopeKeys ? normalizeModelKeys(opts.scopeKeys) : [];
	const scopeKeySet = scopeKeys.length > 0 ? new Set(scopeKeys) : null;
	const existingModels = normalizeAgentModelMapForConfig(defaults?.models ?? {});
	const legacyAllow = computeModelPolicyAllowlist({
		root: cfg,
		defaults
	});
	const existingAllow = normalizeModelKeys(defaults?.modelPolicy?.allow ?? legacyAllow ?? []);
	const scopeProviders = new Set(scopeKeys.map((key) => normalizeProviderId(key.slice(0, key.indexOf("/")))));
	const aliasIndex = buildModelAliasIndex({
		cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	const isPolicyRefInScope = (raw) => {
		const trimmed = raw.trim();
		if (trimmed.endsWith("/*")) return scopeProviders.has(normalizeProviderId(trimmed.slice(0, -2)));
		const resolved = resolveModelRefFromString({
			cfg,
			raw: trimmed,
			defaultProvider: DEFAULT_PROVIDER,
			aliasIndex
		});
		return Boolean(resolved && scopeKeySet?.has(modelKey(resolved.ref.provider, resolved.ref.model)));
	};
	const nextDefaults = { ...defaults };
	if (normalized.length === 0) {
		if (!defaults || !defaults.modelPolicy && !legacyAllow) return cfg;
		const nextAllow = scopeKeySet ? existingAllow.filter((key) => !isPolicyRefInScope(key)) : [];
		if (nextAllow.length > 0 || legacyAllow) nextDefaults.modelPolicy = {
			...defaults.modelPolicy,
			allow: nextAllow
		};
		else delete nextDefaults.modelPolicy;
	} else {
		const nextModels = { ...existingModels };
		for (const key of normalized) nextModels[key] = existingModels[key] ?? {};
		let nextAllow = normalized;
		if (scopeKeySet) {
			nextAllow = existingAllow.filter((key) => !isPolicyRefInScope(key));
			for (const key of normalized) if (!nextAllow.includes(key)) nextAllow.push(key);
		}
		nextDefaults.models = nextModels;
		nextDefaults.modelPolicy = {
			...defaults?.modelPolicy,
			allow: nextAllow
		};
	}
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: nextDefaults
		}
	};
}
function applyModelFallbacksFromSelection(cfg, selection, opts = {}) {
	const normalized = normalizeModelKeys(selection);
	const scopeKeys = opts.scopeKeys ? normalizeModelKeys(opts.scopeKeys) : [];
	const scopeKeySet = scopeKeys.length > 0 ? new Set(scopeKeys) : null;
	if (normalized.length === 0 && !scopeKeySet) return cfg;
	const resolved = resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const resolvedKey = modelKey(resolved.provider, resolved.model);
	const includesResolvedPrimary = normalized.includes(resolvedKey);
	if (!includesResolvedPrimary && !scopeKeySet) return cfg;
	const defaults = cfg.agents?.defaults;
	const existingModel = defaults?.model;
	const existingPrimary = typeof existingModel === "string" ? existingModel : existingModel && typeof existingModel === "object" ? existingModel.primary : void 0;
	const normalizedExistingPrimary = existingPrimary != null ? normalizeAgentModelRefForConfig(existingPrimary) : void 0;
	const preservedModelFields = existingModel && typeof existingModel === "object" ? (({ fallbacks: _oldFallbacks, ...rest }) => rest)(existingModel) : {};
	const aliasIndex = buildModelAliasIndex({
		cfg,
		defaultProvider: resolved.provider
	});
	const existingFallbacks = resolveFallbackModelKeys({
		cfg,
		rawFallbacks: resolveAgentModelFallbackValues(existingModel),
		defaultProvider: resolved.provider,
		aliasIndex
	});
	const existingFallbackSet = new Set(existingFallbacks);
	const rawSelectedFallbacks = normalized.filter((key) => key !== resolvedKey);
	const selectedFallbacks = scopeKeySet && !includesResolvedPrimary ? rawSelectedFallbacks.filter((key) => existingFallbackSet.has(key)) : rawSelectedFallbacks;
	const isVisibleProvider = createModelPickerVisibleProviderPredicate({
		config: cfg,
		includeSetupRegistry: true
	});
	const isVisibleModelRef = (ref) => {
		const separatorIndex = ref.indexOf("/");
		return separatorIndex <= 0 || isVisibleProvider(ref.slice(0, separatorIndex));
	};
	const fallbacks = mergeFallbackSelection({
		existingFallbacks,
		selectedFallbacks,
		preserveExistingFallback: scopeKeySet ? (fallback) => !scopeKeySet.has(fallback) : (fallback) => !isVisibleModelRef(fallback)
	});
	const nextModel = {
		...preservedModelFields,
		...normalizedExistingPrimary != null ? { primary: normalizedExistingPrimary } : {},
		...fallbacks.length > 0 ? { fallbacks } : {}
	};
	if (Object.keys(nextModel).length === 0) {
		if (!defaults || !Object.hasOwn(defaults, "model")) return cfg;
		const { model: _ignoredModel, ...restDefaults } = defaults;
		return {
			...cfg,
			agents: {
				...cfg.agents,
				defaults: restDefaults
			}
		};
	}
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...defaults,
				model: nextModel
			}
		}
	};
}
function mergeFallbackSelection(params) {
	const selected = new Set(params.selectedFallbacks);
	const fallbacks = [];
	for (const fallback of params.existingFallbacks) {
		if (params.preserveExistingFallback(fallback)) {
			fallbacks.push(fallback);
			continue;
		}
		if (selected.delete(fallback)) fallbacks.push(fallback);
	}
	for (const fallback of params.selectedFallbacks) if (selected.has(fallback)) fallbacks.push(fallback);
	return fallbacks;
}
//#endregion
export { promptModelAllowlist as i, applyModelFallbacksFromSelection as n, promptDefaultModel as r, applyModelAllowlist as t };
