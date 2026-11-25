import{AsyncLocalStorage}from"node:async_hooks";
//!packages/terminal-core/src/note-output.ts
const noteOutputStorage=new AsyncLocalStorage;function withNoteOutput(e,t){return noteOutputStorage.run(e,t)}function resolveNoteOutput(){return noteOutputStorage.getStore()?.()??process.stdout}export{withNoteOutput as n,resolveNoteOutput as t};