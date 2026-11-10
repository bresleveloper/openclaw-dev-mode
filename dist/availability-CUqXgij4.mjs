import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BDZ8eM01.mjs";
import { n as buildAgentHarnessSupportContext } from "./support-CqB31PZB.mjs";
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
		contextManagement: registered.harness.contextManagement,
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
export { resolveAvailableAgentHarnessPolicy as n, resolveAgentHarnessAvailabilityDecision as t };
