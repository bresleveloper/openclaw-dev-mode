import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
//#region src/commands/doctor/emit-notes.ts
/** Strip terminal control sequences from a potentially multi-line doctor note. */
function sanitizeDoctorNote(note) {
	return note.split("\n").map((line) => sanitizeForLog(line)).join("\n");
}
/** Emit grouped doctor change, info, and warning notes with sanitized content. */
function emitDoctorNotes(params) {
	for (const change of params.changeNotes ?? []) params.note(sanitizeDoctorNote(change), "Doctor changes");
	for (const info of params.infoNotes ?? []) params.note(sanitizeDoctorNote(info), "Doctor info");
	for (const warning of params.warningNotes ?? []) params.note(sanitizeDoctorNote(warning), "Doctor warnings");
}
//#endregion
export { sanitizeDoctorNote as n, emitDoctorNotes as t };
