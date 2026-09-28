import { r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as generateSecureUuid } from "./secure-random-BJtJxP9Y.mjs";
import { n as resolveDeliveryQueueStateEnv } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import { f as executeDeliveryQueueOperation, i as deleteDeliveryQueueEntry } from "./delivery-queue-sqlite-BghoE75G.mjs";
import { t as DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME } from "./delivery-queue-namespaces-CO-cZrdV.mjs";
import { t as createDeliveryQueueMediaRetentionInDatabase } from "./delivery-queue-media-staging.kernel-CWmLB9kk.mjs";
//#region src/infra/outbound/delivery-queue-media-staging.ts
function createDeliveryQueueMediaRetention(artifacts, entryKind, stateDir, database, context) {
	const prepared = {
		id: generateSecureUuid(),
		enqueuedAt: Date.now()
	};
	const preparedArtifacts = [...artifacts];
	return createDeliveryQueueMediaRetentionInDatabase(database ?? openOpenClawStateDatabase({ env: resolveDeliveryQueueStateEnv(stateDir, context) }), preparedArtifacts, entryKind, prepared);
}
/** Release a stage or recovery lease after its owner settles. */
function cancelDeliveryQueueMediaRetention(id, stateDir, context) {
	if (!id) return;
	deleteDeliveryQueueEntry(DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME, id, stateDir, context);
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
