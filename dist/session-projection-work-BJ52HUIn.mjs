import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { setImmediate } from "node:timers/promises";
//#region src/gateway/session-projection-work.ts
let pendingYield;
let foregroundCount = 0;
let foregroundIdle;
/** Resident projection drains share one pending event-loop yield. */
function yieldSessionListWork() {
	return pendingYield ??= setImmediate().finally(() => {
		pendingYield = void 0;
	});
}
/** One pending drain also joins work published as its previous batch settles. */
function createSessionProjectionDrain(params) {
	let pending;
	async function drain() {
		while (params.hasWork()) {
			await params.refresh();
			if (params.needsYield()) await yieldSessionListWork();
		}
	}
	function ensure() {
		params.beforeEnsure();
		if (!params.hasWork()) return pending ?? params.idle();
		return pending ??= yieldSessionListWork().then(() => params.runAsOwner(drain)).then(() => {
			pending = void 0;
			if (params.hasWork()) return ensure();
		}, (error) => {
			pending = void 0;
			throw error;
		});
	}
	return ensure;
}
/** Optional transcript work must not invalidate a request's asynchronous read or mutation. */
function retainSessionListForegroundWork() {
	foregroundCount++;
	let retained = true;
	return () => {
		if (!retained) return;
		retained = false;
		if (--foregroundCount === 0) {
			const idle = foregroundIdle;
			foregroundIdle = void 0;
			idle?.resolve();
		}
	};
}
function canRunSessionListBackgroundWork() {
	return foregroundCount === 0;
}
async function yieldSessionListBackgroundWork() {
	for (;;) {
		await yieldSessionListWork();
		if (canRunSessionListBackgroundWork()) return;
		foregroundIdle ??= createDeferredCore();
		await foregroundIdle.promise;
	}
}
//#endregion
export { yieldSessionListWork as a, yieldSessionListBackgroundWork as i, createSessionProjectionDrain as n, retainSessionListForegroundWork as r, canRunSessionListBackgroundWork as t };
