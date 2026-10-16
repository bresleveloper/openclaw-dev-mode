import { P as runWithDiagnosticTraceContext, k as getActiveDiagnosticTraceContext, q as hasInternalDiagnosticEventInterest, s as emitTrustedDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { r as WORKER_INFERENCE_METHODS } from "./worker-inference-B7U4TRc2.mjs";
import { m as WORKER_PROTOCOL_METHODS } from "./worker-admission-CNeLWzVQ.mjs";
import { r as isCoreGatewayMethodClassified } from "./core-method-policy-CcBevufV.mjs";
import { isMainThread } from "node:worker_threads";
import { performance } from "node:perf_hooks";
//#region src/gateway/server/ws-connection/request-diagnostics.ts
const workerMethods = /* @__PURE__ */ new Set([...WORKER_PROTOCOL_METHODS, ...WORKER_INFERENCE_METHODS]);
let activeHandlers = 0;
let exclusiveHandler;
var GatewayRpcDiagnostics = class {
	constructor(method, startedAt = performance.now(), queueWaitMs) {
		this.method = method;
		this.startedAt = startedAt;
		this.trace = getActiveDiagnosticTraceContext();
		this.handlerStarted = false;
		this.deliveryFailureRecorded = false;
		this.dispatchFinished = false;
		this.responseState = "none";
		this.queueWaitMs = queueWaitMs;
		this.emit({
			type: "gateway.rpc",
			method,
			phase: "received"
		});
	}
	emit(event) {
		runWithDiagnosticTraceContext(this.trace, () => emitTrustedDiagnosticEvent(event));
	}
	bindTrace(trace = getActiveDiagnosticTraceContext()) {
		this.trace = trace;
	}
	startQueue() {
		this.queueStartedAt = performance.now();
	}
	finishQueue() {
		if (this.queueStartedAt !== void 0) this.queueWaitMs = performance.now() - this.queueStartedAt;
	}
	response(outcome, responseBytes) {
		const sent = outcome === "ok" || outcome === "error";
		const firstResponse = this.responseState !== "sent";
		if (sent ? !firstResponse && responseBytes === void 0 : this.deliveryFailureRecorded) return;
		if (sent) this.responseState = "sent";
		else {
			this.deliveryFailureRecorded = true;
			if (this.responseState !== "sent") this.responseState = outcome;
		}
		this.emit({
			type: "gateway.rpc",
			method: this.method,
			phase: "response",
			outcome,
			firstResponse: sent ? firstResponse : void 0,
			responseBytes,
			durationMs: performance.now() - this.startedAt
		});
	}
	static async runHandler(invoke, diagnostics) {
		exclusiveHandler = ++activeHandlers === 1 ? diagnostics : void 0;
		const heapUsedAtStart = diagnostics && exclusiveHandler === diagnostics && isMainThread ? process.memoryUsage().heapUsed : void 0;
		const startedAt = diagnostics ? performance.now() : 0;
		if (diagnostics) diagnostics.handlerStarted = true;
		let outcome = "returned";
		try {
			await invoke();
		} catch (error) {
			outcome = "threw";
			throw error;
		} finally {
			const heapDeltaBytes = heapUsedAtStart !== void 0 && exclusiveHandler === diagnostics ? process.memoryUsage().heapUsed - heapUsedAtStart : void 0;
			activeHandlers--;
			exclusiveHandler = void 0;
			diagnostics?.emit({
				type: "gateway.rpc",
				method: diagnostics.method,
				phase: "handler",
				outcome,
				durationMs: performance.now() - startedAt,
				admissionMs: startedAt - diagnostics.startedAt,
				heapDeltaBytes
			});
		}
	}
	finish(outcome) {
		if (this.dispatchFinished) return;
		this.dispatchFinished = true;
		this.emit({
			type: "gateway.rpc",
			method: this.method,
			phase: "dispatch",
			outcome: outcome === "returned" && !this.handlerStarted ? "rejected" : outcome,
			durationMs: performance.now() - this.startedAt,
			...this.queueWaitMs !== void 0 ? { queueWaitMs: this.queueWaitMs } : {},
			response: this.responseState
		});
	}
};
/** Capture receipt before a socket FIFO, without work when diagnostics are unused. */
function captureGatewayRpcReceivedAt() {
	return areDiagnosticsEnabledForProcess() && hasInternalDiagnosticEventInterest("gateway.rpc") ? performance.now() : void 0;
}
function createWorkerRpcDiagnostics(method, timing) {
	if (!timing) return;
	return new GatewayRpcDiagnostics(workerMethods.has(method) ? method : "unknown", timing.receivedAt, timing.dequeuedAt - timing.receivedAt);
}
function createGatewayRpcDiagnostics(method, getMethodRegistry, extraHandlers) {
	if (!areDiagnosticsEnabledForProcess() || !hasInternalDiagnosticEventInterest("gateway.rpc")) return;
	return new GatewayRpcDiagnostics(isCoreGatewayMethodClassified(method) || getMethodRegistry?.().getHandler(method) || Object.hasOwn(extraHandlers, method) ? method : "other");
}
//#endregion
export { createWorkerRpcDiagnostics as i, captureGatewayRpcReceivedAt as n, createGatewayRpcDiagnostics as r, GatewayRpcDiagnostics as t };
