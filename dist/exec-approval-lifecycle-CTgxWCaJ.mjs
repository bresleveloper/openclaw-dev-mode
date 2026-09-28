import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { T as runWithRetainedGatewayRootWork, i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-CHv_0noy.mjs";
//#region src/gateway/exec-approval-lifecycle.ts
const EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS = 15e3;
/** Observer retirement is not an approval verdict or a durable expiry. */
var ApprovalObserverClosedError = class extends Error {
	constructor() {
		super("Gateway approval observer closed");
		this.name = "ApprovalObserverClosedError";
	}
};
/** Owns local observations and genuine decision effects, never durable decision policy. */
var ExecApprovalLifecycle = class {
	constructor() {
		this.pending = /* @__PURE__ */ new Map();
		this.retired = false;
		this.observingClosed = false;
		this.observers = /* @__PURE__ */ new Set();
		this.work = new AsyncWorkScope();
	}
	beginClose() {
		this.observingClosed = true;
		for (const close of this.observers) close();
	}
	retire() {
		if (this.retired) return;
		this.retired = true;
		this.beginClose();
		for (const [id, entry] of this.pending) {
			clearTimeout(entry.timer ?? void 0);
			clearTimeout(entry.cleanupTimer ?? void 0);
			entry.timer = null;
			entry.cleanupTimer = null;
			entry.admissionContinuation?.release();
			entry.admissionContinuation = null;
			if (entry.record.resolvedAtMs === void 0 && !this.work.hasPendingWork) for (const handoff of entry.handoffs) handoff.cancel();
			if (entry.handoffRetainCount === 0 && !this.work.hasPendingWork) this.pending.delete(id);
		}
	}
	drain() {
		this.retire();
		this.draining ??= this.work.drain().then(() => {
			for (const entry of this.pending.values()) for (const handoff of entry.handoffs) handoff.cancel();
			this.pending.clear();
		});
		return this.draining;
	}
	trackActiveWork(run) {
		this.assertNotRetired();
		return this.work.track(() => runWithRetainedGatewayRootWork(run));
	}
	/** Accepted mutations retain their result and any committed handoff through retirement. */
	trackMutation(run, recordId) {
		const entry = recordId === void 0 ? void 0 : this.pending.get(recordId);
		const previous = entry?.mutation;
		const result = this.work.track(() => runWithRetainedGatewayRootWork(() => previous ? previous.then(run) : run()));
		if (entry) {
			const settled = result.then(() => void 0, () => void 0);
			entry.mutation = settled;
			settled.then(() => {
				if (entry.mutation === settled) entry.mutation = void 0;
			});
		}
		return result;
	}
	/** Native readers cannot publish ahead of the accepted winner's process-local provenance. */
	async waitForMutations(recordId) {
		let waited = false;
		for (let mutation = this.pending.get(recordId)?.mutation; mutation; mutation = this.pending.get(recordId)?.mutation) {
			waited = true;
			await mutation;
		}
		return waited;
	}
	/** Keep publication identity with the waiter, including durable storage-repair outcomes. */
	recordLifecyclePublication(event, hasPublisher) {
		const entry = this.pending.get(event.record.id);
		if (!hasPublisher || event.phase !== "terminal" || !entry) return;
		const record = event.record;
		entry.terminalPublication = {
			kind: record.kind,
			runtimeEpoch: record.runtimeEpoch,
			status: record.status,
			decision: record.decision,
			terminalReason: record.terminalReason,
			resolvedAtMs: record.resolvedAtMs,
			updatedAtMs: record.updatedAtMs
		};
	}
	wasTerminalPublished(record) {
		const published = this.pending.get(record.id)?.terminalPublication;
		return published !== void 0 && published.kind === record.kind && published.runtimeEpoch === record.runtimeEpoch && published.status === record.status && published.decision === record.decision && published.terminalReason === record.terminalReason && published.resolvedAtMs === record.resolvedAtMs && published.updatedAtMs === record.updatedAtMs;
	}
	canUseRetainedBinding() {
		return !this.retired || getAsyncWorkSignal() === this.work.signal;
	}
	assertNotRetired() {
		if (this.retired) throw new ApprovalObserverClosedError();
	}
	registerEntry(record) {
		const decision = createDeferredCore();
		const entry = {
			record,
			resolve: decision.resolve,
			timer: null,
			cleanupTimer: null,
			handoffRetainCount: 0,
			handoffReleasedAtMs: null,
			retainForManagerLifetime: false,
			promise: decision.promise,
			handoffs: /* @__PURE__ */ new Set(),
			admissionContinuation: captureGatewayRootWorkAdmissionContinuationScope()
		};
		this.pending.set(record.id, entry);
		this.scheduleExpiryTimer(entry);
		return decision.promise;
	}
	/** Registers the real effect before an observer can leave or a synchronous verdict can win. */
	registerDecisionHandoff(recordId, run) {
		this.assertNotRetired();
		const entry = expectDefined(this.pending.get(recordId), "registered approval handoff");
		const releaseBinding = expectDefined(this.retainForHandoff(recordId), "live approval handoff");
		const completion = createDeferredCore();
		const handoff = {
			start: (decision) => {
				if (!entry.handoffs.delete(handoff)) return;
				this.work.track(() => runWithRetainedGatewayRootWork(async () => {
					try {
						await Promise.resolve();
						await run(decision);
					} finally {
						releaseBinding();
					}
				})).then(completion.resolve, completion.reject);
			},
			cancel: () => {
				if (entry.handoffs.delete(handoff)) {
					releaseBinding();
					completion.reject(new ApprovalObserverClosedError());
				}
			}
		};
		entry.handoffs.add(handoff);
		if (entry.record.resolvedAtMs !== void 0) handoff.start(entry.record.decision ?? entry.record.consumedDecision ?? null);
		return {
			observation: this.observeEntry(entry, completion.promise),
			abandon: handoff.cancel
		};
	}
	observeEntry(entry, completion) {
		const signal = getAsyncWorkSignal();
		return new Promise((resolve, reject) => {
			let settled = false;
			const finish = (settle) => {
				if (settled) return;
				settled = true;
				this.observers.delete(onClose);
				signal?.removeEventListener("abort", onClose);
				settle();
			};
			const onClose = () => {
				if (entry.record.resolvedAtMs === void 0) finish(() => reject(new ApprovalObserverClosedError()));
			};
			completion.then((value) => finish(() => resolve(value)), (error) => {
				const failure = error instanceof Error ? error : new Error(String(error), { cause: error });
				finish(() => reject(failure));
			});
			this.observers.add(onClose);
			signal?.addEventListener("abort", onClose, { once: true });
			if (this.observingClosed || signal?.aborted) onClose();
		});
	}
	settleLocalEntry(params) {
		const pending = this.pending.get(params.recordId);
		if (!pending || pending.record.resolvedAtMs !== void 0 || !this.canUseRetainedBinding()) return false;
		clearTimeout(pending.timer ?? void 0);
		pending.timer = null;
		pending.record.resolvedAtMs = params.resolvedAtMs;
		if (params.decision === null) delete pending.record.decision;
		else {
			pending.record.decision = params.decision;
			pending.record.resolutionSource = params.resolutionSource ?? "operator";
		}
		pending.record.resolvedBy = params.resolvedBy;
		pending.record.resolverKind = params.resolverKind;
		pending.record.status = params.status;
		pending.record.terminalReason = params.terminalReason;
		pending.record.runtimeEpoch = this.runtimeEpoch;
		pending.record.consumedAtMs = params.consumedAtMs ?? null;
		pending.record.consumedBy = params.consumedBy ?? null;
		delete pending.record.mcpToolApprovalActive;
		pending.retainForManagerLifetime ||= params.retainForManagerLifetime === true;
		pending.admissionContinuation?.release();
		pending.admissionContinuation = null;
		for (const handoff of pending.handoffs) handoff.start(params.decision);
		pending.resolve(params.decision);
		this.scheduleResolvedCleanup(pending);
		return true;
	}
	scheduleResolvedCleanup(entry) {
		if (this.retired || entry.cleanupTimer || entry.record.resolvedAtMs === void 0 || entry.retainForManagerLifetime || entry.handoffRetainCount > 0) return;
		const cleanupTimer = setTimeout(() => {
			if (entry.cleanupTimer !== cleanupTimer) return;
			entry.cleanupTimer = null;
			if (this.pending.get(entry.record.id) === entry && entry.handoffRetainCount === 0) this.pending.delete(entry.record.id);
		}, EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS);
		cleanupTimer.unref?.();
		entry.cleanupTimer = cleanupTimer;
	}
	resolvedGraceAnchorMs(entry, nowMs) {
		if (entry.record.resolvedAtMs === void 0) return null;
		return entry.handoffRetainCount > 0 ? nowMs : entry.handoffReleasedAtMs ?? entry.record.resolvedAtMs;
	}
	/** Final release starts a fresh grace only while the manager still owns its lifecycle. */
	retainForHandoff(recordId) {
		const entry = this.pending.get(recordId);
		if (!entry) return null;
		const nowMs = Date.now();
		const graceAnchorMs = this.resolvedGraceAnchorMs(entry, nowMs);
		if (!entry.retainForManagerLifetime && graceAnchorMs !== null && entry.handoffRetainCount === 0 && nowMs - graceAnchorMs >= 15e3) {
			this.pending.delete(recordId);
			return null;
		}
		clearTimeout(entry.cleanupTimer ?? void 0);
		entry.cleanupTimer = null;
		entry.handoffRetainCount += 1;
		let released = false;
		return () => {
			if (released) return;
			released = true;
			if (this.pending.get(recordId) !== entry) return;
			entry.handoffRetainCount = Math.max(0, entry.handoffRetainCount - 1);
			if (entry.handoffRetainCount === 0 && entry.record.resolvedAtMs !== void 0) {
				entry.handoffReleasedAtMs = Date.now();
				this.scheduleResolvedCleanup(entry);
			}
		};
	}
	scheduleExpiryTimer(entry) {
		if (this.retired) return;
		entry.timer = setTimeout(() => {
			if (this.retired || this.pending.get(entry.record.id) !== entry) return;
			this.expireDue(entry.record.id).catch((error) => {
				this.reportError(error, {
					approvalId: entry.record.id,
					operation: "expire"
				});
			});
		}, resolveTimerTimeoutMs(entry.record.expiresAtMs - Date.now(), 1));
	}
	async getSnapshot(recordId) {
		const record = this.getLocalSnapshot(recordId);
		if (!this.retired && record && record.resolvedAtMs === void 0 && record.expiresAtMs <= Date.now()) await this.expireDue(recordId);
		return this.getLocalSnapshot(recordId);
	}
	/** Pure binding lookup for synchronous resource authorization; never grants a decision. */
	getLocalSnapshot(recordId) {
		const entry = this.pending.get(recordId);
		if (!entry) return null;
		const nowMs = Date.now();
		const graceAnchorMs = this.resolvedGraceAnchorMs(entry, nowMs);
		if (entry.record.terminalReason !== "storage-corrupt" && graceAnchorMs !== null && nowMs - graceAnchorMs >= 15e3) {
			this.pending.delete(recordId);
			return null;
		}
		return entry.record;
	}
	/** Reads a live local binding without entering durable storage or mutating expiry. */
	getLiveSnapshot(recordId) {
		const entry = this.pending.get(recordId);
		if (!entry) return null;
		const nowMs = Date.now();
		if (entry.record.resolvedAtMs === void 0) return entry.record.expiresAtMs > nowMs ? entry.record : null;
		const graceAnchorMs = this.resolvedGraceAnchorMs(entry, nowMs);
		return graceAnchorMs !== null && nowMs - graceAnchorMs < 15e3 ? entry.record : null;
	}
	/**
	* One-shot ask-fallback re-admission for a timed-out approval. This is
	* pre-gate policy on the process-local record only: the durable row stays
	* `expired` and no execution authority is minted here. The shipped askFallback
	* policy (docs/tools/exec-approvals.md) still applies; system.run replay
	* uses this flag to keep re-admission single-use.
	*/
	consumeAskFallback(recordId) {
		const entry = this.pending.get(recordId);
		if (!entry) return false;
		const record = entry.record;
		if (record.resolvedAtMs === void 0 || record.decision !== void 0 || record.consumedDecision !== void 0 || record.askFallbackConsumed === true || record.status !== "expired" && record.terminalReason !== "no-route") return false;
		record.askFallbackConsumed = true;
		return true;
	}
	/** Re-enters only the pending approval's exact original root. */
	runPendingContinuation(recordId, run) {
		const entry = this.pending.get(recordId);
		if (this.retired || !entry?.admissionContinuation || entry.record.resolvedAtMs !== void 0 || entry.record.expiresAtMs <= Date.now()) return null;
		return entry.admissionContinuation.run(run);
	}
	async listPendingRecords() {
		if (this.retired) return [];
		const nowMs = Date.now();
		for (const entry of this.pending.values()) if (entry.record.resolvedAtMs === void 0 && entry.record.expiresAtMs <= nowMs) await this.expireDue(entry.record.id);
		return this.listLocalPendingRecords();
	}
	/** Closure callbacks revoke these bindings synchronously before awaiting persistence. */
	listLocalPendingRecords() {
		if (this.retired) return [];
		return Array.from(this.pending.values(), (entry) => entry.record).filter((record) => record.resolvedAtMs === void 0);
	}
	async lookupApprovalId(input, opts = {}) {
		await this.listPendingRecords();
		return this.lookupLocalApprovalId(input, opts);
	}
	lookupLocalApprovalId(input, opts = {}) {
		const rawExact = this.getLocalSnapshot(input);
		if (rawExact) return (opts.includeResolved || rawExact.resolvedAtMs === void 0) && (opts.filter?.(rawExact) ?? true) ? {
			kind: "exact",
			id: input
		} : { kind: "none" };
		const normalized = input.trim();
		if (!normalized) return { kind: "none" };
		const exact = this.getLocalSnapshot(normalized);
		if (exact) return (opts.includeResolved || exact.resolvedAtMs === void 0) && (opts.filter?.(exact) ?? true) ? {
			kind: "exact",
			id: normalized
		} : { kind: "none" };
		const lowerPrefix = normalizeLowercaseStringOrEmpty(normalized);
		const candidates = new Map(Array.from(this.pending.values(), (entry) => [entry.record.id, entry.record]));
		const matches = [];
		for (const [id, record] of candidates) {
			if (!opts.includeResolved && record.resolvedAtMs !== void 0 || opts.filter?.(record) === false) continue;
			if (normalizeLowercaseStringOrEmpty(id).startsWith(lowerPrefix)) matches.push(id);
		}
		return matches.length === 1 ? {
			kind: "prefix",
			id: expectDefined(matches[0], "approval prefix match")
		} : matches.length > 1 ? {
			kind: "ambiguous",
			ids: matches
		} : { kind: "none" };
	}
};
//#endregion
export { EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS as n, ExecApprovalLifecycle as r, ApprovalObserverClosedError as t };
