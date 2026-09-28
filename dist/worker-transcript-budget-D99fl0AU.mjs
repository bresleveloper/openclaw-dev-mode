import { s as WORKER_PROTOCOL_MAX_PAYLOAD_BYTES } from "./worker-protocol-primitives-vA8IesMt.mjs";
//#region packages/gateway-protocol/src/worker-transcript-budget.ts
/** Only image bytes may exceed the transcript's ordinary control budget. */
function isWorkerTranscriptFrameWithinBudget(frame) {
	try {
		const bytes = Buffer.byteLength(JSON.stringify(frame), "utf8");
		if (bytes > 26214400) return false;
		let imageBytes = 0;
		for (const message of frame.params.messages) for (const part of message.content) if (part.type === "image") imageBytes += Buffer.byteLength(JSON.stringify(part.data), "utf8") - 2;
		return bytes - imageBytes <= WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
	} catch {
		return false;
	}
}
//#endregion
export { isWorkerTranscriptFrameWithinBudget as t };
