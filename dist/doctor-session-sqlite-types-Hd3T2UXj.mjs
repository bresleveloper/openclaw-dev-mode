//#region src/commands/doctor-session-sqlite-types.ts
const SESSION_SQLITE_WARNING_ISSUE_CODES = /* @__PURE__ */ new Set([
	"active_sqlite_transcript_jsonl",
	"entry_invalid",
	"historical_transcript_deferred",
	"historical_duplicate_settled",
	"legacy_index_informational",
	"plugin_migration_source_retained",
	"retained_plugin_source_index_rebuilt",
	"transcript_archive_failed",
	"transcript_malformed",
	"transcript_missing",
	"unreferenced_jsonl_archive_failed"
]);
function isSessionSqliteMigrationWarning(issue) {
	return SESSION_SQLITE_WARNING_ISSUE_CODES.has(issue.code);
}
function countBlockingSessionSqliteIssues(report) {
	return report.issues.filter((issue) => !isSessionSqliteMigrationWarning(issue)).length;
}
function isRetainedSourceIssue(issue) {
	return [
		"entry_invalid",
		"historical_duplicate_settled",
		"transcript_malformed",
		"transcript_missing",
		"retained_plugin_source_index_rebuilt"
	].includes(issue.code);
}
function isInformationalMissingSessionIndex(report) {
	return report.issues.some((issue) => issue.code === "legacy_index_informational");
}
function createDoctorSessionSqliteTargetReport(values) {
	return {
		archivedTranscriptFiles: [],
		archivedUnreferencedJsonlFiles: [],
		importedEntries: 0,
		importedTranscriptEvents: 0,
		issues: [],
		legacyEntries: 0,
		referencedTranscriptFiles: 0,
		sqliteEntries: 0,
		unreferencedJsonlFiles: [],
		validatedEntries: 0,
		validatedTranscriptEvents: 0,
		...values
	};
}
function sumDoctorSessionSqliteTargets(targets, value) {
	return targets.reduce((total, target) => total + value(target), 0);
}
function createDoctorSessionSqliteTotals(targets, values = {}) {
	const { archivedLegacyStoreFiles, reclaimedBytes } = values;
	const sqliteEntries = /* @__PURE__ */ new Map();
	for (const target of targets) sqliteEntries.set(target.sqlitePath, Math.max(sqliteEntries.get(target.sqlitePath) ?? 0, target.sqliteEntries));
	return {
		...archivedLegacyStoreFiles === void 0 ? {} : { archivedLegacyStoreFiles },
		archivedTranscriptFiles: values.archivedTranscriptFiles ?? 0,
		archivedUnreferencedJsonlFiles: values.archivedUnreferencedJsonlFiles ?? 0,
		importedEntries: values.importedEntries ?? 0,
		importedTranscriptEvents: values.importedTranscriptEvents ?? 0,
		issues: sumDoctorSessionSqliteTargets(targets, (target) => target.issues.length),
		legacyEntries: values.legacyEntries ?? 0,
		...reclaimedBytes === void 0 ? {} : { reclaimedBytes },
		sqliteEntries: [...sqliteEntries.values()].reduce((total, count) => total + count, 0),
		targets: targets.length,
		unreferencedJsonlFiles: values.unreferencedJsonlFiles ?? 0,
		validatedEntries: values.validatedEntries ?? 0,
		validatedTranscriptEvents: values.validatedTranscriptEvents ?? 0
	};
}
//#endregion
export { isRetainedSourceIssue as a, isInformationalMissingSessionIndex as i, createDoctorSessionSqliteTargetReport as n, isSessionSqliteMigrationWarning as o, createDoctorSessionSqliteTotals as r, sumDoctorSessionSqliteTargets as s, countBlockingSessionSqliteIssues as t };
