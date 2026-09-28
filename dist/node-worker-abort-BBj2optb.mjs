//#region src/gateway/worker-environments/node-worker-abort.ts
function raceNodeWorkerOperation(operation, signal, messages = {
	aborted: "node worker operation aborted",
	failed: "node worker operation failed"
}) {
	const abortError = () => signal.reason instanceof Error ? signal.reason : new Error(messages.aborted);
	if (signal.aborted) return Promise.reject(abortError());
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			signal.removeEventListener("abort", onAbort);
			reject(abortError());
		};
		signal.addEventListener("abort", onAbort, { once: true });
		operation.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error instanceof Error ? error : new Error(messages.failed ?? String(error)));
		});
	});
}
//#endregion
export { raceNodeWorkerOperation as t };
