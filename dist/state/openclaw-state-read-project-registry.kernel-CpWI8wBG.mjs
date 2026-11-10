import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { a as tableExists } from "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
import { g as createOpenClawStateSchemaEnsurer } from "./openclaw-state-read-openclaw-state-read-handlers-BUnsgff9.mjs";
createOpenClawStateSchemaEnsurer({
	table: "projects",
	operationLabel: "projects.registry.schema.ensure"
});
function rowToProject(row) {
	return {
		id: row.id,
		displayName: row.display_name,
		repoRoot: row.repo_root,
		...row.origin_url ? { originUrl: row.origin_url } : {},
		source: row.source
	};
}
const projectRegistryReadOperations = { "projects.list": (_input, database) => ({
	type: "projects.list",
	projects: tableExists(database, "projects") ? executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("projects").selectAll()).rows.map(rowToProject) : []
}) };
//#endregion
export { projectRegistryReadOperations };
