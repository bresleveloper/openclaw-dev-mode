import { r as resolveRealpathOrAbsolute } from "./boundary-path-BzetEUdq.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as iterateSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { o as getCanonicalSqliteNamedIndexContracts } from "./sqlite-schema-contract-BFcZzasN.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-eRv24eIu.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { a as isPrimarySessionTranscriptFileName, m as resolveTrajectoryPointerPath, p as resolveTrajectoryPath } from "./artifacts-C9weQ_MG.mjs";
import { s as resolveSessionFilePathCore } from "./paths-CcMbq5NY.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import { a as readDeferredPluginMigrations, c as withDeferredPluginMigrationsCurrent, t as DeferredPluginMigrationConflictError } from "./deferred-plugin-migrations-DZuh_dkr.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { i as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-board-schema-vd3Vff_q.mjs";
import { v as inspectSqliteRecoveryFiles, y as moveSqliteFilesAside } from "./agent-database-admission-BFwcs62N.mjs";
import { m as ensureOpenClawAgentDatabasePermissions, r as migrateOpenClawAgentDatabaseForMaintenance, t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import { u as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation } from "./openclaw-agent-db-lease-DexIwF6s.mjs";
import { a as closeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { c as isOpenClawAgentDatabaseOpen, f as runOpenClawAgentWriteTransaction, h as withAgentDatabaseMaintenanceLease, n as clearOpenClawAgentDatabaseOpenFailure } from "./openclaw-agent-db-CaQAStOA.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-qsg5dB6v.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, i as formatSqliteSessionReferenceForScope, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { u as reconcileSessionTranscriptIndexInTransaction } from "./session-transcript-index-UaRlRUAw.mjs";
import { t as normalizePersistedSessionEntryShape } from "./store-entry-shape-CWorLqwJ.mjs";
import { a as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-CtMz7hDz.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, i as resolveAllAgentSessionStoreCandidateTargetsSync, l as resolveSessionStoreTargets, r as resolveAgentSessionStoreTargetsSync, s as resolveConfiguredAgentDatabaseTargets } from "./targets-Dmb8-YXN.mjs";
import { f as writeSessionEntry, ft as recordLegacyAcpMigrationSources, gt as prepareLegacyAcpMigrationSource, z as invalidateSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { t as advanceTranscriptMutationAtInTransaction, u as touchTranscriptMutationInTransaction } from "./session-accessor.sqlite-transcript-state-BGrlGphn.mjs";
import { n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-CV9Iu45w.mjs";
import { n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-B4Sq8ywF.mjs";
import { i as readExactSessionEntryRowForCanonicalRepair } from "./session-accessor.sqlite-canonical-repair-S6cGla1Q.mjs";
import { C as readMigrationArtifactIdentity, S as moveMigrationArtifact, T as statMigrationPath, a as createSessionSqliteMigrationRun, h as resolveSessionSqliteMigrationRunsDir, i as canonicalMigrationFilePath, m as recordPlannedMigrationMoves, n as assertSafeSessionSqliteMigrationDirectory, p as recordCompletedMigrationMoves, r as assertSafeSessionSqliteMigrationMove, s as findLatestFailedSessionSqliteMigrationManifest, t as HISTORICAL_IMPORT_REASON, v as updateMigrationManifestTarget, w as sameMigrationArtifact, y as writeSessionSqliteMigrationManifest } from "./doctor-session-sqlite-migration-run-Dta_SQ4O.mjs";
import { a as isRetainedSourceIssue, i as isInformationalMissingSessionIndex, n as createDoctorSessionSqliteTargetReport, r as createDoctorSessionSqliteTotals, s as sumDoctorSessionSqliteTargets, t as countBlockingSessionSqliteIssues } from "./doctor-session-sqlite-types-Hd3T2UXj.mjs";
import { n as assertDoctorSqliteMaintenancePathsNotAliased, r as isDestructiveDoctorSessionSqliteMode } from "./doctor-sqlite-maintenance-lock-7TRGuHpb.mjs";
import { a as gatherLegacyArchiveCoverage, c as readLegacySessionRecords, d as reconcileSessionSqliteMigrationPublications, f as restoreSessionSqliteMigrationRun, i as discoverLegacyHistoricalTranscripts, l as collectRecoveryInventory, n as settleDuplicateSessionSqliteArchives, o as listUnreferencedJsonlFiles, p as restoreSessionSqliteMigrationRuns, r as collectHistoricalArchiveSources, s as readArchivedSessionOwnership } from "./doctor-session-sqlite-retirement-DXgiu9qG.mjs";
import { c as isLegacySessionRecordOwnedByTarget, f as shouldFilterLegacySessionRecordsByTarget, i as withSqliteSessionImportStage, l as listLegacySessionTranscriptFiles, n as verifyCanonicalSessionTranscriptSources } from "./doctor-session-sqlite-verification-DCoyJ1F8.mjs";
import { a as readLegacyPrimaryTranscriptIdentity, c as readSqliteEntryCount, d as resolveTargetSqlitePath, f as scanReadOnlySqliteActiveTranscriptFiles, l as readTranscriptFingerprint, n as createTranscriptEventReader, o as readOnlySqliteDbStats, s as readOnlySqliteValidationSnapshot, t as countTranscriptEventsForPath, u as resolveTargetSqliteOptions } from "./doctor-session-sqlite-readers-un_PyUoF.mjs";
import { a as prepareSessionSourceVerification, c as rebuildDeferredPluginSessionSourceIndex, l as recordDeferredPluginSessionImport, n as deferredPluginSessionStoreIds, r as hasDeferredPluginSessionImport, s as readDeferredPluginSessionImport, t as captureDeferredPluginSessionSources, u as resolveVerifiedSessionSource } from "./deferred-plugin-session-sources-BLTN7DHz.mjs";
import { n as compactDoctorSqliteFile } from "./doctor-sqlite-compact-B5LqMTFV.mjs";
import { i as writeSessionSqliteMigrationFailureReports, r as createSessionSqliteMigrationFailureIssue } from "./doctor-session-sqlite-failure-BVdzdpCW.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import os from "node:os";
import { setImmediate } from "node:timers/promises";
//#region src/config/sessions/session-accessor.sqlite-import.ts
function resolveSqliteSessionImport(params) {
	const resolvedScope = resolveSqliteScope(params);
	return {
		params,
		resolved: params.preserveExactStoredKey ? {
			...resolvedScope,
			sessionKey: params.sessionKey
		} : resolvedScope
	};
}
function importSqliteSessionRowsInTransaction(database, prepared, stage, source, repair) {
	const { params, resolved } = prepared;
	let transcriptEvents = 0;
	const currentEntry = readExactSessionEntryRowForCanonicalRepair(database, resolved.sessionKey, { allowMalformedRowRepair: params.allowMalformedRowRepair === true })?.entry;
	if (params.skipIfExists === true && currentEntry) return {
		sessionId: params.entry.sessionId,
		sessionKey: resolved.sessionKey,
		skippedExisting: true,
		transcriptEvents
	};
	assertSessionTranscriptHot(database.db, params.entry.sessionId);
	const preservedHarnessId = params.entry.agentHarnessId === void 0 && currentEntry?.sessionId === params.entry.sessionId && currentEntry.lifecycleRevision === params.entry.lifecycleRevision ? currentEntry.agentHarnessId?.trim() : void 0;
	const importedEntry = {
		...params.entry,
		...preservedHarnessId ? { agentHarnessId: preservedHarnessId } : {},
		sessionFile: formatSqliteSessionReferenceForScope({
			...resolved,
			sessionId: params.entry.sessionId
		})
	};
	let preserveHistoricalNode = false;
	if (params.historicalOnly) {
		const db = getSessionKysely(database.db);
		const owner = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", params.entry.sessionId))?.session_key;
		if (owner && owner !== resolved.sessionKey) throw new Error(`Historical transcript ${params.entry.sessionId} already belongs to ${owner}`);
		preserveHistoricalNode = Boolean(executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select("session_key").where("session_key", "=", resolved.sessionKey)));
	}
	if (!preserveHistoricalNode) {
		invalidateSessionEntryMaintenanceAgeFact(database.db);
		writeSessionEntry(database, resolved.sessionKey, importedEntry, {
			allowStoredAliases: true,
			previousEntry: currentEntry ?? null
		});
		if (params.legacyAcpMigrationSource) recordLegacyAcpMigrationSources(database.db, resolved.sessionKey, [params.legacyAcpMigrationSource]);
	}
	if (params.readTranscriptEvents) {
		const transcriptScope = {
			...resolved,
			sessionId: params.entry.sessionId
		};
		stage.resetSeen();
		for (const row of iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", params.entry.sessionId))) stage.addSeen(row.event_json);
		transcriptEvents = appendTranscriptEventsInTransaction(database, transcriptScope, stage.iterateUnseenEvents(source), {
			allowStoredAlias: true,
			scheduleProjectionReconcile: false,
			touchMutation: false
		});
		reconcileSessionTranscriptIndexInTransaction(database.db, params.entry.sessionId);
		publishSessionEntryCacheInvalidation(database, { sessionKey: resolved.sessionKey });
	}
	if (params.transcriptMtimeMs !== void 0) advanceTranscriptMutationAtInTransaction(database, params.entry.sessionId, params.transcriptMtimeMs);
	else if (transcriptEvents > 0) touchTranscriptMutationInTransaction(database, params.entry.sessionId);
	return {
		sessionId: params.entry.sessionId,
		sessionKey: resolved.sessionKey,
		transcriptEvents,
		...repair ? { recovery: {
			complete: repair.recognized && stage.complete,
			repaired: repair.repaired,
			events: repair.events
		} } : {}
	};
}
/** Imports legacy session rows that share one SQLite store in one durable transaction. */
async function importSqliteSessionRowsBatch(params) {
	if (params.length === 0) return [];
	const prepared = params.map(resolveSqliteSessionImport);
	const resolved = prepared[0].resolved;
	const databasePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved));
	if (prepared.some((row) => resolveOpenClawAgentSqlitePath(toDatabaseOptions(row.resolved)) !== databasePath)) throw new Error("SQLite session import batch spans multiple stores");
	return await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionImportStage((stage) => {
		const validators = [];
		const repairs = /* @__PURE__ */ new Map();
		for (const [source, { params: importParams }] of prepared.entries()) {
			let seq = 0;
			const validate = importParams.readTranscriptEvents?.((event) => stage.append(source, seq++, JSON.stringify(event)));
			if (validate) validators.push(validate);
			if (importParams.repairLegacyTranscript && importParams.readTranscriptEvents) repairs.set(source, stage.repairLegacyTranscript(source));
		}
		for (const validate of validators) validate();
		for (const { params: importParams } of prepared) importParams.beforePersistentApply?.();
		return runOpenClawAgentWriteTransaction((database) => prepared.map((row, source) => importSqliteSessionRowsInTransaction(database, row, stage, source, repairs.get(source))), toDatabaseOptions(resolved));
	}), "session.import.batch");
}
//#endregion
//#region src/commands/doctor-session-sqlite-compact.ts
/** Runs doctor-owned SQLite file compaction for migrated session stores. */
/** Reclaim free pages from one agent session SQLite database. */
async function compactDoctorSessionSqliteTarget(target, options = {}) {
	const databaseOptions = resolveTargetSqliteOptions(target, options.env);
	const sqlitePath = resolveOpenClawAgentSqlitePath(databaseOptions);
	const beforeFileSizes = readSqliteFileSizes(sqlitePath);
	const stat = readSessionDatabaseStat(sqlitePath);
	if (!stat) return {
		dbSizeAfterBytes: 0,
		dbSizeBeforeBytes: 0,
		freelistAfterPages: 0,
		freelistBeforePages: 0,
		pageSizeBytes: 0,
		reclaimedBytes: 0,
		skipped: true,
		walSizeAfterBytes: beforeFileSizes.walSizeBytes,
		walSizeBeforeBytes: beforeFileSizes.walSizeBytes
	};
	if (!stat.isFile()) throw new Error(`OpenClaw agent database is not a regular file: ${sqlitePath}`);
	if (isOpenClawAgentDatabaseOpen(sqlitePath)) throw new Error(`OpenClaw agent database ${sqlitePath} is already open in this process. Stop OpenClaw and retry.`);
	const requireQuarantineCleared = () => {
		if (!clearOpenClawAgentDatabaseOpenFailure(sqlitePath, { env: options.env })) throw new Error(`OpenClaw agent database ${sqlitePath} was repaired, but its persisted quarantine record could not be cleared. Rerun openclaw doctor --fix so the database is not refused again.`);
	};
	const compactTarget = () => {
		invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(sqlitePath, databaseOptions.env);
		const compact = compactDoctorSqliteFile({
			operation: options.operation,
			afterSuccess: () => {
				requireQuarantineCleared();
				ensureOpenClawAgentDatabasePermissions(sqlitePath, databaseOptions);
			},
			sqlitePath,
			validateBeforeMutation: (database) => assertOpenClawAgentDatabaseForMaintenance(database, {
				agentId: databaseOptions.agentId,
				pathname: sqlitePath
			})
		});
		return {
			dbSizeAfterBytes: compact.after.dbSizeBytes,
			dbSizeBeforeBytes: compact.before.dbSizeBytes,
			freelistAfterPages: compact.after.freelistPages,
			freelistBeforePages: compact.before.freelistPages,
			pageSizeBytes: compact.before.pageSizeBytes || compact.after.pageSizeBytes,
			reclaimedBytes: compact.reclaimedBytes,
			skipped: false,
			walSizeAfterBytes: compact.after.walSizeBytes,
			walSizeBeforeBytes: compact.before.walSizeBytes
		};
	};
	return options.operation === "import-finalize" ? withAgentDatabaseMaintenanceLease({ env: databaseOptions.env }, async (maintenance) => {
		await migrateOpenClawAgentDatabaseForMaintenance({
			agentId: databaseOptions.agentId,
			pathname: sqlitePath
		}, maintenance);
		maintenance.assertOwned();
		requireQuarantineCleared();
		return compactTarget();
	}) : compactTarget();
}
function readSessionDatabaseStat(sqlitePath) {
	try {
		return fs.lstatSync(sqlitePath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readSqliteFileSizes(sqlitePath) {
	return {
		dbSizeBytes: fileSize(sqlitePath),
		walSizeBytes: fileSize(`${sqlitePath}-wal`)
	};
}
function fileSize(filePath) {
	try {
		return fs.statSync(filePath).size;
	} catch {
		return 0;
	}
}
//#endregion
//#region src/commands/doctor-session-sqlite-diagnostics.ts
function countLegacyTranscript(record, report) {
	const result = countTranscriptEventsForPath(record.transcriptPath);
	if (result.status === "missing") {
		report.issues.push({
			code: "transcript_missing",
			message: `Transcript file is missing: ${record.transcriptPath}`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (result.status === "malformed") {
		report.issues.push({
			code: "transcript_malformed",
			message: result.message,
			sessionKey: record.sessionKey
		});
		return;
	}
	report.validatedEntries += 1;
	report.validatedTranscriptEvents += result.events;
}
function appendRetainedPluginSessionSourceIssue(report, pluginIds) {
	const pending = pluginIds.length ? `remain pending for plugin(s): ${pluginIds.join(", ")}. Install the plugin and run openclaw doctor --fix to finish.` : "await archival. Run openclaw doctor --fix to finish.";
	report.issues.push({
		code: "plugin_migration_source_retained",
		message: `Canonical session import is verified. Original session migration inputs, including unindexed history, ${pending}`
	});
}
function appendActiveSqliteTranscriptFileIssues(target, report, retainedPaths) {
	try {
		for (const { sessionKey, transcriptPath } of readActiveSqliteTranscriptFiles(target)) if (!retainedPaths?.has(canonicalMigrationFilePath(transcriptPath))) report.issues.push({
			code: "active_sqlite_transcript_jsonl",
			message: `SQLite-backed session has a legacy JSONL transcript awaiting verification: ${transcriptPath}. Run openclaw doctor --fix or openclaw doctor --session-sqlite recover with the Gateway stopped to verify, import any missing events, and archive the original.`,
			sessionKey
		});
	} catch (error) {
		report.issues.push({
			code: "sqlite_active_transcript_scan_failed",
			message: `Could not scan SQLite-backed sessions for active JSONL transcript files: ${String(error)}`
		});
	}
}
function readActiveSqliteTranscriptFiles(target) {
	const sources = [];
	const result = scanReadOnlySqliteActiveTranscriptFiles(target, (sessionKey, sessionId, sessionFile) => {
		const transcriptPath = resolveActiveSqliteTranscriptFile(target, {
			...sessionFile ? { sessionFile } : {},
			sessionId
		});
		if (transcriptPath) sources.push({
			sessionKey,
			sessionId,
			transcriptPath
		});
	});
	if (!result.ok) throw result.error;
	return sources;
}
function appendSqliteDbStats(target, report) {
	const result = readOnlySqliteDbStats(target);
	if (!result.ok) {
		report.issues.push({
			code: "sqlite_corrupt",
			message: `SQLite database could not be inspected: ${String(result.error)}`
		});
		return;
	}
	report.dbStats = result.stats;
	if (result.stats.integrityCheck && result.stats.integrityCheck !== "ok") report.issues.push({
		code: "sqlite_integrity_check_failed",
		message: `SQLite quick_check reported: ${result.stats.integrityCheck}`
	});
}
async function compactSqliteDatabase(target, report, options = {}) {
	try {
		if (options.operation === "import-finalize") closeOpenClawAgentDatabaseByPath(resolveTargetSqlitePath(target));
		report.compact = await compactDoctorSessionSqliteTarget(target, options);
	} catch (err) {
		report.issues.push({
			code: "sqlite_compact_failed",
			message: `SQLite database compact failed: ${formatErrorMessage(err)}`
		});
	}
}
function resolveActiveSqliteTranscriptFile(target, entry) {
	let transcriptPath;
	try {
		transcriptPath = resolveSessionFilePathCore(entry.sessionId, entry, {
			agentId: target.agentId,
			sessionsDir: path.dirname(target.storePath)
		});
	} catch {
		return;
	}
	if (!transcriptPath.endsWith(".jsonl")) return;
	let stat;
	try {
		stat = fs.statSync(transcriptPath);
	} catch {
		return;
	}
	if (!stat.isFile()) return;
	const sessionsDir = resolveRealpathOrAbsolute(path.dirname(target.storePath));
	const activePath = resolveRealpathOrAbsolute(transcriptPath);
	if (path.dirname(activePath) !== sessionsDir) return;
	return activePath;
}
function summarizeDoctorSessionSqliteReport(mode, targets, activeRun) {
	const sum = (value) => sumDoctorSessionSqliteTargets(targets, value);
	const archives = (paths) => new Set(targets.flatMap(paths)).size;
	return {
		...activeRun ? { migrationRun: {
			...activeRun.manifest.failureReports ? {
				failureReportJsonPath: activeRun.manifest.failureReports.jsonPath,
				failureReportMarkdownPath: activeRun.manifest.failureReports.markdownPath
			} : {},
			manifestPath: activeRun.manifestPath,
			runId: activeRun.manifest.runId
		} } : {},
		mode,
		targets,
		totals: createDoctorSessionSqliteTotals(targets, {
			archivedLegacyStoreFiles: archives((target) => target.archivedLegacyStoreFiles ?? []),
			archivedTranscriptFiles: archives((target) => target.archivedTranscriptFiles),
			archivedUnreferencedJsonlFiles: archives((target) => target.archivedUnreferencedJsonlFiles),
			importedEntries: sum((target) => target.importedEntries),
			importedTranscriptEvents: sum((target) => target.importedTranscriptEvents),
			legacyEntries: sum((target) => target.legacyEntries),
			reclaimedBytes: sum((target) => target.compact?.reclaimedBytes ?? 0),
			unreferencedJsonlFiles: sum((target) => target.unreferencedJsonlFiles.length),
			validatedEntries: sum((target) => target.validatedEntries),
			validatedTranscriptEvents: sum((target) => target.validatedTranscriptEvents)
		})
	};
}
//#endregion
//#region src/commands/doctor-session-sqlite-active.ts
/** Old imports can leave active originals outside a later plugin receipt. Never replay their index. */
async function prepareActiveSqliteTranscriptSettlement(params) {
	const records = [];
	const target = {
		...params.target,
		sqlitePath: resolveTargetSqlitePath(params.target, params.env)
	};
	let sourcesToSettle;
	try {
		sourcesToSettle = readActiveSqliteTranscriptFiles(target);
	} catch (error) {
		params.report.issues.push({
			code: "sqlite_active_transcript_scan_failed",
			message: formatErrorMessage(error)
		});
		return records;
	}
	for (const source of sourcesToSettle) {
		if (params.excludedPaths.has(canonicalMigrationFilePath(source.transcriptPath))) continue;
		try {
			const fingerprint = readTranscriptFingerprint(source.transcriptPath);
			readMigrationArtifactIdentity(source.transcriptPath, 1n, fingerprint);
			const primary = readLegacyPrimaryTranscriptIdentity(source.transcriptPath, source.transcriptPath, void 0, true);
			if (!primary) continue;
			if (primary.sessionId !== source.sessionId) throw new Error("Legacy transcript has no matching primary session identity");
			const sources = [{
				path: source.transcriptPath,
				sessionId: source.sessionId
			}];
			const verify = () => verifyCanonicalSessionTranscriptSources({
				target,
				sources,
				env: params.env
			});
			let verified = verify();
			if (!verified) {
				if (!verifyCanonicalSessionTranscriptSources({
					target,
					sources,
					env: params.env,
					allowMissingSuffix: true
				})) throw new Error("Missing history is not an appendable suffix or conflicts with an existing event identity");
				const [imported] = await importSqliteSessionRowsBatch([{
					agentId: target.agentId,
					storePath: target.sqlitePath,
					env: params.env,
					sessionKey: source.sessionKey,
					entry: {
						sessionId: source.sessionId,
						updatedAt: 0
					},
					historicalOnly: true,
					preserveExactStoredKey: true,
					readTranscriptEvents: createTranscriptEventReader(source.transcriptPath, source.sessionId, false, fingerprint)
				}]);
				params.report.importedTranscriptEvents += imported.transcriptEvents;
				verified = verify();
			}
			if (!verified) throw new Error("The original transcript order and content could not be verified in SQLite");
			readMigrationArtifactIdentity(source.transcriptPath, 1n, fingerprint);
			params.report.validatedEntries += 1;
			params.report.validatedTranscriptEvents += verified.events;
			records.push({
				sessionKey: source.sessionKey,
				entry: {
					sessionId: source.sessionId,
					updatedAt: 0
				},
				transcriptPath: source.transcriptPath,
				transcriptDependencies: [source.transcriptPath],
				sourceFingerprint: fingerprint,
				recovery: {
					complete: true,
					repaired: false,
					events: verified.events
				}
			});
		} catch (error) {
			params.report.issues.push({
				code: "active_sqlite_transcript_verification_failed",
				sessionKey: source.sessionKey,
				message: `${source.transcriptPath}: ${formatErrorMessage(error)}. Original retained; inspect the named transcript before retrying Doctor.`
			});
		}
	}
	return records;
}
//#endregion
//#region src/commands/doctor-session-sqlite-archive.ts
/** Plans Doctor archive paths; publication and receipts remain with the migration owner. */
function planImportedTranscriptArtifactsToArchive(target, sessionKey, transcriptPath, reservedArchivePaths, capturedSources) {
	const moves = [];
	const addMove = (sourcePathRaw, kind) => {
		if (capturedSources && !capturedSources.has(canonicalMigrationFilePath(sourcePathRaw))) return;
		const move = planSessionJsonlArchiveMove({
			archiveKey: sessionKey,
			baseNameRaw: path.basename(sourcePathRaw),
			kind,
			reservedArchivePaths,
			sessionKey,
			sourcePathRaw,
			target
		});
		reservedArchivePaths.add(move.archivePath);
		moves.push(move);
	};
	addMove(transcriptPath, "transcript");
	const trajectoryPath = resolveTrajectoryPath(transcriptPath);
	if (trajectoryPath && fs.existsSync(trajectoryPath)) addMove(trajectoryPath, "trajectory");
	const trajectoryPointerPath = resolveTrajectoryPointerPath(transcriptPath);
	if (trajectoryPointerPath && fs.existsSync(trajectoryPointerPath)) addMove(trajectoryPointerPath, "trajectory");
	return moves;
}
function planSessionJsonlArchiveMove(params) {
	const sourcePathRaw = path.resolve(params.sourcePathRaw);
	if (!fs.lstatSync(sourcePathRaw).isFile()) throw new Error("source is not a regular file");
	const sourcePath = path.join(canonicalFilePath(path.dirname(sourcePathRaw)), path.basename(sourcePathRaw));
	const sessionsDir = canonicalFilePath(path.dirname(path.resolve(params.target.storePath)));
	if (path.dirname(sourcePath) !== sessionsDir) throw new Error(`Migration source is outside the target sessions directory: ${sourcePath}`);
	const archiveDir = resolveImportedTranscriptArchiveDir(params.target.storePath);
	assertSafeSessionSqliteMigrationDirectory(archiveDir);
	fs.mkdirSync(archiveDir, { recursive: true });
	assertSafeSessionSqliteMigrationDirectory(archiveDir);
	const baseName = params.baseNameRaw.replace(/[^A-Za-z0-9_.-]+/g, "_").slice(0, 160) || "artifact";
	const keySlug = params.archiveKey.replace(/[^A-Za-z0-9_.-]+/g, "_").slice(0, 120) || "session";
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const suffix = attempt === 0 ? "" : `.${attempt}`;
		const archivePath = path.join(archiveDir, `${keySlug}.${baseName}.imported-${Date.now()}${suffix}`);
		if (fs.existsSync(archivePath) || params.reservedArchivePaths?.has(archivePath)) continue;
		return {
			archivePath,
			kind: params.kind,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			sourcePath
		};
	}
	throw new Error(`Could not archive ${baseName} for ${params.archiveKey}`);
}
function resolveImportedTranscriptArchiveDir(storePath) {
	const storeDir = canonicalFilePath(path.dirname(path.resolve(storePath)));
	return path.join(path.dirname(storeDir), "session-sqlite-import-archive");
}
function canonicalFilePath(filePath) {
	try {
		return fs.realpathSync.native(filePath);
	} catch {
		return path.resolve(filePath);
	}
}
//#endregion
//#region src/commands/doctor-session-sqlite-missing-index.ts
/** Missing index receipts describe history; only unimported transcript content requires action. */
function createMissingSessionIndexVerifier(params) {
	let inventory;
	return (target) => {
		if (target.issues.length > 0) return false;
		try {
			if (statMigrationPath(target.storePath)) return false;
			inventory ??= collectRecoveryInventory(params);
			const missingIndexes = [...inventory.references.values()].filter((refs) => refs.every((ref) => ref.trusted && !ref.consumedByRestore && ref.target.agentId === target.agentId && ref.target.storePath === target.storePath && ref.target.sqlitePath === target.sqlitePath && ref.move.kind === "legacy-store" && ref.move.artifact?.classification === "protected" && ref.move.artifact.reason === "incomplete-index-import" && ref.move.artifact.disposal.state === "retained" && !statMigrationPath(ref.move.sourcePath) && !statMigrationPath(ref.move.archivePath)));
			if (missingIndexes.length === 0) return false;
			const snapshot = readOnlySqliteValidationSnapshot(target);
			const stats = readOnlySqliteDbStats(target);
			if (!snapshot.ok || !stats.ok || stats.stats.integrityCheck !== "ok") return false;
			const sources = listLegacySessionTranscriptFiles(path.dirname(target.storePath)).map((sourcePath) => {
				readMigrationArtifactIdentity(sourcePath);
				const primary = readLegacyPrimaryTranscriptIdentity(sourcePath, sourcePath);
				if (!primary || !snapshot.snapshot.sessionKeysBySessionId.has(primary.sessionId)) throw new Error("Legacy transcript has no verified canonical owner");
				return {
					path: sourcePath,
					sessionId: primary.sessionId
				};
			});
			const sourcePaths = new Set(sources.map((source) => source.path));
			const dependenciesPresent = missingIndexes.every((refs) => refs.every((ref) => ref.move.artifact.dependencies.every((dependency) => !isPrimarySessionTranscriptFileName(path.basename(dependency)) || sourcePaths.has(dependency))));
			if (sources.length === 0 || !dependenciesPresent) return false;
			const verified = verifyCanonicalSessionTranscriptSources({
				target,
				sources,
				env: params.env
			});
			if (!verified) return false;
			target.validatedEntries = verified.entries;
			target.validatedTranscriptEvents = verified.events;
			target.issues.push({
				code: "legacy_index_informational",
				message: `${target.storePath}: Canonical SQLite transcripts are complete. The legacy index source and archive are missing; legacy index entries are informational. No import is needed.`
			});
			return true;
		} catch {
			return false;
		}
	};
}
//#endregion
//#region src/commands/doctor-session-sqlite-recover-report.ts
/** Builds doctor reports for session SQLite migration recovery mode. */
const CANONICAL_AGENT_INDEX_NAMES = getCanonicalSqliteNamedIndexContracts(OPENCLAW_AGENT_SCHEMA_SQL).map((index) => index.name);
/** Restores the latest failed migration run and validates only selected manifest targets. */
async function recoverDoctorSessionSqliteTargets(params) {
	const trustedTargets = resolveRecoverTargets(params.targets, params.env);
	const failedRun = findLatestFailedSessionSqliteMigrationManifest(params.env, trustedTargets);
	if (!failedRun) {
		const recoveredCorruptTargets = await withAgentDatabaseMaintenanceLease({ env: params.env }, (maintenance) => recoverCorruptSqliteTargets(params.targets, params.env, maintenance));
		const retainedReports = [...recoveredCorruptTargets];
		for (const target of trustedTargets) {
			if (recoveredCorruptTargets.some((report) => report.sqlitePath === target.sqlitePath)) continue;
			try {
				if (hasDeferredPluginSessionImport({
					target,
					sqlitePath: target.sqlitePath,
					env: params.env
				}) || readActiveSqliteTranscriptFiles(target).length > 0 || params.historicalArchiveStores?.has(target.storePath)) retainedReports.push(await params.validateTarget(target));
			} catch (error) {
				retainedReports.push(createRecoverInspectionFailureTargetReport(target, target.sqlitePath, error));
			}
		}
		if (retainedReports.length > 0) return summarizeRecoverReport(retainedReports);
		return summarizeRecoverReport([createSyntheticRecoverTargetReport(params.env, "No failed session SQLite migration manifest found.")]);
	}
	const restore = await restoreSessionSqliteMigrationRun({
		env: params.env,
		manifestPath: failedRun.manifestPath,
		trustedTargets
	});
	const targetReports = [];
	const recoveryTargets = trustedTargets.filter((target) => failedRun.targets.some((failed) => failed.agentId === target.agentId && failed.storePath === target.storePath) || params.historicalArchiveStores?.has(target.storePath));
	for (const manifestTarget of recoveryTargets) targetReports.push(await params.validateTarget({
		agentId: manifestTarget.agentId,
		sqlitePath: manifestTarget.sqlitePath,
		storePath: manifestTarget.storePath
	}));
	const reportTarget = targetReports[0] ?? createSyntheticRecoverTargetReport(params.env, failedRun.manifestPath);
	reportTarget.restore = restore;
	reportTarget.issues.push(...restore.conflicts.map((conflict) => ({
		code: "restore_conflict",
		message: `${conflict.sourcePath}: ${conflict.reason}`
	})));
	const report = summarizeRecoverReport(targetReports.length > 0 ? targetReports : [reportTarget]);
	if (report.totals.issues === 0) {
		report.migrationRun = {
			manifestPath: failedRun.manifestPath,
			runId: failedRun.manifest.runId
		};
		return report;
	}
	const failureReports = writeSessionSqliteMigrationFailureReports(failedRun.manifestPath, {
		reason: "doctor recover completed with remaining issues",
		recoveryTargets: report.targets,
		trustedTargets
	});
	report.migrationRun = {
		failureReportJsonPath: failureReports.jsonPath,
		failureReportMarkdownPath: failureReports.markdownPath,
		manifestPath: failedRun.manifestPath,
		runId: failedRun.manifest.runId
	};
	report.supportIssue = createSessionSqliteMigrationFailureIssue(failedRun.manifestPath, trustedTargets);
	return report;
}
async function recoverCorruptSqliteTargets(targets, env, maintenance) {
	const reports = [];
	for (const target of targets) {
		maintenance.assertOwned();
		const databaseOptions = resolveTargetSqliteOptions(target, env);
		const sqlitePath = resolveOpenClawAgentSqlitePath(databaseOptions);
		let recoveryFiles;
		try {
			recoveryFiles = inspectSqliteRecoveryFiles(sqlitePath);
		} catch (error) {
			reports.push(createRecoverInspectionFailureTargetReport(target, sqlitePath, error));
			continue;
		}
		if (recoveryFiles.existing.length === 0) continue;
		if (!recoveryFiles.existing.includes(sqlitePath)) {
			reports.push(recoverCorruptSqliteTarget(target, sqlitePath, /* @__PURE__ */ new Error(`SQLite sidecars exist without their main database: ${sqlitePath}`), () => maintenance.assertOwned()));
			continue;
		}
		const inspection = inspectSqliteForRecovery(sqlitePath, recoveryFiles.existing);
		if (inspection.ok) continue;
		if (!isSqliteCorruptionError(inspection.error)) {
			reports.push(createRecoverInspectionFailureTargetReport(target, sqlitePath, inspection.error));
			continue;
		}
		if (!isCanonicalAgentIndexCorruptionError(inspection.error)) {
			reports.push(recoverCorruptSqliteTarget(target, sqlitePath, inspection.error, () => maintenance.assertOwned()));
			continue;
		}
		const repair = await repairCanonicalIndexesForRecovery(databaseOptions, sqlitePath, maintenance);
		reports.push(repair.ok ? createEmptyRecoverTargetReport(target, sqlitePath) : createRecoverInspectionFailureTargetReport(target, sqlitePath, repair.error));
	}
	return reports;
}
async function repairCanonicalIndexesForRecovery(databaseOptions, sqlitePath, maintenance) {
	try {
		await migrateOpenClawAgentDatabaseForMaintenance({
			agentId: databaseOptions.agentId,
			pathname: sqlitePath
		}, maintenance);
		maintenance.assertOwned();
		const sourcePaths = inspectSqliteRecoveryFiles(sqlitePath).existing;
		const inspection = inspectSqliteForRecovery(sqlitePath, sourcePaths);
		if (!inspection.ok) return inspection;
		if (!clearOpenClawAgentDatabaseOpenFailure(sqlitePath, { env: databaseOptions.env })) throw new Error(`Repaired canonical SQLite indexes, but could not clear the quarantine for ${sqlitePath}.`);
		return { ok: true };
	} catch (error) {
		return {
			error,
			ok: false
		};
	}
}
function inspectSqliteForRecovery(sqlitePath, sourcePaths) {
	let inspectionDir;
	let database;
	let inspectionError;
	try {
		inspectionDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-sqlite-recovery-"));
		const inspectionPath = path.join(inspectionDir, path.basename(sqlitePath));
		for (const sourcePath of sourcePaths) {
			const inspectionFilePath = `${inspectionPath}${sourcePath.slice(sqlitePath.length)}`;
			fs.copyFileSync(sourcePath, inspectionFilePath, fs.constants.COPYFILE_EXCL);
			fs.chmodSync(inspectionFilePath, 384);
		}
		database = openNodeSqliteDatabase(inspectionPath);
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		database.exec("PRAGMA trusted_schema = OFF;");
		assertSqliteIntegrity(database, inspectionPath);
	} catch (error) {
		inspectionError = error;
	}
	try {
		database?.close();
	} catch (error) {
		inspectionError ??= error;
	}
	try {
		if (inspectionDir) fs.rmSync(inspectionDir, {
			force: true,
			recursive: true
		});
	} catch (error) {
		inspectionError ??= error;
	}
	return inspectionError === void 0 ? { ok: true } : {
		error: inspectionError,
		ok: false
	};
}
function recoverCorruptSqliteTarget(target, sqlitePath, error, assertCurrent) {
	const report = createEmptyRecoverTargetReport(target, sqlitePath);
	try {
		report.corruptRecovery = moveSqliteFilesAside(sqlitePath, assertCurrent);
	} catch (moveError) {
		report.issues.push({
			code: "sqlite_corrupt_recovery_failed",
			message: `${sqlitePath}: ${String(moveError)}; original error: ${String(error)}`
		});
	}
	return report;
}
function createRecoverInspectionFailureTargetReport(target, sqlitePath, error) {
	const report = createEmptyRecoverTargetReport(target, sqlitePath);
	report.issues.push({
		code: "sqlite_recovery_inspect_failed",
		message: `${sqlitePath}: ${String(error)}`
	});
	return report;
}
function isSqliteCorruptionError(error) {
	const code = error && typeof error === "object" ? error.code : void 0;
	if (code === "SQLITE_CORRUPT" || code === "SQLITE_NOTADB") return true;
	const message = String(error).toLowerCase();
	return message.includes("database disk image is malformed") || message.includes("not a database") || message.includes("sqlite quick_check failed") || message.includes("sqlite integrity_check failed") || message.includes("sqlite foreign_key_check failed");
}
function isCanonicalAgentIndexCorruptionError(error) {
	if (!(error instanceof Error) || error.name !== "SqliteIntegrityError") return false;
	return CANONICAL_AGENT_INDEX_NAMES.some((indexName) => error.message.includes(indexName));
}
function resolveRecoverTargets(targets, env) {
	return targets.map((target) => ({
		...target,
		sqlitePath: resolveTargetSqlitePath(target, env)
	}));
}
function createSyntheticRecoverTargetReport(env, message) {
	return createDoctorSessionSqliteTargetReport({
		agentId: "recover",
		issues: [{
			code: "recover_manifest_missing",
			message
		}],
		sqlitePath: "",
		storePath: resolveSessionSqliteMigrationRunsDir(env)
	});
}
function createEmptyRecoverTargetReport(target, sqlitePath) {
	return createDoctorSessionSqliteTargetReport({
		agentId: target.agentId,
		sqlitePath,
		storePath: target.storePath
	});
}
function summarizeRecoverReport(targets) {
	const report = summarizeDoctorSessionSqliteReport("recover", targets);
	delete report.totals.archivedLegacyStoreFiles;
	delete report.totals.reclaimedBytes;
	return report;
}
//#endregion
//#region src/commands/doctor-session-sqlite-restore-report.ts
async function restoreDoctorSessionSqliteTargets(params) {
	const targetReports = params.targets.map((target) => createEmptyTargetReport(target));
	const trustedTargets = params.targets.map((target) => ({
		...target,
		sqlitePath: resolveTargetSqlitePath(target)
	}));
	const restore = await restoreSessionSqliteMigrationRuns({
		env: params.env,
		trustedTargets
	});
	const reportTarget = targetReports[0] ?? createSyntheticRestoreTargetReport(params.env, restore.manifestPaths[0] ?? resolveSessionSqliteMigrationRunsDir(params.env));
	reportTarget.restore = restore;
	reportTarget.issues.push(...restore.conflicts.map((conflict) => ({
		code: "restore_conflict",
		message: `${conflict.sourcePath}: ${conflict.reason}`
	})));
	return summarizeRestoreReport(targetReports.length > 0 ? targetReports : [reportTarget]);
}
function createEmptyTargetReport(target) {
	return createDoctorSessionSqliteTargetReport({
		agentId: target.agentId,
		sqliteEntries: readSqliteEntryCount(target),
		sqlitePath: resolveTargetSqlitePath(target),
		storePath: target.storePath
	});
}
function createSyntheticRestoreTargetReport(env, manifestPath) {
	return createDoctorSessionSqliteTargetReport({
		agentId: "restore",
		sqlitePath: "",
		storePath: manifestPath || resolveSessionSqliteMigrationRunsDir(env)
	});
}
function summarizeRestoreReport(targets) {
	return {
		mode: "restore",
		targets,
		totals: createDoctorSessionSqliteTotals(targets)
	};
}
//#endregion
//#region src/commands/doctor-session-sqlite-retained.ts
/** Receipt recovery belongs to offline Doctor; canonical session data is never replayed. */
function prepareRetainedSessionImport(params, issues) {
	const isSqliteStore = params.target.storePath.endsWith(".sqlite");
	let retainedImport;
	const sourceConflicts = /* @__PURE__ */ new Set();
	const sourceVerification = {
		...prepareSessionSourceVerification({
			...params,
			sqlitePath: resolveTargetSqlitePath(params.target, params.env)
		}),
		allowMissingIndex: true,
		onSourceConflict: !fs.existsSync(params.target.storePath) ? (sourcePath, artifactPath = sourcePath) => {
			if (sourceConflicts.has(artifactPath)) return;
			sourceConflicts.add(sourcePath);
			sourceConflicts.add(artifactPath);
			issues.push({
				code: "historical_transcript_deferred",
				message: `${artifactPath}: recorded source could not be hash-verified; protected without replaying or archiving it.`
			});
		} : void 0
	};
	if (!isSqliteStore) try {
		if ((params.mode === "import" || params.mode === "recover") && rebuildDeferredPluginSessionSourceIndex(sourceVerification)) issues.push({
			code: "retained_plugin_source_index_rebuilt",
			message: `Rebuilt the verified source index and database binding from the deferred import receipt: ${params.target.storePath}. Canonical SQLite sessions were not replayed.`
		});
		retainedImport = readDeferredPluginSessionImport(sourceVerification);
	} catch (error) {
		issues.push({
			code: "retained_plugin_source_conflict",
			message: formatErrorMessage(error)
		});
		return;
	}
	const retainedIndex = retainedImport?.sources.find((source) => source.path === path.resolve(params.target.storePath));
	const retainedIndexPath = retainedIndex && resolveVerifiedSessionSource(retainedIndex, sourceVerification.resolvedTarget, params.env, sourceVerification.verification);
	return {
		retainedImport,
		sourceConflicts,
		sourceVerification,
		retainedIndexPath
	};
}
/** Historical discovery yields; verify the receipt again before counting or authorizing archival. */
function countRetainedSessionSources(retained, records, report) {
	const { retainedImport, retainedIndexPath, sourceVerification, sourceConflicts } = retained;
	if (!retainedImport) return;
	if (!retainedIndexPath) {
		sourceVerification.verification.clear();
		if (!isDeepStrictEqual(readDeferredPluginSessionImport(sourceVerification), retainedImport)) throw new Error("Verified retained session import receipt changed during discovery.");
	}
	const verifiedSources = new Map(retainedImport.sources.map((source) => [source.path, source]));
	for (const record of records) {
		if (record.transcriptPath && sourceConflicts.has(record.transcriptPath)) continue;
		const source = record.transcriptPath && verifiedSources.get(path.resolve(record.transcriptPath));
		if (record.transcriptPath && !source) report.issues.push({
			code: "transcript_missing",
			message: `Transcript file is missing: ${record.transcriptPath}`,
			sessionKey: record.sessionKey
		});
		else if (record.transcriptPath && source) {
			if (fs.existsSync(record.transcriptPath)) record.sourceFingerprint = readTranscriptFingerprint(record.transcriptPath);
			const transcriptPath = resolveVerifiedSessionSource(source, sourceVerification.resolvedTarget, sourceVerification.env, sourceVerification.verification);
			if (!transcriptPath) throw new Error(`Retained session migration source changed: ${record.transcriptPath}`);
			countLegacyTranscript({
				...record,
				transcriptPath
			}, report);
			record.recovery = {
				complete: !report.issues.some((issue) => issue.code === "transcript_malformed" && issue.sessionKey === record.sessionKey),
				repaired: false,
				events: 0
			};
		}
	}
}
//#endregion
//#region src/commands/doctor-session-sqlite-targets.ts
/** Offline Doctor target discovery and legacy-source admission. */
function resolveDoctorSessionSqliteTargets(params) {
	if (params.store) return resolveSessionStoreTargets(params.cfg, { store: params.store }, { env: params.env });
	const discoversHistory = params.mode === "dry-run" || params.mode === "import" || params.mode === "validate";
	if (params.mode === "restore" || params.mode === "recover" || discoversHistory && params.agent) {
		const candidates = resolveAllAgentSessionStoreCandidateTargetsSync(params.cfg, { env: params.env });
		if (!params.agent) return candidates;
		const requestedAgentId = normalizeAgentId(params.agent);
		return candidates.filter((target) => normalizeAgentId(target.agentId) === requestedAgentId);
	}
	if (params.agent) return resolveAgentSessionStoreTargetsSync(params.cfg, params.agent, { env: params.env });
	if (params.allAgents) {
		const candidates = discoversHistory ? resolveAllAgentSessionStoreCandidateTargetsSync(params.cfg, { env: params.env }) : resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env });
		const legacyStorePath = path.join(resolveStateDir(params.env), "sessions", "sessions.json");
		const targets = [...discoversHistory && fs.existsSync(legacyStorePath) ? resolveSessionStoreTargets(params.cfg, { allAgents: true }, { env: params.env }).map((target) => ({
			agentId: target.agentId,
			sqlitePath: resolveTargetSqlitePath(target, params.env),
			storePath: legacyStorePath
		})) : [], ...candidates].map((target) => ({
			target,
			sqlitePath: resolveTargetSqlitePath(target, params.env)
		}));
		const isRetained = createRetainedAgentDatabaseMatcher(params.env, () => resolveConfiguredAgentDatabaseTargets(params.cfg, { env: params.env }), {
			kind: "legacy-database",
			readDatabasePaths: () => targets.map(({ sqlitePath }) => sqlitePath)
		});
		return targets.filter(({ target, sqlitePath }) => !isRetained(target.storePath, target.agentId) && !isRetained(sqlitePath, target.agentId)).map(({ target }) => target);
	}
	return resolveSessionStoreTargets(params.cfg, {}, { env: params.env });
}
function filterLegacySessionStoreTargets(targets, mode, historicalArchives, settledStores) {
	if (mode === "inspect" || mode === "compact" || mode === "restore" || mode === "recover") return targets;
	return targets.filter((target) => !target.storePath.endsWith(".sqlite") && (settledStores.has(target.storePath) || fs.existsSync(target.storePath) || (historicalArchives.get(canonicalMigrationFilePath(target.storePath))?.transcripts.length ?? 0) > 0 || fs.existsSync(path.dirname(target.storePath)) && fs.readdirSync(path.dirname(target.storePath)).some(isPrimarySessionTranscriptFileName)));
}
//#endregion
//#region src/commands/doctor-session-sqlite.ts
const retainedArchivePlans = /* @__PURE__ */ new WeakMap();
const SESSION_IMPORT_BATCH_SIZE = 256;
/**
* Runs the targeted doctor SQLite session migration/inspection submode.
* Destructive production callers hold the Gateway/SQLite-maintenance state lock for the full call.
*/
async function runDoctorSessionSqlite(options) {
	const env = options.env ?? process.env;
	const cfg = resolveDoctorSessionSqliteConfig(options);
	const pendingPlugins = readDeferredPluginMigrations({ env });
	const verifyMissingIndex = createMissingSessionIndexVerifier({
		cfg,
		env
	});
	const candidates = resolveDoctorSessionSqliteTargets({
		...options,
		cfg,
		env
	});
	if (isDestructiveDoctorSessionSqliteMode(options.mode)) assertDoctorSqliteMaintenancePathsNotAliased(`session SQLite ${options.mode}`, resolveDoctorSessionSqliteMaintenancePaths(candidates), resolveDoctorSessionSqliteMaintenanceRoots(candidates, env));
	const settlements = options.mode === "import" || options.mode === "recover" ? await settleDuplicateSessionSqliteArchives({
		cfg,
		env,
		targets: candidates.map(createMigrationTargetInput)
	}) : [];
	const historicalArchives = [
		"import",
		"dry-run",
		"validate",
		"recover"
	].includes(options.mode) ? collectHistoricalArchiveSources({
		cfg,
		env
	}).sources : /* @__PURE__ */ new Map();
	const targets = filterLegacySessionStoreTargets(candidates, options.mode, historicalArchives, new Set(settlements.map(({ target }) => target.storePath)));
	if (options.mode === "restore") return restoreDoctorSessionSqliteTargets({
		env,
		targets
	});
	if (options.mode === "recover") return recoverDoctorSessionSqliteTargets({
		env,
		options,
		targets,
		historicalArchiveStores: /* @__PURE__ */ new Set([...historicalArchives.keys(), ...settlements.map(({ target }) => target.storePath)]),
		validateTarget: async (target) => {
			const report = collectHistoricalArchiveSources({
				cfg,
				env
			}).sources.get(target.storePath)?.transcripts.length ? (await runDoctorSessionSqlite({
				cfg,
				env,
				mode: "import",
				store: target.storePath,
				agent: target.agentId
			})).targets[0] : await inspectOrMigrateTarget({
				cfg,
				env,
				mode: "recover",
				target,
				verifyMissingIndex,
				deferredPluginIds: deferredPluginSessionStoreIds({
					target,
					pending: pendingPlugins
				})
			});
			report.issues.push(...settlements.filter((item) => item.target.storePath === target.storePath).flatMap((item) => item.issues));
			return report;
		}
	});
	if (options.mode === "import") await reconcileSessionSqliteMigrationPublications({
		env,
		trustedTargets: targets.map(createMigrationTargetInput)
	});
	const activeRun = options.mode === "import" && targets.length > 0 ? createSessionSqliteMigrationRun(env, targets.map(createMigrationTargetInput)) : void 0;
	const coverage = options.mode === "import" || options.mode === "dry-run" || options.mode === "validate" ? gatherLegacyArchiveCoverage(cfg, env, targets, options.allAgents && !options.agent && !options.store ? candidates : void 0) : void 0;
	const reports = [];
	const archiveTargets = [];
	for (const target of targets) reports.push(await inspectOrMigrateTarget({
		activeRun,
		archiveTargets,
		verifyMissingIndex,
		cfg,
		env,
		mode: options.mode,
		target,
		historicalArchives,
		referencedPaths: coverage?.referencedPaths,
		expectedIndexIdentity: coverage?.indexIdentities.get(canonicalMigrationFilePath(target.storePath)),
		deferredPluginIds: deferredPluginSessionStoreIds({
			target,
			pending: pendingPlugins
		})
	}));
	for (const report of reports) report.issues.push(...settlements.filter((item) => item.target.storePath === report.storePath).flatMap((item) => item.issues));
	if (activeRun && coverage) {
		const deferredSourcePaths = /* @__PURE__ */ new Set();
		for (const target of reports.filter(isInformationalMissingSessionIndex)) {
			coverage.selectedStorePaths.delete(canonicalMigrationFilePath(target.storePath));
			coverage.retainedDirectories.add(path.dirname(canonicalMigrationFilePath(target.storePath)));
		}
		for (const owner of archiveTargets) for (const source of owner.sourceConflicts ?? []) {
			coverage.retainedPaths.add(canonicalMigrationFilePath(source));
			deferredSourcePaths.add(canonicalMigrationFilePath(source));
		}
		const retainDeferredSources = () => {
			for (const owner of archiveTargets) if (owner.deferredPluginIds.length > 0) {
				coverage.selectedStorePaths.delete(canonicalMigrationFilePath(owner.target.storePath));
				coverage.retainedDirectories.add(path.dirname(canonicalMigrationFilePath(owner.target.storePath)));
				if (owner.retainedImportVerified) for (const source of owner.verifiedSources ?? []) deferredSourcePaths.add(canonicalMigrationFilePath(source.path));
			}
		};
		const publishArchive = (remove, retainSource) => {
			const conflict = withDeferredPluginMigrationsCurrent({
				env,
				expectedPending: pendingPlugins,
				onConflict(pending) {
					retainSource();
					if (pending.length > 0) {
						for (const owner of archiveTargets) if (!owner.retainedImportVerified && owner.verifiedSources) recordDeferredPluginSessionImport({
							cfg,
							target: owner.sourceTarget,
							sqlitePath: owner.target.sqlitePath,
							env,
							pluginIds: pending.map((plugin) => plugin.pluginId),
							sources: owner.verifiedSources,
							recordCount: owner.report.legacyEntries
						});
					}
					return pending;
				}
			}, () => {
				remove();
			});
			if (conflict) {
				for (const owner of archiveTargets) {
					owner.deferredPluginIds = deferredPluginSessionStoreIds({
						target: owner.target,
						pending: conflict
					});
					if (owner.deferredPluginIds.length > 0) {
						owner.retainedImportVerified ||= owner.verifiedSources !== void 0;
						owner.report.issues.push({
							code: "plugin_migration_source_retained",
							message: `Plugin migration obligations changed before archival. Original session migration inputs remain pending for plugin(s): ${owner.deferredPluginIds.join(", ")}. Run openclaw doctor --fix after the plugin is available.`
						});
					}
				}
				retainDeferredSources();
				throw new DeferredPluginMigrationConflictError(conflict);
			}
		};
		retainDeferredSources();
		await archiveLegacyArtifacts(archiveTargets, coverage, activeRun, void 0, void 0, publishArchive);
		for (const { target, report } of archiveTargets) appendActiveSqliteTranscriptFileIssues(target, report, deferredSourcePaths);
		for (const report of reports) updateMigrationManifestTarget(activeRun, createMigrationTargetInput(report), report.issues);
		await archiveImportedLegacySessionStores(archiveTargets, activeRun, coverage, void 0, publishArchive);
		const hasBlockingIssues = reports.some((report) => countBlockingSessionSqliteIssues(report) > 0);
		activeRun.manifest.completedAt = (/* @__PURE__ */ new Date()).toISOString();
		if (hasBlockingIssues) {
			activeRun.manifest.failedAt = activeRun.manifest.completedAt;
			const failureReports = writeSessionSqliteMigrationFailureReports(activeRun.manifestPath, { reason: "doctor import reported session SQLite migration issues" });
			activeRun.manifest.failureReports = failureReports;
		}
		writeSessionSqliteMigrationManifest(activeRun);
	}
	const report = summarizeDoctorSessionSqliteReport(options.mode, reports, activeRun);
	if (activeRun) {
		const owners = archiveTargets.filter((owner) => owner.retainedImportVerified && owner.deferredPluginIds.length > 0 && !owner.sourceConflicts?.size).map((owner) => {
			const receipt = readDeferredPluginSessionImport({
				cfg,
				target: owner.sourceTarget,
				sqlitePath: owner.target.sqlitePath,
				env
			});
			if (!receipt) throw new Error("Verified retained session import receipt is missing.");
			return {
				owner,
				receipt
			};
		});
		if (owners.length > 0) retainedArchivePlans.set(report, {
			cfg,
			env: { ...env },
			owners
		});
	}
	return report;
}
/** Retire only this import's verified originals before the last plugin obligation clears. */
async function settleRetainedDoctorSessionSources(report, completedPluginIds, authority, assertCompletionCurrent) {
	const plan = retainedArchivePlans.get(report);
	if (!plan) return;
	const assertCurrent = () => {
		authority.assertCurrent();
		assertCompletionCurrent();
	};
	assertCurrent();
	retainedArchivePlans.delete(report);
	const completed = new Set(completedPluginIds);
	const expectedPending = readDeferredPluginMigrations({ env: plan.env });
	if (expectedPending.filter((plugin) => !completed.has(plugin.pluginId)).length > 0) return;
	const publishArchive = (remove, retainSource) => {
		const conflict = withDeferredPluginMigrationsCurrent({
			env: plan.env,
			expectedPending,
			onConflict(pending) {
				authority.assertCurrent();
				retainSource();
				return pending;
			}
		}, () => {
			remove();
		});
		if (conflict) throw new DeferredPluginMigrationConflictError(conflict);
	};
	const verifyImports = () => {
		assertCurrent();
		for (const { owner, receipt } of plan.owners) {
			const current = readDeferredPluginSessionImport({
				cfg: plan.cfg,
				target: owner.sourceTarget,
				sqlitePath: owner.target.sqlitePath,
				env: plan.env
			});
			if (!current || !isDeepStrictEqual(current, receipt)) throw new Error("Verified retained session import receipt changed before settlement.");
		}
	};
	const owners = plan.owners.map(({ owner }) => ({
		...owner,
		deferredPluginIds: [],
		report: {
			...owner.report,
			archivedLegacyStoreFiles: [...owner.report.archivedLegacyStoreFiles ?? []],
			archivedTranscriptFiles: [...owner.report.archivedTranscriptFiles],
			archivedUnreferencedJsonlFiles: [...owner.report.archivedUnreferencedJsonlFiles],
			issues: owner.report.issues.filter((issue) => issue.code !== "plugin_migration_source_retained")
		}
	}));
	let activeRun;
	let failure;
	try {
		verifyImports();
		const coverage = gatherLegacyArchiveCoverage(plan.cfg, plan.env, owners.map(({ sourceTarget }) => sourceTarget));
		verifyImports();
		const targets = owners.map(({ target }) => target);
		assertDoctorSqliteMaintenancePathsNotAliased("retained session source settlement", resolveDoctorSessionSqliteMaintenancePaths(targets), resolveDoctorSessionSqliteMaintenanceRoots(targets, plan.env));
		assertCurrent();
		activeRun = createSessionSqliteMigrationRun(plan.env, targets);
		for (const owner of owners) updateMigrationManifestTarget(activeRun, owner.target, owner.report.issues, { validationBeforeArchive: "passed" });
		const capturedSources = new Set(plan.owners.flatMap(({ receipt }) => receipt.sources.map((source) => source.path)));
		await archiveLegacyArtifacts(owners, coverage, activeRun, assertCurrent, capturedSources, publishArchive);
		verifyImports();
		await archiveImportedLegacySessionStores(owners.filter((owner) => owner.report.issues.every(isRetainedSourceIssue)), activeRun, coverage, assertCurrent, publishArchive);
		verifyImports();
		const issue = owners.flatMap((owner) => owner.report.issues).find((candidate) => !isRetainedSourceIssue(candidate));
		if (issue || owners.some((owner) => fs.existsSync(owner.target.storePath))) throw new Error(issue?.message ?? "Retained session sources could not be archived.");
	} catch (error) {
		failure = error instanceof Error ? error : new Error(formatErrorMessage(error));
		const failedOwners = owners.filter((owner) => owner.report.issues.some((issue) => !isRetainedSourceIssue(issue)));
		for (const [index, owner] of owners.entries()) {
			owner.report.issues.push(...plan.owners[index].owner.report.issues.filter((issue) => issue.code === "plugin_migration_source_retained"));
			if (failedOwners.length === 0 || failedOwners.includes(owner)) {
				const ownIssue = owner.report.issues.find((issue) => !isRetainedSourceIssue(issue) && issue.code !== "plugin_migration_source_retained");
				owner.report.issues.push({
					code: "retained_plugin_source_settlement_failed",
					message: ownIssue?.message ?? formatErrorMessage(error)
				});
			}
		}
	}
	for (const [index, owner] of owners.entries()) Object.assign(plan.owners[index].owner.report, owner.report);
	if (activeRun) {
		assertCurrent();
		for (const owner of owners) updateMigrationManifestTarget(activeRun, owner.target, owner.report.issues);
		activeRun.manifest.completedAt = (/* @__PURE__ */ new Date()).toISOString();
		if (failure) activeRun.manifest.failedAt = activeRun.manifest.completedAt;
		writeSessionSqliteMigrationManifest(activeRun);
	}
	Object.assign(report, summarizeDoctorSessionSqliteReport(report.mode, report.targets, activeRun));
	if (failure) throw failure;
}
/** Called only under the public maintenance lock, before its strict alias recheck. */
async function reconcileDoctorSessionSqlitePublication(options, sourcePath) {
	const env = options.env ?? process.env;
	const cfg = resolveDoctorSessionSqliteConfig(options);
	const targets = resolveDoctorSessionSqliteTargets({
		...options,
		cfg,
		env
	});
	assertDoctorSqliteMaintenancePathsNotAliased(`session SQLite ${options.mode}`, resolveDoctorSessionSqliteMaintenancePaths(targets), resolveDoctorSessionSqliteMaintenanceRoots(targets, env));
	await reconcileSessionSqliteMigrationPublications({
		env,
		sourcePath,
		trustedTargets: targets.map(createMigrationTargetInput)
	});
}
function resolveDoctorSessionSqliteMaintenancePaths(targets) {
	const protectedPaths = /* @__PURE__ */ new Set();
	for (const target of targets) for (const databasePath of resolveSqliteDatabaseFilePaths(resolveTargetSqlitePath(target))) protectedPaths.add(databasePath);
	return [...protectedPaths];
}
function resolveDoctorSessionSqliteMaintenanceRoots(targets, env) {
	const stateDir = path.resolve(resolveStateDir(env));
	const roots = /* @__PURE__ */ new Set([stateDir]);
	for (const target of targets) {
		const sqlitePath = resolveTargetSqlitePath(target);
		if (isPathWithin(stateDir, target.storePath) && isPathWithin(stateDir, sqlitePath)) continue;
		const commonRoot = commonPathAncestor(path.dirname(target.storePath), path.dirname(sqlitePath));
		const parentRoot = path.dirname(commonRoot);
		roots.add(parentRoot === path.parse(commonRoot).root ? commonRoot : parentRoot);
	}
	return [...roots];
}
function isPathWithin(rootPath, candidatePath) {
	return isPathInside(rootPath, path.resolve(candidatePath));
}
function commonPathAncestor(leftPath, rightPath) {
	let currentPath = path.resolve(leftPath);
	const resolvedRightPath = path.resolve(rightPath);
	while (!isPathWithin(currentPath, resolvedRightPath)) {
		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) return currentPath;
		currentPath = parentPath;
	}
	return currentPath;
}
function resolveDoctorSessionSqliteConfig(options) {
	if (options.cfg) return options.cfg;
	const requestedAgentId = normalizeAgentId(options.agent ?? "main");
	return options.store ? { agents: { entries: { [requestedAgentId]: { default: true } } } } : getRuntimeConfig();
}
async function inspectOrMigrateTarget(params) {
	const issues = [];
	const isSqliteStore = params.target.storePath.endsWith(".sqlite");
	const retained = prepareRetainedSessionImport(params, issues);
	if (!retained) return createDoctorSessionSqliteTargetReport({
		...params.target,
		sqlitePath: resolveTargetSqlitePath(params.target, params.env),
		issues
	});
	const { retainedImport, sourceConflicts, retainedIndexPath } = retained;
	const allRecords = isSqliteStore ? [] : readLegacySessionRecords(params.target, issues, {
		allowMissingStore: true,
		...retainedIndexPath ? { sourcePath: retainedIndexPath } : {},
		verifiedSourcePaths: retainedImport ? new Set(retainedImport.sources.map((source) => source.path)) : void 0
	});
	if (!isSqliteStore && (!retainedImport || !retainedIndexPath) && params.mode !== "inspect" && params.mode !== "compact" && (issues.length === 0 || retainedImport)) {
		const archiveSources = params.historicalArchives?.get(canonicalMigrationFilePath(params.target.storePath));
		const ownershipRecords = readArchivedSessionOwnership(params.target, retainedImport ? [] : archiveSources?.stores ?? [], issues);
		const snapshot = readOnlySqliteValidationSnapshot(params.target);
		if (snapshot.ok && ownershipRecords) {
			const discovered = await discoverLegacyHistoricalTranscripts({
				target: params.target,
				records: allRecords,
				ownershipRecords,
				referencedPaths: params.referencedPaths,
				archiveSources: !retainedImport ? archiveSources?.transcripts : [],
				verifiedSourcePaths: retainedImport ? new Set(retainedImport.sources.filter((source) => !sourceConflicts.has(source.path)).map((source) => source.path)) : void 0,
				snapshot: snapshot.snapshot,
				issues
			});
			for (const historical of discovered) {
				const registered = allRecords.find((record) => record.sessionKey === historical.sessionKey && record.entry.sessionId === historical.entry.sessionId && (!record.transcriptPath || !fs.existsSync(record.transcriptPath)));
				if (registered) {
					registered.transcriptPath = historical.transcriptPath;
					registered.transcriptDependencies.push(...historical.transcriptDependencies);
					registered.historical = historical.historical;
				} else allRecords.push(historical);
			}
		} else if (!snapshot.ok) issues.push({
			code: "sqlite_read_failed",
			message: String(snapshot.error)
		});
	}
	const records = shouldFilterLegacySessionRecordsByTarget(params.target) ? allRecords.filter((record) => isLegacySessionRecordOwnedByTarget(params.cfg, params.target, record.sessionKey)) : allRecords;
	const referencedTranscriptFiles = new Set(allRecords.flatMap((record) => record.transcriptPath ? [record.transcriptPath] : []));
	const report = createDoctorSessionSqliteTargetReport({
		agentId: params.target.agentId,
		archivedLegacyStoreFiles: [],
		issues,
		legacyEntries: records.length,
		referencedTranscriptFiles: referencedTranscriptFiles.size,
		sqliteEntries: readSqliteEntryCount(params.target),
		sqlitePath: resolveTargetSqlitePath(params.target),
		storePath: params.target.storePath,
		unreferencedJsonlFiles: isSqliteStore ? [] : listUnreferencedJsonlFiles(params.target.storePath, [...referencedTranscriptFiles])
	});
	const retainedSourcePaths = retainedImport ? new Set(retainedImport.sources.map((source) => canonicalMigrationFilePath(source.path))) : void 0;
	if (params.mode === "import" && retainedImport || params.mode === "recover") {
		const activeRecords = await prepareActiveSqliteTranscriptSettlement({
			target: params.target,
			env: params.env,
			report,
			excludedPaths: retainedSourcePaths ?? /* @__PURE__ */ new Set()
		});
		if (activeRecords.length > 0) {
			const target = createMigrationTargetInput(params.target);
			const activeRun = params.activeRun ?? createSessionSqliteMigrationRun(params.env, [target]);
			const activeCoverage = gatherLegacyArchiveCoverage(params.cfg, params.env, [params.target]);
			if (isSqliteStore) activeCoverage.selectedStorePaths.add(target.storePath);
			await archiveLegacyArtifacts([{
				sourceTarget: params.target,
				target,
				report,
				validated: true,
				deferredPluginIds: [],
				retainedImportVerified: false,
				records: activeRecords.map(({ entry, ...record }) => ({
					...record,
					sessionId: entry.sessionId
				}))
			}], activeCoverage, activeRun, void 0, new Set(activeRecords.map((record) => record.transcriptPath)));
			updateMigrationManifestTarget(activeRun, target, report.issues, { validationBeforeArchive: "passed" });
			if (!params.activeRun) {
				activeRun.manifest.completedAt = (/* @__PURE__ */ new Date()).toISOString();
				writeSessionSqliteMigrationManifest(activeRun);
			}
		}
	}
	if (retainedImport && params.mode !== "import" && retainedImport.sources.some((source) => fs.existsSync(source.path))) appendRetainedPluginSessionSourceIssue(report, params.deferredPluginIds ?? []);
	if (params.mode === "compact") {
		await compactSqliteDatabase(params.target, report, { env: params.env });
		report.sqliteEntries = readSqliteEntryCount(params.target);
	}
	if (isSqliteStore || params.mode === "inspect" || params.mode === "compact") {
		appendSqliteDbStats(params.target, report);
		if (params.mode !== "compact") appendActiveSqliteTranscriptFileIssues(params.target, report, retainedSourcePaths);
		return report;
	}
	if (records.length === 0 && !fs.existsSync(params.target.storePath) && !retainedImport) {
		if (issues.length === 0) report.sqliteEntries = 0;
		updateMigrationManifestTarget(params.activeRun, createMigrationTargetInput(params.target), issues);
		return report;
	}
	if (!retainedImport && params.verifyMissingIndex(report)) {
		updateMigrationManifestTarget(params.activeRun, createMigrationTargetInput(params.target), report.issues, { validationBeforeArchive: "passed" });
		return report;
	}
	if (retainedImport) countRetainedSessionSources(retained, records, report);
	else if (params.mode === "import") await importLegacySessionRecords(params.target, records, report);
	else if (params.mode === "dry-run") for (const record of records) countLegacyTranscript(record, report);
	else validateLegacySessionRecords(params.target, records, report, "validate");
	let validationPassed = retainedImport !== void 0;
	if (params.mode === "import" && retainedImport) updateMigrationManifestTarget(params.activeRun, createMigrationTargetInput(params.target), report.issues, { validationBeforeArchive: "passed" });
	if (params.mode === "import" && !retainedImport && countBlockingSessionSqliteIssues(report) === 0) {
		validationPassed = validateLegacySessionRecords(params.target, records, report, "before-archive");
		updateMigrationManifestTarget(params.activeRun, createMigrationTargetInput(params.target), report.issues, { validationBeforeArchive: validationPassed ? "passed" : "failed" });
		if (validationPassed && params.activeRun) {
			const recoveredMoves = records.flatMap((record) => record.historical?.archiveMove && record.recovery?.complete ? [{
				...record.historical.archiveMove,
				sessionKey: record.sessionKey,
				artifact: {
					...record.historical.archiveMove.artifact,
					classification: "protected",
					reason: HISTORICAL_IMPORT_REASON
				}
			}] : []);
			if (recoveredMoves.length > 0) {
				recordPlannedMigrationMoves(params.activeRun, createMigrationTargetInput(params.target), recoveredMoves);
				recordCompletedMigrationMoves(params.activeRun, createMigrationTargetInput(params.target), recoveredMoves);
			}
		}
		if (validationPassed) await compactSqliteDatabase(params.target, report, {
			env: params.env,
			operation: "import-finalize"
		});
	}
	if (params.mode === "import") {
		const deferredPluginIds = params.deferredPluginIds ?? [];
		const verifiedImport = validationPassed && (retainedImport !== void 0 || records.length > 0 || fs.existsSync(resolveTargetSqlitePath(params.target, params.env)));
		let retainedImportVerified = retainedImport !== void 0;
		let verifiedSources = retainedImport?.sources;
		const indexIdentity = params.expectedIndexIdentity;
		if (!retainedImport && indexIdentity && verifiedImport && report.issues.every(isRetainedSourceIssue)) try {
			verifiedSources = captureDeferredPluginSessionSources({
				storePath: params.target.storePath,
				indexIdentity,
				records,
				unreferencedJsonlFiles: report.unreferencedJsonlFiles,
				referencedPaths: params.referencedPaths
			});
		} catch (error) {
			report.issues.push({
				code: "transcript_archive_failed",
				message: formatErrorMessage(error)
			});
		}
		if (deferredPluginIds.length > 0 && verifiedImport && report.issues.every(isRetainedSourceIssue)) {
			if (!retainedImport) {
				if (!verifiedSources) {
					if (!fs.existsSync(params.target.storePath) && records.every((record) => record.historical?.archiveMove) && listUnreferencedJsonlFiles(params.target.storePath, []).length === 0) {
						report.sqliteEntries = readSqliteEntryCount(params.target);
						return report;
					}
					throw new Error(`Deferred plugin session inputs have no verified source index: ${params.target.storePath}. Preserve the session files and migration archives; restore the matching sessions.json from a backup, then run openclaw doctor --fix.`);
				}
				recordDeferredPluginSessionImport({
					cfg: params.cfg,
					target: params.target,
					sqlitePath: resolveTargetSqlitePath(params.target, params.env),
					env: params.env,
					pluginIds: deferredPluginIds,
					sources: verifiedSources,
					recordCount: records.length
				});
				retainedImportVerified = true;
			}
			appendRetainedPluginSessionSourceIssue(report, deferredPluginIds);
		}
		params.archiveTargets?.push({
			sourceTarget: params.target,
			target: createMigrationTargetInput(params.target),
			report,
			validated: validationPassed,
			deferredPluginIds,
			retainedImportVerified,
			sourceConflicts,
			verifiedSources,
			records: records.filter((record) => !record.historical?.archiveMove && !sourceConflicts.has(record.transcriptPath ?? "")).map(({ entry, ...record }) => Object.assign(record, { sessionId: entry.sessionId }))
		});
	}
	report.sqliteEntries = readSqliteEntryCount(params.target);
	if (params.mode !== "import") appendActiveSqliteTranscriptFileIssues(params.target, report, retainedSourcePaths);
	updateMigrationManifestTarget(params.activeRun, createMigrationTargetInput(params.target), report.issues);
	return report;
}
async function importLegacySessionRecords(target, records, report) {
	if (records.length === 0) return;
	const importedTranscriptSources = /* @__PURE__ */ new Set();
	const existingSnapshot = readOnlySqliteValidationSnapshot(target);
	for (let offset = 0; offset < records.length; offset += SESSION_IMPORT_BATCH_SIZE) {
		const pending = records.slice(offset, offset + SESSION_IMPORT_BATCH_SIZE).flatMap((record) => {
			const prepared = prepareLegacySessionImport(target, record, report, importedTranscriptSources, existingSnapshot.ok ? existingSnapshot.snapshot : void 0);
			return prepared ? [{
				...prepared,
				record
			}] : [];
		});
		const imported = await importSqliteSessionRowsBatch(pending.map((entry) => entry.params));
		for (const [index, result] of imported.entries()) {
			const record = pending[index]?.record;
			if (record && result.recovery) record.recovery = result.recovery;
		}
		report.importedEntries += imported.length;
		report.importedTranscriptEvents += imported.reduce((total, result) => total + result.transcriptEvents, 0);
		report.issues.push(...pending.flatMap((entry) => entry.issue ? [entry.issue] : []));
		await setImmediate();
	}
}
function prepareLegacySessionImport(target, record, report, importedTranscriptSources, existingSnapshot) {
	if (record.historical && record.transcriptPath && !sameMigrationArtifact(record.historical.identity, readMigrationArtifactIdentity(record.transcriptPath))) {
		report.issues.push({
			code: "historical_transcript_deferred",
			sessionKey: record.sessionKey,
			message: `${record.historical.originalPath}: source changed after discovery; retained without importing`
		});
		return;
	}
	const transcriptSourceKey = record.transcriptPath ? `${record.entry.sessionId}\0${record.transcriptPath}` : void 0;
	const transcriptFingerprint = transcriptSourceKey !== void 0 && !importedTranscriptSources.has(transcriptSourceKey) && record.transcriptPath && fs.existsSync(record.transcriptPath) ? readTranscriptFingerprint(record.transcriptPath) : void 0;
	record.sourceFingerprint = transcriptFingerprint;
	const result = countTranscriptEvents(record);
	const transcriptMtimeMs = readLegacyTranscriptMtimeMs(record);
	const acpEntry = !record.historical ? normalizePersistedSessionEntryShape(record.entry, { sessionKey: record.sessionKey }) : void 0;
	const params = {
		historicalOnly: Boolean(record.historical),
		allowMalformedRowRepair: true,
		repairLegacyTranscript: true,
		agentId: target.agentId,
		entry: record.entry,
		...acpEntry?.acp ? { legacyAcpMigrationSource: prepareLegacyAcpMigrationSource({
			sourcePath: target.storePath,
			sourceSessionKey: record.sessionKey,
			sessionId: acpEntry.sessionId,
			lifecycleRevision: acpEntry.lifecycleRevision,
			meta: acpEntry.acp
		}) } : {},
		preserveExactStoredKey: true,
		sessionKey: record.sessionKey,
		storePath: target.sqlitePath ?? target.storePath
	};
	if (result.status === "missing") {
		if (markAlreadyMigratedTranscript(record, report, existingSnapshot)) return;
		return {
			issue: {
				code: "transcript_missing",
				message: `Transcript file is missing: ${record.transcriptPath}`,
				sessionKey: record.sessionKey
			},
			params
		};
	}
	if (transcriptSourceKey) importedTranscriptSources.add(transcriptSourceKey);
	return {
		...result.status === "malformed" ? { issue: {
			code: "transcript_malformed",
			message: result.message,
			sessionKey: record.sessionKey
		} } : {},
		params: {
			...params,
			...record.transcriptPath && transcriptFingerprint ? { readTranscriptEvents: createTranscriptEventReader(record.transcriptPath, record.entry.sessionId, result.status === "malformed", transcriptFingerprint, record.historical?.originalPath ?? record.transcriptPath) } : {},
			...transcriptMtimeMs !== void 0 ? { transcriptMtimeMs } : {}
		}
	};
}
function markAlreadyMigratedTranscript(record, report, snapshot) {
	const migratedEvents = countAlreadyMigratedTranscriptEventsForImport(snapshot, record);
	if (migratedEvents === void 0) return false;
	report.validatedEntries += 1;
	report.validatedTranscriptEvents += migratedEvents;
	return true;
}
function validateLegacySessionRecords(target, records, report, purpose) {
	if (purpose === "before-archive" && records.length === 0) return true;
	const issueCountBeforeValidation = report.issues.length;
	const validation = readOnlySqliteValidationSnapshot(target);
	if (!validation.ok) {
		report.issues.push({
			code: "sqlite_read_failed",
			message: `SQLite validation read failed: ${String(validation.error)}`
		});
		return false;
	}
	for (const record of records) validateLegacySessionRecord(record, report, validation.snapshot, purpose);
	return report.issues.length === issueCountBeforeValidation;
}
function validateLegacySessionRecord(record, report, snapshot, purpose) {
	const beforeArchive = purpose === "before-archive";
	const normalizedKey = beforeArchive ? record.sessionKey : normalizeStoreSessionKey(record.sessionKey);
	const sqliteSessionId = record.historical ? snapshot.sessionKeysBySessionId.get(record.entry.sessionId) === normalizedKey ? record.entry.sessionId : void 0 : snapshot.sessionIdsBySessionKey.get(normalizedKey);
	if (!sqliteSessionId) {
		report.issues.push({
			code: "sqlite_entry_missing",
			message: `SQLite entry is missing for ${normalizedKey}.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (sqliteSessionId !== record.entry.sessionId) {
		report.issues.push({
			code: "sqlite_entry_mismatch",
			message: `SQLite sessionId ${sqliteSessionId} does not match ${record.entry.sessionId}.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (!beforeArchive) report.validatedEntries += 1;
	const result = countTranscriptEvents(record);
	if (result.status === "missing") {
		if (!beforeArchive) report.validatedTranscriptEvents += snapshot.transcriptEventCountsBySessionId.get(record.entry.sessionId) ?? 0;
		return;
	}
	if (result.status !== "ok") {
		if (!hasSessionIssue(report, "transcript_malformed", record.sessionKey)) report.issues.push({
			code: "transcript_malformed",
			message: result.message,
			sessionKey: record.sessionKey
		});
		return;
	}
	const sqliteEvents = snapshot.transcriptEventCountsBySessionId.get(record.entry.sessionId) ?? 0;
	const expectedEvents = beforeArchive ? record.recovery?.events ?? result.events : result.events;
	if (beforeArchive ? sqliteEvents < expectedEvents : sqliteEvents !== expectedEvents) {
		report.issues.push({
			code: "sqlite_transcript_count_mismatch",
			message: beforeArchive ? `SQLite transcript has ${sqliteEvents} events; verified import expects ${expectedEvents}.` : `SQLite transcript has ${sqliteEvents} events; source has ${result.events}.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (!beforeArchive) report.validatedTranscriptEvents += sqliteEvents;
}
async function archiveLegacyArtifacts(owners, coverage, activeRun, assertCurrent, capturedSources, publishSourceRemoval) {
	const { selectedStorePaths, referencedPaths, retainedPaths, incompleteDirectories, retainedDirectories } = coverage;
	const references = /* @__PURE__ */ new Map();
	for (const owner of owners) {
		if (!owner.validated || countBlockingSessionSqliteIssues(owner.report) > 0) selectedStorePaths.delete(owner.target.storePath);
		for (const record of owner.records) {
			if (!record.transcriptPath) continue;
			const source = canonicalMigrationFilePath(record.transcriptPath);
			references.set(source, [...references.get(source) ?? [], {
				owner,
				record
			}]);
		}
	}
	const retainedSources = [...references].filter(([source, refs]) => retainedPaths.has(source) || retainedDirectories.has(path.dirname(source)) || refs.some(({ owner }) => !selectedStorePaths.has(owner.target.storePath))).map(([source]) => source);
	for (const source of retainedSources) {
		for (const file of [
			source,
			resolveTrajectoryPath(source),
			resolveTrajectoryPointerPath(source)
		]) if (file) retainedPaths.add(file);
		for (const { owner } of references.get(source) ?? []) {
			const storePath = owner.target.storePath;
			if (!selectedStorePaths.delete(storePath)) continue;
			for (const sibling of owners.filter((item) => item.target.storePath === storePath)) for (const record of sibling.records) {
				if (!record.transcriptPath) continue;
				const siblingSource = canonicalMigrationFilePath(record.transcriptPath);
				if (!retainedPaths.has(siblingSource)) {
					retainedPaths.add(siblingSource);
					retainedSources.push(siblingSource);
				}
			}
		}
	}
	const reservedArchivePaths = /* @__PURE__ */ new Set();
	const planned = /* @__PURE__ */ new Map();
	const recordFailure = (owner, source, error, unreferenced = false) => {
		owner.report.issues.push({
			code: unreferenced ? "unreferenced_jsonl_archive_failed" : "transcript_archive_failed",
			message: `${source}: ${formatErrorMessage(error)}`
		});
	};
	for (const [source, refs] of references) {
		const first = refs[0];
		if (!fs.existsSync(source)) {
			if (refs.some(({ record }) => record.sourceFingerprint)) for (const owner of new Set(refs.map((ref) => ref.owner))) recordFailure(owner, source, "Imported transcript disappeared before archival");
			continue;
		}
		if (retainedPaths.has(source) || retainedDirectories.has(path.dirname(source))) {
			for (const { owner, record } of refs) if (countBlockingSessionSqliteIssues(owner.report) === 0 && owner.deferredPluginIds.length === 0) owner.report.issues.push({
				code: "transcript_archive_deferred",
				message: `${source}: retaining the original for an incomplete or unselected importing owner; rerun import for all known owners after resolving their index/import issues.`,
				sessionKey: record.sessionKey
			});
			continue;
		}
		try {
			const moves = planImportedTranscriptArtifactsToArchive(first.owner.target, first.record.sessionKey, source, reservedArchivePaths, capturedSources);
			const imports = refs.map(({ owner, record }) => record.sourceFingerprint ? record : refs.find((ref) => ref.owner === owner && ref.record.sessionId === record.sessionId && ref.record.sourceFingerprint)?.record);
			const fingerprints = imports.flatMap((record) => record?.sourceFingerprint ? [record.sourceFingerprint] : []);
			const fingerprint = fingerprints[0];
			if (fingerprint && fingerprints.some((current) => [
				"ctimeNs",
				"dev",
				"ino",
				"mtimeNs",
				"size"
			].some((key) => current[key] !== fingerprint[key]))) throw new Error("Transcript changed between imports; retaining the unverified original");
			const complete = !incompleteDirectories.has(path.dirname(source)) && imports.every((record) => record?.sourceFingerprint && record.recovery?.complete) && refs.every(({ owner, record }) => !hasSessionIssue(owner.report, "transcript_malformed", record.sessionKey));
			for (const move of moves) {
				if (retainedPaths.has(move.sourcePath)) throw new Error("Artifact is required by an incomplete importing owner");
				move.artifact = {
					identity: readMigrationArtifactIdentity(move.sourcePath, 1n, move.kind === "transcript" ? fingerprint : void 0),
					classification: complete && move.kind === "transcript" && !first.record.historical ? imports.some((record) => record?.recovery?.repaired) ? "repair-original" : "imported" : "protected",
					reason: complete && first.record.historical && move.kind === "transcript" ? HISTORICAL_IMPORT_REASON : complete && move.kind === "transcript" ? "verified-import-original" : "unimported-or-unknown-history",
					dependencies: [],
					disposal: { state: "retained" }
				};
				const existing = planned.get(move.sourcePath);
				if (existing) {
					if (move.artifact.classification === "protected") existing.move.artifact = move.artifact;
					for (const ref of refs) existing.owners.set(ref.owner, ref.record.sessionKey);
				} else planned.set(move.sourcePath, {
					move,
					owners: new Map(refs.map((ref) => [ref.owner, ref.record.sessionKey]))
				});
			}
		} catch (error) {
			for (const owner of new Set(refs.map((ref) => ref.owner))) recordFailure(owner, source, error);
		}
	}
	for (const owner of owners) {
		const storePath = owner.target.storePath;
		if (!selectedStorePaths.has(storePath) || countBlockingSessionSqliteIssues(owner.report) > 0 || incompleteDirectories.has(path.dirname(storePath))) continue;
		for (const source of listUnreferencedJsonlFiles(storePath, [...referencedPaths, ...planned.keys()])) {
			if (retainedPaths.has(source)) continue;
			if (capturedSources && !capturedSources.has(source)) continue;
			try {
				const move = planSessionJsonlArchiveMove({
					archiveKey: "archive-tier",
					baseNameRaw: path.basename(source),
					kind: "unreferenced-jsonl",
					reservedArchivePaths,
					sourcePathRaw: source,
					target: owner.target
				});
				move.artifact = {
					identity: readMigrationArtifactIdentity(source),
					classification: "protected",
					reason: "unreferenced-history",
					dependencies: [],
					disposal: { state: "retained" }
				};
				reservedArchivePaths.add(move.archivePath);
				planned.set(source, {
					move,
					owners: /* @__PURE__ */ new Map([[owner, void 0]])
				});
			} catch (error) {
				recordFailure(owner, source, error, true);
			}
		}
	}
	for (const owner of owners) for (const { path: source } of owner.verifiedSources ?? []) {
		const shared = planned.get(source);
		if (shared && !shared.owners.has(owner)) shared.owners.set(owner, void 0);
	}
	const movesForOwner = (owner) => [...planned.values()].filter((item) => item.owners.has(owner)).map(({ move, owners: refs }) => Object.assign({}, move, { sessionKey: refs.get(owner) }));
	for (const owner of owners) {
		assertCurrent?.();
		recordPlannedMigrationMoves(activeRun, owner.target, movesForOwner(owner));
	}
	const completed = /* @__PURE__ */ new Set();
	for (const { move, owners: referencingOwners } of planned.values()) try {
		for (const owner of referencingOwners.keys()) assertSafeSessionSqliteMigrationMove(move, owner.target);
		assertCurrent?.();
		await moveMigrationArtifact(move.sourcePath, move.archivePath, move.artifact.identity, assertCurrent ? () => {
			assertCurrent();
		} : void 0, publishSourceRemoval);
		assertCurrent?.();
		completed.add(move.sourcePath);
		for (const { report } of referencingOwners.keys()) (move.kind === "unreferenced-jsonl" ? report.archivedUnreferencedJsonlFiles : report.archivedTranscriptFiles).push(move.archivePath);
	} catch (error) {
		if (error instanceof DeferredPluginMigrationConflictError && error.pending.length > 0) break;
		for (const owner of referencingOwners.keys()) recordFailure(owner, move.sourcePath, error, move.kind === "unreferenced-jsonl");
	}
	for (const owner of owners) {
		assertCurrent?.();
		recordCompletedMigrationMoves(activeRun, owner.target, movesForOwner(owner).filter((move) => completed.has(move.sourcePath)));
		owner.report.unreferencedJsonlFiles = listUnreferencedJsonlFiles(owner.target.storePath, [...referencedPaths]);
	}
}
async function archiveImportedLegacySessionStores(owners, activeRun, coverage, assertCurrent, publishSourceRemoval) {
	const byStore = /* @__PURE__ */ new Map();
	for (const owner of owners) {
		const storePath = owner.target.storePath;
		byStore.set(storePath, [...byStore.get(storePath) ?? [], owner]);
	}
	for (const [storePath, entries] of byStore) {
		assertCurrent?.();
		if (!coverage.indexIdentities.has(storePath) && !fs.existsSync(storePath)) continue;
		if (!coverage.selectedStorePaths.has(storePath) || entries.some(({ report }) => countBlockingSessionSqliteIssues(report) > 0 || report.issues.some((issue) => issue.code === "active_sqlite_transcript_jsonl"))) continue;
		const first = entries[0];
		let publicationPlanned = false;
		try {
			const expected = coverage.indexIdentities.get(storePath);
			if (!expected || !sameMigrationArtifact(readMigrationArtifactIdentity(storePath), expected)) throw new Error("Session index changed after import; retaining the unverified original");
			const move = planSessionJsonlArchiveMove({
				archiveKey: "legacy-store",
				baseNameRaw: path.basename(storePath),
				kind: "legacy-store",
				sourcePathRaw: storePath,
				target: first.target
			});
			const transcripts = activeRun.manifest.targets.filter((target) => target.storePath === storePath).flatMap((target) => target.plannedMoves.filter((item) => item.kind === "transcript"));
			const complete = entries.every(({ validated, report }) => validated && report.issues.every((issue) => issue.code === "historical_duplicate_settled")) && transcripts.every((item) => item.artifact?.classification !== "protected");
			const dependencies = entries.flatMap(({ records }) => records.flatMap((record) => record.transcriptDependencies)).map(canonicalMigrationFilePath);
			move.artifact = {
				identity: expected,
				classification: complete ? "imported" : "protected",
				reason: complete ? "verified-index-import" : "incomplete-index-import",
				dependencies: [...new Set(dependencies)],
				disposal: { state: "retained" }
			};
			for (const { target } of entries) {
				assertCurrent?.();
				recordPlannedMigrationMoves(activeRun, target, [move]);
				assertSafeSessionSqliteMigrationMove(move, target);
			}
			publicationPlanned = true;
			assertCurrent?.();
			await moveMigrationArtifact(move.sourcePath, move.archivePath, expected, assertCurrent ? () => {
				assertCurrent();
			} : void 0, publishSourceRemoval);
			assertCurrent?.();
			for (const { target, report } of entries) {
				recordCompletedMigrationMoves(activeRun, target, [move]);
				report.archivedLegacyStoreFiles.push(move.archivePath);
			}
		} catch (error) {
			if (error instanceof DeferredPluginMigrationConflictError && error.pending.length > 0) break;
			for (const { report, target } of entries) {
				report.issues.push({
					code: "legacy_store_archive_failed",
					message: `${storePath}: ${formatErrorMessage(error)}`
				});
				if (!publicationPlanned) {
					assertCurrent?.();
					updateMigrationManifestTarget(activeRun, target, report.issues);
				}
			}
		}
	}
}
function hasSessionIssue(report, code, sessionKey) {
	return report.issues.some((issue) => issue.code === code && issue.sessionKey === sessionKey);
}
function countAlreadyMigratedTranscriptEventsForImport(snapshot, record) {
	if (!snapshot) return;
	const normalizedKey = record.sessionKey;
	if (snapshot.sessionIdsBySessionKey.get(normalizedKey) !== record.entry.sessionId) return;
	return snapshot.transcriptEventCountsBySessionId.get(record.entry.sessionId) ?? 0;
}
function countTranscriptEvents(record) {
	return countTranscriptEventsForPath(record.transcriptPath);
}
function readLegacyTranscriptMtimeMs(record) {
	if (!record.transcriptPath) return;
	try {
		const mtimeMs = Math.floor(fs.statSync(record.transcriptPath).mtimeMs);
		return Number.isFinite(mtimeMs) && mtimeMs >= 0 ? mtimeMs : void 0;
	} catch {
		return;
	}
}
function createMigrationTargetInput(target) {
	return {
		agentId: target.agentId,
		sqlitePath: canonicalMigrationFilePath(resolveTargetSqlitePath(target)),
		storePath: canonicalMigrationFilePath(target.storePath)
	};
}
//#endregion
export { reconcileDoctorSessionSqlitePublication, runDoctorSessionSqlite, settleRetainedDoctorSessionSources };
