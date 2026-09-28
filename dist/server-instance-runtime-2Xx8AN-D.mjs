import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { n as APPROVALS_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS } from "./timeouts-D2XMKe-X.mjs";
import { c as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-C7g7eSZh.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Bjg7ga80.mjs";
import { i as registerGatewayRecoveryRuntime } from "./server-recovery-runtime-context-DmpOWr_7.mjs";
import { t as createApprovalNativeRouteCoordinator } from "./approval-native-route-coordinator-DLN9eiTv.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-evzAFJT4.mjs";
import { t as dispatchGatewayRequestInProcess } from "./server-in-process-dispatch-rxc6WT92.mjs";
import { r as registerSubagentCompletionToolHandoff, t as cancelSubagentCompletionToolHandoff } from "./subagent-completion-tool-handoff-f0MVDEM7.mjs";
import { t as GATEWAY_NATIVE_APPROVAL_METHODS } from "./approval-gateway-runtime-methods-CZtHej9H.mjs";
import { t as createTypingCallbacks } from "./typing-C8rPbA2A.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-DOTLPxsJ.mjs";
import "./agent-job-VGCbW4db.mjs";
import { t as createInternalAgentTurnFacade } from "./internal-facade-Chi7rjDZ.mjs";
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
				const [adapter, { resolveAgentConfig }] = await Promise.all([options.resolveAdapter(params.channel), import("./agent-scope-config-YrCdQ9uN.mjs")]);
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
const loadRecoveryTypingAdapter = createLazyRuntimeModule(() => import("./plugins-aqMUFJ4z.mjs"));
const loadOutboundMessageRuntime = createLazyRuntimeModule(() => import("./message-Dhn86O3d.mjs"));
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
		const result = await dispatchGatewayRequestInProcess(params.method, params.payload, {
			client: params.client,
			context,
			methodRegistry: options.getMethodRegistry(),
			requestIdPrefix: "gateway-internal",
			timeoutMs: params.timeoutMs,
			signal: params.signal,
			sessionMutationCommitGuard: assertCurrent
		});
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
		dispatchSessionMethod: (method, payload, requestOptions = {}) => dispatch({
			allowedMethods: recoverySessionMethods,
			client: createSyntheticPluginRuntimeClient({
				operatorRoleActor: { kind: "system" },
				scopes: resolveLeastPrivilegeOperatorScopesForMethod(method, payload)
			}),
			method,
			payload,
			...requestOptions
		}),
		startRecoveryTyping: (params) => recoveryTyping.start(params),
		dispatchAgent: async (payload, timeoutMs, dispatchOptions = {}) => {
			assertDispatchAvailable("agent");
			const delegatedToolPolicyHandoffId = dispatchOptions.delegatedToolPolicyHandoff ? registerSubagentCompletionToolHandoff(dispatchOptions.delegatedToolPolicyHandoff) : void 0;
			const agentTurns = Boolean(dispatchOptions.allowModelOverride === true || dispatchOptions.allowSyntheticModelOverride === true || dispatchOptions.allowSyntheticCronRunContinuation === true || dispatchOptions.internalDeliveryMediaUrls || dispatchOptions.runtimeContextFragments || dispatchOptions.internalDeliverySuppressText === true || delegatedToolPolicyHandoffId || dispatchOptions.scopes || dispatchOptions.syntheticScopes) ? createAgentTurnFacade({ client: createSyntheticPluginRuntimeClient({
				operatorRoleActor: { kind: "system" },
				allowModelOverride: dispatchOptions.allowModelOverride === true || dispatchOptions.allowSyntheticModelOverride === true,
				cronRunContinuation: dispatchOptions.allowSyntheticCronRunContinuation === true,
				internalDeliveryMediaUrls: dispatchOptions.internalDeliveryMediaUrls,
				runtimeContextFragments: dispatchOptions.runtimeContextFragments,
				internalDeliverySuppressText: dispatchOptions.internalDeliverySuppressText,
				delegatedToolPolicyHandoffId,
				scopes: dispatchOptions.scopes ?? dispatchOptions.syntheticScopes
			}) }) : recoveryAgentTurns;
			try {
				return await agentTurns.dispatch(payload, {
					expectFinal: dispatchOptions.expectFinal,
					onAccepted: dispatchOptions.onAccepted,
					onStartOwner: dispatchOptions.onStartOwner,
					onExecutionStarted: dispatchOptions.onExecutionStarted,
					onSignalAbort: dispatchOptions.onSignalAbort,
					signal: dispatchOptions.signal,
					timeoutMs
				});
			} finally {
				cancelSubagentCompletionToolHandoff(delegatedToolPolicyHandoffId);
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
			publishRequested: (kind, request) => publish(kind, (subscriber) => subscriber.onRequested(request), (subscriber) => subscriber.shouldHandle(request)),
			publishResolved: (kind, resolved) => {
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
			routeCoordinator.close();
		}
	};
}
//#endregion
export { createGatewayInstanceRuntime };
