import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as resolveRegisteredAgentIdForDir } from "./agent-dir-registry-QuKJka9m.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-Mkqqbxs_.mjs";
import "./generation-scope-DkeaMJw8.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { n as isProviderCatalogSourceAllowed } from "./provider-config-owner-CewfXQTW.mjs";
import { d as isTrustedSecretSurfaceUnavailableError } from "./runtime-degraded-state-DVMYGogL.mjs";
import { a as buildOAuthRefreshFailureLoginCommand } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { r as matchesProviderPluginRef } from "./provider-registry-shared-CGngP_UC.mjs";
import { r as resolveNonEnvSecretRefApiKeyMarker } from "./provider-credential-values-DSE2VVU-.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { f as resolveOwningPluginIdsForProviderRef } from "./providers-Bx7WoFEI.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import { c as runProviderStaticCatalog, i as prepareProviderStaticCatalog, n as normalizePluginDiscoveryResult, o as resolveRuntimePluginDiscoveryProviders, s as runProviderCatalog, t as groupPluginDiscoveryProvidersByOrder } from "./provider-discovery-gl0uPs1A.mjs";
import { g as prepareProviderExternalAuthWithPlugin } from "./provider-runtime-DTb_RnE4.mjs";
import { n as resolveManifestSyntheticAuthProviderRefState } from "./synthetic-auth.runtime.js";
import { n as mergeProviderModels } from "./models-config.merge-Deg2vlWf.mjs";
import { r as withProviderCatalogExpiry } from "./provider-catalog-expiry-D85fDr1r.mjs";
import { c as resolveMissingProviderApiKey } from "./models-config.providers.secret-helpers-kIZAIANY.mjs";
import { r as createProviderAuthResolver, t as createProviderApiKeyResolver } from "./models-config.providers.secrets-BXv71Wnt.mjs";
//#region src/agents/models-config.providers.catalog-context.ts
const log$1 = createSubsystemLogger("agents/model-providers");
function buildPluginCatalogConfig(ctx, provider) {
	const providers = {
		...ctx.config?.models?.providers,
		...ctx.explicitProviders
	};
	if (Object.keys(providers).length === 0) return ctx.config ?? {};
	for (const [providerId, source] of Object.entries(providers)) {
		const runtime = findNormalizedProviderValue(ctx.discoveryAuthConfig?.models?.providers, providerId);
		if (runtime && matchesProviderPluginRef(provider, providerId)) providers[providerId] = {
			...source,
			headers: runtime.headers,
			request: runtime.request
		};
	}
	return {
		...ctx.config,
		models: {
			...ctx.config?.models,
			providers
		}
	};
}
async function prepareProviderCatalogRun(params) {
	const { authStore, isActive, ...catalogParams } = params;
	if (!params.provider.auth.some((method) => method.kind === "oauth" || method.kind === "device_code") || params.providerIds !== void 0 && !params.providerIds.some((providerId) => matchesProviderPluginRef(params.provider, providerId))) return catalogParams;
	const agentId = resolveRegisteredAgentIdForDir(params.agentDir, params.env);
	const { prepareProviderCatalogOAuthAuth } = await import("./models-config.providers.discovery-auth.runtime.js");
	const failedProfileIds = /* @__PURE__ */ new Set();
	const reportedOutcomes = [];
	const { resolveProviderAuth, failures } = await prepareProviderCatalogOAuthAuth({
		agentDir: params.agentDir,
		authStore,
		env: params.env,
		provider: params.provider.id,
		resolveProviderAuth: params.resolveProviderAuth,
		isActive,
		onPreparationFailure: (profileIds) => {
			for (const profileId of profileIds) failedProfileIds.add(profileId);
		}
	}, params.config);
	return {
		...catalogParams,
		reportCatalogOutcome: (outcome) => {
			reportedOutcomes.push({ ...outcome });
			params.reportCatalogOutcome?.(outcome);
		},
		resolveProviderAuth,
		finalizeCatalogResult: (result) => {
			if (failedProfileIds.size === 0 && failures.length === 0) return result;
			const providers = normalizePluginDiscoveryResult({
				provider: params.provider,
				result
			});
			const origins = [...new Set(Object.values(providers).flatMap(({ baseUrl }) => {
				const origin = URL.parse(baseUrl)?.origin;
				return origin ? [origin] : [];
			}))];
			const destination = origins.length ? `the live catalog returned ${origins.join(", ")}` : "no live provider catalog was returned";
			for (const failure of failures) {
				const login = buildOAuthRefreshFailureLoginCommand(params.provider.id, {
					profileId: failure.profileId,
					agentId
				});
				log$1.warn(`${params.provider.id}: OAuth profile ${JSON.stringify(failure.profileId)} could not be resolved (${failure.message}); ${destination}. Re-authenticate with ${login}.`);
			}
			if (failedProfileIds.size > 0) {
				const providersWithOutcomes = new Set(reportedOutcomes.map((outcome) => normalizeProviderId(outcome.provider)));
				const aliasContext = {
					config: params.config,
					env: params.env
				};
				const authProvider = resolveProviderIdForAuth(params.provider.id, aliasContext);
				for (const provider of params.providerIds ?? [params.provider.id]) {
					const normalized = normalizeProviderId(provider);
					if (resolveProviderIdForAuth(provider, aliasContext) !== authProvider || providers[normalized] || providersWithOutcomes.has(normalized)) continue;
					for (const profileId of failedProfileIds) {
						const outcome = {
							provider,
							profileId,
							status: "unavailable"
						};
						reportedOutcomes.push(outcome);
						params.reportCatalogOutcome?.(outcome);
					}
				}
			}
			return result ? {
				providers,
				outcomes: reportedOutcomes
			} : result;
		}
	};
}
async function reportProviderCatalogSecretFailure(error, params) {
	if (!isTrustedSecretSurfaceUnavailableError(error)) return false;
	const { resolveUnavailableDiscoveryAuthProfileId } = await import("./models-config.providers.discovery-auth.runtime.js");
	const profileId = resolveUnavailableDiscoveryAuthProfileId(error);
	for (const provider of params.providerIds ?? [params.provider.id]) params.reportCatalogOutcome?.({
		provider,
		...profileId ? { profileId } : {},
		status: "unavailable"
	});
	return true;
}
//#endregion
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
	appendNormalizedPluginMetadataOwners(owners, pluginMetadataSnapshot.owners.providers ?? /* @__PURE__ */ new Map(), provider, normalizedProvider);
	appendNormalizedPluginMetadataOwners(owners, pluginMetadataSnapshot.owners.modelCatalogProviders ?? /* @__PURE__ */ new Map(), provider, normalizedProvider);
	appendNormalizedPluginMetadataOwners(owners, pluginMetadataSnapshot.owners.setupProviders ?? /* @__PURE__ */ new Map(), provider, normalizedProvider);
	appendNormalizedPluginMetadataOwners(owners, pluginMetadataSnapshot.owners.cliBackends ?? /* @__PURE__ */ new Map(), provider, normalizedProvider);
	return owners.size > 0 ? [...owners].toSorted((left, right) => left.localeCompare(right)) : void 0;
}
function appendNormalizedPluginMetadataOwners(target, ownerMap, provider, normalizedProvider) {
	for (const owner of ownerMap.get(provider) ?? []) target.add(owner);
	if (normalizedProvider !== provider) for (const owner of ownerMap.get(normalizedProvider) ?? []) target.add(owner);
	for (const [ownedId, owners] of ownerMap.entries()) if (ownedId !== provider && ownedId !== normalizedProvider && normalizeProviderId(ownedId) === normalizedProvider) for (const owner of owners) target.add(owner);
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
const PROVIDER_IMPLICIT_MERGERS = { ollama: ({ implicit }) => implicit };
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
function mergeImplicitProviderSet(target, additions) {
	if (!additions) return;
	for (const [key, value] of Object.entries(additions)) target[key] = value;
}
function mergeImplicitProviderConfig(params) {
	const { providerId, existing, implicit } = params;
	if (!existing) return implicit;
	const merge = PROVIDER_IMPLICIT_MERGERS[providerId];
	if (merge) return merge({
		existing,
		implicit
	});
	return mergeProviderModels(implicit, existing, {
		providerId,
		sourceModelFields: params.sourceModelFields
	});
}
function resolveImplicitProviderAuthMarker(params) {
	return resolveMissingProviderApiKey({
		providerKey: params.providerId,
		provider: params.provider,
		env: params.ctx.env,
		profileApiKey: void 0
	});
}
function resolveConfiguredImplicitProvider(params) {
	for (const providerId of params.providerIds) {
		const configured = findNormalizedProviderValue(params.configuredProviders ?? void 0, providerId);
		if (configured) return configured;
	}
}
function resolveExistingImplicitProviderFromContext(params) {
	return resolveConfiguredImplicitProvider({
		configuredProviders: params.ctx.explicitProviders,
		providerIds: params.providerIds
	}) ?? resolveConfiguredImplicitProvider({
		configuredProviders: params.ctx.config?.models?.providers,
		providerIds: params.providerIds
	});
}
function hasRuntimeProviderCatalog(provider) {
	return typeof provider.catalog?.run === "function";
}
async function resolvePluginImplicitProviders(ctx, providers, order, preparedStaticResults) {
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
		const hasPreparedStaticResult = preparedStaticResults?.has(provider) === true;
		const normalizedResult = await withProviderCatalogExpiry(async () => {
			let result;
			if (useStaticCatalog) result = hasPreparedStaticResult ? preparedStaticResults.get(provider) : await runProviderStaticCatalog({ provider });
			else result = await runProviderCatalogWithTimeout({
				provider,
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
			if (!result && !useStaticCatalog && provider.staticCatalog) result = await runProviderStaticCatalog({ provider });
			return result ? normalizePluginDiscoveryResult({
				provider,
				result
			}) : void 0;
		}, (acceptedProviders) => Object.keys(acceptedProviders ?? {}));
		if (!normalizedResult) continue;
		for (const [providerId, implicitProvider] of Object.entries(normalizedResult)) {
			if (!includeProvider(providerId) || selectedProviderIds && !selectedProviderIds.has(normalizeProviderId(providerId))) continue;
			discovered[providerId] = resolveImplicitProviderAuthMarker({
				ctx,
				providerId,
				provider: mergeImplicitProviderConfig({
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
				})
			});
		}
	}
	return Object.keys(discovered).length > 0 ? discovered : void 0;
}
async function runProviderCatalogWithTimeout(params) {
	const timeoutMs = params.timeoutMs ?? void 0;
	const timeoutError = /* @__PURE__ */ new Error(`provider catalog timed out after ${timeoutMs}ms: ${params.provider.id}`);
	let timer;
	let active = true;
	const catalogParams = {
		...params,
		isActive: () => active,
		reportCatalogOutcome: (outcome) => {
			if (active) params.reportCatalogOutcome?.(outcome);
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
		return await Promise.race([catalogRun, new Promise((_, reject) => {
			timer = setTimeout(() => {
				active = false;
				reject(timeoutError);
			}, timeoutMs);
			timer.unref?.();
		})]);
	} catch (error) {
		if (await reportProviderCatalogSecretFailure(error, params)) return;
		if (error !== timeoutError) throw error;
		for (const provider of params.providerIds ?? [params.provider.id]) params.reportCatalogOutcome?.({
			provider,
			status: "unavailable"
		});
		if (error === timeoutError) {
			const message = formatErrorMessage(error);
			log.warn(`${message}; skipping provider discovery`);
		}
		return;
	} finally {
		active = false;
		if (timer) clearTimeout(timer);
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
				result: { providers: providerConfigs },
				providerConfigs
			};
		}), ...providers.filter((provider) => provider.staticCatalog && !eligibleProviders.includes(provider)).map((provider) => ({
			provider,
			result: { providers: {} },
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
	const context = {
		...params,
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
	const preparedStaticResultsByProvider = new Map(preparedStaticEntries?.map(({ provider, result }) => [`${provider.pluginId ?? ""}\0${normalizeProviderId(provider.id)}`, result]) ?? []);
	const preparedStaticResults = params.preparedStaticProviderCatalog ? new Map(discoveryProviders.flatMap((provider) => {
		const key = `${provider.pluginId ?? ""}\0${normalizeProviderId(provider.id)}`;
		return preparedStaticResultsByProvider.has(key) ? [[provider, preparedStaticResultsByProvider.get(key)]] : [];
	})) : void 0;
	for (const order of PLUGIN_DISCOVERY_ORDERS) mergeImplicitProviderSet(providers, await resolvePluginImplicitProviders(context, discoveryProviders, order, preparedStaticResults));
	return providers;
}
//#endregion
export { resolveImplicitProviders as n, resolveImplicitProviderDiscoveryScope as r, prepareImplicitProviderStaticCatalog as t };
