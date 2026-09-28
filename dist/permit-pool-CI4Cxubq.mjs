//#region src/shared/permit-pool.ts
/**
* FIFO admission with caller-owned lifetime. Cancellation/deadlines only stop
* waiting: an acquired permit stays held until its idempotent release is called.
* A null result means admission was aborted or its deadline elapsed.
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
			while (waiters.length > 0) {
				const waiter = waiters.shift();
				if (!waiter) break;
				if (waiter.expired()) {
					waiter.settle(null);
					continue;
				}
				waiter.settle(createRelease());
				break;
			}
		};
	};
	return { async acquire({ signal, deadlineAtMs } = {}) {
		const expired = () => signal?.aborted === true || deadlineAtMs !== void 0 && Date.now() >= deadlineAtMs;
		if (expired()) return null;
		if (active < limit) return createRelease();
		return await new Promise((resolve) => {
			let settled = false;
			let timer;
			const cancel = () => waiter.settle(null);
			const waiter = {
				expired,
				settle: (release) => {
					if (settled) return;
					settled = true;
					clearTimeout(timer);
					signal?.removeEventListener("abort", cancel);
					const index = waiters.indexOf(waiter);
					if (index >= 0) waiters.splice(index, 1);
					resolve(release);
				}
			};
			if (deadlineAtMs !== void 0) {
				timer = setTimeout(cancel, Math.max(1, deadlineAtMs - Date.now()));
				timer.unref();
			}
			signal?.addEventListener("abort", cancel, { once: true });
			waiters.push(waiter);
		});
	} };
}
//#endregion
export { createPermitPool as t };
