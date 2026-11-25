import{l as normalizeOptionalString}from"./string-coerce-CpTFcSwY.mjs";
//!packages/acp-core/src/session-interaction-mode.ts
function isParentOwnedBackgroundAcpSession(e){return Boolean(e?.acp&&(normalizeOptionalString(e.spawnedBy)||normalizeOptionalString(e.parentSessionKey)))}export{isParentOwnedBackgroundAcpSession as t};