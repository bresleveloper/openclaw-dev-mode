import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as normalizeOutboundReplyFacts } from "./reply-policy-DsydLD2-.mjs";
import { n as resolveDeliveryQueueStateEnv } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import { c as terminalizePendingDeliveryQueueEntry, r as countPendingDeliveryQueueEntriesForMaintenance } from "./delivery-queue-sqlite-BYjmoa0a.mjs";
import { a as settleDurableDelivery } from "./delivery-completion-4GBUPDR3.mjs";
import { a as createRenderedMessageBatchPlan, t as prepareOutboundPayloadBatch } from "./deliver-prepare-BPar_nlG.mjs";
import { n as collectEntrySpoolPaths } from "./delivery-queue-media-paths-BG8SwZ0-.mjs";
import { g as collectPayloadMediaSources, i as reconcileUnknownQueuedDelivery, w as resolveOutboundMediaAccessForSend } from "./delivery-queue-reconciliation-D87_379L.mjs";
import { c as mapPreparedOutboundAcceptedPayloads, d as projectPreparedOutboundBatchForStorage, i as projectQueuedDeliveryOptions, l as preparedOutboundPayloads, o as createUnavailablePreparedOutboundBatch } from "./delivery-queue-projection-Bc9Dusno.mjs";
import { a as resolveOutboundMediaMaxBytes } from "./configured-max-bytes-BaCve0jk.mjs";
import { c as OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, i as OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME, n as DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME, o as OUTBOUND_DELIVERY_QUEUE_NAME, r as LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME } from "./delivery-queue-namespaces-DQeyCJNT.mjs";
import { i as cancelDeliveryQueueMediaRetention, n as releaseSpoolArtifacts, r as stageQueuePayloadMedia } from "./delivery-queue-media-spool-BWU_UFQL.mjs";
import { f as loadPendingDeliveryMigrations, p as loadPendingLegacyDeliveryPreparations, u as loadLegacyPendingDeliveries } from "./delivery-queue-storage-B0ORUZO-.mjs";
import { a as replacePendingDeliveryQueueEntryInDatabase, i as movePendingDeliveryQueueEntryNamespaceInDatabase, t as assertDeliveryQueueReplacement } from "./delivery-queue-sqlite-namespace.kernel-C_g-7YjT.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/delivery-queue-sqlite-namespace.ts
/** Replaces a pending entry only while its authoritative serialized value is unchanged. */
function replacePendingDeliveryQueueEntry(params, context) {
	assertDeliveryQueueReplacement(params);
	return runOpenClawStateWriteTransaction((database) => replacePendingDeliveryQueueEntryInDatabase(database, params), { env: resolveDeliveryQueueStateEnv(params.stateDir, context) }, { operationLabel: "replace pending delivery queue entry" });
}
/**
* Commits an asynchronously prepared replacement only if the authoritative
* source row is unchanged, then removes or terminally fences the old owner.
*/
function movePendingDeliveryQueueEntryNamespace(params, context) {
	return runOpenClawStateWriteTransaction((database) => movePendingDeliveryQueueEntryNamespaceInDatabase(database, params), { env: resolveDeliveryQueueStateEnv(params.stateDir, context) }, { operationLabel: "migrate delivery queue namespace" });
}
//#endregion
//#region src/infra/outbound/delivery-queue-migration.ts
const LEGACY_PREPARATION_LEASE_MS = 3e5;
function withLegacyPreparationLease(entry, ownerId) {
	return {
		...entry,
		retainOnFailure: true,
		legacyPreparationOwnerId: ownerId,
		legacyPreparationLeaseExpiresAt: Date.now() + LEGACY_PREPARATION_LEASE_MS
	};
}
function hasActiveLegacyPreparationLease(entry) {
	return Boolean(entry.legacyPreparationOwnerId && typeof entry.legacyPreparationLeaseExpiresAt === "number" && entry.legacyPreparationLeaseExpiresAt > Date.now());
}
function buildLegacyPreparationParams(entry, cfg) {
	const reply = normalizeOutboundReplyFacts({
		reply: entry.reply,
		replyToId: entry.replyToId,
		replyToMode: entry.replyToMode
	});
	return {
		cfg,
		...projectQueuedDeliveryOptions(entry),
		queuePolicy: entry.queuePolicy,
		requireUnknownSendReconciliation: entry.requireUnknownSendReconciliation,
		payloads: entry.payloads,
		reply,
		replyPayloadSendingHook: entry.replyPayloadSendingHook,
		deliveryCompletion: entry.deliveryCompletion,
		completionRetention: entry.completionRetention
	};
}
async function prepareLegacyEntryCheckpoint(params) {
	const preparationParams = buildLegacyPreparationParams(params.entry, params.cfg);
	const reply = preparationParams.reply;
	const needsUnknownReconciliation = params.entry.recoveryState === "send_attempt_started" || params.entry.recoveryState === "unknown_after_send";
	const legacyUnknownSendReconciliation = needsUnknownReconciliation ? await reconcileUnknownQueuedDelivery({
		entry: {
			...params.entry,
			reply
		},
		payloads: params.entry.payloads,
		cfg: params.cfg,
		warn: (message) => params.log.warn(message)
	}) : void 0;
	if (needsUnknownReconciliation && (legacyUnknownSendReconciliation == null || legacyUnknownSendReconciliation.status === "unresolved")) {
		await failInterruptedLegacyPreparation({
			entry: params.entry,
			log: params.log,
			stateDir: params.stateDir
		});
		return "skipped";
	}
	const prepareForReplay = !needsUnknownReconciliation || params.entry.recoveryState === "send_attempt_started" && legacyUnknownSendReconciliation?.status === "not_sent";
	let sourceEntry = params.entry;
	let preparedBatch;
	if (prepareForReplay) {
		const replaceSourceEntry = (replacementEntry) => {
			const replaced = replacePendingDeliveryQueueEntry({
				queueName: OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
				expectedEntry: sourceEntry,
				replacementEntry,
				stateDir: params.stateDir
			});
			if (replaced) sourceEntry = replacementEntry;
			return replaced;
		};
		try {
			preparedBatch = await prepareOutboundPayloadBatch(preparationParams, {
				hookRunner: params.hookRunner,
				onBeforeFirstModifier: async () => {
					if (!replaceSourceEntry({
						...sourceEntry,
						legacyPreparationState: "modifiers_started"
					})) throw new Error(`Legacy delivery ${params.entry.id} preparation ownership changed`);
				}
			});
		} catch (error) {
			if (sourceEntry.legacyPreparationState === "modifiers_started") await failInterruptedLegacyPreparation({
				entry: sourceEntry,
				log: params.log,
				stateDir: params.stateDir
			});
			else replaceSourceEntry({
				...sourceEntry,
				legacyPreparationOwnerId: void 0,
				legacyPreparationLeaseExpiresAt: void 0
			});
			throw error;
		}
	} else preparedBatch = createUnavailablePreparedOutboundBatch(params.entry.payloads.length);
	const acceptedPayloads = preparedOutboundPayloads(preparedBatch);
	const { payloads: _legacyPayloads, replyPayloadSendingHook: _legacyReplyHook, replyToId: _legacyReplyToId, replyToMode: _legacyReplyToMode, legacyPreparationState: _legacyPreparationState, legacyPreparationOwnerId: _legacyPreparationOwnerId, legacyPreparationLeaseExpiresAt: _legacyPreparationLeaseExpiresAt, ...retained } = params.entry;
	let canonicalRetained = retained;
	if (prepareForReplay && needsUnknownReconciliation) {
		const { availableAt: _availableAt, producerClaimId: _producerClaimId, platformSendAttemptId: _platformSendAttemptId, platformSendStartedAt: _platformSendStartedAt, effectiveReplyToId: _effectiveReplyToId, recoveryState: _recoveryState, ...resetAttempt } = retained;
		canonicalRetained = resetAttempt;
	}
	const checkpoint = {
		...canonicalRetained,
		retainOnFailure: true,
		preparedBatch: projectPreparedOutboundBatchForStorage(preparedBatch),
		renderedBatchPlan: createRenderedMessageBatchPlan(acceptedPayloads),
		...reply ? { reply } : {},
		...!prepareForReplay && (legacyUnknownSendReconciliation?.status === "sent" || legacyUnknownSendReconciliation?.status === "not_sent") ? { legacyUnknownSendReconciliation } : {},
		...!prepareForReplay ? { legacyPreparedContentUnavailable: true } : {}
	};
	const result = movePendingDeliveryQueueEntryNamespace({
		sourceQueueName: OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
		destinationQueueName: OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
		expectedSourceEntry: sourceEntry,
		destinationEntry: checkpoint,
		stateDir: params.stateDir
	});
	if (result !== "moved") {
		params.log.warn(`Legacy delivery ${params.entry.id} preparation deferred: ${result}`);
		return "skipped";
	}
	return "checkpointed";
}
async function failInterruptedLegacyPreparation(params) {
	if (terminalizePendingDeliveryQueueEntry({
		queueName: "outbound-legacy-preparing-v1",
		id: params.entry.id,
		entry: params.entry,
		stateDir: params.stateDir
	}).status !== "terminalized") {
		params.log.warn(`Legacy delivery ${params.entry.id} preparation owner was already settled`);
		return;
	}
	if (params.entry.deliveryCompletion) try {
		await settleDurableDelivery(params.entry.deliveryCompletion, { platformSendStarted: true }, params.stateDir);
	} catch (error) {
		params.log.warn(`Legacy delivery ${params.entry.id} interrupted preparation owner could not be marked unknown: ${String(error)}`);
	}
	await releaseSpoolArtifacts(collectEntrySpoolPaths(params.entry.payloads, params.stateDir), params.stateDir).catch((error) => {
		params.log.warn(`Legacy delivery ${params.entry.id} failed preparation media cleanup failed: ${String(error)}`);
	});
}
function claimLegacyPreparation(params) {
	const claimed = withLegacyPreparationLease({
		...params.entry,
		legacyPreparationState: "claimed"
	}, params.ownerId);
	return (params.source === "preparing" ? replacePendingDeliveryQueueEntry({
		queueName: "outbound-legacy-preparing-v1",
		expectedEntry: params.entry,
		replacementEntry: claimed,
		stateDir: params.stateDir
	}) : movePendingDeliveryQueueEntryNamespace({
		sourceQueueName: "outbound",
		destinationQueueName: "outbound-legacy-preparing-v1",
		expectedSourceEntry: params.entry,
		destinationEntry: claimed,
		retainSourceCompletionFence: params.entry.requiresProducerClaim === true || params.entry.completionRetention !== void 0,
		stateDir: params.stateDir
	}) === "moved") ? claimed : null;
}
async function finalizePreparedMigration(params) {
	const acceptedPayloads = preparedOutboundPayloads(params.entry.preparedBatch);
	const stageForReplay = params.entry.legacyPreparedContentUnavailable !== true;
	let stagedPayloads = acceptedPayloads;
	let mediaStageId;
	let stagedArtifacts = [];
	if (stageForReplay) {
		const mediaParams = {
			...params.entry,
			cfg: params.cfg,
			payloads: acceptedPayloads
		};
		const staged = await stageQueuePayloadMedia({
			payloads: acceptedPayloads,
			mediaAccess: resolveOutboundMediaAccessForSend(mediaParams, collectPayloadMediaSources(acceptedPayloads)),
			maxBytes: resolveOutboundMediaMaxBytes({
				cfg: params.cfg,
				channel: params.entry.channel,
				accountId: params.entry.accountId
			}),
			stateDir: params.stateDir
		});
		if (staged.status !== "staged") {
			params.log.warn(`Legacy delivery ${params.entry.id} cannot be migrated: ${staged.reason} is not durable`);
			return "skipped";
		}
		stagedPayloads = staged.payloads;
		mediaStageId = staged.mediaStageId;
		stagedArtifacts = staged.artifacts;
	}
	let stagedArtifactsTransferred = false;
	try {
		const queuedPreparedBatch = mapPreparedOutboundAcceptedPayloads(params.entry.preparedBatch, stagedPayloads);
		const destination = {
			...params.entry,
			preparedBatch: queuedPreparedBatch,
			renderedBatchPlan: params.entry.renderedBatchPlan ?? createRenderedMessageBatchPlan(acceptedPayloads)
		};
		const result = movePendingDeliveryQueueEntryNamespace({
			sourceQueueName: OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
			destinationQueueName: OUTBOUND_DELIVERY_QUEUE_NAME,
			expectedSourceEntry: params.entry,
			destinationEntry: destination,
			...mediaStageId ? {
				stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME,
				stagingId: mediaStageId
			} : {},
			stateDir: params.stateDir
		});
		if (result !== "moved") {
			params.log.warn(`Legacy delivery ${params.entry.id} migration deferred: ${result}`);
			return "skipped";
		}
		stagedArtifactsTransferred = true;
		if (stageForReplay) await releaseSpoolArtifacts(collectEntrySpoolPaths(acceptedPayloads, params.stateDir), params.stateDir).catch((error) => {
			params.log.warn(`Legacy delivery ${params.entry.id} moved but old media cleanup failed: ${String(error)}`);
		});
		return "moved";
	} finally {
		if (!stagedArtifactsTransferred) {
			await cancelDeliveryQueueMediaRetention(mediaStageId, params.stateDir);
			await releaseSpoolArtifacts(stagedArtifacts, params.stateDir);
		}
	}
}
const activeLegacyMigrations = /* @__PURE__ */ new Map();
/** Migrates every unchanged pre-D4 pending row before canonical recovery scans. */
async function migrateLegacyPendingOutboundDeliveries(params) {
	const migrationKey = params.stateDir ?? "<default-state>";
	return await getOrCreatePromise(activeLegacyMigrations, migrationKey, () => migrateLegacyPendingOutboundDeliveriesOwned(params), { evictOnSettled: true });
}
async function migrateLegacyPendingOutboundDeliveriesOwned(params) {
	let moved = 0;
	let skipped = 0;
	const ownerId = randomUUID();
	const claimedPreparations = [];
	for (const entry of loadPendingLegacyDeliveryPreparations(params.stateDir)) {
		if (hasActiveLegacyPreparationLease(entry)) {
			skipped += 1;
			params.log.info(`Legacy delivery ${entry.id} preparation is leased by another owner`);
			continue;
		}
		if (entry.legacyPreparationState !== "claimed") {
			await failInterruptedLegacyPreparation({
				...params,
				entry
			});
			skipped += 1;
			continue;
		}
		const claimed = claimLegacyPreparation({
			entry,
			ownerId,
			stateDir: params.stateDir,
			source: "preparing"
		});
		if (!claimed) {
			skipped += 1;
			params.log.info(`Legacy delivery ${entry.id} preparation ownership changed`);
			continue;
		}
		claimedPreparations.push(claimed);
	}
	for (const entry of loadLegacyPendingDeliveries(params.stateDir)) {
		const claimed = claimLegacyPreparation({
			entry,
			ownerId,
			stateDir: params.stateDir,
			source: "legacy"
		});
		if (!claimed) {
			skipped += 1;
			params.log.warn(`Legacy delivery ${entry.id} could not acquire preparation ownership`);
			continue;
		}
		claimedPreparations.push(claimed);
	}
	for (const entry of claimedPreparations) try {
		if (await prepareLegacyEntryCheckpoint({
			...params,
			entry
		}) === "skipped") skipped += 1;
	} catch (error) {
		skipped += 1;
		params.log.warn(`Legacy delivery ${entry.id} migration failed: ${String(error)}`);
	}
	for (const entry of loadPendingDeliveryMigrations(params.stateDir)) try {
		if (await finalizePreparedMigration({
			...params,
			entry
		}) === "moved") moved += 1;
		else skipped += 1;
	} catch (error) {
		skipped += 1;
		params.log.warn(`Prepared delivery ${entry.id} migration failed: ${String(error)}`);
	}
	if (moved > 0 || skipped > 0) params.log.info(`Legacy delivery migration settled moved=${moved} skipped=${skipped}`);
	const remaining = countPendingDeliveryQueueEntriesForMaintenance([
		OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
		LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME,
		OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME
	], params.stateDir);
	return {
		moved,
		skipped,
		remaining
	};
}
//#endregion
export { migrateLegacyPendingOutboundDeliveries };
