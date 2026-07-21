//#region packages/ai/src/utils/streaming-byte-guard.ts
function createSseByteGuard(reader, opts) {
	if (!Number.isFinite(opts.maxBytes) || opts.maxBytes < 0) throw new RangeError(`maxBytes must be a non-negative finite number: ${opts.maxBytes}`);
	const onOverflow = opts.onOverflow ?? ((params) => /* @__PURE__ */ new Error(`SSE stream exceeds ${params.maxBytes} bytes (received ${params.size})`));
	let total = 0;
	let overflowedFlag = false;
	let cancelledFlag = false;
	return {
		read: async () => {
			if (overflowedFlag || cancelledFlag) return {
				done: true,
				value: void 0
			};
			const result = await reader.read();
			if (result.done) return result;
			const chunkLen = result.value?.byteLength ?? 0;
			const next = total + chunkLen;
			if (next > opts.maxBytes) {
				overflowedFlag = true;
				cancelledFlag = true;
				const err = onOverflow({
					size: next,
					maxBytes: opts.maxBytes
				});
				try {
					await reader.cancel(err);
				} catch {}
				throw err;
			}
			total = next;
			return result;
		},
		cancel: async (reason) => {
			if (overflowedFlag) return;
			cancelledFlag = true;
			try {
				await reader.cancel(reason);
			} catch {}
		},
		totalBytes: () => total,
		overflowed: () => overflowedFlag,
		cancelled: () => cancelledFlag
	};
}
//#endregion
export { createSseByteGuard as t };
