import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-10KxeiYV.js";
import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import "./agent-scope-B2Pk_xhT.js";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-BxAUeF6t.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-CT4JjmjS.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-fqwcFyP9.js";
import { i as getRuntimeConfig } from "./io-DxnOT4sF.js";
import { t as planManifestModelCatalogRows } from "./manifest-planner-C4tynx2j.js";
import { a as resolveClaudeFable5ModelIdentity } from "./src-nWM4ct0V.js";
import "./config-Cc93keN1.js";
import { n as isManifestPluginAvailableForControlPlane, s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-C77NT24K.js";
import { i as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-9jfx-1KO.js";
import { t as augmentModelCatalogWithProviderPlugins } from "./provider-runtime.runtime.js";
import "./auth-profiles-aoLBSIs2.js";
import { C as modelSupportsInput, c as hasConfiguredProviderModelRows, r as buildConfiguredModelCatalog } from "./model-selection-shared-DwnYeyqq.js";
import { n as readCachedAgentModelCatalog, r as writeCachedAgentModelCatalog, t as buildAgentModelCatalogCacheKey } from "./model-catalog-state-cache-BfvlGS2y.js";
import { n as resolveModelWorkspaceDir } from "./model-discovery-context-BlRmIB3H.js";
import { n as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-EY6njCR-.js";
import { i as prepareOpenClawModelsJsonSource, t as buildModelsJsonSourceFingerprint } from "./models-config-BVlG3rPj.js";
import { i as filterGeneratedPluginModelCatalogProviders, s as listPluginModelCatalogFiles } from "./plugin-model-catalog-C26wDCJp.js";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
//#region src/agents/model-catalog.ts
/**
* Loads bundled, manifest, and discovered model catalog entries.
*/
const log = createSubsystemLogger("model-catalog");
const AGENT_CUSTOM_MODEL_DEFAULT_CONTEXT_WINDOW = 128e3;
let modelCatalogPromise = null;
let loadedModelCatalogSnapshot;
let loadedModelCatalogGeneration = -1;
let modelCatalogGeneration = 0;
let hasLoggedModelCatalogError = false;
let hasLoggedReadOnlyStaticCatalogError = false;
let manifestModelCatalogCache = /* @__PURE__ */ new WeakMap();
function buildLoadModelCatalogStateCacheKey(params) {
	return buildAgentModelCatalogCacheKey({
		agentDir: params.agentDir,
		cacheScope: {
			source: "load-model-catalog",
			sourceFingerprint: params.sourceFingerprint
		},
		config: params.config,
		metadataSnapshot: params.metadataSnapshot,
		workspaceDir: params.workspaceDir
	});
}
const defaultImportAgentDiscovery = () => import("./agent-model-discovery-6xvay_vj.js");
let importAgentDiscovery = defaultImportAgentDiscovery;
const modelSuppressionLoader = createLazyImportLoader(() => import("./model-suppression.runtime.js"));
const providerApiKeyResolverLoader = createLazyImportLoader(() => import("./models-config.providers.secrets-BThGclum.js"));
function shouldLogModelCatalogTiming() {
	return process.env.OPENCLAW_DEBUG_INGRESS_TIMING === "1";
}
function loadModelSuppression() {
	return modelSuppressionLoader.load();
}
function loadProviderApiKeyResolver() {
	return providerApiKeyResolverLoader.load();
}
function resetModelCatalogCache() {
	modelCatalogPromise = null;
	modelCatalogGeneration += 1;
	manifestModelCatalogCache = /* @__PURE__ */ new WeakMap();
	hasLoggedModelCatalogError = false;
	hasLoggedReadOnlyStaticCatalogError = false;
}
function resetModelCatalogCacheForTest() {
	resetModelCatalogCache();
	loadedModelCatalogSnapshot = void 0;
	loadedModelCatalogGeneration = -1;
	importAgentDiscovery = defaultImportAgentDiscovery;
}
function setModelCatalogImportForTest(loader) {
	importAgentDiscovery = loader ?? defaultImportAgentDiscovery;
}
function catalogEntryDedupeKey(provider, id) {
	return normalizeLowercaseStringOrEmpty(modelKey(normalizeProviderId(provider), id));
}
function mergeCatalogCompat(base, override) {
	if (!base) return override;
	if (!override) return base;
	return {
		...base,
		...override
	};
}
function mergeCatalogParams(base, override) {
	if (!base) return override;
	if (!override) return base;
	return {
		...base,
		...override
	};
}
function overlayCatalogMetadata(base, overlay) {
	const params = mergeCatalogParams(base.params, overlay.params);
	return {
		...base,
		...overlay.api !== void 0 ? { api: overlay.api } : {},
		...overlay.contextWindow !== void 0 ? { contextWindow: overlay.contextWindow } : {},
		...overlay.contextTokens !== void 0 ? { contextTokens: overlay.contextTokens } : {},
		...overlay.reasoning !== void 0 ? { reasoning: overlay.reasoning } : {},
		...overlay.input !== void 0 ? { input: overlay.input } : {},
		...params ? { params } : {},
		compat: mergeCatalogCompat(base.compat, overlay.compat)
	};
}
function normalizeCatalogEntryContract(entry) {
	if (entry.api === "anthropic-messages" && resolveClaudeFable5ModelIdentity({
		id: entry.id,
		params: entry.params
	})) return {
		...entry,
		reasoning: true
	};
	return entry;
}
function mergeCatalogEntries(models, entries) {
	const indexByKey = new Map(models.map((entry, index) => [catalogEntryDedupeKey(entry.provider, entry.id), index]));
	for (const entry of entries) {
		const key = catalogEntryDedupeKey(entry.provider, entry.id);
		const existingIndex = indexByKey.get(key);
		if (existingIndex === void 0) {
			models.push(entry);
			indexByKey.set(key, models.length - 1);
			continue;
		}
		models[existingIndex] = overlayCatalogMetadata(models[existingIndex], entry);
	}
}
function loadManifestModelCatalog(params) {
	const resolvedSnapshot = params.metadataSnapshot ?? (params.fallbackToMetadataScan === false ? getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		...params.workspaceDir === void 0 ? { allowWorkspaceScopedSnapshot: true } : {}
	}) : resolvePluginMetadataSnapshot({
		config: params.config,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		env: params.env ?? process.env,
		allowWorkspaceScopedCurrent: params.workspaceDir === void 0
	}));
	if (!resolvedSnapshot) return [];
	const cached = manifestModelCatalogCache.get(params.config);
	if (cached?.snapshot === resolvedSnapshot) return cached.rows;
	const rows = planManifestModelCatalogRows({ registry: { plugins: resolvedSnapshot.plugins.filter((plugin) => plugin.modelCatalog && isManifestPluginAvailableForControlPlane({
		snapshot: resolvedSnapshot,
		plugin,
		config: params.config
	})) } }).rows.map((row) => {
		const entry = {
			id: row.id,
			name: row.name,
			provider: row.provider,
			api: row.api
		};
		const contextWindow = row.contextWindow ?? row.contextTokens;
		if (contextWindow) entry.contextWindow = contextWindow;
		if (row.contextTokens) entry.contextTokens = row.contextTokens;
		if (typeof row.reasoning === "boolean") entry.reasoning = row.reasoning;
		if (row.input?.length) entry.input = [...row.input];
		if (row.compat) entry.compat = row.compat;
		return entry;
	});
	manifestModelCatalogCache.set(params.config, {
		snapshot: resolvedSnapshot,
		rows
	});
	return rows;
}
function sortModelCatalogEntries(entries) {
	return entries.map(normalizeCatalogEntryContract).toSorted((a, b) => {
		const p = a.provider.localeCompare(b.provider);
		if (p !== 0) return p;
		return a.name.localeCompare(b.name);
	});
}
function normalizePersistedModelCatalogEntry(providerRaw, entry, defaults, options = {}) {
	const rawId = normalizeOptionalString(entry.id) ?? "";
	if (!rawId) return;
	const provider = normalizeProviderId(providerRaw);
	if (!provider) return;
	const id = normalizeConfiguredProviderCatalogModelId(provider, rawId, options);
	const name = normalizeOptionalString(entry.name ?? id) || id;
	const contextWindow = typeof entry?.contextWindow === "number" && entry.contextWindow > 0 ? entry.contextWindow : defaults?.contextWindow !== void 0 ? defaults.contextWindow : AGENT_CUSTOM_MODEL_DEFAULT_CONTEXT_WINDOW;
	const contextTokens = typeof entry?.contextTokens === "number" && entry.contextTokens > 0 ? entry.contextTokens : defaults?.contextTokens !== void 0 ? defaults.contextTokens : void 0;
	const reasoning = typeof entry?.reasoning === "boolean" ? entry.reasoning : false;
	const api = typeof entry?.api === "string" ? entry.api : defaults?.api;
	const parsedInput = Array.isArray(entry?.input) ? entry.input.filter((value) => [
		"text",
		"image",
		"audio",
		"video",
		"document"
	].includes(String(value))) : void 0;
	const input = parsedInput?.length ? parsedInput : ["text"];
	const compat = entry?.compat && typeof entry.compat === "object" ? entry.compat : void 0;
	const modelParams = entry?.params && typeof entry.params === "object" ? entry.params : void 0;
	return {
		id,
		name,
		provider,
		...api ? { api } : {},
		contextWindow,
		...contextTokens !== void 0 ? { contextTokens } : {},
		reasoning,
		input,
		...modelParams ? { params: modelParams } : {},
		compat
	};
}
function readProviderCatalogRows(parsed) {
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
	const providers = parsed.providers;
	return providers && typeof providers === "object" && !Array.isArray(providers) ? providers : {};
}
async function loadReadOnlyPersistedProviderRows(agentDir, getPluginMetadataSnapshot) {
	const raw = await readFile(join(agentDir, "models.json"), "utf8");
	const providers = { ...readProviderCatalogRows(JSON.parse(raw)) };
	for (const catalogFile of listPluginModelCatalogFiles(agentDir)) {
		const catalogRaw = await readFile(catalogFile.path, "utf8").catch(() => void 0);
		if (!catalogRaw) continue;
		let parsed;
		try {
			parsed = JSON.parse(catalogRaw);
		} catch {
			continue;
		}
		Object.assign(providers, filterGeneratedPluginModelCatalogProviders({
			catalogPluginId: catalogFile.pluginId,
			parsedCatalog: parsed,
			pluginMetadataSnapshot: getPluginMetadataSnapshot(),
			providers: readProviderCatalogRows(parsed)
		}));
	}
	return providers;
}
async function loadReadOnlyPersistedModelCatalog(params) {
	const cfg = params?.config ?? getRuntimeConfig();
	const agentDir = resolveDefaultAgentDir(cfg);
	const workspaceDir = resolveModelWorkspaceDir(cfg, void 0);
	const models = [];
	const { buildShouldSuppressBuiltInModel } = await loadModelSuppression();
	const shouldSuppressBuiltInModel = buildShouldSuppressBuiltInModel({ config: cfg });
	let metadataSnapshot = params?.metadataSnapshot;
	const getMetadataSnapshot = () => {
		metadataSnapshot ??= loadManifestMetadataSnapshot({
			config: cfg,
			env: process.env,
			workspaceDir
		});
		return metadataSnapshot;
	};
	let manifestPlugins;
	const getManifestPlugins = () => {
		manifestPlugins ??= getMetadataSnapshot().plugins;
		return manifestPlugins;
	};
	const providers = await loadReadOnlyPersistedProviderRows(agentDir, getMetadataSnapshot);
	for (const [providerRaw, providerConfig] of Object.entries(providers)) {
		if (!Array.isArray(providerConfig?.models)) continue;
		const providerContextWindow = typeof providerConfig?.contextWindow === "number" && providerConfig.contextWindow > 0 ? providerConfig.contextWindow : void 0;
		const providerContextTokens = typeof providerConfig?.contextTokens === "number" && providerConfig.contextTokens > 0 ? providerConfig.contextTokens : void 0;
		const providerApi = typeof providerConfig?.api === "string" ? providerConfig.api : void 0;
		for (const entry of providerConfig.models) {
			const normalized = normalizePersistedModelCatalogEntry(providerRaw, entry, {
				api: providerApi,
				contextWindow: providerContextWindow,
				contextTokens: providerContextTokens
			}, { manifestPlugins: getManifestPlugins() });
			if (normalized && !shouldSuppressBuiltInModel(normalized)) models.push(normalized);
		}
	}
	if (models.length === 0) throw new Error("persisted model catalog has no usable model rows");
	try {
		mergeCatalogEntries(models, loadManifestModelCatalog({
			config: cfg,
			env: process.env,
			fallbackToMetadataScan: false,
			metadataSnapshot: getMetadataSnapshot()
		}));
	} catch {}
	const configuredModels = buildConfiguredModelCatalog({
		cfg,
		manifestPlugins: hasConfiguredProviderModelRows(cfg) ? getManifestPlugins() : void 0
	});
	if (configuredModels.length > 0) mergeCatalogEntries(models, configuredModels);
	return sortModelCatalogEntries(models);
}
function hasConfiguredProviderRowsNeedingManifestLookup(cfg) {
	const providers = cfg.models?.providers;
	if (!providers || typeof providers !== "object") return false;
	return Object.entries(providers).some(([providerRaw, provider]) => Array.isArray(provider?.models) && normalizeProviderId(providerRaw) !== "openai");
}
function loadReadOnlyStaticModelCatalog(params) {
	const cfg = params?.config ?? getRuntimeConfig();
	const models = [];
	try {
		mergeCatalogEntries(models, loadManifestModelCatalog({
			config: cfg,
			env: process.env,
			fallbackToMetadataScan: false,
			metadataSnapshot: params?.metadataSnapshot
		}));
	} catch (error) {
		if (!hasLoggedReadOnlyStaticCatalogError) {
			hasLoggedReadOnlyStaticCatalogError = true;
			log.warn(`Failed to load read-only manifest model catalog: ${String(error)}`);
		}
	}
	const configuredModels = buildConfiguredModelCatalog({
		cfg,
		manifestPlugins: hasConfiguredProviderRowsNeedingManifestLookup(cfg) ? params?.metadataSnapshot?.plugins ?? resolvePluginMetadataSnapshot({
			config: cfg,
			env: process.env,
			allowWorkspaceScopedCurrent: true
		}).plugins : []
	});
	if (configuredModels.length > 0) mergeCatalogEntries(models, configuredModels);
	return sortModelCatalogEntries(models);
}
async function loadModelCatalog(params) {
	if (params?.cacheOnly === true) return loadedModelCatalogGeneration === modelCatalogGeneration ? loadedModelCatalogSnapshot ?? [] : [];
	const readOnly = params?.readOnly === true;
	if (readOnly) try {
		return await loadReadOnlyPersistedModelCatalog(params);
	} catch {
		return loadReadOnlyStaticModelCatalog(params);
	}
	if (!readOnly && params?.useCache === false) {
		modelCatalogPromise = null;
		modelCatalogGeneration += 1;
	}
	const useSharedCache = !readOnly && !params?.metadataSnapshot;
	if (useSharedCache && modelCatalogPromise) return modelCatalogPromise;
	const loadCatalog = async () => {
		const models = [];
		const timingEnabled = shouldLogModelCatalogTiming();
		const startMs = timingEnabled ? Date.now() : 0;
		const logStage = (stage, extra) => {
			if (!timingEnabled) return;
			const suffix = extra ? ` ${extra}` : "";
			log.info(`model-catalog stage=${stage} elapsedMs=${Date.now() - startMs}${suffix}`);
		};
		const sortModels = sortModelCatalogEntries;
		try {
			const cfg = params?.config ?? getRuntimeConfig();
			const workspaceDir = resolveModelWorkspaceDir(cfg, void 0);
			let manifestMetadataSnapshot;
			let manifestPlugins;
			const getManifestMetadataSnapshot = () => {
				manifestMetadataSnapshot ??= params?.metadataSnapshot ?? loadManifestMetadataSnapshot({
					config: cfg,
					env: process.env,
					workspaceDir
				});
				return manifestMetadataSnapshot;
			};
			const getManifestPlugins = () => {
				manifestPlugins ??= getManifestMetadataSnapshot().plugins;
				return manifestPlugins;
			};
			const agentDir = resolveDefaultAgentDir(cfg);
			const sourceFingerprint = await buildModelsJsonSourceFingerprint(cfg, agentDir, {
				pluginMetadataSnapshot: params?.metadataSnapshot,
				workspaceDir
			});
			let catalogKey = buildLoadModelCatalogStateCacheKey({
				agentDir,
				config: cfg,
				metadataSnapshot: params?.metadataSnapshot,
				sourceFingerprint: sourceFingerprint.fingerprint,
				workspaceDir
			});
			if (!readOnly && params?.useCache !== false) {
				const cached = readCachedAgentModelCatalog({
					agentDir,
					catalogKey
				});
				if (cached?.length) {
					logStage("state-cache-hit", `entries=${cached.length}`);
					return cached;
				}
			}
			if (!readOnly) {
				const preparedSource = await prepareOpenClawModelsJsonSource(cfg, agentDir, {
					pluginMetadataSnapshot: params?.metadataSnapshot,
					workspaceDir
				});
				const preparedCatalogKey = buildLoadModelCatalogStateCacheKey({
					agentDir,
					config: cfg,
					metadataSnapshot: params?.metadataSnapshot,
					sourceFingerprint: preparedSource.fingerprint,
					workspaceDir: preparedSource.workspaceDir ?? workspaceDir
				});
				logStage("models-json-ready");
				if (preparedCatalogKey !== catalogKey) {
					catalogKey = preparedCatalogKey;
					if (params?.useCache !== false) {
						const cached = readCachedAgentModelCatalog({
							agentDir,
							catalogKey
						});
						if (cached?.length) {
							logStage("state-cache-hit", `entries=${cached.length}`);
							return cached;
						}
					}
				}
			}
			const agentDiscovery = await importAgentDiscovery();
			logStage("agent-discovery-imported");
			const { buildShouldSuppressBuiltInModel } = await loadModelSuppression();
			logStage("catalog-deps-ready");
			const authStorage = agentDiscovery.discoverAuthStorage(agentDir, readOnly ? { readOnly: true } : void 0);
			logStage("auth-storage-ready");
			const registry = agentDiscovery.discoverModels(authStorage, agentDir, {
				pluginMetadataSnapshot: getManifestMetadataSnapshot(),
				workspaceDir
			});
			logStage("registry-ready");
			const entries = registry.getAll();
			logStage("registry-read", `entries=${entries.length}`);
			const shouldSuppressBuiltInModel = buildShouldSuppressBuiltInModel({ config: cfg });
			logStage("suppress-resolver-ready");
			for (const entry of entries) {
				const rawId = normalizeOptionalString(entry?.id) ?? "";
				if (!rawId) continue;
				const provider = normalizeOptionalString(entry?.provider) ?? "";
				if (!provider) continue;
				const id = normalizeConfiguredProviderCatalogModelId(provider, rawId, { manifestPlugins: getManifestPlugins() });
				if (shouldSuppressBuiltInModel({
					provider,
					id,
					baseUrl: normalizeOptionalString(entry?.baseUrl)
				})) continue;
				const name = normalizeOptionalString(entry?.name ?? id) || id;
				const contextWindow = typeof entry?.contextWindow === "number" && entry.contextWindow > 0 ? entry.contextWindow : void 0;
				const contextTokens = typeof entry?.contextTokens === "number" && entry.contextTokens > 0 ? entry.contextTokens : void 0;
				const reasoning = typeof entry?.reasoning === "boolean" ? entry.reasoning : void 0;
				const api = typeof entry?.api === "string" ? entry.api : void 0;
				const input = Array.isArray(entry?.input) ? entry.input : void 0;
				const modelParams = entry?.params && typeof entry.params === "object" ? entry.params : void 0;
				const compat = entry?.compat && typeof entry.compat === "object" ? entry.compat : void 0;
				models.push({
					id,
					name,
					provider,
					...api ? { api } : {},
					contextWindow,
					...contextTokens !== void 0 ? { contextTokens } : {},
					reasoning,
					input,
					...modelParams ? { params: modelParams } : {},
					compat
				});
			}
			mergeCatalogEntries(models, loadManifestModelCatalog({
				config: cfg,
				env: process.env,
				metadataSnapshot: getManifestMetadataSnapshot()
			}));
			logStage("manifest-models-merged", `entries=${models.length}`);
			const configuredModels = buildConfiguredModelCatalog({
				cfg,
				manifestPlugins: hasConfiguredProviderModelRows(cfg) ? getManifestPlugins() : void 0
			});
			let augmentEntries;
			if (configuredModels.length > 0) {
				const entriesForAugment = [...models];
				mergeCatalogEntries(entriesForAugment, configuredModels);
				augmentEntries = entriesForAugment;
			}
			logStage("configured-models-prepared", `entries=${models.length}`);
			if (!readOnly) {
				const { createProviderApiKeyResolver } = await loadProviderApiKeyResolver();
				let authStore;
				const resolveProviderApiKeyForProvider = createProviderApiKeyResolver(process.env, () => authStore ??= ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false }), cfg);
				const resolveProviderApiKey = (providerId) => providerId?.trim() ? resolveProviderApiKeyForProvider(providerId) : {
					apiKey: void 0,
					discoveryApiKey: void 0
				};
				const supplemental = await augmentModelCatalogWithProviderPlugins({
					config: cfg,
					env: process.env,
					context: {
						config: cfg,
						agentDir,
						env: process.env,
						resolveProviderApiKey,
						entries: augmentEntries ?? [...models]
					}
				});
				if (supplemental.length > 0) {
					const normalizedSupplemental = [];
					for (const entry of supplemental) normalizedSupplemental.push({
						...entry,
						id: normalizeConfiguredProviderCatalogModelId(entry.provider, entry.id, { manifestPlugins: getManifestPlugins() })
					});
					mergeCatalogEntries(models, normalizedSupplemental);
				}
			}
			logStage("plugin-models-merged", `entries=${models.length}`);
			if (configuredModels.length > 0) mergeCatalogEntries(models, configuredModels);
			logStage("configured-models-finalized", `entries=${models.length}`);
			if (models.length === 0) {
				if (useSharedCache) modelCatalogPromise = null;
			}
			const sorted = sortModels(models);
			if (!readOnly) writeCachedAgentModelCatalog({
				agentDir,
				catalogKey,
				entries: sorted
			});
			logStage("complete", `entries=${sorted.length}`);
			return sorted;
		} catch (error) {
			if (!hasLoggedModelCatalogError) {
				hasLoggedModelCatalogError = true;
				log.warn(`Failed to load model catalog: ${String(error)}`);
			}
			if (useSharedCache) modelCatalogPromise = null;
			if (models.length > 0) return sortModels(models);
			return [];
		}
	};
	if (readOnly || params?.metadataSnapshot) return loadCatalog();
	const loadGeneration = modelCatalogGeneration;
	const publishedPromise = loadCatalog().then((catalog) => {
		if (catalog.length > 0 && modelCatalogGeneration === loadGeneration && modelCatalogPromise === publishedPromise) {
			loadedModelCatalogSnapshot = catalog;
			loadedModelCatalogGeneration = loadGeneration;
		}
		return catalog;
	});
	modelCatalogPromise = publishedPromise;
	return publishedPromise;
}
/**
* Check if a model supports image input based on its catalog entry.
*/
function modelSupportsVision(entry) {
	return modelSupportsInput(entry, "image");
}
/**
* Check if a model supports native document/PDF input based on its catalog entry.
*/
function modelSupportsDocument(entry) {
	return modelSupportsInput(entry, "document");
}
//#endregion
export { resetModelCatalogCache as a, modelSupportsVision as i, loadModelCatalog as n, resetModelCatalogCacheForTest as o, modelSupportsDocument as r, setModelCatalogImportForTest as s, loadManifestModelCatalog as t };
