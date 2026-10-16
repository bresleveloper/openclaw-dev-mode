//#region src/cron/service/active-run-cancellation.ts
const activeCronTaskRunsByRunId = /* @__PURE__ */ new Map();
const settlingCronTaskRuns = /* @__PURE__ */ new Map();
const activeCronTaskRunDrainWaiters = /* @__PURE__ */ new Set();
const suspensionVisibleCronTaskRuns = /* @__PURE__ */ new Map();
const CRON_TASK_RUN_SETTLEMENT_TRACKING_MAX_MS = 6e4;
function notifyActiveCronTaskRunDrainWaitersIfEmpty() {
	if (activeCronTaskRunsByRunId.size > 0 || settlingCronTaskRuns.size > 0) return;
	for (const resolve of activeCronTaskRunDrainWaiters) resolve();
	activeCronTaskRunDrainWaiters.clear();
}
function startActiveCronTaskRunSettlementGrace(promise) {
	const entry = settlingCronTaskRuns.get(promise);
	if (!entry || entry.retirementTimer) return;
	entry.retirementTimer = setTimeout(() => {
		settlingCronTaskRuns.delete(promise);
		notifyActiveCronTaskRunDrainWaitersIfEmpty();
	}, CRON_TASK_RUN_SETTLEMENT_TRACKING_MAX_MS);
	entry.retirementTimer.unref?.();
}
function registerActiveCronTaskRun(params) {
	const runId = params.runId?.trim();
	if (!runId) return;
	const handle = {
		controller: params.controller,
		onCancel: params.onCancel
	};
	activeCronTaskRunsByRunId.set(runId, handle);
	const cancelJobRun = (reason) => {
		cancelActiveCronTaskRun({
			runId,
			reason
		});
	};
	if (params.activeJobMarker?.cancellation?.kind === "requested") cancelJobRun(params.activeJobMarker.cancellation.reason);
	else if (params.activeJobMarker) params.activeJobMarker.cancellation = {
		kind: "bound",
		cancel: cancelJobRun
	};
	return () => {
		if (params.activeJobMarker?.cancellation?.kind === "bound" && params.activeJobMarker.cancellation.cancel === cancelJobRun) delete params.activeJobMarker.cancellation;
		if (activeCronTaskRunsByRunId.get(runId)?.controller === params.controller) {
			activeCronTaskRunsByRunId.delete(runId);
			notifyActiveCronTaskRunDrainWaitersIfEmpty();
		}
	};
}
function abortActiveCronTaskRuns(reason = "Gateway restarting.") {
	let aborted = 0;
	for (const handle of activeCronTaskRunsByRunId.values()) {
		if (handle.controller.signal.aborted) continue;
		handle.controller.abort(reason);
		handle.onCancel?.(reason);
		aborted += 1;
	}
	for (const promise of settlingCronTaskRuns.keys()) startActiveCronTaskRunSettlementGrace(promise);
	return aborted;
}
function trackActiveCronTaskRunSettlement(promise, abortSignal, agentId) {
	settlingCronTaskRuns.set(promise, {});
	suspensionVisibleCronTaskRuns.set(promise, agentId);
	const startSettlementGrace = () => startActiveCronTaskRunSettlementGrace(promise);
	abortSignal?.addEventListener("abort", startSettlementGrace, { once: true });
	if (abortSignal?.aborted) startSettlementGrace();
	promise.catch(() => void 0).finally(() => {
		abortSignal?.removeEventListener("abort", startSettlementGrace);
		const entry = settlingCronTaskRuns.get(promise);
		if (entry?.retirementTimer) clearTimeout(entry.retirementTimer);
		settlingCronTaskRuns.delete(promise);
		suspensionVisibleCronTaskRuns.delete(promise);
		notifyActiveCronTaskRunDrainWaitersIfEmpty();
	});
}
/** Cron cores that can still mutate state even after timeout/cancel returned. */
function getSuspensionVisibleCronTaskRunCount(scope) {
	if (!scope) return suspensionVisibleCronTaskRuns.size;
	let count = 0;
	for (const agentId of suspensionVisibleCronTaskRuns.values()) if (!agentId || agentId === scope.agentId) count += 1;
	return count;
}
/** Retires restart-drain bookkeeping without hiding still-running cores from suspension. */
function retireActiveCronTaskRunTracking() {
	activeCronTaskRunsByRunId.clear();
	for (const entry of settlingCronTaskRuns.values()) if (entry.retirementTimer) clearTimeout(entry.retirementTimer);
	settlingCronTaskRuns.clear();
	notifyActiveCronTaskRunDrainWaitersIfEmpty();
}
async function waitForActiveCronTaskRuns(timeoutMs) {
	const waitMs = Math.max(0, Math.floor(timeoutMs));
	if (waitMs > 0 && (activeCronTaskRunsByRunId.size > 0 || settlingCronTaskRuns.size > 0)) await new Promise((resolve) => {
		const waiter = () => {
			clearTimeout(timeout);
			resolve();
		};
		const timeout = setTimeout(() => {
			activeCronTaskRunDrainWaiters.delete(waiter);
			resolve();
		}, waitMs);
		activeCronTaskRunDrainWaiters.add(waiter);
	});
	return {
		drained: activeCronTaskRunsByRunId.size === 0 && settlingCronTaskRuns.size === 0,
		active: activeCronTaskRunsByRunId.size + settlingCronTaskRuns.size
	};
}
function cancelActiveCronTaskRun(params) {
	const runId = params.runId?.trim();
	if (!runId) return false;
	const handle = activeCronTaskRunsByRunId.get(runId);
	if (!handle || handle.controller.signal.aborted) return false;
	const reason = params.reason?.trim() || "Cancelled by operator.";
	handle.controller.abort(reason);
	handle.onCancel?.(reason);
	return true;
}
function resetActiveCronTaskRunsForTests() {
	retireActiveCronTaskRunTracking();
	suspensionVisibleCronTaskRuns.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.activeCronTaskRunTestApi")] = { resetActiveCronTaskRunsForTests };
//#endregion
export { trackActiveCronTaskRunSettlement as a, retireActiveCronTaskRunTracking as i, getSuspensionVisibleCronTaskRunCount as n, waitForActiveCronTaskRuns as o, registerActiveCronTaskRun as r, abortActiveCronTaskRuns as t };
