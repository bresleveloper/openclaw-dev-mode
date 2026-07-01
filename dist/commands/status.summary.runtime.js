import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "../string-coerce-DW4mBlAt.js";
import { i as resolveAgentModelPrimaryValue } from "../model-input-BHKiDwaq.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "../defaults-mDjiWzE5.js";
import { at as resolveStoredSessionKeyForAgentStore } from "../store-DJ7wx5_V.js";
import { t as resolveConfiguredProviderFallback } from "../configured-provider-fallback-Crd282ov.js";
import { c as parseModelRef } from "../model-selection-normalize-Df7baLev.js";
import { d as resolvePersistedSelectedModelRef } from "../model-selection-i8V2iTdL.js";
import { r as readAcpSessionMeta } from "../session-meta-SVmmuxkv.js";
import { t as resolveModelAgentRuntimeMetadata } from "../agent-runtime-metadata-DjPe21q4.js";
import { a as resolveContextTokensForModelFromCache } from "../context-resolution-BbxgfsS4.js";
import { t as classifySessionKind } from "../classify-session-kind-CrP03QGt.js";
import { t as resolveAgentRuntimeLabel } from "../agent-runtime-label-DcYHUvFG.js";
//#region src/commands/status.summary.runtime.ts
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
			const parsed = parseModelRef(modelKey, params.defaultProvider, { allowPluginNormalization: false });
			if (parsed) return parsed;
		}
		return {
			provider: params.defaultProvider,
			model: trimmed
		};
	}
	return parseModelRef(trimmed, params.defaultProvider, { allowPluginNormalization: false });
}
function resolveConfiguredStatusModelRef(params) {
	const agentRawModel = params.agentId ? resolveAgentModelPrimaryValue(params.cfg.agents?.list?.find((entry) => entry?.id === params.agentId)?.model) : void 0;
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
	const fallbackProvider = resolveConfiguredProviderFallback({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider
	});
	if (fallbackProvider) return fallbackProvider;
	return {
		provider: params.defaultProvider,
		model: params.defaultModel
	};
}
function resolveSessionModelRef(cfg, entry, agentId) {
	const resolved = resolveConfiguredStatusModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		agentId
	});
	return resolvePersistedSelectedModelRef({
		defaultProvider: resolved.provider || "openai",
		runtimeProvider: entry?.modelProvider,
		runtimeModel: entry?.model,
		overrideProvider: entry?.providerOverride,
		overrideModel: entry?.modelOverride,
		allowPluginNormalization: false
	}) ?? resolved;
}
function resolveSessionRuntimeLabel(params) {
	const acpSessionKey = params.agentId ? resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) : params.sessionKey;
	const acpMeta = readAcpSessionMeta({ sessionKey: acpSessionKey });
	const id = normalizeOptionalLowercaseString(resolveModelAgentRuntimeMetadata({
		cfg: params.cfg,
		agentId: params.agentId ?? "",
		provider: params.provider,
		model: params.model,
		sessionKey: acpSessionKey,
		acpRuntime: acpMeta != null,
		acpBackend: acpMeta?.backend
	}).id);
	const resolvedHarness = id && id !== "openclaw" && id !== "auto" ? id : void 0;
	return resolveAgentRuntimeLabel({
		config: params.cfg,
		sessionEntry: params.entry,
		resolvedHarness,
		fallbackProvider: params.provider
	});
}
const statusSummaryRuntime = {
	resolveContextTokensForModel: resolveContextTokensForModelFromCache,
	classifySessionKey: classifySessionKind,
	resolveSessionModelRef,
	resolveSessionRuntimeLabel,
	resolveConfiguredStatusModelRef
};
//#endregion
export { statusSummaryRuntime };
