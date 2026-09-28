import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-CUXsFwAM.mjs";
import { a as readSqliteUserVersion, n as createNewerSqliteSchemaVersionError } from "./sqlite-user-version-B1TtVu8E.mjs";
import { t as OpenClawAgentDatabaseMediaMigrationRequiredError } from "./openclaw-agent-db-migration-required-Bp9xKbe6.mjs";
import "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
//#region src/state/openclaw-agent-db-schema-read.ts
function assertSupportedAgentSchemaVersion(db, pathname) {
	const userVersion = readSqliteUserVersion(db);
	if (userVersion > 23) throw createNewerSqliteSchemaVersionError("OpenClaw agent database", pathname, userVersion, 23);
	return userVersion;
}
/** Readers may pass their immediate check; writers reread the version after integrity work. */
function assertCanonicalAgentPersistenceVersion(db, pathname, userVersion = readSqliteUserVersion(db)) {
	const hasApplicationSchema = userVersion === 0 && db.prepare("SELECT 1 FROM sqlite_master WHERE substr(name, 1, 7) <> 'sqlite_' LIMIT 1").get();
	const isNewUnownedDatabase = userVersion === 0 && readExistingAgentSchemaMeta(db) === null && !hasApplicationSchema;
	if (userVersion < 17 && !isNewUnownedDatabase) throw new OpenClawAgentDatabaseMediaMigrationRequiredError(pathname, userVersion);
	if (userVersion < 23 && !isNewUnownedDatabase) throw new Error(`OpenClaw agent database ${pathname} uses schema version ${userVersion}; stop active agents and run openclaw doctor --fix to migrate session identities before using it.`);
}
function assertExistingAgentSchemaOwner(existing, agentId, pathname) {
	if (!existing) return;
	if (existing.role !== "agent") throw new Error(`OpenClaw agent database ${pathname} has schema role ${existing.role ?? "unknown"}; expected agent.`);
	if (!existing.agentId) throw new Error(`OpenClaw agent database ${pathname} has no agent owner.`);
	if (normalizeAgentId(existing.agentId) !== agentId) throw new Error(`OpenClaw agent database ${pathname} belongs to agent ${existing.agentId}; requested agent ${agentId}.`);
}
//#endregion
export { assertExistingAgentSchemaOwner as n, assertSupportedAgentSchemaVersion as r, assertCanonicalAgentPersistenceVersion as t };
