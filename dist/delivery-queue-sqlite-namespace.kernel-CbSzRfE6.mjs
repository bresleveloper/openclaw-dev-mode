import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { nt as hasLiveDeliveryQueueClaim, ut as loadDeliveryQueueEntryInDatabase } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { a as generateSecureUuid } from "./secure-random-BJtJxP9Y.mjs";
import { a as deleteDeliveryQueueEntryInDatabase, d as prepareDeliveryQueueTerminalEntry, g as upsertDeliveryQueueEntryInDatabase, l as getDeliveryQueueEntryOwnersInDatabase, m as terminalizePendingDeliveryQueueEntryInDatabase, n as completeLoadedDeliveryQueueEntryInDatabase, t as completeDeliveryQueueEntryInDatabase } from "./delivery-queue-sqlite.kernel-Pf7zU9zY.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import { n as collectEntrySpoolPaths } from "./delivery-queue-media-paths-BxTKmyok.mjs";
import { a as OUTBOUND_DELIVERY_QUEUE_NAME } from "./delivery-queue-namespaces-CO-cZrdV.mjs";
import { t as createDeliveryQueueMediaRetentionInDatabase } from "./delivery-queue-media-staging.kernel-CWmLB9kk.mjs";
/** Captures already-owned content without invoking modifying policy. */
function createUnmodifiedPreparedOutboundBatch(payloads) {
	return {
		schemaVersion: 1,
		sourcePayloadCount: payloads.length,
		entries: payloads.map((payload, sourceIndex) => ({
			sourceIndex,
			status: "accepted",
			payload,
			replyHookChanged: false,
			messageHookChanged: false,
			preparedMediaCount: resolveSendableOutboundReplyParts(payload).mediaCount
		}))
	};
}
/** Retains terminal legacy cardinality without copying unavailable pre-policy content. */
function createUnavailablePreparedOutboundBatch(sourcePayloadCount) {
	return {
		schemaVersion: 1,
		sourcePayloadCount,
		entries: []
	};
}
function acceptedPreparedOutboundEntries(batch) {
	return batch.entries.filter((entry) => entry.status === "accepted");
}
function preparedOutboundSuppressionOutcomes(batch) {
	return batch.entries.flatMap((entry) => entry.status === "suppressed" ? [{
		index: entry.sourceIndex,
		status: "suppressed",
		reason: entry.reason,
		...entry.hookEffect ? { hookEffect: entry.hookEffect } : {}
	}] : []);
}
/** Removes process-local hook details before a prepared batch enters durable custody. */
function projectPreparedOutboundBatchForStorage(batch) {
	return {
		...batch,
		entries: batch.entries.map((entry) => {
			if (entry.status !== "suppressed" || !entry.hookEffect) return entry;
			const { hookEffect: _hookEffect, ...stored } = entry;
			return stored;
		})
	};
}
function mapPreparedOutboundAcceptedPayloads(batch, payloads) {
	let acceptedIndex = 0;
	const mapped = {
		...batch,
		entries: batch.entries.map((entry) => {
			if (entry.status !== "accepted") return entry;
			const payload = payloads[acceptedIndex++];
			if (!payload) throw new Error("Prepared outbound payload map lost an accepted entry");
			return {
				...entry,
				payload
			};
		})
	};
	if (acceptedIndex !== payloads.length) throw new Error("Prepared outbound payload map received an extra payload");
	return mapped;
}
//#endregion
//#region src/infra/delivery-queue-sqlite-claim.kernel.ts
const PLATFORM_SEND_OWNER_LEASE_MS = 6e4;
/** Creates the owner published atomically with an immediate live delivery. */
function createInitialDeliveryProducerClaim(now = Date.now()) {
	return {
		requiresProducerClaim: true,
		availableAt: now + PLATFORM_SEND_OWNER_LEASE_MS,
		producerClaimId: generateSecureUuid(),
		recoveryState: "producer_claimed"
	};
}
/** Runs an existing queue mutation only while its exact platform owner survives. */
function transitionOwnedDeliveryQueueEntryInDatabase(database, params, transition) {
	return runSqliteImmediateTransactionSync(database.db, () => {
		const entry = loadDeliveryQueueEntryInDatabase(database, params.queueName, params.id, "pending");
		if (!entry) return params.allowMissingEntry === true;
		if (params.platformSendAttemptId === null ? entry.platformSendAttemptId !== void 0 || entry.producerClaimId !== void 0 : entry.platformSendAttemptId !== params.platformSendAttemptId && entry.producerClaimId !== params.platformSendAttemptId) return false;
		transition(entry, database);
		return true;
	}, {
		databaseLabel: database.path,
		operationLabel: `mutate owned ${params.queueName} delivery platform send`
	});
}
function transitionDeliveryQueueEntryPlatformSendInDatabase(database, params, operation, transition) {
	return runSqliteImmediateTransactionSync(database.db, () => {
		const current = loadDeliveryQueueEntryInDatabase(database, params.queueName, params.id, "pending");
		if (!current) return false;
		if (current.platformSendStartedAt !== void 0 && (operation === "promote" || operation === "claim" && (current.platformSendStartedAt !== params.reconciledPlatformSendStartedAt || current.platformSendAttemptId !== params.reconciledPlatformSendAttemptId || typeof current.platformSendAttemptId !== "string"))) return false;
		const updated = transition(current, Date.now());
		return updated ? upsertDeliveryQueueEntryInDatabase({
			queueName: params.queueName,
			entry: updated,
			updatePendingOnly: true
		}, database) : false;
	}, {
		databaseLabel: database.path,
		operationLabel: `${operation} ${params.queueName} delivery platform send`
	});
}
/** Claim a recoverable producer lease before any provider invocation. */
function claimDeliveryQueueEntryPlatformSendInDatabase(database, params, claimId = generateSecureUuid()) {
	return transitionDeliveryQueueEntryPlatformSendInDatabase(database, params, "claim", (entry, now) => {
		const reconciledNotSent = entry.recoveryState === "send_attempt_started" && typeof params.reconciledPlatformSendStartedAt === "number" && entry.platformSendStartedAt === params.reconciledPlatformSendStartedAt && typeof params.reconciledPlatformSendAttemptId === "string" && entry.platformSendAttemptId === params.reconciledPlatformSendAttemptId;
		if (entry.recoveryState && !reconciledNotSent && (entry.recoveryState !== "producer_claimed" || typeof entry.availableAt !== "number" || entry.availableAt > now)) return;
		return {
			...entry,
			...params.requiresProducerClaim === true ? { requiresProducerClaim: true } : {},
			availableAt: now + 6e4,
			producerClaimId: claimId,
			platformSendAttemptId: void 0,
			platformSendStartedAt: void 0,
			recoveryState: "producer_claimed"
		};
	}) ? claimId : void 0;
}
/** Renew only the exact unexpired producer that already owns the row. */
function renewDeliveryQueueEntryPlatformSendLeaseInDatabase(database, params) {
	return runSqliteImmediateTransactionSync(database.db, () => {
		const entry = loadDeliveryQueueEntryInDatabase(database, params.queueName, params.id, "pending");
		const now = Date.now();
		if (!entry || entry.requiresProducerClaim !== true || !hasLiveDeliveryQueueClaim(entry, params.claimId, now)) return;
		const expiresAt = now + PLATFORM_SEND_OWNER_LEASE_MS;
		return upsertDeliveryQueueEntryInDatabase({
			queueName: params.queueName,
			entry: {
				...entry,
				availableAt: expiresAt
			},
			updatePendingOnly: true
		}, database) ? expiresAt : void 0;
	}, {
		databaseLabel: database.path,
		operationLabel: `renew ${params.queueName} delivery platform send`
	});
}
/** Atomically fence the exact unexpired owner at the real provider boundary. */
function promoteDeliveryQueueEntryPlatformSendInDatabase(database, params) {
	return transitionDeliveryQueueEntryPlatformSendInDatabase(database, params, "promote", (entry, now) => entry.recoveryState === "producer_claimed" && hasLiveDeliveryQueueClaim(entry, params.claimId, now) ? {
		...entry,
		availableAt: entry.requiresProducerClaim === true ? now + PLATFORM_SEND_OWNER_LEASE_MS : void 0,
		producerClaimId: void 0,
		platformSendAttemptId: params.claimId,
		platformSendStartedAt: now,
		...params.route && "replyToId" in params.route ? { effectiveReplyToId: params.route.replyToId ?? null } : {},
		recoveryState: "send_attempt_started"
	} : void 0);
}
function dispatchDeliveryQueueEntryPlatformSendInDatabase(database, params) {
	return transitionDeliveryQueueEntryPlatformSendInDatabase(database, params, "dispatch", (entry, now) => {
		if (!hasLiveDeliveryQueueClaim(entry, params.claimId, now)) return;
		return {
			...entry,
			availableAt: entry.requiresProducerClaim === true ? entry.recoveryState === "producer_claimed" ? now + PLATFORM_SEND_OWNER_LEASE_MS : entry.availableAt : void 0,
			producerClaimId: void 0,
			platformSendAttemptId: params.claimId,
			platformSendStartedAt: now,
			...params.route && "replyToId" in params.route ? { effectiveReplyToId: params.route.replyToId ?? null } : {},
			recoveryState: entry.recoveryState === "unknown_after_send" ? "unknown_after_send" : "send_attempt_started"
		};
	});
}
//#endregion
//#region src/infra/outbound/delivery-queue-ack.kernel.ts
/** Retires an unsent live claim while its adapter preparation still owns resources. */
function retireUnsentDeliveryInDatabase(database, params, terminalOutcome) {
	const stateDir = params.stateDir;
	let retired;
	transitionOwnedDeliveryQueueEntryInDatabase(database, {
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id: params.id,
		platformSendAttemptId: params.producerClaimId
	}, (current) => {
		if (current.recoveryState !== "producer_claimed" || current.platformSendAttemptId !== void 0 || current.platformSendStartedAt !== void 0 || !hasLiveDeliveryQueueClaim(current, params.producerClaimId, Date.now())) return;
		const entry = current;
		if (terminalOutcome === "failed" && entry.deliveryCompletion) return;
		const artifacts = collectEntrySpoolPaths(acceptedPreparedOutboundEntries(entry.preparedBatch).map((prepared) => prepared.payload), stateDir);
		if (terminalOutcome === "failed" && terminalizePendingDeliveryQueueEntryInDatabase(database, prepareDeliveryQueueTerminalEntry({
			queueName: "outbound-prepared-v1",
			id: entry.id,
			entry,
			expectedStatus: "pending"
		})).status !== "terminalized") return;
		const retention = artifacts.length ? createDeliveryQueueMediaRetentionInDatabase(database, artifacts, "outbound-media-recovery-lease") : void 0;
		if (terminalOutcome !== "failed") deleteDeliveryQueueEntryInDatabase(database, OUTBOUND_DELIVERY_QUEUE_NAME, entry.id);
		retired = {
			spoolPaths: artifacts,
			retention
		};
	});
	return retired;
}
function ackDeliveryInDatabase(database, id, requestedStateDir, options) {
	const stateDir = requestedStateDir;
	let spoolPaths = [];
	const settle = (current) => {
		spoolPaths = current ? collectEntrySpoolPaths(acceptedPreparedOutboundEntries(current.preparedBatch).map((prepared) => prepared.payload), stateDir) : [];
		if (current?.completionRetention && options?.suppressCompletionReceipt !== true) {
			if (options && "expectedPlatformSendAttemptId" in options) completeLoadedDeliveryQueueEntryInDatabase(database, OUTBOUND_DELIVERY_QUEUE_NAME, id, current);
			else completeDeliveryQueueEntryInDatabase(database, OUTBOUND_DELIVERY_QUEUE_NAME, id);
		} else deleteDeliveryQueueEntryInDatabase(database, OUTBOUND_DELIVERY_QUEUE_NAME, id);
	};
	if (!transitionOwnedDeliveryQueueEntryInDatabase(database, {
		queueName: "outbound-prepared-v1",
		id,
		platformSendAttemptId: options && "expectedPlatformSendAttemptId" in options ? options.expectedPlatformSendAttemptId ?? null : null,
		allowMissingEntry: !(options && "expectedPlatformSendAttemptId" in options)
	}, (entry) => {
		settle(entry);
	})) throw new Error(`Delivery platform claim was lost: ${id}`);
	return spoolPaths;
}
/** Conditionally dead-letter a freshly re-read pending entry without a claimed state. */
function failPendingDeliveryInDatabase(database, params, preparedTerminal) {
	const terminal = {
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id: params.id,
		entry: params.entry
	};
	const prepared = params.expectedPlatformSendAttemptId === void 0 ? preparedTerminal ?? prepareDeliveryQueueTerminalEntry(terminal) : void 0;
	let terminalized = false;
	const terminalize = () => {
		terminalized = terminalizePendingDeliveryQueueEntryInDatabase(database, prepared ?? prepareDeliveryQueueTerminalEntry(terminal)).status === "terminalized";
	};
	if (params.expectedPlatformSendAttemptId !== void 0) transitionOwnedDeliveryQueueEntryInDatabase(database, {
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id: params.id,
		platformSendAttemptId: params.expectedPlatformSendAttemptId
	}, terminalize);
	else terminalize();
	if (terminalized) return { status: "failed" };
	return { status: "not_pending" };
}
//#endregion
//#region src/infra/delivery-queue-sqlite-namespace.kernel.ts
/** Atomically publishes one staged owner only when retired namespaces do not own its id. */
function commitStagedDeliveryQueueEntryOnceAcrossNamespacesInDatabase(database, params) {
	return runSqliteImmediateTransactionSync(database.db, () => {
		const queueDb = getNodeSqliteKysely(database.db);
		if (!executeSqliteQueryTakeFirstSync(database.db, queueDb.selectFrom("delivery_queue_entries").select("id").where("queue_name", "=", params.stagingQueueName).where("id", "=", params.stagingId).where("status", "=", "pending"))) return "missing";
		if (getDeliveryQueueEntryOwnersInDatabase(database, [params.queueName, ...params.conflictQueueNames], params.entry.id).size > 0) return "existing";
		if (!upsertDeliveryQueueEntryInDatabase({
			queueName: params.queueName,
			entry: params.entry,
			insertOnly: true
		}, database)) return "existing";
		if (executeSqliteQuerySync(database.db, queueDb.deleteFrom("delivery_queue_entries").where("queue_name", "=", params.stagingQueueName).where("id", "=", params.stagingId).where("status", "=", "pending")).numAffectedRows !== 1n) throw new Error(`Delivery queue staging row changed during commit: ${params.stagingQueueName}/${params.stagingId}`);
		return "created";
	}, {
		databaseLabel: database.path,
		operationLabel: "commit staged stable delivery queue owner"
	});
}
/** Inserts one stable owner only when no current or retired namespace owns its id. */
function upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase(database, params) {
	return runSqliteImmediateTransactionSync(database.db, () => {
		if (getDeliveryQueueEntryOwnersInDatabase(database, [params.queueName, ...params.conflictQueueNames], params.entry.id).size > 0) return false;
		return upsertDeliveryQueueEntryInDatabase({
			queueName: params.queueName,
			entry: params.entry,
			insertOnly: true
		}, database);
	}, {
		databaseLabel: database.path,
		operationLabel: "insert stable delivery queue owner"
	});
}
/** Replaces a pending entry only while its authoritative serialized value is unchanged. */
function replacePendingDeliveryQueueEntryInDatabase(database, params) {
	if (params.expectedEntry.id !== params.replacementEntry.id) throw new Error(`Delivery queue replacement id mismatch: ${params.expectedEntry.id} != ${params.replacementEntry.id}`);
	return runSqliteImmediateTransactionSync(database.db, () => {
		const queueDb = getNodeSqliteKysely(database.db);
		const source = executeSqliteQueryTakeFirstSync(database.db, queueDb.selectFrom("delivery_queue_entries").select(["entry_json", "status"]).where("queue_name", "=", params.queueName).where("id", "=", params.expectedEntry.id));
		if (!source || source.status !== "pending" || source.entry_json !== JSON.stringify(params.expectedEntry)) return false;
		return upsertDeliveryQueueEntryInDatabase({
			queueName: params.queueName,
			entry: params.replacementEntry,
			updatePendingOnly: true
		}, database);
	}, {
		databaseLabel: database.path,
		operationLabel: "replace pending delivery queue entry"
	});
}
/** Completes a pending entry only while its authoritative serialized value is unchanged. */
function completePendingDeliveryQueueEntryInDatabase(database, params) {
	return runSqliteImmediateTransactionSync(database.db, () => {
		const queueDb = getNodeSqliteKysely(database.db);
		const source = executeSqliteQueryTakeFirstSync(database.db, queueDb.selectFrom("delivery_queue_entries").select(["entry_json", "status"]).where("queue_name", "=", params.queueName).where("id", "=", params.expectedEntry.id));
		if (!source || source.status !== "pending" || source.entry_json !== JSON.stringify(params.expectedEntry)) return false;
		completeDeliveryQueueEntryInDatabase(database, params.queueName, params.expectedEntry.id);
		return true;
	}, {
		databaseLabel: database.path,
		operationLabel: "complete pending delivery queue entry"
	});
}
/**
* Commits an asynchronously prepared replacement only if the authoritative
* source row is unchanged, then removes or terminally fences the old owner.
*/
function movePendingDeliveryQueueEntryNamespaceInDatabase(database, params) {
	return runSqliteImmediateTransactionSync(database.db, () => {
		const queueDb = getNodeSqliteKysely(database.db);
		const source = executeSqliteQueryTakeFirstSync(database.db, queueDb.selectFrom("delivery_queue_entries").select(["entry_json", "status"]).where("queue_name", "=", params.sourceQueueName).where("id", "=", params.expectedSourceEntry.id));
		if (!source || source.status !== "pending" || source.entry_json !== JSON.stringify(params.expectedSourceEntry)) return "source-changed";
		if (getDeliveryQueueEntryOwnersInDatabase(database, [params.destinationQueueName, ...params.conflictQueueNames ?? []], params.destinationEntry.id).size > 0) return "destination-exists";
		if (params.stagingId && params.stagingQueueName) {
			if (!executeSqliteQueryTakeFirstSync(database.db, queueDb.selectFrom("delivery_queue_entries").select("id").where("queue_name", "=", params.stagingQueueName).where("id", "=", params.stagingId).where("status", "=", "pending"))) return "staging-missing";
		}
		if (!upsertDeliveryQueueEntryInDatabase({
			queueName: params.destinationQueueName,
			entry: params.destinationEntry,
			insertOnly: true
		}, database)) return "destination-exists";
		if (params.retainSourceCompletionFence) completeDeliveryQueueEntryInDatabase(database, params.sourceQueueName, params.expectedSourceEntry.id);
		else deleteDeliveryQueueEntryInDatabase(database, params.sourceQueueName, params.expectedSourceEntry.id);
		if (params.stagingId && params.stagingQueueName) deleteDeliveryQueueEntryInDatabase(database, params.stagingQueueName, params.stagingId);
		return "moved";
	}, {
		databaseLabel: database.path,
		operationLabel: "migrate delivery queue namespace"
	});
}
//#endregion
export { createUnavailablePreparedOutboundBatch as _, upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase as a, preparedOutboundSuppressionOutcomes as b, retireUnsentDeliveryInDatabase as c, createInitialDeliveryProducerClaim as d, dispatchDeliveryQueueEntryPlatformSendInDatabase as f, acceptedPreparedOutboundEntries as g, transitionOwnedDeliveryQueueEntryInDatabase as h, replacePendingDeliveryQueueEntryInDatabase as i, PLATFORM_SEND_OWNER_LEASE_MS as l, renewDeliveryQueueEntryPlatformSendLeaseInDatabase as m, completePendingDeliveryQueueEntryInDatabase as n, ackDeliveryInDatabase as o, promoteDeliveryQueueEntryPlatformSendInDatabase as p, movePendingDeliveryQueueEntryNamespaceInDatabase as r, failPendingDeliveryInDatabase as s, commitStagedDeliveryQueueEntryOnceAcrossNamespacesInDatabase as t, claimDeliveryQueueEntryPlatformSendInDatabase as u, createUnmodifiedPreparedOutboundBatch as v, projectPreparedOutboundBatchForStorage as x, mapPreparedOutboundAcceptedPayloads as y };
