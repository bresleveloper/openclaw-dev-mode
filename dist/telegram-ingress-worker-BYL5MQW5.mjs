import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-c5lFIb1t.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import "./time-runtime-D6GzEQJ4.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/telegram/src/telegram-ingress-worker.ts
const TELEGRAM_INGRESS_WORKER_RUNTIME_MARKER = "openclaw.telegram-ingress-worker";
const TELEGRAM_INGRESS_WORKER_STOP_GRACE_MS = 2e3;
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
	worker.on("message", AsyncLocalStorage.bind((message) => {
		for (const listener of listeners) listener(message);
	}));
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
			await raceWithTimeout(() => {
				worker.postMessage({ type: "stop" }, []);
				return taskPromise.catch(() => void 0);
			}, TELEGRAM_INGRESS_WORKER_STOP_GRACE_MS, () => worker.terminate().then(() => void 0), { ref: false });
		},
		task() {
			return taskPromise;
		}
	};
};
//#endregion
export { createTelegramIngressWorker as n, TELEGRAM_INGRESS_WORKER_RUNTIME_MARKER as t };
