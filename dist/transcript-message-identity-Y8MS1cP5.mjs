import{s as normalizeNullableString}from"./string-coerce-CpTFcSwY.mjs";import{a as asOptionalRecord}from"./record-coerce-BTbqdJ3-.mjs";
//!src/config/sessions/transcript-message-identity.ts
function readMessageIdempotencyKey(e){return normalizeNullableString(asOptionalRecord(e)?.idempotencyKey)}export{readMessageIdempotencyKey as t};