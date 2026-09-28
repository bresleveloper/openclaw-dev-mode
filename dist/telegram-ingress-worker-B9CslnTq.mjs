import { Worker } from "node:worker_threads";
//#region extensions/telegram/src/telegram-ingress-worker.ts
const TELEGRAM_INGRESS_WORKER_RUNTIME_MARKER = "openclaw.telegram-ingress-worker";
const TELEGRAM_INGRESS_WORKER_STOP_GRACE_MS = 2e3;
async function stopTelegramIngressWorker(params) {
	let timeout;
	const forcedTermination = new Promise((resolve, reject) => {
		timeout = setTimeout(() => {
			params.terminate().then(() => resolve(), reject);
		}, TELEGRAM_INGRESS_WORKER_STOP_GRACE_MS);
		timeout.unref?.();
	});
	try {
		params.requestStop();
		await Promise.race([params.task.catch(() => void 0), forcedTermination]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
const createTelegramIngressWorker = (options) => {
	const listeners = /* @__PURE__ */ new Set();
	const worker = new Worker(new URL("./telegram-ingress-worker.runtime.js", import.meta.url), { workerData: {
		...options,
		runtime: TELEGRAM_INGRESS_WORKER_RUNTIME_MARKER
	} });
	const taskPromise = new Promise((resolve, reject) => {
		worker.once("error", reject);
		worker.once("exit", (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(/* @__PURE__ */ new Error(`Telegram ingress worker exited with code ${code}`));
		});
	});
	worker.on("message", (message) => {
		for (const listener of listeners) listener(message);
	});
	return {
		onMessage(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		ackSpooledUpdate(requestId, result) {
			try {
				Reflect.apply(Reflect.get(worker, "postMessage"), worker, [{
					type: "spool-ack",
					requestId,
					result
				}]);
			} catch {}
		},
		async stop() {
			await stopTelegramIngressWorker({
				requestStop: () => {
					Reflect.apply(Reflect.get(worker, "postMessage"), worker, [{ type: "stop" }]);
				},
				task: taskPromise,
				terminate: () => worker.terminate()
			});
		},
		task() {
			return taskPromise;
		}
	};
};
//#endregion
export { createTelegramIngressWorker as n, TELEGRAM_INGRESS_WORKER_RUNTIME_MARKER as t };
