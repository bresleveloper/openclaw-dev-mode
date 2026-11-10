import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { n as APPROVALS_SCOPE, t as ADMIN_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { m as withoutGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-BBs3o51w.mjs";
import { t as DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS } from "./timeouts-ClVlVfGz.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-CvOi7xsU.mjs";
import { i as registerGatewayRecoveryRuntime } from "./server-recovery-runtime-context-7AOYu6JQ.mjs";
import { t as createApprovalNativeRouteCoordinator } from "./approval-native-route-coordinator-Bf_JrqoL.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { u as retainInternalApprovalCommitGuard } from "./session-mutation-guards-ClTdEKsf.mjs";
import { t as GATEWAY_NATIVE_APPROVAL_METHODS } from "./approval-gateway-runtime-methods-sULF7KOY.mjs";
import { t as dispatchGatewayRequestInProcess } from "./server-in-process-dispatch-DK2h5_yW.mjs";
import { r as registerSubagentCompletionToolHandoff, t as cancelSubagentCompletionToolHandoff } from "./subagent-completion-tool-handoff-D0AAXR3P.mjs";
import { n as resolveTypingIntervalMs } from "./typing-BMNhuJbi.mjs";
import { t as createTypingCallbacks } from "./typing-pdDHfWo2.mjs";
import "./agent-job-CU2r4FPt.mjs";
import { t as createInternalAgentTurnFacade } from "./internal-facade-BDz9h0my.mjs";
//#region src/gateway/recovery-typing.ts
/** Cosmetic activity only: the original command still owns all final delivery and retries. */
function createRecoveryTypingManager(options) {
	const active = /* @__PURE__ */ new Map();
	let closed = false;
	return {
		start(params) {
			if (closed) return () => {};
			const existing = active.get(params.runId);
			if (existing) return existing;
			let stopped = false;
			const controller = new AbortController();
			let callbacks;
			const stop = () => {
				if (stopped) return;
				stopped = true;
				controller.abort();
				active.delete(params.runId);
				callbacks?.onCleanup?.();
			};
			const current = (cfg = options.getConfig()) => !stopped && !closed && options.isAvailable() && params.isCurrent(cfg);
			active.set(params.runId, stop);
			(async () => {
				if (!current()) {
					stop();
					return;
				}
				const [adapter, { resolveAgentConfig }] = await Promise.all([options.resolveAdapter(params.channel), import("./agent-scope-config-DdPit6I3.mjs")]);
				if (!current() || !adapter?.sendTypingGuarded) {
					stop();
					return;
				}
				const sendTypingGuarded = adapter.sendTypingGuarded;
				const typingEnabled = (cfg) => (params.agentId ? resolveAgentConfig(cfg, params.agentId)?.typingMode ?? cfg.agents?.defaults?.typingMode : cfg.agents?.defaults?.typingMode) !== "never";
				const cfg = options.getConfig();
				if (!typingEnabled(cfg)) {
					stop();
					return;
				}
				const target = {
					cfg,
					to: params.to,
					accountId: params.accountId,
					threadId: params.threadId
				};
				const assertPlatformSendAuthorized = () => {
					controller.signal.throwIfAborted();
					const currentConfig = options.getConfig();
					if (!current(currentConfig) || !typingEnabled(currentConfig)) {
						stop();
						controller.signal.throwIfAborted();
					}
				};
				callbacks = createTypingCallbacks({
					keepaliveIntervalMs: resolveTypingIntervalMs(cfg.agents?.defaults?.typingIntervalSeconds),
					start: async () => {
						const currentConfig = options.getConfig();
						if (!current(currentConfig) || !typingEnabled(currentConfig)) {
							stop();
							return;
						}
						await sendTypingGuarded({
							...target,
							cfg: currentConfig,
							signal: controller.signal,
							assertPlatformSendAuthorized
						});
					},
					stop: async () => {
						stop();
						await adapter.clearTyping?.(target);
					},
					maxDurationMs: resolveAgentTimeoutMs({ cfg }),
					onStartError: (error) => {
						stop();
						options.onError?.(error);
					},
					onStopError: options.onError
				});
				await callbacks.onReplyStart();
			})().catch((error) => {
				stop();
				options.onError?.(error);
			});
			return stop;
		},
		close() {
			closed = true;
			for (const stop of active.values()) stop();
		}
	};
}
//#endregion
//#region src/gateway/server-instance-runtime.ts
const loadRecoveryTypingAdapter = createLazyRuntimeModule(() => import("./plugins-01XRuMGQ.mjs"));
const loadOutboundMessageRuntime = createLazyRuntimeModule(() => import("./message-DMDgbWXn.mjs"));
const loadOperatorRecovery = createLazyRuntimeModule(() => import("./operator-run-recovery-CxH3Yhy3.mjs"));
const RECOVERY_NOTICE_COMPLETION_RETENTION = {
	idPrefix: "main-session-restart-recovery:",
	maxAgeMs: 864e5,
	maxEntries: 2e3
};
/** Creates closed internal principals bound to one concrete Gateway lifecycle. */
function createGatewayInstanceRuntime(options) {
	const approvalSubscribers = /* @__PURE__ */ new Set();
	const routeCoordinator = createApprovalNativeRouteCoordinator();
	let closed = false;
	const recoveryTyping = createRecoveryTypingManager({
		isAvailable: () => !closed && options.isDispatchAvailable(),
		getConfig: () => options.getContext().getRuntimeConfig(),
		resolveAdapter: async (channel) => (await loadRecoveryTypingAdapter()).getLoadedChannelPlugin(channel)?.heartbeat,
		onError: () => options.logError?.("recovery typing unavailable; final delivery continues")
	});
	const assertDispatchAvailable = (method) => {
		if (closed || !options.isDispatchAvailable()) throw new Error(`Gateway instance dispatch unavailable for ${method}`);
	};
	const createAgentTurnFacade = (principal) => {
		const assertContextCurrent = () => {
			assertDispatchAvailable("agent turn");
			principal.assertContextCurrent?.();
		};
		return createInternalAgentTurnFacade({
			...principal,
			assertContextCurrent,
			getContext: options.getContext,
			getMethodRegistry: options.getMethodRegistry
		});
	};
	const dispatch = async (params) => {
		assertDispatchAvailable(params.method);
		if (!params.allowedMethods.has(params.method)) throw new Error(`Gateway internal principal cannot dispatch ${params.method}`);
		const context = options.getContext();
		const assertCurrent = () => {
			assertDispatchAvailable(params.method);
			if (options.getContext() !== context) throw new Error(`Gateway instance dispatch unavailable for ${params.method}`);
			params.assertCurrent?.();
		};
		assertCurrent();
		const result = await withoutGatewayToolCallerIdentity(() => dispatchGatewayRequestInProcess(params.method, params.payload, {
			client: params.client,
			context,
			methodRegistry: options.getMethodRegistry(),
			requestIdPrefix: "gateway-internal",
			timeoutMs: params.timeoutMs,
			signal: params.signal,
			sessionMutationCommitGuard: retainInternalApprovalCommitGuard(assertCurrent)
		}));
		assertCurrent();
		return result;
	};
	const recoveryAgentTurns = createAgentTurnFacade({ client: createSyntheticPluginRuntimeClient({
		operatorRoleActor: { kind: "system" },
		scopes: [WRITE_SCOPE]
	}) });
	const approvalClient = createSyntheticPluginRuntimeClient({
		operatorRoleActor: { kind: "system" },
		scopes: [APPROVALS_SCOPE]
	});
	const approvalMethods = new Set(GATEWAY_NATIVE_APPROVAL_METHODS);
	const approvalRouteClient = createSyntheticPluginRuntimeClient({
		operatorRoleActor: { kind: "system" },
		scopes: [WRITE_SCOPE]
	});
	const approvalRouteMethods = /* @__PURE__ */ new Set(["send"]);
	const recoverySessionMethods = /* @__PURE__ */ new Set([
		"chat.history",
		"chat.abort",
		"sessions.delete"
	]);
	const recovery = {
		prepareRestartRecovery: (signal) => {
			signal?.throwIfAborted();
			assertDispatchAvailable("restart recovery");
			return options.prepareRestartRecovery?.(signal)?.then((pausedUntilMs) => {
				signal?.throwIfAborted();
				assertDispatchAvailable("restart recovery");
				return pausedUntilMs;
			});
		},
		dispatchSessionMethod: (method, payload, requestOptions = {}) => dispatch({
			allowedMethods: recoverySessionMethods,
			client: createSyntheticPluginRuntimeClient({
				operatorRoleActor: { kind: "system" },
				scopes: method === "chat.abort" ? [ADMIN_SCOPE] : resolveLeastPrivilegeOperatorScopesForMethod(method, payload)
			}),
			method,
			payload,
			...requestOptions
		}),
		startRecoveryTyping: (params) => recoveryTyping.start(params),
		dispatchAgent: async (payload, timeoutMs, dispatchOptions = {}) => {
			assertDispatchAvailable("agent");
			const recoveryTarget = dispatchOptions.restartRecoveryOperatorTarget ? { ...dispatchOptions.restartRecoveryOperatorTarget } : void 0;
			const assertRecoveryTarget = () => {
				if (recoveryTarget && (payload.agentId !== recoveryTarget.agentId || payload.sessionKey !== recoveryTarget.sessionKey || payload.expectedExistingSessionId !== recoveryTarget.sessionId || payload.idempotencyKey !== recoveryTarget.recoveryRunId)) throw new Error("Restart recovery dispatch does not match its operator claim.");
			};
			assertRecoveryTarget();
			const context = options.getContext();
			let startOwner;
			let ownerLost = false;
			const assertRecoveryCurrent = () => {
				assertDispatchAvailable("agent");
				assertRecoveryTarget();
				dispatchOptions.assertAdmissionCurrent?.();
				dispatchOptions.signal?.throwIfAborted();
				ownerLost ||= options.getContext() !== context || startOwner !== void 0 && startOwner.observe() === void 0;
				if (ownerLost) throw new Error("Restart recovery operator run is no longer active.");
			};
			const restoredOperator = recoveryTarget ? await (await loadOperatorRecovery()).restoreGatewayOperatorRecovery({
				target: recoveryTarget,
				context,
				assertCurrent: assertRecoveryCurrent
			}) : void 0;
			let delegatedToolPolicyHandoffId;
			try {
				assertRecoveryCurrent();
				delegatedToolPolicyHandoffId = dispatchOptions.delegatedToolPolicyHandoff ? registerSubagentCompletionToolHandoff(dispatchOptions.delegatedToolPolicyHandoff) : void 0;
				return await (Boolean(dispatchOptions.allowModelOverride === true || dispatchOptions.allowSyntheticModelOverride === true || dispatchOptions.allowSyntheticCronRunContinuation === true || dispatchOptions.internalDeliveryMediaUrls || dispatchOptions.runtimeContextFragments || dispatchOptions.internalDeliverySuppressText === true || dispatchOptions.internalDeliverySuppressErrors === true || delegatedToolPolicyHandoffId || restoredOperator || dispatchOptions.scopes || dispatchOptions.syntheticScopes) ? createAgentTurnFacade({
					client: createSyntheticPluginRuntimeClient({
						operatorRoleActor: restoredOperator ? {
							kind: "operator",
							profileId: restoredOperator.authority.profileId
						} : { kind: "system" },
						operatorRunAuthority: restoredOperator?.authority,
						allowModelOverride: dispatchOptions.allowModelOverride === true || dispatchOptions.allowSyntheticModelOverride === true,
						cronRunContinuation: dispatchOptions.allowSyntheticCronRunContinuation === true,
						internalDeliveryMediaUrls: dispatchOptions.internalDeliveryMediaUrls,
						runtimeContextFragments: dispatchOptions.runtimeContextFragments,
						internalDeliverySuppressText: dispatchOptions.internalDeliverySuppressText,
						internalDeliverySuppressErrors: dispatchOptions.internalDeliverySuppressErrors,
						delegatedToolPolicyHandoffId,
						scopes: restoredOperator ? [...restoredOperator.authority.scopes] : dispatchOptions.scopes ?? dispatchOptions.syntheticScopes
					}),
					assertContextCurrent: () => {
						if (options.getContext() !== context) throw new Error("Gateway recovery context changed.");
					}
				}) : recoveryAgentTurns).dispatch(payload, {
					assertAdmissionCurrent: assertRecoveryCurrent,
					prepareDispatchCurrent: dispatchOptions.prepareDispatchCurrent,
					expectFinal: dispatchOptions.expectFinal,
					onAccepted: dispatchOptions.onAccepted,
					onStartOwner: (owner) => {
						startOwner ??= owner;
						dispatchOptions.onStartOwner?.(owner);
					},
					onExecutionStarted: dispatchOptions.onExecutionStarted,
					onSignalAbort: dispatchOptions.onSignalAbort,
					signal: dispatchOptions.signal,
					timeoutMs
				});
			} finally {
				cancelSubagentCompletionToolHandoff(delegatedToolPolicyHandoffId);
				restoredOperator?.release();
			}
		},
		waitForAgent: async (payload, timeoutMs, signal) => {
			assertDispatchAvailable("agent.wait");
			return await recoveryAgentTurns.wait(payload, timeoutMs, signal);
		},
		sendRecoveryNotice: async (payload) => {
			if (closed || !options.isDispatchAvailable()) throw new Error("Gateway instance dispatch unavailable for recovery notice");
			const { sendMessage } = await loadOutboundMessageRuntime();
			const assertNoticeCurrent = () => {
				if (closed || !options.isDispatchAvailable() || payload.isCurrent?.(options.getContext().getRuntimeConfig()) === false) throw new Error("Recovery notice owner retired before delivery");
			};
			assertNoticeCurrent();
			const context = options.getContext();
			const result = await sendMessage({
				cfg: context.getRuntimeConfig(),
				deps: createOutboundSendDeps(context.deps),
				channel: payload.channel,
				to: payload.to,
				accountId: payload.accountId,
				threadId: payload.threadId,
				content: payload.text,
				gatewayOwnedDelivery: true,
				bestEffort: true,
				idempotencyKey: payload.idempotencyKey,
				...payload.liveOnly ? { skipQueue: true } : {
					deliveryIntentId: payload.idempotencyKey,
					reusePendingDeliveryIntent: true,
					completionRetention: RECOVERY_NOTICE_COMPLETION_RETENTION
				},
				onPlatformSendDispatch: async () => assertNoticeCurrent(),
				assertDirectAdapterHandoff: assertNoticeCurrent,
				abortSignal: AbortSignal.timeout(1e4)
			});
			if (result.deliveryStatus === "failed" || result.deliveryStatus === "partial_failed") throw new Error(result.error ?? "recovery notice delivery failed");
			return { suppressed: result.deliveryStatus === "suppressed" };
		}
	};
	const releaseRecoveryRuntime = registerGatewayRecoveryRuntime(recovery);
	const pendingApprovalPublications = /* @__PURE__ */ new Map();
	const publishRequestedAsync = async (kind, request) => {
		if (closed) return 0;
		const publication = Symbol("approval publication");
		const publications = pendingApprovalPublications.get(request.id) ?? /* @__PURE__ */ new Set();
		publications.add(publication);
		pendingApprovalPublications.set(request.id, publications);
		let delivered = 0;
		try {
			for (const subscriber of Array.from(approvalSubscribers)) {
				if (!subscriber.eventKinds.has(kind)) continue;
				try {
					if (!await subscriber.shouldHandle(request)) continue;
					if (closed || pendingApprovalPublications.get(request.id) !== publications) break;
					if (!approvalSubscribers.has(subscriber)) continue;
					subscriber.onRequested(request);
					delivered += 1;
				} catch (error) {
					options.logError?.(`internal approval subscriber failed: ${String(error)}`);
				}
			}
		} finally {
			publications.delete(publication);
			if (!publications.size && pendingApprovalPublications.get(request.id) === publications) pendingApprovalPublications.delete(request.id);
		}
		return delivered;
	};
	const publish = (kind, callback, shouldDeliver) => {
		if (closed) return 0;
		let delivered = 0;
		for (const subscriber of approvalSubscribers) {
			if (!subscriber.eventKinds.has(kind)) continue;
			try {
				if (shouldDeliver && !shouldDeliver(subscriber)) continue;
				callback(subscriber);
				delivered += 1;
			} catch (error) {
				options.logError?.(`internal approval subscriber failed: ${String(error)}`);
			}
		}
		return delivered;
	};
	return {
		createAgentTurnFacade,
		approvalEvents: {
			publishRequested: (kind, request) => {
				warnPluginSdkDeprecation({
					family: "approval-event-publication",
					method: "approvalEvents.publishRequested",
					replacement: "await approvalEvents.publishRequestedAsync",
					compatibility: "Synchronous subscribers retain immediate delivery and numeric counts."
				});
				if (closed) return 0;
				const approvalRequest = request;
				const eligible = /* @__PURE__ */ new Set();
				for (const subscriber of Array.from(approvalSubscribers)) {
					if (!subscriber.eventKinds.has(kind)) continue;
					let accepted;
					try {
						accepted = subscriber.shouldHandle(approvalRequest);
					} catch (error) {
						options.logError?.(`internal approval subscriber failed: ${String(error)}`);
						continue;
					}
					if (typeof accepted !== "boolean") {
						accepted.catch((error) => {
							options.logError?.(`internal approval subscriber failed: ${String(error)}`);
						});
						throw new Error("Approval eligibility requires async preparation; use approvalEvents.publishRequestedAsync.");
					}
					if (accepted) eligible.add(subscriber);
				}
				return publish(kind, (subscriber) => subscriber.onRequested(approvalRequest), (subscriber) => eligible.has(subscriber));
			},
			publishRequestedAsync: (kind, request) => publishRequestedAsync(kind, request),
			publishResolved: (kind, resolved) => {
				pendingApprovalPublications.delete(resolved.id);
				publish(kind, (subscriber) => subscriber.onResolved(resolved));
			}
		},
		nativeApprovals: {
			request: async (method, payload, requestOptions) => await dispatch({
				allowedMethods: approvalMethods,
				client: requestOptions?.clientDisplayName ? {
					...approvalClient,
					connect: {
						...approvalClient.connect,
						client: {
							...approvalClient.connect.client,
							displayName: requestOptions.clientDisplayName
						}
					}
				} : approvalClient,
				method,
				payload,
				timeoutMs: DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS
			}),
			requestRoute: async (method, payload) => await dispatch({
				allowedMethods: approvalRouteMethods,
				client: approvalRouteClient,
				method,
				payload,
				timeoutMs: DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS
			}),
			routeCoordinator,
			subscribe: (subscriber) => {
				if (closed) throw new Error("Gateway instance approval runtime is closed");
				approvalSubscribers.add(subscriber);
				let subscribed = true;
				return () => {
					if (!subscribed) return;
					subscribed = false;
					approvalSubscribers.delete(subscriber);
				};
			}
		},
		recovery,
		isAvailable: () => !closed && options.isDispatchAvailable(),
		close: () => {
			closed = true;
			recoveryTyping.close();
			releaseRecoveryRuntime();
			approvalSubscribers.clear();
			pendingApprovalPublications.clear();
			routeCoordinator.close();
		}
	};
}
//#endregion
export { createGatewayInstanceRuntime };
