import "./src-CkqqhWE1.js";
import "./errors-Dp0Hj51M.js";
import "./number-coercion-fuMteyiI.js";
import { n as withResponseBodyTimeout, t as withResponseBodyIdleTimeout } from "./http-response-body-timeout-BzFljPZe.js";
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
//#endregion
export { readResponseWithLimit as n, cancelUnreadResponseBody as t };
