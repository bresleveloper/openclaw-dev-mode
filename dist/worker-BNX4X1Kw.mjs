import { a as observeWorkerTaskCancellation, i as createWorkerTaskControl, l as withWorkerTaskNativeSectionScope } from "./worker-task-native-sections-DVlyZQtL.mjs";
import { parentPort } from "node:worker_threads";
//#region packages/worker-runtime/src/worker-task-server.ts
/** Pool dispatch is serial per worker; resource closures and handlers settle before successors. */
function serveOwnedWorkerTasks(handler, options, host) {
	const port = parentPort;
	if (!port) return;
	host.initialize(port);
	let active;
	let execution = Promise.resolve();
	let resourceClosures = Promise.resolve();
	let cancelledResponse;
	port.on("message", (message) => {
		host.onMessage(message.sampleMemory === true);
		if (message.closeResource && message.resourcePort) {
			const receipt = message.resourcePort;
			const precedingExecution = execution;
			resourceClosures = resourceClosures.then(() => precedingExecution).then(async () => {
				if (!options.closeResource) throw new Error("Worker does not own retained resources");
				await options.closeResource(message.key);
				receipt.postMessage({ ok: true }, []);
			}).catch((error) => {
				receipt.postMessage({
					ok: false,
					error: error instanceof Error ? error.message : String(error),
					detail: options.encodeResourceError?.(error)
				}, []);
			}).finally(() => {
				receipt.close();
				if (!active) host.onIdle();
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
			notify: (value) => {
				control.throwIfCancelled();
				port.postMessage({
					status: "notification",
					taskId: task.taskId,
					value
				});
			},
			consumeInput: () => port.postMessage({
				status: "consumed",
				taskId: task.taskId,
				id: 0
			}),
			request: (value, transferList) => {
				control.throwIfCancelled();
				if (active !== task || task.pending) throw new Error("closed or busy worker channel");
				const pending = Promise.withResolvers();
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
				host.installTaskContext(message.taskContext);
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
		}).finally(() => host.onIdle());
	});
}
//#endregion
export { serveOwnedWorkerTasks as t };
