import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { G as hasInternalDiagnosticEventInterest, N as runWithDiagnosticTraceContext, O as getActiveDiagnosticTraceContext, o as emitTrustedDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { p as WORKER_PROTOCOL_METHODS } from "./worker-admission-BB3C4gz4.mjs";
import { f as isCoreGatewayMethodClassified } from "./method-scopes-C7g7eSZh.mjs";
import { r as WORKER_INFERENCE_METHODS } from "./worker-inference-m2fwUhbe.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/server/ws-connection/handshake-auth-log-limiter.ts
/** Per-key log limiter that reports suppressed auth attempts on the next emitted log. */
var HandshakeAuthLogLimiter = class {
	constructor(options) {
		this.entries = /* @__PURE__ */ new Map();
		this.intervalMs = resolveIntegerOption(options?.intervalMs, 3e4, { min: 1 });
		this.maxEntries = resolveIntegerOption(options?.maxEntries, 256, { min: 1 });
	}
	/** Register one auth event key and decide whether it should be logged now. */
	register(key, nowMs = Date.now()) {
		const entry = this.entries.get(key);
		if (!entry) {
			pruneMapToMaxSize(this.entries, this.maxEntries - 1);
			this.entries.set(key, {
				lastLoggedAtMs: nowMs,
				suppressedSinceLastLog: 0
			});
			return {
				shouldLog: true,
				suppressedSinceLastLog: 0
			};
		}
		if (nowMs - entry.lastLoggedAtMs < this.intervalMs) {
			entry.suppressedSinceLastLog += 1;
			return {
				shouldLog: false,
				suppressedSinceLastLog: 0
			};
		}
		const suppressedSinceLastLog = entry.suppressedSinceLastLog;
		entry.lastLoggedAtMs = nowMs;
		entry.suppressedSinceLastLog = 0;
		return {
			shouldLog: true,
			suppressedSinceLastLog
		};
	}
};
/** Build the limiter key from auth failure context. */
function buildHandshakeAuthLogKey(params) {
	return [
		params.reason ?? "unknown",
		params.remoteAddr ?? "?",
		params.client ?? "?",
		params.mode ?? "?",
		params.authProvided ?? "?"
	].join("|");
}
/** Return whether a missing-credential failure should use log rate limiting. */
function shouldLimitMissingCredentialAuthLog(params) {
	return params.authProvided === "none" && (params.reason === "token_missing" || params.reason === "password_missing");
}
//#endregion
//#region src/gateway/server/ws-connection/request-diagnostics.ts
const workerMethods = /* @__PURE__ */ new Set([...WORKER_PROTOCOL_METHODS, ...WORKER_INFERENCE_METHODS]);
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
	response(outcome) {
		const sent = outcome === "ok" || outcome === "error";
		if (sent ? this.responseState === "sent" : this.deliveryFailureRecorded) return;
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
			durationMs: performance.now() - this.startedAt
		});
	}
	async runHandler(invoke) {
		const startedAt = performance.now();
		this.handlerStarted = true;
		let outcome = "returned";
		try {
			await invoke();
		} catch (error) {
			outcome = "threw";
			throw error;
		} finally {
			this.emit({
				type: "gateway.rpc",
				method: this.method,
				phase: "handler",
				outcome,
				durationMs: performance.now() - startedAt,
				admissionMs: startedAt - this.startedAt
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
	return new GatewayRpcDiagnostics(isCoreGatewayMethodClassified(method) ? method : getMethodRegistry?.().getHandler(method) || Object.hasOwn(extraHandlers, method) ? "other" : "unknown");
}
//#endregion
export { buildHandshakeAuthLogKey as a, HandshakeAuthLogLimiter as i, createGatewayRpcDiagnostics as n, shouldLimitMissingCredentialAuthLog as o, createWorkerRpcDiagnostics as r, captureGatewayRpcReceivedAt as t };
