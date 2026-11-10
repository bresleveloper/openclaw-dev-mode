import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveMergedModelProviderConfig, n as createModelProviderRouteOverrideResolver, r as findConfiguredProviderModel } from "./model-provider-config-wdC9jpCz.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-DAkjzBhe.mjs";
import { a as resolveProviderModelRoutes } from "./provider-model-routes-CmpBxrCV.mjs";
import { n as resolveModelRouteIntent, t as resolveAgentRuntimePolicyAgentId } from "./model-runtime-policy-DSkspt0X.mjs";
import { t as canonicalizeProviderModelId } from "./provider-model-route-D2MOzv0r.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { t as hasAuthoredProviderRequestParams } from "./model-extra-params-HwiZgNCH.mjs";
import { t as AgentHarnessPreflightError } from "./errors-BAipjK5G.mjs";
import { r as listRegisteredAgentHarnesses } from "./registry-BDZ8eM01.mjs";
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
	}, { nativeContextManagement: params.contextManagement === "native" });
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
		api: modelProviderFacts.api,
		baseUrl: modelProviderFacts.baseUrl,
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
		}),
		requestTransportOverrides: modelProviderFacts.requestTransportOverrides
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
	const resolution = resolveProviderModelRoutes(params);
	if (resolution?.kind !== "routes") return;
	const policies = resolution.routes.map((route) => route.runtimePolicy);
	const first = policies[0];
	if (!first || policies.some((policy) => !policy)) return;
	return { compatibleIds: first.compatibleIds.filter((id, index, ids) => ids.indexOf(id) === index && policies.every((policy) => policy?.compatibleIds.includes(id))) };
}
/** Resolves the registered plugin harness that auto selection would choose. */
function resolveAutoAgentHarnessId(params) {
	return resolveAutoAgentHarnessSelection(listRegisteredAgentHarnesses().map(({ harness }) => harness), params.provider, () => buildAgentHarnessSupportContext({
		...params,
		requestedRuntime: "auto"
	})).selected?.id;
}
function resolveAutoAgentHarnessSelection(harnesses, provider, createSupportContext) {
	const hintedCandidates = harnesses.map((harness) => ({
		harness,
		support: resolveAgentHarnessAutoSelectionHint({
			harness,
			provider
		})
	}));
	let supportContext;
	const candidates = hintedCandidates.map(({ harness, support }) => ({
		harness,
		support: support ?? harness.supports(supportContext ??= createSupportContext())
	}));
	return {
		candidates,
		selected: candidates.filter(isSupportedHarness).toSorted((left, right) => {
			const priorityDelta = (right.support.priority ?? 0) - (left.support.priority ?? 0);
			return priorityDelta !== 0 ? priorityDelta : left.harness.id.localeCompare(right.harness.id);
		})[0]?.harness
	};
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
export { resolveAgentHarnessPreparedRouteSupport as a, resolveAgentHarnessAutoSelectionHint as c, resolveAgentHarnessPreparedAuthSupport as i, buildAgentHarnessSupportContext as n, resolveAutoAgentHarnessId as o, projectPreparedModelProvider as r, resolveAutoAgentHarnessSelection as s, assertPluginHarnessConversationToolPolicySupport as t };
