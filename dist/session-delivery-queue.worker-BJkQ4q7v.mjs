import { n as computeBackoff } from "./src-D1BHGNTj.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { _ as bindDeliveryQueueEntry, b as loadDeliveryQueueEntryInDatabase, w as upsertBoundDeliveryQueueEntryInDatabase } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { O as bindSubagentRunRecord, h as compareSubagentRunGeneration, j as rowToSubagentRunRecord, s as readSubagentRunRow } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { i as upsertSubagentRunRowInDatabase, t as conflictingSubagentRunVersions } from "./subagent-registry.store.kernel-5Rc86AOU.mjs";
import { d as prepareDeliveryQueueTerminalEntry, h as updateDeliveryQueueEntryInDatabase, l as getDeliveryQueueEntryOwnersInDatabase, m as terminalizePendingDeliveryQueueEntryInDatabase, o as deliveryQueueEntryNotFoundError, t as completeDeliveryQueueEntryInDatabase, u as loadDeliveryQueueEntriesInDatabase } from "./delivery-queue-sqlite.kernel-NKJp0qk2.mjs";
import { t as SESSION_DELIVERY_QUEUE_NAME } from "./session-delivery-queue.records-E9Zh5OLd.mjs";
import { t as mutateSubagentCompletionInDatabase } from "./subagent-completion-mutation.kernel-DIoaxDZ_.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/subagents/completion/subagent-completion-admission.worker.ts
const query = (db) => getNodeSqliteKysely(db);
/** The shared-state worker owns queue insertion and its exact native completion owner. */
function admitSubagentCompletionInWorker(input, database) {
	const { expected, subagent, queueEntry, writeId } = input;
	const owner = queueEntry.kind === "agentTurn" ? queueEntry.owner : void 0;
	const delivery = subagent.delivery;
	if (!owner || owner.kind !== "subagent_completion" || owner.runId !== subagent.runId || subagent.runId !== expected.runId || owner.generation !== delivery?.generation || owner.deadlineAt !== delivery.deadlineAt || queueEntry.id !== delivery.queueId) throw new Error("subagent completion admission records do not share one owner generation");
	const boundQueue = bindDeliveryQueueEntry({
		queueName: SESSION_DELIVERY_QUEUE_NAME,
		entry: queueEntry,
		insertOnly: true
	});
	const boundSubagent = bindSubagentRunRecord(subagent);
	return runOpenClawStateWriteTransaction(() => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: writeId
		});
		const conflictRunIds = conflictingSubagentRunVersions(database, input.versions);
		if (conflictRunIds.length > 0) return {
			writeId,
			conflictRunIds
		};
		const originalRow = readSubagentRunRow(database, expected.runId);
		const current = originalRow && rowToSubagentRunRecord(originalRow);
		if (!current || compareSubagentRunGeneration(current, expected) !== 0 || current.childSessionKey !== expected.childSessionKey || current.requesterSessionKey !== expected.requesterSessionKey || current.requesterStorePath !== expected.requesterStorePath) throw new Error("subagent completion owner changed before admission");
		const siblings = executeSqliteQuerySync(database.db, query(database.db).selectFrom("subagent_runs").selectAll().where("child_session_key", "=", expected.childSessionKey)).rows;
		for (const row of siblings) {
			const candidate = rowToSubagentRunRecord(row);
			if (!candidate || compareSubagentRunGeneration(candidate, expected) > 0) throw new Error("subagent completion owner was replaced before admission");
		}
		const claimed = upsertBoundDeliveryQueueEntryInDatabase(boundQueue, database);
		const status = getDeliveryQueueEntryOwnersInDatabase(database, ["session"], queueEntry.id).get("session")?.status ?? "pending";
		if (claimed) upsertSubagentRunRowInDatabase(database, boundSubagent);
		else {
			const existing = loadDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, queueEntry.id);
			const existingOwner = existing?.kind === "agentTurn" ? existing.owner : void 0;
			if (!existingOwner || existingOwner.kind !== owner.kind || existingOwner.runId !== owner.runId || existingOwner.taskId !== owner.taskId || existingOwner.generation !== owner.generation || existingOwner.deadlineAt !== owner.deadlineAt || existing?.sessionKey !== queueEntry.sessionKey || existing.kind === "agentTurn" && queueEntry.kind === "agentTurn" && !isDeepStrictEqual(existing.requesterBinding, queueEntry.requesterBinding) || (current.delivery?.generation ?? 1) !== owner.generation || status === "pending" && (current.delivery?.queueId !== queueEntry.id || current.delivery.deadlineAt !== owner.deadlineAt)) throw new Error(`session delivery queue conflict for ${queueEntry.id}`);
		}
		const row = readSubagentRunRow(database, expected.runId);
		if (!row) throw new Error("subagent completion owner disappeared during admission");
		const receipt = {
			writeId,
			claimed,
			status,
			row
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
	}, { operationLabel: "subagent completion delivery admission" });
}
function mutateSubagentCompletionInWorker(input, database) {
	return runOpenClawStateWriteTransaction(() => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: input.writeId
		});
		const conflictRunIds = conflictingSubagentRunVersions(database, input.versions);
		if (conflictRunIds.length > 0) return {
			writeId: input.writeId,
			conflictRunIds
		};
		const receipt = {
			writeId: input.writeId,
			...mutateSubagentCompletionInDatabase(database, input.mutation)
		};
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: input.writeId
		});
		deferSqliteWorkerCommitReceipt(database.db, receipt);
		return receipt;
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "subagent completion " + input.mutation.kind });
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
	"sessionDelivery.enqueue": (input, { open }) => {
		const database = open();
		return runOpenClawStateWriteTransaction(() => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			upsertBoundDeliveryQueueEntryInDatabase(input, database);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "sessionDelivery.enqueue" });
	},
	"sessionDelivery.enqueueClaimed": (input, { open }) => {
		const database = open();
		return runOpenClawStateWriteTransaction(() => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const id = input.row.id;
			const claimed = upsertBoundDeliveryQueueEntryInDatabase(input, database);
			let status;
			try {
				status = claimed ? "pending" : readStatus(database, id) ?? "completed";
			} catch {
				status = "unknown";
			}
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return {
				id,
				claimed,
				status
			};
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "sessionDelivery.enqueueClaimed" });
	},
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
