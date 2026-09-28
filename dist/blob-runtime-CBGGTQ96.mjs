//#region src/plugin-sdk/blob-runtime.ts
/** Use immediately in a Blob constructor, which snapshots this exact byte range. */
function bufferToBlobPart(buffer) {
	return buffer.buffer instanceof ArrayBuffer ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) : Uint8Array.from(buffer);
}
//#endregion
export { bufferToBlobPart as t };
