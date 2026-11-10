import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../../openclaw-state-db-contract-QlwTsE6j.mjs";
import { r as isPostgresSqlConnection } from "../../sql-connection-DmQzXTVz.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql } from "../../kysely-sync-9fPQaMlh.mjs";
import { l as runSqliteWorkerTransactionSync, r as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-CpDyZPQ0.mjs";
import { r as requireNativeDatabaseFile } from "../../physical-facts-Cvtfrs3r.mjs";
import { z as ensureContextEngineTurnOutboxSchema } from "../../openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { c as transcriptEventJsonSql, d as transcriptEventNavigationSql } from "../../transcript-payload-Cu49oQKq.mjs";
import { t as getSessionKysely } from "../../session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as SqliteJsonlReadBudgetExceededError } from "../../sqlite-jsonl-budget-error-CtOAIuWx.mjs";
import "../../session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as assertSqliteJsonlReadBudget } from "../../sqlite-jsonl-budget-Ct596TxU.mjs";
import { n as isRetryableContextEngineTurnReadFailure } from "../../context-engine-turn-outbox-HB4IWCvc.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.transcript-range.worker.ts
function anchorsShareTarget(boundary) {
	const { admission, terminal } = boundary;
	return admission.agentId === terminal.agentId && admission.sessionId === terminal.sessionId && admission.sessionKey === terminal.sessionKey && admission.storePath === terminal.storePath && admission.generation === terminal.generation;
}
function validateAnchorRow(anchor, row) {
	return Boolean(row && row.generation === anchor.generation && row.seq === anchor.rawSeq && row.parent_id === anchor.effectiveParentId && row.message_position === anchor.activeMessagePosition);
}
function validateTerminalAncestry(params) {
	if (params.terminalEntryId === params.admissionEntryId) return "descendant";
	if (!(params.maxDepth > 0)) return "too-large";
	if (params.terminalParentId === params.admissionEntryId) return "descendant";
	if (params.terminalParentId === null || params.terminalParentId === params.terminalEntryId) return "non-descendant";
	const db = getSessionKysely(params.database);
	const depthLimit = Math.ceil(params.maxDepth);
	const admissionIsSqlText = toUSVString(params.admissionEntryId) === params.admissionEntryId;
	const terminalIsSqlText = toUSVString(params.terminalEntryId) === params.terminalEntryId;
	const ancestry = executeSqliteQueryTakeFirstSync(params.database, db.withRecursive("turn_ancestors", (query) => query.selectFrom("transcript_event_identities").select(["event_id", "parent_id"]).where("session_id", "=", params.sessionId).where("event_id", "=", params.terminalParentId).union(query.selectFrom("transcript_event_identities as identity").innerJoin("turn_ancestors as previous", "identity.event_id", "previous.parent_id").select(["identity.event_id", "identity.parent_id"]).where("identity.session_id", "=", params.sessionId).$if(admissionIsSqlText, (ancestors) => ancestors.where("previous.parent_id", "!=", params.admissionEntryId)).$if(terminalIsSqlText, (ancestors) => ancestors.where("identity.event_id", "!=", params.terminalEntryId))).limit(Number.isSafeInteger(depthLimit) ? depthLimit : -1)).selectFrom("turn_ancestors").select((eb) => [eb.fn.countAll().as("depth"), eb.fn.max(eb.case().when(eb.and([eb.val(admissionIsSqlText ? 1 : 0), eb("parent_id", "=", params.admissionEntryId)])).then(1).else(0).end()).as("found")]));
	if (ancestry.depth >= depthLimit) return "too-large";
	return ancestry.found === 1 ? "descendant" : "non-descendant";
}
/** Reads a closed turn through the caller's connection, such as an agent database worker's. */
function readClosedTranscriptTurnInDatabase(connection, params) {
	if (!anchorsShareTarget(params.boundary)) return { kind: "session-rebound" };
	const target = params.boundary.admission;
	return runSqliteDeferredTransactionSync(connection, () => {
		const db = getSessionKysely(connection);
		if (!executeSqliteQueryTakeFirstSync(connection, db.selectFrom("session_windows").select(["session_id"]).where("session_id", "=", target.sessionId).where("session_key", "=", target.sessionKey).limit(1))) return { kind: "session-rebound" };
		const frontier = executeSqliteQueryTakeFirstSync(connection, db.selectFrom("transcript_events").select("seq").where("session_id", "=", target.sessionId).orderBy("seq", "desc").limit(1))?.seq;
		const projection = executeSqliteQueryTakeFirstSync(connection, db.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", target.sessionId));
		if (frontier === void 0 || !projection || projection.needs_rebuild !== 0 || projection.indexed_seq !== frontier) return { kind: "projection-unavailable" };
		const readAnchor = (anchor) => executeSqliteQueryTakeFirstSync(connection, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([
			"identity.seq",
			"identity.parent_id",
			"active.message_position",
			"rewrite.generation",
			transcriptEventNavigationSql(connection, "event").as("event_json")
		]).where("identity.session_id", "=", target.sessionId).where("identity.event_id", "=", anchor.entryId).limit(1));
		const admissionRow = readAnchor(params.boundary.admission);
		const terminalRow = readAnchor(params.boundary.terminal);
		if (!validateAnchorRow(params.boundary.admission, admissionRow) || !validateAnchorRow(params.boundary.terminal, terminalRow)) return { kind: "stale" };
		const admissionEvent = JSON.parse(admissionRow.event_json);
		if (admissionEvent.type !== "message" || admissionEvent.message?.role !== "user") return { kind: "stale" };
		const ancestry = validateTerminalAncestry({
			database: connection,
			sessionId: target.sessionId,
			admissionEntryId: params.boundary.admission.entryId,
			terminalEntryId: params.boundary.terminal.entryId,
			terminalParentId: terminalRow.parent_id,
			maxDepth: params.maxEvents
		});
		if (ancestry !== "descendant") return { kind: ancestry };
		const selected = db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).where("active.session_id", "=", target.sessionId).where("active.message_position", "is not", null).where("active.message_position", ">=", params.boundary.admission.activeMessagePosition).where("active.message_position", "<=", params.boundary.terminal.activeMessagePosition).orderBy("active.message_position", "asc");
		try {
			assertSqliteJsonlReadBudget(connection, selected.clearOrderBy().select(["event.event_json", "event.event_utf8_bytes"]).as("events"), params.maxBytes, "Closed transcript turn", {
				hasExactUtf8Bytes: true,
				separatorBytes: 0,
				maxRows: params.maxEvents
			});
		} catch (error) {
			if (error instanceof SqliteJsonlReadBudgetExceededError) return { kind: "too-large" };
			throw error;
		}
		return {
			kind: "ok",
			messages: executeSqliteQuerySync(connection, selected.select(transcriptEventJsonSql(connection, "event").as("event_json"))).rows.flatMap((row) => {
				const event = JSON.parse(row.event_json);
				return event.type === "message" && event.message ? [event.message] : [];
			})
		};
	}, {
		databaseLabel: target.storePath,
		operationLabel: "session transcript accepted turn read"
	});
}
//#endregion
//#region src/agents/harness/context-engine-turn-outbox-state.ts
/** JSON remains canonical; the outbox writer stores this predicate with its payload. */
function deriveContextEngineTurnOutboxState(payload) {
	return isRecord(payload) && typeof payload.state === "string" ? payload.state : null;
}
//#endregion
//#region src/agents/harness/context-engine-turn-outbox.kernel.worker.ts
const RECOVERED_TURN_MAX_EVENTS = 2e4;
const RECOVERED_TURN_MAX_BYTES = 8388608;
function outboxPayloadRequiresAdvancement() {
	return sql`context_engine_turn_outbox.payload_state IS DISTINCT FROM 'blocked'`;
}
function outboxDb(database) {
	ensureContextEngineTurnOutboxSchema(database.db);
	return getNodeSqliteKysely(database.db);
}
function assertMatchingOutboxOwner(existing, params, advancementKey) {
	if (existing.engine_id !== params.engineId || existing.owner_plugin_id !== (params.ownerPluginId ?? null)) throw new Error(`context-engine advancement key collision: ${advancementKey}`);
}
function writeContextEngineTurnOutboxPayload(params) {
	const db = outboxDb(params.database);
	const admission = params.payload.state === "admitted" ? params.payload.admission : params.payload.boundary.admission;
	const advancementKey = admission.logicalTurnId;
	const payloadJson = JSON.stringify(params.payload);
	const existing = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("context_engine_turn_outbox").select([
		"engine_id",
		"owner_plugin_id",
		"payload_json"
	]).where("advancement_key", "=", advancementKey));
	if (existing) {
		assertMatchingOutboxOwner(existing, params, advancementKey);
		const existingPayload = JSON.parse(existing.payload_json);
		if (params.payload.state === "accepted" && existingPayload.state === "admitted" && existingPayload.admission.entryId === admission.entryId || (params.payload.state === "blocked" || params.payload.state === "ready") && existingPayload.state === "accepted" && existingPayload.boundary.admission.entryId === admission.entryId && existingPayload.boundary.terminal.entryId === params.payload.boundary.terminal.entryId) {
			executeSqliteQuerySync(params.database.db, db.updateTable("context_engine_turn_outbox").set({
				attempt_count: 0,
				last_attempt_at: null,
				last_error: null,
				payload_json: payloadJson,
				payload_state: deriveContextEngineTurnOutboxState(params.payload)
			}).where("advancement_key", "=", advancementKey));
			return;
		}
		if (existing.payload_json !== payloadJson) throw new Error(`context-engine advancement key collision: ${advancementKey}`);
		return;
	}
	executeSqliteQuerySync(params.database.db, db.insertInto("context_engine_turn_outbox").values({
		advancement_key: advancementKey,
		engine_id: params.engineId,
		owner_plugin_id: params.ownerPluginId ?? null,
		session_id: admission.sessionId,
		payload_json: payloadJson,
		payload_state: deriveContextEngineTurnOutboxState(params.payload),
		created_at: Date.now(),
		last_attempt_at: null,
		last_error: null
	}).onConflict((conflict) => conflict.column("advancement_key").doNothing()));
}
function enqueueContextEngineTurnIntent(params) {
	writeContextEngineTurnOutboxPayload({
		...params,
		payload: {
			admission: params.admission,
			isHeartbeat: params.isHeartbeat,
			state: "admitted"
		}
	});
}
function acceptContextEngineTurnIntent(params) {
	writeContextEngineTurnOutboxPayload({
		...params,
		payload: {
			boundary: params.boundary,
			isHeartbeat: params.isHeartbeat,
			state: "accepted",
			runtimeContext: params.runtimeContext
		}
	});
}
function enqueueContextEngineTurnCommit(params) {
	writeContextEngineTurnOutboxPayload({
		...params,
		payload: {
			...params.payload,
			state: "ready"
		}
	});
}
function blockContextEngineTurnIntent(params) {
	writeContextEngineTurnOutboxPayload({
		...params,
		payload: {
			boundary: params.boundary,
			failure: params.failure,
			isHeartbeat: params.isHeartbeat,
			state: "blocked"
		}
	});
}
function discardContextEngineTurnIntent(params) {
	const db = outboxDb(params.database);
	const result = executeSqliteQuerySync(params.database.db, db.deleteFrom("context_engine_turn_outbox").where("advancement_key", "=", params.admission.logicalTurnId).where("engine_id", "=", params.engineId).where("payload_state", "=", "admitted").where("owner_plugin_id", params.ownerPluginId ? "=" : "is", params.ownerPluginId ?? null));
	return result.numAffectedRows !== void 0 && result.numAffectedRows > 0n;
}
/**
* Reads an accepted turn's bounded range and publishes it as ready or blocked.
* The acceptance commits first in its own transaction, so a failed read or
* publication leaves the turn accepted and the next recovery advances it.
*/
function publishClosedContextEngineTurn(params) {
	return advanceAcceptedContextEngineTurn(params, params, params);
}
function advanceAcceptedContextEngineTurn(owner, payload, limits, onReadFailure) {
	const closedTurn = readClosedTranscriptTurnInDatabase(owner.database.db, {
		boundary: payload.boundary,
		maxEvents: limits.maxEvents,
		maxBytes: limits.maxBytes
	});
	if (closedTurn.kind !== "ok") {
		onReadFailure?.(closedTurn.kind);
		if (!isRetryableContextEngineTurnReadFailure(closedTurn.kind)) blockContextEngineTurnIntent({
			boundary: payload.boundary,
			database: owner.database,
			engineId: owner.engineId,
			failure: closedTurn.kind,
			isHeartbeat: payload.isHeartbeat,
			ownerPluginId: owner.ownerPluginId
		});
		return closedTurn.kind;
	}
	enqueueContextEngineTurnCommit({
		database: owner.database,
		engineId: owner.engineId,
		ownerPluginId: owner.ownerPluginId,
		payload: {
			boundary: payload.boundary,
			isHeartbeat: payload.isHeartbeat,
			messages: closedTurn.messages,
			runtimeContext: payload.runtimeContext
		}
	});
	return closedTurn.kind;
}
function recoverContextEngineTurnOutbox(params) {
	const db = outboxDb(params.database);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("context_engine_turn_outbox").select(["advancement_key", "payload_json"]).where("engine_id", "=", params.engineId).where("owner_plugin_id", params.ownerPluginId ? "=" : "is", params.ownerPluginId ?? null).where("session_id", "=", params.sessionId).where(outboxPayloadRequiresAdvancement()).orderBy("enqueue_sequence", "asc")).rows;
	let pending = false;
	for (const row of rows) {
		const payload = JSON.parse(row.payload_json);
		if (payload.state === "ready") {
			pending = true;
			continue;
		}
		if (payload.state === "blocked") continue;
		if (payload.state === "admitted") {
			discardContextEngineTurnIntent({
				admission: payload.admission,
				database: params.database,
				engineId: params.engineId,
				ownerPluginId: params.ownerPluginId
			});
			params.warn(`[context-engine] discarded unaccepted turn advancement: ${row.advancement_key}: recovery found no host acceptance`);
			continue;
		}
		const result = advanceAcceptedContextEngineTurn(params, payload, {
			maxEvents: RECOVERED_TURN_MAX_EVENTS,
			maxBytes: RECOVERED_TURN_MAX_BYTES
		}, (kind) => params.warn(isRetryableContextEngineTurnReadFailure(kind) ? `[context-engine] durable turn recovery remains queued: ${row.advancement_key}: transcript range is ${kind}` : `[context-engine] blocked unrecoverable turn advancement: ${row.advancement_key}: transcript range is ${kind}`));
		pending ||= result === "ok" || isRetryableContextEngineTurnReadFailure(result);
	}
	return pending;
}
function listPendingContextEngineTurnSessions(database, filter) {
	const query = pendingContextEngineTurns(database, filter, filter.sessionId || void 0).select("session_id").select((eb) => eb.fn.min("enqueue_sequence").as("oldest_enqueue_sequence"));
	return executeSqliteQuerySync(database.db, query.groupBy("session_id").orderBy("oldest_enqueue_sequence", "asc").limit(filter.limit)).rows.map(({ session_id }) => session_id);
}
function readNextPendingContextEngineTurn(database, filter) {
	return executeSqliteQueryTakeFirstSync(database.db, pendingContextEngineTurns(database, filter, filter.sessionId).select([
		"advancement_key",
		"payload_json",
		"session_id"
	]).orderBy("enqueue_sequence", "asc").limit(1));
}
function completeContextEngineTurn(database, advancementKey) {
	executeSqliteQuerySync(database.db, outboxDb(database).deleteFrom("context_engine_turn_outbox").where("advancement_key", "=", advancementKey));
}
function recordContextEngineTurnFailure(database, advancementKey, message, attemptedAt) {
	executeSqliteQuerySync(database.db, outboxDb(database).updateTable("context_engine_turn_outbox").set((eb) => ({
		attempt_count: eb("attempt_count", "+", 1),
		last_attempt_at: attemptedAt,
		last_error: message
	})).where("advancement_key", "=", advancementKey));
}
function pendingContextEngineTurns(database, filter, sessionId) {
	const query = outboxDb(database).selectFrom("context_engine_turn_outbox").where("engine_id", "=", filter.engineId).where("owner_plugin_id", filter.ownerPluginId ? "=" : "is", filter.ownerPluginId ?? null).where(outboxPayloadRequiresAdvancement());
	return sessionId === void 0 ? query : query.where("session_id", "=", sessionId);
}
function hasPendingContextEngineTurn(database, filter) {
	const query = pendingContextEngineTurns(database, filter, filter.sessionId || void 0).select("advancement_key");
	return executeSqliteQueryTakeFirstSync(database.db, query.limit(1)) !== void 0;
}
/**
* Recovers a session's outbox before a run and, when nothing remains to
* advance, records the known admission in the same transaction. The common
* turn start therefore needs one database round trip.
*/
function prepareContextEngineTurnRun(params) {
	const warnings = [];
	const pending = recoverContextEngineTurnOutbox({
		...params,
		warn: (message) => warnings.push(message)
	});
	if (pending || !params.admission) return {
		warnings,
		pending,
		admitted: false
	};
	enqueueContextEngineTurnIntent({
		...params,
		admission: params.admission
	});
	return {
		warnings,
		pending,
		admitted: true
	};
}
/** Runs one outbox command's kernel on the borrowed connection. */
function executeContextEngineTurnOutboxCommand(db, command) {
	if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
	const database = { db };
	switch (command.type) {
		case "prepareRun": return prepareContextEngineTurnRun({
			...command.input,
			database
		});
		case "listPendingSessions": return listPendingContextEngineTurnSessions(database, command.input);
		case "readNextPending": return readNextPendingContextEngineTurn(database, command.input);
		case "complete":
			completeContextEngineTurn(database, command.input.advancementKey);
			return;
		case "recordFailure":
			recordContextEngineTurnFailure(database, command.input.advancementKey, command.input.message, command.input.attemptedAt);
			return;
		case "hasPending": return hasPendingContextEngineTurn(database, command.input);
		case "enqueueIntent":
			enqueueContextEngineTurnIntent({
				...command.input,
				database
			});
			return;
		case "acceptIntent":
			acceptContextEngineTurnIntent({
				...command.input,
				database
			});
			return;
		case "publishClosedTurn": return publishClosedContextEngineTurn({
			...command.input,
			database
		});
		case "discardIntent": return discardContextEngineTurnIntent({
			...command.input,
			database
		});
	}
	throw new Error("Unknown context-engine turn outbox command");
}
//#endregion
//#region src/agents/harness/context-engine-turn-outbox.worker.ts
/** Borrows the canonical agent connection for one admitted outbox operation. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	return {
		execute(command) {
			return runSqliteWorkerTransactionSync(context, () => executeContextEngineTurnOutboxCommand(db, command), {
				operationLabel: `context-engine.turn-outbox.${command.type}`,
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: context.databasePath
			});
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (db.isTransaction) throw new Error("Context-engine turn outbox transaction did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
