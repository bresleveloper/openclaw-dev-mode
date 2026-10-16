//#region packages/gateway-protocol/src/schema/chat-history-constants.ts
/** Largest history page accepted by the Gateway wire contract. */
const CHAT_HISTORY_MAX_ENTRIES = 1e3;
/** Display-only custody records; never transcript branch entry IDs. */
const CHAT_PENDING_INPUT_MESSAGE_PREFIX = "pending:";
//#endregion
export { CHAT_PENDING_INPUT_MESSAGE_PREFIX as n, CHAT_HISTORY_MAX_ENTRIES as t };
