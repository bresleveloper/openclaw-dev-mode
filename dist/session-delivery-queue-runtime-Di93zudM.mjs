import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as getErrnoCode, c as isDeliveryRecoveryRetryEligible, f as resolveDeliveryRecoveryDeadlineMs, n as createDeliveryRecoveryCoordinator, r as createEmptyDeliveryRecoverySummary, t as computeBackoffMs } from "./delivery-recovery.shared-BD9P01Ce.mjs";
import { a as SessionDeliveryDeferredError, i as SessionDeliveryDeadLetteredError, n as SessionDeliveryAcknowledgementFinalizeError, o as SessionDeliveryRetryChargedError, r as SessionDeliveryAttemptStartError, s as SessionDeliverySafeRetryError } from "./session-delivery-queue.records-mSSKRg96.mjs";
import { c as loadPendingSessionDelivery, f as moveSessionDeliveryToFailed, n as completeSessionDelivery, o as failSessionDelivery, s as loadPendingSessionDeliveries, u as markSessionDeliverySettlement } from "./session-delivery-queue-storage-BfVLAorZ.mjs";
//#region src/infra/session-delivery-queue-recovery.ts
const MAX_SESSION_DELIVERY_RETRIES = 5;
const recoveryCoordinator = createDeliveryRecoveryCoordinator();
async function finalizeSessionDeliverySettlement(params) {
	let phase = "settled callback";
	try {
		params.queueContext.admission.assertCurrent();
		await params.onSettled?.(params.entry, params.outcome, params.queueContext);
		phase = `${params.outcome} finalization`;
		await (params.outcome === "recovered" ? completeSessionDelivery : moveSessionDeliveryToFailed)(params.entry.id, params.queueContext);
		return true;
	} catch (error) {
		params.log.error(`session delivery: ${phase} failed for ${params.entry.id}: ${String(error)}`);
		return false;
	}
}
function resolvePendingSettlementOutcome(entry) {
	return entry.settlementOutcome ?? (entry.acknowledgedAt !== void 0 ? "recovered" : void 0);
}
function resolveSessionRetryEligibility(entry, now) {
	if (entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion") {
		if (now >= entry.owner.deadlineAt) return { eligible: true };
		const remainingBackoffMs = Math.max(0, (entry.availableAt ?? 0) - now);
		return remainingBackoffMs > 0 ? {
			eligible: false,
			remainingBackoffMs
		} : { eligible: true };
	}
	return isDeliveryRecoveryRetryEligible(entry, now);
}
async function processPendingSessionDelivery(opts) {
	const { entry, context } = opts;
	const pendingSettlementOutcome = resolvePendingSettlementOutcome(entry);
	if (pendingSettlementOutcome) return {
		status: pendingSettlementOutcome,
		finalized: await finalizeSessionDeliverySettlement({
			...context,
			entry,
			outcome: pendingSettlementOutcome
		})
	};
	const maxRetries = entry.maxRetries ?? MAX_SESSION_DELIVERY_RETRIES;
	if (!(entry.kind === "agentTurn" && entry.deliveryStartedAt !== void 0 && entry.retryCount === maxRetries) && entry.retryCount >= maxRetries) {
		await markSessionDeliverySettlement(entry, "moved-to-failed", context.queueContext);
		return {
			status: "max-retries",
			finalized: await finalizeSessionDeliverySettlement({
				...context,
				entry,
				outcome: "moved-to-failed"
			})
		};
	}
	if (!opts.bypassBackoff) {
		const retryEligibility = resolveSessionRetryEligibility(entry, (context.now ?? Date.now)());
		if (!retryEligibility.eligible) return {
			status: "backoff",
			remainingMs: retryEligibility.remainingBackoffMs
		};
	}
	if (await opts.beforeDelivery?.() === "stop") return { status: "stop" };
	let result;
	try {
		context.queueContext.admission.assertCurrent();
		await context.deliver(entry, { queueContext: context.queueContext });
		await markSessionDeliverySettlement(entry, "recovered", context.queueContext);
		result = "recovered";
	} catch (err) {
		if (err instanceof SessionDeliveryDeadLetteredError) {
			try {
				await markSessionDeliverySettlement(entry, "moved-to-failed", context.queueContext);
			} catch (markError) {
				if (markError instanceof SessionDeliveryAcknowledgementFinalizeError) return { status: "deferred" };
				throw markError;
			}
			result = "moved-to-failed";
		} else if (err instanceof SessionDeliveryDeferredError || err instanceof SessionDeliveryAcknowledgementFinalizeError || err instanceof SessionDeliveryAttemptStartError) return { status: "deferred" };
		else {
			const errMsg = formatErrorMessage(err);
			opts.onFailed?.(entry, errMsg);
			if (err instanceof SessionDeliveryRetryChargedError) return { status: "failed" };
			try {
				await failSessionDelivery(entry.id, errMsg, context.queueContext, { releaseAttemptOwnership: err instanceof SessionDeliverySafeRetryError });
			} catch (failErr) {
				if (getErrnoCode(failErr) === "ENOENT") return { status: "already-gone" };
				throw failErr;
			}
			return { status: "failed" };
		}
	}
	const finalized = await finalizeSessionDeliverySettlement({
		...context,
		entry,
		outcome: result
	});
	return {
		status: result,
		finalized
	};
}
/** Drain one exact queued session delivery and return its final pending state. */
async function drainPendingSessionDelivery(opts) {
	const claim = await recoveryCoordinator.withClaim(opts.id, async () => {
		const entry = await loadPendingSessionDelivery(opts.id, opts.queueContext);
		if (!entry) return null;
		const result = await processPendingSessionDelivery({
			entry,
			context: opts,
			bypassBackoff: opts.bypassBackoff,
			onFailed: (failedEntry, errMsg) => {
				opts.log.warn(`${opts.logLabel}: retry failed for entry ${failedEntry.id}: ${errMsg}`);
			}
		});
		if (result.status === "max-retries" && result.finalized) opts.log.warn(`${opts.logLabel}: entry ${entry.id} exceeded max retries and was moved to failed`);
		else if (result.status === "moved-to-failed" && result.finalized) opts.log.warn(`${opts.logLabel}: entry ${entry.id} was dead-lettered and moved to failed`);
		else if (result.status === "backoff") opts.log.info(`${opts.logLabel}: entry ${entry.id} not ready for retry yet — backoff ${result.remainingMs}ms remaining`);
		if (result.status === "already-gone" || "finalized" in result && result.finalized) return null;
		return result.status === "backoff" ? entry : loadPendingSessionDelivery(opts.id, opts.queueContext);
	});
	if (claim.status === "claimed-by-other-owner") {
		opts.log.info(`${opts.logLabel}: entry ${opts.id} is already being recovered`);
		return loadPendingSessionDelivery(opts.id, opts.queueContext);
	}
	return claim.value;
}
/** Replay pending session deliveries until the recovery budget is exhausted. */
async function recoverPendingSessionDeliveries(opts) {
	const pending = (await loadPendingSessionDeliveries(opts.queueContext)).filter((entry) => opts.maxEnqueuedAt == null || entry.enqueuedAt <= opts.maxEnqueuedAt);
	if (pending.length === 0) return createEmptyDeliveryRecoverySummary();
	const summary = createEmptyDeliveryRecoverySummary();
	const deadline = resolveDeliveryRecoveryDeadlineMs(opts.maxRecoveryMs);
	const onDeadlineExceeded = () => {
		opts.log.warn("Session delivery recovery time budget exceeded — remaining entries deferred");
	};
	const context = {
		...opts,
		logLabel: "Session delivery"
	};
	const beforeDelivery = async () => {
		if (await recoveryCoordinator.waitForReplay(deadline) === "deadline-exceeded") {
			onDeadlineExceeded();
			return "stop";
		}
		return "continue";
	};
	const onFailed = (_failedEntry, errMsg) => {
		summary.failed += 1;
		opts.log.warn(`Session delivery retry failed: ${errMsg}`);
	};
	await recoveryCoordinator.scan({
		entries: pending,
		loadEntry: (id) => loadPendingSessionDelivery(id, opts.queueContext),
		deadlineMs: deadline,
		onDeadlineExceeded,
		onEntry: async (currentEntry) => {
			if (opts.maxEnqueuedAt != null && currentEntry.enqueuedAt > opts.maxEnqueuedAt) return "continue";
			const result = await processPendingSessionDelivery({
				entry: currentEntry,
				context,
				beforeDelivery,
				onFailed
			});
			if (result.status === "max-retries") {
				summary.skippedMaxRetries += 1;
				return "continue";
			}
			if (result.status === "backoff") {
				summary.deferredBackoff += 1;
				return "continue";
			}
			if (result.status === "stop") return "stop";
			if (result.status === "recovered" && result.finalized) {
				summary.recovered += 1;
				opts.log.info(`Recovered session delivery ${currentEntry.id}`);
			} else if (result.status === "moved-to-failed" && result.finalized) {
				summary.failed += 1;
				opts.log.warn(`Session delivery: entry ${currentEntry.id} was dead-lettered and moved to failed`);
			}
			return "continue";
		}
	});
	return summary;
}
//#endregion
//#region src/infra/session-delivery-queue-runtime.ts
const RUNTIME_RELOAD_RETRY_MS = 1e3;
let runtime;
let runtimeGeneration = 0;
function armPendingScan(generation) {
	if (!runtime || generation !== runtimeGeneration) return;
	runtime.scheduler.schedule({
		id: "session-delivery:scan",
		delayMs: RUNTIME_RELOAD_RETRY_MS,
		mode: "earliest",
		run: () => schedulePendingSessionDeliveries()
	});
}
function resolveRetryDelayMs(entry, now) {
	const claimDelayMs = Math.max(0, (entry.availableAt ?? 0) - now);
	if (entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion") return Math.min(claimDelayMs, Math.max(0, entry.owner.deadlineAt - now));
	if (entry.retryCount <= 0) return claimDelayMs;
	const attemptedAt = entry.lastAttemptAt ?? entry.enqueuedAt;
	return Math.max(claimDelayMs, attemptedAt + computeBackoffMs(entry.retryCount) - now);
}
function armSessionDeliveryId(id, delayMs, generation) {
	if (!runtime || generation !== runtimeGeneration) return;
	runtime.scheduler.schedule({
		id: `session-delivery:${id}`,
		delayMs,
		mode: "earliest",
		run: () => runScheduledSessionDelivery(id, generation)
	});
}
function armSessionDelivery(entry, generation, minimumDelayMs = 0) {
	if (!runtime || runtime.runningEntries.has(entry.id)) return;
	armSessionDeliveryId(entry.id, Math.max(minimumDelayMs, resolveRetryDelayMs(entry, runtime.scheduler.now())), generation);
}
async function runScheduledSessionDelivery(id, generation) {
	const activeRuntime = runtime;
	if (!activeRuntime || generation !== runtimeGeneration) return;
	if (activeRuntime.runningEntries.has(id)) return;
	activeRuntime.runningEntries.add(id);
	let pending = null;
	try {
		pending = await (activeRuntime.drain ?? drainPendingSessionDelivery)({
			id,
			queueContext: activeRuntime.queueContext,
			now: () => activeRuntime.scheduler.now(),
			logLabel: "session delivery",
			log: activeRuntime.log,
			deliver: activeRuntime.deliver,
			onSettled: activeRuntime.onSettled
		});
	} catch (error) {
		activeRuntime.log.error(`session delivery: runtime drain failed for ${id}: ${String(error)}`);
		if (runtime && generation === runtimeGeneration) armSessionDeliveryId(id, RUNTIME_RELOAD_RETRY_MS, generation);
	} finally {
		activeRuntime.runningEntries.delete(id);
	}
	if (!runtime || generation !== runtimeGeneration) return;
	if (pending) armSessionDelivery(pending, generation, RUNTIME_RELOAD_RETRY_MS);
}
/** Register callbacks; stop fences scheduling and joins admitted reads and drains. */
function startSessionDeliveryRuntime(params) {
	runtimeGeneration += 1;
	const generation = runtimeGeneration;
	runtime?.scheduler.beginClose();
	const activeRuntime = {
		...params,
		scheduler: params.scheduler.scope(),
		runningEntries: /* @__PURE__ */ new Set(),
		pendingSchedules: /* @__PURE__ */ new Set()
	};
	runtime = activeRuntime;
	let stopPromise;
	return () => {
		if (runtimeGeneration === generation) {
			runtimeGeneration += 1;
			runtime = void 0;
		}
		stopPromise ??= Promise.all([activeRuntime.scheduler.stop(), ...activeRuntime.pendingSchedules]).then(() => {});
		return stopPromise;
	};
}
/** Schedule one durable entry when a gateway runtime is available. */
async function scheduleSessionDelivery(id, queueContext) {
	const generation = runtimeGeneration;
	const activeRuntime = runtime;
	if (!activeRuntime) return false;
	try {
		queueContext.admission.assertCurrent();
		activeRuntime.queueContext.admission.assertCurrent();
		if (queueContext.admission.identity.key !== activeRuntime.queueContext.admission.identity.key) {
			activeRuntime.log.error(`session delivery: ${id} belongs to another state database`);
			return false;
		}
	} catch (error) {
		activeRuntime.log.error(`session delivery: cannot schedule ${id} for a retired state owner: ${String(error)}`);
		return false;
	}
	const settled = createDeferredCore();
	activeRuntime.pendingSchedules.add(settled.promise);
	try {
		let entry;
		try {
			entry = await (activeRuntime.reloadPending ?? loadPendingSessionDelivery)(id, activeRuntime.queueContext);
		} catch (error) {
			activeRuntime.log.error(`session delivery: failed to load ${id}: ${String(error)}`);
			armSessionDeliveryId(id, RUNTIME_RELOAD_RETRY_MS, generation);
			return true;
		}
		if (!entry || !runtime || generation !== runtimeGeneration) return !entry;
		armSessionDelivery(entry, generation);
		return true;
	} finally {
		activeRuntime.pendingSchedules.delete(settled.promise);
		settled.resolve();
	}
}
/** Schedule every pending entry after startup recovery installs the runtime owner. */
async function schedulePendingSessionDeliveries() {
	const generation = runtimeGeneration;
	const activeRuntime = runtime;
	if (!activeRuntime) return;
	const settled = createDeferredCore();
	activeRuntime.pendingSchedules.add(settled.promise);
	try {
		let entries;
		try {
			entries = await (activeRuntime.listPending ?? loadPendingSessionDeliveries)(activeRuntime.queueContext);
		} catch (error) {
			activeRuntime.log.error(`session delivery: failed to scan pending entries: ${String(error)}`);
			armPendingScan(generation);
			return;
		}
		if (!runtime || generation !== runtimeGeneration) return;
		for (const entry of entries) armSessionDelivery(entry, generation);
	} finally {
		activeRuntime.pendingSchedules.delete(settled.promise);
		settled.resolve();
	}
}
//#endregion
export { recoverPendingSessionDeliveries as a, drainPendingSessionDelivery as i, scheduleSessionDelivery as n, startSessionDeliveryRuntime as r, schedulePendingSessionDeliveries as t };
