import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../string-coerce-CIXf7egm.mjs";
import { r as resolveAgentConfig } from "../agent-scope-config-IQKOEtZ4.mjs";
import "../defaults-BbU4k6fu.mjs";
import { s as resolveAgentModelPrimaryValue } from "../model-input-DKxKaZGG.mjs";
import { g as resolveConfiguredPrimaryProviderFallback } from "../model-selection-shared-0uvJbX1M.mjs";
import { n as parseModelRef } from "../model-selection-normalize-Dij_chYC.mjs";
import { i as resolvePersistedSelectedModelRef } from "../model-selection-CaFyCMqp.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "../session-store-key-BoleEY7N.mjs";
import { n as resolveSessionStorePathForAcp } from "../session-meta-store-C-jzXDgm.mjs";
import { t as classifySessionKind } from "../classify-session-kind-BOSciWMV.mjs";
import "../session-meta-BxRb6CVY.mjs";
import { t as readAcpSessionMetaForEntry } from "../session-meta-readonly-CY2eWmkz.mjs";
import { t as resolveCurrentSessionAgentRuntimeMetadata } from "../agent-runtime-metadata-ByGRIRPi.mjs";
import { c as resolveAuthoredModelContextTokens, u as resolveContextTokensForModelFromCache } from "../context-resolution-D64R_bgD.mjs";
import { s as waitForContextWindowCacheLoad } from "../context-BNGdirIS.mjs";
import { t as resolveAgentRuntimeLabel } from "../agent-runtime-label-DB2U4nbv.mjs";
//#region src/status/summary.runtime.ts
function resolveStatusModelRefFromRaw(params) {
	const trimmed = params.rawModel.trim();
	if (!trimmed) return null;
	const configuredModels = params.cfg.agents?.defaults?.models ?? {};
	if (!trimmed.includes("/")) {
		const aliasKey = normalizeLowercaseStringOrEmpty(trimmed);
		for (const [modelKey, entry] of Object.entries(configuredModels)) {
			const aliasValue = entry?.alias;
			const alias = normalizeOptionalString(aliasValue) ?? "";
			if (!alias || normalizeOptionalLowercaseString(alias) !== aliasKey) continue;
			const parsed = parseModelRef(modelKey, params.defaultProvider, {
				allowManifestNormalization: false,
				allowPluginNormalization: false
			});
			if (parsed) return parsed;
		}
		return {
			provider: params.defaultProvider,
			model: trimmed
		};
	}
	return parseModelRef(trimmed, params.defaultProvider, {
		allowManifestNormalization: false,
		allowPluginNormalization: false
	});
}
function resolveConfiguredStatusModelRef(params) {
	const agentRawModel = params.agentId ? resolveAgentModelPrimaryValue(resolveAgentConfig(params.cfg, params.agentId)?.model) : void 0;
	if (agentRawModel) {
		const parsed = resolveStatusModelRefFromRaw({
			cfg: params.cfg,
			rawModel: agentRawModel,
			defaultProvider: params.defaultProvider
		});
		if (parsed) return parsed;
	}
	const defaultsRawModel = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model);
	if (defaultsRawModel) {
		const parsed = resolveStatusModelRefFromRaw({
			cfg: params.cfg,
			rawModel: defaultsRawModel,
			defaultProvider: params.defaultProvider
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
