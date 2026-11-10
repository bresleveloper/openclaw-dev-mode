import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { n as parseJsonPreservingUnsafeIntegers, t as parseJsonObjectPreservingUnsafeIntegers } from "./json-unsafe-integers-DcKagBUk.mjs";
import { A as stripSystemPromptCacheBoundary, _ as isImageWithMediaPayload, d as describeUnsupportedToolResultMedia, f as extractToolResultText, g as formatToolResultText, k as splitSystemPromptRelocatableBoundary, n as MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE } from "./provider-transport-runtime-DyX8vIBV.mjs";
import { t as checkNdjsonRecordCap } from "./stream-ndjson-cap-DcEMmBe-.mjs";
import { t as normalizeOllamaToolCallName } from "./tool-name-aliases-BJFI6Bxq.mjs";
//#region extensions/ollama/src/stream-ndjson.ts
async function* parseNdjsonStream(reader) {
	const decoder = new TextDecoder("utf-8", { fatal: true });
	let buffer = "";
	let pendingRecordBytes = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			pendingRecordBytes = checkNdjsonRecordCap(value, pendingRecordBytes);
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";
			for (const line of lines) {
				const trimmed = line.trim();
				if (!trimmed) continue;
				yield parseOllamaNdjsonRecord(trimmed);
			}
		}
		buffer += decoder.decode();
		if (buffer.trim()) yield parseOllamaNdjsonRecord(buffer.trim());
	} finally {
		reader.cancel().catch(() => void 0);
		reader.releaseLock();
	}
}
function parseOllamaNdjsonRecord(value) {
	let parsed;
	try {
		parsed = parseJsonPreservingUnsafeIntegers(value);
	} catch {
		throw new Error(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE);
	}
	if (!isRecord(parsed)) throw new Error(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE);
	if (typeof parsed.error === "string") {
		const status = typeof parsed.status === "number" && Number.isFinite(parsed.status) ? parsed.status : void 0;
		throw Object.assign(new Error(status === void 0 ? parsed.error : `${status}: ${parsed.error}`), {
			...status === void 0 ? {} : { status },
			body: parsed
		});
	}
	if (!isRecord(parsed.message) || typeof parsed.done !== "boolean") throw new Error(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE);
	return parsed;
}
//#endregion
//#region extensions/ollama/src/stream-messages.ts
function extractTextContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.filter((part) => isRecord(part) && part.type === "text" && typeof part.text === "string").map((part) => part.text).join("");
}
function extractOllamaImages(content) {
	if (!Array.isArray(content)) return [];
	return content.filter((part) => isRecord(part) && part.type === "image" && typeof part.data === "string").map((part) => part.data);
}
function extractOllamaThinking(content) {
	if (!Array.isArray(content)) return "";
	return content.filter((part) => isRecord(part) && part.type === "thinking" && typeof part.thinking === "string" && !part.redacted).map((part) => part.thinking).join("");
}
function extractToolCalls(content, options = {}) {
	if (!Array.isArray(content)) return [];
	const result = [];
	for (const part of content) if (isRecord(part) && (part.type === "toolCall" || part.type === "tool_use") && typeof part.name === "string") {
		const id = normalizeOptionalString(part.id);
		result.push({
			...id ? { id } : {},
			function: {
				name: normalizeOllamaToolCallName(part.name, options),
				arguments: parseJsonObjectPreservingUnsafeIntegers(part.type === "toolCall" ? part.arguments : part.input) ?? {}
			}
		});
	}
	return result;
}
function convertToOllamaMessages(messages, system, options = {}) {
	const result = [];
	for (const msg of messages) {
		if (msg.role === "user") {
			const text = extractTextContent(msg.content);
			const images = extractOllamaImages(msg.content);
			result.push({
				role: "user",
				content: text,
				...images.length > 0 ? { images } : {}
			});
			continue;
		}
		if (msg.role === "assistant") {
			const text = extractTextContent(msg.content);
			const thinking = extractOllamaThinking(msg.content);
			const toolCalls = extractToolCalls(msg.content, options);
			result.push({
				role: "assistant",
				content: text,
				...thinking ? { thinking } : {},
				...toolCalls.length > 0 ? { tool_calls: toolCalls } : {}
			});
			continue;
		}
		if (msg.role === "tool" || msg.role === "toolResult") {
			const content = Array.isArray(msg.content) ? msg.content : [{
				type: "text",
				text: typeof msg.content === "string" ? msg.content : ""
			}];
			const text = extractToolResultText(content, { includeStructured: true });
			const images = content.filter(isImageWithMediaPayload).map((part) => part.data);
			const omittedMediaPlaceholder = describeUnsupportedToolResultMedia(content, {
				images: true,
				audio: false
			});
			const mediaPlaceholder = images.length > 0 ? "(see attached image)" : void 0;
			const toolName = typeof msg.toolName === "string" ? msg.toolName : void 0;
			const toolCallId = typeof msg.toolCallId === "string" ? msg.toolCallId : void 0;
			result.push({
				role: "tool",
				content: formatToolResultText({
					text,
					mediaPlaceholder,
					omittedMediaPlaceholder,
					isError: msg.isError === true
				}),
				...images.length > 0 ? { images } : {},
				...toolCallId ? { tool_call_id: toolCallId } : {},
				...toolName ? { tool_name: normalizeOllamaToolCallName(toolName, options) } : {}
			});
		}
	}
	if (system) {
		const split = splitSystemPromptRelocatableBoundary(system);
		const carrier = split?.relocatable ? result.find((msg) => msg.role === "user") : void 0;
		if (split && carrier) carrier.content += `\n\n${stripSystemPromptCacheBoundary(split.relocatable)}`;
		result.unshift({
			role: "system",
			content: stripSystemPromptCacheBoundary(split && carrier ? split.remainingPrompt : system)
		});
	}
	return result;
}
//#endregion
export { parseNdjsonStream as n, convertToOllamaMessages as t };
