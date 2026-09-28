import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { i as tableHasColumn, r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { C as parseParentLinkedOpaqueEntry, S as parseOpaqueLeafEntry, y as classifySessionFileEntry } from "./transcript-payload-qsg5dB6v.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-jHOoqdX_.mjs";
import { i as resolveAllAgentSessionStoreCandidateTargetsSync, s as resolveConfiguredAgentDatabaseTargets } from "./targets-Dmb8-YXN.mjs";
import { n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-CV9Iu45w.mjs";
import { t as extractGeneratedTranscriptSessionId } from "./generated-transcript-session-id-C-WpjhM8.mjs";
import { c as normalizeLoadedFileEntry, o as migrateSessionFileEntryToCurrentVersion } from "./session-manager-codec-DW3_Rlj9.mjs";
import fs from "node:fs";
import { TextDecoder } from "node:util";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/commands/doctor-session-sqlite-readers.ts
/** Read-only diagnostic readers used by the session SQLite doctor mode. */
const JSONL_READ_CHUNK_BYTES = 65536;
const MAX_LEGACY_COMPACTION_TARGETS = 1e5;
/** Validate an unregistered primary without retaining transcript payloads in memory. */
function readLegacyPrimaryTranscriptIdentity(filePath, originalPath, retainedSharedAliasIds, registered = false) {
	const filename = path.basename(originalPath);
	const filenameId = extractGeneratedTranscriptSessionId(filename) ?? filename.slice(0, -6);
	let sessionId;
	let version = 1;
	let messages = 0;
	for (const { event: raw } of iterateTranscriptEvents(filePath, false)) {
		if (!isRecord(raw) || raw.traceSchema !== void 0) return;
		if (!sessionId) {
			const id = raw.id ?? raw.sessionId;
			if (raw.type !== "session" || typeof id !== "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(id)) return;
			if (id !== filenameId) {
				if (retainedSharedAliasIds?.has(id)) return;
				throw new Error("Primary transcript header does not match its original filename");
			}
			version = typeof raw.version === "number" ? raw.version : 1;
			if (!Number.isInteger(version) || version < 1 || version > 3) throw new Error("Unsupported primary transcript version");
			sessionId = id;
			continue;
		}
		if (raw.type === "session") throw new Error("Multiple primary transcript headers");
		const classified = classifySessionFileEntry(raw, version);
		if (!classified.recognized && !parseOpaqueLeafEntry(raw) && !parseParentLinkedOpaqueEntry(raw)) {
			if (registered) return;
			throw new Error("Unrecognized primary transcript record");
		}
		if (classified.recognized && classified.entry.type === "message") messages += 1;
	}
	return sessionId && (messages > 0 || registered) ? {
		sessionId,
		updatedAt: Math.max(0, Math.floor(fs.statSync(filePath).mtimeMs))
	} : void 0;
}
function countTranscriptEventsForPath(transcriptPath) {
	if (!transcriptPath) return {
		status: "ok",
		events: 0
	};
	if (!fs.existsSync(transcriptPath)) return { status: "missing" };
	let events = 0;
	try {
		for (const line of iterateJsonlLinesSync(transcriptPath)) {
			if (!JSON.parse(line)) continue;
			events += 1;
		}
		return {
			status: "ok",
			events
		};
	} catch (err) {
		return {
			status: "malformed",
			message: `${transcriptPath}: ${String(err)}. Only the readable prefix can be imported; the original remains protected for recovery.`
		};
	}
}
function createTranscriptEventReader(transcriptPath, sessionId, allowMalformedPrefix = false, sourceFingerprint = readTranscriptFingerprint(transcriptPath), originalSourcePath = transcriptPath) {
	return (append) => {
		const plan = planTranscriptImport(transcriptPath, allowMalformedPrefix);
		assertTranscriptFileUnchanged(transcriptPath, sourceFingerprint);
		const idPrefix = createHash("sha256").update(originalSourcePath).update("\0").update(sessionId).digest("hex").slice(0, 16);
		assertTranscriptFileUnchanged(transcriptPath, sourceFingerprint);
		const migratedTargetIds = /* @__PURE__ */ new Map();
		const migrationState = {
			createEntryId: (originalIndex) => `${idPrefix}-${originalIndex.toString(36)}`,
			previousId: null,
			resolveOriginalEntryId: (originalIndex) => migratedTargetIds.get(originalIndex),
			sourceVersion: plan.sourceVersion
		};
		for (const { event: loadedEvent, originalIndex } of iterateTranscriptEvents(transcriptPath, allowMalformedPrefix)) {
			let event = loadedEvent;
			if (plan.sourceVersion >= 2) recordLegacyCompactionTarget(event, plan.compactionTargetIndexes);
			let recognizedEvent;
			if (originalIndex === plan.headerIndex) {
				const canonicalHeader = {
					...event,
					id: sessionId,
					type: "session",
					timestamp: typeof event.timestamp === "string" ? event.timestamp : "",
					cwd: "cwd" in event && typeof event.cwd === "string" ? event.cwd : ""
				};
				Reflect.deleteProperty(canonicalHeader, "sessionId");
				event = canonicalHeader;
				recognizedEvent = event;
			} else {
				const classified = classifySessionFileEntry(event, plan.sourceVersion);
				recognizedEvent = classified.recognized ? classified.entry : void 0;
			}
			if (recognizedEvent) {
				migrateSessionFileEntryToCurrentVersion(recognizedEvent, originalIndex, migrationState);
				if (plan.sourceVersion < 2 && recognizedEvent.type !== "session" && plan.compactionTargetIndexes.has(originalIndex)) migratedTargetIds.set(originalIndex, recognizedEvent.id);
				event = recognizedEvent;
			}
			append(event);
		}
		assertTranscriptFileUnchanged(transcriptPath, sourceFingerprint);
		return () => assertTranscriptFileUnchanged(transcriptPath, sourceFingerprint);
	};
}
var TranscriptImportLimitError = class extends Error {};
function readTranscriptFingerprint(transcriptPath) {
	const stat = fs.statSync(transcriptPath, { bigint: true });
	return {
		ctimeNs: stat.ctimeNs,
		dev: stat.dev,
		ino: stat.ino,
		mtimeNs: stat.mtimeNs,
		size: stat.size
	};
}
function assertTranscriptFileUnchanged(transcriptPath, expected) {
	const current = readTranscriptFingerprint(transcriptPath);
	if (current.ctimeNs !== expected.ctimeNs || current.dev !== expected.dev || current.ino !== expected.ino || current.mtimeNs !== expected.mtimeNs || current.size !== expected.size) throw new Error("Legacy transcript changed during import; stop active session writers and rerun `openclaw doctor --fix`.");
}
function planTranscriptImport(transcriptPath, allowMalformedPrefix) {
	const plan = {
		compactionTargetIndexes: /* @__PURE__ */ new Set(),
		headerIndex: -1,
		sourceVersion: 1
	};
	for (const { event, originalIndex } of iterateTranscriptEvents(transcriptPath, allowMalformedPrefix)) {
		if (plan.headerIndex < 0 && isRecord(event) && event.type === "session") {
			plan.headerIndex = originalIndex;
			plan.sourceVersion = typeof event.version === "number" ? event.version : 1;
			if (plan.sourceVersion >= 2) return plan;
		}
		recordLegacyCompactionTarget(event, plan.compactionTargetIndexes);
	}
	return plan;
}
function recordLegacyCompactionTarget(event, targets) {
	if (isRecord(event) && event.type === "compaction" && Number.isInteger(event.firstKeptEntryIndex) && Number(event.firstKeptEntryIndex) >= 0) {
		const targetIndex = Number(event.firstKeptEntryIndex);
		if (!targets.has(targetIndex) && targets.size >= MAX_LEGACY_COMPACTION_TARGETS) throw new TranscriptImportLimitError(`Transcript has more than ${MAX_LEGACY_COMPACTION_TARGETS} legacy compaction targets`);
		targets.add(targetIndex);
	}
}
function* iterateTranscriptEvents(transcriptPath, allowMalformedPrefix) {
	let originalIndex = 0;
	try {
		for (const line of iterateJsonlLinesSync(transcriptPath)) {
			const parsed = JSON.parse(line);
			if (!parsed) continue;
			yield {
				event: normalizeLoadedFileEntry(parsed),
				originalIndex
			};
			originalIndex += 1;
		}
	} catch (error) {
		if (!allowMalformedPrefix || error instanceof TranscriptImportLimitError) throw error;
	}
}
function readSqliteEntryCount(target) {
	const result = readSessionDatabase(target, (database) => {
		const projection = resolveSessionIdentityProjection(database);
		const raw = projection ? database.prepare(`SELECT count(*) AS count FROM ${projection.source}`).get() : void 0;
		return sqliteNumber((isRecord(raw) ? raw : void 0)?.count);
	});
	return result.ok ? result.value ?? 0 : 0;
}
function readOnlySqliteValidationSnapshot(target) {
	const empty = {
		sessionIdsBySessionKey: /* @__PURE__ */ new Map(),
		sessionKeysBySessionId: /* @__PURE__ */ new Map(),
		transcriptEventCountsBySessionId: /* @__PURE__ */ new Map()
	};
	const result = readSessionDatabase(target, (database) => {
		const projection = resolveSessionIdentityProjection(database);
		const sessionIdsBySessionKey = /* @__PURE__ */ new Map();
		if (projection) {
			const statement = database.prepare(`SELECT session_key, ${projection.sessionIdColumn} AS session_id
               FROM ${projection.source}
              ORDER BY session_key`);
			for (const row of statement.iterate()) sessionIdsBySessionKey.set(row.session_key, row.session_id);
		}
		const sessionKeysBySessionId = /* @__PURE__ */ new Map();
		if (tableExists(database, "session_windows")) {
			for (const row of database.prepare("SELECT session_id, session_key FROM session_windows").iterate()) if (typeof row.session_id === "string" && typeof row.session_key === "string") sessionKeysBySessionId.set(row.session_id, row.session_key);
		}
		const transcriptEventCountsBySessionId = /* @__PURE__ */ new Map();
		if (tableExists(database, "transcript_events")) {
			const statement = database.prepare("SELECT session_id, COUNT(*) AS count FROM transcript_events GROUP BY session_id ORDER BY session_id");
			for (const row of statement.iterate()) if (typeof row.session_id === "string" && typeof row.count === "number") transcriptEventCountsBySessionId.set(row.session_id, row.count);
		}
		return {
			sessionIdsBySessionKey,
			sessionKeysBySessionId,
			transcriptEventCountsBySessionId
		};
	});
	return result.ok ? {
		ok: true,
		snapshot: result.value ?? empty
	} : result;
}
function scanReadOnlySqliteActiveTranscriptFiles(target, visit) {
	const result = readSessionDatabase(target, (database) => {
		const projection = resolveSessionIdentityProjection(database);
		if (!projection) return;
		const rows = database.prepare(`SELECT session_key, ${projection.sessionIdColumn} AS session_id,
                CASE WHEN json_valid(entry_json)
                  THEN json_extract(entry_json, '$.sessionFile') END AS session_file
           FROM ${projection.source}
          ORDER BY session_key`).iterate();
		for (const row of rows) visit(row.session_key, row.session_id, row.session_file ?? void 0);
	});
	return result.ok ? { ok: true } : result;
}
function readSessionDatabase(target, read) {
	const sqlitePath = resolveTargetSqlitePath(target);
	if (!fs.existsSync(sqlitePath)) return {
		ok: true,
		value: void 0
	};
	let database;
	try {
		database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
		return {
			ok: true,
			value: read(database)
		};
	} catch (error) {
		return {
			error,
			ok: false
		};
	} finally {
		database?.close();
	}
}
function resolveSessionIdentityProjection(database) {
	if (tableExists(database, "session_nodes")) return {
		sessionIdColumn: "current_session_id",
		source: `session_nodes WHERE ${tableHasColumn(database, "session_nodes", "entry_valid") ? "entry_valid = 1" : "entry_json <> '{}'"}`
	};
	return tableExists(database, "session_entries") ? {
		sessionIdColumn: "session_id",
		source: "session_entries"
	} : void 0;
}
function readOnlySqliteDbStats(target) {
	const sqlitePath = resolveTargetSqlitePath(target);
	const sizeFor = (filePath) => {
		try {
			return fs.statSync(filePath).size;
		} catch {
			return 0;
		}
	};
	if (!fs.existsSync(sqlitePath)) return {
		ok: true,
		stats: {
			dbSizeBytes: 0,
			largestSessions: [],
			totalTranscriptRowBytes: 0,
			walSizeBytes: sizeFor(`${sqlitePath}-wal`)
		}
	};
	let database;
	try {
		database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
		const hasTranscriptEvents = tableExists(database, "transcript_events");
		const integrityRow = database.prepare("PRAGMA quick_check").get();
		if (!hasTranscriptEvents) return {
			ok: true,
			stats: {
				dbSizeBytes: sizeFor(sqlitePath),
				integrityCheck: typeof integrityRow?.quick_check === "string" ? integrityRow.quick_check : void 0,
				largestSessions: [],
				totalTranscriptRowBytes: 0,
				walSizeBytes: sizeFor(`${sqlitePath}-wal`)
			}
		};
		const eventBytes = tableHasColumn(database, "transcript_events", "event_zstd") ? transcriptEventReadBytesSql().compile(getSessionKysely(database)).sql : "octet_length(event_json)";
		const totalRow = database.prepare(`SELECT COALESCE(SUM(${eventBytes}), 0) AS row_bytes FROM transcript_events`).get();
		const largestRows = database.prepare(`
          SELECT session_id, COUNT(*) AS events, COALESCE(SUM(${eventBytes}), 0) AS row_bytes
          FROM transcript_events
          GROUP BY session_id
          ORDER BY row_bytes DESC, events DESC, session_id ASC
          LIMIT 5
        `).all();
		return {
			ok: true,
			stats: {
				dbSizeBytes: sizeFor(sqlitePath),
				integrityCheck: typeof integrityRow?.quick_check === "string" ? integrityRow.quick_check : void 0,
				largestSessions: largestRows.flatMap((row) => {
					if (typeof row.session_id !== "string") return [];
					return [{
						events: sqliteNumber(row.events),
						rowBytes: sqliteNumber(row.row_bytes),
						sessionId: row.session_id
					}];
				}),
				totalTranscriptRowBytes: sqliteNumber(totalRow?.row_bytes),
				walSizeBytes: sizeFor(`${sqlitePath}-wal`)
			}
		};
	} catch (error) {
		return {
			error,
			ok: false
		};
	} finally {
		database?.close();
	}
}
function resolveTargetSqliteOptions(target, env) {
	return toDatabaseOptions(resolveSqliteReadScope({
		agentId: target.agentId,
		env,
		storePath: target.sqlitePath ?? target.storePath
	}));
}
function resolveTargetSqlitePath(target, env) {
	return resolveOpenClawAgentSqlitePath(resolveTargetSqliteOptions(target, env));
}
/**
* Projects each caller's ordered targets onto existing physical databases.
* Keep target selection with the caller: canonical repair selects owners,
* while ordinary row repairs enumerate candidates. First physical path wins.
*/
function projectExistingAgentDatabaseTargets(targets, env, cfg) {
	const seenPaths = /* @__PURE__ */ new Set();
	const isRetained = createRetainedAgentDatabaseMatcher(env, () => resolveConfiguredAgentDatabaseTargets(cfg, { env }));
	return targets.flatMap((target) => {
		if (isRetained(target.storePath, target.agentId) || readAgentDatabaseAdmissionRefusal(target.agentId, { env })) return [];
		const sqlitePath = resolveTargetSqlitePath(target, env);
		if (isRetained(sqlitePath, target.agentId) || seenPaths.has(sqlitePath) || !fs.existsSync(sqlitePath)) return [];
		seenPaths.add(sqlitePath);
		return [{
			agentId: target.agentId,
			sqlitePath,
			storePath: target.storePath
		}];
	});
}
function listExistingAgentDatabaseTargets(cfg, env) {
	return projectExistingAgentDatabaseTargets(resolveAllAgentSessionStoreCandidateTargetsSync(cfg, { env }), env, cfg);
}
function* iterateJsonlLinesSync(filePath) {
	const fd = fs.openSync(filePath, "r");
	const decoder = new TextDecoder("utf-8", { fatal: true });
	const buffer = Buffer.allocUnsafe(JSONL_READ_CHUNK_BYTES);
	let fragments = [];
	let lineNumber = 0;
	try {
		while (true) {
			const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, null);
			if (bytesRead === 0) break;
			const parts = decoder.decode(buffer.subarray(0, bytesRead), { stream: true }).split("\n");
			if (parts.length > 1 && fragments.length > 0) {
				fragments.push(parts[0]);
				parts[0] = fragments.join("");
				fragments = [];
			}
			for (let index = 0; index < parts.length - 1; index++) {
				lineNumber += 1;
				const text = parts[index].trim();
				if (text) yield text;
			}
			fragments.push(parts.at(-1));
		}
		fragments.push(decoder.decode());
		const text = fragments.join("").trim();
		if (text) yield text;
	} catch (err) {
		throw new Error(`${filePath}:${lineNumber + 1}: ${String(err)}`, { cause: err });
	} finally {
		fs.closeSync(fd);
	}
}
function sqliteNumber(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "bigint") return Number(value);
	return 0;
}
//#endregion
export { readLegacyPrimaryTranscriptIdentity as a, readSqliteEntryCount as c, resolveTargetSqlitePath as d, scanReadOnlySqliteActiveTranscriptFiles as f, projectExistingAgentDatabaseTargets as i, readTranscriptFingerprint as l, createTranscriptEventReader as n, readOnlySqliteDbStats as o, listExistingAgentDatabaseTargets as r, readOnlySqliteValidationSnapshot as s, countTranscriptEventsForPath as t, resolveTargetSqliteOptions as u };
