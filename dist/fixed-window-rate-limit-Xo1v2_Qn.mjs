import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
//#region src/infra/fixed-window-rate-limit.ts
/** Process-local fixed-window quota; distributed limits require caller-owned persistence. */
function createFixedWindowBudget(params) {
	const maxRequests = resolveIntegerOption(params.maxRequests, 1, { min: 1 });
	const windowMs = resolveIntegerOption(params.windowMs, 1, { min: 1 });
	const now = params.now ?? Date.now;
	let count = 0;
	let windowStartMs = 0;
	return {
		consume() {
			const nowMs = now();
			if (nowMs - windowStartMs >= windowMs) {
				windowStartMs = nowMs;
				count = 0;
			}
			if (count >= maxRequests) return {
				allowed: false,
				retryAfterMs: Math.max(0, windowStartMs + windowMs - nowMs),
				remaining: 0
			};
			count += 1;
			return {
				allowed: true,
				retryAfterMs: 0,
				remaining: Math.max(0, maxRequests - count)
			};
		},
		reset() {
			count = 0;
			windowStartMs = 0;
		}
	};
}
//#endregion
export { createFixedWindowBudget as t };
