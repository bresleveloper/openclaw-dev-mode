import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { a as resolveExistingSqliteFileUri, o as resolveImmutableSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as sameFileMutationFingerprint } from "./file-descriptor-BWLpOgrg.mjs";
import { c as resolveSqliteInspectionSignal } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as readOpenClawDatabaseQuarantineFailure } from "./openclaw-quarantine-store-DTWp4-ja.mjs";
import { r as assertSqliteIntegrity, s as isTerminalSqliteIntegrityError } from "./sqlite-integrity-06TCB-az.mjs";
import { a as truncateSqliteWal } from "./sqlite-wal-checkpoint-CgnAfdqs.mjs";
import { n as configureSqlitePreSchemaPragmas } from "./sqlite-wal-D2XTertL.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as FsSafeError } from "./fs-safe-6Z4UiMS4.mjs";
import { r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as SESSION_ARCHIVE_ZSTD_SUFFIX } from "./transcript-file-names-BZ8jA63H.mjs";
import { a as isSessionArchiveArtifactName } from "./artifacts-C6u8F4sP.mjs";
import { _ as repairCanonicalSqliteIndexes, g as repairDoctorSqliteIndexCorruption, h as backupDoctorSqliteRepair } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as configureSqliteMaintenanceCache } from "./sqlite-maintenance-cache-AYpxl8JZ.mjs";
import { t as MEDIA_ROWS_MIGRATION_META_KEY } from "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { _ as renewAgentDatabaseMaintenanceAuthorityIfPresent, r as assertAgentDatabaseMaintenanceAuthority, u as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { t as cache } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { C as assertSupportedAgentMigrationSchemas, c as hasPendingCurrentVersionAgentDatabaseMigration, r as assertOpenClawAgentSchemaContains, s as getOpenClawAgentMigrationSchema } from "./openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { i as assertSupportedAgentSchemaVersion, r as assertExistingAgentSchemaOwner } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { C as moveSqliteFilesAside, b as formatAgentDatabaseCorruptionRepairHint, x as formatAgentDatabaseOwnershipRepairHint } from "./agent-database-admission-CeDA0ojh.mjs";
import { n as clearOpenClawAgentDatabaseOpenFailure } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as ensureOpenClawAgentDatabaseSchemaSteps, n as ensureAgentSchema, t as agentDatabaseIntegrityBeforeMutationSteps } from "./openclaw-agent-db-schema-BUhCxlqc.mjs";
import { n as unregisterOpenClawAgentDatabase, t as registerOpenClawAgentDatabase } from "./openclaw-agent-db-registry-DuEPPF6m.mjs";
import { t as resolveZstdCodec } from "./zstd-codec-C-vEb3Qf.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { a as hasMeaningfulRetiredMediaCarrier, i as canonicalizePersistedUserMessageMedia } from "./media-facts-BIPREXi-.mjs";
import { o as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { c as reconcileSessionTranscriptIndexInTransaction } from "./session-transcript-index-BTr4by8J.mjs";
import "./archive-compression-wxOTBVKt.mjs";
import { a as rewriteSqliteTranscriptEventRowsInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { r as decodeUtf8Input, t as Utf8InputError } from "./utf8-input-n9WHttrc.mjs";
import { t as refreshSqlitePlannerStatistics } from "./sqlite-planner-statistics-B3MHdzD6.mjs";
import { t as AGENT_FTS_SCHEMAS } from "./openclaw-agent-fts-schema-BEP0rp_S.mjs";
import { t as runSqliteIntegrityOperationInWorker } from "./sqlite-integrity-operation-B18PJAFa.mjs";
import { n as assertOpenClawAgentDatabaseOwner, t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-DIdAFgIX.mjs";
import { a as resolveAgentDatabaseMigrationTargets, i as prepareAgentDatabaseMigrationDiscovery, r as listTranscriptArchives, t as agentDatabaseMigrationAdvisory } from "./state-migrations.media-persistence-targets-DLYjscc_.mjs";
import { t as withAgentDatabaseMaintenanceLease } from "./openclaw-agent-db-maintenance-lease-BnxXacoQ.mjs";
import { t as createMigrationDatabaseHandle } from "./state-migrations.agent-database-bTdy74rE.mjs";
import { f as parseTranscriptEvent, i as migrateCanonicalTranscriptArchives, m as transformTranscriptEvent, p as transformMediaArchiveContent, r as encodeArchiveContent, t as MEDIA_ARCHIVE_VERIFICATION_KEY } from "./state-migrations.transcript-directives-archives-BF8GTWFx.mjs";
import { t as repairDoctorSessionWindowOrphans } from "./state-migrations.session-window-repair-BX3F5VZd.mjs";
import fs from "node:fs";
import path from "node:path";
import { readRegularFileSync, sameFileContentsSync } from "@openclaw/fs-safe/advanced";
import { replaceFileAtomicSync } from "@openclaw/fs-safe/atomic";
//#region src/state/openclaw-agent-db-media-migration.ts
/** Upgrade older owned databases to the structural schema required by the media cutover. */
function* migrateOpenClawAgentDatabaseToMediaPrerequisiteSchemaSteps(db, options) {
	const targetVersion = 16;
	if (readSqliteUserVersion(db) > targetVersion) return;
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(db), agentId, pathname);
	assertSupportedAgentMigrationSchemas(db, pathname, readSqliteUserVersion(db));
	if (db.location()) invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(pathname);
	yield* agentDatabaseIntegrityBeforeMutationSteps(db, agentId, pathname);
	configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
	ensureAgentSchema(db, agentId, pathname, targetVersion);
}
//#endregion
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
		assertSupportedAgentMigrationSchemas(database, target.path, readSqliteUserVersion(database));
		assertSqliteIntegrity(database, target.path);
		maintenance.assertOwned();
		truncateSqliteWal(database, target.path);
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
//#region src/infra/state-migrations.media-persistence-database.ts
const MEDIA_MIGRATION_ROW_BATCH_SIZE = 64;
const MEDIA_MIGRATION_BATCH_BYTES = 4194304;
function forEachMediaEventBatch(params) {
	const db = getNodeSqliteKysely(params.database);
	const eventJson = params.table === "transcript_events" && !params.legacyTextStorage ? transcriptEventJsonSql(params.database) : sql.ref(`${params.table}.event_json`);
	const query = db.selectFrom(params.table).select(["session_id", "seq"]).select(eventJson.as("event_json")).orderBy("session_id", "asc").orderBy("seq", "asc");
	let rows = [];
	let bytes = 0;
	let renewedAt = performance.now();
	for (const row of iterateSqliteQuerySync(params.database, query)) {
		if (performance.now() - renewedAt >= 1e3) {
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			renewedAt = performance.now();
		}
		const rowBytes = Buffer.byteLength(row.event_json);
		if (rows.length > 0 && bytes + rowBytes > MEDIA_MIGRATION_BATCH_BYTES) {
			params.visit(rows);
			rows = [];
			bytes = 0;
		}
		rows.push(row);
		bytes += rowBytes;
		if (rows.length >= MEDIA_MIGRATION_ROW_BATCH_SIZE || bytes >= MEDIA_MIGRATION_BATCH_BYTES) {
			params.visit(rows);
			rows = [];
			bytes = 0;
		}
	}
	if (rows.length > 0) params.visit(rows);
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
			for (const [sessionId, rewrites] of rewritesBySession) {
				const sessionKey = sessionKeys.get(sessionId);
				if (!sessionKey) throw new Error(`${pathname}:${sessionId} has transcript rows without a session window`);
				params.beforeRewrite();
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
	const { database, pathname } = params;
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
				params.beforeRewrite();
				executeSqliteQuerySync(database, db.updateTable("trajectory_runtime_events").set({ event_json: rewrittenEventJson }).where("session_id", "=", row.session_id).where("seq", "=", row.seq));
			}
		}
	});
	return changedRows;
}
//#endregion
//#region src/infra/state-migrations.media-persistence.ts
const PREVIOUS_MEDIA_SCHEMA_VERSION = 16;
const ARCHIVE_TEMP_MARKER = ".media-retirement";
async function migrateAgentDatabase(params) {
	const database = openNodeSqliteDatabase(params.pathname);
	const schemaWarnings = [];
	const schemaOptions = {
		agentId: params.agentId,
		path: params.pathname,
		env: params.env,
		onMigrationWarning: (warning) => schemaWarnings.push(warning)
	};
	const runSchema = (operation) => runSqliteIntegrityOperationInWorker(operation, {
		busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
		signal: params.maintenance.signal,
		beforeResume: () => {
			assertAgentDatabaseMaintenanceAuthority(params.maintenance);
			assertOpenClawAgentDatabaseOwner(database, params);
			assertSupportedAgentSchemaVersion(database, params.pathname);
		}
	});
	try {
		configureSqliteMaintenanceCache(database);
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		enableNodeSqliteKyselyStatementCache(database);
		let metadata = assertOpenClawAgentDatabaseOwner(database, {
			agentId: params.agentId,
			pathname: params.pathname
		});
		assertSupportedAgentSchemaVersion(database, params.pathname);
		let userVersion = readSqliteUserVersion(database);
		if (userVersion < 27) assertSupportedAgentMigrationSchemas(database, params.pathname, userVersion);
		if (isTruthyEnvValue(params.env.OPENCLAW_UPDATE_IN_PROGRESS) && userVersion === 27 && !hasPendingCurrentVersionAgentDatabaseMigration(database) && !cache.terminal.peek(params.pathname) && !readOpenClawDatabaseQuarantineFailure("agent", params.pathname, {
			env: params.env,
			fresh: true
		}) && !assertOpenClawAgentDatabaseForMaintenance(database, {
			agentId: params.agentId,
			pathname: params.pathname,
			allowStartupIndexRepair: true
		})) return {
			deferred: true,
			rewrittenSessions: 0,
			rewrittenTrajectoryRows: 0,
			rewrittenArchives: 0,
			warnings: [],
			initialVersion: userVersion,
			finalVersion: userVersion
		};
		invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(params.pathname);
		const initialVersion = params.migratedFromVersion ?? userVersion;
		const prepareSchema = async () => {
			userVersion = readSqliteUserVersion(database);
			if (userVersion <= PREVIOUS_MEDIA_SCHEMA_VERSION) {
				await runSchema(migrateOpenClawAgentDatabaseToMediaPrerequisiteSchemaSteps(database, schemaOptions));
				metadata = assertOpenClawAgentDatabaseOwner(database, {
					agentId: params.agentId,
					pathname: params.pathname
				});
				userVersion = readSqliteUserVersion(database);
			}
			if (metadata.schemaVersion !== userVersion) throw new Error(`${params.pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match ${userVersion}`);
			if (userVersion >= 17) {
				if (params.migratedFromVersion !== void 0) ensureAgentSchema(database, params.agentId, params.pathname);
				else await runSchema(ensureOpenClawAgentDatabaseSchemaSteps(database, schemaOptions));
				userVersion = readSqliteUserVersion(database);
			}
		};
		let integrityChanges = [];
		try {
			await prepareSchema();
		} catch (error) {
			if (!(error instanceof Error) || !isTerminalSqliteIntegrityError(error)) throw error;
			const assertCurrent = () => {
				assertAgentDatabaseMaintenanceAuthority(params.maintenance);
				assertOpenClawAgentDatabaseOwner(database, params);
			};
			integrityChanges = repairDoctorSqliteIndexCorruption(database, params.pathname, {
				ftsSchemas: AGENT_FTS_SCHEMAS,
				label: `agent ${params.agentId}`,
				assertCurrent
			});
			if (integrityChanges.length === 0) integrityChanges = repairDoctorSessionWindowOrphans(database, params.pathname, assertCurrent);
			params.changes.push(...integrityChanges);
			await prepareSchema();
		}
		if (integrityChanges.length > 0 || cache.terminal.peek(params.pathname) || readOpenClawDatabaseQuarantineFailure("agent", params.pathname, {
			env: params.env,
			fresh: true
		})) runSqliteImmediateTransactionSync(database, () => {
			if (integrityChanges.length === 0) assertSqliteIntegrity(database, params.pathname);
			assertAgentDatabaseMaintenanceAuthority();
			assertOpenClawAgentDatabaseOwner(database, params);
			if (!clearOpenClawAgentDatabaseOpenFailure(params.pathname, { env: params.env })) throw new Error(`Repaired ${params.pathname}, but its quarantine record could not be cleared.`);
		}, {
			databaseLabel: params.pathname,
			operationLabel: "media-persistence.quarantine-clear"
		});
		if (initialVersion >= 17 && userVersion > initialVersion) return {
			deferred: true,
			rewrittenSessions: 0,
			rewrittenTrajectoryRows: 0,
			rewrittenArchives: 0,
			warnings: schemaWarnings,
			initialVersion,
			finalVersion: userVersion
		};
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
		const schemaMode = userVersion < 27 ? "legacy" : "current";
		const schemaSql = getOpenClawAgentMigrationSchema(userVersion);
		if (userVersion === PREVIOUS_MEDIA_SCHEMA_VERSION) repairCanonicalSqliteIndexes(database, params.pathname, schemaSql, { validateAfterRepair: () => assertOpenClawAgentSchemaContains(database, params.pathname, schemaSql, schemaMode) });
		assertOpenClawAgentSchemaContains(database, params.pathname, schemaSql, schemaMode);
		const legacyTextStorage = userVersion < 23;
		const db = getNodeSqliteKysely(database);
		const needsRepair = mediaSchemaUpgrade || !executeSqliteQueryTakeFirstSync(database, db.selectFrom("schema_meta").select("schema_version").where("meta_key", "=", "media-persistence-rows-v1"));
		let rewritten = {
			rewrittenSessions: 0,
			rewrittenTrajectoryRows: 0
		};
		let preserved = false;
		const beforeRewrite = () => {
			if (!preserved) {
				const backup = backupDoctorSqliteRepair(params.pathname, "media-persistence");
				preserved = true;
				params.changes.push(`Saved pre-repair SQLite backup: ${backup}`);
			}
		};
		if (needsRepair) {
			const changedLegacySessions = /* @__PURE__ */ new Set();
			const owner = createMigrationDatabaseHandle(database, params.agentId, params.pathname);
			rewritten = runSqliteImmediateTransactionSync(database, () => {
				assertAgentDatabaseMaintenanceAuthority(params.maintenance);
				assertMediaSchemaMigration();
				const rewrittenSessions = scanTranscriptRows({
					database,
					pathname: params.pathname,
					writer: owner,
					legacyTextStorage,
					beforeRewrite,
					onChangedSession: legacyTextStorage ? (sessionId) => {
						changedLegacySessions.add(sessionId);
					} : void 0
				});
				const rewrittenTrajectoryRows = scanTrajectoryRows({
					database,
					pathname: params.pathname,
					beforeRewrite
				});
				if (mediaSchemaUpgrade) {
					database.exec(`PRAGMA user_version = 17;`);
					executeSqliteQuerySync(database, db.updateTable("schema_meta").set({
						app_version: VERSION,
						schema_version: 17,
						updated_at: Date.now()
					}).where("meta_key", "=", "primary"));
				}
				const now = Date.now();
				executeSqliteQuerySync(database, db.insertInto("schema_meta").values({
					meta_key: MEDIA_ROWS_MIGRATION_META_KEY,
					role: "agent",
					agent_id: params.agentId,
					schema_version: 1,
					app_version: VERSION,
					created_at: now,
					updated_at: now
				}).onConflict((conflict) => conflict.column("meta_key").doNothing()));
				assertAgentDatabaseMaintenanceAuthority(params.maintenance);
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
			if (mediaSchemaUpgrade) {
				await runSchema(ensureOpenClawAgentDatabaseSchemaSteps(database, schemaOptions));
				userVersion = readSqliteUserVersion(database);
			}
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
		}
		const archives = await migrateCanonicalTranscriptArchives({
			agentId: params.agentId,
			database,
			pathname: params.pathname,
			signal: params.maintenance.signal,
			start: {
				generation: "",
				sessionId: ""
			},
			verification: {
				key: MEDIA_ARCHIVE_VERIFICATION_KEY,
				prepared: params.preparedArchives
			},
			onArchive: (archivePath) => params.canonicalArchivePaths.add(archivePath),
			beforeRewrite,
			transformLine: transformMediaArchiveContent
		});
		refreshSqlitePlannerStatistics(database);
		return {
			deferred: false,
			...rewritten,
			...archives,
			warnings: [...schemaWarnings, ...archives.warnings],
			initialVersion,
			finalVersion: userVersion
		};
	} finally {
		database.close();
	}
}
function archiveSourceMatches(filePath, expected) {
	try {
		const current = readRegularFileSync({ filePath });
		return current.exactIdentity.dev === expected.exactIdentity.dev && current.exactIdentity.ino === expected.exactIdentity.ino && current.stat.mtimeMs === expected.stat.mtimeMs && current.stat.size === expected.stat.size && current.buffer.equals(expected.buffer);
	} catch {
		return false;
	}
}
function migrateTranscriptArchive(filePath, options = {}) {
	const source = readRegularFileSync({ filePath });
	const compressed = filePath.endsWith(SESSION_ARCHIVE_ZSTD_SUFFIX);
	const codec = compressed ? resolveZstdCodec() : null;
	if (compressed && !codec) throw new Error("Cannot decode compressed transcript archive: this runtime lacks zstd support");
	const content = decodeUtf8Input(codec ? codec.decompress(source.buffer) : source.buffer, filePath);
	const transformed = transformMediaArchiveContent(content, filePath);
	if (!transformed.changed) return false;
	const encoded = encodeArchiveContent(transformed.content, compressed ? "zstd" : "identity", filePath);
	options.beforeReplace?.();
	replaceFileAtomicSync({
		filePath,
		content: encoded,
		preserveExistingMode: true,
		syncParentDir: true,
		syncTempFile: true,
		tempPrefix: `${path.basename(filePath)}${ARCHIVE_TEMP_MARKER}`,
		beforeRename: () => {
			if (!archiveSourceMatches(filePath, source)) throw new Error(`${filePath} changed before atomic media migration replacement`);
		}
	});
	return true;
}
/** Doctor-only migration from top-level Media* transcript fields to canonical facts. */
async function migrateLegacyMediaPersistence(params = {}) {
	const inspectionSignal = resolveSqliteInspectionSignal();
	inspectionSignal?.throwIfAborted();
	const env = params.env ?? process.env;
	const changes = [];
	const warnings = [];
	const notices = [];
	let recoverableWarningCount = 0;
	const refusedAgentDatabasePaths = [];
	const recoveredAgentDatabasePaths = /* @__PURE__ */ new Set();
	const preparedRepairTargets = [];
	try {
		const preparedDiscovery = prepareAgentDatabaseMigrationDiscovery({
			env,
			configuredAgentDatabaseTargets: params.configuredAgentDatabaseTargets ?? [],
			preparedDiscovery: params.preparedDiscovery
		});
		const advisory = agentDatabaseMigrationAdvisory(preparedDiscovery.discovery);
		if (advisory) {
			params.onPreparedRepairTargets?.([]);
			return advisory;
		}
		const { discovery, recoveries } = await withAgentDatabaseMaintenanceLease({
			env,
			processBound: true
		}, async (maintenance) => {
			(resolveSqliteInspectionSignal(maintenance.signal) ?? maintenance.signal).throwIfAborted();
			const discovered = resolveAgentDatabaseMigrationTargets({
				changes,
				configuredAgentDatabaseTargets: params.configuredAgentDatabaseTargets ?? [],
				env,
				warnings,
				preparedDiscovery
			});
			recoverableWarningCount = discovered.recoverableWarningCount;
			if (discovered.pendingDeletionTargets.length > 0) {
				const { preparePendingAgentDeletionDatabasesForMaintenance } = await import("./openclaw-agent-db-maintenance-DpU5GWEz.mjs");
				changes.push(...await preparePendingAgentDeletionDatabasesForMaintenance({
					targets: discovered.pendingDeletionTargets,
					env
				}, maintenance));
			}
			const recovered = recoverMisplacedAgentDatabaseCopies({
				targets: discovered.targets,
				maintenance
			});
			for (const entry of discovered.targets) if (recovered.get(entry.path)?.recovered) {
				maintenance.assertOwned();
				unregisterOpenClawAgentDatabase({
					agentId: entry.agentId,
					env,
					path: entry.path
				});
			}
			return {
				discovery: discovered,
				recoveries: recovered
			};
		});
		const seenPaths = /* @__PURE__ */ new Set();
		const archiveDirectories = /* @__PURE__ */ new Set();
		const canonicalArchivePaths = /* @__PURE__ */ new Set();
		const refusedArchiveDirectories = /* @__PURE__ */ new Set();
		for (const entry of discovery.targets) {
			inspectionSignal?.throwIfAborted();
			const pathname = entry.path;
			const recovery = recoveries.get(pathname);
			if (recovery) {
				warnings.push(recovery.warning);
				if (recovery.recovered) {
					recoveredAgentDatabasePaths.add(pathname);
					recoveredAgentDatabasePaths.add(entry.realPath);
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
			if (seenPaths.has(entry.realPath)) continue;
			seenPaths.add(entry.realPath);
			try {
				if (await withAgentDatabaseMaintenanceLease({
					env,
					processBound: true
				}, async (maintenance) => {
					const result = await migrateAgentDatabase({
						agentId: entry.agentId,
						changes,
						env,
						canonicalArchivePaths,
						pathname,
						maintenance,
						preparedArchives: preparedDiscovery.preparedTranscriptArchives,
						migratedFromVersion: preparedDiscovery.versionMigrations?.find((migration) => migration.path === pathname)?.foundVersion
					});
					maintenance.assertOwned();
					if (!result.deferred) archiveDirectories.add(resolveSqliteTranscriptArchiveDirectory({
						agentId: entry.agentId,
						path: pathname
					}));
					warnings.push(...result.warnings);
					recoverableWarningCount += result.warnings.length;
					registerOpenClawAgentDatabase({
						agentId: entry.agentId,
						env,
						path: pathname
					});
					const schemaAdvanced = result.finalVersion > result.initialVersion;
					if (schemaAdvanced && !preparedDiscovery.versionMigrations?.some((migration) => migration.path === pathname)) changes.push(`Upgraded agent database schema in ${pathname}: v${result.initialVersion} -> v${result.finalVersion}.`);
					if (result.rewrittenSessions > 0 || result.rewrittenTrajectoryRows > 0) changes.push(`Migrated media persistence in ${pathname}: ${result.rewrittenSessions} transcript session(s), ${result.rewrittenTrajectoryRows} trajectory row(s), schema v27.`);
					if (result.rewrittenArchives > 0) changes.push(`Migrated canonical transcript archive media in ${pathname}: ${result.rewrittenArchives} archive(s).`);
					return !result.deferred || !schemaAdvanced;
				})) preparedRepairTargets.push(entry);
			} catch (error) {
				if (inspectionSignal?.aborted && error === inspectionSignal.reason) throw error;
				refusedArchiveDirectories.add(resolveSqliteTranscriptArchiveDirectory({
					agentId: entry.agentId,
					path: pathname
				}));
				warnings.push(`Skipped agent database migration for ${pathname}: ${String(error)}`);
				recoverableWarningCount += Number(error instanceof Utf8InputError);
				const repairHint = formatAgentDatabaseCorruptionRepairHint(entry.agentId, error);
				if (repairHint) notices.push(repairHint);
			}
		}
		if (archiveDirectories.size > 0) await withAgentDatabaseMaintenanceLease({
			env,
			processBound: true
		}, async (maintenance) => {
			for (const directory of archiveDirectories) {
				inspectionSignal?.throwIfAborted();
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
					inspectionSignal?.throwIfAborted();
					if (canonicalArchivePaths.has(path.resolve(archive))) continue;
					try {
						maintenance.renew?.();
						if (migrateTranscriptArchive(archive, { beforeReplace: params.hooks?.beforeArchiveReplace ? () => params.hooks?.beforeArchiveReplace?.(archive) : void 0 })) changes.push(`Migrated archived transcript media in ${archive}.`);
					} catch (error) {
						if (inspectionSignal?.aborted && error === inspectionSignal.reason) throw error;
						warnings.push(`Skipped archived transcript media migration for ${archive}: ${String(error)}`);
						recoverableWarningCount += 1;
					}
				}
			}
		});
	} catch (error) {
		if (inspectionSignal?.aborted && error === inspectionSignal.reason) throw error;
		warnings.push(`Agent database maintenance deferred: ${formatErrorMessage(error)}`);
	}
	params.onPreparedRepairTargets?.(preparedRepairTargets);
	return {
		changes,
		warnings,
		...notices.length > 0 ? { notices } : {},
		...recoveredAgentDatabasePaths.size > 0 ? { recoveredAgentDatabasePaths: [...recoveredAgentDatabasePaths] } : {},
		...warnings.length > 0 && warnings.length === recoverableWarningCount ? { warningDisposition: "recoverable" } : warnings.length === recoverableWarningCount + refusedAgentDatabasePaths.length && refusedAgentDatabasePaths.length > 0 ? { refusedAgentDatabasePaths } : {}
	};
}
//#endregion
export { migrateLegacyMediaPersistence as t };
