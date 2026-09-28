//#region src/plugin-sdk/provider-binary-stream.ts
/** Create a byte-limited stream that owns its source reader and request cleanup. */
function createBoundedProviderBinaryStream(source, options) {
	let reader = source.getReader();
	let completion;
	let pendingError;
	let totalBytes = 0;
	const releaseReader = (activeReader) => {
		if (reader !== activeReader) return;
		reader = void 0;
		activeReader.releaseLock();
	};
	const finalize = (reason) => {
		return completion ??= Promise.resolve().then(async () => {
			const activeReader = reader;
			const [cancellation, cleanup] = await Promise.allSettled([activeReader?.cancel(reason), (async () => {
				try {
					if (activeReader) releaseReader(activeReader);
				} finally {
					await options.cleanup();
				}
			})()]);
			if (cleanup.status === "rejected") throw cleanup.reason;
			return cancellation;
		});
	};
	return {
		stream: new ReadableStream({
			async pull(controller) {
				if (pendingError) {
					const error = pendingError;
					pendingError = void 0;
					controller.error(error);
					return;
				}
				const activeReader = reader;
				if (!activeReader) {
					controller.close();
					return;
				}
				try {
					const chunk = await activeReader.read();
					if (chunk.done) {
						releaseReader(activeReader);
						controller.close();
						return;
					}
					const nextSize = totalBytes + chunk.value.byteLength;
					const remainingBytes = options.maxBytes - totalBytes;
					if (chunk.value.byteLength > remainingBytes) {
						const error = options.createOverflowError({
							size: nextSize,
							maxBytes: options.maxBytes
						});
						if (remainingBytes > 0) {
							controller.enqueue(chunk.value.subarray(0, remainingBytes));
							pendingError = error;
						}
						finalize(error).catch(() => void 0);
						if (remainingBytes <= 0) controller.error(error);
						return;
					}
					totalBytes = nextSize;
					controller.enqueue(chunk.value);
				} catch (error) {
					releaseReader(activeReader);
					controller.error(error);
				}
			},
			async cancel(reason) {
				const cancellation = await finalize(reason);
				if (cancellation.status === "rejected") throw cancellation.reason;
			}
		}),
		release: async () => {
			await finalize(options.createReleaseError());
		}
	};
}
//#endregion
export { createBoundedProviderBinaryStream };
