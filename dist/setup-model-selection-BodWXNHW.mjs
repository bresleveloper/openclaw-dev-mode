import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { t as findNormalizedProviderKey } from "./provider-id-DCtsDflE.mjs";
import { a as parseProviderModelRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { I as materializeModelPolicyAllowlist, v as toAgentEntriesRecord } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as materializeUtilityModelSeparation } from "./utility-model-separation-migration-CoAPHAUL.mjs";
import { t as mergeAgentModelEntryForConfig } from "./model-input-DKxKaZGG.mjs";
//#region src/system-agent/setup-model-selection.ts
function applySystemAgentModelSelectionWithModules(params, modules) {
	const { agentScope, modelConfig, runtimePolicy } = modules;
	let nextConfig = structuredClone(params.modelTarget === "utility" ? materializeUtilityModelSeparation(params.config, params.previousConfig === void 0 ? params.config : params.previousConfig).config : params.config);
	const normalizedTarget = params.targetAgentId === void 0 ? null : normalizeAgentIdStrict(params.targetAgentId);
	if (normalizedTarget && !normalizedTarget.ok) throw new Error(`Could not resolve configured agent "${params.targetAgentId}".`);
	const targetAgentId = normalizedTarget?.value;
	const agentId = agentScope.resolveAmbientOwnerAgentId(nextConfig, targetAgentId);
	const roster = agentScope.listAgentEntries(nextConfig);
	if (targetAgentId && !roster.some((entry) => normalizeAgentId(entry.id) === targetAgentId)) throw new Error(`Could not resolve configured agent "${targetAgentId}".`);
	const writesAgent = Boolean(targetAgentId || (params.modelTarget === "utility" ? nextConfig.agents?.ownership === "explicit" || agentScope.resolveAgentConfig(nextConfig, agentId)?.utilityModel !== void 0 : agentScope.resolveAgentExplicitModelPrimary(nextConfig, agentId)));
	const target = modelConfig.resolveModelTarget({
		raw: params.model,
		cfg: nextConfig
	});
	const key = modelConfig.upsertCanonicalModelConfigEntry({}, target);
	const configuredVisibleModels = nextConfig.agents?.defaults?.models;
	if (configuredVisibleModels && Object.keys(configuredVisibleModels).length > 0) modelConfig.upsertCanonicalModelConfigEntry(configuredVisibleModels, target);
	if (params.runtimeInDefaults) nextConfig = materializeModelPolicyAllowlist(nextConfig).config;
	nextConfig.agents ??= {};
	nextConfig.agents.defaults ??= {};
	const agentDefaults = nextConfig.agents.defaults;
	const agentEntries = toAgentEntriesRecord(roster);
	if (writesAgent || params.agentRuntimeId && !params.runtimeInDefaults) {
		const { list: _legacyList, ...agentConfig } = nextConfig.agents;
		nextConfig.agents = {
			...agentConfig,
			entries: agentEntries
		};
	}
	const agentEntryKey = roster.find((entry) => normalizeAgentId(entry.id) === agentId)?.id ?? agentId;
	const agent = agentEntries[agentEntryKey];
	if (writesAgent) {
		if (!agent) throw new Error(`Could not resolve configured default agent "${agentId}".`);
		const agentModels = { ...agent.models };
		agent.models = agentModels;
		modelConfig.upsertCanonicalModelConfigEntry(agentModels, target);
	}
	if (params.agentRuntimeId) {
		const runtimeTarget = params.runtimeInDefaults ? agentDefaults : agentEntries[agentEntryKey] ??= { default: true };
		const agentModels = { ...runtimeTarget.models };
		const agentKey = modelConfig.upsertCanonicalModelConfigEntry(agentModels, target);
		agentModels[agentKey] = {
			...agentModels[agentKey],
			agentRuntime: { id: params.agentRuntimeId }
		};
		runtimeTarget.models = agentModels;
	} else if (params.modelTarget !== "utility") {
		const clearRuntimePin = (models) => {
			const nextModels = { ...models };
			const modelKey = modelConfig.upsertCanonicalModelConfigEntry(nextModels, target);
			const entry = { ...nextModels[modelKey] };
			delete entry.agentRuntime;
			nextModels[modelKey] = entry;
			return nextModels;
		};
		const defaultModels = agentDefaults.models;
		if (defaultModels && Object.keys(defaultModels).length > 0) agentDefaults.models = clearRuntimePin(defaultModels);
		if (agent?.models && Object.keys(agent.models).length > 0) agent.models = clearRuntimePin(agent.models);
	}
	const selectedModel = params.authProfileId ? `${key}@${params.authProfileId}` : key;
	if (params.modelTarget === "utility") {
		if (writesAgent && agent) agent.utilityModel = selectedModel;
		else agentDefaults.utilityModel = selectedModel;
	} else agentScope.setAgentEffectiveModelPrimary(nextConfig, agentId, selectedModel, { forceAgent: Boolean(targetAgentId) });
	if (params.agentRuntimeId) {
		if (runtimePolicy.resolveModelRuntimePolicy({
			config: nextConfig,
			provider: target.provider,
			modelId: target.model,
			agentId
		}).policy?.id !== params.agentRuntimeId) throw new Error(`Could not pin ${key} to the ${params.agentRuntimeId} runtime.`);
	}
	return nextConfig;
}
async function createSystemAgentModelSelectionUpdater(params) {
	const [agentScope, modelConfig, runtimePolicy] = await Promise.all([
		import("./agent-scope-C4CYkKyC.mjs"),
		import("./shared-CBRtGYHA.mjs"),
		import("./model-runtime-policy-DLU0hqZ1.mjs")
	]);
	const modules = {
		agentScope,
		modelConfig,
		runtimePolicy
	};
	return (config, previousConfig = config) => applySystemAgentModelSelectionWithModules({
		...params,
		config,
		previousConfig
	}, modules);
}
async function applySystemAgentModelSelection(params) {
	return (await createSystemAgentModelSelectionUpdater(params))(params.config, params.previousConfig);
}
function projectSetupInferenceConfig(params) {
	const config = structuredClone(params.base);
	if (params.profileId) {
		const profile = params.prepared.auth?.profiles?.[params.profileId];
		if (profile) config.auth = {
			...config.auth,
			profiles: {
				...config.auth?.profiles,
				[params.profileId]: structuredClone(profile)
			}
		};
	}
	const provider = parseProviderModelRef(params.modelRef)?.provider ?? "";
	const providerKey = findNormalizedProviderKey(params.prepared.models?.providers, provider);
	const providerConfig = providerKey ? params.prepared.models?.providers?.[providerKey] : void 0;
	if (providerKey && providerConfig) {
		const selectedProvider = structuredClone(providerConfig);
		if (params.profileId) delete selectedProvider.apiKey;
		if (selectedProvider.headers?.["api-key"] && params.credential?.type === "api_key" && params.credential.keyRef) selectedProvider.headers["api-key"] = params.credential.keyRef;
		config.models = {
			...config.models,
			providers: {
				...config.models?.providers,
				[providerKey]: selectedProvider
			}
		};
	}
	const plugin = params.pluginId ? params.prepared.plugins?.entries?.[params.pluginId] : void 0;
	if (params.pluginId && plugin) config.plugins = {
		...config.plugins,
		entries: {
			...config.plugins?.entries,
			[params.pluginId]: structuredClone(plugin)
		}
	};
	const modelKey = params.sourceModelRef ?? params.modelRef;
	const defaultModel = params.prepared.agents?.defaults?.models?.[modelKey];
	if (defaultModel) {
		const defaults = (config.agents ??= {}).defaults ??= {};
		const models = defaults.models ??= {};
		models[params.modelRef] = mergeAgentModelEntryForConfig(models[params.modelRef], structuredClone(defaultModel));
	}
	const agentModel = params.prepared.agents?.entries?.[params.agentId]?.models?.[modelKey];
	if (agentModel) {
		const entries = (config.agents ??= {}).entries ??= {};
		const models = (entries[params.agentId] ??= {}).models ??= {};
		models[params.modelRef] = mergeAgentModelEntryForConfig(models[params.modelRef], structuredClone(agentModel));
	}
	return config;
}
//#endregion
export { createSystemAgentModelSelectionUpdater as n, projectSetupInferenceConfig as r, applySystemAgentModelSelection as t };
