import { a as normalizeOptionalAgentRuntimeId, t as AUTO_AGENT_RUNTIME_ID } from "./agent-runtime-id-BZLMe-UU.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { l as resolveOpenAIImplicitAgentRuntime } from "./openai-routing-Bm7d8DH8.mjs";
//#region src/agents/harness/policy.ts
function resolveAgentHarnessPolicy(params, configured = resolveModelRuntimePolicy(params)) {
	if (params.config?.cloudWorkers?.requiredProfile) return {
		runtime: "openclaw",
		runtimeSource: "implicit"
	};
	const configuredRuntime = normalizeOptionalAgentRuntimeId(configured.policy?.id);
	const runtime = configuredRuntime && configuredRuntime !== "default" ? configuredRuntime : AUTO_AGENT_RUNTIME_ID;
	const runtimeSource = runtime === "auto" ? "implicit" : configured.source ?? "implicit";
	if (runtime !== "auto") return {
		runtime,
		runtimeSource,
		...configured.forcedByEnvironment ? { forcedByEnvironment: true } : {}
	};
	return {
		runtime: resolveOpenAIImplicitAgentRuntime({
			...params,
			runtimePolicy: configured,
			api: params.modelApi,
			baseUrl: params.modelBaseUrl
		}) || runtime,
		runtimeSource
	};
}
//#endregion
export { resolveAgentHarnessPolicy as t };
