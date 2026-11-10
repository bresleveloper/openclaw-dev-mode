import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
//#region src/commands/doctor/emit-notes.ts
/** Strip terminal control sequences from a potentially multi-line doctor note. */
function sanitizeDoctorNote(note) {
	return note.split("\n").map(sanitizeForLog).join("\n");
}
function emitDoctorNotes(params) {
	for (const [title, notes] of [
		["Doctor changes", params.changeNotes],
		["Doctor info", params.infoNotes],
		["Doctor warnings", params.warningNotes]
	]) for (const message of notes ?? []) params.note(sanitizeDoctorNote(message), title);
}
//#endregion
export { sanitizeDoctorNote as n, emitDoctorNotes as t };
