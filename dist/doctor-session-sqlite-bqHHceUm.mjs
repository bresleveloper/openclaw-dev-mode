import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as FsSafeError } from "./fs-safe-BUXBSN-4.mjs";
import { c as readFileDescriptorBoundedSync } from "./boundary-file-read-CCth2Hwg.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-CAv_plX7.mjs";
import { r as isPathInside$1 } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as resolveSqliteDatabaseFilePaths, n as hasOrphanedSqliteSidecars } from "./sqlite-files-BEC3zbaw.mjs";
import { s as getCanonicalSqliteNamedIndexContracts } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-B4yBUiAP.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-GtqcmwG3.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BcJs-SM4.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { a as isPrimarySessionTranscriptFileName, m as resolveTrajectoryPointerPath, p as resolveTrajectoryPath } from "./artifacts-BvSTVPj-.mjs";
import { s as resolveSessionFilePathCore } from "./paths-dpReqUI8.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as markLegacyMigrationSourceRemovedInDatabase } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { c as readDeferredPluginMigrations, m as withDeferredPluginMigrationsCurrent, t as DeferredPluginMigrationConflictError, u as recordDeferredPluginMigrations } from "./deferred-plugin-migrations-by1ypkxx.mjs";
import { c as normalizePluginId, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { C as inspectSqliteRecoveryFiles, w as moveSqliteFilesAside } from "./agent-database-admission-dWNS6Rcs.mjs";
import { o as ensureOpenClawAgentDatabasePermissions } from "./openclaw-agent-db-schema-kFBuwbLx.mjs";
import { u as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
import { i as closeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { n as clearOpenClawAgentDatabaseOpenFailure, o as isOpenClawAgentDatabaseOpen } from "./openclaw-agent-db-DBug3LUA.mjs";
import { r as loadExactSessionEntryCandidates } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, i as resolveAllAgentSessionStoreCandidateTargetsSync, r as resolveAgentSessionStoreTargetsSync, s as resolveConfiguredAgentDatabaseTargets, u as resolveSessionStoreTargets } from "./targets-BbcRkdUC.mjs";
import { u as prepareLegacyAcpMigrationSource } from "./session-accessor.sqlite-acp-provenance-tjrzB-wk.mjs";
import { r as migrateOpenClawAgentDatabaseForMaintenance, t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-CYe8pVkd.mjs";
import { i as hasSqliteFileFamily, n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-BRLBtW0y.mjs";
import { C as moveMigrationArtifact, E as statMigrationPath, T as sameMigrationArtifact, a as collectRecordedConsumedArchives, b as writeSessionSqliteMigrationManifest, c as findLatestFailedSessionSqliteMigrationManifest, d as listSessionSqliteMigrationManifestPaths, f as migrationMoveKey, g as resolveSessionSqliteMigrationRunsDir, h as recordPlannedMigrationMoves, i as canonicalMigrationFilePath, l as hasSymbolicLinkInDirectoryPath, m as recordCompletedMigrationMoves, n as assertSafeSessionSqliteMigrationDirectory, o as createSessionSqliteMigrationRun, p as readSessionSqliteMigrationManifest, r as assertSafeSessionSqliteMigrationMove, s as filterRestoreManifestTargets, t as HISTORICAL_IMPORT_REASON, u as isRegularFileWithoutFollowingSymlinks, v as uniqueRestoreMoves, w as readMigrationArtifactIdentity, y as updateMigrationManifestTarget } from "./session-sqlite-migration-manifest-CT3ckmkL.mjs";
import { a as collectHistoricalArchiveSources, c as readLegacySessionRecords, i as appendLegacyHistoricalTranscripts, l as collectRecoveryInventory, n as settleDuplicateSessionSqliteArchives, o as gatherLegacyArchiveCoverage, r as validateLegacySessionRecords, s as listUnreferencedJsonlFiles } from "./doctor-session-sqlite-retirement-Dys60oeq.mjs";
import { c as listLegacySessionTranscriptFiles, d as shouldFilterLegacySessionRecordsByTarget, s as isLegacySessionRecordOwnedByTarget, t as verifyCanonicalSessionTranscriptSources } from "./session-sqlite-transcript-verification-9Tj6tF5J.mjs";
import { a as readLegacyPrimaryTranscriptIdentity, c as readSqliteEntryCount, d as resolveTargetSqlitePath, f as scanReadOnlySqliteActiveTranscriptFiles, i as projectExistingAgentDatabaseTargets, l as readTranscriptFingerprint, n as createTranscriptEventReader, o as readOnlySqliteDbStats, s as readOnlySqliteValidationSnapshot, t as countTranscriptEventsForPath, u as resolveTargetSqliteOptions } from "./session-sqlite-migration-readers-D3juTq9n.mjs";
import { o as normalizePersistedSessionEntryShape } from "./state-migrations.legacy-session-store-DYPAi0qW.mjs";
import { n as assertDoctorSqliteMaintenancePathsNotAliased, r as isDestructiveDoctorSessionSqliteMode } from "./doctor-sqlite-maintenance-lock-B-Ck8335.mjs";
import { c as readStaleDeferredPluginSessionImport, f as resolveVerifiedSessionSource, h as importSqliteSessionRowsBatch, i as prepareSessionSourceVerification, l as rebuildDeferredPluginSessionSourceIndex, m as captureDeferredPluginSessionSources, n as hasDeferredPluginSessionImport, o as readDeferredPluginSessionImport, p as DeferredPluginSessionImportSchema, s as readDeferredPluginSessionImportReceipt, t as deferredPluginSessionStoreIds, u as recordDeferredPluginSessionImport } from "./deferred-plugin-session-sources-C_VL59cB.mjs";
import { t as withAgentDatabaseMaintenanceLease } from "./openclaw-agent-db-maintenance-lease-Dvppzhox.mjs";
import { i as writeSessionSqliteMigrationFailureReports, r as createSessionSqliteMigrationFailureIssue } from "./doctor-session-sqlite-failure-DF5_dSiG.mjs";
import { i as isRetainedSourceIssue, n as createDoctorSessionSqliteTargetReport, r as isInformationalMissingSessionIndex, t as countBlockingSessionSqliteIssues } from "./doctor-session-sqlite-types-CchNvmQZ.mjs";
import { n as compactDoctorSqliteFile } from "./doctor-sqlite-compact-CFxC8S-a.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { isDeepStrictEqual } from "node:util";
import { createHash } from "node:crypto";
import { safeStatSync } from "@openclaw/fs-safe/path";
import { setImmediate } from "node:timers/promises";
//#region src/commands/doctor-session-sqlite-compact.ts
/** Runs doctor-owned SQLite file compaction for migrated session stores. */
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
		dbSizeBytes: safeStatSync(sqlitePath)?.size ?? 0,
		walSizeBytes: safeStatSync(`${sqlitePath}-wal`)?.size ?? 0
	};
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
	const sum = (value) => targets.reduce((total, target) => total + value(target), 0);
	const archives = (paths) => new Set(targets.flatMap(paths)).size;
	const sqliteEntries = /* @__PURE__ */ new Map();
	for (const target of targets) sqliteEntries.set(target.sqlitePath, Math.max(sqliteEntries.get(target.sqlitePath) ?? 0, target.sqliteEntries));
	const reportsArchival = mode !== "restore" && mode !== "recover";
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
		totals: {
			...reportsArchival ? { archivedLegacyStoreFiles: archives((target) => target.archivedLegacyStoreFiles ?? []) } : {},
			archivedTranscriptFiles: archives((target) => target.archivedTranscriptFiles),
			archivedUnreferencedJsonlFiles: archives((target) => target.archivedUnreferencedJsonlFiles),
			importedEntries: sum((target) => target.importedEntries),
			importedTranscriptEvents: sum((target) => target.importedTranscriptEvents),
			issues: sum((target) => target.issues.length),
			legacyEntries: sum((target) => target.legacyEntries),
			...reportsArchival ? { reclaimedBytes: sum((target) => target.compact?.reclaimedBytes ?? 0) } : {},
			sqliteEntries: [...sqliteEntries.values()].reduce((total, count) => total + count, 0),
			targets: targets.length,
			unreferencedJsonlFiles: sum((target) => target.unreferencedJsonlFiles.length),
			validatedEntries: sum((target) => target.validatedEntries),
			validatedTranscriptEvents: sum((target) => target.validatedTranscriptEvents)
		}
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
			const verify = (mode = "contained") => verifyCanonicalSessionTranscriptSources({
				target,
				sources,
				env: params.env,
				mode
			});
			let verified = verify("appendable");
			if (!verified) throw new Error("Missing history requires legacy format or branch repair before it can be appended");
			if (verified.missingEvents > 0) {
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
					events: verified.events,
					sqliteEvents: verified.sqliteEvents
				}
			});
		} catch (error) {
			params.report.issues.push({
				code: "active_sqlite_transcript_verification_failed",
				sessionKey: source.sessionKey,
				message: `${source.transcriptPath}: ${formatErrorMessage(error)}. Original retained. Compare the named events with a verified backup, restore a corrected JSONL at this path, then rerun openclaw doctor --session-sqlite recover.`
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
	const sourcePath = path.join(resolveRealpathOrAbsolute(path.dirname(sourcePathRaw)), path.basename(sourcePathRaw));
	const sessionsDir = resolveRealpathOrAbsolute(path.dirname(path.resolve(params.target.storePath)));
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
	const storeDir = resolveRealpathOrAbsolute(path.dirname(path.resolve(storePath)));
	return path.join(path.dirname(storeDir), "session-sqlite-import-archive");
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
//#endregion
//#region src/commands/doctor-session-sqlite-import.ts
const SESSION_IMPORT_BATCH_SIZE = 256;
async function importLegacySessionRecords({ target, env, expectedIndexIdentity, recoveryInventory }, records, report, activeRun) {
	if (records.length === 0) return;
	try {
		const recoveryHistoryUnverified = Boolean(recoveryInventory?.report.artifacts.some((artifact) => ["unreadable-manifest", "manifest-directory-alias"].includes(artifact.reason)));
		let assertRestoredIndexCurrent;
		try {
			if (!recoveryHistoryUnverified) assertRestoredIndexCurrent = prepareRestoredSessionIndex({
				target,
				env,
				expectedIndexIdentity,
				recoveryInventory
			});
		} catch (error) {
			report.issues.push({
				code: "legacy_import_deferred",
				message: `${formatErrorMessage(error)}. Originals retained; preserve the files and receipts, restore verified recovery evidence, then rerun openclaw doctor --fix.`
			});
			return;
		}
		const importedTranscriptSources = /* @__PURE__ */ new Set();
		const existingSnapshot = readOnlySqliteValidationSnapshot(target);
		if (!existingSnapshot.ok) {
			report.issues.push({
				code: "legacy_import_deferred",
				message: `Cannot verify the destination for ${target.storePath}: ${formatErrorMessage(existingSnapshot.error)}. Originals retained; repair the named SQLite destination before retrying openclaw doctor --fix.`
			});
			return;
		}
		for (let offset = 0; offset < records.length; offset += SESSION_IMPORT_BATCH_SIZE) {
			const pending = records.slice(offset, offset + SESSION_IMPORT_BATCH_SIZE).flatMap((record) => {
				record.preserveCurrentSession ||= recoveryHistoryUnverified || Boolean(assertRestoredIndexCurrent);
				try {
					const prepared = prepareLegacySessionImport(target, record, report, importedTranscriptSources, existingSnapshot.snapshot, env, recoveryHistoryUnverified);
					return prepared ? [{
						...prepared,
						params: {
							...prepared.params,
							env
						},
						record
					}] : [];
				} catch (error) {
					report.issues.push({
						code: "legacy_import_deferred",
						sessionKey: record.sessionKey,
						message: `${record.transcriptPath ?? target.storePath}: ${formatErrorMessage(error)}. Original retained; verify this source against a backup and rerun openclaw doctor --fix.`
					});
					return [];
				}
			});
			const imported = await importSqliteSessionRowsBatch(pending.map((entry, index) => ({
				...entry.params,
				...index === 0 && assertRestoredIndexCurrent ? { beforePersistentApply: assertRestoredIndexCurrent } : {}
			})));
			for (const [index, result] of imported.entries()) {
				const record = pending[index]?.record;
				const recovery = pending[index]?.recovery ?? result.recovery;
				if (record && recovery) record.recovery = recovery;
			}
			report.importedEntries += imported.length;
			report.importedTranscriptEvents += imported.reduce((total, result) => total + result.transcriptEvents, 0);
			report.issues.push(...pending.flatMap((entry) => entry.issue ? [entry.issue] : []));
			await setImmediate();
		}
	} catch (error) {
		const failures = [error];
		report.issues.push({
			code: "sqlite_import_failed",
			message: formatErrorMessage(error)
		});
		if (activeRun) {
			activeRun.manifest.failedAt = (/* @__PURE__ */ new Date()).toISOString();
			try {
				updateMigrationManifestTarget(activeRun, report, report.issues);
			} catch (recordError) {
				failures.push(recordError);
			}
		}
		if (failures.length > 1) throw new AggregateError(failures, `${formatErrorMessage(error)}; could not record session SQLite migration failure: ${formatErrorMessage(failures[1])}`, { cause: error });
		throw error;
	}
}
function prepareRestoredSessionIndex(params) {
	const { expectedIndexIdentity, recoveryInventory, target } = params;
	if (!expectedIndexIdentity || !recoveryInventory) return;
	const storePath = canonicalMigrationFilePath(target.storePath);
	const sqlitePath = resolveTargetSqlitePath(target, params.env);
	const evidence = /* @__PURE__ */ new Map();
	let hasSelectedOwner = false;
	for (const refs of recoveryInventory.references.values()) for (const ref of refs) {
		if (ref.move.kind !== "legacy-store" || ref.move.sourcePath !== storePath || !ref.consumedByRestore && !ref.run.manifest.restore?.restoredFiles.includes(storePath) && !ref.target.completedMoves.some((move) => migrationMoveKey(move) === migrationMoveKey(ref.move))) continue;
		const artifact = ref.move.artifact;
		if (!artifact) {
			assertSafeSessionSqliteMigrationMove(ref.move, ref.target);
			if (statMigrationPath(ref.move.archivePath)) {
				const archiveIdentity = readMigrationArtifactIdentity(ref.move.archivePath);
				if (archiveIdentity.size !== expectedIndexIdentity.size || archiveIdentity.sha256 !== expectedIndexIdentity.sha256) continue;
				evidence.set(ref.move.archivePath, archiveIdentity);
			}
		}
		if (artifact && (artifact.identity.dev !== expectedIndexIdentity.dev || artifact.identity.ino !== expectedIndexIdentity.ino)) continue;
		const selectedOwner = filterRestoreManifestTargets(ref.run.manifest, [{
			agentId: target.agentId,
			storePath,
			sqlitePath
		}]).includes(ref.target);
		if (artifact && (!sameMigrationArtifact(artifact.identity, expectedIndexIdentity) || !ref.consumedByRestore || artifact.disposal.state !== "retained") || ref.target.storePath !== storePath || ref.target.agentId === target.agentId && !selectedOwner) throw new Error(`Restored session index evidence cannot be verified: ${storePath}`);
		assertSafeSessionSqliteMigrationMove(ref.move, ref.target);
		const identity = readMigrationArtifactIdentity(ref.run.manifestPath);
		if (JSON.stringify(readSessionSqliteMigrationManifest(ref.run.manifestPath)) !== JSON.stringify(ref.run.manifest) || !sameMigrationArtifact(identity, readMigrationArtifactIdentity(ref.run.manifestPath))) throw new Error(`Session restore receipt changed: ${ref.run.manifestPath}`);
		evidence.set(ref.run.manifestPath, identity);
		hasSelectedOwner ||= selectedOwner;
	}
	if (evidence.size === 0) return;
	if (!hasSelectedOwner) throw new Error(`Restored session index evidence cannot be verified: ${storePath}`);
	const assertCurrent = () => {
		for (const filePath of [
			storePath,
			sqlitePath,
			...evidence.keys()
		]) if (hasSymbolicLinkInDirectoryPath(path.dirname(filePath))) throw new Error(`Session restore path changed: ${filePath}`);
		for (const [filePath, identity] of [[storePath, expectedIndexIdentity], ...evidence]) if (!sameMigrationArtifact(identity, readMigrationArtifactIdentity(filePath))) throw new Error(`Session restore source or receipt changed: ${filePath}`);
	};
	assertCurrent();
	return assertCurrent;
}
function prepareLegacySessionImport(target, record, report, importedTranscriptSources, existingSnapshot, env, recoveryHistoryUnverified) {
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
	const result = countTranscriptEventsForPath(record.transcriptPath);
	const currentOwner = existingSnapshot?.sessionKeysBySessionId.get(record.entry.sessionId);
	if (record.preserveCurrentSession && currentOwner && currentOwner !== record.sessionKey) throw new Error(`Historical transcript ${record.entry.sessionId} already belongs to ${currentOwner}`);
	if (recoveryHistoryUnverified && result.status === "malformed" && (existingSnapshot?.transcriptEventCountsBySessionId.get(record.entry.sessionId) ?? 0) > 0) throw new Error(result.message);
	const transcriptMtimeMs = readLegacyTranscriptMtimeMs(record);
	const normalizedEntry = normalizePersistedSessionEntryShape(record.entry, { sessionKey: record.sessionKey });
	const params = {
		historicalOnly: Boolean(record.historical || record.preserveCurrentSession),
		allowMalformedRowRepair: true,
		repairLegacyTranscript: true,
		agentId: target.agentId,
		entry: {
			...normalizedEntry ?? record.entry,
			sessionId: record.entry.sessionId
		},
		...!record.historical && normalizedEntry?.acp ? { legacyAcpMigrationSource: prepareLegacyAcpMigrationSource({
			sourcePath: target.storePath,
			sourceSessionKey: record.sessionKey,
			sessionId: normalizedEntry.sessionId,
			lifecycleRevision: normalizedEntry.lifecycleRevision,
			meta: normalizedEntry.acp
		}) } : {},
		preserveExactStoredKey: true,
		sessionKey: record.sessionKey,
		storePath: target.sqlitePath ?? target.storePath
	};
	let recovery;
	if (result.status === "missing") {
		if (markAlreadyMigratedTranscript(record, report, existingSnapshot)) return;
		return {
			issue: {
				code: "transcript_missing",
				message: `Transcript file is missing: ${record.transcriptPath}`,
				sessionKey: record.sessionKey
			},
			params,
			recovery
		};
	}
	if (result.status === "ok" && transcriptFingerprint && record.transcriptPath && (existingSnapshot?.transcriptEventCountsBySessionId.get(record.entry.sessionId) ?? 0) > 0) try {
		const verified = verifyCanonicalSessionTranscriptSources({
			target: {
				...target,
				sqlitePath: report.sqlitePath
			},
			sources: [{
				path: record.transcriptPath,
				sessionId: record.entry.sessionId,
				originalPath: record.historical?.originalPath ?? record.transcriptPath
			}],
			env,
			mode: "appendable"
		});
		if (!verified) throw new Error("Missing history requires legacy format or branch repair before it can be appended");
		if (verified.missingEvents === 0) recovery = {
			complete: true,
			repaired: false,
			events: verified.events,
			sqliteEvents: verified.sqliteEvents
		};
	} catch (error) {
		report.issues.push({
			code: recoveryHistoryUnverified ? "legacy_import_deferred" : "sqlite_transcript_count_mismatch",
			sessionKey: record.sessionKey,
			message: `${record.transcriptPath}: ${formatErrorMessage(error)}. Original retained. Compare the named events with a verified backup, restore a corrected JSONL at this path, then rerun openclaw doctor --session-sqlite recover.`
		});
		return;
	}
	if (transcriptSourceKey) importedTranscriptSources.add(transcriptSourceKey);
	return {
		recovery,
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
	if (!snapshot || snapshot.sessionIdsBySessionKey.get(record.sessionKey) !== record.entry.sessionId) return false;
	report.validatedEntries += 1;
	report.validatedTranscriptEvents += snapshot.transcriptEventCountsBySessionId.get(record.entry.sessionId) ?? 0;
	return true;
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
//#region src/commands/doctor-session-sqlite-restore.ts
async function restoreSessionSqliteMigrationRuns(params) {
	const restoreReport = emptyRestoreReport();
	const contexts = loadRestoreManifestContexts(listSessionSqliteMigrationManifestPaths(params.env).toReversed(), params.trustedTargets);
	await reconcileRestorePublications(contexts, params.env);
	const restorePlan = createRestorePlan(contexts);
	for (const { manifest, manifestPath, targets } of contexts) {
		const manifestRestoreReport = {
			...emptyRestoreReport(),
			manifestPaths: [manifestPath]
		};
		restoreReport.manifestPaths.push(manifestPath);
		await restoreSessionSqliteMigrationManifest(manifest, manifestPath, targets, manifestRestoreReport, restorePlan);
		restoreReport.conflicts.push(...manifestRestoreReport.conflicts);
		restoreReport.restoredFiles.push(...manifestRestoreReport.restoredFiles);
		restoreReport.skippedFiles.push(...manifestRestoreReport.skippedFiles);
		writeSessionSqliteMigrationManifest({
			manifest,
			manifestPath
		});
	}
	return restoreReport;
}
/** Undo only recorded, still-linked publication intermediates before a fresh import or restore. */
async function reconcileSessionSqliteMigrationPublications(params) {
	await reconcileRestorePublications(loadRestoreManifestContexts(listSessionSqliteMigrationManifestPaths(params.env), params.trustedTargets), params.env, params.sourcePath);
}
async function reconcileRestorePublications(contexts, env, sourcePath) {
	const stateDir = path.dirname(canonicalMigrationFilePath(path.join(resolveStateDir(env), "anchor")));
	for (const context of contexts) for (const target of context.targets) for (const move of uniqueRestoreMoves(target)) {
		if (sourcePath && canonicalMigrationFilePath(sourcePath) !== move.sourcePath || !move.artifact || move.artifact.disposal.state !== "retained") continue;
		const source = statMigrationPath(move.sourcePath);
		const archive = statMigrationPath(move.archivePath);
		if (!source || !archive) continue;
		if (!source.isFile() || !archive.isFile() || source.dev !== archive.dev || source.ino !== archive.ino) continue;
		if (source.nlink !== 2 || archive.nlink !== 2) continue;
		if (![
			target.storePath,
			target.sqlitePath,
			move.archivePath
		].every((file) => isPathInside$1(stateDir, file))) continue;
		assertSafeSessionSqliteMigrationMove(move, target);
		assertDoctorSqliteMaintenancePathsNotAliased("session recovery publication", [context.manifestPath, ...resolveSqliteDatabaseFilePaths(target.sqlitePath)], [stateDir]);
		await moveMigrationArtifact(move.archivePath, move.sourcePath, readRestoreArchiveIdentity(move, 2n), () => {
			assertSafeSessionSqliteMigrationMove(move, target);
			recordRestoredMigrationMove(context.manifest, context.manifestPath, move);
		});
	}
}
function recordRestoredMigrationMove(manifest, manifestPath, move) {
	requireDirectorySync(syncDirectorySync(path.dirname(path.dirname(move.sourcePath))), "Restored session directory");
	const consumed = collectRecordedConsumedArchives(manifest);
	consumed.add(move.archivePath);
	manifest.restore = {
		attemptedAt: (/* @__PURE__ */ new Date()).toISOString(),
		consumedArchives: [...consumed].toSorted(),
		conflicts: [],
		restoredFiles: [.../* @__PURE__ */ new Set([...manifest.restore?.restoredFiles ?? [], move.sourcePath])],
		skippedFiles: [],
		status: "restored"
	};
	writeSessionSqliteMigrationManifest({
		manifest,
		manifestPath
	});
}
function loadRestoreManifestContexts(manifestPaths, trustedTargets) {
	const contexts = [];
	for (const manifestPath of manifestPaths) {
		const stat = statMigrationPath(manifestPath);
		const manifest = stat?.isFile() && stat.nlink === 1 && !hasSymbolicLinkInDirectoryPath(path.dirname(manifestPath)) ? readSessionSqliteMigrationManifest(manifestPath) : void 0;
		if (!manifest) continue;
		const targets = filterRestoreManifestTargets(manifest, trustedTargets);
		if (targets.length > 0) contexts.push({
			manifest,
			manifestPath,
			targets
		});
	}
	return contexts;
}
/**
* Resolve every duplicate destination before moving an archive. A missing archive only disappears
* from the conflict set when its own manifest proves that an earlier restore consumed it.
*/
function createRestorePlan(contexts) {
	const plan = /* @__PURE__ */ new Map();
	const candidatesBySource = /* @__PURE__ */ new Map();
	for (const context of contexts) {
		const consumedArchives = collectRecordedConsumedArchives(context.manifest);
		for (const target of context.targets) for (const move of uniqueRestoreMoves(target)) {
			if (move.artifact && move.artifact.disposal.state !== "retained") {
				plan.set(restoreMovePlanKey(context.manifestPath, move), {
					action: "conflict",
					reason: move.artifact.disposal.state === "disposed" ? "rollback original was intentionally disposed by update cleanup" : "rollback original has pending cleanup; finish cleanup before restore"
				});
				continue;
			}
			const candidates = candidatesBySource.get(move.sourcePath) ?? [];
			candidates.push({
				consumed: consumedArchives.has(move.archivePath),
				context,
				move
			});
			candidatesBySource.set(move.sourcePath, candidates);
		}
	}
	for (const [sourcePath, candidates] of candidatesBySource) {
		if (fs.existsSync(sourcePath) || candidates.length === 1) {
			for (const candidate of candidates) plan.set(restoreMovePlanKey(candidate.context.manifestPath, candidate.move), { action: "standard" });
			continue;
		}
		const available = [];
		let blocked = false;
		for (const candidate of candidates) {
			const key = restoreMovePlanKey(candidate.context.manifestPath, candidate.move);
			const inspection = inspectRestoreArchive(candidate.move);
			if (inspection.state === "available") {
				available.push({
					...candidate,
					snapshot: inspection.snapshot
				});
				continue;
			}
			if (inspection.state === "missing" && candidate.consumed) {
				plan.set(key, { action: "skip-consumed" });
				continue;
			}
			blocked = true;
			plan.set(key, {
				action: "conflict",
				reason: inspection.state === "missing" ? "archive is missing without a recorded prior restore; refusing another candidate" : inspection.reason
			});
		}
		if (blocked) {
			for (const candidate of available) plan.set(restoreMovePlanKey(candidate.context.manifestPath, candidate.move), {
				action: "conflict",
				reason: "another archive for this source is unavailable without prior restore evidence; refusing automatic selection"
			});
			continue;
		}
		if (available.length === 0) continue;
		if (new Set(available.map((candidate) => candidate.move.kind)).size !== 1) {
			setRestoreCandidateConflicts(plan, available, "recorded archives disagree on artifact kind; refusing automatic selection");
			continue;
		}
		const winner = selectRestoreCandidate(available);
		if (!winner) {
			setRestoreCandidateConflicts(plan, available, available[0]?.move.kind === "legacy-store" ? "multiple distinct nonempty session indexes require explicit archive selection" : "multiple distinct archives require explicit archive selection");
			continue;
		}
		const winnerKey = restoreMovePlanKey(winner.context.manifestPath, winner.move);
		for (const candidate of available) {
			const candidateKey = restoreMovePlanKey(candidate.context.manifestPath, candidate.move);
			plan.set(candidateKey, candidateKey === winnerKey ? {
				action: "restore",
				snapshot: candidate.snapshot
			} : { action: "skip-superseded" });
		}
	}
	return plan;
}
function selectRestoreCandidate(candidates) {
	if (new Set(candidates.map((candidate) => candidate.snapshot.digest)).size === 1) return candidates[0];
	if (candidates[0]?.move.kind !== "legacy-store") return;
	const nonemptyDigests = new Set(candidates.filter((candidate) => (candidate.snapshot.legacyEntryCount ?? 0) > 0).map((candidate) => candidate.snapshot.digest));
	if (nonemptyDigests.size === 0) return candidates[0];
	return nonemptyDigests.size === 1 ? candidates.find((candidate) => (candidate.snapshot.legacyEntryCount ?? 0) > 0) : void 0;
}
function setRestoreCandidateConflicts(plan, candidates, reason) {
	for (const candidate of candidates) plan.set(restoreMovePlanKey(candidate.context.manifestPath, candidate.move), {
		action: "conflict",
		reason
	});
}
function restoreMovePlanKey(manifestPath, move) {
	return `${manifestPath}\u0000${migrationMoveKey(move)}`;
}
function inspectRestoreArchive(move) {
	if (hasSymbolicLinkInDirectoryPath(path.dirname(move.archivePath))) return {
		state: "invalid",
		reason: "archive parent is a symbolic link; refusing restore"
	};
	let pathStat;
	try {
		pathStat = fs.lstatSync(move.archivePath);
	} catch (error) {
		const code = isRecord(error) ? error.code : void 0;
		return code === "ENOENT" || code === "ENOTDIR" ? { state: "missing" } : {
			state: "invalid",
			reason: "archive could not be inspected; refusing restore"
		};
	}
	if (!pathStat.isFile()) return {
		state: "invalid",
		reason: "archive is not a regular file; refusing restore"
	};
	const changed = {
		state: "invalid",
		reason: "archive changed while it was inspected; refusing restore"
	};
	let fd;
	try {
		const flags = process.platform === "win32" ? "r" : fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0) | (fs.constants.O_NONBLOCK ?? 0);
		fd = fs.openSync(move.archivePath, flags);
		const descriptorStat = fs.fstatSync(fd);
		if (!descriptorStat.isFile() || descriptorStat.dev !== pathStat.dev || descriptorStat.ino !== pathStat.ino) return changed;
		let digest;
		let legacyEntryCount;
		if (move.kind === "legacy-store") {
			const content = readFileDescriptorBoundedSync(fd, descriptorStat.size);
			digest = createHash("sha256").update(content).digest("hex");
			let parsed;
			try {
				parsed = JSON.parse(content.toString("utf-8"));
			} catch {
				return {
					state: "invalid",
					reason: "session index archive is not valid JSON; refusing automatic selection"
				};
			}
			if (!isRecord(parsed)) return {
				state: "invalid",
				reason: "session index archive is not a JSON object; refusing automatic selection"
			};
			legacyEntryCount = Object.keys(parsed).length;
		} else {
			const hashed = hashFileDescriptorSync(fd, descriptorStat.size);
			if (hashed.sizeBytes !== descriptorStat.size) throw new Error("archive changed while it was inspected");
			digest = hashed.sha256;
		}
		const finalPathStat = fs.lstatSync(move.archivePath);
		if (finalPathStat.dev !== descriptorStat.dev || finalPathStat.ino !== descriptorStat.ino || finalPathStat.size !== descriptorStat.size) return changed;
		return {
			state: "available",
			snapshot: {
				digest,
				...legacyEntryCount === void 0 ? {} : { legacyEntryCount },
				size: descriptorStat.size
			}
		};
	} catch (error) {
		if (move.kind !== "legacy-store" && error instanceof FsSafeError && error.code === "too-large") return changed;
		const code = isRecord(error) ? error.code : void 0;
		return code === "ENOENT" || code === "ENOTDIR" ? { state: "missing" } : {
			state: "invalid",
			reason: "archive could not be read safely; refusing restore"
		};
	} finally {
		if (fd !== void 0) fs.closeSync(fd);
	}
}
async function restoreSessionSqliteMigrationRun(params) {
	const restoreReport = {
		...emptyRestoreReport(),
		manifestPaths: [params.manifestPath]
	};
	const manifest = readSessionSqliteMigrationManifest(params.manifestPath);
	if (!manifest) {
		restoreReport.conflicts.push({
			archivePath: params.manifestPath,
			reason: "manifest is missing or unreadable",
			sourcePath: params.manifestPath
		});
		return restoreReport;
	}
	const targetManifests = filterRestoreManifestTargets(manifest, params.trustedTargets);
	if (targetManifests.length === 0) {
		restoreReport.conflicts.push({
			archivePath: params.manifestPath,
			reason: "manifest does not match a trusted session target",
			sourcePath: params.manifestPath
		});
		return restoreReport;
	}
	await reconcileRestorePublications([{
		manifest,
		manifestPath: params.manifestPath,
		targets: targetManifests
	}], params.env ?? process.env);
	await restoreSessionSqliteMigrationManifest(manifest, params.manifestPath, targetManifests, restoreReport, createRestorePlan([{
		manifest,
		manifestPath: params.manifestPath,
		targets: targetManifests
	}]));
	writeSessionSqliteMigrationManifest({
		manifest,
		manifestPath: params.manifestPath
	});
	return restoreReport;
}
function emptyRestoreReport() {
	return {
		conflicts: [],
		manifestPaths: [],
		restoredFiles: [],
		skippedFiles: []
	};
}
async function restoreSessionSqliteMigrationManifest(manifest, manifestPath, targets, restoreReport, restorePlan) {
	for (const target of targets) for (const move of uniqueRestoreMoves(target)) await restoreMigrationMove({
		manifest,
		manifestPath,
		target,
		move,
		restorePlan,
		restoreReport
	});
	const consumedArchives = collectRecordedConsumedArchives(manifest);
	manifest.restore = {
		attemptedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...consumedArchives.size > 0 ? { consumedArchives: [...consumedArchives].toSorted() } : {},
		conflicts: restoreReport.conflicts,
		restoredFiles: restoreReport.restoredFiles,
		skippedFiles: restoreReport.skippedFiles,
		status: resolveRestoreStatus(restoreReport)
	};
}
function readRestoreArchiveIdentity(move, expectedLinks = 1n) {
	const identity = readMigrationArtifactIdentity(move.archivePath, expectedLinks);
	if (move.artifact && !sameMigrationArtifact(identity, move.artifact.identity, { ignoreDevice: true })) throw new Error("archive identity or contents changed; refusing restore");
	return identity;
}
async function restoreMigrationMove(params) {
	const { manifest, manifestPath, target, move, restorePlan, restoreReport } = params;
	const recordConflict = (reason) => {
		restoreReport.conflicts.push({
			archivePath: move.archivePath,
			reason,
			sourcePath: move.sourcePath
		});
	};
	const planned = restorePlan.get(restoreMovePlanKey(manifestPath, move)) ?? { action: "standard" };
	if (planned.action === "conflict") {
		recordConflict(planned.reason);
		return;
	}
	if (planned.action === "skip-consumed" || planned.action === "skip-superseded") {
		restoreReport.skippedFiles.push(move.sourcePath);
		return;
	}
	const sourceExists = statMigrationPath(move.sourcePath) !== void 0;
	const archiveExists = statMigrationPath(move.archivePath) !== void 0;
	if (sourceExists || !archiveExists) {
		if (sourceExists && !archiveExists) restoreReport.skippedFiles.push(move.sourcePath);
		else recordConflict(sourceExists ? "source and archive both exist; refusing to overwrite source" : "source and archive are both missing");
		return;
	}
	try {
		if (!isRegularFileWithoutFollowingSymlinks(move.archivePath)) throw new Error("archive is not a regular file; refusing restore");
		assertRestoreDirectories(move);
		fs.mkdirSync(path.dirname(move.sourcePath), {
			recursive: true,
			mode: 448
		});
		assertRestoreDirectories(move);
		const identity = readRestoreArchiveIdentity(move);
		if (planned.action === "restore" && (identity.sha256 !== planned.snapshot.digest || identity.size !== planned.snapshot.size)) throw new Error("archive changed after restore planning; refusing restore");
		if (!move.artifact) {
			move.artifact = {
				identity,
				classification: "protected",
				reason: "historical-restore-original",
				dependencies: move.kind === "legacy-store" ? uniqueRestoreMoves(target).filter((item) => item.kind === "transcript").map((item) => item.sourcePath) : [],
				disposal: { state: "retained" }
			};
			for (const recorded of [...target.plannedMoves, ...target.completedMoves]) if (migrationMoveKey(recorded) === migrationMoveKey(move)) recorded.artifact = move.artifact;
			writeSessionSqliteMigrationManifest({
				manifest,
				manifestPath
			});
		}
		await moveMigrationArtifact(move.archivePath, move.sourcePath, identity, () => {
			assertRestoreDirectories(move);
			recordRestoredMigrationMove(manifest, manifestPath, move);
		});
		restoreReport.restoredFiles.push(move.sourcePath);
	} catch (error) {
		recordConflict(error instanceof Error ? error.message : String(error));
	}
}
function assertRestoreDirectories(move) {
	if (hasSymbolicLinkInDirectoryPath(path.dirname(move.sourcePath)) || hasSymbolicLinkInDirectoryPath(path.dirname(move.archivePath))) throw new Error("source or archive parent is a symbolic link; refusing restore");
}
function resolveRestoreStatus(report) {
	if (report.conflicts.length > 0 && report.restoredFiles.length > 0) return "partial";
	if (report.conflicts.length > 0) return "conflicts";
	if (report.restoredFiles.length > 0) return "restored";
	return "noop";
}
//#endregion
//#region src/commands/doctor-session-sqlite-recover-report.ts
const CANONICAL_AGENT_INDEX_NAMES = getCanonicalSqliteNamedIndexContracts(OPENCLAW_AGENT_SCHEMA_SQL).map((index) => index.name);
/** Restores the latest failed migration run and validates only selected manifest targets. */
async function recoverDoctorSessionSqliteTargets(params) {
	const trustedTargets = params.targets.map((target) => ({
		...target,
		sqlitePath: resolveTargetSqlitePath(target, params.env)
	}));
	const failedRun = findLatestFailedSessionSqliteMigrationManifest(params.env, trustedTargets);
	if (!failedRun) {
		const recoveredCorruptTargets = await withAgentDatabaseMaintenanceLease({ env: params.env }, (maintenance) => recoverCorruptSqliteTargets(params.targets, params.env, maintenance));
		const retainedReports = [...recoveredCorruptTargets];
		for (const target of trustedTargets) {
			const recovered = recoveredCorruptTargets.find((report) => report.sqlitePath === target.sqlitePath);
			if (recovered && recovered.issues.length > 0) continue;
			try {
				const preparation = await params.prepareTarget?.(target);
				if (recovered) continue;
				if (hasDeferredPluginSessionImport({
					target,
					sqlitePath: target.sqlitePath,
					env: params.env
				}) || readActiveSqliteTranscriptFiles(target).length > 0 || params.historicalArchiveStores?.has(target.storePath)) retainedReports.push(await params.validateTarget(target));
				else if (preparation?.repaired) retainedReports.push(createEmptyRecoverTargetReport(target, target.sqlitePath));
			} catch (error) {
				retainedReports.push(createRecoverInspectionFailureTargetReport(target, target.sqlitePath, error));
			}
		}
		if (retainedReports.length > 0 || params.recoveryInventory && !params.recoveryInventory.report.artifacts.some((artifact) => artifact.outcome === "blocked" || artifact.reason === "unsupported-target-ownership")) return summarizeDoctorSessionSqliteReport("recover", retainedReports);
		return summarizeDoctorSessionSqliteReport("recover", [createSyntheticRecoverTargetReport(params.env, "No failed session SQLite migration manifest found.")]);
	}
	const restore = await restoreSessionSqliteMigrationRun({
		env: params.env,
		manifestPath: failedRun.manifestPath,
		trustedTargets
	});
	const targetReports = [];
	const recoveryTargets = trustedTargets.filter((target) => failedRun.targets.some((failed) => failed.agentId === target.agentId && failed.storePath === target.storePath) || params.historicalArchiveStores?.has(target.storePath));
	for (const manifestTarget of recoveryTargets) try {
		await params.prepareTarget?.(manifestTarget);
		targetReports.push(await params.validateTarget({
			agentId: manifestTarget.agentId,
			sqlitePath: manifestTarget.sqlitePath,
			storePath: manifestTarget.storePath
		}));
	} catch (error) {
		targetReports.push(createRecoverInspectionFailureTargetReport(manifestTarget, manifestTarget.sqlitePath, error));
	}
	const reportTarget = targetReports[0] ?? createSyntheticRecoverTargetReport(params.env, failedRun.manifestPath);
	reportTarget.restore = restore;
	reportTarget.issues.push(...restore.conflicts.map((conflict) => ({
		code: "restore_conflict",
		message: `${conflict.sourcePath}: ${conflict.reason}`
	})));
	const report = summarizeDoctorSessionSqliteReport("recover", targetReports.length > 0 ? targetReports : [reportTarget]);
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
//#endregion
//#region src/commands/doctor-session-sqlite-restore-report.ts
async function restoreDoctorSessionSqliteTargets(params) {
	const targetReports = params.targets.map((target) => createDoctorSessionSqliteTargetReport({
		agentId: target.agentId,
		sqliteEntries: readSqliteEntryCount(target),
		sqlitePath: resolveTargetSqlitePath(target),
		storePath: target.storePath
	}));
	const trustedTargets = params.targets.map((target) => ({
		...target,
		sqlitePath: resolveTargetSqlitePath(target)
	}));
	const restore = await restoreSessionSqliteMigrationRuns({
		env: params.env,
		trustedTargets
	});
	const reportTarget = targetReports[0] ?? createDoctorSessionSqliteTargetReport({
		agentId: "restore",
		sqlitePath: "",
		storePath: restore.manifestPaths[0] || resolveSessionSqliteMigrationRunsDir(params.env)
	});
	reportTarget.restore = restore;
	reportTarget.issues.push(...restore.conflicts.map((conflict) => ({
		code: "restore_conflict",
		message: `${conflict.sourcePath}: ${conflict.reason}`
	})));
	return summarizeDoctorSessionSqliteReport("restore", targetReports.length > 0 ? targetReports : [reportTarget]);
}
//#endregion
//#region src/commands/doctor-session-sqlite-retained.ts
/** Archival, not plugin completion alone, ends the original index's no-replay obligation. */
function retireDeferredPluginSessionImport(params) {
	const receipt = readDeferredPluginSessionImportReceipt(params);
	if (!receipt) return;
	const recorded = DeferredPluginSessionImportSchema.parse(JSON.parse(receipt.reportJson));
	if (recorded.superseded) return;
	const expectedPending = readDeferredPluginMigrations({ env: params.env });
	if (expectedPending.some((pending) => recorded.pluginIds.includes(pending.pluginId) && !params.completedPluginIds?.includes(pending.pluginId))) return;
	if (statMigrationPath(params.target.storePath) || recorded.sources.some((source) => statMigrationPath(source.path))) return;
	runOpenClawStateWriteTransaction(({ db }) => withDeferredPluginMigrationsCurrent({
		env: params.env,
		expectedPending
	}, () => {
		params.assertCurrent?.();
		if (!isDeepStrictEqual(readDeferredPluginSessionImportReceipt({
			...params,
			database: db
		}), receipt)) throw new Error("Deferred session import receipt changed before retirement.");
		if (statMigrationPath(params.target.storePath) || recorded.sources.some((source) => statMigrationPath(source.path))) return;
		readDeferredPluginSessionImport({
			cfg: params.cfg,
			env: params.env,
			target: params.target,
			sqlitePath: params.sqlitePath,
			database: db
		});
		markLegacyMigrationSourceRemovedInDatabase(db, receipt.sourceKey);
	}), { env: params.env }, { operationLabel: "state.retire-plugin-session-source" });
}
/** Receipt recovery belongs to offline Doctor; canonical session data is never replayed. */
async function prepareRetainedSessionImport(params, report) {
	const issues = report.issues;
	const isSqliteStore = params.target.storePath.endsWith(".sqlite");
	const sqlitePath = resolveTargetSqlitePath(params.target, params.env);
	if (!isSqliteStore && (params.mode === "import" || params.mode === "recover")) {
		const isHeld = createRetainedAgentDatabaseMatcher(params.env, () => resolveConfiguredAgentDatabaseTargets(params.cfg, { env: params.env }), {
			kind: "legacy-database",
			readDatabasePaths: () => [sqlitePath]
		});
		const disposition = isHeld(params.target.storePath, params.target.agentId) || isHeld(sqlitePath, params.target.agentId);
		if (disposition && (disposition !== "unavailable" || hasSqliteFileFamily(sqlitePath) || hasDeferredPluginSessionImport({
			target: {
				...params.target,
				sqlitePath
			},
			sqlitePath,
			env: params.env
		}))) {
			issues.push({
				code: "plugin_migration_source_retained",
				message: `Retained session sources skipped: store held for agent ${params.target.agentId} database ${sqlitePath}. Run openclaw doctor --fix for deletion-history repair and explicit restoration guidance.`
			});
			return;
		}
	}
	let retainedImport;
	const sourceConflicts = /* @__PURE__ */ new Map();
	const emptySources = /* @__PURE__ */ new Map();
	const sourceVerification = {
		...prepareSessionSourceVerification({
			...params,
			sqlitePath
		}),
		allowMissingIndex: true,
		onEmptySource: (sourcePath, reason) => emptySources.set(sourcePath, reason),
		onSourceConflict: (sourcePath, artifactPath = sourcePath, error) => {
			if (sourceConflicts.has(artifactPath)) return;
			const reason = error === void 0 ? "Retained plugin input no longer matches its verified source." : formatErrorMessage(error);
			sourceConflicts.set(sourcePath, reason);
			sourceConflicts.set(artifactPath, reason);
			issues.push({
				code: fs.existsSync(params.target.storePath) ? "retained_plugin_source_conflict" : "historical_transcript_deferred",
				message: `${artifactPath}: ${reason} Canonical SQLite sessions remain authoritative. Preserve this input and its backups. Restore the verified original at ${sourcePath}, then run openclaw doctor --session-sqlite recover --session-sqlite-all-agents against the same state/config.`
			});
		}
	};
	if (!isSqliteStore) try {
		if (params.mode === "import" || params.mode === "recover") {
			if (await rebuildDeferredPluginSessionSourceIndex(sourceVerification)) {
				if (!readStaleDeferredPluginSessionImport(sourceVerification)) issues.push({
					code: "retained_plugin_source_index_rebuilt",
					message: `Rebuilt the verified source index and database binding from the deferred import receipt: ${params.target.storePath}. Canonical SQLite sessions were not replayed.`
				});
			}
			retireDeferredPluginSessionImport(sourceVerification);
		}
		retainedImport = readDeferredPluginSessionImport(sourceVerification);
	} catch (error) {
		issues.push({
			code: "retained_plugin_source_conflict",
			message: formatErrorMessage(error)
		});
		return;
	}
	const staleImport = isSqliteStore ? void 0 : readStaleDeferredPluginSessionImport(sourceVerification);
	if (staleImport) {
		issues.push({
			code: "retained_plugin_receipt_superseded",
			message: `Session import receipt is bound to a different database (${staleImport.databaseIdentity}); it cannot certify ${sqlitePath}. ${staleImport.superseded ? "Preserved the superseded receipt in migration_runs." : "Doctor import will preserve and supersede it."} Retained originals will be checked against live session state without replacing current settings.`
		});
		for (const source of staleImport.sources) {
			if (!isPrimarySessionTranscriptFileName(path.basename(source.path))) continue;
			let detail = "";
			try {
				const current = statMigrationPath(source.path);
				if (current?.isFile() && current.size > 0) continue;
				if (resolveVerifiedSessionSource(source, sourceVerification.resolvedTarget, params.env)) continue;
			} catch (error) {
				detail = ` ${formatErrorMessage(error)}`;
			}
			issues.push({
				code: "historical_transcript_deferred",
				message: `Retained history source unavailable: ${source.path}.${detail} The foreign receipt cannot prove its history exists in ${sqlitePath}; restore this original from a verified backup and rerun openclaw doctor --fix.`
			});
		}
	}
	const retainedIndex = retainedImport?.sources.find((source) => source.path === path.resolve(params.target.storePath));
	const retainedIndexPath = retainedIndex && resolveVerifiedSessionSource(retainedIndex, sourceVerification.resolvedTarget, params.env, sourceVerification.verification);
	if (retainedImport && (params.mode === "import" || params.mode === "recover") && sourceConflicts.has(path.resolve(params.target.storePath))) appendRetainedIndexComparison(params, issues);
	if (emptySources.size) {
		await archiveConflictingRetainedSessionSources({
			...params,
			verifiedEmpty: true
		}, emptySources, report);
		sourceVerification.verification.clear();
	}
	return {
		retainedImport,
		staleImport,
		sourceConflicts,
		sourceVerification,
		retainedIndexPath
	};
}
/** Compare current rows for diagnosis only; changed index values never gain receipt authority. */
function appendRetainedIndexComparison(params, issues) {
	try {
		const parsingIssues = [];
		const records = readLegacySessionRecords(params.target, parsingIssues).filter(({ sessionKey }) => !shouldFilterLegacySessionRecordsByTarget(params.target) || isLegacySessionRecordOwnedByTarget(params.cfg, params.target, sessionKey));
		if (parsingIssues.length || !records.length) return;
		const current = new Map(loadExactSessionEntryCandidates({
			readOnly: true,
			env: params.env,
			readSource: {
				agentId: params.target.agentId,
				path: resolveTargetSqlitePath(params.target, params.env)
			},
			sessionKeys: records.map(({ sessionKey }) => sessionKey)
		}).map(({ sessionKey, entry }) => [sessionKey, entry]));
		for (const { sessionKey, entry } of records) {
			const canonical = current.get(sessionKey);
			let message;
			if (!canonical || canonical.sessionId !== entry.sessionId) message = "Retained session identity differs from the current canonical SQLite row.";
			else {
				const sourceFields = new Map(Object.entries(entry));
				const canonicalFields = new Map(Object.entries(canonical));
				const changedFields = [.../* @__PURE__ */ new Set([...sourceFields.keys(), ...canonicalFields.keys()])].filter((field) => field !== "sessionFile" && !isDeepStrictEqual(sourceFields.get(field), canonicalFields.get(field))).toSorted();
				if (!changedFields.length) continue;
				message = `Retained session identity matches canonical SQLite, but metadata differs: ${changedFields.join(", ")}.`;
			}
			issues.push({
				code: "retained_plugin_source_conflict",
				sessionKey,
				message: `${message} Canonical values were kept; the retained index remains protected for recovery.`
			});
		}
	} catch (error) {
		issues.push({
			code: "retained_plugin_source_conflict",
			message: `Could not compare retained session metadata: ${formatErrorMessage(error)}. Canonical SQLite sessions were not changed.`
		});
	}
}
/** Preserve unverifiable plugin inputs through the existing reversible archive lifecycle. */
async function archiveConflictingRetainedSessionSources(params, sourceConflicts, report) {
	const target = {
		...params.target,
		sqlitePath: resolveTargetSqlitePath(params.target, params.env)
	};
	const conflicts = [...sourceConflicts].filter(([source]) => !params.protectedPaths?.has(canonicalMigrationFilePath(source)) && fs.existsSync(source) && path.dirname(source) === path.dirname(target.storePath));
	if (!conflicts.length) return;
	const run = params.activeRun ?? createSessionSqliteMigrationRun(params.env, [target]);
	const targets = params.targets ?? [target];
	let indexPath = target.storePath;
	const indexIdentity = params.expectedIndexIdentity ?? (!params.activeRun && fs.existsSync(indexPath) ? readMigrationArtifactIdentity(indexPath) : void 0);
	const assertIndexCurrent = () => {
		if (indexPath !== target.storePath && fs.existsSync(target.storePath) || (indexIdentity ? !sameMigrationArtifact(readMigrationArtifactIdentity(indexPath), indexIdentity) : fs.existsSync(indexPath))) throw new Error("Session index changed after owner discovery; original retained for a fresh Doctor pass.");
	};
	for (const [source, reason] of conflicts) try {
		assertIndexCurrent();
		const move = planSessionJsonlArchiveMove({
			target,
			sourcePathRaw: source,
			baseNameRaw: path.basename(source),
			archiveKey: "retained-plugin-conflict",
			kind: source === target.storePath ? "legacy-store" : "transcript"
		});
		move.artifact = {
			identity: move.kind === "legacy-store" && indexIdentity ? indexIdentity : readMigrationArtifactIdentity(source),
			classification: "protected",
			reason,
			dependencies: [],
			disposal: { state: "retained" }
		};
		if (params.verifiedEmpty && move.artifact.identity.size !== 0) throw new Error("Retained transcript is no longer empty; source needs verification");
		for (const owner of targets) recordPlannedMigrationMoves(run, owner, [move]);
		await moveMigrationArtifact(move.sourcePath, move.archivePath, move.artifact.identity, void 0, (remove, retain) => {
			if (move.kind !== "legacy-store") try {
				assertIndexCurrent();
			} catch (error) {
				retain();
				throw error;
			}
			remove();
		});
		for (const owner of targets) recordCompletedMigrationMoves(run, owner, [move]);
		if (move.kind === "legacy-store") indexPath = move.archivePath;
		sourceConflicts.set(move.archivePath, reason);
		(move.kind === "legacy-store" ? report.archivedLegacyStoreFiles ??= [] : report.archivedTranscriptFiles).push(move.archivePath);
		report.issues.push({
			code: params.verifiedEmpty ? "retained_empty_transcript_superseded" : "retained_plugin_source_conflict",
			message: `${source}: ${reason} Preserved at ${move.archivePath}; canonical SQLite sessions were not replayed.`
		});
	} catch (error) {
		report.issues.push({
			code: "retained_plugin_source_conflict",
			message: `${source}: could not archive retained input: ${formatErrorMessage(error)}. Original remains protected.`
		});
	}
	updateMigrationManifestTarget(run, target, report.issues);
	if (!params.activeRun) {
		run.manifest.completedAt = (/* @__PURE__ */ new Date()).toISOString();
		writeSessionSqliteMigrationManifest(run);
	}
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
async function prepareDoctorSessionSqliteTargets(params) {
	const resolved = resolveDoctorSessionSqliteTargets(params);
	if (isDestructiveDoctorSessionSqliteMode(params.mode)) assertDoctorSqliteMaintenancePathsNotAliased(`session SQLite ${params.mode}`, resolveDoctorSessionSqliteMaintenancePaths(resolved.targets), resolveDoctorSessionSqliteMaintenanceRoots(resolved.targets, params.env));
	const repairEntryStates = async (targets) => {
		params.authority?.assertCurrent();
		const { repairLegacySessionEntryStates } = await import("./doctor-session-delivery-state-BiFPaS42.mjs");
		return await repairLegacySessionEntryStates({
			apply: true,
			cfg: params.cfg,
			env: params.env,
			authority: params.authority,
			targets: projectExistingAgentDatabaseTargets(targets, params.env, params.cfg),
			deferSchemaRepair: params.mode === "import"
		});
	};
	if (params.mode === "import") await repairEntryStates(resolved.targets);
	return {
		...resolved,
		repairEntryStates
	};
}
function createMigrationTargetInput(target) {
	return {
		agentId: target.agentId,
		sqlitePath: canonicalMigrationFilePath(resolveTargetSqlitePath(target)),
		storePath: canonicalMigrationFilePath(target.storePath)
	};
}
function resolveDoctorSessionSqliteConfig(options) {
	if (options.cfg) return options.cfg;
	const requestedAgentId = normalizeAgentId(options.agent ?? "main");
	return options.store ? { agents: { entries: { [requestedAgentId]: {} } } } : getRuntimeConfig();
}
function resolveDoctorSessionSqliteMaintenancePaths(targets) {
	return [...new Set(targets.flatMap((target) => resolveSqliteDatabaseFilePaths(resolveTargetSqlitePath(target))))];
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
	return isPathInside$1(rootPath, path.resolve(candidatePath));
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
function resolveDoctorSessionSqliteTargets(params) {
	if (params.store) return { targets: resolveSessionStoreTargets(params.cfg, {
		store: params.store,
		agent: params.agent,
		allAgents: params.allAgents
	}, { env: params.env }) };
	const discoversHistory = params.mode === "dry-run" || params.mode === "import" || params.mode === "validate";
	if (params.mode === "restore" || params.mode === "recover" || discoversHistory && params.agent) {
		const candidates = resolveAllAgentSessionStoreCandidateTargetsSync(params.cfg, { env: params.env });
		if (!params.agent) return {
			targets: candidates,
			knownTargets: candidates
		};
		const requestedAgentId = normalizeAgentId(params.agent);
		return {
			targets: candidates.filter((target) => normalizeAgentId(target.agentId) === requestedAgentId),
			knownTargets: candidates
		};
	}
	if (params.agent) return { targets: resolveAgentSessionStoreTargetsSync(params.cfg, params.agent, { env: params.env }) };
	if (params.allAgents) {
		const targets = (discoversHistory ? resolveAllAgentSessionStoreCandidateTargetsSync(params.cfg, { env: params.env }) : resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env })).map((target) => ({
			target,
			sqlitePath: resolveTargetSqlitePath(target, params.env)
		}));
		const isRetained = createRetainedAgentDatabaseMatcher(params.env, () => resolveConfiguredAgentDatabaseTargets(params.cfg, { env: params.env }), {
			kind: "legacy-database",
			readDatabasePaths: () => targets.map(({ sqlitePath }) => sqlitePath)
		});
		return {
			targets: targets.filter(({ target, sqlitePath }) => {
				const orphanedSidecars = hasOrphanedSqliteSidecars(sqlitePath);
				return [target.storePath, sqlitePath].every((pathname) => {
					const disposition = isRetained(pathname, target.agentId);
					return !disposition || disposition === "unavailable" && !orphanedSidecars;
				});
			}).map(({ target }) => target),
			knownTargets: targets.map(({ target }) => target)
		};
	}
	return { targets: resolveSessionStoreTargets(params.cfg, {}, { env: params.env }) };
}
function filterLegacySessionStoreTargets(targets, mode, historicalArchives, settledStores) {
	if (mode === "inspect" || mode === "compact" || mode === "restore" || mode === "recover") return targets;
	return targets.filter((target) => !target.storePath.endsWith(".sqlite") && (settledStores.has(target.storePath) || fs.existsSync(target.storePath) || (historicalArchives.get(canonicalMigrationFilePath(target.storePath))?.transcripts.length ?? 0) > 0 || fs.existsSync(path.dirname(target.storePath)) && fs.readdirSync(path.dirname(target.storePath)).some((file) => file.endsWith(".jsonl"))));
}
//#endregion
//#region src/commands/doctor-session-sqlite.ts
const retainedArchivePlans = /* @__PURE__ */ new WeakMap();
/** Destructive production callers hold the Gateway/SQLite-maintenance state lock for the full call. */
async function runDoctorSessionSqlite(options, authority) {
	const env = options.env ?? process.env;
	const cfg = resolveDoctorSessionSqliteConfig(options);
	const configuredAgentIds = new Set(listAgentIds(cfg));
	let pendingPlugins = readDeferredPluginMigrations({ env });
	const verifyMissingIndex = createMissingSessionIndexVerifier({
		cfg,
		env
	});
	const { targets: candidates, knownTargets, repairEntryStates } = await prepareDoctorSessionSqliteTargets({
		...options,
		cfg,
		env,
		authority
	});
	if (options.mode === "import" || options.mode === "recover") {
		const plugins = normalizePluginsConfig(cfg.plugins);
		const disabled = pendingPlugins.filter(({ pluginId }) => {
			const id = normalizePluginId(pluginId);
			return !plugins.enabled || plugins.entries[id]?.enabled === false || plugins.deny.includes(id);
		}).map(({ pluginId }) => pluginId);
		if (disabled.length > 0) {
			authority?.assertCurrent();
			pendingPlugins = await recordDeferredPluginMigrations({
				env,
				pending: [],
				resolvedPluginIds: disabled,
				expectedPending: pendingPlugins
			}) ?? pendingPlugins;
		}
	}
	const settlements = options.mode === "import" || options.mode === "recover" ? await settleDuplicateSessionSqliteArchives({
		cfg,
		env,
		targets: candidates.map(createMigrationTargetInput)
	}) : [];
	let historicalSources = [
		"import",
		"dry-run",
		"validate",
		"recover"
	].includes(options.mode) ? collectHistoricalArchiveSources({
		cfg,
		env
	}) : void 0;
	let historicalArchives = historicalSources?.sources ?? /* @__PURE__ */ new Map();
	const targets = filterLegacySessionStoreTargets(candidates, options.mode, historicalArchives, new Set(settlements.map(({ target }) => target.storePath)));
	if (options.mode === "restore") return restoreDoctorSessionSqliteTargets({
		env,
		targets
	});
	if (options.mode === "recover") return recoverDoctorSessionSqliteTargets({
		env,
		options,
		targets,
		prepareTarget: (target) => repairEntryStates([target]),
		recoveryInventory: historicalSources?.inventory,
		historicalArchiveStores: /* @__PURE__ */ new Set([...historicalArchives.keys(), ...settlements.map(({ target }) => target.storePath)]),
		validateTarget: async (target) => {
			authority?.assertCurrent();
			const report = collectHistoricalArchiveSources({
				cfg,
				env
			}).sources.get(target.storePath)?.transcripts.length || readStaleDeferredPluginSessionImport({
				target,
				sqlitePath: target.sqlitePath,
				env
			}) ? (await runDoctorSessionSqlite({
				cfg,
				env,
				mode: "import",
				store: target.storePath,
				agent: target.agentId
			}, authority)).targets[0] : await inspectOrMigrateTarget({
				configuredAgentIds,
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
	if (options.mode === "import") {
		await reconcileSessionSqliteMigrationPublications({
			env,
			trustedTargets: targets.map(createMigrationTargetInput)
		});
		historicalSources = collectHistoricalArchiveSources({
			cfg,
			env
		});
		historicalArchives = historicalSources.sources;
	}
	const activeRun = options.mode === "import" && targets.length > 0 ? createSessionSqliteMigrationRun(env, targets.map(createMigrationTargetInput)) : void 0;
	const coverage = options.mode === "import" || options.mode === "dry-run" || options.mode === "validate" ? gatherLegacyArchiveCoverage(cfg, env, targets, knownTargets) : void 0;
	const reports = [];
	const archiveTargets = [];
	for (const target of targets) reports.push(await inspectOrMigrateTarget({
		configuredAgentIds,
		activeRun,
		archiveTargets,
		verifyMissingIndex,
		cfg,
		env,
		mode: options.mode,
		target,
		historicalArchives,
		recoveryInventory: historicalSources?.inventory,
		referencedPaths: coverage?.referencedPaths,
		expectedIndexIdentity: coverage?.indexIdentities.get(canonicalMigrationFilePath(target.storePath)),
		deferredPluginIds: deferredPluginSessionStoreIds({
			target,
			pending: pendingPlugins
		})
	}));
	for (const report of reports) report.issues.push(...settlements.filter((item) => item.target.storePath === report.storePath).flatMap((item) => item.issues));
	if (activeRun && coverage) {
		for (const owner of archiveTargets) if (owner.sourceConflicts?.size && (!shouldFilterLegacySessionRecordsByTarget(owner.sourceTarget) || options.allAgents && !options.agent && !options.store && (coverage.selectedStorePaths.has(owner.target.storePath) || coverage.incompleteDirectories.has(path.dirname(owner.target.storePath))) && coverage.knownTargets.filter((known) => canonicalMigrationFilePath(known.storePath) === owner.target.storePath).every((known) => archiveTargets.some((candidate) => candidate.target.agentId === known.agentId && candidate.target.storePath === owner.target.storePath && candidate.validated))) && targets.filter((target) => canonicalMigrationFilePath(target.storePath) === owner.target.storePath).every((target) => archiveTargets.some((candidate) => candidate.sourceTarget === target && candidate.validated))) await archiveConflictingRetainedSessionSources({
			cfg,
			env,
			target: owner.sourceTarget,
			activeRun,
			protectedPaths: coverage.retainedPaths,
			expectedIndexIdentity: coverage.indexIdentities.get(owner.target.storePath),
			targets: archiveTargets.filter((candidate) => candidate.target.storePath === owner.target.storePath).map((candidate) => candidate.target)
		}, owner.sourceConflicts, owner.report);
		const deferredSourcePaths = /* @__PURE__ */ new Set();
		for (const target of reports.filter(isInformationalMissingSessionIndex)) {
			coverage.selectedStorePaths.delete(canonicalMigrationFilePath(target.storePath));
			coverage.retainedDirectories.add(path.dirname(canonicalMigrationFilePath(target.storePath)));
		}
		for (const owner of archiveTargets) for (const source of owner.sourceConflicts?.keys() ?? []) {
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
		for (const owner of archiveTargets) if (owner.retainedImportVerified && owner.deferredPluginIds.length === 0) try {
			retireDeferredPluginSessionImport({
				cfg,
				env,
				target: owner.sourceTarget,
				sqlitePath: owner.target.sqlitePath
			});
		} catch (error) {
			owner.report.issues.push({
				code: "retained_plugin_source_conflict",
				message: `Deferred import receipt awaits retirement: ${formatErrorMessage(error)}. Run openclaw doctor --fix to retry.`
			});
			updateMigrationManifestTarget(activeRun, owner.target, owner.report.issues);
		}
		const hasBlockingIssues = reports.some((report) => countBlockingSessionSqliteIssues(report) > 0);
		activeRun.manifest.completedAt = (/* @__PURE__ */ new Date()).toISOString();
		if (hasBlockingIssues) {
			activeRun.manifest.failedAt = activeRun.manifest.completedAt;
			writeSessionSqliteMigrationManifest(activeRun);
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
/** Verified originals retained for unavailable plugins still await settlement. */
function hasRetainedDoctorSessionSources(report) {
	return retainedArchivePlans.has(report);
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
		for (const { owner } of plan.owners) retireDeferredPluginSessionImport({
			cfg: plan.cfg,
			env: plan.env,
			target: owner.sourceTarget,
			sqlitePath: owner.target.sqlitePath,
			completedPluginIds,
			assertCurrent
		});
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
	const { targets } = resolveDoctorSessionSqliteTargets({
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
async function inspectOrMigrateTarget(params) {
	const issues = [];
	const isSqliteStore = params.target.storePath.endsWith(".sqlite");
	const report = createDoctorSessionSqliteTargetReport({
		...params.target,
		sqlitePath: resolveTargetSqlitePath(params.target, params.env),
		sqliteEntries: readSqliteEntryCount(params.target),
		archivedLegacyStoreFiles: [],
		issues
	});
	const retained = await prepareRetainedSessionImport(params, report);
	if (!retained) return report;
	const { retainedImport, staleImport, sourceConflicts, retainedIndexPath } = retained;
	if (params.mode === "recover" && !shouldFilterLegacySessionRecordsByTarget(params.target)) await archiveConflictingRetainedSessionSources(params, sourceConflicts, report);
	const allRecords = isSqliteStore || sourceConflicts.has(path.resolve(params.target.storePath)) ? [] : readLegacySessionRecords(params.target, issues, {
		allowMissingStore: true,
		...retainedIndexPath ? { sourcePath: retainedIndexPath } : {},
		verifiedSourcePaths: retainedImport ? new Set(retainedImport.sources.map((source) => source.path)) : void 0
	});
	if (!isSqliteStore && (!retainedImport || !retainedIndexPath) && params.mode !== "inspect" && params.mode !== "compact" && (issues.every(({ code }) => code === "retained_plugin_source_index_rebuilt") || retainedImport || staleImport)) await appendLegacyHistoricalTranscripts({
		...params,
		allRecords,
		retainedImport,
		sourceConflicts,
		issues
	});
	let records = shouldFilterLegacySessionRecordsByTarget(params.target) ? allRecords.filter((record) => isLegacySessionRecordOwnedByTarget(params.cfg, params.target, record.sessionKey)) : allRecords;
	if (staleImport) {
		const snapshot = readOnlySqliteValidationSnapshot(params.target);
		if (!snapshot.ok) {
			issues.push({
				code: "sqlite_read_failed",
				message: String(snapshot.error)
			});
			return report;
		}
		records = records.filter((record) => {
			if (!snapshot.snapshot.archivedSessionIds.has(record.entry.sessionId)) {
				record.preserveCurrentSession = true;
				return true;
			}
			issues.push({
				code: "historical_transcript_deferred",
				sessionKey: record.sessionKey,
				message: `${record.transcriptPath}: live SQLite already archives this history. Retained source was not replayed; existing deletion and archive state remain authoritative.`
			});
			return false;
		});
	}
	const referencedTranscriptFiles = new Set(allRecords.flatMap((record) => record.transcriptPath ? [record.transcriptPath] : []));
	Object.assign(report, {
		legacyEntries: records.length,
		referencedTranscriptFiles: referencedTranscriptFiles.size,
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
	if (params.mode === "import" && retainedImport) {
		for (const source of report.unreferencedJsonlFiles) if (!retainedSourcePaths?.has(canonicalMigrationFilePath(source)) && fs.existsSync(source)) report.issues.push({
			code: "plugin_migration_source_retained",
			message: `${source}: skipped because the deferred-plugin-session-import receipt for ${params.target.storePath} still retains inputs for plugin(s): ${retainedImport.pluginIds.join(", ")}. Run openclaw doctor --fix to finish or retire the plugin migration, then rerun openclaw doctor --session-sqlite import. The new transcript remains in place.`
		});
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
	if (records.length === 0 && report.unreferencedJsonlFiles.length === 0 && !fs.existsSync(params.target.storePath) && !retainedImport) {
		if (issues.length === 0) report.sqliteEntries = 0;
		updateMigrationManifestTarget(params.activeRun, createMigrationTargetInput(params.target), issues);
		return report;
	}
	if (!retainedImport && params.verifyMissingIndex(report)) {
		updateMigrationManifestTarget(params.activeRun, createMigrationTargetInput(params.target), report.issues, { validationBeforeArchive: "passed" });
		return report;
	}
	if (retainedImport) countRetainedSessionSources(retained, records, report);
	else if (params.mode === "import") await importLegacySessionRecords(params, records, report, params.activeRun);
	else if (params.mode === "dry-run") for (const record of records) countLegacyTranscript(record, report);
	else validateLegacySessionRecords(params.target, records, report, "validate", params.env);
	let validationPassed = retainedImport !== void 0;
	if (params.mode === "import" && retainedImport) updateMigrationManifestTarget(params.activeRun, createMigrationTargetInput(params.target), report.issues, { validationBeforeArchive: "passed" });
	if (params.mode === "import" && !retainedImport && countBlockingSessionSqliteIssues(report) === 0) {
		validationPassed = validateLegacySessionRecords(params.target, records, report, "before-archive", params.env);
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
		const indexIdentity = params.expectedIndexIdentity;
		const indexless = !indexIdentity && !fs.existsSync(params.target.storePath);
		const deferredPluginIds = indexless && (!params.configuredAgentIds.has(params.target.agentId) || records.length === 0) ? [] : params.deferredPluginIds ?? [];
		const verifiedImport = validationPassed && (retainedImport !== void 0 || records.length > 0 || fs.existsSync(resolveTargetSqlitePath(params.target, params.env)));
		let retainedImportVerified = retainedImport !== void 0;
		let verifiedSources = retainedImport?.sources;
		if (!retainedImport && verifiedImport && (indexIdentity || records.some((record) => !record.historical?.archiveMove) || report.unreferencedJsonlFiles.length > 0) && report.issues.every(isRetainedSourceIssue)) try {
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
					report.sqliteEntries = readSqliteEntryCount(params.target);
					return report;
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
				if (indexless) report.issues.push({
					code: "retained_plugin_source_index_rebuilt",
					message: `Derived the retained source index from verified transcripts for ${path.dirname(params.target.storePath)}. Recorded their identities in the completed import receipt without creating sessions.json or replaying canonical metadata.`
				});
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
			const complete = !incompleteDirectories.has(path.dirname(source)) && imports.every((record) => record?.sourceFingerprint && record.recovery?.complete) && refs.every(({ owner, record }) => !owner.report.issues.some((issue) => issue.code === "transcript_malformed" && issue.sessionKey === record.sessionKey));
			for (const move of moves) {
				if (retainedPaths.has(move.sourcePath)) throw new Error("Artifact is required by an incomplete importing owner");
				move.artifact = {
					identity: readMigrationArtifactIdentity(move.sourcePath, 1n, move.kind === "transcript" ? fingerprint : void 0),
					classification: complete && move.kind === "transcript" && !first.record.historical ? imports.some((record) => record?.recovery?.repaired) ? "repair-original" : "imported" : "protected",
					reason: complete && first.record.historical && move.kind === "transcript" ? HISTORICAL_IMPORT_REASON : complete && move.kind === "transcript" ? "verified-import-original" : "unimported-or-unknown-history",
					...complete && move.kind === "transcript" && first.record.recovery?.sqliteEvents !== void 0 ? { verification: `superseded by SQLite (${first.record.recovery.events} of ${first.record.recovery.sqliteEvents} events present)` } : {},
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
		const planUnreferencedMove = (source, kind) => {
			try {
				const move = planSessionJsonlArchiveMove({
					archiveKey: "archive-tier",
					baseNameRaw: path.basename(source),
					kind,
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
				return true;
			} catch (error) {
				recordFailure(owner, source, error, true);
				return false;
			}
		};
		const pointers = /* @__PURE__ */ new Set();
		const receiptSources = new Set(owner.retainedImportVerified ? (owner.verifiedSources ?? []).map((source) => source.path) : []);
		for (const source of listUnreferencedJsonlFiles(storePath, [...referencedPaths, ...planned.keys()])) {
			if (retainedPaths.has(source)) continue;
			if (capturedSources && !capturedSources.has(source) || owner.retainedImportVerified && !receiptSources.has(source)) continue;
			const pointer = resolveTrajectoryPointerPath(source);
			if (planUnreferencedMove(source, "unreferenced-jsonl") && pointer) pointers.add(pointer);
		}
		for (const transcript of receiptSources) {
			const pointer = resolveTrajectoryPointerPath(transcript);
			if (pointer && receiptSources.has(pointer) && !owner.sourceConflicts?.has(transcript) && !fs.existsSync(transcript)) pointers.add(pointer);
		}
		for (const pointer of pointers) {
			const source = canonicalMigrationFilePath(pointer);
			if (fs.existsSync(source) && !planned.has(source) && !referencedPaths.has(source) && !retainedPaths.has(source) && !owner.sourceConflicts?.has(pointer) && (!capturedSources || capturedSources.has(source))) planUnreferencedMove(source, "trajectory");
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
//#endregion
export { hasRetainedDoctorSessionSources, reconcileDoctorSessionSqlitePublication, runDoctorSessionSqlite, settleRetainedDoctorSessionSources };
