import{c as normalizeOptionalLowercaseString}from"./string-coerce-CpTFcSwY.mjs";
//!src/channels/chat-type.ts
function normalizeChatType(e){const t=normalizeOptionalLowercaseString(e);if(t===`dm`)return`direct`;return t===`direct`||t===`group`||t===`channel`?t:void 0}export{normalizeChatType as t};