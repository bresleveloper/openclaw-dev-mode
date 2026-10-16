import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { b as writeSessionSqliteMigrationManifest, d as listSessionSqliteMigrationManifestPaths, g as resolveSessionSqliteMigrationRunsDir, i as canonicalMigrationFilePath, l as hasSymbolicLinkInDirectoryPath, p as readSessionSqliteMigrationManifest, w as readMigrationArtifactIdentity } from "./session-sqlite-migration-manifest-CT3ckmkL.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-migration-backup-artifacts.ts
/** Record the producer's verified originals in the existing recovery inventory. */
function recordDoctorMigrationBackups(env, backupId, inventory) {
	const runId = `startup-migration-${backupId}`;
	const manifestPath = path.join(resolveSessionSqliteMigrationRunsDir(env), `${runId}.json`);
	if (hasSymbolicLinkInDirectoryPath(path.dirname(manifestPath))) throw new Error("Migration backup manifest directory is aliased");
	if (fs.existsSync(manifestPath)) {
		if (!readSessionSqliteMigrationManifest(manifestPath)) throw new Error(`Cannot read migration backup manifest: ${manifestPath}`);
		return;
	}
	const targets = inventory.map(({ path: source, identity }) => {
		const move = {
			kind: "database-backup",
			sourcePath: source,
			archivePath: `${source}.pre-startup-migration-${backupId}.bak`,
			artifact: {
				identity: readMigrationArtifactIdentity(`${source}.pre-startup-migration-${backupId}.bak`),
				classification: "repair-original",
				reason: "pre-startup-migration-backup",
				dependencies: [],
				disposal: { state: "retained" }
			}
		};
		return {
			agentId: "startup-migration",
			storePath: source,
			sqlitePath: source,
			databaseIdentity: {
				dev: String(identity.dev),
				ino: String(identity.ino)
			},
			plannedMoves: [move],
			completedMoves: [move],
			issues: [],
			validationBeforeArchive: "not_run"
		};
	});
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
	writeSessionSqliteMigrationManifest({
		manifestPath,
		manifest: {
			manifestVersion: 3,
			runId,
			openClawVersion: VERSION,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			targets
		}
	});
}
/** Called only after Doctor's database readiness owner verifies the whole fleet. */
function completeDoctorMigrationBackups(env, verifiedDatabasePaths) {
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (!maintenance?.ownsSchemaMaintenance) return;
	const verified = new Set([...verifiedDatabasePaths, resolveOpenClawStateSqlitePath(env)].map(canonicalMigrationFilePath));
	for (const manifestPath of listSessionSqliteMigrationManifestPaths(env)) {
		const manifest = readSessionSqliteMigrationManifest(manifestPath);
		if (!manifest || manifest.completedAt || !manifest.targets.length || !manifest.targets.every(({ databaseIdentity, sqlitePath }) => {
			if (!databaseIdentity || !verified.has(sqlitePath)) return false;
			const current = fs.lstatSync(sqlitePath, {
				bigint: true,
				throwIfNoEntry: false
			});
			return current?.isFile() && current.nlink === 1n && String(current.dev) === databaseIdentity.dev && String(current.ino) === databaseIdentity.ino;
		})) continue;
		maintenance.assertAdmission();
		for (const target of manifest.targets) target.validationBeforeArchive = "passed";
		manifest.completedAt = (/* @__PURE__ */ new Date()).toISOString();
		writeSessionSqliteMigrationManifest({
			manifest,
			manifestPath
		});
	}
}
//#endregion
export { recordDoctorMigrationBackups as n, completeDoctorMigrationBackups as t };
