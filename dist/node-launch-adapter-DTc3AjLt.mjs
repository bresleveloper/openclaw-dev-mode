import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CLj0HTDM.mjs";
import { n as computeBackoff, s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import "./backoff-CszdOMiF.mjs";
import { a as formatNodeRunnerUpdateRequired, n as NODE_RUNNER_UPDATE_REQUIRED_ISSUE, s as resolveNodeWorkerExecutionIssue } from "./node-runner-inventory-DTVspi93.mjs";
import { h as parseWorkerAdmissionDeadlineResult, n as measureWorkerProcessTurnBytes } from "./worker-process-protocol-B6pCNPWA.mjs";
import { E as NODE_WORKER_SUPERVISOR_STATUS_COMMAND, T as NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND, w as NODE_WORKER_SUPERVISOR_CANCEL_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { t as boundedWorkerError } from "./worker-error-Bd42UcqN.mjs";
import { c as parseNodeWorkerSupervisorReceipt, n as nodeWorkerPlanHash, o as parseNodeWorkerLaunchInput } from "./node-supervisor-protocol-BCz1HQ8e.mjs";
import { i as serializeNodeEvent, r as buildNodeInvokeRequest } from "./node-invoke-request-QpYVLB31.mjs";
import { t as raceNodeWorkerOperation } from "./node-worker-abort-BBj2optb.mjs";
import { n as WorkerRunnerUnavailableError, t as WorkerRunnerCapacityError } from "./tunnel-contract-C4XjTxW-.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/node-launch-adapter.ts
const DEFAULT_RPC_TIMEOUT_MS = 3e4;
const DEFAULT_POLL_INTERVAL_MS = 250;
const MAX_RETRY_DELAY_MS = 2e3;
const DEFAULT_CANCELLATION_TIMEOUT_MS = 3e4;
const DEFAULT_AVAILABILITY_TIMEOUT_MS = 1e4;
const MAX_ADMISSION_ATTEMPTS = 5;
const ADMISSION_REARM_BACKOFF = {
	initialMs: 1e3,
	maxMs: 3e4,
	factor: 2,
	jitter: .1
};
const RETRYABLE_TRANSPORT_CODES = /* @__PURE__ */ new Set([
	"DISCONNECTED",
	"NOT_CONNECTED",
	"PAIRING_CHANGED",
	"PRIVATE_DIALECT_UNAVAILABLE",
	"ROUTE_CHANGED",
	"TIMEOUT",
	"UNAVAILABLE"
]);
var NodeWorkerLaunchTransportError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
};
function isTerminalReceipt(receipt) {
	return receipt.state === "completed" || receipt.state === "failed" || receipt.state === "interrupted" || receipt.state === "cancelled";
}
function snapshotLaunchInput(input) {
	let encoded;
	try {
		encoded = JSON.stringify(input);
	} catch {
		throw new Error("node worker launch input is not serializable");
	}
	return parseNodeWorkerLaunchInput(encoded);
}
function rearmNodeWorkerLaunchInput(input, attempt) {
	const launchId = createHash("sha256").update(`${input.launchId}:admission-rearm:${attempt}`).digest("hex");
	return {
		...input,
		launchId,
		descriptor: {
			...input.descriptor,
			assignment: {
				...input.descriptor.assignment,
				turnId: launchId
			}
		}
	};
}
function measureNodeWorkerLaunchBytes(nodeId, input) {
	return Math.max(...[input, rearmNodeWorkerLaunchInput(input, 1)].flatMap((attempt) => [Buffer.byteLength(serializeNodeEvent("node.invoke.request", buildNodeInvokeRequest({
		id: randomUUID(),
		nodeId,
		command: NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND,
		params: attempt,
		timeoutMs: MAX_TIMER_TIMEOUT_MS,
		idempotencyKey: attempt.launchId
	})), "utf8"), measureWorkerProcessTurnBytes(attempt.descriptor)]));
}
function expectedIdentity(input) {
	if (input.launchId !== input.descriptor.assignment.turnId) throw new Error("node worker launch ID must match the durable turn ID");
	return {
		launchId: input.launchId,
		planHash: nodeWorkerPlanHash(input),
		environmentId: input.descriptor.admission.environmentId,
		sessionId: input.descriptor.admission.sessionId,
		ownerEpoch: input.descriptor.admission.ownerEpoch,
		placementGeneration: input.placementGeneration,
		runId: input.descriptor.assignment.runId
	};
}
function receiptMatchesIdentity(receipt, expected) {
	return receipt.launchId === expected.launchId && receipt.planHash === expected.planHash && receipt.environmentId === expected.environmentId && receipt.sessionId === expected.sessionId && receipt.ownerEpoch === expected.ownerEpoch && receipt.placementGeneration === expected.placementGeneration && receipt.runId === expected.runId;
}
function parseInvokeReceipt(payloadJSON) {
	if (!payloadJSON) throw new Error("node worker supervisor response omitted payload JSON");
	let value;
	try {
		value = JSON.parse(payloadJSON);
	} catch {
		throw new Error("node worker supervisor response contained malformed JSON");
	}
	if (value === null) return null;
	const receipt = parseNodeWorkerSupervisorReceipt(value);
	if (!receipt) throw new Error("node worker supervisor response violated the private receipt contract");
	return receipt;
}
function signalError(signal, fallback) {
	return signal.reason instanceof Error ? signal.reason : new Error(fallback);
}
function createDeadline(params) {
	if (!Number.isFinite(params.timeoutMs) || params.timeoutMs <= 0) throw new Error(`${params.label} timeout must be a positive finite number`);
	const controller = new AbortController();
	const expiresAtMs = params.now() + params.timeoutMs;
	const expire = () => {
		params.parent?.remainingMs();
		controller.abort(/* @__PURE__ */ new Error(`${params.label} timed out`));
	};
	const timer = setTimeout(expire, params.timeoutMs);
	timer.unref?.();
	const parentSignal = params.parent?.signal ?? params.signal;
	return {
		signal: parentSignal ? AbortSignal.any([parentSignal, controller.signal]) : controller.signal,
		remainingMs: () => {
			params.parent?.remainingMs();
			const remainingMs = Math.max(0, expiresAtMs - params.now());
			if (remainingMs === 0) expire();
			return remainingMs;
		},
		dispose: () => clearTimeout(timer)
	};
}
function createNodeWorkerLaunchAdapter(options) {
	const now = options.now ?? Date.now;
	const sleep = options.sleep ?? sleepWithAbort;
	const rpcTimeoutMs = options.rpcTimeoutMs ?? DEFAULT_RPC_TIMEOUT_MS;
	const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
	const cancellationTimeoutMs = options.cancellationTimeoutMs ?? DEFAULT_CANCELLATION_TIMEOUT_MS;
	const findNode = async (params) => {
		let node;
		try {
			node = await raceNodeWorkerOperation(params.transport.getCurrentNode(params.deviceId), params.signal);
		} catch (error) {
			if (params.signal.aborted) throw error;
			throw new NodeWorkerLaunchTransportError("UNAVAILABLE", "device worker node discovery is unavailable");
		}
		if (!node) throw new NodeWorkerLaunchTransportError("NOT_CONNECTED", "device worker node is not currently connected");
		return node;
	};
	const invoke = async (params) => {
		if (!params.isAuthorized()) throw new NodeWorkerLaunchTransportError("APPROVAL_AUTHORITY_CLOSED", "node worker authority closed");
		const remainingMs = params.deadline.remainingMs();
		params.deadline.signal.throwIfAborted();
		const transport = options.getTransport();
		if (!transport) throw new NodeWorkerLaunchTransportError("UNAVAILABLE", "device worker node transport is unavailable");
		const rpcBudgetMs = Math.min(rpcTimeoutMs, remainingMs);
		const rpcController = rpcBudgetMs < remainingMs ? new AbortController() : void 0;
		const rpcTimer = rpcController ? setTimeout(() => rpcController.abort(/* @__PURE__ */ new Error("node worker RPC timed out")), rpcBudgetMs) : void 0;
		rpcTimer?.unref?.();
		const signal = rpcController ? AbortSignal.any([params.deadline.signal, rpcController.signal]) : params.deadline.signal;
		try {
			const node = await findNode({
				transport,
				deviceId: params.deviceId,
				signal
			});
			if (params.command === "worker.launch.v1" && (node.workerHost.environmentSession !== 1 || resolveNodeWorkerExecutionIssue(node.workerHost))) throw new Error(formatNodeRunnerUpdateRequired(node.nodeId, NODE_RUNNER_UPDATE_REQUIRED_ISSUE));
			const operation = transport.invoke({
				node,
				command: params.command,
				params: params.payload,
				timeoutMs: rpcBudgetMs,
				signal,
				idempotencyKey: params.command === "worker.launch.v1" && typeof params.payload === "object" && params.payload !== null && "launchId" in params.payload && typeof params.payload.launchId === "string" ? params.payload.launchId : void 0,
				isDispatchAuthorized: params.isAuthorized,
				...params.onDispatchReady ? { onDispatchReady: params.onDispatchReady } : {}
			});
			const result = await raceNodeWorkerOperation(operation, signal);
			if (!result.ok) {
				const code = result.error?.code ?? "UNAVAILABLE";
				if (code === "WORKER_CAPACITY_EXHAUSTED") throw new WorkerRunnerCapacityError();
				const detail = result.error?.message?.trim();
				throw new NodeWorkerLaunchTransportError(code, boundedWorkerError(`node worker supervisor ${params.command} failed (${code})${detail ? `: ${detail}` : ""}`));
			}
			return parseInvokeReceipt(result.payloadJSON);
		} catch (error) {
			if (rpcController?.signal.aborted && !params.deadline.signal.aborted) throw new NodeWorkerLaunchTransportError("TIMEOUT", "node worker RPC timed out");
			throw error;
		} finally {
			clearTimeout(rpcTimer);
		}
	};
	const validateReceipt = (receipt, expected) => {
		if (!receiptMatchesIdentity(receipt, expected)) throw new Error("node worker supervisor receipt identity mismatch");
		return receipt;
	};
	const waitBeforeRetry = async (params) => {
		const remainingMs = params.deadline.remainingMs();
		params.deadline.signal.throwIfAborted();
		await raceNodeWorkerOperation(sleep(Math.min(params.delayMs, remainingMs), params.deadline.signal), params.deadline.signal);
		return Math.min(params.delayMs * 2, MAX_RETRY_DELAY_MS);
	};
	const cancelUntilTerminal = async (params) => {
		const deadline = createDeadline({
			now,
			timeoutMs: cancellationTimeoutMs,
			label: "node worker cancellation"
		});
		let delayMs = pollIntervalMs;
		try {
			while (!deadline.signal.aborted && deadline.remainingMs() > 0) {
				if (!params.request.isCancellationAuthorized()) throw new Error("node worker cancellation authority closed before terminal settlement");
				try {
					const receipt = await invoke({
						deviceId: params.request.deviceId,
						command: NODE_WORKER_SUPERVISOR_CANCEL_COMMAND,
						payload: params.expected,
						isAuthorized: params.request.isCancellationAuthorized,
						deadline
					});
					if (receipt) {
						const validated = validateReceipt(receipt, params.expected);
						if (isTerminalReceipt(validated)) return validated;
						delayMs = pollIntervalMs;
					}
				} catch (error) {
					if (deadline.signal.aborted) break;
					if (!(error instanceof NodeWorkerLaunchTransportError) || !RETRYABLE_TRANSPORT_CODES.has(error.code)) throw error;
				}
				delayMs = await waitBeforeRetry({
					delayMs,
					deadline
				});
			}
		} finally {
			deadline.dispose();
		}
		throw new Error("node worker cancellation did not produce a terminal receipt before its deadline");
	};
	const launch = async (request) => {
		const originalInput = snapshotLaunchInput(request.input);
		let input = originalInput;
		const stableRequest = {
			...request,
			input
		};
		let expected = expectedIdentity(input);
		let admissionAttempts = 1;
		const deadline = createDeadline({
			now,
			timeoutMs: request.timeoutMs,
			...request.signal ? { signal: request.signal } : {},
			label: "node worker launch"
		});
		const availabilityDeadline = createDeadline({
			now,
			timeoutMs: DEFAULT_AVAILABILITY_TIMEOUT_MS,
			parent: deadline,
			label: "node worker availability"
		});
		const dispatchDeadline = {
			...deadline,
			signal: availabilityDeadline.signal
		};
		let mayHaveLaunched = false;
		let dispatchReady = false;
		let pollStatus = false;
		let delayMs = pollIntervalMs;
		const markDispatchReady = () => {
			mayHaveLaunched = true;
			if (!dispatchReady) {
				dispatchReady = true;
				availabilityDeadline.dispose();
				stableRequest.onDispatchReady?.();
			}
		};
		try {
			while (true) {
				if (deadline.signal.aborted) throw signalError(deadline.signal, "node worker launch aborted");
				if (!stableRequest.isDispatchAuthorized()) throw new Error("node worker launch authority closed");
				try {
					const receipt = await invoke({
						deviceId: stableRequest.deviceId,
						command: pollStatus ? NODE_WORKER_SUPERVISOR_STATUS_COMMAND : NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND,
						payload: pollStatus ? { launchId: input.launchId } : input,
						isAuthorized: () => {
							if (!dispatchReady) availabilityDeadline.remainingMs();
							return stableRequest.isDispatchAuthorized();
						},
						deadline: dispatchDeadline,
						...!pollStatus ? { onDispatchReady: markDispatchReady } : {}
					});
					if (!receipt) pollStatus = false;
					else {
						if (!pollStatus) markDispatchReady();
						const validated = validateReceipt(receipt, expected);
						mayHaveLaunched = true;
						if (isTerminalReceipt(validated)) {
							const admissionFailure = validated.state === "completed" ? parseWorkerAdmissionDeadlineResult(JSON.parse(validated.resultJson)) : void 0;
							const rearmDelayMs = computeBackoff(ADMISSION_REARM_BACKOFF, admissionAttempts);
							const rearmAdmitsWithinCredential = stableRequest.credentialExpiresAtMs === void 0 || now() + rearmDelayMs + 12e4 <= stableRequest.credentialExpiresAtMs;
							if (admissionFailure && admissionAttempts < MAX_ADMISSION_ATTEMPTS && rearmAdmitsWithinCredential) {
								mayHaveLaunched = false;
								await waitBeforeRetry({
									delayMs: rearmDelayMs,
									deadline
								});
								input = rearmNodeWorkerLaunchInput(originalInput, admissionAttempts++);
								expected = expectedIdentity(input);
								pollStatus = false;
								delayMs = pollIntervalMs;
								continue;
							}
							return validated;
						}
						pollStatus = true;
						delayMs = pollIntervalMs;
					}
				} catch (error) {
					if (deadline.signal.aborted || !dispatchReady && availabilityDeadline.signal.aborted || !stableRequest.isDispatchAuthorized()) throw error;
					if (!(error instanceof NodeWorkerLaunchTransportError) || !RETRYABLE_TRANSPORT_CODES.has(error.code)) throw error;
					pollStatus = false;
				}
				delayMs = await waitBeforeRetry({
					delayMs,
					deadline: dispatchReady ? deadline : availabilityDeadline
				});
			}
		} catch (error) {
			if (!dispatchReady && availabilityDeadline.signal.aborted && !deadline.signal.aborted) throw new WorkerRunnerUnavailableError();
			if (error instanceof WorkerRunnerCapacityError) throw error;
			if (!mayHaveLaunched) throw error;
			let terminal;
			try {
				terminal = await cancelUntilTerminal({
					request: stableRequest,
					expected
				});
			} catch (cancelError) {
				throw new AggregateError([error, cancelError], "node worker launch failed and cancellation could not be confirmed", { cause: cancelError });
			}
			if (deadline.signal.aborted || !stableRequest.isDispatchAuthorized()) return terminal;
			throw error;
		} finally {
			availabilityDeadline.dispose();
			deadline.dispose();
		}
	};
	return { launch };
}
//#endregion
export { measureNodeWorkerLaunchBytes as n, createNodeWorkerLaunchAdapter as t };
