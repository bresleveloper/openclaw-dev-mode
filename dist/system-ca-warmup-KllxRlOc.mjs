import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { Worker } from "node:worker_threads";
//#region src/gateway/server-startup-readiness.ts
function logGatewayReady(params, message = "gateway ready") {
	if (params.getReadiness().ready) params.log.info(message);
}
function logGatewaySidecarsReady(params) {
	params.startupTrace?.detail("sidecars.ready", [["loadedPluginCount", params.loadedPluginCount], ["postReadySidecarCount", params.postReadySidecarCount]]);
	params.startupTrace?.mark("sidecars.ready");
	logGatewayReady(params);
}
//#endregion
//#region src/gateway/system-ca-warmup.ts
const SYSTEM_CA_WARMUP_TIMEOUT_MS = 1e4;
const SYSTEM_CA_WORKER_SOURCE = String.raw`
  const { getCACertificates } = require("node:tls");
  const { parentPort } = require("node:worker_threads");

  try {
    const certificateCount = getCACertificates("default").length;
    parentPort.postMessage({ ok: true, certificateCount });
  } catch (error) {
    parentPort.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    parentPort.close();
  }
`;
let macOSSystemCaWarmupPromise;
function isSystemCaWarmupMessage(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const message = value;
	return message.ok === true ? typeof message.certificateCount === "number" : message.ok === false && typeof message.error === "string";
}
function isWorkerPermissionDenied(error) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "ERR_ACCESS_DENIED";
}
/** Warm Node's effective default CA set without blocking the gateway event loop on macOS. */
async function warmMacOSSystemCaOffMainThread(options = {}) {
	const env = options.env ?? process.env;
	if ((options.platform ?? process.platform) !== "darwin" || options.env === void 0 && options.platform === void 0 && isVitestRuntimeEnv(env)) return;
	let worker;
	try {
		worker = (options.createWorker ?? ((source, workerOptions) => new Worker(source, workerOptions)))(SYSTEM_CA_WORKER_SOURCE, { eval: true });
	} catch (error) {
		const reason = isWorkerPermissionDenied(error) ? "Node denied worker-thread permission" : `worker creation failed: ${formatErrorMessage(error)}`;
		options.log?.warn(`macOS CA warmup skipped because ${reason}; trust settings will load lazily`);
		return;
	}
	await new Promise((resolve) => {
		let settled = false;
		const timeoutMs = options.timeoutMs ?? SYSTEM_CA_WARMUP_TIMEOUT_MS;
		const settle = (warning, terminate = false) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			worker.removeAllListeners();
			worker.once("error", () => {});
			if (terminate) worker.terminate().catch(() => {});
			if (warning) options.log?.warn(warning);
			resolve();
		};
		worker.once("message", (value) => {
			if (!isSystemCaWarmupMessage(value)) {
				settle("macOS CA warmup returned an invalid result; gateway startup will continue and trust settings will load lazily", true);
				return;
			}
			if (!value.ok) {
				settle(`macOS CA warmup failed: ${value.error}; gateway startup will continue and trust settings will load lazily`, true);
				return;
			}
			settle();
		});
		worker.once("error", (error) => {
			settle(`macOS CA warmup worker failed: ${error.message}; gateway startup will continue and trust settings will load lazily`);
		});
		worker.once("exit", (code) => {
			settle(`macOS CA warmup worker exited before replying (code ${code}); gateway startup will continue and trust settings will load lazily`);
		});
		const timeout = setTimeout(() => {
			settle(`macOS CA warmup timed out after ${timeoutMs}ms; gateway startup will continue and trust settings will load lazily`, true);
		}, timeoutMs);
		timeout.unref?.();
		worker.unref();
	});
}
/**
* One warmup worker runs per process, and every caller awaits its shared completion.
* The settled promise is retained after success or failure because warmup is only an optimization.
*/
function beginMacOSSystemCaWarmupOnce(options = {}) {
	return macOSSystemCaWarmupPromise ??= warmMacOSSystemCaOffMainThread(options);
}
//#endregion
export { logGatewayReady as n, logGatewaySidecarsReady as r, beginMacOSSystemCaWarmupOnce as t };
