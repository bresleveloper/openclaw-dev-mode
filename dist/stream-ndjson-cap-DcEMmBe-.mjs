//#region extensions/ollama/src/stream-ndjson-cap.ts
const OLLAMA_NDJSON_RECORD_MAX_BYTES = 16777216;
function checkNdjsonRecordCap(value, pendingRecordBytes) {
	let offset = 0;
	let pending = pendingRecordBytes;
	while (offset < value.byteLength) {
		const newlineIndex = value.indexOf(10, offset);
		const segmentEnd = newlineIndex === -1 ? value.byteLength : newlineIndex;
		pending += segmentEnd - offset;
		if (pending > OLLAMA_NDJSON_RECORD_MAX_BYTES) throw new Error(`Ollama NDJSON record exceeds ${OLLAMA_NDJSON_RECORD_MAX_BYTES} bytes`);
		if (newlineIndex === -1) break;
		pending = 0;
		offset = newlineIndex + 1;
	}
	return pending;
}
//#endregion
export { checkNdjsonRecordCap as t };
