import { isMarkedAsUntransferable } from "node:worker_threads";
//#region src/infra/worker-transfer-bytes.ts
/** Only uniquely owned buffers can be transferred; pooled Buffers share unrelated bytes. */
function ownedWorkerBytes(bytes) {
	if (bytes.buffer instanceof ArrayBuffer && bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength && !isMarkedAsUntransferable(bytes.buffer)) return new Uint8Array(bytes.buffer);
	return Uint8Array.from(bytes);
}
//#endregion
export { ownedWorkerBytes as t };
