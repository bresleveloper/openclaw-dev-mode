import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { a as captureExternalSessionCommitGuard, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { n as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-owner-Dx0JDp93.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-Be176_GV.mjs";
import { a as hasPreparedGatewayDeviceAuthority, l as readGatewayDeviceRevocationGuard } from "./device-revocation-DpGQRUdo.mjs";
import { h as readQuestionDispatchCapability } from "./host-private-capabilities-eTr803c9.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { n as runOutsideOperatorToolGatewayAuthority, t as readOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
import { n as captureOperatorToolGatewayContinuationContextInternal, r as resolveInProcessGatewayDispatch } from "./server-plugin-in-process-authority-CiYjs5MA.mjs";
import { n as mergePluginRuntimeClientInternal } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { l as isInternalApprovalCommitGuard, u as retainInternalApprovalCommitGuard } from "./session-mutation-guards-ClTdEKsf.mjs";
import { r as isGatewayWorkerApprovalMethod } from "./approval-gateway-runtime-methods-sULF7KOY.mjs";
import { i as unwrapGatewayMethodDispatchResponse, n as dispatchGatewayRequestInProcessRaw, r as throwIfGatewayDispatchAborted } from "./server-in-process-dispatch-DK2h5_yW.mjs";
import { t as cancelSubagentCompletionToolHandoff } from "./subagent-completion-tool-handoff-D0AAXR3P.mjs";
//#region src/gateway/server-plugin-in-process-request-continuation.ts
/** Authorize one fixed request before the turn yields, then retain only its source. */
async function captureOperatorToolGatewayRequestContinuationContext(target, request) {
	const fixed = {
		method: request.method,
		params: structuredClone(request.params)
	};
	const captured = await captureOperatorToolGatewayContinuationContextInternal(target, { request: fixed });
	if (!captured) return;
	try {
		await captured.run(async () => {
			const resolved = resolveInProcessGatewayDispatch(fixed.method, fixed.params, {
				forceSyntheticClient: true,
				syntheticScopes: resolveLeastPrivilegeOperatorScopesForMethod(fixed.method, fixed.params),
				syntheticScopeMode: "minimum"
			});
			const [{ authorizeGatewayRequestPreDispatch }, { createRequestGatewayMethodRegistry }] = await Promise.all([import("./request-authorization-Ddj2BgWs.mjs"), import("./server-methods-Ccl2iWnl.mjs")]);
			captured.assertCurrent();
			const authorization = await authorizeGatewayRequestPreDispatch({
				method: fixed.method,
				requestParams: fixed.params,
				client: resolved.client,
				context: resolved.context,
				methodRegistry: resolved.context.getGatewayMethodRegistry?.() ?? createRequestGatewayMethodRegistry(),
				hasCurrentClientAuthority: resolved.hasCurrentClientAuthority,
				assertInvocationCurrent: captured.assertCurrent
			});
			try {
				captured.assertCurrent();
				if (authorization.error) {
					const { unwrapGatewayMethodDispatchResponse } = await import("./server-in-process-dispatch-CnXRjf5L.mjs");
					unwrapGatewayMethodDispatchResponse(fixed.method, {
						ok: false,
						error: authorization.error
					});
				}
				authorization.sessionAccessAuthority?.assertCurrent();
				authorization.sessionMutationAuthorization?.assertCurrent();
			} finally {
				authorization.sessionMutationAuthorization?.release?.();
				authorization.sessionAccessAuthority?.release();
			}
		});
	} catch (error) {
		captured.release();
		throw error;
	}
	let dispatched = false;
	return {
		assertCurrent: captured.assertCurrent,
		operatorAuthority: captured.operatorAuthority,
		signal: captured.signal,
		release: captured.release,
		async dispatch(options) {
			captured.assertCurrent();
			if (dispatched) throw new Error("Gateway request continuation already dispatched");
			dispatched = true;
			const { callAgentToolGatewayRequest } = await import("./in-process-gateway-CeT6JtgV.mjs");
			return await captured.run(() => callAgentToolGatewayRequest({
				method: fixed.method,
				params: fixed.params,
				sessionMutationCommitGuard: options.assertCurrent,
				signal: options.signal,
				timeoutMs: null
			}));
		},
		async enqueueSessionEvent(text, options) {
			const { enqueueSessionEventForHost } = await import("./session-event-handoff-CamGVbEN.mjs");
			const { runOutsidePluginRuntimeRegistryScope } = await import("./gateway-request-scope-4yDSzCvx.mjs");
			return captured.run(() => runOutsidePluginRuntimeRegistryScope(() => enqueueSessionEventForHost(text, options)));
		}
	};
}
//#endregion
//#region src/gateway/server-plugin-in-process-dispatch.ts
/** Authorizes a sessionless agent execution against its captured Gateway and caller. */
async function prepareInProcessAgentExecution(input) {
	const params = { ...input };
	const inheritedAuthority = readOperatorToolGatewayAuthority();
	const resolved = resolveInProcessGatewayDispatch("agent", { agentId: params.agentId }, {
		agentRunTracking: "plugin_subagent",
		pluginRuntimeOwnerId: params.pluginRuntimeOwnerId,
		resolveGatewayContext: params.resolveGatewayContext
	});
	const client = getPluginRuntimeGatewayRequestScope()?.client ?? resolved.client;
	let operatorSource = await captureGatewayOperatorRunAuthority({
		client: resolved.operatorSourceClient,
		context: resolved.context,
		hasCurrentClientAuthority: resolved.hasCurrentClientAuthority
	});
	const assertLifetime = () => {
		resolved.assertContextCurrent();
		resolved.assertInvocationCurrent();
		operatorSource?.authority.assertCurrent();
	};
	const assertCurrent = () => {
		assertLifetime();
		const error = authorizeGatewaySessionCreation({
			cfg: resolved.context.getRuntimeConfig(),
			agentId: params.agentId,
			client
		});
		if (error) unwrapGatewayMethodDispatchResponse("agent", {
			ok: false,
			error
		});
	};
	try {
		assertLifetime();
	} catch (error) {
		operatorSource?.release();
		throw error;
	}
	return {
		context: resolved.context,
		get operatorAuthority() {
			return operatorSource?.authority;
		},
		get signal() {
			return operatorSource?.authority.signal ? inheritedAuthority ? AbortSignal.any([inheritedAuthority.signal, operatorSource.authority.signal]) : operatorSource.authority.signal : inheritedAuthority?.signal;
		},
		release: () => operatorSource?.release(),
		assertCurrent,
		async authorize() {
			assertLifetime();
			const [{ authorizeGatewayRequestPreDispatch }, { createRequestGatewayMethodRegistry }] = await Promise.all([import("./request-authorization-Ddj2BgWs.mjs"), import("./server-methods-Ccl2iWnl.mjs")]);
			assertLifetime();
			const authorization = await authorizeGatewayRequestPreDispatch({
				method: "agent",
				requestParams: { agentId: params.agentId },
				client,
				context: resolved.context,
				methodRegistry: resolved.context.getGatewayMethodRegistry?.() ?? createRequestGatewayMethodRegistry()
			});
			authorization.sessionMutationAuthorization?.release?.();
			authorization.sessionAccessAuthority?.release();
			assertLifetime();
			if (authorization.error) unwrapGatewayMethodDispatchResponse("agent", {
				ok: false,
				error: authorization.error
			});
			operatorSource ??= await captureGatewayOperatorRunAuthority({
				client,
				context: resolved.context,
				hasCurrentClientAuthority: resolved.hasCurrentClientAuthority
			});
			assertCurrent();
		},
		run(run) {
			assertCurrent();
			return runWithoutOwnedSessionTranscriptWrites(() => runOutsideOperatorToolGatewayAuthority(run));
		}
	};
}
async function withInProcessGatewayDispatch(method, params, options, run) {
	const resolved = resolveInProcessGatewayDispatch(method, params, options);
	let releaseOperatorAuthority;
	try {
		const captured = await captureGatewayOperatorRunAuthority({
			client: resolved.operatorSourceClient,
			context: resolved.context,
			hasCurrentClientAuthority: resolved.hasCurrentClientAuthority
		});
		releaseOperatorAuthority = captured?.release;
		resolved.assertContextCurrent();
		resolved.assertInvocationCurrent();
		captured?.authority.assertCurrent();
		if (captured) {
			resolved.client = mergePluginRuntimeClientInternal(resolved.client, { operatorRunAuthority: captured.authority });
			const withCapturedAuthority = (assertCurrent) => composeSessionSourceAssertion([assertCurrent, captured.authority.assertCurrent]);
			resolved.assertContextCurrent = withCapturedAuthority(resolved.assertContextCurrent);
			resolved.assertSourceCurrent = withCapturedAuthority(resolved.assertSourceCurrent);
			const assertCreatedInputSourceCurrent = resolved.assertCreatedInputSourceCurrent;
			if (assertCreatedInputSourceCurrent) resolved.assertCreatedInputSourceCurrent = withCapturedAuthority(assertCreatedInputSourceCurrent);
		}
		return method === "agent" ? await runWithoutOwnedSessionTranscriptWrites(() => runOutsideOperatorToolGatewayAuthority(() => run(resolved))) : await run(resolved);
	} finally {
		releaseOperatorAuthority?.();
		cancelSubagentCompletionToolHandoff(resolved.delegatedToolPolicyHandoffId);
	}
}
function withInProcessGatewayRead(params, run) {
	const { method, scope } = params;
	return withInProcessGatewayDispatch(method, params.requestParams ?? {}, {
		forceSyntheticClient: true,
		pluginRuntimeOwnerId: scope?.pluginId,
		resolveGatewayContext: params.resolveGatewayContext,
		syntheticScopes: ["operator.read"],
		...!scope?.client ? { operatorRoleActor: { kind: "system" } } : {}
	}, async (resolved) => {
		const assertLifetime = () => {
			resolved.assertContextCurrent();
			resolved.assertInvocationCurrent();
			scope?.signal?.throwIfAborted();
			if (resolved.hasCurrentClientAuthority?.() === false) throw new Error(params.callerAuthorityError);
		};
		const [{ authorizeGatewayRequestPreDispatch }, { createRequestGatewayMethodRegistry }] = await Promise.all([import("./request-authorization-Ddj2BgWs.mjs"), import("./server-methods-Ccl2iWnl.mjs")]);
		assertLifetime();
		const authorization = await authorizeGatewayRequestPreDispatch({
			method,
			requestParams: params.requestParams ?? {},
			client: resolved.client,
			context: resolved.context,
			methodRegistry: resolved.context.getGatewayMethodRegistry?.() ?? createRequestGatewayMethodRegistry(),
			hasCurrentClientAuthority: resolved.hasCurrentClientAuthority,
			assertInvocationCurrent: assertLifetime
		});
		try {
			const assertCurrent = () => {
				assertLifetime();
				if (authorization.error) throw new Error(authorization.error.message);
				authorization.sessionAccessAuthority?.assertCurrent();
				authorization.sessionMutationAuthorization?.assertCurrent();
			};
			assertCurrent();
			const assertReadCurrent = method === "sessions.get" && params.requestParams ? await (await import("./server-plugin-in-process-session-read-dlQj-x-I.mjs")).prepareInProcessSessionRead(resolved, params.requestParams.key, assertCurrent) : assertCurrent;
			assertReadCurrent();
			return await run(resolved, assertReadCurrent);
		} finally {
			authorization.sessionMutationAuthorization?.release?.();
			authorization.sessionAccessAuthority?.release();
		}
	});
}
/** Local session input retains its operation's authorization and commit fences. */
async function runWithInProcessGatewaySessionMutation(method, params, run) {
	const assertCallerCurrent = captureGatewayToolCallerAssertion();
	const requestParams = method === "sessions.send" ? {
		key: params.sessionKey,
		agentId: params.agentId
	} : params;
	return await withInProcessGatewayDispatch(method, requestParams, {
		forceSyntheticClient: true,
		syntheticScopeMode: "minimum"
	}, async (resolved) => {
		const [{ authorizeGatewayRequestPreDispatch }, { createRequestGatewayMethodRegistry }] = await Promise.all([import("./request-authorization-Ddj2BgWs.mjs"), import("./server-methods-Ccl2iWnl.mjs")]);
		const assertInvocationCurrent = () => {
			assertCallerCurrent?.(method);
			resolved.assertContextCurrent();
			resolved.assertInvocationCurrent();
		};
		assertInvocationCurrent();
		const authorization = await authorizeGatewayRequestPreDispatch({
			method,
			requestParams,
			client: resolved.client,
			context: resolved.context,
			methodRegistry: resolved.context.getGatewayMethodRegistry?.() ?? createRequestGatewayMethodRegistry(),
			hasCurrentClientAuthority: resolved.hasCurrentClientAuthority,
			assertInvocationCurrent
		});
		try {
			const assertCurrent = () => {
				assertInvocationCurrent();
				if (authorization.error) unwrapGatewayMethodDispatchResponse(method, {
					ok: false,
					error: authorization.error
				});
				if (method === "sessions.send" && !authorization.sessionMutationAuthorization?.admittedTarget) throw new Error("Session target is unavailable for notification.");
				authorization.sessionMutationAuthorization?.assertCurrent();
				authorization.sessionAccessAuthority?.assertCurrent();
			};
			assertCurrent();
			return await run(assertCurrent);
		} finally {
			authorization.sessionMutationAuthorization?.release?.();
			authorization.sessionAccessAuthority?.release();
		}
	});
}
async function dispatchGatewayMethodInProcessRaw(method, params, options) {
	return await withInProcessGatewayDispatch(method, params, options, async (resolved) => {
		const assertExplicitRequestCurrent = composeSessionSourceAssertion([captureExternalSessionCommitGuard(options?.sessionMutationCommitGuard)], (assertSource) => {
			throwIfGatewayDispatchAborted(method, options?.signal);
			if (resolved.hasCurrentClientAuthority?.() === false) throw new Error(`Gateway client authority closed before dispatching ${method}.`);
			assertSource();
		}, { preparedCheck: (assertSource) => {
			throwIfGatewayDispatchAborted(method, options?.signal);
			if (!hasPreparedGatewayDeviceAuthority(resolved.client, resolved.hasCurrentClientAuthority)) throw new Error(`Gateway client authority closed before dispatching ${method}.`);
			assertSource();
		} });
		const assertCreatedInputSourceCurrent = resolved.assertCreatedInputSourceCurrent;
		const sessionMutationCommitGuard = composeSessionSourceAssertion([
			resolved.assertContextCurrent,
			resolved.assertInvocationCurrent,
			assertExplicitRequestCurrent
		]);
		if (isGatewayWorkerApprovalMethod(method) && (!options?.sessionMutationCommitGuard || isInternalApprovalCommitGuard(options.sessionMutationCommitGuard)) && (!resolved.hasCurrentClientAuthority || readGatewayDeviceRevocationGuard(resolved.hasCurrentClientAuthority))) retainInternalApprovalCommitGuard(sessionMutationCommitGuard);
		return await dispatchGatewayRequestInProcessRaw(method, params, {
			client: resolved.client,
			context: resolved.context,
			expectFinal: options?.expectFinal,
			isWebchatConnect: resolved.isWebchatConnect,
			hasCurrentClientAuthority: resolved.hasCurrentClientAuthority,
			methodRegistry: resolved.context.getGatewayMethodRegistry?.(),
			onAccepted: options?.onAccepted,
			onExecution: options?.onExecution,
			onSignalAbort: options?.onSignalAbort,
			requestIdPrefix: "plugin-subagent",
			prepareDispatchCurrent: options?.prepareDispatchCurrent,
			assertPreparationCurrent: composeSessionSourceAssertion([resolved.assertContextCurrent, resolved.assertInvocationCurrent]),
			sessionMutationCommitGuard,
			questionCallerRead: readQuestionDispatchCapability(options?.prepareDispatchCurrent)?.callerRead,
			...assertCreatedInputSourceCurrent ? { assertCreatedInputSourceCurrent: composeSessionSourceAssertion([assertCreatedInputSourceCurrent, assertExplicitRequestCurrent]) } : {},
			timeoutMs: options?.timeoutMs,
			...options?.signal ? { signal: options.signal } : {}
		});
	});
}
async function dispatchGatewayMethodInProcess(method, params, options) {
	if (method === "agent" || method === "agent.wait") return await withInProcessGatewayDispatch(method, params, options, async (resolved) => {
		const createAgentTurnFacade = resolved.context.createAgentTurnFacade;
		if (!createAgentTurnFacade) throw new Error(`Gateway instance agent turn facade unavailable for ${method}`);
		const facade = await createAgentTurnFacade({
			assertContextCurrent: method === "agent" ? resolved.assertSourceCurrent : resolved.assertContextCurrent,
			client: resolved.client,
			isWebchatConnect: resolved.isWebchatConnect
		});
		return method === "agent" ? await facade.dispatch(params, {
			prepareDispatchCurrent: options?.prepareDispatchCurrent,
			assertAdmissionCurrent: composeSessionSourceAssertion([resolved.assertInvocationCurrent, captureExternalSessionCommitGuard(options?.sessionMutationCommitGuard)]),
			privateCompletion: options?.privateCompletion,
			replyExpectation: options?.replyExpectation,
			settleWakeReplay: options?.settleWakeReplay,
			cancelOnDeadline: options?.cancelOnDeadline,
			expectFinal: options?.expectFinal,
			onAccepted: options?.onAccepted,
			onExecutionStarted: options?.onExecutionStarted,
			onSignalAbort: options?.onSignalAbort,
			signal: options?.signal,
			timeoutMs: options?.timeoutMs
		}) : await facade.wait(params, options?.timeoutMs, options?.signal, options?.onSignalAbort, options?.prepareDispatchCurrent);
	});
	const response = await dispatchGatewayMethodInProcessRaw(method, params, options);
	return unwrapGatewayMethodDispatchResponse(method, response);
}
//#endregion
export { withInProcessGatewayRead as a, runWithInProcessGatewaySessionMutation as i, dispatchGatewayMethodInProcessRaw as n, captureOperatorToolGatewayRequestContinuationContext as o, prepareInProcessAgentExecution as r, dispatchGatewayMethodInProcess as t };
