import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { a as generateSecureUuid } from "./secure-random-BJtJxP9Y.mjs";
import { n as OutboundDeliveryError } from "./deliver-types-Diy-VQKA.mjs";
import { d as prepareDeliveryQueueTerminalEntry, g as upsertDeliveryQueueEntryInDatabase } from "./delivery-queue-sqlite.kernel-Pf7zU9zY.mjs";
import { n as resolveDeliveryQueueStateEnv, t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import { d as updateDeliveryQueueEntry, f as executeDeliveryQueueOperation, l as reserveDeliveryQueueEntryAttempt, o as loadDeliveryQueueEntries, s as loadDeliveryQueueEntry, u as terminalizePendingDeliveryQueueEntry } from "./delivery-queue-sqlite-BghoE75G.mjs";
import { a as upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase, c as retireUnsentDeliveryInDatabase, f as dispatchDeliveryQueueEntryPlatformSendInDatabase, g as acceptedPreparedOutboundEntries, h as transitionOwnedDeliveryQueueEntryInDatabase, i as replacePendingDeliveryQueueEntryInDatabase, n as completePendingDeliveryQueueEntryInDatabase, p as promoteDeliveryQueueEntryPlatformSendInDatabase, r as movePendingDeliveryQueueEntryNamespaceInDatabase, v as createUnmodifiedPreparedOutboundBatch, x as projectPreparedOutboundBatchForStorage } from "./delivery-queue-sqlite-namespace.kernel-CbSzRfE6.mjs";
import { n as collectEntrySpoolPaths } from "./delivery-queue-media-paths-BxTKmyok.mjs";
import { a as OUTBOUND_DELIVERY_QUEUE_NAME, i as OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME, n as LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, o as OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, r as OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME } from "./delivery-queue-namespaces-CO-cZrdV.mjs";
import { t as cancelDeliveryQueueMediaRetention } from "./delivery-queue-media-staging-CNnanQB_.mjs";
import { n as releaseSpoolArtifacts } from "./delivery-queue-media-spool-Ybjx6uOd.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/delivery-queue-sqlite-claim.ts
/** Runs an existing queue mutation only while its exact platform owner survives. */
function transitionOwnedDeliveryQueueEntry(params, transition, context) {
	return runOpenClawStateWriteTransaction((database) => transitionOwnedDeliveryQueueEntryInDatabase(database, params, transition), {
		database: params.database,
		env: resolveDeliveryQueueStateEnv(params.stateDir, context)
	}, { operationLabel: `mutate owned ${params.queueName} delivery platform send` });
}
/** Atomically fence the exact unexpired owner at the real provider boundary. */
function promoteDeliveryQueueEntryPlatformSend(params, context) {
	return runOpenClawStateWriteTransaction((database) => promoteDeliveryQueueEntryPlatformSendInDatabase(database, params), { env: resolveDeliveryQueueStateEnv(params.stateDir, context) }, { operationLabel: `promote ${params.queueName} delivery platform send` });
}
/** Atomically authorize dispatch, promoting a producer claim into the active attempt. */
function dispatchDeliveryQueueEntryPlatformSend(params, context) {
	return runOpenClawStateWriteTransaction((database) => dispatchDeliveryQueueEntryPlatformSendInDatabase(database, params), { env: resolveDeliveryQueueStateEnv(params.stateDir, context) }, { operationLabel: `dispatch ${params.queueName} delivery platform send` });
}
//#endregion
//#region src/infra/outbound/delivery-queue-ack.ts
/** Retires an unsent live claim while its adapter preparation still owns resources. */
function retireUnsentDelivery(params, context, terminalOutcome) {
	const stateDir = context?.stateDir ?? params.stateDir;
	const retired = runOpenClawStateWriteTransaction((database) => retireUnsentDeliveryInDatabase(database, {
		...params,
		stateDir
	}, terminalOutcome), { env: resolveDeliveryQueueStateEnv(stateDir, context) }, { operationLabel: `mutate owned ${OUTBOUND_DELIVERY_QUEUE_NAME} delivery platform send` });
	if (!retired) return;
	return async () => {
		try {
			await releaseSpoolArtifacts(retired.spoolPaths, stateDir);
		} finally {
			cancelDeliveryQueueMediaRetention(retired.retention, stateDir, context);
		}
	};
}
/** Remove a successfully delivered entry, or retain its producer-owned receipt. */
async function ackDelivery(id, requestedStateDir, options, context) {
	const captured = context ?? captureDeliveryQueueStateContext(requestedStateDir);
	const stateDir = captured.stateDir;
	const capturedOptions = options ? {
		retainSpoolArtifacts: options.retainSpoolArtifacts,
		suppressCompletionReceipt: options.suppressCompletionReceipt,
		..."expectedPlatformSendAttemptId" in options ? { expectedPlatformSendAttemptId: options.expectedPlatformSendAttemptId } : {}
	} : void 0;
	const spoolPaths = await executeDeliveryQueueOperation(captured, stateDir, {
		type: "deliveryQueue.ack",
		input: {
			id,
			stateDir,
			options: capturedOptions
		}
	});
	if (!capturedOptions?.retainSpoolArtifacts) await releaseSpoolArtifacts(spoolPaths, stateDir);
}
/** Conditionally dead-letter a freshly re-read pending entry without a claimed state. */
async function failPendingDelivery(params, requestedStateDir, context) {
	const terminal = {
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id: params.id,
		entry: params.entry
	};
	const prepared = params.expectedPlatformSendAttemptId === void 0 ? prepareDeliveryQueueTerminalEntry(terminal) : void 0;
	const captured = context ?? captureDeliveryQueueStateContext(requestedStateDir);
	const stateDir = captured.stateDir;
	const { result, spoolPaths } = await executeDeliveryQueueOperation(captured, stateDir, {
		type: "deliveryQueue.failPending",
		input: {
			id: params.id,
			entryJson: prepared?.expectedJson ?? JSON.stringify(params.entry),
			expectedPlatformSendAttemptId: params.expectedPlatformSendAttemptId,
			retainSpoolArtifacts: params.retainSpoolArtifacts,
			stateDir,
			prepared: prepared ? structuredClone(prepared) : void 0
		}
	});
	if (result.status === "failed") await releaseSpoolArtifacts(spoolPaths, stateDir);
	return result;
}
//#endregion
//#region src/infra/outbound/delivery-queue-platform-lease.ts
/** Atomically transfer a stable pending producer intent to one platform sender. */
async function claimDeliveryPlatformSendAttempt(id, stateDir, reconciledPlatformSendStartedAt, reconciledPlatformSendAttemptId, context) {
	return executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.claimPlatformSend",
		input: {
			queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
			id,
			claimId: generateSecureUuid(),
			...reconciledPlatformSendStartedAt !== void 0 ? { reconciledPlatformSendStartedAt } : {},
			...reconciledPlatformSendAttemptId !== void 0 ? { reconciledPlatformSendAttemptId } : {}
		}
	});
}
/** Claim and atomically upgrade a live reusable producer to renewable ownership. */
async function claimReusableDeliveryPlatformSendAttempt(id, stateDir, context) {
	return executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.claimPlatformSend",
		input: {
			queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
			id,
			claimId: generateSecureUuid(),
			requiresProducerClaim: true
		}
	});
}
/** Extend the exact active producer lease without changing ownership. */
async function renewDeliveryPlatformSendLease(id, stateDir, claimId, context) {
	return executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.renewPlatformSendLease",
		input: {
			queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
			id,
			claimId
		}
	});
}
/** Promote or refresh the exact live owner at recipient-visible dispatch. */
function markOwnedDeliveryPlatformSendDispatched(id, stateDir, route, claimId, context) {
	if (!dispatchDeliveryQueueEntryPlatformSend({
		queueName: "outbound-prepared-v1",
		id,
		stateDir,
		route,
		claimId
	}, context)) throw new Error(`Delivery platform claim was lost: ${id}`);
}
//#endregion
//#region src/infra/delivery-queue-sqlite-namespace.ts
/** Inserts one stable owner only when no current or retired namespace owns its id. */
function upsertDeliveryQueueEntryOnceAcrossNamespaces(params, context) {
	return runOpenClawStateWriteTransaction((database) => upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase(database, params), { env: resolveDeliveryQueueStateEnv(params.stateDir, context) }, { operationLabel: "insert stable delivery queue owner" });
}
/** Replaces a pending entry only while its authoritative serialized value is unchanged. */
function replacePendingDeliveryQueueEntry(params, context) {
	if (params.expectedEntry.id !== params.replacementEntry.id) throw new Error(`Delivery queue replacement id mismatch: ${params.expectedEntry.id} != ${params.replacementEntry.id}`);
	return runOpenClawStateWriteTransaction((database) => replacePendingDeliveryQueueEntryInDatabase(database, params), { env: resolveDeliveryQueueStateEnv(params.stateDir, context) }, { operationLabel: "replace pending delivery queue entry" });
}
/** Completes a pending entry only while its authoritative serialized value is unchanged. */
function completePendingDeliveryQueueEntry(params, context) {
	return runOpenClawStateWriteTransaction((database) => completePendingDeliveryQueueEntryInDatabase(database, params), { env: resolveDeliveryQueueStateEnv(params.stateDir, context) }, { operationLabel: "complete pending delivery queue entry" });
}
/**
* Commits an asynchronously prepared replacement only if the authoritative
* source row is unchanged, then removes or terminally fences the old owner.
*/
function movePendingDeliveryQueueEntryNamespace(params, context) {
	return runOpenClawStateWriteTransaction((database) => movePendingDeliveryQueueEntryNamespaceInDatabase(database, params), { env: resolveDeliveryQueueStateEnv(params.stateDir, context) }, { operationLabel: "migrate delivery queue namespace" });
}
//#endregion
//#region src/infra/outbound/delivery-queue-preparation.ts
const STABLE_PREPARATION_LEASE_MS = 3e5;
const STABLE_PREPARATION_LEASE_RENEW_MS = 3e4;
var StableDeliveryPreparationLostError = class extends Error {
	constructor(id) {
		super(`Stable outbound preparation ownership was lost: ${id}`);
		this.name = "StableDeliveryPreparationLostError";
	}
};
const STABLE_PREPARATION_CONFLICT_QUEUES = [
	OUTBOUND_DELIVERY_QUEUE_NAME,
	OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
	OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
	LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME
];
function createStablePreparation(id, ownerId, now = Date.now()) {
	return {
		id,
		enqueuedAt: now,
		retryCount: 0,
		attemptCount: 0,
		retainOnFailure: true,
		preparationState: "claimed",
		preparationOwnerId: ownerId,
		preparationLeaseExpiresAt: now + STABLE_PREPARATION_LEASE_MS
	};
}
function failStablePreparation(entry, stateDir, context) {
	terminalizePendingDeliveryQueueEntry({
		queueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
		id: entry.id,
		entry,
		stateDir
	}, context);
}
function claimStablePreparation(id, stateDir, context) {
	const ownerId = randomUUID();
	const proposed = createStablePreparation(id, ownerId);
	if (upsertDeliveryQueueEntryOnceAcrossNamespaces({
		queueName: "outbound-preparing-v1",
		conflictQueueNames: STABLE_PREPARATION_CONFLICT_QUEUES,
		entry: proposed,
		stateDir
	}, context)) return {
		status: "claimed",
		entry: proposed
	};
	const current = loadDeliveryQueueEntry(OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME, id, stateDir, "pending", context);
	if (!current) return { status: "existing" };
	if ((current.preparationLeaseExpiresAt ?? 0) > Date.now()) return { status: "existing" };
	if (current.preparationState !== "claimed") {
		failStablePreparation(current, stateDir, context);
		return { status: "existing" };
	}
	const reclaimed = createStablePreparation(id, ownerId);
	return replacePendingDeliveryQueueEntry({
		queueName: "outbound-preparing-v1",
		expectedEntry: current,
		replacementEntry: reclaimed,
		stateDir
	}, context) ? {
		status: "claimed",
		entry: reclaimed
	} : { status: "existing" };
}
async function withStableDeliveryPreparation(params, context) {
	const captured = context ?? captureDeliveryQueueStateContext(params.stateDir);
	const claim = claimStablePreparation(params.id, params.stateDir, captured);
	if (claim.status === "existing") return claim;
	let entry = claim.entry;
	let leaseLost = false;
	let published = false;
	let pendingWrite = Promise.resolve();
	let checkpointFailure;
	const replaceEntry = (update) => {
		const write = pendingWrite.then(() => {
			if (leaseLost) throw new StableDeliveryPreparationLostError(params.id);
			if (checkpointFailure) throw checkpointFailure.error;
			const next = update(entry);
			if (!replacePendingDeliveryQueueEntry({
				queueName: "outbound-preparing-v1",
				expectedEntry: entry,
				replacementEntry: next,
				stateDir: params.stateDir
			}, captured)) {
				leaseLost = true;
				throw new StableDeliveryPreparationLostError(params.id);
			}
			entry = next;
		});
		pendingWrite = write.catch((error) => {
			checkpointFailure ??= { error };
		});
		return write;
	};
	const leaseTimer = setInterval(() => {
		if (!leaseLost && !checkpointFailure) replaceEntry((current) => ({
			...current,
			preparationLeaseExpiresAt: Date.now() + STABLE_PREPARATION_LEASE_MS
		})).catch(() => {
			leaseLost = true;
		});
	}, STABLE_PREPARATION_LEASE_RENEW_MS);
	leaseTimer.unref();
	const stopRenewals = async () => {
		clearInterval(leaseTimer);
		await pendingWrite;
	};
	const owner = {
		current: async () => {
			await stopRenewals();
			if (leaseLost) throw new StableDeliveryPreparationLostError(params.id);
			if (checkpointFailure) throw checkpointFailure.error;
			return entry;
		},
		beforeFirstModifier: () => replaceEntry((current) => ({
			...current,
			preparationState: "modifiers_started",
			preparationLeaseExpiresAt: Date.now() + STABLE_PREPARATION_LEASE_MS
		})),
		markPrepared: () => replaceEntry((current) => ({
			...current,
			preparationState: "prepared",
			preparationLeaseExpiresAt: Date.now() + STABLE_PREPARATION_LEASE_MS
		})),
		markPublished: () => {
			published = true;
		}
	};
	try {
		const value = await params.run(owner);
		await stopRenewals();
		if (!published && leaseLost) throw new StableDeliveryPreparationLostError(params.id);
		if (!published && checkpointFailure) throw checkpointFailure.error;
		if (!published && !completePendingDeliveryQueueEntry({
			queueName: "outbound-preparing-v1",
			expectedEntry: entry,
			stateDir: params.stateDir
		}, captured)) throw new Error(`Stable outbound preparation could not be settled: ${params.id}`);
		return {
			status: "claimed",
			value
		};
	} catch (error) {
		await stopRenewals();
		if (!published && !leaseLost) {
			if (entry.preparationState === "claimed") {
				const released = {
					...entry,
					preparationOwnerId: void 0,
					preparationLeaseExpiresAt: 0
				};
				replacePendingDeliveryQueueEntry({
					queueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
					expectedEntry: entry,
					replacementEntry: released,
					stateDir: params.stateDir
				}, captured);
			} else failStablePreparation(entry, params.stateDir, captured);
		}
		throw error;
	} finally {
		await stopRenewals();
	}
}
//#endregion
//#region src/infra/outbound/delivery-queue-storage.kernel.ts
/** Restore the exact pre-attempt row while its original owner still holds custody. */
function restoreDeliveryAttemptBeforeDispatchInDatabase(database, entry, reservedAttemptCount, claimedAttemptId) {
	if (!transitionOwnedDeliveryQueueEntryInDatabase(database, {
		queueName: "outbound-prepared-v1",
		id: entry.id,
		platformSendAttemptId: claimedAttemptId ?? null
	}, (currentRow) => {
		const current = currentRow;
		if (current.attemptCount !== reservedAttemptCount) throw new Error(`Delivery attempt reservation changed before rollback: ${entry.id}`);
		const restoredEntry = {
			...current,
			attemptCount: entry.attemptCount,
			availableAt: entry.availableAt,
			producerClaimId: entry.producerClaimId,
			platformSendAttemptId: entry.platformSendAttemptId,
			platformSendStartedAt: entry.platformSendStartedAt,
			effectiveReplyToId: entry.effectiveReplyToId,
			recoveryState: entry.recoveryState
		};
		upsertDeliveryQueueEntryInDatabase({
			queueName: "outbound-prepared-v1",
			entry: restoredEntry
		}, database);
	})) throw new Error(`Delivery platform claim was lost: ${entry.id}`);
}
//#endregion
//#region src/infra/outbound/delivery-queue-storage.ts
const queuedDeliveryPayloads = (entry) => acceptedPreparedOutboundEntries(entry.preparedBatch).map((prepared) => prepared.payload);
async function findDeliveryIntentOwner(id, stateDir, context) {
	const [owner] = await findDeliveryIntentOwners([id], stateDir, context);
	return owner ?? null;
}
/** Resolve one ordered batch without reopening the store for each intent. */
async function findDeliveryIntentOwners(ids, stateDir, context) {
	if (ids.length === 0) return [];
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	const owners = await executeDeliveryQueueOperation(captured, stateDir, {
		type: "deliveryQueue.findIntentOwners",
		input: { ids: [...ids] }
	});
	captured.workerContext.admission.assertCurrent();
	return owners;
}
function preparedBatchFromLowLevelInput(params) {
	if (params.preparedBatch) return params.preparedBatch;
	if (!params.payloads) throw new Error("Delivery queue entry requires a prepared payload batch");
	return createUnmodifiedPreparedOutboundBatch(params.payloads);
}
function createQueuedDelivery(params, id, retainOnFailure) {
	return {
		id,
		enqueuedAt: Date.now(),
		channel: params.channel,
		to: params.to,
		accountId: params.accountId,
		queuePolicy: params.queuePolicy,
		requireUnknownSendReconciliation: params.requireUnknownSendReconciliation,
		...params.initialProducerClaim ?? (params.requiresProducerClaim === true ? { requiresProducerClaim: true } : {}),
		preparedBatch: projectPreparedOutboundBatchForStorage(preparedBatchFromLowLevelInput(params)),
		renderedBatchPlan: params.renderedBatchPlan,
		threadId: params.threadId,
		reply: params.reply,
		formatting: params.formatting,
		identity: params.identity,
		bestEffort: params.bestEffort,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		silent: params.silent,
		mirror: params.mirror,
		session: params.session,
		gatewayClientScopes: params.gatewayClientScopes,
		preparedMessageId: params.preparedMessageId,
		deliveryCompletion: params.deliveryCompletion,
		completionRetention: params.completionRetention,
		...retainOnFailure ? { retainOnFailure: true } : {},
		legacyUnknownSendReconciliation: params.legacyUnknownSendReconciliation,
		legacyPreparedContentUnavailable: params.legacyPreparedContentUnavailable,
		maxRetries: params.maxRetries,
		retryCount: 0,
		attemptCount: 0
	};
}
/** Keep uncertain publication with recovery even when the broker returns a cleanup error. */
async function enqueueQueuedDelivery(input, stateDir, context) {
	let settlement;
	let result;
	try {
		result = await executeDeliveryQueueOperation(context, stateDir, {
			type: "deliveryQueue.enqueue",
			input
		}, { createAdmission: (retained) => {
			settlement = retained.settled;
			return {
				nativeLocations: [],
				admission: createSqliteWorkerOperationAdmission(() => {
					throw new Error("Delivery enqueue does not request host transaction admission");
				})
			};
		} });
	} catch (cause) {
		if (settlement && (await settlement).kind !== "not-entered") {
			const error = new OutboundDeliveryError("Delivery queue publication could not be confirmed", { cause });
			error.queueCustody = "held";
			throw error;
		}
		throw cause;
	}
	if (typeof result !== "string") {
		const error = /* @__PURE__ */ new Error("Delivery queue publication failed");
		retainOpenClawStateWorkerErrorPayload(error, result.error);
		throw hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
	}
	return result;
}
/** Persist a delivery entry before attempting send. Returns the entry ID. */
async function enqueueDelivery(params, stateDir, mediaStageId, context) {
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	const id = generateSecureUuid();
	const entry = createQueuedDelivery(params, id, params.deliveryCompletion !== void 0 || params.completionRetention !== void 0);
	const result = await enqueueQueuedDelivery({
		kind: "random",
		entryJson: JSON.stringify(entry),
		mediaStageId
	}, stateDir, captured);
	if (result === "missing") throw new Error(`Delivery queue media stage expired before enqueue: ${mediaStageId}`);
	if (result === "existing") throw new Error(`Delivery queue entry already exists: ${OUTBOUND_DELIVERY_QUEUE_NAME}/${id}`);
	return id;
}
/** Inserts one stable queue id without replacing prior pending or completed ownership. */
async function enqueueDeliveryOnce(params, id, stateDir, mediaStageId, context) {
	const normalizedId = id.trim();
	if (!normalizedId) throw new Error("Stable delivery queue id is required");
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	const entry = createQueuedDelivery(params, normalizedId, true);
	const result = await enqueueQueuedDelivery({
		kind: "stable",
		entryJson: JSON.stringify(entry),
		mediaStageId
	}, stateDir, captured);
	if (result === "missing") throw new Error(`Delivery queue media stage expired before enqueue: ${mediaStageId}`);
	return {
		id: normalizedId,
		created: result === "created"
	};
}
/** Atomically replaces a payload-free stable preparation owner with prepared custody. */
async function enqueuePreparedDeliveryOnce(params, id, preparation, stateDir, mediaStageId, context) {
	const normalizedId = id.trim();
	if (!normalizedId || normalizedId !== preparation.id) throw new Error("Stable delivery preparation id is invalid");
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	const entry = createQueuedDelivery(params, normalizedId, true);
	const result = await enqueueQueuedDelivery({
		kind: "prepared",
		entryJson: JSON.stringify(entry),
		preparationJson: JSON.stringify(preparation),
		mediaStageId
	}, stateDir, captured);
	if (result === "staging-missing") throw new Error(`Delivery queue media stage expired before enqueue: ${mediaStageId}`);
	if (result !== "moved") throw new StableDeliveryPreparationLostError(normalizedId);
	return {
		id: normalizedId,
		created: true
	};
}
const lostPlatformClaim = (id) => /* @__PURE__ */ new Error(`Delivery platform claim was lost: ${id}`);
/** Update a queue entry after a failed delivery attempt. */
async function failDelivery(id, error, stateDir, expectedPlatformSendAttemptId, context) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		retryCount: entry.retryCount + 1,
		lastAttemptAt: Date.now(),
		lastError: error,
		availableAt: void 0,
		producerClaimId: void 0,
		recoveryState: entry.recoveryState === "producer_claimed" ? void 0 : entry.recoveryState
	}), expectedPlatformSendAttemptId, context);
}
/** Record a failed attempt whose retry provably cannot duplicate a recipient-visible send. */
async function failDeliveryBeforePlatformSend(id, error, stateDir, expectedPlatformSendAttemptId, context) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		retryCount: entry.retryCount + 1,
		lastAttemptAt: Date.now(),
		lastError: error,
		availableAt: void 0,
		producerClaimId: void 0,
		platformSendAttemptId: void 0,
		platformSendStartedAt: void 0,
		recoveryState: void 0
	}), expectedPlatformSendAttemptId, context);
}
/** Record a failed attempt without losing evidence that platform delivery may have completed. */
async function failDeliveryAfterPlatformSend(id, error, stateDir, expectedPlatformSendAttemptId, context) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		retryCount: entry.retryCount + 1,
		lastAttemptAt: Date.now(),
		lastError: error,
		availableAt: void 0,
		producerClaimId: void 0,
		platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
		recoveryState: "unknown_after_send"
	}), expectedPlatformSendAttemptId, context);
}
/** Reserve one durable delivery call before invoking the provider path. */
async function reserveDeliveryAttempt(id, maxAttempts, stateDir, expectedPlatformSendAttemptId, context) {
	return reserveDeliveryQueueEntryAttempt({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id,
		maxAttempts,
		stateDir,
		...expectedPlatformSendAttemptId ? { expectedPlatformSendAttemptId } : {}
	}, context);
}
/** Restore the exact pre-attempt row when lifecycle closure wins before provider dispatch. */
function restoreDeliveryAttemptBeforeDispatch(entry, reservedAttemptCount, stateDir, claimedAttemptId, context) {
	runOpenClawStateWriteTransaction((database) => restoreDeliveryAttemptBeforeDispatchInDatabase(database, entry, reservedAttemptCount, claimedAttemptId), { env: resolveDeliveryQueueStateEnv(stateDir, context) }, { operationLabel: `mutate owned ${OUTBOUND_DELIVERY_QUEUE_NAME} delivery platform send` });
}
function updateQueuedDelivery(id, stateDir, update, expectedPlatformSendAttemptId, context) {
	if (expectedPlatformSendAttemptId !== void 0) {
		if (!transitionOwnedDeliveryQueueEntry({
			queueName: "outbound-prepared-v1",
			id,
			stateDir,
			platformSendAttemptId: expectedPlatformSendAttemptId
		}, (entry, database) => {
			upsertDeliveryQueueEntryInDatabase({
				queueName: "outbound-prepared-v1",
				entry: update(entry)
			}, database);
		}, context)) throw lostPlatformClaim(id);
		return;
	}
	updateDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir, (entry) => update(entry), context);
}
async function markDeliveryPlatformSendAttemptStarted(id, stateDir, route, producerClaimId, context) {
	if (producerClaimId) {
		if (!promoteDeliveryQueueEntryPlatformSend({
			queueName: "outbound-prepared-v1",
			id,
			claimId: producerClaimId,
			stateDir,
			route
		}, context)) throw new Error(`Delivery platform claim was lost: ${id}`);
		return;
	}
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		availableAt: void 0,
		producerClaimId: void 0,
		platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
		...route && "replyToId" in route ? { effectiveReplyToId: route.replyToId ?? null } : {},
		recoveryState: "send_attempt_started"
	}), void 0, context);
}
/** Refresh the attempt timestamp before recipient-visible or finalizing platform I/O. */
async function markDeliveryPlatformSendDispatched(id, stateDir, route, expectedPlatformSendAttemptId, context) {
	if (typeof expectedPlatformSendAttemptId === "string") {
		markOwnedDeliveryPlatformSendDispatched(id, stateDir, route, expectedPlatformSendAttemptId, context);
		return;
	}
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		availableAt: void 0,
		producerClaimId: void 0,
		platformSendStartedAt: Date.now(),
		...route && "replyToId" in route ? { effectiveReplyToId: route.replyToId ?? null } : {},
		recoveryState: entry.recoveryState === "unknown_after_send" ? entry.recoveryState : "send_attempt_started"
	}), expectedPlatformSendAttemptId, context);
}
async function markDeliveryPlatformOutcomeUnknown(id, stateDir, expectedPlatformSendAttemptId, context) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		availableAt: expectedPlatformSendAttemptId && entry.requiresProducerClaim === true && entry.platformSendAttemptId === expectedPlatformSendAttemptId ? entry.availableAt : void 0,
		producerClaimId: void 0,
		platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
		recoveryState: "unknown_after_send"
	}), expectedPlatformSendAttemptId, context);
}
/** Load a single pending delivery entry by ID from the queue directory. */
const loadPendingDelivery = async (id, stateDir, context) => loadDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir, "pending", context);
/** Failed settlement retains owner metadata, but is never eligible for sending. */
async function loadUnfinishedDeliveries(stateDir, context) {
	return loadDeliveryQueueEntries(OUTBOUND_DELIVERY_QUEUE_NAME, stateDir, "unfinished", context);
}
async function loadUnfinishedDelivery(id, stateDir, context) {
	return loadDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir, "unfinished", context);
}
function hasActiveDeliveryOwner(entry, now) {
	return (typeof entry.completionRetention === "object" || entry.completionRetention === "permanent" || entry.requiresProducerClaim === true) && (entry.recoveryState === "producer_claimed" || (entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send") && entry.requiresProducerClaim === true) && typeof entry.availableAt === "number" && entry.availableAt > now;
}
/** Close send custody before awaiting an owner projection; retain its restart work. */
async function stageDeliveryFailureSettlement(entry, settlement, stateDir, claimedAttemptId, context) {
	if (entry.settlement) {
		const current = loadDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, entry.id, stateDir, "unfinished", context);
		return current && JSON.stringify(current) === JSON.stringify(entry) ? current : void 0;
	}
	const reclaim = entry.recoveryState === "producer_claimed" && claimedAttemptId === void 0;
	const attemptId = reclaim ? await claimDeliveryPlatformSendAttempt(entry.id, stateDir, void 0, void 0, context) : claimedAttemptId ?? entry.platformSendAttemptId ?? null;
	if (reclaim && !attemptId) return;
	let staged;
	transitionOwnedDeliveryQueueEntry({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id: entry.id,
		stateDir,
		platformSendAttemptId: attemptId ?? null
	}, (current, database) => {
		if (!reclaim && claimedAttemptId === void 0 && hasActiveDeliveryOwner(current, Date.now())) return;
		staged = {
			...current,
			recoveryState: "settlement_pending",
			settlement
		};
		upsertDeliveryQueueEntryInDatabase({
			queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
			entry: staged,
			status: "failed",
			updatePendingOnly: true
		}, database);
	}, context);
	return staged;
}
/** Only the exact unfinished settlement may compact and publish its terminal facts. */
function finalizeDeliveryFailureSettlement(entry, stateDir, context) {
	return terminalizePendingDeliveryQueueEntry({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id: entry.id,
		entry,
		stateDir,
		expectedStatus: "failed"
	}, context).status === "terminalized";
}
/** One-time migration inventory; normal recovery never reads the legacy namespace. */
function loadLegacyPendingDeliveries(stateDir) {
	return loadDeliveryQueueEntries(LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, stateDir);
}
/** Prepared legacy rows awaiting media staging and canonical publication. */
function loadPendingDeliveryMigrations(stateDir) {
	return loadDeliveryQueueEntries(OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME, stateDir);
}
/** Claimed pre-D4 rows whose modifying policy has not safely published yet. */
function loadPendingLegacyDeliveryPreparations(stateDir) {
	return loadDeliveryQueueEntries(OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, stateDir);
}
/** Move a queue entry out of the pending retry set. */
async function moveToFailed(id, requestedStateDir, expectedPlatformSendAttemptId, context) {
	const stateDir = context?.stateDir ?? requestedStateDir;
	const entry = await loadPendingDelivery(id, stateDir, context);
	if (!entry) throw new Error(`No pending outbound delivery queue entry ${id}`);
	if ((await failPendingDelivery({
		id,
		entry,
		retainSpoolArtifacts: true,
		...expectedPlatformSendAttemptId !== void 0 ? { expectedPlatformSendAttemptId } : {}
	}, stateDir, context)).status !== "failed") throw lostPlatformClaim(id);
	return collectEntrySpoolPaths(queuedDeliveryPayloads(entry), stateDir);
}
//#endregion
export { renewDeliveryPlatformSendLease as A, stageDeliveryFailureSettlement as C, replacePendingDeliveryQueueEntry as D, movePendingDeliveryQueueEntryNamespace as E, failPendingDelivery as M, retireUnsentDelivery as N, claimDeliveryPlatformSendAttempt as O, restoreDeliveryAttemptBeforeDispatch as S, withStableDeliveryPreparation as T, markDeliveryPlatformOutcomeUnknown as _, failDeliveryAfterPlatformSend as a, moveToFailed as b, findDeliveryIntentOwner as c, loadLegacyPendingDeliveries as d, loadPendingDelivery as f, loadUnfinishedDelivery as g, loadUnfinishedDeliveries as h, failDelivery as i, ackDelivery as j, claimReusableDeliveryPlatformSendAttempt as k, findDeliveryIntentOwners as l, loadPendingLegacyDeliveryPreparations as m, enqueueDeliveryOnce as n, failDeliveryBeforePlatformSend as o, loadPendingDeliveryMigrations as p, enqueuePreparedDeliveryOnce as r, finalizeDeliveryFailureSettlement as s, enqueueDelivery as t, hasActiveDeliveryOwner as u, markDeliveryPlatformSendAttemptStarted as v, StableDeliveryPreparationLostError as w, reserveDeliveryAttempt as x, markDeliveryPlatformSendDispatched as y };
