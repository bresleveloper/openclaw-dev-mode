import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CkhMiRw8.mjs";
import { d as sleepWithAbort, n as computeBackoff } from "./src-Bzfi3cQM.mjs";
import { l as getGatewayRestartDrainSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import "./backoff-N5Hi0doU.mjs";
import { D as NODE_WORKER_SUPERVISOR_STATUS_COMMAND, E as NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND, T as NODE_WORKER_SUPERVISOR_CANCEL_COMMAND } from "./node-commands-Bxo-2Y4j.mjs";
import { u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import "./worker-admission-DKoRQV__.mjs";
import { i as NODE_WORKER_INFERENCE_SETUP_ERROR, l as resolveNodeWorkerExecutionIssue, n as NODE_RUNNER_UPDATE_REQUIRED_ISSUE, o as createNodeRunnerInventoryIssueError } from "./node-runner-inventory-tKxQBAdF.mjs";
import { n as serializeNodeEvent, t as buildNodeInvokeRequest } from "./node-invoke-request-NMUgqchA.mjs";
import { t as boundedWorkerError } from "./worker-error-BrVatFit.mjs";
import { c as parseNodeWorkerLaunchInput, i as nodeWorkerTurnMatchesIdentity, n as NODE_WORKER_STATUS_WAIT_MAX_MS, r as nodeWorkerPlanHash, u as parseNodeWorkerSupervisorReceipt } from "./node-supervisor-protocol-CqoR9BQ5.mjs";
import { n as measureWorkerProcessTurnBytes } from "./worker-process-protocol-mSTbCXrT.mjs";
import { u as parseWorkerAdmissionDeadlineResult } from "./worker-connection-contract-BLrCYghU.mjs";
import { t as WorkerNodeLostError } from "./worker-node-loss-DmwJygIh.mjs";
import { t as raceNodeWorkerOperation } from "./node-worker-abort--EyODQgV.mjs";
import { n as WorkerRunnerUnavailableError, t as WorkerRunnerCapacityError } from "./tunnel-contract-DJT0nCJA.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/node-launch-adapter.ts
function nodeWorkerSpawnResultFromReceipt(receipt) {
	return {
		...receipt.state === "interrupted" ? { nodeLoss: new WorkerNodeLostError() } : {},
		stdout: receipt.state === "completed" ? receipt.resultJson : "",
		stderr: receipt.state === "completed" ? "" : receipt.errorText,
		code: receipt.state === "completed" ? 0 : 1,
		signal: null,
		killed: receipt.state === "cancelled" || receipt.state === "interrupted",
		termination: "exit"
	};
}
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
const RETRYABLE_NODE_WORKER_TRANSPORT_CODES = /* @__PURE__ */ new Set([
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
	return receipt.state !== "pending" && receipt.state !== "running";
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
	const measured = input.descriptor.admission.handshake.protocolFeatures.includes("node-worker-idle-retention-v1") ? {
		...input,
		idleRetention: true
	} : input;
	return Math.max(...[measured, rearmNodeWorkerLaunchInput(measured, 1)].flatMap((attempt) => [Buffer.byteLength(serializeNodeEvent("node.invoke.request", buildNodeInvokeRequest({
		id: randomUUID(),
		nodeId,
		command: NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND,
		params: attempt,
		timeoutMs: MAX_TIMER_TIMEOUT_MS,
		idempotencyKey: attempt.launchId
	})), "utf8"), measureWorkerProcessTurnBytes(attempt.descriptor, attempt.idleRetention)]));
}
function expectedIdentity(input) {
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
function validateReceipt(receipt, expected) {
	if (!nodeWorkerTurnMatchesIdentity(receipt, expected)) throw new Error("node worker supervisor receipt identity mismatch");
	return receipt;
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
			if (params.command === "worker.launch.v1" && (node.workerHost.environmentSession !== 1 || resolveNodeWorkerExecutionIssue(node.workerHost))) throw createNodeRunnerInventoryIssueError(node.nodeId, NODE_RUNNER_UPDATE_REQUIRED_ISSUE);
			params.prepareLaunch?.(node);
			if (!params.prepareLaunch && params.idleRetention && node.workerHost.idleRetention !== true) throw new NodeWorkerLaunchTransportError("PRIVATE_DIALECT_UNAVAILABLE", "node worker idle retention is unavailable");
			const statusWait = node.workerHost.statusWait === 1;
			const operation = transport.invoke({
				node,
				command: params.command,
				params: params.command === "worker.status.v1" && statusWait ? {
					...params.payload,
					waitMs: Math.min(NODE_WORKER_STATUS_WAIT_MAX_MS, Math.max(1, Math.floor(rpcBudgetMs * .75)))
				} : params.payload,
				timeoutMs: rpcBudgetMs,
				signal,
				idempotencyKey: params.command === "worker.launch.v1" ? params.payload.launchId : void 0,
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
			return {
				receipt: parseInvokeReceipt(result.payloadJSON),
				statusWait
			};
		} catch (error) {
			if (rpcController?.signal.aborted && !params.deadline.signal.aborted) throw new NodeWorkerLaunchTransportError("TIMEOUT", "node worker RPC timed out");
			throw error;
		} finally {
			clearTimeout(rpcTimer);
		}
	};
	const waitBeforeRetry = async (delayMs, deadline) => {
		const remainingMs = deadline.remainingMs();
		deadline.signal.throwIfAborted();
		await raceNodeWorkerOperation(sleep(Math.min(delayMs, remainingMs), deadline.signal), deadline.signal);
		return Math.min(delayMs * 2, MAX_RETRY_DELAY_MS);
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
					const { receipt } = await invoke({
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
					if (!(error instanceof NodeWorkerLaunchTransportError) || !RETRYABLE_NODE_WORKER_TRANSPORT_CODES.has(error.code)) throw error;
				}
				delayMs = await waitBeforeRetry(delayMs, deadline);
			}
		} finally {
			deadline.dispose();
		}
		throw new Error("node worker cancellation did not produce a terminal receipt before its deadline");
	};
	const launch = async (request) => {
		const restartSignal = getGatewayRestartDrainSignal();
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
				const launchMayAlreadyExist = mayHaveLaunched;
				try {
					const { receipt, statusWait } = await invoke({
						deviceId: stableRequest.deviceId,
						command: pollStatus ? NODE_WORKER_SUPERVISOR_STATUS_COMMAND : NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND,
						payload: pollStatus ? { launchId: input.launchId } : input,
						...!pollStatus && input.idleRetention ? { idleRetention: true } : {},
						...!pollStatus && !mayHaveLaunched ? { prepareLaunch: (node) => {
							if (input.descriptor.assignment.inference === "runtime-local" && node.workerHost.nativeInference !== 1) throw new Error(NODE_WORKER_INFERENCE_SETUP_ERROR);
							if (node.workerHost.idleRetention === true && input.descriptor.admission.handshake.protocolFeatures.includes("node-worker-idle-retention-v1")) input.idleRetention = true;
							else delete input.idleRetention;
							expected = expectedIdentity(input);
						} } : {},
						isAuthorized: Object.assign(() => {
							if (!dispatchReady) availabilityDeadline.remainingMs();
							return stableRequest.isDispatchAuthorized();
						}, stableRequest.isDispatchAuthorized),
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
								await waitBeforeRetry(rearmDelayMs, deadline);
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
						if (statusWait) continue;
					}
				} catch (error) {
					if (!pollStatus && !launchMayAlreadyExist && error instanceof NodeWorkerLaunchTransportError && error.code === "INVALID_REQUEST") {
						mayHaveLaunched = false;
						throw error;
					}
					if (deadline.signal.aborted || !dispatchReady && availabilityDeadline.signal.aborted || !stableRequest.isDispatchAuthorized()) throw error;
					if (!(error instanceof NodeWorkerLaunchTransportError) || !RETRYABLE_NODE_WORKER_TRANSPORT_CODES.has(error.code)) throw error;
					pollStatus = false;
				}
				delayMs = await waitBeforeRetry(delayMs, dispatchReady ? deadline : availabilityDeadline);
			}
		} catch (error) {
			if (restartSignal.aborted && isAgentRunRestartAbortReason(deadline.signal.reason)) throw deadline.signal.reason;
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
				const failure = new AggregateError([error, cancelError], "node worker launch failed and cancellation could not be confirmed", { cause: cancelError });
				throw error instanceof NodeWorkerLaunchTransportError && (error.code === "DISCONNECTED" || error.code === "NOT_CONNECTED") && !request.signal?.aborted ? new WorkerNodeLostError({ cause: failure }) : failure;
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
export { nodeWorkerSpawnResultFromReceipt as i, createNodeWorkerLaunchAdapter as n, measureNodeWorkerLaunchBytes as r, RETRYABLE_NODE_WORKER_TRANSPORT_CODES as t };
