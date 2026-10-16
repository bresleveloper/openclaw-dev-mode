import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { n as getInvalidPersistedCronJobReason } from "./persisted-shape-wTzSQpQE.mjs";
import { r as getCronStoreKysely } from "./schema-DOrtVteD.mjs";
//#region src/commands/doctor/cron/store-inventory.ts
/** SQL ownership is independently authoritative when legacy JSON omits it. */
function inspectCronOwnerRowsForDoctor(db, storeKey) {
	if (!tableExists(db, "cron_jobs")) return [];
	return executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").select([
		"job_id",
		"agent_id",
		"job_json",
		"sort_order"
	]).where("store_key", "=", storeKey).orderBy("sort_order").orderBy("job_id")).rows;
}
/** Raw inspection deliberately bypasses runtime loading and its repair/filter policies. */
function inspectCronRowsForDoctor(db) {
	if (!tableExists(db, "cron_jobs")) return [];
	return executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").select([
		"store_key",
		"job_id",
		"declaration_key",
		"job_json",
		"state_json",
		"sort_order"
	]).orderBy("store_key").orderBy("sort_order").orderBy("job_id")).rows.map((row) => {
		const definition = safeParseJsonRecord(row.job_json) ?? null;
		const state = safeParseJsonRecord(row.state_json);
		const invalidReason = !definition ? "invalid-definition-json" : definition.id !== row.job_id ? "job-id-mismatch" : (definition.declarationKey ?? null) !== row.declaration_key ? "declaration-key-mismatch" : !state ? "invalid-state-json" : getInvalidPersistedCronJobReason({
			...definition,
			state
		});
		const inspected = {
			storeKey: row.store_key,
			id: row.job_id,
			sortOrder: row.sort_order,
			definitionJson: row.job_json,
			definition
		};
		if (invalidReason) inspected.invalidReason = invalidReason;
		return inspected;
	});
}
//#endregion
export { inspectCronRowsForDoctor as n, inspectCronOwnerRowsForDoctor as t };
