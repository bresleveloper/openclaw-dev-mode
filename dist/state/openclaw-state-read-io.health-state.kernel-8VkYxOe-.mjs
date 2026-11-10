import { t as safeParseJson } from "./openclaw-state-read-json-coercion-CYFfIS_L.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
//#region src/config/io.health-state.kernel.ts
function parseFingerprint(value) {
	const parsed = safeParseJson(value ?? "");
	return parsed && typeof parsed === "object" ? parsed : void 0;
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
const configHealthReadOperations = { "config.health.read": (_input, db) => {
	const rows = selectConfigHealthRows(db);
	return {
		type: "config.health.read",
		snapshot: {
			state: decodeConfigHealthRows(rows),
			basis: Object.fromEntries(rows.map((row) => [row.config_path, {
				lastKnownGoodJson: row.last_known_good_json,
				lastPromotedGoodJson: row.last_promoted_good_json,
				suspiciousSignature: row.last_observed_suspicious_signature,
				updatedAtMs: row.updated_at_ms
			}]))
		}
	};
} };
//#endregion
export { configHealthReadOperations };
