import{t as note}from"./note-e4DtVgg2.mjs";
//!src/commands/doctor-migration-notes.ts
function noteDoctorMigrationResult(e,{prefix:t=``,changesTitle:n=`Doctor changes`}={}){for(const r of[`changes`,`notices`,`warnings`]){const i=e[r];if(i?.length)note(i.map(e=>`${t}${e}`).join(`
`),r===`changes`?n:`Doctor ${r}`)}}export{noteDoctorMigrationResult as t};