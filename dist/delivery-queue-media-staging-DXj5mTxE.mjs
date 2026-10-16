import { a as generateSecureUuid } from "./secure-random-Dimnnrm0.mjs";
import { l as executeDeliveryQueueOperation } from "./delivery-queue-sqlite-CZH3GILC.mjs";
//#region src/infra/outbound/delivery-queue-media-staging.ts
async function createDeliveryQueueMediaRetention(artifacts, entryKind, stateDir, context) {
	const prepared = {
		id: generateSecureUuid(),
		enqueuedAt: Date.now()
	};
	const preparedArtifacts = [...artifacts];
	return executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.createMediaRetention",
		input: {
			artifacts: preparedArtifacts,
			entryKind,
			prepared
		}
	});
}
/** Release a stage or recovery lease after its owner settles. */
async function cancelDeliveryQueueMediaRetention(id, stateDir, context) {
	if (!id) return;
	await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.cancelMediaRetention",
		input: { id }
	});
}
/** Captures staging expiry and all media custody on the same connection. */
async function loadDeliveryQueueMediaRetentionSnapshot(params, context) {
	return executeDeliveryQueueOperation(context, params.stateDir, {
		type: "deliveryQueue.mediaRetentionSnapshot",
		input: { expireBeforeMs: params.expireBeforeMs }
	});
}
//#endregion
export { createDeliveryQueueMediaRetention as n, loadDeliveryQueueMediaRetentionSnapshot as r, cancelDeliveryQueueMediaRetention as t };
