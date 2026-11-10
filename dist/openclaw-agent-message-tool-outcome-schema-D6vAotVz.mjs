import { nt as extractSqliteTableSchema } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BKBD8edk.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
//#region src/state/openclaw-agent-message-tool-outcome-schema.ts
const MESSAGE_TOOL_RUN_OUTCOMES_TABLE = "message_tool_run_outcomes";
/** Lazily installs the additive outcome table on first use. */
function ensureMessageToolRunOutcomeSchema(db, admit) {
	const facts = getAdmittedSqliteSchemaFacts(db);
	if (facts?.tables.has("message_tool_run_outcomes") && facts.indexes.has("idx_agent_message_tool_run_outcomes_occurred")) return;
	const install = () => {
		db.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, MESSAGE_TOOL_RUN_OUTCOMES_TABLE, {
			endMarker: "CREATE TABLE IF NOT EXISTS session_goal_operations (",
			includeEndMarker: false,
			errorMessage: "OpenClaw message-tool run outcome schema markers are missing."
		}));
	};
	if (db.isTransaction) {
		install();
		return;
	}
	runSqliteImmediateTransactionSync(db, () => {
		admit?.("transaction");
		install();
	}, { withCommit(commit) {
		admit?.("commit");
		commit();
	} });
}
//#endregion
export { ensureMessageToolRunOutcomeSchema as n, MESSAGE_TOOL_RUN_OUTCOMES_TABLE as t };
