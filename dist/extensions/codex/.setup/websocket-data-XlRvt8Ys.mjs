//#region extensions/codex/src/app-server/websocket-data.ts
function codexWebSocketDataToBuffer(data) {
	return Array.isArray(data) ? Buffer.concat(data) : Buffer.isBuffer(data) ? data : data instanceof Uint8Array ? Buffer.from(data.buffer, data.byteOffset, data.byteLength) : Buffer.from(data);
}
//#endregion
export { codexWebSocketDataToBuffer as t };
