import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { A as tryBeginGatewaySuspendAdmission } from "./gateway-work-admission-CHv_0noy.mjs";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-BarRglPD.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-suspend-coordinator.ts
const GATEWAY_SUSPEND_TTL_MS = 12e4;
const GATEWAY_SUSPEND_RETRY_AFTER_MS = 2e4;
const GATEWAY_SCHEDULER_RECOVERY_RETRY_MS = 1e3;
const COORDINATOR_STATE = resolveGlobalSingleton(Symbol.for("openclaw.gatewaySuspendCoordinatorState"), () => ({
	current: null,
	retiredForLifecycleReset: null
}));
function schedulerRecoveryResult() {
	return {
		status: "recovering",
		reason: "scheduler-resume-failed",
		retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS
	};
}
function clearEntryTimer(entry) {
	entry.timerGeneration = (entry.timerGeneration ?? 0) + 1;
	if (entry.timer) {
		clearTimeout(entry.timer);
		entry.timer = void 0;
	}
}
function scheduleEntry(entry, delayMs, callback) {
	clearEntryTimer(entry);
	const generation = entry.timerGeneration;
	entry.timer = setTimeout(() => {
		if (entry.timerGeneration === generation) callback();
	}, delayMs);
	entry.timer.unref?.();
}
function resumeAndReopen(entry) {
	try {
		entry.resumeScheduling();
	} catch (err) {
		entry.warn?.(`gateway scheduler recovery failed: ${String(err)}`);
		enterSchedulerRecovery(entry);
		return false;
	}
	if (COORDINATOR_STATE.current !== entry) return true;
	if (!entry.reopenAdmission()) {
		entry.warn?.("gateway scheduler recovery could not reopen admission");
		enterSchedulerRecovery(entry);
		return false;
	}
	clearEntryTimer(entry);
	COORDINATOR_STATE.current = null;
	return true;
}
function enterSchedulerRecovery(entry) {
	if (COORDINATOR_STATE.current !== entry) return;
	if (entry.kind === "recovering") {
		scheduleRecoveryRetry(entry);
		return;
	}
	clearEntryTimer(entry);
	const recovery = {
		kind: "recovering",
		owner: entry.owner,
		resumeScheduling: entry.resumeScheduling,
		reopenAdmission: entry.reopenAdmission,
		warn: entry.warn
	};
	COORDINATOR_STATE.current = recovery;
	scheduleRecoveryRetry(recovery);
}
function scheduleRecoveryRetry(entry) {
	scheduleEntry(entry, GATEWAY_SCHEDULER_RECOVERY_RETRY_MS, () => {
		if (COORDINATOR_STATE.current === entry) resumeAndReopen(entry);
	});
}
function normalizeExpiredHeldSuspension(held) {
	if (held.nowMs() < held.expiresAtMs && performance.now() < held.deadlineAtMs) return held;
	resumeAndReopen(held);
	return COORDINATOR_STATE.current;
}
function armSchedulerRecovery(recovery) {
	const entry = {
		kind: "recovering",
		...recovery
	};
	scheduleRecoveryRetry(entry);
	return entry;
}
function resumeSchedulingBeforeReopen(params) {
	if (params.isInvalidated()) return true;
	try {
		params.resumeScheduling();
	} catch (err) {
		params.warn?.(`gateway scheduler resume failed during suspension rollback: ${String(err)}`);
		COORDINATOR_STATE.current = armSchedulerRecovery({
			owner: params.owner,
			resumeScheduling: params.resumeScheduling,
			reopenAdmission: params.reopenAdmission,
			warn: params.warn
		});
		return false;
	}
	if (!params.isInvalidated()) params.reopenAdmission();
	return true;
}
function armExpiry(held) {
	const entry = {
		kind: "held",
		...held
	};
	const remainingMs = Math.min(entry.expiresAtMs - entry.nowMs(), entry.deadlineAtMs - performance.now());
	if (remainingMs <= 0) throw new Error("gateway suspension expired during preparation");
	scheduleEntry(entry, Math.ceil(remainingMs), () => {
		if (COORDINATOR_STATE.current === entry) resumeAndReopen(entry);
	});
	return entry;
}
function renewHeldSuspension(held, nowMs) {
	held.expiresAtMs = nowMs + GATEWAY_SUSPEND_TTL_MS;
	held.deadlineAtMs = performance.now() + GATEWAY_SUSPEND_TTL_MS;
	scheduleEntry(held, GATEWAY_SUSPEND_TTL_MS, () => {
		if (COORDINATOR_STATE.current === held) resumeAndReopen(held);
	});
}
function refreshHeldSuspension(held) {
	const snapshot = createGatewayActiveWorkSnapshot(held.inspect, { ignoreTerminalSessions: held.terminalPolicy === "terminate" });
	if (COORDINATOR_STATE.current !== held || normalizeExpiredHeldSuspension(held) !== held) return;
	if (!snapshot.idle) {
		held.phase = {
			status: "draining",
			snapshot,
			...held.phase.status === "draining" ? { commitAdmission: held.phase.commitAdmission } : {}
		};
		return held.phase;
	}
	if (held.phase.status === "draining" && held.phase.commitAdmission?.() === false) throw new Error("gateway suspension admission changed during drain completion");
	held.phase = {
		status: "ready",
		snapshot
	};
	return held.phase;
}
function heldPrepareResult(held, phase) {
	const result = {
		suspensionId: held.suspensionId,
		expiresAtMs: held.expiresAtMs,
		activeCount: phase.snapshot.counts.totalActive,
		blockers: phase.snapshot.blockers,
		writeCustody: phase.snapshot.writeCustody
	};
	return phase.status === "draining" ? {
		status: "draining",
		...result,
		retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS
	} : {
		status: "ready",
		...result
	};
}
/** Acquire an idle lease, or optionally preserve existing work behind a drain fence. */
function prepareGatewaySuspend(params) {
	const terminalPolicy = params.terminalPolicy ?? "preserve";
	const drain = params.drain === true;
	const activeWorkOptions = { ignoreTerminalSessions: terminalPolicy === "terminate" };
	const nowMs = (params.nowMs ?? Date.now)();
	const deadlineAtMs = performance.now() + GATEWAY_SUSPEND_TTL_MS;
	const current = COORDINATOR_STATE.current;
	if (current?.kind === "recovering") return schedulerRecoveryResult();
	const existing = current ? normalizeExpiredHeldSuspension(current) : null;
	if (existing?.kind === "recovering") return schedulerRecoveryResult();
	if (existing) {
		if (existing.requestId !== params.requestId || existing.terminalPolicy !== terminalPolicy || existing.drain !== drain) return {
			status: "conflict",
			expiresAtMs: existing.expiresAtMs
		};
		if (!existing.handoff) {
			existing.nowMs = params.nowMs ?? Date.now;
			renewHeldSuspension(existing, nowMs);
		}
		const phase = refreshHeldSuspension(existing);
		if (!phase) {
			if (COORDINATOR_STATE.current?.kind === "recovering") return schedulerRecoveryResult();
			throw new Error("gateway suspension changed during preparation");
		}
		return heldPrepareResult(existing, phase);
	}
	const owner = {};
	let suspensionInvalidated = false;
	const admission = tryBeginGatewaySuspendAdmission(() => {
		suspensionInvalidated = true;
		const activeEntry = COORDINATOR_STATE.current;
		if (activeEntry?.owner !== owner) return;
		clearEntryTimer(activeEntry);
		COORDINATOR_STATE.current = null;
		COORDINATOR_STATE.retiredForLifecycleReset = activeEntry;
	});
	if (!admission) {
		const snapshot = createGatewayActiveWorkSnapshot(params.inspect, activeWorkOptions);
		return {
			status: "busy",
			reason: "gateway-draining",
			retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS,
			activeCount: snapshot.counts.totalActive,
			blockers: snapshot.blockers,
			writeCustody: snapshot.writeCustody
		};
	}
	let schedulingPaused = false;
	let admissionHeld = false;
	try {
		params.pauseScheduling();
		schedulingPaused = true;
		const snapshot = createGatewayActiveWorkSnapshot(params.inspect, activeWorkOptions);
		if ((params.nowMs ?? Date.now)() >= nowMs + GATEWAY_SUSPEND_TTL_MS || performance.now() >= deadlineAtMs) throw new Error("gateway suspension expired during preparation");
		if (!snapshot.idle && !drain) {
			const resumed = resumeSchedulingBeforeReopen({
				owner,
				resumeScheduling: params.resumeScheduling,
				reopenAdmission: admission.rollback,
				isInvalidated: () => suspensionInvalidated,
				warn: params.warn
			});
			schedulingPaused = false;
			if (!resumed) return schedulerRecoveryResult();
			return {
				status: "busy",
				reason: "active-work",
				retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS,
				activeCount: snapshot.counts.totalActive,
				blockers: snapshot.blockers,
				writeCustody: snapshot.writeCustody
			};
		}
		if (!(snapshot.idle ? admission.commit : admission.drain)()) throw new Error("gateway suspension admission changed during preparation");
		admissionHeld = true;
		const suspensionId = (params.createSuspensionId ?? randomUUID)();
		const expiresAtMs = nowMs + GATEWAY_SUSPEND_TTL_MS;
		const held = armExpiry({
			owner,
			requestId: params.requestId,
			terminalPolicy,
			drain,
			suspensionId,
			expiresAtMs,
			deadlineAtMs,
			inspect: params.inspect,
			phase: snapshot.idle ? {
				status: "ready",
				snapshot
			} : {
				status: "draining",
				snapshot,
				commitAdmission: admission.commit
			},
			reopenAdmission: admission.release,
			resumeScheduling: params.resumeScheduling,
			nowMs: params.nowMs ?? Date.now,
			warn: params.warn
		});
		COORDINATOR_STATE.current = held;
		return heldPrepareResult(held, held.phase);
	} catch (err) {
		if (schedulingPaused) {
			if (!resumeSchedulingBeforeReopen({
				owner,
				resumeScheduling: params.resumeScheduling,
				reopenAdmission: admissionHeld ? admission.release : admission.rollback,
				isInvalidated: () => suspensionInvalidated,
				warn: params.warn
			})) return schedulerRecoveryResult();
		} else if (admissionHeld) admission.release();
		else admission.rollback();
		throw err;
	}
}
function handoffRefusal(held, owner) {
	if (COORDINATOR_STATE.current !== held || held.nowMs() >= held.expiresAtMs || performance.now() >= held.deadlineAtMs || !owner.isCurrent()) return "gateway suspension or host iteration changed";
	if (!held.inspect?.getTerminalPersistence) return "gateway terminal persistence inspection is unavailable";
	if (held.inspect.getTerminalPersistence() > 0) return "gateway terminal persistence is still pending";
}
/** The authenticated handler verifies the process target before this synchronous commit. */
function armGatewaySuspendHandoff(params) {
	const held = COORDINATOR_STATE.current;
	if (held?.kind !== "held" || held.suspensionId !== params.suspensionId) return err("gateway suspension id does not match");
	const refusal = handoffRefusal(held, params.owner);
	if (refusal) return err(refusal);
	if (held.handoff && held.handoff !== params.owner) return err("gateway suspension already belongs to another host iteration");
	held.handoff = params.owner;
	return ok({
		status: "armed",
		suspensionId: held.suspensionId,
		expiresAtMs: held.expiresAtMs
	});
}
/** Consume synchronously before restart drain invalidates suspension or retires the host. */
function consumeGatewaySuspendHandoff(owner) {
	const held = COORDINATOR_STATE.current;
	if (held?.kind !== "held" || !owner || held.handoff !== owner) return ok(false);
	held.handoff = void 0;
	const refusal = handoffRefusal(held, owner);
	return refusal ? err(refusal) : ok(true);
}
function disarmGatewaySuspendHandoff(owner) {
	const held = COORDINATOR_STATE.current;
	if (held?.kind === "held" && held.handoff === owner) held.handoff = void 0;
}
function getGatewaySuspendStatus(suspensionId) {
	const current = COORDINATOR_STATE.current;
	if (current?.kind === "recovering") return schedulerRecoveryResult();
	const held = current ? normalizeExpiredHeldSuspension(current) : null;
	if (held?.kind === "recovering") return schedulerRecoveryResult();
	if (!held) return { status: "running" };
	if (held.suspensionId !== suspensionId) return {
		status: "conflict",
		expiresAtMs: held.expiresAtMs
	};
	const phase = refreshHeldSuspension(held);
	if (!phase) return getGatewaySuspendStatus(suspensionId);
	if (phase.status === "draining") return {
		status: "draining",
		expiresAtMs: held.expiresAtMs,
		activeCount: phase.snapshot.counts.totalActive,
		blockers: phase.snapshot.blockers,
		writeCustody: phase.snapshot.writeCustody,
		retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS
	};
	return {
		status: "ready",
		expiresAtMs: held.expiresAtMs,
		writeCustody: phase.snapshot.writeCustody
	};
}
function resumeGatewaySuspend(suspensionId) {
	const current = COORDINATOR_STATE.current;
	if (current?.kind === "recovering") return {
		ok: false,
		reason: "scheduler-resume-failed",
		retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS
	};
	const held = current ? normalizeExpiredHeldSuspension(current) : null;
	if (held?.kind === "recovering") return {
		ok: false,
		reason: "scheduler-resume-failed",
		retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS
	};
	if (!held) return {
		ok: true,
		status: "running",
		resumed: false
	};
	if (held.suspensionId !== suspensionId) return {
		ok: false,
		reason: "suspension-mismatch"
	};
	if (!resumeAndReopen(held)) return {
		ok: false,
		reason: "scheduler-resume-failed",
		retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS
	};
	return {
		ok: true,
		status: "running",
		resumed: true
	};
}
function resetGatewaySuspendCoordinator() {
	const current = COORDINATOR_STATE.current;
	const retired = COORDINATOR_STATE.retiredForLifecycleReset;
	COORDINATOR_STATE.current = null;
	COORDINATOR_STATE.retiredForLifecycleReset = null;
	const entries = current && current !== retired ? [current, retired] : [current ?? retired];
	for (const entry of entries) {
		if (!entry) continue;
		clearEntryTimer(entry);
		try {
			entry.resumeScheduling();
		} catch (err) {
			entry.warn?.(`gateway scheduler resume failed during lifecycle reset: ${String(err)}`);
		}
		entry.reopenAdmission();
	}
}
function resetGatewaySuspendCoordinatorForLifecycleRestart() {
	resetGatewaySuspendCoordinator();
}
//#endregion
export { prepareGatewaySuspend as a, getGatewaySuspendStatus as i, consumeGatewaySuspendHandoff as n, resetGatewaySuspendCoordinatorForLifecycleRestart as o, disarmGatewaySuspendHandoff as r, resumeGatewaySuspend as s, armGatewaySuspendHandoff as t };
