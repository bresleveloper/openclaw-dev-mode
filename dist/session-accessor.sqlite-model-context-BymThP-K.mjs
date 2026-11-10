import { a as executeSqliteQueryTakeFirstSync, l as prepareSqliteQuerySync, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { l as isSyntheticMissingToolResult, n as SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY } from "./tool-result-pairing-B20tITEh.mjs";
import { _ as assertTranscriptNavigationValid, c as transcriptEventJsonSql, l as transcriptEventModelBytesSql, u as transcriptEventModelNavigationSql, x as projectModelContextEventSql } from "./transcript-payload-Cu49oQKq.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as scanSessionTranscriptTree, p as selectSessionTranscriptTreePathNodes } from "./transcript-tree-D61jhi_i.mjs";
import { r as iterateSessionContextMessages } from "./session-BEAHkH3E.mjs";
import { r as normalizeSessionContextEntryBoundaries, t as projectSessionModelContext } from "./session-model-context-read-3qrBOsBk.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as runWithSessionTranscriptReadFence, r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { c as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
import { t as assertSessionTranscriptContextAnchorInDatabase } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
//#region src/config/sessions/session-accessor.sqlite-model-context.ts
const MODEL_CONTEXT_PAYLOAD_BATCH_SIZE = 400;
/** Unadmitted context retains the prefix captured by its original read snapshot. */
function validateSessionTranscriptContextVersion(scope, version) {
	validateDetachedSessionTranscriptContext(scope, { version });
}
function validateContextVersion(database, sessionId, version, consistency) {
	const current = readTranscriptContextVersionInTransaction(database, sessionId);
	if (current.generation === version?.generation && current.rawSeq === version?.rawSeq && current.updatedAt === version?.updatedAt) return;
	const changed = () => new SessionTranscriptReadFenceError("Session transcript changed during context read");
	if (consistency === "exact" || !version?.generation || current.generation !== version.generation || version.rawSeq === null || current.rawSeq === null || current.rawSeq <= version.rawSeq) throw changed();
	const entries = Array.from(iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(["seq", transcriptEventModelNavigationSql(database.db).as("navigation_json")]).where("session_id", "=", sessionId).orderBy("seq", "asc")), (row) => ({
		...JSON.parse(row.navigation_json),
		seq: row.seq
	}));
	const headSeq = version.rawSeq;
	const prefix = scanSessionTranscriptTree(entries.filter((entry) => entry.seq <= headSeq));
	const tree = scanSessionTranscriptTree(entries);
	const suffix = tree.nodes.filter(({ entry }) => entry.seq > headSeq);
	const expected = [...selectSessionTranscriptTreePathNodes(prefix, prefix.leafId), ...suffix];
	const path = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	if (entries.at(-1)?.seq !== current.rawSeq || suffix.some(({ entry }) => [
		"compaction",
		"reset",
		"leaf",
		"branch_summary"
	].includes(entry.type)) || expected.length !== path.length || expected.some((node, index) => node.id !== path[index]?.id || node.parentId !== path[index]?.parentId)) throw changed();
}
/** Revalidate admission after an asynchronous read before accepting its detached result. */
function validateSessionTranscriptContextAdmission(scope, admission) {
	if (!admission) return;
	validateDetachedSessionTranscriptContext(scope, { admission });
}
/** Released validators share admission; only multi-statement version reads need a snapshot. */
function validateDetachedSessionTranscriptContext(scope, validation) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	if (!withOpenClawAgentDatabaseReadOnly((database) => {
		const validate = () => {
			validateSessionTranscriptContextInDatabase(database, resolved, validation, "prefix");
		};
		return validation.admission ? validate() : runSqliteDeferredTransactionSync(database.db, validate);
	}, toDatabaseOptions(resolved)).found && (validation.admission || validation.version)) throw new SessionTranscriptReadFenceError(validation.admission ? "Current-turn transcript admission is no longer readable" : "Session transcript changed during context read");
}
/** Validate detached context using the final reader's transaction-local facts. */
function validateSessionTranscriptContextInDatabase(database, resolved, validation, consistency = "exact") {
	const { version, admission, through } = validation;
	if (admission) {
		if (!runWithSessionTranscriptReadFence(admission, () => resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		}))) throw new SessionTranscriptReadFenceError("Current-turn transcript admission is no longer readable");
	} else if (!through) validateContextVersion(database, resolved.sessionId, version, consistency);
	if (through) assertSessionTranscriptContextAnchorInDatabase(database, resolved, through, validation.expectedAuthority);
}
function modelContextBatchSql(requests) {
	const bySeq = new Map(requests.map(({ entry }) => [entry.seq, entry]));
	const omitted = requests.flatMap(({ entry, omitCheckpoint }) => omitCheckpoint ? [entry.seq] : []);
	const omitCheckpoint = omitted.length ? sql`CASE WHEN seq IN (${sql.join(omitted)}) THEN 1 ELSE 0 END` : sql.lit(0);
	const omissions = requests.flatMap(({ entry, toolResultOmission }) => toolResultOmission ? [sql`WHEN ${entry.seq} THEN ${toolResultOmission}`] : []);
	return {
		bySeq,
		omitCheckpoint,
		omission: omissions.length ? sql`CASE seq ${sql.join(omissions, sql` `)} ELSE NULL END` : void 0
	};
}
/** Read a transient context without opening the writer lifecycle or copying native evidence. */
function readSessionTranscriptModelContext(scope, through, limits) {
	if (limits && (!Number.isSafeInteger(limits.maxBytes) || limits.maxBytes <= 0 || !Number.isSafeInteger(limits.maxEvents) || limits.maxEvents <= 0)) throw new RangeError("Model-context byte and event limits must be positive safe integers");
	const result = withTranscriptContextSnapshot(scope, ({ header, entries, readModelEntries, readModelEntrySizes, version }) => {
		return projectSessionModelContext({
			header,
			entries,
			readModelEntries,
			readModelEntrySizes,
			version
		}, limits);
	}, through);
	return result.found ? result.value : { events: [] };
}
/** Consume full-fidelity context lazily inside one read snapshot, never retaining raw history. */
function readSessionTranscriptContextMessages(scope, read) {
	const result = withTranscriptContextSnapshot(scope, ({ header, entries, readEntry, version }) => {
		const messages = iterateSessionContextMessages(entries, readEntry);
		try {
			return read(messages, header, version);
		} finally {
			messages.return(void 0);
		}
	});
	return result.found ? result.value : read([], void 0);
}
function withTranscriptContextSnapshot(scope, read, through) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	return withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
		const db = getSessionKysely(database.db);
		const fence = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		});
		const version = readTranscriptContextVersionInTransaction(database, resolved.sessionId);
		if (through) assertSessionTranscriptContextAnchorInDatabase(database, resolved, through);
		const base = db.selectFrom("transcript_events").where("session_id", "=", resolved.sessionId).$if(fence !== void 0, (query) => query.where("seq", "<", fence.beforeRawSeq)).$if(through !== void 0, (query) => query.where("seq", "<=", through.rawSeq));
		const header = executeSqliteQueryTakeFirstSync(database.db, base.select(transcriptEventJsonSql(database.db).as("event_json")).select("navigation_valid").where((eb) => eb.or([eb("navigation_type", "=", "session"), eb("navigation_valid", "=", 0)])).orderBy("seq", "asc").limit(1));
		assertTranscriptNavigationValid(header?.navigation_valid);
		const tree = scanSessionTranscriptTree((function* () {
			for (const row of iterateSqliteQuerySync(database.db, base.select(["seq", transcriptEventModelNavigationSql(database.db).as("navigation_json")]).orderBy("seq", "asc"))) yield {
				...JSON.parse(row.navigation_json),
				seq: row.seq
			};
		})());
		if (through && !tree.byId.has(through.entryId)) throw new SessionTranscriptReadFenceError("Completed-turn anchor is outside the admitted context");
		const entries = normalizeSessionContextEntryBoundaries(selectSessionTranscriptTreePathNodes(tree, through?.entryId ?? tree.leafId).map(({ entry, parentId }) => {
			entry.parentId = parentId;
			return entry;
		}), tree.nodes);
		const readPayload = prepareSqliteQuerySync(database.db, (parameter) => base.select(transcriptEventJsonSql(database.db).as("event_json")).where("seq", "=", parameter((row) => row.seq)));
		return read({
			header: header ? JSON.parse(header.event_json) : void 0,
			entries,
			version,
			readEntry: (entry) => {
				const row = readPayload(entry).rows[0];
				return hydrateContextEntry(row.event_json, entry);
			},
			readModelEntrySizes: (requests) => {
				const sizes = /* @__PURE__ */ new Map();
				for (const batch of chunkItems(requests, MODEL_CONTEXT_PAYLOAD_BATCH_SIZE)) {
					const { bySeq, omitCheckpoint, omission } = modelContextBatchSql(batch);
					const query = base.select((eb) => {
						const storedBytes = transcriptEventModelBytesSql(database.db, omitCheckpoint);
						return ["seq", (omission ? eb.case().when(omission, "is not", null).then(eb.fn("octet_length", [projectModelContextEventSql(database.db, transcriptEventJsonSql(database.db), omitCheckpoint, omission, eb.ref("message_role"))])).else(storedBytes).end() : storedBytes).as("bytes")];
					}).where("seq", "in", [...bySeq.keys()]);
					for (const row of iterateSqliteQuerySync(database.db, query)) sizes.set(bySeq.get(row.seq), row.bytes);
				}
				return sizes;
			},
			readModelEntries: (requests) => {
				const payloads = /* @__PURE__ */ new Map();
				for (const batch of chunkItems(requests, MODEL_CONTEXT_PAYLOAD_BATCH_SIZE)) {
					const { bySeq, omitCheckpoint, omission } = modelContextBatchSql(batch);
					const query = base.select((eb) => ["seq", projectModelContextEventSql(database.db, transcriptEventJsonSql(database.db), omitCheckpoint, omission, eb.ref("message_role")).as("event_json")]).where("seq", "in", [...bySeq.keys()]);
					for (const row of iterateSqliteQuerySync(database.db, query)) {
						const entry = bySeq.get(row.seq);
						const hydrated = hydrateContextEntry(row.event_json, entry);
						if (entry.type === "message" && entry.message.role === "toolResult" && isSyntheticMissingToolResult(entry.message) && hydrated.type === "message" && hydrated.message.role === "toolResult") hydrated.message.details = { [SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY]: true };
						payloads.set(entry, hydrated);
					}
				}
				return payloads;
			}
		});
	}, { operationLabel: "session context snapshot read" }), toDatabaseOptions(resolved));
}
function hydrateContextEntry(eventJson, entry) {
	return {
		...JSON.parse(eventJson),
		parentId: entry.parentId,
		...(entry.type === "compaction" || entry.type === "reset") && entry.firstKeptEntryId !== void 0 ? { firstKeptEntryId: entry.firstKeptEntryId } : {}
	};
}
//#endregion
export { validateSessionTranscriptContextVersion as a, validateSessionTranscriptContextInDatabase as i, readSessionTranscriptModelContext as n, validateSessionTranscriptContextAdmission as r, readSessionTranscriptContextMessages as t };
