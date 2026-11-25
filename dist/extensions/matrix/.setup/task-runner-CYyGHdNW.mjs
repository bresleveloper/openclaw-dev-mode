import { AsyncLocalStorage } from "node:async_hooks";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
// extensions/matrix/src/matrix/monitor/task-runner.ts
const monitorTaskSignal = new AsyncLocalStorage();
const MATRIX_MONITOR_IDLE_TIMEOUT_MS = 3e4;
function getMatrixMonitorTaskSignal() {
	return monitorTaskSignal.getStore();
}
function createMatrixMonitorTaskRunner(params) {
	const inFlight = /* @__PURE__ */ new Set();
	const shutdownController = new AbortController();
	let closed = false;
	const runTask = (task) => {
		if (closed) return Promise.reject(/* @__PURE__ */ new Error("Matrix monitor is stopped"));
		const taskPromise = monitorTaskSignal.run(shutdownController.signal, () => Promise.resolve().then(task));
		const observed = taskPromise.catch(() => {}).finally(() => inFlight.delete(observed));
		inFlight.add(observed);
		return taskPromise;
	};
	const runDetachedTask = (label, task) => {
		if (closed) return Promise.resolve();
		return runTask(task).catch((error) => {
			const message = String(error);
			params.logVerboseMessage(`matrix: ${label} failed (${message})`);
			params.logger.warn("matrix background task failed", {
				task: label,
				error: message
			});
		});
	};
	const waitForIdle = async () => {
		while (inFlight.size > 0) if (await raceWithTimeout(Promise.race(inFlight), MATRIX_MONITOR_IDLE_TIMEOUT_MS, () => true, { ref: false })) {
			shutdownController.abort();
			params.logger.warn("matrix waitForIdle timed out", {
				idleTimeoutMs: MATRIX_MONITOR_IDLE_TIMEOUT_MS,
				remaining: inFlight.size
			});
			return;
		}
	};
	return {
		close: () => {
			closed = true;
			shutdownController.abort();
		},
		runTask,
		runDetachedTask,
		waitForIdle
	};
}
export { getMatrixMonitorTaskSignal as n, createMatrixMonitorTaskRunner as t };
