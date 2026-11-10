import { setTimeout } from "node:timers/promises";
//#region src/infra/acquire-with-wait.ts
/** Retry only acquisition, keeping the deadline independent of wall-clock changes. */
async function acquireWithWait(params) {
	const now = params.now ?? performance.now.bind(performance);
	let delayMs = params.pollIntervalMs;
	for (;;) try {
		return await params.acquire();
	} catch (error) {
		const retry = params.shouldRetry(error);
		if (!retry) throw error;
		const remainingMs = params.deadlineMs - now();
		if (remainingMs <= 0) throw error;
		await (params.sleep ?? setTimeout)(Math.min(retry === true ? delayMs : retry.delayMs, remainingMs));
		delayMs = Math.min(delayMs * 2, params.maxPollIntervalMs ?? params.pollIntervalMs);
	}
}
//#endregion
export { acquireWithWait as t };
