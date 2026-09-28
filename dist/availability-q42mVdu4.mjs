import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { a as resolveMergedModelProviderConfig, n as createModelProviderRouteOverrideResolver, r as findConfiguredProviderModel } from "./model-provider-config-BbSyhfVf.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-D2uZ1zpS.mjs";
import { a as resolveProviderModelRoutes } from "./provider-model-routes-CNgNpH_2.mjs";
import { n as resolveModelRouteIntent, t as resolveAgentRuntimePolicyAgentId } from "./model-runtime-policy-IbIjya7U.mjs";
import { t as canonicalizeProviderModelId } from "./provider-model-route-D-_CCdkJ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { t as hasAuthoredProviderRequestParams } from "./model-extra-params-BJQs6MZV.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { n as getRegisteredAgentHarness, r as listRegisteredAgentHarnesses } from "./registry-1lXXOteg.mjs";
import { t as AgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
//#region src/agents/harness/auto-selection.ts
/** Returns a prepared negative auto-selection fact, or undefined when full support needs probing. */
function resolveAgentHarnessAutoSelectionHint(params) {
	const providerIds = params.harness.autoSelection?.providerIds;
	if (providerIds === void 0) return;
	const provider = normalizeProviderId(params.provider);
	if (providerIds.some((id) => normalizeProviderId(id) === provider)) return;
	return {
		supported: false,
		reason: providerIds.length === 0 ? "harness is explicit-only" : "provider is not auto-selectable"
	};
}
//#endregion
//#region src/agents/harness/support.ts
/** Projects one prepared auth attempt into a secret-free native-runtime support fact. */
function resolveAgentHarnessPreparedAuthSupport(params) {
	const plan = params.plan;
	if (!plan) return;
	return {
		source: params.source ?? (plan.forwardedAuthProfileId ? "profile" : plan.selectedAuthMode ? "direct" : plan.harnessAuthProvider ? "harness" : "none"),
		...plan.selectedAuthMode ? { mode: plan.selectedAuthMode } : {},
		...plan.modelRoute ? { requirement: plan.modelRoute.authRequirement } : {}
	};
}
/** Projects the concrete or deferred prepared route into native-runtime support facts. */
function resolveAgentHarnessPreparedRouteSupport(plan) {
	const support = plan?.modelRoute ?? plan?.deferredRouteSupport;
	return support ? {
		requestTransportOverrides: support.requestTransportOverrides,
		runtimePolicy: support.runtimePolicy
	} : {};
}
/** Projects one prepared compaction attempt into secret-free harness support facts. */
function projectPreparedModelProvider(params) {
	const route = params.plan?.modelRoute;
	return {
		api: route?.api ?? params.model?.api,
		baseUrl: route?.baseUrl ?? params.model?.baseUrl,
		...resolveAgentHarnessPreparedRouteSupport(params.plan),
		...params.plan ? { preparedAuth: resolveAgentHarnessPreparedAuthSupport({
			plan: params.plan,
			source: params.attemptKind === "implicit" ? void 0 : params.attemptKind
		}) } : {}
	};
}
/** Builds the provider/model facts passed to registered harness support probes. */
function buildAgentHarnessSupportContext(params) {
	const providerConfig = resolveMergedModelProviderConfig(params.config, params.provider);
	const authoredConfig = params.config ? projectConfigOntoRuntimeSourceSnapshot(params.config) : void 0;
	const modelId = params.modelId?.trim();
	const modelConfig = modelId ? findConfiguredProviderModel(providerConfig, params.provider, modelId, (configuredModelId) => canonicalizeProviderModelId(params.provider, configuredModelId)) : void 0;
	const authoredProviderConfig = resolveMergedModelProviderConfig(authoredConfig, params.provider);
	const authoredModelConfig = modelId ? findConfiguredProviderModel(authoredProviderConfig, params.provider, modelId, (id) => canonicalizeProviderModelId(params.provider, id)) : void 0;
	const endpointOverrides = params.modelProvider?.endpointOverrides ?? ([
		authoredProviderConfig?.api,
		authoredProviderConfig?.baseUrl,
		authoredModelConfig?.api,
		authoredModelConfig?.baseUrl
	].some((value) => normalizeOptionalString(value) !== void 0) ? "present" : "none");
	const agentId = resolveAgentRuntimePolicyAgentId(params);
	const hasConfiguredProviderRequestParams = hasAuthoredProviderRequestParams({
		config: params.config,
		provider: params.provider,
		modelId: params.modelId,
		agentId
	});
	const configuredModelProvider = providerConfig ? {
		api: modelConfig?.api ?? providerConfig.api ?? "openai-responses",
		baseUrl: modelConfig?.baseUrl ?? providerConfig.baseUrl,
		azureApiVersion: normalizeOptionalString(modelConfig?.params?.azureApiVersion ?? providerConfig.params?.azureApiVersion),
		request: providerConfig.request,
		requestTransportOverrides: createModelProviderRouteOverrideResolver({
			provider: params.provider,
			authoredConfig,
			canonicalizeModelId: (configuredModelId) => canonicalizeProviderModelId(params.provider, configuredModelId)
		})(params.modelId)
	} : void 0;
	const requestTransportOverrides = params.modelProvider?.requestTransportOverrides === "present" || configuredModelProvider?.requestTransportOverrides === "present" || hasConfiguredProviderRequestParams ? "present" : "none";
	const modelProviderFacts = {
		api: params.modelProvider?.api ?? configuredModelProvider?.api,
		baseUrl: params.modelProvider?.baseUrl ?? configuredModelProvider?.baseUrl,
		azureApiVersion: params.modelProvider?.azureApiVersion ?? configuredModelProvider?.azureApiVersion,
		request: params.modelProvider?.request ?? configuredModelProvider?.request,
		preparedAuth: params.modelProvider?.preparedAuth,
		requestTransportOverrides,
		endpointOverrides
	};
	const runtimePolicy = params.modelProvider?.runtimePolicy ? params.modelProvider.runtimePolicy : params.preparedModelProvider ? void 0 : resolveHarnessRouteRuntimePolicy({
		provider: params.provider,
		modelId: params.modelId,
		modelProvider: modelProviderFacts,
		config: params.config,
		routeIntent: resolveModelRouteIntent({
			config: params.config,
			provider: params.provider,
			modelId: params.modelId,
			agentId,
			primaryModel: params.config ? resolveDefaultModelForAgent({
				cfg: params.config,
				agentId,
				allowManifestNormalization: false,
				allowPluginNormalization: false
			}) : void 0
		})
	});
	const modelProvider = {
		...modelProviderFacts,
		runtimePolicy
	};
	return {
		provider: params.provider,
		modelId: params.modelId,
		modelProvider,
		requestedRuntime: params.requestedRuntime,
		...params.providerOwnership ? {
			providerOwnerStatus: params.providerOwnership.status,
			providerOwnerPluginIds: params.providerOwnership.status === "unowned" ? [] : params.providerOwnership.pluginIds
		} : {}
	};
}
function resolveHarnessRouteRuntimePolicy(params) {
	const resolution = resolveProviderModelRoutes({
		provider: params.provider,
		modelId: params.modelId,
		api: params.modelProvider?.api,
		baseUrl: params.modelProvider?.baseUrl,
		config: params.config,
		routeIntent: params.routeIntent,
		requestTransportOverrides: params.modelProvider?.requestTransportOverrides
	});
	if (!resolution) return;
	if (resolution.kind !== "routes") return;
	const policies = resolution.routes.map((route) => route.runtimePolicy);
	const first = policies[0];
	if (!first || policies.some((policy) => !policy)) return;
	return { compatibleIds: first.compatibleIds.filter((id, index, ids) => ids.indexOf(id) === index && policies.every((policy) => policy?.compatibleIds.includes(id))) };
}
/** Resolves the registered plugin harness that auto selection would choose. */
function resolveAutoAgentHarnessId(params) {
	const registeredHarnesses = listRegisteredAgentHarnesses();
	if (registeredHarnesses.length === 0) return;
	const candidates = registeredHarnesses.map(({ harness }) => ({
		harness,
		support: resolveAgentHarnessAutoSelectionHint({
			harness,
			provider: params.provider
		})
	}));
	if (candidates.every((entry) => entry.support !== void 0)) return;
	const supportContext = buildAgentHarnessSupportContext({
		...params,
		requestedRuntime: "auto"
	});
	return candidates.map(({ harness, support }) => ({
		harness,
		support: support ?? harness.supports(supportContext)
	})).filter(isSupportedHarness).toSorted(compareHarnessSupport)[0]?.harness.id;
}
function compareHarnessSupport(left, right) {
	const priorityDelta = (right.support.priority ?? 0) - (left.support.priority ?? 0);
	return priorityDelta !== 0 ? priorityDelta : left.harness.id.localeCompare(right.harness.id);
}
function isSupportedHarness(entry) {
	return entry.support.supported;
}
function assertPluginHarnessConversationToolPolicySupport(harness, restricted) {
	if (harness.id !== "openclaw" && restricted && harness.conversationToolPolicySupport !== "exact") throw new AgentHarnessPreflightError(`${harness.label} cannot enforce this conversation's tool policy. Use the embedded runtime or ask in the main conversation.`, {
		scope: "harness",
		userMessage: `${harness.label} cannot run with this chat's tool restrictions. Choose a different model provider or update the tool settings.`
	});
}
//#endregion
//#region src/agents/harness/availability.ts
/** Lightweight runtime availability shared by execution and next-turn projections. */
function resolveAvailableAgentHarnessPolicy(params) {
	return resolveAgentHarnessAvailabilityDecision(params).policy;
}
function resolveAgentHarnessAvailabilityDecision(params) {
	const configured = resolveAgentHarnessPolicy({
		...params,
		modelApi: params.modelProvider?.api ?? params.modelApi,
		modelBaseUrl: params.modelProvider?.baseUrl ?? params.modelBaseUrl,
		requestTransportOverrides: params.modelProvider?.requestTransportOverrides ?? params.requestTransportOverrides
	});
	const pinnedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	const runtimeOverride = pinnedHarnessId ?? normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const policy = runtimeOverride && !isDefaultAgentRuntimeId(runtimeOverride) ? {
		...configured,
		runtime: runtimeOverride,
		runtimeSource: "model"
	} : configured;
	const implicit = policy.runtime === "codex" && policy.runtimeSource === "implicit";
	if (policy.runtime === "auto" || policy.runtime === "openclaw") return {
		kind: "available",
		policy
	};
	const registered = getRegisteredAgentHarness(policy.runtime);
	if (!registered) return implicit && params.mode !== "projection" ? {
		kind: "implicit-unavailable",
		policy: {
			...policy,
			runtime: "openclaw"
		}
	} : {
		kind: "available",
		policy
	};
	if (pinnedHarnessId === policy.runtime && !params.preparedModelProvider) return {
		kind: "available",
		policy
	};
	const provider = params.provider?.trim() ?? "";
	if (params.provider === void 0) return {
		kind: "available",
		policy
	};
	const support = registered.harness.supports(buildAgentHarnessSupportContext({
		...params,
		provider,
		requestedRuntime: policy.runtime,
		providerOwnership: params.resolveProviderOwnership?.()
	}));
	if (!support.supported && !policy.forcedByEnvironment) {
		if (implicit || support.fallbackRuntime === "openclaw") return {
			kind: implicit ? "implicit-unsupported" : "declared-fallback",
			policy: {
				...policy,
				runtime: "openclaw"
			},
			support
		};
	}
	return {
		kind: "available",
		policy,
		support
	};
}
//#endregion
export { compareHarnessSupport as a, resolveAgentHarnessPreparedRouteSupport as c, buildAgentHarnessSupportContext as i, resolveAutoAgentHarnessId as l, resolveAvailableAgentHarnessPolicy as n, projectPreparedModelProvider as o, assertPluginHarnessConversationToolPolicySupport as r, resolveAgentHarnessPreparedAuthSupport as s, resolveAgentHarnessAvailabilityDecision as t, resolveAgentHarnessAutoSelectionHint as u };
