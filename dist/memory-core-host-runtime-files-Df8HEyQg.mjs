import"./engine-storage-DFRFL4NS.mjs";import"./read-file-DtFWPkib.mjs";
//!packages/memory-host-sdk/src/host/backend-config.ts
const DEFAULT_CITATIONS=`auto`;function resolveMemoryBackendConfig(e){return{backend:`builtin`,citations:e.cfg.memory?.citations??DEFAULT_CITATIONS}}export{resolveMemoryBackendConfig as t};