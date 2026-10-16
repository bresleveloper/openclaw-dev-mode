//#region src/gateway/worker-environments/node-worker-abort.ts
function raceNodeWorkerOperation(operation, signal, messages = {
	aborted: "node worker operation aborted",
	failed: "node worker operation failed"
}) {
	if (!signal) return operation;
	const abortError = () => signal.reason instanceof Error ? signal.reason : new Error(messages.aborted);
	if (signal.aborted) return Promise.race([Promise.reject(abortError()), operation]);
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
