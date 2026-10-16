import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-DU6Cf6Aq.mjs";
import "./process-runtime-CYiH_oPH.mjs";
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
	const workerUrl = resolveRuntimeWorkerUrl({
		currentModuleUrl: import.meta.url,
		sourceWorkerName: "telegram-ingress-worker.runtime",
		distWorkerPath: "telegram-ingress-worker.runtime.js",
		package: {
			name: "@openclaw/telegram",
			distWorkerPath: "src/telegram-ingress-worker.runtime.js"
		}
	});
	const worker = createCpuTrackedWorker(workerUrl, {
		execArgv: resolveRuntimeWorkerArgv(workerUrl).slice(0, -1),
		workerData: {
			...options,
			runtime: TELEGRAM_INGRESS_WORKER_RUNTIME_MARKER
		}
	});
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
				worker.postMessage({
					type: "spool-ack",
					requestId,
					result
				}, []);
			} catch {}
		},
		async stop() {
			await stopTelegramIngressWorker({
				requestStop: () => {
					worker.postMessage({ type: "stop" }, []);
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
