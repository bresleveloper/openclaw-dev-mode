import { t as note } from "./note-CmoIRLec.mjs";
//#region src/commands/doctor-migration-notes.ts
function noteDoctorMigrationResult(result, { prefix = "", changesTitle = "Doctor changes" } = {}) {
	for (const key of [
		"changes",
		"notices",
		"warnings"
	]) {
		const entries = result[key];
		if (entries?.length) note(entries.map((entry) => `${prefix}${entry}`).join("\n"), key === "changes" ? changesTitle : `Doctor ${key}`);
	}
}
//#endregion
export { noteDoctorMigrationResult as t };
