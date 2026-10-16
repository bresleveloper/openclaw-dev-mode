import { d as toStringifiedError, f as toStructuredErrorObject, u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as signalProcessTree } from "./kill-tree-ecObdMeW.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { d as sleepWithAbort, n as computeBackoff, o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import "./errors-O33D01XW.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { i as routeLogsToStderr, t as enableConsoleCapture } from "./console-BnFs8ZzT.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import "./backoff-BrzXG7iD.mjs";
import { n as DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS } from "./timeouts-Th9Axx4o.mjs";
import { i as bindInheritedProcessLineageFds, r as bindInheritedNativeProcessOwner } from "./child-DBWCsvzX.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { m as WorkerProtocolCloseReasonSchema, s as WORKER_PROTOCOL_MAX_PAYLOAD_BYTES } from "./worker-protocol-primitives-BajTgPT4.mjs";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, f as WorkerInferenceStartResponseFrameSchema, g as validateWorkerInferenceTerminalFrame, m as validateWorkerInferenceEventFrame, s as WorkerInferenceCancelResponseFrameSchema } from "./worker-inference-B7U4TRc2.mjs";
import { C as WorkerHeartbeatResponseFrameSchema, Ct as isWorkerGatewayToolFrameWithinBudget, Et as validateWorkerGatewayToolUpdateFrame, F as WorkerTranscriptCommitResponseFrameSchema, O as WorkerLiveEventResponseFrameSchema, gt as WorkerGatewayToolCancelResponseFrameSchema, mt as WORKER_GATEWAY_TOOL_METHODS, ut as WorkerComputerResponseFrameSchema, y as WorkerAdmissionResponseFrameSchema, yt as WorkerGatewayToolResponseFrameSchema } from "./worker-admission-CNeLWzVQ.mjs";
import "./version-CwNT1gaY.mjs";
import { t as rawDataToString } from "./websocket-data-2vBvd4uX.mjs";
import { t as GatewayWebSocketTlsPinError } from "./websocket-transport-D1HAAgy3.mjs";
import { t as WebSocket$2 } from "./websocket-CGHaToS5.mjs";
import { s as getActiveBackgroundExecSessionCount, x as waitForExecScope } from "./bash-process-registry-BsL_e5bm.mjs";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.mjs";
import { t as getProcessSupervisor } from "./supervisor-j9Amjrh_.mjs";
import { t as createPendingRequestRegistry } from "./pending-request-registry-6Top3fRe.mjs";
import { r as hasExactOwnKeys } from "./protocol-record-CQCXx-YV.mjs";
import { i as parseWorkerLaunchDescriptor, l as resolveWorkerConnectionTarget, s as WorkerConnectionEndpointError, t as buildWorkerConnectParams } from "./launch-descriptor-BQV4k-tD.mjs";
import { t as isWorkerTranscriptFrameWithinBudget } from "./worker-transcript-budget-BUogL5P6.mjs";
import { n as isWorkerTranscriptMessageFrameSafe } from "./transcript-message-Dz1c-AeG.mjs";
import { t as NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE } from "./node-supervisor-protocol-dVsS52lI.mjs";
import { c as WorkerAdmissionDeadlineExceededError, d as WorkerConnectionStoppedError, f as WorkerFencedError, g as resolvePositiveTimeout, i as parseWorkerProcessRequest, l as WorkerAdmissionError, m as isFencedCloseReason, p as formatWorkerConnectionFailure, s as WORKER_ADMISSION_DEADLINE_MS, u as WorkerConnectionInterruptedError } from "./worker-process-protocol-B79uIRyP.mjs";
import { t as createBoundedLineFramer } from "./bounded-line-framer-Dd-qKZ_0.mjs";
import path from "node:path";
import { chmod, mkdtemp, realpath, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import pLimit from "p-limit";
import { WebSocket } from "ws";
//#region src/worker/worker-connection-frames.ts
const WORKER_REQUEST_SPECS = {
	"gateway-tool": {
		method: WORKER_GATEWAY_TOOL_METHODS.invoke,
		validateResponse: /* @__PURE__ */ lazyCompile(WorkerGatewayToolResponseFrameSchema)
	},
	"gateway-tool-cancel": {
		method: WORKER_GATEWAY_TOOL_METHODS.cancel,
		validateResponse: /* @__PURE__ */ lazyCompile(WorkerGatewayToolCancelResponseFrameSchema)
	},
	heartbeat: {
		method: "worker.heartbeat",
		validateResponse: /* @__PURE__ */ lazyCompile(WorkerHeartbeatResponseFrameSchema)
	},
	transcript: {
		method: "worker.transcript.commit",
		validateResponse: /* @__PURE__ */ lazyCompile(WorkerTranscriptCommitResponseFrameSchema)
	},
	"live-event": {
		method: "worker.live-event",
		validateResponse: /* @__PURE__ */ lazyCompile(WorkerLiveEventResponseFrameSchema)
	},
	computer: {
		method: "worker.computer",
		validateResponse: /* @__PURE__ */ lazyCompile(WorkerComputerResponseFrameSchema)
	},
	"inference-start": {
		method: "worker.inference.start",
		validateResponse: /* @__PURE__ */ lazyCompile(WorkerInferenceStartResponseFrameSchema)
	},
	"inference-cancel": {
		method: "worker.inference.cancel",
		validateResponse: /* @__PURE__ */ lazyCompile(WorkerInferenceCancelResponseFrameSchema)
	}
};
function closeInvalidWorkerFrame(socket) {
	if (socket.readyState === WebSocket.OPEN) socket.close(1008, "invalid-frame");
}
var WorkerConnectionFrameDispatcher = class {
	constructor(options) {
		this.options = options;
		this.pending = createPendingRequestRegistry();
		this.gatewayToolUpdateListeners = /* @__PURE__ */ new Set();
		this.inferenceEventListeners = /* @__PURE__ */ new Set();
		this.inferenceTerminalListeners = /* @__PURE__ */ new Set();
	}
	onGatewayToolUpdate(listener) {
		return registerListener(this.gatewayToolUpdateListeners, listener);
	}
	onInferenceEvent(listener) {
		return registerListener(this.inferenceEventListeners, listener);
	}
	onInferenceTerminal(listener) {
		return registerListener(this.inferenceTerminalListeners, listener);
	}
	dispatchReadyFrame(frame, socket) {
		if (isRecord(frame)) {
			if (frame.type === "res" && typeof frame.id === "string") {
				const pending = this.pending.get(frame.id);
				if (pending && this.resolvePendingFrame(frame.id, pending, frame)) return;
			} else if (frame.type === "event") switch (frame.event) {
				case "worker.gatewayTool.update":
					if (validateWorkerGatewayToolUpdateFrame(frame) && isWorkerGatewayToolFrameWithinBudget(frame, frame.payload.result)) {
						notifyListeners(this.gatewayToolUpdateListeners, frame);
						return;
					}
					break;
				case "worker.inference.event":
					if (validateWorkerInferenceEventFrame(frame) && this.matchesInferenceIdentity(frame.payload)) {
						notifyListeners(this.inferenceEventListeners, frame);
						return;
					}
					break;
				case "worker.inference.terminal": if (validateWorkerInferenceTerminalFrame(frame) && this.matchesInferenceIdentity(frame.payload)) {
					notifyListeners(this.inferenceTerminalListeners, frame);
					return;
				}
			}
		}
		closeInvalidWorkerFrame(socket);
	}
	rejectPending(error) {
		this.pending.rejectAll(error);
	}
	matchesInferenceIdentity(payload) {
		const admission = this.options.connectParams().admission;
		return payload.runEpoch === admission.ownerEpoch && payload.sessionId === admission.sessionId;
	}
	request(kind, params, beforeResolve, timeoutMs) {
		const id = randomUUID();
		const frame = {
			type: "req",
			id,
			method: WORKER_REQUEST_SPECS[kind].method,
			params
		};
		if (kind === "transcript" && !isWorkerTranscriptFrameWithinBudget({
			type: "req",
			id,
			method: "worker.transcript.commit",
			params
		})) return Promise.reject(/* @__PURE__ */ new Error("worker transcript exceeds the protocol payload limit"));
		const ready = this.options.isReady();
		const readySocket = ready ? this.options.socket() : void 0;
		if (!ready || !readySocket || readySocket.readyState !== WebSocket.OPEN) return Promise.reject(this.options.isTerminal() ? this.options.terminalError() : new WorkerConnectionInterruptedError("worker connection is not ready"));
		let encoded;
		try {
			encoded = JSON.stringify(frame);
		} catch (error) {
			return Promise.reject(toStructuredErrorObject(error));
		}
		const payloadLimit = kind === "inference-start" || kind === "transcript" ? WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES : WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
		if (Buffer.byteLength(encoded, "utf8") > payloadLimit) return Promise.reject(/* @__PURE__ */ new Error("worker request exceeds the protocol payload limit"));
		const pending = this.pending.add(id, {
			value: {
				kind,
				beforeResolve: beforeResolve ? (response) => beforeResolve(response) : void 0
			},
			timeoutMs: timeoutMs ?? this.options.requestTimeoutMs,
			timeoutError: () => new WorkerConnectionInterruptedError(`worker ${kind} response timed out`),
			onTimeout: () => this.options.interruptReadySocket(readySocket)
		});
		if (!pending) return Promise.reject(/* @__PURE__ */ new Error("worker request id collision"));
		try {
			readySocket.send(encoded, (error) => {
				if (!error) return;
				const failed = this.pending.take(id, pending);
				if (!failed) return;
				failed.reject(new WorkerConnectionInterruptedError(error.message));
				this.options.interruptReadySocket(readySocket);
			});
		} catch (error) {
			this.pending.take(id, pending)?.reject(new WorkerConnectionInterruptedError(toStructuredErrorObject(error).message));
			this.options.interruptReadySocket(readySocket);
		}
		return pending.promise;
	}
	resolvePendingFrame(id, pending, frame) {
		if (!WORKER_REQUEST_SPECS[pending.value.kind].validateResponse(frame)) return false;
		if ((pending.value.kind === "gateway-tool" || pending.value.kind === "gateway-tool-cancel") && !isWorkerGatewayToolFrameWithinBudget(frame, WORKER_REQUEST_SPECS["gateway-tool"].validateResponse(frame) && frame.ok ? frame.payload : void 0)) return false;
		const completed = this.pending.take(id, pending);
		if (!completed) return false;
		try {
			completed.value.beforeResolve?.(frame);
		} catch (error) {
			completed.reject(toStructuredErrorObject(error));
			return true;
		}
		completed.resolve(frame);
		return true;
	}
};
//#endregion
//#region src/worker/worker-connection-admission.ts
const validateAdmissionResponse = /* @__PURE__ */ lazyCompile(WorkerAdmissionResponseFrameSchema);
const validateCloseReason = /* @__PURE__ */ lazyCompile(WorkerProtocolCloseReasonSchema);
const RETRYABLE_CLOSE_REASONS = /* @__PURE__ */ new Set(["gateway-shutdown", "gateway-unavailable"]);
function parseFrame(data) {
	try {
		return {
			ok: true,
			frame: JSON.parse(rawDataToString(data))
		};
	} catch {
		return { ok: false };
	}
}
function parseCloseReason(data) {
	const reason = rawDataToString(data);
	return validateCloseReason(reason) ? reason : void 0;
}
function matchesAdmission(connectParams, hello) {
	const expected = connectParams.admission;
	return hello.environmentId === expected.environmentId && hello.sessionId === expected.sessionId && hello.ownerEpoch === expected.ownerEpoch && hello.rpcSetVersion === expected.rpcSetVersion && hello.protocolFeatures.length === expected.handshake.protocolFeatures.length && hello.protocolFeatures.every((feature) => expected.handshake.protocolFeatures.includes(feature));
}
function isRetryableWorkerCloseReason(reason) {
	return RETRYABLE_CLOSE_REASONS.has(reason);
}
function connectWorkerConnectionAttempt(options) {
	const connectionOptions = options.connectionOptions;
	const target = resolveWorkerConnectionTarget(connectionOptions.endpoint);
	const socketOptions = {
		...target.options,
		maxPayload: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
	};
	const socket = connectionOptions.createSocket ? connectionOptions.createSocket(target.url, socketOptions) : new WebSocket$2(target.url, socketOptions);
	options.onSocket(socket);
	const admissionId = randomUUID();
	let admission = "pending";
	let opened = false;
	const isActive = () => options.isCurrentGeneration() && !options.isTerminal() && admission !== "rejected" && socket.readyState === WebSocket$2.OPEN;
	return new Promise((resolve, reject) => {
		let attemptTimeout;
		const rejectAttempt = (error) => {
			if (admission !== "pending") return;
			admission = "rejected";
			if (attemptTimeout) {
				clearTimeout(attemptTimeout);
				attemptTimeout = void 0;
			}
			reject(error);
		};
		attemptTimeout = setTimeout(() => {
			rejectAttempt(new WorkerConnectionInterruptedError(opened ? "no hello within deadline" : "connect failed: opening handshake timed out"));
			socket.terminate();
		}, options.attemptTimeoutMs);
		attemptTimeout.unref?.();
		socket.on("error", (error) => {
			if (admission === "pending") {
				const kind = opened ? "admission interrupted" : "connect failed";
				rejectAttempt(error instanceof GatewayWebSocketTlsPinError ? new WorkerConnectionEndpointError(error.message) : new WorkerConnectionInterruptedError(`${kind}: ${toStructuredErrorObject(error).message}`));
			}
		});
		socket.on("open", () => {
			if (!isActive()) {
				socket.close();
				return;
			}
			options.onAdmitting();
			opened = true;
			const frame = {
				type: "req",
				id: admissionId,
				method: "connect",
				params: {
					...connectionOptions.connectParams,
					minProtocol: 4,
					maxProtocol: 4
				}
			};
			socket.send(JSON.stringify(frame), (error) => {
				if (error) {
					rejectAttempt(new WorkerConnectionInterruptedError(`admission send failed: ${error.message}`));
					socket.terminate();
				}
			});
		});
		socket.on("message", (data) => {
			if (!isActive()) return;
			const parsed = parseFrame(data);
			if (!parsed.ok) {
				closeInvalidWorkerFrame(socket);
				return;
			}
			const frame = parsed.frame;
			if (admission === "pending") {
				if (!validateAdmissionResponse(frame) || frame.id !== admissionId) {
					closeInvalidWorkerFrame(socket);
					rejectAttempt(new WorkerAdmissionError("invalid-handshake", false));
					return;
				}
				if (!frame.ok) {
					const reason = frame.error.details.reason;
					rejectAttempt(new WorkerAdmissionError(reason, frame.error.retryable === true && isRetryableWorkerCloseReason(reason)));
					socket.terminate();
					return;
				}
				if (!matchesAdmission(connectionOptions.connectParams, frame.payload)) {
					closeInvalidWorkerFrame(socket);
					rejectAttempt(new WorkerAdmissionError("invalid-handshake", false));
					return;
				}
				admission = "accepted";
				if (attemptTimeout) {
					clearTimeout(attemptTimeout);
					attemptTimeout = void 0;
				}
				options.onReady(frame.payload);
				resolve(frame.payload);
				return;
			}
			options.onReadyFrame(frame, socket);
		});
		socket.on("close", (code, reason) => {
			if (!options.isCurrentGeneration()) return;
			options.onSocketClosed();
			const closeReason = parseCloseReason(reason);
			if (admission !== "accepted") {
				rejectAttempt(closeReason ? new WorkerAdmissionError(closeReason, isRetryableWorkerCloseReason(closeReason)) : new WorkerConnectionInterruptedError(`${opened ? "admission interrupted" : "connect failed"}: socket closed (${code}) before hello`));
				return;
			}
			options.onReadyClose(closeReason);
		});
	});
}
//#endregion
//#region src/worker/worker-connection.ts
const DEFAULT_RECONNECT_BACKOFF = {
	initialMs: 250,
	maxMs: 3e4,
	factor: 2,
	jitter: .1
};
const DEFAULT_ADMISSION_TIMEOUT_MS = DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;
const DEFAULT_REQUEST_TIMEOUT_MS = 3e4;
var WorkerConnection = class {
	constructor(options) {
		this.options = options;
		this.stateValue = { kind: "idle" };
		this.readyWaiters = /* @__PURE__ */ new Set();
		this.readyListeners = /* @__PURE__ */ new Set();
		this.stateListeners = /* @__PURE__ */ new Set();
		this.gatewayToolSlots = pLimit(4);
		this.reconnectAbort = new AbortController();
		this.exit = createDeferredCore();
		this.generation = 0;
		this.admissionTimeoutMs = resolvePositiveTimeout(options.admissionTimeoutMs, DEFAULT_ADMISSION_TIMEOUT_MS);
		this.admissionDeadlineMs = resolvePositiveTimeout(options.admissionDeadlineMs, WORKER_ADMISSION_DEADLINE_MS);
		this.requestTimeoutMs = resolvePositiveTimeout(options.requestTimeoutMs, DEFAULT_REQUEST_TIMEOUT_MS);
		this.frames = new WorkerConnectionFrameDispatcher({
			connectParams: () => this.options.connectParams,
			requestTimeoutMs: this.requestTimeoutMs,
			isReady: () => this.stateValue.kind === "ready",
			socket: () => this.socket,
			isTerminal: () => this.isTerminal(),
			terminalError: () => this.terminalError(),
			interruptReadySocket: (socket) => this.interruptReadySocket(socket)
		});
		this.rpc = this.frames;
	}
	get state() {
		return this.stateValue;
	}
	start() {
		if (this.stateValue.kind === "ready") return Promise.resolve(this.stateValue.hello);
		if (this.isTerminal()) return Promise.reject(this.terminalError());
		if (this.startPromise) return this.startPromise;
		this.startPromise = this.connectUntilReady();
		return this.startPromise;
	}
	waitForExit() {
		return this.exit.promise;
	}
	waitForReady() {
		if (this.stateValue.kind === "ready" && this.socket?.readyState === WebSocket.OPEN) return Promise.resolve(this.stateValue.hello);
		if (this.isTerminal()) return Promise.reject(this.terminalError());
		return new Promise((resolve, reject) => {
			this.readyWaiters.add({
				resolve,
				reject
			});
		});
	}
	onReady(listener) {
		return registerListener(this.readyListeners, listener);
	}
	onStateChange(listener) {
		return registerListener(this.stateListeners, listener);
	}
	onTerminalError(listener) {
		return this.onStateChange((state) => {
			if (this.isTerminal(state)) listener(this.terminalError(state));
		});
	}
	async stop() {
		this.finishTerminal({ kind: "stopped" });
	}
	fence(reason) {
		this.finishTerminal({
			kind: "fenced",
			reason
		});
	}
	async invokeGatewayTool(params, options = {}) {
		let sequence = 0;
		const remove = this.frames.onGatewayToolUpdate(({ payload }) => {
			if (payload.generation === params.generation && payload.toolCallId === params.toolCallId && payload.seq > sequence) {
				sequence = payload.seq;
				options.onUpdate?.(payload.result);
			}
		});
		const request = () => this.gatewayToolSlots(() => {
			options.signal?.throwIfAborted();
			return this.frames.request("gateway-tool", params, void 0, Math.max(this.requestTimeoutMs, options.timeoutMs ?? 0));
		});
		try {
			return await (options.replay ? this.requestReplayableOperation(request, options.signal) : racePromiseWithAbortSignal(request(), options.signal));
		} finally {
			remove();
		}
	}
	cancelGatewayTool(params) {
		return this.requestReplayableOperation(() => this.frames.request("gateway-tool-cancel", params));
	}
	requestComputer(params) {
		return this.frames.request("computer", params, void 0, params.timeoutMs);
	}
	async requestReplayableOperation(request, signal) {
		for (;;) {
			signal?.throwIfAborted();
			try {
				return await racePromiseWithAbortSignal(request(), signal);
			} catch (error) {
				signal?.throwIfAborted();
				if (!(error instanceof WorkerConnectionInterruptedError) || this.isTerminal()) throw error;
				await racePromiseWithAbortSignal(this.waitForReady(), signal);
			}
		}
	}
	async connectUntilReady() {
		const startedAt = Date.now();
		let attempt = 0;
		let lastFailure;
		while (!this.isTerminal()) {
			let remainingMs = this.admissionDeadlineMs - (Date.now() - startedAt);
			if (remainingMs <= 0) throw this.failAdmissionDeadline(attempt, lastFailure);
			if (attempt > 0) {
				this.transition({
					kind: "reconnecting",
					attempt
				});
				try {
					await sleepWithAbort(Math.min(computeBackoff(this.options.reconnectBackoff ?? DEFAULT_RECONNECT_BACKOFF, attempt), remainingMs), this.reconnectAbort.signal);
				} catch (error) {
					throw this.isTerminal() ? this.terminalError() : toStructuredErrorObject(error);
				}
				remainingMs = this.admissionDeadlineMs - (Date.now() - startedAt);
				if (remainingMs <= 0) throw this.failAdmissionDeadline(attempt, lastFailure);
			}
			try {
				const hello = await this.connectOnce(attempt, Math.min(this.admissionTimeoutMs, remainingMs));
				this.reportConnectionFailure(void 0);
				if (this.isTerminal()) throw this.terminalError();
				return hello;
			} catch (error) {
				if (this.isTerminal()) throw this.terminalError();
				lastFailure = toStructuredErrorObject(error);
				this.reportConnectionFailure(new Error(formatWorkerConnectionFailure(this.options, lastFailure)));
				if (error instanceof WorkerAdmissionError) {
					if (error.retryable) {
						attempt += 1;
						continue;
					}
					this.handleAdmissionFailure(error);
					throw error;
				}
				if (error instanceof WorkerConnectionEndpointError) {
					this.finishTerminal({
						kind: "failed",
						error
					});
					throw error;
				}
				attempt += 1;
			}
		}
		throw this.terminalError();
	}
	connectOnce(attempt, attemptTimeoutMs) {
		const generation = ++this.generation;
		this.transition({
			kind: "connecting",
			attempt
		});
		return connectWorkerConnectionAttempt({
			attemptTimeoutMs,
			connectionOptions: this.options,
			isCurrentGeneration: () => generation === this.generation,
			isTerminal: () => this.isTerminal(),
			onSocket: (socket) => {
				this.socket = socket;
			},
			onAdmitting: () => {
				this.transition({
					kind: "admitting",
					attempt
				});
			},
			onReady: (hello) => {
				this.startHeartbeat(hello.policy.heartbeatIntervalMs);
				this.transition({
					kind: "ready",
					hello
				});
				this.notifyReady(hello);
			},
			onReadyFrame: (frame, socket) => {
				this.frames.dispatchReadyFrame(frame, socket);
			},
			onSocketClosed: () => {
				this.stopHeartbeat();
				this.socket = void 0;
				const interrupted = new WorkerConnectionInterruptedError();
				this.frames.rejectPending(interrupted);
			},
			onReadyClose: (reason) => this.handleReadyClose(reason)
		});
	}
	handleReadyClose(reason) {
		if (this.isTerminal()) return;
		if (reason && isFencedCloseReason(reason)) {
			this.finishTerminal({
				kind: "fenced",
				reason
			});
			return;
		}
		if (reason && !isRetryableWorkerCloseReason(reason)) {
			this.finishTerminal({
				kind: "failed",
				error: new WorkerAdmissionError(reason, false)
			});
			return;
		}
		if (!this.reconnectPromise) this.reconnectPromise = this.reconnectAfterClose();
	}
	async reconnectAfterClose() {
		try {
			await this.connectUntilReady();
		} catch (error) {
			if (!this.isTerminal()) this.finishTerminal({
				kind: "failed",
				error: toStructuredErrorObject(error)
			});
		} finally {
			this.reconnectPromise = void 0;
		}
	}
	handleAdmissionFailure(error) {
		if (isFencedCloseReason(error.reason)) {
			this.finishTerminal({
				kind: "fenced",
				reason: error.reason
			});
			return;
		}
		this.finishTerminal({
			kind: "failed",
			error
		});
	}
	startHeartbeat(intervalMs) {
		this.stopHeartbeat();
		this.heartbeatTimer = setTimeout(() => {
			this.heartbeatTimer = void 0;
			this.sendHeartbeat();
		}, intervalMs);
		this.heartbeatTimer.unref?.();
	}
	async sendHeartbeat() {
		if (this.stateValue.kind !== "ready") return;
		const intervalMs = this.stateValue.hello.policy.heartbeatIntervalMs;
		try {
			const response = await this.frames.request("heartbeat", {
				sentAtMs: Date.now(),
				status: this.options.heartbeatStatus?.() ?? "ready"
			});
			if (response.ok) {
				if (response.payload.ownerEpoch !== this.options.connectParams.admission.ownerEpoch) this.finishTerminal({
					kind: "fenced",
					reason: "owner-epoch-mismatch"
				});
			} else if (isFencedCloseReason(response.error.details.reason)) {
				this.finishTerminal({
					kind: "fenced",
					reason: response.error.details.reason
				});
				return;
			} else {
				this.finishTerminal({
					kind: "failed",
					error: /* @__PURE__ */ new Error(`worker heartbeat rejected: ${response.error.details.reason}`)
				});
				return;
			}
		} catch (error) {
			if (!(error instanceof WorkerConnectionInterruptedError) && !this.isTerminal()) {
				this.finishTerminal({
					kind: "failed",
					error: toStructuredErrorObject(error)
				});
				return;
			}
		}
		if (this.stateValue.kind === "ready") this.startHeartbeat(intervalMs);
	}
	stopHeartbeat() {
		if (this.heartbeatTimer) {
			clearTimeout(this.heartbeatTimer);
			this.heartbeatTimer = void 0;
		}
	}
	interruptReadySocket(socket) {
		if (this.socket === socket && this.stateValue.kind === "ready") this.transition({
			kind: "reconnecting",
			attempt: 0
		});
		socket.terminate();
	}
	notifyReady(hello) {
		const waiters = [...this.readyWaiters];
		this.readyWaiters.clear();
		for (const waiter of waiters) waiter.resolve(hello);
		notifyListeners(this.readyListeners, hello);
	}
	transition(state) {
		this.stateValue = state;
		notifyListeners(this.stateListeners, state);
	}
	reportConnectionFailure(error) {
		try {
			this.options.onConnectionFailure?.(error);
		} catch {}
	}
	finishTerminal(state) {
		if (this.stateValue.kind === "stopped" || state.kind !== "stopped" && this.isTerminal()) return;
		const error = this.terminalError(state);
		const socket = this.socket;
		this.socket = void 0;
		this.exit.resolve(state);
		this.transition(state);
		this.readyListeners.clear();
		this.reconnectAbort.abort(error);
		this.stopHeartbeat();
		this.frames.rejectPending(error);
		this.rejectReadyWaiters(error);
		const code = state.kind === "stopped" ? 1e3 : 1008;
		const reason = state.kind === "fenced" ? state.reason : state.kind === "stopped" ? "worker stopped" : "invalid-frame";
		socket?.close(code, reason);
	}
	rejectReadyWaiters(error) {
		const waiters = [...this.readyWaiters];
		this.readyWaiters.clear();
		for (const waiter of waiters) waiter.reject(error);
	}
	failAdmissionDeadline(attempts, lastFailure) {
		if (this.isTerminal()) return this.terminalError();
		const error = new WorkerAdmissionDeadlineExceededError(formatWorkerConnectionFailure(this.options, lastFailure ?? "no connection attempt completed", attempts));
		this.reportConnectionFailure(error);
		this.finishTerminal({
			kind: "failed",
			error
		});
		return error;
	}
	isTerminal(state = this.stateValue) {
		return state.kind === "failed" || state.kind === "fenced" || state.kind === "stopped";
	}
	terminalError(state = this.stateValue) {
		if (state.kind === "failed") return state.error;
		if (state.kind === "fenced") return new WorkerFencedError(state.reason);
		if (state.kind === "stopped") return new WorkerConnectionStoppedError();
		return new WorkerConnectionInterruptedError("worker connection terminated");
	}
};
function createWorkerConnection(options) {
	return new WorkerConnection(options);
}
//#endregion
//#region src/worker/worker-rpc-client-shared.ts
function fenceForOwnershipError(connection, response) {
	const reason = response.details.reason;
	if (reason === "epoch-mismatch" || reason === "owner-epoch-mismatch") connection.fence("owner-epoch-mismatch");
	else if (reason === "credential-replaced") connection.fence("credential-replaced");
}
function isTerminalConnection(connection) {
	return connection.state.kind === "fenced" || connection.state.kind === "failed" || connection.state.kind === "stopped";
}
//#endregion
//#region src/worker/worker-rpc-inference-client.ts
var WorkerInferenceProxyError = class extends Error {
	constructor(response) {
		super(response.message);
		this.response = response;
		this.name = "WorkerInferenceProxyError";
	}
	get reason() {
		return this.response.details.reason;
	}
};
function inferenceKey(params) {
	return `${params.sessionId}\u0000${params.runId}\u0000${params.turnId}`;
}
function matchesInferenceIdentity(operation, payload) {
	return payload.runEpoch === operation.params.runEpoch && payload.sessionId === operation.params.sessionId && payload.runId === operation.params.runId && payload.turnId === operation.params.turnId;
}
var WorkerInferenceProxyClient = class {
	constructor(connection) {
		this.connection = connection;
		this.operations = /* @__PURE__ */ new Map();
		this.disposed = false;
		this.unsubscribers = [
			connection.onReady(() => this.resume()),
			connection.onTerminalError((error) => this.rejectAllOperations(error)),
			connection.rpc.onInferenceEvent((frame) => this.handlePayload(frame.payload)),
			connection.rpc.onInferenceTerminal((frame) => this.handlePayload(frame.payload))
		];
	}
	start(params, handlers = {}) {
		if (this.disposed) return Promise.reject(/* @__PURE__ */ new Error("worker inference client disposed"));
		const snapshot = structuredClone(params);
		const key = inferenceKey(snapshot);
		if (this.operations.has(key)) return Promise.reject(/* @__PURE__ */ new Error("worker inference turn already active"));
		return new Promise((resolve, reject) => {
			const operation = {
				params: snapshot,
				handlers,
				lastSeq: 0,
				resumeRequested: false,
				startInFlight: false,
				settled: false,
				resolve,
				reject
			};
			this.operations.set(key, operation);
			this.scheduleStart(operation);
		});
	}
	async cancel(params) {
		const response = await this.connection.rpc.request("inference-cancel", params);
		if (response.ok) return response.payload;
		fenceForOwnershipError(this.connection, response.error);
		throw new WorkerInferenceProxyError(response.error);
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		for (const unsubscribe of this.unsubscribers) unsubscribe();
		for (const operation of this.operations.values()) this.rejectOperation(operation, /* @__PURE__ */ new Error("worker inference client disposed"));
	}
	resume() {
		for (const operation of this.operations.values()) {
			if (operation.startInFlight) {
				operation.resumeRequested = true;
				continue;
			}
			this.scheduleStart(operation);
		}
	}
	scheduleStart(operation) {
		if (operation.startInFlight || operation.settled || this.disposed) return;
		operation.startInFlight = true;
		this.issueStart(operation);
	}
	async issueStart(operation) {
		let interrupted = false;
		try {
			await this.connection.waitForReady();
			const response = await this.connection.rpc.request("inference-start", operation.params, (frame) => {
				if (frame.ok && frame.payload.status === "replayed") operation.lastSeq = 0;
			});
			if (!response.ok) {
				fenceForOwnershipError(this.connection, response.error);
				this.rejectOperation(operation, new WorkerInferenceProxyError(response.error));
				return;
			}
			operation.resumeRequested = false;
		} catch (error) {
			if (error instanceof WorkerConnectionInterruptedError) interrupted = true;
			else this.rejectOperation(operation, toStringifiedError(error));
		} finally {
			operation.startInFlight = false;
			if (interrupted && operation.resumeRequested && !operation.settled) {
				operation.resumeRequested = false;
				this.scheduleStart(operation);
			}
		}
	}
	handlePayload(payload) {
		const operation = this.operations.get(inferenceKey(payload));
		if (!operation || operation.settled || !matchesInferenceIdentity(operation, payload) || payload.seq <= operation.lastSeq) return;
		try {
			if (payload.seq !== operation.lastSeq + 1) operation.handlers.onStreamGap?.({
				expectedSeq: operation.lastSeq + 1,
				receivedSeq: payload.seq
			});
			operation.lastSeq = payload.seq;
			if ("event" in payload) operation.handlers.onEvent?.(payload);
			else {
				operation.settled = true;
				this.operations.delete(inferenceKey(operation.params));
				operation.resolve(payload.outcome);
			}
		} catch (error) {
			this.rejectOperation(operation, toStringifiedError(error));
		}
	}
	rejectOperation(operation, error) {
		if (operation.settled) return;
		operation.settled = true;
		this.operations.delete(inferenceKey(operation.params));
		operation.reject(error);
	}
	rejectAllOperations(error) {
		for (const operation of this.operations.values()) this.rejectOperation(operation, error);
	}
};
//#endregion
//#region src/worker/worker-rpc-live-event-client.ts
const MAX_IN_FLIGHT = 8;
var WorkerLiveEventClient = class {
	constructor(connection, options) {
		this.connection = connection;
		this.options = options;
		this.buffered = [];
		this.inFlight = /* @__PURE__ */ new Set();
		this.replayGeneration = 0;
		this.previewDegraded = false;
		this.disposed = false;
		this.ackedSeqValue = options.initialAckedSeq ?? 0;
		this.nextSeqValue = this.ackedSeqValue + 1;
		this.maxSentSeqValue = this.ackedSeqValue;
		this.unsubscribers = [connection.onReady(() => this.pump()), connection.onTerminalError((error) => this.rejectAll(error))];
	}
	enqueuePreview(runId, event) {
		if (this.disposed || this.previewDegraded || isTerminalConnection(this.connection)) return false;
		if (this.buffered.length >= (this.options.maxBufferedEvents ?? 1024)) {
			this.degradePreviews();
			return false;
		}
		try {
			this.buffered.push({
				seq: this.nextSeqValue,
				runId,
				event: structuredClone(event)
			});
		} catch {
			this.degradePreviews();
			return false;
		}
		this.nextSeqValue += 1;
		this.pump();
		return true;
	}
	emitTerminal(runId, event) {
		if (this.disposed) return Promise.reject(/* @__PURE__ */ new Error("worker live-event client disposed"));
		const completion = createDeferredCore();
		const terminalResyncFromSeq = this.terminalResyncFromSeq;
		if (terminalResyncFromSeq !== void 0) this.terminalResyncFromSeq = void 0;
		this.buffered.push({
			seq: this.nextSeqValue,
			runId,
			event: structuredClone(event),
			...terminalResyncFromSeq === void 0 ? {} : { resyncFromSeq: terminalResyncFromSeq },
			completion
		});
		this.nextSeqValue += 1;
		this.pump();
		return completion.promise;
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		for (const unsubscribe of this.unsubscribers) unsubscribe();
		this.rejectAll(/* @__PURE__ */ new Error("worker live-event client disposed"));
	}
	pump() {
		if (this.disposed || this.buffered.length === 0) return;
		for (const entry of this.buffered) {
			if (this.inFlight.size >= MAX_IN_FLIGHT) break;
			if (this.inFlight.has(entry)) continue;
			if (entry.blockedAck === this.ackedSeqValue) continue;
			this.inFlight.add(entry);
			this.send(entry);
		}
		if (this.inFlight.size === 0 && this.buffered[0]?.blockedAck === this.ackedSeqValue) {
			const head = this.buffered[0];
			this.handleFailure(head, /* @__PURE__ */ new Error(`worker live-event acknowledgement did not advance (seq=${head.seq} runId=${head.runId} ackedSeq=${this.ackedSeqValue} buffered=${this.buffered.length} runEpoch=${this.options.runEpoch})`));
			this.pump();
		}
	}
	async send(entry) {
		const generation = this.replayGeneration;
		const sentSeq = entry.seq;
		this.maxSentSeqValue = Math.max(this.maxSentSeqValue, sentSeq);
		try {
			await this.connection.waitForReady();
			if (generation !== this.replayGeneration || !this.buffered.includes(entry)) return;
			const response = await this.connection.rpc.request("live-event", {
				runEpoch: this.options.runEpoch,
				lastAckedSeq: entry.resyncFromSeq ?? this.ackedSeqValue,
				seq: sentSeq,
				runId: entry.runId,
				event: entry.event
			});
			if (generation !== this.replayGeneration || !this.buffered.includes(entry)) return;
			if (response.ok) {
				if (response.payload.ackedSeq > this.maxSentSeqValue) throw new Error("worker live-event acknowledgement is outside sent range");
				if (response.payload.ackedSeq > this.ackedSeqValue) {
					this.lastResync = void 0;
					this.ackThrough(response.payload.ackedSeq);
				} else entry.blockedAck = response.payload.ackedSeq;
				return;
			}
			if (response.error.details.reason === "resync-required") {
				if (response.error.details.ackedSeq > this.maxSentSeqValue) throw new Error("worker live-event resync acknowledged an unsent event");
				const cursor = {
					ackedSeq: response.error.details.ackedSeq,
					expectedSeq: response.error.details.expectedSeq
				};
				if (this.lastResync?.ackedSeq === cursor.ackedSeq && this.lastResync.expectedSeq === cursor.expectedSeq) throw new Error("worker live-event resync did not advance");
				this.lastResync = cursor;
				this.resync(cursor.ackedSeq, cursor.expectedSeq);
				return;
			}
			fenceForOwnershipError(this.connection, response.error);
			throw new Error(`${response.error.message}: ${response.error.details.reason}`);
		} catch (error) {
			if (error instanceof WorkerConnectionInterruptedError && !isTerminalConnection(this.connection)) return;
			this.handleFailure(entry, toStringifiedError(error));
		} finally {
			this.inFlight.delete(entry);
			this.pump();
		}
	}
	ackThrough(ackedSeq) {
		this.ackedSeqValue = Math.max(this.ackedSeqValue, ackedSeq);
		const pendingIndex = this.buffered.findIndex((entry) => entry.seq > this.ackedSeqValue);
		const acknowledged = this.buffered.splice(0, pendingIndex < 0 ? this.buffered.length : pendingIndex);
		for (const entry of acknowledged) entry.completion?.resolve();
	}
	resync(ackedSeq, expectedSeq) {
		if (expectedSeq !== ackedSeq + 1) {
			this.rejectAll(/* @__PURE__ */ new Error("worker live-event resync cursor is inconsistent"));
			return;
		}
		this.replayGeneration += 1;
		if (ackedSeq >= this.ackedSeqValue) this.ackThrough(ackedSeq);
		else this.ackedSeqValue = ackedSeq;
		let seq = expectedSeq;
		for (const entry of this.buffered) {
			entry.seq = seq;
			delete entry.blockedAck;
			delete entry.resyncFromSeq;
			seq += 1;
		}
		this.nextSeqValue = seq;
		this.maxSentSeqValue = ackedSeq;
	}
	handleFailure(entry, error) {
		if (!entry.completion && !isTerminalConnection(this.connection)) this.degradePreviews();
		else this.rejectAll(error);
	}
	degradePreviews() {
		this.previewDegraded = true;
		this.replayGeneration += 1;
		this.lastResync = void 0;
		const resyncFromSeq = Math.max(this.terminalResyncFromSeq ?? 0, this.maxSentSeqValue);
		const terminal = this.buffered.find((entry) => entry.completion);
		this.buffered.length = 0;
		if (terminal) {
			delete terminal.blockedAck;
			terminal.resyncFromSeq = resyncFromSeq;
			this.buffered.push(terminal);
		}
		this.terminalResyncFromSeq = terminal ? void 0 : resyncFromSeq;
	}
	rejectAll(error) {
		const buffered = this.buffered.splice(0);
		for (const entry of buffered) entry.completion?.reject(error);
	}
};
//#endregion
//#region src/worker/worker-rpc-transcript-client.ts
const TRANSCRIPT_SIZE_FRAME_ID = "00000000-0000-4000-8000-000000000000";
var WorkerTranscriptCommitError = class extends Error {
	constructor(response, message = response.message) {
		super(message);
		this.response = response;
		this.name = "WorkerTranscriptCommitError";
	}
	get reason() {
		return this.response.details.reason;
	}
};
var WorkerTranscriptCommitClient = class {
	constructor(connection, options) {
		this.connection = connection;
		this.options = options;
		this.queue = Promise.resolve();
		this.baseLeafIdValue = options.baseLeafId;
		this.nextSeqValue = options.initialSeq ?? 1;
	}
	get baseLeafId() {
		return this.baseLeafIdValue;
	}
	get nextSeq() {
		return this.nextSeqValue;
	}
	commit(messages) {
		const snapshot = structuredClone(messages);
		const operation = this.queue.then(() => this.commitBatches(snapshot));
		this.queue = operation.then(() => void 0, () => void 0);
		return operation;
	}
	async commitBatches(messages) {
		if (messages.length === 0) throw new Error("worker transcript commit requires at least one message");
		const entryIds = [];
		let offset = 0;
		while (offset < messages.length) {
			const batch = this.takeFittingBatch(messages.slice(offset));
			const result = await this.commitBatch(batch);
			entryIds.push(...result.entryIds);
			offset += batch.length;
		}
		const newLeafId = this.baseLeafIdValue;
		if (newLeafId === null) throw new Error("worker transcript commit did not advance the base leaf");
		return {
			entryIds,
			newLeafId
		};
	}
	takeFittingBatch(messages) {
		let batch = [];
		for (const message of messages.slice(0, 64)) {
			if (!isWorkerTranscriptMessageFrameSafe(message)) throw new Error("worker transcript message exceeds the protocol payload limit");
			const candidate = [...batch, message];
			const frame = {
				type: "req",
				id: TRANSCRIPT_SIZE_FRAME_ID,
				method: "worker.transcript.commit",
				params: {
					runEpoch: this.options.runEpoch,
					seq: this.nextSeqValue,
					baseLeafId: this.baseLeafIdValue,
					messages: candidate
				}
			};
			if (!isWorkerTranscriptFrameWithinBudget(frame)) {
				if (batch.length === 0) throw new Error("worker transcript message exceeds the protocol payload limit");
				break;
			}
			batch = candidate;
		}
		return batch;
	}
	async commitBatch(messages) {
		if (this.terminalFailure) throw this.terminalFailure;
		const request = {
			runEpoch: this.options.runEpoch,
			seq: this.nextSeqValue,
			baseLeafId: this.baseLeafIdValue,
			messages: [...messages]
		};
		while (true) {
			await this.connection.waitForReady();
			try {
				const response = await this.connection.rpc.request("transcript", request);
				if (response.ok) {
					this.baseLeafIdValue = response.payload.newLeafId;
					this.nextSeqValue = request.seq + 1;
					return response.payload;
				}
				if (response.error.details.reason === "stale-base-leaf") {
					this.nextSeqValue = request.seq + 1;
					this.terminalFailure = new WorkerTranscriptCommitError(response.error, "Worker transcript base changed; uncommitted messages were not committed; relaunch required.");
					throw this.terminalFailure;
				}
				fenceForOwnershipError(this.connection, response.error);
				throw new WorkerTranscriptCommitError(response.error);
			} catch (error) {
				if (error instanceof WorkerConnectionInterruptedError && !isTerminalConnection(this.connection)) continue;
				throw error;
			}
		}
	}
};
//#endregion
//#region src/worker/worker.runtime.ts
const WORKER_REMOTE_CANCEL_GRACE_MS = 1e3;
function toWorkerRuntimeError(value, fallback) {
	return value instanceof Error ? value : new Error(fallback, { cause: value });
}
function fencedResult(state) {
	if (state.kind === "fenced") return {
		status: "fenced",
		reason: state.reason
	};
}
async function assertWorkerDirectory(pathname, label) {
	const resolved = await realpath(pathname);
	if (!(await stat(resolved)).isDirectory()) throw new Error(`worker ${label} path must be a directory`);
	return resolved;
}
/** Holds process-local state until every command owned by this environment has exited. */
async function createWorkerRuntimeEnvironment(sessionId) {
	const stateDir = await mkdtemp(path.join(tmpdir(), "openclaw-worker-"));
	await chmod(stateDir, 448);
	const previousStateDir = process.env.OPENCLAW_STATE_DIR;
	const previousConfigPath = process.env.OPENCLAW_CONFIG_PATH;
	const scopeKey = `worker:${sessionId}`;
	const cleanupScope = getProcessSupervisor().acquireScopeCleanup(scopeKey, { processTree: "transport-only" });
	process.env.OPENCLAW_STATE_DIR = stateDir;
	process.env.OPENCLAW_CONFIG_PATH = path.join(stateDir, "openclaw.json");
	let closing;
	return {
		stateDir,
		close: () => closing ??= (async () => {
			const failed = (await Promise.allSettled([cleanupScope(), waitForExecScope(scopeKey)])).find((result) => result.status === "rejected");
			if (failed?.status === "rejected") throw failed.reason;
			const { closeOpenClawStateDatabaseByPathAsync } = await import("./openclaw-state-db-cache-CumK1G_0.mjs");
			await closeOpenClawStateDatabaseByPathAsync(resolveOpenClawStateSqlitePath({ OPENCLAW_STATE_DIR: stateDir }));
			if (previousStateDir === void 0) delete process.env.OPENCLAW_STATE_DIR;
			else process.env.OPENCLAW_STATE_DIR = previousStateDir;
			if (previousConfigPath === void 0) delete process.env.OPENCLAW_CONFIG_PATH;
			else process.env.OPENCLAW_CONFIG_PATH = previousConfigPath;
			await rm(stateDir, {
				recursive: true,
				force: true
			});
		})().catch((error) => {
			closing = void 0;
			throw error;
		})
	};
}
async function loadWorkerTurnRuntime() {
	const imports = [import("./embedded-agent.runtime-BGF8ef3x.mjs"), import("./inference-stream.runtime.js")];
	try {
		return await Promise.all(imports);
	} finally {
		await Promise.allSettled(imports);
	}
}
async function runWorkerDescriptor(descriptor, options = {}) {
	if (descriptor.connectionEndpoint.kind === "websocket" && descriptor.connectionEndpoint.cloudflareAccess) {
		registerSecretValueForRedaction(descriptor.connectionEndpoint.cloudflareAccess.clientId);
		registerSecretValueForRedaction(descriptor.connectionEndpoint.cloudflareAccess.clientSecret);
	}
	const workspaceDir = await assertWorkerDirectory(descriptor.assignment.workspaceDir, "workspace");
	const workerContainmentRoot = descriptor.assignment.workerContainmentRoot ? await assertWorkerDirectory(descriptor.assignment.workerContainmentRoot, "containment root") : workspaceDir;
	if (descriptor.assignment.permissionMode && workspaceDir !== workerContainmentRoot && !isPathInside(workerContainmentRoot, workspaceDir)) throw new Error("worker workspace path escapes its assigned containment root; reprovision the worker workspace and retry");
	const environment = options.environmentStateDir ? void 0 : await createWorkerRuntimeEnvironment(descriptor.admission.sessionId);
	const stateDir = options.environmentStateDir ?? environment.stateDir;
	const abortController = new AbortController();
	let turnStarted = false;
	let resultFenceAcked = false;
	let forcedStopTimer;
	const connection = createWorkerConnection({
		endpoint: descriptor.connectionEndpoint,
		connectParams: buildWorkerConnectParams(descriptor),
		onConnectionFailure: (error) => {
			options.onConnectionFailure?.(error?.message);
		}
	});
	const abortFromCaller = () => {
		abortController.abort(options.signal?.reason);
		if (!turnStarted) {
			connection.stop();
			return;
		}
		forcedStopTimer = setTimeout(() => {
			connection.stop();
		}, WORKER_REMOTE_CANCEL_GRACE_MS);
		forcedStopTimer.unref();
	};
	options.signal?.addEventListener("abort", abortFromCaller, { once: true });
	if (options.signal?.aborted) abortFromCaller();
	const transcript = new WorkerTranscriptCommitClient(connection, {
		runEpoch: descriptor.admission.ownerEpoch,
		baseLeafId: descriptor.assignment.transcript.baseLeafId,
		initialSeq: descriptor.assignment.transcript.nextSeq
	});
	const live = new WorkerLiveEventClient(connection, {
		runEpoch: descriptor.admission.ownerEpoch,
		initialAckedSeq: descriptor.assignment.liveEvents.ackedSeq
	});
	const inference = new WorkerInferenceProxyClient(connection);
	const unsubscribeState = connection.onStateChange((state) => {
		if (state.kind === "fenced") abortController.abort(/* @__PURE__ */ new Error(`worker fenced: ${state.reason}`));
		else if (state.kind === "failed") abortController.abort(state.error);
	});
	try {
		let hello;
		try {
			hello = await connection.start();
		} catch (error) {
			const fenced = fencedResult(connection.state);
			if (fenced) return fenced;
			if (error instanceof WorkerAdmissionDeadlineExceededError && !options.signal?.aborted) return {
				status: "not-started",
				reason: "admission-deadline",
				errorText: error.message
			};
			throw error;
		}
		if (!hello.protocolFeatures.includes("worker-gateway-tools-v1") || !hello.toolSurface) throw new Error("Gateway does not support the admitted worker tool surface.");
		const preparation = [loadWorkerTurnRuntime(), import("./workspace-DBG3_Hy1.mjs").then(({ loadWorkspaceBootstrapFiles, DEFAULT_AGENTS_FILENAME }) => loadWorkspaceBootstrapFiles(workspaceDir, [DEFAULT_AGENTS_FILENAME]))];
		const ready = Promise.all(preparation);
		await Promise.allSettled([ready, ...preparation]);
		const [[{ runWorkerEmbeddedTurn }, { createWorkerInferenceStreamAdapter }], bootstrapFiles] = await ready;
		const computerContextEpoch = { value: 0 };
		const stream = createWorkerInferenceStreamAdapter({
			client: inference,
			sessionId: descriptor.admission.sessionId,
			runEpoch: descriptor.admission.ownerEpoch,
			runId: descriptor.assignment.runId,
			turnId: descriptor.assignment.turnId,
			modelRef: descriptor.assignment.modelRef,
			computerContextEpoch
		});
		const github = descriptor.assignment.github ? await import("./github-binding.runtime.js").then(({ prepareWorkerGitHubEnvironment }) => prepareWorkerGitHubEnvironment({
			binding: descriptor.assignment.github,
			stateDir,
			turnId: descriptor.assignment.turnId,
			cwd: workspaceDir,
			signal: abortController.signal
		})) : void 0;
		try {
			turnStarted = true;
			await runWorkerEmbeddedTurn({
				agentId: descriptor.assignment.agentId,
				operationalRunInstance: descriptor.assignment.operationalRunInstance,
				agentRuntimeIdentityToken: descriptor.assignment.agentRuntimeIdentityToken,
				cwd: workspaceDir,
				workerContainmentRoot,
				...descriptor.assignment.permissionMode ? { permissionMode: descriptor.assignment.permissionMode } : {},
				stateDir,
				...github ? { github } : {},
				sessionId: descriptor.admission.sessionId,
				sessionKey: `worker:${descriptor.admission.sessionId}`,
				runId: descriptor.assignment.runId,
				prompt: descriptor.assignment.prompt,
				suppressPromptTranscript: descriptor.assignment.suppressPromptTranscript,
				modelRef: descriptor.assignment.modelRef,
				initialMessages: descriptor.assignment.initialMessages,
				skillResources: descriptor.assignment.skillResources,
				...descriptor.assignment.systemPrompt === void 0 ? {} : { systemPrompt: descriptor.assignment.systemPrompt },
				inferenceOptions: descriptor.assignment.inferenceOptions,
				allowedToolNames: descriptor.assignment.toolAuthority.allowedToolNames,
				toolSurface: hello.toolSurface,
				bootstrapFiles,
				execAuthority: descriptor.assignment.toolAuthority.exec,
				...descriptor.assignment.browser ? { browser: descriptor.assignment.browser } : {},
				...descriptor.assignment.computer ? { computer: {
					contextEpoch: computerContextEpoch,
					descriptor: descriptor.assignment.computer,
					requestComputer: (request) => connection.requestComputer(request)
				} } : {},
				...options.browserRuntime ? { browserRuntime: options.browserRuntime } : {},
				inference: { stream },
				transcript: { commit: async (messages) => {
					await transcript.commit(messages);
				} },
				live: {
					enqueuePreview: (event) => live.enqueuePreview(descriptor.assignment.runId, event),
					emitTerminal: async (event) => {
						await live.emitTerminal(descriptor.assignment.runId, event);
						resultFenceAcked = true;
					}
				},
				gatewayTools: connection,
				signal: abortController.signal
			});
			if (options.signal?.aborted && !options.environmentStateDir) throw toWorkerRuntimeError(options.signal.reason, "worker interrupted");
		} catch (error) {
			const fenced = fencedResult(connection.state);
			if (fenced) return fenced;
			if (options.signal?.aborted && !options.environmentStateDir) throw toWorkerRuntimeError(options.signal.reason, "worker interrupted");
			if (resultFenceAcked && connection.state.kind === "ready") return {
				status: "failed",
				reason: "turn-failed",
				transcriptLeafId: transcript.baseLeafId,
				transcriptNextSeq: transcript.nextSeq
			};
			throw toWorkerRuntimeError(error, "worker session failed");
		}
		const fenced = fencedResult(connection.state);
		if (fenced) return fenced;
		if (connection.state.kind === "failed") throw connection.state.error;
		return {
			status: "completed",
			transcriptLeafId: transcript.baseLeafId,
			transcriptNextSeq: transcript.nextSeq
		};
	} finally {
		if (forcedStopTimer) clearTimeout(forcedStopTimer);
		unsubscribeState();
		options.signal?.removeEventListener("abort", abortFromCaller);
		inference.dispose();
		live.dispose();
		await connection.stop();
		await environment?.close();
	}
}
//#endregion
//#region src/worker/worker-command.runtime.ts
function workerInputBytes(raw, label) {
	if (typeof raw === "string" || raw instanceof Uint8Array) return Buffer.from(raw);
	throw new Error(`${label} input must be bytes`);
}
async function runManagedWorkerCommand(options, signal) {
	let environment;
	let binding;
	let lastTurnId;
	let active;
	let running;
	let idleCleanup;
	let draining;
	let closed = false;
	const framer = createBoundedLineFramer(WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, "managed worker request exceeds the protocol payload limit");
	let removeListeners = () => {};
	try {
		await new Promise((resolve, reject) => {
			const finish = (error) => {
				if (closed) return;
				const failure = error === void 0 ? void 0 : toErrorObject(error, "managed worker command failed");
				closed = true;
				active?.controller.abort(failure ?? /* @__PURE__ */ new Error("worker supervisor input closed"));
				options.input.destroy();
				options.output.destroy();
				if (failure) reject(failure);
				else resolve();
			};
			const write = (response) => new Promise((resolveWrite, rejectWrite) => {
				const onClose = () => rejectWrite(/* @__PURE__ */ new Error("managed worker result output closed"));
				const onError = () => {};
				options.output.once("close", onClose);
				options.output.once("error", onError);
				options.output.write(`${JSON.stringify(response)}\n`, (error) => {
					options.output.off("close", onClose);
					if (error) rejectWrite(error);
					else {
						options.output.off("error", onError);
						resolveWrite();
					}
				});
			});
			const onLine = (line) => {
				let value;
				try {
					value = JSON.parse(line.toString("utf8"));
				} catch {
					throw new Error("managed worker request is not valid JSON");
				}
				const request = parseWorkerProcessRequest(value);
				if (request.type === "cancel") {
					if (active?.turnId === request.turnId) active.controller.abort(/* @__PURE__ */ new Error("worker turn cancelled"));
					return;
				}
				if (active || lastTurnId === request.turnId) throw new Error("managed worker turn is already active or was already executed");
				lastTurnId = request.turnId;
				const current = {
					turnId: request.turnId,
					controller: new AbortController()
				};
				active = current;
				running = (async (descriptor, idleRetention) => {
					const workspaceDir = await realpath(descriptor.assignment.workspaceDir);
					const workerContainmentRoot = await realpath(descriptor.assignment.workerContainmentRoot ?? workspaceDir);
					const nextBinding = JSON.stringify({
						environmentId: descriptor.admission.environmentId,
						sessionId: descriptor.admission.sessionId,
						ownerEpoch: descriptor.admission.ownerEpoch,
						agentId: descriptor.assignment.agentId,
						permissionMode: descriptor.assignment.permissionMode,
						workspaceDir,
						workerContainmentRoot
					});
					if (binding !== void 0 && binding !== nextBinding) throw new Error("managed worker environment binding changed; relaunch required");
					binding = nextBinding;
					if (closed) return;
					environment ??= await createWorkerRuntimeEnvironment(descriptor.admission.sessionId);
					await idleCleanup;
					if (closed) return;
					const result = await runWorkerDescriptor({
						...descriptor,
						assignment: descriptor.assignment.permissionMode === void 0 ? {
							...descriptor.assignment,
							workspaceDir
						} : {
							...descriptor.assignment,
							workspaceDir,
							workerContainmentRoot
						}
					}, {
						environmentStateDir: environment.stateDir,
						signal: current.controller.signal,
						...options.lifetime ? { onConnectionFailure: options.lifetime.reportConnectionFailure } : {},
						...options.browserRuntime ? { browserRuntime: options.browserRuntime } : {}
					});
					if (closed) return;
					const stateDir = environment.stateDir;
					const scopeKey = `worker:${descriptor.admission.sessionId}`;
					const disposeProfile = async () => {
						const { disposeWorkerGitHubEnvironment } = await import("./github-binding.runtime.js");
						await disposeWorkerGitHubEnvironment(stateDir, descriptor.assignment.turnId);
					};
					const canRetain = result.status === "completed" || result.status === "failed";
					let retention = canRetain && getActiveBackgroundExecSessionCount() > 0 ? "background" : canRetain && idleRetention && !current.controller.signal.aborted ? "idle" : void 0;
					if (retention === "idle") {
						await waitForExecScope(scopeKey);
						await disposeProfile();
						if (current.controller.signal.aborted) retention = void 0;
					}
					if (closed) return;
					const retainWorker = retention !== void 0;
					if (retainWorker) active = void 0;
					await write({
						type: "result",
						turnId: current.turnId,
						result,
						retainWorker,
						...idleRetention && retention ? { retention } : {}
					});
					if (retention === "background") {
						const isCurrent = () => !closed && !active && lastTurnId === current.turnId;
						draining = Promise.all([draining, waitForExecScope(scopeKey)]).then(async () => {
							await (idleCleanup = disposeProfile());
							if (idleRetention && isCurrent()) await write({
								type: "idle-ready",
								turnId: current.turnId
							});
						}).catch(finish);
					}
					if (!retainWorker) {
						active = void 0;
						finish();
					}
				})(request.descriptor, request.idleRetention).catch(finish);
			};
			const onData = (raw) => {
				if (closed) return;
				try {
					const chunk = workerInputBytes(raw, "managed worker");
					for (const line of framer.push(chunk)) {
						onLine(line);
						if (closed) break;
					}
				} catch (error) {
					finish(error);
				}
			};
			const onEnd = () => finish();
			const onAbort = () => finish(signal.reason);
			options.input.on("data", onData);
			options.input.once("end", onEnd);
			options.input.once("close", onEnd);
			options.input.once("error", finish);
			options.output.once("error", finish);
			signal.addEventListener("abort", onAbort, { once: true });
			removeListeners = () => {
				options.input.off("data", onData);
				options.input.off("end", onEnd);
				options.input.off("close", onEnd);
				options.input.off("error", finish);
				options.output.off("error", finish);
				signal.removeEventListener("abort", onAbort);
			};
			if (signal.aborted) onAbort();
			else if (options.input.readableEnded || options.input.destroyed) onEnd();
		});
	} finally {
		framer.clear();
		try {
			await running;
			await environment?.close();
			await draining;
		} finally {
			removeListeners();
		}
	}
}
async function readLaunchDescriptor(input) {
	const bytes = await readByteStreamWithLimit(input.map((chunk) => workerInputBytes(chunk, "worker launch descriptor")), {
		maxBytes: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES,
		onOverflow: () => /* @__PURE__ */ new Error("worker launch descriptor exceeds the protocol payload limit")
	});
	if (bytes.length === 0) throw new Error("worker launch descriptor is required on stdin");
	let decoded;
	try {
		decoded = JSON.parse(bytes.toString("utf8"));
	} catch (error) {
		throw new Error("worker launch descriptor is not valid JSON", { cause: error });
	}
	return parseWorkerLaunchDescriptor(decoded);
}
/** Process shell for `openclaw worker`: stdin descriptor in, JSON result out, signals abort the run. */
async function runWorkerCommand(options) {
	const abortController = new AbortController();
	const stop = () => abortController.abort(/* @__PURE__ */ new Error("worker interrupted"));
	let lifetimeEnded = false;
	const stopForLifetime = () => {
		if (lifetimeEnded || !options.lifetime) return;
		lifetimeEnded = true;
		abortController.abort(options.lifetime.signal.reason ?? /* @__PURE__ */ new Error("worker supervisor lifetime ended"));
		options.lifetime.terminateOwnedTree();
	};
	try {
		const [descriptor, started] = await Promise.all([options.managed ? void 0 : readLaunchDescriptor(options.input), options.lifetime?.started ?? true]);
		if (!started) return;
		options.lifetime?.signal.addEventListener("abort", stopForLifetime, { once: true });
		if (options.lifetime?.signal.aborted) stopForLifetime();
		process.once("SIGINT", stop);
		process.once("SIGTERM", stop);
		if (!descriptor) {
			await runManagedWorkerCommand(options, abortController.signal);
			return;
		}
		const result = await runWorkerDescriptor(descriptor, {
			signal: abortController.signal,
			...options.lifetime ? { onConnectionFailure: options.lifetime.reportConnectionFailure } : {},
			...options.browserRuntime ? { browserRuntime: options.browserRuntime } : {}
		});
		const encoded = `${JSON.stringify(result)}\n`;
		options.output.write(encoded);
	} finally {
		options.lifetime?.signal.removeEventListener("abort", stopForLifetime);
		options.lifetime?.dispose();
		process.off("SIGINT", stop);
		process.off("SIGTERM", stop);
	}
}
//#endregion
//#region src/worker/worker-process.ts
const WORKER_START_MESSAGE_TYPE = "openclaw-worker-start-v1";
function parseWorkerStartMessage(value) {
	if (!isRecord(value) || !hasExactOwnKeys(value, ["type"], ["lineageFds", "nativeProcessOwner"]) || value.type !== WORKER_START_MESSAGE_TYPE) return;
	const nativeProcessOwner = value.nativeProcessOwner;
	if (nativeProcessOwner !== void 0) {
		if (typeof nativeProcessOwner !== "string") return;
		try {
			const url = new URL(nativeProcessOwner);
			if (url.protocol !== "file:" || url.host || url.search || url.hash) return;
		} catch {
			return;
		}
	}
	if (!Object.hasOwn(value, "lineageFds")) return nativeProcessOwner === void 0 ? {} : void 0;
	const fds = value.lineageFds;
	if (!Array.isArray(fds) || fds.length === 0 || !fds.every((fd) => typeof fd === "number" && Number.isSafeInteger(fd) && fd >= 3) || new Set(fds).size !== fds.length) return;
	return {
		lineageFds: fds,
		...nativeProcessOwner === void 0 ? {} : { nativeProcessOwner }
	};
}
function createWorkerIpcLifetime() {
	if (!process.connected || !process.channel || typeof process.send !== "function") throw new Error("internal worker IPC mode requires a connected Node IPC channel");
	const abortController = new AbortController();
	let disposed = false;
	let started = false;
	let settled = false;
	let releaseLineage;
	let releaseNativeOwner;
	const startResult = createDeferredCore();
	const rejectOrAbort = (error) => {
		if (!settled) {
			settled = true;
			startResult.reject(error);
			return;
		}
		abortController.abort(error);
	};
	const onMessage = (message) => {
		if (disposed) return;
		const start = parseWorkerStartMessage(message);
		if (!start || settled) {
			rejectOrAbort(/* @__PURE__ */ new Error("invalid internal worker IPC start message"));
			return;
		}
		if (start.lineageFds) releaseLineage = bindInheritedProcessLineageFds(start.lineageFds);
		if (start.nativeProcessOwner) releaseNativeOwner = bindInheritedNativeProcessOwner(start.nativeProcessOwner);
		started = true;
		settled = true;
		startResult.resolve(true);
	};
	const onDisconnect = () => {
		if (disposed) return;
		if (!settled) {
			settled = true;
			startResult.resolve(false);
			return;
		}
		if (started) abortController.abort(/* @__PURE__ */ new Error("worker supervisor lifetime ended"));
	};
	process.on("message", onMessage);
	process.once("disconnect", onDisconnect);
	return {
		started: startResult.promise,
		signal: abortController.signal,
		reportConnectionFailure: (cause) => {
			if (disposed || !process.connected || typeof process.send !== "function") return;
			const message = {
				type: NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE,
				cause: cause ?? null
			};
			try {
				process.send(message, () => {});
			} catch {}
		},
		terminateOwnedTree: () => {
			signalProcessTree(process.pid, "SIGKILL");
		},
		dispose: () => {
			if (disposed) return;
			disposed = true;
			releaseLineage?.();
			releaseNativeOwner?.();
			process.off("message", onMessage);
			process.off("disconnect", onDisconnect);
			if (process.connected) try {
				process.disconnect?.();
			} catch (error) {
				if (error.code !== "ERR_IPC_DISCONNECTED") throw error;
			}
		}
	};
}
/** Runs the worker-only process entry without loading the general CLI command tree. */
async function runWorkerProcess(options = {}) {
	const { initializeSqliteRuntimeCapabilities } = await import("./infra/bun-sqlite-library.js");
	await initializeSqliteRuntimeCapabilities();
	routeLogsToStderr();
	enableConsoleCapture();
	await runWorkerCommand({
		input: process.stdin,
		output: process.stdout,
		...options.managed ? { managed: true } : {},
		...options.internalWorkerIpc ? { lifetime: createWorkerIpcLifetime() } : {},
		...options.browserRuntime ? { browserRuntime: options.browserRuntime } : {}
	});
}
//#endregion
export { runWorkerProcess };
