import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as createConfigRuntimeEnv, r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { j as hashRuntimeConfigValue, l as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { f as resolveConfigSecretRef } from "./resolution-facts-D_pto3MV.mjs";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentDir, m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint } from "./plugin-control-plane-context-Cn4izUMk.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as MODEL_APIS } from "./model-config-vocabulary-Cb5jWCSz.mjs";
import "./types.models-BqvzicE8.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-DAkjzBhe.mjs";
import "./env-vars-BA28GJYb.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { t as MODELS_JSON_STATE } from "./models-config-state-BFmn-wv7.mjs";
import { r as resolveNonEnvSecretRefApiKeyMarker } from "./provider-credential-values-Cf7LMsFg.mjs";
import { u as resolveEnvSecretRefHeaderValueMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { a as mergeWithExistingProviderSecrets, i as mergeProviders, n as isWritableProviderConfig, o as normalizeProviderMapKeys, t as buildSourceModelFields } from "./models-config.merge-C-G9Ur64.mjs";
import { i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { t as loadPersistedPluginModelCatalogs } from "./plugin-model-catalog-execution-D64dZ7z1.mjs";
import { u as normalizeProviderConfigWithPlugin, y as resolveProviderConfigApiKeyWithPlugin } from "./provider-runtime-DZ8luukj.mjs";
import { n as normalizeProviderCatalogModelsForConfig, t as materializeConfiguredProviderCatalogModels } from "./models-config.providers.catalog-CUFun5bM.mjs";
import { r as repairPluginModelCatalogTransportMetadata, t as PLUGIN_MODEL_CATALOG_GENERATED_BY } from "./plugin-model-catalog-repair-gbFum2dR.mjs";
import { l as replacePersistedPluginModelCatalogs, n as encodePluginModelCatalogRelativePath, r as filterGeneratedPluginModelCatalogProviders, t as decodePluginModelCatalogRelativePathPluginId, u as resolvePluginModelCatalogOwnerPluginId } from "./plugin-model-catalog-BSKD3sUS.mjs";
import { n as resolveImplicitProviders } from "./models-config.providers.implicit-B8ZOw1Dx.mjs";
import { c as resolveMissingProviderApiKey, i as normalizeResolvedEnvApiKey, n as normalizeConfiguredProviderApiKey, o as resolveApiKeyFromProfiles, r as normalizeHeaderValues } from "./models-config.providers.secret-helpers-_SdvipSt.mjs";
import { t as privateFileStore } from "./private-file-store-BFf7SHKy.mjs";
import { r as withPluginModelCatalogAuthObservations, t as capturePluginModelCatalogAuth } from "./plugin-model-catalog-auth-eUzBqJUU.mjs";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/agents/models-config.providers.policy.lookup.ts
/**
* Resolves provider plugin lookup keys from provider config aliases.
*/
const GENERIC_PROVIDER_APIS = /* @__PURE__ */ new Set([
	"openai-completions",
	"openai-responses",
	"anthropic-messages",
	"google-generative-ai",
	"google-interactions"
]);
function resolveProviderPluginLookupKey(providerKey, provider) {
	const api = normalizeOptionalString(provider?.api) ?? "";
	if (providerKey === "google-antigravity" || providerKey === "google-vertex" || api === "google-generative-ai") return "google";
	if (Array.isArray(provider?.models) && provider.models.some((model) => normalizeOptionalString(model.api) === "google-generative-ai")) return "google";
	if (api && MODEL_APIS.includes(api) && !GENERIC_PROVIDER_APIS.has(api)) return api;
	return providerKey;
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
		markers[headerName] = sourceHeaderRef.source === "env" ? resolveEnvSecretRefHeaderValueMarker(sourceHeaderRef.id) : resolveNonEnvSecretRefApiKeyMarker(sourceHeaderRef.source);
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
async function normalizeProviders(params) {
	const { providers } = params;
	if (!providers) return providers;
	const env = params.env ?? process.env;
	const sourceProviders = normalizeSourceProviderLookup(params.sourceConfigForSecrets?.models?.providers);
	let authStore;
	const resolveProfileApiKey = async (providerKey) => {
		authStore ??= await ensureAuthProfileStoreAsync(params.agentDir, { allowKeychainPrompt: false });
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
			secretRefManagedProviders: params.secretRefManagedProviders
		});
		normalizedProvider = normalizeResolvedEnvApiKey({
			providerKey: normalizedKey,
			provider: normalizedProvider,
			env,
			secretRefManagedProviders: params.secretRefManagedProviders
		});
		const needsProfileApiKey = Array.isArray(normalizedProvider.models) && normalizedProvider.models.length > 0 && !normalizedProvider.apiKey;
		const profileApiKey = needsProfileApiKey ? await resolveProfileApiKey(normalizedKey) : void 0;
		const runtimeProviderKey = needsProfileApiKey ? resolveProviderPluginLookupKey(normalizedKey).trim() : void 0;
		normalizedProvider = resolveMissingProviderApiKey({
			providerKey: normalizedKey,
			provider: normalizedProvider,
			env,
			profileApiKey,
			secretRefManagedProviders: params.secretRefManagedProviders,
			providerApiKeyResolver: runtimeProviderKey !== void 0 ? (providerEnv) => resolveProviderConfigApiKeyWithPlugin({
				provider: runtimeProviderKey,
				...params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {},
				context: {
					provider: normalizedKey,
					env: providerEnv
				}
			}) : void 0
		});
		normalizedProvider = normalizeProviderConfigWithPlugin({
			provider: resolveProviderPluginLookupKey(normalizedKey, normalizedProvider),
			...params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {},
			context: {
				provider: normalizedKey,
				providerConfig: normalizedProvider
			}
		}) ?? normalizedProvider;
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
/**
* Plans root and plugin-owned model catalog writes. Setup and doctor flows use
* this module to merge implicit provider discovery, explicit config, and
* preserved secrets before touching models.json.
*/
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
		pluginMetadataSnapshot: context.pluginMetadataSnapshot,
		preparedStaticProviderCatalog: context.preparedStaticProviderCatalog,
		providerDiscoveryProviderIds: context.providerDiscoveryProviderIds,
		providerDiscoveryTimeoutMs: context.providerDiscoveryTimeoutMs,
		providerDiscoveryEntriesOnly: context.providerDiscoveryEntriesOnly === true,
		onProviderCatalogOutcome: context.onProviderCatalogOutcome
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
	return mergeWithExistingProviderSecrets({
		nextProviders: params.providers,
		existingProviders: existing.providers,
		secretRefManagedProviders: params.secretRefManagedProviders
	});
}
function filterWritableProviders(providers) {
	const next = Object.fromEntries(Object.entries(providers).filter(([, provider]) => isWritableProviderConfig(provider)));
	return Object.keys(next).length === Object.keys(providers).length ? providers : next;
}
/** Recovers only generated providers; manual root declarations never enter this source. */
function collectGeneratedCatalogProviders(params) {
	const providers = {};
	for (const { pluginId, contents } of params.catalogs) {
		const catalog = safeParseJsonRecord(contents);
		if (!catalog || !isRecord(catalog.providers)) continue;
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
	const normalizedProviders = await normalizeProviders({
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
	const finalizeProviders = (candidateProviders) => {
		const normalized = normalizeProviderCatalogModelsForConfig(candidateProviders) ?? candidateProviders;
		return filterWritableProviders(enforceSourceManagedProviderSecrets({
			providers: normalized,
			sourceConfigForSecrets: context.sourceConfigForSecrets,
			secretRefManagedProviders
		}) ?? normalized);
	};
	const splitProviders = splitProvidersByPluginOwner({
		providers: finalizeProviders(mergedProviders),
		pluginMetadataSnapshot: context.pluginMetadataSnapshot
	});
	const pluginCatalogWrites = buildPluginCatalogWrites(splitProviders.pluginProviders);
	const rootProviders = resolveProvidersForMode({
		mode,
		existingParsed: params.existingParsed,
		providers: splitProviders.rootProviders,
		secretRefManagedProviders
	});
	const nextContents = `${JSON.stringify({ providers: finalizeProviders(rootProviders) }, null, 2)}\n`;
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
	const pluginCatalogFingerprint = createHash("sha256").update(stableStringify(await loadPersistedPluginModelCatalogs(context.agentDir, void 0, context.env))).digest("base64url");
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
		return {
			raw: raw ?? "",
			parsed: raw === null ? null : JSON.parse(raw)
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
function resolveModelsConfigInput(config) {
	const runtimeSource = getRuntimeConfigSourceSnapshot();
	const projected = runtimeSource ? projectConfigOntoRuntimeSourceSnapshot(config) : config;
	return {
		config: projected,
		discoveryAuthConfig: config,
		sourceConfigForSecrets: projected === config ? runtimeSource ?? config : projected
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
		workspaceDir: workspaceDir || void 0,
		pluginMetadataSnapshot,
		preparedStaticProviderCatalog: capturedOptions.preparedStaticProviderCatalog,
		providerDiscoveryProviderIds: capturedOptions.providerDiscoveryProviderIds,
		providerDiscoveryTimeoutMs: capturedOptions.providerDiscoveryTimeoutMs,
		providerDiscoveryEntriesOnly: capturedOptions.providerDiscoveryEntriesOnly === true,
		onProviderCatalogOutcome: capturedOptions.onProviderCatalogOutcome
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
		const authSnapshot = await capturePluginModelCatalogAuth(agentDir, context.env);
		const plan = await withPluginModelCatalogAuthObservations(authSnapshot, async () => planOpenClawModelsJson({
			context,
			existingRaw: existingModelsFile.raw,
			existingParsed: existingModelsFile.parsed,
			pluginCatalogs: await loadPersistedPluginModelCatalogs(agentDir, void 0, context.env)
		}));
		let wroteRoot = false;
		if (plan.action === "write") {
			await fs.mkdir(agentDir, {
				recursive: true,
				mode: 448
			});
			wroteRoot = existingModelsFile.raw !== plan.contents;
			if (wroteRoot) {
				await privateFileStore(path.dirname(targetPath)).writeText("models.json", plan.contents);
				MODELS_JSON_STATE.costCache.delete(agentDir);
			}
			await ensureModelsFileModeForModelsJson(targetPath);
		}
		const wrotePluginCatalog = plan.pluginCatalogWrites ? await replacePersistedPluginModelCatalogs({
			agentDir,
			pluginCatalogWrites: plan.pluginCatalogWrites,
			authSnapshot,
			env: context.env
		}) : false;
		if (plan.action === "noop") await ensureModelsFileModeForModelsJson(targetPath);
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
	const existingPluginCatalogs = await loadPersistedPluginModelCatalogs(agentDir, void 0, context.env);
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
