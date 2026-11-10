import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-DaL1xmcH.mjs";
//#region src/shared/permit-pool.ts
/**
* FIFO admission with caller-owned lifetime. Cancellation/deadlines only stop
* waiting: an acquired permit stays held until its idempotent release is called.
* acquire returns null on cancellation/expiry; tryAcquire returns null when busy.
*/
function createPermitPool(limit) {
	let active = 0;
	const waiters = [];
	const createRelease = () => {
		active += 1;
		let released = false;
		return () => {
			if (released) return;
			released = true;
			active -= 1;
			for (let waiter = waiters.shift(); waiter; waiter = waiters.shift()) {
				const expired = waiter.expired();
				waiter.settle(expired ? null : createRelease());
				if (!expired) break;
			}
		};
	};
	const tryAcquire = () => active < limit ? createRelease() : null;
	return {
		get pendingCount() {
			return waiters.length;
		},
		tryAcquire,
		async acquire({ signal, deadlineAtMs } = {}) {
			const expired = () => signal?.aborted === true || deadlineAtMs !== void 0 && Date.now() >= deadlineAtMs;
			if (expired()) return null;
			const releasePermit = tryAcquire();
			if (releasePermit) return releasePermit;
			return await new Promise((resolve) => {
				let cancelDeadline;
				const cancel = () => waiter.settle(null);
				const waiter = {
					expired,
					settle: (release) => {
						cancelDeadline?.();
						signal?.removeEventListener("abort", cancel);
						const index = waiters.indexOf(waiter);
						if (index >= 0) waiters.splice(index, 1);
						resolve(release);
					}
				};
				signal?.addEventListener("abort", cancel, { once: true });
				waiters.push(waiter);
				if (deadlineAtMs !== void 0) cancelDeadline = scheduleAbsoluteDeadline(deadlineAtMs, cancel, void 0, { unref: true });
			});
		}
	};
}
//#endregion
export { createPermitPool as t };
