import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
//#region src/auto-reply/reply/reply-run-finalization-lease.ts
const REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS = 6e4;
function formatReplyOperationResult(result) {
	if (!result) return "none";
	return "code" in result ? `${result.kind}:${result.code}` : result.kind;
}
const activeLeases = /* @__PURE__ */ new Set();
const activeSettleTimers = /* @__PURE__ */ new Set();
const leasesByOwner = /* @__PURE__ */ new WeakMap();
function createReplyRunSettleTimer(params) {
	let timer;
	const settleTimer = {
		clear() {
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
			activeSettleTimers.delete(settleTimer);
		},
		renew(timeoutMs) {
			settleTimer.clear();
			timer = setTimeout(() => {
				timer = void 0;
				activeSettleTimers.delete(settleTimer);
				if (params.canExpire()) params.onExpire();
			}, resolveTimerTimeoutMs(timeoutMs, REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS, 1));
			timer.unref?.();
			activeSettleTimers.add(settleTimer);
		},
		scheduleOnce(timeoutMs) {
			if (!timer) settleTimer.renew(timeoutMs);
		}
	};
	return settleTimer;
}
function createReplyRunFinalizationLease(params) {
	let finalizing = false;
	let defaultDeadlineMs = 0;
	const workDeadlinesMs = /* @__PURE__ */ new Map();
	const settleTimer = createReplyRunSettleTimer({
		canExpire: () => finalizing && params.canExpire(),
		onExpire: params.onExpire
	});
	const schedule = () => {
		const workDeadlineMs = Math.max(0, ...workDeadlinesMs.values());
		const deadlineMs = Math.max(defaultDeadlineMs, workDeadlineMs);
		settleTimer.renew(Math.max(1, deadlineMs - Date.now()));
	};
	const recordActivity = () => {
		params.onActivity();
		if (finalizing) {
			defaultDeadlineMs = Date.now() + REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS;
			params.onFinalizationProgress();
			schedule();
		}
	};
	const lease = {
		begin() {
			if (!params.canExpire()) return;
			finalizing = true;
			activeLeases.add(lease);
			recordActivity();
		},
		beginWork(timeoutMs) {
			const workId = Symbol("reply-finalization-work");
			workDeadlinesMs.set(workId, Date.now() + resolveTimerTimeoutMs(timeoutMs, REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS, 1));
			recordActivity();
			let active = true;
			return () => {
				if (!active) return;
				active = false;
				workDeadlinesMs.delete(workId);
				if (finalizing) schedule();
			};
		},
		clear() {
			finalizing = false;
			defaultDeadlineMs = 0;
			workDeadlinesMs.clear();
			settleTimer.clear();
			activeLeases.delete(lease);
			leasesByOwner.delete(params.owner);
		},
		recordActivity
	};
	leasesByOwner.set(params.owner, lease);
	return lease;
}
function beginReplyOperationFinalizationWork(owner, timeoutMs) {
	return leasesByOwner.get(owner)?.beginWork(timeoutMs) ?? (() => void 0);
}
function resetReplyRunSettleTimersForTesting() {
	for (const lease of activeLeases) lease.clear();
	activeLeases.clear();
	for (const timer of activeSettleTimers) timer.clear();
	activeSettleTimers.clear();
}
//#endregion
export { resetReplyRunSettleTimersForTesting as a, formatReplyOperationResult as i, createReplyRunFinalizationLease as n, createReplyRunSettleTimer as r, beginReplyOperationFinalizationWork as t };
