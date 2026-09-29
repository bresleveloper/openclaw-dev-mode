import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as failDurableDelivery } from "./delivery-completion-DxLFTv-D.mjs";
import { n as countPendingDeliveryQueueEntries, u as terminalizePendingDeliveryQueueEntry } from "./delivery-queue-sqlite-BghoE75G.mjs";
import { s as createRenderedMessageBatchPlan, t as prepareOutboundPayloadBatch } from "./deliver-prepare-CcRB3z1q.mjs";
import { r as normalizeOutboundReplyFacts } from "./reply-policy-B3zWXBNP.mjs";
import { _ as resolveOutboundMediaAccessForSend, n as reconcileUnknownQueuedDelivery, u as collectPayloadMediaSources } from "./delivery-queue-reconciliation-CRIys7F4.mjs";
import { _ as createUnavailablePreparedOutboundBatch, g as acceptedPreparedOutboundEntries, x as projectPreparedOutboundBatchForStorage, y as mapPreparedOutboundAcceptedPayloads } from "./delivery-queue-sqlite-namespace.kernel-CbSzRfE6.mjs";
import { r as resolveOutboundMediaMaxBytes } from "./configured-max-bytes-CWCWnxsU.mjs";
import { D as replacePendingDeliveryQueueEntry, E as movePendingDeliveryQueueEntryNamespace, d as loadLegacyPendingDeliveries, m as loadPendingLegacyDeliveryPreparations, p as loadPendingDeliveryMigrations } from "./delivery-queue-storage-Cpr0qrGT.mjs";
import { n as collectEntrySpoolPaths } from "./delivery-queue-media-paths-BxTKmyok.mjs";
import { a as OUTBOUND_DELIVERY_QUEUE_NAME, n as LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, o as OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, r as OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME, t as DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME } from "./delivery-queue-namespaces-CO-cZrdV.mjs";
import { t as cancelDeliveryQueueMediaRetention } from "./delivery-queue-media-staging-CNnanQB_.mjs";
import { n as releaseSpoolArtifacts, r as stageQueuePayloadMedia } from "./delivery-queue-media-spool-Ybjx6uOd.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/outbound/delivery-queue-migration.ts
const LEGACY_PREPARATION_LEASE_MS = 3e5;
const LEGACY_PREPARATION_LEASE_RENEW_MS = 3e4;
function withLegacyPreparationLease(entry, ownerId, now = Date.now()) {
	return {
		...entry,
		retainOnFailure: true,
		legacyPreparationOwnerId: ownerId,
		legacyPreparationLeaseExpiresAt: now + LEGACY_PREPARATION_LEASE_MS
	};
}
function hasActiveLegacyPreparationLease(entry, now = Date.now()) {
	return Boolean(entry.legacyPreparationOwnerId && typeof entry.legacyPreparationLeaseExpiresAt === "number" && entry.legacyPreparationLeaseExpiresAt > now);
}
function buildLegacyPreparationParams(entry, cfg) {
	const reply = normalizeOutboundReplyFacts({
		reply: entry.reply,
		replyToId: entry.replyToId,
		replyToMode: entry.replyToMode
	});
	return {
		cfg,
		channel: entry.channel,
		to: entry.to,
		accountId: entry.accountId,
		queuePolicy: entry.queuePolicy,
		requireUnknownSendReconciliation: entry.requireUnknownSendReconciliation,
		payloads: entry.payloads,
		renderedBatchPlan: entry.renderedBatchPlan,
		threadId: entry.threadId,
		reply,
		formatting: entry.formatting,
		identity: entry.identity,
		bestEffort: entry.bestEffort,
		gifPlayback: entry.gifPlayback,
		forceDocument: entry.forceDocument,
		replyPayloadSendingHook: entry.replyPayloadSendingHook,
		silent: entry.silent,
		mirror: entry.mirror,
		session: entry.session,
		gatewayClientScopes: entry.gatewayClientScopes,
		preparedMessageId: entry.preparedMessageId,
		deliveryCompletion: entry.deliveryCompletion,
		completionRetention: entry.completionRetention,
		skipQueue: true
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
		let modifiersStarted = false;
		let leaseLost = false;
		const renewLease = () => {
			if (leaseLost) return;
			const renewed = withLegacyPreparationLease(sourceEntry, params.ownerId);
			if (!replacePendingDeliveryQueueEntry({
				queueName: "outbound-legacy-preparing-v1",
				expectedEntry: sourceEntry,
				replacementEntry: renewed,
				stateDir: params.stateDir
			})) {
				leaseLost = true;
				return;
			}
			sourceEntry = renewed;
		};
		const renewLeaseSafely = () => {
			try {
				renewLease();
			} catch (error) {
				leaseLost = true;
				params.log.warn(`Legacy delivery ${params.entry.id} preparation lease renewal failed: ${String(error)}`);
			}
		};
		const leaseTimer = setInterval(renewLeaseSafely, LEGACY_PREPARATION_LEASE_RENEW_MS);
		leaseTimer.unref();
		try {
			preparedBatch = await prepareOutboundPayloadBatch(preparationParams, {
				hookRunner: params.hookRunner,
				onBeforeFirstModifier: async () => {
					if (leaseLost) throw new Error(`Legacy delivery ${params.entry.id} preparation lease was lost`);
					const startedEntry = {
						...sourceEntry,
						legacyPreparationState: "modifiers_started"
					};
					if (!replacePendingDeliveryQueueEntry({
						queueName: "outbound-legacy-preparing-v1",
						expectedEntry: sourceEntry,
						replacementEntry: startedEntry,
						stateDir: params.stateDir
					})) throw new Error(`Legacy delivery ${params.entry.id} preparation ownership changed`);
					sourceEntry = startedEntry;
					modifiersStarted = true;
				}
			});
			if (leaseLost) throw new Error(`Legacy delivery ${params.entry.id} preparation lease was lost`);
		} catch (error) {
			clearInterval(leaseTimer);
			if (modifiersStarted) await failInterruptedLegacyPreparation({
				entry: sourceEntry,
				log: params.log,
				stateDir: params.stateDir
			});
			else if (!leaseLost) {
				const releasedEntry = {
					...sourceEntry,
					legacyPreparationOwnerId: void 0,
					legacyPreparationLeaseExpiresAt: void 0
				};
				replacePendingDeliveryQueueEntry({
					queueName: OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
					expectedEntry: sourceEntry,
					replacementEntry: releasedEntry,
					stateDir: params.stateDir
				});
			}
			throw error;
		}
		clearInterval(leaseTimer);
	} else preparedBatch = createUnavailablePreparedOutboundBatch(params.entry.payloads.length);
	const acceptedPayloads = acceptedPreparedOutboundEntries(preparedBatch).map((entry) => entry.payload);
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
		await failDurableDelivery(params.entry.deliveryCompletion, params.stateDir);
	} catch (error) {
		params.log.warn(`Legacy delivery ${params.entry.id} interrupted preparation owner could not be marked unknown: ${String(error)}`);
	}
	await releaseSpoolArtifacts(collectEntrySpoolPaths(params.entry.payloads, params.stateDir), params.stateDir).catch((error) => {
		params.log.warn(`Legacy delivery ${params.entry.id} failed preparation media cleanup failed: ${String(error)}`);
	});
}
function claimLegacyEntryForPreparation(params) {
	const claimed = withLegacyPreparationLease({
		...params.entry,
		legacyPreparationState: "claimed"
	}, params.ownerId);
	return movePendingDeliveryQueueEntryNamespace({
		sourceQueueName: "outbound",
		destinationQueueName: "outbound-legacy-preparing-v1",
		expectedSourceEntry: params.entry,
		destinationEntry: claimed,
		retainSourceCompletionFence: params.entry.requiresProducerClaim === true || params.entry.completionRetention !== void 0,
		stateDir: params.stateDir
	}) === "moved" ? claimed : null;
}
function reclaimLegacyPreparation(params) {
	const claimed = withLegacyPreparationLease(params.entry, params.ownerId);
	return replacePendingDeliveryQueueEntry({
		queueName: "outbound-legacy-preparing-v1",
		expectedEntry: params.entry,
		replacementEntry: claimed,
		stateDir: params.stateDir
	}) ? claimed : null;
}
async function finalizePreparedMigration(params) {
	const acceptedPayloads = acceptedPreparedOutboundEntries(params.entry.preparedBatch).map((entry) => entry.payload);
	const stageForReplay = params.entry.legacyPreparedContentUnavailable !== true;
	let stagedPayloads = acceptedPayloads;
	let mediaStageId;
	let stagedArtifacts = [];
	if (stageForReplay) {
		const mediaParams = {
			...params.entry,
			cfg: params.cfg,
			payloads: acceptedPayloads,
			skipQueue: true
		};
		const staged = await stageQueuePayloadMedia({
			payloads: acceptedPayloads,
			mediaAccess: resolveOutboundMediaAccessForSend(mediaParams, params.entry.channel, collectPayloadMediaSources(acceptedPayloads)),
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
			cancelDeliveryQueueMediaRetention(mediaStageId, params.stateDir);
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
		const claimed = reclaimLegacyPreparation({
			entry,
			ownerId,
			stateDir: params.stateDir
		});
		if (!claimed) {
			skipped += 1;
			params.log.info(`Legacy delivery ${entry.id} preparation ownership changed`);
			continue;
		}
		claimedPreparations.push(claimed);
	}
	for (const entry of loadLegacyPendingDeliveries(params.stateDir)) {
		const claimed = claimLegacyEntryForPreparation({
			entry,
			ownerId,
			stateDir: params.stateDir
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
			entry,
			ownerId
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
	const remaining = countPendingDeliveryQueueEntries([
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
