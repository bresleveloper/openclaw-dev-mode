import { a as getNodeSqliteKysely, d as sql, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { R as ensureContextEngineTurnOutboxSchema } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { t as readClosedTranscriptTurnInDatabase } from "./session-accessor.transcript-range-Bz2uFTHG.mjs";
//#region src/agents/harness/context-engine-turn-outbox.ts
const RECOVERED_TURN_MAX_EVENTS = 2e4;
const RECOVERED_TURN_MAX_BYTES = 8388608;
function outboxEnqueueSequence() {
	return sql`context_engine_turn_outbox.rowid`;
}
function oldestOutboxEnqueueSequence() {
	return sql`MIN(context_engine_turn_outbox.rowid)`;
}
function outboxPayloadRequiresAdvancement() {
	return sql`json_extract(context_engine_turn_outbox.payload_json, '$.state') IS NOT 'blocked'`;
}
function isRetryableContextEngineTurnReadFailure(kind) {
	return kind === "projection-unavailable";
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
				payload_json: payloadJson
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
	executeSqliteQuerySync(params.database.db, db.deleteFrom("context_engine_turn_outbox").where("advancement_key", "=", params.admission.logicalTurnId).where("engine_id", "=", params.engineId).where("owner_plugin_id", params.ownerPluginId ? "=" : "is", params.ownerPluginId ?? null));
}
/**
* Reads an accepted turn's bounded range and publishes it as ready or blocked.
* The acceptance commits first in its own transaction, so a failed read or
* publication leaves the turn accepted and the next recovery advances it.
*/
function publishClosedContextEngineTurn(params) {
	const existing = executeSqliteQueryTakeFirstSync(params.database.db, outboxDb(params.database).selectFrom("context_engine_turn_outbox").select("payload_json").where("advancement_key", "=", params.boundary.admission.logicalTurnId));
	if (!existing) return "ok";
	if (JSON.parse(existing.payload_json).state !== "accepted") return "ok";
	const closedTurn = readClosedTranscriptTurnInDatabase(params.database.db, {
		boundary: params.boundary,
		maxEvents: params.maxEvents,
		maxBytes: params.maxBytes
	});
	if (closedTurn.kind !== "ok") {
		if (!isRetryableContextEngineTurnReadFailure(closedTurn.kind)) blockContextEngineTurnIntent({
			...params,
			failure: closedTurn.kind
		});
		return closedTurn.kind;
	}
	enqueueContextEngineTurnCommit({
		database: params.database,
		engineId: params.engineId,
		ownerPluginId: params.ownerPluginId,
		payload: {
			boundary: params.boundary,
			isHeartbeat: params.isHeartbeat,
			messages: closedTurn.messages,
			runtimeContext: params.runtimeContext
		}
	});
	return closedTurn.kind;
}
function recoverContextEngineTurnOutbox(params) {
	const db = outboxDb(params.database);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("context_engine_turn_outbox").select(["advancement_key", "payload_json"]).where("engine_id", "=", params.engineId).where("owner_plugin_id", params.ownerPluginId ? "=" : "is", params.ownerPluginId ?? null).where("session_id", "=", params.sessionId).where(outboxPayloadRequiresAdvancement()).orderBy(outboxEnqueueSequence(), "asc")).rows;
	for (const row of rows) {
		const payload = JSON.parse(row.payload_json);
		if (payload.state === "ready") continue;
		if (payload.state === "blocked") continue;
		if (payload.state === "admitted") {
			discardContextEngineTurnIntent({
				admission: payload.admission,
				database: params.database,
				engineId: params.engineId,
				ownerPluginId: params.ownerPluginId
			});
			continue;
		}
		const closedTurn = readClosedTranscriptTurnInDatabase(params.database.db, {
			boundary: payload.boundary,
			maxEvents: RECOVERED_TURN_MAX_EVENTS,
			maxBytes: RECOVERED_TURN_MAX_BYTES
		});
		if (closedTurn.kind !== "ok") {
			if (isRetryableContextEngineTurnReadFailure(closedTurn.kind)) {
				params.warn(`[context-engine] durable turn recovery remains queued: ${row.advancement_key}: transcript range is ${closedTurn.kind}`);
				continue;
			}
			params.warn(`[context-engine] blocked unrecoverable turn advancement: ${row.advancement_key}: transcript range is ${closedTurn.kind}`);
			blockContextEngineTurnIntent({
				boundary: payload.boundary,
				database: params.database,
				engineId: params.engineId,
				failure: closedTurn.kind,
				isHeartbeat: payload.isHeartbeat,
				ownerPluginId: params.ownerPluginId
			});
			continue;
		}
		enqueueContextEngineTurnCommit({
			database: params.database,
			engineId: params.engineId,
			ownerPluginId: params.ownerPluginId,
			payload: {
				boundary: payload.boundary,
				isHeartbeat: payload.isHeartbeat,
				messages: closedTurn.messages,
				runtimeContext: payload.runtimeContext
			}
		});
	}
}
function listPendingContextEngineTurnSessions(database, filter) {
	let query = outboxDb(database).selectFrom("context_engine_turn_outbox").select("session_id").select(oldestOutboxEnqueueSequence().as("oldest_enqueue_sequence")).where("engine_id", "=", filter.engineId).where("owner_plugin_id", filter.ownerPluginId ? "=" : "is", filter.ownerPluginId ?? null).where(outboxPayloadRequiresAdvancement());
	if (filter.sessionId) query = query.where("session_id", "=", filter.sessionId);
	return executeSqliteQuerySync(database.db, query.groupBy("session_id").orderBy("oldest_enqueue_sequence", "asc").limit(filter.limit)).rows.map(({ session_id }) => session_id);
}
function readNextPendingContextEngineTurn(database, filter) {
	return executeSqliteQueryTakeFirstSync(database.db, outboxDb(database).selectFrom("context_engine_turn_outbox").select([
		"advancement_key",
		"payload_json",
		"session_id"
	]).where("engine_id", "=", filter.engineId).where("owner_plugin_id", filter.ownerPluginId ? "=" : "is", filter.ownerPluginId ?? null).where("session_id", "=", filter.sessionId).where(outboxPayloadRequiresAdvancement()).orderBy(outboxEnqueueSequence(), "asc").limit(1));
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
function hasPendingContextEngineTurn(database, filter) {
	let query = outboxDb(database).selectFrom("context_engine_turn_outbox").select("advancement_key").where("engine_id", "=", filter.engineId).where("owner_plugin_id", filter.ownerPluginId ? "=" : "is", filter.ownerPluginId ?? null).where(outboxPayloadRequiresAdvancement());
	if (filter.sessionId) query = query.where("session_id", "=", filter.sessionId);
	return executeSqliteQueryTakeFirstSync(database.db, query.limit(1)) !== void 0;
}
/**
* Recovers a session's outbox before a run and, when nothing remains to
* advance, records the known admission in the same transaction. The common
* turn start therefore needs one database round trip.
*/
function prepareContextEngineTurnRun(params) {
	const warnings = [];
	recoverContextEngineTurnOutbox({
		...params,
		warn: (message) => warnings.push(message)
	});
	const pending = hasPendingContextEngineTurn(params.database, params);
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
async function drainContextEngineTurnOutbox(params) {
	const { store } = params;
	const filter = {
		engineId: params.engineId,
		ownerPluginId: params.ownerPluginId
	};
	if (typeof params.engine.commitTurn !== "function") return { pending: false };
	let remaining = Math.max(0, params.limit ?? 16);
	if (remaining === 0) return { pending: await store.hasPending({
		...filter,
		sessionId: params.sessionId
	}) };
	let activeSessionIds = await store.listPendingSessions({
		...filter,
		sessionId: params.sessionId,
		limit: remaining
	});
	while (remaining > 0 && activeSessionIds.length > 0) {
		const continuingSessionIds = [];
		for (const sessionId of activeSessionIds) {
			if (remaining === 0) break;
			const row = await store.readNextPending({
				...filter,
				sessionId
			});
			if (!row) continue;
			remaining -= 1;
			if (await commitPendingContextEngineTurn({
				...params,
				store,
				row
			})) continuingSessionIds.push(sessionId);
		}
		activeSessionIds = continuingSessionIds;
	}
	return { pending: await store.hasPending({
		...filter,
		sessionId: params.sessionId
	}) };
}
async function commitPendingContextEngineTurn(params) {
	const { row } = params;
	try {
		const payload = JSON.parse(row.payload_json);
		if (payload.state !== "ready") return false;
		const commonParams = {
			advancementKey: row.advancement_key,
			admission: payload.boundary.admission,
			terminal: payload.boundary.terminal,
			messages: payload.messages,
			sessionId: payload.boundary.admission.sessionId,
			sessionKey: payload.boundary.admission.sessionKey,
			sessionTarget: {
				agentId: payload.boundary.admission.agentId,
				sessionId: payload.boundary.admission.sessionId,
				sessionKey: payload.boundary.admission.sessionKey,
				storePath: payload.boundary.admission.storePath
			},
			isHeartbeat: payload.isHeartbeat,
			...payload.runtimeContext ? { runtimeContext: payload.runtimeContext } : {}
		};
		const result = await params.engine.commitTurn?.(commonParams);
		if (!result) throw new Error("context engine does not implement commitTurn");
		if (result.status !== "committed" && result.status !== "duplicate") throw new Error(`invalid commitTurn result status: ${String(result.status)}`);
		await params.store.complete(row.advancement_key);
		try {
			params.onCommitted?.(commonParams);
		} catch (error) {
			params.warn(`[context-engine] committed turn notification failed: ${error instanceof Error ? error.message : String(error)}`);
		}
		return true;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		await params.store.recordFailure(row.advancement_key, message, Date.now());
		params.warn(`[context-engine] durable turn advancement remains queued: ${row.advancement_key}: ${message}`);
		return false;
	}
}
/** Runs one outbox command's kernel on the borrowed connection. */
function executeContextEngineTurnOutboxCommand(db, command) {
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
		case "discardIntent":
			discardContextEngineTurnIntent({
				...command.input,
				database
			});
			return;
	}
	throw new Error("Unknown context-engine turn outbox command");
}
//#endregion
export { executeContextEngineTurnOutboxCommand as n, drainContextEngineTurnOutbox as t };
