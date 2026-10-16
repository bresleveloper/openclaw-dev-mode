import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/process/gateway-work-admission.ts
var GatewayDrainingError = class extends Error {
	constructor(message = gatewayWorkAdmissionMessage()) {
		super(message);
		this.name = "GatewayDrainingError";
	}
};
const admissionLog = createSubsystemLogger("gateway/admission");
const GATEWAY_WORK_ADMISSION_STATE = resolveGlobalSingleton(Symbol.for("openclaw.gatewayWorkAdmissionState"), () => ({
	restartDrainReason: void 0,
	restartDrainController: new AbortController(),
	restartSignalPending: false,
	restartSignalGeneration: 0,
	suspendPhase: "accepting",
	suspendGeneration: 0,
	activeRootWork: /* @__PURE__ */ new Set(),
	currentRootWork: new AsyncLocalStorage(),
	suspendOpenWaiters: /* @__PURE__ */ new Set(),
	suspendListeners: /* @__PURE__ */ new Set()
}));
function gatewayWorkAdmissionMessage() {
	if (GATEWAY_WORK_ADMISSION_STATE.restartDrainReason?.startsWith("stop (")) return "Gateway is shutting down. Please try again once it is back online.";
	if (isGatewayRestartDraining()) return "Gateway is restarting. Please try again shortly.";
	if (GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting") return "Gateway is temporarily paused. Please try again shortly.";
	return "Gateway is temporarily unavailable. Please try again shortly.";
}
const GATEWAY_ROOT_WORK_ORIGIN_MAX_CHARS = 80;
function createGatewayRootWorkAdmission(origin, detachedWork = false) {
	const admission = {
		origin: origin.trim().replaceAll(/\s+/g, " ").slice(0, GATEWAY_ROOT_WORK_ORIGIN_MAX_CHARS) || "gateway",
		references: 1,
		released: false
	};
	GATEWAY_WORK_ADMISSION_STATE.activeRootWork.add(admission);
	return {
		ownsRoot: true,
		release: createGatewayRootWorkRelease(admission),
		run: async (run) => await GATEWAY_WORK_ADMISSION_STATE.currentRootWork.run(admission, () => detachedWork ? runWithDetachedAsyncWork(admission, run) : run())
	};
}
function createGatewayRootWorkRelease(admission) {
	let leaseReleased = false;
	return () => {
		if (leaseReleased || admission.released) return;
		leaseReleased = true;
		admission.references -= 1;
		if (admission.references > 0) return;
		admission.released = true;
		GATEWAY_WORK_ADMISSION_STATE.activeRootWork.delete(admission);
	};
}
async function runWithDetachedAsyncWork(admission, run) {
	admission.references += 1;
	const releaseWork = createGatewayRootWorkRelease(admission);
	const result = createDeferredCore();
	const work = new AsyncWorkScope();
	work.run(async () => {
		try {
			result.resolve(await work.track(run));
		} catch (error) {
			result.reject(error);
		} finally {
			try {
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => work.drain());
			} finally {
				releaseWork();
			}
		}
	}).catch(result.reject);
	return await result.promise;
}
function invalidateSuspendAdmission() {
	const callback = GATEWAY_WORK_ADMISSION_STATE.suspendInvalidated;
	const wasClosed = GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting";
	GATEWAY_WORK_ADMISSION_STATE.suspendInvalidated = void 0;
	GATEWAY_WORK_ADMISSION_STATE.suspendPhase = "accepting";
	GATEWAY_WORK_ADMISSION_STATE.suspendGeneration += 1;
	resolveSuspendOpenWaiters();
	if (wasClosed && GATEWAY_WORK_ADMISSION_STATE.restartDrainReason === void 0) admissionLog.info("admission reopened: suspend phase");
	callback?.();
	if (wasClosed) notifyGatewaySuspendAdmission();
}
/** Reopens a reversible restart-signal fence; one-way restart drain retains admission. */
function rollbackGatewayRestartSignalFence() {
	if (GATEWAY_WORK_ADMISSION_STATE.restartDrainReason !== void 0 || !GATEWAY_WORK_ADMISSION_STATE.restartSignalPending) return false;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalPending = false;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalGeneration += 1;
	resolveSuspendOpenWaiters();
	if (GATEWAY_WORK_ADMISSION_STATE.suspendPhase === "accepting") admissionLog.info("admission reopened: restart-signal fence");
	else admissionLog.info("restart-signal fence cleared; suspension remains closed");
	return true;
}
function resolveSuspendOpenWaiters() {
	const waiters = Array.from(GATEWAY_WORK_ADMISSION_STATE.suspendOpenWaiters);
	GATEWAY_WORK_ADMISSION_STATE.suspendOpenWaiters.clear();
	for (const resolve of waiters) resolve();
}
/** True while restart signal/drain or host suspension rejects new process work. */
function isGatewayWorkAdmissionClosed() {
	return isGatewayRestartDraining() || GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting";
}
/** Existing admitted roots may finish spawning subordinate command/session work.
* New async chains still see the global fence, preserving refuse-only suspension. */
function isGatewaySubordinateWorkAdmissionClosed() {
	if (isGatewayRestartDraining()) return true;
	const current = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	if (current) return current.released;
	return GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting";
}
function getGatewaySuspendAdmissionPhase() {
	return GATEWAY_WORK_ADMISSION_STATE.suspendPhase;
}
function onGatewaySuspendAdmissionChange(listener) {
	return registerListener(GATEWAY_WORK_ADMISSION_STATE.suspendListeners, listener);
}
function notifyGatewaySuspendAdmission() {
	const phase = getGatewaySuspendAdmissionPhase();
	const listeners = Array.from(GATEWAY_WORK_ADMISSION_STATE.suspendListeners);
	notifyListeners(listeners, phase, (error) => {
		admissionLog.warn(`suspension observer failed: ${String(error)}`);
	});
}
function isGatewayRestartDraining() {
	return GATEWAY_WORK_ADMISSION_STATE.restartDrainReason !== void 0 || GATEWAY_WORK_ADMISSION_STATE.restartSignalPending;
}
/** Resolves when one-way drain commits or the reversible signal fence clears. */
async function waitForGatewayRestartFenceSettlement() {
	if (!GATEWAY_WORK_ADMISSION_STATE.restartSignalPending) return;
	await new Promise((resolve) => {
		GATEWAY_WORK_ADMISSION_STATE.suspendOpenWaiters.add(resolve);
	});
	await waitForGatewayRestartFenceSettlement();
}
function getGatewayRestartDrainSignal() {
	return GATEWAY_WORK_ADMISSION_STATE.restartDrainController.signal;
}
function isGatewayRestartDrainError(error) {
	return error instanceof GatewayDrainingError && isGatewayRestartDraining();
}
/** Restart drain is one-way until the in-process restart resets runtime state. */
function markGatewayRestartDraining(reason = "restart") {
	if (GATEWAY_WORK_ADMISSION_STATE.restartDrainReason !== void 0) {
		if (reason.startsWith("stop (")) GATEWAY_WORK_ADMISSION_STATE.restartDrainReason = reason;
		return;
	}
	GATEWAY_WORK_ADMISSION_STATE.restartSignalPending = false;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalGeneration += 1;
	GATEWAY_WORK_ADMISSION_STATE.restartDrainReason = reason;
	GATEWAY_WORK_ADMISSION_STATE.restartDrainController.abort(new GatewayDrainingError());
	resolveSuspendOpenWaiters();
	admissionLog.info(`admission closed: ${reason}`);
	if (GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting") invalidateSuspendAdmission();
}
/**
* Blocks suspension across signal emission until the run loop starts restart drain.
* Returns null when another owner already holds the fence or one-way drain is active.
* Callers must not invent a stand-in lease: a dead rollback handle is how the fence
* can stay closed after the real owner is lost.
*/
function beginGatewayRestartSignalAdmission() {
	if (isGatewayRestartDraining()) return null;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalPending = true;
	const generation = ++GATEWAY_WORK_ADMISSION_STATE.restartSignalGeneration;
	admissionLog.info("admission closed: restart-signal fence");
	return { rollback: () => {
		if (!GATEWAY_WORK_ADMISSION_STATE.restartSignalPending || GATEWAY_WORK_ADMISSION_STATE.restartSignalGeneration !== generation) return false;
		return rollbackGatewayRestartSignalFence();
	} };
}
/** Root RPC/timer admission. Nested work in the same async chain counts once. */
function tryBeginGatewayRootWorkAdmission(origin = "gateway") {
	const current = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	if (current && !current.released) return {
		ownsRoot: false,
		release: () => {},
		run: async (run) => await run()
	};
	return tryBeginGatewayIndependentRootWorkAdmission(origin);
}
/**
* Tracks a host-selected restart-startup recovery handshake without reopening admission.
* The caller still owns frame/auth validation; this lease grants no method authority.
*/
function tryBeginGatewayRestartStartupRootWorkAdmission() {
	if (!isGatewayRestartDraining() || GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting") return null;
	return createGatewayRootWorkAdmission("restart-startup");
}
/**
* Admits only the exact predecessor-bound restart selected by the RPC router.
* The held root preserves signal-to-drain ordering without reopening suspension.
*/
function tryBeginGatewayPreparedRestartRootWorkAdmission() {
	if (isGatewayRestartDraining() || GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "prepared" || GATEWAY_WORK_ADMISSION_STATE.activeRootWork.size > 0) return null;
	return createGatewayRootWorkAdmission("restart-prepared");
}
/** Independent roots count separately even when launched by an admitted parent. */
function tryBeginGatewayIndependentRootWorkAdmission(origin = "independent") {
	if (isGatewayWorkAdmissionClosed()) return null;
	return createGatewayRootWorkAdmission(origin);
}
async function waitForGatewayWorkAdmissionChange(signal) {
	const wake = createDeferredCore();
	GATEWAY_WORK_ADMISSION_STATE.suspendOpenWaiters.add(wake.resolve);
	try {
		await racePromiseWithAbortSignal(wake.promise, signal);
	} finally {
		GATEWAY_WORK_ADMISSION_STATE.suspendOpenWaiters.delete(wake.resolve);
	}
}
/** Waits through a prepared lease, then joins the root-work set atomically. */
async function beginGatewayRootWorkAdmissionWhenOpen(origin = "gateway", signal) {
	while (true) {
		signal?.throwIfAborted();
		if (GATEWAY_WORK_ADMISSION_STATE.restartDrainReason !== void 0) throw new GatewayDrainingError();
		const admission = tryBeginGatewayRootWorkAdmission(origin);
		if (admission) return admission;
		await waitForGatewayWorkAdmissionChange(signal);
	}
}
/** Keeps the caller's async-resource owner, including server shutdown cancellation. */
function runWithGatewayIndependentRootWorkAdmission(run, origin, signal) {
	return runWithGatewayNewRootWorkAdmission(run, origin, signal, false);
}
/** Delayed producers outlive their triggering request and own their async cleanup. */
function runWithGatewayDetachedWorkAdmission(run, origin, signal) {
	return runWithGatewayNewRootWorkAdmission(run, origin, signal, true);
}
async function runWithGatewayNewRootWorkAdmission(run, origin, signal, detachedWork) {
	while (true) {
		signal?.throwIfAborted();
		if (GATEWAY_WORK_ADMISSION_STATE.restartDrainReason !== void 0) throw new GatewayDrainingError();
		const admission = isGatewayWorkAdmissionClosed() ? null : createGatewayRootWorkAdmission(origin ?? "independent", detachedWork);
		if (admission) try {
			return await admission.run(run);
		} finally {
			admission.release();
		}
		await waitForGatewayWorkAdmissionChange(signal);
	}
}
/** Re-admits preserved work whose inherited root was retired before it could run. */
const runWithGatewayRootWorkReadmission = (run) => GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore()?.retiredByReset ? runWithGatewayIndependentRootWorkAdmission(run, "runtime:readmission") : run();
/**
* Detaches required follow-up from the current admitted transaction.
* A live parent synchronously reserves a tracked root even after restart or
* suspension closes admission. The detached root keeps its caller origin
* because it can outlive the parent; otherwise the normal fence applies.
*/
function runWithGatewayIndependentRootWorkContinuation(run, origin = "independent") {
	return runWithGatewayRootWorkContinuation(run, origin, false);
}
/**
* Detached continuations own their async lifetime: like the independent
* continuation, a live parent synchronously reserves a tracked root even
* across closed admission fences, but the callback runs inside a fresh
* detached async work scope so deferred work survives the caller's scope
* closing instead of inheriting it.
*/
function runWithGatewayDetachedWorkContinuation(run, origin = "independent") {
	return runWithGatewayRootWorkContinuation(run, origin, true);
}
function runWithGatewayRootWorkContinuation(run, origin, detachedWork) {
	const parent = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	if (!parent || parent.released) return detachedWork ? runWithGatewayDetachedWorkAdmission(run, origin) : runWithGatewayIndependentRootWorkAdmission(run, origin, getAsyncWorkSignal());
	const admission = createGatewayRootWorkAdmission(origin, detachedWork);
	return admission.run(run).finally(admission.release);
}
function createGatewayRootWorkAdmissionContinuationScope(retainRoot) {
	const current = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	if (!current || current.released || !GATEWAY_WORK_ADMISSION_STATE.activeRootWork.has(current)) return null;
	if (retainRoot) current.references += 1;
	const releaseAdmission = retainRoot ? createGatewayRootWorkRelease(current) : void 0;
	let released = false;
	const enter = () => {
		if (released || current.released || !GATEWAY_WORK_ADMISSION_STATE.activeRootWork.has(current)) throw new GatewayDrainingError("gateway root work continuation is no longer active");
		current.references += 1;
		return createGatewayRootWorkRelease(current);
	};
	return {
		release: () => {
			if (released) return;
			released = true;
			releaseAdmission?.();
		},
		run: async (run) => {
			const releaseRun = enter();
			try {
				return await GATEWAY_WORK_ADMISSION_STATE.currentRootWork.run(current, run);
			} finally {
				releaseRun();
			}
		},
		runSync: (run) => {
			const releaseRun = enter();
			try {
				return GATEWAY_WORK_ADMISSION_STATE.currentRootWork.run(current, run);
			} finally {
				releaseRun();
			}
		}
	};
}
/** Borrows exact root ownership without extending the creating request's lifetime. */
function captureGatewayRootWorkAdmissionContinuationScope() {
	return createGatewayRootWorkAdmissionContinuationScope(false);
}
/** Retains exact root ownership for work that intentionally outlives its handler. */
function retainGatewayRootWorkAdmissionContinuationScope() {
	return createGatewayRootWorkAdmissionContinuationScope(true);
}
/** Transfers an admitted request root to work that intentionally outlives its handler. */
function retainGatewayRootWorkAdmissionContinuation() {
	return retainGatewayRootWorkAdmissionContinuationScope()?.release ?? null;
}
/** Retains an existing root for started effects without admitting or parking unrooted work. */
async function runWithRetainedGatewayRootWork(run) {
	const release = retainGatewayRootWorkAdmissionContinuation();
	try {
		return await run();
	} finally {
		release?.();
	}
}
/** Starts process-lifetime work without inheriting the request root that created it. */
function runOutsideGatewayRootWorkAdmission(run) {
	return GATEWAY_WORK_ADMISSION_STATE.currentRootWork.exit(run);
}
/** Active root requests/ticks, optionally excluding the caller running prepare. */
function getActiveGatewayRootWorkCount(opts) {
	let count = GATEWAY_WORK_ADMISSION_STATE.activeRootWork.size;
	const current = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	if (opts?.excludeCurrent === true && current && !current.released && GATEWAY_WORK_ADMISSION_STATE.activeRootWork.has(current)) count -= 1;
	return Math.max(0, count);
}
/** Bounded, deterministic root-owner inventory for shutdown diagnostics. */
function getActiveGatewayRootWorkHolders(opts) {
	const current = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	const counts = /* @__PURE__ */ new Map();
	for (const admission of GATEWAY_WORK_ADMISSION_STATE.activeRootWork) {
		if (opts?.excludeCurrent === true && admission === current) continue;
		counts.set(admission.origin, (counts.get(admission.origin) ?? 0) + 1);
	}
	return [...counts].toSorted(([left], [right]) => left.localeCompare(right)).map(([origin, count]) => count > 1 ? `${origin} (${count})` : origin);
}
/** Atomically closes new suspension admission before synchronous inspection. */
function tryBeginGatewaySuspendAdmission(onInvalidated) {
	if (isGatewayWorkAdmissionClosed()) return null;
	GATEWAY_WORK_ADMISSION_STATE.suspendPhase = "preparing";
	const generation = ++GATEWAY_WORK_ADMISSION_STATE.suspendGeneration;
	GATEWAY_WORK_ADMISSION_STATE.suspendInvalidated = onInvalidated;
	admissionLog.info("admission closed: suspend phase");
	notifyGatewaySuspendAdmission();
	const transition = (expected, next) => {
		if (GATEWAY_WORK_ADMISSION_STATE.suspendGeneration !== generation || GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== expected) return false;
		GATEWAY_WORK_ADMISSION_STATE.suspendPhase = next;
		if (next === "accepting") {
			GATEWAY_WORK_ADMISSION_STATE.suspendInvalidated = void 0;
			resolveSuspendOpenWaiters();
			admissionLog.info("admission reopened: suspend phase");
		}
		notifyGatewaySuspendAdmission();
		return true;
	};
	return {
		drain: () => transition("preparing", "draining"),
		commit: () => transition("preparing", "prepared") || transition("draining", "prepared"),
		rollback: () => transition("preparing", "accepting"),
		release: () => transition("draining", "accepting") || transition("prepared", "accepting")
	};
}
/** Clears restart/suspend admission during SIGUSR2 and isolated tests. */
function resetGatewayWorkAdmission() {
	GATEWAY_WORK_ADMISSION_STATE.restartDrainController.abort(new GatewayDrainingError("gateway runtime reset"));
	for (const admission of GATEWAY_WORK_ADMISSION_STATE.activeRootWork) {
		admission.references = 0;
		admission.retiredByReset = true;
		admission.released = true;
	}
	GATEWAY_WORK_ADMISSION_STATE.activeRootWork.clear();
	GATEWAY_WORK_ADMISSION_STATE.restartDrainReason = void 0;
	GATEWAY_WORK_ADMISSION_STATE.restartDrainController = new AbortController();
	GATEWAY_WORK_ADMISSION_STATE.restartSignalPending = false;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalGeneration += 1;
	if (GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting") invalidateSuspendAdmission();
	else {
		GATEWAY_WORK_ADMISSION_STATE.suspendGeneration += 1;
		GATEWAY_WORK_ADMISSION_STATE.suspendInvalidated = void 0;
	}
	resolveSuspendOpenWaiters();
}
//#endregion
export { tryBeginGatewaySuspendAdmission as A, runWithGatewayIndependentRootWorkContinuation as C, tryBeginGatewayPreparedRestartRootWorkAdmission as D, tryBeginGatewayIndependentRootWorkAdmission as E, tryBeginGatewayRestartStartupRootWorkAdmission as O, runWithGatewayIndependentRootWorkAdmission as S, runWithRetainedGatewayRootWork as T, retainGatewayRootWorkAdmissionContinuationScope as _, getActiveGatewayRootWorkCount as a, runWithGatewayDetachedWorkAdmission as b, getGatewaySuspendAdmissionPhase as c, isGatewaySubordinateWorkAdmissionClosed as d, isGatewayWorkAdmissionClosed as f, retainGatewayRootWorkAdmissionContinuation as g, resetGatewayWorkAdmission as h, captureGatewayRootWorkAdmissionContinuationScope as i, waitForGatewayRestartFenceSettlement as j, tryBeginGatewayRootWorkAdmission as k, isGatewayRestartDrainError as l, onGatewaySuspendAdmissionChange as m, beginGatewayRestartSignalAdmission as n, getActiveGatewayRootWorkHolders as o, markGatewayRestartDraining as p, beginGatewayRootWorkAdmissionWhenOpen as r, getGatewayRestartDrainSignal as s, GatewayDrainingError as t, isGatewayRestartDraining as u, rollbackGatewayRestartSignalFence as v, runWithGatewayRootWorkReadmission as w, runWithGatewayDetachedWorkContinuation as x, runOutsideGatewayRootWorkAdmission as y };
