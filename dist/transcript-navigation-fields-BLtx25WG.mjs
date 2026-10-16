//#region src/config/sessions/transcript-navigation-fields.ts
/** Preserve own navigation fields, including malformed controls, without retaining payloads. */
function projectTranscriptNavigationFields(record) {
	const navigation = {};
	for (const key of [
		"type",
		"id",
		"parentId",
		"targetId",
		"appendParentId",
		"appendMode"
	]) if (Object.hasOwn(record, key)) navigation[key] = record[key];
	return navigation;
}
//#endregion
export { projectTranscriptNavigationFields as t };
