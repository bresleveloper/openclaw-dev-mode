import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { r as getCronStoreKysely } from "./schema-DOrtVteD.mjs";
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
