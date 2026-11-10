import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import { _ as toAgentStoreSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as boundSessionTranscriptSearchSnippet, d as validateSessionTranscriptSearchQuery, l as sessionTranscriptSearchFtsQuery, u as sessionTranscriptSearchLimit } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { n as captureLifecycleDatabaseScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { _ as transcriptSearchLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { i as startSessionTranscriptIndexReconcile, l as readSessionTranscriptIndexStatus, t as isSessionTranscriptIndexReconcileRunning } from "./session-transcript-reconcile-BkwlDaaD.mjs";
//#region src/config/sessions/session-transcript-search.ts
/** Search committed memory facts or the durable worker; reconciliation remains host-owned. */
async function searchSessionTranscripts(params, preparedDatabase) {
	validateSessionTranscriptSearchQuery(params.query);
	const memory = captureSessionActorStorageOwner({
		...params,
		storePath: preparedDatabase?.path ?? params.storePath
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) {
		const query = {
			type: "session.history.search",
			input: structuredClone(params)
		};
		if (memory.binding?.agentId === memory.agentId && memory.binding.path === memory.path) return memory.binding.actor.storage.read(query, memory.authority);
		const sessionKey = memory.owner?.listSessions(memory.authority)[0]?.target.sessionKey;
		if (sessionKey) {
			const result = await withSessionActorStorage({
				agentId: memory.agentId,
				storePath: memory.path,
				sessionKey,
				env: params.env
			}, {
				authority: memory.authority,
				lifetime: {
					assertCurrent: () => memory.authority.assertCurrent(),
					assertReadable: () => memory.authority.assertCurrent()
				}
			}, (binding) => binding.actor.storage.read(query, binding.authority));
			if (result) return result;
		}
		return {
			hits: [],
			indexing: false,
			truncated: false
		};
	}
	const scope = captureLifecycleDatabaseScope(preparedDatabase ? {
		agentId: params.agentId,
		databaseAgentId: preparedDatabase.agentId,
		path: preparedDatabase.path,
		env: params.env
	} : resolveSqliteReadScope(params));
	const options = toDatabaseOptions(scope);
	const request = {
		...params,
		agentId: scope.agentId,
		env: scope.env,
		sessionKeys: params.sessionKeys?.slice()
	};
	let statusOwnerFailure;
	const readIndexStatus = async (assertCurrent, signal) => {
		signal?.throwIfAborted();
		assertCurrent?.();
		let indexing;
		try {
			if (statusOwnerFailure) throw statusOwnerFailure.error;
			indexing = await readSessionTranscriptIndexStatus(options, assertCurrent, signal);
		} catch {
			signal?.throwIfAborted();
			assertCurrent?.();
			return true;
		}
		signal?.throwIfAborted();
		assertCurrent?.();
		if (indexing) startSessionTranscriptIndexReconcile(options);
		return indexing;
	};
	let execution;
	try {
		try {
			if (supportsOpenClawAgentDatabaseExecution(options)) execution = captureOpenClawAgentDatabaseExecution(options);
		} catch (error) {
			statusOwnerFailure = { error };
		}
		return await withSessionHistoryWorkerDatabase(options, async (owner) => {
			const result = await owner.searchTranscripts(request, (signal) => readIndexStatus(owner.assertCurrent, signal));
			owner.assertCurrent();
			return {
				...result,
				indexing: result.indexing || isSessionTranscriptIndexReconcileRunning(options)
			};
		}, transcriptSearchLane);
	} catch (error) {
		if (error instanceof WorkerTaskError && error.code === "timeout") throw new WorkerTaskError("Session transcript search timed out; narrow the session selection or use more specific query keywords, then retry. A timeout does not mean that no matching conversation exists.", "timeout", { cause: error });
		throw error;
	} finally {
		await execution?.release();
	}
}
/** Native query kernel; projection readiness belongs to the maintenance owner. */
function searchSessionTranscriptsReadOnlySync(params, preparedDatabase) {
	const query = validateSessionTranscriptSearchQuery(params.query);
	const scope = preparedDatabase ? { agentId: params.agentId } : resolveSqliteReadScope(params);
	const databaseOptions = preparedDatabase ?? toDatabaseOptions(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => ({ ...runSqliteDeferredTransactionSync(database.db, () => {
		const limit = sessionTranscriptSearchLimit(params.limit);
		const db = getNodeSqliteKysely(database.db);
		const selectedWindows = db.selectFrom("session_windows").select(["session_id", "session_key"]).where((eb) => params.sessionKeys === void 0 ? eb.or([sql`${eb.ref("session_key")} GLOB ${toAgentStoreSessionKey({
			agentId: scope.agentId,
			requestKey: "*"
		})}`, eb("session_key", "in", ["global", "unknown"])]) : params.sessionKeys.length > 0 ? eb("session_key", "in", sqliteStringSet(params.sessionKeys)) : eb.and([])).$if(params.sessionId !== void 0, (builder) => builder.where("session_id", "=", params.sessionId));
		const archivedTranscriptsExcluded = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_cold_archives as cold").innerJoin(selectedWindows.as("window"), "window.session_id", "cold.session_id").select((eb) => eb.fn.countAll().as("count")))?.count ?? 0;
		const match = sql`session_transcript_fts MATCH ${sessionTranscriptSearchFtsQuery(query, params.match)}`;
		const order = params.order === "recent" ? sql`session_transcript_fts.timestamp desc, fts_rowid desc` : sql`rank asc, session_transcript_fts.timestamp desc, session_transcript_fts.message_id asc`;
		const candidates = db.selectFrom("session_transcript_fts").crossJoin("session_transcript_fts_rows as mapped").crossJoin(selectedWindows.as("window")).where("mapped.id", "=", sql`session_transcript_fts.rowid`).whereRef("window.session_id", "=", "mapped.session_id").where(match).$if(Boolean(params.role), (builder) => builder.where((eb) => eb.case().when("window.session_key", "is not", null).then(eb("role", "=", params.role)).else(false).end())).where("mapped.session_id", "not in", db.selectFrom("session_transcript_index_state").select("session_id").where("needs_rebuild", "!=", 0)).select([
			"window.session_key",
			sql`session_transcript_fts.rowid`.as("fts_rowid"),
			sql`bm25(session_transcript_fts)`.as("rank")
		]).orderBy(order).limit(limit + 1);
		const hits = executeSqliteQuerySync(database.db, db.with((cte) => cte("hits").materialized(), () => candidates).selectFrom("hits").crossJoin("session_transcript_fts").where((eb) => eb(sql`session_transcript_fts.rowid`, "=", eb.ref("hits.fts_rowid"))).where(match).select([
			"hits.session_key",
			"session_transcript_fts.session_id",
			"message_id",
			"role",
			"timestamp",
			"hits.rank as rank",
			sql`snippet(session_transcript_fts, 0, '', '', ' … ', 48)`.as("snippet")
		]).orderBy(order)).rows.flatMap((row) => {
			if (typeof row.session_key !== "string" || typeof row.session_id !== "string" || typeof row.message_id !== "string" || row.role !== "user" && row.role !== "assistant" || typeof row.snippet !== "string") return [];
			const timestamp = typeof row.timestamp === "number" ? row.timestamp : Number(row.timestamp);
			const rank = typeof row.rank === "number" ? row.rank : Number(row.rank);
			return [{
				sessionKey: row.session_key,
				sessionId: row.session_id,
				messageId: row.message_id,
				role: row.role,
				timestamp: Number.isFinite(timestamp) ? timestamp : 0,
				snippet: boundSessionTranscriptSearchSnippet(row.snippet),
				score: Number.isFinite(rank) ? -rank : 0
			}];
		});
		return {
			found: true,
			hits: hits.slice(0, limit),
			truncated: hits.length > limit,
			...archivedTranscriptsExcluded > 0 ? { archivedTranscriptsExcluded } : {}
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript search"
	}) }), databaseOptions);
	return result.found ? result.value : {
		found: false,
		hits: [],
		truncated: false
	};
}
//#endregion
export { searchSessionTranscriptsReadOnlySync as n, searchSessionTranscripts as t };
