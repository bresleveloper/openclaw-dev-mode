import{l as normalizeOptionalString}from"./string-coerce-CpTFcSwY.mjs";
//!src/channels/thread-binding-id.ts
function resolveThreadBindingConversationIdFromBindingId(e){const t=normalizeOptionalString(e.bindingId);if(!t)return;const n=`${e.accountId}:`;if(!t.startsWith(n))return;return normalizeOptionalString(t.slice(n.length))}export{resolveThreadBindingConversationIdFromBindingId as t};