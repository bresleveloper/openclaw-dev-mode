import { _ as resolvePrimaryStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-C5tDvNBc.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-D0kh4WcK.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import "./defaults-BbU4k6fu.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { n as parseModelRef } from "./model-selection-normalize-Dij_chYC.mjs";
import { n as resolveSubagentConfiguredModelSelection, t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import "./model-selection-resolve-D7hqOXrq.mjs";
import "./model-thinking-default-BQDdsH3k.mjs";
import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
//#region src/agents/model-selection-persisted.ts
function normalizePersistedDefaultProvider$1(value) {
	return normalizeOptionalString(value) ?? "openai";
}
function resolvePersistedOverrideModelRef(params) {
	const defaultProvider = normalizePersistedDefaultProvider$1(params.defaultProvider);
	const overrideProvider = normalizeOptionalString(params.overrideProvider);
	const overrideModel = normalizeOptionalString(params.overrideModel);
	if (!overrideModel) return null;
	if (params.routeResolution === "resolved") return {
		provider: overrideProvider ?? defaultProvider,
		model: overrideModel
	};
	const encodedOverride = overrideProvider ? `${overrideProvider}/${overrideModel}` : overrideModel;
	return parseModelRef(encodedOverride, defaultProvider, {
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	}) ?? {
		provider: overrideProvider || defaultProvider,
		model: overrideModel
	};
}
function normalizeStoredOverrideModel(params) {
	const providerOverride = normalizeOptionalString(params.providerOverride);
	const modelOverride = normalizeOptionalString(params.modelOverride);
	if (!providerOverride || !modelOverride || params.routeResolution === "resolved") return {
		providerOverride,
		modelOverride
	};
	const providerPrefix = `${providerOverride.toLowerCase()}/`;
	return {
		providerOverride,
		modelOverride: modelOverride.toLowerCase().startsWith(providerPrefix) ? modelOverride.slice(providerOverride.length + 1).trim() || modelOverride : modelOverride
	};
}
//#endregion
//#region src/plugins/setup-registry.runtime.ts
/** Metadata lookup helpers for plugin setup CLI backend descriptors. */
function resolveSetupCliBackendSnapshot(params = {}) {
	if (params.metadataSnapshot) return params.metadataSnapshot;
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	return resolvePluginMetadataSnapshot({
		...params.config ? { config: params.config } : {},
		env,
		...workspaceDir ? { workspaceDir } : {},
		allowWorkspaceScopedCurrent: true
	});
}
function resolvePluginSetupCliBackendDescriptor(params) {
	const normalized = normalizeProviderId(params.backend);
	const snapshot = resolveSetupCliBackendSnapshot(params);
	const pluginId = snapshot.owners.cliBackends.get(normalized)?.find((id) => isInstalledPluginEnabled(snapshot.index, id, params.config));
	const plugin = pluginId ? snapshot.byPluginId.get(pluginId) : void 0;
	if (!plugin) return;
	const backendId = [...plugin.cliBackends, ...plugin.setup?.cliBackends ?? []].find((id) => normalizeProviderId(id) === normalized);
	return backendId ? {
		pluginId: plugin.id,
		backend: { id: backendId }
	} : void 0;
}
/** Resolve enabled setup CLI backend ids from one metadata snapshot. */
function resolvePluginSetupCliBackendIds(params = {}) {
	const snapshot = resolveSetupCliBackendSnapshot(params);
	return snapshot.plugins.flatMap((plugin) => {
		const ids = plugin.cliBackends.concat(plugin.setup?.cliBackends ?? []);
		return ids.length > 0 && isInstalledPluginEnabled(snapshot.index, plugin.id, params.config) ? ids : [];
	});
}
//#endregion
//#region src/agents/model-selection-cli.ts
/** Prepare one CLI-provider lookup for request paths that classify multiple models. */
function prepareCliProviderClassifier(cfg) {
	const providers = new Set([...resolveRuntimeCliBackends("metadata").map((backend) => backend.id), ...resolvePluginSetupCliBackendIds({ config: cfg })].map(normalizeProviderId));
	return (provider) => providers.has(normalizeProviderId(provider));
}
/** Return true when a provider id resolves to a configured or plugin CLI backend. */
function isCliProvider(provider, cfg, metadataSnapshot) {
	const normalized = normalizeProviderId(provider);
	if (resolveRuntimeCliBackends("metadata").some((backend) => normalizeProviderId(backend.id) === normalized)) return true;
	if (resolvePluginSetupCliBackendDescriptor({
		backend: normalized,
		config: cfg,
		metadataSnapshot
	})) return true;
	return false;
}
//#endregion
//#region src/agents/model-selection.ts
/**
* Public model-selection facade for persisted, configured, and allowed refs.
*/
function normalizePersistedDefaultProvider(value) {
	return normalizeOptionalString(value) ?? "openai";
}
/**
* Runtime-first resolver for persisted model metadata.
* Use this when callers intentionally want the last executed model identity.
*/
function resolvePersistedModelRef(params) {
	const defaultProvider = normalizePersistedDefaultProvider(params.defaultProvider);
	const runtimeProvider = normalizeOptionalString(params.runtimeProvider);
	const runtimeModel = normalizeOptionalString(params.runtimeModel);
	if (runtimeModel) {
		if (runtimeProvider) return {
			provider: runtimeProvider,
			model: runtimeModel
		};
		return parseModelRef(runtimeModel, defaultProvider, params) ?? {
			provider: defaultProvider,
			model: runtimeModel
		};
	}
	return resolvePersistedOverrideModelRef({
		defaultProvider,
		overrideProvider: params.overrideProvider,
		overrideModel: params.overrideModel,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
}
/**
* Selected-model resolver for persisted model metadata.
* Use this for control/status/UI surfaces that should honor explicit session
* overrides before falling back to runtime identity.
*/
function resolvePersistedSelectedModelRef(params) {
	const override = resolvePersistedOverrideModelRef({
		...params,
		routeResolution: params.overrideRouteResolution
	});
	if (override) return override;
	return resolvePersistedModelRef({
		defaultProvider: params.defaultProvider,
		runtimeProvider: params.runtimeProvider,
		runtimeModel: params.runtimeModel,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
}
async function canonicalizeCaseOnlyCatalogModelRef(params) {
	const rawModel = normalizeOptionalString(params.raw);
	if (!rawModel) return;
	const split = splitTrailingAuthProfile(rawModel);
	if (shouldKeepProfileQualifiedModelRefRaw(split.profile, params.preserveAuthProfile)) return rawModel;
	if (!isCaseOnlyProviderModelRef(split.model)) return rawModel;
	const resolved = resolveModelRefFromString({
		cfg: params.cfg,
		raw: split.model,
		defaultProvider: params.defaultProvider,
		aliasIndex: params.aliasIndex,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization
	});
	if (!resolved) return rawModel;
	const entry = findModelInCatalog(await params.loadCatalog(), resolved.ref.provider, resolved.ref.model);
	return entry ? formatCatalogModelRef(entry, split.profile) : rawModel;
}
function hasExplicitProviderModelRef(raw) {
	const slash = raw.indexOf("/");
	return slash > 0 && slash < raw.length - 1;
}
function isCaseOnlyProviderModelRef(raw) {
	return hasExplicitProviderModelRef(raw) && raw !== raw.toLowerCase();
}
function shouldKeepProfileQualifiedModelRefRaw(profile, preserveAuthProfile) {
	return Boolean(profile && preserveAuthProfile === false);
}
function formatCatalogModelRef(entry, profile) {
	return appendAuthProfileSuffix(`${entry.provider}/${entry.id}`, profile);
}
function appendAuthProfileSuffix(modelRef, profile) {
	return profile ? `${modelRef}@${profile}` : modelRef;
}
/**
* Resolve a normalized model string through a pre-built alias index, returning
* a fully qualified `provider/model` string.  If the value is already qualified
* or not a known alias, returns it unchanged.
*/
function resolveModelThroughAliases(value, aliasIndex) {
	const { model, profile } = splitTrailingAuthProfile(value);
	if (model.includes("/")) return appendAuthProfileSuffix(model, profile);
	const aliasKey = normalizeLowercaseStringOrEmpty(model);
	const aliasMatch = aliasIndex.byAlias.get(aliasKey);
	if (aliasMatch) return appendAuthProfileSuffix(`${aliasMatch.ref.provider}/${aliasMatch.ref.model}`, profile);
	return appendAuthProfileSuffix(model, profile);
}
function resolveSubagentSpawnModelSelection(params) {
	const runtimeDefault = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const configured = resolveConfiguredSubagentSpawnModelSelection({
		cfg: params.cfg,
		agentId: params.agentId,
		modelOverride: params.modelOverride,
		defaultProvider: runtimeDefault.provider,
		includeAgentPrimary: !params.inheritedModel
	});
	if (configured) return { model: configured };
	if (params.inheritedModel) return {
		model: `${params.inheritedModel.provider}/${params.inheritedModel.model}`,
		resolvedModel: { ...params.inheritedModel }
	};
	return { model: resolveModelThroughAliases(resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model) ?? `${runtimeDefault.provider}/${runtimeDefault.model}`, buildModelAliasIndex({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: runtimeDefault.provider
	})) };
}
function resolveConfiguredSubagentSpawnModelSelection(params) {
	const raw = resolvePrimaryStringValue(params.modelOverride) ?? resolveSubagentConfiguredModelSelection({
		cfg: params.cfg,
		agentId: params.agentId,
		includeAgentPrimary: params.includeAgentPrimary
	});
	if (!raw) return;
	const defaultProvider = normalizeOptionalString(params.defaultProvider) ?? resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	}).provider;
	return resolveModelThroughAliases(raw, buildModelAliasIndex({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider
	}));
}
/** Default reasoning level when session/directive do not set it: "on" if model supports reasoning, else "off". */
function resolveReasoningDefault(params) {
	const key = modelKey(params.provider, params.model);
	return (params.catalog?.find((entry) => entry.provider === params.provider && entry.id === params.model || entry.provider === key && entry.id === params.model))?.reasoning === true ? "on" : "off";
}
//#endregion
export { resolveReasoningDefault as a, prepareCliProviderClassifier as c, resolvePersistedSelectedModelRef as i, normalizeStoredOverrideModel as l, resolveConfiguredSubagentSpawnModelSelection as n, resolveSubagentSpawnModelSelection as o, resolvePersistedModelRef as r, isCliProvider as s, canonicalizeCaseOnlyCatalogModelRef as t, resolvePersistedOverrideModelRef as u };
