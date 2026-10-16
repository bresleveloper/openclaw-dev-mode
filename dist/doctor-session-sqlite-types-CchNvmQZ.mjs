import { t as isSessionSqliteMigrationWarning } from "./session-sqlite-migration-issues-CAeNjCyE.mjs";
//#region src/commands/doctor-session-sqlite-types.ts
function countBlockingSessionSqliteIssues(report) {
	return report.issues.filter((issue) => !isSessionSqliteMigrationWarning(issue)).length;
}
function isRetainedSourceIssue(issue) {
	return [
		"entry_invalid",
		"historical_duplicate_settled",
		"legacy_import_deferred",
		"transcript_malformed",
		"transcript_missing",
		"retained_plugin_source_index_rebuilt",
		"retained_plugin_receipt_superseded"
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
//#endregion
export { isRetainedSourceIssue as i, createDoctorSessionSqliteTargetReport as n, isInformationalMissingSessionIndex as r, countBlockingSessionSqliteIssues as t };
