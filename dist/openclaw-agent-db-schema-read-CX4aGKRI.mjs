import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as OpenClawAgentDatabaseMediaMigrationRequiredError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { a as readSqliteUserVersion, n as createNewerSqliteSchemaVersionError } from "./sqlite-user-version-Q7gNRxhK.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
//#region src/state/openclaw-agent-db-schema-read.ts
function assertSupportedAgentSchemaVersion(db, pathname, userVersion = getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db)) {
	if (userVersion > 27) throw createNewerSqliteSchemaVersionError("OpenClaw agent database", pathname, userVersion, 27);
	return userVersion;
}
function hasAgentDatabaseApplicationSchema(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) {
		for (const names of [
			schema.tables,
			schema.views,
			schema.indexes,
			schema.triggers.keys()
		]) for (const name of names) if (!name.startsWith("sqlite_")) return true;
		return false;
	}
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE substr(name, 1, 7) <> 'sqlite_' LIMIT 1").get());
}
/** Persistence gates consume the catalog published by admission or schema maintenance. */
function assertCanonicalAgentPersistenceVersion(db, pathname, userVersion = getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db)) {
	const isNewUnownedDatabase = userVersion === 0 && !hasAgentDatabaseApplicationSchema(db);
	if (userVersion < 17 && !isNewUnownedDatabase) throw new OpenClawAgentDatabaseMediaMigrationRequiredError(pathname, userVersion);
	if (userVersion < 27 && !isNewUnownedDatabase) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} uses schema version ${userVersion}; stop active agents and run openclaw doctor --fix to migrate session identities before using it.`);
}
function assertExistingAgentSchemaOwner(existing, agentId, pathname) {
	if (!existing) return;
	if (existing.role !== "agent") throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} has schema role ${existing.role ?? "unknown"}; expected agent. Run openclaw doctor --fix to inspect and repair its ownership.`);
	if (!existing.agentId) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} has no agent owner. Run openclaw doctor --fix to inspect and repair its ownership.`);
	if (normalizeAgentId(existing.agentId) !== agentId) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} belongs to agent ${existing.agentId}; requested agent ${agentId}.`);
}
function assertCurrentAgentSchemaMetadata(metadata, agentId, pathname) {
	if (!metadata) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} has no schema ownership metadata. Run openclaw doctor --fix to inspect and repair its ownership.`);
	assertExistingAgentSchemaOwner(metadata, agentId, pathname);
	if (metadata.schemaVersion !== 27) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match 27; run openclaw doctor --fix before using it.`);
}
//#endregion
export { hasAgentDatabaseApplicationSchema as a, assertSupportedAgentSchemaVersion as i, assertCurrentAgentSchemaMetadata as n, assertExistingAgentSchemaOwner as r, assertCanonicalAgentPersistenceVersion as t };
