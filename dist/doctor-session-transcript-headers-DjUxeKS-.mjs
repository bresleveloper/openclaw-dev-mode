import { R as timestampMsToIsoString } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { x as isIndexedSessionEntry } from "./transcript-payload-Yc_w8Yx5.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { n as isSessionTranscriptLeafControl, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-CaYJo8Xs.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-BbcRkdUC.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { t as createSessionTranscriptHeader } from "./transcript-header-CyuYZIZn.mjs";
import { u as replaceSqliteTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { w as readTranscriptStorageRows } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import "./session-manager-codec-Dl5j6GJ-.mjs";
import { i as projectExistingAgentDatabaseTargets, u as resolveTargetSqliteOptions } from "./session-sqlite-migration-readers-D3juTq9n.mjs";
import { t as ReadOnlySqliteTranscriptReader } from "./doctor-session-sqlite-transcript-readers-DYKJK916.mjs";
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
function snapshotsMatch(expected, current) {
	return expected.length === current.length && expected.every((row, index) => row.seq === current[index]?.seq && row.createdAt === current[index]?.createdAt && row.eventJson === current[index]?.eventJson);
}
function readHeaderRepairContext(database, sessionId) {
	const db = getSessionKysely(database.db);
	const window = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", sessionId).limit(1));
	if (!window?.session_key) return;
	const node = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select(["current_session_id", "entry_json"]).where("session_key", "=", window.session_key).limit(1));
	let spawnedCwd;
	if (node?.current_session_id === sessionId && node.entry_json) try {
		const entry = JSON.parse(node.entry_json);
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
	for (const target of projectExistingAgentDatabaseTargets(resolveAllAgentSessionStoreTargetsSync(params.cfg, { env }), env, params.cfg)) {
		const databaseOptions = resolveTargetSqliteOptions(target, env);
		const sqlitePath = target.sqlitePath;
		let readDatabase;
		try {
			readDatabase = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
			const reader = new ReadOnlySqliteTranscriptReader(readDatabase);
			for (const sessionId of reader.sessionIds()) {
				const parser = createCanonicalHeaderlessEventParser(sessionId);
				const snapshot = reader.headerlessSnapshot(sessionId, (row) => parser.parse(row) !== void 0);
				if (!snapshot.ok) {
					const detail = formatErrorMessage(snapshot.error).replace(/\s+/g, " ").trim();
					note(`- Failed to read transcript ${sessionId} (${target.agentId}): ${detail}`, NOTE_TITLE);
					continue;
				}
				if (!snapshot.sessionKey || !parser.hasIndexedEntries() || snapshot.rows.length === 0) continue;
				const headerTimestamp = timestampMsToIsoString(snapshot.rows[0]?.createdAt ?? NaN);
				if (!headerTimestamp) {
					note(`- Failed to repair transcript ${sessionId} (${target.agentId}): invalid first-row timestamp`, NOTE_TITLE);
					continue;
				}
				found += 1;
				if (!params.shouldRepair) continue;
				const logicalAgentId = parseAgentSessionKey(snapshot.sessionKey)?.agentId ?? target.agentId;
				const workspaceCwd = resolveAgentWorkspaceDir(params.cfg, logicalAgentId, env);
				try {
					runOpenClawAgentWriteTransaction((database) => {
						const currentRows = readTranscriptStorageRows(database, sessionId);
						if (!snapshotsMatch(snapshot.rows, currentRows)) throw new Error(`transcript changed while preparing header repair for ${sessionId}`);
						const events = parseCanonicalHeaderlessEvents(currentRows, sessionId);
						if (!events) throw new Error(`transcript is no longer a canonical headerless session: ${sessionId}`);
						const context = readHeaderRepairContext(database, sessionId);
						if (!context || context.sessionKey !== snapshot.sessionKey) throw new Error(`session binding changed while preparing header repair for ${sessionId}`);
						const header = createSessionTranscriptHeader({
							version: 3,
							cwd: context.spawnedCwd ?? workspaceCwd,
							sessionId,
							timestamp: headerTimestamp
						});
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
					const detail = formatErrorMessage(error).replace(/\s+/g, " ").trim();
					note(`- Failed to repair transcript ${sessionId} (${target.agentId}): ${detail}`, NOTE_TITLE);
				}
			}
		} catch (error) {
			const detail = formatErrorMessage(error).replace(/\s+/g, " ").trim();
			note(`- Failed to inspect transcript headers for ${target.agentId} (${sqlitePath}): ${detail}`, NOTE_TITLE);
		} finally {
			readDatabase?.close();
		}
	}
	if (params.shouldRepair && repaired > 0) note(`- Prepended missing headers to ${countLabel(repaired, "session transcript")}.`, NOTE_TITLE);
	else if (!params.shouldRepair && found > 0) note([`- Found ${countLabel(found, "canonical session transcript")} without a header.`, `- Run "openclaw doctor --fix" to repair ${found === 1 ? "it" : "them"} before resuming the session.`].join("\n"), NOTE_TITLE);
	return {
		found,
		repaired
	};
}
//#endregion
export { noteSessionTranscriptHeaderHealth };
