import { l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { A as pluginToolMatcherCoversTool, D as createPluginToolMatcherScope, k as normalizePluginToolMatcher } from "./hooks-DuXrq03h.mjs";
//#region src/plugins/agent-tool-result-middleware.ts
const AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES = ["openclaw", "codex"];
const AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIME_SET = new Set(AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES);
function normalizeAgentToolResultMiddlewareRuntime(runtime) {
	const normalized = runtime.trim().toLowerCase();
	return AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIME_SET.has(normalized) ? normalized : void 0;
}
function normalizeAgentToolResultMiddlewareRuntimes(options) {
	const requested = options?.runtimes;
	if (!requested) return [...AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES];
	return normalizeAgentToolResultMiddlewareRuntimeIds(requested);
}
function normalizeAgentToolResultMiddlewareRuntimeIds(runtimes) {
	const normalized = [];
	for (const runtime of runtimes ?? []) {
		const value = normalizeAgentToolResultMiddlewareRuntime(runtime);
		if (value && !normalized.includes(value)) normalized.push(value);
	}
	return normalized;
}
function sameMiddlewareScope(left, right) {
	return left.runtimes.length === right.runtimes.length && left.runtimes.every((runtime) => right.runtimes.includes(runtime)) && (left.matcher ?? []).length === (right.matcher ?? []).length && (left.matcher ?? []).every((toolName) => right.matcher?.includes(toolName));
}
function readAgentToolResultMiddlewareScopes(registration) {
	return registration.scopes?.length ? registration.scopes : [{ runtimes: registration.runtimes }];
}
function appendAgentToolResultMiddlewareScope(registration, scope) {
	const normalizedMatcher = normalizePluginToolMatcher(scope.matcher);
	const normalizedScope = {
		runtimes: [...scope.runtimes],
		...normalizedMatcher ? { matcher: normalizedMatcher } : {}
	};
	const scopes = readAgentToolResultMiddlewareScopes(registration);
	if (!scopes.some((existing) => sameMiddlewareScope(existing, normalizedScope))) registration.scopes = [...scopes, normalizedScope];
	else if (!registration.scopes) registration.scopes = scopes;
	registration.runtimes = normalizeAgentToolResultMiddlewareRuntimeIds(readAgentToolResultMiddlewareScopes(registration).flatMap((entry) => entry.runtimes));
}
function agentToolResultMiddlewareRegistrationCoversTool(registration, runtime, toolName) {
	return readAgentToolResultMiddlewareScopes(registration).some((scope) => scope.runtimes.includes(runtime) && pluginToolMatcherCoversTool(scope.matcher, toolName));
}
function getAgentToolResultMiddlewareMatcherScope(runtime) {
	const matchers = (getActivePluginRegistry()?.agentToolResultMiddlewares ?? []).flatMap((registration) => readAgentToolResultMiddlewareScopes(registration).filter((scope) => scope.runtimes.includes(runtime)).map((scope) => scope.matcher));
	return createPluginToolMatcherScope(matchers);
}
function listAgentToolResultMiddlewares(runtime) {
	return getActivePluginRegistry()?.agentToolResultMiddlewares?.filter((entry) => entry.runtimes.includes(runtime)).map((entry) => entry.handler) ?? [];
}
//#endregion
export { normalizeAgentToolResultMiddlewareRuntimeIds as a, listAgentToolResultMiddlewares as i, appendAgentToolResultMiddlewareScope as n, normalizeAgentToolResultMiddlewareRuntimes as o, getAgentToolResultMiddlewareMatcherScope as r, agentToolResultMiddlewareRegistrationCoversTool as t };
