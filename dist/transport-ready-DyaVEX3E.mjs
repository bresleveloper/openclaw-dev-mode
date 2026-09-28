import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import "./backoff-CszdOMiF.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
//#region src/infra/transport-ready.ts
/**
* Polls a channel transport readiness probe until it succeeds, times out, or aborts.
*
* Used by channel plugins that start external daemons or subscribe to local transports before
* processing inbound events, with bounded retry logging through the caller's runtime sink.
*/
async function waitForTransportReady(params) {
	const started = Date.now();
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 0, 0);
	const deadline = started + timeoutMs;
	const logAfterMs = resolveTimerTimeoutMs(params.logAfterMs, timeoutMs, 0);
	const logIntervalMs = resolveTimerTimeoutMs(params.logIntervalMs, 3e4, 1e3);
	const pollIntervalMs = resolveTimerTimeoutMs(params.pollIntervalMs, 150, 50);
	let nextLogAt = started + logAfterMs;
	let lastError = null;
	while (true) {
		if (params.abortSignal?.aborted) return;
		const res = await params.check();
		if (res.ok || params.abortSignal?.aborted) return;
		lastError = res.error ?? null;
		const now = Date.now();
		if (now >= deadline) break;
		if (now >= nextLogAt) {
			const elapsedMs = now - started;
			params.runtime.error?.(theme.error(`${params.label} not ready after ${elapsedMs}ms (${lastError ?? "unknown error"})`));
			nextLogAt = now + logIntervalMs;
		}
		try {
			await sleepWithAbort(pollIntervalMs, params.abortSignal);
		} catch (err) {
			if (params.abortSignal?.aborted) return;
			throw err;
		}
	}
	params.runtime.error?.(theme.error(`${params.label} not ready after ${timeoutMs}ms (${lastError ?? "unknown error"})`));
	throw new Error(`${params.label} not ready (${lastError ?? "unknown error"})`);
}
//#endregion
export { waitForTransportReady as t };
