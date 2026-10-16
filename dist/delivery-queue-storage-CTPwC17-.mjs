import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { a as generateSecureUuid } from "./secure-random-Dimnnrm0.mjs";
import { n as OutboundDeliveryError } from "./deliver-types-Diy-VQKA.mjs";
import { d as prepareDeliveryQueueTerminalEntry } from "./delivery-queue-sqlite.kernel-NKJp0qk2.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-BiGOf1E1.mjs";
import { a as loadDeliveryQueueEntries, l as executeDeliveryQueueOperation } from "./delivery-queue-sqlite-CZH3GILC.mjs";
import { n as collectEntrySpoolPaths } from "./delivery-queue-media-paths-CYBc7PO4.mjs";
import { i as acceptedPreparedOutboundEntries, l as projectPreparedOutboundBatchForStorage, n as encodeOutboundDeliverySnapshot, o as createUnmodifiedPreparedOutboundBatch, r as projectOutboundDelivery, t as decodeOutboundDeliverySnapshot } from "./delivery-queue-projection-ClfVauZ8.mjs";
import { c as OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, i as OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME, l as outboundDeliveryQueueName, o as OUTBOUND_DELIVERY_QUEUE_NAME, r as LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME } from "./delivery-queue-namespaces-DE2c296l.mjs";
import { t as cancelDeliveryQueueMediaRetention } from "./delivery-queue-media-staging-DXj5mTxE.mjs";
import { n as releaseSpoolArtifacts } from "./delivery-queue-media-spool-DlhI6JUi.mjs";
//#region src/infra/outbound/delivery-queue-ack.ts
/** Retires an unsent live claim while its adapter preparation still owns resources. */
async function retireUnsentDelivery(params, context, terminalOutcome) {
	const stateDir = context?.stateDir ?? params.stateDir;
	const retired = await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.retireUnsent",
		input: {
			...params,
			stateDir,
			terminalOutcome
		}
	});
	if (!retired) return;
	return async () => {
		try {
			await releaseSpoolArtifacts(retired.spoolPaths, stateDir);
		} finally {
			await cancelDeliveryQueueMediaRetention(retired.retention, stateDir, context);
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
		queueName: outboundDeliveryQueueName(params.entry),
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
//#region src/infra/outbound/delivery-queue-preparation.ts
const STABLE_PREPARATION_LEASE_MS = 3e5;
const STABLE_PREPARATION_LEASE_RENEW_MS = 3e4;
var StableDeliveryPreparationLostError = class extends Error {
	constructor(id) {
		super(`Stable outbound preparation ownership was lost: ${id}`);
		this.name = "StableDeliveryPreparationLostError";
	}
};
async function withStableDeliveryPreparation(params, context) {
	const captured = context ?? captureDeliveryQueueStateContext(params.stateDir);
	const claim = await executeDeliveryQueueOperation(captured, params.stateDir, {
		type: "deliveryQueue.claimPreparation",
		input: { id: params.id }
	});
	if (claim.status === "existing") return claim;
	let entry = claim.entry;
	let leaseLost = false;
	let published = false;
	let pendingWrite = Promise.resolve();
	let checkpointFailure;
	const assertCheckpoint = () => {
		if (leaseLost) throw new StableDeliveryPreparationLostError(params.id);
		if (checkpointFailure) throw checkpointFailure.error;
	};
	const replaceEntry = (preparationState) => {
		const write = pendingWrite.then(async () => {
			assertCheckpoint();
			const next = {
				...entry,
				preparationState: preparationState ?? entry.preparationState,
				preparationLeaseExpiresAt: Date.now() + STABLE_PREPARATION_LEASE_MS
			};
			if (!await executeDeliveryQueueOperation(captured, params.stateDir, {
				type: "deliveryQueue.replacePreparation",
				input: {
					expectedEntry: entry,
					replacementEntry: next
				}
			})) {
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
		if (!leaseLost && !checkpointFailure) replaceEntry().catch(() => {
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
			assertCheckpoint();
			return entry;
		},
		beforeFirstModifier: () => replaceEntry("modifiers_started"),
		markPrepared: () => replaceEntry("prepared"),
		markPublished: () => {
			published = true;
		}
	};
	try {
		const value = await params.run(owner);
		await stopRenewals();
		if (!published) assertCheckpoint();
		if (!published && !await executeDeliveryQueueOperation(captured, params.stateDir, {
			type: "deliveryQueue.completePreparation",
			input: { expectedEntry: entry }
		})) throw new Error(`Stable outbound preparation could not be settled: ${params.id}`);
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
				await executeDeliveryQueueOperation(captured, params.stateDir, {
					type: "deliveryQueue.replacePreparation",
					input: {
						expectedEntry: entry,
						replacementEntry: released
					}
				});
			} else await executeDeliveryQueueOperation(captured, params.stateDir, {
				type: "deliveryQueue.failPreparation",
				input: { entry }
			});
		}
		throw error;
	} finally {
		await stopRenewals();
	}
}
//#endregion
//#region src/infra/outbound/delivery-queue-platform-lease.ts
/** Atomically transfer a stable pending producer intent to one platform sender. */
async function claimDeliveryPlatformSendAttempt(id, stateDir, reconciledPlatformSendStartedAt, reconciledPlatformSendAttemptId, context) {
	return executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.claimPlatformSend",
		input: {
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
			id,
			claimId
		}
	});
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
		sessionGeneration: params.sessionGeneration,
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
/** Update retry evidence on the queue worker's exact namespace and claim. */
function deliveryFailureRecorder(kind) {
	return async (id, error, stateDir, expectedPlatformSendAttemptId, context) => {
		await executeDeliveryQueueOperation(context, stateDir, {
			type: "deliveryQueue.mutateOutbound",
			input: {
				kind,
				id,
				error,
				expectedPlatformSendAttemptId
			}
		});
	};
}
const failDelivery = deliveryFailureRecorder("fail");
const failDeliveryBeforePlatformSend = deliveryFailureRecorder("fail-before-send");
const failDeliveryAfterPlatformSend = deliveryFailureRecorder("fail-after-send");
async function reserveDeliveryAttempt(id, maxAttempts, stateDir, expectedPlatformSendAttemptId, context) {
	return await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.reserveOutbound",
		input: {
			id,
			maxAttempts,
			expectedPlatformSendAttemptId
		}
	});
}
/** Restore only the exact reserved attempt before recipient-visible dispatch. */
async function restoreDeliveryAttemptBeforeDispatch(entry, reservedAttemptCount, stateDir, claimedAttemptId, context) {
	await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.restoreOutbound",
		input: {
			entry: encodeOutboundDeliverySnapshot(entry),
			reservedAttemptCount,
			claimedAttemptId
		}
	});
}
async function markDeliveryPlatformSendAttemptStarted(id, stateDir, route, producerClaimId, context) {
	await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.mutateOutbound",
		input: {
			kind: "start",
			id,
			route: route && ("replyToId" in route ? { replyToId: route.replyToId } : {}),
			expectedPlatformSendAttemptId: producerClaimId
		}
	});
}
async function markDeliveryPlatformSendDispatched(id, stateDir, route, expectedPlatformSendAttemptId, context) {
	await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.mutateOutbound",
		input: {
			kind: "dispatch",
			id,
			route: route && ("replyToId" in route ? { replyToId: route.replyToId } : {}),
			expectedPlatformSendAttemptId
		}
	});
}
async function markDeliveryPlatformOutcomeUnknown(id, stateDir, expectedPlatformSendAttemptId, context) {
	await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.mutateOutbound",
		input: {
			kind: "unknown",
			id,
			expectedPlatformSendAttemptId
		}
	});
}
async function readOutboundDeliveries(input, stateDir, context) {
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	const reply = await executeExistingOpenClawStateRead({
		path: captured.workerContext.admission.databasePath,
		env: captured.workerContext.environment
	}, {
		type: "deliveryQueue.outbound",
		...input
	}, {
		context: captured.workerContext,
		current: true
	});
	captured.workerContext.admission.assertCurrent();
	if (!reply) return [];
	if (!reply.ok || reply.type !== "deliveryQueue.outbound") throw new Error("Unexpected outbound queue read result");
	return reply.entries.map(({ queueName, entry }) => projectOutboundDelivery(queueName, entry));
}
async function loadPendingDelivery(id, stateDir, context) {
	return (await readOutboundDeliveries({
		id,
		mode: "pending"
	}, stateDir, context))[0] ?? null;
}
/** Includes unfinished settlement in FIFO order across both executable formats. */
async function loadUnfinishedDeliveries(stateDir, context) {
	return await readOutboundDeliveries({ mode: "unfinished" }, stateDir, context);
}
async function loadUnfinishedDelivery(id, stateDir, context) {
	return (await readOutboundDeliveries({
		id,
		mode: "unfinished"
	}, stateDir, context))[0] ?? null;
}
/** Close send custody before awaiting completion projection; retain its restart work. */
async function stageDeliveryFailureSettlement(entry, settlement, stateDir, claimedAttemptId, context) {
	const staged = await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.stageFailure",
		input: {
			entry: encodeOutboundDeliverySnapshot(entry),
			settlementEntry: encodeOutboundDeliverySnapshot({
				...entry,
				settlement
			}),
			claimedAttemptId
		}
	});
	return staged && decodeOutboundDeliverySnapshot(staged);
}
async function finalizeDeliveryFailureSettlement(entry, stateDir, context) {
	return await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.finalizeFailure",
		input: { entry: encodeOutboundDeliverySnapshot(entry) }
	});
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
	}, stateDir, context)).status !== "failed") throw new Error(`Delivery platform claim was lost: ${id}`);
	return collectEntrySpoolPaths(queuedDeliveryPayloads(entry), stateDir);
}
//#endregion
export { retireUnsentDelivery as A, claimDeliveryPlatformSendAttempt as C, withStableDeliveryPreparation as D, StableDeliveryPreparationLostError as E, ackDelivery as O, stageDeliveryFailureSettlement as S, renewDeliveryPlatformSendLease as T, markDeliveryPlatformSendAttemptStarted as _, failDeliveryAfterPlatformSend as a, reserveDeliveryAttempt as b, findDeliveryIntentOwner as c, loadPendingDelivery as d, loadPendingDeliveryMigrations as f, markDeliveryPlatformOutcomeUnknown as g, loadUnfinishedDelivery as h, failDelivery as i, failPendingDelivery as k, findDeliveryIntentOwners as l, loadUnfinishedDeliveries as m, enqueueDeliveryOnce as n, failDeliveryBeforePlatformSend as o, loadPendingLegacyDeliveryPreparations as p, enqueuePreparedDeliveryOnce as r, finalizeDeliveryFailureSettlement as s, enqueueDelivery as t, loadLegacyPendingDeliveries as u, markDeliveryPlatformSendDispatched as v, claimReusableDeliveryPlatformSendAttempt as w, restoreDeliveryAttemptBeforeDispatch as x, moveToFailed as y };
