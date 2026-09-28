import { o as toErrorObject } from "./errors-Cy4ii9Fo.mjs";
import { A as resolveTimerTimeoutMs } from "./utils-C25eiuh1.mjs";
//#region src/infra/http-response-body-timeout.ts
function createResponseBodyTimeoutError(message) {
	const error = new Error(message);
	error.name = "TimeoutError";
	return error;
}
async function withResponseBodyTimeout(params) {
	if (params.timeoutMs === void 0 && !params.signal) return await params.read();
	let timeoutId;
	let stoppedError;
	return await new Promise((resolve, reject) => {
		const clear = () => {
			params.signal?.removeEventListener("abort", onAbort);
			if (timeoutId !== void 0) {
				clearTimeout(timeoutId);
				timeoutId = void 0;
			}
		};
		const stop = (error) => {
			if (stoppedError) return;
			stoppedError = error;
			clear();
			params.cancel(error).catch(() => void 0);
			reject(error);
		};
		const onAbort = () => stop(toErrorObject(params.signal?.reason, "Response body read aborted"));
		params.signal?.addEventListener("abort", onAbort, { once: true });
		if (params.signal?.aborted) {
			onAbort();
			return;
		}
		if (params.timeoutMs !== void 0) {
			const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
			timeoutId = setTimeout(() => {
				stop(params.onTimeout?.({ timeoutMs }) ?? createResponseBodyTimeoutError(`Response body timed out after ${timeoutMs}ms`));
			}, timeoutMs);
			if (typeof timeoutId === "object" && "unref" in timeoutId) timeoutId.unref();
		}
		Promise.resolve().then(() => {
			if (stoppedError) throw stoppedError;
			return params.read(() => {
				if (stoppedError) throw stoppedError;
				timeoutId?.refresh();
			});
		}).then((value) => {
			clear();
			if (!stoppedError) resolve(value);
		}, (error) => {
			clear();
			if (!stoppedError) reject(toErrorObject(error, "Non-Error rejection"));
		});
	});
}
/** Owns one refreshable idle deadline for a bounded response-body operation. */
function withResponseBodyIdleTimeout(reader, chunkTimeoutMs, onIdleTimeout, read) {
	if (chunkTimeoutMs === void 0) return read();
	return withResponseBodyTimeout({
		timeoutMs: chunkTimeoutMs,
		onTimeout: ({ timeoutMs }) => onIdleTimeout?.({ chunkTimeoutMs: timeoutMs }) ?? createResponseBodyTimeoutError(`Media download stalled: no data received for ${timeoutMs}ms`),
		cancel: async (error) => await reader.cancel(error),
		read
	});
}
//#endregion
export { withResponseBodyTimeout as n, withResponseBodyIdleTimeout as t };
