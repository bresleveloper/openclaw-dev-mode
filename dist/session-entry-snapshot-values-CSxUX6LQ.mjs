//#region src/config/sessions/session-entry-snapshot-values.ts
const sessionEntrySnapshotColumnsDefinition = [
	["sessionDiffBaseline", "session_diff_baseline_json"],
	["skillsSnapshot", "skills_snapshot_json"],
	["systemPromptReport", "system_prompt_report_json"]
];
function attachSessionEntrySnapshots(entry, row, projection = "full") {
	for (const [field, alias] of sessionEntrySnapshotColumnsDefinition) {
		if (projection !== "full" && (projection === "list" || !projection.includes(field))) {
			Reflect.deleteProperty(entry, field);
			continue;
		}
		const valueJson = row[alias];
		if (valueJson != null) {
			const value = JSON.parse(valueJson);
			Object.assign(entry, { [field]: value });
		}
	}
	return entry;
}
//#endregion
export { sessionEntrySnapshotColumnsDefinition as n, attachSessionEntrySnapshots as t };
