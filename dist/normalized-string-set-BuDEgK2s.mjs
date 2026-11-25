import{c as normalizeOptionalLowercaseString}from"./string-coerce-CpTFcSwY.mjs";
//!src/shared/normalized-string-set.ts
function normalizeLowercaseStringSet(e){const t=/* @__PURE__ */ new Set;for(const n of e){const e=normalizeOptionalLowercaseString(n);if(e)t.add(e)}return t}export{normalizeLowercaseStringSet as t};