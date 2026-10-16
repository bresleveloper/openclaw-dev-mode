import { n as runWithSpawnBroker, t as getSpawnBroker } from "./context-BGWzAY3i.mjs";
import { t as captureSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-context-CtZdPPcK.mjs";
import { t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { s as withPluginRuntimeGatewayContextResolver, u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { p as withoutGatewayToolCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
//#region src/gateway/scheduled-run-gateway-context.ts
/**
* Supplies a Gateway request context to scheduler-owned agent runs.
*
* Timer ticks, hook dispatch queues, and heartbeat wakeups have no Gateway
* request of their own, so trusted built-in tools (terminal, dashboard) resolve
* no context and fail mid-run. RPC admission keeps its caller scope; accepted
* scheduler-owned execution replaces that scope for work that can outlive the request.
*/
function fenceScheduledGatewayContextResolver(resolveGatewayContext) {
	if (!resolveGatewayContext) return;
	const resolveScheduledContext = () => {
		return resolveGatewayContext()?.resolveGatewayContext?.() ?? void 0;
	};
	bindGatewayContextResolver(resolveScheduledContext, resolveGatewayContext);
	return resolveScheduledContext;
}
/** Capture host resources; detached runs replace inherited request and tool-caller scopes. */
function createScheduledGatewayRunner(resolveGatewayContext, resolvePluginRegistry) {
	const spawnBroker = getSpawnBroker();
	const runWithReadOnlyWorkers = captureSqliteReadOnlyWorkerScope();
	return async (run) => await withoutGatewayToolCallerIdentity(() => runWithSpawnBroker(spawnBroker, async () => {
		const runWithRegistry = () => withPluginRuntimeRegistryScope(resolvePluginRegistry?.(), () => runWithReadOnlyWorkers(run));
		if (!resolveGatewayContext) return await runWithRegistry();
		return await withPluginRuntimeGatewayContextResolver(resolveGatewayContext, runWithRegistry, { inheritRequestScope: false });
	}));
}
//#endregion
export { fenceScheduledGatewayContextResolver as n, createScheduledGatewayRunner as t };
