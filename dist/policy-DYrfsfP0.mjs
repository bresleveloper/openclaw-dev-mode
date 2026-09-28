import { a as normalizeOptionalAgentRuntimeId, t as AUTO_AGENT_RUNTIME_ID } from "./agent-runtime-id-9mBje111.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-IbIjya7U.mjs";
import { l as resolveOpenAIImplicitAgentRuntime } from "./openai-routing-BspGC-O6.mjs";
//#region src/agents/harness/policy.ts
/** Resolves model/provider/runtime config into the canonical harness runtime id. */
function resolveAgentHarnessPolicy(params, configured = resolveModelRuntimePolicy(params)) {
	const configuredRuntime = normalizeOptionalAgentRuntimeId(configured.policy?.id);
	const runtime = configuredRuntime && configuredRuntime !== "default" ? configuredRuntime : AUTO_AGENT_RUNTIME_ID;
	const runtimeSource = runtime === "auto" ? "implicit" : configured.source ?? "implicit";
	if (runtime !== "auto") return {
		runtime,
		runtimeSource,
		...configured.forcedByEnvironment ? { forcedByEnvironment: true } : {}
	};
	const openAIImplicitRuntime = resolveOpenAIImplicitAgentRuntime({
		...params,
		runtimePolicy: configured,
		api: params.modelApi,
		baseUrl: params.modelBaseUrl
	});
	if (openAIImplicitRuntime) return {
		runtime: openAIImplicitRuntime,
		runtimeSource
	};
	return {
		runtime,
		runtimeSource
	};
}
//#endregion
export { resolveAgentHarnessPolicy as t };
