import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { d as resolveAmbientOwnerAgentId, l as resolveAgentWorkspaceDir, p as resolveDefaultAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as appendConfigPathSegment } from "./dot-path-BSC76DAI.mjs";
import { f as resolveConfigSecretRef } from "./resolution-facts-CSuKIPux.mjs";
import { n as cloneEnvWithPlatformSemantics, o as createConfigRuntimeEnv } from "./config-env-vars-BHI12YH5.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { t as MODEL_APIS } from "./model-config-vocabulary-CIfiDXNP.mjs";
import "./types.models-ZwQV51CR.mjs";
import { f as hashRuntimeConfigValue, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-D2uZ1zpS.mjs";
import "./agent-scope-CTuYDtny.mjs";
import "./env-vars-jrzBxc1h.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { h as resolveAuthProfileDatabasePath } from "./sqlite-BIg_k8qE.mjs";
import { r as resolveNonEnvSecretRefApiKeyMarker } from "./provider-credential-values-DSE2VVU-.mjs";
import { d as resolveNonEnvSecretRefHeaderValueMarker, u as resolveEnvSecretRefHeaderValueMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-BcoYkagW.mjs";
import { S as resolveProviderConfigApiKeyWithPlugin, d as normalizeProviderConfigWithPlugin } from "./provider-runtime-BofzCM_V.mjs";
import { a as normalizeProviderMapKeys, i as mergeWithExistingProviderSecrets, r as mergeProviders, t as buildSourceModelFields } from "./models-config.merge-Deg2vlWf.mjs";
import { n as normalizeProviderCatalogModelsForConfig, t as materializeConfiguredProviderCatalogModels } from "./models-config.providers.catalog-DfEcuWtR.mjs";
import { a as loadPersistedPluginModelCatalogsReadOnly, c as replacePersistedPluginModelCatalogs, f as repairPluginModelCatalogTransportMetadata, l as resolvePluginModelCatalogOwnerPluginId, n as encodePluginModelCatalogRelativePath, r as filterGeneratedPluginModelCatalogProviders, t as decodePluginModelCatalogRelativePathPluginId, u as PLUGIN_MODEL_CATALOG_GENERATED_BY } from "./plugin-model-catalog-DoLlP-mj.mjs";
import { n as resolveImplicitProviders } from "./models-config.providers.implicit-73Aeo3j3.mjs";
import { c as resolveMissingProviderApiKey, i as normalizeResolvedEnvApiKey, n as normalizeConfiguredProviderApiKey, o as resolveApiKeyFromProfiles, r as normalizeHeaderValues } from "./models-config.providers.secret-helpers-2wGbY1sX.mjs";
import { t as privateFileStore } from "./private-file-store-DcTFLQxK.mjs";
import { t as MODELS_JSON_STATE } from "./models-config-state-TumWTRCu.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/agents/models-config.providers.policy.lookup.ts
/**
* Resolves provider plugin lookup keys from provider config aliases.
*/
const GENERIC_PROVIDER_APIS = /* @__PURE__ */ new Set([
	"openai-completions",
	"openai-responses",
	"anthropic-messages",
	"google-generative-ai"
]);
function resolveProviderPluginLookupKey(providerKey, provider) {
	const api = normalizeOptionalString(provider?.api) ?? "";
	if (providerKey === "google-antigravity" || providerKey === "google-vertex" || api === "google-generative-ai") return "google";
	if (Array.isArray(provider?.models) && provider.models.some((model) => normalizeOptionalString(model.api) === "google-generative-ai")) return "google";
	if (api && MODEL_APIS.includes(api) && !GENERIC_PROVIDER_APIS.has(api)) return api;
	return providerKey;
}
//#endregion
//#region src/agents/models-config.providers.policy.ts
/**
* Provider-specific config policy adapters.
*
* These helpers call plugin hooks without triggering runtime plugin loading
* from config assembly.
*/
/** Normalizes a provider config according to provider-specific runtime policy. */
function normalizeProviderSpecificConfig(providerKey, provider, manifestRegistry) {
	const runtimeProviderKey = resolveProviderPluginLookupKey(providerKey, provider);
	return normalizeProviderConfigWithPlugin({
		provider: runtimeProviderKey,
		allowRuntimePluginLoad: false,
		...manifestRegistry ? { manifestRegistry } : {},
		context: {
			provider: providerKey,
			providerConfig: provider
		}
	}) ?? provider;
}
/** Resolves a provider-specific API key env lookup policy when one exists. */
function resolveProviderConfigApiKeyResolver(providerKey, provider, manifestRegistry) {
	const runtimeProviderKey = resolveProviderPluginLookupKey(providerKey, provider).trim();
	return (env) => resolveProviderConfigApiKeyWithPlugin({
		provider: runtimeProviderKey,
		allowRuntimePluginLoad: false,
		...manifestRegistry ? { manifestRegistry } : {},
		context: {
			provider: providerKey,
			env
		}
	});
}
//#endregion
//#region src/agents/models-config.providers.source-managed.ts
/**
* Enforces source-managed provider secret ownership rules.
*/
function normalizeSourceProviderLookup(providers) {
	if (!providers) return /* @__PURE__ */ new Map();
	const validProviders = Object.fromEntries(Object.entries(providers).filter(([, provider]) => isRecord(provider)).map(([providerKey, providerConfig]) => [providerKey, {
		providerKey,
		providerConfig
	}]));
	return new Map(Object.entries(normalizeProviderMapKeys(validProviders)));
}
function resolveSourceManagedApiKeyMarker(params) {
	const sourceApiKeyRef = resolveConfigSecretRef({
		config: params.sourceConfig,
		path: `${appendConfigPathSegment("models.providers", params.sourceProvider.providerKey)}.apiKey`,
		value: params.sourceProvider.providerConfig.apiKey,
		defaults: params.sourceConfig?.secrets?.defaults
	});
	if (!sourceApiKeyRef || !sourceApiKeyRef.id.trim()) return;
	return sourceApiKeyRef.source === "env" ? sourceApiKeyRef.id.trim() : resolveNonEnvSecretRefApiKeyMarker(sourceApiKeyRef.source);
}
function resolveSourceManagedHeaderMarkers(params) {
	const sourceHeaders = params.sourceProvider.providerConfig.headers;
	if (!isRecord(sourceHeaders)) return {};
	const markers = {};
	for (const [headerName, headerValue] of Object.entries(sourceHeaders)) {
		const sourceHeaderRef = resolveConfigSecretRef({
			config: params.sourceConfig,
			path: appendConfigPathSegment(`${appendConfigPathSegment("models.providers", params.sourceProvider.providerKey)}.headers`, headerName),
			value: headerValue,
			defaults: params.sourceConfig?.secrets?.defaults
		});
		if (!sourceHeaderRef || !sourceHeaderRef.id.trim()) continue;
		markers[headerName] = sourceHeaderRef.source === "env" ? resolveEnvSecretRefHeaderValueMarker(sourceHeaderRef.id) : resolveNonEnvSecretRefHeaderValueMarker(sourceHeaderRef.source);
	}
	return markers;
}
/** Preserves source-managed apiKey/header markers from the original provider config. */
function enforceSourceManagedProviderSecrets(params) {
	const { providers } = params;
	if (!providers) return providers;
	const sourceProvidersByKey = normalizeSourceProviderLookup(params.sourceConfigForSecrets?.models?.providers);
	if (sourceProvidersByKey.size === 0) return providers;
	let nextProviders = null;
	for (const [providerKey, provider] of Object.entries(providers)) {
		if (!isRecord(provider)) continue;
		const canonicalProviderKey = normalizeProviderId(providerKey);
		const sourceProvider = sourceProvidersByKey.get(canonicalProviderKey);
		if (!sourceProvider) continue;
		let nextProvider = provider;
		const sourceApiKeyMarker = resolveSourceManagedApiKeyMarker({
			sourceProvider,
			sourceConfig: params.sourceConfigForSecrets
		});
		if (sourceApiKeyMarker) {
			params.secretRefManagedProviders?.add(canonicalProviderKey);
			if (nextProvider.apiKey !== sourceApiKeyMarker) nextProvider = {
				...nextProvider,
				apiKey: sourceApiKeyMarker
			};
		}
		const sourceHeaderMarkers = resolveSourceManagedHeaderMarkers({
			sourceProvider,
			sourceConfig: params.sourceConfigForSecrets
		});
		const currentHeaders = isRecord(nextProvider.headers) ? nextProvider.headers : void 0;
		if (Object.entries(sourceHeaderMarkers).some(([headerName, marker]) => currentHeaders?.[headerName] !== marker)) nextProvider = {
			...nextProvider,
			headers: {
				...currentHeaders,
				...sourceHeaderMarkers
			}
		};
		if (nextProvider === provider) continue;
		nextProviders ??= { ...providers };
		nextProviders[providerKey] = nextProvider;
	}
	return nextProviders ?? providers;
}
//#endregion
//#region src/agents/models-config.providers.normalize.ts
/** Normalizes provider settings and resolves current credential sources. */
function normalizeProviders(params) {
	const { providers } = params;
	if (!providers) return providers;
	const env = params.env ?? process.env;
	const sourceProviders = normalizeSourceProviderLookup(params.sourceConfigForSecrets?.models?.providers);
	let authStore;
	const resolveProfileApiKey = (providerKey) => {
		authStore ??= ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false });
		return resolveApiKeyFromProfiles({
			provider: providerKey,
			store: authStore,
			env
		});
	};
	let mutated = false;
	const next = {};
	for (const [key, provider] of Object.entries(providers)) {
		const normalizedKey = key.trim();
		if (!normalizedKey) {
			mutated = true;
			continue;
		}
		if (normalizedKey !== key) mutated = true;
		const sourceProvider = sourceProviders.get(normalizeProviderId(normalizedKey));
		const source = sourceProvider && params.sourceConfigForSecrets ? {
			config: params.sourceConfigForSecrets,
			providerKey: sourceProvider.providerKey
		} : void 0;
		let normalizedProvider = provider;
		const normalizedHeaders = normalizeHeaderValues({
			headers: normalizedProvider.headers,
			secretDefaults: params.secretDefaults,
			source
		});
		if (normalizedHeaders.mutated) normalizedProvider = {
			...normalizedProvider,
			headers: normalizedHeaders.headers
		};
		const sourceInput = sourceProvider?.providerConfig.apiKey !== void 0 ? {
			config: params.sourceConfigForSecrets,
			path: `${appendConfigPathSegment("models.providers", sourceProvider.providerKey)}.apiKey`,
			value: sourceProvider.providerConfig.apiKey,
			defaults: params.sourceConfigForSecrets?.secrets?.defaults
		} : void 0;
		normalizedProvider = normalizeConfiguredProviderApiKey({
			providerKey: normalizedKey,
			sourceInput,
			provider: normalizedProvider,
			secretDefaults: params.secretDefaults,
			profileApiKey: void 0,
			secretRefManagedProviders: params.secretRefManagedProviders
		});
		normalizedProvider = normalizeResolvedEnvApiKey({
			providerKey: normalizedKey,
			provider: normalizedProvider,
			env,
			secretRefManagedProviders: params.secretRefManagedProviders
		});
		const needsProfileApiKey = Array.isArray(normalizedProvider.models) && normalizedProvider.models.length > 0 && !(typeof normalizedProvider.apiKey === "string" && normalizedProvider.apiKey.trim() || normalizedProvider.apiKey);
		const profileApiKey = needsProfileApiKey ? resolveProfileApiKey(normalizedKey) : void 0;
		const providerApiKeyResolver = needsProfileApiKey ? resolveProviderConfigApiKeyResolver(normalizedKey, void 0, params.manifestRegistry) : void 0;
		normalizedProvider = resolveMissingProviderApiKey({
			providerKey: normalizedKey,
			provider: normalizedProvider,
			env,
			profileApiKey,
			secretRefManagedProviders: params.secretRefManagedProviders,
			providerApiKeyResolver
		});
		normalizedProvider = normalizeProviderSpecificConfig(normalizedKey, normalizedProvider, params.manifestRegistry);
		mutated ||= normalizedProvider !== provider;
		const existing = next[normalizedKey];
		if (existing) {
			mutated = true;
			next[normalizedKey] = {
				...existing,
				...normalizedProvider,
				models: normalizedProvider.models ?? existing.models
			};
			continue;
		}
		next[normalizedKey] = normalizedProvider;
	}
	return enforceSourceManagedProviderSecrets({
		providers: mutated ? next : providers,
		sourceConfigForSecrets: params.sourceConfigForSecrets,
		secretRefManagedProviders: params.secretRefManagedProviders
	});
}
//#endregion
//#region src/agents/models-config.plan.ts
function splitProvidersByPluginOwner(params) {
	const rootProviders = {};
	const pluginProviders = {};
	for (const [providerId, provider] of Object.entries(params.providers)) {
		const pluginId = resolvePluginModelCatalogOwnerPluginId({
			providerId,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot
		});
		if (!pluginId) {
			rootProviders[providerId] = provider;
			continue;
		}
		const pluginCatalog = pluginProviders[pluginId] ??= {};
		pluginCatalog[providerId] = provider;
	}
	return {
		rootProviders,
		pluginProviders
	};
}
function buildPluginCatalogWrites(pluginProviders) {
	return Object.fromEntries(Object.entries(pluginProviders).map(([pluginId, providers]) => [encodePluginModelCatalogRelativePath(pluginId), `${JSON.stringify({
		generatedBy: PLUGIN_MODEL_CATALOG_GENERATED_BY,
		providers
	}, null, 2)}\n`]));
}
/** Resolves providers for models.json. */
async function resolveProvidersForModelsJson(params) {
	const { context } = params;
	const { agentDir, env } = context;
	const explicitProviders = stripBlankProviderBaseUrls(materializeConfiguredProviderCatalogModels(context.cfg.models?.providers, { manifestPlugins: context.pluginMetadataSnapshot }) ?? {});
	const cfg = context.cfg.models?.providers ? {
		...context.cfg,
		models: {
			...context.cfg.models,
			providers: explicitProviders
		}
	} : context.cfg;
	const sourceModelFields = buildSourceModelFields(explicitProviders);
	if (cfg.models?.mode === "replace") return mergeProviders({
		implicit: {},
		explicit: explicitProviders
	});
	const implicitProviders = await resolveImplicitProviders({
		agentDir,
		...params.authStore ? { authStore: params.authStore } : {},
		config: cfg,
		discoveryAuthConfig: context.discoveryAuthConfig,
		discoveryAuthEnv: context.discoveryAuthEnv,
		sourceConfigForSecrets: context.sourceConfigForSecrets,
		env,
		...context.workspaceDir ? { workspaceDir: context.workspaceDir } : {},
		explicitProviders,
		sourceModelFields,
		...context.pluginMetadataSnapshot ? { pluginMetadataSnapshot: context.pluginMetadataSnapshot } : {},
		...context.preparedStaticProviderCatalog ? { preparedStaticProviderCatalog: context.preparedStaticProviderCatalog } : {},
		...context.providerDiscoveryProviderIds ? { providerDiscoveryProviderIds: context.providerDiscoveryProviderIds } : {},
		...context.providerDiscoveryTimeoutMs !== void 0 ? { providerDiscoveryTimeoutMs: context.providerDiscoveryTimeoutMs } : {},
		...context.providerDiscoveryEntriesOnly === true ? { providerDiscoveryEntriesOnly: true } : {},
		...context.onProviderCatalogOutcome ? { onProviderCatalogOutcome: context.onProviderCatalogOutcome } : {}
	});
	return mergeProviders({
		implicit: implicitProviders,
		explicit: explicitProviders,
		sourceModelFields
	});
}
function stripBlankProviderBaseUrls(providers) {
	let mutated = false;
	const next = {};
	for (const [key, provider] of Object.entries(providers)) {
		if (typeof provider?.baseUrl === "string" && provider.baseUrl.trim() === "") {
			const { baseUrl: _blank, ...rest } = provider;
			next[key] = rest;
			mutated = true;
			continue;
		}
		next[key] = provider;
	}
	return mutated ? next : providers;
}
function resolveProvidersForMode(params) {
	if (params.mode !== "merge") return params.providers;
	const existing = params.existingParsed;
	if (!isRecord(existing) || !isRecord(existing.providers)) return params.providers;
	const existingProviders = existing.providers;
	return mergeWithExistingProviderSecrets({
		nextProviders: params.providers,
		existingProviders,
		secretRefManagedProviders: params.secretRefManagedProviders
	});
}
function isWritableProviderConfig(provider) {
	if (!Array.isArray(provider.models) || provider.models.length === 0) return true;
	return Boolean(provider.baseUrl?.trim() && (provider.apiKey === void 0 || provider.apiKey));
}
function filterWritableProviders(providers) {
	const next = Object.fromEntries(Object.entries(providers).filter(([, provider]) => isWritableProviderConfig(provider)));
	return Object.keys(next).length === Object.keys(providers).length ? providers : next;
}
/** Recovers only generated providers; manual root declarations never enter this source. */
function collectGeneratedCatalogProviders(params) {
	const providers = {};
	for (const { pluginId, contents } of params.catalogs) {
		let catalog;
		try {
			catalog = JSON.parse(contents);
		} catch {
			continue;
		}
		if (!isRecord(catalog) || !isRecord(catalog.providers)) continue;
		Object.assign(providers, filterGeneratedPluginModelCatalogProviders({
			catalogPluginId: pluginId,
			config: params.context.cfg,
			parsedCatalog: catalog,
			pluginMetadataSnapshot: params.context.pluginMetadataSnapshot,
			providers: catalog.providers
		}));
	}
	return providers;
}
/** Plans root and plugin-owned model catalog writes for the current runtime. */
async function planOpenClawModelsJson(params) {
	const { context } = params;
	const { cfg, agentDir, env } = context;
	const providers = await resolveProvidersForModelsJson({
		context,
		...params.authStore ? { authStore: params.authStore } : {}
	});
	if (Object.keys(providers).length === 0) {
		if (cfg.models?.mode === "replace") return {
			action: "write",
			contents: `${JSON.stringify({ providers: {} }, null, 2)}\n`,
			pluginCatalogWrites: {}
		};
		return { action: "skip" };
	}
	const mode = cfg.models?.mode ?? "merge";
	const secretRefManagedProviders = /* @__PURE__ */ new Set();
	const providerPolicyManifestRegistry = context.pluginMetadataSnapshot?.pluginIds === void 0 ? context.pluginMetadataSnapshot?.manifestRegistry : void 0;
	const normalizedProviders = normalizeProviders({
		providers,
		agentDir,
		env,
		secretDefaults: cfg.secrets?.defaults,
		sourceConfigForSecrets: context.sourceConfigForSecrets,
		secretRefManagedProviders,
		...providerPolicyManifestRegistry ? { manifestRegistry: providerPolicyManifestRegistry } : {}
	}) ?? providers;
	const mergedProviders = resolveProvidersForMode({
		mode,
		existingParsed: { providers: collectGeneratedCatalogProviders({
			catalogs: params.pluginCatalogs ?? [],
			context
		}) },
		providers: normalizedProviders,
		secretRefManagedProviders
	});
	const normalizedMergedProviders = normalizeProviderCatalogModelsForConfig(mergedProviders) ?? mergedProviders;
	const splitProviders = splitProvidersByPluginOwner({
		providers: filterWritableProviders(enforceSourceManagedProviderSecrets({
			providers: normalizedMergedProviders,
			sourceConfigForSecrets: context.sourceConfigForSecrets,
			secretRefManagedProviders
		}) ?? normalizedMergedProviders),
		pluginMetadataSnapshot: context.pluginMetadataSnapshot
	});
	const pluginCatalogWrites = buildPluginCatalogWrites(splitProviders.pluginProviders);
	const rootProviders = resolveProvidersForMode({
		mode,
		existingParsed: params.existingParsed,
		providers: splitProviders.rootProviders,
		secretRefManagedProviders
	});
	const normalizedRootProviders = normalizeProviderCatalogModelsForConfig(rootProviders) ?? rootProviders;
	const rootWithManagedSecrets = enforceSourceManagedProviderSecrets({
		providers: normalizedRootProviders,
		sourceConfigForSecrets: context.sourceConfigForSecrets,
		secretRefManagedProviders
	}) ?? normalizedRootProviders;
	const nextContents = `${JSON.stringify({ providers: filterWritableProviders(rootWithManagedSecrets) }, null, 2)}\n`;
	if (params.existingRaw === nextContents && Object.keys(pluginCatalogWrites).length === 0) return {
		action: "noop",
		pluginCatalogWrites
	};
	return {
		action: "write",
		contents: nextContents,
		pluginCatalogWrites
	};
}
//#endregion
//#region src/agents/models-config.ts
/**
* Ensures agent-local models.json and the SQLite-backed plugin model catalog
* match runtime config, discovered providers, auth-profile state, and
* generated catalog ownership.
*/
async function readFileMtimeMs(pathname) {
	try {
		const stat = await fs.stat(pathname);
		return Number.isFinite(stat.mtimeMs) ? stat.mtimeMs : null;
	} catch {
		return null;
	}
}
async function buildModelsJsonFingerprint(context) {
	const authProfilesSqlitePath = resolveAuthProfileDatabasePath(context.agentDir);
	const authProfilesMtimeMs = await readFileMtimeMs(authProfilesSqlitePath);
	const authProfilesWalMtimeMs = await readFileMtimeMs(`${authProfilesSqlitePath}-wal`);
	const modelsFileMtimeMs = await readFileMtimeMs(path.join(context.agentDir, "models.json"));
	const pluginCatalogFingerprint = createHash("sha256").update(stableStringify(loadPersistedPluginModelCatalogsReadOnly(context.agentDir))).digest("base64url");
	const pluginMetadataSnapshotIndexFingerprint = context.pluginMetadataSnapshot ? resolveInstalledManifestRegistryIndexFingerprint(context.pluginMetadataSnapshot.index) : void 0;
	return stableStringify({
		config: context.cfg,
		discoveryAuthConfigHash: hashRuntimeConfigValue(context.discoveryAuthConfig),
		sourceConfigForSecrets: context.sourceConfigForSecrets,
		envShape: context.envFingerprint,
		authProfilesMtimeMs,
		authProfilesWalMtimeMs,
		modelsFileMtimeMs,
		pluginCatalogFingerprint,
		workspaceDir: context.workspaceDir,
		pluginMetadataSnapshotIndexFingerprint,
		pluginMetadataSnapshotPluginIds: context.pluginMetadataSnapshot?.pluginIds === void 0 ? null : context.pluginMetadataSnapshot.pluginIds.toSorted(),
		providerDiscoveryProviderIds: context.providerDiscoveryProviderIds,
		providerDiscoveryTimeoutMs: context.providerDiscoveryTimeoutMs,
		providerDiscoveryEntriesOnly: context.providerDiscoveryEntriesOnly === true
	});
}
function modelsJsonReadyCacheKey(targetPath, fingerprint) {
	return `${targetPath}\0${fingerprint}`;
}
async function readExistingModelsFile(pathname) {
	try {
		const raw = await privateFileStore(path.dirname(pathname)).readTextIfExists(path.basename(pathname));
		if (raw === null) return {
			raw: "",
			parsed: null
		};
		return {
			raw,
			parsed: JSON.parse(raw)
		};
	} catch {
		return {
			raw: "",
			parsed: null
		};
	}
}
/** Best-effort chmod for the user-visible generated models.json file. */
async function ensureModelsFileModeForModelsJson(pathname) {
	await fs.chmod(pathname, 384).catch(() => {});
}
function materializePlannedPluginCatalogs(pluginCatalogWrites) {
	return Object.entries(pluginCatalogWrites).map(([relativePath, contents]) => {
		const pluginId = decodePluginModelCatalogRelativePathPluginId(relativePath);
		if (!pluginId) throw new Error(`Invalid generated plugin model catalog key: ${relativePath}`);
		return {
			pluginId,
			contents: repairPluginModelCatalogTransportMetadata(contents).contents
		};
	}).toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));
}
function writePluginCatalogsForModelsJson(params) {
	if (!params.pluginCatalogWrites) return false;
	return replacePersistedPluginModelCatalogs({
		agentDir: params.agentDir,
		pluginCatalogWrites: params.pluginCatalogWrites
	});
}
function resolveModelsConfigInput(config) {
	const runtimeSource = getRuntimeConfigSourceSnapshot();
	if (!runtimeSource) return {
		config,
		discoveryAuthConfig: config,
		sourceConfigForSecrets: config
	};
	const projected = projectConfigOntoRuntimeSourceSnapshot(config);
	return {
		config: projected,
		discoveryAuthConfig: config,
		sourceConfigForSecrets: projected === config ? runtimeSource : projected
	};
}
async function prepareModelsConfigContext(config, agentDirOverride, options = {}) {
	let ambientEnv = process.env;
	let capturedOptions = options;
	let resolved;
	if (config) resolved = resolveModelsConfigInput(config);
	else {
		capturedOptions = {
			...options,
			...options.env ? { env: cloneEnvWithPlatformSemantics(options.env) } : {},
			...options.providerDiscoveryProviderIds ? { providerDiscoveryProviderIds: [...options.providerDiscoveryProviderIds] } : {}
		};
		const captured = await captureRuntimeConfigAsyncReader({ capture: true })();
		ambientEnv = captured.env;
		const source = projectConfigOntoRuntimeSourceSnapshot(captured.config);
		resolved = {
			config: source,
			discoveryAuthConfig: captured.config,
			sourceConfigForSecrets: source
		};
	}
	const cfg = resolved.config;
	const agentDir = agentDirOverride?.trim() ? agentDirOverride.trim() : resolveDefaultAgentDir(cfg, ambientEnv);
	const workspaceDir = capturedOptions.workspaceDir ?? (agentDirOverride?.trim() ? void 0 : resolveAgentWorkspaceDir(cfg, resolveAmbientOwnerAgentId(cfg), ambientEnv));
	const fingerprintEnv = createConfigRuntimeEnv(cfg, capturedOptions.env ?? {});
	const env = capturedOptions.env ? fingerprintEnv : createConfigRuntimeEnv(cfg, ambientEnv);
	const providerScopedDiscovery = Boolean(capturedOptions.providerDiscoveryProviderIds?.length);
	const pluginMetadataSnapshot = capturedOptions.pluginMetadataSnapshot ?? resolvePluginMetadataSnapshot({
		config: cfg,
		env,
		...workspaceDir ? { workspaceDir } : {},
		...providerScopedDiscovery ? { preferPersisted: false } : {}
	});
	return {
		cfg,
		discoveryAuthConfig: resolved.discoveryAuthConfig,
		discoveryAuthEnv: capturedOptions.env ?? ambientEnv,
		sourceConfigForSecrets: resolved.sourceConfigForSecrets,
		agentDir,
		env,
		envFingerprint: capturedOptions.env ? hashRuntimeConfigValue(fingerprintEnv) : fingerprintEnv,
		...workspaceDir ? { workspaceDir } : {},
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {},
		...capturedOptions.preparedStaticProviderCatalog ? { preparedStaticProviderCatalog: capturedOptions.preparedStaticProviderCatalog } : {},
		...capturedOptions.providerDiscoveryProviderIds ? { providerDiscoveryProviderIds: capturedOptions.providerDiscoveryProviderIds } : {},
		...capturedOptions.providerDiscoveryTimeoutMs !== void 0 ? { providerDiscoveryTimeoutMs: capturedOptions.providerDiscoveryTimeoutMs } : {},
		...capturedOptions.providerDiscoveryEntriesOnly === true ? { providerDiscoveryEntriesOnly: true } : {},
		...capturedOptions.onProviderCatalogOutcome ? { onProviderCatalogOutcome: capturedOptions.onProviderCatalogOutcome } : {}
	};
}
/** Ensures models.json and the agent SQLite catalog cache are current. */
async function ensureOpenClawModelsJson(config, agentDirOverride, options = {}) {
	const context = await prepareModelsConfigContext(config, agentDirOverride, options);
	const { agentDir } = context;
	const targetPath = path.join(agentDir, "models.json");
	const cacheKey = modelsJsonReadyCacheKey(targetPath, await buildModelsJsonFingerprint(context));
	const cached = MODELS_JSON_STATE.readyCache.get(cacheKey);
	if (cached && !context.onProviderCatalogOutcome) {
		const settled = await cached;
		await ensureModelsFileModeForModelsJson(targetPath);
		return { ...settled };
	}
	const pending = MODELS_JSON_STATE.writeQueue.enqueue(targetPath, async () => {
		const existingModelsFile = await readExistingModelsFile(targetPath);
		const plan = await planOpenClawModelsJson({
			context,
			existingRaw: existingModelsFile.raw,
			existingParsed: existingModelsFile.parsed,
			pluginCatalogs: loadPersistedPluginModelCatalogsReadOnly(agentDir)
		});
		if (plan.action === "skip") {
			const wrotePluginCatalog = writePluginCatalogsForModelsJson({
				agentDir,
				pluginCatalogWrites: plan.pluginCatalogWrites
			});
			return {
				agentDir,
				wrote: wrotePluginCatalog
			};
		}
		if (plan.action === "noop") {
			const wrotePluginCatalog = writePluginCatalogsForModelsJson({
				agentDir,
				pluginCatalogWrites: plan.pluginCatalogWrites
			});
			await ensureModelsFileModeForModelsJson(targetPath);
			return {
				agentDir,
				wrote: wrotePluginCatalog
			};
		}
		await fs.mkdir(agentDir, {
			recursive: true,
			mode: 448
		});
		const wroteRoot = existingModelsFile.raw !== plan.contents;
		if (wroteRoot) {
			await privateFileStore(path.dirname(targetPath)).writeText("models.json", plan.contents);
			MODELS_JSON_STATE.costCache.delete(agentDir);
		}
		await ensureModelsFileModeForModelsJson(targetPath);
		const wrotePluginCatalog = writePluginCatalogsForModelsJson({
			agentDir,
			pluginCatalogWrites: plan.pluginCatalogWrites
		});
		return {
			agentDir,
			wrote: wroteRoot || wrotePluginCatalog
		};
	});
	MODELS_JSON_STATE.readyCache.set(cacheKey, pending);
	try {
		const settled = await pending;
		const refreshedCacheKey = modelsJsonReadyCacheKey(targetPath, await buildModelsJsonFingerprint(context));
		if (refreshedCacheKey !== cacheKey) {
			MODELS_JSON_STATE.readyCache.delete(cacheKey);
			MODELS_JSON_STATE.readyCache.set(refreshedCacheKey, Promise.resolve(settled));
		}
		return { ...settled };
	} catch (error) {
		if (MODELS_JSON_STATE.readyCache.get(cacheKey) === pending) MODELS_JSON_STATE.readyCache.delete(cacheKey);
		throw error;
	}
}
/**
* Plans the complete root/plugin catalog generation without mutating agent-owned state.
* Control-plane inventory reads use this when their lifecycle generation may be superseded.
*/
async function planOpenClawModelsJsonSource(config, agentDirOverride, options = {}) {
	const { authStore } = options;
	const context = await prepareModelsConfigContext(config, agentDirOverride, options);
	const { agentDir } = context;
	const existingModelsFile = await readExistingModelsFile(path.join(agentDir, "models.json"));
	const existingPluginCatalogs = loadPersistedPluginModelCatalogsReadOnly(agentDir);
	const plan = await planOpenClawModelsJson({
		context,
		...authStore ? { authStore } : {},
		existingRaw: existingModelsFile.raw,
		existingParsed: existingModelsFile.parsed,
		pluginCatalogs: existingPluginCatalogs
	});
	return {
		agentDir,
		modelsJsonContents: plan.action === "write" ? plan.contents : existingModelsFile.raw || null,
		pluginCatalogs: plan.pluginCatalogWrites === void 0 ? existingPluginCatalogs : materializePlannedPluginCatalogs(plan.pluginCatalogWrites)
	};
}
//#endregion
export { planOpenClawModelsJsonSource as n, ensureOpenClawModelsJson as t };
