import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { A as tryBeginGatewaySuspendAdmission, c as getGatewaySuspendAdmissionPhase, s as getGatewayRestartDrainSignal, u as isGatewayRestartDraining } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-a7DXCHDA.mjs";
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
function scheduleResume(entry, delayMs) {
	clearEntryTimer(entry);
	const generation = entry.timerGeneration;
	entry.timer = setTimeout(() => {
		if (entry.timerGeneration === generation && COORDINATOR_STATE.current === entry) resumeAndReopen(entry);
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
		scheduleResume(entry, GATEWAY_SCHEDULER_RECOVERY_RETRY_MS);
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
	scheduleResume(recovery, GATEWAY_SCHEDULER_RECOVERY_RETRY_MS);
}
function normalizeExpiredHeldSuspension(held) {
	if (held.nowMs() < held.expiresAtMs && performance.now() < held.deadlineAtMs) return held;
	resumeAndReopen(held);
	return COORDINATOR_STATE.current;
}
function currentSuspension() {
	const current = COORDINATOR_STATE.current;
	return current?.kind === "held" ? normalizeExpiredHeldSuspension(current) : current;
}
function armSchedulerRecovery(recovery) {
	const entry = {
		kind: "recovering",
		...recovery
	};
	scheduleResume(entry, GATEWAY_SCHEDULER_RECOVERY_RETRY_MS);
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
	scheduleResume(entry, Math.ceil(remainingMs));
	return entry;
}
function renewHeldSuspension(held, nowMs) {
	held.expiresAtMs = nowMs + GATEWAY_SUSPEND_TTL_MS;
	held.deadlineAtMs = performance.now() + GATEWAY_SUSPEND_TTL_MS;
	scheduleResume(held, GATEWAY_SUSPEND_TTL_MS);
}
function refreshHeldSuspension(held) {
	const snapshot = createGatewayActiveWorkSnapshot(held.inspect, { ignoreTerminalSessions: held.terminalPolicy === "terminate" });
	if (COORDINATOR_STATE.current !== held || normalizeExpiredHeldSuspension(held) !== held) return;
	if (snapshot.idle) {
		if (held.commitAdmission?.() === false) throw new Error("gateway suspension admission changed during drain completion");
		held.commitAdmission = void 0;
	}
	return snapshot;
}
function heldPrepareResult(held, snapshot) {
	const result = {
		suspensionId: held.suspensionId,
		expiresAtMs: held.expiresAtMs,
		activeCount: snapshot.counts.totalActive,
		blockers: snapshot.blockers,
		writeCustody: snapshot.writeCustody
	};
	return snapshot.idle ? {
		status: "ready",
		...result
	} : {
		status: "draining",
		...result,
		retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS
	};
}
/** Acquire an idle lease, or optionally preserve existing work behind a drain fence. */
function prepareGatewaySuspend(params) {
	const terminalPolicy = params.terminalPolicy ?? "preserve";
	const drain = params.drain === true;
	const activeWorkOptions = { ignoreTerminalSessions: terminalPolicy === "terminate" };
	const nowMs = (params.nowMs ?? Date.now)();
	const deadlineAtMs = performance.now() + GATEWAY_SUSPEND_TTL_MS;
	const existing = currentSuspension();
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
		const snapshot = refreshHeldSuspension(existing);
		if (!snapshot) {
			if (COORDINATOR_STATE.current?.kind === "recovering") return schedulerRecoveryResult();
			throw new Error("gateway suspension changed during preparation");
		}
		return heldPrepareResult(existing, snapshot);
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
		const signal = getGatewayRestartDrainSignal();
		if (activeEntry.kind === "held" && signal.aborted) {
			activeEntry.handoff = void 0;
			activeEntry.shutdown = {
				signal,
				phase: "interrupting"
			};
		}
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
	let reopenAdmission = admission.rollback;
	const resume = () => resumeSchedulingBeforeReopen({
		owner,
		resumeScheduling: params.resumeScheduling,
		reopenAdmission,
		isInvalidated: () => suspensionInvalidated,
		warn: params.warn
	});
	try {
		params.pauseScheduling();
		schedulingPaused = true;
		const snapshot = createGatewayActiveWorkSnapshot(params.inspect, activeWorkOptions);
		if ((params.nowMs ?? Date.now)() >= nowMs + GATEWAY_SUSPEND_TTL_MS || performance.now() >= deadlineAtMs) throw new Error("gateway suspension expired during preparation");
		if (!snapshot.idle && !drain) {
			const resumed = resume();
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
		reopenAdmission = admission.release;
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
			commitAdmission: snapshot.idle ? void 0 : admission.commit,
			reopenAdmission,
			resumeScheduling: params.resumeScheduling,
			nowMs: params.nowMs ?? Date.now,
			warn: params.warn
		});
		COORDINATOR_STATE.current = held;
		return heldPrepareResult(held, snapshot);
	} catch (err) {
		if (schedulingPaused) {
			if (!resume()) return schedulerRecoveryResult();
		} else reopenAdmission();
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
	const committed = params.commit ? getRestartingSuspension() : void 0;
	if (committed?.suspensionId === params.suspensionId && committed.committedStopOwner === params.owner) return ok({
		status: "committed",
		suspensionId: committed.suspensionId,
		expiresAtMs: committed.expiresAtMs
	});
	const held = COORDINATOR_STATE.current;
	if (held?.kind !== "held" || held.suspensionId !== params.suspensionId) return err("gateway suspension id does not match");
	const refusal = handoffRefusal(held, params.owner);
	if (refusal) return err(refusal);
	if (held.handoff && held.handoff !== params.owner) return err("gateway suspension already belongs to another host iteration");
	if (params.commit) {
		if (!params.owner.commitStop) return err("gateway host does not support committed suspension stop");
		if (createGatewayActiveWorkSnapshot(held.inspect, { ignoreTerminalSessions: held.terminalPolicy === "terminate" }).writeCustody.some(({ count }) => count > 0)) return err("gateway write custody is still pending");
		const changed = handoffRefusal(held, params.owner);
		if (changed) return err(changed);
		held.handoff = params.owner;
		try {
			params.owner.commitStop();
		} catch {
			return err("gateway suspension stop commitment outcome is uncertain");
		}
		const signal = getGatewayRestartDrainSignal();
		if (COORDINATOR_STATE.retiredForLifecycleReset !== held || !signal.aborted || held.shutdown?.signal !== signal || !isGatewayRestartDraining()) return err("gateway suspension stop commitment outcome is uncertain");
		held.committedStopOwner = params.owner;
		return ok({
			status: "committed",
			suspensionId: held.suspensionId,
			expiresAtMs: held.expiresAtMs
		});
	}
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
function getRestartingSuspension() {
	const retired = COORDINATOR_STATE.retiredForLifecycleReset;
	return retired?.kind === "held" && retired.shutdown?.signal === getGatewayRestartDrainSignal() ? retired : void 0;
}
/** Control reconnects retain authentication and never admit node or worker work. */
function isGatewaySuspendControlAvailable() {
	const phase = getGatewaySuspendAdmissionPhase();
	return getRestartingSuspension()?.shutdown?.phase === "interrupting" || !isGatewayRestartDraining() && (phase === "draining" || phase === "prepared");
}
/** Records teardown without renewing the retired lease or restoring its authority. */
function markGatewaySuspendExiting() {
	const retired = getRestartingSuspension();
	if (retired?.shutdown) retired.shutdown.phase = "exiting";
}
function getGatewaySuspendStatus(suspensionId, includeLifecycle = false) {
	const retired = getRestartingSuspension();
	if (retired) {
		if (retired.suspensionId !== suspensionId) return {
			status: "conflict",
			expiresAtMs: retired.expiresAtMs
		};
		const snapshot = createGatewayActiveWorkSnapshot(retired.inspect, { ignoreTerminalSessions: retired.terminalPolicy === "terminate" });
		return {
			status: "draining",
			...includeLifecycle ? {
				ownerId: retired.requestId,
				phase: retired.shutdown.phase
			} : {},
			expiresAtMs: retired.expiresAtMs,
			activeCount: snapshot.counts.totalActive,
			blockers: snapshot.blockers,
			writeCustody: snapshot.writeCustody,
			retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS
		};
	}
	const held = currentSuspension();
	if (held?.kind === "recovering") return schedulerRecoveryResult();
	if (!held) return { status: "running" };
	if (held.suspensionId !== suspensionId) return {
		status: "conflict",
		expiresAtMs: held.expiresAtMs
	};
	const snapshot = refreshHeldSuspension(held);
	if (!snapshot) return getGatewaySuspendStatus(suspensionId, includeLifecycle);
	if (!snapshot.idle) return {
		status: "draining",
		...includeLifecycle ? {
			ownerId: held.requestId,
			phase: "draining"
		} : {},
		expiresAtMs: held.expiresAtMs,
		activeCount: snapshot.counts.totalActive,
		blockers: snapshot.blockers,
		writeCustody: snapshot.writeCustody,
		retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS
	};
	return {
		status: "ready",
		...includeLifecycle ? { ownerId: held.requestId } : {},
		expiresAtMs: held.expiresAtMs,
		writeCustody: snapshot.writeCustody
	};
}
function resumeGatewaySuspend(suspensionId) {
	const retired = getRestartingSuspension();
	if (retired) return {
		ok: false,
		reason: retired.suspensionId === suspensionId ? "gateway-restarting" : "suspension-mismatch"
	};
	const held = currentSuspension();
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
function resetGatewaySuspendCoordinatorForLifecycleRestart() {
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
//#endregion
export { isGatewaySuspendControlAvailable as a, resetGatewaySuspendCoordinatorForLifecycleRestart as c, getGatewaySuspendStatus as i, resumeGatewaySuspend as l, consumeGatewaySuspendHandoff as n, markGatewaySuspendExiting as o, disarmGatewaySuspendHandoff as r, prepareGatewaySuspend as s, armGatewaySuspendHandoff as t };
