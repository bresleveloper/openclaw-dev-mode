import { m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as StateDatabaseAdmissionPendingError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { b as AgentDatabaseExecutionAdmissionClosedError, x as AgentDatabaseSchemaAdmissionChangedError } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { d as isSqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { Bc as validateWorkerHeartbeatParams, Fc as validateWorkerConnectRequestFrame, Kc as validateWorkerTranscriptCommitParams, Pc as validateWorkerComputerParams, Qr as validateRequestFrame, Vc as validateWorkerLiveEventParams } from "./src-pLJQA6J5.mjs";
import { E as runWithGatewayIndependentRootWorkContinuation, N as tryBeginGatewayRootWorkAdmission, d as getGatewaySuspendAdmissionPhase, p as isGatewayRestartDraining } from "./gateway-work-admission-FWbk4b3p.mjs";
import { s as createAgentDatabaseAdmissionErrorShape, t as AgentDatabaseAdmissionError } from "./agent-database-admission-CeDA0ojh.mjs";
import "./io-DIF-KW3P.mjs";
import { v as runWorkerTurnAdmissionContinuation } from "./placement-turn-claim-events-C-F0mgX3.mjs";
import { s as WORKER_PROTOCOL_MAX_PAYLOAD_BYTES } from "./worker-protocol-primitives-wrWgxYRD.mjs";
import { r as getHeader } from "./http-header-value-BM79-5V8.mjs";
import { a as isLoopbackAddress } from "./net-CjQwRK-V.mjs";
import { l as isWebchatClient } from "./message-channel-DmAdWHmL.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, h as validateWorkerInferenceStartParams, i as WORKER_INFERENCE_PROTOCOL_FEATURE, p as validateWorkerInferenceCancelParams, r as WORKER_INFERENCE_METHODS } from "./worker-inference-DQS6vE1x.mjs";
import { Dt as validateWorkerGatewayToolCancelParams, Ot as validateWorkerGatewayToolInvokeParams, _ as WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE, _t as WORKER_GATEWAY_TOOL_METHODS, a as WORKER_HEARTBEAT_INTERVAL_MS, c as WORKER_LIVE_EVENT_PROTOCOL_FEATURE, dt as WORKER_COMPUTER_PROTOCOL_FEATURE, gt as WORKER_GATEWAY_TOOLS_PROTOCOL_FEATURE, h as WORKER_PROTOCOL_METHODS } from "./worker-admission-DKoRQV__.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-y64LHoys.mjs";
import "./version-CwNT1gaY.mjs";
import { t as MAX_PAYLOAD_BYTES } from "./payload-limits-ChDi8AHf.mjs";
import { a as upsertPresence, r as touchPresence, t as commitPresence } from "./system-presence-Di2OrVHO.mjs";
import { u as AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION } from "./auth-rate-limit-ByL4y2DQ.mjs";
import { a as getRemoteControlUiIngressContext, o as hasCurrentRemoteControlUiIngress, u as readPreparedGatewayIngressAttribution } from "./ingress-attribution-CP_2XS9r.mjs";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-BtnsIW6U.mjs";
import { t as cleanupTalkConnection } from "./session-registry-nF17nW_H.mjs";
import { d as reconcileClientPluginNodeCapabilities, o as indexPluginNodeCapabilitySurfaces } from "./plugin-node-capability-3KBblmAq.mjs";
import { i as serializeGatewayFrame } from "./serialized-json-IhaVUH2u.mjs";
import { t as isWorkerTranscriptFrameWithinBudget } from "./worker-transcript-budget-d0hoU9I_.mjs";
import { s as resolvePreauthHandshakeTimeoutMs } from "./timeouts-ClVlVfGz.mjs";
import { s as removeRemoteNodeInfo } from "./remote-CgYoyov-.mjs";
import { s as recordPairedNodeDisconnection } from "./device-pairing-node-C7M5fQRZ.mjs";
import { i as clearNodeWakeState } from "./node-wake-state-CWVR-GCk.mjs";
import { a as MAX_PREAUTH_PAYLOAD_BYTES, i as MAX_BUFFERED_BYTES } from "./server-constants-B-cmoH_0.mjs";
import { n as refreshClientPresence } from "./client-presence-BvtSzFrY.mjs";
import { n as logRejectedLargePayload } from "./diagnostic-payload-BJUCTxkN.mjs";
import { t as closeGatewayTransportWithGrace } from "./connection-transport-close-DgczQaNw.mjs";
import { n as logWs, t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BeRsGF9T.mjs";
import { i as classifyGatewayStaleInstall, t as GATEWAY_STALE_INSTALL_CLOSE_REASON } from "./stale-install-CUqZoIvN.mjs";
import { a as takePublicWorkerIngress, r as WS_HANDSHAKE_PHASES } from "./ws-types-099MIJxx.mjs";
import "./startup-unavailable-D0-EeFjq.mjs";
import { t as rawDataToString } from "./websocket-data-2vBvd4uX.mjs";
import { t as rawDataByteLength } from "./ws-BdD3UP1C.mjs";
import { t as resolveHostedPluginSurfaceUrl } from "./hosted-plugin-surface-url-BUW6Xqzm.mjs";
import { t as startWebSocketKeepalive } from "./websocket-keepalive-DYmRD_O3.mjs";
import { i as createWorkerRpcDiagnostics, n as captureGatewayRpcReceivedAt, t as GatewayRpcDiagnostics } from "./request-diagnostics-CnX1YrNb.mjs";
import { t as HandshakeAuthLogLimiter } from "./handshake-auth-log-limiter-Dn4NTlYd.mjs";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/gateway/server/ws-connection-diagnostics.ts
const LOG_HEADER_MAX_LEN = 300;
function stringMetaValue(meta, key) {
	return readNonBlankString(meta[key]);
}
function sanitizeWsLogValue(value) {
	if (!value) return;
	const cleaned = value.replace(/[\p{Cc}\p{Cf}]/gu, " ").replace(/\s+/g, " ").trim();
	if (!cleaned) return;
	return truncateUtf16Safe(cleaned, LOG_HEADER_MAX_LEN);
}
function formatSocketEndpoint(address, port) {
	if (!address) return;
	if (port === void 0) return address;
	return address.includes(":") ? `[${address}]:${port}` : `${address}:${port}`;
}
function resolveSocketAddress(socket) {
	const rawSocket = socket["_socket"];
	const remoteAddr = rawSocket?.remoteAddress;
	const remotePort = rawSocket?.remotePort;
	const localAddr = rawSocket?.localAddress;
	const localPort = rawSocket?.localPort;
	const remoteEndpoint = formatSocketEndpoint(remoteAddr, remotePort);
	const localEndpoint = formatSocketEndpoint(localAddr, localPort);
	return {
		remoteAddr,
		remotePort,
		localAddr,
		localPort,
		endpoint: remoteEndpoint && localEndpoint ? `${remoteEndpoint}->${localEndpoint}` : remoteEndpoint ?? localEndpoint
	};
}
function isWsPayloadLimitError(err) {
	const error = asOptionalObjectRecord(err);
	if (error?.code === "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH") return true;
	const message = error?.message;
	return typeof message === "string" && /max payload size exceeded/i.test(message);
}
//#endregion
//#region src/gateway/server/ws-connection/message-handler-loader.ts
function attachGatewayWsMessageHandlerOnDemand(params) {
	const queued = [];
	const queueMessage = (data) => {
		if (queued.length >= 16) {
			params.setCloseCause("message-handler-loading-overflow", { queuedFrames: queued.length });
			params.close(1008, "gateway message handler loading");
			return;
		}
		queued.push(data);
	};
	params.socket.on("message", queueMessage);
	params.connectionWork.track(async () => {
		const { attachGatewayWsMessageHandler } = await import("./message-handler-D4MSHaE6.mjs");
		params.socket.off("message", queueMessage);
		if (params.isClosed() || params.connectionWork.isClosing) return;
		const receive = attachGatewayWsMessageHandler(params);
		for (const data of queued) receive(data);
	}).catch((error) => {
		params.socket.off("message", queueMessage);
		const formattedError = formatErrorMessage(error);
		const staleInstall = classifyGatewayStaleInstall(error);
		if (staleInstall) {
			params.setCloseCause("message-handler-load-failed", {
				error: formattedError,
				staleInstall: true,
				restartCommand: staleInstall.restartCommand
			});
			params.logWsControl.error(`failed to load ws message handler because the OpenClaw installation changed while the Gateway was running conn=${params.connId}; run: ${staleInstall.restartCommand}; error: ${formattedError}`);
			params.close(1011, GATEWAY_STALE_INSTALL_CLOSE_REASON);
			return;
		}
		params.setCloseCause("message-handler-load-failed", { error: formattedError });
		params.logWsControl.error(`failed to load ws message handler conn=${params.connId}: ${formattedError}`);
		params.close(1011, "gateway message handler unavailable");
	});
}
//#endregion
//#region src/gateway/server/ws-connection/node-lifecycle-dispatch.ts
const NODE_LIFECYCLE_METHODS = /* @__PURE__ */ new Set(["node.invoke.progress", "node.invoke.result"]);
const NODE_LIFECYCLE_DISPATCH_DRAIN_TIMEOUT_MS = 1e3;
/**
* Tracks admitted node progress/result requests so physical disconnect cleanup
* drains their existing work before retiring invokes. It does not add a queue.
*/
var GatewayNodeLifecycleDispatchTracker = class {
	constructor() {
		this.active = /* @__PURE__ */ new Set();
	}
	hasActive() {
		return this.active.size > 0;
	}
	dispatch(method, run) {
		const execution = run();
		if (!NODE_LIFECYCLE_METHODS.has(method)) return execution;
		const settled = execution.then(() => void 0, () => void 0);
		this.active.add(settled);
		settled.finally(() => {
			this.active.delete(settled);
		});
		return execution;
	}
	async drain(timeoutMs = NODE_LIFECYCLE_DISPATCH_DRAIN_TIMEOUT_MS) {
		const deadlineAt = Date.now() + Math.max(0, timeoutMs);
		while (this.active.size > 0) {
			const remainingMs = deadlineAt - Date.now();
			if (remainingMs <= 0) return false;
			const timedOut = Symbol("node-lifecycle-dispatch-timeout");
			if (await raceWithTimeout(Promise.allSettled(this.active), remainingMs, () => timedOut) === timedOut) return false;
		}
		return true;
	}
};
//#endregion
//#region src/gateway/server/connection.ts
const unauthorizedCloseBeforeConnectLogLimiter = new HandshakeAuthLogLimiter();
function attachGatewayConnection(params) {
	const remoteIngress = getRemoteControlUiIngressContext(params.request);
	const { socket, connectionKind, request: upgradeReq, ingressAttribution, clients, connectionWork, getPluginNodeCapabilities, getResolvedAuth, getRequiredSharedGatewaySessionGeneration = () => resolveSharedGatewaySessionGeneration(getResolvedAuth(), readRuntimeConfig().gateway?.trustedProxies), isStartupPending, logGateway, logWsControl, buildRequestContext } = params;
	if (connectionWork.isClosing || !hasCurrentRemoteControlUiIngress(remoteIngress)) {
		socket.terminate();
		return;
	}
	let client = null, closed = false;
	const [openedAt, connId] = [Date.now(), randomUUID()];
	const connectionController = new AbortController();
	const { remoteAddr, remotePort, localAddr, localPort, endpoint } = params.addresses;
	const requestHost = getHeader(upgradeReq, "host");
	const requestOrigin = getHeader(upgradeReq, "origin");
	const requestUserAgent = getHeader(upgradeReq, "user-agent");
	const forwardedFor = getHeader(upgradeReq, "x-forwarded-for");
	const openedDuringStartup = isStartupPending?.() === true;
	logWs("in", "open", {
		connId,
		remoteAddr,
		remotePort,
		localAddr,
		localPort,
		endpoint
	});
	let handshakeState = "pending";
	let lastHandshakePhase = "tcp_accepted";
	let holdsPreauthBudget = true;
	let closeCause;
	let heartbeatDiagnostics;
	let closeMeta = {};
	let lastFrameType;
	let lastFrameMethod;
	let lastFrameId;
	let hasReceivedPreauthFrame = false;
	const nodeLifecycleDispatch = new GatewayNodeLifecycleDispatchTracker();
	socket.once("message", () => {
		hasReceivedPreauthFrame = true;
	});
	const advanceHandshakePhase = (next) => {
		if (WS_HANDSHAKE_PHASES.indexOf(next) > WS_HANDSHAKE_PHASES.indexOf(lastHandshakePhase)) lastHandshakePhase = next;
	};
	const setCloseCause = (cause, meta) => {
		if (!closeCause) closeCause = cause;
		if (meta && Object.keys(meta).length > 0) closeMeta = {
			...closeMeta,
			...meta
		};
	};
	const releasePreauthBudget = () => {
		if (!holdsPreauthBudget) return;
		holdsPreauthBudget = false;
		params.releasePreauth();
	};
	const setLastFrameMeta = (meta) => {
		if (meta.type || meta.method || meta.id) {
			lastFrameType = meta.type ?? lastFrameType;
			lastFrameMethod = meta.method ?? lastFrameMethod;
			lastFrameId = meta.id ?? lastFrameId;
		}
	};
	let stopKeepalive;
	let cleanupTransport;
	let retainClientUntilNodeDrain = false;
	const handshakeTimeoutMs = resolvePreauthHandshakeTimeoutMs({ configuredTimeoutMs: params.preauthHandshakeTimeoutMs });
	const handshakeTimer = setTimeout(() => {
		if (!client) {
			handshakeState = "failed";
			setCloseCause("handshake-timeout", {
				handshakeMs: Date.now() - openedAt,
				endpoint,
				phase: lastHandshakePhase
			});
			logWsControl.warn(`handshake timeout conn=${connId} peer=${endpoint ?? "n/a"} remote=${remoteAddr ?? "?"} phase=${lastHandshakePhase}`);
			if (connectionKind === "worker") close(1008, "invalid-handshake");
			else close();
		}
	}, handshakeTimeoutMs);
	const retireTransport = () => {
		if (closed) return;
		closed = true;
		connectionController.abort();
		clearTimeout(handshakeTimer);
		stopKeepalive?.();
		cleanupTransport?.();
		cleanupTransport = void 0;
		releasePreauthBudget();
	};
	const retireConnection = () => {
		retainClientUntilNodeDrain ||= !closed && client?.connect.role === "node" && nodeLifecycleDispatch.hasActive();
		retireTransport();
		if (client && !retainClientUntilNodeDrain) clients.delete(client);
	};
	const closeWithGrace = (code = 1e3, reason) => {
		if (closed) return;
		retireConnection();
		closeGatewayTransportWithGrace(socket, code, reason ?? "");
	};
	const close = closeWithGrace;
	const closeRemoteIngress = () => closeWithGrace(1008, "remote Control UI ingress closed");
	remoteIngress?.signal.addEventListener("abort", closeRemoteIngress, { once: true });
	socket.once("close", () => remoteIngress?.signal.removeEventListener("abort", closeRemoteIngress));
	const releaseConnection = connectionWork.registerConnection(() => {
		closeWithGrace(1012, connectionKind === "worker" ? "gateway-shutdown" : "service restart");
	});
	const send = (obj) => {
		if (!hasCurrentRemoteControlUiIngress(remoteIngress)) {
			closeRemoteIngress();
			return { kind: "unavailable" };
		}
		if (closed) return { kind: "unavailable" };
		if (socket.readyState !== 1) {
			close();
			return { kind: "unavailable" };
		}
		if (socket.bufferedAmount > 52428800) {
			logRejectedLargePayload({
				surface: "gateway.ws.outbound_buffer",
				bytes: socket.bufferedAmount,
				limitBytes: MAX_BUFFERED_BYTES,
				reason: "ws_send_buffer_close"
			});
			setCloseCause("outbound-buffer-exceeded", {
				bytes: socket.bufferedAmount,
				limitBytes: MAX_BUFFERED_BYTES
			});
			closeWithGrace(1008, connectionKind === "worker" ? "slow-consumer" : "slow consumer");
			return { kind: "unavailable" };
		}
		let encoded;
		try {
			encoded = serializeGatewayFrame(obj);
		} catch (error) {
			return {
				kind: "serialization",
				error
			};
		}
		try {
			if (typeof encoded === "string") socket.send(encoded);
			else socket.send(encoded, { binary: false });
			return {
				kind: "sent",
				bytes: typeof encoded === "string" ? Buffer.byteLength(encoded) : encoded.byteLength
			};
		} catch {
			socket.terminate();
			retireConnection();
			return { kind: "unavailable" };
		}
	};
	const connectNonce = randomUUID();
	if (connectionKind === "gateway") send({
		type: "event",
		event: "connect.challenge",
		payload: {
			nonce: connectNonce,
			ts: Date.now(),
			capabilities: [GATEWAY_SERVER_CAPS.MODEL_CATALOG_SNAPSHOT]
		}
	});
	advanceHandshakePhase("ws_upgrade_started");
	const isNoisySwiftPmHelperClose = (userAgent, remote) => normalizeLowercaseStringOrEmpty(userAgent).includes("swiftpm-testing-helper") && isLoopbackAddress(remote);
	const isExpectedLocalAppStartupAbort = (code) => openedDuringStartup && (code === 1001 || code === 1006) && lastHandshakePhase === "ws_upgrade_started" && !hasReceivedPreauthFrame && lastFrameType === void 0 && normalizeLowercaseStringOrEmpty(requestUserAgent).startsWith("openclaw/") && isLoopbackAddress(remoteAddr);
	const handleSocketClose = async (code, reason) => {
		const durationMs = Date.now() - openedAt;
		const disconnectContext = {
			cause: closeCause,
			durationMs,
			...heartbeatDiagnostics
		};
		const logForwardedFor = sanitizeWsLogValue(forwardedFor);
		const logOrigin = sanitizeWsLogValue(requestOrigin);
		const logHost = sanitizeWsLogValue(requestHost);
		const logUserAgent = sanitizeWsLogValue(requestUserAgent);
		const logReason = sanitizeWsLogValue(reason?.toString());
		const handshakeIncomplete = lastHandshakePhase !== "ready";
		const closeContext = {
			...disconnectContext,
			handshake: handshakeState,
			...handshakeIncomplete ? { phase: lastHandshakePhase } : {},
			lastFrameType,
			lastFrameMethod,
			lastFrameId,
			host: logHost,
			origin: logOrigin,
			userAgent: logUserAgent,
			forwardedFor: logForwardedFor,
			remoteAddr,
			remotePort,
			localAddr,
			localPort,
			endpoint,
			...closeMeta
		};
		if (!client) {
			const logFn = isNoisySwiftPmHelperClose(requestUserAgent, remoteAddr) || closeCause === "startup-sidecars-pending" || isExpectedLocalAppStartupAbort(code) ? logWsControl.debug : logWsControl.warn;
			const suppressedText = closeCause === "unauthorized" ? unauthorizedCloseBeforeConnectLogLimiter.missingCredentialLogSuffix({
				reason: stringMetaValue(closeMeta, "authReason"),
				remoteAddr,
				client: stringMetaValue(closeMeta, "clientDisplayName") ?? stringMetaValue(closeMeta, "client"),
				mode: stringMetaValue(closeMeta, "mode"),
				authProvided: "none"
			}) : "";
			if (suppressedText !== void 0) logFn(`closed before connect conn=${connId} peer=${endpoint ?? "n/a"} remote=${remoteAddr ?? "?"} fwd=${logForwardedFor || "n/a"} origin=${logOrigin || "n/a"} host=${logHost || "n/a"} ua=${logUserAgent || "n/a"} code=${code ?? "n/a"} reason=${logReason || "n/a"} phase=${lastHandshakePhase}${suppressedText}`, closeContext);
		}
		if (client && isWebchatClient(client.connect.client)) logWsControl.info(`webchat disconnected code=${code} reason=${logReason || "n/a"} conn=${connId}`, disconnectContext);
		if (client?.authenticatedUserId) logWsControl.info(`authenticated user disconnected code=${code} reason=${logReason || "n/a"} conn=${connId} user=${formatForLog(client.authenticatedUserId)}`, disconnectContext);
		if (connectionKind === "gateway") {
			const context = buildRequestContext();
			cleanupTalkConnection(connId, logGateway);
			context.unsubscribeAllSessionEvents(connId);
			context.terminalSessions?.handleDisconnect(connId);
			let currentDisconnectedNodeId = null;
			let disconnectedNodeHistory;
			if (client?.connect?.role === "node") {
				const nodeId = client.connect.device?.id ?? client.connect.client.id;
				const nodeSession = context.nodeRegistry.get(nodeId);
				if (nodeSession?.connId === connId && nodeSession.pairingGeneration) disconnectedNodeHistory = {
					nodeId: nodeSession.nodeId,
					connectedAtMs: nodeSession.connectedAtMs,
					disconnectedAtMs: Date.now(),
					expectedPairingGeneration: {
						nodeId: nodeSession.nodeId,
						key: nodeSession.pairingGeneration
					}
				};
				retainClientUntilNodeDrain = true;
				retireTransport();
				try {
					if (nodeLifecycleDispatch.hasActive()) {
						if (!await nodeLifecycleDispatch.drain()) logGateway.warn(`node lifecycle dispatch drain timed out after ${NODE_LIFECYCLE_DISPATCH_DRAIN_TIMEOUT_MS}ms conn=${connId}`);
					}
					currentDisconnectedNodeId = context.nodeRegistry.unregister(connId);
				} finally {
					retainClientUntilNodeDrain = false;
				}
			}
			if (client?.presenceKey && (client.connect.role !== "node" || currentDisconnectedNodeId !== null)) {
				upsertPresence(client.presenceKey, {
					reason: "disconnect",
					watchedSessions: void 0
				});
				commitPresence(client.presenceKey, connId);
				buildRequestContext().publishPresence();
			}
			if (currentDisconnectedNodeId) {
				removeRemoteNodeInfo(currentDisconnectedNodeId);
				context.nodeUnsubscribeAll(currentDisconnectedNodeId);
				clearNodeWakeState(currentDisconnectedNodeId);
			}
			if (disconnectedNodeHistory && currentDisconnectedNodeId === disconnectedNodeHistory.nodeId) try {
				await recordPairedNodeDisconnection(disconnectedNodeHistory);
			} catch (error) {
				logGateway.warn(`failed to record node disconnect for ${disconnectedNodeHistory.nodeId}: ${formatForLog(error)}`);
			}
		}
		logWs("out", "close", {
			connId,
			code,
			reason: logReason,
			...disconnectContext,
			handshake: handshakeState,
			...handshakeIncomplete ? { phase: lastHandshakePhase } : {},
			lastFrameType,
			lastFrameMethod,
			lastFrameId,
			endpoint
		});
		retireConnection();
	};
	socket.once("close", (code, reason) => {
		connectionController.abort();
		connectionWork.trackCleanup(() => handleSocketClose(code, reason)).catch((error) => {
			logGateway.error(`websocket close cleanup failed conn=${connId}: ${formatErrorMessage(error)}`);
			retireConnection();
		}).finally(releaseConnection);
	});
	const setClient = (next) => {
		if (closed || client || !hasCurrentRemoteControlUiIngress(remoteIngress)) return false;
		if (next.connect.role === "node" && !reconcileClientPluginNodeCapabilities(next, indexPluginNodeCapabilitySurfaces(getPluginNodeCapabilities?.() ?? []), () => close(1012, "node capabilities changed"))) return false;
		if (next.worker) {
			for (const existing of clients) if (existing.worker?.environmentId === next.worker.environmentId) {
				existing.invalidated = true;
				clients.delete(existing);
				try {
					existing.socket.terminate();
				} catch {
					existing.socket.close(1008, "credential-replaced");
				}
			}
		}
		releasePreauthBudget();
		next.connectionSignal = connectionController.signal;
		client = next;
		clients.add(next);
		if (next.presenceKey && (next.authenticatedUserId || next.authenticatedUserProfile) && next.connect.role !== "node") {
			next.personPresence = { onlineSince: Date.now() };
			refreshClientPresence(clients, next);
		}
		stopKeepalive = params.onAuthenticated?.(next, (diagnostics) => {
			heartbeatDiagnostics = diagnostics;
			setCloseCause("heartbeat-timeout");
			try {
				socket.terminate();
			} catch {
				close();
			}
		});
		return true;
	};
	const connectionLifecycle = {
		connectionWork,
		connId,
		isStartupPending,
		send,
		close,
		isClosed: () => closed || !hasCurrentRemoteControlUiIngress(remoteIngress),
		clearHandshakeTimer: () => clearTimeout(handshakeTimer),
		getClient: () => client,
		setClient,
		setHandshakeState: (next) => {
			handshakeState = next;
		},
		advanceHandshakePhase,
		setCloseCause,
		setLastFrameMeta,
		logGateway,
		logWsControl
	};
	cleanupTransport = params.attachTransport?.(connectionLifecycle);
	if (connectionKind === "worker") return;
	if (!ingressAttribution || ingressAttribution.kind === "unattributable-proxy") {
		setCloseCause("missing-ingress-attribution");
		logWsControl.warn(`gateway websocket missing prepared ingress attribution conn=${connId}`);
		close(1008, "gateway ingress attribution required");
		return;
	}
	attachGatewayWsMessageHandlerOnDemand({
		...params,
		...connectionLifecycle,
		upgradeReq,
		ingressAttribution,
		...params.addresses,
		forwardedFor,
		requestHost,
		requestOrigin,
		requestUserAgent,
		connectNonce,
		getRequiredSharedGatewaySessionGeneration,
		nodeLifecycleDispatch
	});
}
//#endregion
//#region src/gateway/worker-environments/transcript-commit-failure.ts
/** Replay retains the batch identity and rechecks current run and database authority. */
function isReplayableWorkerTranscriptCommitError(error) {
	if (error instanceof AgentDatabaseAdmissionError) return createAgentDatabaseAdmissionErrorShape(error.refusal).retryable === true;
	return isSqliteLockError(error) || error instanceof AgentDatabaseExecutionAdmissionClosedError || error instanceof AgentDatabaseSchemaAdmissionChangedError || error instanceof StateDatabaseAdmissionPendingError || isStateDatabaseReadAdmissionInvalidatedError(error) || isAbortError(error) || isSqliteWorkerError(error, "closed") || isSqliteWorkerError(error, "overloaded") || isSqliteWorkerError(error, "unavailable") || isSqliteWorkerError(error, "outcome-unknown");
}
//#endregion
//#region src/gateway/server/ws-receiver.ts
function hasWritablePayloadLimit(target) {
	return typeof target?.["_maxPayload"] === "number" && Object.getOwnPropertyDescriptor(target, "_maxPayload")?.writable === true;
}
function gatewayReceiver(socket) {
	const receiver = socket["_receiver"];
	return hasWritablePayloadLimit(receiver) ? receiver : null;
}
/** Raises the authenticated frame limit after the connection is admitted. */
function raiseGatewayReceiverPayloadLimit(socket, maxPayload) {
	const receiver = gatewayReceiver(socket);
	if (!receiver) return false;
	receiver["_maxPayload"] = maxPayload;
	return true;
}
function prepareGatewayReceiverHandoff(socket, role) {
	const receiver = gatewayReceiver(socket);
	if (!receiver || role === "operator" && (typeof receiver["_allowSynchronousEvents"] !== "boolean" || Object.getOwnPropertyDescriptor(receiver, "_allowSynchronousEvents")?.writable !== true)) return {
		ok: false,
		error: {
			cause: "unsupported-websocket-receiver",
			message: "unsupported Gateway WebSocket receiver"
		}
	};
	return {
		ok: true,
		value: () => {
			receiver["_maxPayload"] = MAX_PAYLOAD_BYTES;
			if (role === "operator") receiver["_allowSynchronousEvents"] = true;
		}
	};
}
//#endregion
//#region src/gateway/server/ws-connection/worker-admission-boundary.ts
/** Serialize public credential checks and charge only failed admission attempts. */
async function runWorkerAdmissionBoundary(params) {
	const { clientIp, rateLimiter } = params.publicAdmission;
	const chargeFailure = (reason) => {
		if (reason !== "environment-unavailable") rateLimiter?.recordFailure(clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
	};
	const run = async () => {
		const rateCheck = rateLimiter?.check(clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
		if (rateCheck && !rateCheck.allowed) return {
			ok: false,
			reason: "rate-limited"
		};
		const admission = await params.service?.admitWorker(params.admission) ?? {
			ok: false,
			reason: "environment-unavailable"
		};
		if (!admission.ok) {
			chargeFailure(admission.reason);
			return admission;
		}
		const ownershipFailure = params.service?.validateWorkerConnection(admission.identity);
		if (ownershipFailure) {
			chargeFailure(ownershipFailure);
			return {
				ok: false,
				reason: ownershipFailure
			};
		}
		if (!params.claim(admission.identity)) return {
			ok: false,
			reason: "claim-rejected"
		};
		rateLimiter?.reset(clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
		return admission;
	};
	if (!rateLimiter) return await run();
	return await withSerializedRateLimitAttempt({
		ip: clientIp,
		scope: AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION,
		run
	});
}
//#endregion
//#region src/gateway/server/ws-connection/worker-connection-frames.ts
function workerProtocolError(reason, options = {}) {
	return {
		code: options.code ?? ErrorCodes.INVALID_REQUEST,
		message: options.message ?? "worker protocol request rejected",
		details: { reason },
		...options.retryable === void 0 ? {} : { retryable: options.retryable },
		...options.retryAfterMs === void 0 ? {} : { retryAfterMs: options.retryAfterMs }
	};
}
function workerMaxPayload(identity) {
	return identity.protocolFeatures.includes("worker-inference-v1") ? WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES : WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
}
function buildWorkerHello(identity) {
	return {
		type: "worker-hello-ok",
		environmentId: identity.environmentId,
		sessionId: identity.sessionId,
		ownerEpoch: identity.ownerEpoch,
		rpcSetVersion: identity.rpcSetVersion,
		protocolFeatures: [...identity.protocolFeatures],
		credentialExpiresAtMs: identity.credentialExpiresAtMs,
		policy: {
			heartbeatIntervalMs: WORKER_HEARTBEAT_INTERVAL_MS,
			maxPayload: workerMaxPayload(identity)
		}
	};
}
function workerTranscriptCommitError(reason) {
	return {
		code: ErrorCodes.INVALID_REQUEST,
		message: "worker transcript commit rejected",
		details: { reason }
	};
}
function workerLiveEventError(details) {
	return {
		code: ErrorCodes.INVALID_REQUEST,
		message: "worker live event rejected",
		details
	};
}
function workerInferenceError(reason) {
	return {
		code: reason === "provider-error" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST,
		message: "worker inference request rejected",
		details: { reason }
	};
}
//#endregion
//#region src/gateway/server/ws-connection/worker-connection-dispatch.ts
/** Closed worker dispatcher. It never calls the generic gateway method registry. */
async function dispatchWorkerRequest(params) {
	const reject = (reason) => {
		params.warn(`worker protocol request rejected reason=${reason}`);
		params.respond(false, void 0, workerProtocolError(reason));
		queueMicrotask(() => params.close(1008, reason));
	};
	const service = params.service;
	if (!service) {
		reject("environment-unavailable");
		return;
	}
	const ownershipFailure = Object.values(WORKER_GATEWAY_TOOL_METHODS).some((method) => method === params.request.method) ? service.validateWorkerConnection(params.identity, { toolSurface: true }) : service.validateWorkerConnection(params.identity);
	if (ownershipFailure) {
		reject(ownershipFailure);
		return;
	}
	const execute = async (feature, validate, operation, invalid, errorFor) => {
		if (!params.identity.protocolFeatures.includes(feature) || !operation) reject("method-not-allowed");
		else if (!validate(params.request.params)) {
			if (typeof invalid === "string") reject(invalid);
			else params.respond(false, void 0, invalid);
		} else {
			const outcome = await operation(params.request.params);
			if (outcome.ok) {
				params.respond(true, outcome.result);
				outcome.launch?.();
			} else if ("closeReason" in outcome) reject(outcome.closeReason);
			else params.respond(false, void 0, errorFor(outcome));
		}
	};
	const unavailableInference = async () => ({
		ok: false,
		closeReason: "method-not-allowed"
	});
	if (params.request.method === WORKER_GATEWAY_TOOL_METHODS.invoke) {
		const operation = service.invokeGatewayTool;
		return execute(WORKER_GATEWAY_TOOLS_PROTOCOL_FEATURE, validateWorkerGatewayToolInvokeParams, operation && ((request) => operation.call(service, params.identity, request, params, params.signal)), "invalid-frame", () => workerProtocolError("gateway-unavailable"));
	}
	if (params.request.method === WORKER_GATEWAY_TOOL_METHODS.cancel) {
		const operation = service.cancelGatewayTool;
		return execute(WORKER_GATEWAY_TOOLS_PROTOCOL_FEATURE, validateWorkerGatewayToolCancelParams, operation && ((request) => operation.call(service, params.identity, request)), "invalid-frame", () => workerProtocolError("gateway-unavailable"));
	}
	if (params.request.method === WORKER_INFERENCE_METHODS[0]) {
		const operation = service.startInference;
		return execute(WORKER_INFERENCE_PROTOCOL_FEATURE, validateWorkerInferenceStartParams, operation ? (request) => operation.call(service, params.identity, request, params) : unavailableInference, workerInferenceError("invalid-context"), (failure) => workerInferenceError(failure.reason));
	}
	if (params.request.method === WORKER_INFERENCE_METHODS[1]) {
		const operation = service.cancelInference;
		return execute(WORKER_INFERENCE_PROTOCOL_FEATURE, validateWorkerInferenceCancelParams, operation ? (request) => operation.call(service, params.identity, request) : unavailableInference, workerInferenceError("invalid-context"), (failure) => workerInferenceError(failure.reason));
	}
	if (params.request.method === WORKER_PROTOCOL_METHODS[1]) return execute(WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE, validateWorkerTranscriptCommitParams, (request) => service.commitTranscript(params.identity, request), workerTranscriptCommitError("invalid-batch"), (failure) => workerTranscriptCommitError(failure.reason));
	if (params.request.method === WORKER_PROTOCOL_METHODS[2]) return execute(WORKER_LIVE_EVENT_PROTOCOL_FEATURE, validateWorkerLiveEventParams, (request) => service.pushLiveEvent(params.identity, request), workerLiveEventError({ reason: "invalid-event" }), (failure) => workerLiveEventError(failure.details));
	if (params.request.method === "worker.computer") {
		const operation = service.executeComputer;
		return execute(WORKER_COMPUTER_PROTOCOL_FEATURE, validateWorkerComputerParams, operation && ((request) => operation.call(service, params.identity, request, params.signal)), "invalid-frame", (failure) => workerProtocolError(failure.reason, { message: failure.message }));
	}
	if (params.request.method !== WORKER_PROTOCOL_METHODS[0]) {
		reject("method-not-allowed");
		return;
	}
	if (!validateWorkerHeartbeatParams(params.request.params)) {
		reject("invalid-heartbeat");
		return;
	}
	const result = {
		receivedAtMs: Date.now(),
		status: "ok",
		ownerEpoch: params.identity.ownerEpoch
	};
	params.respond(true, result);
}
//#endregion
//#region src/gateway/server/ws-connection/worker-connection.ts
const MAX_QUEUED_WORKER_FRAMES = 16;
const MAX_QUEUED_WORKER_BYTES = 33554432;
const workerMethods = /* @__PURE__ */ new Set([...WORKER_PROTOCOL_METHODS, ...WORKER_INFERENCE_METHODS]);
/** Dedicated ingress handler: worker frames never enter the generic message handler. */
function attachWorkerWsMessageHandler(params) {
	let expiryTimer;
	let disposed = false;
	const toolOperations = /* @__PURE__ */ new Set();
	const connectionToolLifetime = new AbortController();
	const cleanup = () => {
		if (disposed) return;
		disposed = true;
		connectionToolLifetime.abort(/* @__PURE__ */ new Error("Worker tool connection closed"));
		clearTimeout(expiryTimer);
		toolOperations.clear();
		params.socket.off("message", onMessage);
	};
	const closeWorker = (code, reason) => {
		cleanup();
		params.close(code, reason);
	};
	const failConnection = (code, cause) => {
		const admitting = !params.getClient();
		const reason = cause ?? (admitting ? "invalid-handshake" : "invalid-frame");
		if (admitting) {
			params.publicAdmission?.rateLimiter?.recordFailure(params.publicAdmission.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
			params.setHandshakeState("failed");
		}
		params.setCloseCause(reason);
		(admitting ? params.logWsControl : params.logGateway).warn(`worker ${admitting ? "admission" : "protocol request"} rejected reason=${reason}`);
		closeWorker(code, reason);
	};
	const rejectAdmission = (rejection) => {
		const internalReason = rejection.internalReason ?? rejection.reason;
		const wireReason = rejection.opaqueOnPublicIngress || rejection.reason === "rate-limited" ? "invalid-handshake" : rejection.reason;
		const wireError = rejection.error ?? workerProtocolError(wireReason, { message: "worker admission rejected" });
		params.setHandshakeState("failed");
		params.setCloseCause(internalReason);
		params.logWsControl.warn(`worker admission rejected reason=${internalReason}`);
		params.send({
			type: "res",
			id: rejection.id,
			ok: false,
			error: wireError
		});
		queueMicrotask(() => closeWorker(rejection.code ?? 1008, wireReason));
	};
	const handleConnect = async (connect, id, admissionOpen) => {
		if (!admissionOpen || params.isStartupPending?.()) {
			rejectAdmission({
				id,
				reason: "gateway-unavailable",
				error: workerProtocolError("gateway-unavailable", {
					code: ErrorCodes.UNAVAILABLE,
					message: "worker gateway unavailable",
					retryable: true,
					retryAfterMs: 500
				}),
				code: 1013
			});
			return;
		}
		if (!params.publicAdmission) {
			rejectAdmission({
				id,
				reason: "invalid-handshake",
				internalReason: "public-ingress-context-missing"
			});
			return;
		}
		if (connect.minProtocol > 4 || connect.maxProtocol < 4) {
			rejectAdmission({
				id,
				reason: "protocol-mismatch"
			});
			return;
		}
		const admission = await runWorkerAdmissionBoundary({
			service: params.service,
			admission: connect.admission,
			publicAdmission: params.publicAdmission,
			claim: (identity) => {
				const client = {
					socket: params.socket,
					connect: {
						minProtocol: connect.minProtocol,
						maxProtocol: connect.maxProtocol,
						client: connect.client,
						role: "worker",
						scopes: []
					},
					connId: params.connId,
					connectionKind: "worker",
					worker: identity,
					usesSharedGatewayAuth: false
				};
				params.clearHandshakeTimer();
				params.advanceHandshakePhase("auth_validated");
				if (!params.setClient(client)) {
					params.setHandshakeState("failed");
					return false;
				}
				return true;
			}
		});
		if (!admission.ok) {
			if (admission.reason === "claim-rejected") return;
			rejectAdmission({
				id,
				reason: admission.reason,
				opaqueOnPublicIngress: true
			});
			return;
		}
		if (!raiseGatewayReceiverPayloadLimit(params.socket, workerMaxPayload(admission.identity))) {
			rejectAdmission({
				id,
				reason: "gateway-unavailable",
				internalReason: "unsupported-websocket-receiver",
				error: workerProtocolError("gateway-unavailable", {
					code: ErrorCodes.UNAVAILABLE,
					message: "unsupported Gateway WebSocket receiver"
				}),
				code: 1011
			});
			return;
		}
		const hello = buildWorkerHello(admission.identity);
		if (admission.identity.sessionId !== null && admission.identity.protocolFeatures.includes("worker-gateway-tools-v1")) try {
			const surface = await params.service?.getToolSurface?.(admission.identity);
			if (!surface?.ok) {
				rejectAdmission({
					id,
					reason: surface?.closeReason ?? "method-not-allowed"
				});
				return;
			}
			hello.toolSurface = surface.result;
		} catch {
			rejectAdmission({
				id,
				reason: "gateway-unavailable",
				error: workerProtocolError("gateway-unavailable", { message: "Worker tool surface is unavailable during admission" })
			});
			return;
		}
		if (disposed || params.isClosed() || params.getClient()?.invalidated) return;
		const response = {
			type: "res",
			id,
			ok: true,
			payload: hello
		};
		if (Buffer.byteLength(JSON.stringify(response), "utf8") > workerMaxPayload(admission.identity)) {
			rejectAdmission({
				id,
				reason: "invalid-handshake",
				error: workerProtocolError("invalid-handshake", { message: "Worker tool surface exceeds the admission frame limit" })
			});
			return;
		}
		params.setHandshakeState("connected");
		params.advanceHandshakePhase("session_attached");
		params.advanceHandshakePhase("hello_payload_prepared");
		params.send(response);
		if (disposed || params.isClosed()) return;
		params.advanceHandshakePhase("ready");
		expiryTimer = setTimeout(() => {
			const failure = params.service?.validateWorkerConnection(admission.identity);
			if (failure) closeWorker(1008, failure);
			else if (!params.service) closeWorker(1008, "credential-expired");
		}, Math.max(0, admission.identity.credentialExpiresAtMs - Date.now()));
		expiryTimer.unref?.();
	};
	const handleMessage = async (data, admissionOpen, timing) => {
		const client = params.getClient();
		if (client?.invalidated) {
			failConnection(1008, "credential-replaced");
			return;
		}
		if (client && !admissionOpen) {
			failConnection(1013, "gateway-unavailable");
			return;
		}
		const frameBytes = rawDataByteLength(data);
		if (frameBytes > (client?.worker ? workerMaxPayload(client.worker) : 65536)) {
			failConnection(1009);
			return;
		}
		let parsed;
		try {
			parsed = JSON.parse(rawDataToString(data));
		} catch {
			failConnection(1008);
			return;
		}
		if (!client) {
			if (!validateWorkerConnectRequestFrame(parsed)) {
				failConnection(1008);
				return;
			}
			params.setLastFrameMeta({
				type: "req",
				method: "connect"
			});
			await handleConnect(parsed.params, parsed.id, admissionOpen);
			return;
		}
		if (!validateRequestFrame(parsed) || parsed.id.length > 128 || parsed.method.length > 64) {
			params.logGateway.warn("worker protocol request rejected reason=invalid-frame");
			closeWorker(1008, "invalid-frame");
			return;
		}
		const mediaTranscript = parsed.method === "worker.transcript.commit" && validateWorkerTranscriptCommitParams(parsed.params) && isWorkerTranscriptFrameWithinBudget({
			...parsed,
			method: "worker.transcript.commit",
			params: parsed.params
		});
		if (frameBytes > 65536 && parsed.method !== WORKER_INFERENCE_METHODS[0] && !mediaTranscript) {
			failConnection(1009);
			return;
		}
		if (workerMethods.has(parsed.method)) params.setLastFrameMeta({
			type: "req",
			method: parsed.method
		});
		if (!client.worker) {
			closeWorker(1008, "environment-unavailable");
			return;
		}
		const diagnostics = createWorkerRpcDiagnostics(parsed.method, timing);
		const canSend = () => !disposed && !params.isClosed() && params.getClient() === client && !client.invalidated;
		const respond = (ok, payload, error) => {
			if (!canSend()) {
				diagnostics?.response("suppressed");
				return;
			}
			const result = params.send(ok ? {
				type: "res",
				id: parsed.id,
				ok,
				payload
			} : {
				type: "res",
				id: parsed.id,
				ok,
				error
			});
			diagnostics?.response(result.kind === "sent" ? ok ? "ok" : "error" : "unavailable", result.kind === "sent" ? result.bytes : void 0);
		};
		const dispatch = (signal) => {
			const invoke = () => dispatchWorkerRequest({
				request: parsed,
				identity: client.worker,
				connectionId: params.connId,
				service: params.service,
				send: (frame) => {
					if (canSend()) params.send(frame);
				},
				respond,
				close: closeWorker,
				warn: (message) => params.logGateway.warn(message),
				...signal ? { signal } : {}
			});
			return GatewayRpcDiagnostics.runHandler(invoke, diagnostics);
		};
		if (parsed.method === "worker.computer" || parsed.method === WORKER_GATEWAY_TOOL_METHODS.invoke) {
			if (toolOperations.has(parsed.id)) {
				failConnection(1008);
				diagnostics?.finish("rejected");
				return;
			}
			if (toolOperations.size >= 4) {
				respond(false, void 0, workerProtocolError("gateway-unavailable"));
				diagnostics?.finish("rejected");
				return;
			}
			toolOperations.add(parsed.id);
			let outcome = "returned";
			params.connectionWork.track(() => runWithGatewayIndependentRootWorkContinuation(() => dispatch(connectionToolLifetime.signal), "worker:dispatch").catch(() => {
				outcome = "threw";
				respond(false, void 0, workerProtocolError("gateway-unavailable"));
			}).finally(() => {
				toolOperations.delete(parsed.id);
				diagnostics?.finish(outcome);
			}));
			return;
		}
		let outcome = "returned";
		try {
			await dispatch();
		} catch (error) {
			outcome = "threw";
			if (parsed.method !== "worker.transcript.commit") throw error;
			if (isReplayableWorkerTranscriptCommitError(error)) {
				params.logGateway.warn(`worker transcript commit interrupted; reconnecting: ${formatErrorMessage(error)}`);
				throw error;
			}
			params.logGateway.warn(`worker transcript commit failed: ${formatErrorMessage(error)}`);
			respond(false, void 0, workerProtocolError("gateway-unavailable", {
				code: ErrorCodes.UNAVAILABLE,
				message: "Worker transcript commit failed; check Gateway logs.",
				retryable: false
			}));
		} finally {
			diagnostics?.finish(outcome);
		}
	};
	let queue = Promise.resolve();
	let pendingFrames = 0;
	let pendingBytes = 0;
	function onMessage(data) {
		if (disposed || params.connectionWork.isClosing) return;
		const frameBytes = rawDataByteLength(data);
		if (pendingFrames >= MAX_QUEUED_WORKER_FRAMES || pendingBytes + frameBytes > MAX_QUEUED_WORKER_BYTES) {
			failConnection(1008);
			return;
		}
		pendingFrames += 1;
		pendingBytes += frameBytes;
		const receivedAt = captureGatewayRpcReceivedAt();
		const previous = queue;
		queue = params.connectionWork.track(() => previous.then(async () => {
			const timing = receivedAt === void 0 ? void 0 : {
				receivedAt,
				dequeuedAt: performance.now()
			};
			if (disposed || params.isClosed()) return;
			const admission = tryBeginGatewayRootWorkAdmission("ws:worker-frame");
			if (!admission) {
				const client = params.getClient();
				const identity = client?.worker;
				if (client && getGatewaySuspendAdmissionPhase() === "draining" && !isGatewayRestartDraining() && identity?.turnClaim && !client.invalidated && params.service?.validateWorkerConnection(identity) === null) {
					const continuation = runWorkerTurnAdmissionContinuation(identity, () => handleMessage(data, true, timing));
					if (continuation) {
						await continuation;
						return;
					}
				}
				await handleMessage(data, false, timing);
				return;
			}
			try {
				await admission.run(() => handleMessage(data, true, timing));
			} finally {
				admission.release();
			}
		}).catch(() => {
			if (disposed) return;
			failConnection(1011, "gateway-unavailable");
		}).finally(() => {
			pendingFrames -= 1;
			pendingBytes -= frameBytes;
		}));
	}
	params.socket.on("message", onMessage);
	return cleanup;
}
//#endregion
//#region src/gateway/server/ws-connection.ts
function attachGatewayWsConnectionHandler(params) {
	const originCheckMetrics = { hostHeaderFallbackAccepted: 0 };
	params.wss.on("connection", (socket, upgradeReq) => {
		if (params.connectionWork.isClosing) {
			socket.terminate();
			return;
		}
		const ingressSocket = socket;
		const connectionKind = ingressSocket["__openclawConnectionKind"] ?? "gateway";
		const publicWorkerIngress = connectionKind === "worker" ? takePublicWorkerIngress(socket) : void 0;
		const preauthBudget = ingressSocket["__openclawPreauthBudget"] ?? params.preauthConnectionBudget;
		const preauthBudgetKey = ingressSocket["__openclawPreauthBudgetKey"];
		ingressSocket["__openclawPreauthBudgetClaimed"] = true;
		const addresses = resolveSocketAddress(socket);
		const pluginNodeCapabilities = connectionKind === "gateway" ? params.getPluginNodeCapabilities?.() ?? [] : [];
		const pluginSurfaceBaseUrl = pluginNodeCapabilities.length > 0 ? resolveHostedPluginSurfaceUrl({
			port: params.port,
			forwardedHost: upgradeReq.headers["x-forwarded-host"],
			requestHost: upgradeReq.headers.host,
			forwardedProto: upgradeReq.headers["x-forwarded-proto"],
			localAddress: upgradeReq.socket?.localAddress,
			scheme: params.pluginSurfaceScheme
		}) : void 0;
		attachGatewayConnection({
			...params,
			socket,
			connectionKind,
			request: upgradeReq,
			ingressAttribution: readPreparedGatewayIngressAttribution(upgradeReq),
			releasePreauth: () => preauthBudget.release(preauthBudgetKey),
			addresses,
			pluginNodeCapabilities,
			pluginSurfaceBaseUrl,
			originCheckMetrics,
			prepareAuthenticatedReceive: (role) => prepareGatewayReceiverHandoff(socket, role),
			onAuthenticated: (client, onHeartbeatTimeout) => {
				client.webSocket = socket;
				return startWebSocketKeepalive(socket, onHeartbeatTimeout, upgradeReq.socket);
			},
			attachTransport: (lifecycle) => {
				socket.once("error", (err) => {
					const client = lifecycle.getClient();
					if (isWsPayloadLimitError(err)) logRejectedLargePayload({
						surface: client ? "gateway.ws.frame" : "gateway.ws.preauth",
						limitBytes: connectionKind === "worker" ? WORKER_PROTOCOL_MAX_PAYLOAD_BYTES : client ? MAX_PAYLOAD_BYTES : MAX_PREAUTH_PAYLOAD_BYTES,
						reason: client ? "ws_frame_limit" : "preauth_frame_limit"
					});
					params.logWsControl.warn(`error conn=${lifecycle.connId} remote=${addresses.remoteAddr ?? "?"}: ${formatErrorMessage(err)}`);
					if (connectionKind === "worker") lifecycle.close(1008, client ? "invalid-frame" : "invalid-handshake");
					else lifecycle.close();
				});
				socket.on("pong", () => {
					const client = lifecycle.getClient();
					if (client?.presenceKey) touchPresence(client.presenceKey);
				});
				if (connectionKind === "worker") return attachWorkerWsMessageHandler({
					...lifecycle,
					socket,
					service: params.workerConnectionService,
					publicAdmission: publicWorkerIngress
				});
			}
		});
	});
}
//#endregion
export { attachGatewayWsConnectionHandler };
