import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { u as isUnresolvedSecretInputError } from "./types.secrets-DsPRn9Dz.mjs";
import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-C1yPL1Zl.mjs";
import "./generation-scope-BNE7YdYW.mjs";
import { r as isProviderCatalogSourceAllowed } from "./provider-config-owner-2NQ6j_Jm.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-Cov0065J.mjs";
import { r as resolveNonEnvSecretRefApiKeyMarker } from "./provider-credential-values-Cf7LMsFg.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
import { f as resolveOwningPluginIdsForProviderRef } from "./providers-DQUFJKZx.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCCJ_Oe.mjs";
import { c as runProviderStaticCatalog, i as prepareProviderStaticCatalog, n as normalizePluginDiscoveryResult, o as resolveRuntimePluginDiscoveryProviders, s as runProviderCatalog, t as groupPluginDiscoveryProvidersByOrder } from "./provider-discovery-BkPgLJBP.mjs";
import { g as prepareProviderExternalAuthWithPlugin } from "./provider-runtime-BMdc4CgR.mjs";
import { n as resolveManifestSyntheticAuthProviderRefState } from "./synthetic-auth.runtime.js";
import { r as mergeProviderModels } from "./models-config.merge-M6U_2rg_.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-ByP944Cg.mjs";
import { i as withProviderCatalogExpiry, r as recordProviderCatalogModels } from "./provider-catalog-expiry-BajE8fJo.mjs";
import { i as reportProviderCatalogSecretFailure, r as prepareProviderCatalogRun, t as buildPluginCatalogConfig } from "./models-config.providers.catalog-context-B3ZOKc1F.mjs";
import { c as resolveMissingProviderApiKey } from "./models-config.providers.secret-helpers-Dr-x8G9F.mjs";
import { r as createProviderAuthResolver, t as createProviderApiKeyResolver } from "./models-config.providers.secrets-DljsvGSX.mjs";
//#region src/agents/models-config.providers.discovery-scope.ts
/** Resolves the plugin-owned provider scope for configured and live catalog discovery. */
function resolveProviderDiscoveryScope(params) {
	const { config, workspaceDir, env } = params;
	const scopedProviderIds = params.providerIds !== void 0 ? normalizeStringEntries([...params.providerIds]).map(normalizeProviderId).filter(Boolean) : void 0;
	if (scopedProviderIds) return buildProviderDiscoveryScope({
		providerIds: scopedProviderIds,
		config,
		workspaceDir,
		env,
		resolveOwners: params.resolveOwners
	});
	if (!(env.OPENCLAW_LIVE_TEST === "1" || env.OPENCLAW_LIVE_GATEWAY === "1" || env.LIVE === "1")) return;
	const rawValues = [env.OPENCLAW_LIVE_PROVIDERS?.trim(), env.OPENCLAW_LIVE_GATEWAY_PROVIDERS?.trim()].filter((value) => Boolean(value && value !== "all"));
	if (rawValues.length === 0) return;
	const ids = normalizeStringEntries(rawValues.flatMap((value) => value.split(","))).map(normalizeProviderId).filter(Boolean);
	if (ids.length === 0) return;
	return buildProviderDiscoveryScope({
		providerIds: ids,
		config,
		workspaceDir,
		env,
		resolveOwners: params.resolveOwners
	});
}
function buildProviderDiscoveryScope(params) {
	const providerIds = [...new Set(params.providerIds)];
	const providerIdsByPluginId = /* @__PURE__ */ new Map();
	for (const id of providerIds) {
		const owners = params.resolveOwners?.(id) ?? resolveOwningPluginIdsForProviderRef({
			provider: id,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env
		}) ?? [];
		for (const pluginId of owners.length > 0 ? owners : [id]) {
			const ownedProviderIds = providerIdsByPluginId.get(pluginId) ?? [];
			if (!ownedProviderIds.includes(id)) {
				ownedProviderIds.push(id);
				providerIdsByPluginId.set(pluginId, ownedProviderIds);
			}
		}
	}
	return new Map([...providerIdsByPluginId.entries()].toSorted(([left], [right]) => left.localeCompare(right)));
}
function resolvePluginMetadataProviderOwners(pluginMetadataSnapshot, provider) {
	if (!pluginMetadataSnapshot) return;
	const normalizedProvider = normalizeProviderId(provider);
	if (!normalizedProvider) return;
	const owners = /* @__PURE__ */ new Set();
	for (const ownerMap of [
		pluginMetadataSnapshot.owners.providers,
		pluginMetadataSnapshot.owners.modelCatalogProviders,
		pluginMetadataSnapshot.owners.setupProviders,
		pluginMetadataSnapshot.owners.cliBackends
	]) {
		if (!ownerMap) continue;
		for (const [ownedId, pluginIds] of ownerMap) if (normalizeProviderId(ownedId) === normalizedProvider) for (const pluginId of pluginIds) owners.add(pluginId);
	}
	return owners.size > 0 ? [...owners].toSorted((left, right) => left.localeCompare(right)) : void 0;
}
function resolveImplicitProviderDiscoveryScope(params) {
	return resolveProviderDiscoveryScope({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env,
		resolveOwners: params.pluginMetadataSnapshot ? (provider) => resolvePluginMetadataProviderOwners(params.pluginMetadataSnapshot, provider) : void 0,
		providerIds: params.providerDiscoveryProviderIds
	});
}
//#endregion
//#region src/agents/models-config.providers.implicit.ts
/**
* Discovers implicit model-provider config from plugin provider catalogs and
* static catalogs. It merges discovered provider models with explicit config
* while preserving user-controlled provider fields.
*/
const log = createSubsystemLogger("agents/model-providers");
const PLUGIN_DISCOVERY_ORDERS = [
	"simple",
	"profile",
	"paired",
	"late"
];
function resolveLiveProviderCatalogTimeoutMs(env) {
	if (!(env.OPENCLAW_LIVE_TEST === "1" || env.OPENCLAW_LIVE_GATEWAY === "1" || env.LIVE === "1")) return null;
	const raw = env.OPENCLAW_LIVE_PROVIDER_DISCOVERY_TIMEOUT_MS?.trim();
	if (!raw) return 15e3;
	const parsed = Number(raw);
	return /^[+]?\d+$/.test(raw) && Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 15e3;
}
function mergeImplicitProviderConfig(params) {
	const { providerId, existing, implicit } = params;
	if (!existing || providerId === "ollama") return implicit;
	return mergeProviderModels(implicit, existing, {
		providerId,
		sourceModelFields: params.sourceModelFields
	});
}
function resolveExistingImplicitProviderFromContext(params) {
	for (const configuredProviders of [params.ctx.explicitProviders, params.ctx.config?.models?.providers]) for (const providerId of params.providerIds) {
		const configured = findNormalizedProviderValue(configuredProviders ?? void 0, providerId);
		if (configured) return configured;
	}
}
function hasRuntimeProviderCatalog(provider) {
	return typeof provider.catalog?.run === "function";
}
async function resolvePluginImplicitProviders(ctx, providers, order, preparedStaticConfigs) {
	const byOrder = groupPluginDiscoveryProvidersByOrder(providers);
	const discovered = {};
	const selectedProviderIds = ctx.providerDiscoveryScope ? new Set([...ctx.providerDiscoveryScope.values()].flat()) : void 0;
	const catalogCountsByPluginId = /* @__PURE__ */ new Map();
	for (const provider of providers) {
		if (!provider.catalog && !provider.staticCatalog) continue;
		const pluginId = provider.pluginId ?? normalizeProviderId(provider.id);
		catalogCountsByPluginId.set(pluginId, (catalogCountsByPluginId.get(pluginId) ?? 0) + 1);
	}
	for (const provider of byOrder[order]) {
		const pluginId = provider.pluginId ?? normalizeProviderId(provider.id);
		const ownerProviderIds = ctx.providerDiscoveryScope?.get(pluginId);
		const manifest = ctx.pluginMetadataSnapshot?.manifestRegistry.plugins.find((plugin) => plugin.id === pluginId);
		const includeProvider = (providerId) => isProviderCatalogSourceAllowed({
			provider: providerId,
			config: ctx.config,
			plugin: manifest
		});
		const providerIds = (ctx.providerDiscoveryScope === void 0 ? void 0 : catalogCountsByPluginId.get(pluginId) === 1 ? ownerProviderIds ?? [] : (ownerProviderIds ?? []).filter((id) => matchesProviderPluginRef(provider, id)))?.filter(includeProvider);
		const catalogProviderRefs = [
			provider.id,
			...provider.aliases ?? [],
			...provider.hookAliases ?? [],
			...catalogCountsByPluginId.get(pluginId) === 1 ? manifest?.providers ?? [] : []
		];
		if (providerIds?.length === 0 || providerIds === void 0 && !catalogProviderRefs.some(includeProvider)) continue;
		const catalogConfig = buildPluginCatalogConfig(ctx, provider);
		const resolveCatalogProviderApiKey = (providerId) => {
			const resolvedProviderId = providerId?.trim() || provider.id;
			const resolved = ctx.resolveProviderApiKey(resolvedProviderId);
			if (resolved.apiKey) return resolved;
			if (!findNormalizedProviderValue({
				[provider.id]: true,
				...Object.fromEntries((provider.aliases ?? []).map((alias) => [alias, true])),
				...Object.fromEntries((provider.hookAliases ?? []).map((alias) => [alias, true]))
			}, resolvedProviderId)) return resolved;
			const syntheticApiKey = (provider.resolveSyntheticAuth?.({
				config: catalogConfig,
				provider: resolvedProviderId,
				providerConfig: catalogConfig.models?.providers?.[resolvedProviderId]
			}))?.apiKey?.trim();
			if (!syntheticApiKey) return resolved;
			return {
				apiKey: isNonSecretApiKeyMarker(syntheticApiKey) ? syntheticApiKey : resolveNonEnvSecretRefApiKeyMarker("file"),
				discoveryApiKey: void 0
			};
		};
		if (ctx.providerDiscoveryEntriesOnly === true && !provider.staticCatalog) continue;
		const useStaticCatalog = Boolean(provider.staticCatalog) && (ctx.providerDiscoveryEntriesOnly === true || !hasRuntimeProviderCatalog(provider));
		const preparedStatic = preparedStaticConfigs?.get(`${provider.pluginId ?? ""}\0${normalizeProviderId(provider.id)}`);
		let acceptedRuntimeCatalog = false;
		const normalizedResult = await withProviderCatalogExpiry(async () => {
			let result;
			if (!useStaticCatalog) {
				result = await runProviderCatalogWithTimeout({
					provider,
					normalizeProviderForScope: ctx.normalizeProviderForScope,
					authStore: ctx.authStore,
					...providerIds !== void 0 ? { providerIds } : {},
					config: catalogConfig,
					agentDir: ctx.agentDir,
					workspaceDir: ctx.workspaceDir,
					env: ctx.env,
					resolveProviderApiKey: resolveCatalogProviderApiKey,
					resolveProviderAuth: (providerId, options) => ctx.resolveProviderAuth(providerId?.trim() || provider.id, options),
					reportCatalogOutcome: ctx.onProviderCatalogOutcome,
					timeoutMs: ctx.providerDiscoveryTimeoutMs ?? resolveLiveProviderCatalogTimeoutMs(ctx.env)
				});
				acceptedRuntimeCatalog = Boolean(result);
			}
			if (useStaticCatalog || !result && provider.staticCatalog) {
				if (preparedStatic) return preparedStatic;
				result = await runProviderStaticCatalog({ provider });
			}
			return result ? normalizePluginDiscoveryResult({
				provider,
				result
			}) : void 0;
		}, (acceptedProviders) => Object.keys(acceptedProviders ?? {}));
		if (!normalizedResult) continue;
		for (const [providerId, implicitProvider] of Object.entries(normalizedResult)) {
			if (!includeProvider(providerId) || selectedProviderIds && !selectedProviderIds.has(normalizeProviderId(providerId))) continue;
			if (acceptedRuntimeCatalog) recordProviderCatalogModels(providerId, implicitProvider.models.map(({ id }) => id));
			const mergedProvider = mergeImplicitProviderConfig({
				providerId,
				existing: discovered[providerId] ?? resolveExistingImplicitProviderFromContext({
					ctx,
					providerIds: [
						providerId,
						provider.id,
						...provider.aliases ?? [],
						...provider.hookAliases ?? []
					]
				}),
				implicit: implicitProvider,
				sourceModelFields: ctx.sourceModelFields
			});
			discovered[providerId] = resolveMissingProviderApiKey({
				providerKey: providerId,
				provider: mergedProvider,
				env: ctx.env,
				profileApiKey: void 0
			});
		}
	}
	return Object.keys(discovered).length > 0 ? discovered : void 0;
}
async function runProviderCatalogWithTimeout(params) {
	const timeoutMs = params.timeoutMs ?? void 0;
	let active = true;
	const catalogParams = {
		...params,
		isActive: () => active && params.isActive?.() !== false,
		reportCatalogOutcome: (outcome) => {
			if (active && params.isActive?.() !== false) params.reportCatalogOutcome?.(outcome);
		}
	};
	const runCatalog = async () => {
		const prepared = await prepareProviderCatalogRun(catalogParams);
		if (!active) return;
		const result = await runProviderCatalog({
			...prepared,
			isActive: catalogParams.isActive
		});
		if (!active) return;
		return prepared.finalizeCatalogResult ? prepared.finalizeCatalogResult(result) : result;
	};
	try {
		if (!timeoutMs) return await runCatalog();
		const catalogRun = runCatalog();
		return await raceWithTimeout(catalogRun, timeoutMs, () => {
			active = false;
			throw new Error(`provider catalog timed out after ${timeoutMs}ms: ${params.provider.id}`);
		}, { ref: false });
	} catch (error) {
		if (isUnresolvedSecretInputError(error)) throw error;
		if (await reportProviderCatalogSecretFailure(error, params)) return;
		for (const provider of params.providerIds ?? [params.provider.id]) params.reportCatalogOutcome?.({
			provider,
			status: "unavailable"
		});
		log.warn(`${formatErrorMessage(error)}; skipping provider discovery`);
		return;
	} finally {
		active = false;
	}
}
/** Prepares sterile provider catalog results for one workspace/config generation. */
async function prepareImplicitProviderStaticCatalog(params) {
	params.signal?.throwIfAborted();
	const env = params.env ?? process.env;
	const discoveryScope = resolveImplicitProviderDiscoveryScope(params);
	const providers = await resolveRuntimePluginDiscoveryProviders({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		onlyPluginIds: discoveryScope ? [...discoveryScope.keys()] : void 0,
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {},
		discoveryEntriesOnly: !getPluginRuntimeGenerationRegistry(),
		includeSyntheticAuthProviders: true
	});
	const staticCatalogProviderIds = params.staticCatalogProviderIds ? new Set(params.staticCatalogProviderIds.map((provider) => normalizeProviderId(provider))) : void 0;
	const eligibleProviders = providers.filter((provider) => {
		const pluginId = provider.pluginId ?? normalizeProviderId(provider.id);
		const plugin = params.pluginMetadataSnapshot?.manifestRegistry.plugins.find((candidate) => candidate.id === pluginId);
		const soleStaticCatalog = providers.filter((candidate) => (candidate.pluginId ?? normalizeProviderId(candidate.id)) === pluginId && candidate.staticCatalog).length === 1;
		return (discoveryScope?.get(pluginId) ?? [
			provider.id,
			...provider.aliases ?? [],
			...provider.hookAliases ?? [],
			...soleStaticCatalog ? plugin?.providers ?? [] : []
		]).some((providerRef) => (soleStaticCatalog || matchesProviderPluginRef(provider, providerRef)) && isProviderCatalogSourceAllowed({
			provider: providerRef,
			config: params.config,
			plugin
		}));
	});
	const prepared = await prepareProviderStaticCatalog({
		signal: params.signal,
		providers: staticCatalogProviderIds ? eligibleProviders.filter((provider) => {
			if ([...staticCatalogProviderIds].some((id) => matchesProviderPluginRef(provider, id))) return true;
			return (provider.pluginId ? discoveryScope?.get(provider.pluginId) : void 0)?.some((id) => staticCatalogProviderIds.has(id)) === true && providers.filter((candidate) => candidate.pluginId === provider.pluginId && candidate.staticCatalog).length === 1;
		}) : eligibleProviders
	});
	return Object.freeze({
		providers: Object.freeze(providers),
		entries: Object.freeze([...prepared.entries.map((entry) => {
			const plugin = params.pluginMetadataSnapshot?.manifestRegistry.plugins.find((candidate) => candidate.id === (entry.provider.pluginId ?? entry.provider.id));
			const providerEntries = Object.entries(entry.providerConfigs);
			const eligible = providerEntries.filter(([provider]) => isProviderCatalogSourceAllowed({
				provider,
				config: params.config,
				plugin
			}));
			if (eligible.length === providerEntries.length) return entry;
			const providerConfigs = Object.fromEntries(eligible);
			return {
				provider: entry.provider,
				providerConfigs
			};
		}), ...providers.filter((provider) => provider.staticCatalog && !eligibleProviders.includes(provider)).map((provider) => ({
			provider,
			providerConfigs: {}
		}))])
	});
}
/** Resolve all implicit provider configs contributed by runtime plugin discovery. */
async function resolveImplicitProviders(params) {
	const providers = {};
	const env = params.env ?? process.env;
	let authStore = params.authStore;
	const getAuthStore = () => authStore ??= ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		externalCliProviderIds: params.providerDiscoveryProviderIds
	});
	const discoveryScope = resolveImplicitProviderDiscoveryScope(params);
	const discoveryPluginIds = discoveryScope ? [...discoveryScope.keys()] : void 0;
	const discoveryAuthConfig = params.discoveryAuthConfig ?? params.config;
	const discoveryAuthEnv = params.discoveryAuthEnv ?? env;
	const authInputs = [
		env,
		getAuthStore,
		discoveryAuthConfig,
		params.providerDiscoveryEntriesOnly ? void 0 : params.sourceConfigForSecrets ?? params.config,
		params.workspaceDir,
		discoveryAuthEnv
	];
	const metadata = params.pluginMetadataSnapshot;
	const context = {
		...params,
		normalizeProviderForScope: discoveryScope && metadata ? createPreparedModelCatalogProviderNormalizer({
			...metadata,
			plugins: metadata.manifestRegistry.plugins
		}, params.config ?? {}, env) : normalizeProviderId,
		get authStore() {
			return getAuthStore();
		},
		env,
		...discoveryScope ? { providerDiscoveryScope: discoveryScope } : {},
		resolveProviderApiKey: createProviderApiKeyResolver(...authInputs),
		resolveProviderAuth: createProviderAuthResolver(...authInputs)
	};
	const preparedStaticEntries = params.preparedStaticProviderCatalog ? params.preparedStaticProviderCatalog.entries.filter(({ provider }) => discoveryPluginIds === void 0 || provider.pluginId !== void 0 && discoveryPluginIds.includes(provider.pluginId)) : void 0;
	const preparedProviders = params.providerDiscoveryEntriesOnly === true && params.preparedStaticProviderCatalog?.providers ? params.preparedStaticProviderCatalog.providers.filter((provider) => discoveryPluginIds === void 0 || provider.pluginId !== void 0 && discoveryPluginIds.includes(provider.pluginId)) : [];
	const preparedPluginIds = new Set(preparedProviders.flatMap((provider) => provider.pluginId ? [provider.pluginId] : []));
	const missingDiscoveryPluginIds = discoveryPluginIds?.filter((pluginId) => !preparedPluginIds.has(pluginId)) ?? (preparedProviders.length > 0 ? void 0 : discoveryPluginIds);
	const resolvedProviders = missingDiscoveryPluginIds === void 0 || missingDiscoveryPluginIds.length > 0 ? await resolveRuntimePluginDiscoveryProviders({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		onlyPluginIds: missingDiscoveryPluginIds,
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {},
		...params.providerDiscoveryEntriesOnly === true ? { discoveryEntriesOnly: true } : {}
	}) : [];
	const discoveryProviders = [...new Map([...resolvedProviders, ...preparedProviders].map((provider) => [`${provider.pluginId ?? ""}\0${normalizeProviderId(provider.id)}`, provider])).values()];
	const syntheticRefs = resolveManifestSyntheticAuthProviderRefState({
		config: discoveryAuthConfig,
		env,
		workspaceDir: params.workspaceDir,
		...params.pluginMetadataSnapshot ? { index: params.pluginMetadataSnapshot.index } : {}
	}).refs.map(normalizeProviderId);
	const syntheticProviders = discoveryProviders.filter((provider) => syntheticRefs.some((ref) => matchesProviderPluginRef(provider, ref)));
	const configuredSyntheticRefs = Object.entries(discoveryAuthConfig?.models?.providers ?? {}).flatMap(([provider, { api }]) => api && (syntheticRefs.includes(normalizeProviderId(api)) || syntheticProviders.some((candidate) => matchesProviderPluginRef(candidate, api))) ? [normalizeProviderId(provider)] : []);
	const scopedRefs = discoveryScope ? new Set([...discoveryScope.values()].flat()) : void 0;
	for (const provider of /* @__PURE__ */ new Set([...syntheticRefs, ...configuredSyntheticRefs])) {
		if (scopedRefs && !scopedRefs.has(provider)) continue;
		await prepareProviderExternalAuthWithPlugin({
			config: discoveryAuthConfig,
			env: discoveryAuthEnv,
			workspaceDir: params.workspaceDir,
			provider,
			context: {
				config: discoveryAuthConfig,
				provider,
				providerConfig: findNormalizedProviderValue(discoveryAuthConfig?.models?.providers, provider)
			}
		});
	}
	const hasLiveCatalog = discoveryProviders.some(hasRuntimeProviderCatalog);
	if (params.providerDiscoveryEntriesOnly !== true && hasLiveCatalog) {
		const { prepareProviderDiscoveryAuth } = await import("./models-config.providers.discovery-auth.runtime.js");
		Object.assign(context, await prepareProviderDiscoveryAuth(context, discoveryAuthConfig));
	}
	const preparedStaticConfigs = new Map(preparedStaticEntries?.map(({ provider, providerConfigs }) => [`${provider.pluginId ?? ""}\0${normalizeProviderId(provider.id)}`, providerConfigs]) ?? []);
	for (const order of PLUGIN_DISCOVERY_ORDERS) Object.assign(providers, await resolvePluginImplicitProviders(context, discoveryProviders, order, preparedStaticConfigs));
	return providers;
}
//#endregion
export { resolveImplicitProviderDiscoveryScope as i, resolveImplicitProviders as n, runProviderCatalogWithTimeout as r, prepareImplicitProviderStaticCatalog as t };
