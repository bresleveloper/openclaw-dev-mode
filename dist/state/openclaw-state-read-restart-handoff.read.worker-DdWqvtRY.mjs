import { t as createSubsystemLogger } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import "./openclaw-state-read-sqlite-worker-operation-admission-we1rdJYO.mjs";
import "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import "./openclaw-state-read-openclaw-state-worker-store-CiPw7-m3.mjs";
import "node:util";
import "node:crypto";
//#region src/infra/restart-handoff.ts
const GATEWAY_SUPERVISOR_RESTART_HANDOFF_KEY = "current";
createSubsystemLogger("restart-handoff");
new RegExp(String.raw`[\u0000-\u001f\u007f\s]+`, "gu");
function selectGatewayRestartHandoffRowSync(db) {
	const stateDb = getNodeSqliteKysely(db);
	return executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("gateway_restart_handoff").select([
		"kind",
		"version",
		"intent_id",
		"pid",
		"process_instance_id",
		"created_at",
		"expires_at",
		"reason",
		"restart_trace_started_at",
		"restart_trace_last_at",
		"source",
		"restart_kind",
		"supervisor_mode"
	]).where("handoff_key", "=", GATEWAY_SUPERVISOR_RESTART_HANDOFF_KEY));
}
//#endregion
//#region src/infra/restart-handoff.read.worker.ts
const restartHandoffReadOperations = { "restartLifecycle.readHandoff": (_input, database) => ({
	type: "restartLifecycle.readHandoff",
	row: selectGatewayRestartHandoffRowSync(database)
}) };
//#endregion
export { restartHandoffReadOperations };
