import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { _ as bindDeliveryQueueEntry, b as loadDeliveryQueueEntryInDatabase, w as upsertBoundDeliveryQueueEntryInDatabase } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { u as resolveEventSessionKey } from "./session-key-C09ow4h0.mjs";
import { F as completeRequesterSettleWakeState, I as consumeSubagentPauseNotice, L as ensureCompletionState, O as bindSubagentRunRecord, P as clearSubagentPendingDelivery, R as ensureDeliveryState, U as loadPendingFinalDeliveryPayload, V as isCompletedRequesterDeliveryBlocked, W as markRequesterSettleWakePending, Y as transitionRequesterSettleWakeState, h as compareSubagentRunGeneration, i as loadSubagentRunsForChildSessionFromSqlite, j as rowToSubagentRunRecord, o as readSubagentRun, s as readSubagentRunRow } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { i as upsertSubagentRunRowInDatabase, n as deleteSubagentRunRowInDatabase } from "./subagent-registry.store.kernel-5Rc86AOU.mjs";
import "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { c as prepareClaimedSessionDelivery, t as SESSION_DELIVERY_QUEUE_NAME } from "./session-delivery-queue.records-E9Zh5OLd.mjs";
import { n as captureRequesterSettleRunIdentity } from "./subagent-requester-settle-identity-Blu5INx9.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/subagents/completion/subagent-completion-queue-receipt.ts
/** Read an existing intent without invoking queue admission's receipt-pruning writes. */
function readSubagentCompletionQueueReceipt(database, id) {
	const row = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("delivery_queue_entries").select([
		"status",
		"entry_json",
		"enqueued_at"
	]).where("queue_name", "=", SESSION_DELIVERY_QUEUE_NAME).where("id", "=", id)).rows[0];
	if (!row) throw new Error("Requester outcome queue intent is unavailable for reconciliation");
	if (row.status === "completed" || row.status === "failed") return {
		id,
		status: row.status
	};
	const payload = JSON.parse(row.entry_json);
	if (row.status !== "pending" || !isRecord(payload) || payload.kind !== "systemEvent") throw new Error("Requester outcome queue intent has another owner");
	return {
		id,
		status: "pending",
		enqueuedAt: row.enqueued_at,
		payloadJson: JSON.stringify({
			kind: payload.kind,
			sessionKey: payload.sessionKey,
			agentId: payload.agentId,
			text: payload.text,
			deliveryContext: payload.deliveryContext,
			idempotencyKey: payload.idempotencyKey,
			maxRetries: payload.maxRetries,
			completionRetention: payload.completionRetention
		})
	};
}
function reconcileSubagentCompletionQueueReceipts(database, ids, receipts) {
	if (!receipts || receipts.length !== ids.length || new Set(ids).size !== ids.length) throw new Error("Requester outcome lost its committed queue receipts");
	return ids.map((id) => {
		const previous = receipts.find((receipt) => receipt.id === id);
		const current = readSubagentCompletionQueueReceipt(database, id);
		if (!previous || current.status === "pending" && !isDeepStrictEqual(current, previous)) throw new Error("Requester outcome queue intent was replaced");
		return current;
	});
}
//#endregion
//#region src/agents/subagents/completion/subagent-completion-mutation.kernel.ts
const SUSPENDED_RETENTION_MS = 6048e5;
const noMutation = (applied) => ({
	applied,
	records: [],
	retiredRunIds: [],
	queueIds: []
});
function retiredCancellationEndedAt(subagent, now) {
	const endedAt = subagent.execution.endedAt;
	if (subagent.execution.status !== "terminal" || subagent.execution.outcome?.status !== "error" || subagent.endedReason !== "subagent-killed" || typeof endedAt !== "number" || !Number.isFinite(endedAt) || typeof subagent.cleanupCompletedAt !== "number" || !Number.isFinite(subagent.cleanupCompletedAt) || subagent.cleanupCompletedAt < endedAt || subagent.pauseReason || subagent.killIntent || subagent.terminalOwner || subagent.execution.restartRecovery || subagent.suppressAnnounceReason === "steer-restart" || subagent.expectsCompletionMessage !== true || subagent.completion?.required !== true || !subagent.requesterSettleWake || subagent.delivery?.status !== "pending" || subagent.delivery.queueId || endedAt + SUSPENDED_RETENTION_MS > now) return;
	return endedAt;
}
function ownsRetiredCancellation(database, subagent, expected) {
	const newerSibling = (candidate) => candidate.childSessionKey === subagent.childSessionKey && compareSubagentRunGeneration(candidate, subagent) > 0;
	return compareSubagentRunGeneration(subagent, expected) === 0 && !loadSubagentRunsForChildSessionFromSqlite(subagent.childSessionKey, database).some(newerSibling);
}
function prepareBlockedSubagentCompletion(database, params, now, subagent) {
	const generation = params.subagent.delivery?.generation ?? 1;
	if (!subagent || subagent.execution.status !== "terminal" || !subagent.execution.outcome || subagent.pauseReason === "sessions_yield" || subagent.expectsCompletionMessage !== true || (subagent.delivery?.generation ?? 1) !== generation) return;
	const successful = subagent.execution.outcome?.status === "ok";
	if (!successful && (params.suspendedReason !== void 0 && !params.storeReplaced || ![
		"pending",
		"in_progress",
		"failed"
	].includes(subagent.delivery?.status ?? "pending"))) return;
	const retiredEndedAt = retiredCancellationEndedAt(subagent, now);
	if (retiredEndedAt !== void 0) {
		if (subagent.killReconciliation || !ownsRetiredCancellation(database, subagent, params.subagent)) return;
		const completion = ensureCompletionState(subagent);
		completion.resultText ??= null;
		completion.capturedAt ??= retiredEndedAt;
	}
	const delivery = ensureDeliveryState(subagent);
	if (params.storeReplaced && (delivery.status === "delivered" || delivery.announcedAt !== void 0 || delivery.deliveredAt !== void 0)) return;
	delivery.payload ??= loadPendingFinalDeliveryPayload(subagent);
	if (typeof params.enqueuedAt === "number") delivery.enqueuedAt ??= params.enqueuedAt;
	Object.assign(delivery, {
		status: params.suspendedReason ? "suspended" : "failed",
		disposition: params.storeReplaced ? "intentional_non_delivery" : params.suspendedReason ? "permanent_failure" : params.disposition ?? delivery.disposition,
		lastError: params.reason,
		deliveredAt: void 0,
		announcedAt: void 0,
		suspendedAt: params.suspendedReason ? delivery.suspendedAt ?? now : delivery.suspendedAt,
		suspendedReason: params.suspendedReason ?? delivery.suspendedReason,
		lastDropReason: params.lastDropReason ?? delivery.lastDropReason,
		nextAttemptAt: void 0,
		queueId: void 0
	});
	Object.assign(subagent, {
		cleanupHandled: false,
		wakeOnDescendantSettle: void 0
	});
	if (params.storeReplaced) subagent.requesterSettleWake = void 0;
	else if (params.suspendedReason) {
		if (isCompletedRequesterDeliveryBlocked(subagent)) {
			if (subagent.requesterSettleWake?.requesterYieldBatch !== true) subagent.requesterSettleWake = void 0;
		} else markRequesterSettleWakePending(subagent);
	} else subagent.suppressCompletionDelivery = true;
	const text = successful && !params.storeReplaced ? "Subagent completion delivery is blocked: " + params.reason : null;
	return {
		subagent,
		queued: text ? prepareClaimedSessionDelivery({
			kind: "systemEvent",
			sessionKey: resolveEventSessionKey(subagent.requesterSessionKey),
			...subagent.requesterAgentId ? { agentId: subagent.requesterAgentId } : {},
			text,
			...subagent.requesterOrigin ? { deliveryContext: subagent.requesterOrigin } : {},
			idempotencyKey: `subagent-completion-blocked:${subagent.runId}:generation:${generation}`
		}, 0, now) : void 0
	};
}
function commitCompletionMutations(database, mutations) {
	for (const { subagent, queued, retire } of mutations) {
		if (queued) upsertBoundDeliveryQueueEntryInDatabase(bindDeliveryQueueEntry({
			queueName: SESSION_DELIVERY_QUEUE_NAME,
			entry: queued,
			insertOnly: true
		}), database);
		if (retire) deleteSubagentRunRowInDatabase(database, subagent.runId);
		else upsertSubagentRunRowInDatabase(database, bindSubagentRunRecord(subagent));
	}
	const queueIds = mutations.flatMap(({ queued }) => queued ? [queued.id] : []);
	return {
		applied: true,
		records: mutations.filter((mutation) => !mutation.retire).map(({ subagent }) => {
			const row = readSubagentRunRow(database, subagent.runId);
			if (!row) throw new Error("Subagent completion mutation lost its native row");
			return {
				row,
				cleanupHandled: subagent.cleanupHandled
			};
		}),
		retiredRunIds: mutations.filter((mutation) => mutation.retire).map(({ subagent }) => subagent.runId),
		queueIds,
		...queueIds.length > 0 ? { queueReceipts: queueIds.map((id) => readSubagentCompletionQueueReceipt(database, id)) } : {}
	};
}
function readRequesterBatch(database, params) {
	const entries = params.entries;
	const ids = new Set(entries.map(({ subagent }) => subagent.runId));
	const first = entries[0]?.subagent;
	const cohort = first?.requesterSettleWake?.batchRunIds?.toSorted().join("\0");
	const checkedOmittedIds = /* @__PURE__ */ new Set();
	return entries.map(({ subagent: expected }) => {
		const changedOwner = () => /* @__PURE__ */ new Error("subagent completion owner changed before settlement: " + expected.runId);
		const subagent = readSubagentRun(database, expected.runId);
		if (!subagent || !subagent.requesterSettleWake || subagent.requesterSessionKey !== first?.requesterSessionKey || subagent.requesterAgentId !== first?.requesterAgentId || subagent.requesterSettleWake.rearmGeneration !== first?.requesterSettleWake?.rearmGeneration || subagent.requesterSettleWake.batchRunIds?.toSorted().join("\0") !== cohort) throw changedOwner();
		for (const id of params.kind === "requesterBatch" && !(subagent.pauseReason === "sessions_yield" && subagent.requesterSettleWake.pauseNotice) ? subagent.requesterSettleWake?.batchRunIds ?? [] : []) if (!ids.has(id) && !checkedOmittedIds.has(id)) {
			const member = readSubagentRun(database, id);
			if (member?.requesterSettleWake && member.requesterSettleWake.rearmGeneration === subagent.requesterSettleWake?.rearmGeneration) throw changedOwner();
			checkedOmittedIds.add(id);
		}
		subagent.cleanupHandled = expected.cleanupHandled;
		return {
			expected,
			subagent
		};
	});
}
function settleRequesterBatch(database, params) {
	if (params.committed) return reconcileRequesterWake(database, params);
	const now = params.now;
	return commitCompletionMutations(database, readRequesterBatch(database, params).map(({ expected, subagent }) => {
		if (consumeSubagentPauseNotice(subagent)) {
			if (params.outcome.storeReplaced || params.outcome.disposition === "intentional_non_delivery") subagent.requesterSettleWake = void 0;
			return { subagent };
		}
		const changedOwner = () => /* @__PURE__ */ new Error("subagent completion owner changed before settlement: " + expected.runId);
		const acknowledgeExpiredDelivery = params.outcome.delivered && subagent.delivery?.status === "suspended" && subagent.delivery.suspendedReason === "expiry";
		let mutation = { subagent };
		if (subagent.pauseReason !== "sessions_yield" && subagent.expectsCompletionMessage === true && (["pending", "in_progress"].includes(subagent.delivery?.status ?? "pending") || acknowledgeExpiredDelivery)) {
			if (params.outcome.delivered) {
				const delivery = ensureDeliveryState(subagent);
				const deliveredAt = params.outcome.deliveredAt ?? now;
				Object.assign(delivery, {
					status: "delivered",
					disposition: "delivered",
					deliveredAt,
					announcedAt: deliveredAt,
					lastDropReason: void 0
				});
				clearSubagentPendingDelivery(subagent);
			} else {
				const blocked = prepareBlockedSubagentCompletion(database, {
					subagent: expected,
					reason: params.outcome.error ?? params.outcome.reason ?? "requester settle wake failed",
					disposition: params.outcome.disposition,
					storeReplaced: params.outcome.storeReplaced,
					suspendedReason: params.outcome.storeReplaced ? "permanent_failure" : void 0
				}, now, subagent);
				if (!blocked) throw changedOwner();
				mutation = blocked;
			}
		}
		mutation.retire = completeRequesterSettleWakeState(mutation.subagent);
		return mutation;
	}));
}
function reconcileRequesterWake(database, params) {
	const committed = params.committed;
	if (!committed || committed.result.applied !== true || params.kind === "requesterWake" && committed.result.queueIds.length !== 0) throw new Error("Requester wake reconciliation requires its committed native receipt");
	const result = noMutation(true);
	for (const { subagent: expected } of params.entries) {
		const original = committed.entries.find(({ subagent }) => subagent.runId === expected.runId)?.subagent;
		const originalCanonical = original && rowToSubagentRunRecord(bindSubagentRunRecord(original));
		const expectedCanonical = rowToSubagentRunRecord(bindSubagentRunRecord(expected));
		if (!originalCanonical || !expectedCanonical || !isDeepStrictEqual(captureRequesterSettleRunIdentity(originalCanonical), captureRequesterSettleRunIdentity(expectedCanonical))) throw new Error("Requester wake reconciliation lost its original generation");
		const row = readSubagentRunRow(database, expected.runId);
		if (loadSubagentRunsForChildSessionFromSqlite(originalCanonical.childSessionKey, database).some((candidate) => compareSubagentRunGeneration(candidate, originalCanonical) > 0)) throw new Error("Requester wake reconciliation was superseded");
		if (committed.result.retiredRunIds.includes(expected.runId)) {
			if (row) throw new Error("Requester wake retirement has another native owner");
			result.retiredRunIds.push(expected.runId);
			continue;
		}
		const acknowledged = committed.result.records.find(({ row: record }) => record.run_id === expected.runId);
		const intended = acknowledged && rowToSubagentRunRecord(acknowledged.row);
		const current = row && rowToSubagentRunRecord(row);
		if (!row || !current || !intended || !isDeepStrictEqual(captureRequesterSettleRunIdentity(current), captureRequesterSettleRunIdentity(originalCanonical)) || !isDeepStrictEqual(captureRequesterSettleRunIdentity(intended), captureRequesterSettleRunIdentity(originalCanonical)) || current.pauseReason !== intended.pauseReason || current.completionTarget !== intended.completionTarget || current.expectsCompletionMessage !== intended.expectsCompletionMessage || current.delivery?.generation !== intended.delivery?.generation || !isDeepStrictEqual(current.execution, intended.execution) || !isDeepStrictEqual(current.killIntent, intended.killIntent) || !isDeepStrictEqual(current.killReconciliation, intended.killReconciliation) || !isDeepStrictEqual(current.requesterSettleWake, intended.requesterSettleWake) || current.retireAfterRequesterTurn !== intended.retireAfterRequesterTurn || params.kind === "requesterBatch" && (!isDeepStrictEqual(current.delivery, intended.delivery) || current.suppressCompletionDelivery !== intended.suppressCompletionDelivery || current.wakeOnDescendantSettle !== intended.wakeOnDescendantSettle)) throw new Error("Requester wake committed state no longer owns reconciliation");
		result.records.push({
			row,
			cleanupHandled: expected.cleanupHandled
		});
	}
	if (committed.result.queueIds.length > 0) {
		const receipts = reconcileSubagentCompletionQueueReceipts(database, committed.result.queueIds, committed.result.queueReceipts).filter((receipt) => receipt.status === "pending");
		result.queueIds = receipts.map(({ id }) => id);
		if (receipts.length > 0) result.queueReceipts = receipts;
	}
	return result;
}
function mutateRequesterWake(database, params) {
	if (params.committed) return reconcileRequesterWake(database, params);
	return commitCompletionMutations(database, readRequesterBatch(database, params).map(({ subagent }) => {
		if (params.operation.kind === "complete") return {
			subagent,
			retire: completeRequesterSettleWakeState(subagent)
		};
		if (subagent.pauseReason === "sessions_yield" && Boolean(subagent.requesterSettleWake?.pauseNotice) !== Boolean(params.operation.state.pauseNotice)) throw new Error("Requester pause notice changed before transition");
		if (subagent.requesterSettleWake?.yieldedFinalDeliverable === true !== (params.operation.state.yieldedFinalDeliverable === true)) throw new Error("Requester wake reply policy changed before transition");
		transitionRequesterSettleWakeState(subagent, params.operation.state);
		return { subagent };
	}));
}
/** Worker transaction owner supplies the handle and live admission before/after this mutation. */
function mutateSubagentCompletionInDatabase(database, mutation) {
	switch (mutation.kind) {
		case "settle": {
			const queued = loadDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, mutation.queueId, "pending");
			const owner = queued?.kind === "agentTurn" ? queued.owner : void 0;
			const row = readSubagentRunRow(database, mutation.expected.runId);
			const current = row && rowToSubagentRunRecord(row);
			if (!current || !queued || !owner || owner.kind !== "subagent_completion" || owner.runId !== current.runId || owner.generation !== current.delivery?.generation || owner.deadlineAt !== current.delivery.deadlineAt || (queued.settlementOutcome ?? (queued.acknowledgedAt !== void 0 ? "recovered" : void 0)) !== "recovered" || compareSubagentRunGeneration(current, mutation.expected) !== 0 || current.childSessionKey !== mutation.expected.childSessionKey || current.requesterSessionKey !== mutation.expected.requesterSessionKey || current.requesterStorePath !== mutation.expected.requesterStorePath) throw new Error("Subagent completion recovery lost its queue or native owner");
			if (current.delivery.status === "delivered" && current.delivery.queueId === void 0) return {
				applied: true,
				records: [{
					row,
					cleanupHandled: mutation.expected.cleanupHandled
				}],
				retiredRunIds: [],
				queueIds: []
			};
			if (current.delivery.queueId !== mutation.queueId) throw new Error("Subagent completion owner changed before settlement");
			return commitCompletionMutations(database, [{ subagent: mutation.subagent }]);
		}
		case "block": {
			const prepared = prepareBlockedSubagentCompletion(database, mutation.params, mutation.now, readSubagentRun(database, mutation.params.subagent.runId));
			return prepared ? commitCompletionMutations(database, [prepared]) : noMutation(false);
		}
		case "reconcileCancelled": {
			const { expected, now } = mutation;
			const endedAt = retiredCancellationEndedAt(expected, now);
			const marker = expected.killReconciliation;
			if (endedAt === void 0 || !marker) return noMutation(null);
			if (!Number.isFinite(marker.killedAt) || marker.killedAt > endedAt) return noMutation(false);
			const current = readSubagentRun(database, expected.runId);
			if (!current || retiredCancellationEndedAt(current, now) !== endedAt || !ownsRetiredCancellation(database, current, expected)) return noMutation(false);
			current.killReconciliation = void 0;
			return commitCompletionMutations(database, [{ subagent: current }]);
		}
		case "requesterBatch": return settleRequesterBatch(database, mutation);
		case "requesterWake": return mutateRequesterWake(database, mutation);
	}
	throw new Error("Unknown subagent completion mutation");
}
//#endregion
export { retiredCancellationEndedAt as n, mutateSubagentCompletionInDatabase as t };
