import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
//#region src/config/io.health-state.kernel.ts
function parseFingerprint(value) {
	const parsed = safeParseJson(value ?? "");
	return parsed && typeof parsed === "object" ? parsed : void 0;
}
function stringifyFingerprint(value) {
	return value ? JSON.stringify(value) : null;
}
function selectConfigHealthRows(db) {
	const query = getNodeSqliteKysely(db).selectFrom("config_health_entries").select([
		"config_path",
		"last_known_good_json",
		"last_promoted_good_json",
		"last_observed_suspicious_signature",
		"updated_at_ms"
	]);
	return executeSqliteQuerySync(db, query.orderBy("config_path", "asc")).rows;
}
function decodeConfigHealthRows(rows) {
	return { entries: Object.fromEntries(rows.map((row) => [row.config_path, {
		lastKnownGood: parseFingerprint(row.last_known_good_json),
		lastPromotedGood: parseFingerprint(row.last_promoted_good_json),
		lastObservedSuspiciousSignature: row.last_observed_suspicious_signature
	}])) };
}
function readConfigHealthStateInDatabase(db) {
	return decodeConfigHealthRows(selectConfigHealthRows(db));
}
/** Omitted fields remain untouched; explicit undefined and null clear their stored value. */
function prepareConfigHealthPatch(changes) {
	return {
		...Object.hasOwn(changes, "lastKnownGood") ? { last_known_good_json: stringifyFingerprint(changes.lastKnownGood) } : {},
		...Object.hasOwn(changes, "lastPromotedGood") ? { last_promoted_good_json: stringifyFingerprint(changes.lastPromotedGood) } : {},
		...Object.hasOwn(changes, "lastObservedSuspiciousSignature") ? { last_observed_suspicious_signature: changes.lastObservedSuspiciousSignature ?? null } : {}
	};
}
/** Compare the original read and merge in one write transaction, preserving untouched JSON. */
function patchConfigHealthEntryInDatabase(db, configPath, patch, expected, updatedAtMs) {
	if (expected === void 0) return false;
	const sql = getNodeSqliteKysely(db);
	const query = expected === null ? sql.insertInto("config_health_entries").values({
		config_path: configPath,
		last_known_good_json: null,
		last_promoted_good_json: null,
		last_observed_suspicious_signature: null,
		...patch,
		updated_at_ms: updatedAtMs
	}).onConflict((conflict) => conflict.column("config_path").doNothing()) : sql.updateTable("config_health_entries").set({
		...patch,
		updated_at_ms: updatedAtMs
	}).where("config_path", "=", configPath).where("last_known_good_json", "is", expected.lastKnownGoodJson).where("last_promoted_good_json", "is", expected.lastPromotedGoodJson).where("last_observed_suspicious_signature", "is", expected.suspiciousSignature).where("updated_at_ms", "=", expected.updatedAtMs);
	return executeSqliteQuerySync(db, query).numAffectedRows === 1n;
}
/** The caller owns the transaction; omitted fields and sibling paths remain unchanged. */
function writeConfigHealthPatchInDatabase(db, configPath, patch, updatedAtMs) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("config_health_entries").values({
		config_path: configPath,
		last_known_good_json: null,
		last_promoted_good_json: null,
		last_observed_suspicious_signature: null,
		...patch,
		updated_at_ms: updatedAtMs
	}).onConflict((conflict) => conflict.column("config_path").doUpdateSet({
		...patch,
		updated_at_ms: updatedAtMs
	})));
}
//#endregion
export { writeConfigHealthPatchInDatabase as i, prepareConfigHealthPatch as n, readConfigHealthStateInDatabase as r, patchConfigHealthEntryInDatabase as t };
