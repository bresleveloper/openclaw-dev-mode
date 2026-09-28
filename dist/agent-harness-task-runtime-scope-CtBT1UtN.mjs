import { t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BLBH-Gpf.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
//#region src/tasks/agent-harness-task-runtime-scope.ts
const scopeRegistryKey = Symbol.for("openclaw.agentHarnessTaskRuntimeScope.registry");
function getScopeRegistry() {
	const globalState = globalThis;
	globalState[scopeRegistryKey] ??= { hostIssuedScopes: /* @__PURE__ */ new WeakSet() };
	return globalState[scopeRegistryKey];
}
/** Creates a host-issued task runtime scope for agent harness task execution. */
function createAgentHarnessTaskRuntimeScope(params) {
	const requesterSessionKey = params.requesterSessionKey.trim();
	if (!requesterSessionKey) throw new Error("Agent harness task runtime scope requires requesterSessionKey");
	const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
	const scope = {
		requesterSessionKey,
		...requesterOrigin ? { requesterOrigin } : {}
	};
	getScopeRegistry().hostIssuedScopes.add(scope);
	bindGatewayContextResolver(scope, params.gatewayContextResolver);
	return scope;
}
function assertAgentHarnessTaskRuntimeScope(scope) {
	if (!getScopeRegistry().hostIssuedScopes.has(scope)) throw new Error("Agent harness task runtime requires a host-issued scope");
	return scope;
}
//#endregion
export { createAgentHarnessTaskRuntimeScope as n, assertAgentHarnessTaskRuntimeScope as t };
