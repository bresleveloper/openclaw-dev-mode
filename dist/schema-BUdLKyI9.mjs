import { i as getNodeSqliteKysely } from "./kysely-sync-Bn6Qrpbz.mjs";
//#region src/cron/store/schema.ts
const CRON_JOB_READ_COLUMNS = [
	"job_id",
	"declaration_key",
	"enabled",
	"agent_id",
	"payload_kind",
	"job_json",
	"state_json",
	"runtime_updated_at_ms",
	"schedule_identity",
	"sort_order",
	"updated_at"
];
const CRON_JOB_GENERATION_READ_COLUMNS = [
	...CRON_JOB_READ_COLUMNS.slice(0, 6),
	"grant_definition_revision",
	"grant_definition_generation",
	"grant_definition_updated_at",
	...CRON_JOB_READ_COLUMNS.slice(6)
];
/** Creates the Kysely facade scoped to cron_jobs for synchronous SQLite access. */
function getCronStoreKysely(db) {
	return getNodeSqliteKysely(db);
}
//#endregion
export { CRON_JOB_READ_COLUMNS as n, getCronStoreKysely as r, CRON_JOB_GENERATION_READ_COLUMNS as t };
