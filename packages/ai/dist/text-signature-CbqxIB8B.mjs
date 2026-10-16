import { o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
import { o as truncateUtf16Safe } from "./provider-error-DQBE1bUQ.mjs";
import "./internal/retry-after.mjs";
import { A as shortHash, N as raceWithTimeout } from "./transport-stream-shared-CCR7hSW0.mjs";
import "./positive-integer-CwLi8LUL.mjs";
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
function redactSensitiveText(text) {
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
	return await raceWithTimeout(reader.read(), timeoutMs, () => {
		throw onIdleTimeout?.({ chunkTimeoutMs: timeoutMs }) ?? /* @__PURE__ */ new Error("Read timed out");
	});
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
//#region packages/ai/src/transports/provider-replay-context.ts
function isProviderReplayContext(value) {
	return isRecord(value) && typeof value.provider === "string" && typeof value.api === "string" && typeof value.model === "string" && (value.baseUrlHash === void 0 || typeof value.baseUrlHash === "string") && (value.sessionHash === void 0 || typeof value.sessionHash === "string") && (value.authProfileHash === void 0 || typeof value.authProfileHash === "string");
}
function hashReplayContextValue(value) {
	const normalized = value?.trim();
	return normalized ? shortHash(normalized) : void 0;
}
function buildProviderReplayContext(model, options) {
	return {
		provider: model.provider,
		api: model.api,
		model: model.id,
		baseUrlHash: hashReplayContextValue(model.baseUrl),
		sessionHash: hashReplayContextValue(options?.sessionId),
		authProfileHash: hashReplayContextValue(options?.authProfileId)
	};
}
function providerReplayContextMatches(state, context) {
	return state.provider === context.provider && state.api === context.api && state.model === context.model && state.baseUrlHash === context.baseUrlHash && state.sessionHash === context.sessionHash && state.authProfileHash === context.authProfileHash;
}
//#endregion
//#region packages/ai/src/utils/text-signature.ts
function encodeTextSignatureV1(id, phase) {
	return JSON.stringify({
		v: 1,
		id,
		...phase ? { phase } : {}
	});
}
//#endregion
export { MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE as a, readResponseTextSnippet as c, supportsModelTools as d, providerReplayContextMatches as i, redactSensitiveText as l, buildProviderReplayContext as n, estimateStringChars as o, isProviderReplayContext as r, isCodeModeModelVisibleToolName as s, encodeTextSignatureV1 as t, resolveModelHeaderSentinels as u };
