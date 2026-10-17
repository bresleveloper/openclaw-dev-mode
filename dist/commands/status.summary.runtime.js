import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../string-coerce-1VuiLaaR.mjs";
import { r as resolveAgentConfig } from "../agent-scope-config-CDYpzA0r.mjs";
import { s as resolveAgentModelPrimaryValue } from "../model-input-C9K4a_6k.mjs";
import "../defaults-Jag53zwP.mjs";
import { g as resolveConfiguredPrimaryProviderFallback, i as buildModelAliasIndex } from "../model-selection-shared-DKlQ1p0S.mjs";
import { n as parseModelRef } from "../model-selection-normalize-AjjSfI-g.mjs";
import { r as resolvePersistedSelectedModelRef } from "../model-selection-D3_rVb38.mjs";
import { o as resolveStoredSessionKeyForAgentStore } from "../session-store-key-Ci099tm9.mjs";
import { t as classifySessionKind } from "../classify-session-kind-CT3WV_2y.mjs";
import { n as resolveSessionStorePathForAcp } from "../session-meta-store-C2kPc7n-.mjs";
import { n as readAcpSessionMetaForEntry } from "../session-meta-readonly-CvCR0QQG.mjs";
import "../session-meta-DUw-8Na0.mjs";
import { t as resolveCurrentSessionAgentRuntimeMetadata } from "../agent-runtime-metadata-BYpiZnNd.mjs";
import { i as resolveContextTokensForModelFromCache, n as resolveAuthoredModelContextTokens } from "../context-resolution-rBaR4T59.mjs";
import { c as waitForContextWindowCacheLoad } from "../context-DtziOKiU.mjs";
import { n as resolveAgentRuntimeLabel } from "../agent-runtime-label-D9Q95kGc.mjs";
//#region src/status/summary.runtime.ts
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
function resolveSessionRuntime(params) {
	const acpSessionKey = params.agentId ? resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) : params.sessionKey;
	const { agentId: acpAgentId } = resolveSessionStorePathForAcp({
		cfg: params.cfg,
		sessionKey: acpSessionKey
	});
	const acpMeta = readAcpSessionMetaForEntry({
		cfg: params.cfg,
		sessionKey: acpSessionKey,
		agentId: acpAgentId,
		entry: params.entry
	});
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
	const id = normalizeOptionalLowercaseString(runtime.id);
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
	waitForContextWindowCacheLoad,
	resolveAuthoredModelContextTokens,
	resolveContextTokensForModel: resolveContextTokensForModelFromCache,
	classifySessionKey: classifySessionKind,
	resolveSessionModelRef,
	resolveSessionRuntime,
	resolveConfiguredStatusModelRef,
	resolveStatusModelLookupRef,
	resolveStatusModelComparisonLabel
};
//#endregion
export { statusSummaryRuntime };
