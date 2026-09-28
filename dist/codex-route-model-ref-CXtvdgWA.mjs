import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import "./session-key-CBvmC8zz.mjs";
import { a as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-BgRrSHjn.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { g as resolveConfiguredPrimaryProviderFallback } from "./model-selection-shared-0uvJbX1M.mjs";
import { t as configuredModelRouteNeedsCodex } from "./codex-plugin-diagnostics-CJT1Rh3i.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-BohvVKP0.mjs";
//#region src/config/legacy-codex-provider.ts
/** Provider spellings accepted only by legacy migration boundaries. */
const LEGACY_CODEX_PROVIDER_IDS = /* @__PURE__ */ new Set(["codex", "openai-codex"]);
function isLegacyCodexProviderId(provider) {
	const normalized = normalizeOptionalLowercaseString(provider);
	return normalized ? LEGACY_CODEX_PROVIDER_IDS.has(normalized) : false;
}
//#endregion
//#region src/commands/doctor/shared/codex-route-model-ref.ts
function normalizeRuntimeString(value) {
	return normalizeOptionalAgentRuntimeId(value);
}
function asAgentRuntimePolicyConfig(value) {
	const record = asOptionalRecord(value);
	return record ? { id: typeof record.id === "string" ? record.id : void 0 } : void 0;
}
function readLegacyDefaultsRuntime(defaults) {
	return asAgentRuntimePolicyConfig(asOptionalRecord(defaults)?.agentRuntime);
}
function legacyCodexProviderIdentityKey(providerId) {
	const normalized = normalizeOptionalLowercaseString(providerId);
	return normalized && isLegacyCodexProviderId(normalized) ? `${normalized}\u0000` : void 0;
}
function legacyCodexModelIdentityKey(params) {
	const providerId = normalizeOptionalLowercaseString(params.providerId);
	if (!providerId || !isLegacyCodexProviderId(providerId) || typeof params.modelId !== "string") return;
	const modelId = splitTrailingAuthProfile(params.modelId).model.trim();
	if (!modelId) return;
	const slash = modelId.indexOf("/");
	const unscopedModelId = slash > 0 && isLegacyCodexProviderId(normalizeOptionalLowercaseString(modelId.slice(0, slash)) ?? "") ? modelId.slice(slash + 1).trim() : modelId;
	return unscopedModelId ? `${providerId}\u0000${unscopedModelId}` : void 0;
}
function legacyCodexModelRefIdentityKey(modelRef) {
	if (typeof modelRef !== "string") return;
	const model = splitTrailingAuthProfile(modelRef).model.trim();
	const slash = model.indexOf("/");
	if (slash <= 0) return;
	return legacyCodexModelIdentityKey({
		providerId: model.slice(0, slash),
		modelId: model.slice(slash + 1)
	});
}
function isBlockedLegacyCodexModelRef(params) {
	const identity = legacyCodexModelRefIdentityKey(params.modelRef);
	if (!identity || !params.blockedModelIdentities) return false;
	const separator = identity.indexOf("\0");
	const providerIdentity = separator >= 0 ? identity.slice(0, separator + 1) : void 0;
	return params.blockedModelIdentities.has(identity) || Boolean(providerIdentity && params.blockedModelIdentities.has(providerIdentity));
}
function isBlockedLegacyCodexModelPair(params) {
	if (!params.blockedModelIdentities) return false;
	const providerIdentity = legacyCodexProviderIdentityKey(params.providerId);
	const modelIdentity = legacyCodexModelIdentityKey(params);
	return Boolean(providerIdentity && params.blockedModelIdentities.has(providerIdentity)) || Boolean(modelIdentity && params.blockedModelIdentities.has(modelIdentity));
}
function readLegacyCodexModelId(model) {
	if (typeof model !== "string") return;
	const trimmed = model.trim();
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || !isLegacyCodexProviderId(normalizeOptionalLowercaseString(trimmed.slice(0, slash)) ?? "")) return;
	return trimmed.slice(slash + 1).trim() || void 0;
}
function isOpenAICodexModelRef(model) {
	return readLegacyCodexModelId(model) !== void 0;
}
function isOpenAICodexAuthProfileRef(profile) {
	const normalized = normalizeOptionalLowercaseString(profile);
	const separator = normalized?.indexOf(":") ?? -1;
	return separator > 0 && isLegacyCodexProviderId(normalized?.slice(0, separator) ?? "");
}
function isProviderlessModelRef(model) {
	const normalized = normalizeOptionalLowercaseString(model);
	return Boolean(normalized && !normalized.includes("/"));
}
function toCanonicalOpenAIModelRef(model) {
	const modelId = readLegacyCodexModelId(model);
	return modelId ? `openai/${modelId}` : void 0;
}
function toOpenAIModelId(model) {
	return readLegacyCodexModelId(model);
}
function resolveRuntime(params) {
	return normalizeRuntimeString(params.agentRuntime?.id) ?? normalizeRuntimeString(params.defaultsRuntime?.id);
}
function readModelConfigPrimaryRef(value) {
	if (typeof value === "string") return value.trim() || void 0;
	const record = asOptionalRecord(value);
	if (typeof record?.primary === "string") return record.primary.trim() || void 0;
}
function readAgentPrimaryModelRef(agent, fallback) {
	const record = asOptionalRecord(agent);
	if (!record) return fallback;
	return readModelConfigPrimaryRef(record.model) ?? fallback;
}
function modelRefUsesCodexRuntime(params) {
	const effectiveModelRef = params.modelRef?.trim() || `openai/gpt-6-astra`;
	if (isOpenAICodexModelRef(effectiveModelRef)) return true;
	return canonicalOpenAIModelUsesCodexRuntime({
		cfg: params.cfg,
		modelRef: resolveRuntimeModelRef({
			cfg: params.cfg,
			modelRef: effectiveModelRef,
			agentId: params.agentId
		}),
		agentId: params.agentId,
		env: params.env
	});
}
function resolveRuntimeModelRef(params) {
	const effectiveModelRef = normalizeProviderModelRefAuthProfile(params.modelRef) ?? `openai/gpt-6-astra`;
	const legacyCodexModel = toCanonicalOpenAIModelRef(effectiveModelRef);
	if (legacyCodexModel) return legacyCodexModel;
	return resolveKnownCompatModelAliasRef(effectiveModelRef) ?? resolveConfiguredModelAliasRef({
		cfg: params.cfg,
		modelRef: effectiveModelRef,
		agentId: params.agentId
	}) ?? resolveConfiguredBareModelRef({
		cfg: params.cfg,
		modelRef: effectiveModelRef,
		agentId: params.agentId
	}) ?? normalizeDefaultProviderModelRef(effectiveModelRef, resolveDefaultProviderForAliasContext({
		cfg: params.cfg,
		agentId: params.agentId
	}));
}
function normalizeProviderModelRefAuthProfile(modelRef) {
	const trimmed = modelRef.trim();
	if (!trimmed) return;
	return splitTrailingAuthProfile(trimmed).model || trimmed;
}
function resolveKnownCompatModelAliasRef(modelRef) {
	const normalized = normalizeOptionalLowercaseString(modelRef);
	if (!normalized?.startsWith("openrouter:")) return;
	const modelId = normalized.slice(11).trim();
	return modelId ? `openrouter/openrouter/${modelId}` : void 0;
}
function resolveConfiguredModelAliasRef(params) {
	const aliasKey = normalizeOptionalLowercaseString(params.modelRef);
	if (!aliasKey) return;
	const defaultProvider = resolveDefaultProviderForAliasContext({
		cfg: params.cfg,
		agentId: params.agentId
	});
	return resolveAliasFromModelsMap(asOptionalRecord(params.cfg.agents?.defaults?.models), aliasKey, defaultProvider);
}
function resolveDefaultProviderForAliasContext(params) {
	const primaryModelRef = readModelConfigPrimaryRef(findAgentById(params.cfg, params.agentId)?.model) ?? readModelConfigPrimaryRef(params.cfg.agents?.defaults?.model);
	if (primaryModelRef) {
		const effectivePrimaryModelRef = normalizeProviderModelRefAuthProfile(primaryModelRef) ?? primaryModelRef;
		const legacyCodexModel = toCanonicalOpenAIModelRef(effectivePrimaryModelRef);
		const compatModelRef = resolveKnownCompatModelAliasRef(effectivePrimaryModelRef);
		const parsed = parseCodexRouteModelRef(resolveAliasFromModelsMap(asOptionalRecord(params.cfg.agents?.defaults?.models), normalizeOptionalLowercaseString(effectivePrimaryModelRef) ?? "", "openai") ?? compatModelRef ?? legacyCodexModel ?? effectivePrimaryModelRef) ?? parseCodexRouteModelRef(resolveConfiguredBareModelRef({
			cfg: params.cfg,
			modelRef: effectivePrimaryModelRef,
			agentId: params.agentId
		}) ?? "");
		return normalizeProviderId(parsed?.provider ?? "openai") || "openai";
	}
	const implicit = parseCodexRouteModelRef(resolveImplicitDefaultAgentModelRef(params.cfg, params.agentId));
	return normalizeProviderId(implicit?.provider ?? "openai") || "openai";
}
function findAgentById(cfg, agentId) {
	if (!agentId) return;
	const normalizedAgentId = normalizeAgentId(agentId);
	return listMutableCodexRouteAgentEntries(cfg).find((entry) => entry.agentId === normalizedAgentId)?.agent;
}
function resolveAliasFromModelsMap(models, aliasKey, defaultProvider) {
	for (const [modelRef, entry] of Object.entries(models ?? {})) {
		if (normalizeOptionalLowercaseString(asOptionalRecord(entry)?.alias) !== aliasKey) continue;
		const compatRef = resolveKnownCompatModelAliasRef(modelRef);
		if (compatRef) return compatRef;
		return modelRef.includes("/") ? normalizeDefaultProviderModelRef(modelRef) : `${defaultProvider}/${modelRef}`;
	}
}
function resolveConfiguredBareModelRef(params) {
	const modelId = params.modelRef.trim();
	if (!modelId || modelId.includes("/")) return;
	const matches = /* @__PURE__ */ new Set();
	const pushModelMapMatches = (models) => {
		for (const key of Object.keys(models ?? {})) {
			const parsed = parseCodexRouteModelRef(key);
			if (parsed?.modelId === modelId) matches.add(`${parsed.provider}/${parsed.modelId}`);
		}
	};
	pushModelMapMatches(asOptionalRecord(params.cfg.agents?.defaults?.models));
	for (const [provider, providerConfig] of Object.entries(params.cfg.models?.providers ?? {})) for (const model of providerConfig?.models ?? []) if (providerCatalogModelMatches(provider, model?.id, modelId)) matches.add(`${normalizeProviderId(provider)}/${modelId}`);
	return matches.size === 1 ? [...matches][0] : void 0;
}
function providerCatalogModelMatches(provider, catalogModelId, modelId) {
	const rawId = catalogModelId?.trim();
	if (!rawId) return false;
	const normalizedId = normalizeConfiguredProviderCatalogModelId(provider, rawId);
	if (normalizedId === modelId) return true;
	return normalizeOptionalLowercaseString(normalizedId) === normalizeOptionalLowercaseString(modelId);
}
function normalizeDefaultProviderModelRef(modelRef, defaultProvider = DEFAULT_PROVIDER) {
	return modelRef.includes("/") ? modelRef : `${defaultProvider}/${modelRef}`;
}
function normalizeProviderModelRef(provider, modelId) {
	const normalizedProvider = normalizeProviderId(provider);
	const normalizedModelId = normalizeConfiguredProviderCatalogModelId(normalizedProvider, modelId);
	const slash = normalizedModelId.indexOf("/");
	if (slash > 0 && normalizeProviderId(normalizedModelId.slice(0, slash)) === normalizedProvider && slash < normalizedModelId.length - 1) return `${normalizedProvider}/${normalizedModelId.slice(slash + 1)}`;
	return `${normalizedProvider}/${normalizedModelId}`;
}
function resolveImplicitDefaultAgentModelRef(cfg, agentId) {
	const fallbackProvider = resolveConfiguredPrimaryProviderFallback({
		cfg,
		agentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowManifestNormalization: false,
		allowPluginNormalization: false
	});
	return fallbackProvider ? normalizeProviderModelRef(fallbackProvider.provider, fallbackProvider.model) : `${DEFAULT_PROVIDER}/${DEFAULT_MODEL}`;
}
function agentUsesCodexRuntimeForCompaction(params) {
	const runtime = concreteRuntimeId(normalizeOptionalLowercaseString(params.currentRuntime));
	if (runtime) return runtime === "codex";
	return modelRefUsesCodexRuntime({
		cfg: params.cfg,
		modelRef: readAgentPrimaryModelRef(params.agent, params.inheritedModelRef),
		agentId: params.agentId,
		env: params.env
	});
}
function concreteRuntimeId(runtime) {
	return runtime && runtime !== "auto" && runtime !== "default" ? runtime : void 0;
}
function parseCodexRouteModelRef(modelRef) {
	const slash = modelRef.indexOf("/");
	if (slash <= 0 || slash >= modelRef.length - 1) return;
	return {
		provider: modelRef.slice(0, slash),
		modelId: modelRef.slice(slash + 1)
	};
}
function canonicalOpenAIModelUsesCodexRuntime(params) {
	const parsed = parseCodexRouteModelRef(params.modelRef);
	if (!parsed) return false;
	return configuredModelRouteNeedsCodex({
		cfg: params.cfg,
		env: params.env ?? process.env,
		...params.agentId ? { agentId: params.agentId } : {},
		route: {
			provider: parsed.provider,
			modelId: parsed.modelId
		}
	});
}
//#endregion
export { isLegacyCodexProviderId as S, resolveImplicitDefaultAgentModelRef as _, isBlockedLegacyCodexModelRef as a, toCanonicalOpenAIModelRef as b, isProviderlessModelRef as c, normalizeDefaultProviderModelRef as d, normalizeRuntimeString as f, readModelConfigPrimaryRef as g, readLegacyDefaultsRuntime as h, isBlockedLegacyCodexModelPair as i, legacyCodexProviderIdentityKey as l, readAgentPrimaryModelRef as m, asAgentRuntimePolicyConfig as n, isOpenAICodexAuthProfileRef as o, parseCodexRouteModelRef as p, canonicalOpenAIModelUsesCodexRuntime as r, isOpenAICodexModelRef as s, agentUsesCodexRuntimeForCompaction as t, modelRefUsesCodexRuntime as u, resolveRuntime as v, toOpenAIModelId as x, resolveRuntimeModelRef as y };
