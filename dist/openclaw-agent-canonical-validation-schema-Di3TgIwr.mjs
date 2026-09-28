import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { i as normalizeSchemaSql, t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { c as readSqliteSchemaCookie } from "./sqlite-schema-contract-BFcZzasN.mjs";
import { i as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-board-schema-vd3Vff_q.mjs";
import { o as classifyOpenClawAgentDatabaseReadError } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
//#region src/state/openclaw-agent-canonical-validation-schema.ts
const definitionsSql = `SELECT name, sql FROM main.sqlite_schema
  WHERE name = 'session_canonical_validation_pending'
    OR (type = 'trigger' AND tbl_name IN (
      'session_nodes', 'session_windows', 'session_key_contract', 'session_canonical_validation_pending'
    ))`;
const validatedSchemas = resolveGlobalSingleton(Symbol.for("openclaw.agentCanonicalValidationSchemas"), () => /* @__PURE__ */ new WeakMap());
function readDefinitions(database) {
	const definitions = /* @__PURE__ */ new Map();
	const rows = database.prepare(definitionsSql).all();
	for (const row of rows) {
		if (typeof row.name !== "string" || typeof row.sql !== "string") throw new Error("Session canonical validation schema has an unreadable definition");
		definitions.set(row.name, normalizeSchemaSql(row.sql));
	}
	return definitions;
}
function expectedDefinitions() {
	return resolveGlobalSingleton(Symbol.for("openclaw.agentCanonicalValidationSchemaDefinitions"), () => {
		const database = openNodeSqliteDatabase(":memory:");
		try {
			database.exec([
				extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_nodes"),
				extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_windows"),
				extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_key_contract", {
					endMarker: "CREATE TABLE IF NOT EXISTS session_windows (",
					includeEndMarker: false
				}),
				canonicalSessionValidationSchemaSql()
			].join("\n"));
			return readDefinitions(database);
		} finally {
			database.close();
		}
	});
}
/** Require the exact invalidation group before an empty pending set can certify readiness. */
function assertCanonicalSessionValidationSchema(database) {
	const cookie = readSqliteSchemaCookie(database);
	if (typeof cookie !== "number") throw new Error("Session canonical validation schema version is unavailable");
	const cached = validatedSchemas.get(database);
	if (cached?.cookie === cookie) return;
	cached?.unregister();
	validatedSchemas.delete(database);
	const expected = expectedDefinitions();
	const actual = readDefinitions(database);
	for (const name of /* @__PURE__ */ new Set([...expected.keys(), ...actual.keys()])) if (expected.get(name) !== actual.get(name)) throw classifyOpenClawAgentDatabaseReadError(database, /* @__PURE__ */ new Error(`Session canonical validation schema is missing or drifted: ${name}; run openclaw doctor --fix with the compatible build.`));
	if (readSqliteSchemaCookie(database) !== cookie) throw new Error("Session canonical validation schema changed during admission; retry the read");
	if (!database.isTransaction) {
		const unregister = registerNodeSqliteDisposeCallback(database, () => {
			validatedSchemas.delete(database);
			unregister();
		});
		validatedSchemas.set(database, {
			cookie,
			unregister
		});
	}
}
/** The schema owner installs this complete group before seeding pending keys. */
function canonicalSessionValidationSchemaSql(schema = OPENCLAW_AGENT_SCHEMA_SQL) {
	return extractSqliteTableSchema(schema, "session_canonical_validation_pending", {
		endMarker: "CREATE TABLE IF NOT EXISTS conversations (",
		includeEndMarker: false
	});
}
/** Historical migration preflights cannot require the schema-21 validation projection. */
function withoutCanonicalSessionValidationSchema(schema) {
	if (!schema.includes("CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (")) return schema;
	return schema.replace(canonicalSessionValidationSchemaSql(schema), "");
}
//#endregion
export { canonicalSessionValidationSchemaSql as n, withoutCanonicalSessionValidationSchema as r, assertCanonicalSessionValidationSchema as t };
