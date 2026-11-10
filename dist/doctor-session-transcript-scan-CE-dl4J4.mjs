import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as tableExists, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-DJGC6v85.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { i as projectExistingAgentDatabaseTargets, u as resolveTargetSqliteOptions } from "./session-sqlite-migration-readers-CrMHjx1c.mjs";
//#region src/commands/doctor-session-sqlite-transcript-readers.ts
function resetReadIterator(iterator) {
	try {
		iterator?.return?.();
	} catch {}
}
var ReadOnlySqliteTranscriptReader = class {
	constructor(database) {
		this.database = database;
		this.eventJsonSql = tableHasColumn(database, "transcript_events", "event_zstd") ? transcriptEventJsonSql(database).compile(getSessionKysely(database)).sql : "event_json";
		this.labelRowsSql = `SELECT ${this.eventJsonSql} AS event_json, seq FROM transcript_events WHERE session_id = ? ORDER BY seq ASC`;
	}
	sessionIds() {
		if (!tableExists(this.database, "transcript_events")) return [];
		return this.database.prepare("SELECT DISTINCT session_id FROM transcript_events ORDER BY session_id ASC").all().flatMap((row) => typeof row.session_id === "string" ? [row.session_id] : []);
	}
	repairSnapshot(sessionId, needsRepair, mayNeedRepair) {
		let iterator;
		try {
			this.labelDetection ??= this.database.prepare(this.labelRowsSql);
			iterator = this.labelDetection.iterate(sessionId);
			for (const row of iterator) {
				if (typeof row.event_json !== "string" || typeof row.seq !== "number") continue;
				if (!mayNeedRepair(row.event_json)) continue;
				let event;
				try {
					event = JSON.parse(row.event_json);
				} catch {
					continue;
				}
				if (!needsRepair(event)) continue;
				const rows = [];
				this.labelSnapshot ??= this.database.prepare(this.labelRowsSql);
				iterator = this.labelSnapshot.iterate(sessionId);
				for (const candidate of iterator) if (typeof candidate.event_json === "string" && typeof candidate.seq === "number") rows.push({
					eventJson: candidate.event_json,
					seq: candidate.seq
				});
				return {
					ok: true,
					rows
				};
			}
			return {
				ok: true,
				rows: []
			};
		} catch (error) {
			resetReadIterator(iterator);
			return {
				ok: false,
				error
			};
		}
	}
	/** Reads exact row metadata for a guarded transcript replacement without opening a writer. */
	headerlessSnapshot(sessionId, acceptRow) {
		let iterator;
		try {
			this.firstHeaderRow ??= this.database.prepare(`SELECT ${this.eventJsonSql} AS event_json FROM transcript_events WHERE session_id = ? ORDER BY seq ASC LIMIT 1`);
			const firstRow = this.firstHeaderRow.get(sessionId);
			if (typeof firstRow?.event_json === "string") {
				let first;
				try {
					first = JSON.parse(firstRow.event_json);
				} catch {
					return {
						ok: true,
						rows: []
					};
				}
				if (!isRecord(first) || first.type === "session") return {
					ok: true,
					rows: []
				};
			}
			this.sessionKey ??= this.database.prepare("SELECT session_key FROM session_windows WHERE session_id = ? LIMIT 1");
			const sessionKeyRow = this.sessionKey.get(sessionId);
			const storageRows = [];
			this.headerSnapshot ??= this.database.prepare(`SELECT created_at, ${this.eventJsonSql} AS event_json, seq FROM transcript_events WHERE session_id = ? ORDER BY seq ASC`);
			iterator = this.headerSnapshot.iterate(sessionId);
			for (const row of iterator) {
				if (typeof row.created_at !== "number" || typeof row.event_json !== "string" || typeof row.seq !== "number") return {
					ok: false,
					error: /* @__PURE__ */ new Error(`Invalid transcript row metadata for session ${sessionId}`)
				};
				const storageRow = {
					createdAt: row.created_at,
					eventJson: row.event_json,
					seq: row.seq
				};
				if (!acceptRow(storageRow)) return {
					ok: true,
					rows: []
				};
				storageRows.push(storageRow);
			}
			return {
				ok: true,
				rows: storageRows,
				...typeof sessionKeyRow?.session_key === "string" ? { sessionKey: sessionKeyRow.session_key } : {}
			};
		} catch (error) {
			resetReadIterator(iterator);
			return {
				ok: false,
				error
			};
		}
	}
};
//#endregion
//#region src/commands/doctor-session-transcript-scan.ts
/** Each snapshot closes its cursors before a repair; each pass owns only its read connection. */
function scanDoctorSessionTranscripts(params, visit) {
	const reportError = (message, error) => note(`${message}: ${formatErrorMessage(error).replace(/\s+/g, " ").trim()}`, params.title);
	for (const target of projectExistingAgentDatabaseTargets(resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env }), params.env, params.cfg)) {
		const databaseOptions = resolveTargetSqliteOptions(target, params.env);
		let database;
		try {
			database = openNodeSqliteDatabase(target.sqlitePath, { readOnly: true });
			const reader = new ReadOnlySqliteTranscriptReader(database);
			for (const sessionId of reader.sessionIds()) visit({
				reader,
				sessionId,
				target,
				databaseOptions,
				reportError
			});
		} catch (error) {
			reportError(`- ${params.failureLabel} for ${target.agentId} (${target.sqlitePath})`, error);
		} finally {
			database?.close();
		}
	}
}
function transcriptSnapshotsMatch(expected, current, compareCreatedAt = false) {
	return expected.length === current.length && expected.every((row, index) => row.seq === current[index]?.seq && (!compareCreatedAt || row.createdAt === current[index]?.createdAt) && row.eventJson === current[index]?.eventJson);
}
//#endregion
export { transcriptSnapshotsMatch as n, scanDoctorSessionTranscripts as t };
