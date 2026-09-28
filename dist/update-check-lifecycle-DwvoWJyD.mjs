import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
//#region src/infra/update-check-lifecycle.ts
let updateCheckLifecycle;
function createGatewayUpdateLifecycle() {
	const predecessor = updateCheckLifecycle?.stop();
	const controller = new AbortController();
	const { signal } = controller;
	const pending = /* @__PURE__ */ new Set();
	let initialization;
	let stopping;
	const run = (work) => {
		const task = (async () => {
			await predecessor;
			signal.throwIfAborted();
			return await work(signal);
		})();
		pending.add(task);
		task.then(() => pending.delete(task), () => pending.delete(task));
		return task;
	};
	const initialize = async () => {
		signal.throwIfAborted();
		if (!initialization) {
			const task = run(async () => {
				const { resolveStartupInstallStatus } = await import("./update-install-status-2RRR4mFO.mjs");
				signal.throwIfAborted();
				return resolveStartupInstallStatus(false, signal);
			});
			initialization = task;
			task.catch(() => {
				if (initialization === task) initialization = void 0;
			});
		}
		return initialization;
	};
	const schedule = (work, unref = false) => {
		run(async () => {
			while (!signal.aborted) {
				const delayMs = await work();
				await sleepWithAbort(Math.max(1, delayMs), signal, { ref: !unref });
			}
		}).catch(() => void 0);
	};
	const lifecycle = {
		signal,
		isCurrent: () => updateCheckLifecycle === lifecycle,
		refreshes: /* @__PURE__ */ new WeakMap(),
		run,
		initialize,
		schedule,
		stop: () => {
			controller.abort();
			if (updateCheckLifecycle === lifecycle) lifecycle.campaign?.clear();
			return stopping ??= Promise.allSettled([predecessor, ...pending]).then(() => void 0);
		}
	};
	updateCheckLifecycle = lifecycle;
	return lifecycle;
}
function currentUpdateCheckLifecycle() {
	return updateCheckLifecycle ?? createGatewayUpdateLifecycle();
}
//#endregion
export { currentUpdateCheckLifecycle as n, createGatewayUpdateLifecycle as t };
