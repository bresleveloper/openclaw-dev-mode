import { n as findNormalizedProviderValue } from "./provider-id-Dq06Bcx6.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes-CA3PNIDt.js";
import { n as isThinkingLevelSupported, o as resolveSupportedThinkingLevel } from "./thinking-BcvxxriC.js";
import { i as listRegisteredAgentHarnesses } from "./registry-DtLZ3rba.js";
import { n as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-Dg3upVEO.js";
//#region src/agents/harness/support.ts
/** Builds the provider/model facts passed to registered harness support probes. */
function buildAgentHarnessSupportContext(params) {
	const providerConfig = findNormalizedProviderValue(params.config?.models?.providers, params.provider);
	const modelConfig = params.modelId ? providerConfig?.models?.find((entry) => entry.id === params.modelId) : void 0;
	return {
		provider: params.provider,
		modelId: params.modelId,
		modelProvider: providerConfig ? {
			api: modelConfig?.api ?? providerConfig.api ?? "openai-responses",
			baseUrl: modelConfig?.baseUrl ?? providerConfig.baseUrl,
			azureApiVersion: readStringParam(modelConfig?.params?.azureApiVersion ?? providerConfig.params?.azureApiVersion),
			request: providerConfig.request
		} : void 0,
		requestedRuntime: params.requestedRuntime,
		...params.providerOwnership ? {
			providerOwnerStatus: params.providerOwnership.status,
			providerOwnerPluginIds: params.providerOwnership.status === "unowned" ? [] : params.providerOwnership.pluginIds
		} : {}
	};
}
/** Resolves the registered plugin harness that auto selection would choose. */
function resolveAutoAgentHarnessId(params) {
	const supportContext = buildAgentHarnessSupportContext({
		...params,
		requestedRuntime: "auto"
	});
	return listRegisteredAgentHarnesses().map(({ harness }) => ({
		harness,
		support: harness.supports(supportContext)
	})).filter(isSupportedHarness).toSorted(compareHarnessSupport)[0]?.harness.id;
}
function compareHarnessSupport(left, right) {
	const priorityDelta = (right.support.priority ?? 0) - (left.support.priority ?? 0);
	return priorityDelta !== 0 ? priorityDelta : left.harness.id.localeCompare(right.harness.id);
}
function isSupportedHarness(entry) {
	return entry.support.supported;
}
function readStringParam(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
//#endregion
//#region src/agents/thinking-runtime.ts
/** Convert residual auto policy into the built-in fallback when no registry selection is needed. */
function concretizeAgentRuntime(runtime) {
	return runtime === "auto" ? "openclaw" : runtime;
}
/** Resolves an explicit session override before configured model/provider policy. */
function resolveEffectiveAgentRuntime(params) {
	const runtime = resolveSessionRuntimeOverrideForProvider({
		provider: params.provider,
		entry: params.sessionEntry,
		cfg: params.cfg
	}) ?? resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.modelId,
		config: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}).runtime;
	if (runtime === "auto") return resolveAutoAgentHarnessId({
		provider: params.provider,
		modelId: params.modelId,
		config: params.cfg
	}) ?? "openclaw";
	return concretizeAgentRuntime(runtime);
}
/** Revalidates a turn-local thinking level after fallback selects its actual model/runtime. */
function resolveCandidateThinkingLevel(params) {
	if (!params.level) return;
	const concreteRuntime = params.agentRuntime?.trim().toLowerCase();
	const agentRuntime = concreteRuntime && concreteRuntime !== "auto" && concreteRuntime !== "default" ? concreteRuntime : resolveEffectiveAgentRuntime({
		cfg: params.cfg ?? {},
		provider: params.provider,
		modelId: params.modelId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry
	});
	const policy = {
		provider: params.provider,
		model: params.modelId,
		level: params.level,
		catalog: params.catalog,
		agentRuntime
	};
	return isThinkingLevelSupported(policy) ? params.level : resolveSupportedThinkingLevel(policy);
}
//#endregion
export { compareHarnessSupport as a, buildAgentHarnessSupportContext as i, resolveCandidateThinkingLevel as n, resolveEffectiveAgentRuntime as r, concretizeAgentRuntime as t };
