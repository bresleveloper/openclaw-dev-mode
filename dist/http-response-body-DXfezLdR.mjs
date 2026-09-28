import { n as consumeResponseBytes, t as decodeTextPrefix } from "./src-CZ2wJvNB.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as withResponseBodyIdleTimeout, r as withResponseBodyTimeout } from "./http-response-body-timeout-QllykGBC.mjs";
//#region src/infra/http-response-body.ts
/** Requests cancellation only when no consumer has started reading the body. */
async function cancelUnreadResponseBody(response) {
	if (response && !response.bodyUsed) response.body?.cancel().catch(() => void 0);
}
async function readResponsePrefixFromReader(reader, maxBytes, options) {
	const chunks = [];
	const result = await withResponseBodyIdleTimeout(reader, options?.chunkTimeoutMs || void 0, options?.onIdleTimeout, (refreshTimeout) => consumeResponseBytes({
		maxBytes,
		stopAtLimit: options?.stopAtLimit,
		read: () => {
			refreshTimeout?.();
			return reader.read();
		},
		onChunk: (chunk) => chunks.push(chunk),
		onLimit: () => {
			reader.cancel().catch(() => void 0);
		}
	}));
	return {
		materializeBuffer: () => Buffer.concat(chunks, Math.floor(Math.min(result.size, maxBytes))),
		...result
	};
}
async function readResponsePrefix(response, maxBytes, options) {
	if (!Number.isFinite(maxBytes) || maxBytes < 0) throw new RangeError(`maxBytes must be a non-negative finite number: ${maxBytes}`);
	let timeoutMs;
	try {
		timeoutMs = typeof options?.timeoutMs === "function" ? options.timeoutMs() : options?.timeoutMs;
	} catch (error) {
		response.body?.cancel(error).catch(() => void 0);
		throw error;
	}
	const body = response.body;
	if (!body || typeof body.getReader !== "function") return await withResponseBodyTimeout({
		timeoutMs,
		onTimeout: options?.onTimeout,
		signal: options?.signal,
		cancel: async (error) => await body?.cancel(error),
		read: async () => {
			const fallback = Buffer.from(await response.arrayBuffer());
			const truncated = fallback.length > maxBytes;
			return {
				materializeBuffer: () => truncated ? fallback.subarray(0, maxBytes) : fallback,
				size: fallback.length,
				truncated
			};
		}
	});
	const reader = body.getReader();
	try {
		return await withResponseBodyTimeout({
			timeoutMs,
			onTimeout: options?.onTimeout,
			signal: options?.signal,
			cancel: async (error) => await reader.cancel(error),
			read: async () => await readResponsePrefixFromReader(reader, maxBytes, options)
		});
	} finally {
		reader.releaseLock();
	}
}
/** Reads and decodes a bounded text prefix while cancelling unread overflow. */
async function readResponseTextPrefix(response, maxBytes, options) {
	const prefix = await readResponsePrefix(response, maxBytes, {
		...options,
		stopAtLimit: true
	});
	return {
		text: decodeTextPrefix(prefix.materializeBuffer(), { truncated: prefix.truncated }),
		size: prefix.size,
		truncated: prefix.truncated
	};
}
/** Reads a response body under byte, idle, and overall timeout bounds. */
async function readResponseWithLimit(response, maxBytes, options) {
	const onOverflow = options?.onOverflow;
	const prefix = await readResponsePrefix(response, maxBytes, {
		signal: options?.signal,
		chunkTimeoutMs: options?.chunkTimeoutMs,
		onIdleTimeout: options?.onIdleTimeout,
		timeoutMs: options?.timeoutMs,
		onTimeout: options?.onTimeout
	});
	if (prefix.truncated) throw onOverflow ? onOverflow({
		size: prefix.size,
		maxBytes,
		res: response
	}) : /* @__PURE__ */ new Error(`Content too large: ${prefix.size} bytes (limit: ${maxBytes} bytes)`);
	return prefix.materializeBuffer();
}
/** Reads a small collapsed text prefix from a response body for diagnostics/errors. */
async function readResponseTextSnippet(response, options) {
	const maxBytes = options?.maxBytes ?? 8192;
	const maxChars = options?.maxChars ?? 200;
	const prefix = await readResponseTextPrefix(response, maxBytes, {
		signal: options?.signal,
		chunkTimeoutMs: options?.chunkTimeoutMs,
		onIdleTimeout: options?.onIdleTimeout,
		timeoutMs: options?.timeoutMs,
		onTimeout: options?.onTimeout
	});
	if (!prefix.text) return;
	const collapsed = prefix.text.replace(/\s+/g, " ").trim();
	if (!collapsed) return;
	if (collapsed.length > maxChars) return `${truncateUtf16Safe(collapsed, maxChars)}…`;
	return prefix.truncated ? `${collapsed}…` : collapsed;
}
//#endregion
export { readResponseWithLimit as i, readResponseTextPrefix as n, readResponseTextSnippet as r, cancelUnreadResponseBody as t };
