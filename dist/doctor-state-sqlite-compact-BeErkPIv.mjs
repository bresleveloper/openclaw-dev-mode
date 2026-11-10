import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { t as clearOpenClawDatabaseQuarantine } from "./openclaw-quarantine-store-DTWp4-ja.mjs";
import { a as clearOpenClawStateDatabaseOpenFailure, p as isOpenClawStateDatabaseOpen } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { C as assertOpenClawStateDatabaseForMaintenance } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { n as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { y as ensureOpenClawStatePermissions } from "./openclaw-state-db-BtDOU_3j.mjs";
import { i as withDoctorSqliteMaintenanceLock } from "./doctor-sqlite-maintenance-lock-DU0BUhr6.mjs";
import { n as compactDoctorSqliteFile } from "./doctor-sqlite-compact-Dy6gYKlq.mjs";
import fs from "node:fs";
//#region src/commands/doctor-state-sqlite-compact.ts
/** Explicit doctor maintenance for the canonical shared state SQLite database. */
/** Compact only the canonical shared state database resolved for this invocation. */
async function runDoctorStateSqliteCompact(options = {}) {
	const env = options.env ?? process.env;
	const sqlitePath = resolveOpenClawStateSqlitePath(env);
	const stat = fs.lstatSync(sqlitePath, { throwIfNoEntry: false });
	if (!stat) return {
		mode: "compact",
		path: sqlitePath,
		reason: "missing",
		skipped: true
	};
	if (!stat.isFile()) throw new Error(`OpenClaw state database is not a regular file: ${sqlitePath}`);
	return await withDoctorSqliteMaintenanceLock({
		env,
		operation: "state SQLite compaction",
		protectedPaths: resolveSqliteDatabaseFilePaths(sqlitePath),
		run: (authority) => {
			authority.assertCurrent();
			if (isOpenClawStateDatabaseOpen()) throw new Error("The shared OpenClaw state database is already open in this process. Stop OpenClaw and retry.");
			return {
				...compactDoctorSqliteFile({
					afterSuccess: () => {
						if (!clearOpenClawDatabaseQuarantine(sqlitePath, { env })) throw new Error(`OpenClaw state database ${sqlitePath} was compacted, but its persisted quarantine record could not be cleared. Rerun openclaw doctor --fix so the database is not refused again.`);
						clearOpenClawStateDatabaseOpenFailure(sqlitePath);
						ensureOpenClawStatePermissions(sqlitePath, env);
					},
					sqlitePath,
					validateBeforeMutation: (database) => {
						authority.assertCurrent();
						assertOpenClawStateWriteAllowed({
							database,
							databasePath: sqlitePath,
							env
						});
						assertOpenClawStateDatabaseForMaintenance(database, { pathname: sqlitePath });
					}
				}),
				mode: "compact",
				path: sqlitePath,
				skipped: false
			};
		}
	});
}
//#endregion
export { runDoctorStateSqliteCompact };
