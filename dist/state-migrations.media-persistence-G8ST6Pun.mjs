import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { u as sameFileContentsSync } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { a as resolveImmutableSqliteFileUri, i as resolveExistingSqliteFileUri, n as readSqliteDataVersion, t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { i as runSqliteDeferredTransactionSync, o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-CUXsFwAM.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-B1TtVu8E.mjs";
import { l as createSqliteWalReclamationResult } from "./sqlite-wal-BzoPsBh0.mjs";
import { i as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { i as sameFileMutationFingerprint } from "./file-descriptor-C_0BsNDD.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-eRv24eIu.mjs";
import { r as replaceFileAtomicSync } from "./replace-file-DJtj9VLX.mjs";
import { _ as encodeSessionArchiveContent, g as decodeSessionArchiveBytes, h as SESSION_ARCHIVE_ZSTD_SUFFIX, s as isSessionArchiveArtifactName, y as readSessionArchiveContentSync } from "./artifacts-C9weQ_MG.mjs";
import { j as repairCanonicalSqliteIndexes } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as configureSqliteMaintenanceCache } from "./sqlite-maintenance-cache-AYpxl8JZ.mjs";
import "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { i as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-board-schema-vd3Vff_q.mjs";
import { d as withLegacyAgentStorageSchema, m as withLegacySessionParticipantsSchema, r as assertOpenClawAgentSchemaContains } from "./openclaw-agent-db-schema-helpers-D9qnl2Yp.mjs";
import { _ as formatAgentDatabaseOwnershipRepairHint, y as moveSqliteFilesAside } from "./agent-database-admission-BFwcs62N.mjs";
import { n as assertOpenClawAgentDatabaseOwner, o as ensureOpenClawAgentDatabaseSchema, s as migrateOpenClawAgentDatabaseToMediaPrerequisiteSchema } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import { _ as renewAgentDatabaseMaintenanceAuthorityIfPresent, r as assertAgentDatabaseMaintenanceAuthority, u as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation } from "./openclaw-agent-db-lease-DexIwF6s.mjs";
import { h as withAgentDatabaseMaintenanceLease } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as unregisterOpenClawAgentDatabase, i as registerOpenClawAgentDatabase } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-qsg5dB6v.mjs";
import { i as hasMeaningfulRetiredMediaCarrier, r as canonicalizePersistedUserMessageMedia } from "./media-facts-BEHTU0wM.mjs";
import { f as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { u as reconcileSessionTranscriptIndexInTransaction } from "./session-transcript-index-UaRlRUAw.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-jHOoqdX_.mjs";
import { n as listTranscriptArchives, r as resolveAgentDatabaseMigrationTargets } from "./state-migrations.media-persistence-targets-CvP9Kmvc.mjs";
import { d as rewriteSqliteTranscriptEventRowsInTransaction } from "./session-accessor.sqlite-transcript-store-C7lVBkzn.mjs";
import { t as checkpointDoctorSqliteFile } from "./doctor-sqlite-compact-B5LqMTFV.mjs";
import { t as migrateCanonicalTranscriptArchives } from "./state-migrations.transcript-directives-archives-DDzeSQC4.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/infra/state-migrations.agent-owner-recovery.ts
/** Doctor recovers only proven duplicate files, before either owner's schema changes. */
function filesEqual(left, right) {
	const leftStat = fs.lstatSync(left, {
		bigint: true,
		throwIfNoEntry: false
	});
	const rightStat = fs.lstatSync(right, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!leftStat || !rightStat) return !leftStat && !rightStat;
	if (!leftStat.isFile() || !rightStat.isFile() || leftStat.nlink !== 1n || rightStat.nlink !== 1n || leftStat.dev === rightStat.dev && leftStat.ino === rightStat.ino || leftStat.size !== rightStat.size) return false;
	const leftFd = fs.openSync(left, "r");
	try {
		const rightFd = fs.openSync(right, "r");
		try {
			return sameFileContentsSync(leftFd, rightFd, { maxBytes: Number(leftStat.size) }) && sameFileMutationFingerprint(leftStat, fs.fstatSync(leftFd, { bigint: true })) && sameFileMutationFingerprint(rightStat, fs.fstatSync(rightFd, { bigint: true })) && sameFileMutationFingerprint(leftStat, fs.lstatSync(left, { bigint: true })) && sameFileMutationFingerprint(rightStat, fs.lstatSync(right, { bigint: true }));
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "too-large") return false;
			throw error;
		} finally {
			fs.closeSync(rightFd);
		}
	} finally {
		fs.closeSync(leftFd);
	}
}
function archiveNames(directory) {
	const stat = fs.lstatSync(directory, { throwIfNoEntry: false });
	if (!stat) return [];
	if (!stat.isDirectory()) throw new Error(`Transcript archive directory is aliased or invalid: ${directory}`);
	return fs.readdirSync(directory).filter((name) => name.includes(".jsonl.") && isSessionArchiveArtifactName(name));
}
function assertEqualFileSets(copy, owner) {
	const ownerFiles = resolveSqliteDatabaseFilePaths(owner.path);
	for (const [index, source] of resolveSqliteDatabaseFilePaths(copy.path).entries()) if (!filesEqual(source, ownerFiles[index])) throw new Error(`SQLite files differ or are aliased: ${source}`);
	const copyDirectory = resolveSqliteTranscriptArchiveDirectory(copy);
	const ownerDirectory = resolveSqliteTranscriptArchiveDirectory(owner);
	const names = /* @__PURE__ */ new Set([...archiveNames(copyDirectory), ...archiveNames(ownerDirectory)]);
	for (const name of names) if (!filesEqual(path.join(copyDirectory, name), path.join(ownerDirectory, name))) throw new Error(`Transcript archive dependencies differ or are aliased: ${name}`);
}
function checkpoint(target, maintenance) {
	maintenance.assertOwned();
	const database = openNodeSqliteDatabase(resolveExistingSqliteFileUri(fs.realpathSync.native(target.path)));
	try {
		assertOpenClawAgentDatabaseOwner(database, {
			agentId: target.agentId,
			pathname: target.path
		});
		assertSqliteIntegrity(database, target.path);
		maintenance.assertOwned();
		checkpointDoctorSqliteFile(database, target.path);
	} finally {
		database.close();
	}
}
function recoverMisplacedAgentDatabaseCopies(params) {
	const metadata = /* @__PURE__ */ new Map();
	for (const target of params.targets) try {
		const database = openNodeSqliteDatabase(resolveImmutableSqliteFileUri(fs.realpathSync.native(target.path)), { readOnly: true });
		try {
			metadata.set(target.path, readExistingAgentSchemaMeta(database));
		} finally {
			database.close();
		}
	} catch {}
	const results = /* @__PURE__ */ new Map();
	for (const target of params.targets) {
		const identity = metadata.get(target.path);
		if (identity?.role !== "agent" || !identity.agentId || normalizeAgentId(identity.agentId) === target.agentId) continue;
		const ownerId = normalizeAgentId(identity.agentId);
		const owners = params.targets.filter((candidate) => candidate.agentId === ownerId && metadata.get(candidate.path)?.agentId === identity.agentId);
		try {
			const owner = owners.length === 1 ? owners[0] : void 0;
			if (!owner) throw new Error(`Cannot identify one database for owning agent ${ownerId}`);
			assertEqualFileSets(target, owner);
			checkpoint({
				...target,
				agentId: ownerId
			}, params.maintenance);
			checkpoint(owner, params.maintenance);
			assertEqualFileSets(target, owner);
			params.maintenance.assertOwned();
			const recovery = moveSqliteFilesAside(target.path, () => params.maintenance.assertOwned());
			results.set(target.path, {
				recovered: true,
				warning: `Recovered agent ${target.agentId}: ${target.path} was a byte-identical copy of agent ${ownerId}'s database. Preserved the copy at ${recovery.movedFiles.join(", ")}. Agent ${target.agentId} can start with a fresh database. Run openclaw doctor --fix to verify repairs.`
			});
		} catch (error) {
			results.set(target.path, {
				recovered: false,
				warning: `Refused agent ${target.agentId} database ${target.path}: belongs to agent ${ownerId}; duplicate recovery could not be verified (${String(error)}). ${formatAgentDatabaseOwnershipRepairHint(target.path)}`
			});
		}
	}
	return results;
}
//#endregion
//#region src/infra/state-migrations.media-persistence-transform.ts
function transformTranscriptEvent(event) {
	if (!isRecord(event) || event.type !== "message" || !isRecord(event.message)) return {
		changed: false,
		event
	};
	const canonical = canonicalizePersistedUserMessageMedia(event.message);
	return canonical.changed ? {
		changed: true,
		event: {
			...event,
			message: canonical.message
		}
	} : {
		changed: false,
		event
	};
}
function parseTranscriptEvent(raw, owner) {
	try {
		return JSON.parse(raw);
	} catch (error) {
		throw new Error(`${owner} contains invalid transcript JSON: ${String(error)}`, { cause: error });
	}
}
function eventIdentity(event) {
	if (!isRecord(event)) return JSON.stringify({
		id: null,
		parentId: null,
		type: null
	});
	return JSON.stringify({
		id: typeof event.id === "string" ? event.id : null,
		parentId: typeof event.parentId === "string" ? event.parentId : null,
		type: typeof event.type === "string" ? event.type : null
	});
}
function assertEventIdentitiesUnchanged(before, after, owner) {
	if (before.length !== after.length) throw new Error(`${owner} event count changed during media migration`);
	for (let index = 0; index < before.length; index += 1) if (eventIdentity(before[index]) !== eventIdentity(after[index])) throw new Error(`${owner} event identity changed at index ${index}`);
}
function parseArchiveContent(content, filePath) {
	if (content === "") return [];
	return (content.endsWith("\n") ? content.slice(0, -1).split("\n") : content.split("\n")).map((line, index) => {
		if (!line) throw new Error(`${filePath} contains a blank JSONL record at line ${index + 1}`);
		return parseTranscriptEvent(line, `${filePath}:${index + 1}`);
	});
}
function serializeArchiveEvents(events, trailingNewline) {
	if (events.length === 0) return "";
	return `${events.map((event) => JSON.stringify(event)).join("\n")}${trailingNewline ? "\n" : ""}`;
}
function transformMediaArchiveContent(content, filePath) {
	let nulTailStart = content.length;
	while (nulTailStart > 0 && content.charCodeAt(nulTailStart - 1) === 0) nulTailStart -= 1;
	const hasTerminalNulSuffix = nulTailStart < content.length;
	if (hasTerminalNulSuffix && nulTailStart === 0) throw new Error(`${filePath} contains no JSONL records before its terminal NUL suffix`);
	const recoveredContent = hasTerminalNulSuffix ? content.slice(0, nulTailStart) : content;
	const events = parseArchiveContent(recoveredContent, filePath);
	let mediaChanged = false;
	const transformed = events.map((event) => {
		const result = transformTranscriptEvent(event);
		mediaChanged ||= result.changed;
		return result.event;
	});
	if (!hasTerminalNulSuffix && !mediaChanged) return {
		changed: false,
		content
	};
	assertEventIdentitiesUnchanged(events, transformed, filePath);
	return {
		changed: true,
		content: mediaChanged ? serializeArchiveEvents(transformed, recoveredContent.endsWith("\n")) : recoveredContent
	};
}
//#endregion
//#region src/infra/state-migrations.media-persistence-database.ts
const MEDIA_MIGRATION_ROW_BATCH_SIZE = 64;
function forEachMediaEventBatch(params) {
	const db = getNodeSqliteKysely(params.database);
	const eventJson = params.table === "transcript_events" && !params.legacyTextStorage ? transcriptEventJsonSql(params.database) : sql.ref(`${params.table}.event_json`);
	let cursor;
	while (true) {
		let query = db.selectFrom(params.table).select(["session_id", "seq"]).select(eventJson.as("event_json")).orderBy("session_id", "asc").orderBy("seq", "asc").limit(MEDIA_MIGRATION_ROW_BATCH_SIZE);
		const after = cursor;
		if (after) query = query.where((expression) => expression(expression.refTuple("session_id", "seq"), ">", expression.tuple(after.sessionId, after.seq)));
		const rows = executeSqliteQuerySync(params.database, query).rows;
		const last = rows.at(-1);
		if (!last) return;
		params.visit(rows);
		cursor = {
			seq: last.seq,
			sessionId: last.session_id
		};
	}
}
function scanTranscriptRows(params) {
	const { database, pathname, writer } = params;
	const db = getNodeSqliteKysely(database);
	let lastChangedSessionId;
	let changedSessions = 0;
	forEachMediaEventBatch({
		database,
		table: "transcript_events",
		legacyTextStorage: params.legacyTextStorage,
		visit: (rows) => {
			const sessionIds = [...new Set(rows.map((row) => row.session_id))];
			const sessionKeys = new Map(executeSqliteQuerySync(database, db.selectFrom("session_windows").select(["session_id", "session_key"]).where("session_id", "in", sessionIds)).rows.map((row) => [row.session_id, row.session_key]));
			for (const sessionId of sessionIds) if (!sessionKeys.has(sessionId)) throw new Error(`${pathname}:${sessionId} has transcript rows without a session window`);
			const rewritesBySession = /* @__PURE__ */ new Map();
			for (const row of rows) {
				const owner = `${pathname}:${row.session_id}:${row.seq}`;
				const event = parseTranscriptEvent(row.event_json, owner);
				const transformed = transformTranscriptEvent(event);
				if (!transformed.changed) continue;
				if (eventIdentity(event) !== eventIdentity(transformed.event)) throw new Error(`${owner} event identity changed during media migration`);
				if (lastChangedSessionId !== row.session_id) {
					lastChangedSessionId = row.session_id;
					changedSessions += 1;
					params.onChangedSession?.(row.session_id);
				}
				const rewrites = rewritesBySession.get(row.session_id) ?? [];
				rewrites.push({
					event: transformed.event,
					expectedEventJson: row.event_json,
					seq: row.seq
				});
				rewritesBySession.set(row.session_id, rewrites);
			}
			if (writer) for (const [sessionId, rewrites] of rewritesBySession) {
				const sessionKey = sessionKeys.get(sessionId);
				if (!sessionKey) throw new Error(`${pathname}:${sessionId} has transcript rows without a session window`);
				rewriteSqliteTranscriptEventRowsInTransaction(writer, {
					agentId: writer.agentId,
					path: pathname,
					sessionId,
					sessionKey
				}, rewrites, { legacyTextStorage: params.legacyTextStorage });
			}
		}
	});
	return changedSessions;
}
function rewriteTrajectoryEventJson(eventJson, owner) {
	let event;
	try {
		event = JSON.parse(eventJson);
	} catch (error) {
		throw new Error(`${owner} contains invalid trajectory JSON: ${String(error)}`, { cause: error });
	}
	if (!isRecord(event) || !isRecord(event.data) || !Array.isArray(event.data.messagesSnapshot)) return eventJson;
	let changed = false;
	const messagesSnapshot = event.data.messagesSnapshot.map((message) => {
		if (!isRecord(message) || !hasMeaningfulRetiredMediaCarrier(message)) return message;
		const canonical = canonicalizePersistedUserMessageMedia(message);
		changed ||= canonical.changed;
		return canonical.message;
	});
	return changed ? JSON.stringify({
		...event,
		data: {
			...event.data,
			messagesSnapshot
		}
	}) : eventJson;
}
function scanTrajectoryRows(params) {
	const { database, pathname, rewrite } = params;
	const db = getNodeSqliteKysely(database);
	let changedRows = 0;
	forEachMediaEventBatch({
		database,
		table: "trajectory_runtime_events",
		visit: (rows) => {
			for (const row of rows) {
				const rewrittenEventJson = rewriteTrajectoryEventJson(row.event_json, `${pathname}:${row.session_id}:${row.seq}`);
				if (rewrittenEventJson === row.event_json) continue;
				changedRows += 1;
				if (rewrite) executeSqliteQuerySync(database, db.updateTable("trajectory_runtime_events").set({ event_json: rewrittenEventJson }).where("session_id", "=", row.session_id).where("seq", "=", row.seq));
			}
		}
	});
	return changedRows;
}
function readMediaSourceVersion(database, legacyTextStorage) {
	const dataVersion = readSqliteDataVersion(database);
	const db = getNodeSqliteKysely(database);
	const counts = executeSqliteQueryTakeFirstSync(database, db.selectNoFrom((eb) => [
		eb.selectFrom("transcript_events").select((row) => row.fn.countAll().as("count")).as("transcript_rows"),
		eb.selectFrom("transcript_events").select((row) => row.fn.coalesce(row.fn.sum(legacyTextStorage ? row.fn("octet_length", ["event_json"]) : transcriptEventReadBytesSql()), row.val(0)).as("bytes")).as("transcript_bytes"),
		eb.selectFrom("transcript_events").select((row) => row.cast(row.fn.coalesce(row.fn.sum("created_at"), row.val(0)), "text").as("created_at")).as("transcript_created_at"),
		eb.selectFrom("trajectory_runtime_events").select((row) => row.fn.countAll().as("count")).as("trajectory_rows"),
		eb.selectFrom("trajectory_runtime_events").select((row) => row.fn.coalesce(row.fn.sum(row.fn("length", ["event_json"])), row.val(0)).as("bytes")).as("trajectory_bytes")
	]));
	const number = (value) => typeof value === "bigint" ? Number(value) : typeof value === "number" ? value : 0;
	const count = (key) => number(counts?.[key]);
	return {
		dataVersion,
		trajectoryBytes: count("trajectory_bytes"),
		trajectoryRows: count("trajectory_rows"),
		transcriptBytes: count("transcript_bytes"),
		transcriptCreatedAt: counts?.transcript_created_at ?? "0",
		transcriptRows: count("transcript_rows")
	};
}
function mediaSourceDriftMessage(pathname, expected, current) {
	if (expected.transcriptRows !== current.transcriptRows || expected.transcriptBytes !== current.transcriptBytes || expected.transcriptCreatedAt !== current.transcriptCreatedAt) return `${pathname} transcript source changed before migration commit`;
	if (expected.trajectoryRows !== current.trajectoryRows || expected.trajectoryBytes !== current.trajectoryBytes) return `${pathname} trajectory source changed before migration commit`;
	return `${pathname} source changed before migration transaction`;
}
//#endregion
//#region src/infra/state-migrations.media-persistence.ts
const PREVIOUS_MEDIA_SCHEMA_VERSION = 16;
const ARCHIVE_TEMP_MARKER = ".media-retirement";
function createMigrationDatabaseHandle(database, agentId, pathname) {
	return {
		agentId,
		db: database,
		path: pathname,
		walMaintenance: {
			checkpoint: () => false,
			close: () => false,
			reclaimFreePages: createSqliteWalReclamationResult
		}
	};
}
function refreshAgentDatabasePlannerStatistics(database) {
	database.exec("PRAGMA analysis_limit=1000; ANALYZE main;");
}
async function migrateAgentDatabase(params) {
	invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(params.pathname);
	const database = openNodeSqliteDatabase(params.pathname);
	const migrateArchives = () => migrateCanonicalTranscriptArchives({
		agentId: params.agentId,
		database,
		pathname: params.pathname,
		start: {
			generation: "",
			sessionId: ""
		},
		writeCursor: () => {},
		onArchive: (archivePath) => params.canonicalArchivePaths.add(archivePath),
		transformContent: transformMediaArchiveContent
	});
	try {
		configureSqliteMaintenanceCache(database);
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		enableNodeSqliteKyselyStatementCache(database);
		let metadata = assertOpenClawAgentDatabaseOwner(database, {
			agentId: params.agentId,
			pathname: params.pathname
		});
		let userVersion = readSqliteUserVersion(database);
		const initialVersion = userVersion;
		if (userVersion <= PREVIOUS_MEDIA_SCHEMA_VERSION) {
			migrateOpenClawAgentDatabaseToMediaPrerequisiteSchema(database, {
				agentId: params.agentId,
				path: params.pathname
			});
			metadata = assertOpenClawAgentDatabaseOwner(database, {
				agentId: params.agentId,
				pathname: params.pathname
			});
			userVersion = readSqliteUserVersion(database);
		}
		if (metadata.schemaVersion !== userVersion) throw new Error(`${params.pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match ${userVersion}`);
		if (userVersion >= 17) {
			ensureOpenClawAgentDatabaseSchema(database, {
				agentId: params.agentId,
				path: params.pathname
			});
			userVersion = readSqliteUserVersion(database);
		}
		const mediaSchemaUpgrade = userVersion === PREVIOUS_MEDIA_SCHEMA_VERSION;
		const assertMediaSchemaMigration = () => {
			if (!mediaSchemaUpgrade) return;
			assertAgentDatabaseMaintenanceAuthority();
			getOpenClawDatabaseMaintenanceScope()?.assertAgentSchemaMigration({
				agentId: params.agentId,
				path: params.pathname,
				foundVersion: userVersion,
				supportedVersion: 17
			});
		};
		assertMediaSchemaMigration();
		const schemaMode = userVersion < 23 ? "legacy" : "current";
		const schemaSql = schemaMode === "legacy" ? withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(OPENCLAW_AGENT_SCHEMA_SQL)) : OPENCLAW_AGENT_SCHEMA_SQL;
		if (userVersion === PREVIOUS_MEDIA_SCHEMA_VERSION) repairCanonicalSqliteIndexes(database, params.pathname, schemaSql, { validateAfterRepair: () => assertOpenClawAgentSchemaContains(database, params.pathname, schemaSql, schemaMode) });
		assertOpenClawAgentSchemaContains(database, params.pathname, schemaSql, schemaMode);
		const legacyTextStorage = userVersion < 23;
		if (!mediaSchemaUpgrade) {
			const detected = runSqliteDeferredTransactionSync(database, () => ({
				rewrittenSessions: scanTranscriptRows({
					database,
					pathname: params.pathname,
					legacyTextStorage
				}),
				rewrittenTrajectoryRows: scanTrajectoryRows({
					database,
					pathname: params.pathname,
					rewrite: false
				})
			}), {
				databaseLabel: params.pathname,
				operationLabel: "media-persistence-detection"
			});
			if (detected.rewrittenSessions === 0 && detected.rewrittenTrajectoryRows === 0) {
				const rewrittenArchives = await migrateArchives();
				refreshAgentDatabasePlannerStatistics(database);
				return {
					...detected,
					rewrittenArchives,
					initialVersion,
					finalVersion: userVersion
				};
			}
		}
		const sourceVersion = readMediaSourceVersion(database, legacyTextStorage);
		const changedLegacySessions = /* @__PURE__ */ new Set();
		params.beforeTransaction?.();
		const owner = createMigrationDatabaseHandle(database, params.agentId, params.pathname);
		const rewritten = runSqliteImmediateTransactionSync(database, () => {
			assertMediaSchemaMigration();
			const currentSourceVersion = readMediaSourceVersion(database, legacyTextStorage);
			if (currentSourceVersion.dataVersion !== sourceVersion.dataVersion) throw new Error(mediaSourceDriftMessage(params.pathname, sourceVersion, currentSourceVersion));
			const rewrittenSessions = scanTranscriptRows({
				database,
				pathname: params.pathname,
				writer: owner,
				legacyTextStorage,
				onChangedSession: legacyTextStorage ? (sessionId) => {
					changedLegacySessions.add(sessionId);
				} : void 0
			});
			const rewrittenTrajectoryRows = scanTrajectoryRows({
				database,
				pathname: params.pathname,
				rewrite: true
			});
			if (mediaSchemaUpgrade) {
				const db = getNodeSqliteKysely(database);
				database.exec(`PRAGMA user_version = 17;`);
				executeSqliteQuerySync(database, db.updateTable("schema_meta").set({
					app_version: VERSION,
					schema_version: 17,
					updated_at: Date.now()
				}).where("meta_key", "=", "primary"));
			}
			assertMediaSchemaMigration();
			return {
				rewrittenSessions,
				rewrittenTrajectoryRows
			};
		}, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: params.pathname,
			operationLabel: "media-persistence-retirement"
		});
		ensureOpenClawAgentDatabaseSchema(database, {
			agentId: params.agentId,
			path: params.pathname
		});
		if (changedLegacySessions.size > 0) runSqliteImmediateTransactionSync(database, () => {
			assertAgentDatabaseMaintenanceAuthority();
			for (const sessionId of changedLegacySessions) {
				renewAgentDatabaseMaintenanceAuthorityIfPresent();
				reconcileSessionTranscriptIndexInTransaction(database, sessionId);
			}
			assertAgentDatabaseMaintenanceAuthority();
		}, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: params.pathname,
			operationLabel: "media-persistence-projection"
		});
		const rewrittenArchives = await migrateArchives();
		refreshAgentDatabasePlannerStatistics(database);
		return {
			...rewritten,
			rewrittenArchives,
			initialVersion,
			finalVersion: readSqliteUserVersion(database)
		};
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(database);
		database.close();
	}
}
function readArchiveSourceSnapshot(filePath) {
	const stat = fs.lstatSync(filePath);
	if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`${filePath} is not a regular archive file`);
	const bytes = fs.readFileSync(filePath);
	return {
		dev: stat.dev,
		ino: stat.ino,
		mtimeMs: stat.mtimeMs,
		sha256: createHash("sha256").update(bytes).digest("hex"),
		size: stat.size
	};
}
function archiveSourceMatches(filePath, expected) {
	try {
		const current = readArchiveSourceSnapshot(filePath);
		return current.dev === expected.dev && current.ino === expected.ino && current.mtimeMs === expected.mtimeMs && current.sha256 === expected.sha256 && current.size === expected.size;
	} catch {
		return false;
	}
}
function migrateTranscriptArchive(filePath, options = {}) {
	const source = readArchiveSourceSnapshot(filePath);
	const transformed = transformMediaArchiveContent(readSessionArchiveContentSync(filePath), filePath);
	if (!transformed.changed) return false;
	const rewritten = transformed.content;
	const compressed = filePath.endsWith(SESSION_ARCHIVE_ZSTD_SUFFIX);
	const encoded = compressed ? encodeSessionArchiveContent(rewritten) : {
		bytes: Buffer.from(rewritten, "utf8"),
		suffix: ""
	};
	if (compressed && encoded.suffix !== ".zst") throw new Error(`${filePath} could not be re-encoded with its zstd codec`);
	options.beforeReplace?.();
	replaceFileAtomicSync({
		filePath,
		content: encoded.bytes,
		preserveExistingMode: true,
		syncParentDir: true,
		syncTempFile: true,
		tempPrefix: `${path.basename(filePath)}${ARCHIVE_TEMP_MARKER}`,
		beforeRename: ({ tempPath }) => {
			if (!archiveSourceMatches(filePath, source)) throw new Error(`${filePath} changed before atomic media migration replacement`);
			const staged = decodeSessionArchiveBytes(fs.readFileSync(tempPath), compressed);
			if (staged !== rewritten) throw new Error(`${filePath} failed codec readback before replacement`);
			assertEventIdentitiesUnchanged(parseArchiveContent(rewritten, filePath), parseArchiveContent(staged, tempPath), filePath);
		}
	});
	if (readSessionArchiveContentSync(filePath) !== rewritten) throw new Error(`${filePath} failed codec readback after replacement`);
	return true;
}
/** Doctor-only migration from top-level Media* transcript fields to canonical facts. */
async function migrateLegacyMediaPersistence(params = {}) {
	const env = params.env ?? process.env;
	const changes = [];
	const warnings = [];
	let recoverableWarningCount = 0;
	const refusedAgentDatabasePaths = [];
	const recoveredAgentDatabasePaths = /* @__PURE__ */ new Set();
	try {
		await withAgentDatabaseMaintenanceLease({ env }, async (maintenance) => {
			const discovery = resolveAgentDatabaseMigrationTargets({
				changes,
				configuredAgentDatabaseTargets: params.configuredAgentDatabaseTargets ?? [],
				env,
				warnings,
				preparedDiscovery: params.preparedDiscovery
			});
			recoverableWarningCount = discovery.recoverableWarningCount;
			const recoveries = recoverMisplacedAgentDatabaseCopies({
				targets: discovery.targets,
				maintenance
			});
			const seenPaths = /* @__PURE__ */ new Set();
			const archiveDirectories = /* @__PURE__ */ new Set();
			const canonicalArchivePaths = /* @__PURE__ */ new Set();
			const refusedArchiveDirectories = /* @__PURE__ */ new Set();
			for (const entry of discovery.targets) {
				const pathname = entry.path;
				const recovery = recoveries.get(pathname);
				if (recovery) {
					maintenance.assertOwned();
					warnings.push(recovery.warning);
					if (recovery.recovered) {
						recoveredAgentDatabasePaths.add(pathname);
						recoveredAgentDatabasePaths.add(entry.realPath);
						unregisterOpenClawAgentDatabase({
							agentId: entry.agentId,
							env,
							path: pathname
						});
						recoverableWarningCount += 1;
					} else {
						refusedAgentDatabasePaths.push(pathname);
						refusedArchiveDirectories.add(resolveSqliteTranscriptArchiveDirectory({
							agentId: entry.agentId,
							path: pathname
						}));
					}
					continue;
				}
				archiveDirectories.add(resolveSqliteTranscriptArchiveDirectory({
					agentId: entry.agentId,
					path: pathname
				}));
				if (seenPaths.has(entry.realPath)) continue;
				seenPaths.add(entry.realPath);
				try {
					const result = await migrateAgentDatabase({
						agentId: entry.agentId,
						canonicalArchivePaths,
						beforeTransaction: params.hooks?.beforeDatabaseTransaction ? () => params.hooks?.beforeDatabaseTransaction?.(pathname) : void 0,
						pathname
					});
					maintenance.assertOwned();
					registerOpenClawAgentDatabase({
						agentId: entry.agentId,
						env,
						path: pathname
					});
					if (result.finalVersion > result.initialVersion) changes.push(`Upgraded agent database schema in ${pathname}: v${result.initialVersion} -> v${result.finalVersion}.`);
					if (result.rewrittenSessions > 0 || result.rewrittenTrajectoryRows > 0) changes.push(`Migrated media persistence in ${pathname}: ${result.rewrittenSessions} transcript session(s), ${result.rewrittenTrajectoryRows} trajectory row(s), schema v23.`);
					if (result.rewrittenArchives > 0) changes.push(`Migrated canonical transcript archive media in ${pathname}: ${result.rewrittenArchives} archive(s).`);
				} catch (error) {
					refusedArchiveDirectories.add(resolveSqliteTranscriptArchiveDirectory({
						agentId: entry.agentId,
						path: pathname
					}));
					warnings.push(`Skipped agent database migration for ${pathname}: ${String(error)}`);
				}
			}
			for (const directory of archiveDirectories) {
				if (refusedArchiveDirectories.has(directory)) continue;
				let archives;
				try {
					archives = listTranscriptArchives(directory);
				} catch (error) {
					warnings.push(`Could not enumerate transcript archives in ${directory}: ${String(error)}`);
					recoverableWarningCount += 1;
					continue;
				}
				for (const archive of archives) {
					if (canonicalArchivePaths.has(path.resolve(archive))) continue;
					try {
						if (migrateTranscriptArchive(archive, { beforeReplace: params.hooks?.beforeArchiveReplace ? () => params.hooks?.beforeArchiveReplace?.(archive) : void 0 })) changes.push(`Migrated archived transcript media in ${archive}.`);
					} catch (error) {
						warnings.push(`Skipped archived transcript media migration for ${archive}: ${String(error)}`);
						recoverableWarningCount += 1;
					}
				}
			}
			params.onPreparedTargets?.(discovery.targets.filter((target) => !recoveries.get(target.path)?.recovered));
		});
	} catch (error) {
		warnings.push(`Agent database maintenance deferred: ${formatErrorMessage(error)}`);
	}
	return {
		changes,
		warnings,
		...recoveredAgentDatabasePaths.size > 0 ? { recoveredAgentDatabasePaths: [...recoveredAgentDatabasePaths] } : {},
		...warnings.length > 0 && warnings.length === recoverableWarningCount ? { warningDisposition: "recoverable" } : warnings.length === recoverableWarningCount + refusedAgentDatabasePaths.length && refusedAgentDatabasePaths.length > 0 ? { refusedAgentDatabasePaths } : {}
	};
}
//#endregion
export { migrateLegacyMediaPersistence as t };
