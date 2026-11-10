import { F as resolveTimerTimeoutMs } from "../number-coercion-CkhMiRw8.mjs";
import { d as sleepWithAbort } from "../src-Bzfi3cQM.mjs";
import "../backoff-N5Hi0doU.mjs";
import { r as theme } from "../theme-DzaUZY4q.mjs";
//#region src/infra/transport-ready.ts
/** Polls until ready, timed out, or aborted, with bounded logging through the runtime sink. */
async function waitForTransportReady(params) {
	const started = Date.now();
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 0, 0);
	const deadline = started + timeoutMs;
	const logAfterMs = resolveTimerTimeoutMs(params.logAfterMs, timeoutMs, 0);
	const logIntervalMs = resolveTimerTimeoutMs(params.logIntervalMs, 3e4, 1e3);
	const pollIntervalMs = resolveTimerTimeoutMs(params.pollIntervalMs, 150, 50);
	let nextLogAt = started + logAfterMs;
	let lastError = null;
	const logNotReady = (elapsedMs) => params.runtime.error?.(theme.error(`${params.label} not ready after ${elapsedMs}ms (${lastError ?? "unknown error"})`));
	while (true) {
		if (params.abortSignal?.aborted) return;
		const res = await params.check();
		if (res.ok || params.abortSignal?.aborted) return;
		lastError = res.error ?? null;
		const now = Date.now();
		if (now >= deadline) break;
		if (now >= nextLogAt) {
			logNotReady(now - started);
			nextLogAt = now + logIntervalMs;
		}
		try {
			await sleepWithAbort(pollIntervalMs, params.abortSignal);
		} catch (err) {
			if (params.abortSignal?.aborted) return;
			throw err;
		}
	}
	logNotReady(timeoutMs);
	throw new Error(`${params.label} not ready (${lastError ?? "unknown error"})`);
}
//#endregion
export { waitForTransportReady };
