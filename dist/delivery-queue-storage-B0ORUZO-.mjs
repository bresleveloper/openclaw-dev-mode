import { s as getOrLoadSqliteDatabaseAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { i as createSqliteWorkerOperationAdmission, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { T as notifyOutboundDeliveryEnqueued, w as emptyOutboundDeliveryQueueAdmission } from "./openclaw-state-db-legacy-backfills-DGJSWaXR.mjs";
import { a as generateSecureUuid } from "./secure-random-DxCgeORs.mjs";
import { n as OutboundDeliveryError, r as PlatformMessageNotDispatchedError } from "./deliver-types-ChQJdCfP.mjs";
import { f as prepareDeliveryQueueTerminalEntry } from "./delivery-queue-sqlite.kernel-C5HZlUKw.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import { l as executeDeliveryQueueOperation, o as loadDeliveryQueueEntries } from "./delivery-queue-sqlite-BYjmoa0a.mjs";
import { n as collectEntrySpoolPaths } from "./delivery-queue-media-paths-BG8SwZ0-.mjs";
import { d as projectPreparedOutboundBatchForStorage, i as projectQueuedDeliveryOptions, l as preparedOutboundPayloads, n as encodeOutboundDeliverySnapshot, r as projectOutboundDelivery, s as createUnmodifiedPreparedOutboundBatch, t as decodeOutboundDeliverySnapshot } from "./delivery-queue-projection-Bc9Dusno.mjs";
import { c as OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, i as OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME, l as outboundDeliveryQueueName, o as OUTBOUND_DELIVERY_QUEUE_NAME, r as LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME } from "./delivery-queue-namespaces-DQeyCJNT.mjs";
import { i as cancelDeliveryQueueMediaRetention, n as releaseSpoolArtifacts } from "./delivery-queue-media-spool-BWU_UFQL.mjs";
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
	const replaceEntry = async (preparationState) => {
		const next = {
			...entry,
			preparationState,
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
	};
	const owner = {
		current: async () => entry,
		beforeFirstModifier: () => replaceEntry("modifiers_started"),
		markPrepared: () => replaceEntry("prepared"),
		markPublished: () => {
			published = true;
		}
	};
	try {
		const value = await params.run(owner);
		if (!published) {
			if (!await executeDeliveryQueueOperation(captured, params.stateDir, {
				type: "deliveryQueue.completePreparation",
				input: { expectedEntry: entry }
			})) throw new Error(`Stable outbound preparation could not be settled: ${params.id}`);
		}
		return {
			status: "claimed",
			value
		};
	} catch (error) {
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
	}
}
//#endregion
//#region src/infra/outbound/delivery-queue-platform-lease.ts
/** Atomically transfer a stable pending producer intent to one platform sender. */
async function claimDeliveryPlatformSendAttempt(id, stateDir, reconciledPlatformSendStartedAt, reconciledPlatformSendAttemptId, context, allowUnknownSendReplay) {
	return executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.claimPlatformSend",
		input: {
			id,
			claimId: generateSecureUuid(),
			...reconciledPlatformSendStartedAt !== void 0 ? { reconciledPlatformSendStartedAt } : {},
			...reconciledPlatformSendAttemptId !== void 0 ? { reconciledPlatformSendAttemptId } : {},
			...allowUnknownSendReplay ? { allowUnknownSendReplay } : {}
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
async function findDeliveryIntentOwner(id, stateDir, context) {
	return (await findDeliveryIntentOwners([id], stateDir, context))[0] ?? null;
}
/** Resolve one ordered batch without reopening the store for each intent. */
async function findDeliveryIntentOwners(ids, stateDir, context) {
	if (ids.length === 0) return [];
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	return executeDeliveryQueueOperation(captured, stateDir, {
		type: "deliveryQueue.findIntentOwners",
		input: { ids: [...ids] }
	});
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
		...projectQueuedDeliveryOptions(params),
		queuePolicy: params.queuePolicy,
		requireUnknownSendReconciliation: params.requireUnknownSendReconciliation,
		retryAmbiguousFinalText: params.retryAmbiguousFinalText,
		...params.initialProducerClaim ?? (params.requiresProducerClaim === true ? { requiresProducerClaim: true } : {}),
		preparedBatch: projectPreparedOutboundBatchForStorage(preparedBatchFromLowLevelInput(params)),
		reply: params.reply,
		sessionGeneration: params.sessionGeneration,
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
async function enqueueQueuedDelivery(input, context) {
	let settlement;
	let result;
	try {
		result = await executeDeliveryQueueOperation(context, context.stateDir, {
			type: "deliveryQueue.enqueue",
			input
		}, { createAdmission: (retained) => {
			settlement = retained.settled;
			const admission = createSqliteWorkerOperationAdmission(() => {
				throw new Error("Delivery enqueue does not request host transaction admission");
			});
			observeSqliteWorkerCommittedFacts(admission, () => notifyOutboundDeliveryEnqueued(context.stateDir));
			return {
				nativeLocations: [],
				admission
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
		const failure = new OutboundDeliveryError("Delivery queue admission rejected before publication", {
			cause: new PlatformMessageNotDispatchedError("Delivery was not queued or sent", { cause: hydrateOpenClawStateWorkerError(error, { includeOrdinary: true }) }),
			stage: "queue"
		});
		failure.queueCustody = "released";
		throw failure;
	}
	if (result === (input.kind === "prepared" ? "staging-missing" : "missing")) throw new Error(`Delivery queue media stage expired before enqueue: ${input.mediaStageId}`);
	return result;
}
/** Persist a delivery entry before attempting send. Returns the entry ID. */
async function enqueueDelivery(params, stateDir, mediaStageId, context) {
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	const id = generateSecureUuid();
	const entry = createQueuedDelivery(params, id, params.deliveryCompletion !== void 0 || params.completionRetention !== void 0);
	if (await enqueueQueuedDelivery({
		kind: "random",
		entryJson: JSON.stringify(entry),
		mediaStageId
	}, captured) === "existing") throw new Error(`Delivery queue entry already exists: ${OUTBOUND_DELIVERY_QUEUE_NAME}/${id}`);
	return id;
}
/** Inserts one stable queue id without replacing prior pending or completed ownership. */
async function enqueueDeliveryOnce(params, id, stateDir, mediaStageId, context) {
	const normalizedId = id.trim();
	if (!normalizedId) throw new Error("Stable delivery queue id is required");
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	const entry = createQueuedDelivery(params, normalizedId, true);
	return {
		id: normalizedId,
		created: await enqueueQueuedDelivery({
			kind: "stable",
			entryJson: JSON.stringify(entry),
			mediaStageId
		}, captured) === "created"
	};
}
/** Atomically replaces a payload-free stable preparation owner with prepared custody. */
async function enqueuePreparedDeliveryOnce(params, id, preparation, stateDir, mediaStageId, context) {
	const normalizedId = id.trim();
	if (!normalizedId || normalizedId !== preparation.id) throw new Error("Stable delivery preparation id is invalid");
	const captured = context ?? captureDeliveryQueueStateContext(stateDir);
	const entry = createQueuedDelivery(params, normalizedId, true);
	if (await enqueueQueuedDelivery({
		kind: "prepared",
		entryJson: JSON.stringify(entry),
		preparationJson: JSON.stringify(preparation),
		mediaStageId
	}, captured) !== "moved") throw new StableDeliveryPreparationLostError(normalizedId);
	return {
		id: normalizedId,
		created: true
	};
}
/** Update retry evidence on the queue worker's exact namespace and claim. */
function deliveryFailureRecorder(kind) {
	return async (id, error, stateDir, expectedPlatformSendAttemptId, context, ambiguousTransportError) => {
		await executeDeliveryQueueOperation(context, stateDir, {
			type: "deliveryQueue.mutateOutbound",
			input: {
				kind,
				id,
				error,
				expectedPlatformSendAttemptId,
				ambiguousTransportError
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
function deliveryPlatformSendRecorder(kind) {
	return async (id, stateDir, route, expectedPlatformSendAttemptId, context) => {
		await executeDeliveryQueueOperation(context, stateDir, {
			type: "deliveryQueue.mutateOutbound",
			input: {
				kind,
				id,
				route: route && ("replyToId" in route ? { replyToId: route.replyToId } : {}),
				expectedPlatformSendAttemptId
			}
		});
	};
}
const markDeliveryPlatformSendAttemptStarted = deliveryPlatformSendRecorder("start");
const markDeliveryPlatformSendDispatched = deliveryPlatformSendRecorder("dispatch");
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
	if (input.id === void 0 && input.mode === "unfinished" && getOrLoadSqliteDatabaseAdmissionForPath(captured.workerContext.admission.databasePath, emptyOutboundDeliveryQueueAdmission, () => void 0)) {
		captured.workerContext.admission.assertCurrent();
		return [];
	}
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
	if (!reply) return [];
	if (!reply.ok || reply.type !== "deliveryQueue.outbound") throw new Error("Unexpected outbound queue read result");
	return reply.entries.map(({ queueName, entry }) => projectOutboundDelivery(queueName, entry));
}
function outboundDeliveryReader(mode) {
	return async (id, stateDir, context) => (await readOutboundDeliveries({
		id,
		mode
	}, stateDir, context))[0] ?? null;
}
const loadPendingDelivery = outboundDeliveryReader("pending");
const loadUnfinishedDelivery = outboundDeliveryReader("unfinished");
/** Includes unfinished settlement in FIFO order across both executable formats. */
async function loadUnfinishedDeliveries(stateDir, context) {
	return await readOutboundDeliveries({ mode: "unfinished" }, stateDir, context);
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
	return collectEntrySpoolPaths(preparedOutboundPayloads(entry.preparedBatch), stateDir);
}
//#endregion
export { retireUnsentDelivery as A, claimDeliveryPlatformSendAttempt as C, withStableDeliveryPreparation as D, StableDeliveryPreparationLostError as E, ackDelivery as O, stageDeliveryFailureSettlement as S, renewDeliveryPlatformSendLease as T, markDeliveryPlatformSendAttemptStarted as _, failDeliveryAfterPlatformSend as a, reserveDeliveryAttempt as b, findDeliveryIntentOwner as c, loadPendingDelivery as d, loadPendingDeliveryMigrations as f, markDeliveryPlatformOutcomeUnknown as g, loadUnfinishedDelivery as h, failDelivery as i, failPendingDelivery as k, findDeliveryIntentOwners as l, loadUnfinishedDeliveries as m, enqueueDeliveryOnce as n, failDeliveryBeforePlatformSend as o, loadPendingLegacyDeliveryPreparations as p, enqueuePreparedDeliveryOnce as r, finalizeDeliveryFailureSettlement as s, enqueueDelivery as t, loadLegacyPendingDeliveries as u, markDeliveryPlatformSendDispatched as v, claimReusableDeliveryPlatformSendAttempt as w, restoreDeliveryAttemptBeforeDispatch as x, moveToFailed as y };
