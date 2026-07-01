//#region packages/gateway-protocol/src/version.ts
/** Current gateway protocol version emitted by modern clients and servers. */
const PROTOCOL_VERSION = 4;
/** Lowest client protocol version accepted by the gateway. */
const MIN_CLIENT_PROTOCOL_VERSION = 4;
/** Lowest lightweight probe protocol version accepted by the gateway. */
const MIN_PROBE_PROTOCOL_VERSION = 4;
//#endregion
export { MIN_PROBE_PROTOCOL_VERSION as n, PROTOCOL_VERSION as r, MIN_CLIENT_PROTOCOL_VERSION as t };
