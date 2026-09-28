import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.mjs";
import { Fn as object, Jn as string, Nt as array, sr as unknown } from "../../schemas-BOYIvvln.mjs";
import { n as sanitizeTerminalText } from "../../safe-text-CBmKtmbt.mjs";
import { t as canonicalizeBase64 } from "../../base64-B5EyWEOm.mjs";
import "../../text-utility-runtime-D7I29NA0.mjs";
import "../../text-chunking-zFGQSbFt.mjs";
//#region extensions/openai/image-generation-codex-response.ts
const MAX_CODEX_IMAGE_SSE_BYTES = 67108864;
const MAX_CODEX_IMAGE_SSE_EVENTS = 512;
const MAX_CODEX_IMAGE_BASE64_CHARS = 67108864;
const OPENAI_MAX_IMAGE_RESULTS = 4;
const STANDARD_BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const DIAGNOSTIC_MAX_CHARS = 256;
const contentSchema = object({
	type: string().nullish(),
	text: string().nullish(),
	refusal: string().nullish()
});
const itemSchema = contentSchema.extend({
	result: string().nullish(),
	revised_prompt: string().nullish(),
	status: string().nullish(),
	content: array(contentSchema).nullish()
});
const errorSchema = object({
	code: string().nullish(),
	message: string().nullish()
});
const eventSchema = object({
	type: string().nullish(),
	item: itemSchema.nullish(),
	response: object({
		error: errorSchema.nullish(),
		incomplete_details: object({ reason: string().nullish() }).nullish(),
		output: array(itemSchema).nullish(),
		usage: unknown().optional(),
		tool_usage: unknown().optional()
	}).nullish(),
	error: errorSchema.nullish(),
	message: string().nullish()
});
async function readResponseBodyText(response) {
	if (!response.body) {
		const text = await response.text();
		if (Buffer.byteLength(text, "utf8") > MAX_CODEX_IMAGE_SSE_BYTES) throw new Error("OpenAI Codex image generation response exceeded size limit");
		return text;
	}
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	const chunks = [];
	let byteLength = 0;
	try {
		while (true) {
			const { value, done } = await reader.read();
			if (value) {
				byteLength += value.byteLength;
				if (byteLength > MAX_CODEX_IMAGE_SSE_BYTES) {
					await reader.cancel().catch(() => void 0);
					throw new Error("OpenAI Codex image generation response exceeded size limit");
				}
				chunks.push(decoder.decode(value, { stream: !done }));
			}
			if (done) {
				const tail = decoder.decode();
				if (tail) chunks.push(tail);
				return chunks.join("");
			}
		}
	} finally {
		reader.releaseLock();
	}
}
function parseCodexImageGenerationEvents(body) {
	const events = [];
	for (const frame of body.replace(/\r\n?/g, "\n").split("\n\n")) {
		const data = frame.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).replace(/^ /, "")).join("\n").trim();
		if (!data || data === "[DONE]") continue;
		let decoded;
		try {
			decoded = JSON.parse(data);
		} catch {
			continue;
		}
		const event = eventSchema.safeParse(decoded);
		if (!event.success) throw new Error("OpenAI Codex image generation returned a malformed stream event");
		events.push(event.data);
		if (events.length > MAX_CODEX_IMAGE_SSE_EVENTS) throw new Error("OpenAI Codex image generation response exceeded event limit");
	}
	return events;
}
function decodeCodexImagePayload(payload) {
	if (payload.length > MAX_CODEX_IMAGE_BASE64_CHARS) throw new Error("OpenAI Codex image generation result exceeded size limit");
	const trimmedPayload = payload.replace(/^\p{White_Space}+|\p{White_Space}+$/gu, "");
	const canonicalPayload = canonicalizeBase64(trimmedPayload);
	const padding = canonicalPayload?.endsWith("==") ? 2 : canonicalPayload?.endsWith("=") ? 1 : 0;
	const trailingBitsMask = padding === 2 ? 15 : padding === 1 ? 3 : 0;
	const trailingValue = padding > 0 ? STANDARD_BASE64_ALPHABET.indexOf(canonicalPayload?.at(-(padding + 1)) ?? "") : 0;
	if (!canonicalPayload || canonicalPayload !== trimmedPayload || (trailingValue & trailingBitsMask) !== 0) throw new Error("OpenAI Codex image generation returned malformed base64 image data");
	return Buffer.from(canonicalPayload, "base64");
}
function extractCodexImageDiagnostic(completed, streamed) {
	for (const output of [completed ?? [], streamed]) {
		let providerText;
		for (const entry of output) {
			const parts = entry.type === "message" ? entry.content ?? [] : [entry];
			for (const part of parts) {
				const raw = part.type === "refusal" ? part.refusal ?? part.text : part.type === "output_text" ? part.text : void 0;
				if (typeof raw !== "string") continue;
				const cleaned = sanitizeTerminalText(raw.replace(/safety_violations=\[[^\]]*\]/gi, " ")).replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/gi, "").replace(/\s+/g, " ").trim();
				if (!cleaned) continue;
				const text = cleaned.length > DIAGNOSTIC_MAX_CHARS ? `${truncateUtf16Safe(cleaned, DIAGNOSTIC_MAX_CHARS)}...` : cleaned;
				if (part.type === "refusal") return `OpenAI Codex image generation refused by provider: "${text}"`;
				providerText ??= `OpenAI Codex image generation returned text instead of an image: "${text}"`;
			}
		}
		if (providerText) return providerText;
	}
}
function toCodexImage(entry, index, output) {
	if (typeof entry.result !== "string" || entry.result.length === 0) return null;
	return Object.assign({
		buffer: decodeCodexImagePayload(entry.result),
		mimeType: output.mimeType,
		fileName: `image-${index + 1}.${output.extension}`
	}, entry.revised_prompt ? { revisedPrompt: entry.revised_prompt } : {});
}
async function readCodexImageGenerationResponse(response, params) {
	const events = parseCodexImageGenerationEvents(await readResponseBodyText(response));
	const outputItems = [];
	let completedResponse;
	for (const event of events) {
		if (event.type === "response.failed" || event.type === "error") {
			const error = event.response?.error ?? event.error;
			const message = error?.message ?? event.message ?? (error?.code ? `OpenAI Codex image generation failed (${error.code})` : "");
			throw new Error(message || "OpenAI Codex image generation failed");
		}
		if (event.type === "response.incomplete") {
			const reason = event.response?.incomplete_details?.reason ?? "unknown";
			throw new Error(`OpenAI Codex image generation response incomplete: ${reason}`);
		}
		if (event.type === "response.completed") {
			completedResponse = event.response;
			break;
		}
		if (event.type === "response.output_item.done" && event.item) outputItems.push(event.item);
	}
	if (!completedResponse) throw new Error("OpenAI Codex image generation stream closed before response.completed");
	const completedOutputItems = (completedResponse.output ?? []).filter((entry) => entry.type === "image_generation_call").slice(0, OPENAI_MAX_IMAGE_RESULTS);
	const selectedOutputItems = completedOutputItems.length > 0 ? completedOutputItems : outputItems.filter((entry) => entry.type === "image_generation_call").slice(0, OPENAI_MAX_IMAGE_RESULTS);
	const images = [];
	for (const [index, item] of selectedOutputItems.entries()) {
		if (item.status && item.status !== "completed") {
			const diagnostic = extractCodexImageDiagnostic(completedResponse.output, outputItems);
			throw new Error(diagnostic ? `${diagnostic} (image call did not complete (${item.status}))` : `OpenAI Codex image generation image call did not complete (${item.status})`);
		}
		const image = toCodexImage(item, index, params);
		if (image) images.push(image);
	}
	if (images.length === 0) throw new Error(extractCodexImageDiagnostic(completedResponse.output, outputItems) ?? "OpenAI Codex image generation completed but did not produce an image");
	return {
		images,
		model: params.model,
		metadata: {
			usage: completedResponse.usage,
			toolUsage: completedResponse.tool_usage
		}
	};
}
//#endregion
export { readCodexImageGenerationResponse };
