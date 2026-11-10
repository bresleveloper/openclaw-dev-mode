import { t as clearActiveProgressLine } from "./progress-line-Bn5MVCt6.mjs";
//#region packages/terminal-core/src/stream-writer.ts
/** Detect broken pipe style stream errors. */
function isBrokenPipeError(err) {
	const code = err?.code;
	return code === "EPIPE" || code === "EIO";
}
/** Create a stream writer that stops writing after EPIPE/EIO. */
function createSafeStreamWriter(onBrokenPipe) {
	let closed = false;
	const write = (stream, text) => {
		if (closed) return false;
		let errorStream = process.stderr;
		try {
			clearActiveProgressLine();
			errorStream = stream;
			stream.write(text);
			return !closed;
		} catch (err) {
			if (!isBrokenPipeError(err)) throw err;
			if (!closed) {
				closed = true;
				onBrokenPipe?.(err, errorStream);
			}
			return false;
		}
	};
	return {
		write,
		writeLine: (stream, text) => write(stream, `${text}\n`)
	};
}
//#endregion
export { createSafeStreamWriter as t };
