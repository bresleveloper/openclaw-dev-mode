import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { i as resolveAgentModelPrimaryValue, o as toAgentModelListLike, r as resolveAgentModelFallbackValues } from "./model-input-BHKiDwaq.js";
import { d as resolveAgentModelFallbacksOverride, o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CDZXADgT.js";
import { r as resolveAgentConfig } from "./agent-scope-config-C3ijpoNo.js";
import { n as isInstalledPluginEnabled } from "./installed-plugin-index-C6bCYWRE.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-Dp5LgxH6.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-mDjiWzE5.js";
import { n as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-CDEoJIrS.js";
import { S as findModelInCatalog, _ as resolveConfiguredModelRef, b as resolveModelRefFromString, f as normalizeModelSelection, h as resolveAllowlistModelKey$1, i as buildModelAliasIndex, m as resolveAllowedModelRefFromAliasIndex, s as getModelRefStatusWithFallbackModels, t as buildAllowedModelSetWithFallbacks, v as resolveConfiguredOpenRouterCompatAlias } from "./model-selection-shared-CKMggJal.js";
import { c as parseModelRef, i as modelKey, o as normalizeProviderId$1 } from "./model-selection-normalize-Df7baLev.js";
import "./model-thinking-default-GwbGGXiw.js";
import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
import { createRequire } from "node:module";
createRequire(import.meta.url);
let cachedSetupCliBackendDescriptors;
function resolveMetadataSnapshotForSetupCliBackends(params = {}) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	return {
		snapshot: resolvePluginMetadataSnapshot({
			config: params.config ?? {},
			env,
			...workspaceDir !== void 0 ? {
				workspaceDir,
				allowWorkspaceScopedCurrent: true
			} : {}
		}),
		cacheable: true
	};
}
function resolveSetupCliBackendDescriptors(params = {}) {
	const { snapshot, cacheable } = resolveMetadataSnapshotForSetupCliBackends(params);
	const configFingerprint = snapshot.configFingerprint;
	if (cacheable && configFingerprint && cachedSetupCliBackendDescriptors?.configFingerprint === configFingerprint) return cachedSetupCliBackendDescriptors.entries;
	const entries = snapshot.plugins.flatMap((plugin) => {
		if (!isInstalledPluginEnabled(snapshot.index, plugin.id)) return [];
		return [...plugin.cliBackends, ...plugin.setup?.cliBackends ?? []].map((backendId) => ({
			pluginId: plugin.id,
			backend: { id: backendId }
		}));
	});
	if (cacheable && configFingerprint) cachedSetupCliBackendDescriptors = {
		configFingerprint,
		entries
	};
	return entries;
}
function resolvePluginSetupCliBackendDescriptor(params) {
	const normalized = normalizeProviderId(params.backend);
	return resolveSetupCliBackendDescriptors(params).find((entry) => normalizeProviderId(entry.backend.id) === normalized);
}
//#endregion
//#region src/agents/model-selection-cli.ts
/** Return true when a provider id resolves to a configured or plugin CLI backend. */
function isCliProvider(provider, cfg) {
	const normalized = normalizeProviderId$1(provider);
	const backends = cfg?.agents?.defaults?.cliBackends ?? {};
	if (Object.keys(backends).some((key) => normalizeProviderId$1(key) === normalized)) return true;
	if (resolveRuntimeCliBackends().some((backend) => normalizeProviderId$1(backend.id) === normalized)) return true;
	if (resolvePluginSetupCliBackendDescriptor({
		backend: normalized,
		config: cfg
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
function resolvePersistedOverrideModelRef(params) {
	const defaultProvider = normalizePersistedDefaultProvider(params.defaultProvider);
	const overrideProvider = normalizeOptionalString(params.overrideProvider);
	const overrideModel = normalizeOptionalString(params.overrideModel);
	if (!overrideModel) return null;
	return parseModelRef(overrideProvider ? `${overrideProvider}/${overrideModel}` : overrideModel, defaultProvider, { allowPluginNormalization: params.allowPluginNormalization }) ?? {
		provider: overrideProvider || defaultProvider,
		model: overrideModel
	};
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
		return parseModelRef(runtimeModel, defaultProvider, { allowPluginNormalization: params.allowPluginNormalization }) ?? {
			provider: defaultProvider,
			model: runtimeModel
		};
	}
	return resolvePersistedOverrideModelRef({
		defaultProvider,
		overrideProvider: params.overrideProvider,
		overrideModel: params.overrideModel,
		allowPluginNormalization: params.allowPluginNormalization
	});
}
/**
* Selected-model resolver for persisted model metadata.
* Use this for control/status/UI surfaces that should honor explicit session
* overrides before falling back to runtime identity.
*/
function resolvePersistedSelectedModelRef(params) {
	const override = resolvePersistedOverrideModelRef({
		defaultProvider: params.defaultProvider,
		overrideProvider: params.overrideProvider,
		overrideModel: params.overrideModel,
		allowPluginNormalization: params.allowPluginNormalization
	});
	if (override) return override;
	return resolvePersistedModelRef({
		defaultProvider: params.defaultProvider,
		runtimeProvider: params.runtimeProvider,
		runtimeModel: params.runtimeModel,
		allowPluginNormalization: params.allowPluginNormalization
	});
}
function normalizeStoredOverrideModel(params) {
	const providerOverride = normalizeOptionalString(params.providerOverride);
	const modelOverride = normalizeOptionalString(params.modelOverride);
	if (!providerOverride || !modelOverride) return {
		providerOverride,
		modelOverride
	};
	const providerPrefix = `${providerOverride.toLowerCase()}/`;
	return {
		providerOverride,
		modelOverride: modelOverride.toLowerCase().startsWith(providerPrefix) ? modelOverride.slice(providerOverride.length + 1).trim() || modelOverride : modelOverride
	};
}
function resolveAllowlistModelKey(raw, defaultProvider, cfg, manifestPlugins) {
	return resolveAllowlistModelKey$1({
		cfg,
		raw,
		defaultProvider,
		manifestPlugins
	});
}
function resolveDefaultModelForAgent(params) {
	const agentModelOverride = params.agentId ? resolveAgentEffectiveModelPrimary(params.cfg, params.agentId) : void 0;
	return resolveConfiguredModelRef({
		cfg: agentModelOverride && agentModelOverride.length > 0 ? {
			...params.cfg,
			agents: {
				...params.cfg.agents,
				defaults: {
					...params.cfg.agents?.defaults,
					model: {
						...toAgentModelListLike(params.cfg.agents?.defaults?.model),
						primary: agentModelOverride
					}
				}
			}
		} : params.cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
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
function resolveAllowedFallbacks(params) {
	if (params.agentId) {
		const override = resolveAgentModelFallbacksOverride(params.cfg, params.agentId);
		if (override !== void 0) return override;
	}
	return resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
}
function resolveSubagentConfiguredModelSelection(params) {
	const agentConfig = resolveAgentConfig(params.cfg, params.agentId);
	return normalizeModelSelection(agentConfig?.subagents?.model) ?? normalizeModelSelection(params.cfg.agents?.defaults?.subagents?.model) ?? (params.includeAgentPrimary === false ? void 0 : normalizeModelSelection(agentConfig?.model));
}
/**
* Resolve a normalized model string through a pre-built alias index, returning
* a fully qualified `provider/model` string.  If the value is already qualified
* or not a known alias, returns it unchanged.
*/
function resolveModelThroughAliases(value, aliasIndex) {
	if (value.includes("/")) return value;
	const aliasKey = normalizeLowercaseStringOrEmpty(value);
	const aliasMatch = aliasIndex.byAlias.get(aliasKey);
	if (aliasMatch) return `${aliasMatch.ref.provider}/${aliasMatch.ref.model}`;
	return value;
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
		defaultProvider: runtimeDefault.provider
	});
	if (configured) return configured;
	return resolveModelThroughAliases(normalizeModelSelection(resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model)) ?? `${runtimeDefault.provider}/${runtimeDefault.model}`, buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: runtimeDefault.provider
	}));
}
function resolveConfiguredSubagentSpawnModelSelection(params) {
	const raw = normalizeModelSelection(params.modelOverride) ?? resolveSubagentConfiguredModelSelection({
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
		defaultProvider
	}));
}
function buildAllowedModelSet(params) {
	return buildAllowedModelSetWithFallbacks({
		cfg: params.cfg,
		catalog: params.catalog,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		fallbackModels: resolveAllowedFallbacks({
			cfg: params.cfg,
			agentId: params.agentId
		}),
		manifestPlugins: params.manifestPlugins
	});
}
function getModelRefStatus(params) {
	return getModelRefStatusWithFallbackModels({
		cfg: params.cfg,
		catalog: params.catalog,
		ref: params.ref,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		fallbackModels: resolveAllowedFallbacks({ cfg: params.cfg }),
		manifestPlugins: params.manifestPlugins
	});
}
function getModelRefStatusForResolve(params, ref) {
	return getModelRefStatus({
		cfg: params.cfg,
		catalog: params.catalog,
		ref,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		manifestPlugins: params.manifestPlugins
	});
}
function resolveAllowedModelRef(params) {
	const trimmed = params.raw.trim();
	if (!trimmed) return { error: "invalid model: empty" };
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		manifestPlugins: params.manifestPlugins
	});
	const openrouterCompatRef = resolveConfiguredOpenRouterCompatAlias({
		cfg: params.cfg,
		raw: trimmed,
		defaultProvider: params.defaultProvider,
		manifestPlugins: params.manifestPlugins
	});
	if (openrouterCompatRef) {
		const status = getModelRefStatusForResolve(params, openrouterCompatRef);
		if (!status.allowed) return { error: `model not allowed: ${status.key}` };
		return {
			ref: openrouterCompatRef,
			key: status.key
		};
	}
	return resolveAllowedModelRefFromAliasIndex({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: params.defaultProvider,
		aliasIndex,
		manifestPlugins: params.manifestPlugins,
		getStatus: (ref) => getModelRefStatusForResolve(params, ref)
	});
}
/** Default reasoning level when session/directive do not set it: "on" if model supports reasoning, else "off". */
function resolveReasoningDefault(params) {
	const key = modelKey(params.provider, params.model);
	return (params.catalog?.find((entry) => entry.provider === params.provider && entry.id === params.model || entry.provider === key && entry.id === params.model))?.reasoning === true ? "on" : "off";
}
//#endregion
export { resolveAllowedModelRef as a, resolveDefaultModelForAgent as c, resolvePersistedSelectedModelRef as d, resolveReasoningDefault as f, isCliProvider as h, normalizeStoredOverrideModel as i, resolvePersistedModelRef as l, resolveSubagentSpawnModelSelection as m, canonicalizeCaseOnlyCatalogModelRef as n, resolveAllowlistModelKey as o, resolveSubagentConfiguredModelSelection as p, getModelRefStatus as r, resolveConfiguredSubagentSpawnModelSelection as s, buildAllowedModelSet as t, resolvePersistedOverrideModelRef as u };
