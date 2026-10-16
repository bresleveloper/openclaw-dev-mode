import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.mjs";
import { n as sanitizeTerminalText } from "../../safe-text-SY_CvCi3.mjs";
import { Fn as object, Jn as string, Nt as array, sr as unknown } from "../../schemas-BOYIvvln.mjs";
import { i as readResponseWithLimit } from "../../http-response-body-umfRGZ-E.mjs";
import { t as canonicalizeBase64 } from "../../base64-CU53EX1R.mjs";
import "../../text-utility-runtime-BDs7x8Fk.mjs";
import "../../response-limit-runtime-CpfmMF5T.mjs";
import "../../text-chunking-BiSt_d1B.mjs";
//#region extensions/openai/image-generation-codex-response.ts
const MAX_CODEX_IMAGE_SSE_BYTES = 67108864;
const MAX_CODEX_IMAGE_SSE_EVENTS = 512;
const MAX_CODEX_IMAGE_BASE64_CHARS = 67108864;
const OPENAI_MAX_IMAGE_RESULTS = 4;
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
	if (!canonicalPayload || canonicalPayload !== trimmedPayload) throw new Error("OpenAI Codex image generation returned malformed base64 image data");
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
async function readCodexImageGenerationResponse(response, params) {
	const body = await readResponseWithLimit(response, MAX_CODEX_IMAGE_SSE_BYTES, { onOverflow: () => /* @__PURE__ */ new Error("OpenAI Codex image generation response exceeded size limit") });
	const events = parseCodexImageGenerationEvents(new TextDecoder().decode(body));
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
	const completedOutputItems = (completedResponse.output ?? []).filter((entry) => entry.type === "image_generation_call");
	const selectedOutputItems = (completedOutputItems.length > 0 ? completedOutputItems : outputItems.filter((entry) => entry.type === "image_generation_call")).slice(0, OPENAI_MAX_IMAGE_RESULTS);
	const images = [];
	for (const [index, item] of selectedOutputItems.entries()) {
		if (item.status && item.status !== "completed") {
			const diagnostic = extractCodexImageDiagnostic(completedResponse.output, outputItems);
			throw new Error(diagnostic ? `${diagnostic} (image call did not complete (${item.status}))` : `OpenAI Codex image generation image call did not complete (${item.status})`);
		}
		if (typeof item.result !== "string" || item.result.length === 0) continue;
		images.push({
			buffer: decodeCodexImagePayload(item.result),
			mimeType: params.mimeType,
			fileName: `image-${index + 1}.${params.extension}`,
			...item.revised_prompt ? { revisedPrompt: item.revised_prompt } : {}
		});
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
