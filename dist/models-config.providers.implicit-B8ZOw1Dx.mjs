import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { u as isUnresolvedSecretInputError } from "./types.secrets-Dgbd2kyP.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-BWMrcMOM.mjs";
import "./generation-scope-CwTBwQp1.mjs";
import { r as isProviderCatalogSourceAllowed } from "./provider-config-owner-xL-mNZoa.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-Cov0065J.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "./model-catalog-provider-normalizer-C4C-simP.mjs";
import { r as resolveNonEnvSecretRefApiKeyMarker } from "./provider-credential-values-Cf7LMsFg.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { r as mergeProviderModels } from "./models-config.merge-C-G9Ur64.mjs";
import { f as resolveOwningPluginIdsForProviderRef } from "./providers-3h1HIigh.mjs";
import { i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { c as runProviderStaticCatalog, i as prepareProviderStaticCatalog, n as normalizePluginDiscoveryResult, o as resolveRuntimePluginDiscoveryProviders, s as runProviderCatalog, t as groupPluginDiscoveryProvidersByOrder } from "./provider-discovery-VU-K7aKK.mjs";
import { h as prepareProviderExternalAuthWithPlugin } from "./provider-runtime-DZ8luukj.mjs";
import { n as resolveManifestSyntheticAuthProviderRefState } from "./synthetic-auth.runtime.js";
import { a as recordProviderCatalogModels, o as withProviderCatalogDiscoveryBudget, s as withProviderCatalogExpiry } from "./provider-catalog-expiry-DuDh5VRN.mjs";
import { i as reportProviderCatalogSecretFailure, r as prepareProviderCatalogRun, t as buildPluginCatalogConfig } from "./models-config.providers.catalog-context-NPS21T70.mjs";
import { c as resolveMissingProviderApiKey } from "./models-config.providers.secret-helpers-_SdvipSt.mjs";
import { r as createProviderAuthResolver, t as createProviderApiKeyResolver } from "./models-config.providers.secrets-C6qa6FIu.mjs";
//#region src/agents/models-config.providers.discovery-scope.ts
/** Resolves the plugin-owned provider scope for configured and live catalog discovery. */
function resolveImplicitProviderDiscoveryScope(params) {
	const { config, workspaceDir, pluginMetadataSnapshot } = params;
	const env = params.env ?? process.env;
	let providerIds;
	if (params.providerDiscoveryProviderIds !== void 0) providerIds = normalizeStringEntries([...params.providerDiscoveryProviderIds]).map(normalizeProviderId).filter(Boolean);
	else {
		if (!(env.OPENCLAW_LIVE_TEST === "1" || env.OPENCLAW_LIVE_GATEWAY === "1" || env.LIVE === "1")) return;
		const rawValues = [env.OPENCLAW_LIVE_PROVIDERS?.trim(), env.OPENCLAW_LIVE_GATEWAY_PROVIDERS?.trim()].filter((value) => Boolean(value && value !== "all"));
		if (rawValues.length === 0) return;
		providerIds = normalizeStringEntries(rawValues.flatMap((value) => value.split(","))).map(normalizeProviderId).filter(Boolean);
		if (providerIds.length === 0) return;
	}
	const providerIdsByPluginId = /* @__PURE__ */ new Map();
	for (const id of new Set(providerIds)) {
		const metadataOwners = /* @__PURE__ */ new Set();
		if (pluginMetadataSnapshot) for (const ownerMap of [
			pluginMetadataSnapshot.owners.providers,
			pluginMetadataSnapshot.owners.modelCatalogProviders,
			pluginMetadataSnapshot.owners.setupProviders,
			pluginMetadataSnapshot.owners.cliBackends
		]) {
			if (!ownerMap) continue;
			for (const [ownedId, pluginIds] of ownerMap) if (normalizeProviderId(ownedId) === id) for (const pluginId of pluginIds) metadataOwners.add(pluginId);
		}
		const owners = metadataOwners.size > 0 ? [...metadataOwners].toSorted((left, right) => left.localeCompare(right)) : resolveOwningPluginIdsForProviderRef({
			provider: id,
			config,
			workspaceDir,
			env
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
//#endregion
//#region src/agents/models-config.providers.implicit.ts
/**
* Discovers implicit model-provider config from plugin provider catalogs and
* static catalogs. It merges discovered provider models with explicit config
* while preserving user-controlled provider fields.
*/
const log = createSubsystemLogger("agents/model-providers");
function resolveLiveProviderCatalogTimeoutMs(env) {
	if (!(env.OPENCLAW_LIVE_TEST === "1" || env.OPENCLAW_LIVE_GATEWAY === "1" || env.LIVE === "1")) return null;
	const raw = env.OPENCLAW_LIVE_PROVIDER_DISCOVERY_TIMEOUT_MS?.trim();
	if (!raw) return 15e3;
	const parsed = Number(raw);
	return /^[+]?\d+$/.test(raw) && Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 15e3;
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
async function resolvePluginImplicitProviders(ctx, providers, preparedStaticConfigs) {
	const byOrder = groupPluginDiscoveryProvidersByOrder(providers);
	const merged = {};
	const selectedProviderIds = ctx.providerDiscoveryScope ? new Set([...ctx.providerDiscoveryScope.values()].flat()) : void 0;
	const catalogCountsByPluginId = /* @__PURE__ */ new Map();
	for (const provider of providers) {
		if (!provider.catalog && !provider.staticCatalog) continue;
		const pluginId = provider.pluginId ?? normalizeProviderId(provider.id);
		catalogCountsByPluginId.set(pluginId, (catalogCountsByPluginId.get(pluginId) ?? 0) + 1);
	}
	for (const group of Object.values(byOrder)) {
		const discovered = {};
		const { results, hasError, firstError } = await runTasksWithConcurrency({
			limit: 4,
			errorMode: "stop",
			tasks: group.map((provider) => async () => {
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
				if (providerIds?.length === 0 || providerIds === void 0 && !catalogProviderRefs.some(includeProvider)) return;
				const catalogConfig = buildPluginCatalogConfig(ctx, provider);
				const resolveCatalogProviderApiKey = (providerId) => {
					const resolvedProviderId = providerId?.trim() || provider.id;
					const resolved = ctx.resolveProviderApiKey(resolvedProviderId);
					if (resolved.apiKey) return resolved;
					if (!matchesProviderPluginRef(provider, resolvedProviderId)) return resolved;
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
				if (ctx.providerDiscoveryEntriesOnly === true && !provider.staticCatalog) return;
				const useStaticCatalog = Boolean(provider.staticCatalog) && (ctx.providerDiscoveryEntriesOnly === true || !hasRuntimeProviderCatalog(provider));
				const preparedStatic = preparedStaticConfigs?.get(`${provider.pluginId ?? ""}\0${normalizeProviderId(provider.id)}`);
				const outcomes = [];
				let acceptedRuntimeCatalog = false;
				return {
					provider,
					normalizedResult: await withProviderCatalogExpiry(async () => {
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
								reportCatalogOutcome: (outcome) => outcomes.push(outcome),
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
					}, (acceptedProviders) => Object.keys(acceptedProviders ?? {})),
					acceptedRuntimeCatalog,
					includeProvider,
					outcomes
				};
			})
		});
		if (hasError) throw firstError;
		for (const result of results) {
			if (!result) continue;
			const { provider, normalizedResult, acceptedRuntimeCatalog, includeProvider, outcomes } = result;
			for (const outcome of outcomes) ctx.onProviderCatalogOutcome?.(outcome);
			if (!normalizedResult) continue;
			for (const [providerId, implicitProvider] of Object.entries(normalizedResult)) {
				if (!includeProvider(providerId) || selectedProviderIds && !selectedProviderIds.has(normalizeProviderId(providerId))) continue;
				if (acceptedRuntimeCatalog) recordProviderCatalogModels(providerId, implicitProvider.models.map(({ id }) => id));
				const existing = discovered[providerId] ?? resolveExistingImplicitProviderFromContext({
					ctx,
					providerIds: [
						providerId,
						provider.id,
						...provider.aliases ?? [],
						...provider.hookAliases ?? []
					]
				});
				const mergedProvider = !existing || providerId === "ollama" ? implicitProvider : mergeProviderModels(implicitProvider, existing, {
					providerId,
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
		Object.assign(merged, discovered);
	}
	return merged;
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
		const catalogRun = withProviderCatalogDiscoveryBudget(timeoutMs, runCatalog);
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
		...staticCatalogProviderIds ? { providerIds: [...staticCatalogProviderIds] } : {},
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
	const env = params.env ?? process.env;
	const discoveryScope = resolveImplicitProviderDiscoveryScope(params);
	const discoveryPluginIds = discoveryScope ? [...discoveryScope.keys()] : void 0;
	const discoveryAuthConfig = params.discoveryAuthConfig ?? params.config;
	const discoveryAuthEnv = params.discoveryAuthEnv ?? env;
	const sourceConfigForSecrets = params.providerDiscoveryEntriesOnly ? void 0 : params.sourceConfigForSecrets ?? params.config;
	const inDiscoveryScope = (provider) => discoveryPluginIds === void 0 || provider.pluginId !== void 0 && discoveryPluginIds.includes(provider.pluginId);
	const preparedStaticEntries = params.preparedStaticProviderCatalog ? params.preparedStaticProviderCatalog.entries.filter(({ provider }) => inDiscoveryScope(provider)) : void 0;
	const preparedProviders = params.providerDiscoveryEntriesOnly === true && params.preparedStaticProviderCatalog?.providers ? params.preparedStaticProviderCatalog.providers.filter(inDiscoveryScope) : [];
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
	const authStore = params.authStore ?? (discoveryProviders.length > 0 ? await ensureAuthProfileStoreAsync(params.agentDir, {
		allowKeychainPrompt: false,
		externalCliProviderIds: params.providerDiscoveryProviderIds
	}) : {
		version: 1,
		profiles: {}
	});
	const authInputs = [
		env,
		authStore,
		discoveryAuthConfig,
		sourceConfigForSecrets,
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
		authStore,
		env,
		...discoveryScope ? { providerDiscoveryScope: discoveryScope } : {},
		resolveProviderApiKey: createProviderApiKeyResolver(...authInputs),
		resolveProviderAuth: createProviderAuthResolver(...authInputs)
	};
	const hasLiveCatalog = discoveryProviders.some(hasRuntimeProviderCatalog);
	if (params.providerDiscoveryEntriesOnly !== true && hasLiveCatalog) {
		const { prepareProviderDiscoveryAuth } = await import("./models-config.providers.discovery-auth.runtime.js");
		Object.assign(context, await prepareProviderDiscoveryAuth(context, discoveryAuthConfig));
	}
	return resolvePluginImplicitProviders(context, discoveryProviders, new Map(preparedStaticEntries?.map(({ provider, providerConfigs }) => [`${provider.pluginId ?? ""}\0${normalizeProviderId(provider.id)}`, providerConfigs]) ?? []));
}
//#endregion
export { resolveImplicitProviderDiscoveryScope as i, resolveImplicitProviders as n, runProviderCatalogWithTimeout as r, prepareImplicitProviderStaticCatalog as t };
