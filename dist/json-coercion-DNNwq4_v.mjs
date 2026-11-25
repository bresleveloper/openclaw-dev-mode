import{a as asOptionalRecord}from"./record-coerce-BTbqdJ3-.mjs";
//!packages/normalization-core/src/json-coercion.ts
function safeParseJson(e){try{return JSON.parse(e)}catch{return}}function safeParseJsonRecord(e){return/^[\t\n\r ]*\{/.test(e)?asOptionalRecord(safeParseJson(e)):void 0}export{safeParseJsonRecord as n,safeParseJson as t};