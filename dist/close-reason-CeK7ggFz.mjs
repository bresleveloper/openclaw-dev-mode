import{t as truncateUtf8Prefix}from"./utf8-truncate-B8GdsL7T.mjs";
//!src/gateway/server/close-reason.ts
function truncateCloseReason(e){if(!e)return`invalid handshake`;return truncateUtf8Prefix(e,120)}export{truncateCloseReason as t};