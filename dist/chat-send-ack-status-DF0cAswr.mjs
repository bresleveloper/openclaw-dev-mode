import{o as normalizeLowercaseStringOrEmpty}from"./string-coerce-CpTFcSwY.mjs";
//!src/shared/chat-send-ack-status.ts
function normalizeTerminalChatSendAckStatus(e){const t=normalizeLowercaseStringOrEmpty(e);return t===`ok`||t===`timeout`||t===`error`?t:void 0}export{normalizeTerminalChatSendAckStatus as t};