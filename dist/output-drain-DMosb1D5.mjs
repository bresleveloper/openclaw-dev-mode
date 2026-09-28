//#region src/process/output-drain.ts
const OUTPUT_DRAIN_TIMEOUT_MS = 5e3;
/** Drain both output pipes before a bounded owner termination. */
function drainProcessOutput(exit) {
	let pendingStreams = 2;
	const fallback = setTimeout(exit, OUTPUT_DRAIN_TIMEOUT_MS);
	fallback.unref();
	const drain = (stream) => {
		stream.write("", () => {
			pendingStreams -= 1;
			if (pendingStreams === 0) {
				clearTimeout(fallback);
				setImmediate(exit);
			}
		});
	};
	drain(process.stdout);
	drain(process.stderr);
}
//#endregion
export { drainProcessOutput as t };
