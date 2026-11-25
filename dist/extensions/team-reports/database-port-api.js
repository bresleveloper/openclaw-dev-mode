import { n as openTeamReportsDatabase, r as TEAM_REPORTS_POSTGRES_SCHEMA_SQL } from "./.setup/store.worker-CBZmY-9j.mjs";
import { admitSqliteSchema, getAdmittedSqliteSchemaFacts } from "openclaw/plugin-sdk/sqlite-worker-runtime";
// extensions/team-reports/database-port-api.ts
const teamReportsDatabasePortApi = {
	postgres: TEAM_REPORTS_POSTGRES_SCHEMA_SQL,
	inspectSqliteSource(db) {
		admitSqliteSchema(db);
		if ((getAdmittedSqliteSchemaFacts(db)?.userVersion ?? 0) > 2) throw new Error(`Team Reports requires SQLite schema version at most 2`);
		const rows = db.prepare("SELECT id FROM team_reports_schema_migrations").all();
		let version = 0;
		for (const row of rows) {
			const match = typeof row.id === "string" && /^schema-([1-9][0-9]*)$/.exec(row.id);
			if (!match || Number(match[1]) > 2) throw new Error(`Unknown Team Reports schema migration; required schema 2`);
			version = Math.max(version, Number(match[1]));
		}
		return {
			version,
			migrationRequired: version < 2,
			pendingColumns: {}
		};
	},
	admit(file, input) {
		openTeamReportsDatabase(file, input).close();
	}
};
export { teamReportsDatabasePortApi };
