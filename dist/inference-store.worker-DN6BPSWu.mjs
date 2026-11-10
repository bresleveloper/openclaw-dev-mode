import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { _ as validateWorkerInferenceTerminalOutcome } from "./worker-inference-DQS6vE1x.mjs";
import { t as createWorkerLedgerInputValidation } from "./worker-ledger-validation-CEPXLaeP.mjs";
//#region src/gateway/worker-environments/inference-store.kernel.ts
const { required, integer: nonNegativeInteger, requestHash: normalizeRequestHash } = createWorkerLedgerInputValidation("Worker inference turn");
const DEFAULT_RETENTION = {
	maxAgeMs: 864e5,
	maxRows: 256,
	maxBytes: 67108864
};
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
/** The shared-state worker supplies the already-admitted transaction connection. */
function createWorkerInferenceStoreKernel(options) {
	const { db, now } = options;
	const query = getNodeSqliteKysely(db);
	const retention = {
		...DEFAULT_RETENTION,
		...options.retention
	};
	const terminalUpdate = (terminalJson, nowMs) => query.updateTable("worker_inference_turns").set({
		state: "terminal",
		terminal_json: terminalJson,
		updated_at_ms: nowMs
	});
	const classifyTurn = (input) => {
		const row = executeSqliteQueryTakeFirstSync(db, query.selectFrom("worker_inference_turns").selectAll().where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("run_id", "=", input.runId).where("turn_id", "=", input.turnId));
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
	};
	const pruneTerminalTurns = (nowMs, preserve) => {
		const utf8 = executeSqliteQueryTakeFirstSync(db, query.selectFrom("pragma_encoding").select("encoding"))?.encoding === "UTF-8";
		const retained = query.selectFrom("worker_inference_turns").select([
			"session_id",
			"run_epoch",
			"run_id",
			"turn_id",
			"updated_at_ms"
		]).where("state", "=", "terminal").orderBy("updated_at_ms", "desc").orderBy("session_id", "asc").orderBy("run_epoch", "desc").orderBy("run_id", "asc").orderBy("turn_id", "asc");
		const rows = utf8 ? executeSqliteQuerySync(db, retained.select((eb) => eb.fn("octet_length", ["terminal_json"]).as("terminal_bytes"))).rows : executeSqliteQuerySync(db, retained.select("terminal_json")).rows.map((row) => ({
			session_id: row.session_id,
			run_epoch: row.run_epoch,
			run_id: row.run_id,
			turn_id: row.turn_id,
			updated_at_ms: row.updated_at_ms,
			terminal_bytes: Buffer.byteLength(row.terminal_json ?? "", "utf8")
		}));
		const isPreserved = (row) => preserve !== void 0 && row.session_id === preserve.sessionId && row.run_epoch === preserve.runEpoch && row.run_id === preserve.runId && row.turn_id === preserve.turnId;
		rows.sort((left, right) => Number(isPreserved(right)) - Number(isPreserved(left)));
		const cutoffMs = Math.max(0, nowMs - retention.maxAgeMs);
		let retainedRows = 0;
		let retainedBytes = 0;
		for (const row of rows) {
			const terminalBytes = row.terminal_bytes;
			const preserved = isPreserved(row);
			const expired = row.updated_at_ms < cutoffMs;
			const exceedsRows = retainedRows >= retention.maxRows;
			const exceedsBytes = retainedRows > 0 && retainedBytes + terminalBytes > retention.maxBytes;
			if (!preserved && (expired || exceedsRows || exceedsBytes)) {
				executeSqliteQuerySync(db, query.deleteFrom("worker_inference_turns").where("session_id", "=", row.session_id).where("run_epoch", "=", row.run_epoch).where("run_id", "=", row.run_id).where("turn_id", "=", row.turn_id).where("state", "=", "terminal"));
				continue;
			}
			retainedRows += 1;
			retainedBytes += terminalBytes;
		}
	};
	const begin = (rawInput) => {
		const input = normalizeInput(rawInput, now());
		pruneTerminalTurns(input.nowMs);
		const existing = classifyTurn(input);
		if (existing) return existing;
		if (executeSqliteQueryTakeFirstSync(db, query.selectFrom("worker_inference_turns").selectAll().where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("run_id", "=", input.runId).where("state", "=", "pending"))) return {
			kind: "rejected",
			reason: "conflict"
		};
		executeSqliteQuerySync(db, query.insertInto("worker_inference_turns").values({
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
		}));
		return { kind: "claimed" };
	};
	const complete = (rawInput) => {
		const input = normalizeInput(rawInput, now());
		const terminalJson = serializeTerminalOutcome(rawInput.outcome);
		const existing = classifyTurn(input);
		if (!existing) throw new Error("Worker inference turn must begin before terminal completion");
		if (existing.kind === "rejected") throw new Error(`Worker inference terminal completion rejected: ${existing.reason}`);
		if (existing.kind === "replay") return existing.outcome;
		if (executeSqliteQuerySync(db, terminalUpdate(terminalJson, input.nowMs).where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("run_id", "=", input.runId).where("turn_id", "=", input.turnId).where("environment_id", "=", input.environmentId).where("request_hash", "=", input.requestHash).where("state", "=", "pending")).numAffectedRows !== 1n) throw new Error("Worker inference turn changed during terminal completion");
		pruneTerminalTurns(input.nowMs, input);
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
		executeSqliteQuerySync(db, terminalUpdate(terminalJson, nowMs).where("session_id", "=", identity.sessionId).where("run_epoch", "=", identity.runEpoch).where("run_id", "=", identity.runId).where("turn_id", "=", identity.turnId).where("environment_id", "=", identity.environmentId).where("state", "=", "pending"));
		pruneTerminalTurns(nowMs, identity);
	};
	const recoverPending = (outcome) => {
		const nowMs = nonNegativeInteger(now(), "timestamp");
		const terminalJson = serializeTerminalOutcome(outcome);
		executeSqliteQuerySync(db, terminalUpdate(terminalJson, nowMs).where("state", "=", "pending"));
		pruneTerminalTurns(nowMs);
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
	return (input, { writeAdmitted }) => writeAdmitted(({ db }) => {
		return select(createWorkerInferenceStoreKernel({
			db,
			now: () => input.nowMs,
			retention: input.retention
		}))(input.input);
	}, {
		operationLabel: type,
		transactionEnvironment: "process"
	});
}
const workerInferenceOperations = {
	"workerInference.begin": operation("workerInference.begin", (store) => store.begin),
	"workerInference.complete": operation("workerInference.complete", (store) => store.complete),
	"workerInference.cancelPending": operation("workerInference.cancelPending", (store) => store.cancelPending),
	"workerInference.recoverPending": operation("workerInference.recoverPending", (store) => store.recoverPending)
};
//#endregion
export { workerInferenceOperations };
