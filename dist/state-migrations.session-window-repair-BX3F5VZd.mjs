import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { h as backupDoctorSqliteRepair } from "./openclaw-state-db-BtDOU_3j.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { r as assertAgentDatabaseMaintenanceAuthority, u as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { r as assertOpenClawAgentSchemaContains, s as getOpenClawAgentMigrationSchema } from "./openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { n as deleteSessionTranscriptFtsRowsInTransaction } from "./session-transcript-fts-BGvn_VQW.mjs";
import { n as assertOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-maintenance-DIdAFgIX.mjs";
import { t as withAgentDatabaseMaintenanceLease } from "./openclaw-agent-db-maintenance-lease-BnxXacoQ.mjs";
//#region src/infra/state-migrations.session-window-repair.ts
/** Doctor alone may remove windows whose logical node no longer exists. */
function repairDoctorSessionWindowOrphans(database, pathname, assertCurrent) {
	assertCurrent();
	const schemaVersion = readSqliteUserVersion(database);
	if (schemaVersion > 27 || schemaVersion < 24) return [];
	if (readExistingAgentSchemaMeta(database)?.schemaVersion !== schemaVersion) throw new SqliteSchemaMismatchError(`Agent schema markers disagree for ${pathname}; repair ownership metadata before orphan-window repair.`);
	assertOpenClawAgentSchemaContains(database, pathname, getOpenClawAgentMigrationSchema(schemaVersion), "current", true);
	database.exec("PRAGMA foreign_keys = ON;");
	return runSqliteImmediateTransactionSync(database, () => {
		assertCurrent();
		const db = getNodeSqliteKysely(database);
		const windows = db.selectFrom("session_windows").leftJoin("session_nodes", "session_nodes.session_key", "session_windows.session_key").where("session_nodes.session_key", "is", null).select("session_windows.session_id");
		if (!executeSqliteQueryTakeFirstSync(database, windows)) return [];
		const backupPath = backupDoctorSqliteRepair(pathname, "session-window");
		assertCurrent();
		const foreignKeys = database.prepare("PRAGMA foreign_key_list(session_windows);");
		foreignKeys.setReadBigInts(true);
		const keys = foreignKeys.all();
		const nodeKey = keys.find((key) => key.table === "session_nodes" && key.from === "session_key" && key.to === "session_key" && key.on_delete === "CASCADE");
		const nodeKeyId = nodeKey && keys.filter((key) => key.id === nodeKey.id).length === 1 ? nodeKey.id : void 0;
		const violations = database.prepare("PRAGMA foreign_key_check;");
		violations.setReadBigInts(true);
		for (const violation of violations.iterate()) if (violation.table !== "session_windows" || violation.parent !== "session_nodes" || violation.fkid !== nodeKeyId) assertSqliteIntegrity(database, pathname);
		invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(pathname);
		assertCurrent();
		for (const window of iterateSqliteQuerySync(database, windows)) deleteSessionTranscriptFtsRowsInTransaction(database, window.session_id);
		const deleted = executeSqliteQuerySync(database, db.deleteFrom("session_windows").where("session_id", "in", windows));
		assertSqliteIntegrity(database, pathname);
		return [`Saved pre-repair SQLite backup: ${backupPath}`, `Removed ${deleted.numAffectedRows} orphan session window(s) from ${pathname}; their dependent history remains in the backup.`];
	}, {
		databaseLabel: pathname,
		operationLabel: "session.orphan-window-repair",
		withCommit: (commit) => {
			assertCurrent();
			commit();
		}
	});
}
/** Repair supported session-window shapes before the full migration backup admits their rows. */
async function repairDoctorSessionWindowsBeforeMigration(params) {
	return withAgentDatabaseMaintenanceLease({
		env: params.env,
		schemaPolicy: "existing",
		processBound: true
	}, async (maintenance) => {
		const changes = [];
		for (const target of params.targets) {
			assertAgentDatabaseMaintenanceAuthority(maintenance);
			const pathname = target.path;
			const database = openNodeSqliteDatabase(pathname);
			try {
				const assertCurrent = () => {
					assertAgentDatabaseMaintenanceAuthority(maintenance);
					assertOpenClawAgentDatabaseOwner(database, {
						agentId: target.agentId,
						pathname
					});
				};
				changes.push(...repairDoctorSessionWindowOrphans(database, pathname, assertCurrent));
			} finally {
				database.close();
			}
		}
		return changes;
	});
}
//#endregion
export { repairDoctorSessionWindowsBeforeMigration as n, repairDoctorSessionWindowOrphans as t };
