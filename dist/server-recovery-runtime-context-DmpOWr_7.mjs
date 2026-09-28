import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
//#region src/gateway/server-recovery-runtime-context.ts
let activeRuntime;
/** Registers the recovery principal owned by the latest process-global Gateway instance. */
function registerGatewayRecoveryRuntime(runtime) {
	const owner = Symbol("gateway-recovery-runtime");
	activeRuntime = {
		owner,
		runtime
	};
	let released = false;
	return () => {
		if (released) return;
		released = true;
		if (activeRuntime?.owner === owner) activeRuntime = void 0;
	};
}
function getGatewayRecoveryRuntime() {
	return activeRuntime?.runtime;
}
/** Dispatches detached Gateway lifecycle work through the active instance principal. */
async function dispatchGatewayLifecycleMethod(method, params, options = {}) {
	const agentParams = params;
	const { resolveGatewayContext, timeoutMs, ...dispatchOptions } = options;
	const runtime = resolveGatewayContext ? resolveGatewayContext()?.recoveryRuntime : getGatewayRecoveryRuntime();
	if (!runtime) throw new Error(`Gateway instance lifecycle dispatch unavailable for ${method}`);
	return await runtime.dispatchAgent(agentParams, timeoutMs, dispatchOptions);
}
/** Capture the lifecycle owner without retaining a completed tool invocation's authority. */
function bindGatewayLifecycleRequest(explicitResolver) {
	const scope = getPluginRuntimeGatewayRequestScope();
	const resolver = explicitResolver ?? scope?.resolveGatewayContext;
	const context = resolver ? resolver() : scope?.context;
	const runtime = context?.recoveryRuntime;
	const hosted = context?.localEmbedded !== true && Boolean(resolver || context);
	return async (request) => {
		const assertCurrent = () => {
			if (hosted && (!runtime || resolver && resolver() !== context)) throw new Error(`Gateway instance lifecycle dispatch unavailable for ${request.method}`);
			request.assertDispatchCurrent?.();
		};
		assertCurrent();
		if (!hosted || request.url?.trim() || request.token?.trim() || request.password?.trim()) {
			const { callGateway } = await import("./call-bfuNQIMk.mjs");
			return await callGateway(request);
		}
		if (!runtime) throw new Error(`Gateway instance lifecycle dispatch unavailable for ${request.method}`);
		const timeoutMs = request.timeoutMs === null ? void 0 : request.timeoutMs ?? 1e4;
		let result;
		if (request.method === "agent.wait") result = await runtime.waitForAgent(request.params, timeoutMs, request.signal);
		else if (request.method === "chat.history" || request.method === "chat.abort" || request.method === "sessions.delete") result = await runtime.dispatchSessionMethod(request.method, request.params, {
			timeoutMs,
			signal: request.signal,
			assertCurrent
		});
		else throw new Error(`Gateway lifecycle principal cannot dispatch ${request.method}`);
		assertCurrent();
		return result;
	};
}
//#endregion
export { registerGatewayRecoveryRuntime as i, dispatchGatewayLifecycleMethod as n, getGatewayRecoveryRuntime as r, bindGatewayLifecycleRequest as t };
