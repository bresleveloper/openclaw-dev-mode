import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-BBYDJbw9.mjs";
import { r as copyConfigResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import "./session-key-CSDERtm3.mjs";
import { S as toAgentEntriesRecord, m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { t as SYSTEM_AGENT_ID } from "./agent-id-BxGhTBRK.mjs";
import { i as resolveConfiguredSetupModelForAgent } from "./utility-model-nsnbR10X.mjs";
import { n as resolveCliExecutionAuthProfileId, t as cliBackendAcceptsAuthProfileForwarding } from "./cli-execution-auth-Db8iWS1_.mjs";
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
	const projected = {
		...config,
		agents: {
			...config.agents,
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
		import("./model-selection-2GrXh86H.mjs"),
		import("./model-runtime-aliases-5OuSCNqS.mjs"),
		import("./simple-completion-runtime-C1vIxH8v.mjs"),
		import("./policy-_ehd_au3.mjs")
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
	const cliAuthProfileId = allowCliAuthProfileForwarding ? await resolveCliExecutionAuthProfileId({
		cliExecutionProvider: executionProvider,
		authProfileProvider: selection.provider,
		config: runConfig,
		agentDir: selection.agentDir,
		...selection.profileId ? { selected: {
			authProfileId: selection.profileId,
			authProfileIdSource: "user"
		} } : {},
		...deps.loadAuthProfileStoreForRuntimeAsync ? { loadAuthProfileStoreForRuntimeAsync: deps.loadAuthProfileStoreForRuntimeAsync } : {}
	}) : void 0;
	const authProfileId = allowCliAuthProfileForwarding ? cliAuthProfileId : selection.profileId;
	const executionConfig = projectSystemAgentExecutionConfig(preparedConfig, modelOwnerAgentId);
	const modelLabel = modelSelection.resolveConfiguredRouteModelLabel({
		configuredRef: configuredSelection.modelRef,
		resolved: {
			provider: selection.provider,
			model: selection.modelId
		},
		...selection.profileId ? { profileId: selection.profileId } : {}
	});
	const base = {
		...configuredSelection.modelTarget ? { modelTarget: configuredSelection.modelTarget } : {},
		sourceConfig: runConfig,
		runConfig: executionConfig,
		modelLabel,
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
/** Project every config input that can change one configured agent route. */
async function projectInferenceRoute(config, requestedAgentId, deps = {}, sourceConfig = config) {
	const { resolveProviderIdForAuth } = await import("./provider-auth-aliases-HQsFmXLW.mjs");
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
		})
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
			})
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
	return ignoreAgentIdentity ? isDeepStrictEqual(withoutAgentIdentity(left), withoutAgentIdentity(right)) : isDeepStrictEqual(left, right);
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
export { sameSetupInferenceRoute as a, sameSetupConfiguredRoute as i, projectInferenceRoute as n, resolveSystemAgentConfiguredRouteFromConfig as r, assertSetupTarget as t };
