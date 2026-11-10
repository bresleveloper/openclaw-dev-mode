import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as withPluginRuntimeGatewayContextResolver, o as getPluginRuntimeGatewayRequestScope, r as getInProcessGatewayRequestContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { a as captureExternalSessionCommitGuard, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { l as resolveGatewayToolOperatorSelection, m as withoutGatewayToolCallerIdentity, o as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-Be176_GV.mjs";
import { h as readQuestionDispatchCapability } from "./host-private-capabilities-eTr803c9.mjs";
import { l as runWithGatewaySessionSpawnContext, t as callGatewayTool } from "./gateway-BC8tozR0.mjs";
import { r as createCronMutationCompletion } from "./mutation-completion-QPffi2k4.mjs";
import { a as runWithOperatorToolGatewayContinuationContext, i as runWithOperatorToolGatewayCleanupContext, s as withInProcessAgentRuntimeIdentity } from "./server-plugin-in-process-authority-CiYjs5MA.mjs";
import { n as readInProcessSessionDeliveryGeneration } from "./in-process-session-delivery-CzpdttLQ.mjs";
import { a as bindInProcessSubagentResume, o as readInProcessSubagentResume } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { u as retainInternalApprovalCommitGuard } from "./session-mutation-guards-ClTdEKsf.mjs";
import { r as isGatewayWorkerApprovalMethod } from "./approval-gateway-runtime-methods-sULF7KOY.mjs";
import { t as dispatchGatewayMethodInProcess } from "./server-plugin-in-process-dispatch-D8bA485y.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/session-send-delivery.ts
const admission = resolveGlobalSingleton(Symbol.for("openclaw.sessionSendDeliveryAdmission"), () => new AsyncLocalStorage());
/** Only the in-process communication owner may attach durable delivery facts. */
function withSessionSendDelivery(value, run) {
	return admission.run(value, run);
}
/** Carry invocation-time delivery facts through a previously captured caller context. */
function bindSessionSendDeliveryContext(run) {
	const value = admission.getStore();
	return () => admission.run(value, run);
}
function readSessionSendDeliveryAdmission(params) {
	const value = admission.getStore();
	return value?.delivery.runId === params.runId && value.delivery.target.sessionKey === params.sessionKey && value.delivery.target.sessionId === params.sessionId && value.delivery.target.agentId === params.agentId ? value : void 0;
}
function readSessionSendDelivery(message) {
	const value = message["__openclaw"]?.sessionSendDelivery;
	const endpoint = (entry) => isRecord(entry) && typeof entry.agentId === "string" && typeof entry.sessionKey === "string" && typeof entry.sessionId === "string" && (entry.lifecycleRevision === void 0 || typeof entry.lifecycleRevision === "string");
	if (!isRecord(value) || value.version !== 1 || typeof value.runId !== "string" || typeof value.message !== "string" || typeof value.sandboxed !== "boolean" || !endpoint(value.source) || !endpoint(value.target) || message.provenance?.kind !== "inter_session" || message.provenance.sourceTool !== "sessions_send" || message.provenance.sourceSessionKey !== value.source.sessionKey || message.idempotencyKey !== `${value.runId}:user`) return;
	return {
		version: 1,
		runId: value.runId,
		source: value.source,
		target: value.target,
		sandboxed: value.sandboxed,
		message: value.message
	};
}
//#endregion
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
	const callerSource = assertCallerCurrent && Object.assign(() => assertCallerCurrent(method), assertCallerCurrent);
	const assertCurrent = assertCallerCurrent || assertDispatchCurrent || (!revalidateOnCompletion || completion) && request.signal ? composeSessionSourceAssertion([callerSource, assertDispatchCurrent], (assertSources) => {
		assertSources();
		if (!revalidateOnCompletion || completion) request.signal?.throwIfAborted();
	}) : void 0;
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
		const { callGateway } = await import("./call-BvbeEASg.mjs");
		const { agentRunTracking: _agentRunTracking, agentToolCaller: _agentToolCaller, sessionMutationCommitGuard: _sessionMutationCommitGuard, replyExpectation: _replyExpectation, ...wireRequest } = request;
		return await runBoundInProcessGatewayCall(boundGateway, () => callGateway({
			...wireRequest,
			method,
			assertDispatchCurrent: readQuestionDispatchCapability(request.assertDispatchCurrent)?.assertCompatibilityCurrent ?? request.assertDispatchCurrent
		}), assertCurrent, revalidateOnCompletion);
	}
	const syntheticScopeMode = request.scopes === void 0 ? "minimum" : "exact";
	const timeoutMs = request.timeoutMs === null ? void 0 : request.timeoutMs ?? DEFAULT_IN_PROCESS_GATEWAY_REQUEST_TIMEOUT_MS;
	const transfersCreatedInput = method === "sessions.create" && positional?.sessionCreation?.via === "spawn" && request.agentToolCaller !== void 0;
	let assertMutationCurrent = assertCurrent && !transfersCreatedInput ? composeSessionSourceAssertion([assertCurrent, captureExternalSessionCommitGuard(request.sessionMutationCommitGuard)]) : captureExternalSessionCommitGuard(request.sessionMutationCommitGuard);
	if (isGatewayWorkerApprovalMethod(method) && !request.sessionMutationCommitGuard && !assertDispatchCurrent) assertMutationCurrent = retainInternalApprovalCommitGuard(composeSessionSourceAssertion([assertMutationCurrent]));
	const dispatchOptions = {
		prepareDispatchCurrent: request.prepareDispatchCurrent,
		...request.replyExpectation ? { replyExpectation: request.replyExpectation } : {},
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
	return async (request) => await runInCallerContext(bindSessionSendDeliveryContext(() => callAgentToolGatewayRequestBound(request, resolveGatewayContext, agentToolGatewayRuntimeIdentities.get(request), assertCallerCurrent, !resolver && !admitted || options?.hostedOnly === true && admitted?.localEmbedded === true, options?.revalidateOnCompletion)));
}
const callAgentToolGatewayRequest = async (request) => await bindAgentToolGatewayRequest()(request);
async function callInProcessGatewayToolBound(method, params, options) {
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
		fallback: async (scopes) => {
			const creation = options.sessionCreation;
			if (creation?.childSessionPublication) throw new Error("Automatic public work sessions require the live in-process Gateway.");
			const gatewayOptions = options.timeoutMs == null ? {} : { timeoutMs: options.timeoutMs };
			const dispatch = (requireAgentRuntimeIdentity) => callGatewayTool(method, gatewayOptions, params, {
				scopes,
				...requireAgentRuntimeIdentity ? { requireAgentRuntimeIdentity } : {},
				...options.signal ? { signal: options.signal } : {}
			});
			if (creation?.via !== "spawn" || !creation.inheritedToolPolicy) return await dispatch();
			return await runWithGatewaySessionSpawnContext({
				...creation.requesterProfileId ? { requesterProfileId: creation.requesterProfileId } : {},
				...creation.completionOwnerSessionKey ? { completionOwnerSessionKey: creation.completionOwnerSessionKey } : {},
				requesterSenderIsOwner: creation.requesterSenderIsOwner,
				inheritedToolPolicy: creation.inheritedToolPolicy,
				...creation.inheritedPermissionMode ? { inheritedPermissionMode: creation.inheritedPermissionMode } : {},
				...creation.resolvedModel ? { resolvedModel: creation.resolvedModel } : {},
				...creation.spawnModelAutoSelection ? { spawnModelAutoSelection: creation.spawnModelAutoSelection } : {}
			}, () => dispatch(true));
		}
	});
}
const callInProcessGatewayTool = async (method, params, options = {}) => await callInProcessGatewayToolBound(method, params, options);
async function callInProcessGatewayToolWithCreation(method, params, creation, options = {}) {
	const requesterProfileId = resolveGatewayToolOperatorSelection().operatorAuthority?.profileId;
	const trustedCreation = creation.via === "spawn" && requesterProfileId ? {
		...creation,
		requesterProfileId
	} : creation;
	return await callInProcessGatewayToolBound(method, params, {
		...options,
		sessionCreation: trustedCreation
	});
}
//#endregion
export { getInProcessGatewayToolContext as a, runWithGatewayToolCleanupContext as c, readSessionSendDelivery as d, readSessionSendDeliveryAdmission as f, callInProcessGatewayToolWithCreation as i, runWithGatewayToolContinuationContext as l, callAgentToolGatewayRequest as n, hasGatewayToolRoutingContext as o, withSessionSendDelivery as p, callInProcessGatewayTool as r, hasInProcessGatewayToolContext as s, bindAgentToolGatewayRequest as t, withAgentToolGatewayRuntimeIdentity as u };
