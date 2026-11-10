import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../../openclaw-state-db-contract-QlwTsE6j.mjs";
import { c as registerNodeSqliteDisposeCallback } from "../../kysely-sync-cache-state-Dc7tna9E.mjs";
import { r as runWithSqliteBusyTimeout } from "../../sqlite-busy-timeout-COlIRjFZ.mjs";
import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope, k as readSqliteDatabaseSiblingWriteRevision } from "../../sqlite-database-admission-CqdNF9iE.mjs";
import { c as withSqlitePostCommitPublications, s as stageSqliteTransactionState } from "../../sqlite-post-commit-22SfWsLt.mjs";
import { c as installSqliteTempTrackingSchema, i as getAdmittedSqliteSchemaFacts } from "../../sqlite-schema-facts-C8u_9Af1.mjs";
import { a as isSqliteLockError } from "../../sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely, u as prepareSqliteQueryTakeFirstSync } from "../../kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync, l as runSqliteWorkerTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-CpDyZPQ0.mjs";
import { i as publishUnchangedSessionTranscriptAuthority, s as readStagedSessionTranscriptAuthority } from "../../session-transcript-authority-Bd3kv5VJ.mjs";
import { i as finalizePreparedSessionTranscriptProjectionInTransaction, n as claimPreparedSessionTranscriptProjectionInTransaction, r as deletePreparedSessionTranscriptProjectionChunkInTransaction, t as appendPreparedSessionTranscriptProjectionChunkInTransaction } from "../../session-transcript-projection-rebuild-b6i9E7jy.mjs";
import { d as sessionTranscriptIndexNeedsReconcile } from "../../session-transcript-index-BTr4by8J.mjs";
//#region src/config/sessions/session-transcript-index-status.worker.ts
const projectionTables = [
	"session_transcript_active_events",
	"session_transcript_fts_rows",
	"session_transcript_index_state"
];
const observedTables = [
	"session_windows",
	...projectionTables,
	"transcript_events"
];
const scanTables = [
	"session_windows",
	...projectionTables,
	"openclaw_transcript_index_pending"
];
const MAX_SESSIONS = 128;
const MAX_ORPHAN_ROWS = 512;
const installations = /* @__PURE__ */ new WeakMap();
const admissionSeeks = createSqliteQueryCache((db) => {
	const kysely = getNodeSqliteKysely(db);
	const selectNext = (after) => {
		const [first, ...remaining] = scanTables.map((table) => {
			let query = (table === "openclaw_transcript_index_pending" ? kysely.withSchema("temp") : kysely).selectFrom(table).select("session_id").orderBy("session_id").limit(1);
			if (after) query = query.where("session_id", ">", after);
			return kysely.selectFrom(query.as("candidate")).select("session_id");
		});
		return kysely.selectFrom(remaining.reduce((query, next) => query.unionAll(next), first).as("candidates")).select("session_id").orderBy("session_id").limit(1);
	};
	return {
		first: prepareSqliteQueryTakeFirstSync(db, () => selectNext()),
		after: prepareSqliteQueryTakeFirstSync(db, (parameter) => selectNext(parameter((sessionId) => sessionId)))
	};
});
function installStatusTracking(db, schemaVersion) {
	let installation = installations.get(db);
	if (!installation) {
		installation = {};
		installations.set(db, installation);
		const retained = installation;
		registerNodeSqliteDisposeCallback(db, () => {
			retained.schemaVersion = void 0;
		});
	}
	if (installation.schemaVersion === schemaVersion) return;
	installSqliteTempTrackingSchema(db, {
		kind: "transcript-index",
		statusTable: "openclaw_transcript_index_status",
		pendingTable: "openclaw_transcript_index_pending",
		pendingIndex: "openclaw_transcript_index_pending_state",
		observedTables
	});
	stageSqliteTransactionState(db, {
		stage: () => {
			installation.schemaVersion = schemaVersion;
		},
		rollback: () => {
			installation.schemaVersion = void 0;
		},
		commit: () => {}
	});
}
/** Consume the writer's clean receipt without taking a write lock or host write grants. */
function isSessionTranscriptIndexStatusClean(db) {
	const siblingWriteRevision = readSqliteDatabaseSiblingWriteRevision(db);
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (siblingWriteRevision === void 0 || !schema || installations.get(db)?.schemaVersion !== schema.schemaVersion) return false;
	const temporary = getNodeSqliteKysely(db).withSchema("temp");
	return executeSqliteQueryTakeFirstSync(db, temporary.selectFrom("openclaw_transcript_index_status").select("id").where("id", "=", 1).where("sibling_write_revision", "=", siblingWriteRevision).where("schema_version", "=", schema.schemaVersion).where("complete", "=", 1).where((eb) => eb.not(eb.exists(temporary.selectFrom("openclaw_transcript_index_pending").select("session_id"))))) !== void 0 && readSqliteDatabaseSiblingWriteRevision(db) === siblingWriteRevision;
}
/** Advance bounded maintenance inside the canonical writer's transaction. */
function maintainSessionTranscriptIndexStatus(db) {
	if (!db.isTransaction) throw new Error("Transcript projection status requires its writer transaction");
	const siblingWriteRevision = readSqliteDatabaseSiblingWriteRevision(db);
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (!schema) throw new Error("Transcript projection status requires admitted schema facts");
	installStatusTracking(db, schema.schemaVersion);
	const kysely = getNodeSqliteKysely(db);
	const temporary = kysely.withSchema("temp");
	const state = executeSqliteQueryTakeFirstSync(db, temporary.selectFrom("openclaw_transcript_index_status").selectAll().where("id", "=", 1));
	if (state.schema_version !== schema.schemaVersion) {
		executeSqliteQuerySync(db, temporary.deleteFrom("openclaw_transcript_index_pending"));
		state.complete = 0;
		state.after_session = null;
		state.sibling_write_revision = siblingWriteRevision ?? -1;
	} else if (state.complete && state.sibling_write_revision !== siblingWriteRevision) {
		state.complete = 0;
		state.after_session = null;
		state.sibling_write_revision = siblingWriteRevision ?? -1;
	}
	const candidates = new Set(executeSqliteQuerySync(db, temporary.selectFrom("openclaw_transcript_index_pending").select("session_id").where("state", "=", 0).orderBy("session_id").limit(state.complete ? MAX_SESSIONS : MAX_SESSIONS / 2)).rows.map((row) => row.session_id));
	const seek = admissionSeeks(db);
	let seeks = 0;
	let reachedTraversalEnd = false;
	while (candidates.size < MAX_SESSIONS && !state.complete && seeks++ < MAX_SESSIONS) {
		const next = state.after_session === null ? seek.first() : seek.after(state.after_session);
		if (!next) {
			state.complete = 1;
			reachedTraversalEnd = true;
			state.completed_traversals++;
		} else {
			state.after_session = next.session_id;
			candidates.add(next.session_id);
		}
	}
	const remainingRows = projectionTables.map(() => MAX_ORPHAN_ROWS);
	for (const sessionId of candidates) {
		const hasTranscript = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).limit(1)) !== void 0;
		let pending = false;
		let unfinished = false;
		if (hasTranscript) pending = sessionTranscriptIndexNeedsReconcile(db, sessionId);
		else for (const [index, table] of projectionTables.entries()) {
			const budget = remainingRows[index];
			const rows = executeSqliteQuerySync(db, kysely.selectFrom(table).select("rowid as rowId").where("session_id", "=", sessionId).limit(budget + 1)).rows;
			unfinished ||= rows.length > budget;
			const selected = rows.slice(0, budget);
			if (selected.length > 0) {
				const removed = withSqliteDatabaseWriteScope(db, [sqliteSessionIdWriteScope(sessionId)], () => executeSqliteQuerySync(db, kysely.deleteFrom(table).where("rowid", "in", selected.map((row) => row.rowId)))).numAffectedRows ?? 0n;
				remainingRows[index] -= Number(removed);
			}
		}
		executeSqliteQuerySync(db, temporary.deleteFrom("openclaw_transcript_index_pending").where("session_id", "=", sessionId));
		if (pending || unfinished) executeSqliteQuerySync(db, temporary.insertInto("openclaw_transcript_index_pending").values({
			session_id: sessionId,
			state: unfinished ? 0 : 1
		}));
	}
	const hasUnknown = state.complete !== 0 && executeSqliteQueryTakeFirstSync(db, temporary.selectFrom("openclaw_transcript_index_pending").select("session_id").where("state", "=", 0).limit(1)) !== void 0;
	const traversalComplete = reachedTraversalEnd || state.complete !== 0 && !hasUnknown;
	if (state.complete && (state.sibling_write_revision !== siblingWriteRevision || hasUnknown && !reachedTraversalEnd)) {
		state.complete = 0;
		state.after_session = null;
		state.sibling_write_revision = siblingWriteRevision ?? -1;
	}
	executeSqliteQuerySync(db, temporary.updateTable("openclaw_transcript_index_status").set({
		sibling_write_revision: state.sibling_write_revision,
		schema_version: schema.schemaVersion,
		complete: state.complete,
		after_session: state.after_session,
		completed_traversals: state.completed_traversals
	}).where("id", "=", 1));
	return {
		sessionIds: executeSqliteQuerySync(db, temporary.selectFrom("openclaw_transcript_index_pending").select("session_id").where("state", "=", 1).orderBy("session_id")).rows.map((row) => row.session_id),
		hasMore: siblingWriteRevision === void 0 || !state.complete || hasUnknown,
		traversalComplete: siblingWriteRevision !== void 0 && traversalComplete,
		traversal: {
			schemaVersion: schema.schemaVersion,
			completedTraversals: state.completed_traversals
		}
	};
}
//#endregion
//#region src/config/sessions/session-transcript-projection-publication.worker.ts
/** The canonical agent executor lends its connection for each bounded publication. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	function execute(command) {
		if (command.type === "preflight" || command.type === "sweep") {
			if (isSessionTranscriptIndexStatusClean(db)) return {
				sessionIds: [],
				hasMore: false,
				traversalComplete: true
			};
			context.admit("transaction");
			context.admit("commit");
			let entered = false;
			try {
				return runWithSqliteBusyTimeout(db, 0, () => runSqliteImmediateTransactionSync(db, () => {
					entered = true;
					return maintainSessionTranscriptIndexStatus(db);
				}, {
					operationLabel: `sessions.transcript-index.${command.type}`,
					beginLockFailureReporting: "suppress"
				}));
			} catch (error) {
				if (entered || !isSqliteLockError(error)) throw error;
				return {
					sessionIds: [],
					hasMore: true,
					traversalComplete: false
				};
			}
		}
		return withSqlitePostCommitPublications(db, () => runSqliteWorkerTransactionSync(context, () => {
			switch (command.type) {
				case "claim": return claimPreparedSessionTranscriptProjectionInTransaction(db, command.input.plan, command.input.claimId);
				case "deleteChunk": return deletePreparedSessionTranscriptProjectionChunkInTransaction(db, command.input);
				case "appendChunk": return appendPreparedSessionTranscriptProjectionChunkInTransaction(db, command.input);
				case "finalize": {
					const finalized = finalizePreparedSessionTranscriptProjectionInTransaction(db, command.input.plan, command.input.claimId);
					const session = finalized ? executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("session_windows").select("session_key").where("session_id", "=", command.input.plan.sessionId)) : void 0;
					if (session) publishUnchangedSessionTranscriptAuthority({
						db,
						path: context.databasePath
					}, session.session_key);
					return {
						finalized,
						...session ? { sessionKey: session.session_key } : {},
						transcriptPublication: readStagedSessionTranscriptAuthority({ db })
					};
				}
			}
			throw new Error("Unknown transcript projection publication operation");
		}, {
			operationLabel: `sessions.transcript-index.${command.type}`,
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: context.databasePath
		}));
	}
	return {
		execute,
		assertSettled() {
			assertTransactionUsable(db);
			if (db.isTransaction) throw new Error("Transcript projection publication did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
