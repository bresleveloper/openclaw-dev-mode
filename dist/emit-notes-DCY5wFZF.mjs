import{n as sanitizeForLog}from"./ansi-54CEWBZf.mjs";
//!src/commands/doctor/emit-notes.ts
function sanitizeDoctorNote(e){return e.split(`
`).map(sanitizeForLog).join(`
`)}function emitDoctorNotes(e){for(const[t,n]of[[`Doctor changes`,e.changeNotes],[`Doctor info`,e.infoNotes],[`Doctor warnings`,e.warningNotes]])for(const r of n??[])e.note(sanitizeDoctorNote(r),t)}function emitDoctorRepairSequenceNotes(e){const t=e.repairSequence;emitDoctorNotes({note:e.note,changeNotes:t.changeNotes,warningNotes:e.structuredWarnings?t.displayWarningNotes:t.warningNotes});for(const n of t.configChangeNotes??[])e.emitConfigChange(n)}export{emitDoctorRepairSequenceNotes as n,sanitizeDoctorNote as r,emitDoctorNotes as t};