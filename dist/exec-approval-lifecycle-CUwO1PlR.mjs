import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { o as runWithCapturedWorkerContext } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { T as runWithRetainedGatewayRootWork, i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { u as getOperatorApprovalResolutionKey } from "./operator-approval-store.rows-CUyuQiIg.mjs";
import { i as getOperatorApprovalDetailed, o as isOperatorApprovalStoreOutcomeUnknown } from "./operator-approval-store-cPImwg80.mjs";
//#region src/gateway/exec-approval-recovery.ts
/** Bind recovery to the same physical target before the original verdict can yield. */
function captureExecApprovalMutationPersistence(persistence) {
	const { databaseOptions, runtimeEpoch } = persistence;
	const context = captureOpenClawStateWorkerContext({
		...databaseOptions,
		path: databaseOptions?.database?.path ?? databaseOptions?.path
	});
	return {
		runtimeEpoch,
		databaseOptions: {
			path: context.admission.databasePath,
			env: context.environment
		},
		workerContext: context
	};
}
/** Keep later work inside the original write target's maintenance and schema scope. */
function runWithExecApprovalMutationPersistence(persistence, operation) {
	assertExecApprovalMutationPersistenceCurrent(persistence);
	const context = expectDefined(persistence.workerContext, "Approval mutation worker context");
	return runWithCapturedWorkerContext(context, operation);
}
/** Recovery may observe only the original physical owner, including before local publication. */
function assertExecApprovalMutationPersistenceCurrent(persistence) {
	const context = expectDefined(persistence.workerContext, "Approval mutation worker context");
	context.admission.assertCurrent();
	context.maintenanceScope?.assertAdmission();
}
function assertUncertainExecApprovalPersistenceCurrent(error, persistence) {
	try {
		assertExecApprovalMutationPersistenceCurrent(persistence);
	} catch (admissionError) {
		throw new AggregateError([error, admissionError], "Approval verdict remains uncertain after readback", { cause: admissionError });
	}
}
/** Read the durable winner without retrying a verdict or deciding a pending row. */
async function readUncertainExecApprovalVerdict(error, localRecord, kind, persistence) {
	if (!isOperatorApprovalStoreOutcomeUnknown(error)) return;
	if (!localRecord) return null;
	const { id, createdAtMs } = localRecord;
	const { runtimeEpoch, databaseOptions } = persistence;
	assertUncertainExecApprovalPersistenceCurrent(error, persistence);
	const context = expectDefined(persistence.workerContext, "Approval mutation worker context");
	try {
		const lookup = await runWithCapturedWorkerContext(context, () => getOperatorApprovalDetailed({
			id,
			nowMs: createdAtMs,
			databaseOptions,
			guard: {
				family: "worker",
				assertCurrent: () => {
					context.admission.assertCurrent();
					context.maintenanceScope?.assertOwnerCurrent();
				}
			}
		}));
		assertUncertainExecApprovalPersistenceCurrent(error, persistence);
		return lookup.outcome === "found" && lookup.record.id === id && lookup.record.kind === kind && lookup.record.runtimeEpoch === runtimeEpoch && lookup.record.createdAtMs === createdAtMs ? lookup.record : null;
	} catch (readError) {
		throw new AggregateError([error, readError], "Approval verdict remains uncertain after readback", { cause: readError });
	}
}
//#endregion
//#region src/gateway/exec-approval-results.ts
function prepareExecApprovalStandingGrant(params) {
	let standingGrantSpec = params.decision === "allow-always" && params.record ? params.options.resolveStandingGrantMint?.(params.record.request) ?? void 0 : void 0;
	if (standingGrantSpec?.kind === "mcp-tool" && params.record?.mcpToolApprovalActive?.() !== true) standingGrantSpec = void 0;
	const standingGrant = standingGrantSpec ? {
		...standingGrantSpec,
		expiresAtMs: params.grantExpiresAtMs !== void 0 ? params.grantExpiresAtMs : params.options.resolveStandingGrantExpiresAtMs?.(Date.now()) ?? null
	} : void 0;
	return {
		standingGrantSpec,
		standingGrant
	};
}
function projectClosedApprovalResolution(closed) {
	if (closed.outcome === "not-found" || closed.outcome === "corrupt") return closed;
	return {
		outcome: "already-resolved",
		retry: "conflict",
		record: closed.record,
		...closed.liveRecord ? { liveRecord: closed.liveRecord } : {}
	};
}
function projectRepairedApprovalResolution(repaired, decision) {
	if (repaired.outcome === "expired" || repaired.outcome === "not-found" || repaired.outcome === "corrupt") return repaired;
	if (repaired.outcome === "denied" && decision === "deny") return {
		outcome: "resolved",
		record: repaired.record,
		...repaired.liveRecord ? { liveRecord: repaired.liveRecord } : {}
	};
	return {
		outcome: "already-resolved",
		retry: repaired.record.decision === decision ? "same" : "conflict",
		record: repaired.record,
		...repaired.liveRecord ? { liveRecord: repaired.liveRecord } : {}
	};
}
function prepareExecApprovalSettlement(params) {
	const { record } = params;
	if (record.kind !== params.expectedKind || record.runtimeEpoch !== params.runtimeEpoch || record.status === "pending" || record.resolvedAtMs === null) return null;
	const answered = record.status === "allowed" || record.status === "denied" && record.terminalReason !== "no-route";
	const decision = params.localDecision === void 0 ? answered ? record.decision : null : params.localDecision;
	return {
		recordId: record.id,
		decision,
		resolvedAtMs: record.resolvedAtMs,
		resolvedBy: params.localResolvedBy,
		resolverKind: record.resolver?.kind ?? null,
		status: record.status,
		terminalReason: record.terminalReason,
		consumedAtMs: record.consumedAtMs,
		consumedBy: record.consumedBy,
		resolutionSource: params.localResolutionSource
	};
}
//#endregion
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
	constructor(scheduler) {
		this.scheduler = scheduler;
		this.pending = /* @__PURE__ */ new Map();
		this.retired = false;
		this.observingClosed = false;
		this.observers = /* @__PURE__ */ new Set();
		this.work = new AsyncWorkScope();
	}
	emitLifecycle(event) {
		try {
			const { record } = event;
			const entry = this.pending.get(record.id);
			if (this.options.onLifecycle !== void 0 && event.phase === "terminal" && entry) entry.terminalPublication = {
				kind: record.kind,
				runtimeEpoch: record.runtimeEpoch,
				status: record.status,
				decision: record.decision,
				terminalReason: record.terminalReason,
				resolvedAtMs: record.resolvedAtMs,
				updatedAtMs: record.updatedAtMs
			};
			this.options.onLifecycle?.(event);
		} catch {}
	}
	retainUncertainVerdict(record, uncertainty) {
		const entry = record ? this.pending.get(record.id) : void 0;
		if (entry && entry.record === record && record.resolvedAtMs === void 0) {
			entry.uncertainVerdict ??= uncertainty;
			if (uncertainty.autoReview && !entry.uncertainVerdict.autoReview?.committedResolutionKey) entry.uncertainVerdict.autoReview = uncertainty.autoReview;
		}
	}
	assertPendingPersistenceCurrent(entry) {
		entry?.uncertainVerdict?.assertCurrent();
		if (entry?.expiryPersistence) assertExecApprovalMutationPersistenceCurrent(entry.expiryPersistence);
	}
	clearUncommittedVerdict(record) {
		const entry = this.pending.get(record.id);
		if (entry?.record === record && !entry.uncertainVerdict?.autoReview?.committedResolutionKey) {
			this.assertPendingPersistenceCurrent(entry);
			delete entry.uncertainVerdict;
		}
	}
	settleLocalStorageFailure(recordId) {
		this.settleLocalEntry({
			recordId,
			decision: "deny",
			resolvedAtMs: Date.now(),
			resolvedBy: "storage-error",
			resolverKind: "system",
			status: "denied",
			terminalReason: "storage-corrupt",
			retainForManagerLifetime: true
		});
	}
	settleLocalFromStore(record, localDecision, localResolvedBy = null, localResolutionSource) {
		const entry = this.pending.get(record.id);
		const liveRecord = entry?.record;
		const uncertainty = entry?.uncertainVerdict;
		let observedSource = "operator";
		if (localResolutionSource === void 0 && uncertainty) {
			if (uncertainty.autoReview && record.status === "allowed" && record.decision === "allow-once") {
				if (uncertainty.autoReview.committedResolutionKey === getOperatorApprovalResolutionKey(record)) observedSource = "auto-review";
				else if (record.resolver?.kind === "runtime") return false;
			}
		}
		const settlement = prepareExecApprovalSettlement({
			record,
			expectedKind: this.approvalKind,
			runtimeEpoch: this.runtimeEpoch,
			localDecision,
			localResolvedBy,
			localResolutionSource: localResolutionSource ?? observedSource
		});
		if (!settlement) return false;
		const settled = this.settleLocalEntry(settlement);
		if (settled) {
			this.emitLifecycle({
				phase: "terminal",
				record
			});
			if (record.status === "expired" && liveRecord) try {
				this.options.onExpired?.(record, liveRecord);
			} catch (error) {
				this.reportError(error, {
					approvalId: record.id,
					operation: "expire"
				});
			}
		}
		return settled;
	}
	/** Settle one durable terminal transition and report whether this manager published it. */
	async reconcileDurableTerminal(record) {
		await this.waitForMutations(record.id);
		this.settleLocalFromStore(record);
		const published = this.pending.get(record.id)?.terminalPublication;
		return published !== void 0 && published.kind === record.kind && published.runtimeEpoch === record.runtimeEpoch && published.status === record.status && published.decision === record.decision && published.terminalReason === record.terminalReason && published.resolvedAtMs === record.resolvedAtMs && published.updatedAtMs === record.updatedAtMs;
	}
	reportError(error, context) {
		try {
			this.options.onError?.(error instanceof Error ? error : new Error(String(error)), {
				...context,
				approvalKind: this.approvalKind
			});
		} catch {}
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
			entry.expiryJob?.cancel();
			entry.cleanupJob?.cancel();
			entry.expiryJob = null;
			entry.cleanupJob = null;
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
			expiryJob: null,
			cleanupJob: null,
			handoffRetainCount: 0,
			handoffReleasedAtMs: null,
			retainForManagerLifetime: false,
			promise: decision.promise,
			handoffs: /* @__PURE__ */ new Set(),
			admissionContinuation: captureGatewayRootWorkAdmissionContinuationScope()
		};
		this.pending.set(record.id, entry);
		this.scheduleExpiry(entry);
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
		this.assertPendingPersistenceCurrent(pending);
		delete pending.uncertainVerdict;
		delete pending.expiryPersistence;
		delete pending.expiryRefusals;
		pending.expiryJob?.cancel();
		pending.expiryJob = null;
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
		if (this.retired || entry.cleanupJob || entry.record.resolvedAtMs === void 0 || entry.retainForManagerLifetime || entry.handoffRetainCount > 0) return;
		entry.cleanupJob = this.scheduler.schedule({
			id: `approval:${this.runtimeEpoch}:${this.approvalKind}:${entry.record.id}:cleanup`,
			delayMs: EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS,
			run: () => {
				entry.cleanupJob = null;
				if (this.pending.get(entry.record.id) === entry && entry.handoffRetainCount === 0) this.pending.delete(entry.record.id);
			}
		});
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
		entry.cleanupJob?.cancel();
		entry.cleanupJob = null;
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
	async getSnapshot(recordId, authority) {
		authority?.assertCurrent();
		const record = this.getLocalSnapshot(recordId);
		if (!this.retired && record && record.resolvedAtMs === void 0 && record.expiresAtMs <= Date.now()) await this.expireDue(recordId, authority);
		authority?.assertCurrent();
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
	async listPendingRecords(authority) {
		authority?.assertCurrent();
		if (this.retired) return [];
		const nowMs = Date.now();
		for (const entry of this.pending.values()) if (entry.record.resolvedAtMs === void 0 && entry.record.expiresAtMs <= nowMs) {
			await this.expireDue(entry.record.id, authority);
			authority?.assertCurrent();
		}
		return this.listLocalPendingRecords();
	}
	/** Closure callbacks revoke these bindings synchronously before awaiting persistence. */
	listLocalPendingRecords() {
		if (this.retired) return [];
		return Array.from(this.pending.values(), (entry) => entry.record).filter((record) => record.resolvedAtMs === void 0);
	}
	async lookupApprovalId(input, opts = {}) {
		await this.listPendingRecords(opts.authority);
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
function prepareExecApprovalRedemptionWindow(record, graceAnchorMs, nowMs) {
	const resolvedAtMs = record.resolvedAtMs;
	if (resolvedAtMs === void 0 || graceAnchorMs === null || nowMs - graceAnchorMs >= 15e3 || record.decision !== "allow-once" || record.consumedDecision) return null;
	return EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS + Math.max(0, graceAnchorMs - resolvedAtMs);
}
//#endregion
export { prepareExecApprovalStandingGrant as a, assertExecApprovalMutationPersistenceCurrent as c, readUncertainExecApprovalVerdict as d, runWithExecApprovalMutationPersistence as f, prepareExecApprovalRedemptionWindow as i, assertUncertainExecApprovalPersistenceCurrent as l, EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS as n, projectClosedApprovalResolution as o, ExecApprovalLifecycle as r, projectRepairedApprovalResolution as s, ApprovalObserverClosedError as t, captureExecApprovalMutationPersistence as u };
