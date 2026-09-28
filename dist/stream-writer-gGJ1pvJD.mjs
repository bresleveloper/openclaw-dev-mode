//#region packages/terminal-core/src/stream-writer.ts
/** Detect broken pipe style stream errors. */
function isBrokenPipeError(err) {
	const code = err?.code;
	return code === "EPIPE" || code === "EIO";
}
/** Create a stream writer that stops writing after EPIPE/EIO. */
function createSafeStreamWriter(options = {}) {
	let closed = false;
	const handleError = (err, stream) => {
		if (!isBrokenPipeError(err)) throw err;
		if (!closed) {
			closed = true;
			options.onBrokenPipe?.(err, stream);
		}
		return false;
	};
	const write = (stream, text) => {
		if (closed) return false;
		try {
			options.beforeWrite?.();
		} catch (err) {
			return handleError(err, process.stderr);
		}
		try {
			stream.write(text);
			return !closed;
		} catch (err) {
			return handleError(err, stream);
		}
	};
	const writeLine = (stream, text) => write(stream, `${text}\n`);
	return {
		write,
		writeLine
	};
}
//#endregion
export { createSafeStreamWriter as t };
