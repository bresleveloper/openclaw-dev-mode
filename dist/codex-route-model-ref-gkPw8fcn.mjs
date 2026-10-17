import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { r as resolveAgentConfig, y as resolveNativeModelPrimary } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { a as readAgentRosterProperty, i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-C9K4a_6k.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { p as resolveEffectiveModelFallbacks, u as resolveAgentModelFallbacksOverride } from "./agent-scope-CG17uXFn.mjs";
import { a as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-KBg0y299.mjs";
import { t as isSafeExecutableValue } from "./exec-safety-2Pps-JeG.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { M as collectConfiguredModelRefs } from "./runtime-snapshot-DYptB0Cf.mjs";
import { g as resolveConfiguredPrimaryProviderFallback, i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-DKlQ1p0S.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-CpJt0qgU.mjs";
import { n as resolveSubagentConfiguredModelSelection, t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { l as resolveOpenAIImplicitAgentRuntime } from "./openai-routing-92B-lj2w.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-B6LYojZK.mjs";
//#region src/config/legacy.shared.ts
const ensureRecord = (root, key) => {
	const existing = root[key];
	if (isRecord(existing)) return existing;
	const next = {};
	root[key] = next;
	return next;
};
const mapLegacyAudioTranscription = (value) => {
	const transcriber = asNullableRecord(value);
	const command = Array.isArray(transcriber?.command) ? transcriber?.command : null;
	if (!command || command.length === 0) return null;
	if (typeof command[0] !== "string") return null;
	if (!command.every((part) => typeof part === "string")) return null;
	const rawExecutable = command[0].trim();
	if (!isSafeExecutableValue(rawExecutable)) return null;
	const args = command.slice(1).map((part) => part.replace(/\{input\}/g, "{{AttachmentPath}}"));
	const timeoutSeconds = typeof transcriber?.timeoutSeconds === "number" ? transcriber?.timeoutSeconds : void 0;
	const result = {
		command: rawExecutable,
		type: "cli"
	};
	if (args.length > 0) result.args = args;
	if (timeoutSeconds !== void 0) result.timeoutSeconds = timeoutSeconds;
	return result;
};
const defineLegacyConfigMigration = (migration) => migration;
//#endregion
//#region src/config/legacy-codex-provider.ts
/** Provider spellings accepted only by legacy migration boundaries. */
const LEGACY_CODEX_PROVIDER_IDS = /* @__PURE__ */ new Set(["codex", "openai-codex"]);
function isLegacyCodexProviderId(provider) {
	const normalized = normalizeOptionalLowercaseString(provider);
	return normalized ? LEGACY_CODEX_PROVIDER_IDS.has(normalized) : false;
}
//#endregion
//#region src/config/codex-plugin-diagnostics.ts
const CODEX_PLUGIN_ID = "codex";
const OPENAI_PROVIDER_ID = "openai";
function codexPluginEntryEnabled(cfg) {
	for (const [pluginId, entry] of Object.entries(cfg.plugins?.entries ?? {})) if (normalizeLowercaseStringOrEmpty(pluginId) === CODEX_PLUGIN_ID) return entry?.enabled;
}
function configuredRuntimeNeedsCodex(params) {
	const runtimeId = normalizeOptionalAgentRuntimeId(params.runtimeId);
	if (runtimeId === CODEX_PLUGIN_ID) return true;
	if (!isDefaultAgentRuntimeId(runtimeId)) return false;
	return resolveOpenAIImplicitAgentRuntime({
		provider: OPENAI_PROVIDER_ID,
		modelId: params.modelId,
		config: params.cfg,
		agentId: params.agentId,
		env: params.env
	}) === CODEX_PLUGIN_ID;
}
/** Resolves effective runtime policy for one canonical provider/model route. */
function configuredModelRouteNeedsCodex(params) {
	if (normalizeProviderId(params.route.provider) !== OPENAI_PROVIDER_ID) return false;
	const runtime = resolveModelRuntimePolicy({
		config: params.cfg,
		provider: OPENAI_PROVIDER_ID,
		modelId: params.route.modelId,
		agentId: params.agentId
	}).policy?.id;
	return configuredRuntimeNeedsCodex({
		cfg: params.cfg,
		env: params.env,
		agentId: params.agentId,
		modelId: params.route.modelId,
		runtimeId: runtime
	});
}
function resolveEffectiveSelectedModelRefs(params) {
	const { cfg, agentId } = params;
	const mainPrimaryRaw = resolveNativeModelPrimary(cfg, agentId);
	const mainFallbacks = resolveAgentModelFallbacksOverride(cfg, agentId) ?? resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
	const subagentPrimaryRaw = resolveSubagentConfiguredModelSelection({
		cfg,
		agentId
	}) ?? mainPrimaryRaw;
	const subagentFallbacks = resolveEffectiveModelFallbacks({
		cfg,
		agentId,
		sessionKey: `agent:${agentId}:subagent:codex-diagnostic`,
		hasSessionModelOverride: true,
		modelOverrideSource: "auto"
	}) ?? [];
	const values = /* @__PURE__ */ new Set();
	for (const raw of [
		mainPrimaryRaw,
		...mainFallbacks,
		subagentPrimaryRaw,
		...subagentFallbacks
	]) {
		const value = raw?.trim();
		if (value) values.add(value);
	}
	return {
		complete: Boolean(mainPrimaryRaw?.trim() && subagentPrimaryRaw?.trim()),
		values
	};
}
function configuredRefTargetsAgent(params) {
	const match = /^agents\.list\.(\d+)\./.exec(params.path);
	if (match) {
		const roster = readAgentRosterProperty(params.sourceConfigBeforeMigrations ?? params.cfg);
		const entry = roster?.kind === "list" && Array.isArray(roster.value) ? roster.value[Number(match[1])] : void 0;
		return isRecord(entry) && typeof entry.id === "string" && normalizeAgentId(entry.id) === params.agentId;
	}
	const keyedMatch = /^agents\.entries\.([^.]+)\./.exec(params.path);
	return !keyedMatch || normalizeAgentId(keyedMatch[1] ?? "") === params.agentId;
}
function configuredRefIsEffectiveForAgent(params) {
	if (!configuredRefTargetsAgent(params)) return false;
	if (/^agents\.(?:defaults|list\.\d+|entries\.[^.]+)\.(?:model|subagents\.model)(?:\.|$)/.test(params.path)) return params.selectedModelRefs.has(params.value);
	const agent = resolveAgentConfig(params.cfg, params.agentId);
	if (params.path.endsWith(".heartbeat.model")) return (agent?.heartbeat?.model?.trim() || params.cfg.agents?.defaults?.heartbeat?.model?.trim()) === params.value;
	if (params.path.endsWith(".utilityModel")) return (agent?.utilityModel ?? params.cfg.agents?.defaults?.utilityModel)?.trim() === params.value;
	return true;
}
function configuredProviderPoliciesNeedCodex(cfg, env, agentIds) {
	for (const agentId of agentIds) {
		const genericPolicy = resolveModelRuntimePolicy({
			config: cfg,
			provider: OPENAI_PROVIDER_ID,
			agentId
		}).policy;
		if (genericPolicy?.id?.trim() && configuredRuntimeNeedsCodex({
			cfg,
			env,
			agentId,
			runtimeId: genericPolicy.id
		})) return true;
	}
	for (const [providerId, providerConfig] of Object.entries(cfg.models?.providers ?? {})) {
		if (normalizeProviderId(providerId) !== OPENAI_PROVIDER_ID) continue;
		for (const model of providerConfig.models ?? []) {
			if (!model.agentRuntime?.id?.trim()) continue;
			const parsed = parseModelCatalogRef(model.id);
			const modelId = parsed?.provider === OPENAI_PROVIDER_ID ? parsed.modelId : model.id.trim();
			if (modelId && modelId !== "*" && agentIds.some((agentId) => configuredModelRouteNeedsCodex({
				cfg,
				env,
				agentId,
				route: {
					provider: OPENAI_PROVIDER_ID,
					modelId
				}
			}))) return true;
		}
	}
	return false;
}
function configuredModelRefsNeedCodex(params) {
	const refs = collectConfiguredModelRefs(params.sourceConfigBeforeMigrations ?? params.cfg);
	let complete = true;
	for (const agentId of params.agentIds) {
		const selected = resolveEffectiveSelectedModelRefs({
			cfg: params.cfg,
			agentId
		});
		complete &&= selected.complete;
		const primary = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId,
			manifestPlugins: []
		});
		const aliasIndex = buildModelAliasIndex({
			cfg: params.cfg,
			defaultProvider: primary.provider,
			manifestPlugins: []
		});
		for (const ref of refs) {
			if (!configuredRefIsEffectiveForAgent({
				cfg: params.cfg,
				sourceConfigBeforeMigrations: params.sourceConfigBeforeMigrations,
				path: ref.path,
				value: ref.value,
				agentId,
				selectedModelRefs: selected.values
			})) continue;
			const resolved = resolveModelRefFromString({
				cfg: params.cfg,
				raw: ref.value,
				defaultProvider: primary.provider,
				aliasIndex,
				allowManifestNormalization: false
			});
			const route = resolved ? {
				provider: resolved.ref.provider,
				modelId: resolved.ref.model
			} : void 0;
			if (route && configuredModelRouteNeedsCodex({
				cfg: params.cfg,
				env: params.env,
				agentId,
				route
			})) return {
				complete,
				needsCodex: true
			};
		}
	}
	return {
		complete,
		needsCodex: false
	};
}
function defaultOpenAiRouteNeedsCodex(cfg, env, agentIds) {
	return agentIds.some((agentId) => {
		const runtimeId = resolveModelRuntimePolicy({
			config: cfg,
			provider: OPENAI_PROVIDER_ID,
			agentId
		}).policy?.id;
		return configuredRuntimeNeedsCodex({
			cfg,
			env,
			agentId,
			runtimeId
		});
	});
}
function configNeedsCodexForOpenAi(cfg, env, sourceConfigBeforeMigrations) {
	const agentIds = listAgentIds(cfg);
	const configuredRefs = configuredModelRefsNeedCodex({
		cfg,
		env,
		agentIds,
		sourceConfigBeforeMigrations
	});
	if (configuredRefs.needsCodex) return true;
	if (configuredProviderPoliciesNeedCodex(cfg, env, agentIds)) return true;
	return configuredRefs.complete ? false : defaultOpenAiRouteNeedsCodex(cfg, env, agentIds);
}
/** Suppresses missing Codex diagnostics when no effective OpenAI route selects it. */
function shouldSuppressMissingCodexPluginDiagnostics(cfg, env = process.env, sourceConfigBeforeMigrations) {
	const entryEnabled = codexPluginEntryEnabled(cfg);
	if (entryEnabled === true) return false;
	return entryEnabled === false || !configNeedsCodexForOpenAi(cfg, env, sourceConfigBeforeMigrations);
}
//#endregion
//#region src/commands/doctor/shared/codex-route-model-ref.ts
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
	return modelRefUsesCodexRuntime({
		cfg: params.cfg,
		modelRef: readAgentPrimaryModelRef(params.agent, params.inheritedModelRef),
		agentId: params.agentId,
		env: params.env
	});
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
export { mapLegacyAudioTranscription as S, toOpenAIModelId as _, isOpenAICodexAuthProfileRef as a, defineLegacyConfigMigration as b, legacyCodexProviderIdentityKey as c, parseCodexRouteModelRef as d, readAgentPrimaryModelRef as f, toCanonicalOpenAIModelRef as g, resolveRuntimeModelRef as h, isBlockedLegacyCodexModelRef as i, modelRefUsesCodexRuntime as l, resolveImplicitDefaultAgentModelRef as m, canonicalOpenAIModelUsesCodexRuntime as n, isOpenAICodexModelRef as o, readModelConfigPrimaryRef as p, isBlockedLegacyCodexModelPair as r, isProviderlessModelRef as s, agentUsesCodexRuntimeForCompaction as t, normalizeDefaultProviderModelRef as u, shouldSuppressMissingCodexPluginDiagnostics as v, ensureRecord as x, isLegacyCodexProviderId as y };
