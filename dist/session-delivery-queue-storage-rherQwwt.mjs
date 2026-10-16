import { _ as bindDeliveryQueueEntry } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { T as parseCronRunScopeSuffix, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { n as assertExpectedExistingSession, t as ExpectedExistingSessionChangedError } from "./agent-expected-session-CCe5mUUR.mjs";
import { c as prepareClaimedSessionDelivery, i as SessionDeliveryDeadLetteredError, l as prepareSessionDelivery, n as SessionDeliveryAcknowledgementFinalizeError, r as SessionDeliveryAttemptStartError, t as SESSION_DELIVERY_QUEUE_NAME } from "./session-delivery-queue.records-E9Zh5OLd.mjs";
import path from "node:path";
//#region src/infra/session-delivery-queue-storage.ts
/** Queue publication and continuation deletion share the existing session lifecycle owner. */
async function withSessionDeliveryEnqueueAdmission(payload, context, run) {
	const binding = payload.kind === "agentTurn" && payload.requesterBinding ? { ...payload.requesterBinding } : void 0;
	const sessionKey = payload.sessionKey;
	const unavailable = "session delivery original requester is no longer available";
	const assertQueueCurrent = () => {
		context.admission.assertCurrent();
		if (binding && path.resolve(binding.storePath) !== path.resolve(resolveSessionStorePathCore(getRuntimeConfig().session?.store, {
			agentId: binding.agentId,
			env: context.environment
		}))) throw new SessionDeliveryDeadLetteredError(unavailable);
	};
	assertQueueCurrent();
	if (!binding && !parseCronRunScopeSuffix(sessionKey).runId) return await run(assertQueueCurrent);
	if (binding && binding.sessionKey !== sessionKey) throw new SessionDeliveryDeadLetteredError(unavailable);
	const agentId = binding?.agentId ?? resolveAgentIdFromSessionKey(sessionKey);
	const storePath = binding?.storePath ?? resolveSessionStorePathCore(getRuntimeConfig().session?.store, {
		agentId,
		env: context.environment
	});
	const scope = {
		agentId,
		storePath,
		sessionKey,
		env: context.environment,
		hydrateSkillPromptRefs: false
	};
	const readEntry = () => withSessionEntryReadOnlyInWorker(scope, assertQueueCurrent, async (read) => {
		if (!read.ok) throw read.error;
		if (!read.value) throw new SessionDeliveryDeadLetteredError(unavailable);
		return read.value;
	});
	const original = await readEntry();
	const constraint = binding ?? {
		sessionId: original.sessionId,
		lifecycleRevision: original.lifecycleRevision ?? null
	};
	let interruption;
	let lease;
	try {
		lease = await beginSessionWorkAdmission({
			scope: storePath,
			identities: [sessionKey, constraint.sessionId],
			assertAllowed: async (signal) => {
				signal.throwIfAborted();
				assertExpectedExistingSession({
					constraint,
					entry: await readEntry(),
					message: unavailable
				});
			},
			onInterrupt(reason) {
				interruption = reason ?? /* @__PURE__ */ new Error("session delivery admission interrupted");
			}
		});
		const assertCurrent = () => {
			assertQueueCurrent();
			if (interruption) throw interruption;
			if (!lease?.isActive()) throw new Error("session delivery admission closed");
		};
		return await lease.run(async () => await run(assertCurrent));
	} catch (error) {
		if (error instanceof ExpectedExistingSessionChangedError) throw new SessionDeliveryDeadLetteredError(unavailable);
		throw error;
	} finally {
		lease?.release();
	}
}
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
	const input = prepareEntry(entry, "insert");
	await withSessionDeliveryEnqueueAdmission(entry, context, (assertCurrent) => runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "sessionDelivery.enqueue",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	}));
	return entry.id;
}
async function enqueueClaimedSessionDelivery(params, initialAttemptLeaseMs, context) {
	const entry = prepareClaimedSessionDelivery(params, initialAttemptLeaseMs);
	const input = prepareEntry(entry, "insert");
	return withSessionDeliveryEnqueueAdmission(entry, context, (assertCurrent) => runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "sessionDelivery.enqueueClaimed",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	}));
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
export { enqueueSessionDelivery as a, loadPendingSessionDelivery as c, mergeSessionDeliveryPreparedMediaBlocks as d, moveSessionDeliveryToFailed as f, enqueueClaimedSessionDelivery as i, markSessionDeliveryAttemptStarted as l, withSessionDeliveryEnqueueAdmission as m, completeSessionDelivery as n, failSessionDelivery as o, releaseSessionDeliveryClaim as p, deferSessionDelivery as r, loadPendingSessionDeliveries as s, advanceSessionDeliveryAgentRun as t, markSessionDeliverySettlement as u };
