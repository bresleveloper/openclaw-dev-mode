import { d as expressionBuilder, i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as USAGE_COST_ROLLUP_SCOPE } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
//#region src/infra/session-cost-usage-cache.kernel.ts
const LEGACY_CACHE_SCOPE = "session-cost-usage";
const LEGACY_CACHE_KEY = "cache";
const REFRESH_LOCK_KEY = "refresh-lock";
const RETIRED_ROLLUP_SCOPES = ["session-cost-usage-rollup-v1", "session-cost-usage-rollup-v2"];
const ROLLUP_PRUNE_BATCH_SIZE = 32;
const cacheExpressions = expressionBuilder();
function cacheJsonText(value) {
	return typeof value === "string" ? value : cacheExpressions.cast(cacheExpressions.val(value), "text");
}
function readSessionCostUsageRefreshLockInDatabase(db) {
	const kysely = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, kysely.selectFrom("cache_entries").select("value_json").where("scope", "=", LEGACY_CACHE_SCOPE).where("key", "=", REFRESH_LOCK_KEY).limit(1)).rows[0]?.value_json ?? null;
}
function readSessionCostUsageRollupRowsInDatabase(db, filePaths) {
	return readSessionCostUsageRollupValuesInDatabase(db, filePaths, cacheExpressions.ref("value_json"));
}
function readSessionCostUsageRollupByteRowsInDatabase(db, filePaths) {
	return readSessionCostUsageRollupValuesInDatabase(db, filePaths, cacheExpressions.cast("value_json", "blob"));
}
function readSessionCostUsageRollupValuesInDatabase(db, filePaths, valueJson) {
	const kysely = getNodeSqliteKysely(db);
	return (filePaths ? chunkItems([...new Set(filePaths)], 500) : [void 0]).flatMap((keys) => {
		const query = kysely.selectFrom("cache_entries").select([
			"key",
			valueJson.as("value_json"),
			"updated_at"
		]).where("scope", "=", USAGE_COST_ROLLUP_SCOPE);
		return executeSqliteQuerySync(db, keys ? query.where("key", "in", keys) : query).rows;
	}).flatMap((row) => row.value_json === null ? [] : [{
		key: row.key,
		valueJson: row.value_json,
		updatedAt: row.updated_at
	}]);
}
function writeSessionCostUsageRollupInDatabase(db, params) {
	const kysely = getNodeSqliteKysely(db);
	const values = {
		value_json: cacheJsonText(params.valueJson),
		blob: params.blob,
		expires_at: null,
		updated_at: params.updatedAt
	};
	if (params.previousValueJson === null) return executeSqliteQuerySync(db, kysely.insertInto("cache_entries").values({
		scope: USAGE_COST_ROLLUP_SCOPE,
		key: params.rollupId,
		...values
	}).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet(values).where("value_json", "is", null))).numAffectedRows === 1n;
	return executeSqliteQuerySync(db, kysely.updateTable("cache_entries").set(values).where("scope", "=", USAGE_COST_ROLLUP_SCOPE).where("key", "=", params.rollupId).where("value_json", "=", cacheJsonText(params.previousValueJson))).numAffectedRows === 1n;
}
/** Read one body only while its exact metadata snapshot still owns the row. */
function readSessionCostUsageRollupBodyInDatabase(db, row) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("cache_entries").select("blob").where("scope", "=", USAGE_COST_ROLLUP_SCOPE).where("key", "=", row.key).where("updated_at", "=", row.updatedAt).where("value_json", "=", cacheJsonText(row.valueJson))).rows[0];
}
function pruneSessionCostUsageRollupsInDatabase(db, existing) {
	const kysely = getNodeSqliteKysely(db);
	for (const batch of chunkItems(existing, ROLLUP_PRUNE_BATCH_SIZE)) executeSqliteQuerySync(db, kysely.deleteFrom("cache_entries").where("scope", "=", USAGE_COST_ROLLUP_SCOPE).where("key", "in", batch.map((row) => row.key)).where((eb) => eb.or(batch.map((row) => eb.and([
		eb("key", "=", row.key),
		eb("value_json", "=", cacheJsonText(row.valueJson)),
		eb("updated_at", "=", row.updatedAt)
	])))));
	executeSqliteQuerySync(db, kysely.deleteFrom("cache_entries").where("scope", "=", LEGACY_CACHE_SCOPE).where("key", "=", LEGACY_CACHE_KEY));
	executeSqliteQuerySync(db, kysely.deleteFrom("cache_entries").where("scope", "in", RETIRED_ROLLUP_SCOPES));
}
function deleteSessionCostUsageRefreshLockInDatabase(db, valueJson) {
	const kysely = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, kysely.deleteFrom("cache_entries").where("scope", "=", LEGACY_CACHE_SCOPE).where("key", "=", REFRESH_LOCK_KEY).where("value_json", "=", valueJson));
}
function acquireSessionCostUsageRefreshLockInDatabase(db, params) {
	const kysely = getNodeSqliteKysely(db);
	if ((executeSqliteQuerySync(db, kysely.selectFrom("cache_entries").select("value_json").where("scope", "=", LEGACY_CACHE_SCOPE).where("key", "=", REFRESH_LOCK_KEY).limit(1)).rows[0]?.value_json ?? null) !== params.previousRaw || params.previousOwnerIsRunning) return false;
	executeSqliteQuerySync(db, kysely.insertInto("cache_entries").values({
		scope: LEGACY_CACHE_SCOPE,
		key: REFRESH_LOCK_KEY,
		value_json: params.lockJson,
		blob: null,
		expires_at: null,
		updated_at: params.startedAt
	}).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet({
		value_json: params.lockJson,
		blob: null,
		expires_at: null,
		updated_at: params.startedAt
	})));
	return true;
}
//#endregion
export { readSessionCostUsageRollupBodyInDatabase as a, writeSessionCostUsageRollupInDatabase as c, readSessionCostUsageRefreshLockInDatabase as i, deleteSessionCostUsageRefreshLockInDatabase as n, readSessionCostUsageRollupByteRowsInDatabase as o, pruneSessionCostUsageRollupsInDatabase as r, readSessionCostUsageRollupRowsInDatabase as s, acquireSessionCostUsageRefreshLockInDatabase as t };
