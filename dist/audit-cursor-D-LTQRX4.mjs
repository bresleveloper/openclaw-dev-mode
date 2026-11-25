import{D as parseStrictPositiveInteger}from"./number-coercion-B3CfI447.mjs";
//!src/audit/audit-cursor.ts
function parsePositiveAuditCursor(e){if(e===void 0)return;const t=e.trim();if(!/^\d+$/.test(t))return null;return parseStrictPositiveInteger(t)??null}export{parsePositiveAuditCursor as t};