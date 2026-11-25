import { r as getAiTransportHost } from "./host-Dm4e6L6R.mjs";
import "./src-CNWvILd1.mjs";
import "./internal/retry-after.mjs";
import { P as raceWithTimeout } from "./transport-stream-shared-DPUASGj0.mjs";
import "./positive-integer-AM4ltyhP.mjs";
// packages/normalization-core/src/response-bytes.ts
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
// packages/ai/src/transports/transport-utils.ts
const MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE = "OpenClaw transport error: malformed_streaming_fragment";
/** Keep provider payloads out of parse errors without replacing unrelated failures. */
function streamFragmentError(cause, ErrorType = Error) {
	return cause instanceof SyntaxError ? new ErrorType(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, { cause }) : cause;
}
function resolveModelHeaderSentinels(model) {
	if (!model.headers) return model;
	let headers;
	for (const [name, value] of Object.entries(model.headers)) {
		if (value === null) continue;
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
function supportsModelTools(model) {
	return (model.compat && typeof model.compat === "object" ? model.compat : void 0)?.supportsTools !== false;
}
function isCodeModeModelVisibleToolName(name, visibleToolNames) {
	return visibleToolNames.has(name);
}
const ANTHROPIC_MESSAGES_ERROR_BODY_MAX_BYTES = 8192;
const ANTHROPIC_MESSAGES_ERROR_BODY_READ_IDLE_TIMEOUT_MS = 1e4;
async function readAnthropicMessagesErrorSnippet(response) {
	const reader = response.body?.getReader();
	if (!reader) return;
	const chunks = [];
	let bytes = 0;
	let truncated = false;
	try {
		const result = await consumeResponseBytes({
			maxBytes: ANTHROPIC_MESSAGES_ERROR_BODY_MAX_BYTES,
			stopAtLimit: true,
			read: () => raceWithTimeout(reader.read(), ANTHROPIC_MESSAGES_ERROR_BODY_READ_IDLE_TIMEOUT_MS, () => {
				throw new Error(`Anthropic Messages error response stalled: no data received for ${ANTHROPIC_MESSAGES_ERROR_BODY_READ_IDLE_TIMEOUT_MS}ms`);
			}),
			onChunk: (chunk) => chunks.push(chunk),
			onLimit: () => {
				reader.cancel().catch(() => void 0);
			}
		});
		bytes = Math.min(result.size, ANTHROPIC_MESSAGES_ERROR_BODY_MAX_BYTES);
		truncated = result.truncated;
	} catch (error) {
		reader.cancel(error).catch(() => void 0);
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
	return truncated ? `${collapsed}…` : collapsed;
}
export { streamFragmentError as a, resolveModelHeaderSentinels as i, isCodeModeModelVisibleToolName as n, supportsModelTools as o, readAnthropicMessagesErrorSnippet as r, consumeResponseBytes as s, MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE as t };
