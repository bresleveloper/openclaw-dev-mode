import { d as getProviderRegistryIndex } from "./model-ref-shared-BRJ3VRZV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as buildModelCatalogMergeKey } from "./model-catalog-refs-D3xvQZh0.mjs";
import { r as loadPluginManifest } from "./manifest-gUPkNRN0.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-BWMrcMOM.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-BqtrPPLI.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-Ag5B94I6.mjs";
import { n as resolveConfiguredModelEntries } from "./configured-model-entries-BnlVcGcZ.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/models/provider-aliases.ts
const sourcePeerModelCatalogCache = /* @__PURE__ */ new Map();
function resolveSourcePeerPluginRoot(plugin) {
	if (plugin.origin !== "bundled") return;
	const parts = path.resolve(plugin.rootDir).split(path.sep);
	const pluginDirName = parts.at(-1);
	const extensionsDirName = parts.at(-2);
	const buildDirName = parts.at(-3);
	if (pluginDirName !== plugin.id || extensionsDirName !== "extensions" || buildDirName !== "dist" && buildDirName !== "dist-runtime") return;
	const packageRoot = parts.slice(0, -3).join(path.sep) || path.sep;
	const sourceRoot = path.join(packageRoot, "extensions", plugin.id);
	return fs.existsSync(path.join(sourceRoot, "openclaw.plugin.json")) ? sourceRoot : void 0;
}
function loadSourcePeerModelCatalog(plugin) {
	const cacheKey = path.resolve(plugin.rootDir);
	const cached = sourcePeerModelCatalogCache.get(cacheKey);
	if (cached !== void 0) return cached ?? void 0;
	const sourceRoot = resolveSourcePeerPluginRoot(plugin);
	const loaded = sourceRoot ? loadPluginManifest(sourceRoot, false) : void 0;
	const modelCatalog = loaded?.ok && loaded.manifest.id === plugin.id ? loaded.manifest.modelCatalog ?? null : null;
	sourcePeerModelCatalogCache.set(cacheKey, modelCatalog);
	return modelCatalog ?? void 0;
}
function collectModelCatalogAliases(aliases, modelCatalog) {
	for (const [aliasProvider, target] of Object.entries(modelCatalog?.aliases ?? {})) {
		const alias = normalizeProviderId(aliasProvider);
		const provider = normalizeProviderId(target.provider);
		if (alias && provider) aliases.set(alias, provider);
	}
}
function buildProviderAliasMap(params) {
	const aliases = /* @__PURE__ */ new Map();
	const plugins = params.metadataSnapshot?.manifestRegistry.plugins ?? loadPluginManifestRegistryCore({ config: params.cfg }).plugins;
	for (const plugin of plugins) {
		collectModelCatalogAliases(aliases, plugin.modelCatalog);
		if (Object.keys(plugin.modelCatalog?.aliases ?? {}).length === 0 && plugin.origin === "bundled") collectModelCatalogAliases(aliases, loadSourcePeerModelCatalog(plugin));
	}
	return aliases;
}
function createModelCatalogProviderAliasCanonicalizer(params) {
	const aliases = buildProviderAliasMap(params);
	const provider = (providerId) => {
		const normalizedProvider = normalizeProviderId(providerId);
		return aliases.get(normalizedProvider) ?? normalizedProvider;
	};
	return {
		provider,
		ref: (ref) => {
			const canonicalProvider = provider(ref.provider);
			return canonicalProvider === ref.provider ? ref : {
				...ref,
				provider: canonicalProvider
			};
		}
	};
}
//#endregion
//#region src/commands/models/model-reference-validation.ts
function createModelReferenceInspector(params) {
	const snapshot = params.metadataSnapshot ?? loadManifestMetadataSnapshot({
		config: params.cfg,
		env: params.env ?? process.env,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	const runtimeRegistry = getPluginRuntimeGenerationRegistry();
	const knownProviders = new Set([
		...runtimeRegistry ? getProviderRegistryIndex(runtimeRegistry.providers).refs.keys() : [],
		...snapshot.owners.providers.keys(),
		...snapshot.owners.modelCatalogProviders.keys(),
		...snapshot.owners.cliBackends.keys(),
		...Object.keys(params.cfg.models?.providers ?? {})
	].map(normalizeProviderId).filter(Boolean));
	const knownModels = /* @__PURE__ */ new Set();
	const cataloguedProviders = /* @__PURE__ */ new Set();
	for (const row of planEffectiveModelCatalogRows({
		registry: snapshot.manifestRegistry,
		config: params.cfg
	}).rows) {
		knownModels.add(row.mergeKey);
		cataloguedProviders.add(normalizeProviderId(row.provider));
	}
	for (const [provider, providerConfig] of Object.entries(params.cfg.models?.providers ?? {})) for (const model of providerConfig.models ?? []) {
		knownModels.add(buildModelCatalogMergeKey(provider, model.id));
		cataloguedProviders.add(normalizeProviderId(provider));
	}
	const inspect = (candidate) => {
		const provider = normalizeProviderId(candidate.provider);
		const model = candidate.model.trim();
		const ref = `${provider}/${model}`;
		if (!knownProviders.has(provider)) return {
			ref,
			provider,
			model,
			status: params.providerRegistryAvailable === false || snapshot.plugins.length === 0 ? "unverified-provider" : "unknown-provider"
		};
		if (knownModels.has(buildModelCatalogMergeKey(provider, model))) return {
			ref,
			provider,
			model,
			status: "known"
		};
		return {
			ref,
			provider,
			model,
			status: cataloguedProviders.has(provider) ? "unknown-model" : "uncatalogued-provider"
		};
	};
	return {
		inspect,
		snapshot
	};
}
/** Classifies a resolved model ref without loading provider runtimes or making network calls. */
function inspectModelReference(params) {
	return createModelReferenceInspector(params).inspect(params.ref);
}
/** Inspects every default/fallback/image/configured model entry for Doctor. */
function inspectConfiguredModelReferences(params) {
	const { inspect, snapshot } = createModelReferenceInspector(params);
	const canonicalizer = createModelCatalogProviderAliasCanonicalizer({
		cfg: params.cfg,
		metadataSnapshot: snapshot
	});
	return resolveConfiguredModelEntries({
		cfg: params.cfg,
		allowPluginNormalization: false,
		canonicalizeRef: canonicalizer.ref
	}).entries.map((entry) => Object.assign(inspect(entry.ref), { active: [...entry.tags].some((tag) => tag !== "configured") }));
}
//#endregion
export { inspectModelReference as n, createModelCatalogProviderAliasCanonicalizer as r, inspectConfiguredModelReferences as t };
