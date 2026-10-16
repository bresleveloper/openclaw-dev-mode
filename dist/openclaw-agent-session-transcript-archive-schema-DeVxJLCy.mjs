import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BcJs-SM4.mjs";
//#region src/infra/sqlite-schema-ensure.ts
/** Cache additive DDL only after its owning transaction commits. */
function createSqliteSchemaEnsurer(schemaSql) {
	const committed = /* @__PURE__ */ new WeakSet();
	return {
		recordCommitted(database) {
			committed.add(database);
		},
		ensure(database) {
			if (committed.has(database)) return false;
			const install = () => {
				database.exec(schemaSql());
			};
			if (database.isTransaction) {
				install();
				return true;
			}
			runSqliteImmediateTransactionSync(database, install);
			committed.add(database);
			return false;
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-session-transcript-archive-schema.ts
const SESSION_TRANSCRIPT_ARCHIVES_TABLE = "session_transcript_archives";
const schema = createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_TRANSCRIPT_ARCHIVES_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (",
	includeEndMarker: false,
	errorMessage: "OpenClaw session transcript archive schema markers are missing."
}));
/** Lazily installs the additive canonical archive owner on first archive use. */
function ensureSessionTranscriptArchiveSchema(db) {
	schema.ensure(db);
}
//#endregion
export { ensureSessionTranscriptArchiveSchema as n, createSqliteSchemaEnsurer as r, SESSION_TRANSCRIPT_ARCHIVES_TABLE as t };
