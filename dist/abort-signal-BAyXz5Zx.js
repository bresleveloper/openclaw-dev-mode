//#region src/infra/abort-signal.ts
/** Resolves when the signal aborts, or immediately when no wait is needed. */
async function waitForAbortSignal(signal) {
	if (!signal || signal.aborted) return;
	await new Promise((resolve) => {
		const onAbort = () => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		};
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
//#endregion
export { waitForAbortSignal as t };
