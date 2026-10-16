import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as isWorkerTranscriptCommitOutcome } from "./transcript-commit-store.worker-contract-BALHXoPT.mjs";
//#region src/gateway/worker-environments/transcript-commit-store.worker.ts
const REQUEST_HASH_PATTERN = /^[a-f0-9]{64}$/u;
function required(value, field) {
	if (typeof value !== "string" || !value.trim()) throw new Error(`Worker transcript commit ${field} must be a non-empty string`);
	return value.trim();
}
function nonNegativeInteger(value, field) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error(`Worker transcript commit ${field} must be a non-negative integer`);
	return value;
}
function positiveInteger(value, field) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw new Error(`Worker transcript commit ${field} must be a positive integer`);
	return value;
}
function normalizeRequestHash(value) {
	if (typeof value !== "string" || !REQUEST_HASH_PATTERN.test(value)) throw new Error("Worker transcript commit request hash must be lowercase SHA-256 hex");
	return value;
}
function parseOutcomeJson(value) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch (error) {
		throw new Error("Worker transcript commit cached outcome is invalid", { cause: error });
	}
	if (isWorkerTranscriptCommitOutcome(parsed)) return parsed.ok ? {
		ok: true,
		result: parsed.result
	} : {
		ok: false,
		reason: parsed.reason
	};
	throw new Error("Worker transcript commit cached outcome is invalid");
}
function normalizeInput(input, nowMs) {
	return {
		environmentId: required(input.environmentId, "environment id"),
		sessionId: required(input.sessionId, "session id"),
		runEpoch: nonNegativeInteger(input.runEpoch, "run epoch"),
		seq: positiveInteger(input.seq, "sequence"),
		requestHash: normalizeRequestHash(input.requestHash),
		nowMs: nonNegativeInteger(nowMs, "timestamp")
	};
}
const query = (db) => getNodeSqliteKysely(db);
function findHead(db, input) {
	return executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_transcript_commit_heads").selectAll().where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch));
}
function findCommit(db, input) {
	return executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_transcript_commits").selectAll().where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("seq", "=", input.seq));
}
function classifyExistingCommit(params) {
	if (!params.commit) return;
	if (!params.head) throw new Error("Worker transcript commit row has no sequence head");
	if (params.head.environment_id !== params.input.environmentId || params.commit.request_hash !== params.input.requestHash) return {
		kind: "rejected",
		reason: "conflict"
	};
	if (params.commit.state === "pending") return { kind: "recover" };
	if (params.commit.state === "terminal" && params.commit.result_json !== null) return {
		kind: "replay",
		outcome: parseOutcomeJson(params.commit.result_json)
	};
	throw new Error("Worker transcript commit row has invalid terminal state");
}
function writeTranscriptCommit(database, operationLabel, operation) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = operation(db);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: result
		});
		deferSqliteWorkerCommitReceipt(db, result);
		return result;
	}, { database }, { operationLabel });
}
const workerTranscriptCommitOperations = {
	"placementTranscript.begin": (rawInput, { open }) => {
		const database = open();
		const input = normalizeInput(rawInput, rawInput.nowMs);
		return writeTranscriptCommit(database, "placementTranscript.begin", (db) => {
			const head = findHead(db, input);
			const existing = classifyExistingCommit({
				head,
				commit: findCommit(db, input),
				input
			});
			if (existing) return existing;
			if (head && head.environment_id !== input.environmentId) return {
				kind: "rejected",
				reason: "conflict"
			};
			const expectedSeq = head?.next_seq ?? 1;
			if (input.seq !== expectedSeq) return {
				kind: "rejected",
				reason: "out-of-order",
				expectedSeq
			};
			if (!head) executeSqliteQuerySync(db, query(db).insertInto("worker_transcript_commit_heads").values({
				session_id: input.sessionId,
				run_epoch: input.runEpoch,
				environment_id: input.environmentId,
				next_seq: 1,
				updated_at_ms: input.nowMs
			}));
			executeSqliteQuerySync(db, query(db).insertInto("worker_transcript_commits").values({
				session_id: input.sessionId,
				run_epoch: input.runEpoch,
				seq: input.seq,
				request_hash: input.requestHash,
				state: "pending",
				result_json: null,
				created_at_ms: input.nowMs,
				updated_at_ms: input.nowMs
			}));
			return { kind: "claimed" };
		});
	},
	"placementTranscript.complete": (rawInput, { open }) => {
		const database = open();
		const input = normalizeInput(rawInput, rawInput.nowMs);
		const resultJson = JSON.stringify(rawInput.outcome);
		return writeTranscriptCommit(database, "placementTranscript.complete", (db) => {
			const head = findHead(db, input);
			const existing = classifyExistingCommit({
				head,
				commit: findCommit(db, input),
				input
			});
			if (!existing) throw new Error("Worker transcript commit must begin before terminal completion");
			if (existing.kind === "rejected") throw new Error(`Worker transcript commit terminal completion rejected: ${existing.reason}`);
			if (existing.kind === "replay") return existing.outcome;
			if (!head) throw new Error("Worker transcript commit row has no sequence head");
			if (head.next_seq !== input.seq) throw new Error(`Worker transcript commit terminal completion expected sequence ${head.next_seq}`);
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_transcript_commits").set({
				state: "terminal",
				result_json: resultJson,
				updated_at_ms: input.nowMs
			}).where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("seq", "=", input.seq).where("request_hash", "=", input.requestHash).where("state", "=", "pending")).numAffectedRows !== 1n) throw new Error("Worker transcript commit changed during terminal completion");
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_transcript_commit_heads").set({
				next_seq: input.seq + 1,
				updated_at_ms: input.nowMs
			}).where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("environment_id", "=", input.environmentId).where("next_seq", "=", input.seq)).numAffectedRows !== 1n) throw new Error("Worker transcript commit sequence changed during terminal completion");
			return rawInput.outcome;
		});
	},
	"placementTranscript.discard": (rawInput, { open }) => {
		const database = open();
		const input = normalizeInput(rawInput, rawInput.nowMs);
		return writeTranscriptCommit(database, "placementTranscript.discard", (db) => {
			executeSqliteQuerySync(db, query(db).deleteFrom("worker_transcript_commits").where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("seq", "=", input.seq).where("request_hash", "=", input.requestHash).where("state", "=", "pending").where((eb) => eb.exists(eb.selectFrom("worker_transcript_commit_heads").select("session_id").where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("environment_id", "=", input.environmentId).where("next_seq", "=", input.seq))));
			return true;
		});
	}
};
//#endregion
export { workerTranscriptCommitOperations };
