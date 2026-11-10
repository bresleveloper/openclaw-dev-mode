import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-XnYlwTNV.mjs";
import { l as outboundDeliveryQueueName, s as OUTBOUND_EXECUTABLE_QUEUE_NAMES } from "./delivery-queue-namespaces-DQeyCJNT.mjs";
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
function preparedOutboundPayloads(batch) {
	return acceptedPreparedOutboundEntries(batch).map((entry) => entry.payload);
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
//#region src/infra/outbound/delivery-queue-projection.ts
/** Copies shared send options without transferring queue custody or process-local callbacks. */
function projectQueuedDeliveryOptions(params) {
	return {
		channel: params.channel,
		to: params.to,
		accountId: params.accountId,
		renderedBatchPlan: params.renderedBatchPlan,
		threadId: params.threadId,
		formatting: params.formatting,
		identity: params.identity,
		bestEffort: params.bestEffort,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		silent: params.silent,
		mirror: params.mirror,
		session: params.session,
		gatewayClientScopes: params.gatewayClientScopes,
		preparedMessageId: params.preparedMessageId
	};
}
function projectOutboundDelivery(queueName, entry) {
	if (!OUTBOUND_EXECUTABLE_QUEUE_NAMES.some((name) => name === queueName)) throw new Error(`Unsupported outbound delivery format: ${queueName}`);
	const delivery = entry;
	if (queueName === "outbound-command-owner-v1") {
		if (delivery.deliveryCompletion?.kind !== "pending-final") throw new Error(`Missing command-owner delivery completion: ${entry.id}`);
		delivery.deliveryCompletion.commandOwnerReference ??= null;
	}
	if (queueName !== outboundDeliveryQueueName(delivery)) throw new Error(`Outbound delivery authority does not match its format: ${entry.id}`);
	return delivery;
}
function encodeOutboundDeliverySnapshot(entry) {
	return {
		queueName: outboundDeliveryQueueName(entry),
		entryJson: JSON.stringify(entry)
	};
}
function decodeOutboundDeliverySnapshot(snapshot) {
	const entry = JSON.parse(snapshot.entryJson);
	if (!isRecord(entry) || typeof entry.id !== "string" || typeof entry.enqueuedAt !== "number" || typeof entry.retryCount !== "number") throw new Error("Invalid outbound delivery storage snapshot");
	return projectOutboundDelivery(snapshot.queueName, {
		...entry,
		id: entry.id,
		enqueuedAt: entry.enqueuedAt,
		retryCount: entry.retryCount
	});
}
//#endregion
export { acceptedPreparedOutboundEntries as a, mapPreparedOutboundAcceptedPayloads as c, projectPreparedOutboundBatchForStorage as d, projectQueuedDeliveryOptions as i, preparedOutboundPayloads as l, encodeOutboundDeliverySnapshot as n, createUnavailablePreparedOutboundBatch as o, projectOutboundDelivery as r, createUnmodifiedPreparedOutboundBatch as s, decodeOutboundDeliverySnapshot as t, preparedOutboundSuppressionOutcomes as u };
