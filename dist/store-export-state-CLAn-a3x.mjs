import { l as isStringRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/transcripts/store-errors.ts
var TranscriptsSummaryChangedError = class extends Error {
	constructor() {
		super("Transcript changed while generating notes; summarize it again.");
	}
};
var TranscriptSessionConflictError = class extends Error {
	constructor() {
		super("Transcript session ID conflicts with another capture on this date; use a new ID.");
		this.name = "TranscriptSessionConflictError";
	}
};
//#endregion
//#region src/transcripts/store-export-state.ts
function parseTranscriptExportManifest(json) {
	const value = JSON.parse(json);
	if (!isStringRecord(value)) throw new TypeError("Invalid transcript export manifest: expected an object of strings.");
	return value;
}
function parseTranscriptPendingExports(json) {
	const value = JSON.parse(json);
	if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) throw new TypeError("Invalid pending transcript exports: expected an array of strings.");
	return new Set(value);
}
//#endregion
export { TranscriptsSummaryChangedError as i, parseTranscriptPendingExports as n, TranscriptSessionConflictError as r, parseTranscriptExportManifest as t };
