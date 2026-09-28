import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
//#region src/gateway/worker-environments/transcript-commit-store.ts
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
function isNonEmptyStringArray(value) {
	return Array.isArray(value) && value.length > 0 && value.every((entry) => typeof entry === "string" && entry.length > 0);
}
function isCommitResult(value) {
	if (!isRecord(value) || !isNonEmptyStringArray(value.entryIds)) return false;
	return typeof value.newLeafId === "string" && value.newLeafId.length > 0;
}
function isCommitErrorReason(value) {
	return value === "stale-base-leaf" || value === "epoch-mismatch" || value === "invalid-batch" || value === "session-not-attached";
}
function parseOutcomeJson(value) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch (error) {
		throw new Error("Worker transcript commit cached outcome is invalid", { cause: error });
	}
	if (!isRecord(parsed)) throw new Error("Worker transcript commit cached outcome is invalid");
	if (parsed.ok === true && isCommitResult(parsed.result)) return {
		ok: true,
		result: parsed.result
	};
	if (parsed.ok === false && isCommitErrorReason(parsed.reason)) return {
		ok: false,
		reason: parsed.reason
	};
	throw new Error("Worker transcript commit cached outcome is invalid");
}
function serializeOutcome(outcome) {
	const serialized = JSON.stringify(outcome);
	if (!serialized) throw new Error("Worker transcript commit outcome is not serializable");
	return serialized;
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
function insertHead(db, input) {
	const head = {
		session_id: input.sessionId,
		run_epoch: input.runEpoch,
		environment_id: input.environmentId,
		next_seq: 1,
		updated_at_ms: input.nowMs
	};
	executeSqliteQuerySync(db, query(db).insertInto("worker_transcript_commit_heads").values(head));
}
function insertPendingCommit(db, input) {
	const commit = {
		session_id: input.sessionId,
		run_epoch: input.runEpoch,
		seq: input.seq,
		request_hash: input.requestHash,
		state: "pending",
		result_json: null,
		created_at_ms: input.nowMs,
		updated_at_ms: input.nowMs
	};
	executeSqliteQuerySync(db, query(db).insertInto("worker_transcript_commits").values(commit));
}
function createWorkerTranscriptCommitStore(options = {}) {
	const path = (options.database ?? openOpenClawStateDatabase()).path;
	const now = options.now ?? Date.now;
	const write = (operation) => runOpenClawStateWriteTransaction(({ db }) => operation(db), { path });
	const begin = (rawInput) => {
		const input = normalizeInput(rawInput, now());
		return write((db) => {
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
			if (!head) insertHead(db, input);
			insertPendingCommit(db, input);
			return { kind: "claimed" };
		});
	};
	const complete = (rawInput) => {
		const input = normalizeInput(rawInput, now());
		const resultJson = serializeOutcome(rawInput.outcome);
		return write((db) => {
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
	};
	const discardUncommitted = (rawInput) => {
		const input = normalizeInput(rawInput, now());
		write((db) => executeSqliteQuerySync(db, query(db).deleteFrom("worker_transcript_commits").where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("seq", "=", input.seq).where("request_hash", "=", input.requestHash).where("state", "=", "pending").where((eb) => eb.exists(eb.selectFrom("worker_transcript_commit_heads").select("session_id").where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("environment_id", "=", input.environmentId).where("next_seq", "=", input.seq)))));
	};
	return {
		begin,
		complete,
		discardUncommitted
	};
}
//#endregion
//#region src/gateway/worker-environments/transcript-commit.ts
const loadTranscriptCommitRuntime = createLazyRuntimeModule(() => import("./transcript-commit.runtime.js"));
/** Applies ordered, idempotent semantic worker turns to the canonical session transcript. */
function createWorkerTranscriptCommitter(options) {
	const store = options.store ?? createWorkerTranscriptCommitStore();
	const sessionOperations = new KeyedAsyncQueue();
	const commit = async (params) => {
		const sessionId = params.identity.sessionId;
		if (!sessionId) return {
			ok: false,
			reason: "session-not-attached"
		};
		if (params.request.runEpoch !== params.identity.ownerEpoch) return {
			ok: false,
			reason: "epoch-mismatch"
		};
		return await sessionOperations.enqueue(sessionId, async () => {
			const { commitWorkerTranscript } = await loadTranscriptCommitRuntime();
			return await commitWorkerTranscript(options, store, sessionId, params);
		});
	};
	return { commit };
}
//#endregion
export { createWorkerTranscriptCommitter };
