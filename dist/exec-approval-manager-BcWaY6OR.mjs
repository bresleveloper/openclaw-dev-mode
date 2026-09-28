import { r as getAsyncWorkSignal } from "./async-work-scope-CWk2dk1h.mjs";
import { a as insertOperatorApproval, c as resolveOperatorApproval, i as getOperatorApprovalDetailed, r as forceDenyOperatorApproval, t as consumeOperatorApprovalAllowOnce } from "./operator-approval-store-ZXCDEDUV.mjs";
import { n as EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS, r as ExecApprovalLifecycle } from "./exec-approval-lifecycle-CTgxWCaJ.mjs";
import { i as prepareExecApprovalRegistration, n as createExecApprovalRecord, r as prepareExecApprovalPresentation } from "./exec-approval-registration-DqssdVte.mjs";
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
function prepareExecApprovalRedemptionWindow(record, graceAnchorMs, nowMs) {
	const resolvedAtMs = record.resolvedAtMs;
	if (resolvedAtMs === void 0 || graceAnchorMs === null || nowMs - graceAnchorMs >= 15e3 || record.decision !== "allow-once" || record.consumedDecision) return null;
	return EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS + Math.max(0, graceAnchorMs - resolvedAtMs);
}
function prepareExecApprovalStorageFailure(recordId, nowMs) {
	return {
		recordId,
		decision: "deny",
		resolvedAtMs: nowMs,
		resolvedBy: "storage-error",
		resolverKind: "system",
		status: "denied",
		terminalReason: "storage-corrupt",
		retainForManagerLifetime: true
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
	const decision = params.localDecision === void 0 ? record.status === "allowed" || record.status === "denied" ? record.decision : null : params.localDecision;
	return {
		recordId: record.id,
		decision,
		resolvedAtMs: params.resolvedAtMs,
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
//#region src/gateway/exec-approval-manager.ts
var ApprovalMutationRefusedError = class extends Error {};
/** Approval creation and persistence precede every local wait or delivery handoff. */
var ExecApprovalManager = class extends ExecApprovalLifecycle {
	constructor(options) {
		super();
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
				if (!this.isRuntimeAuthorityActive(record)) throw new Error("approval authority is no longer active");
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
			if (!this.isRuntimeAuthorityActive(record)) this.scheduleAuthorityClosure(record.id);
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
	isRuntimeAuthorityActive(record) {
		const delegated = record.agentRuntimeDelegatedAuthority;
		if (delegated && this.options.validateAgentRuntimeDelegatedAuthority?.(delegated) !== true || record.approvalSignals?.some((signal) => signal.aborted)) return false;
		try {
			return record.approvalAuthority?.() !== false;
		} catch {
			return false;
		}
	}
	emitLifecycle(event) {
		try {
			this.recordLifecyclePublication(event, this.options.onLifecycle !== void 0);
			this.options.onLifecycle?.(event);
		} catch {}
	}
	/** Persist the first verdict, then release the process-local waiter. */
	async resolveDetailed(recordId, decision, resolver, localResolvedBy = null, localResolutionSource = "operator", options = {}) {
		if (this.retired) return { outcome: "not-found" };
		const capturedEntry = this.pending.get(recordId);
		if (decision !== "deny" && capturedEntry && !this.isRuntimeAuthorityActive(capturedEntry.record)) {
			const closed = await this.forceDenyIfRuntimeAuthorityClosed(recordId);
			if (closed) return projectClosedApprovalResolution(closed);
		}
		return this.trackMutation(async () => {
			if (this.retired) return { outcome: "not-found" };
			const nowMs = Date.now();
			const localEntry = capturedEntry;
			const persistence = this.options.persistence;
			if (localEntry?.record.terminalReason === "storage-corrupt") return projectRepairedApprovalResolution(await this.persistStorageCorruptDeny(recordId), decision);
			if (decision !== "deny" && !localEntry) return { outcome: "not-found" };
			const { standingGrantSpec, standingGrant } = prepareExecApprovalStandingGrant({
				decision,
				record: localEntry?.record,
				options: this.options,
				grantExpiresAtMs: options.grantExpiresAtMs
			});
			let result;
			try {
				result = await resolveOperatorApproval({
					id: recordId,
					nowMs,
					decision,
					resolver,
					expectedKind: this.approvalKind,
					runtimeEpoch: persistence.runtimeEpoch,
					databaseOptions: persistence.databaseOptions,
					assertCurrent: () => {
						this.assertNotRetired();
						try {
							options.assertCurrent?.();
						} catch (error) {
							throw new ApprovalMutationRefusedError("approval resolver authority is no longer active", { cause: error });
						}
						if (this.pending.get(recordId) !== localEntry || localEntry && localEntry.record.expiresAtMs > nowMs && localEntry.record.expiresAtMs <= Date.now() || decision !== "deny" && (!localEntry || !this.isRuntimeAuthorityActive(localEntry.record))) throw new ApprovalMutationRefusedError("approval authority is no longer active");
						if (standingGrantSpec && localEntry && (JSON.stringify(this.options.resolveStandingGrantMint?.(localEntry.record.request)) !== JSON.stringify(standingGrantSpec) || standingGrantSpec.kind === "mcp-tool" && localEntry.record.mcpToolApprovalActive?.() !== true)) throw new ApprovalMutationRefusedError("approval standing grant authority is no longer active");
					},
					...standingGrant?.kind === "cron" ? { standingGrant } : {},
					...standingGrant?.kind === "mcp-tool" ? { mcpToolGrant: standingGrant } : {}
				});
			} catch (error) {
				if (!(error instanceof ApprovalMutationRefusedError) && !this.retired && this.pending.get(recordId) === localEntry && (!localEntry || this.isRuntimeAuthorityActive(localEntry.record) && localEntry.record.expiresAtMs > Date.now())) this.settleLocalStorageFailure(recordId);
				throw error;
			}
			if (this.pending.get(recordId) !== localEntry) return result;
			if (result.outcome === "resolved" && standingGrant?.kind === "placement" && localEntry && this.isRuntimeAuthorityActive(localEntry.record)) this.options.retainPlacementStandingGrant?.({
				...standingGrant,
				approvalId: recordId,
				nowMs: result.record.resolvedAtMs ?? Date.now()
			});
			if (result.outcome === "resolved" || result.outcome === "expired" || result.outcome === "already-resolved") this.settleLocalFromStore(result.record, void 0, localResolvedBy, result.outcome === "resolved" ? localResolutionSource : "operator");
			else if (result.outcome === "not-found" || result.outcome === "corrupt") this.settleLocalStorageFailure(recordId);
			return "record" in result && localEntry ? {
				...result,
				liveRecord: localEntry.record
			} : result;
		}, recordId);
	}
	/** Persist a fail-closed terminal state, then release the local waiter. */
	async forceDenyDetailed(recordId, reason, resolver, status = "denied", localDecision, requireDue = false, localResolvedBy = null, assertResolverCurrent) {
		if (this.retired) return { outcome: "not-found" };
		const capturedRecord = this.pending.get(recordId)?.record;
		if (!this.retired && status === "cancelled" && capturedRecord) capturedRecord.approvalAuthority = () => false;
		return this.trackMutation(async () => {
			if (this.retired) return { outcome: "not-found" };
			const persistence = this.options.persistence;
			const localRecord = this.pending.get(recordId)?.record;
			if (localRecord?.terminalReason === "storage-corrupt") return this.persistStorageCorruptDeny(recordId);
			let result;
			try {
				result = await forceDenyOperatorApproval({
					id: recordId,
					status,
					requireDue,
					reason,
					resolver,
					expectedKind: this.approvalKind,
					runtimeEpoch: persistence.runtimeEpoch,
					databaseOptions: persistence.databaseOptions,
					assertCurrent: () => {
						this.assertNotRetired();
						try {
							assertResolverCurrent?.();
						} catch (error) {
							throw new ApprovalMutationRefusedError("approval resolver authority is no longer active", { cause: error });
						}
						if (this.pending.get(recordId)?.record !== localRecord) throw new Error("approval binding changed before cancellation");
					}
				});
			} catch (error) {
				if (!(error instanceof ApprovalMutationRefusedError) && !this.retired && this.pending.get(recordId)?.record === localRecord) this.settleLocalStorageFailure(recordId);
				throw error;
			}
			if (this.pending.get(recordId)?.record !== localRecord) return result;
			if (result.outcome === "denied") this.settleLocalFromStore(result.record, localDecision, localResolvedBy);
			else if (result.outcome === "expired" || result.outcome === "already-terminal") this.settleLocalFromStore(result.record, void 0, localResolvedBy);
			else if (result.outcome === "not-found" || result.outcome === "corrupt") this.settleLocalStorageFailure(recordId);
			return "record" in result && localRecord ? {
				...result,
				liveRecord: localRecord
			} : result;
		}, recordId);
	}
	settleLocalFromStore(record, localDecision, localResolvedBy = null, localResolutionSource = "operator") {
		const persistence = this.options.persistence;
		const liveRecord = this.pending.get(record.id)?.record;
		if (record.kind !== this.approvalKind || record.runtimeEpoch !== persistence.runtimeEpoch || record.status === "pending" || record.resolvedAtMs === null) return false;
		const settled = this.settleLocalEntry(prepareExecApprovalSettlement({
			record,
			resolvedAtMs: record.resolvedAtMs,
			localDecision,
			localResolvedBy,
			localResolutionSource
		}));
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
		return this.wasTerminalPublished(record);
	}
	/** Reconciles durable truth with an existing waiter without rehydrating its request. */
	async reconcileDurableLookup(initialLookup, localResolvedBy = null) {
		if (this.retired) return null;
		let lookup = initialLookup;
		const recordId = lookup.outcome === "found" ? lookup.record.id : lookup.id;
		if (await this.waitForMutations(recordId)) {
			const refreshed = await getOperatorApprovalDetailed({
				id: recordId,
				nowMs: Date.now(),
				databaseOptions: this.options.persistence.databaseOptions
			});
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
			const repaired = await this.trackMutation(() => this.persistStorageCorruptDeny(recordId), recordId);
			return "record" in repaired ? repaired.record : null;
		}
		if (lookup.record.status !== "pending") this.settleLocalFromStore(lookup.record, void 0, localResolvedBy);
		return lookup.record;
	}
	settleLocalStorageFailure(recordId) {
		this.settleLocalEntry(prepareExecApprovalStorageFailure(recordId, Date.now()));
	}
	async persistStorageCorruptDeny(recordId) {
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
			assertCurrent: () => {
				this.assertNotRetired();
				if (this.pending.get(recordId) !== localEntry) throw new Error("approval binding changed before repair");
			}
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
	reportError(error, context) {
		const onError = this.options.onError;
		if (!onError) return;
		try {
			onError(error instanceof Error ? error : new Error(String(error)), {
				...context,
				approvalKind: this.approvalKind
			});
		} catch {}
	}
	async expireDue(recordId) {
		if (this.retired) return false;
		const entry = this.pending.get(recordId);
		if (!entry || entry.record.resolvedAtMs !== void 0) return false;
		const result = await this.forceDenyDetailed(recordId, "timeout", {
			kind: "system",
			id: null
		}, "expired", void 0, true);
		if (result.outcome === "not-due") {
			this.scheduleExpiryTimer(entry);
			return false;
		}
		return result.outcome === "denied" || result.outcome === "expired";
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
	async resolveAutoReview(recordId, resolvedBy, assertCurrent) {
		return (await this.resolveDetailed(recordId, "allow-once", {
			kind: "runtime",
			id: resolvedBy ?? null
		}, resolvedBy ?? null, "auto-review", { assertCurrent })).outcome === "resolved";
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
		if (!this.isRuntimeAuthorityActive(entry.record)) {
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
					if (!this.canUseRetainedBinding() || this.pending.get(recordId) !== entry || !this.isRuntimeAuthorityActive(entry.record) || currentGraceAnchorMs === null || currentNowMs - currentGraceAnchorMs >= 15e3) throw new ApprovalMutationRefusedError("approval authority is no longer active");
				}
			}).catch((error) => {
				if (error instanceof ApprovalMutationRefusedError) return null;
				throw error;
			});
			if (!result || result.outcome !== "consumed" || this.pending.get(recordId) !== entry) return false;
			entry.record.consumedDecision = "allow-once";
			entry.record.consumedAtMs = result.record.consumedAtMs;
			entry.record.consumedBy = result.record.consumedBy;
			return this.isRuntimeAuthorityActive(entry.record);
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
		if (this.isRuntimeAuthorityActive(record)) return decision;
		this.scheduleAuthorityClosure(recordId);
		return null;
	}
	/** Atomically closes a live approval whose exact runtime owner is gone. */
	async forceDenyIfRuntimeAuthorityClosed(recordId) {
		const record = this.pending.get(recordId)?.record;
		if (!record || this.isRuntimeAuthorityActive(record)) return null;
		return this.forceDenyDetailed(recordId, "run-aborted", {
			kind: "system",
			id: null
		}, "cancelled");
	}
};
//#endregion
export { ExecApprovalManager as t };
