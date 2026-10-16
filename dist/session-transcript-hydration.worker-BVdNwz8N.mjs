import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { d as sql, l as prepareSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { C as classifyOpenClawAgentDatabaseReadError, m as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { o as readTranscriptStorageEncoding, s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { n as SessionTranscriptStorageUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { i as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { a as sessionHistoryCleanupError } from "./session-history-worker-errors-NH8_8u1W.mjs";
import { s as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { f as prepareTranscriptEventReadQuery } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
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
		let outcome;
		try {
			if (request.expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, request.expectedIdentity);
			database.db.exec("BEGIN DEFERRED");
			const fence = resolveSqliteSessionTranscriptReadFence({
				database,
				...request.resolvedScope
			});
			assertSessionTranscriptHot(database.db, request.resolvedScope.sessionId);
			const version = readTranscriptContextVersionInTransaction(database, request.resolvedScope.sessionId);
			const encoding = readTranscriptStorageEncoding(database.db);
			const source = prepareTranscriptEventReadQuery(database, request.resolvedScope.sessionId, {
				...request.target,
				beforeEventSeq: fence?.beforeRawSeq
			});
			const readPart = prepareSqliteQueryTakeFirstSync(database.db, (parameter) => source.select(sql`substr(CAST(${transcriptEventJsonSql(database.db)} AS BLOB), ${parameter((value) => value.offset)}, ${SLICE_BYTES})`.as("data")).where("seq", "=", parameter((value) => value.seq)));
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
			for (const row of iterateSqliteQuerySync(database.db, source.select("seq").orderBy("seq", "asc"))) for (let offset = 1;; offset += SLICE_BYTES) {
				control.throwIfCancelled();
				const { data } = expectDefined(readPart({
					seq: row.seq,
					offset
				}), "transcript snapshot row");
				if (bytes + data.byteLength > CHUNK_BYTES) await flush();
				const endOfEvent = data.byteLength < SLICE_BYTES;
				frames.push({
					data,
					endOfEvent
				});
				bytes += data.byteLength;
				if (bytes >= CHUNK_BYTES || frames.length >= CHUNK_FRAMES) await flush();
				if (endOfEvent) {
					eventCount++;
					break;
				}
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
				if (database.db.isTransaction) database.db.exec("ROLLBACK");
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
