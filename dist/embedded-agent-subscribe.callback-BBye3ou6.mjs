import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
//#region src/agents/embedded-agent-subscribe.callback.ts
/** Contains callback failures and tracks completion for delivery owners that join it. */
function runBestEffortCallback(params) {
	const failed = (error) => {
		params.onError?.(error);
		params.log.warn(`${params.label} callback failed: ${String(error)}`);
	};
	try {
		const result = params.callback();
		if (isPromiseLike(result)) {
			const task = Promise.resolve(result).then(() => params.onSuccess?.(), failed);
			if (params.pending) {
				params.pending.add(task);
				task.finally(() => params.pending?.delete(task));
			}
		} else params.onSuccess?.();
	} catch (error) {
		failed(error);
	}
}
//#endregion
export { runBestEffortCallback as t };
