import { n as validateAgentParams, r as validateAgentWaitParams } from "./src-BRUl7oDv.mjs";
import { l as getAgentEventLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import { t as abortChatRunById } from "./chat-abort-D7PkkSq8.mjs";
import { a as waitForGatewayDispatch, i as unwrapGatewayMethodDispatchResponse, r as throwIfGatewayDispatchAborted } from "./server-in-process-dispatch-rxc6WT92.mjs";
import { r as validateGatewayMethodParams } from "./validation-CFv_zneu.mjs";
import { i as runWithGatewayRequestEnvelope, n as createRequestGatewayMethodRegistry, t as authorizeGatewayRequestPreDispatch } from "./server-methods-DJk5J1V5.mjs";
//#region src/gateway/agent-turn/internal-facade.ts
function throwEnvelopeRejection(method, error) {
	return unwrapGatewayMethodDispatchResponse(method, {
		ok: false,
		error
	});
}
/** Typed, frame-free access to agent turns owned by the running Gateway instance. */
function createInternalAgentTurnFacade(options) {
	const isWebchatConnect = options.isWebchatConnect ?? (() => false);
	const getMethodRegistry = options.getMethodRegistry ?? createRequestGatewayMethodRegistry;
	const dispatchRaw = async (request, dispatchOptions = {}) => {
		const method = "agent";
		throwIfGatewayDispatchAborted(method, dispatchOptions.signal);
		dispatchOptions.assertAdmissionCurrent?.();
		options.assertContextCurrent?.();
		const context = options.getContext();
		const lifecycleGeneration = getAgentEventLifecycleGeneration();
		const { agentId: expectedAgentId, expectedExistingSessionId: expectedSessionId, idempotencyKey: expectedRunId, sessionKey: expectedSessionKey } = request;
		const entry = context.requestEntryLifetime?.enter({
			req: {
				method,
				params: request
			},
			client: options.client,
			context
		});
		let preparationOwnedByExecution = false;
		try {
			const methodRegistry = getMethodRegistry();
			const authorization = await authorizeGatewayRequestPreDispatch({
				method,
				requestParams: request,
				client: options.client,
				context,
				methodRegistry
			});
			throwIfGatewayDispatchAborted(method, dispatchOptions.signal);
			entry?.assertOpen();
			if (authorization.error) return {
				ok: false,
				error: authorization.error
			};
			const validationError = validateGatewayMethodParams(request, validateAgentParams, method);
			if (validationError) return {
				ok: false,
				error: validationError
			};
			options.assertContextCurrent?.();
			dispatchOptions.assertAdmissionCurrent?.();
			let acceptance;
			let final;
			let resolveAcceptance;
			let rejectAcceptance;
			let resolveFinal;
			let rejectFinal;
			let postAcceptanceError;
			let acceptedAbortOwner;
			let startOwnerPublished = false;
			const publishStartOwner = (runId, owner) => {
				if (startOwnerPublished || !dispatchOptions.onStartOwner || runId !== expectedRunId || expectedAgentId !== void 0 && owner.agentId !== expectedAgentId || owner.sessionKey !== expectedSessionKey || owner.sessionId !== expectedSessionId || owner.lifecycleGeneration !== lifecycleGeneration || context.chatAbortControllers.get(runId) !== owner) return;
				startOwnerPublished = true;
				const observe = () => {
					try {
						options.assertContextCurrent?.();
					} catch {
						return;
					}
					return context.chatAbortControllers.get(runId) === owner && getAgentEventLifecycleGeneration() === lifecycleGeneration && owner.lifecycleGeneration === lifecycleGeneration && (expectedAgentId === void 0 || owner.agentId === expectedAgentId) && owner.sessionId === expectedSessionId && owner.sessionKey === expectedSessionKey && !owner.controller.signal.aborted && owner.registrationCleanupRequested !== true ? {
						executionStarted: owner.executionStarted === true,
						expiresAtMs: owner.expiresAtMs
					} : void 0;
				};
				dispatchOptions.onStartOwner({
					observe,
					abort: () => observe()?.executionStarted === false && abortChatRunById(context, {
						runId,
						sessionKey: owner.sessionKey,
						stopReason: "timeout"
					}).aborted
				});
			};
			let pendingCancelReason;
			const cancelAcceptedRun = (reason) => {
				pendingCancelReason ??= reason;
				const owner = acceptedAbortOwner;
				if (!owner || context.chatAbortControllers.get(owner.runId) !== owner.entry) return;
				abortChatRunById(context, {
					runId: owner.runId,
					sessionKey: owner.entry.sessionKey,
					stopReason: pendingCancelReason
				});
			};
			const acceptancePromise = new Promise((resolve, reject) => {
				resolveAcceptance = resolve;
				rejectAcceptance = reject;
			});
			const createFinalPromise = () => new Promise((resolve, reject) => {
				resolveFinal = resolve;
				rejectFinal = reject;
				if (final) resolve(final);
			});
			const io = {
				emitStartOwner: publishStartOwner,
				emitAcceptance: (frame, meta) => {
					if (!acceptance) {
						acceptance = {
							ok: frame[0],
							payload: frame[1],
							error: frame[2],
							...meta ? { meta } : {}
						};
						resolveAcceptance?.(acceptance);
						const acceptedRunId = typeof meta?.runId === "string" && meta.runId.trim() ? meta.runId.trim() : void 0;
						const acceptedEntry = acceptedRunId ? context.chatAbortControllers.get(acceptedRunId) : void 0;
						if (acceptedRunId && acceptedEntry) {
							acceptedAbortOwner = {
								entry: acceptedEntry,
								runId: acceptedRunId
							};
							if (pendingCancelReason) cancelAcceptedRun(pendingCancelReason);
							if (meta?.cached === true) publishStartOwner(acceptedRunId, acceptedEntry);
						}
						if (meta?.cached === true && acceptedRunId && context.chatAbortControllers.get(acceptedRunId)?.executionStarted === true) dispatchOptions.onExecutionStarted?.();
					}
				},
				emitFinal: (frame, meta) => {
					if (!final) {
						final = {
							ok: frame[0],
							payload: frame[1],
							error: frame[2],
							...meta ? { meta } : {}
						};
						resolveFinal?.(final);
					}
				},
				...dispatchOptions.onExecutionStarted ? { emitExecutionStarted: dispatchOptions.onExecutionStarted } : {}
			};
			context.trackExecution(async () => {
				preparationOwnedByExecution = true;
				try {
					return await runWithGatewayRequestEnvelope(method, options.client, async () => {
						const [{ prepareAgentRequestPreflight }, { createAgentTurnService }, { captureAgentTurnPrincipal, resolveAgentTurnRunObserver }] = await Promise.all([
							import("./agent-request-preflight-Qj4EMaWU.mjs"),
							import("./agent-turn-service-TmHO490B.mjs"),
							import("./principal-BqYOcKil.mjs")
						]);
						throwIfGatewayDispatchAborted(method, dispatchOptions.signal);
						entry?.assertOpen();
						options.assertContextCurrent?.();
						dispatchOptions.assertAdmissionCurrent?.();
						entry?.release();
						const principal = captureAgentTurnPrincipal(options.client);
						const preflight = prepareAgentRequestPreflight({
							request,
							context,
							client: principal,
							io
						});
						if (!preflight) return;
						const onRunObserved = resolveAgentTurnRunObserver({
							principal,
							registerToolEventRecipient: context.registerToolEventRecipient
						});
						await createAgentTurnService({
							context,
							isWebchatConnect
						}, options.assertContextCurrent).startTurn({
							preflight,
							principal,
							io,
							onRunObserved,
							assertAdmissionCurrent: dispatchOptions.assertAdmissionCurrent,
							privateCompletion: dispatchOptions.privateCompletion,
							settleWakeReplay: dispatchOptions.settleWakeReplay
						});
					}, {
						context,
						isWebchatConnect,
						methodRegistry,
						reject: (error) => io.emitAcceptance([
							false,
							void 0,
							error
						])
					});
				} finally {
					entry?.release();
				}
			}).then(() => {
				if (!acceptance) rejectAcceptance?.(/* @__PURE__ */ new Error(`Gateway method "${method}" completed without a response.`));
			}, (error) => {
				const dispatchError = error instanceof Error ? error : new Error(String(error));
				if (acceptance) {
					postAcceptanceError = dispatchError;
					rejectFinal?.(dispatchError);
					return;
				}
				rejectAcceptance?.(dispatchError);
			});
			const response = (async () => {
				const first = acceptance ?? await acceptancePromise;
				if (dispatchOptions.expectFinal !== true || first.payload?.status !== "accepted") return first;
				dispatchOptions.onAccepted?.(first.payload);
				if (postAcceptanceError) throw postAcceptanceError;
				return final ?? await createFinalPromise();
			})();
			return await waitForGatewayDispatch(method, response, dispatchOptions.timeoutMs, dispatchOptions.signal, dispatchOptions.cancelOnDeadline || dispatchOptions.onSignalAbort ? async () => {
				if (dispatchOptions.cancelOnDeadline) cancelAcceptedRun("rpc");
				await dispatchOptions.onSignalAbort?.();
			} : void 0, dispatchOptions.cancelOnDeadline ? () => cancelAcceptedRun("timeout") : void 0);
		} finally {
			if (!preparationOwnedByExecution) entry?.release();
		}
	};
	const dispatch = async (request, dispatchOptions = {}) => {
		return unwrapGatewayMethodDispatchResponse("agent", await dispatchRaw(request, typeof dispatchOptions === "number" ? { timeoutMs: dispatchOptions } : dispatchOptions));
	};
	const wait = async (params, timeoutMs, signal, onSignalAbort) => {
		const method = "agent.wait";
		throwIfGatewayDispatchAborted(method, signal);
		options.assertContextCurrent?.();
		const context = options.getContext();
		const entry = context.requestEntryLifetime?.enter({
			req: {
				method,
				params
			},
			client: options.client,
			context
		});
		let preparationOwnedByExecution = false;
		try {
			const methodRegistry = getMethodRegistry();
			const authorization = await authorizeGatewayRequestPreDispatch({
				method,
				requestParams: params,
				client: options.client,
				context,
				methodRegistry
			});
			throwIfGatewayDispatchAborted(method, signal);
			entry?.assertOpen();
			if (authorization.error) return throwEnvelopeRejection(method, authorization.error);
			const validationError = validateGatewayMethodParams(params, validateAgentWaitParams, method);
			if (validationError) return throwEnvelopeRejection(method, validationError);
			options.assertContextCurrent?.();
			const result = context.trackExecution(async () => {
				preparationOwnedByExecution = true;
				try {
					return await runWithGatewayRequestEnvelope(method, options.client, async () => {
						const { createAgentTurnService } = await import("./agent-turn-service-TmHO490B.mjs");
						throwIfGatewayDispatchAborted(method, signal);
						entry?.assertOpen();
						options.assertContextCurrent?.();
						entry?.release();
						return (await createAgentTurnService({
							context,
							isWebchatConnect
						}).waitForTurn(params)).result;
					}, {
						context,
						isWebchatConnect,
						methodRegistry,
						reject: (error) => throwEnvelopeRejection(method, error)
					});
				} finally {
					entry?.release();
				}
			});
			return await waitForGatewayDispatch(method, result, timeoutMs, signal, onSignalAbort);
		} finally {
			if (!preparationOwnedByExecution) entry?.release();
		}
	};
	return {
		dispatch,
		dispatchRaw,
		wait
	};
}
//#endregion
export { createInternalAgentTurnFacade as t };
