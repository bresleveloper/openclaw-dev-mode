import { _ as resolvePrimaryStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { T as selectApplicableRuntimeConfig, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { r as resolveAgentConfig, s as resolveAgentModelConfigForRuntime } from "./agent-scope-config-fjA2T9Gz.mjs";
import { l as toAgentModelListLike, s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { y as resolveSubagentModelConfigSelectionResult } from "./agent-scope-DXrnO3F4.mjs";
import { h as resolveConfiguredModelRef, m as resolveConfiguredModelPolicyAllow, s as getModelRefStatus, v as resolveHooksGmailModel } from "./model-selection-shared-CVU_V2PQ.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BJKolYfz.mjs";
import { l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
import "./config-B3oiWDlr.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-B4Z5ZIMD.mjs";
import "./thinking-BCNoGfZ5.mjs";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
import { n as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-CyNDDKq6.mjs";
import { r as normalizeThinkingCatalogProviders } from "./thinking-runtime-DuxsJR5q.mjs";
import { l as loadResolvedPublishedModelCatalogOwner, o as loadProviderScopedThinkingCatalog } from "./prepared-model-catalog-B9Dr8wIV.mjs";
//#region src/cron/isolated-agent/run-config.ts
/** Selects the active reloadable config when it descends from the cron caller's snapshot. */
function resolveCronActiveRuntimeConfig(cfg) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfig || !runtimeSourceConfig) return cfg;
	return selectApplicableRuntimeConfig({
		inputConfig: cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) ?? cfg;
}
/** Selects the active runtime snapshot, then derives isolated cron agent defaults from it. */
function resolveCronAgentConfig(params) {
	const runtimeConfig = resolveCronActiveRuntimeConfig(params.config);
	const { model: _agentModelOverride, sandbox: _agentSandboxOverride, memory: _agentMemoryOverride, models: _agentModelsOverride, params: _agentParamsOverride, ...agentOverrideRest } = params.agentConfigOverride ?? {};
	const overrideModel = resolveAgentModelConfigForRuntime(params.agentConfigOverride);
	const definedOverrides = Object.fromEntries(Object.entries(agentOverrideRest).filter(([, value]) => value !== void 0));
	const agentDefaults = { ...Object.assign({}, runtimeConfig.agents?.defaults, definedOverrides) };
	const existingModel = toAgentModelListLike(agentDefaults.model) ?? {};
	if (typeof overrideModel === "string") agentDefaults.model = {
		...existingModel,
		primary: overrideModel
	};
	else if (overrideModel) agentDefaults.model = {
		...existingModel,
		...overrideModel
	};
	return {
		runtimeConfig,
		agentDefaults,
		cfgWithAgentDefaults: {
			...runtimeConfig,
			agents: Object.assign({}, runtimeConfig.agents, { defaults: agentDefaults })
		}
	};
}
//#endregion
//#region src/cron/isolated-agent/model-selection.ts
const CRON_THINKING_HYDRATION_WAIT_MS = 5e3;
function formatCronPayloadModelRejection(params) {
	const { modelOverride, error } = params;
	if (error.startsWith("model not allowed:")) {
		const modelRef = error.slice(18).trim();
		const policy = resolveConfiguredModelPolicyAllow(params);
		return `automation model override '${modelOverride}' rejected by ${policy.configPath ?? "agents.defaults.modelPolicy.allow"}: ${modelRef} is not in [${policy.refs.length ? policy.refs.toSorted().join(", ") : "(none configured)"}]`;
	}
	return `automation model override '${modelOverride}' rejected: ${error}`;
}
async function resolveCronModelSelectionOwner(params) {
	const owner = params.publishedRuntime ? Object.freeze({
		...params.publishedRuntime,
		metadataSnapshot: params.publishedRuntime.pluginGeneration.pluginMetadataSnapshot,
		modelCatalog: params.publishedRuntime.readFullModelCatalog?.() ?? params.publishedRuntime.modelCatalog
	}) : await loadResolvedPublishedModelCatalogOwner({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		readOnly: true,
		allowGatewaySubagentBinding: true
	});
	if (params.requiredAgentId && !publishedModelCatalogOwnerMatchesAgent(owner, params.requiredAgentId)) throw new Error(`cron model catalog owner changed from ${params.requiredAgentId} to ${owner.agentId}`);
	return owner;
}
async function resolveCronThinkingCatalog(params) {
	const catalog = normalizeThinkingCatalogProviders(params.owner.modelCatalog.entries);
	const selected = findModelInCatalog(catalog, params.provider, params.model);
	if (params.agentRuntime === "openclaw" && selected && (selected.nativeRuntime === void 0 || selected.nativeRuntime === "openclaw")) return catalog;
	const hydration = loadProviderScopedThinkingCatalog({
		config: params.owner.config,
		provider: params.provider,
		model: params.model,
		agentRuntime: params.agentRuntime,
		agentId: params.owner.agentId,
		agentDir: params.owner.agentDir,
		workspaceDir: params.owner.workspaceDir
	});
	const refreshed = await raceWithTimeout(hydration.then(normalizeThinkingCatalogProviders), CRON_THINKING_HYDRATION_WAIT_MS, () => void 0, { ref: false });
	return refreshed && findModelInCatalog(refreshed, params.provider, params.model) ? refreshed : catalog;
}
async function resolveCronThinkingSelection(params) {
	const immutableThinkLevel = normalizeThinkLevel(params.jobThinking) ?? normalizeThinkLevel(params.hookThinking) ?? normalizeThinkLevel(params.sessionThinking);
	const requestedThinkLevel = immutableThinkLevel ?? resolveConfiguredThinkingDefaultCore({
		cfg: params.cfg,
		agentId: params.owner.agentId,
		provider: params.provider,
		model: params.model
	});
	return {
		catalog: requestedThinkLevel === "off" && params.agentRuntime === "openclaw" ? params.owner.modelCatalog.entries : await resolveCronThinkingCatalog(params),
		immutableThinkLevel,
		loadThinkingCatalog: async (provider, model, agentRuntime) => await resolveCronThinkingCatalog({
			owner: params.owner,
			provider,
			model,
			agentRuntime
		}),
		requestedThinkLevel
	};
}
/** Resolves the effective scheduled model across defaults, agents, hooks, payload, and session state. */
async function resolveCronModelSelection(params) {
	const owner = params.owner ?? await resolveCronModelSelectionOwner({
		cfg: params.cfg,
		...params.agentId ? {
			agentId: params.agentId,
			requiredAgentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		} : {}
	});
	const ownerAgentId = owner.agentId;
	const ownerAgentConfigOverride = params.agentConfigOverride ? owner.config === params.cfg && (!params.agentId || ownerAgentId === params.agentId) ? params.agentConfigOverride : resolveAgentConfig(owner.config, ownerAgentId) : void 0;
	const { cfgWithAgentDefaults } = resolveCronAgentConfig({
		config: owner.config,
		agentConfigOverride: ownerAgentConfigOverride
	});
	const resolvedDefault = resolveConfiguredModelRef({
		cfg: cfgWithAgentDefaults,
		agentId: ownerAgentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		manifestPlugins: owner.metadataSnapshot
	});
	const selectionParams = {
		cfg: owner.config,
		catalog: owner.modelCatalog.entries,
		defaultProvider: resolvedDefault.provider,
		defaultModel: resolvedDefault,
		agentId: ownerAgentId,
		manifestPlugins: owner.metadataSnapshot
	};
	const ownerAgentConfig = resolveAgentConfig(owner.config, ownerAgentId);
	const matchesDefaultFallbackAgentStringModel = typeof ownerAgentConfig?.model === "string" && resolveAgentModelPrimaryValue(ownerAgentConfig.model) === resolveAgentModelPrimaryValue(owner.config.agents?.defaults?.model);
	const selection = (ref, modelSource, profileModel) => {
		const configuredProfileId = splitTrailingAuthProfile(profileModel ?? "").profile;
		return {
			ok: true,
			provider: ref.provider,
			model: ref.model,
			modelSource,
			useSubagentFallbacks: modelSource === "subagent",
			inheritDefaultFallbacksForAgentStringModel: matchesDefaultFallbackAgentStringModel && (modelSource === "default" || modelSource === "agent"),
			...configuredProfileId ? { configuredProfileId } : {},
			cfgWithAgentDefaults,
			owner
		};
	};
	const override = (raw, source) => {
		if (!raw) return;
		const resolved = resolveAllowedModelRefCore({
			...selectionParams,
			raw
		});
		if (!("error" in resolved)) return selection(resolved.ref, source, source === "session" ? void 0 : raw);
		return source === "payload" ? {
			ok: false,
			error: formatCronPayloadModelRejection({
				cfg: owner.config,
				agentId: ownerAgentId,
				modelOverride: raw,
				error: resolved.error
			})
		} : void 0;
	};
	const modelOverrideRaw = params.payload.kind === "agentTurn" ? params.payload.model : void 0;
	const payloadSelection = override(typeof modelOverrideRaw === "string" ? modelOverrideRaw.trim() : void 0, "payload");
	if (payloadSelection) return payloadSelection;
	const hooksGmailModelRef = params.isGmailHook ? resolveHooksGmailModel({
		cfg: owner.config,
		defaultProvider: DEFAULT_PROVIDER,
		manifestPlugins: owner.metadataSnapshot
	}) : null;
	if (hooksGmailModelRef && getModelRefStatus({
		...selectionParams,
		ref: hooksGmailModelRef
	}).allowed) return selection(hooksGmailModelRef, "hook", owner.config.hooks?.gmail?.model);
	const sessionModelOverride = params.sessionEntry.modelOverride?.trim();
	const sessionSelection = override(sessionModelOverride ? `${params.sessionEntry.providerOverride?.trim() || resolvedDefault.provider}/${sessionModelOverride}` : void 0, "session");
	if (sessionSelection) return sessionSelection;
	const subagentSelection = resolveSubagentModelConfigSelectionResult({
		cfg: owner.config,
		agentId: ownerAgentId,
		agentConfigOverride: ownerAgentConfigOverride
	});
	return override(resolvePrimaryStringValue(subagentSelection?.raw), subagentSelection?.source === "agent" ? "agent" : "subagent") ?? selection(resolvedDefault, "default", resolveAgentModelPrimaryValue(cfgWithAgentDefaults.agents?.defaults?.model));
}
//#endregion
export { resolveCronAgentConfig as a, resolveCronActiveRuntimeConfig as i, resolveCronModelSelectionOwner as n, resolveCronThinkingSelection as r, resolveCronModelSelection as t };
