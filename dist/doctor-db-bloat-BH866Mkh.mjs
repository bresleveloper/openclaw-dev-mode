import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { n as formatBytes } from "./doctor-disk-space-CmHEswFS.mjs";
//#region src/commands/doctor-db-bloat.ts
const BLOAT_MIN_FILE_BYTES = 134217728;
const BLOAT_MIN_FREE_BYTES = 33554432;
const BLOAT_FREE_RATIO = .25;
const LARGE_DB_WARN_BYTES = 1073741824;
function describeBloat(label, stats) {
	const freeRatio = stats.fileBytes > 0 ? stats.freeBytes / stats.fileBytes : 0;
	if (stats.fileBytes >= BLOAT_MIN_FILE_BYTES && stats.freeBytes >= BLOAT_MIN_FREE_BYTES && freeRatio >= BLOAT_FREE_RATIO) {
		const remedy = stats.incrementalAutoVacuum ? "incremental vacuum will release it gradually" : "use offline Doctor SQLite compaction to reclaim it and enable incremental vacuum (gateway stopped; see https://docs.openclaw.ai/cli/doctor/sqlite-maintenance)";
		return `${label}: ${formatBytes(stats.fileBytes)} on disk with ${formatBytes(stats.freeBytes)} reclaimable free pages; ${remedy}.`;
	}
	if (stats.fileBytes >= LARGE_DB_WARN_BYTES) return `${label}: ${formatBytes(stats.fileBytes)} on disk; review session/transcript retention settings if growth is unexpected.`;
	return null;
}
async function noteSqliteDatabaseBloat(deps) {
	const context = captureOpenClawStateWorkerContext({ env: deps?.env });
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	const results = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "doctor.databaseBloat",
		input: void 0
	}), { existingOnly: true });
	context.admission.assertCurrent();
	const warnings = (results ?? []).flatMap(({ label, stats }) => {
		const warning = describeBloat(label, stats);
		return warning ? [warning] : [];
	});
	if (warnings.length === 0) return;
	note(warnings.join("\n"), "SQLite database size");
}
//#endregion
export { noteSqliteDatabaseBloat };
