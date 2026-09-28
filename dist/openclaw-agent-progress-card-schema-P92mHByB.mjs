import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { n as OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL } from "./openclaw-agent-board-schema-vd3Vff_q.mjs";
//#region src/state/openclaw-agent-progress-card-schema.ts
const SESSION_PROGRESS_CARDS_TABLE = "session_progress_cards";
const AGENT_PROGRESS_CARD_SCHEMA_SQL = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL, SESSION_PROGRESS_CARDS_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS heartbeat_outcomes (",
	includeEndMarker: false,
	errorMessage: "OpenClaw agent progress-card schema markers are missing."
});
const AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL = OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL.replace(AGENT_PROGRESS_CARD_SCHEMA_SQL, "");
/** Ensure the additive progress-card table inside the caller's write transaction. */
function ensureOpenClawAgentProgressCardSchemaInTransaction(db) {
	if (!db.isTransaction) throw new Error("progress-card schema ensure requires an active transaction");
	db.exec(AGENT_PROGRESS_CARD_SCHEMA_SQL);
}
//#endregion
export { ensureOpenClawAgentProgressCardSchemaInTransaction as i, AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL as n, SESSION_PROGRESS_CARDS_TABLE as r, AGENT_PROGRESS_CARD_SCHEMA_SQL as t };
