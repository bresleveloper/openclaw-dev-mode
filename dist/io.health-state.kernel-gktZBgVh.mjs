import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
//#region src/config/io.health-state.kernel.ts
function parseFingerprint(value) {
	if (!value) return;
	try {
		const parsed = JSON.parse(value);
		return parsed && typeof parsed === "object" ? parsed : void 0;
	} catch {
		return;
	}
}
function stringifyFingerprint(value) {
	return value ? JSON.stringify(value) : null;
}
function selectConfigHealthRows(db, configPath) {
	let query = getNodeSqliteKysely(db).selectFrom("config_health_entries").select([
		"config_path",
		"last_known_good_json",
		"last_promoted_good_json",
		"last_observed_suspicious_signature",
		"updated_at_ms"
	]);
	if (configPath !== void 0) query = query.where("config_path", "=", configPath);
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
function readConfigHealthSnapshotInDatabase(db) {
	const rows = selectConfigHealthRows(db);
	return {
		state: decodeConfigHealthRows(rows),
		basis: Object.fromEntries(rows.map((row) => [row.config_path, {
			lastKnownGoodJson: row.last_known_good_json,
			lastPromotedGoodJson: row.last_promoted_good_json,
			suspiciousSignature: row.last_observed_suspicious_signature,
			updatedAtMs: row.updated_at_ms
		}]))
	};
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
	const current = selectConfigHealthRows(db, configPath)[0];
	if (expected === void 0) return false;
	if (expected === null) {
		if (current !== void 0) return false;
	} else if (current === void 0 || current.last_known_good_json !== expected.lastKnownGoodJson || current.last_promoted_good_json !== expected.lastPromotedGoodJson || current.last_observed_suspicious_signature !== expected.suspiciousSignature || current.updated_at_ms !== expected.updatedAtMs) return false;
	writeConfigHealthPatchInDatabase(db, configPath, patch, updatedAtMs);
	return true;
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
export { writeConfigHealthPatchInDatabase as a, readConfigHealthStateInDatabase as i, prepareConfigHealthPatch as n, readConfigHealthSnapshotInDatabase as r, patchConfigHealthEntryInDatabase as t };
