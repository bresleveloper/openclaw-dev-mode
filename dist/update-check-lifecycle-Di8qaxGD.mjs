import { t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
//#region src/infra/update-check-lifecycle.ts
let updateCheckLifecycle;
function createGatewayUpdateLifecycle(scheduler, notifications = {}) {
	const predecessor = updateCheckLifecycle?.stop();
	const scope = new AsyncWorkScope();
	const scheduled = scheduler.scope();
	const { signal } = scheduled;
	let initialization;
	let stopping;
	const run = (work) => scope.track(async () => {
		await predecessor;
		signal.throwIfAborted();
		return await work(signal);
	});
	const initialize = async () => {
		signal.throwIfAborted();
		if (lifecycle.installStatus) return lifecycle.installStatus;
		if (!initialization) {
			const task = run(async () => {
				const { resolveStartupInstallStatus } = await import("./update-install-status-D2ZFoWH0.mjs");
				signal.throwIfAborted();
				const result = await resolveStartupInstallStatus(false, signal);
				signal.throwIfAborted();
				return lifecycle.installStatus ??= result;
			});
			initialization = task;
			task.catch(() => {
				if (initialization === task) initialization = void 0;
			});
		}
		return initialization;
	};
	const schedule = (id, work) => {
		const arm = (delayMs) => {
			if (signal.aborted) return;
			scheduled.schedule({
				id,
				delayMs,
				run: () => run(work).then((nextDelayMs) => arm(Math.max(1, nextDelayMs))).catch(() => void 0)
			});
		};
		arm(0);
	};
	const lifecycle = {
		scheduler,
		...notifications,
		signal,
		isCurrent: () => updateCheckLifecycle === lifecycle,
		publicationGeneration: 0,
		refreshes: /* @__PURE__ */ new WeakMap(),
		run,
		initialize,
		schedule,
		stop: () => {
			scope.beginClose();
			scheduled.beginClose();
			lifecycle.campaign?.clear();
			return stopping ??= Promise.allSettled([
				predecessor,
				scope.drain(),
				scheduled.stop()
			]).then(() => void 0);
		}
	};
	updateCheckLifecycle = lifecycle;
	return lifecycle;
}
function currentUpdateCheckLifecycle() {
	if (!updateCheckLifecycle) throw new Error("Gateway update lifecycle is not initialized");
	return updateCheckLifecycle;
}
//#endregion
export { currentUpdateCheckLifecycle as n, createGatewayUpdateLifecycle as t };
