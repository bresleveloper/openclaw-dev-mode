import { nt as extractSqliteTableSchema } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BKBD8edk.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
//#region src/state/openclaw-agent-session-transcript-archive-schema.ts
const SESSION_TRANSCRIPT_ARCHIVES_TABLE = "session_transcript_archives";
/** Lazily installs the additive canonical archive owner on first archive use. */
const ensureSessionTranscriptArchiveSchema = createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_TRANSCRIPT_ARCHIVES_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (",
	includeEndMarker: false,
	errorMessage: "OpenClaw session transcript archive schema markers are missing."
}), {
	tables: [SESSION_TRANSCRIPT_ARCHIVES_TABLE, "session_transcript_cold_archives"],
	indexes: ["idx_agent_session_transcript_archives_pending", "idx_agent_session_transcript_archives_retention"]
});
//#endregion
export { ensureSessionTranscriptArchiveSchema as n, SESSION_TRANSCRIPT_ARCHIVES_TABLE as t };
