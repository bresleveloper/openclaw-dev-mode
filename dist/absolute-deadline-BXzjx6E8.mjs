import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CLj0HTDM.mjs";
//#region src/utils/absolute-deadline.ts
const ABSOLUTE_DEADLINE_EXPIRED = Symbol("absolute deadline expired");
/** Rechecks the selected clock because timers can run early or overflow long delays. */
function scheduleAbsoluteDeadline(deadlineAtMs, onExpired, now = () => Date.now()) {
	let timer;
	const checkDeadline = () => {
		const remainingMs = Math.max(0, deadlineAtMs - now());
		if (remainingMs === 0) {
			onExpired();
			return;
		}
		timer = setTimeout(checkDeadline, Math.min(remainingMs, MAX_TIMER_TIMEOUT_MS));
	};
	checkDeadline();
	return () => {
		if (timer !== void 0) clearTimeout(timer);
	};
}
/** Bounds one operation by an absolute deadline in the selected clock. */
async function awaitWithinDeadline(operation, deadlineAtMs, now = () => Date.now()) {
	if (deadlineAtMs === void 0) return await operation();
	if (Math.max(0, deadlineAtMs - now()) === 0) return ABSOLUTE_DEADLINE_EXPIRED;
	let cancelDeadline;
	try {
		const deadline = new Promise((resolve) => {
			cancelDeadline = scheduleAbsoluteDeadline(deadlineAtMs, () => resolve(ABSOLUTE_DEADLINE_EXPIRED), now);
		});
		return await Promise.race([deadline, operation().then((result) => now() >= deadlineAtMs ? ABSOLUTE_DEADLINE_EXPIRED : result)]);
	} finally {
		cancelDeadline?.();
	}
}
//#endregion
export { awaitWithinDeadline as n, scheduleAbsoluteDeadline as r, ABSOLUTE_DEADLINE_EXPIRED as t };
