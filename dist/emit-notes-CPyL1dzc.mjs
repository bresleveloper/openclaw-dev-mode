import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
//#region src/commands/doctor/emit-notes.ts
/** Strip terminal control sequences from a potentially multi-line doctor note. */
function sanitizeDoctorNote(note) {
	return note.split("\n").map((line) => sanitizeForLog(line)).join("\n");
}
/** Emit grouped doctor change, info, and warning notes with sanitized content. */
function emitDoctorNotes(params) {
	for (const [title, notes] of [
		["Doctor changes", params.changeNotes],
		["Doctor info", params.infoNotes],
		["Doctor warnings", params.warningNotes]
	]) for (const message of notes ?? []) params.note(sanitizeDoctorNote(message), title);
}
//#endregion
export { sanitizeDoctorNote as n, emitDoctorNotes as t };
