import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { t as SessionPendingInputCustodyError } from "./session-pending-input-custody-error-fcZzzQWk.mjs";
import { F as hasSessionPendingInputsSchema, v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { h as registerAgentEventLifecycleRotationHandler, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Ccvy5spR.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-accessor.sqlite-pending-inputs.ts
const workerCustody = resolveGlobalSingleton(Symbol.for("openclaw.sessionPendingInputWorkerCustody"), () => new AsyncLocalStorage());
function captureSessionPendingInputWorkerCustody() {
	const owner = owners.current.getStore();
	if (!owner) return;
	const copy = (current) => ({
		inputId: current.inputId,
		transcriptInputId: current.transcriptInputId,
		sessionId: current.sessionId,
		sessionKey: current.sessionKey,
		databasePath: current.workerDatabasePath,
		idempotencyKey: current.idempotencyKey,
		lifecycleGeneration: current.lifecycleGeneration,
		messageJson: current.messageJson,
		...current.sources ? { sources: current.sources.map(copy) } : {}
	});
	const relocation = owners.relocation.getStore();
	return {
		facts: copy(owner),
		...relocation?.owner === owner ? { relocation: relocation.sourceInputId } : {},
		assertCurrent: () => assertPendingInputOwnerCurrent(owner),
		publish(receipt) {
			owner.transcriptInputId = receipt.transcriptInputId;
			const consumed = new Set(receipt.consumedInputIds);
			for (const source of owner.sources ?? [owner]) if (consumed.has(source.inputId)) source.consumed = true;
		}
	};
}
/** Runs inside the writer; every live check crosses back to the captured host admission. */
function runWithSessionPendingInputWorkerCustody(facts, relocation, assertCurrent, run) {
	const hydrate = (current) => ({
		...current,
		workerDatabasePath: current.databasePath,
		sources: current.sources?.map(hydrate),
		assertCurrent,
		finish: () => {
			throw new Error("Worker custody cannot finish its host owner");
		}
	});
	const owner = hydrate(facts);
	return {
		value: workerCustody.run({
			owner,
			assertCurrent,
			consumed: /* @__PURE__ */ new Set()
		}, () => owners.current.run(owner, () => relocation === void 0 ? run() : owners.relocation.run({
			owner,
			sourceInputId: relocation
		}, run))),
		receipt: {
			transcriptInputId: owner.transcriptInputId,
			consumedInputIds: (owner.sources ?? [owner]).filter((source) => source.consumed).map((source) => source.inputId)
		}
	};
}
/** Provisional worker facts; only the matching outer COMMIT may publish them on the host. */
function readSessionPendingInputWorkerReceipt(database) {
	const custody = workerCustody.getStore();
	if (!custody) return;
	return {
		transcriptInputId: owners.transactionRelocations.get(database.db)?.get(custody.owner) ?? custody.owner.transcriptInputId,
		consumedInputIds: [...custody.consumed]
	};
}
const owners = resolveGlobalSingleton(Symbol.for("openclaw.sessionPendingInputOwners"), () => ({
	live: /* @__PURE__ */ new Map(),
	current: new AsyncLocalStorage(),
	relocation: new AsyncLocalStorage(),
	transactionRelocations: /* @__PURE__ */ new WeakMap()
}));
const recoveredDedupeOwners = resolveGlobalSingleton(Symbol.for("openclaw.sessionPendingInputDedupeRecoveries"), () => /* @__PURE__ */ new WeakSet());
registerAgentEventLifecycleRotationHandler("session-pending-inputs", () => {
	const failures = [];
	for (const owner of owners.live.values()) try {
		owner.finish("interrupted");
	} catch (error) {
		failures.push(error);
	}
	if (failures.length) throw new AggregateError(failures, "Failed to record interrupted pending inputs");
});
function registerSessionPendingInputOwner(owner) {
	if (owners.live.has(owner.inputId)) throw new Error("Pending input already has a live owner");
	owners.live.set(owner.inputId, owner);
}
function releaseSessionPendingInputOwner(owner) {
	if (owners.live.get(owner.inputId) === owner) owners.live.delete(owner.inputId);
}
function assertRegisteredSessionPendingInputOwner(owner) {
	if (owners.live.get(owner.inputId) !== owner) throw new SessionPendingInputCustodyError("Pending input settlement lost its registered owner");
}
function assertPendingInputOwnerCurrent(owner) {
	const worker = workerCustody.getStore();
	if (worker?.owner === owner) {
		worker.assertCurrent();
		return;
	}
	if (owner.sources) {
		for (const source of owner.sources) assertPendingInputOwnerCurrent(source);
		return;
	}
	if (owners.live.get(owner.inputId) !== owner || owner.settling || !isAgentEventLifecycleGenerationCurrent(owner.lifecycleGeneration)) throw new SessionPendingInputCustodyError("Pending input ownership ended; submit a new turn to continue");
	owner.assertCurrent();
}
function runWithSessionPendingInput(owner, run) {
	assertPendingInputOwnerCurrent(owner);
	return owners.current.run(owner, run);
}
/** Persistence alone may mirror a closed turn; the append owner proves exact committed bytes. */
function runWithSessionPendingInputPersistence(owner, persist) {
	return owners.current.run(owner, persist);
}
/** A transcript rewrite may move only the exact current user owned by the live admitted turn. */
function withSessionPendingInputRelocation(sourceInputId, message, append) {
	const owner = owners.current.getStore();
	const record = asOptionalRecord(message);
	const ownsSource = owner?.transcriptInputId === sourceInputId;
	const claimsOwner = record?.role === "user" && record.idempotencyKey === owner?.idempotencyKey;
	if (!owner || !ownsSource && !claimsOwner) return append();
	assertPendingInputOwnerCurrent(owner);
	if (JSON.stringify(message) !== owner.messageJson) throw new Error("Pending input relocation does not match its admitted transcript entry");
	return owners.relocation.run({
		owner,
		sourceInputId
	}, append);
}
/** Registration owns disposition even after operational cancellation; this check performs no SQL. */
function hasRegisteredSessionPendingInputOwner(databasePath, row) {
	const owner = owners.live.get(row.input_id);
	return owner?.workerDatabasePath === databasePath && owner.sessionId === row.session_id && owner.sessionKey === row.session_key && owner.lifecycleGeneration === row.lifecycle_generation && (owner.settling || isAgentEventLifecycleGenerationCurrent(owner.lifecycleGeneration));
}
function parseSessionPendingInputMessage(messageJson) {
	const value = JSON.parse(messageJson);
	if (asOptionalRecord(value)?.role !== "user") throw new Error("Pending input has an invalid persisted user message");
	return value;
}
function isFinalInputCompletion(outcome) {
	return outcome.reason === "completed" || outcome.reason === "cancelled" && outcome.stopReason !== "restart";
}
function readSessionInputCompletion(database, scope) {
	const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_input_completions").selectAll().where("session_key", "=", scope.sessionKey).where("session_id", "=", scope.sessionId).where("idempotency_key", "=", scope.idempotencyKey));
	if (!row) return;
	const outcome = JSON.parse(row.outcome_json);
	return {
		...row,
		outcome
	};
}
/** The caller holds the write transaction and has revalidated the exact live admission owner. */
function writeSessionInputCompletion(database, scope, outcome) {
	const retained = readSessionInputCompletion(database, scope);
	if (retained && isFinalInputCompletion(retained.outcome)) return retained.outcome;
	const succeeded = classifyAgentRunTerminalOutcome(outcome) === "success";
	executeSqliteQuerySync(database.db, getSessionKysely(database.db).insertInto("session_input_completions").values({
		session_key: scope.sessionKey,
		session_id: scope.sessionId,
		idempotency_key: scope.idempotencyKey,
		run_id: scope.runId,
		request_hash: scope.requestHash,
		outcome_json: JSON.stringify(outcome),
		succeeded: succeeded ? 1 : 0,
		completed_at: Date.now()
	}).onConflict((conflict) => conflict.columns(["session_id", "idempotency_key"]).doUpdateSet({
		outcome_json: JSON.stringify(outcome),
		succeeded: succeeded ? 1 : 0,
		completed_at: Date.now()
	}).where("session_input_completions.succeeded", "=", 0)));
	if (isFinalInputCompletion(outcome)) executeSqliteQuerySync(database.db, getSessionKysely(database.db).deleteFrom("session_pending_inputs").where("session_key", "=", scope.sessionKey).where("session_id", "=", scope.sessionId).where("idempotency_key", "=", scope.idempotencyKey).where("run_id", "=", scope.runId).where("request_hash", "=", scope.requestHash).where("lifecycle_generation", "=", scope.lifecycleGeneration));
	return outcome;
}
function projectSessionPendingInput(row) {
	if (row.state !== "queued" && row.state !== "interrupted" && row.state !== "cancelled") throw new Error("Pending input has an invalid disposition");
	return {
		id: row.input_id,
		runId: row.run_id,
		message: parseSessionPendingInputMessage(row.message_json),
		acceptedAt: row.accepted_at,
		state: row.state
	};
}
/** Capture the exact host owner before reading; claim it once in the consuming frame. */
function prepareCurrentSessionPendingInputDedupeRecovery(scope, runId) {
	const owner = owners.current.getStore();
	if (!owner || owner.sources || owner.restartRecovered !== true || recoveredDedupeOwners.has(owner) || owner.sessionId !== scope.sessionId || owner.sessionKey !== scope.sessionKey || owner.idempotencyKey !== `${runId}:user`) return;
	assertPendingInputOwnerCurrent(owner);
	return (path, snapshot) => {
		assertPendingInputOwnerCurrent(owner);
		const row = snapshot.pending;
		if (owners.current.getStore() !== owner || recoveredDedupeOwners.has(owner) || owner.consumed || owner.workerDatabasePath !== path || !snapshot.current || !row || row.input_id !== owner.inputId || row.run_id !== runId || row.session_key !== owner.sessionKey || row.session_id !== owner.sessionId || row.lifecycle_generation !== owner.lifecycleGeneration || row.message_json !== owner.messageJson || row.state !== "queued" || row.consumed_event_id != null || !hasRegisteredSessionPendingInputOwner(path, row)) return false;
		recoveredDedupeOwners.add(owner);
		return true;
	};
}
/** Query only the exact physical transcript; copied keys cannot adopt another generation. */
function readSessionPendingInputByKey(database, scope, idempotencyKey) {
	if (!hasSessionPendingInputsSchema(database.db)) return;
	return executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_pending_inputs").selectAll().where("session_id", "=", scope.sessionId).where("session_key", "=", scope.sessionKey).where("idempotency_key", "=", idempotencyKey));
}
/** The private call-path owner, not a copied id or durable row, permits promotion. */
function resolveSessionPendingInputAppend(database, scope, message) {
	const record = asOptionalRecord(message);
	if (record?.role !== "user" || typeof record.idempotencyKey !== "string") return;
	const idempotencyKey = record.idempotencyKey.trim();
	const row = readSessionPendingInputByKey(database, scope, idempotencyKey);
	const owner = owners.current.getStore();
	const ownsInput = owner?.idempotencyKey === idempotencyKey && owner.workerDatabasePath === (readOpenClawAgentDatabaseIdentity(database).canonicalPath || database.path) && owner.sessionId === scope.sessionId && owner.sessionKey === scope.sessionKey;
	if (!row && !ownsInput) return;
	if (!owner || !ownsInput || row && (row.input_id !== owner.inputId || row.consumed_event_id != null || row.state !== "queued" || row.lifecycle_generation !== owner.lifecycleGeneration)) throw new SessionPendingInputCustodyError("Pending input cannot be appended outside its admitted turn");
	const relocation = owners.relocation.getStore();
	const transcriptInputId = owners.transactionRelocations.get(database.db)?.get(owner) ?? owner.transcriptInputId;
	if (relocation?.owner === owner && relocation.sourceInputId !== transcriptInputId) throw new Error("Pending input relocation does not match its admitted transcript entry");
	const stageRelocation = relocation?.owner === owner ? (destinationInputId) => {
		let staged = owners.transactionRelocations.get(database.db);
		const hadPrevious = staged?.has(owner) ?? false;
		const previous = staged?.get(owner);
		if (!stageSqliteTransactionState(database.db, {
			stage: () => {
				staged ??= /* @__PURE__ */ new Map();
				owners.transactionRelocations.set(database.db, staged);
				staged.set(owner, destinationInputId);
			},
			rollback: () => {
				if (hadPrevious && previous !== void 0) staged?.set(owner, previous);
				else staged?.delete(owner);
				if (staged?.size === 0) owners.transactionRelocations.delete(database.db);
			},
			commit: () => {
				owner.transcriptInputId = destinationInputId;
				if (staged?.get(owner) === destinationInputId) staged.delete(owner);
				if (staged?.size === 0) owners.transactionRelocations.delete(database.db);
			}
		})) throw new Error("Pending input relocation requires a transcript write transaction");
	} : void 0;
	if (owner.sources) {
		const acceptedByKey = new Map(executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_pending_inputs").selectAll().where("session_id", "=", scope.sessionId).where("session_key", "=", scope.sessionKey).where("idempotency_key", "in", owner.sources.map((source) => source.idempotencyKey))).rows.map((sourceRow) => [sourceRow.idempotency_key, sourceRow]));
		const sources = owner.sources.map((source) => {
			const accepted = acceptedByKey.get(source.idempotencyKey);
			if (!accepted || accepted.input_id !== source.inputId || accepted.lifecycle_generation !== source.lifecycleGeneration || accepted.message_json !== source.messageJson) throw new SessionPendingInputCustodyError("Collected input custody changed before transcript promotion");
			return accepted;
		});
		const alreadyPromoted = sources.every((source) => source.consumed_event_id === owner.inputId);
		if (!alreadyPromoted) {
			if (sources.some((source) => source.consumed_event_id != null || source.state !== "queued")) throw new SessionPendingInputCustodyError("Collected input custody ended before transcript promotion");
			assertPendingInputOwnerCurrent(owner);
		}
		return {
			inputId: transcriptInputId,
			message: parseSessionPendingInputMessage(owner.messageJson),
			alreadyPromoted,
			sourceInputIds: sources.map((source) => source.input_id),
			...alreadyPromoted && stageRelocation ? { stageRelocation } : {}
		};
	}
	if (row) assertPendingInputOwnerCurrent(owner);
	return {
		inputId: transcriptInputId,
		message: parseSessionPendingInputMessage(row?.message_json ?? owner.messageJson),
		alreadyPromoted: !row,
		...!row && stageRelocation ? { stageRelocation } : {}
	};
}
function consumeSessionPendingInput(database, pending) {
	if (pending.alreadyPromoted) return;
	const owner = owners.current.getStore();
	const inputIds = new Set(pending.sourceInputIds ?? [pending.inputId]);
	const databasePath = readOpenClawAgentDatabaseIdentity(database).canonicalPath || database.path;
	const consumedOwners = (owner?.sources ?? (owner ? [owner] : [])).filter((candidate) => (owners.live.get(candidate.inputId) === candidate || workerCustody.getStore()?.owner === owner) && candidate.workerDatabasePath === databasePath && inputIds.has(candidate.inputId));
	if (pending.sourceInputIds) {
		if (executeSqliteQuerySync(database.db, getSessionKysely(database.db).updateTable("session_pending_inputs").set({ consumed_event_id: pending.inputId }).where("input_id", "in", [...pending.sourceInputIds]).where("state", "=", "queued").where("consumed_event_id", "is", null)).numAffectedRows !== BigInt(pending.sourceInputIds.length)) throw new SessionPendingInputCustodyError("Collected input custody changed during transcript promotion");
	} else if (executeSqliteQuerySync(database.db, getSessionKysely(database.db).deleteFrom("session_pending_inputs").where("input_id", "=", pending.inputId).where("state", "=", "queued")).numAffectedRows !== 1n) return;
	const worker = workerCustody.getStore();
	const newlyConsumed = consumedOwners.filter((candidate) => !worker?.consumed.has(candidate.inputId));
	stageSqliteTransactionState(database.db, {
		stage: () => {
			for (const consumedOwner of newlyConsumed) worker?.consumed.add(consumedOwner.inputId);
		},
		rollback: () => {
			for (const consumedOwner of newlyConsumed) worker?.consumed.delete(consumedOwner.inputId);
		},
		commit: () => {
			for (const consumedOwner of consumedOwners) consumedOwner.consumed = true;
		}
	});
}
/** Logical deletion also clears custody when transcript windows are retained. */
function deleteSessionPendingInputs(database, sessionKey) {
	if (hasSessionPendingInputsSchema(database.db)) executeSqliteQuerySync(database.db, getSessionKysely(database.db).deleteFrom("session_pending_inputs").where("session_key", "=", sessionKey));
}
//#endregion
export { runWithSessionPendingInputPersistence as _, hasRegisteredSessionPendingInputOwner as a, writeSessionInputCompletion as b, prepareCurrentSessionPendingInputDedupeRecovery as c, readSessionPendingInputByKey as d, readSessionPendingInputWorkerReceipt as f, runWithSessionPendingInput as g, resolveSessionPendingInputAppend as h, deleteSessionPendingInputs as i, projectSessionPendingInput as l, releaseSessionPendingInputOwner as m, captureSessionPendingInputWorkerCustody as n, isFinalInputCompletion as o, registerSessionPendingInputOwner as p, consumeSessionPendingInput as r, parseSessionPendingInputMessage as s, assertRegisteredSessionPendingInputOwner as t, readSessionInputCompletion as u, runWithSessionPendingInputWorkerCustody as v, withSessionPendingInputRelocation as y };
