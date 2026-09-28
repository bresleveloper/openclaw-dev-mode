import { N as runWithDiagnosticTraceContext, O as getActiveDiagnosticTraceContext } from "./diagnostic-events-CVabF32H.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-BXzjx6E8.mjs";
import { i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-CHv_0noy.mjs";
import { t as NODE_INVOKE_PAIRING_CHANGED_ABORT } from "./node-registry-private-token-ChofAGxk.mjs";
//#region src/gateway/node-registry.invoke-stream.ts
/** A node may emit this only before invoking a handler or sending any progress. */
const NODE_INVOKE_NOT_READY = "NODE_NOT_READY";
const MAX_PENDING_PROGRESS_CHUNKS = 128;
const MAX_INVOKE_INPUT_BYTES = 16384;
var NodeInvokeStreamController = class {
	constructor(options) {
		this.options = options;
	}
	sendInput(invokeId, payload) {
		const pending = this.options.pendingInvokes.get(invokeId);
		if (!pending) throw new Error("node invoke is not pending");
		const payloadJSON = JSON.stringify(payload);
		if (payloadJSON === void 0) throw new Error("node invoke input is not serializable");
		if (Buffer.byteLength(payloadJSON, "utf8") > MAX_INVOKE_INPUT_BYTES) throw new Error("node invoke input exceeds 16 KiB");
		if (!this.getPending(invokeId, pending.nodeId, pending.connId)) throw new Error("node invoke is not pending");
		if (!this.options.sendInput(invokeId, pending, pending.nextInputSeq, payloadJSON)) throw new Error("failed to send node invoke input");
		pending.nextInputSeq += 1;
	}
	reconcileRuntimePolicy() {
		for (const [id, pending] of this.options.pendingInvokes) if (!this.settleIfExpired(id, pending)) this.settleIfPolicyChanged(id, pending);
	}
	handleDisconnect(connId) {
		for (const [id, pending] of this.options.pendingInvokes) {
			if (pending.connId !== connId) continue;
			if (this.settleIfExpired(id, pending)) continue;
			if (!this.takePending(id, pending)) continue;
			this.options.disconnectPending(pending);
		}
	}
	handleResult(params) {
		const pending = this.getPending(params.id, params.nodeId, params.connId);
		if (!pending || !this.takePending(params.id, pending)) return false;
		if (!params.ok) this.options.onFailedResult(pending);
		const error = params.error?.code === "NODE_NOT_READY" && pending.receivedProgress ? {
			code: "UNAVAILABLE",
			message: "node reported not-ready after invocation progress"
		} : params.error ?? null;
		pending.resolve({
			ok: params.ok,
			payload: params.payload,
			payloadJSON: params.payloadJSON ?? null,
			error
		});
		return true;
	}
	armPending(params) {
		const continuation = captureGatewayRootWorkAdmissionContinuationScope();
		if (continuation) params.pending.admissionContinuation = continuation;
		params.pending.deadlineAtMs = params.deadlineAtMs ?? (params.timeoutMs > 0 ? performance.now() + params.timeoutMs : void 0);
		this.options.pendingInvokes.set(params.requestId, params.pending);
		if (params.pending.deadlineAtMs !== void 0) {
			params.pending.cancelHardDeadline = scheduleAbsoluteDeadline(params.pending.deadlineAtMs, () => this.settleTimeout(params.requestId, params.pending), () => performance.now());
			if (this.options.pendingInvokes.get(params.requestId) !== params.pending) return;
		}
		if (params.pending.onProgress && params.idleTimeoutMs > 0) params.pending.idleTimeoutMs = params.idleTimeoutMs;
		if (params.timeoutMs === 0) this.resetIdleTimer(params.requestId, params.pending);
		if (params.signal) {
			const onAbort = () => {
				if (this.settleIfExpired(params.requestId, params.pending)) return;
				const pairingChanged = params.signal?.reason === NODE_INVOKE_PAIRING_CHANGED_ABORT;
				this.cancelPending(params.requestId, params.pending, pairingChanged ? {
					code: "PAIRING_CHANGED",
					message: "node pairing changed after dispatch"
				} : {
					code: "ABORTED",
					message: "node invoke cancelled"
				});
			};
			params.signal.addEventListener("abort", onAbort, { once: true });
			params.pending.removeAbortListener = () => params.signal?.removeEventListener("abort", onAbort);
			if (params.signal.aborted) onAbort();
		}
	}
	handleProgress(params) {
		const pending = this.getPending(params.invokeId, params.nodeId, params.connId);
		if (!pending || params.seq < pending.nextProgressSeq) return false;
		pending.receivedProgress = true;
		if (!pending.onProgress) return false;
		if (params.seq > pending.nextProgressSeq) {
			if (pending.progressChunks.has(params.seq)) return false;
			if (pending.progressChunks.size >= MAX_PENDING_PROGRESS_CHUNKS) return false;
		}
		pending.progressChunks.set(params.seq, params.chunk);
		if (!pending.idleTimer) this.resetIdleTimer(params.invokeId, pending);
		while (true) {
			const chunk = pending.progressChunks.get(pending.nextProgressSeq);
			if (chunk === void 0) break;
			if (!this.getPending(params.invokeId, params.nodeId, params.connId)) break;
			pending.progressChunks.delete(pending.nextProgressSeq);
			pending.nextProgressSeq += 1;
			try {
				pending.onProgress(chunk);
			} catch (error) {
				this.sendInvokeCancel(params.invokeId, pending);
				this.clearTimers(pending);
				this.options.pendingInvokes.delete(params.invokeId);
				pending.reject(error instanceof Error ? error : new Error(String(error)));
				break;
			}
			if (this.options.pendingInvokes.get(params.invokeId) !== pending) {
				pending.progressChunks.clear();
				break;
			}
			if (!this.getPending(params.invokeId, params.nodeId, params.connId)) break;
			this.resetIdleTimer(params.invokeId, pending);
		}
		return true;
	}
	runPendingContinuation(params) {
		const pending = this.getPending(params.invokeId, params.nodeId, params.connId);
		if (!pending) return null;
		if (pending.admissionContinuation) return pending.admissionContinuation.run(params.run);
		return pending.isCompletionAuthorized ? params.run() : null;
	}
	isPending(invokeId, nodeId, connId) {
		return this.getPending(invokeId, nodeId, connId) !== void 0;
	}
	getPending(id, nodeId, connId) {
		const pending = this.options.pendingInvokes.get(id);
		if (!pending || pending.nodeId !== nodeId || pending.connId !== connId || !this.options.isConnectionActive(pending) || this.settleIfExpired(id, pending) || this.settleIfPolicyChanged(id, pending)) return;
		try {
			return pending.isCompletionAuthorized?.() === false ? void 0 : pending;
		} catch {
			return;
		}
	}
	clearTimers(pending) {
		pending.cancelHardDeadline?.();
		pending.cancelHardDeadline = void 0;
		if (pending.idleTimer) clearTimeout(pending.idleTimer);
		pending.idleTraceContext = void 0;
		pending.removeAbortListener?.();
		pending.removeAbortListener = void 0;
		pending.admissionContinuation?.release();
		pending.admissionContinuation = void 0;
	}
	resetIdleTimer(requestId, pending) {
		if (!pending.idleTimeoutMs) return;
		pending.idleTraceContext = getActiveDiagnosticTraceContext();
		pending.idleTimer = pending.idleTimer?.refresh() ?? setTimeout(() => {
			runWithDiagnosticTraceContext(pending.idleTraceContext, () => {
				if (!this.takePending(requestId, pending)) return;
				this.sendInvokeCancel(requestId, pending);
				pending.resolve({
					ok: false,
					error: {
						code: "IDLE_TIMEOUT",
						message: "node invoke produced no progress"
					}
				});
			});
		}, pending.idleTimeoutMs);
	}
	sendInvokeCancel(requestId, pending) {
		this.options.sendCancel(requestId, pending);
	}
	settleIfExpired(requestId, pending) {
		if (pending.deadlineAtMs === void 0 || performance.now() < pending.deadlineAtMs) return false;
		this.settleTimeout(requestId, pending);
		return true;
	}
	settleTimeout(requestId, pending) {
		if (!this.takePending(requestId, pending)) return;
		this.sendInvokeCancel(requestId, pending);
		pending.resolve({
			ok: false,
			error: {
				code: "TIMEOUT",
				message: "node invoke timed out"
			}
		});
	}
	settleIfPolicyChanged(requestId, pending) {
		if (this.options.isCommandAllowed(pending.nodeId, pending.command)) return false;
		this.cancelPending(requestId, pending, {
			code: "POLICY_CHANGED",
			message: "node command is no longer allowed"
		});
		return true;
	}
	cancelPending(requestId, pending, error) {
		if (this.takePending(requestId, pending)) {
			this.sendInvokeCancel(requestId, pending);
			this.options.onFailedResult(pending);
			pending.resolve({
				ok: false,
				error
			});
		}
	}
	takePending(requestId, pending) {
		if (this.options.pendingInvokes.get(requestId) !== pending) return false;
		this.options.pendingInvokes.delete(requestId);
		this.clearTimers(pending);
		return true;
	}
};
//#endregion
export { NodeInvokeStreamController as n, NODE_INVOKE_NOT_READY as t };
