//!src/shared/regexp.ts
function escapeRegExp(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}export{escapeRegExp as t};