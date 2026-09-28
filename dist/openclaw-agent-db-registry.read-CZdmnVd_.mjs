import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as resolveOpenClawRegisteredAgentDatabasePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { f as detectOpenClawStateDatabaseSchemaMigrationsFromDatabase } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
//#region src/state/openclaw-agent-db-registry.read.ts
/** Read durable registrations from an already opened live or captured database. */
function readOpenClawAgentDatabaseRegistryRows(database, pathname) {
	const db = getNodeSqliteKysely(database);
	const registryTable = executeSqliteQueryTakeFirstSync(database, db.selectFrom("sqlite_master").select("type").where("name", "=", "agent_databases"));
	if (!registryTable) return [];
	if (registryTable.type !== "table") throw new Error(`OpenClaw state database ${pathname} has an invalid agent registry.`);
	return executeSqliteQuerySync(database, db.selectFrom("agent_databases").selectAll().orderBy("agent_id", "asc").orderBy("path", "asc")).rows;
}
function readAgentDatabasePreflightTargets(database, registryPath) {
	return readOpenClawAgentDatabaseRegistryRows(database, registryPath).flatMap((row) => typeof row.agent_id === "string" && typeof row.path === "string" ? [{
		agentId: row.agent_id,
		path: resolveOpenClawRegisteredAgentDatabasePath(registryPath, row.path)
	}] : []);
}
function readRegisteredAgentDatabaseRows(database, pathname, artifactPreserving) {
	const schemaMigrations = detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(database, pathname);
	if (!artifactPreserving && schemaMigrations.length > 0) throw new Error(`OpenClaw state database ${pathname} has a legacy agent database registry schema; run openclaw doctor --fix to migrate it.`);
	return readOpenClawAgentDatabaseRegistryRows(database, pathname).map((row) => ({
		agentId: normalizeAgentId(row.agent_id),
		path: resolveOpenClawRegisteredAgentDatabasePath(pathname, row.path),
		schemaVersion: row.schema_version,
		lastSeenAt: row.last_seen_at,
		sizeBytes: row.size_bytes
	}));
}
//#endregion
export { readOpenClawAgentDatabaseRegistryRows as n, readRegisteredAgentDatabaseRows as r, readAgentDatabasePreflightTargets as t };
