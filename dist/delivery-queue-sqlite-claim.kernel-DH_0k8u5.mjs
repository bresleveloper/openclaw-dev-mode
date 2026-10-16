import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { b as loadDeliveryQueueEntryInDatabase, p as hasLiveDeliveryQueueClaim } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { a as generateSecureUuid } from "./secure-random-Dimnnrm0.mjs";
import { g as upsertDeliveryQueueEntryInDatabase } from "./delivery-queue-sqlite.kernel-NKJp0qk2.mjs";
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
	let expiresAt;
	return transitionDeliveryQueueEntryPlatformSendInDatabase(database, params, "renew", (entry, now) => {
		if (entry.requiresProducerClaim !== true || !hasLiveDeliveryQueueClaim(entry, params.claimId, now)) return;
		expiresAt = now + 6e4;
		return {
			...entry,
			availableAt: expiresAt
		};
	}) ? expiresAt : void 0;
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
export { promoteDeliveryQueueEntryPlatformSendInDatabase as a, dispatchDeliveryQueueEntryPlatformSendInDatabase as i, claimDeliveryQueueEntryPlatformSendInDatabase as n, renewDeliveryQueueEntryPlatformSendLeaseInDatabase as o, createInitialDeliveryProducerClaim as r, transitionOwnedDeliveryQueueEntryInDatabase as s, PLATFORM_SEND_OWNER_LEASE_MS as t };
