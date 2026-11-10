import { c as resolveSafeTimeoutDelayMs } from "./timeouts-ClVlVfGz.mjs";
//#region src/utils/timer-delay.ts
function setSafeTimeout(callback, delayMs, opts) {
	return setTimeout(callback, resolveSafeTimeoutDelayMs(delayMs, opts));
}
//#endregion
export { setSafeTimeout as t };
