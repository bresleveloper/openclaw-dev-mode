import{r as asNullableRecord}from"./record-coerce-BTbqdJ3-.mjs";import"./string-coerce-runtime-BYDH9Quw.mjs";
//!extensions/memory-core/src/memory-rebuild-notice.ts
function captureMemoryRebuildNotice(e){const t=asNullableRecord(e.custom?.automaticRebuildNotice);const n=t?.sequence;return()=>t?.sequence!==n&&typeof t?.warning===`string`?t.warning:void 0}export{captureMemoryRebuildNotice as t};