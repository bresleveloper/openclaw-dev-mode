import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { b as loadDeliveryQueueEntryInDatabase, p as hasLiveDeliveryQueueClaim } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as generateSecureUuid } from "./secure-random-Dimnnrm0.mjs";
import { a as deleteDeliveryQueueEntryInDatabase, c as getDeliveryQueueEntriesOwnersInDatabase, d as prepareDeliveryQueueTerminalEntry, f as pruneExpiredDeliveryQueueTombstonesInDatabase, g as upsertDeliveryQueueEntryInDatabase, h as updateDeliveryQueueEntryInDatabase, m as terminalizePendingDeliveryQueueEntryInDatabase, n as completeLoadedDeliveryQueueEntryInDatabase, p as reserveDeliveryQueueEntryAttemptInDatabase, r as countFailedDeliveryQueueEntriesInDatabase, s as expireStagingAndLoadDeliveryQueueEntriesInDatabase, t as completeDeliveryQueueEntryInDatabase } from "./delivery-queue-sqlite.kernel-NKJp0qk2.mjs";
import { n as collectEntrySpoolPaths } from "./delivery-queue-media-paths-CYBc7PO4.mjs";
import { i as acceptedPreparedOutboundEntries, n as encodeOutboundDeliverySnapshot, r as projectOutboundDelivery, t as decodeOutboundDeliverySnapshot } from "./delivery-queue-projection-ClfVauZ8.mjs";
import { a as promoteDeliveryQueueEntryPlatformSendInDatabase, i as dispatchDeliveryQueueEntryPlatformSendInDatabase, n as claimDeliveryQueueEntryPlatformSendInDatabase, o as renewDeliveryQueueEntryPlatformSendLeaseInDatabase, s as transitionOwnedDeliveryQueueEntryInDatabase } from "./delivery-queue-sqlite-claim.kernel-DH_0k8u5.mjs";
import { a as OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME, c as OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, i as OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME, l as outboundDeliveryQueueName, n as DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME, o as OUTBOUND_DELIVERY_QUEUE_NAME, r as LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, s as OUTBOUND_EXECUTABLE_QUEUE_NAMES } from "./delivery-queue-namespaces-DE2c296l.mjs";
import { t as hasActiveDeliveryOwner } from "./delivery-queue-types-BchW2gIY.mjs";
import { a as upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase, i as replacePendingDeliveryQueueEntryInDatabase, n as completePendingDeliveryQueueEntryInDatabase, r as movePendingDeliveryQueueEntryNamespaceInDatabase, t as commitStagedDeliveryQueueEntryOnceAcrossNamespacesInDatabase } from "./delivery-queue-sqlite-namespace.kernel-B9Uxcr2d.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/outbound/delivery-queue-media-staging.kernel.ts
function entryPayloads(entry) {
	if (Array.isArray(entry.payloads)) return entry.payloads;
	return (entry.preparedBatch?.entries ?? []).flatMap((prepared) => prepared.status === "accepted" && prepared.payload ? [prepared.payload] : []);
}
function createDeliveryQueueMediaRetentionInDatabase(database, artifacts, entryKind, prepared = {
	id: generateSecureUuid(),
	enqueuedAt: Date.now()
}) {
	const { id, enqueuedAt } = prepared;
	const entry = {
		id,
		enqueuedAt,
		retryCount: 0,
		artifacts: [...artifacts]
	};
	if (!upsertDeliveryQueueEntryInDatabase({
		queueName: "outbound-media-staging",
		entry,
		metadata: { entryKind },
		insertOnly: true
	}, database)) throw new Error(`Delivery queue media stage already exists: ${id}`);
	return id;
}
/**
* Atomically expire abandoned stages and return every artifact still owned by
* either a replayable outbound row or a producer that may still commit one.
*/
function loadDeliveryQueueMediaRetentionSnapshotInDatabase(database, params) {
	const snapshot = expireStagingAndLoadDeliveryQueueEntriesInDatabase(database, {
		queueNames: [
			...OUTBOUND_EXECUTABLE_QUEUE_NAMES,
			LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME,
			OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
			OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME
		],
		stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME,
		expireBeforeMs: params.expireBeforeMs
	});
	const { rows: migrationRows } = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("migration_sources").select("report_json").where("migration_kind", "=", "delivery-queues").where("removed_source", "=", 0));
	const migrationMedia = migrationRows.flatMap((row) => {
		const report = asNullableRecord(JSON.parse(row.report_json));
		if (report?.mediaPreserved === true) return [];
		const paths = report?.mediaPaths;
		if (!Array.isArray(paths) || !paths.every((value) => typeof value === "string")) throw new Error("Cannot safely collect queue media with an invalid migration receipt");
		return paths;
	});
	return {
		payloads: snapshot.entries.map((entry) => entryPayloads(entry)),
		stagedArtifacts: snapshot.stagingEntries.flatMap((entry) => {
			const artifacts = entry.artifacts;
			return Array.isArray(artifacts) ? artifacts.filter((artifact) => typeof artifact === "string") : [];
		}).concat(migrationMedia)
	};
}
//#endregion
//#region src/infra/outbound/delivery-queue-ownership.kernel.ts
const OUTBOUND_DELIVERY_NAMESPACE_DESCRIPTORS = [
	...OUTBOUND_EXECUTABLE_QUEUE_NAMES.map((queueName) => ({
		queueName,
		namespace: "prepared",
		retired: false
	})),
	{
		queueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
		namespace: "preparing",
		retired: true
	},
	{
		queueName: OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
		namespace: "migration",
		retired: true
	},
	{
		queueName: OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
		namespace: "legacy-preparing",
		retired: true
	},
	{
		queueName: LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME,
		namespace: "legacy",
		retired: true
	}
];
/** Exact IDs share one custody owner across the executable outbound formats. */
function resolveOutboundDeliveryQueueNameInDatabase(database, id) {
	const owners = getDeliveryQueueEntriesOwnersInDatabase(database, OUTBOUND_EXECUTABLE_QUEUE_NAMES, [id]).get(id);
	if (owners && owners.size > 1) throw new Error(`Ambiguous outbound delivery custody: ${id}`);
	return owners?.keys().next().value ?? "outbound-prepared-v1";
}
function findDeliveryIntentOwnersInDatabase(database, params) {
	const owners = getDeliveryQueueEntriesOwnersInDatabase(database, OUTBOUND_DELIVERY_NAMESPACE_DESCRIPTORS.map(({ queueName }) => queueName), params.ids);
	return params.ids.map((id) => {
		const namespaces = owners.get(id);
		if (OUTBOUND_EXECUTABLE_QUEUE_NAMES.filter((queueName) => namespaces?.has(queueName)).length > 1) throw new Error(`Ambiguous outbound delivery custody: ${id}`);
		for (const descriptor of OUTBOUND_DELIVERY_NAMESPACE_DESCRIPTORS) {
			const owner = namespaces?.get(descriptor.queueName);
			if (owner) return {
				...descriptor,
				...owner
			};
		}
		return null;
	});
}
//#endregion
//#region src/infra/outbound/delivery-queue-ack.kernel.ts
/** Retires an unsent live claim while its adapter preparation still owns resources. */
function retireUnsentDeliveryInDatabase(database, params, terminalOutcome) {
	const stateDir = params.stateDir;
	const queueName = resolveOutboundDeliveryQueueNameInDatabase(database, params.id);
	let retired;
	transitionOwnedDeliveryQueueEntryInDatabase(database, {
		queueName,
		id: params.id,
		platformSendAttemptId: params.producerClaimId
	}, (current) => {
		if (current.recoveryState !== "producer_claimed" || current.platformSendAttemptId !== void 0 || current.platformSendStartedAt !== void 0 || !hasLiveDeliveryQueueClaim(current, params.producerClaimId, Date.now())) return;
		const entry = current;
		if (terminalOutcome === "failed" && entry.deliveryCompletion) return;
		const artifacts = collectEntrySpoolPaths(acceptedPreparedOutboundEntries(entry.preparedBatch).map((prepared) => prepared.payload), stateDir);
		if (terminalOutcome === "failed" && terminalizePendingDeliveryQueueEntryInDatabase(database, prepareDeliveryQueueTerminalEntry({
			queueName,
			id: entry.id,
			entry,
			expectedStatus: "pending"
		})).status !== "terminalized") return;
		const retention = artifacts.length ? createDeliveryQueueMediaRetentionInDatabase(database, artifacts, "outbound-media-recovery-lease") : void 0;
		if (terminalOutcome !== "failed") deleteDeliveryQueueEntryInDatabase(database, queueName, entry.id);
		retired = {
			spoolPaths: artifacts,
			retention
		};
	});
	return retired;
}
function ackDeliveryInDatabase(database, id, requestedStateDir, options) {
	const stateDir = requestedStateDir;
	const queueName = resolveOutboundDeliveryQueueNameInDatabase(database, id);
	let spoolPaths = [];
	const settle = (current) => {
		spoolPaths = current ? collectEntrySpoolPaths(acceptedPreparedOutboundEntries(current.preparedBatch).map((prepared) => prepared.payload), stateDir) : [];
		if (current?.completionRetention && options?.suppressCompletionReceipt !== true) {
			if (options && "expectedPlatformSendAttemptId" in options) completeLoadedDeliveryQueueEntryInDatabase(database, queueName, id, current);
			else completeDeliveryQueueEntryInDatabase(database, queueName, id);
		} else deleteDeliveryQueueEntryInDatabase(database, queueName, id);
	};
	const platformSendAttemptId = options && "expectedPlatformSendAttemptId" in options ? options.expectedPlatformSendAttemptId ?? null : null;
	if (!transitionOwnedDeliveryQueueEntryInDatabase(database, {
		queueName,
		id,
		platformSendAttemptId,
		allowMissingEntry: !(options && "expectedPlatformSendAttemptId" in options)
	}, (entry) => {
		settle(entry);
	})) throw new Error(`Delivery platform claim was lost: ${id}`);
	return spoolPaths;
}
/** Conditionally dead-letter a freshly re-read pending entry without a claimed state. */
function failPendingDeliveryInDatabase(database, params, preparedTerminal) {
	const queueName = outboundDeliveryQueueName(params.entry);
	const terminal = {
		queueName,
		id: params.id,
		entry: params.entry
	};
	const prepared = params.expectedPlatformSendAttemptId === void 0 ? preparedTerminal ?? prepareDeliveryQueueTerminalEntry(terminal) : void 0;
	let terminalized = false;
	const terminalize = () => {
		terminalized = terminalizePendingDeliveryQueueEntryInDatabase(database, prepared ?? prepareDeliveryQueueTerminalEntry(terminal)).status === "terminalized";
	};
	if (params.expectedPlatformSendAttemptId !== void 0) transitionOwnedDeliveryQueueEntryInDatabase(database, {
		queueName,
		id: params.id,
		platformSendAttemptId: params.expectedPlatformSendAttemptId
	}, terminalize);
	else terminalize();
	if (terminalized) return { status: "failed" };
	return { status: "not_pending" };
}
//#endregion
//#region src/infra/outbound/delivery-queue-ack.worker.ts
function executeDeliveryQueueAck(input, writeOptions) {
	const { id, stateDir, options } = input;
	return runOpenClawStateWriteTransaction((writer) => ackDeliveryInDatabase(writer, id, stateDir, options), writeOptions, { operationLabel: `mutate owned ${OUTBOUND_DELIVERY_QUEUE_NAME} delivery platform send` });
}
//#endregion
//#region src/infra/outbound/delivery-queue-enqueue.worker.ts
function executeDeliveryQueueEnqueue(input, writeOptions) {
	const entry = JSON.parse(input.entryJson);
	const queueName = outboundDeliveryQueueName(entry);
	const conflictQueueNames = [
		...OUTBOUND_EXECUTABLE_QUEUE_NAMES.filter((name) => name !== queueName),
		OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
		OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
		LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME
	];
	const transaction = { outcome: "unobserved" };
	try {
		return runOpenClawStateWriteTransaction((database) => {
			stageSqliteTransactionState(database.db, {
				stage: () => {
					transaction.outcome = "pending";
				},
				commit: () => {
					transaction.outcome = "committed";
				},
				rollback: () => {
					transaction.outcome = "rolled-back";
				}
			});
			if (input.kind === "random" && !input.mediaStageId) {
				upsertDeliveryQueueEntryInDatabase({
					queueName,
					entry
				}, database);
				return "created";
			}
			if (input.kind === "prepared") return movePendingDeliveryQueueEntryNamespaceInDatabase(database, {
				sourceQueueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
				destinationQueueName: queueName,
				conflictQueueNames,
				expectedSourceEntry: JSON.parse(input.preparationJson),
				destinationEntry: entry,
				...input.mediaStageId ? {
					stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME,
					stagingId: input.mediaStageId
				} : {}
			});
			const params = {
				queueName,
				conflictQueueNames: input.kind === "stable" ? [...conflictQueueNames, OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME] : [],
				entry
			};
			if (input.mediaStageId) return commitStagedDeliveryQueueEntryOnceAcrossNamespacesInDatabase(database, {
				...params,
				stagingId: input.mediaStageId,
				stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME
			});
			return upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase(database, params) ? "created" : "existing";
		}, writeOptions, { operationLabel: "enqueue outbound delivery" });
	} catch (cause) {
		if (transaction.outcome === "rolled-back") {
			const error = encodeOpenClawStateWorkerError(cause, { includeOrdinary: true });
			if (error) return {
				status: "not-published",
				error
			};
		}
		throw cause;
	}
}
//#endregion
//#region src/infra/outbound/delivery-queue-pending-failure.worker.ts
function executePendingDeliveryFailure(input, writeOptions) {
	const entry = JSON.parse(input.entryJson);
	const params = {
		...input,
		entry
	};
	const result = input.expectedPlatformSendAttemptId !== void 0 ? runOpenClawStateWriteTransaction((writer) => failPendingDeliveryInDatabase(writer, params, input.prepared), writeOptions, { operationLabel: `mutate owned ${OUTBOUND_DELIVERY_QUEUE_NAME} delivery platform send` }) : failPendingDeliveryInDatabase(writeOptions.database, params, input.prepared);
	return {
		result,
		spoolPaths: result.status === "failed" && input.retainSpoolArtifacts !== true ? collectEntrySpoolPaths(acceptedPreparedOutboundEntries(entry.preparedBatch).map((prepared) => prepared.payload), input.stateDir) : []
	};
}
//#endregion
//#region src/infra/outbound/delivery-queue-storage.kernel.ts
/** Restore the exact pre-attempt row while its original owner still holds custody. */
function restoreDeliveryAttemptBeforeDispatchInDatabase(database, entry, reservedAttemptCount, claimedAttemptId) {
	const queueName = outboundDeliveryQueueName(entry);
	if (!transitionOwnedDeliveryQueueEntryInDatabase(database, {
		queueName,
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
			queueName,
			entry: restoredEntry
		}, database);
	})) throw new Error(`Delivery platform claim was lost: ${entry.id}`);
}
function loadOutboundDeliveryInDatabase(database, id, mode) {
	const queueName = resolveOutboundDeliveryQueueNameInDatabase(database, id);
	const entry = loadDeliveryQueueEntryInDatabase(database, queueName, id, mode);
	if (!entry) return null;
	return projectOutboundDelivery(queueName, entry);
}
//#endregion
//#region src/infra/delivery-queue.worker.ts
function claimPreparation(database, id) {
	const now = Date.now();
	const proposed = {
		id,
		enqueuedAt: now,
		retryCount: 0,
		attemptCount: 0,
		retainOnFailure: true,
		preparationState: "claimed",
		preparationOwnerId: randomUUID(),
		preparationLeaseExpiresAt: now + 3e5
	};
	const queueName = OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME;
	if (upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase(database, {
		queueName,
		entry: proposed,
		conflictQueueNames: [
			...OUTBOUND_EXECUTABLE_QUEUE_NAMES,
			"outbound-prepared-migration-v1",
			"outbound-legacy-preparing-v1",
			"outbound"
		]
	})) return {
		status: "claimed",
		entry: proposed
	};
	const current = loadDeliveryQueueEntryInDatabase(database, queueName, id, "pending");
	if (!current || (current.preparationLeaseExpiresAt ?? 0) > Date.now()) return { status: "existing" };
	if (current.preparationState !== "claimed") {
		terminalizePendingDeliveryQueueEntryInDatabase(database, prepareDeliveryQueueTerminalEntry({
			queueName,
			id,
			entry: current
		}));
		return { status: "existing" };
	}
	return replacePendingDeliveryQueueEntryInDatabase(database, {
		queueName,
		expectedEntry: current,
		replacementEntry: proposed
	}) ? {
		status: "claimed",
		entry: proposed
	} : { status: "existing" };
}
function mutateOutbound(database, input) {
	const queueName = resolveOutboundDeliveryQueueNameInDatabase(database, input.id);
	const claimId = input.expectedPlatformSendAttemptId;
	if ((input.kind === "start" || input.kind === "dispatch") && typeof claimId === "string") {
		if (!(input.kind === "start" ? promoteDeliveryQueueEntryPlatformSendInDatabase : dispatchDeliveryQueueEntryPlatformSendInDatabase)(database, {
			queueName,
			id: input.id,
			claimId,
			route: input.route
		})) throw new Error(`Delivery platform claim was lost: ${input.id}`);
		return;
	}
	const update = (entry) => {
		const now = Date.now();
		switch (input.kind) {
			case "fail":
			case "fail-before-send":
			case "fail-after-send": return {
				...entry,
				retryCount: entry.retryCount + 1,
				lastAttemptAt: now,
				lastError: input.error,
				availableAt: void 0,
				producerClaimId: void 0,
				...input.kind === "fail-before-send" ? {
					platformSendAttemptId: void 0,
					platformSendStartedAt: void 0,
					recoveryState: void 0
				} : input.kind === "fail-after-send" ? {
					platformSendStartedAt: entry.platformSendStartedAt ?? now,
					recoveryState: "unknown_after_send"
				} : { recoveryState: entry.recoveryState === "producer_claimed" ? void 0 : entry.recoveryState }
			};
			case "start":
			case "dispatch": return {
				...entry,
				availableAt: void 0,
				producerClaimId: void 0,
				platformSendStartedAt: input.kind === "dispatch" ? now : entry.platformSendStartedAt ?? now,
				...input.route && "replyToId" in input.route ? { effectiveReplyToId: input.route.replyToId ?? null } : {},
				recoveryState: input.kind === "dispatch" && entry.recoveryState === "unknown_after_send" ? entry.recoveryState : "send_attempt_started"
			};
			case "unknown": return {
				...entry,
				availableAt: claimId && entry.requiresProducerClaim === true && entry.platformSendAttemptId === claimId ? entry.availableAt : void 0,
				producerClaimId: void 0,
				platformSendStartedAt: entry.platformSendStartedAt ?? now,
				recoveryState: "unknown_after_send"
			};
		}
		return input;
	};
	if (claimId !== void 0) {
		if (!transitionOwnedDeliveryQueueEntryInDatabase(database, {
			queueName,
			id: input.id,
			platformSendAttemptId: claimId
		}, (entry) => {
			upsertDeliveryQueueEntryInDatabase({
				queueName,
				entry: update(projectOutboundDelivery(queueName, entry))
			}, database);
		})) throw new Error(`Delivery platform claim was lost: ${input.id}`);
	} else updateDeliveryQueueEntryInDatabase(database, queueName, input.id, (entry) => {
		return update(projectOutboundDelivery(queueName, entry));
	});
}
function stageFailure(database, input) {
	const { entry, settlement, claimedAttemptId } = input;
	const queueName = outboundDeliveryQueueName(entry);
	if (entry.settlement) {
		const current = loadOutboundDeliveryInDatabase(database, entry.id, "unfinished");
		return current && JSON.stringify(current) === JSON.stringify(entry) ? current : void 0;
	}
	const reclaim = entry.recoveryState === "producer_claimed" && claimedAttemptId === void 0;
	const attemptId = reclaim ? claimDeliveryQueueEntryPlatformSendInDatabase(database, {
		queueName,
		id: entry.id
	}) : claimedAttemptId ?? entry.platformSendAttemptId ?? null;
	if (reclaim && !attemptId) return;
	let staged;
	transitionOwnedDeliveryQueueEntryInDatabase(database, {
		queueName,
		id: entry.id,
		platformSendAttemptId: attemptId ?? null
	}, (current) => {
		if (!reclaim && claimedAttemptId === void 0 && hasActiveDeliveryOwner(current, Date.now())) return;
		staged = {
			...projectOutboundDelivery(queueName, current),
			recoveryState: "settlement_pending",
			settlement
		};
		upsertDeliveryQueueEntryInDatabase({
			queueName,
			entry: staged,
			status: "failed",
			updatePendingOnly: true
		}, database);
	});
	return staged;
}
function writeOperation(operationLabel, operation) {
	return (input, { open, stateOptions }) => runOpenClawStateWriteTransaction((database) => operation(database, input), {
		database: open(),
		...stateOptions()
	}, { operationLabel });
}
const deliveryQueueOperations = {
	"deliveryQueue.claimPreparation": writeOperation("deliveryQueue.claimPreparation", (database, input) => claimPreparation(database, input.id)),
	"deliveryQueue.replacePreparation": writeOperation("deliveryQueue.replacePreparation", (database, input) => replacePendingDeliveryQueueEntryInDatabase(database, {
		queueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
		...input
	})),
	"deliveryQueue.completePreparation": writeOperation("deliveryQueue.completePreparation", (database, input) => completePendingDeliveryQueueEntryInDatabase(database, {
		queueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
		...input
	})),
	"deliveryQueue.failPreparation": writeOperation("deliveryQueue.failPreparation", (database, input) => {
		terminalizePendingDeliveryQueueEntryInDatabase(database, prepareDeliveryQueueTerminalEntry({
			queueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
			id: input.entry.id,
			entry: input.entry
		}));
	}),
	"deliveryQueue.mutateOutbound": writeOperation("deliveryQueue.mutateOutbound", mutateOutbound),
	"deliveryQueue.reserveOutbound": writeOperation("deliveryQueue.reserveOutbound", (database, input) => reserveDeliveryQueueEntryAttemptInDatabase(database, {
		...input,
		queueName: resolveOutboundDeliveryQueueNameInDatabase(database, input.id)
	})),
	"deliveryQueue.restoreOutbound": writeOperation("deliveryQueue.restoreOutbound", (database, input) => restoreDeliveryAttemptBeforeDispatchInDatabase(database, decodeOutboundDeliverySnapshot(input.entry), input.reservedAttemptCount, input.claimedAttemptId)),
	"deliveryQueue.stageFailure": writeOperation("deliveryQueue.stageFailure", (database, input) => {
		const entry = decodeOutboundDeliverySnapshot(input.entry);
		const settlementEntry = decodeOutboundDeliverySnapshot(input.settlementEntry);
		if (settlementEntry.id !== entry.id || input.settlementEntry.queueName !== input.entry.queueName || !settlementEntry.settlement) throw new Error(`Invalid outbound delivery settlement snapshot: ${entry.id}`);
		const staged = stageFailure(database, {
			entry,
			settlement: settlementEntry.settlement,
			claimedAttemptId: input.claimedAttemptId
		});
		return staged && encodeOutboundDeliverySnapshot(staged);
	}),
	"deliveryQueue.finalizeFailure": writeOperation("deliveryQueue.finalizeFailure", (database, input) => {
		const entry = decodeOutboundDeliverySnapshot(input.entry);
		return terminalizePendingDeliveryQueueEntryInDatabase(database, prepareDeliveryQueueTerminalEntry({
			queueName: outboundDeliveryQueueName(entry),
			id: entry.id,
			entry,
			expectedStatus: "failed"
		})).status === "terminalized";
	}),
	"deliveryQueue.retireUnsent": writeOperation("deliveryQueue.retireUnsent", (database, input) => retireUnsentDeliveryInDatabase(database, input, input.terminalOutcome)),
	"deliveryQueue.claimPlatformSend": writeOperation("deliveryQueue.claimPlatformSend", (database, input) => claimDeliveryQueueEntryPlatformSendInDatabase(database, {
		...input,
		queueName: resolveOutboundDeliveryQueueNameInDatabase(database, input.id)
	}, input.claimId)),
	"deliveryQueue.renewPlatformSendLease": writeOperation("deliveryQueue.renewPlatformSendLease", (database, input) => renewDeliveryQueueEntryPlatformSendLeaseInDatabase(database, {
		...input,
		queueName: resolveOutboundDeliveryQueueNameInDatabase(database, input.id)
	})),
	"deliveryQueue.ack": (input, { open, stateOptions }) => executeDeliveryQueueAck(input, {
		database: open(),
		...stateOptions()
	}),
	"deliveryQueue.enqueue": (input, { open, stateOptions }) => executeDeliveryQueueEnqueue(input, {
		database: open(),
		...stateOptions()
	}),
	"deliveryQueue.failPending": (input, { open, stateOptions }) => executePendingDeliveryFailure(input, {
		database: open(),
		...stateOptions()
	}),
	"deliveryQueue.findIntentOwners": (input, { open }) => findDeliveryIntentOwnersInDatabase(open(), input),
	"deliveryQueue.countFailed": (_input, { open }) => countFailedDeliveryQueueEntriesInDatabase(open()),
	"deliveryQueue.pruneTombstones": (_input, { open }) => pruneExpiredDeliveryQueueTombstonesInDatabase(open()),
	"deliveryQueue.createMediaRetention": writeOperation("deliveryQueue.createMediaRetention", (database, input) => createDeliveryQueueMediaRetentionInDatabase(database, input.artifacts, input.entryKind, input.prepared)),
	"deliveryQueue.cancelMediaRetention": writeOperation("deliveryQueue.cancelMediaRetention", (database, input) => deleteDeliveryQueueEntryInDatabase(database, DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME, input.id)),
	"deliveryQueue.mediaRetentionSnapshot": (input, { open }) => loadDeliveryQueueMediaRetentionSnapshotInDatabase(open(), input)
};
//#endregion
export { deliveryQueueOperations };
