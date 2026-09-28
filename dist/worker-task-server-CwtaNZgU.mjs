import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as withWorkerTaskNativeSectionScope, i as observeWorkerTaskCancellation, r as createWorkerTaskControl } from "./worker-task-native-sections-CocdMtHk.mjs";
import { n as scheduleWorkerIdleGc, t as cancelWorkerIdleGc } from "./worker-idle-gc-CYLBZfNA.mjs";
import { parentPort } from "node:worker_threads";
//#region src/infra/worker-task-server.ts
/** Pool dispatch is serial per worker; handlers finish cleanup before returning their result. */
function serveWorkerTasks(handler, options = {}) {
	serveOwnedWorkerTasks(handler, options);
}
/** Internal native owners additionally acknowledge resource cleanup between tasks. */
function serveOwnedWorkerTasks(handler, options = {}) {
	const port = parentPort;
	if (!port) return;
	let active;
	let execution = Promise.resolve();
	let resourceClosures = Promise.resolve();
	let cancelledResponse;
	port.on("message", (message) => {
		cancelWorkerIdleGc();
		if (message.closeResource && message.resourcePort) {
			const receipt = message.resourcePort;
			const precedingExecution = execution;
			resourceClosures = resourceClosures.then(() => precedingExecution).then(() => {
				if (!options.closeResource) throw new Error("Worker does not own retained resources");
				options.closeResource(message.key);
				receipt.postMessage({ ok: true }, []);
			}).catch((error) => {
				receipt.postMessage({
					ok: false,
					error: error instanceof Error ? error.message : String(error)
				}, []);
			}).finally(() => {
				receipt.close();
				if (!active) scheduleWorkerIdleGc();
			});
			return;
		}
		if (message.responseId !== void 0) {
			if (message.taskId === cancelledResponse?.taskId && message.responseId === cancelledResponse.responseId) return;
			if (!active || message.taskId !== active.taskId || message.responseId !== active.responseId || !active.pending) throw new Error("stale worker task response");
			try {
				active.assertCurrent();
			} catch (error) {
				active.cancelPending(error);
				return;
			}
			const pending = active.pending;
			active.pending = void 0;
			let consumed = false;
			const taskId = message.taskId;
			const id = message.responseId;
			pending.resolve({
				input: message.input,
				consumed: () => {
					if (consumed) return;
					consumed = true;
					port.postMessage({
						status: "consumed",
						taskId,
						id
					});
				}
			});
			return;
		}
		if (active) throw new Error("overlapping worker tasks");
		const nativeSections = new Int32Array(message.nativeSections);
		const task = {
			taskId: message.taskId,
			responseId: 0,
			assertCurrent: () => control.throwIfCancelled(),
			cancelPending: (error) => {
				const pending = task.pending;
				if (!pending) return;
				task.pending = void 0;
				cancelledResponse = {
					taskId: task.taskId,
					responseId: task.responseId
				};
				pending.reject(error);
			}
		};
		const control = createWorkerTaskControl(nativeSections, () => active === task);
		active = task;
		const stopObserving = message.interactive ? observeWorkerTaskCancellation(nativeSections, () => active === task, () => task.cancelPending(/* @__PURE__ */ new Error("worker task cancelled"))) : void 0;
		const channel = message.interactive ? {
			consumeInput: () => port.postMessage({
				status: "consumed",
				taskId: task.taskId,
				id: 0
			}),
			request: (value, transferList) => {
				control.throwIfCancelled();
				if (active !== task || task.pending) throw new Error("closed or busy worker channel");
				const pending = createDeferredCore();
				task.pending = pending;
				try {
					const transfers = transferList ? [...transferList] : [];
					control.throwIfCancelled();
					port.postMessage({
						status: "request",
						taskId: task.taskId,
						id: ++task.responseId,
						value
					}, transfers);
				} catch (error) {
					task.pending = void 0;
					pending.reject(error);
				}
				return pending.promise;
			}
		} : void 0;
		const precedingClosures = resourceClosures;
		execution = Promise.resolve().then(async () => {
			try {
				await precedingClosures;
				control.throwIfCancelled();
				return await withWorkerTaskNativeSectionScope(nativeSections, () => active === task, () => handler(message.input, channel, control));
			} finally {
				await stopObserving?.();
				active = void 0;
			}
		}).then((value) => {
			port.postMessage({
				status: "ok",
				value,
				taskId: task.taskId
			}, options.transferList?.(value) ?? []);
		}).catch((error) => {
			port.postMessage({
				status: "failed",
				taskId: task.taskId,
				error: error instanceof Error ? error.message : String(error)
			});
		}).finally(scheduleWorkerIdleGc);
	});
}
//#endregion
export { serveWorkerTasks as n, serveOwnedWorkerTasks as t };
