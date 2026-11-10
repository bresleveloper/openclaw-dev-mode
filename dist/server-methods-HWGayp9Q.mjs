import { r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getPluginRuntimeGatewayNodeAuthorities, l as withPluginRuntimeGatewayRequestScope, o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { a as captureExternalSessionCommitGuard, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { N as tryBeginGatewayRootWorkAdmission, d as getGatewaySuspendAdmissionPhase, j as tryBeginGatewayPreparedRestartRootWorkAdmission, l as getGatewayRestartDrainSignal, p as isGatewayRestartDraining, y as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { t as AgentDatabaseAdmissionError } from "./agent-database-admission-CeDA0ojh.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified } from "./core-method-policy-BdmwLcmW.mjs";
import { n as createGatewayMethodRegistry, t as createGatewayMethodDescriptorsFromHandlers } from "./registry-DRhwbWWk.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as GATEWAY_SUSPEND_IDENTITY_RETRY_AFTER_MS, r as GATEWAY_SUSPEND_UNAVAILABLE_REASON, t as GATEWAY_RESTART_UNAVAILABLE_REASON } from "./restart-unavailable-D7hxHvLm.mjs";
import { a as isGatewayClientProfilePending } from "./gateway-client-identity-DXWhtQve.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as createExpectedProfileBinding } from "./expected-profile-Bnus0Sst.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as dispatchSharedRead } from "./shared-read-responses-Dazz7RX_.mjs";
import { i as classifyGatewayStaleInstall } from "./stale-install-CUqZoIvN.mjs";
import { t as errorShapeFromError } from "./error-shape--ChVezuW.mjs";
import { a as readGatewayRequestMutationAuthority, c as withSessionMutationCommitGuard, i as captureGatewayRequestOperatorGuard, t as bindGatewayRequestHandlerMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { n as resolveRuntimeSessionParticipantRequest } from "./session-tool-participant-BFO6ds0j.mjs";
import { r as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-DhEbrRsy.mjs";
import { n as consumeControlPlaneWriteBudget, t as CONTROL_PLANE_RATE_LIMIT_WINDOW_MS } from "./control-plane-rate-limit-cCjHiHIA.mjs";
import { r as startChatSendDiagnostics, t as bindChatSendDiagnostics } from "./chat-send-diagnostics-uaVFgt_W.mjs";
import { n as prepareGatewayRequestHandler } from "./lazy-core-handlers-D2IxYK_e.mjs";
import { n as gatewayRouterUploadPolicyError, t as coreGatewayHandlers } from "./core-handlers-CbFk9Z4X.mjs";
import { t as authorizeGatewayRequestPreDispatch } from "./request-authorization-CyKcxYHJ.mjs";
import { t as isTargetedNonSafeGatewayRestartRequest } from "./restart-request-Bb_ECfbs.mjs";
import { t as canSelectQuestion } from "./question-access-BYyGuNrC.mjs";
import { t as GatewayRpcDiagnostics } from "./request-diagnostics-CnX1YrNb.mjs";
import { t as sessionLog } from "./session-log-BKA9lku6.mjs";
import { n as retainSessionListForegroundWork } from "./session-projection-work-COMF0wXd.mjs";
import { n as startSlowRequestDiagnostics } from "./slow-request-diagnostics-Ba6xRXbV.mjs";
//#region src/gateway/server-request-lifecycle.ts
const SUSPEND_CONTROL_METHODS = /* @__PURE__ */ new Set([
	"gateway.suspend.prepare",
	"gateway.suspend.status",
	"gateway.suspend.resume",
	"gateway.suspend.handoff"
]);
function isGatewayRootlessRequestAllowed(method) {
	return SUSPEND_CONTROL_METHODS.has(method) || method === "update.runs.get" && getGatewayRestartDrainSignal().aborted && getGatewaySuspendAdmissionPhase() === "accepting";
}
function runGatewayPendingWorkContinuation(params) {
	if (!isRecord(params.requestParams)) return null;
	const request = params.requestParams;
	if (params.client?.connect.role === "node") {
		if (params.admission !== "continuation" && getGatewaySuspendAdmissionPhase() !== "draining" && !isGatewayRestartDraining()) return null;
		const invokeId = params.method === "node.invoke.progress" ? request.invokeId : params.method === "node.invoke.result" ? request.id : void 0;
		if (typeof invokeId !== "string" || typeof request.nodeId !== "string") return null;
		return params.context.nodeRegistry.runPendingInvokeContinuation({
			invokeId,
			nodeId: request.nodeId,
			connId: params.client.connId,
			run: params.run
		});
	}
	if (params.admission === "continuation" || getGatewaySuspendAdmissionPhase() !== "draining" && !isGatewayRestartDraining() || params.client?.connect.role !== "operator" || typeof request.id !== "string") return null;
	if (params.method === "question.resolve" || params.method === "question.get") {
		const questionManager = params.context.questionManager;
		return questionManager && canSelectQuestion(questionManager, request.id, params.client) ? questionManager.runPendingContinuation(request.id, params.run) : null;
	}
	return (params.method === "exec.approval.resolve" ? params.context.execApprovalManager : params.method === "plugin.approval.resolve" ? params.context.pluginApprovalManager : params.method === "approval.resolve" ? request.kind === "exec" ? params.context.execApprovalManager : request.kind === "plugin" ? params.context.pluginApprovalManager : request.kind === "system-agent" ? params.context.systemAgentApprovalManager : void 0 : void 0)?.runPendingContinuation(request.id, params.run) ?? null;
}
function workAdmissionUnavailableError(method) {
	const restartDraining = isGatewayRestartDraining();
	return errorShape(ErrorCodes.UNAVAILABLE, `${method} unavailable during gateway ${restartDraining ? "restart" : "suspension"}`, {
		retryable: true,
		retryAfterMs: !restartDraining && method === "agent.identity.get" ? GATEWAY_SUSPEND_IDENTITY_RETRY_AFTER_MS : 1e3,
		details: {
			method,
			reason: restartDraining ? GATEWAY_RESTART_UNAVAILABLE_REASON : GATEWAY_SUSPEND_UNAVAILABLE_REASON,
			phase: getGatewaySuspendAdmissionPhase()
		}
	});
}
/** Cancels passive waiters without abandoning their owner's admitted writes. */
async function runWithGatewayObservationScope(method, run, requestSignals, cancelled) {
	const work = new AsyncWorkScope();
	const rootHold = { release: null };
	const retainRoot = () => {
		work.signal.throwIfAborted();
		rootHold.release ??= retainGatewayRootWorkAdmissionContinuation();
	};
	const signal = AbortSignal.any([
		getGatewayRestartDrainSignal(),
		getAsyncWorkSignal(),
		...requestSignals
	].filter((candidate) => candidate !== void 0));
	const close = () => work.beginClose(signal.reason);
	signal.addEventListener("abort", close, { once: true });
	if (signal.aborted) close();
	try {
		work.signal.throwIfAborted();
		const result = await work.track(() => run(retainRoot));
		work.signal.throwIfAborted();
		return result;
	} catch (error) {
		if (!work.signal.aborted) throw error;
		return await cancelled(getGatewayRestartDrainSignal().aborted ? workAdmissionUnavailableError(method) : errorShape(ErrorCodes.UNAVAILABLE, `${method} observation cancelled`, { retryable: true }));
	} finally {
		signal.removeEventListener("abort", close);
		try {
			await work.drain();
		} finally {
			rootHold.release?.();
		}
	}
}
//#endregion
//#region src/gateway/server-methods.ts
function createRequestGatewayMethodRegistry(extraHandlers) {
	const gatewayPluginRegistry = getActivePluginRegistry();
	const gatewayPluginHandlers = gatewayPluginRegistry?.gatewayHandlers ?? {};
	const pluginMethodNames = new Set(Object.keys(gatewayPluginHandlers));
	const coreDescriptorHandlers = { ...coreGatewayHandlers };
	const auxHandlers = [];
	for (const [method, extraHandler] of Object.entries(extraHandlers ?? {})) {
		if (pluginMethodNames.has(method)) continue;
		if (isCoreGatewayMethodClassified(method)) coreDescriptorHandlers[method] = extraHandler;
		else auxHandlers.push([method, extraHandler]);
	}
	return createGatewayMethodRegistry([
		...createCoreGatewayMethodDescriptors(coreDescriptorHandlers),
		...gatewayPluginRegistry?.gatewayMethodDescriptors ?? [],
		...createGatewayMethodDescriptorsFromHandlers({
			handlers: Object.fromEntries(auxHandlers),
			owner: {
				kind: "aux",
				area: "gateway-extra"
			},
			defaultScope: ADMIN_SCOPE
		})
	], gatewayPluginRegistry ?? void 0);
}
/** Runs admitted Gateway work inside the shared root and plugin request scopes. */
async function runWithGatewayRequestEnvelope(method, client, fn, options) {
	const rejectRateLimitedControlPlaneWrite = () => {
		if (!options.methodRegistry.isControlPlaneWrite(method)) return;
		const budget = consumeControlPlaneWriteBudget({
			client,
			method
		});
		if (budget.allowed) return;
		const actor = resolveControlPlaneActor(client);
		options.context.logGateway.warn(`control-plane write rate-limited method=${method} ${formatControlPlaneActor(actor)} retryAfterMs=${budget.retryAfterMs} key=${budget.key}`);
		return errorShape(ErrorCodes.UNAVAILABLE, `rate limit exceeded for ${method}; retry after ${Math.ceil(budget.retryAfterMs / 1e3)}s`, {
			retryable: true,
			retryAfterMs: budget.retryAfterMs,
			details: {
				method,
				limit: `30 per ${CONTROL_PLANE_RATE_LIMIT_WINDOW_MS / 1e3}s`
			}
		});
	};
	const isSuspendPrepare = method === "gateway.suspend.prepare";
	const preAdmissionRateLimitError = isSuspendPrepare ? rejectRateLimitedControlPlaneWrite() : void 0;
	if (preAdmissionRateLimitError) return await options.reject(preAdmissionRateLimitError);
	const rootWorkAdmission = options.admission === "continuation" ? null : tryBeginGatewayRootWorkAdmission(`ws:${method}`) ?? (method === "gateway.restart.request" && isTargetedNonSafeGatewayRestartRequest(options.requestParams) ? tryBeginGatewayPreparedRestartRootWorkAdmission() : null);
	if (!rootWorkAdmission) {
		const continuation = runGatewayPendingWorkContinuation({
			method,
			client,
			requestParams: options.requestParams,
			context: options.context,
			admission: options.admission,
			run: invokeWithRequestScope
		});
		if (continuation) return await continuation;
		if (options.admission === "continuation") return await options.reject(errorShape(ErrorCodes.UNAVAILABLE, `${method} unavailable during gateway shutdown`));
	}
	if (isSuspendPrepare && rootWorkAdmission && !rootWorkAdmission.ownsRoot) return await options.reject(errorShape(ErrorCodes.UNAVAILABLE, "gateway suspension cannot begin from a nested request", {
		retryable: true,
		retryAfterMs: 1e3,
		details: {
			method,
			reason: "nested-gateway-request"
		}
	}));
	if (!rootWorkAdmission && !isGatewayRootlessRequestAllowed(method)) return await options.reject(workAdmissionUnavailableError(method));
	async function invokeWithRequestScope() {
		const postAdmissionRateLimitError = isSuspendPrepare ? void 0 : rejectRateLimitedControlPlaneWrite();
		if (postAdmissionRateLimitError) return await options.reject(postAdmissionRateLimitError);
		const releaseForegroundWork = retainSessionListForegroundWork();
		try {
			const pluginRegistry = options.methodRegistry.pluginRegistry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry() ?? void 0;
			return await withPluginRuntimeGatewayRequestScope({
				context: options.context,
				resolveGatewayContext: options.context.resolveGatewayContext,
				client,
				signal: options.signal,
				hasCurrentClientAuthority: options.hasCurrentClientAuthority,
				isWebchatConnect: options.isWebchatConnect,
				...client?.internal?.nodeInvokeStream ? getPluginRuntimeGatewayNodeAuthorities() : {},
				...pluginRegistry ? { pluginRegistry } : {}
			}, fn);
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) return await options.reject(error.error);
			const staleInstall = classifyGatewayStaleInstall(error);
			if (staleInstall) return await options.reject(staleInstall.error);
			throw error;
		} finally {
			releaseForegroundWork();
		}
	}
	if (!rootWorkAdmission) return await invokeWithRequestScope();
	try {
		return await rootWorkAdmission.run(invokeWithRequestScope);
	} finally {
		rootWorkAdmission.release();
	}
}
/** Authorizes and dispatches one gateway JSON-RPC-style request. */
async function handleGatewayRequest(opts, diagnostics) {
	const { req, client, isWebchatConnect, context, signal, hasCurrentClientAuthority } = opts;
	const methodRegistry = opts.methodRegistry?.getHandler(req.method) !== void 0 ? opts.methodRegistry : createRequestGatewayMethodRegistry(opts.extraHandlers);
	const observation = methodRegistry.isObservation(req.method);
	let observationResponded = false;
	let respondCancelled = opts.respond;
	const dispatch = async (retainRoot) => {
		try {
			var _usingCtx$1 = _usingCtx();
			const observationSignal = observation ? getAsyncWorkSignal() : void 0;
			const chatSendDiagnostics = _usingCtx$1.u(req.method === "chat.send" ? startChatSendDiagnostics(context.logGateway) : void 0);
			const chatSendPhase = chatSendDiagnostics?.scope("authority");
			const subscribeDiagnostics = _usingCtx$1.u(req.method === "sessions.messages.subscribe" ? startSlowRequestDiagnostics(sessionLog, "slow session messages subscribe", req.method, "setup") : void 0);
			const runtimeParticipant = resolveRuntimeSessionParticipantRequest(opts);
			if (runtimeParticipant === null) return;
			const profileBinding = opts.expectedProfileBinding ?? (req.expectedProfileId === void 0 ? void 0 : await createExpectedProfileBinding(req.expectedProfileId, client, readGatewayRequestMutationAuthority(opts).assertPreparationCurrent));
			const profileRespond = profileBinding && !opts.expectedProfileBinding ? profileBinding.guardResponse(opts.respond) : opts.respond;
			const respondUnobserved = runtimeParticipant ? (ok, ...response) => {
				if (ok) runtimeParticipant.assertCurrent();
				profileRespond(ok, ...response);
			} : profileRespond;
			respondCancelled = respondUnobserved;
			const respond = observation ? (...response) => {
				observationSignal?.throwIfAborted();
				respondUnobserved(...response);
				observationResponded = true;
			} : respondUnobserved;
			const sessionMutationCommitGuard = profileBinding || runtimeParticipant ? composeSessionSourceAssertion([
				profileBinding?.assertCurrent,
				runtimeParticipant?.assertCurrent,
				captureExternalSessionCommitGuard(opts.sessionMutationCommitGuard)
			]) : opts.sessionMutationCommitGuard;
			const entry = opts.requestEntry ?? context.requestEntryLifetime?.enter(opts);
			const releaseForegroundWork = retainSessionListForegroundWork();
			let sessionAccessAuthority;
			let releaseSessionMutation;
			try {
				entry?.assertOpen();
				const requestMutationAuthority = readGatewayRequestMutationAuthority(opts);
				let capturedOperatorGuard = isGatewayClientProfilePending(client) ? void 0 : captureGatewayRequestOperatorGuard(opts);
				const assertOperatorCurrent = () => (capturedOperatorGuard ??= captureGatewayRequestOperatorGuard(opts))();
				const requestFacts = {
					method: req.method,
					requestParams: req.params,
					client,
					context,
					signal
				};
				const authorization = await authorizeGatewayRequestPreDispatch({
					...requestFacts,
					methodRegistry,
					expectedProfileBinding: profileBinding,
					hasCurrentClientAuthority,
					markSessionSubscribePhase: subscribeDiagnostics?.mark,
					assertInvocationCurrent: () => {
						runtimeParticipant?.assertCurrent();
						profileBinding?.assertCurrent();
						assertOperatorCurrent();
						requestMutationAuthority.assertCurrent();
					},
					assertPreparationCurrent: () => {
						runtimeParticipant?.assertCurrent();
						profileBinding?.assertCurrent();
						assertOperatorCurrent();
						requestMutationAuthority.assertPreparationCurrent();
					}
				});
				sessionAccessAuthority = authorization.sessionAccessAuthority;
				releaseSessionMutation = authorization.sessionMutationAuthorization?.release;
				entry?.assertOpen();
				if (authorization.error) {
					respond(false, void 0, authorization.error);
					return;
				}
				const handler = methodRegistry.getHandler(req.method);
				if (!handler) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown method: ${req.method}`));
					return;
				}
				async function withSessionTurnAuthority(target, consume) {
					let consumed;
					const turnAuthorization = await authorizeGatewayRequestPreDispatch({
						method: "chat.send",
						requestParams: {
							sessionKey: target.sessionKey,
							agentId: target.agentId
						},
						client,
						context,
						methodRegistry,
						expectedProfileBinding: profileBinding,
						hasCurrentClientAuthority,
						assertInvocationCurrent: () => {
							runtimeParticipant?.assertCurrent();
							assertOperatorCurrent();
							requestMutationAuthority.assertCurrent();
						},
						assertPreparationCurrent: () => {
							runtimeParticipant?.assertCurrent();
							assertOperatorCurrent();
							requestMutationAuthority.assertPreparationCurrent();
						},
						consumeSessionTurn: {
							target: { ...target },
							consume: (sessionEntry) => {
								const value = consume(sessionEntry);
								consumed = { value };
								return value;
							}
						}
					});
					if (turnAuthorization.error) throw new SessionMutationAuthorizationChangedError(turnAuthorization.error);
					if (!consumed) throw new Error("Session turn authority was not consumed");
					return consumed.value;
				}
				const sessionMutationAuthorization = withSessionMutationCommitGuard(authorization.sessionMutationAuthorization, composeSessionSourceAssertion([
					runtimeParticipant?.assertCurrent,
					assertOperatorCurrent,
					requestMutationAuthority.assertCurrent
				]), profileBinding?.assertCurrent, requestMutationAuthority.assertAdmittedInputCurrent ? () => {
					assertOperatorCurrent();
					requestMutationAuthority.assertAdmittedInputCurrent?.();
				} : void 0);
				const respondAuthorized = authorization.sessionScope === "operator.sessions.read" ? (...response) => {
					try {
						sessionMutationAuthorization?.assertCurrent();
					} catch (error) {
						if (!(error instanceof SessionMutationAuthorizationChangedError)) throw error;
						respond(false, void 0, error.error);
						return;
					}
					respond(...response);
				} : respond;
				const invokeHandler = async () => {
					retainRoot?.();
					subscribeDiagnostics?.mark("handlerPreparation");
					chatSendPhase?.mark("preparation");
					const preparedHandler = await prepareGatewayRequestHandler(handler, entry, opts);
					const uploadError = gatewayRouterUploadPolicyError(requestFacts, methodRegistry);
					if (uploadError) {
						respond(false, void 0, uploadError);
						return;
					}
					const handlerOptions = bindGatewayRequestHandlerMutationAuthority(opts, {
						req,
						params: req.params ?? {},
						client,
						isWebchatConnect,
						respond: respondAuthorized,
						acceptsSerializedJson: opts.acceptsSerializedJson,
						context,
						signal,
						...hasCurrentClientAuthority ? { hasCurrentClientAuthority } : {},
						sessionMutationCommitGuard,
						sessionMutationAuthorization,
						withSessionTurnAuthority,
						markSessionSubscribePhase: subscribeDiagnostics?.mark,
						...authorization.sessionAccessAuthority ? { sessionAccessAuthority: authorization.sessionAccessAuthority } : {}
					}, profileBinding, authorization.sessionScope);
					bindChatSendDiagnostics(handlerOptions, chatSendDiagnostics);
					sessionMutationCommitGuard?.();
					assertOperatorCurrent();
					authorization.sessionAccessAuthority?.assertCurrent();
					entry?.assertOpen();
					observationSignal?.throwIfAborted();
					if (signal?.aborted) return;
					entry?.release();
					profileBinding?.markInvoked();
					const sharing = opts.acceptsSerializedJson ? methodRegistry.getReadSharing?.(req.method) : void 0;
					chatSendPhase?.finish();
					return GatewayRpcDiagnostics.runHandler(() => sharing ? dispatchSharedRead(preparedHandler, handlerOptions, sharing, () => {
						runtimeParticipant?.assertCurrent();
						profileBinding?.assertCurrent();
						assertOperatorCurrent();
						requestMutationAuthority.assertCurrent();
						authorization.sessionAccessAuthority?.assertCurrent();
						sessionMutationAuthorization?.assertCurrent();
						signal?.throwIfAborted();
					}) : preparedHandler(handlerOptions), diagnostics);
				};
				if (req.method === "question.get" || req.method === "question.resolve") {
					requestMutationAuthority.assertCurrent();
					profileBinding?.assertCurrent();
				}
				await runWithGatewayRequestEnvelope(req.method, client, invokeHandler, {
					context,
					isWebchatConnect,
					signal,
					hasCurrentClientAuthority,
					methodRegistry,
					requestParams: req.params,
					admission: opts.admission,
					reject: (error) => respond(false, void 0, error)
				});
			} catch (error) {
				if (error instanceof AgentDatabaseAdmissionError) {
					respond(false, void 0, errorShapeFromError(ErrorCodes.UNAVAILABLE, error));
					return;
				}
				if (!(error instanceof SessionMutationAuthorizationChangedError)) throw error;
				respond(false, void 0, error.error);
			} finally {
				releaseSessionMutation?.();
				sessionAccessAuthority?.release();
				releaseForegroundWork();
				if (!opts.requestEntry) entry?.release();
			}
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	};
	if (!observation) return await dispatch();
	await runWithGatewayObservationScope(req.method, dispatch, [signal, client?.connectionSignal], (error) => {
		if (!observationResponded && !client?.connectionSignal?.aborted) respondCancelled(false, void 0, error);
	});
}
//#endregion
export { runWithGatewayObservationScope as i, handleGatewayRequest as n, runWithGatewayRequestEnvelope as r, createRequestGatewayMethodRegistry as t };
