//#region extensions/browser/src/browser/timer-delay.ts
/**
* Timer delay normalization for Browser waits and cleanup loops.
*/
/** Largest timeout delay accepted reliably by Node timers. */
const MAX_SAFE_TIMEOUT_DELAY_MS = 2147483647;
/** Clamps timer delays to Node's safe range with an optional lower bound. */
function normalizeBrowserTimerDelayMs(timeoutMs, opts) {
	const rawMinMs = opts?.minMs ?? 1;
	const minMs = Math.min(MAX_SAFE_TIMEOUT_DELAY_MS, Math.max(0, Number.isFinite(rawMinMs) ? Math.floor(rawMinMs) : 1));
	return Math.min(MAX_SAFE_TIMEOUT_DELAY_MS, Math.max(minMs, Number.isFinite(timeoutMs) ? Math.floor(timeoutMs) : minMs));
}
//#endregion
export { normalizeBrowserTimerDelayMs as t };
