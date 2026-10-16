import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BcJs-SM4.mjs";
//#region src/state/openclaw-agent-message-tool-outcome-schema.ts
const MESSAGE_TOOL_RUN_OUTCOMES_TABLE = "message_tool_run_outcomes";
const ENSURED_DATABASES = /* @__PURE__ */ new WeakSet();
/** Lazily installs the additive outcome table on first use. */
function ensureMessageToolRunOutcomeSchema(db, admit) {
	if (ENSURED_DATABASES.has(db)) return;
	runSqliteImmediateTransactionSync(db, () => {
		admit?.("transaction");
		db.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, MESSAGE_TOOL_RUN_OUTCOMES_TABLE, {
			endMarker: "CREATE TABLE IF NOT EXISTS session_goal_operations (",
			includeEndMarker: false,
			errorMessage: "OpenClaw message-tool run outcome schema markers are missing."
		}));
	}, { withCommit(commit) {
		admit?.("commit");
		commit();
	} });
	ENSURED_DATABASES.add(db);
}
//#endregion
export { ensureMessageToolRunOutcomeSchema as n, MESSAGE_TOOL_RUN_OUTCOMES_TABLE as t };
