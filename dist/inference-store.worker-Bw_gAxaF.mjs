import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { _ as validateWorkerInferenceTerminalOutcome } from "./worker-inference-B7U4TRc2.mjs";
//#region src/gateway/worker-environments/inference-store.kernel.ts
const REQUEST_HASH_PATTERN = /^[a-f0-9]{64}$/u;
const DEFAULT_RETENTION = {
	maxAgeMs: 864e5,
	maxRows: 256,
	maxBytes: 67108864
};
function required(value, field) {
	if (typeof value !== "string" || !value.trim()) throw new Error(`Worker inference turn ${field} must be a non-empty string`);
	return value.trim();
}
function nonNegativeInteger(value, field) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error(`Worker inference turn ${field} must be a non-negative integer`);
	return value;
}
function normalizeRequestHash(value) {
	if (typeof value !== "string" || !REQUEST_HASH_PATTERN.test(value)) throw new Error("Worker inference turn request hash must be lowercase SHA-256 hex");
	return value;
}
function normalizeInput(input, nowMs) {
	return {
		environmentId: required(input.environmentId, "environment id"),
		sessionId: required(input.sessionId, "session id"),
		runEpoch: nonNegativeInteger(input.runEpoch, "run epoch"),
		runId: required(input.runId, "run id"),
		turnId: required(input.turnId, "turn id"),
		requestHash: normalizeRequestHash(input.requestHash),
		nowMs: nonNegativeInteger(nowMs, "timestamp")
	};
}
function parseTerminalJson(value) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch (error) {
		throw new Error("Worker inference cached terminal outcome is invalid", { cause: error });
	}
	if (!validateWorkerInferenceTerminalOutcome(parsed)) throw new Error("Worker inference cached terminal outcome is invalid");
	return parsed;
}
function serializeTerminalOutcome(outcome) {
	if (!validateWorkerInferenceTerminalOutcome(outcome)) throw new Error("Worker inference terminal outcome is invalid");
	const serialized = JSON.stringify(outcome);
	if (!serialized) throw new Error("Worker inference terminal outcome is not serializable");
	return serialized;
}
const query = (db) => getNodeSqliteKysely(db);
function findTurn(db, input) {
	return executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_inference_turns").selectAll().where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("run_id", "=", input.runId).where("turn_id", "=", input.turnId));
}
function findPendingTurn(db, input) {
	return executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_inference_turns").selectAll().where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("run_id", "=", input.runId).where("state", "=", "pending"));
}
function classifyExistingTurn(row, input) {
	if (!row) return;
	if (row.environment_id !== input.environmentId || row.request_hash !== input.requestHash) return {
		kind: "rejected",
		reason: "conflict"
	};
	if (row.state === "pending" && row.terminal_json === null) return { kind: "recover" };
	if (row.state === "terminal" && row.terminal_json !== null) return {
		kind: "replay",
		outcome: parseTerminalJson(row.terminal_json)
	};
	throw new Error("Worker inference turn row has invalid terminal state");
}
function insertPendingTurn(db, input) {
	const turn = {
		session_id: input.sessionId,
		run_epoch: input.runEpoch,
		run_id: input.runId,
		turn_id: input.turnId,
		environment_id: input.environmentId,
		request_hash: input.requestHash,
		state: "pending",
		terminal_json: null,
		created_at_ms: input.nowMs,
		updated_at_ms: input.nowMs
	};
	executeSqliteQuerySync(db, query(db).insertInto("worker_inference_turns").values(turn));
}
function deleteTurn(db, row) {
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_inference_turns").where("session_id", "=", row.session_id).where("run_epoch", "=", row.run_epoch).where("run_id", "=", row.run_id).where("turn_id", "=", row.turn_id).where("state", "=", "terminal"));
}
function pruneTerminalTurns(params) {
	const db = query(params.db);
	const utf8 = executeSqliteQueryTakeFirstSync(params.db, db.selectFrom("pragma_encoding").select("encoding"))?.encoding === "UTF-8";
	const retained = db.selectFrom("worker_inference_turns").select([
		"session_id",
		"run_epoch",
		"run_id",
		"turn_id",
		"updated_at_ms"
	]).where("state", "=", "terminal").orderBy("updated_at_ms", "desc").orderBy("session_id", "asc").orderBy("run_epoch", "desc").orderBy("run_id", "asc").orderBy("turn_id", "asc");
	const rows = utf8 ? executeSqliteQuerySync(params.db, retained.select((eb) => eb.fn("octet_length", ["terminal_json"]).as("terminal_bytes"))).rows : executeSqliteQuerySync(params.db, retained.select("terminal_json")).rows.map((row) => ({
		session_id: row.session_id,
		run_epoch: row.run_epoch,
		run_id: row.run_id,
		turn_id: row.turn_id,
		updated_at_ms: row.updated_at_ms,
		terminal_bytes: Buffer.byteLength(row.terminal_json ?? "", "utf8")
	}));
	const isPreserved = (row) => params.preserve !== void 0 && row.session_id === params.preserve.sessionId && row.run_epoch === params.preserve.runEpoch && row.run_id === params.preserve.runId && row.turn_id === params.preserve.turnId;
	rows.sort((left, right) => Number(isPreserved(right)) - Number(isPreserved(left)));
	const cutoffMs = Math.max(0, params.nowMs - params.policy.maxAgeMs);
	let retainedRows = 0;
	let retainedBytes = 0;
	for (const row of rows) {
		const terminalBytes = row.terminal_bytes;
		const preserve = isPreserved(row);
		const expired = row.updated_at_ms < cutoffMs;
		const exceedsRows = retainedRows >= params.policy.maxRows;
		const exceedsBytes = retainedRows > 0 && retainedBytes + terminalBytes > params.policy.maxBytes;
		if (!preserve && (expired || exceedsRows || exceedsBytes)) {
			deleteTurn(params.db, row);
			continue;
		}
		retainedRows += 1;
		retainedBytes += terminalBytes;
	}
}
/** The shared-state worker supplies the already-admitted transaction connection. */
function createWorkerInferenceStoreKernel(options) {
	const now = options.now;
	const retention = {
		...DEFAULT_RETENTION,
		...options.retention
	};
	const begin = (rawInput) => {
		const input = normalizeInput(rawInput, now());
		const db = options.db;
		pruneTerminalTurns({
			db,
			nowMs: input.nowMs,
			policy: retention
		});
		const existing = classifyExistingTurn(findTurn(db, input), input);
		if (existing) return existing;
		if (findPendingTurn(db, input)) return {
			kind: "rejected",
			reason: "conflict"
		};
		insertPendingTurn(db, input);
		return { kind: "claimed" };
	};
	const complete = (rawInput) => {
		const input = normalizeInput(rawInput, now());
		const terminalJson = serializeTerminalOutcome(rawInput.outcome);
		const db = options.db;
		const existing = classifyExistingTurn(findTurn(db, input), input);
		if (!existing) throw new Error("Worker inference turn must begin before terminal completion");
		if (existing.kind === "rejected") throw new Error(`Worker inference terminal completion rejected: ${existing.reason}`);
		if (existing.kind === "replay") return existing.outcome;
		if (executeSqliteQuerySync(db, query(db).updateTable("worker_inference_turns").set({
			state: "terminal",
			terminal_json: terminalJson,
			updated_at_ms: input.nowMs
		}).where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("run_id", "=", input.runId).where("turn_id", "=", input.turnId).where("environment_id", "=", input.environmentId).where("request_hash", "=", input.requestHash).where("state", "=", "pending")).numAffectedRows !== 1n) throw new Error("Worker inference turn changed during terminal completion");
		pruneTerminalTurns({
			db,
			nowMs: input.nowMs,
			policy: retention,
			preserve: input
		});
		return rawInput.outcome;
	};
	const cancelPending = (params) => {
		const nowMs = nonNegativeInteger(now(), "timestamp");
		const terminalJson = serializeTerminalOutcome(params.outcome);
		const identity = {
			environmentId: required(params.environmentId, "environment id"),
			sessionId: required(params.sessionId, "session id"),
			runEpoch: nonNegativeInteger(params.runEpoch, "run epoch"),
			runId: required(params.runId, "run id"),
			turnId: required(params.turnId, "turn id")
		};
		const db = options.db;
		executeSqliteQuerySync(db, query(db).updateTable("worker_inference_turns").set({
			state: "terminal",
			terminal_json: terminalJson,
			updated_at_ms: nowMs
		}).where("session_id", "=", identity.sessionId).where("run_epoch", "=", identity.runEpoch).where("run_id", "=", identity.runId).where("turn_id", "=", identity.turnId).where("environment_id", "=", identity.environmentId).where("state", "=", "pending"));
		pruneTerminalTurns({
			db,
			nowMs,
			policy: retention,
			preserve: identity
		});
	};
	const recoverPending = (outcome) => {
		const nowMs = nonNegativeInteger(now(), "timestamp");
		const terminalJson = serializeTerminalOutcome(outcome);
		const db = options.db;
		executeSqliteQuerySync(db, query(db).updateTable("worker_inference_turns").set({
			state: "terminal",
			terminal_json: terminalJson,
			updated_at_ms: nowMs
		}).where("state", "=", "pending"));
		pruneTerminalTurns({
			db,
			nowMs,
			policy: retention
		});
	};
	return {
		begin,
		cancelPending,
		complete,
		recoverPending
	};
}
//#endregion
//#region src/gateway/worker-environments/inference-store.worker.ts
function operation(type, select) {
	return (input, { open }) => runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = select(createWorkerInferenceStoreKernel({
			db,
			now: () => input.nowMs,
			retention: input.retention
		}))(input.input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, { database: open() }, { operationLabel: type });
}
const workerInferenceOperations = {
	"workerInference.begin": operation("workerInference.begin", (store) => store.begin),
	"workerInference.complete": operation("workerInference.complete", (store) => store.complete),
	"workerInference.cancelPending": operation("workerInference.cancelPending", (store) => store.cancelPending),
	"workerInference.recoverPending": operation("workerInference.recoverPending", (store) => store.recoverPending)
};
//#endregion
export { workerInferenceOperations };
