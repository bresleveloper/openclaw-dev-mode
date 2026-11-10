import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { t as streamSessionTranscriptLines } from "./transcript-stream--bqxYj-r.mjs";
import { n as createSessionTranscriptUsageAccumulator } from "./session-transcript-derived-readers-BsCqBl32.mjs";
import { i as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-tRCRA3R9.mjs";
import "./session-transcript-record-parser-CPEdg9T5.mjs";
import fs from "node:fs";
//#region src/gateway/session-utils.fs.ts
function capArrayByJsonBytes(items, maxBytes, byteLength = jsonUtf8Bytes) {
	if (items.length === 0) return {
		items,
		bytes: 2
	};
	const parts = items.map(byteLength);
	let bytes = 2 + parts.reduce((a, b) => a + b, 0) + (items.length - 1);
	let start = 0;
	while (bytes > maxBytes && start < items.length - 1) {
		bytes -= expectDefined(parts[start], "parts entry at start") + 1;
		start += 1;
	}
	return {
		items: start > 0 ? items.slice(start) : items,
		bytes
	};
}
async function readLatestSessionUsageFromTranscriptFileAsync(sessionId, storePath, sessionFile) {
	const filePath = resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile).find((value) => fs.existsSync(value));
	if (!filePath) return null;
	try {
		const usageAccumulator = createSessionTranscriptUsageAccumulator("artifact");
		for await (const line of streamSessionTranscriptLines(filePath)) {
			if (Buffer.byteLength(line, "utf8") > 262144) continue;
			let normalizedMessage;
			try {
				const record = asOptionalRecord(JSON.parse(line));
				const message = asOptionalRecord(record?.message);
				if (!record || !message) continue;
				const usage = asOptionalRecord(message.usage) ?? asOptionalRecord(record.usage);
				normalizedMessage = {
					...message,
					...typeof message.provider !== "string" && typeof record.provider === "string" ? { provider: record.provider } : {},
					...typeof message.model !== "string" && typeof record.model === "string" ? { model: record.model } : {},
					...usage ? { usage } : {}
				};
			} catch {
				continue;
			}
			usageAccumulator.add(normalizedMessage);
		}
		return usageAccumulator.finish();
	} catch {
		return null;
	}
}
//#endregion
export { readLatestSessionUsageFromTranscriptFileAsync as n, capArrayByJsonBytes as t };
