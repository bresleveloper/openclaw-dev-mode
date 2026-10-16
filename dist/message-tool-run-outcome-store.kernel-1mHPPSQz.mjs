import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
//#region src/infra/message-tool-run-outcome-store.kernel.ts
const MESSAGE_TOOL_RUN_OUTCOME_MAX_ROWS = 1e4;
/** Shared by the durable worker and the process-held incognito owner. */
function recordMessageToolRunOutcomeInDatabase(db, values) {
	const agentDb = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, agentDb.insertInto("message_tool_run_outcomes").values(values));
	executeSqliteQuerySync(db, agentDb.deleteFrom("message_tool_run_outcomes").where("id", "in", agentDb.selectFrom("message_tool_run_outcomes").select("id").orderBy("occurred_at", "desc").orderBy("id", "desc").limit(2147483647).offset(MESSAGE_TOOL_RUN_OUTCOME_MAX_ROWS)));
}
//#endregion
export { recordMessageToolRunOutcomeInDatabase as t };
