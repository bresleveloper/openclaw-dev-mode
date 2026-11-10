import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as GatewayClientRequestError } from "./request-error-CnPCYq3A.mjs";
//#region src/gateway/server-recovery-runtime-context.ts
let activeRuntime;
function lifecycleUnavailable(method) {
	const message = `Gateway instance lifecycle dispatch unavailable for ${method}`;
	return method === "agent.wait" ? new GatewayClientRequestError({
		code: "UNAVAILABLE",
		message,
		retryable: true
	}) : new Error(message);
}
/** Registers the recovery principal owned by the latest process-global Gateway instance. */
function registerGatewayRecoveryRuntime(runtime) {
	const registration = { runtime };
	activeRuntime = registration;
	return () => {
		if (activeRuntime === registration) activeRuntime = void 0;
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
	if (!runtime) throw lifecycleUnavailable(method);
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
			if (hosted && (!runtime || resolver && resolver() !== context)) throw lifecycleUnavailable(request.method);
			request.assertDispatchCurrent?.();
		};
		assertCurrent();
		if (!hosted || request.url?.trim() || request.token?.trim() || request.password?.trim()) {
			const { callGateway } = await import("./call-BvbeEASg.mjs");
			return await callGateway(request);
		}
		if (!runtime) throw lifecycleUnavailable(request.method);
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
