import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { l as repairOpenClawStateDatabaseSchema } from "./openclaw-state-db-BtDOU_3j.mjs";
import { i as ensureOpenClawAgentDatabaseSchemaSteps } from "./openclaw-agent-db-schema-BUhCxlqc.mjs";
import { t as runSqliteIntegrityOperationInWorker } from "./sqlite-integrity-operation-B18PJAFa.mjs";
import { t as withAgentDatabaseMaintenanceLease } from "./openclaw-agent-db-maintenance-lease-BnxXacoQ.mjs";
import { t as backupDoctorMigrationDatabases } from "./doctor-migration-backup-CaaJT0rP.mjs";
import { t as completeDoctorMigrationBackups } from "./doctor-migration-backup-artifacts-BIjn9so3.mjs";
//#region src/commands/doctor-schema-migrations.ts
/** Commit the declared version phase before ordinary Doctor maintenance begins. */
async function prepareDoctorDatabaseMigrations(params) {
	const result = await backupDoctorMigrationDatabases({
		...params,
		versionMigrationsOnly: true
	});
	const migrations = result.versionMigrations;
	if (!migrations?.length) return result;
	for (const migration of migrations.filter((entry) => entry.kind === "state")) {
		const migrated = repairOpenClawStateDatabaseSchema({
			path: migration.path,
			env: params.env,
			versionMigrationOnly: true
		});
		if (migrated.warnings.length > 0) throw new Error(migrated.warnings.join("\n"));
		result.changes.push(...migrated.changes);
	}
	const agentMigrations = migrations.filter((entry) => entry.kind === "agent");
	if (agentMigrations.length > 0) await withAgentDatabaseMaintenanceLease({
		env: params.env,
		processBound: true
	}, async (lease) => {
		for (const migration of agentMigrations) try {
			var _usingCtx$1 = _usingCtx();
			const target = params.agentDatabaseTargets?.find(({ path }) => path === migration.path);
			if (!target) throw new Error(`Missing discovered agent migration target: ${migration.path}`);
			const database = _usingCtx$1.u(openNodeSqliteDatabase(target.path));
			await runSqliteIntegrityOperationInWorker(ensureOpenClawAgentDatabaseSchemaSteps(database, {
				agentId: target.agentId,
				path: target.path,
				env: params.env,
				versionMigrationOnly: true,
				onMigrationWarning: (warning) => result.warnings.push(warning)
			}), {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				signal: lease.signal,
				beforeResume: () => lease.assertOwned()
			});
			result.changes.push(`Upgraded agent database schema in ${target.path}: v${migration.foundVersion} -> v${migration.supportedVersion}.`);
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	});
	try {
		completeDoctorMigrationBackups(params.env, params.databasePaths, true);
	} catch (error) {
		result.warnings.push(`Could not mark committed schema migration backups complete: ${formatErrorMessage(error)}`);
	}
	return result;
}
//#endregion
export { prepareDoctorDatabaseMigrations };
