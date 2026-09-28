import { AsyncLocalStorage } from "node:async_hooks";
import pMap from "p-map";
//#region src/utils/run-with-concurrency.ts
/** Runs async tasks with bounded concurrency while preserving result indexes. */
async function runTasksWithConcurrency(params) {
	const { tasks, limit, onTaskError, throwOnError = false } = params;
	const errorMode = params.errorMode ?? "continue";
	if (tasks.length === 0) return {
		results: [],
		firstError: void 0,
		hasError: false
	};
	const resolvedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(Math.floor(limit), tasks.length)) : tasks.length;
	const results = Array.from({ length: tasks.length });
	let firstError = void 0;
	let hasError = false;
	return new Promise((resolve, reject) => {
		const runOne = async (task, index) => {
			if (errorMode === "stop" && hasError) return;
			try {
				results[index] = await task();
			} catch (error) {
				if (!hasError) {
					firstError = error;
					hasError = true;
				}
				let rejectionError = error;
				try {
					onTaskError?.(error, index);
				} catch (callbackError) {
					rejectionError = callbackError;
				}
				if (throwOnError) reject(rejectionError);
			}
		};
		const mapper = AsyncLocalStorage.bind((task, index) => Promise.resolve().then(() => runOne(task, index)));
		pMap(tasks.slice(), mapper, { concurrency: resolvedLimit }).then(() => resolve({
			results,
			firstError,
			hasError
		}), reject);
	});
}
//#endregion
export { runTasksWithConcurrency as t };
