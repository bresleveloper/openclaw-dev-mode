import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../string-coerce-1VuiLaaR.mjs";
import { t as createLazyImportLoader } from "../lazy-promise-DGqyc4Y4.mjs";
import { M as parseAgentSessionKey } from "../session-key-CSDERtm3.mjs";
import { r as resolveAgentConfig, w as tryResolveAmbientOwnerAgentId } from "../agent-scope-config-fjA2T9Gz.mjs";
import { s as resolveAgentModelPrimaryValue } from "../model-input-CeM8o97s.mjs";
import "../defaults-Bg930vxE.mjs";
import { g as resolveConfiguredPrimaryProviderFallback, i as buildModelAliasIndex } from "../model-selection-shared-CVU_V2PQ.mjs";
import { n as findModelInCatalog } from "../model-catalog-lookup-BJKolYfz.mjs";
import { n as parseModelRef } from "../model-selection-normalize-DulZGI4S.mjs";
import { t as classifySessionKind } from "../classify-session-kind-BBHw4D98.mjs";
import { s as resolveStoredSessionKeyForAgentStore } from "../session-store-key-DKpto8R6.mjs";
import { t as resolveCurrentSessionAgentRuntimeMetadata } from "../agent-runtime-metadata-B5dnCB4A.mjs";
import { r as resolvePersistedSelectedModelRef } from "../model-selection-DdQ-ffuG.mjs";
import { i as resolveContextTokensForModelFromCache, n as resolveAuthoredModelContextTokens } from "../context-resolution-CKREdq15.mjs";
import { o as selectModelCatalogRuntimeEntry } from "../model-catalog-view-UkLRAY5C.mjs";
import { t as resolveModelContextWindowProfile } from "../model-context-window-CoR3Uyg1.mjs";
import { o as resolveEffectiveAgentRuntime } from "../thinking-runtime-DuxsJR5q.mjs";
import { t as readAcpSessionMetaForEntries } from "../session-meta-readonly-CHaonIQO.mjs";
import { n as resolveSessionStorePathForAcp } from "../session-meta-store-DksRcpO8.mjs";
import { n as getPreparedModelCatalogSnapshot } from "../prepared-model-catalog-B9Dr8wIV.mjs";
import "../session-meta-DC-FqIqd.mjs";
import { n as resolveAgentRuntimeLabel } from "../agent-runtime-label-X2Hryd-W.mjs";
//#region src/status/summary.runtime.ts
const staticModelCatalogResolverLoader = createLazyImportLoader(async () => {
	const modelCatalog = await import("../model.static-catalog-DF82iDu_.mjs");
	return {
		resolveManifestModel: modelCatalog.createBundledStaticCatalogModelResolver({ includeRuntimeDiscovery: true }),
		createProviderContextResolver: modelCatalog.createBundledProviderStaticCatalogContextResolver
	};
});
async function createStatusModelContextResolver(cfg) {
	const { resolveManifestModel, createProviderContextResolver } = await staticModelCatalogResolverLoader.load();
	const resolveProviderContext = createProviderContextResolver({ cfg });
	const modelContextCache = /* @__PURE__ */ new Map();
	return async (provider, model, agentId, runtimeId = "openclaw", sessionEntry) => {
		if (!provider || !model) return {};
		const ownerAgentId = agentId ?? tryResolveAmbientOwnerAgentId(cfg);
		const catalog = ownerAgentId ? getPreparedModelCatalogSnapshot({
			config: cfg,
			agentId: ownerAgentId,
			workspaceDir: sessionEntry?.spawnedWorkspaceDir
		}) : void 0;
		if (catalog) {
			const logicalEntry = findModelInCatalog(catalog.entries, provider, model);
			const entry = logicalEntry && selectModelCatalogRuntimeEntry({
				entry: logicalEntry,
				routeVariants: catalog.routeVariants,
				runtimeId,
				allowApiFallback: false
			}).entry;
			return {
				modelContextWindow: resolveModelContextWindowProfile({
					catalogEntry: entry,
					selected: sessionEntry?.contextWindow
				}).contextTokens,
				modelContextTokens: entry?.contextTokens
			};
		}
		if (runtimeId !== "openclaw" && runtimeId !== "auto" && runtimeId !== provider) return {};
		const key = `${provider}\0${model}`;
		const cached = modelContextCache.get(key);
		if (cached) return cached;
		const resolved = (async () => {
			try {
				const entry = resolveManifestModel({
					provider,
					modelId: model
				}) ?? await resolveProviderContext({
					provider,
					modelId: model
				});
				return {
					...entry?.contextWindow ? { modelContextWindow: entry.contextWindow } : {},
					...entry?.contextTokens ? { modelContextTokens: entry.contextTokens } : {}
				};
			} catch {
				return {};
			}
		})();
		modelContextCache.set(key, resolved);
		return resolved;
	};
}
function resolveStatusModelRefFromRaw(params) {
	const trimmed = params.rawModel.trim();
	if (!trimmed) return null;
	if (!trimmed.includes("/")) return buildModelAliasIndex({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: params.defaultProvider,
		allowManifestNormalization: false,
		allowPluginNormalization: false,
		manifestPlugins: []
	}).byAlias.get(normalizeLowercaseStringOrEmpty(trimmed))?.ref ?? {
		provider: params.defaultProvider,
		model: trimmed
	};
	return parseModelRef(trimmed, params.defaultProvider, {
		allowManifestNormalization: false,
		allowPluginNormalization: false
	});
}
function resolveConfiguredStatusModelRef(params) {
	const agentRawModel = params.agentId ? resolveAgentModelPrimaryValue(resolveAgentConfig(params.cfg, params.agentId)?.model) : void 0;
	for (const rawModel of [agentRawModel, resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model)]) if (rawModel) {
		const parsed = resolveStatusModelRefFromRaw({
			cfg: params.cfg,
			rawModel,
			defaultProvider: params.defaultProvider,
			agentId: params.agentId
		});
		if (parsed) return parsed;
	}
	const fallbackProvider = resolveConfiguredPrimaryProviderFallback({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		allowManifestNormalization: false,
		allowPluginNormalization: false
	});
	if (fallbackProvider) return fallbackProvider;
	return {
		provider: params.defaultProvider,
		model: params.defaultModel
	};
}
function resolveProviderlessPersistedStatusModelRef(params) {
	const provider = normalizeOptionalString(params.provider);
	const model = normalizeOptionalString(params.model);
	if (!model || provider || model.includes("/") || normalizeLowercaseStringOrEmpty(model) === "openrouter:auto") return null;
	return {
		provider: params.defaultProvider,
		model
	};
}
function resolveStatusModelLookupRef(params) {
	const provider = normalizeOptionalString(params.provider);
	const model = normalizeOptionalString(params.model);
	if (!model) return null;
	const defaultProvider = normalizeOptionalString(params.defaultProvider) ?? provider ?? "openai";
	const raw = provider ? `${provider}/${model}` : model;
	return parseModelRef(raw, defaultProvider, {
		allowManifestNormalization: false,
		allowPluginNormalization: false
	}) ?? {
		provider: provider ?? defaultProvider,
		model
	};
}
function resolveStatusModelComparisonLabel(params) {
	const ref = resolveStatusModelLookupRef(params);
	return ref ? `${ref.provider}/${ref.model}` : null;
}
function resolveSessionModelRef(resolved, entry) {
	const defaultProvider = resolved.provider || "openai";
	const providerlessPersisted = resolveProviderlessPersistedStatusModelRef({
		defaultProvider,
		provider: entry?.providerOverride,
		model: entry?.modelOverride
	}) ?? resolveProviderlessPersistedStatusModelRef({
		defaultProvider,
		provider: entry?.modelProvider,
		model: entry?.model
	});
	if (providerlessPersisted) return providerlessPersisted;
	return resolvePersistedSelectedModelRef({
		defaultProvider,
		runtimeProvider: entry?.modelProvider,
		runtimeModel: entry?.model,
		overrideProvider: entry?.providerOverride,
		overrideModel: entry?.modelOverride,
		allowManifestNormalization: false,
		allowPluginNormalization: false
	}) ?? resolved;
}
function resolveStatusAcpSession(params) {
	const acpSessionKey = params.agentId ? resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) : params.sessionKey;
	const { agentId: acpAgentId } = resolveSessionStorePathForAcp({
		cfg: params.cfg,
		sessionKey: acpSessionKey
	});
	return {
		sessionKey: acpSessionKey,
		agentId: acpAgentId
	};
}
async function readSessionRuntimeMetadata(cfg, candidates) {
	return readAcpSessionMetaForEntries({
		cfg,
		entries: candidates.map(({ sessionKey, entry }) => ({
			...resolveStatusAcpSession({
				cfg,
				sessionKey,
				agentId: parseAgentSessionKey(sessionKey)?.agentId
			}),
			entry
		}))
	});
}
function resolveSessionRuntime(params) {
	const { sessionKey: acpSessionKey, agentId: acpAgentId } = resolveStatusAcpSession(params);
	const { acpMeta } = params;
	const runtime = resolveCurrentSessionAgentRuntimeMetadata({
		cfg: params.cfg,
		agentId: params.agentId ?? acpAgentId,
		provider: params.provider,
		model: params.model,
		sessionKey: acpSessionKey,
		sessionEntry: params.entry,
		acpRuntime: acpMeta != null,
		acpBackend: acpMeta?.backend
	});
	const id = normalizeOptionalLowercaseString(runtime.id === "auto" ? resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		agentId: params.agentId ?? acpAgentId,
		provider: params.provider,
		modelId: params.model,
		sessionKey: acpSessionKey,
		sessionEntry: params.entry
	}) : runtime.id);
	const resolvedHarness = id && id !== "openclaw" && id !== "auto" ? id : void 0;
	return {
		id,
		label: resolveAgentRuntimeLabel({
			config: params.cfg,
			sessionEntry: params.entry,
			resolvedHarness,
			fallbackProvider: params.provider
		})
	};
}
const statusSummaryRuntime = {
	createStatusModelContextResolver,
	resolveAuthoredModelContextTokens,
	resolveContextTokensForModel: resolveContextTokensForModelFromCache,
	classifySessionKey: classifySessionKind,
	resolveSessionModelRef,
	resolveSessionRuntime,
	readSessionRuntimeMetadata,
	resolveConfiguredStatusModelRef,
	resolveStatusModelLookupRef,
	resolveStatusModelComparisonLabel
};
//#endregion
export { statusSummaryRuntime };
