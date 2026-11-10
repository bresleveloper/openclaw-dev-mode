import { d as sleepWithAbort, n as computeBackoff } from "./src-Bzfi3cQM.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as readResponseWithLimit } from "./http-response-body-B70cE6fn.mjs";
import "./error-runtime-ikopZs5O.mjs";
import { n as makeProxyFetch } from "./proxy-fetch-jG_wX5MX.mjs";
import "./fetch-runtime-Dg4wMDiG.mjs";
import "./response-limit-runtime-obgw0EAQ.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { t as resolveTelegramAllowedUpdates } from "./allowed-updates-BAG6Daxx.mjs";
import { C as readTelegramRetryAfterMs, D as normalizeTelegramApiRoot, f as isRetryableTelegramApiError, n as resolveTelegramTransport } from "./fetch-ZC4IpYLZ.mjs";
import { n as resolveTelegramLongPollTimeoutSeconds, t as TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS } from "./request-timeouts-D840jY2y.mjs";
import "./telegram-ingress-worker-BYL5MQW5.mjs";
import { parentPort, workerData } from "node:worker_threads";
//#region extensions/telegram/src/telegram-ingress-worker.runtime.ts
const pollLimit = 100;
const TELEGRAM_GET_UPDATES_MAX_RESPONSE_BYTES = 4194304;
const TELEGRAM_EMPTY_POLL_BACKOFF_POLICY = {
	initialMs: 50,
	maxMs: 1e3,
	factor: 2,
	jitter: 0
};
const TELEGRAM_RETRY_BACKOFF_POLICY = {
	initialMs: 1e3,
	maxMs: 3e4,
	factor: 2,
	jitter: 0
};
function readTelegramErrorCode(err) {
	if (err && typeof err === "object" && "error_code" in err) {
		const code = err.error_code;
		if (typeof code === "number") return code;
	}
}
function postPollError(port, err, retryAfterMs) {
	const errorCode = readTelegramErrorCode(err);
	port.postMessage({
		type: "poll-error",
		message: formatErrorMessage(err),
		...errorCode === void 0 ? {} : { errorCode },
		...errorCode === 429 && retryAfterMs !== void 0 && Number.isFinite(retryAfterMs) && retryAfterMs > 0 ? { retryAfterMs } : {},
		finishedAt: Date.now()
	});
}
function createTelegramGetUpdatesError(params) {
	return Object.assign(new Error(params.message), params.errorCode === void 0 ? {} : { error_code: params.errorCode }, params.parameters === void 0 ? {} : { parameters: params.parameters });
}
async function runTelegramIngressWorkerRuntime(params) {
	const { options, port } = params;
	const apiRoot = normalizeTelegramApiRoot(options.apiRoot ?? "https://api.telegram.org");
	const stopController = new AbortController();
	let activeController;
	let nextSpoolRequestId = 0;
	let pendingSpoolRequest;
	const proxyFetch = options.proxy ? makeProxyFetch(options.proxy) : void 0;
	const transport = params.deps?.fetch === void 0 ? resolveTelegramTransport(proxyFetch, { network: options.network }) : void 0;
	const fetchImpl = params.deps?.fetch ?? transport?.fetch ?? globalThis.fetch;
	const closeTransport = params.deps?.closeTransport ?? (() => transport?.close() ?? Promise.resolve());
	const getUpdatesUrl = `${apiRoot}/bot${options.token}/getUpdates`;
	const pollTimeoutSeconds = resolveTelegramLongPollTimeoutSeconds(options.timeoutSeconds);
	let lastUpdateId = options.initialUpdateId;
	let failures = 0;
	let consecutiveEmptyPolls = 0;
	let pollingConfirmed = false;
	const fetchJson = async (body) => {
		const controller = new AbortController();
		activeController = controller;
		const timeout = setTimeout(() => {
			controller.abort(/* @__PURE__ */ new Error("Telegram getUpdates timed out"));
		}, TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS);
		timeout.unref?.();
		try {
			const response = await fetchImpl(getUpdatesUrl, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body),
				signal: controller.signal
			});
			const raw = (await readResponseWithLimit(response, TELEGRAM_GET_UPDATES_MAX_RESPONSE_BYTES)).toString("utf8");
			let json;
			try {
				json = JSON.parse(raw) ?? {};
			} catch (err) {
				if (!response.ok) throw createTelegramGetUpdatesError({
					message: `Telegram getUpdates failed with HTTP ${response.status}`,
					errorCode: response.status
				});
				throw err;
			}
			if (!response.ok || json.ok !== true) throw createTelegramGetUpdatesError({
				message: typeof json.description === "string" ? json.description : `Telegram getUpdates failed with HTTP ${response.status}`,
				errorCode: typeof json.error_code === "number" ? json.error_code : response.status,
				parameters: json.parameters
			});
			return json.result;
		} finally {
			clearTimeout(timeout);
			activeController = void 0;
		}
	};
	port.onMessage((message) => {
		if (message?.type === "stop") {
			const err = /* @__PURE__ */ new Error("telegram ingress worker stopped");
			stopController.abort(err);
			activeController?.abort(err);
			pendingSpoolRequest?.reject(err);
			pendingSpoolRequest = void 0;
			return;
		}
		if (message?.type !== "spool-ack") return;
		const pending = pendingSpoolRequest;
		if (!pending || pending.requestId !== message.requestId) return;
		pendingSpoolRequest = void 0;
		if (message.result.ok) {
			pending.resolve(message.result.updateId);
			return;
		}
		pending.reject(new Error(message.result.message));
	});
	try {
		for (;;) {
			if (stopController.signal.aborted) break;
			const offset = lastUpdateId === null ? null : lastUpdateId + 1;
			const startedAt = Date.now();
			port.postMessage({
				type: "poll-start",
				offset,
				startedAt
			});
			try {
				const result = await fetchJson({
					timeout: pollingConfirmed ? pollTimeoutSeconds : 0,
					limit: pollLimit,
					allowed_updates: resolveTelegramAllowedUpdates(),
					...offset === null ? {} : { offset }
				});
				if (!Array.isArray(result)) throw new Error("Telegram getUpdates returned a non-array result.");
				for (const update of result) {
					if (stopController.signal.aborted) break;
					const requestId = String(++nextSpoolRequestId);
					const updateId = await new Promise((resolve, reject) => {
						pendingSpoolRequest = {
							requestId,
							resolve,
							reject
						};
						port.postMessage({
							type: "update",
							requestId,
							update,
							queued: result.length
						});
					});
					if (lastUpdateId === null || updateId > lastUpdateId) lastUpdateId = updateId;
					port.postMessage({
						type: "spooled",
						updateId,
						queued: result.length
					});
				}
				pollingConfirmed = true;
				failures = 0;
				port.postMessage({
					type: "poll-success",
					offset,
					count: result.length,
					finishedAt: Date.now()
				});
				if (result.length > 0) {
					consecutiveEmptyPolls = 0;
					continue;
				}
				consecutiveEmptyPolls += 1;
				if (consecutiveEmptyPolls > 1) {
					const minIntervalMs = computeBackoff(TELEGRAM_EMPTY_POLL_BACKOFF_POLICY, consecutiveEmptyPolls - 1);
					const elapsedMs = Math.max(0, Date.now() - startedAt);
					if (elapsedMs < minIntervalMs) await sleepWithAbort(minIntervalMs - elapsedMs, stopController.signal, { ref: false });
				}
			} catch (err) {
				if (stopController.signal.aborted) break;
				consecutiveEmptyPolls = 0;
				failures += 1;
				const retryAfterMs = readTelegramRetryAfterMs(err);
				postPollError(port, err, retryAfterMs);
				if (!isRetryableTelegramApiError(err, { context: "polling" })) throw err;
				try {
					await sleepWithAbort(retryAfterMs ?? computeBackoff(TELEGRAM_RETRY_BACKOFF_POLICY, failures), stopController.signal, { ref: false });
				} catch (sleepErr) {
					if (!stopController.signal.aborted) throw sleepErr;
				}
			}
		}
	} finally {
		await closeTransport();
	}
}
const workerPort = parentPort;
const runtimePort = workerPort === null ? null : {
	postMessage(message) {
		workerPort.postMessage(message, []);
	},
	onMessage(listener) {
		workerPort.on("message", listener);
	},
	close() {
		workerPort.close();
	}
};
const runtimeOptions = workerData && typeof workerData === "object" && "runtime" in workerData && workerData.runtime === "openclaw.telegram-ingress-worker" ? workerData : null;
if (runtimePort && runtimeOptions) {
	let exitedAfterStop = false;
	runtimePort.onMessage((message) => {
		if (message?.type === "stop") exitedAfterStop = true;
	});
	runTelegramIngressWorkerRuntime({
		options: runtimeOptions,
		port: runtimePort
	}).then(() => {
		runtimePort.close();
	}).catch((err) => {
		postPollError(runtimePort, err);
		runtimePort.close();
		process.exitCode = exitedAfterStop ? 0 : 1;
	});
}
//#endregion
export { runTelegramIngressWorkerRuntime as t };
