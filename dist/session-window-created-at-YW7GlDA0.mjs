import{randomUUID}from"node:crypto";
//!src/config/sessions/session-accessor.sqlite-normalize.ts
function createFallbackSessionEntry(e){const t=Date.now();return{sessionId:e.sessionId??randomUUID(),updatedAt:e.updatedAt??t,...e}}function normalizeSessionRowChatType(e){if(e===`direct`||e===`group`||e===`channel`)return e;return null}
//!src/config/sessions/session-window-created-at.ts
function resolveSessionWindowCreatedAt(e,t){for(const n of[e.sessionStartedAt,e.startedAt,e.updatedAt,t])if(typeof n===`number`&&Number.isFinite(n)&&n>=0)return n;return t}export{createFallbackSessionEntry as n,normalizeSessionRowChatType as r,resolveSessionWindowCreatedAt as t};