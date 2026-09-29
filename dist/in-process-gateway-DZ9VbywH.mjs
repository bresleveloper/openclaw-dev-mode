import { i as getPluginRuntimeGatewayRequestScope, o as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { c as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-C7g7eSZh.mjs";
import { i as getGatewayToolCallerIdentity, s as withoutGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-DvDb9xl2.mjs";
import { c as runWithGatewaySessionSpawnContext, t as callGatewayTool } from "./gateway-fiwofDIl.mjs";
import { r as createCronMutationCompletion } from "./mutation-completion-BHiX066E.mjs";
import { i as getInProcessGatewayRequestContext, l as withInProcessAgentRuntimeIdentity, n as dispatchGatewayMethodInProcess, o as runWithOperatorToolGatewayCleanupContext, s as runWithOperatorToolGatewayContinuationContext } from "./server-plugin-in-process-dispatch-kZUX_Us7.mjs";
import { a as readInProcessSubagentResume, i as bindInProcessSubagentResume } from "./server-plugin-runtime-client-BJsmC-p-.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/tools/in-process-gateway.ts
const agentToolGatewayRuntimeIdentities = /* @__PURE__ */ new WeakMap();
/** Carry trusted runtime identity without making it enumerable or transportable. */
function withAgentToolGatewayRuntimeIdentity(request, identity) {
	if (!identity) return request;
	const carried = { ...request };
	agentToolGatewayRuntimeIdentities.set(carried, identity);
	return bindInProcessSubagentResume(carried, readInProcessSubagentResume(request));
}
const DEFAULT_IN_PROCESS_GATEWAY_REQUEST_TIMEOUT_MS = 1e4;
function callerGatewayContextResolver(explicit) {
	return explicit ?? getGatewayToolCallerIdentity()?.gatewayContextResolver;
}
/** Transfer already-owned cleanup to its Gateway, without retaining the finished turn. */
function runWithGatewayToolCleanupContext(run, explicitResolver) {
	const resolveGatewayContext = callerGatewayContextResolver(explicitResolver);
	return withoutGatewayToolCallerIdentity(() => runWithOperatorToolGatewayCleanupContext(() => resolveGatewayContext ? withPluginRuntimeGatewayContextResolver(resolveGatewayContext, run) : run()));
}
/** Transfers accepted reply work to a bounded source-authority hold, not the tool lifetime. */
function runWithGatewayToolContinuationContext(run) {
	const resolveGatewayContext = callerGatewayContextResolver();
	return runWithOperatorToolGatewayContinuationContext(() => withoutGatewayToolCallerIdentity(() => resolveGatewayContext ? withPluginRuntimeGatewayContextResolver(resolveGatewayContext, run) : run()));
}
function bindInProcessGatewayContext(method, resolveGatewayContext) {
	const admittedContext = resolveGatewayContext();
	if (!admittedContext) throw new Error(`Gateway instance unavailable for ${method}`);
	const assertCurrent = () => {
		if (resolveGatewayContext() !== admittedContext) throw new Error(`Gateway instance unavailable for ${method}`);
	};
	return {
		assertCurrent,
		resolve: () => {
			assertCurrent();
			return admittedContext;
		}
	};
}
async function runBoundInProcessGatewayCall(boundGateway, run, assertCallerCurrent, revalidateOnCompletion = true, completion) {
	const assertCurrent = (afterDispatch = false) => {
		boundGateway?.assertCurrent();
		if (!afterDispatch || (completion ? !completion.isCommitted() : revalidateOnCompletion)) assertCallerCurrent?.();
	};
	try {
		assertCurrent();
		const result = completion ? await completion.run(() => run(boundGateway?.resolve)) : await run(boundGateway?.resolve);
		assertCurrent(true);
		return result;
	} catch (error) {
		assertCurrent(true);
		throw error;
	}
}
function hasInProcessGatewayToolContext() {
	return Boolean(getInProcessGatewayRequestContext(callerGatewayContextResolver()));
}
/** Whether Gateway routing belongs to this caller or the hosting process. */
function hasGatewayToolRoutingContext() {
	const resolver = callerGatewayContextResolver() ?? getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext;
	const context = getInProcessGatewayRequestContext(resolver);
	return context?.localEmbedded !== true && Boolean(resolver || context);
}
function getInProcessGatewayToolContext(explicitResolver) {
	return getInProcessGatewayRequestContext(callerGatewayContextResolver(explicitResolver));
}
/**
* Dispatches a request-shaped built-in tool call through the local Gateway
* router without opening a loopback transport. Outside a Gateway process, the
* same request falls back to the ordinary Gateway client.
*/
async function callAgentToolGatewayRequestBound(request, resolveGatewayContext, runtimeIdentity, assertCallerCurrent, forceTransport = false, revalidateOnCompletion = true) {
	const method = request.method;
	const assertDispatchCurrent = request.assertDispatchCurrent;
	const completion = createCronMutationCompletion(method);
	const assertCurrent = assertCallerCurrent || assertDispatchCurrent || (!revalidateOnCompletion || completion) && request.signal ? () => {
		assertCallerCurrent?.(method);
		assertDispatchCurrent?.();
		if (!revalidateOnCompletion || completion) request.signal?.throwIfAborted();
	} : void 0;
	assertCurrent?.();
	const boundGateway = resolveGatewayContext ? bindInProcessGatewayContext(method, resolveGatewayContext) : void 0;
	if (forceTransport || !getInProcessGatewayRequestContext(boundGateway?.resolve)) {
		if (getGatewayToolCallerIdentity()?.operatorAuthority) throw new Error("operator run authority requires its admitted Gateway");
		if (readInProcessSubagentResume(request)) throw new Error("Task resume requires trusted in-process Gateway dispatch.");
		if (runtimeIdentity) throw new Error("trusted agent runtime identity requires in-process Gateway dispatch");
		if (boundGateway && !forceTransport) throw new Error(`Gateway instance unavailable for ${method}`);
		const { callGateway } = await import("./call-bfuNQIMk.mjs");
		const { agentRunTracking: _agentRunTracking, agentToolCaller: _agentToolCaller, ...wireRequest } = request;
		return await runBoundInProcessGatewayCall(boundGateway, () => callGateway({
			...wireRequest,
			method
		}), assertCurrent, revalidateOnCompletion);
	}
	const scopes = request.scopes ?? resolveLeastPrivilegeOperatorScopesForMethod(method, request.params);
	const syntheticScopeMode = request.scopes === void 0 ? "minimum" : "exact";
	const timeoutMs = request.timeoutMs === null ? void 0 : request.timeoutMs ?? DEFAULT_IN_PROCESS_GATEWAY_REQUEST_TIMEOUT_MS;
	const dispatchOptions = {
		forceSyntheticClient: true,
		operatorRoleActor: { kind: "system" },
		...request.agentRunTracking ? { agentRunTracking: request.agentRunTracking } : {},
		...request.agentToolCaller ? { agentToolCaller: request.agentToolCaller } : {},
		syntheticScopes: scopes,
		syntheticScopeMode,
		...request.expectFinal !== void 0 ? { expectFinal: request.expectFinal } : {},
		...request.onAccepted ? { onAccepted: request.onAccepted } : {},
		...request.onSignalAbort ? { onSignalAbort: () => runWithGatewayToolCleanupContext(() => request.onSignalAbort?.((cleanupMethod, params, options) => callAgentToolGatewayRequestBound({
			method: cleanupMethod,
			params,
			...options
		}, boundGateway?.resolve ?? resolveGatewayContext, void 0, void 0)), boundGateway?.resolve ?? resolveGatewayContext) } : {},
		...request.signal && revalidateOnCompletion && !completion ? { signal: request.signal } : {},
		...timeoutMs !== void 0 ? { timeoutMs } : {},
		...boundGateway ? { resolveGatewayContext: boundGateway.resolve } : {},
		...assertCurrent ? { sessionMutationCommitGuard: assertCurrent } : {}
	};
	return await runBoundInProcessGatewayCall(boundGateway, async () => await dispatchGatewayMethodInProcess(method, request.params ?? {}, bindInProcessSubagentResume(withInProcessAgentRuntimeIdentity(dispatchOptions, runtimeIdentity), readInProcessSubagentResume(request))), assertCurrent, revalidateOnCompletion, completion);
}
/** Capture one Gateway and caller for a multi-request operation. */
function bindAgentToolGatewayRequest(options) {
	const scope = getPluginRuntimeGatewayRequestScope();
	const resolver = callerGatewayContextResolver(options?.resolveGatewayContext) ?? scope?.resolveGatewayContext;
	const admitted = getInProcessGatewayRequestContext(resolver);
	const resolveGatewayContext = resolver ? () => resolver() === admitted ? admitted : void 0 : admitted ? () => admitted : void 0;
	const assertCallerCurrent = captureGatewayToolCallerAssertion();
	const runInCallerContext = AsyncLocalStorage.snapshot();
	return async (request) => await runInCallerContext(() => callAgentToolGatewayRequestBound(request, resolveGatewayContext, agentToolGatewayRuntimeIdentities.get(request), assertCallerCurrent, !resolver && !admitted || options?.hostedOnly === true && admitted?.localEmbedded === true, options?.revalidateOnCompletion));
}
const callAgentToolGatewayRequest = async (request) => await bindAgentToolGatewayRequest()(request);
async function callInProcessGatewayToolBound(method, params, options, fallback) {
	const assertCallerCurrent = captureGatewayToolCallerAssertion();
	const caller = getGatewayToolCallerIdentity();
	const agentToolCaller = options.sessionCreation?.via === "spawn" && caller && assertCallerCurrent ? {
		agentId: caller.agentId,
		sessionKey: caller.sessionKey,
		assertCurrent: assertCallerCurrent
	} : void 0;
	assertCallerCurrent?.();
	const sessionMutationCommitGuard = assertCallerCurrent && !(method === "sessions.create" && agentToolCaller !== void 0) ? () => {
		assertCallerCurrent();
		options.sessionMutationCommitGuard?.();
	} : options.sessionMutationCommitGuard;
	const scopes = resolveLeastPrivilegeOperatorScopesForMethod(method, params);
	const resolveGatewayContext = callerGatewayContextResolver(options.resolveGatewayContext);
	const boundGateway = resolveGatewayContext ? bindInProcessGatewayContext(method, resolveGatewayContext) : void 0;
	if (getInProcessGatewayRequestContext(boundGateway?.resolve)) return await runBoundInProcessGatewayCall(boundGateway, async (boundResolver) => await dispatchGatewayMethodInProcess(method, params, {
		forceSyntheticClient: true,
		operatorRoleActor: { kind: "system" },
		syntheticScopes: scopes,
		syntheticScopeMode: "minimum",
		...agentToolCaller ? { agentToolCaller } : {},
		...options.sessionCreation ? { sessionCreation: options.sessionCreation } : {},
		...sessionMutationCommitGuard ? { sessionMutationCommitGuard } : {},
		...options.onExecution ? { onExecution: options.onExecution } : {},
		...options.signal ? { signal: options.signal } : {},
		...options.timeoutMs !== void 0 && options.timeoutMs !== null ? { timeoutMs: options.timeoutMs } : {},
		...boundResolver ? { resolveGatewayContext: boundResolver } : {}
	}), assertCallerCurrent);
	if (boundGateway) throw new Error(`Gateway instance unavailable for ${method}`);
	if (caller?.operatorAuthority) throw new Error("operator run authority requires its admitted Gateway");
	return await runBoundInProcessGatewayCall(void 0, () => fallback(scopes), assertCallerCurrent);
}
const callInProcessGatewayTool = async (method, params, options = {}) => {
	return await callInProcessGatewayToolBound(method, params, options, async (scopes) => callGatewayTool(method, options.timeoutMs == null ? {} : { timeoutMs: options.timeoutMs }, params, {
		scopes,
		...options.signal ? { signal: options.signal } : {}
	}));
};
async function callInProcessGatewayToolWithCreation(method, params, creation, options = {}) {
	const requesterProfileId = getGatewayToolCallerIdentity()?.operatorAuthority?.profileId;
	const trustedCreation = creation.via === "spawn" && requesterProfileId ? {
		...creation,
		requesterProfileId
	} : creation;
	return await callInProcessGatewayToolBound(method, params, {
		...options,
		sessionCreation: trustedCreation
	}, async (scopes) => {
		if (trustedCreation.via !== "spawn" || !trustedCreation.inheritedToolPolicy) return await callGatewayTool(method, {}, params, {
			scopes,
			...options.signal ? { signal: options.signal } : {},
			...options.timeoutMs !== void 0 ? { timeoutMs: options.timeoutMs } : {}
		});
		return await runWithGatewaySessionSpawnContext({
			...trustedCreation.requesterProfileId ? { requesterProfileId: trustedCreation.requesterProfileId } : {},
			...trustedCreation.completionOwnerSessionKey ? { completionOwnerSessionKey: trustedCreation.completionOwnerSessionKey } : {},
			inheritedToolPolicy: trustedCreation.inheritedToolPolicy,
			...trustedCreation.resolvedModel ? { resolvedModel: trustedCreation.resolvedModel } : {},
			...trustedCreation.spawnModelAutoSelection ? { spawnModelAutoSelection: trustedCreation.spawnModelAutoSelection } : {}
		}, () => callGatewayTool(method, {}, params, {
			scopes,
			requireAgentRuntimeIdentity: true,
			...options.signal ? { signal: options.signal } : {},
			...options.timeoutMs !== void 0 ? { timeoutMs: options.timeoutMs } : {}
		}));
	});
}
//#endregion
export { getInProcessGatewayToolContext as a, runWithGatewayToolCleanupContext as c, callInProcessGatewayToolWithCreation as i, runWithGatewayToolContinuationContext as l, callAgentToolGatewayRequest as n, hasGatewayToolRoutingContext as o, callInProcessGatewayTool as r, hasInProcessGatewayToolContext as s, bindAgentToolGatewayRequest as t, withAgentToolGatewayRuntimeIdentity as u };
