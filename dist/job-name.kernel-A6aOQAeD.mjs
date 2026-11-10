import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as getCronStoreKysely } from "./schema-2FnPKGGd.mjs";
//#region src/cron/store/job-name.kernel.ts
/** Shared-state/history workers; native saves are limited to Doctor transaction hooks. */
function readCronJobNamesInDatabase(db, jobIds, storePath) {
	if (getAdmittedSqliteSchemaFacts(db)?.tables.has("cron_jobs") === false) return /* @__PURE__ */ new Map();
	let query = getCronStoreKysely(db).selectFrom("cron_jobs").select(["job_id", "name"]).where("store_key", "=", storePath);
	if (jobIds) query = query.where("job_id", "in", sqliteStringSet(jobIds));
	const rows = executeSqliteQuerySync(db, query).rows;
	return new Map(rows.map((row) => [row.job_id, normalizeOptionalString(row.name)]));
}
//#endregion
export { readCronJobNamesInDatabase as t };
