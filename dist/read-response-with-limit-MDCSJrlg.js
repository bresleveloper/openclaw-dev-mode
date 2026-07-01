import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
//#region packages/media-core/src/read-response-with-limit.ts
async function readChunkWithIdleTimeout(reader, chunkTimeoutMs, onIdleTimeout) {
	let timeoutId;
	let timedOut = false;
	return await new Promise((resolve, reject) => {
		const clear = () => {
			if (timeoutId !== void 0) {
				clearTimeout(timeoutId);
				timeoutId = void 0;
			}
		};
		const resolvedChunkTimeoutMs = resolveTimerTimeoutMs(chunkTimeoutMs, 1);
		timeoutId = setTimeout(() => {
			timedOut = true;
			const error = onIdleTimeout?.({ chunkTimeoutMs: resolvedChunkTimeoutMs }) ?? /* @__PURE__ */ new Error(`Media download stalled: no data received for ${resolvedChunkTimeoutMs}ms`);
			clear();
			reader.cancel(error).catch(() => void 0);
			reject(error);
		}, resolvedChunkTimeoutMs);
		reader.read().then((result) => {
			clear();
			if (!timedOut) resolve(result);
		}, (err) => {
			clear();
			if (!timedOut) reject(toLintErrorObject(err, "Non-Error rejection"));
		});
	});
}
async function readResponsePrefix(res, maxBytes, opts) {
	const chunkTimeoutMs = opts?.chunkTimeoutMs;
	const body = res.body;
	if (!body || typeof body.getReader !== "function") {
		const fallback = Buffer.from(await res.arrayBuffer());
		if (fallback.length > maxBytes) return {
			buffer: fallback.subarray(0, maxBytes),
			size: fallback.length,
			truncated: true
		};
		return {
			buffer: fallback,
			size: fallback.length,
			truncated: false
		};
	}
	const reader = body.getReader();
	const chunks = [];
	let total = 0;
	let size = 0;
	let truncated = false;
	try {
		while (true) {
			const { done, value } = chunkTimeoutMs ? await readChunkWithIdleTimeout(reader, chunkTimeoutMs, opts?.onIdleTimeout) : await reader.read();
			if (done) {
				size = total;
				break;
			}
			if (!value?.length) continue;
			const nextTotal = total + value.length;
			if (nextTotal > maxBytes) {
				const remaining = maxBytes - total;
				if (remaining > 0) {
					chunks.push(value.subarray(0, remaining));
					total += remaining;
				}
				size = nextTotal;
				truncated = true;
				try {
					await reader.cancel();
				} catch {}
				break;
			}
			chunks.push(value);
			total = nextTotal;
			size = total;
		}
	} finally {
		try {
			reader.releaseLock();
		} catch {}
	}
	return {
		buffer: Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), total),
		size,
		truncated
	};
}
/** Reads a response body under a byte cap, cancelling the stream on overflow or idle timeout. */
async function readResponseWithLimit(res, maxBytes, opts) {
	const onOverflow = opts?.onOverflow ?? ((params) => /* @__PURE__ */ new Error(`Content too large: ${params.size} bytes (limit: ${params.maxBytes} bytes)`));
	const prefix = await readResponsePrefix(res, maxBytes, {
		chunkTimeoutMs: opts?.chunkTimeoutMs,
		onIdleTimeout: opts?.onIdleTimeout
	});
	if (prefix.truncated) throw onOverflow({
		size: prefix.size,
		maxBytes,
		res
	});
	return prefix.buffer;
}
/** Reads a small collapsed text prefix from a response body for diagnostics/errors. */
async function readResponseTextSnippet(res, opts) {
	const maxBytes = opts?.maxBytes ?? 8 * 1024;
	const maxChars = opts?.maxChars ?? 200;
	const prefix = await readResponsePrefix(res, maxBytes, {
		chunkTimeoutMs: opts?.chunkTimeoutMs,
		onIdleTimeout: opts?.onIdleTimeout
	});
	if (prefix.buffer.length === 0) return;
	const text = new TextDecoder().decode(prefix.buffer);
	if (!text) return;
	const collapsed = text.replace(/\s+/g, " ").trim();
	if (!collapsed) return;
	if (collapsed.length > maxChars) return `${collapsed.slice(0, maxChars)}…`;
	return prefix.truncated ? `${collapsed}…` : collapsed;
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
export { readResponseWithLimit as n, readResponseTextSnippet as t };
