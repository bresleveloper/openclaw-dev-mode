import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { n as computeBackoff } from "./src-D1BHGNTj.mjs";
import "./backoff-BrzXG7iD.mjs";
import { u as isSqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { a as insertOperatorApproval, d as resolveOperatorApproval, i as getOperatorApprovalDetailed, o as isOperatorApprovalStoreOutcomeUnknown, r as forceDenyOperatorApproval, s as isOperatorApprovalStoreRefusal, t as consumeOperatorApprovalAllowOnce } from "./operator-approval-store-cPImwg80.mjs";
import { a as prepareExecApprovalStandingGrant, c as assertExecApprovalMutationPersistenceCurrent, d as readUncertainExecApprovalVerdict, f as runWithExecApprovalMutationPersistence, i as prepareExecApprovalRedemptionWindow, l as assertUncertainExecApprovalPersistenceCurrent, o as projectClosedApprovalResolution, r as ExecApprovalLifecycle, s as projectRepairedApprovalResolution, u as captureExecApprovalMutationPersistence } from "./exec-approval-lifecycle-CUwO1PlR.mjs";
import { i as prepareExecApprovalRegistration, n as createExecApprovalRecord, r as prepareExecApprovalPresentation } from "./exec-approval-registration-CO2Gi91C.mjs";
//#region src/gateway/exec-approval-authority.ts
var ApprovalMutationRefusedError = class extends Error {};
function isExecApprovalMutationRefused(error) {
	return collectNestedErrorCandidates(error).some((cause) => cause instanceof ApprovalMutationRefusedError) || isOperatorApprovalStoreRefusal(error);
}
/** A refused caller is not storage corruption and must not settle its pending waiter. */
function createExecApprovalMutationGuard(assertActive, assertBinding, caller) {
	return {
		family: caller.guard?.family ?? "worker",
		assertCurrent: () => {
			assertActive();
			try {
				caller.guard?.assertCurrent();
				caller.assertCurrent?.();
				assertBinding();
			} catch (error) {
				throw new ApprovalMutationRefusedError("approval resolver authority is no longer active", { cause: error });
			}
		}
	};
}
function isExecApprovalRuntimeActive(options, record) {
	const delegated = record.agentRuntimeDelegatedAuthority;
	if (delegated && options.validateAgentRuntimeDelegatedAuthority?.(delegated) !== true || record.approvalSignals?.some((signal) => signal.aborted)) return false;
	try {
		return record.approvalAuthority?.() !== false;
	} catch {
		return false;
	}
}
//#endregion
//#region src/gateway/exec-approval-expiry.ts
/** The existing pending entry owns its deadline and any definite-refusal retry. */
var ExecApprovalExpiry = class extends ExecApprovalLifecycle {
	scheduleExpiry(entry, delayMs) {
		if (this.retired || entry.record.resolvedAtMs !== void 0 || this.pending.get(entry.record.id) !== entry) return;
		entry.expiryJob?.cancel();
		entry.expiryJob = this.scheduler.schedule({
			id: `approval:${this.runtimeEpoch}:${this.approvalKind}:${entry.record.id}:expiry`,
			...delayMs === void 0 ? { atMs: entry.record.expiresAtMs } : { delayMs },
			run: async () => {
				if (this.retired || this.pending.get(entry.record.id) !== entry) return;
				entry.expiryJob = null;
				await this.expireDue(entry.record.id).catch((error) => {
					this.reportError(error, {
						approvalId: entry.record.id,
						operation: "expire"
					});
				});
			}
		});
	}
	async expireDue(recordId, authority) {
		authority?.assertCurrent();
		if (this.retired) return false;
		const entry = this.pending.get(recordId);
		if (!entry || entry.record.resolvedAtMs !== void 0) return false;
		this.assertPendingPersistenceCurrent(entry);
		let persistence = entry.expiryPersistence;
		let result;
		try {
			persistence ??= captureExecApprovalMutationPersistence(this.options.persistence);
			entry.expiryPersistence = persistence;
			result = await this.forceDenyDetailed(recordId, "timeout", {
				kind: "system",
				id: null
			}, "expired", void 0, true, null, void 0, authority?.guard);
		} catch (error) {
			if (!persistence && !isExecApprovalMutationRefused(error)) this.settleLocalStorageFailure(recordId);
			if (persistence && (isSqliteWorkerError(error, "overloaded") || isSqliteWorkerError(error, "unavailable"))) {
				assertExecApprovalMutationPersistenceCurrent(persistence);
				this.assertPendingPersistenceCurrent(entry);
				entry.expiryRefusals = (entry.expiryRefusals ?? 0) + 1;
				this.scheduleExpiry(entry, computeBackoff({
					initialMs: 1e3,
					maxMs: 3e4,
					factor: 2,
					jitter: .1
				}, entry.expiryRefusals));
			}
			throw error;
		}
		authority?.assertCurrent();
		if (result.outcome === "not-due") {
			this.scheduleExpiry(entry);
			return false;
		}
		return result.outcome === "denied" || result.outcome === "expired";
	}
};
//#endregion
//#region src/gateway/exec-approval-manager.ts
/** Approval creation and persistence precede every local wait or delivery handoff. */
var ExecApprovalManager = class extends ExecApprovalExpiry {
	constructor(options) {
		super(options.scheduler);
		this.options = options;
	}
	get approvalKind() {
		return this.options.approvalKind ?? "exec";
	}
	get runtimeEpoch() {
		return this.options.persistence.runtimeEpoch;
	}
	create(request, timeoutMs, id) {
		this.assertNotRetired();
		return createExecApprovalRecord(request, timeoutMs, id);
	}
	/** Persist registration before exposing its separate decision promise to delivery. */
	async register(record, _timeoutMs) {
		this.assertNotRetired();
		return this.trackMutation(async () => {
			const requestSignal = getAsyncWorkSignal();
			const assertCurrent = () => {
				requestSignal?.throwIfAborted();
				this.assertNotRetired();
				if (!isExecApprovalRuntimeActive(this.options, record)) throw new Error("approval authority is no longer active");
			};
			assertCurrent();
			const persistence = this.options.persistence;
			const presentation = prepareExecApprovalPresentation(this.approvalKind, record.request, this.options.resolveAllowedDecisions?.(record.request));
			const existing = this.pending.get(record.id);
			if (existing) {
				if (existing.record.resolvedAtMs === void 0) return { decision: existing.promise };
				throw new Error(`approval id '${record.id}' already resolved`);
			}
			const approval = await prepareExecApprovalRegistration({
				record,
				kind: this.approvalKind,
				presentation,
				runtimeEpoch: persistence.runtimeEpoch,
				resolveAudienceSessionKeys: this.options.resolveAudienceSessionKeys
			});
			assertCurrent();
			const inserted = await insertOperatorApproval({
				approval,
				databaseOptions: persistence.databaseOptions,
				assertCurrent
			});
			if (inserted.outcome === "conflict") throw new Error(`approval id '${record.id}' conflicts with persisted state`);
			this.assertNotRetired();
			const raced = this.pending.get(record.id);
			if (raced) {
				if (raced.record.resolvedAtMs === void 0) return { decision: raced.promise };
				throw new Error(`approval id '${record.id}' already resolved`);
			}
			const promise = this.registerEntry(record);
			for (const signal of record.approvalSignals ?? []) {
				if (signal.aborted) {
					this.scheduleAuthorityClosure(record.id);
					continue;
				}
				signal.addEventListener("abort", () => {
					this.scheduleAuthorityClosure(record.id);
				}, { once: true });
			}
			if (inserted.outcome === "inserted") this.emitLifecycle({
				phase: "pending",
				record: inserted.record
			});
			if (!isExecApprovalRuntimeActive(this.options, record)) this.scheduleAuthorityClosure(record.id);
			return { decision: promise };
		});
	}
	scheduleAuthorityClosure(recordId) {
		this.forceDenyIfRuntimeAuthorityClosed(recordId).then((closed) => {
			if (closed?.outcome === "denied" && closed.liveRecord) this.options.onExpired?.(closed.record, closed.liveRecord);
		}).catch((error) => {
			this.reportError(error, {
				approvalId: recordId,
				operation: "expire"
			});
		});
	}
	/** Persist the first verdict, then release the process-local waiter. */
	async resolveDetailed(recordId, decision, resolver, localResolvedBy = null, localResolutionSource = "operator", options = {}) {
		if (this.retired) return { outcome: "not-found" };
		options.guard?.assertCurrent();
		options.assertCurrent?.();
		const capturedEntry = this.pending.get(recordId);
		const retainedPersistence = capturedEntry?.expiryPersistence;
		this.assertPendingPersistenceCurrent(capturedEntry);
		if (decision !== "deny" && capturedEntry && !isExecApprovalRuntimeActive(this.options, capturedEntry.record)) {
			const closed = await this.forceDenyIfRuntimeAuthorityClosed(recordId);
			if (closed) return projectClosedApprovalResolution(closed);
		}
		return this.trackMutation(async () => {
			if (this.retired) return { outcome: "not-found" };
			const nowMs = Date.now();
			const localEntry = capturedEntry;
			let persistence = this.options.persistence;
			if (localEntry?.record.terminalReason === "storage-corrupt") {
				const repaired = await this.persistStorageCorruptDeny(recordId, options.assertCurrent, options.guard);
				return projectRepairedApprovalResolution(repaired, decision);
			}
			if (decision !== "deny" && !localEntry) return { outcome: "not-found" };
			const { standingGrantSpec, standingGrant } = prepareExecApprovalStandingGrant({
				decision,
				record: localEntry?.record,
				options: this.options,
				grantExpiresAtMs: options.grantExpiresAtMs
			});
			let result;
			let committedResolutionKey;
			try {
				persistence = retainedPersistence ?? captureExecApprovalMutationPersistence(persistence);
				const guard = createExecApprovalMutationGuard(() => this.assertNotRetired(), () => {
					if (retainedPersistence) assertExecApprovalMutationPersistenceCurrent(retainedPersistence);
					this.assertPendingPersistenceCurrent(localEntry);
					if (this.pending.get(recordId) !== localEntry || localEntry && localEntry.record.expiresAtMs > nowMs && localEntry.record.expiresAtMs <= Date.now() || decision !== "deny" && (!localEntry || !isExecApprovalRuntimeActive(this.options, localEntry.record))) throw new ApprovalMutationRefusedError("approval authority is no longer active");
					if (standingGrantSpec && localEntry && (JSON.stringify(this.options.resolveStandingGrantMint?.(localEntry.record.request)) !== JSON.stringify(standingGrantSpec) || standingGrantSpec.kind === "mcp-tool" && localEntry.record.mcpToolApprovalActive?.() !== true)) throw new ApprovalMutationRefusedError("approval standing grant authority is no longer active");
				}, options);
				if (retainedPersistence) guard.assertCurrent();
				result = await runWithExecApprovalMutationPersistence(persistence, () => resolveOperatorApproval({
					id: recordId,
					nowMs,
					decision,
					resolver,
					expectedKind: this.approvalKind,
					runtimeEpoch: persistence.runtimeEpoch,
					databaseOptions: persistence.databaseOptions,
					onCommitted: (key) => {
						committedResolutionKey = key;
					},
					guard,
					...standingGrant?.kind === "cron" ? { standingGrant } : {},
					...standingGrant?.kind === "mcp-tool" ? { mcpToolGrant: standingGrant } : {}
				}));
			} catch (error) {
				if (!await this.recoverUnknownVerdict(error, localEntry?.record, persistence, localResolutionSource, committedResolutionKey) && !isExecApprovalMutationRefused(error) && !this.retired && this.pending.get(recordId) === localEntry && (!localEntry || isExecApprovalRuntimeActive(this.options, localEntry.record) && localEntry.record.expiresAtMs > Date.now())) this.settleLocalStorageFailure(recordId);
				throw error;
			}
			if (this.pending.get(recordId) !== localEntry) return result;
			this.assertPendingPersistenceCurrent(localEntry);
			if (result.outcome === "resolved" && standingGrant?.kind === "placement" && localEntry && isExecApprovalRuntimeActive(this.options, localEntry.record)) this.options.retainPlacementStandingGrant?.({
				...standingGrant,
				approvalId: recordId,
				nowMs: result.record.resolvedAtMs ?? Date.now()
			});
			if (result.outcome === "resolved" || result.outcome === "expired" || result.outcome === "already-resolved") this.settleLocalFromStore(result.record, void 0, localResolvedBy, result.outcome === "resolved" ? localResolutionSource : void 0);
			else if (result.outcome === "not-found" || result.outcome === "corrupt") this.settleLocalStorageFailure(recordId);
			return "record" in result && localEntry ? {
				...result,
				liveRecord: localEntry.record
			} : result;
		}, recordId);
	}
	/** Persist a fail-closed terminal state, then release the local waiter. */
	async forceDenyDetailed(recordId, reason, resolver, status = "denied", localDecision, requireDue = false, localResolvedBy = null, assertResolverCurrent, callerGuard) {
		if (this.retired) return { outcome: "not-found" };
		callerGuard?.assertCurrent();
		assertResolverCurrent?.();
		const capturedEntry = this.pending.get(recordId);
		const retainedPersistence = capturedEntry?.expiryPersistence;
		const capturedRecord = capturedEntry?.record;
		if (!this.retired && status === "cancelled" && capturedRecord) capturedRecord.approvalAuthority = () => false;
		this.assertPendingPersistenceCurrent(capturedEntry);
		return this.trackMutation(async () => {
			if (this.retired) return { outcome: "not-found" };
			let persistence = this.options.persistence;
			const localRecord = capturedRecord;
			if (localRecord?.terminalReason === "storage-corrupt") return this.persistStorageCorruptDeny(recordId, assertResolverCurrent, callerGuard);
			let result;
			try {
				persistence = retainedPersistence ?? captureExecApprovalMutationPersistence(persistence);
				const guard = createExecApprovalMutationGuard(() => this.assertNotRetired(), () => {
					if (retainedPersistence) assertExecApprovalMutationPersistenceCurrent(retainedPersistence);
					this.assertPendingPersistenceCurrent(capturedEntry);
					if (this.pending.get(recordId) !== capturedEntry) throw new Error("approval binding changed before cancellation");
				}, {
					guard: callerGuard,
					assertCurrent: assertResolverCurrent
				});
				if (retainedPersistence) guard.assertCurrent();
				const deny = () => forceDenyOperatorApproval({
					id: recordId,
					status,
					requireDue,
					reason,
					resolver,
					expectedKind: this.approvalKind,
					runtimeEpoch: persistence.runtimeEpoch,
					databaseOptions: persistence.databaseOptions,
					guard
				});
				result = await runWithExecApprovalMutationPersistence(persistence, deny);
			} catch (error) {
				if (!await this.recoverUnknownVerdict(error, localRecord, persistence) && !isExecApprovalMutationRefused(error) && !this.retired && this.pending.get(recordId)?.record === localRecord) this.settleLocalStorageFailure(recordId);
				throw error;
			}
			if (this.pending.get(recordId)?.record !== localRecord) return result;
			this.assertPendingPersistenceCurrent(capturedEntry);
			if (result.outcome === "denied") this.settleLocalFromStore(result.record, localDecision, localResolvedBy);
			else if (result.outcome === "expired" || result.outcome === "already-terminal") this.settleLocalFromStore(result.record, void 0, localResolvedBy);
			else if (result.outcome === "not-found" || result.outcome === "corrupt") this.settleLocalStorageFailure(recordId);
			return "record" in result && localRecord ? {
				...result,
				liveRecord: localRecord
			} : result;
		}, recordId);
	}
	async recoverUnknownVerdict(error, localRecord, persistence, source = "operator", committedResolutionKey) {
		if (isOperatorApprovalStoreOutcomeUnknown(error)) this.retainUncertainVerdict(localRecord, {
			assertCurrent: () => assertExecApprovalMutationPersistenceCurrent(persistence),
			...source === "auto-review" ? { autoReview: { committedResolutionKey } } : {}
		});
		const record = await readUncertainExecApprovalVerdict(error, localRecord && this.pending.get(localRecord.id)?.record === localRecord ? localRecord : void 0, this.approvalKind, persistence);
		if (record && this.pending.get(record.id)?.record === localRecord) {
			assertUncertainExecApprovalPersistenceCurrent(error, persistence);
			if (record.status === "pending" && localRecord) this.clearUncommittedVerdict(localRecord);
			else this.settleLocalFromStore(record, void 0, record.resolver?.id ?? null);
		}
		return record !== void 0;
	}
	/** Reconciles durable truth with an existing waiter without rehydrating its request. */
	async reconcileDurableLookup(initialLookup, localResolvedBy = null, authority) {
		if (this.retired) return null;
		let lookup = initialLookup;
		const recordId = lookup.outcome === "found" ? lookup.record.id : lookup.id;
		authority?.assertCurrent();
		const waited = await this.waitForMutations(recordId);
		authority?.assertCurrent();
		if (waited) {
			const refreshed = await getOperatorApprovalDetailed({
				id: recordId,
				nowMs: Date.now(),
				databaseOptions: this.options.persistence.databaseOptions,
				guard: authority?.guard
			});
			authority?.assertCurrent();
			lookup = refreshed.outcome === "found" ? refreshed : {
				outcome: refreshed.outcome === "corrupt" ? "corrupt" : "missing",
				id: recordId
			};
		}
		if (this.retired) return null;
		const entry = this.pending.get(recordId);
		if (lookup.outcome !== "found") {
			if (entry) this.settleLocalStorageFailure(recordId);
			return null;
		}
		if (!entry || lookup.record.kind !== this.approvalKind || lookup.record.runtimeEpoch !== this.options.persistence.runtimeEpoch) return lookup.record;
		if (lookup.record.status === "pending" && entry.record.terminalReason === "storage-corrupt") {
			const repaired = await this.trackMutation(() => {
				authority?.assertCurrent();
				return this.persistStorageCorruptDeny(recordId, void 0, authority?.guard);
			}, recordId);
			return "record" in repaired ? repaired.record : null;
		}
		if (lookup.record.status !== "pending") this.settleLocalFromStore(lookup.record, void 0, localResolvedBy);
		return lookup.record;
	}
	async persistStorageCorruptDeny(recordId, assertCurrent, callerGuard) {
		callerGuard?.assertCurrent();
		assertCurrent?.();
		const localEntry = this.pending.get(recordId);
		if (!localEntry) return { outcome: "not-found" };
		const result = await forceDenyOperatorApproval({
			id: recordId,
			status: "denied",
			reason: "storage-corrupt",
			resolver: {
				kind: "system",
				id: "storage-error"
			},
			expectedKind: this.approvalKind,
			runtimeEpoch: this.runtimeEpoch,
			databaseOptions: this.options.persistence.databaseOptions,
			guard: createExecApprovalMutationGuard(() => this.assertNotRetired(), () => {
				if (this.pending.get(recordId) !== localEntry) throw new Error("approval binding changed before repair");
			}, {
				guard: callerGuard,
				assertCurrent
			})
		});
		if (result.outcome === "denied" || result.outcome === "expired") this.emitLifecycle({
			phase: "terminal",
			record: result.record
		});
		return "record" in result ? {
			...result,
			liveRecord: localEntry.record
		} : result;
	}
	async resolve(recordId, decision, resolvedBy, options = {}) {
		return (await this.resolveDetailed(recordId, decision, {
			kind: "runtime",
			id: resolvedBy ?? null
		}, resolvedBy ?? null, "operator", options)).outcome === "resolved";
	}
	/**
	* Trusted auto-review resolution (identity-matched approval runtime).
	* Always allow-once; system.run replay validation treats the resulting
	* record more strictly than an operator decision (see #103515).
	*/
	async resolveAutoReview(recordId, resolvedBy, assertCurrent, guard) {
		return (await this.resolveDetailed(recordId, "allow-once", {
			kind: "runtime",
			id: resolvedBy ?? null
		}, resolvedBy ?? null, "auto-review", {
			assertCurrent,
			guard
		})).outcome === "resolved";
	}
	async expire(recordId, resolvedBy) {
		const noRoute = resolvedBy === "no-approval-route";
		return (await this.forceDenyDetailed(recordId, noRoute ? "no-route" : "timeout", {
			kind: "system",
			id: resolvedBy ?? null
		}, noRoute ? "denied" : "expired", noRoute ? null : void 0, false, resolvedBy ?? null)).outcome === "denied";
	}
	async consumeAllowOnce(recordId, consumerId = recordId) {
		const entry = this.pending.get(recordId);
		if (!this.canUseRetainedBinding() || !entry) return false;
		if (!isExecApprovalRuntimeActive(this.options, entry.record)) {
			await this.forceDenyIfRuntimeAuthorityClosed(recordId);
			return false;
		}
		return this.trackMutation(async () => {
			const nowMs = Date.now();
			const graceAnchorMs = this.resolvedGraceAnchorMs(entry, nowMs);
			const redemptionWindowMs = prepareExecApprovalRedemptionWindow(entry.record, graceAnchorMs, nowMs);
			if (redemptionWindowMs === null) return false;
			const persistence = this.options.persistence;
			const result = await consumeOperatorApprovalAllowOnce({
				id: recordId,
				nowMs,
				consumerId,
				expectedKind: this.approvalKind,
				runtimeEpoch: persistence.runtimeEpoch,
				redemptionWindowMs,
				databaseOptions: persistence.databaseOptions,
				assertCurrent: () => {
					const currentNowMs = Date.now();
					const currentGraceAnchorMs = this.resolvedGraceAnchorMs(entry, currentNowMs);
					if (!this.canUseRetainedBinding() || this.pending.get(recordId) !== entry || !isExecApprovalRuntimeActive(this.options, entry.record) || currentGraceAnchorMs === null || currentNowMs - currentGraceAnchorMs >= 15e3) throw new ApprovalMutationRefusedError("approval authority is no longer active");
				}
			}).catch((error) => {
				if (error instanceof ApprovalMutationRefusedError) return null;
				throw error;
			});
			if (!result || result.outcome !== "consumed" || this.pending.get(recordId) !== entry) return false;
			entry.record.consumedDecision = "allow-once";
			entry.record.consumedAtMs = result.record.consumedAtMs;
			entry.record.consumedBy = result.record.consumedBy;
			return isExecApprovalRuntimeActive(this.options, entry.record);
		}, recordId);
	}
	/** Observes a registered decision; Gateway closure rejects the wait, not the approval. */
	awaitDecision(recordId) {
		this.assertNotRetired();
		this.scheduleAuthorityClosure(recordId);
		const snapshot = this.getLocalSnapshot(recordId);
		if (!snapshot) return null;
		if (snapshot.resolvedAtMs === void 0 && snapshot.expiresAtMs <= Date.now()) this.expireDue(recordId).catch((error) => {
			this.reportError(error, {
				approvalId: recordId,
				operation: "expire"
			});
		});
		const entry = this.pending.get(recordId);
		return entry ? this.observeEntry(entry, entry.promise) : null;
	}
	/** Projects an allowed decision only while its exact runtime authority is live. */
	projectDecisionIfActive(recordId, decision) {
		if (decision !== "allow-once" && decision !== "allow-always") return decision;
		const record = this.pending.get(recordId)?.record;
		if (!this.canUseRetainedBinding() || !record) return null;
		if (isExecApprovalRuntimeActive(this.options, record)) return decision;
		this.scheduleAuthorityClosure(recordId);
		return null;
	}
	/** Atomically closes a live approval whose exact runtime owner is gone. */
	async forceDenyIfRuntimeAuthorityClosed(recordId) {
		const record = this.pending.get(recordId)?.record;
		if (!record || isExecApprovalRuntimeActive(this.options, record)) return null;
		return this.forceDenyDetailed(recordId, "run-aborted", {
			kind: "system",
			id: null
		}, "cancelled");
	}
};
//#endregion
export { ExecApprovalManager as t };
