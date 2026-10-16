import { i as extractErrorCode, r as collectNestedErrorCandidates, u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { i as resolveRuntimeWorkerUrl, r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { n as formatSqliteErrorCodeSuffix } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-DU6Cf6Aq.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-DoGHpXtD.mjs";
import { i as leaseHeartbeatState, n as LEASE_HEARTBEAT_START_TIMEOUT_MS, r as leaseHeartbeatStartupPhase } from "./openclaw-state-lease-heartbeat-shared-BczGehzh.mjs";
//#region src/state/openclaw-state-lease-heartbeat-cleanup.ts
function createLeaseHeartbeatCleanup(params) {
	let worker;
	let exitCode;
	const exited = createDeferredCore();
	const startupRenewals = /* @__PURE__ */ new Set();
	let closed = false;
	let stopping;
	const cancel = () => {
		closed = true;
		params.cancel();
	};
	const stop = () => {
		cancel();
		if (!stopping) {
			stopping = Promise.resolve().then(async () => {
				if (worker && exitCode === void 0) {
					await worker.terminate();
					await exited.promise;
				}
				await Promise.allSettled(startupRenewals);
				return exitCode ?? 0;
			});
			stopping.catch(() => {
				stopping = void 0;
			});
		}
		return stopping;
	};
	const cleanup = {
		get pending() {
			return !closed && worker === void 0 || worker !== void 0 && exitCode === void 0 || startupRenewals.size !== 0;
		},
		async close() {
			await stop();
		}
	};
	const assertOpen = () => {
		if (closed) throw new Error("state lease heartbeat closed before startup");
	};
	return {
		cleanup,
		stop,
		async joinStartupRenewals() {
			await Promise.allSettled(startupRenewals);
		},
		retainStartupRenewal(operation) {
			assertOpen();
			startupRenewals.add(operation);
			const settled = () => startupRenewals.delete(operation);
			operation.then(settled, settled);
		},
		start(createWorker) {
			assertOpen();
			worker = createWorker();
			worker.once("exit", (code) => {
				exitCode = code;
				exited.resolve(code);
			});
			return worker;
		},
		failStartup(error) {
			cancel();
			throw error;
		}
	};
}
//#endregion
//#region src/state/openclaw-state-lease-heartbeat.ts
const WORKER_RESPONSE_TIMEOUT_MS = 1e3;
/** Parent-scheduled renewal; the lease owner retains each actor operation and its settlement. */
function startOpenClawStateLeaseTimer(params) {
	let stopped = false;
	let expiryClosed = false;
	let renewal;
	let cancelExpiry;
	let heartbeat = setInterval(() => {
		if (stopped || renewal) return;
		const pending = (async () => {
			await params.renew();
		})();
		renewal = pending;
		pending.then(() => {
			renewal = void 0;
		}, (error) => {
			renewal = void 0;
			params.onRenewError(error);
		});
	}, params.heartbeatMs);
	heartbeat.unref?.();
	const checkExpiry = () => {
		cancelExpiry = void 0;
		if (expiryClosed) return;
		const expiresAt = Number(Atomics.load(params.observation, leaseHeartbeatState.expiresAt));
		if (expiresAt <= Date.now()) {
			stopped = true;
			expiryClosed = true;
			clearInterval(heartbeat);
			heartbeat = void 0;
			params.onLost(/* @__PURE__ */ new Error("state lease expired"));
			return;
		}
		cancelExpiry = scheduleAbsoluteDeadline(expiresAt, checkExpiry, void 0, { unref: true });
	};
	try {
		checkExpiry();
	} catch (error) {
		clearInterval(heartbeat);
		cancelExpiry?.();
		throw error;
	}
	const stopRenewal = async () => {
		stopped = true;
		clearInterval(heartbeat);
		heartbeat = void 0;
		if (renewal) await Promise.allSettled([renewal]);
	};
	return {
		isExpired: () => Number(Atomics.load(params.observation, leaseHeartbeatState.expiresAt)) <= Date.now(),
		stopRenewal,
		async close() {
			await stopRenewal();
			expiryClosed = true;
			cancelExpiry?.();
			cancelExpiry = void 0;
		}
	};
}
function startOpenClawStateLeaseHeartbeat(params) {
	const { startupContext } = params;
	startupContext?.admission.assertCurrent();
	if (startupContext && params.path !== startupContext.admission.databasePath) throw new Error("state lease heartbeat path differs from its captured admission");
	const databasePath = startupContext?.admission.databasePath ?? params.path;
	const expectedIdentity = startupContext?.admission.identity.key ?? readDatabasePathIdentitySync(databasePath).key;
	if (!expectedIdentity.startsWith("file:")) throw new Error("state lease heartbeat requires an established database identity");
	const startedAt = performance.now();
	let onlineObserved = false;
	const shared = params.expiryObservation ?? new BigInt64Array(new SharedArrayBuffer((leaseHeartbeatState.startupPhase + 1) * BigInt64Array.BYTES_PER_ELEMENT));
	const renewalProgress = new BigInt64Array(new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT));
	Atomics.store(shared, leaseHeartbeatState.expiresAt, BigInt(params.expiresAt));
	const ready = createDeferredCore();
	ready.promise.catch(() => {});
	const pending = /* @__PURE__ */ new Map();
	let nextRequestId = 0;
	let cancelExpiry;
	const rejectPending = (error) => {
		for (const reply of pending.values()) {
			clearTimeout(reply.timer);
			reply.deferred.reject(error);
		}
		pending.clear();
	};
	let startupRenewal;
	let startupHandoff = false;
	let activationSent = false;
	const clearStartupTimers = () => {
		clearTimeout(startTimer);
		clearTimeout(startupRenewal);
		startupRenewal = void 0;
	};
	const close = () => {
		Atomics.store(shared, leaseHeartbeatState.status, leaseHeartbeatState.closed);
		Atomics.notify(shared, leaseHeartbeatState.ack);
		clearStartupTimers();
		cancelExpiry?.();
		const error = /* @__PURE__ */ new Error("state lease heartbeat closed");
		ready.reject(error);
		rejectPending(error);
	};
	const lifecycle = createLeaseHeartbeatCleanup({ cancel: close });
	const assertRunning = () => {
		if (Atomics.load(shared, leaseHeartbeatState.status) !== leaseHeartbeatState.ready) throw new Error("state lease heartbeat is not running");
	};
	let lossReported = false;
	let workerLoss;
	const lossDetail = () => workerLoss ? ` (lossPath=${workerLoss.path}, lossOutcome=${workerLoss.outcome})` : "";
	const fail = (error) => {
		if (lossReported || Atomics.load(shared, leaseHeartbeatState.status) === leaseHeartbeatState.closed) return;
		lossReported = true;
		Atomics.store(shared, leaseHeartbeatState.status, leaseHeartbeatState.lost);
		Atomics.notify(shared, leaseHeartbeatState.ack);
		clearStartupTimers();
		cancelExpiry?.();
		ready.reject(error);
		rejectPending(error);
		params.onLost(error);
	};
	const remainingLeaseMs = () => Number(Atomics.load(shared, leaseHeartbeatState.expiresAt)) - Date.now();
	const responseBudget = (leaseRemaining, maximumMs) => {
		let observedProgress = Atomics.load(renewalProgress, 0);
		let responseDeadline = performance.now() + WORKER_RESPONSE_TIMEOUT_MS;
		const operationDeadline = performance.now() + maximumMs;
		return () => {
			const progress = Atomics.load(renewalProgress, 0);
			if (progress !== observedProgress) {
				observedProgress = progress;
				responseDeadline = performance.now() + WORKER_RESPONSE_TIMEOUT_MS;
			}
			return Math.min(leaseRemaining(), operationDeadline - performance.now(), progress % 2n === 1n ? Infinity : responseDeadline - performance.now());
		};
	};
	const watchExpiry = () => {
		cancelExpiry?.();
		const observedStatus = Atomics.load(shared, leaseHeartbeatState.status);
		if (observedStatus === leaseHeartbeatState.closed) return;
		if (observedStatus !== leaseHeartbeatState.ready) {
			fail(/* @__PURE__ */ new Error("state lease heartbeat is not running"));
			return;
		}
		const expiresAt = Number(Atomics.load(shared, leaseHeartbeatState.expiresAt));
		if (expiresAt <= Date.now()) {
			fail(/* @__PURE__ */ new Error("state lease heartbeat lease expired"));
			return;
		}
		cancelExpiry = scheduleAbsoluteDeadline(expiresAt, watchExpiry);
	};
	const settleStartup = (trigger) => {
		clearTimeout(startTimer);
		if (trigger === "timeout" && Atomics.load(shared, leaseHeartbeatState.status) === leaseHeartbeatState.starting) {
			const elapsedMs = performance.now() - startedAt;
			const remainingMs = Math.min(LEASE_HEARTBEAT_START_TIMEOUT_MS - elapsedMs, Number(Atomics.load(shared, leaseHeartbeatState.expiresAt)) - Date.now());
			if (remainingMs > 0) {
				startupTimeoutMs = Math.round(elapsedMs + remainingMs);
				startTimer = setTimeout(() => settleStartup("timeout"), remainingMs);
				return;
			}
		}
		clearStartupTimers();
		const observedStatus = Atomics.compareExchange(shared, leaseHeartbeatState.status, leaseHeartbeatState.starting, leaseHeartbeatState.lost);
		if (observedStatus === leaseHeartbeatState.ready) {
			if (startupContext && !activationSent) {
				fail(/* @__PURE__ */ new Error("state lease heartbeat became ready before startup handoff"));
				return;
			}
			if (startupContext) watchExpiry();
			ready.resolve();
		} else {
			const status = observedStatus === leaseHeartbeatState.starting ? "starting" : observedStatus === leaseHeartbeatState.lost ? "lost" : "closed";
			const observedPhase = Atomics.load(shared, leaseHeartbeatState.startupPhase);
			const startupPhase = Object.entries(leaseHeartbeatStartupPhase).find(([, value]) => value === observedPhase)?.[0];
			fail(/* @__PURE__ */ new Error(`state lease heartbeat did not become ready (phase=startup, trigger=${trigger}, status=${status}, elapsedMs=${Math.round(performance.now() - startedAt)}, timeoutMs=${startupTimeoutMs}, onlineObserved=${onlineObserved}, startupPhase=${startupPhase})`));
		}
	};
	let startupTimeoutMs = Math.max(1, Math.min(LEASE_HEARTBEAT_START_TIMEOUT_MS, params.expiresAt - Date.now()));
	let startTimer = setTimeout(() => settleStartup("timeout"), startupTimeoutMs);
	const renewDuringStartup = params.renewDuringStartup;
	const renewed = (expiresAt) => {
		if (startupHandoff || Atomics.load(shared, leaseHeartbeatState.status) !== leaseHeartbeatState.starting) return;
		if (!params.expiryObservation) Atomics.store(shared, leaseHeartbeatState.expiresAt, BigInt(expiresAt));
		startupRenewal = setTimeout(renewStartup, params.heartbeatMs);
	};
	const renewalFailed = (error) => {
		if ((startupHandoff || Atomics.load(shared, leaseHeartbeatState.status) !== leaseHeartbeatState.starting) && !collectNestedErrorCandidates(error).some((cause) => extractErrorCode(cause) === "outcome-unknown")) return;
		fail(error instanceof Error ? error : new Error("state lease startup renewal failed", { cause: error }));
	};
	const renewStartup = () => {
		startupRenewal = void 0;
		if (startupHandoff || Atomics.load(shared, leaseHeartbeatState.status) !== leaseHeartbeatState.starting || !renewDuringStartup) return;
		try {
			const result = renewDuringStartup();
			if (typeof result === "number") renewed(result);
			else {
				lifecycle.retainStartupRenewal(result);
				result.then(renewed, renewalFailed);
			}
		} catch (error) {
			renewalFailed(error);
		}
	};
	if (renewDuringStartup) startupRenewal = setTimeout(renewStartup, params.heartbeatMs);
	let worker;
	const activateStartup = async () => {
		if (!startupContext || startupHandoff) return;
		startupHandoff = true;
		clearTimeout(startupRenewal);
		startupRenewal = void 0;
		await lifecycle.joinStartupRenewals();
		if (Atomics.load(shared, leaseHeartbeatState.status) !== leaseHeartbeatState.starting) return;
		startupContext.admission.assertCurrent();
		activationSent = true;
		worker.postMessage({ startup: "activate" }, []);
	};
	try {
		params.retainCleanup?.(lifecycle.cleanup);
		const url = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.stateLeaseHeartbeat);
		const execArgv = resolveRuntimeWorkerThreadExecArgv(url);
		const sourceTsconfig = execArgv.length > 0 ? process.env.TSX_TSCONFIG_PATH : void 0;
		startupContext?.admission.assertCurrent();
		worker = lifecycle.start(() => runInDetachedAsyncContext(() => createCpuTrackedWorker(url, {
			workerData: {
				path: databasePath,
				expectedIdentity,
				...startupContext ? { deferActivation: true } : {},
				identity: {
					scope: params.identity.scope,
					key: params.identity.key,
					owner: params.identity.owner
				},
				leaseMs: params.leaseMs,
				acquiredAt: params.acquiredAt,
				heartbeatMs: params.heartbeatMs,
				processOwner: params.processOwner,
				shared: shared.buffer,
				renewalProgress: renewalProgress.buffer
			},
			env: sourceTsconfig ? { TSX_TSCONFIG_PATH: sourceTsconfig } : {},
			execArgv,
			stdout: true,
			stderr: true
		})));
	} catch (error) {
		return lifecycle.failStartup(error);
	}
	worker.once("online", () => {
		onlineObserved = true;
	});
	worker.stdout.resume();
	worker.stderr.resume();
	let renewalFailure;
	const exitError = (exitCode) => {
		const lastRenewedAt = Atomics.load(shared, leaseHeartbeatState.lastRenewedAt);
		const detail = renewalFailure ? `: ${renewalFailure.name}: ${renewalFailure.message}${formatSqliteErrorCodeSuffix(renewalFailure)} (attempt=${renewalFailure.attempt}, elapsedMs=${renewalFailure.elapsedMs})` : Atomics.load(shared, leaseHeartbeatState.status) === leaseHeartbeatState.lost ? ": lease expired or ownership lost" : "";
		return new Error(`state lease heartbeat exited${detail} (exitCode=${exitCode ?? "unknown"}, acquiredAt=${params.acquiredAt}, lastRenewedAt=${lastRenewedAt || "never"})${lossDetail()}`, renewalFailure ? { cause: Object.assign(new Error(renewalFailure.message), renewalFailure) } : void 0);
	};
	worker.once("error", (error) => {
		if (renewalFailure) {
			fail(exitError());
			return;
		}
		const failure = toErrorObject(error, "state lease heartbeat worker failed");
		failure.message += lossDetail();
		fail(failure);
	});
	worker.once("exit", (code) => fail(exitError(code)));
	worker.on("message", (reply) => {
		if (reply === null) {
			settleStartup("message");
			return;
		}
		if ("loss" in reply) {
			workerLoss ??= reply.loss;
			return;
		}
		if ("attempt" in reply) {
			renewalFailure ??= reply;
			return;
		}
		if ("startup" in reply) {
			activateStartup().catch((error) => fail(error instanceof Error ? error : new Error("state lease startup handoff failed", { cause: error })));
			return;
		}
		const request = pending.get(reply.id);
		if (!request) return;
		if (reply.ok && request.remainingMs() <= 0) {
			fail(/* @__PURE__ */ new Error("state lease heartbeat is not responsive"));
			return;
		}
		pending.delete(reply.id);
		clearTimeout(request.timer);
		const { deferred } = request;
		if (!reply.ok) {
			const error = new Error(reply.message);
			if (reply.payload) retainOpenClawStateWorkerErrorPayload(error, reply.payload);
			const hydrated = hydrateOpenClawStateWorkerError(error);
			hydrated.message += lossDetail();
			deferred.reject(hydrated);
			return;
		}
		try {
			assertRunning();
			deferred.resolve(reply.expiresAt);
		} catch (error) {
			deferred.reject(error);
		}
	});
	const request = async (operation) => {
		await ready.promise;
		assertRunning();
		const id = ++nextRequestId;
		const deferred = createDeferredCore();
		const awaiting = {
			deferred,
			remainingMs: responseBudget(remainingLeaseMs, Math.max(WORKER_RESPONSE_TIMEOUT_MS, params.leaseMs))
		};
		pending.set(id, awaiting);
		const checkDeadline = () => {
			const remainingMs = awaiting.remainingMs();
			if (remainingMs <= 0) fail(/* @__PURE__ */ new Error("state lease heartbeat is not responsive"));
			else awaiting.timer = setTimeout(checkDeadline, Math.min(remainingMs, WORKER_RESPONSE_TIMEOUT_MS));
		};
		checkDeadline();
		try {
			assertRunning();
			worker.postMessage({
				id,
				operation
			}, []);
		} catch (error) {
			pending.delete(id);
			clearTimeout(awaiting.timer);
			deferred.reject(error);
		}
		return deferred.promise;
	};
	return {
		ready: ready.promise,
		assertRunning,
		verify: () => request("verify"),
		renew: () => request("renew"),
		close,
		stop: lifecycle.stop,
		assertResponsive(expiresAt) {
			const remainingBudget = responseBudget(() => expiresAt - Date.now(), expiresAt - Date.now());
			const requestNumber = Atomics.add(shared, leaseHeartbeatState.request, 1n) + 1n;
			worker.postMessage(null, []);
			while (Atomics.load(shared, leaseHeartbeatState.status) === leaseHeartbeatState.ready) {
				const ack = Atomics.load(shared, leaseHeartbeatState.ack);
				const remainingMs = remainingBudget();
				if (remainingMs <= 0) break;
				if (ack === requestNumber && Atomics.load(shared, leaseHeartbeatState.status) === leaseHeartbeatState.ready) return;
				Atomics.wait(shared, leaseHeartbeatState.ack, ack, remainingMs);
			}
			const error = /* @__PURE__ */ new Error("state lease heartbeat is not responsive");
			fail(error);
			throw error;
		}
	};
}
//#endregion
export { startOpenClawStateLeaseTimer as n, startOpenClawStateLeaseHeartbeat as t };
