import { ot as bindDeliveryQueueEntry } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { c as prepareClaimedSessionDelivery, l as prepareSessionDelivery, n as SessionDeliveryAcknowledgementFinalizeError, r as SessionDeliveryAttemptStartError, t as SESSION_DELIVERY_QUEUE_NAME } from "./session-delivery-queue.records-rYJIeHGW.mjs";
//#region src/infra/session-delivery-queue-storage.ts
function executeSessionDelivery(context, command) {
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command));
}
function prepareEntry(entry, mode) {
	return bindDeliveryQueueEntry({
		queueName: SESSION_DELIVERY_QUEUE_NAME,
		entry,
		...mode === "insert" ? { insertOnly: true } : { updatePendingOnly: true }
	});
}
async function enqueueSessionDelivery(params, context) {
	const entry = prepareSessionDelivery(params);
	await executeSessionDelivery(context, {
		type: "sessionDelivery.enqueue",
		input: prepareEntry(entry, "insert")
	});
	return entry.id;
}
async function enqueueClaimedSessionDelivery(params, initialAttemptLeaseMs, context) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.enqueueClaimed",
		input: prepareEntry(prepareClaimedSessionDelivery(params, initialAttemptLeaseMs), "insert")
	});
}
async function releaseSessionDeliveryClaim(id, context) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.releaseClaim",
		input: { id }
	});
}
async function deferSessionDelivery(id, delayMs, context) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.defer",
		input: {
			id,
			delayMs
		}
	});
}
async function advanceSessionDeliveryAgentRun(id, updates, context) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.advanceAgentRun",
		input: {
			id,
			updates
		}
	});
}
async function mergeSessionDeliveryPreparedMediaBlocks(id, mediaUrl, blocks, context) {
	const result = await executeSessionDelivery(context, {
		type: "sessionDelivery.mergePreparedMedia",
		input: {
			id,
			mediaUrl,
			blocksJson: JSON.stringify(blocks)
		}
	});
	return result.source === "input" ? blocks : result.blocks;
}
async function markSessionDeliveryAttemptStarted(entry, context) {
	try {
		await executeSessionDelivery(context, {
			type: "sessionDelivery.markAttemptStarted",
			input: prepareEntry({
				...entry,
				deliveryStartedAt: entry.deliveryStartedAt ?? Date.now()
			}, "update")
		});
	} catch (error) {
		throw new SessionDeliveryAttemptStartError(`Session delivery ${entry.id} could not persist attempt ownership`, { cause: error });
	}
}
async function markSessionDeliverySettlement(entry, outcome, context) {
	try {
		await executeSessionDelivery(context, {
			type: "sessionDelivery.markSettlement",
			input: prepareEntry({
				...entry,
				settlementOutcome: outcome,
				...outcome === "recovered" ? { acknowledgedAt: entry.acknowledgedAt ?? Date.now() } : {}
			}, "update")
		});
	} catch (error) {
		throw new SessionDeliveryAcknowledgementFinalizeError(entry.id, { cause: error });
	}
}
async function completeSessionDelivery(id, context) {
	try {
		await executeSessionDelivery(context, {
			type: "sessionDelivery.complete",
			input: { id }
		});
	} catch (error) {
		throw new SessionDeliveryAcknowledgementFinalizeError(id, { cause: error });
	}
}
async function failSessionDelivery(id, error, context, options) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.fail",
		input: {
			id,
			error,
			...options
		}
	});
}
async function loadPendingSessionDelivery(id, context) {
	const entry = await executeSessionDelivery(context, {
		type: "sessionDelivery.load",
		input: { id }
	});
	context.admission.assertCurrent();
	return entry;
}
async function loadPendingSessionDeliveries(context) {
	const entries = await executeSessionDelivery(context, {
		type: "sessionDelivery.list",
		input: void 0
	});
	context.admission.assertCurrent();
	return entries;
}
async function moveSessionDeliveryToFailed(id, context) {
	return executeSessionDelivery(context, {
		type: "sessionDelivery.moveToFailed",
		input: { id }
	});
}
//#endregion
export { enqueueSessionDelivery as a, loadPendingSessionDelivery as c, mergeSessionDeliveryPreparedMediaBlocks as d, moveSessionDeliveryToFailed as f, enqueueClaimedSessionDelivery as i, markSessionDeliveryAttemptStarted as l, completeSessionDelivery as n, failSessionDelivery as o, releaseSessionDeliveryClaim as p, deferSessionDelivery as r, loadPendingSessionDeliveries as s, advanceSessionDeliveryAgentRun as t, markSessionDeliverySettlement as u };
