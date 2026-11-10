import { n as computeBackoff } from "./src-Bzfi3cQM.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { C as upsertBoundDeliveryQueueEntryInDatabase, g as bindDeliveryQueueEntry, y as loadDeliveryQueueEntryInDatabase } from "./openclaw-state-db-legacy-backfills-DGJSWaXR.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { S as compareSubagentRunGeneration } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { i as rowToSubagentRunRecord, t as bindSubagentRunRecord } from "./subagent-registry.store.codec-D57MwX5M.mjs";
import { d as loadDeliveryQueueEntriesInDatabase, f as prepareDeliveryQueueTerminalEntry, g as updateDeliveryQueueEntryInDatabase, h as terminalizePendingDeliveryQueueEntryInDatabase, l as getDeliveryQueueEntryOwnersInDatabase, o as deliveryQueueEntryNotFoundError, t as completeDeliveryQueueEntryInDatabase } from "./delivery-queue-sqlite.kernel-C5HZlUKw.mjs";
import { t as SESSION_DELIVERY_QUEUE_NAME } from "./session-delivery-queue.records-mSSKRg96.mjs";
import { i as writeSubagentRunValuesInDatabase, r as readSubagentRunRow } from "./subagent-registry.store.sqlite-C94KteHI.mjs";
import { n as mutateSubagentCompletionInDatabase, t as decodeSubagentCompletionRecord } from "./subagent-completion-mutation.kernel-xxmbtVKz.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/subagents/completion/subagent-completion-admission.worker.ts
const query = (db) => getNodeSqliteKysely(db);
function commitCompletionWrite(input, database, operationLabel, mutate) {
	const { writeId } = input;
	return runOpenClawStateWriteTransaction(() => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: writeId
		});
		const receipt = {
			writeId,
			...mutate()
		};
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: writeId
		});
		deferSqliteWorkerCommitReceipt(database.db, receipt);
		return receipt;
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel });
}
/** The shared-state worker owns queue insertion and its exact native completion owner. */
function admitSubagentCompletionInWorker(input, database) {
	const { expected, subagent, queueEntry } = input;
	const owner = queueEntry.kind === "agentTurn" ? queueEntry.owner : void 0;
	const delivery = subagent.delivery;
	if (!owner || owner.kind !== "subagent_completion" || owner.runId !== subagent.runId || subagent.runId !== expected.runId || owner.generation !== delivery?.generation || owner.deadlineAt !== delivery.deadlineAt || queueEntry.id !== delivery.queueId) throw new Error("subagent completion admission records do not share one owner generation");
	const boundQueue = bindDeliveryQueueEntry({
		queueName: SESSION_DELIVERY_QUEUE_NAME,
		entry: queueEntry,
		insertOnly: true
	});
	const boundSubagent = bindSubagentRunRecord(subagent);
	return commitCompletionWrite(input, database, "subagent completion delivery admission", () => {
		const originalRow = readSubagentRunRow(database, expected.runId);
		const current = originalRow && rowToSubagentRunRecord(originalRow);
		if (!originalRow || !current || compareSubagentRunGeneration(current, expected) !== 0 || current.childSessionKey !== expected.childSessionKey || current.requesterSessionKey !== expected.requesterSessionKey || current.requesterStorePath !== expected.requesterStorePath) throw new Error("subagent completion owner changed before admission");
		const siblings = executeSqliteQuerySync(database.db, query(database.db).selectFrom("subagent_runs").selectAll().where("child_session_key", "=", expected.childSessionKey)).rows;
		for (const row of siblings) {
			const candidate = rowToSubagentRunRecord(row);
			if (!candidate || compareSubagentRunGeneration(candidate, expected) > 0) throw new Error("subagent completion owner was replaced before admission");
		}
		const claimed = upsertBoundDeliveryQueueEntryInDatabase(boundQueue, database);
		const status = claimed ? "pending" : getDeliveryQueueEntryOwnersInDatabase(database, ["session"], queueEntry.id).get("session")?.status ?? "pending";
		if (claimed) writeSubagentRunValuesInDatabase(database, [boundSubagent], []);
		else {
			const existing = loadDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, queueEntry.id);
			const existingOwner = existing?.kind === "agentTurn" ? existing.owner : void 0;
			if (!existingOwner || existingOwner.kind !== owner.kind || existingOwner.runId !== owner.runId || existingOwner.taskId !== owner.taskId || existingOwner.generation !== owner.generation || existingOwner.deadlineAt !== owner.deadlineAt || existing?.sessionKey !== queueEntry.sessionKey || existing.kind === "agentTurn" && queueEntry.kind === "agentTurn" && !isDeepStrictEqual(existing.requesterBinding, queueEntry.requesterBinding) || (current.delivery?.generation ?? 1) !== owner.generation || status === "pending" && (current.delivery?.queueId !== queueEntry.id || current.delivery.deadlineAt !== owner.deadlineAt)) throw new Error(`session delivery queue conflict for ${queueEntry.id}`);
		}
		return {
			claimed,
			status,
			record: decodeSubagentCompletionRecord(claimed ? boundSubagent : originalRow)
		};
	});
}
function mutateSubagentCompletionInWorker(input, database) {
	return commitCompletionWrite(input, database, "subagent completion " + input.mutation.kind, () => mutateSubagentCompletionInDatabase(database, input.mutation));
}
//#endregion
//#region src/infra/session-delivery-queue.worker.ts
function readSessionDelivery(database, id) {
	return loadDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, id, "pending");
}
function readStatus(database, id) {
	return getDeliveryQueueEntryOwnersInDatabase(database, [SESSION_DELIVERY_QUEUE_NAME], id).get(SESSION_DELIVERY_QUEUE_NAME)?.status;
}
function update(database, id, transform) {
	return updateDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, id, (entry) => transform(entry));
}
function finalize(database, id, status, transition) {
	try {
		transition();
	} catch (error) {
		try {
			if (readStatus(database, id) === status) return;
		} catch {}
		throw error;
	}
}
const sessionDeliveryOperations = {
	"sessionDelivery.mutateSubagentCompletion": (input, { open }) => mutateSubagentCompletionInWorker(input, open()),
	"sessionDelivery.admitSubagentCompletion": (input, { open }) => admitSubagentCompletionInWorker(input, open()),
	"sessionDelivery.enqueue": (input, { writeAdmitted }) => writeAdmitted((database) => {
		upsertBoundDeliveryQueueEntryInDatabase(input, database);
	}, { operationLabel: "sessionDelivery.enqueue" }),
	"sessionDelivery.enqueueClaimed": (input, { writeAdmitted }) => writeAdmitted((database) => {
		const id = input.row.id;
		const claimed = upsertBoundDeliveryQueueEntryInDatabase(input, database);
		let status;
		try {
			status = claimed ? "pending" : readStatus(database, id) ?? "completed";
		} catch {
			status = "unknown";
		}
		return {
			id,
			claimed,
			status
		};
	}, { operationLabel: "sessionDelivery.enqueueClaimed" }),
	"sessionDelivery.releaseClaim": (input, { open }) => {
		update(open(), input.id, (entry) => ({
			...entry,
			availableAt: Date.now()
		}));
	},
	"sessionDelivery.defer": (input, { open }) => {
		const database = open();
		const { id, delayMs } = input;
		update(database, id, (entry) => ({
			...entry,
			availableAt: Date.now() + Math.max(0, delayMs)
		}));
	},
	"sessionDelivery.advanceAgentRun": (input, { open }) => {
		const database = open();
		const { id, updates } = input;
		update(database, id, (entry) => entry.kind !== "agentTurn" ? entry : {
			...entry,
			agentRunAttempt: (entry.agentRunAttempt ?? 0) + 1,
			deliveryStartedAt: void 0,
			...updates?.message ? { message: updates.message } : {},
			...updates?.expectedMediaUrls ? { expectedMediaUrls: updates.expectedMediaUrls } : {},
			...updates?.suppressTextDelivery === true ? { suppressTextDelivery: true } : {}
		});
	},
	"sessionDelivery.mergePreparedMedia": (input, { open }) => {
		const database = open();
		const { id, mediaUrl, blocksJson } = input;
		let result = { source: "input" };
		update(database, id, (entry) => {
			if (entry.kind !== "agentTurn") return entry;
			const stored = entry.preparedMediaBlocks?.[mediaUrl];
			const blocks = stored ?? JSON.parse(blocksJson);
			if (stored != null) result = {
				source: "stored",
				blocks: stored
			};
			return {
				...entry,
				preparedMediaBlocks: {
					...entry.preparedMediaBlocks,
					[mediaUrl]: blocks
				}
			};
		});
		return result;
	},
	"sessionDelivery.markAttemptStarted": (input, { open }) => {
		const database = open();
		if (!upsertBoundDeliveryQueueEntryInDatabase(input, database)) throw new Error(`Session delivery ${input.row.id} is no longer pending`);
	},
	"sessionDelivery.markSettlement": (input, { open }) => {
		const database = open();
		const id = input.row.id;
		return finalize(database, id, "completed", () => {
			if (upsertBoundDeliveryQueueEntryInDatabase(input, database) || readStatus(database, id) === "completed") return;
			throw new Error(`Session delivery ${id} is no longer pending`);
		});
	},
	"sessionDelivery.complete": (input, { open }) => {
		const database = open();
		const { id } = input;
		return finalize(database, id, "completed", () => {
			completeDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, id);
		});
	},
	"sessionDelivery.fail": (input, { open }) => {
		const database = open();
		const { id, error, releaseAttemptOwnership } = input;
		update(database, id, (entry) => {
			const retryCount = entry.retryCount + 1;
			const now = Date.now();
			return {
				...entry,
				retryCount,
				...entry.kind === "agentTurn" ? { lastChargedAgentRunAttempt: entry.agentRunAttempt ?? 0 } : {},
				...releaseAttemptOwnership === true ? { deliveryStartedAt: void 0 } : {},
				lastAttemptAt: now,
				...entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion" ? { availableAt: now + computeBackoff({
					initialMs: 15e3,
					factor: 2,
					maxMs: 3e5,
					jitter: .2
				}, retryCount) } : {},
				lastError: error
			};
		});
	},
	"sessionDelivery.load": (input, { open }) => readSessionDelivery(open(), input.id),
	"sessionDelivery.list": (_input, { open }) => {
		const database = open();
		return loadDeliveryQueueEntriesInDatabase(database, SESSION_DELIVERY_QUEUE_NAME);
	},
	"sessionDelivery.moveToFailed": (input, { open }) => {
		const database = open();
		const { id } = input;
		return finalize(database, id, "failed", () => {
			const entry = readSessionDelivery(database, id);
			if (!entry) throw deliveryQueueEntryNotFoundError(SESSION_DELIVERY_QUEUE_NAME, id);
			if (terminalizePendingDeliveryQueueEntryInDatabase(database, prepareDeliveryQueueTerminalEntry({
				queueName: "session",
				id,
				entry
			})).status !== "terminalized") throw deliveryQueueEntryNotFoundError(SESSION_DELIVERY_QUEUE_NAME, id);
		});
	}
};
//#endregion
export { sessionDeliveryOperations };
