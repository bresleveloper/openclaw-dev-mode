import { t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { o as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as runWithSpawnBroker, t as getSpawnBroker } from "./context-5XyHo0If.mjs";
import { s as withoutGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
//#region src/gateway/scheduled-run-gateway-context.ts
/**
* Supplies a Gateway request context to scheduler-owned agent runs.
*
* Timer ticks, hook dispatch queues, and heartbeat wakeups have no Gateway
* request of their own, so trusted built-in tools (terminal, dashboard) resolve
* no context and fail mid-run. RPC-triggered runs already inherit a scope from
* their caller and must keep it.
*/
function fenceScheduledGatewayContextResolver(resolveGatewayContext) {
	if (!resolveGatewayContext) return;
	const resolveScheduledContext = () => {
		return resolveGatewayContext()?.resolveGatewayContext?.() ?? void 0;
	};
	bindGatewayContextResolver(resolveScheduledContext, resolveGatewayContext);
	return resolveScheduledContext;
}
/** Capture the service's transport before callbacks enter detached scheduling contexts. */
function createScheduledGatewayRunner(resolveGatewayContext) {
	const spawnBroker = getSpawnBroker();
	return (run) => runWithScheduledGatewayContext({
		resolveGatewayContext,
		spawnBroker,
		run
	});
}
/**
* Runs scheduler-owned work with a Gateway context.
*
* Detached work replaces the request scope and tool caller inherited when it
* was queued or armed. Caller-owned work must stay outside this boundary.
*/
async function runWithScheduledGatewayContext(params) {
	return await withoutGatewayToolCallerIdentity(() => runWithSpawnBroker(params.spawnBroker, async () => {
		const resolveGatewayContext = params.resolveGatewayContext;
		if (!resolveGatewayContext) return await params.run();
		return await withPluginRuntimeGatewayContextResolver(resolveGatewayContext, params.run, { inheritRequestScope: false });
	}));
}
//#endregion
export { fenceScheduledGatewayContextResolver as n, createScheduledGatewayRunner as t };
