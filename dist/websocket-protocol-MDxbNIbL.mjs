//#region src/gateway/websocket-protocol.ts
/** Map the HTTP aliases accepted by WebSocket clients onto their canonical schemes. */
function normalizeWebSocketProtocol(protocol) {
	return protocol === "https:" ? "wss:" : protocol === "http:" ? "ws:" : protocol;
}
//#endregion
export { normalizeWebSocketProtocol as t };
