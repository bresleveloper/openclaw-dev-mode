import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { E as listAgentEntries, d as resolveAmbientOwnerAgentId, v as toAgentEntriesRecord } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { r as copyConfigResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-DbgWcCyV.mjs";
import { m as SYSTEM_AGENT_ID } from "./agent-database-admission-BFwcs62N.mjs";
import { r as resolveConfiguredSetupModelForAgent } from "./utility-model-Bk8FTgwT.mjs";
import { n as resolveCliExecutionAuthProfileId, t as cliBackendAcceptsAuthProfileForwarding } from "./cli-execution-auth-DC6xVJm0.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/system-agent/inference-route.ts
function projectSystemAgentExecutionConfig(config, routeAgentId) {
	const agents = listAgentEntries(config);
	const routeAgent = agents.find((agent) => normalizeAgentId(agent.id) === routeAgentId);
	const projectedAgents = [...agents.filter((agent) => normalizeAgentId(agent.id) !== SYSTEM_AGENT_ID), {
		id: SYSTEM_AGENT_ID,
		...routeAgent?.params !== void 0 ? { params: structuredClone(routeAgent.params) } : {},
		...routeAgent?.tools !== void 0 ? { tools: structuredClone(routeAgent.tools) } : {}
	}];
	const { list: _legacyList, ...agentsConfig } = config.agents ?? {};
	const projected = {
		...config,
		agents: {
			...agentsConfig,
			entries: toAgentEntriesRecord(projectedAgents)
		}
	};
	copyConfigResolutionFacts(config, projected);
	return projected;
}
async function resolveSystemAgentConfiguredRouteFromConfig(runConfig, requestedAgentId, deps = {}, configSnapshot) {
	const source = configSnapshot && runConfig === (configSnapshot.runtimeConfig ?? configSnapshot.config) ? configSnapshot.sourceConfig : runConfig;
	const prepared = createRuntimeConfigReader(source)();
	const preparedConfig = prepared === source ? runConfig : prepared;
	const [modelSelection, modelRuntimeAliases, simpleCompletion, harnessPolicy] = await Promise.all([
		import("./model-selection-ElLkT79C.mjs"),
		import("./model-runtime-aliases-DCQJ_-be.mjs"),
		import("./simple-completion-runtime-4Gs1XG0p.mjs"),
		import("./policy-TpO4adEg.mjs")
	]);
	const modelOwnerAgentId = resolveAmbientOwnerAgentId(runConfig, requestedAgentId);
	const configuredSelection = resolveConfiguredSetupModelForAgent({
		cfg: runConfig,
		agentId: modelOwnerAgentId,
		modelTarget: deps.modelTarget
	});
	if (!configuredSelection) return null;
	const selection = simpleCompletion.resolveSimpleCompletionSelectionForAgent({
		cfg: runConfig,
		agentId: modelOwnerAgentId,
		modelRef: configuredSelection.implicitPrimary ? void 0 : configuredSelection.modelRef,
		manifestPlugins: deps.pluginMetadataPlugins
	});
	if (!selection) return null;
	const metadataSnapshot = deps.pluginMetadataPlugins ? { plugins: deps.pluginMetadataPlugins } : void 0;
	const executionProvider = modelRuntimeAliases.resolveCliRuntimeExecutionProvider({
		provider: selection.provider,
		cfg: runConfig,
		agentId: modelOwnerAgentId,
		modelId: selection.modelId,
		...selection.profileId ? { authProfileId: selection.profileId } : {},
		...metadataSnapshot ? { metadataSnapshot } : {}
	}) ?? selection.runtimeProvider ?? selection.provider;
	const isCliRoute = modelSelection.isCliProvider(executionProvider, runConfig);
	const allowCliAuthProfileForwarding = isCliRoute && cliBackendAcceptsAuthProfileForwarding({
		provider: executionProvider,
		config: runConfig,
		agentId: modelOwnerAgentId
	});
	const cliAuthProfileId = allowCliAuthProfileForwarding ? resolveCliExecutionAuthProfileId({
		cliExecutionProvider: executionProvider,
		authProfileProvider: selection.provider,
		config: runConfig,
		agentDir: selection.agentDir,
		...selection.profileId ? { selected: {
			authProfileId: selection.profileId,
			authProfileIdSource: "user"
		} } : {},
		...deps.loadAuthProfileStoreForRuntime ? { loadAuthProfileStoreForRuntime: deps.loadAuthProfileStoreForRuntime } : {}
	}) : void 0;
	const authProfileId = allowCliAuthProfileForwarding ? cliAuthProfileId : selection.profileId;
	const executionConfig = projectSystemAgentExecutionConfig(preparedConfig, modelOwnerAgentId);
	const base = {
		...configuredSelection.modelTarget ? { modelTarget: configuredSelection.modelTarget } : {},
		sourceConfig: runConfig,
		runConfig: executionConfig,
		modelLabel: `${selection.provider}/${selection.modelId}`,
		provider: executionProvider,
		model: selection.modelId,
		agentDir: selection.agentDir,
		agentId: modelOwnerAgentId,
		...authProfileId ? { authProfileId } : {}
	};
	if (isCliRoute) return {
		runner: "cli",
		...base
	};
	const policy = harnessPolicy.resolveAgentHarnessPolicy({
		config: runConfig,
		agentId: modelOwnerAgentId,
		provider: selection.provider,
		modelId: selection.modelId
	});
	return {
		runner: "embedded",
		...policy.runtimeSource === "implicit" ? {} : { agentHarnessRuntimeOverride: policy.runtime },
		...base
	};
}
function projectRelevantModelMap(params) {
	if (!params.models) return;
	const relevant = Object.fromEntries(Object.entries(params.models).filter(([key, entry]) => {
		const slash = key.indexOf("/");
		const provider = slash > 0 ? normalizeProviderId(key.slice(0, slash)) : "";
		const model = slash > 0 ? key.slice(slash + 1) : key;
		return params.providerIds.has(provider) && (model === params.modelId || model === "*" || key === params.rawModel) || entry.alias?.trim() === params.rawModel;
	}));
	return Object.keys(relevant).length > 0 ? relevant : void 0;
}
/** Project every config input that can change the configured default-agent route. */
async function projectDefaultInferenceRoute(config, deps = {}) {
	return await projectInferenceRoute(config, void 0, deps);
}
/** Project every config input that can change one configured agent route. */
async function projectInferenceRoute(config, requestedAgentId, deps = {}, sourceConfig = config) {
	const { resolveProviderIdForAuth } = await import("./provider-auth-aliases-BHUczFq4.mjs");
	const routeAgentId = resolveAmbientOwnerAgentId(config, requestedAgentId);
	const route = await resolveSystemAgentConfiguredRouteFromConfig(config, routeAgentId, deps);
	const agent = listAgentEntries(config).find((entry) => normalizeAgentId(entry.id) === routeAgentId);
	const executionAgent = listAgentEntries(route?.runConfig ?? {}).find((entry) => normalizeAgentId(entry.id) === SYSTEM_AGENT_ID);
	const defaults = config.agents?.defaults;
	const logicalProvider = normalizeProviderId(route?.modelLabel.split("/", 1)[0] ?? "");
	const providerIds = new Set([logicalProvider, normalizeProviderId(route?.provider ?? "")].filter(Boolean));
	const metadataSnapshot = deps.pluginMetadataPlugins ? { plugins: deps.pluginMetadataPlugins } : void 0;
	const authAliasParams = {
		config,
		...metadataSnapshot ? { metadataSnapshot } : {}
	};
	const authProviderIds = new Set([...providerIds].map((provider) => resolveProviderIdForAuth(provider, authAliasParams)));
	const authProfiles = Object.fromEntries(Object.entries(config.auth?.profiles ?? {}).filter(([, profile]) => authProviderIds.has(resolveProviderIdForAuth(profile.provider, {
		...authAliasParams,
		storedCredential: true
	}))));
	const authOrder = Object.fromEntries(Object.entries(config.auth?.order ?? {}).filter(([provider]) => authProviderIds.has(resolveProviderIdForAuth(provider, authAliasParams))));
	const modelProviders = Object.fromEntries(Object.entries(config.models?.providers ?? {}).filter(([provider]) => providerIds.has(normalizeProviderId(provider))).map(([provider, providerConfig]) => [provider, structuredClone(providerConfig)]));
	const rawModel = route?.modelTarget === "utility" ? agent?.utilityModel ?? defaults?.utilityModel : typeof agent?.model === "string" ? agent.model : agent?.model?.primary || (typeof defaults?.model === "string" ? defaults.model : defaults?.model?.primary);
	const agentRouteOverrides = agent ? {
		model: structuredClone(agent.model),
		...route?.modelTarget === "utility" ? { utilityModel: structuredClone(agent.utilityModel) } : {},
		params: structuredClone(agent.params),
		tools: structuredClone(agent.tools),
		models: projectRelevantModelMap({
			models: agent.models,
			providerIds,
			modelId: route?.model,
			rawModel
		}),
		agentRuntime: structuredClone(agent.agentRuntime)
	} : void 0;
	const hasAgentRouteOverrides = agentRouteOverrides !== void 0 && Object.values(agentRouteOverrides).some((value) => value !== void 0);
	let projectedRoute = null;
	if (route) {
		const { runConfig: _runConfig, sourceConfig: _sourceConfig, ...routeWithoutConfig } = route;
		projectedRoute = routeWithoutConfig;
	}
	return {
		route: projectedRoute,
		defaultSelection: { explicitIds: [routeAgentId] },
		auth: {
			profiles: authProfiles,
			order: authOrder
		},
		models: {
			mode: config.models?.mode,
			providers: modelProviders
		},
		defaults: {
			model: structuredClone(defaults?.model),
			...route?.modelTarget === "utility" ? { utilityModel: structuredClone(defaults?.utilityModel) } : {},
			params: structuredClone(defaults?.params),
			models: projectRelevantModelMap({
				models: defaults?.models,
				providerIds,
				modelId: route?.model,
				rawModel
			}),
			agentRuntime: structuredClone(defaults?.agentRuntime)
		},
		...agent && hasAgentRouteOverrides ? { agent: {
			id: normalizeAgentId(agent.id),
			...agentRouteOverrides
		} } : {},
		...executionAgent ? { executionAgent: {
			id: SYSTEM_AGENT_ID,
			params: structuredClone(executionAgent.params),
			tools: structuredClone(executionAgent.tools)
		} } : {},
		env: structuredClone(config.env),
		secrets: structuredClone(config.secrets),
		plugins: structuredClone(sourceConfig.plugins),
		tools: structuredClone(config.tools)
	};
}
function sameDefaultInferenceRoute(left, right) {
	return isDeepStrictEqual(left, right);
}
function withoutAgentIdentity(projection) {
	const agent = isRecord(projection.agent) ? {
		...projection.agent,
		id: "<agent>"
	} : projection.agent;
	return {
		...projection,
		route: projection.route ? {
			...projection.route,
			agentId: "<agent>",
			agentDir: "<agent-dir>"
		} : null,
		defaultSelection: { explicitIds: [] },
		...agent ? { agent } : {}
	};
}
function sameSetupInferenceRoute(left, right, ignoreAgentIdentity) {
	return ignoreAgentIdentity ? isDeepStrictEqual(withoutAgentIdentity(left), withoutAgentIdentity(right)) : sameDefaultInferenceRoute(left, right);
}
function sameSetupConfiguredRoute(left, right, ignoreAgentIdentity) {
	if (!ignoreAgentIdentity) return isDeepStrictEqual(left, right);
	const normalize = (route) => route ? {
		...route,
		agentId: "<agent>",
		agentDir: "<agent-dir>"
	} : null;
	return isDeepStrictEqual(normalize(left), normalize(right));
}
function assertSetupTarget(params) {
	const agentId = params.resolveDefaultAgentId(params.config);
	if (params.expectedAgentId && agentId !== params.expectedAgentId) throw new Error("The default agent changed while AI access was being tested. Try setup again.");
	if (params.expectedAgentDir && params.resolveAgentDir(params.config, agentId) !== params.expectedAgentDir) throw new Error("The agent credential location changed while AI access was being tested. Try setup again.");
	if (params.expectedModelRef) {
		const current = params.resolveDefaultModelForAgent({
			cfg: params.config,
			agentId
		});
		if (`${current.provider}/${current.model}` !== params.expectedModelRef) throw new Error("The default model changed while AI access was being tested. Try setup again.");
	}
}
//#endregion
export { sameDefaultInferenceRoute as a, resolveSystemAgentConfiguredRouteFromConfig as i, projectDefaultInferenceRoute as n, sameSetupConfiguredRoute as o, projectInferenceRoute as r, sameSetupInferenceRoute as s, assertSetupTarget as t };
