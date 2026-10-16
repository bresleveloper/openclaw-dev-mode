import { a as getPluginRuntimeGatewayRequestScope, n as getInProcessGatewayRequestContext, s as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BSmCVVpP.mjs";
import { s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-BrMPjfvW.mjs";
import { a as getGatewayToolCallerIdentity, c as resolveGatewayToolOperatorSelection, p as withoutGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-DWr-fdGt.mjs";
import { l as runWithGatewaySessionSpawnContext, t as callGatewayTool } from "./gateway-w2F8o2pH.mjs";
import { r as createCronMutationCompletion } from "./mutation-completion-DRIubopj.mjs";
import { c as runWithOperatorToolGatewayContinuationContext, s as runWithOperatorToolGatewayCleanupContext, t as dispatchGatewayMethodInProcess, u as withInProcessAgentRuntimeIdentity } from "./server-plugin-in-process-dispatch-BzMtb5Z5.mjs";
import { n as readInProcessSessionDeliveryGeneration } from "./in-process-session-delivery-CX7--QA6.mjs";
import { a as bindInProcessSubagentResume, o as readInProcessSubagentResume } from "./server-plugin-runtime-client-BqJElO3o.mjs";
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
async function callAgentToolGatewayRequestBound(request, resolveGatewayContext, runtimeIdentity, assertCallerCurrent, forceTransport = false, revalidateOnCompletion = true, positional) {
	const method = request.method;
	const assertDispatchCurrent = request.assertDispatchCurrent;
	const completion = positional ? void 0 : createCronMutationCompletion(method);
	const assertCurrent = assertCallerCurrent || assertDispatchCurrent || (!revalidateOnCompletion || completion) && request.signal ? () => {
		assertCallerCurrent?.(method);
		assertDispatchCurrent?.();
		if (!revalidateOnCompletion || completion) request.signal?.throwIfAborted();
	} : void 0;
	assertCurrent?.();
	const boundGateway = resolveGatewayContext ? bindInProcessGatewayContext(method, resolveGatewayContext) : void 0;
	const scopes = request.scopes ?? resolveLeastPrivilegeOperatorScopesForMethod(method, request.params);
	if (forceTransport || !getInProcessGatewayRequestContext(boundGateway?.resolve)) {
		if (boundGateway && !forceTransport) throw new Error(`Gateway instance unavailable for ${method}`);
		if (getGatewayToolCallerIdentity()?.operatorAuthority) throw new Error("operator run authority requires its admitted Gateway");
		if (positional) return await runBoundInProcessGatewayCall(boundGateway, () => positional.fallback(scopes), assertCurrent);
		if (request.sessionMutationCommitGuard) throw new Error("Guarded session control requires its admitted in-process Gateway.");
		if (readInProcessSessionDeliveryGeneration(request.params)) throw new Error("Session-bound delivery requires its admitted in-process Gateway.");
		if (readInProcessSubagentResume(request)) throw new Error("Task resume requires trusted in-process Gateway dispatch.");
		if (runtimeIdentity) throw new Error("trusted agent runtime identity requires in-process Gateway dispatch");
		const { callGateway } = await import("./call-CWvmXO5x.mjs");
		const { agentRunTracking: _agentRunTracking, agentToolCaller: _agentToolCaller, sessionMutationCommitGuard: _sessionMutationCommitGuard, ...wireRequest } = request;
		return await runBoundInProcessGatewayCall(boundGateway, () => callGateway({
			...wireRequest,
			method
		}), assertCurrent, revalidateOnCompletion);
	}
	const syntheticScopeMode = request.scopes === void 0 ? "minimum" : "exact";
	const timeoutMs = request.timeoutMs === null ? void 0 : request.timeoutMs ?? DEFAULT_IN_PROCESS_GATEWAY_REQUEST_TIMEOUT_MS;
	const transfersCreatedInput = method === "sessions.create" && positional?.sessionCreation?.via === "spawn" && request.agentToolCaller !== void 0;
	const assertMutationCurrent = assertCurrent && !transfersCreatedInput ? () => {
		assertCurrent();
		request.sessionMutationCommitGuard?.();
	} : request.sessionMutationCommitGuard;
	const dispatchOptions = {
		forceSyntheticClient: true,
		operatorRoleActor: { kind: "system" },
		...request.agentRunTracking ? { agentRunTracking: request.agentRunTracking } : {},
		...request.agentToolCaller ? { agentToolCaller: request.agentToolCaller } : {},
		...positional?.sessionCreation ? { sessionCreation: positional.sessionCreation } : {},
		...positional?.onExecution ? { onExecution: positional.onExecution } : {},
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
		...assertMutationCurrent ? { sessionMutationCommitGuard: assertMutationCurrent } : {}
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
	return await callAgentToolGatewayRequestBound({
		method,
		params,
		agentToolCaller: options.sessionCreation?.via === "spawn" && caller && assertCallerCurrent ? {
			agentId: caller.agentId,
			sessionKey: caller.sessionKey,
			assertCurrent: assertCallerCurrent
		} : void 0,
		sessionMutationCommitGuard: options.sessionMutationCommitGuard,
		signal: options.signal,
		timeoutMs: options.timeoutMs ?? null
	}, callerGatewayContextResolver(options.resolveGatewayContext), void 0, assertCallerCurrent, false, true, {
		sessionCreation: options.sessionCreation,
		onExecution: options.onExecution,
		fallback
	});
}
const callInProcessGatewayTool = async (method, params, options = {}) => {
	return await callInProcessGatewayToolBound(method, params, options, async (scopes) => callGatewayTool(method, options.timeoutMs == null ? {} : { timeoutMs: options.timeoutMs }, params, {
		scopes,
		...options.signal ? { signal: options.signal } : {}
	}));
};
async function callInProcessGatewayToolWithCreation(method, params, creation, options = {}) {
	const requesterProfileId = resolveGatewayToolOperatorSelection().operatorAuthority?.profileId;
	const trustedCreation = creation.via === "spawn" && requesterProfileId ? {
		...creation,
		requesterProfileId
	} : creation;
	return await callInProcessGatewayToolBound(method, params, {
		...options,
		sessionCreation: trustedCreation
	}, async (scopes) => {
		const gatewayOptions = options.timeoutMs == null ? {} : { timeoutMs: options.timeoutMs };
		if (trustedCreation.via !== "spawn" || !trustedCreation.inheritedToolPolicy) return await callGatewayTool(method, gatewayOptions, params, {
			scopes,
			...options.signal ? { signal: options.signal } : {}
		});
		return await runWithGatewaySessionSpawnContext({
			...trustedCreation.requesterProfileId ? { requesterProfileId: trustedCreation.requesterProfileId } : {},
			...trustedCreation.completionOwnerSessionKey ? { completionOwnerSessionKey: trustedCreation.completionOwnerSessionKey } : {},
			requesterSenderIsOwner: trustedCreation.requesterSenderIsOwner,
			inheritedToolPolicy: trustedCreation.inheritedToolPolicy,
			...trustedCreation.inheritedPermissionMode ? { inheritedPermissionMode: trustedCreation.inheritedPermissionMode } : {},
			...trustedCreation.resolvedModel ? { resolvedModel: trustedCreation.resolvedModel } : {},
			...trustedCreation.spawnModelAutoSelection ? { spawnModelAutoSelection: trustedCreation.spawnModelAutoSelection } : {}
		}, () => callGatewayTool(method, gatewayOptions, params, {
			scopes,
			requireAgentRuntimeIdentity: true,
			...options.signal ? { signal: options.signal } : {}
		}));
	});
}
//#endregion
export { getInProcessGatewayToolContext as a, runWithGatewayToolCleanupContext as c, callInProcessGatewayToolWithCreation as i, runWithGatewayToolContinuationContext as l, callAgentToolGatewayRequest as n, hasGatewayToolRoutingContext as o, callInProcessGatewayTool as r, hasInProcessGatewayToolContext as s, bindAgentToolGatewayRequest as t, withAgentToolGatewayRuntimeIdentity as u };
