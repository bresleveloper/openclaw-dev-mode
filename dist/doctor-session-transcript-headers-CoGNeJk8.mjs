import { R as timestampMsToIsoString } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { h as backupDoctorSqliteRepair } from "./openclaw-state-db-BtDOU_3j.mjs";
import { c as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as isIndexedSessionEntry } from "./session-entry-codec-DSMJ1XFN.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as createSessionTranscriptHeader } from "./transcript-header-DiYg502H.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as isSessionTranscriptLeafControl, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-D61jhi_i.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as replaceSqliteTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { E as readTranscriptStorageRows } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import "./session-manager-codec-DTpe_z-3.mjs";
import { n as transcriptSnapshotsMatch, t as scanDoctorSessionTranscripts } from "./doctor-session-transcript-scan-CE-dl4J4.mjs";
import { t as countLabel } from "./doctor-state-integrity-format-CGut2D9E.mjs";
//#region src/commands/doctor-session-transcript-headers.ts
const NOTE_TITLE = "Session transcript headers";
function createCanonicalHeaderlessEventParser(sessionId) {
	const eventIds = /* @__PURE__ */ new Set([sessionId]);
	let indexedEntries = 0;
	return {
		hasIndexedEntries: () => indexedEntries > 0,
		parse(row) {
			let event;
			try {
				event = JSON.parse(row.eventJson);
			} catch {
				return;
			}
			if (!isRecord(event) || event.type === "session") return;
			if (isCanonicalSessionTranscriptEntry(event)) {
				if (!isIndexedSessionEntry(event)) return;
				indexedEntries += 1;
			} else if (event.type === "leaf" && !isSessionTranscriptLeafControl(event)) return;
			if (typeof event.id === "string") {
				const eventId = event.id.trim();
				if (!eventId || eventIds.has(eventId)) return;
				eventIds.add(eventId);
			}
			return event;
		}
	};
}
function parseCanonicalHeaderlessEvents(rows, sessionId) {
	const parser = createCanonicalHeaderlessEventParser(sessionId);
	const events = [];
	for (const row of rows) {
		const event = parser.parse(row);
		if (!event) return;
		events.push(event);
	}
	return parser.hasIndexedEntries() ? events : void 0;
}
function readHeaderRepairContext(database, sessionId) {
	const db = getSessionKysely(database.db);
	const window = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").leftJoin("session_nodes", "session_nodes.session_key", "session_windows.session_key").select([
		"session_windows.session_key",
		"session_nodes.current_session_id",
		"session_nodes.entry_json"
	]).where("session_windows.session_id", "=", sessionId).limit(1));
	if (!window?.session_key) return;
	let spawnedCwd;
	if (window.current_session_id === sessionId && window.entry_json) try {
		const entry = JSON.parse(window.entry_json);
		if (entry.sessionId === sessionId && typeof entry.spawnedCwd === "string" && entry.spawnedCwd.trim()) spawnedCwd = entry.spawnedCwd.trim();
	} catch {}
	return {
		sessionKey: window.session_key,
		...spawnedCwd ? { spawnedCwd } : {}
	};
}
function assertRepairPreservedEvents(params) {
	const after = readTranscriptStorageRows(params.database, params.sessionId);
	if (after.length !== params.before.length + 1) throw new Error(`header repair changed the event count for ${params.sessionId}`);
	for (const [index, beforeRow] of params.before.entries()) {
		const afterRow = after[index + 1];
		if (!afterRow || afterRow.createdAt !== beforeRow.createdAt) throw new Error(`header repair changed row timestamps for ${params.sessionId}`);
		const beforeEvent = JSON.parse(beforeRow.eventJson);
		const afterEvent = JSON.parse(afterRow.eventJson);
		if (beforeEvent.id !== afterEvent.id || beforeEvent.parentId !== afterEvent.parentId || beforeEvent.targetId !== afterEvent.targetId || beforeEvent.appendParentId !== afterEvent.appendParentId) throw new Error(`header repair changed event identity for ${params.sessionId}`);
	}
}
async function noteSessionTranscriptHeaderHealth(params) {
	const env = params.env ?? process.env;
	let found = 0;
	let repaired = 0;
	const preserved = /* @__PURE__ */ new Set();
	scanDoctorSessionTranscripts({
		cfg: params.cfg,
		env,
		title: NOTE_TITLE,
		failureLabel: "Failed to inspect transcript headers"
	}, ({ reader, target, databaseOptions, reportError, sessionId }) => {
		const sqlitePath = target.sqlitePath;
		const parser = createCanonicalHeaderlessEventParser(sessionId);
		const snapshot = reader.headerlessSnapshot(sessionId, (row) => parser.parse(row) !== void 0);
		if (!snapshot.ok) {
			reportError(`- Failed to read transcript ${sessionId} (${target.agentId})`, snapshot.error);
			return;
		}
		if (!snapshot.sessionKey || !parser.hasIndexedEntries() || snapshot.rows.length === 0) return;
		const headerTimestamp = timestampMsToIsoString(snapshot.rows[0]?.createdAt ?? NaN);
		if (!headerTimestamp) {
			note(`- Failed to repair transcript ${sessionId} (${target.agentId}): invalid first-row timestamp`, NOTE_TITLE);
			return;
		}
		found += 1;
		if (!params.shouldRepair) return;
		const logicalAgentId = parseAgentSessionKey(snapshot.sessionKey)?.agentId ?? target.agentId;
		const workspaceCwd = resolveAgentWorkspaceDir(params.cfg, logicalAgentId, env);
		try {
			runOpenClawAgentWriteTransaction((database) => {
				const currentRows = readTranscriptStorageRows(database, sessionId);
				if (!transcriptSnapshotsMatch(snapshot.rows, currentRows, true)) throw new Error(`transcript changed while preparing header repair for ${sessionId}`);
				const events = parseCanonicalHeaderlessEvents(currentRows, sessionId);
				if (!events) throw new Error(`transcript is no longer a stored headerless session: ${sessionId}`);
				const context = readHeaderRepairContext(database, sessionId);
				if (!context || context.sessionKey !== snapshot.sessionKey) throw new Error(`session binding changed while preparing header repair for ${sessionId}`);
				const header = createSessionTranscriptHeader({
					version: 3,
					cwd: context.spawnedCwd ?? workspaceCwd,
					sessionId,
					timestamp: headerTimestamp
				});
				if (!preserved.has(sqlitePath)) {
					const backup = backupDoctorSqliteRepair(sqlitePath, "transcript-headers");
					preserved.add(sqlitePath);
					note(`- Saved pre-repair SQLite backup: ${backup}`, NOTE_TITLE);
				}
				replaceSqliteTranscriptEventsInTransaction(database, {
					agentId: target.agentId,
					env,
					path: sqlitePath,
					sessionId,
					sessionKey: context.sessionKey
				}, [header, ...events], {
					createdAtByIndex: [currentRows[0]?.createdAt ?? Date.parse(headerTimestamp), ...currentRows.map((row) => row.createdAt)],
					preserveSessionWindowRecency: true
				});
				assertRepairPreservedEvents({
					before: currentRows,
					database,
					sessionId
				});
			}, databaseOptions, { operationLabel: "doctor.session-transcript-headers" });
			repaired += 1;
		} catch (error) {
			reportError(`- Failed to repair transcript ${sessionId} (${target.agentId})`, error);
		}
	});
	if (params.shouldRepair && repaired > 0) note(`- Prepended missing headers to ${countLabel(repaired, "session transcript")}.`, NOTE_TITLE);
	else if (!params.shouldRepair && found > 0) note([`- Found ${countLabel(found, "stored session transcript")} without a header.`, `- Run "openclaw doctor --fix" to repair ${found === 1 ? "it" : "them"} before resuming the session.`].join("\n"), NOTE_TITLE);
	return {
		found,
		repaired
	};
}
//#endregion
export { noteSessionTranscriptHeaderHealth };
