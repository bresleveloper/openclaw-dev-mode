import{l as normalizeOptionalString}from"./string-coerce-CpTFcSwY.mjs";
//!src/shared/collection-input.ts
function normalizeOptionalTrimmedStringRecord(e){const t={};for(const[n,r]of Object.entries(e)){const e=normalizeOptionalString(r);if(e)t[n]=e}return Object.keys(t).length>0?t:void 0}export{normalizeOptionalTrimmedStringRecord as t};