import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { m as tryParseJson } from "./utils-gjJ-tD2q.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
//#region extensions/google/transport-stream-sse.ts
const GOOGLE_SSE_EVENT_BOUNDARY_RE = /(?:\r\n|\r(?!\n)|\n){2}/u;
function hasGoogleFirstResponseActivity(chunk) {
	return Boolean(chunk.promptFeedback || chunk.candidates?.some((candidate) => candidate.finishReason && candidate.finishReason !== "FINISH_REASON_UNSPECIFIED" || candidate.content?.parts?.some((part) => part.text || part.functionCall || part.thoughtSignature)));
}
async function* parseGoogleSseChunks(response, signal) {
	if (!response.body) throw new Error("No response body");
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	let completed = false;
	const abortHandler = () => {
		reader.cancel().catch(() => void 0);
	};
	signal?.addEventListener("abort", abortHandler);
	try {
		while (true) {
			signal?.throwIfAborted();
			const { done, value } = await reader.read();
			signal?.throwIfAborted();
			if (done) {
				buffer += decoder.decode();
				const trailingData = buffer.split(/\r\n|\n|\r/u).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
				const trailingPayload = trailingData || buffer.trim();
				if (!trailingPayload || !trailingData && !trailingPayload.startsWith("{")) {
					completed = true;
					break;
				}
				const trailingChunk = tryParseJson(trailingPayload);
				if (!isRecord(trailingChunk) || !isRecord(trailingChunk.error)) throw new Error("Google SSE stream ended with an incomplete frame");
				buffer = `data: ${JSON.stringify(trailingChunk)}\n\n`;
			} else buffer += decoder.decode(value, { stream: true });
			let boundary = GOOGLE_SSE_EVENT_BOUNDARY_RE.exec(buffer);
			while (boundary) {
				const rawEvent = buffer.slice(0, boundary.index);
				buffer = buffer.slice(boundary.index + boundary[0].length);
				boundary = GOOGLE_SSE_EVENT_BOUNDARY_RE.exec(buffer);
				const data = rawEvent.split(/\r\n|\n|\r/u).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
				if (data === "[DONE]") return;
				if (!data) continue;
				let chunk;
				try {
					chunk = JSON.parse(data);
				} catch {
					throw new Error("Google SSE stream returned malformed JSON");
				}
				if (isRecord(chunk) && isRecord(chunk.error)) {
					const providerError = chunk.error;
					const code = normalizeOptionalString(providerError.status) ?? "GOOGLE_STREAM_ERROR";
					const status = typeof providerError.code === "number" ? providerError.code : void 0;
					throw Object.assign(new Error(normalizeOptionalString(providerError.message) ?? "Google stream failed", { cause: {
						status,
						code
					} }), {
						code,
						status,
						type: "google_stream_failed"
					});
				}
				yield chunk;
			}
		}
	} finally {
		signal?.removeEventListener("abort", abortHandler);
		if (!completed) await reader.cancel(signal?.reason).catch(() => void 0);
		reader.releaseLock();
	}
}
//#endregion
export { parseGoogleSseChunks as n, hasGoogleFirstResponseActivity as t };
