import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { i as executeSqliteQuerySync, l as prepareSqliteQuerySync, p as sql, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as beginEngineStoreReadSnapshot } from "./open-L_IbZFu2.mjs";
import { t as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { D as classifyOpenClawAgentDatabaseReadError } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { c as transcriptEventJsonSql, s as readTranscriptStorageEncoding } from "./transcript-payload-Cu49oQKq.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as SessionTranscriptStorageUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { a as sessionHistoryCleanupError } from "./session-history-worker-errors-D75quOgT.mjs";
import "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { s as readTranscriptContextStateInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { p as prepareTranscriptEventReadQuery } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
//#region src/infra/database-engine/text-bytes.ts
/** Slice encoded bytes on the server; SQLite retains its physical text encoding. */
function engineTextByteSliceSql(db, value, offset, length) {
	return isPostgresSqlConnection(db) ? sql`substring(convert_to(${value}, 'UTF8') FROM ${offset} FOR ${length})` : sql`coalesce(substr(CAST(${value} AS BLOB), ${offset}, ${length}), CAST('' AS BLOB))`;
}
//#endregion
//#region src/config/sessions/session-transcript-hydration.worker.ts
const SLICE_BYTES = 65536;
const CHUNK_BYTES = 1048576;
const CHUNK_FRAMES = 128;
/** One task owns its snapshot through every acknowledged frame and native cleanup. */
async function streamSessionTranscriptHydration(request, channel, control) {
	return await control.runNativeSection(async () => {
		const opened = openOpenClawAgentDatabaseReadOnly(toDatabaseOptions(request.resolvedScope));
		if (!opened.found) throw new SessionTranscriptStorageUnavailableError(opened.reason);
		const { database } = opened;
		let snapshot;
		let outcome;
		try {
			if (request.expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, request.expectedIdentity);
			snapshot = beginEngineStoreReadSnapshot(database.db);
			const fence = resolveSqliteSessionTranscriptReadFence({
				database,
				...request.resolvedScope
			});
			const { version, coldArchive } = readTranscriptContextStateInTransaction(database, request.resolvedScope.sessionId);
			if (coldArchive) throw new SessionTranscriptColdError(request.resolvedScope.sessionId);
			const encoding = readTranscriptStorageEncoding(database.db);
			const PAGE_ROWS = isPostgresSqlConnection(database.db) ? 16 : 256;
			const source = prepareTranscriptEventReadQuery(database, request.resolvedScope.sessionId, {
				...request.target,
				beforeEventSeq: fence?.beforeRawSeq
			});
			const eventSlice = (offset) => engineTextByteSliceSql(database.db, transcriptEventJsonSql(database.db), offset, SLICE_BYTES).as("data");
			const pageQuery = source.select(["seq", eventSlice(1)]).orderBy("seq", "asc").limit(PAGE_ROWS);
			const readPage = prepareSqliteQuerySync(database.db, (parameter) => pageQuery.where("seq", ">", parameter((seq) => seq)));
			const readPart = prepareSqliteQueryTakeFirstSync(database.db, (parameter) => source.select(eventSlice(parameter((value) => value.offset))).where("seq", "=", parameter((value) => value.seq)));
			let frames = [];
			let bytes = 0;
			let eventCount = 0;
			const flush = async () => {
				if (frames.length === 0) return;
				(await channel.request({
					kind: "transcript-hydration-chunk",
					encoding,
					frames
				})).consumed();
				frames = [];
				bytes = 0;
				control.throwIfCancelled();
			};
			let afterSeq = request.afterSeq;
			for (;;) {
				control.throwIfCancelled();
				const page = afterSeq === void 0 ? executeSqliteQuerySync(database.db, pageQuery).rows : readPage(afterSeq).rows;
				for (const row of page) for (let offset = 1;; offset += SLICE_BYTES) {
					control.throwIfCancelled();
					const data = offset === 1 ? row.data : expectDefined(readPart({
						seq: row.seq,
						offset
					}), "transcript snapshot row").data;
					if (bytes + data.byteLength > CHUNK_BYTES) await flush();
					const endOfEvent = data.byteLength < SLICE_BYTES;
					frames.push({
						data,
						endOfEvent,
						...request.includeEventJson && endOfEvent ? { seq: row.seq } : {}
					});
					bytes += data.byteLength;
					if (bytes >= CHUNK_BYTES || frames.length >= CHUNK_FRAMES) await flush();
					if (endOfEvent) {
						eventCount++;
						break;
					}
				}
				if (page.length < PAGE_ROWS) break;
				afterSeq = expectDefined(page.at(-1), "transcript page").seq;
			}
			await flush();
			control.throwIfCancelled();
			outcome = { value: {
				kind: "full",
				version,
				eventCount
			} };
		} catch (error) {
			outcome = { error: sqlitePrimaryResultCode(error) === 1 ? classifyOpenClawAgentDatabaseReadError(database.db, error) : error };
		}
		try {
			try {
				snapshot?.close();
			} finally {
				database.close();
			}
		} catch (cleanupError) {
			throw "error" in outcome ? sessionHistoryCleanupError(outcome.error, cleanupError, "database close") : cleanupError;
		}
		if ("error" in outcome) throw outcome.error;
		return outcome.value;
	});
}
//#endregion
export { streamSessionTranscriptHydration };
