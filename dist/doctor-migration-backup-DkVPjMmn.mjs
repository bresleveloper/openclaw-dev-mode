import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as resolveImmutableSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { c as resolveRuntimeServiceCommit, s as resolveRuntimeServiceBuildId, t as VERSION } from "./version-BJGPJZu6.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { i as needsOpenClawStateDatabaseSchemaRepair } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { t as createDoctorRehearsalDatabaseCoverage } from "./doctor-rehearsal-databases-jWB-feGw.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { i as sameFileMutationFingerprint } from "./file-descriptor-B4yBUiAP.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-GtqcmwG3.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-yVslo54h.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-BcbJNyja.mjs";
import { n as recordDoctorMigrationBackups } from "./doctor-migration-backup-artifacts-CBezQX4r.mjs";
import { closeSync, existsSync, fsyncSync, lstatSync, openSync, realpathSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
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
	return backupDoctorSqliteDatabases({
		...params,
		pendingDatabasePaths: [...pending],
		authority: { assertCurrent: () => maintenance.assertAdmission() }
	});
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
	const disposable = createDoctorRehearsalDatabaseCoverage(params.env);
	disposable?.admit([...pending, ...params.databasePaths]);
	const retainedPaths = [.../* @__PURE__ */ new Set([...pending, ...params.databasePaths])].filter((pathname) => !disposable?.excludes(pathname));
	if (retainedPaths.length === 0) {
		disposable?.assertCurrent();
		return {
			changes: [],
			warnings: []
		};
	}
	const { createVerifiedSqliteSnapshot } = await import("./sqlite-snapshot-V9wGePca.mjs");
	const { sanitizeOpenClawStateLeaseRows } = await import("./openclaw-state-snapshot-sanitizer-C60iEdnN.mjs");
	authority.assertCurrent();
	disposable?.assertCurrent();
	const sources = [...new Set([...pending].filter((pathname) => !disposable?.excludes(pathname)).map((pathname) => realpathSync.native(pathname)))];
	if (sources.length > 0 && sources.every((sourcePath) => {
		const { dev, ino } = statSync(sourcePath);
		return dev !== 0 && ino !== 0 && params.verifiedSnapshots?.some((snapshot) => snapshot.dev === dev && snapshot.ino === ino);
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
		VERSION,
		resolveRuntimeServiceBuildId(),
		resolveRuntimeServiceCommit(),
		20,
		24,
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
	const targetFor = (sourcePath) => `${sourcePath}.pre-startup-migration-${backupId}.bak`;
	const capturePath = `${targetFor(existsSync(sharedPath) ? realpathSync.native(sharedPath) : inventory[0].path)}.capturing`;
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
				const snapshot = openNodeSqliteDatabase(resolveImmutableSqliteFileUri(targetPath), {
					readOnly: true,
					allowExtension: true
				});
				try {
					snapshot.exec("PRAGMA trusted_schema = OFF;");
					await loadSqliteVecExtension({ db: snapshot });
					assertCapture();
					assertSqliteIntegrity(snapshot, targetPath);
					params.repair?.validate(snapshot);
				} finally {
					snapshot.close();
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
		const backup = await createVerifiedSqliteSnapshot({
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
		recordDoctorMigrationBackups(params.env, backupId, inventory);
	} catch (error) {
		warnings.push(`Migration backups remain protected; cleanup registration failed: ${formatErrorMessage(error)}`);
	}
	return {
		changes,
		warnings
	};
}
//#endregion
export { backupDoctorSqliteDatabases as n, backupDoctorMigrationDatabases as t };
