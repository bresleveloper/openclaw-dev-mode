import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { u as readConnectErrorDetailCode } from "./connect-error-details-q_NaMExM.mjs";
import { t as startGatewayClientWhenEventLoopReady } from "./readiness-kkd804Uc.mjs";
import { i as isApprovalMethod } from "./method-scopes-BrMPjfvW.mjs";
import { t as getGatewayNativeApprovalRuntime } from "./approval-gateway-runtime-context-Dv8llXGl.mjs";
import { n as createApprovalNativeRouteReporter } from "./approval-native-route-coordinator-D2ixPswr.mjs";
import { t as buildChannelApprovalNativeTargetKey } from "./approval-native-target-key-CBNNRMFl.mjs";
import { c as normalizeApprovalRequest, t as classifyApprovalRequestChannelRoute } from "./approval-request-account-binding-CtjEtTK0.mjs";
import { t as createOperatorApprovalsGatewayClient } from "./operator-approvals-client-CpZ89ePp.mjs";
import { t as createPendingApprovalRegistry } from "./pending-approval-registry-Ba8xUSFo.mjs";
import { n as isGatewayNativeApprovalMethod } from "./approval-gateway-runtime-methods-CZtHej9H.mjs";
//#region src/infra/approval-native-delivery.ts
/** Resolves the origin and approver-DM targets a channel should use for native approvals. */
async function resolveChannelNativeApprovalDeliveryPlan(params) {
	const adapter = params.adapter;
	if (!adapter) return {
		targets: [],
		originTarget: null,
		notifyOriginWhenDmOnly: false
	};
	const capabilities = adapter.describeDeliveryCapabilities({
		cfg: params.cfg,
		accountId: params.accountId,
		approvalKind: params.approvalKind,
		request: params.request
	});
	if (!capabilities.enabled) return {
		targets: [],
		originTarget: null,
		notifyOriginWhenDmOnly: false
	};
	const originTarget = capabilities.supportsOriginSurface && adapter.resolveOriginTarget ? await adapter.resolveOriginTarget({
		cfg: params.cfg,
		accountId: params.accountId,
		approvalKind: params.approvalKind,
		request: params.request
	}) ?? null : null;
	const approverDmTargets = capabilities.supportsApproverDmSurface && adapter.resolveApproverDmTargets ? await adapter.resolveApproverDmTargets({
		cfg: params.cfg,
		accountId: params.accountId,
		approvalKind: params.approvalKind,
		request: params.request
	}) : [];
	const plannedTargets = [];
	const preferOrigin = capabilities.preferredSurface === "origin" || capabilities.preferredSurface === "both";
	const preferApproverDm = capabilities.preferredSurface === "approver-dm" || capabilities.preferredSurface === "both";
	if (preferOrigin && originTarget) plannedTargets.push({
		surface: "origin",
		target: originTarget,
		reason: "preferred"
	});
	if (preferApproverDm || !originTarget) for (const target of approverDmTargets) plannedTargets.push({
		surface: "approver-dm",
		target,
		reason: preferApproverDm ? "preferred" : "fallback"
	});
	return {
		targets: dedupeByKey(plannedTargets, (entry) => buildChannelApprovalNativeTargetKey(entry.target)),
		originTarget,
		notifyOriginWhenDmOnly: capabilities.preferredSurface === "approver-dm" && capabilities.notifyOriginWhenDmOnly === true && originTarget !== null
	};
}
//#endregion
//#region src/infra/exec-approval-channel-runtime.ts
/** Error raised when the gateway pauses approval reconnects after a terminal startup failure. */
var ExecApprovalChannelRuntimeTerminalStartError = class extends Error {
	constructor(info, cause) {
		super(`native approval gateway client paused reconnect after startup auth failure (${info.detailCode ?? "unknown"}): gateway closed (${info.code}): ${info.reason}`, cause === void 0 ? void 0 : { cause });
		this.name = "ExecApprovalChannelRuntimeTerminalStartError";
		this.detailCode = info.detailCode;
	}
};
/** Narrows terminal approval runtime startup failures for bootstrap retry policy. */
function isExecApprovalChannelRuntimeTerminalStartError(error) {
	return error instanceof ExecApprovalChannelRuntimeTerminalStartError;
}
function resolveApprovalReplayMethods(eventKinds) {
	const methods = [];
	if (eventKinds.has("exec")) methods.push("exec.approval.list");
	if (eventKinds.has("plugin")) methods.push("plugin.approval.list");
	if (eventKinds.has("system-agent")) methods.push("openclaw.approval.list");
	return methods;
}
function readGatewayConnectErrorDetailCode(error) {
	if (!error || typeof error !== "object") return null;
	return readConnectErrorDetailCode(error.details);
}
/** Creates the gateway-backed approval runtime that tracks pending requests and finalization. */
function createExecApprovalChannelRuntime(adapter) {
	const log = createSubsystemLogger(adapter.label);
	const nowMs = adapter.nowMs ?? Date.now;
	const eventKinds = new Set(adapter.eventKinds ?? ["exec"]);
	const configuredGatewayRuntime = getGatewayNativeApprovalRuntime();
	const pending = createPendingApprovalRegistry();
	let gatewayClient = null;
	let gatewayRuntime;
	let unsubscribeGatewayRuntime = null;
	let started = false;
	let shouldRun = false;
	let startPromise = null;
	let replayPromise = null;
	const shouldKeepRunning = () => shouldRun;
	const spawn = (label, promise) => {
		promise.catch((err) => {
			const message = formatErrorMessage(err);
			log.error(`${label}: ${message}`);
		});
	};
	const stopClientIfInactive = (client) => {
		if (shouldKeepRunning()) return false;
		gatewayClient = null;
		client.stop();
		return true;
	};
	const finalizeExpiredEntry = async (entry) => {
		log.debug(`expired ${entry.id}`);
		await adapter.finalizeExpired?.(entry.value);
	};
	const handleExpired = async (approvalId) => {
		const entry = pending.remove(approvalId);
		if (!entry) return;
		await finalizeExpiredEntry(entry);
	};
	const handleRequested = async (requestInput, opts) => {
		if (opts?.ignoreIfInactive && !shouldKeepRunning()) return;
		const request = normalizeApprovalRequest(requestInput);
		if (pending.has(request.id)) {
			log.debug(`ignored duplicate request ${request.id}`);
			return;
		}
		if (opts?.alreadyAccepted !== true && !adapter.shouldHandle(request)) return;
		log.debug(`received request ${request.id}`);
		const entry = pending.begin(request.id, {
			request,
			entries: []
		});
		let entries;
		try {
			entries = await adapter.deliverRequested(request);
		} catch (err) {
			pending.remove(request.id, entry);
			throw err;
		}
		if (!pending.isCurrent(entry)) return;
		if (!entries.length) {
			pending.remove(request.id, entry);
			return;
		}
		await pending.completeDelivery(entry, {
			request,
			entries
		});
		if (!pending.isCurrent(entry)) return;
		const timeoutMs = Math.max(0, request.expiresAtMs - nowMs());
		pending.scheduleExpiry(entry, timeoutMs, (expired) => {
			spawn("error handling approval expiration", finalizeExpiredEntry(expired));
		});
	};
	const handleResolved = async (resolved) => {
		if ("terminalStatus" in resolved && resolved.terminalStatus === "expired") {
			await handleExpired(resolved.id);
			return;
		}
		const settled = pending.settle(resolved.id, async (entry) => {
			log.debug(`resolved ${resolved.id} with ${resolved.decision}`);
			await adapter.finalizeResolved({
				request: entry.value.request,
				resolved,
				entries: entry.value.entries
			});
		});
		if (settled.status === "taken") await settled.terminal(settled.entry);
	};
	const handleGatewayEvent = (evt) => {
		if (evt.event === "exec.approval.requested" && eventKinds.has("exec") || evt.event === "plugin.approval.requested" && eventKinds.has("plugin") || evt.event === "openclaw.approval.requested" && eventKinds.has("system-agent")) {
			spawn("error handling approval request", handleRequested(evt.payload, { ignoreIfInactive: true }));
			return;
		}
		if (evt.event === "exec.approval.resolved" && eventKinds.has("exec") || evt.event === "plugin.approval.resolved" && eventKinds.has("plugin") || evt.event === "openclaw.approval.resolved" && eventKinds.has("system-agent")) spawn("error handling approval resolved", handleResolved(evt.payload));
	};
	const replayPendingApprovals = async (client, externalClient) => {
		try {
			for (const method of resolveApprovalReplayMethods(eventKinds)) {
				if (externalClient && stopClientIfInactive(externalClient)) return;
				const pendingRequests = await client.request(method, {});
				if (externalClient && stopClientIfInactive(externalClient)) return;
				for (const request of pendingRequests) {
					if (externalClient && stopClientIfInactive(externalClient)) return;
					await handleRequested(request, { ignoreIfInactive: true });
				}
			}
		} catch (error) {
			if (!shouldKeepRunning()) return;
			throw error;
		}
	};
	const startPendingApprovalReplay = (client, externalClient) => {
		const promise = replayPendingApprovals(client, externalClient).catch((err) => {
			const message = formatErrorMessage(err);
			log.error(`error replaying pending approvals: ${message}`);
		}).finally(() => {
			if (replayPromise === promise) replayPromise = null;
		});
		replayPromise = promise;
	};
	const waitForPendingApprovalReplay = async () => {
		const replay = replayPromise;
		if (!replay) return;
		await replay.catch(() => {});
	};
	return {
		async start() {
			if (started) return;
			if (startPromise) {
				await startPromise;
				return;
			}
			shouldRun = true;
			startPromise = (async () => {
				if (!adapter.isConfigured()) {
					log.debug("disabled");
					return;
				}
				if (configuredGatewayRuntime) {
					await adapter.beforeGatewayClientStart?.();
					gatewayRuntime = configuredGatewayRuntime;
					unsubscribeGatewayRuntime = gatewayRuntime.subscribe({
						eventKinds,
						shouldHandle: (request) => shouldKeepRunning() && adapter.shouldHandle(request),
						onRequested: (request) => {
							spawn("error handling approval request", handleRequested(request, {
								ignoreIfInactive: true,
								alreadyAccepted: true
							}));
						},
						onResolved: (resolved) => {
							spawn("error handling approval resolved", handleResolved(resolved));
						}
					});
					if (!shouldRun) {
						unsubscribeGatewayRuntime();
						unsubscribeGatewayRuntime = null;
						gatewayRuntime = void 0;
						return;
					}
					started = true;
					startPendingApprovalReplay({ request: gatewayRuntime.request });
					return;
				}
				const ready = createDeferredCore();
				let lastConnectError = null;
				const client = await createOperatorApprovalsGatewayClient({
					config: adapter.cfg,
					gatewayUrl: adapter.gatewayUrl,
					clientDisplayName: adapter.clientDisplayName,
					onEvent: handleGatewayEvent,
					onHelloOk: () => {
						log.debug("connected to gateway");
						ready.resolve();
					},
					onConnectError: (err) => {
						log.error(`connect error: ${err.message}`);
						lastConnectError = err;
						if (readGatewayConnectErrorDetailCode(err)) return;
						ready.reject(err);
					},
					onReconnectPaused: (info) => {
						ready.reject(new ExecApprovalChannelRuntimeTerminalStartError(info, lastConnectError));
					},
					onClose: (code, reason) => {
						log.debug(`gateway closed: ${code} ${reason}`);
						ready.reject(lastConnectError ?? /* @__PURE__ */ new Error(`gateway closed: ${code} ${reason}`));
					}
				});
				if (!shouldRun) {
					client.stop();
					return;
				}
				await adapter.beforeGatewayClientStart?.();
				gatewayClient = client;
				try {
					const readiness = await startGatewayClientWhenEventLoopReady(client, { clientOptions: {} });
					if (!readiness.ready) throw new Error(readiness.aborted ? "gateway approval runtime start aborted before readiness" : "gateway readiness unavailable before exec approval runtime start");
					await ready.promise;
					if (stopClientIfInactive(client)) return;
					started = true;
					startPendingApprovalReplay(client, client);
				} catch (error) {
					gatewayClient = null;
					started = false;
					client.stop();
					throw error;
				}
			})().finally(() => {
				startPromise = null;
			});
			await startPromise;
		},
		async stop() {
			shouldRun = false;
			if (startPromise) await startPromise.catch(() => {});
			const wasActive = started || gatewayClient !== null || replayPromise !== null;
			started = false;
			unsubscribeGatewayRuntime?.();
			unsubscribeGatewayRuntime = null;
			gatewayRuntime = void 0;
			gatewayClient?.stop();
			gatewayClient = null;
			await waitForPendingApprovalReplay();
			if (!wasActive) {
				await adapter.onStopped?.();
				return;
			}
			pending.clear();
			await adapter.onStopped?.();
			log.debug("stopped");
		},
		handleRequested,
		handleResolved,
		handleExpired,
		async request(method, params) {
			if (!isApprovalMethod(method)) throw new Error(`${adapter.label}: operator approvals runtime cannot dispatch ${method}; use a write-capable gateway client`);
			if (gatewayRuntime) {
				if (!isGatewayNativeApprovalMethod(method)) throw new Error(`${adapter.label}: Gateway-owned approval runtime cannot dispatch ${method}`);
				return await gatewayRuntime.request(method, params, { clientDisplayName: adapter.clientDisplayName });
			}
			if (!gatewayClient) throw new Error(`${adapter.label}: gateway client not connected`);
			return await gatewayClient.request(method, params);
		}
	};
}
//#endregion
//#region src/infra/approval-native-runtime.ts
/** Creates the shared gateway approval runtime backed by channel-native delivery hooks. */
function createChannelNativeApprovalRuntime(adapter) {
	const nowMs = adapter.nowMs ?? Date.now;
	const handledEventKinds = new Set(adapter.eventKinds ?? ["exec"]);
	const gatewayRuntime = getGatewayNativeApprovalRuntime();
	const routeReporter = (gatewayRuntime?.routeCoordinator.createReporter ?? createApprovalNativeRouteReporter)({
		handledKinds: handledEventKinds,
		channel: adapter.channel,
		channelLabel: adapter.channelLabel,
		accountId: adapter.accountId,
		shouldHandle: (request) => adapter.shouldHandle(request),
		classifyRoute: (request) => classifyApprovalRequestChannelRoute({
			cfg: adapter.cfg,
			request,
			channel: adapter.channel ?? ""
		}),
		requestGateway: async (method, params) => {
			if (gatewayRuntime) {
				if (method !== "send") throw new Error(`native approval route cannot dispatch ${method}`);
				return await gatewayRuntime.requestRoute(method, params);
			}
			const { callGatewayLeastPrivilege } = await import("./call-CWvmXO5x.mjs");
			return await callGatewayLeastPrivilege({
				config: adapter.cfg,
				...adapter.gatewayUrl ? { url: adapter.gatewayUrl } : {},
				method,
				params,
				clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
				mode: GATEWAY_CLIENT_MODES.BACKEND
			});
		}
	});
	const runtime = createExecApprovalChannelRuntime({
		label: adapter.label,
		clientDisplayName: adapter.clientDisplayName,
		cfg: adapter.cfg,
		gatewayUrl: adapter.gatewayUrl,
		eventKinds: adapter.eventKinds,
		isConfigured: adapter.isConfigured,
		shouldHandle: (request) => {
			const approvalKind = adapter.resolveApprovalKind?.(request) ?? request.approvalKind;
			const selection = routeReporter.selectRequest({
				approvalKind,
				request
			});
			if (selection.kind === "selected") return true;
			if (selection.kind === "selector-error") {
				routeReporter.reportSkipped({
					approvalKind,
					request,
					reason: "ineligible"
				});
				throw selection.error;
			}
			routeReporter.reportSkipped({
				approvalKind,
				request,
				reason: selection.kind
			});
			return false;
		},
		finalizeResolved: async (params) => {
			try {
				await adapter.finalizeResolved(params);
			} finally {
				routeReporter.completeRequest(params.request.id);
			}
		},
		finalizeExpired: adapter.finalizeExpired ? async (params) => {
			try {
				await adapter.finalizeExpired?.(params);
			} finally {
				routeReporter.completeRequest(params.request.id);
			}
		} : void 0,
		onStopped: adapter.onStopped,
		beforeGatewayClientStart: () => {
			routeReporter.start();
		},
		nowMs,
		deliverRequested: async (request) => {
			const approvalKind = adapter.resolveApprovalKind?.(request) ?? request.approvalKind;
			let deliveryPlan = {
				targets: [],
				originTarget: null,
				notifyOriginWhenDmOnly: false
			};
			let deliveredTargets = [];
			try {
				const pendingContent = await adapter.buildPendingContent({
					request,
					approvalKind,
					nowMs: nowMs()
				});
				const plannedDelivery = await resolveChannelNativeApprovalDeliveryPlan({
					cfg: adapter.cfg,
					accountId: adapter.accountId,
					approvalKind,
					request,
					adapter: adapter.nativeAdapter
				});
				const deliveredKeys = /* @__PURE__ */ new Set();
				const entries = [];
				const completedTargets = [];
				for (const plannedTarget of plannedDelivery.targets) {
					const target = {
						plannedTarget,
						request,
						approvalKind,
						pendingContent
					};
					try {
						const preparedTarget = await adapter.prepareTarget({ ...target });
						if (!preparedTarget) continue;
						if (deliveredKeys.has(preparedTarget.dedupeKey)) {
							adapter.onDuplicateSkipped?.({
								...target,
								preparedTarget
							});
							continue;
						}
						const entry = await adapter.deliverTarget({
							...target,
							preparedTarget: preparedTarget.target
						});
						if (!entry) continue;
						deliveredKeys.add(preparedTarget.dedupeKey);
						entries.push(entry);
						completedTargets.push(plannedTarget);
						adapter.onDelivered?.({
							...target,
							preparedTarget,
							entry
						});
					} catch (error) {
						adapter.onDeliveryError?.({
							...target,
							error
						});
					}
				}
				deliveryPlan = plannedDelivery;
				deliveredTargets = completedTargets;
				return entries;
			} finally {
				await routeReporter.reportDelivery({
					approvalKind,
					request,
					deliveryPlan,
					deliveredTargets
				});
			}
		}
	});
	return {
		...runtime,
		async start() {
			try {
				await runtime.start();
			} catch (error) {
				await routeReporter.stop();
				throw error;
			}
		},
		async stop() {
			await runtime.stop();
			await routeReporter.stop();
		}
	};
}
//#endregion
export { isExecApprovalChannelRuntimeTerminalStartError as n, createChannelNativeApprovalRuntime as t };
