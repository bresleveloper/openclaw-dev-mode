import { i as getAdmittedSqliteSchemaFacts, t as admitSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import "./sqlite-worker-runtime-Da3qtgYL.mjs";
import { t as createWorkboardDatabase } from "./sqlite-store-schema-BlzFlT6H.mjs";
//#region extensions/workboard/database-port-api.ts
var WorkboardPortSchemaError = class extends Error {};
/** Read-only version evidence before the owner is allowed to migrate a private copy. */
function inspectWorkboardPortSource(db) {
	admitSqliteSchema(db);
	const userVersion = getAdmittedSqliteSchemaFacts(db)?.userVersion ?? 0;
	if (userVersion > 3) throw new WorkboardPortSchemaError(`schema version ${userVersion}; required at most 3`);
	const rows = db.prepare("SELECT id FROM workboard_schema_migrations").all();
	let version = 0;
	for (const row of rows) {
		const match = typeof row.id === "string" && /^schema-([1-9][0-9]*)$/.exec(row.id);
		if (!match || Number(match[1]) > 3) throw new WorkboardPortSchemaError(`unknown schema migration; required workboard schema 3`);
		version = Math.max(version, Number(match[1]));
	}
	return {
		version,
		migrationRequired: version < 3,
		pendingColumns: version < 3 ? { workboard_boards: [
			"automation_job_id",
			"kind",
			"sessions_spec"
		] } : { workboard_boards: [] }
	};
}
/** Only private copies/staged destinations: reuse the normal owner's migrations and admission. */
function admitWorkboardPort(dbPath, input) {
	createWorkboardDatabase(dbPath, void 0, input).close();
}
const workboardDatabasePortApi = {
	inspectWorkboardPortSource,
	admitWorkboardPort,
	WorkboardPortSchemaError
};
//#endregion
export { workboardDatabasePortApi as t };
