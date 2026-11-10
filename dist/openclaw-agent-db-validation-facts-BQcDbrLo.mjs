import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { C as readSqliteDatabaseIntegrityVerification, nt as extractSqliteTableSchema, tt as parseSqliteTableDefinition } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BKBD8edk.mjs";
import { i as getAdmittedSqliteSchemaFacts, p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { randomUUID } from "node:crypto";
//#region src/state/openclaw-agent-standing-intents-schema.ts
const STANDING_INTENTS_TABLE = "standing_intents";
const STANDING_INTENTS_FTS_TABLE = "standing_intents_fts";
const STANDING_INTENTS_FTS_SHADOW_TABLES = [
	"standing_intents_fts_config",
	"standing_intents_fts_data",
	"standing_intents_fts_docsize",
	"standing_intents_fts_idx"
];
const creatorColumnSql = "creator_sender TEXT CHECK (creator_sender IS NULL OR length(trim(creator_sender)) > 0)";
const admittedSchemas = /* @__PURE__ */ new WeakSet();
function hasCurrentStandingIntentsSchema(db) {
	try {
		const facts = getAdmittedSqliteSchemaFacts(db);
		if (!facts) return false;
		if (admittedSchemas.has(facts)) return true;
		if (![
			"standing_intents",
			"standing_intents_fts",
			...STANDING_INTENTS_FTS_SHADOW_TABLES
		].every((table) => facts.tables.has(table)) || !["idx_standing_intents_lifecycle", "idx_standing_intents_scope"].every((index) => facts.indexes.has(index)) || ![
			"standing_intents_fts_after_insert",
			"standing_intents_fts_after_delete",
			"standing_intents_fts_after_update"
		].every((trigger) => facts.triggers.has(trigger)) || parseSqliteTableDefinition(facts.tableSql.get("standing_intents") ?? null, "standing_intents").columns.get("creator_sender") !== creatorColumnSql) return false;
		admittedSchemas.add(facts);
		return true;
	} catch {
		return false;
	}
}
/** The optional synchronous owner supplies write grants only when main-schema DDL is needed. */
function ensureOpenClawAgentStandingIntentsSchema(db, transact) {
	runSqliteReadOperationSync(db, () => {
		if (hasCurrentStandingIntentsSchema(db)) return;
		const ensure = () => {
			if (hasCurrentStandingIntentsSchema(db)) return;
			const schemaSql = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, STANDING_INTENTS_TABLE, {
				endMarker: "CREATE TABLE IF NOT EXISTS session_transcript_index_state (",
				includeEndMarker: false,
				errorMessage: "OpenClaw standing-intents schema markers are missing."
			});
			db.exec(schemaSql.replaceAll(/CREATE ((?:VIRTUAL )?TABLE|INDEX|TRIGGER) IF NOT EXISTS /gu, "CREATE $1 IF NOT EXISTS main."));
			if (!db.prepare("PRAGMA main.table_info(standing_intents)").all().some((column) => column.name === "creator_sender")) db.exec(`ALTER TABLE main.standing_intents ADD COLUMN ${creatorColumnSql}`);
		};
		if (db.isTransaction) ensure();
		else if (transact) transact(ensure);
		else runSqliteImmediateTransactionSync(db, ensure);
	});
}
//#endregion
//#region src/state/openclaw-agent-db-validation-facts.ts
const agentDatabaseValidationKey = {
	name: "agent.completed-validation",
	read(value) {
		return isRecord(value) ? value : void 0;
	}
};
function createOpenClawAgentDatabaseValidationReceipt(database, canonicalReady) {
	const { identity, birthtime } = readOpenClawAgentDatabaseIdentity(database);
	if (typeof identity !== "string" || birthtime === void 0) throw new Error("Only persistent agent databases retain integrity validation");
	const validation = {
		agentId: database.agentId,
		identity,
		birthtime,
		receiptId: randomUUID(),
		integrityVerifiedAt: readSqliteDatabaseIntegrityVerification(database.db)?.verifiedAt,
		valid: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),
		canonicalReady: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
	};
	if (canonicalReady) Atomics.store(new Int32Array(validation.canonicalReady), 0, 1);
	Atomics.store(new Int32Array(validation.valid), 0, 1);
	return validation;
}
//#endregion
export { STANDING_INTENTS_TABLE as a, STANDING_INTENTS_FTS_TABLE as i, createOpenClawAgentDatabaseValidationReceipt as n, ensureOpenClawAgentStandingIntentsSchema as o, STANDING_INTENTS_FTS_SHADOW_TABLES as r, agentDatabaseValidationKey as t };
