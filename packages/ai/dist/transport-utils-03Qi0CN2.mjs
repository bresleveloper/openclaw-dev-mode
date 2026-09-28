import { n as getAiTransportHost } from "./host-yTvBrYM2.mjs";
import { t as truncateUtf16Safe } from "./utf16-slice-CvGodqok.mjs";
import "./provider-error-CRhW7lkJ.mjs";
import "./internal/retry-after.mjs";
import "./positive-integer-BiUxrd71.mjs";
//#region packages/normalization-core/src/response-bytes.ts
async function consumeResponseBytes(options) {
	let size = 0;
	while (true) {
		const { done, value } = await options.read();
		if (done) return {
			size,
			truncated: false
		};
		if (options.skipEmptyChunks !== false && !value?.length) continue;
		const remaining = options.maxBytes - size;
		size += value.length;
		if (size > options.maxBytes || options.stopAtLimit && size === options.maxBytes) {
			if (remaining > 0) options.onChunk(value.subarray(0, remaining));
			await options.onLimit(size);
			return {
				size,
				truncated: true
			};
		}
		options.onChunk(value);
	}
}
//#endregion
//#region packages/ai/src/transports/transport-utils.ts
const MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE = "OpenClaw transport error: malformed_streaming_fragment";
const NON_LATIN_RE = /[\u2E80-\u9FFF\uA000-\uA4FF\uAC00-\uD7AF\uF900-\uFAFF\uFF01-\uFF60\uFFE0-\uFFE6\u{20000}-\u{2FA1F}]/gu;
const CJK_SURROGATE_HIGH_RE = /[\uD840-\uD87E][\uDC00-\uDFFF]/g;
function redactSensitiveText(text, _options) {
	return getAiTransportHost().redactToolPayloadText(text);
}
function resolveModelHeaderSentinels(model) {
	if (!model.headers) return model;
	let headers;
	for (const [name, value] of Object.entries(model.headers)) {
		const resolved = getAiTransportHost().resolveSecretSentinel(value);
		if (resolved !== value) {
			headers ??= { ...model.headers };
			headers[name] = resolved;
		}
	}
	return headers ? {
		...model,
		headers
	} : model;
}
function createAbortError(message, options) {
	const error = new Error(message, options);
	error.name = "AbortError";
	return error;
}
function estimateStringChars(text) {
	if (!text) return 0;
	const nonLatinCount = (text.match(NON_LATIN_RE) ?? []).length;
	return (nonLatinCount === 0 ? text.length : text.length - (text.match(CJK_SURROGATE_HIGH_RE) ?? []).length) + nonLatinCount * 3;
}
function supportsModelTools(model) {
	return (model.compat && typeof model.compat === "object" ? model.compat : void 0)?.supportsTools !== false;
}
function isCodeModeModelVisibleToolName(name, visibleToolNames) {
	return visibleToolNames.has(name);
}
async function readChunkWithIdleTimeout(reader, timeoutMs, onIdleTimeout) {
	let timer;
	try {
		return await Promise.race([reader.read(), new Promise((_resolve, reject) => {
			timer = setTimeout(() => reject(onIdleTimeout?.({ chunkTimeoutMs: timeoutMs }) ?? /* @__PURE__ */ new Error("Read timed out")), timeoutMs);
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
async function readResponseTextSnippet(response, options) {
	const maxBytes = options?.maxBytes ?? 8192;
	const maxChars = options?.maxChars ?? 200;
	const reader = response.body?.getReader();
	if (!reader) return;
	const chunks = [];
	let bytes = 0;
	let truncated = false;
	try {
		if (bytes < maxBytes) {
			const result = await consumeResponseBytes({
				maxBytes,
				stopAtLimit: true,
				read: () => options?.chunkTimeoutMs ? readChunkWithIdleTimeout(reader, options.chunkTimeoutMs, options.onIdleTimeout) : reader.read(),
				onChunk: (chunk) => chunks.push(chunk),
				onLimit: async () => {
					await reader.cancel().catch(() => void 0);
				}
			});
			bytes = Math.min(result.size, maxBytes);
			truncated = result.truncated;
		}
	} catch (error) {
		await reader.cancel(error).catch(() => void 0);
		throw error;
	} finally {
		reader.releaseLock();
	}
	const merged = new Uint8Array(bytes);
	let offset = 0;
	for (const chunk of chunks) {
		merged.set(chunk, offset);
		offset += chunk.length;
	}
	const collapsed = new TextDecoder().decode(merged).replace(/\s+/g, " ").trim();
	if (!collapsed) return;
	if (collapsed.length > maxChars) return `${truncateUtf16Safe(collapsed, maxChars)}…`;
	return truncated ? `${collapsed}…` : collapsed;
}
//#endregion
export { readResponseTextSnippet as a, supportsModelTools as c, isCodeModeModelVisibleToolName as i, createAbortError as n, redactSensitiveText as o, estimateStringChars as r, resolveModelHeaderSentinels as s, MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE as t };
