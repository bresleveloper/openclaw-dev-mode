//#region src/gateway/server-constants.ts
const MAX_PAYLOAD_BYTES = 26214400;
const MAX_BUFFERED_BYTES = 52428800;
const MAX_PREAUTH_PAYLOAD_BYTES = 65536;
const WEBSOCKET_CLOSE_GRACE_MS = 1e3;
const maxChatHistoryMessagesBytes = 6291456;
const getMaxChatHistoryMessagesBytes = () => maxChatHistoryMessagesBytes;
const TICK_INTERVAL_MS = 3e4;
const HEALTH_REFRESH_INTERVAL_MS = 6e4;
const DEDUPE_TTL_MS = 3e5;
const DEDUPE_MAX = 1e3;
//#endregion
export { MAX_PAYLOAD_BYTES as a, WEBSOCKET_CLOSE_GRACE_MS as c, MAX_BUFFERED_BYTES as i, getMaxChatHistoryMessagesBytes as l, DEDUPE_TTL_MS as n, MAX_PREAUTH_PAYLOAD_BYTES as o, HEALTH_REFRESH_INTERVAL_MS as r, TICK_INTERVAL_MS as s, DEDUPE_MAX as t };
