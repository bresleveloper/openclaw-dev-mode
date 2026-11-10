import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { t as captureSqliteNativeRuntimeAdmission } from "./node-sqlite-CYaq-2Hb.mjs";
//#region src/infra/sqlite-planner-statistics.ts
/** The caller owns writer admission; sampling is bounded per index, not by elapsed time. */
function refreshSqlitePlannerStatistics(database) {
	const version = captureSqliteNativeRuntimeAdmission()?.version;
	if (version && (compareValidSemver(version, "3.46.0") ?? 0) < 0) {
		database.exec("PRAGMA analysis_limit=1000; ANALYZE main;");
		return;
	}
	database.exec("PRAGMA analysis_limit=1000; PRAGMA optimize=0x10002;");
}
//#endregion
export { refreshSqlitePlannerStatistics as t };
