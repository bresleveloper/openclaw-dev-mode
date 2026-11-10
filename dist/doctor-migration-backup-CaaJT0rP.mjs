import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as resolveRuntimeServiceCommit, s as resolveRuntimeServiceBuildId, t as VERSION } from "./version-jg_14gWz.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { o as resolveImmutableSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as sameFileMutationFingerprint } from "./file-descriptor-BWLpOgrg.mjs";
import { c as resolveSqliteInspectionSignal } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { d as sqliteIntegrityCheckSteps, r as assertSqliteIntegrity, s as isTerminalSqliteIntegrityError } from "./sqlite-integrity-06TCB-az.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { i as needsOpenClawStateDatabaseSchemaRepair } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { n as withSqliteIntegrityWorkerScope } from "./sqlite-integrity-worker-DyRlMgGE.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-oZ38327j.mjs";
import { t as createDoctorRehearsalDatabaseCoverage } from "./doctor-rehearsal-databases-CyjkkJZX.mjs";
import { f as isUpdateDoctorLintPass } from "./update-phase-M5rvMZiC.mjs";
import { t as runSqliteIntegrityOperationInWorker } from "./sqlite-integrity-operation-B18PJAFa.mjs";
import { i as inspectScopedMigrationTables, n as createScopedMigrationSnapshot, r as inspectScopedMigrationSnapshot, t as ScopedMigrationSnapshotUnsupportedError } from "./sqlite-migration-scoped-snapshot-CevWEhoj.mjs";
import { n as recordDoctorMigrationBackups } from "./doctor-migration-backup-artifacts-BIjn9so3.mjs";
import { closeSync, existsSync, fsyncSync, lstatSync, openSync, realpathSync, statSync, unlinkSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
//#region src/state/schema-migration-backup-tables.ts
/** Destination versions, declared only with proof through the complete migration runner. */
const SCHEMA_MIGRATION_BACKUP_TABLES = {
	agent: { 27: [
		"context_engine_turn_outbox",
		"sqlite_stat1",
		"sqlite_stat4"
	] },
	state: {}
};
//#endregion
//#region src/state/schema-migration-backup-scope.ts
/** Missing steps and same-version repairs retain the full-file recovery contract. */
function resolveSchemaMigrationBackupTables(migration) {
	if (migration.foundVersion <= 0 || migration.foundVersion >= migration.supportedVersion) return;
	const tables = /* @__PURE__ */ new Set(["schema_meta"]);
	for (let version = migration.foundVersion + 1; version <= migration.supportedVersion; version++) {
		const scope = SCHEMA_MIGRATION_BACKUP_TABLES[migration.kind][version];
		if (!scope) return;
		for (const table of scope) tables.add(table);
	}
	if (migration.kind === "state") tables.add("config_machine_state");
	return [...tables].toSorted();
}
//#endregion
//#region src/commands/doctor-migration-backup.ts
/** Preserve the old database generation before Doctor advances its schemas. */
async function backupDoctorMigrationDatabases(params) {
	const sharedPath = resolveOpenClawStateSqlitePath(params.env);
	const pending = new Set(params.pendingDatabasePaths);
	if (existsSync(sharedPath) && needsOpenClawStateDatabaseSchemaRepair(sharedPath)) pending.add(sharedPath);
	if (pending.size === 0) return {
		changes: [],
		warnings: []
	};
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (!maintenance?.ownsSchemaMaintenance) throw new Error("Pre-migration SQLite backups require Doctor maintenance ownership.");
	const migrationTables = /* @__PURE__ */ new Map();
	if (params.versionMigrationsOnly && !isUpdateDoctorLintPass(params.env)) {
		for (const pathname of pending) {
			const migration = params.pendingMigrations?.find((entry) => entry.path === pathname);
			const tables = migration && resolveSchemaMigrationBackupTables(migration);
			if (!tables) {
				migrationTables.clear();
				break;
			}
			migrationTables.set(realpathSync.native(pathname), tables);
		}
		if ([...pending].some((pathname) => pathname !== sharedPath) && existsSync(sharedPath)) migrationTables.delete(realpathSync.native(sharedPath));
	}
	const backup = async () => {
		if (migrationTables.size > 0) await withSqliteIntegrityWorkerScope(() => maintenance.assertAdmission(), async () => {
			const signal = resolveSqliteInspectionSignal() ?? new AbortController().signal;
			for (const pathname of migrationTables.keys()) try {
				var _usingCtx$1 = _usingCtx();
				const database = _usingCtx$1.u(openNodeSqliteDatabase(pathname, { readOnly: true }));
				await runSqliteIntegrityOperationInWorker(sqliteIntegrityCheckSteps(database, pathname), {
					busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
					signal,
					beforeResume: () => maintenance.assertAdmission()
				});
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		});
		return backupDoctorSqliteDatabases({
			...params,
			pendingDatabasePaths: [...pending],
			authority: { assertCurrent: () => maintenance.assertAdmission() },
			migrationTables: migrationTables.size > 0 ? migrationTables : void 0
		});
	};
	let result;
	try {
		result = await backup();
	} catch (error) {
		if (error instanceof DoctorMaintenanceRefusalError || !params.agentDatabaseTargets?.length || !collectNestedErrorCandidates(error).some((cause) => cause instanceof Error && isTerminalSqliteIntegrityError(cause))) throw error;
		const { repairDoctorSessionWindowsBeforeMigration } = await import("./state-migrations.session-window-repair-DEGERphy.mjs");
		const changes = await repairDoctorSessionWindowsBeforeMigration({
			env: params.env,
			targets: params.agentDatabaseTargets
		});
		if (changes.length === 0) throw error;
		result = await backup();
		result.changes = [...changes, ...result.changes];
	}
	return {
		...result,
		...migrationTables.size > 0 ? { versionMigrations: params.pendingMigrations?.filter((migration) => migration.kind === "state" ? migration.path === sharedPath : params.agentDatabaseTargets?.some((target) => target.path === migration.path)) } : {}
	};
}
/** Schema and same-schema repairs share verified snapshots under their existing Doctor owner. */
async function backupDoctorSqliteDatabases(params) {
	const pending = new Set(params.pendingDatabasePaths);
	if (pending.size === 0) return {
		changes: [],
		warnings: []
	};
	const sharedPath = resolveOpenClawStateSqlitePath(params.env);
	if (existsSync(sharedPath)) pending.add(sharedPath);
	const { authority } = params;
	authority.assertCurrent();
	const disposable = params.requireSnapshots ? void 0 : createDoctorRehearsalDatabaseCoverage(params.env);
	disposable?.admit([...pending, ...params.databasePaths]);
	const retainedPaths = [.../* @__PURE__ */ new Set([...pending, ...params.databasePaths])].filter((pathname) => !disposable?.excludes(pathname));
	if (retainedPaths.length === 0) {
		disposable?.assertCurrent();
		return {
			changes: [],
			warnings: []
		};
	}
	const { createVerifiedSqliteSnapshot } = await import("./sqlite-snapshot-BjQFcr9G.mjs");
	const { sanitizeOpenClawStateLeaseRows } = await import("./openclaw-state-snapshot-sanitizer-B5N5Egac.mjs");
	authority.assertCurrent();
	disposable?.assertCurrent();
	const sources = [...new Set([...pending].filter((pathname) => !disposable?.excludes(pathname)).map((pathname) => realpathSync.native(pathname)))];
	if (!params.requireSnapshots && sources.length > 0 && sources.every((sourcePath) => {
		const { dev, ino } = statSync(sourcePath, { bigint: true });
		return dev !== 0n && ino !== 0n && params.verifiedSnapshots?.some((snapshot) => snapshot.dev === dev && snapshot.ino === ino);
	})) return {
		changes: [],
		warnings: []
	};
	const inventory = [.../* @__PURE__ */ new Set([...sources, ...retainedPaths.map((pathname) => realpathSync.native(pathname))])].toSorted().map((pathname) => ({
		path: pathname,
		identity: statSync(pathname, { bigint: true })
	}));
	const backupDigest = createHash("sha256").update(JSON.stringify([
		...params.repair ? [params.repair.key] : [],
		...params.migrationTables ? ["declared-schema-migrations"] : [],
		VERSION,
		resolveRuntimeServiceBuildId(),
		resolveRuntimeServiceCommit(),
		22,
		27,
		inventory.map(({ path, identity }) => [
			path,
			String(identity.dev),
			String(identity.ino)
		])
	])).digest("hex");
	const backupId = [
		backupDigest.slice(0, 8),
		backupDigest.slice(8, 12),
		`8${backupDigest.slice(13, 16)}`,
		`8${backupDigest.slice(17, 20)}`,
		backupDigest.slice(20, 32)
	].join("-");
	const assertInventory = () => {
		authority.assertCurrent();
		disposable?.assertCurrent();
		for (const { path: pathname, identity } of inventory) {
			const current = statSync(pathname, { bigint: true });
			if (!current.isFile() || current.dev !== identity.dev || current.ino !== identity.ino) throw new Error(`Pre-migration SQLite backup source changed: ${pathname}`);
		}
	};
	const changes = [];
	const fullTargetFor = (sourcePath) => `${sourcePath}.pre-startup-migration-${backupId}.bak`;
	const scopedTargetFor = (sourcePath) => `${sourcePath}.pre-startup-migration-${backupId}.scoped.bak`;
	const targets = /* @__PURE__ */ new Map();
	for (const { path: sourcePath } of inventory) {
		const full = fullTargetFor(sourcePath);
		const scoped = scopedTargetFor(sourcePath);
		if (lstatSync(full, { throwIfNoEntry: false }) && lstatSync(scoped, { throwIfNoEntry: false })) throw new Error(`Ambiguous pre-migration backup group for ${sourcePath}`);
		targets.set(sourcePath, lstatSync(scoped, { throwIfNoEntry: false }) ? scoped : full);
	}
	const targetFor = (sourcePath) => targets.get(sourcePath);
	const capturePath = `${fullTargetFor(existsSync(sharedPath) ? realpathSync.native(sharedPath) : inventory[0].path)}.capturing`;
	let capture = lstatSync(capturePath, {
		bigint: true,
		throwIfNoEntry: false
	});
	const hasSnapshots = inventory.some(({ path: sourcePath }) => lstatSync(targetFor(sourcePath), { throwIfNoEntry: false }) !== void 0);
	if (!capture && !hasSnapshots) {
		assertInventory();
		const descriptor = openSync(capturePath, "wx", 384);
		try {
			fsyncSync(descriptor);
		} finally {
			closeSync(descriptor);
		}
		capture = lstatSync(capturePath, { bigint: true });
	}
	const assertCapture = () => {
		assertInventory();
		if (capture && (!capture.isFile() || capture.size !== 0n || !sameFileMutationFingerprint(capture, lstatSync(capturePath, { bigint: true })))) throw new DoctorMaintenanceRefusalError(`Pre-migration SQLite backup capture marker changed: ${capturePath}`, {
			kind: "data-at-risk",
			reason: "incomplete-migration"
		});
	};
	const syncCaptureDirectory = () => requireDirectorySync(syncDirectorySync(path.dirname(capturePath)), "Migration backup directory");
	if (capture) {
		assertCapture();
		syncCaptureDirectory();
		for (const { path: sourcePath } of inventory) {
			const targetPath = targetFor(sourcePath);
			const incomplete = lstatSync(targetPath, {
				bigint: true,
				throwIfNoEntry: false
			});
			if (!incomplete) continue;
			assertCapture();
			if (!incomplete.isFile() || !sameFileMutationFingerprint(incomplete, lstatSync(targetPath, { bigint: true }))) throw new Error(`Incomplete pre-migration SQLite backup changed: ${targetPath}`);
			unlinkSync(targetPath);
			changes.push(`Discarded incomplete pre-migration SQLite backup: ${targetPath}`);
		}
	}
	const inspections = /* @__PURE__ */ new Map();
	if (capture && params.migrationTables?.size) {
		const stateDir = realpathSync.native(resolveStateDir(params.env));
		try {
			for (const [sourcePath, tables] of params.migrationTables) {
				if (!isPathInside(stateDir, sourcePath)) throw new ScopedMigrationSnapshotUnsupportedError("source is outside offline restore custody");
				inspections.set(sourcePath, inspectScopedMigrationTables(sourcePath, tables));
			}
		} catch (error) {
			if (!(error instanceof ScopedMigrationSnapshotUnsupportedError)) throw error;
			inspections.clear();
			changes.push(`Using full migration backups: ${error.message}`);
		}
	}
	if (capture) for (const { path: sourcePath } of inventory) targets.set(sourcePath, inspections.has(sourcePath) ? scopedTargetFor(sourcePath) : fullTargetFor(sourcePath));
	for (const { path: sourcePath } of inventory) {
		assertCapture();
		const targetPath = targetFor(sourcePath);
		const existing = lstatSync(targetPath, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (existing) {
			try {
				if (!existing.isFile()) throw new Error("Backup must be a regular file");
				if (targetPath === scopedTargetFor(sourcePath)) {
					if (inspectScopedMigrationSnapshot(targetPath).sourcePath !== sourcePath) throw new Error("Scoped backup belongs to another database");
				} else {
					const snapshot = openNodeSqliteDatabase(resolveImmutableSqliteFileUri(targetPath), { readOnly: true });
					try {
						snapshot.exec("PRAGMA trusted_schema = OFF;");
						assertCapture();
						assertSqliteIntegrity(snapshot, targetPath);
						params.repair?.validate(snapshot);
					} finally {
						snapshot.close();
					}
				}
				if (!sameFileMutationFingerprint(existing, lstatSync(targetPath, { bigint: true }))) throw new Error("Backup changed during verification");
			} catch (cause) {
				throw new DoctorMaintenanceRefusalError(`Cannot verify pre-migration SQLite backup: ${targetPath}. ${formatErrorMessage(cause)}. Restore the matching backup group before retrying; surviving snapshots were preserved.`, {
					kind: "data-at-risk",
					reason: "incomplete-migration"
				}, { cause });
			}
			changes.push(`Reused pre-migration SQLite backup: ${targetPath}`);
			continue;
		}
		if (!capture) throw new DoctorMaintenanceRefusalError(`Completed pre-migration SQLite backup group is missing: ${targetPath}. Restore the matching backup group before retrying; surviving snapshots were preserved.`, {
			kind: "data-at-risk",
			reason: "incomplete-migration"
		});
		const inspection = inspections.get(sourcePath);
		const backup = inspection ? await createScopedMigrationSnapshot({
			sourcePath,
			targetPath,
			tables: inspection.tables.map((table) => table.name),
			inspection,
			beforePublish: assertCapture
		}) : await createVerifiedSqliteSnapshot({
			sourcePath,
			targetPath,
			preserveRowIds: true,
			transform: sanitizeOpenClawStateLeaseRows,
			beforePublish: assertCapture,
			validate: params.repair?.validate
		});
		assertCapture();
		changes.push(`Saved pre-migration SQLite backup: ${backup.path}`);
	}
	assertCapture();
	if (capture) unlinkSync(capturePath);
	syncCaptureDirectory();
	assertInventory();
	if (lstatSync(capturePath, { throwIfNoEntry: false })) throw new DoctorMaintenanceRefusalError(`Pre-migration SQLite backup capture marker appeared during verification: ${capturePath}`, {
		kind: "data-at-risk",
		reason: "incomplete-migration"
	});
	const warnings = [];
	try {
		recordDoctorMigrationBackups(params.env, backupId, inventory.map(({ path, identity }) => ({
			path,
			identity,
			archivePath: targetFor(path)
		})), params.migrationTables !== void 0);
	} catch (error) {
		warnings.push(`Migration backups remain protected; cleanup registration failed: ${formatErrorMessage(error)}`);
	}
	return {
		changes,
		warnings,
		snapshots: inventory.map(({ path: sourcePath }) => ({
			sourcePath,
			path: targetFor(sourcePath)
		}))
	};
}
//#endregion
export { backupDoctorSqliteDatabases as n, backupDoctorMigrationDatabases as t };
