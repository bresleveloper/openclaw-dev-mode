import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as tableHasColumn, r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-qsg5dB6v.mjs";
import { a as getSessionKysely } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
//#region src/commands/doctor-session-sqlite-transcript-readers.ts
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
			try {
				iterator?.return?.();
			} catch {}
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
			try {
				iterator?.return?.();
			} catch {}
			return {
				ok: false,
				error
			};
		}
	}
};
//#endregion
export { ReadOnlySqliteTranscriptReader as t };
