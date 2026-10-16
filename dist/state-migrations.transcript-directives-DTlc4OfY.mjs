import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { c as resolveSqliteInspectionSignal } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import "./openclaw-state-db-D1jWDzK3.mjs";
import { a as assertNoOpenClawAgentDatabaseLeases, n as OpenClawAgentDatabaseLeaseActiveError, r as assertAgentDatabaseMaintenanceAuthority } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { r as migrateOpenClawAgentDatabaseForMaintenance, t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-CYe8pVkd.mjs";
import { a as resolveAgentDatabaseMigrationTargets } from "./state-migrations.media-persistence-targets-CLRKQZpa.mjs";
import { p as updateSqliteTranscriptEventJsonInTransaction } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { t as withAgentDatabaseMaintenanceLease } from "./openclaw-agent-db-maintenance-lease-Dvppzhox.mjs";
import { t as createMigrationDatabaseHandle } from "./state-migrations.agent-database-Cg7GzujY.mjs";
import { c as parseDirectiveMigrationTranscriptEvent, i as migrateTranscriptDirectiveArchives, l as transformHistoricalTranscriptEvent, n as TRANSCRIPT_DIRECTIVE_MIGRATION_BATCH_SIZE, o as transcriptDirectiveArchiveRecoveryPending, s as transcriptDirectiveArchivesNeedMigration, u as recoverPendingTranscriptArchivePublication } from "./state-migrations.transcript-directives-archives-DmKPfL5O.mjs";
import fs from "node:fs";
//#region src/infra/state-migrations.transcript-directives.ts
const MIGRATION_META_KEY = "historical-transcript-directives-v1";
function parseMigrationCursor(value, pathname) {
	if (!value) return {
		phase: "transcripts",
		sessionId: ""
	};
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch (error) {
		throw new Error(`${pathname} has an invalid historical transcript migration cursor`, { cause: error });
	}
	if (!isRecord(parsed)) throw new Error(`${pathname} has an invalid historical transcript migration cursor`);
	if (parsed.phase === "complete") return { phase: "complete" };
	if (parsed.phase === "transcripts" && typeof parsed.sessionId === "string") return {
		phase: "transcripts",
		sessionId: parsed.sessionId
	};
	if (parsed.phase === "archives" && typeof parsed.sessionId === "string" && typeof parsed.generation === "string") return {
		generation: parsed.generation,
		phase: "archives",
		sessionId: parsed.sessionId
	};
	throw new Error(`${pathname} has an invalid historical transcript migration cursor`);
}
function readMigrationCursor(database, pathname) {
	const db = getNodeSqliteKysely(database);
	return parseMigrationCursor(executeSqliteQueryTakeFirstSync(database, db.selectFrom("schema_meta").select("app_version").where("meta_key", "=", MIGRATION_META_KEY))?.app_version, pathname);
}
function writeMigrationCursor(database, agentId, cursor) {
	const now = Date.now();
	const db = getNodeSqliteKysely(database);
	const row = {
		agent_id: agentId,
		app_version: JSON.stringify(cursor),
		role: "agent",
		schema_version: 1,
		updated_at: now
	};
	executeSqliteQuerySync(database, db.insertInto("schema_meta").values({
		...row,
		created_at: now,
		meta_key: MIGRATION_META_KEY
	}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet(row)));
}
function listTranscriptSessionBatch(database, afterSessionId) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("transcript_events").select("session_id").distinct().where("session_id", ">", afterSessionId).where(transcriptEventJsonSql(database), "like", "%[[%").orderBy("session_id", "asc").limit(TRANSCRIPT_DIRECTIVE_MIGRATION_BATCH_SIZE)).rows.map((row) => row.session_id);
}
function readTranscriptSessionRows(database, sessionId) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("transcript_events").select([transcriptEventJsonSql(database).as("event_json"), "seq"]).where("session_id", "=", sessionId).where(transcriptEventJsonSql(database), "like", "%[[%").orderBy("seq", "asc")).rows;
}
function planTranscriptSession(database, pathname, sessionId) {
	return readTranscriptSessionRows(database, sessionId).map((row) => {
		const event = parseDirectiveMigrationTranscriptEvent(row.event_json, `${pathname}:${sessionId}:${row.seq}`);
		const transformed = transformHistoricalTranscriptEvent(event);
		return {
			eventJson: row.event_json,
			rewrittenEventJson: transformed.changed ? JSON.stringify(transformed.event) : row.event_json,
			seq: row.seq
		};
	});
}
function assertTranscriptSessionSourceUnchanged(database, sessionId, planned) {
	const current = readTranscriptSessionRows(database, sessionId);
	if (current.length !== planned.length || current.some((row, index) => row.seq !== planned[index]?.seq || row.event_json !== planned[index]?.eventJson)) throw new Error(`Transcript source changed before migration commit for ${sessionId}`);
}
function transcriptSessionsNeedMigration(database, pathname, afterSessionId) {
	let cursor = afterSessionId;
	while (true) {
		const sessionIds = listTranscriptSessionBatch(database, cursor);
		if (sessionIds.length === 0) return false;
		for (const sessionId of sessionIds) if (planTranscriptSession(database, pathname, sessionId).some((row) => row.rewrittenEventJson !== row.eventJson)) return true;
		cursor = sessionIds.at(-1) ?? cursor;
	}
}
function hasActiveAgentDatabaseLease(agentId, env) {
	try {
		assertNoOpenClawAgentDatabaseLeases(agentId, { env });
		return false;
	} catch (error) {
		if (error instanceof OpenClawAgentDatabaseLeaseActiveError) return true;
		throw error;
	}
}
async function migrateTranscriptSessions(params) {
	let rewrittenSessions = 0;
	let afterSessionId = params.start.sessionId;
	while (true) {
		const sessionIds = listTranscriptSessionBatch(params.database, afterSessionId);
		if (sessionIds.length === 0) {
			runSqliteImmediateTransactionSync(params.database, () => {
				assertAgentDatabaseMaintenanceAuthority();
				writeMigrationCursor(params.database, params.agentId, {
					generation: "",
					phase: "archives",
					sessionId: ""
				});
				assertAgentDatabaseMaintenanceAuthority();
			}, {
				databaseLabel: params.pathname,
				operationLabel: "historical-transcript-directives.cursor"
			});
			return rewrittenSessions;
		}
		for (const sessionId of sessionIds) {
			const planned = planTranscriptSession(params.database, params.pathname, sessionId);
			const changedRows = planned.filter((row) => row.rewrittenEventJson !== row.eventJson);
			runSqliteImmediateTransactionSync(params.database, () => {
				assertAgentDatabaseMaintenanceAuthority();
				assertTranscriptSessionSourceUnchanged(params.database, sessionId, planned);
				updateSqliteTranscriptEventJsonInTransaction(params.owner, sessionId, changedRows.map((row) => ({
					eventJson: row.rewrittenEventJson,
					seq: row.seq
				})));
				writeMigrationCursor(params.database, params.agentId, {
					phase: "transcripts",
					sessionId
				});
				assertAgentDatabaseMaintenanceAuthority();
			}, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: params.pathname,
				operationLabel: "historical-transcript-directives"
			});
			rewrittenSessions += changedRows.length > 0 ? 1 : 0;
			afterSessionId = sessionId;
		}
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
	}
}
async function migrateAgentDatabase(params, maintenance) {
	await migrateOpenClawAgentDatabaseForMaintenance(params, maintenance);
	maintenance.assertOwned();
	const database = openNodeSqliteDatabase(params.pathname);
	try {
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		assertOpenClawAgentDatabaseForMaintenance(database, params);
		const cursor = readMigrationCursor(database, params.pathname);
		if (cursor.phase === "complete") return {
			archivedTranscripts: 0,
			transcriptSessions: 0,
			warnings: await recoverPendingTranscriptArchivePublication({
				agentId: params.agentId,
				database,
				pathname: params.pathname,
				signal: resolveSqliteInspectionSignal(maintenance.signal)
			})
		};
		const owner = createMigrationDatabaseHandle(database, params.agentId, params.pathname);
		const transcriptSessions = cursor.phase === "transcripts" ? await migrateTranscriptSessions({
			agentId: params.agentId,
			database,
			owner,
			pathname: params.pathname,
			start: cursor
		}) : 0;
		const archiveCursor = readMigrationCursor(database, params.pathname);
		const archives = archiveCursor.phase === "archives" ? await migrateTranscriptDirectiveArchives({
			agentId: params.agentId,
			database,
			pathname: params.pathname,
			signal: maintenance.signal,
			start: archiveCursor,
			writeCursor: (next) => writeMigrationCursor(database, params.agentId, "phase" in next ? next : {
				...next,
				phase: "archives"
			})
		}) : {
			rewrittenArchives: 0,
			warnings: []
		};
		return {
			archivedTranscripts: archives.rewrittenArchives,
			transcriptSessions,
			warnings: archives.warnings
		};
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(database);
		database.close();
	}
}
async function agentDatabaseNeedsTranscriptDirectiveMigration(params) {
	const database = openNodeSqliteDatabase(params.pathname, { readOnly: true });
	try {
		if (Number(database.prepare("PRAGMA user_version").get()?.user_version ?? 0) !== 24) return true;
		try {
			assertOpenClawAgentDatabaseForMaintenance(database, params);
		} catch {
			return true;
		}
		const cursor = readMigrationCursor(database, params.pathname);
		if (cursor.phase === "complete") return transcriptDirectiveArchiveRecoveryPending(database);
		if (cursor.phase === "transcripts" && transcriptSessionsNeedMigration(database, params.pathname, cursor.sessionId)) return true;
		if (await transcriptDirectiveArchivesNeedMigration(database, cursor.phase === "archives" ? {
			generation: cursor.generation,
			sessionId: cursor.sessionId
		} : {
			generation: "",
			sessionId: ""
		})) return true;
		return !hasActiveAgentDatabaseLease(params.agentId, params.env);
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(database);
		database.close();
	}
}
/** Doctor normalization of historical inline assistant directives into typed delivery facts. */
async function migrateHistoricalTranscriptDirectives(params = {}) {
	const signal = resolveSqliteInspectionSignal();
	signal?.throwIfAborted();
	const env = params.env ?? process.env;
	const changes = [];
	const warnings = [];
	let recoverableWarningCount = 0;
	try {
		const discovery = params.preparedTargets ? {
			targets: params.preparedTargets,
			recoverableWarningCount: 0
		} : resolveAgentDatabaseMigrationTargets({
			changes,
			configuredAgentDatabaseTargets: params.configuredAgentDatabaseTargets ?? [],
			env,
			warnings,
			preparedDiscovery: params.preparedDiscovery
		});
		recoverableWarningCount = discovery.recoverableWarningCount;
		const targets = [];
		for (const target of discovery.targets) try {
			assertMigrationTargetPathCurrent(target);
			if (await agentDatabaseNeedsTranscriptDirectiveMigration({
				agentId: target.agentId,
				env,
				pathname: target.path
			})) targets.push(target);
		} catch (error) {
			if (signal?.aborted && error === signal.reason) throw error;
			warnings.push(`Skipped historical transcript directive migration preflight for ${target.path}: ${String(error)}`);
		}
		if (targets.length > 0) await withAgentDatabaseMaintenanceLease({ env }, async (maintenance) => {
			for (const target of targets.toSorted((a, b) => a.agentId.localeCompare(b.agentId) || a.path.localeCompare(b.path))) try {
				assertMigrationTargetPathCurrent(target);
				const result = await migrateAgentDatabase({
					agentId: target.agentId,
					pathname: target.path
				}, maintenance);
				warnings.push(...result.warnings);
				recoverableWarningCount += result.warnings.length;
				if (result.transcriptSessions > 0 || result.archivedTranscripts > 0) changes.push(`Migrated historical transcript directives in ${target.path}: ${result.transcriptSessions} active session(s), ${result.archivedTranscripts} archived transcript(s).`);
			} catch (error) {
				if (signal?.aborted && error === signal.reason) throw error;
				warnings.push(`Skipped historical transcript directive migration for ${target.path}: ${String(error)}`);
			}
		});
	} catch (error) {
		if (signal?.aborted && error === signal.reason) throw error;
		warnings.push(`Skipped historical transcript directive migration: ${String(error)}`);
	}
	return {
		changes,
		warnings,
		...warnings.length > 0 && warnings.length === recoverableWarningCount ? { warningDisposition: "recoverable" } : {}
	};
}
function assertMigrationTargetPathCurrent(target) {
	if (fs.realpathSync.native(target.path) !== target.realPath) throw new Error(`Agent database path changed since migration discovery: ${target.path}`);
}
//#endregion
export { migrateHistoricalTranscriptDirectives };
