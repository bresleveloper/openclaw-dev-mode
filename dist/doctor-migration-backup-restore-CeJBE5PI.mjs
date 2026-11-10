import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { i as withDoctorSqliteMaintenanceLock } from "./doctor-sqlite-maintenance-lock-DU0BUhr6.mjs";
import { a as restoreScopedMigrationSnapshot } from "./sqlite-migration-scoped-snapshot-CevWEhoj.mjs";
import path from "node:path";
//#region src/commands/doctor-migration-backup-restore.ts
/** Scoped archives are applied in place, never substituted for a complete database. */
async function restoreDoctorMigrationBackup(params) {
	const sourcePath = path.resolve(params.sourcePath);
	const backupPath = path.resolve(params.backupPath);
	return withDoctorSqliteMaintenanceLock({
		env: params.env,
		operation: "scoped migration backup restore",
		protectedPaths: [...resolveSqliteDatabaseFilePaths(sourcePath), backupPath],
		run: (authority) => {
			restoreScopedMigrationSnapshot({
				sourcePath,
				backupPath,
				assertCurrent: () => authority.assertCurrent()
			});
			return {
				restored: true,
				sourcePath,
				backupPath
			};
		}
	});
}
//#endregion
export { restoreDoctorMigrationBackup };
