import { a as extractErrorCode, d as toErrorObject, i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveRuntimeWorkerUrl, r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-c5lFIb1t.mjs";
import { r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { V as trackSqliteDatabaseAdmissionWorker } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as formatSqliteErrorCodeSuffix } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { n as retainSqliteWriteAdmissionService } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { r as createSqliteDatabaseAdmissionRelay } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-DaL1xmcH.mjs";
import { i as leaseHeartbeatState, n as LEASE_HEARTBEAT_START_TIMEOUT_MS, r as leaseHeartbeatStartupPhase } from "./openclaw-state-lease-heartbeat-shared-BczGehzh.mjs";
import { MessageChannel } from "node:worker_threads";
//#region src/state/openclaw-state-lease-heartbeat-carrier.ts
const carriers = resolveGlobalSingleton(Symbol.for("openclaw.stateLeaseHeartbeatCarriers"), () => /* @__PURE__ */ new Map());
/** Independent leases share native scheduling, never their ownership or expiry. */
function acquireLeaseHeartbeatCarrier(params) {
	let carrier = carriers.get(params.key);
	const primary = carrier === void 0;
	if (!carrier) {
		const worker = params.createWorker();
		carrier = {
			worker,
			renewalProgress: params.data.renewalProgress,
			members: /* @__PURE__ */ new Set(),
			online: createDeferredCore()
		};
		const owned = carrier;
		owned.online.promise.catch(() => {});
		carriers.set(params.key, owned);
		worker.once("online", () => owned.online.resolve());
		worker.once("error", (error) => {
			owned.online.reject(error);
			for (const member of owned.members) member.failure?.(error);
		});
		worker.once("exit", (code) => {
			owned.exitCode = code;
			owned.online.reject(/* @__PURE__ */ new Error("State lease heartbeat carrier exited before startup"));
			if (carriers.get(params.key) === owned) carriers.delete(params.key);
			for (const member of owned.members) {
				member.failure?.(/* @__PURE__ */ new Error(`State lease heartbeat carrier exited (exitCode=${code})`), code);
				member.closed.resolve(code);
			}
			owned.members.clear();
		});
		worker.stdout?.resume();
		worker.stderr?.resume();
	}
	const owned = carrier;
	const ports = primary ? void 0 : new MessageChannel();
	const member = {
		channel: ports?.port1 ?? owned.worker,
		closed: createDeferredCore(),
		service: params.service,
		stopping: false
	};
	owned.members.add(member);
	const stopCarrier = () => {
		if (!owned.stopping) {
			if (carriers.get(params.key) === owned) carriers.delete(params.key);
			owned.stopping = (async () => {
				return owned.exitCode ?? owned.worker.terminate();
			})();
			owned.stopping.catch(() => {
				owned.stopping = void 0;
			});
		}
		return owned.stopping;
	};
	const closed = () => {
		if (!owned.members.delete(member)) return;
		member.channel.off("message", receive);
		if (!member.stopping) member.failure?.(/* @__PURE__ */ new Error("State lease heartbeat registration closed"), void 0, true);
		if (owned.members.size === 0) stopCarrier().then(member.closed.resolve, member.closed.reject);
		else member.closed.resolve(0);
	};
	const receive = (reply) => {
		if (ports) recordWorkerMessage("lifecycle", "from_worker");
		if (reply && "closed" in reply) closed();
		else if (reply && "startupError" in reply && member.stopping) stopCarrier().catch(member.closed.reject);
		else member.message?.(reply);
	};
	member.channel.on("message", receive);
	ports?.port1.once("close", closed);
	if (ports) {
		params.data.renewalProgress = owned.renewalProgress;
		try {
			owned.worker.postMessage({
				registration: params.data,
				port: ports.port2
			}, [params.data.databaseAdmissionPort, ports.port2]);
		} catch (error) {
			owned.members.delete(member);
			ports.port1.close();
			ports.port2.close();
			throw error;
		}
	}
	return {
		renewalProgress: owned.renewalProgress,
		online: owned.online.promise,
		closed: member.closed.promise,
		get pending() {
			return owned.members.has(member) || owned.members.size === 0 && owned.exitCode === void 0;
		},
		onMessage(receiveMessage) {
			member.message = receiveMessage;
		},
		onFailure(fail) {
			member.failure = fail;
		},
		postMessage(value, transferList) {
			member.channel.postMessage(value, transferList);
			if (ports) recordWorkerMessage("lifecycle", "to_worker");
		},
		service() {
			for (const active of owned.members) active.service();
		},
		close() {
			member.stopping = true;
			if (owned.members.size === 0 || owned.members.size === 1 && owned.members.has(member)) return stopCarrier();
			if (owned.members.has(member)) {
				member.channel.postMessage({ close: true }, []);
				if (ports) recordWorkerMessage("lifecycle", "to_worker");
			}
			return member.closed.promise;
		}
	};
}
//#endregion
//#region src/state/openclaw-state-lease-heartbeat-cleanup.ts
function createLeaseHeartbeatCleanup(params) {
	let carrier;
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
				const exitCode = await carrier?.close();
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
			return !closed && carrier === void 0 || carrier?.pending === true || startupRenewals.size !== 0;
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
		start(acquire) {
			assertOpen();
			carrier = acquire();
			return carrier;
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
	let renewalProgress = new BigInt64Array(new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT));
	const completedRequest = new BigInt64Array(new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT));
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
	const responseBudget = (leaseRemaining, maximumMs, requestId) => {
		let observedProgress = Atomics.load(renewalProgress, 0);
		let responseDeadline = performance.now() + WORKER_RESPONSE_TIMEOUT_MS;
		const requestedAt = responseDeadline - WORKER_RESPONSE_TIMEOUT_MS;
		const operationDeadline = performance.now() + maximumMs;
		const remainingMs = () => {
			const progress = Atomics.load(renewalProgress, 0);
			if (progress !== observedProgress) {
				observedProgress = progress;
				responseDeadline = performance.now() + WORKER_RESPONSE_TIMEOUT_MS;
			}
			const completed = requestId !== void 0 && Atomics.load(completedRequest, 0) >= requestId;
			return Math.min(leaseRemaining(), operationDeadline - performance.now(), completed || progress % 2n === 1n ? Infinity : responseDeadline - performance.now());
		};
		return {
			remainingMs,
			unresponsive(trigger, phase, id, returnedExpiresAt) {
				const now = performance.now();
				const details = [
					`phase=${phase}`,
					`trigger=${trigger}`,
					`requestId=${id}`,
					`elapsedMs=${Math.round(now - requestedAt)}`,
					`responseRemainingMs=${Math.round(responseDeadline - now)}`,
					`operationRemainingMs=${Math.round(operationDeadline - now)}`,
					`leaseRemainingMs=${Math.round(leaseRemaining())}`,
					`status=${Atomics.load(shared, leaseHeartbeatState.status)}`,
					`renewalProgress=${Atomics.load(renewalProgress, 0)}`,
					`completedRequestId=${Atomics.load(completedRequest, 0)}`,
					...trigger === "ack" ? [`ack=${Atomics.load(shared, leaseHeartbeatState.ack)}`] : [],
					...returnedExpiresAt === void 0 ? [] : [`returnedLeaseRemainingMs=${Math.round(returnedExpiresAt - Date.now())}`]
				];
				return /* @__PURE__ */ new Error(`state lease heartbeat is not responsive (${details.join(", ")})`);
			}
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
	const databaseAdmission = createSqliteDatabaseAdmissionRelay(() => {
		if (Atomics.load(shared, leaseHeartbeatState.status) >= leaseHeartbeatState.closed) throw new Error("State lease heartbeat database admission is closed");
	});
	const releaseAdmissionService = retainSqliteWriteAdmissionService([databasePath], () => databaseAdmission.service());
	const finishAdmission = () => {
		databaseAdmission.finish();
		releaseAdmissionService();
	};
	try {
		params.retainCleanup?.(lifecycle.cleanup);
		const url = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.stateLeaseHeartbeat);
		const execArgv = resolveRuntimeWorkerThreadExecArgv(url);
		const sourceTsconfig = execArgv.length > 0 ? process.env.TSX_TSCONFIG_PATH : void 0;
		startupContext?.admission.assertCurrent();
		const data = {
			databaseAdmissionPort: databaseAdmission.port,
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
			renewalProgress: renewalProgress.buffer,
			completedRequest: completedRequest.buffer
		};
		worker = lifecycle.start(() => acquireLeaseHeartbeatCarrier({
			key: JSON.stringify([
				databasePath,
				expectedIdentity,
				url.href,
				execArgv,
				sourceTsconfig
			]),
			data,
			service: () => databaseAdmission.service(),
			createWorker: () => runInDetachedAsyncContext(() => {
				const native = createCpuTrackedWorker(url, {
					workerData: data,
					transferList: [databaseAdmission.port],
					env: sourceTsconfig ? { TSX_TSCONFIG_PATH: sourceTsconfig } : {},
					execArgv,
					stdout: true,
					stderr: true
				});
				trackSqliteDatabaseAdmissionWorker(native);
				return native;
			})
		}));
		renewalProgress = new BigInt64Array(worker.renewalProgress);
	} catch (error) {
		finishAdmission();
		return lifecycle.failStartup(error);
	}
	worker.closed.then(finishAdmission, finishAdmission);
	worker.online.then(() => {
		onlineObserved = true;
	}, fail);
	let renewalFailure;
	const exitError = (exitCode) => {
		const lastRenewedAt = Atomics.load(shared, leaseHeartbeatState.lastRenewedAt);
		const detail = renewalFailure ? `: ${renewalFailure.name}: ${renewalFailure.message}${formatSqliteErrorCodeSuffix(renewalFailure)} (attempt=${renewalFailure.attempt}, elapsedMs=${renewalFailure.elapsedMs})` : Atomics.load(shared, leaseHeartbeatState.status) === leaseHeartbeatState.lost ? ": lease expired or ownership lost" : "";
		return new Error(`state lease heartbeat exited${detail} (exitCode=${exitCode ?? "unknown"}, acquiredAt=${params.acquiredAt}, lastRenewedAt=${lastRenewedAt || "never"})${lossDetail()}`, renewalFailure ? { cause: Object.assign(new Error(renewalFailure.message), renewalFailure) } : void 0);
	};
	worker.onFailure((error, exitCode, registrationClosed) => {
		if (renewalFailure || exitCode !== void 0 || registrationClosed) {
			fail(exitError(exitCode));
			return;
		}
		const failure = toErrorObject(error, "state lease heartbeat worker failed");
		failure.message += lossDetail();
		fail(failure);
	});
	worker.onMessage((reply) => {
		if (reply === null) {
			settleStartup("message");
			return;
		}
		if ("startupError" in reply) {
			fail(new Error(reply.startupError));
			return;
		}
		if ("closed" in reply) return;
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
		if (reply.ok && (request.budget.remainingMs() <= 0 || reply.expiresAt <= Date.now())) {
			fail(request.budget.unresponsive("reply", request.operation, reply.id, reply.expiresAt));
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
			operation,
			budget: responseBudget(remainingLeaseMs, Math.max(WORKER_RESPONSE_TIMEOUT_MS, params.leaseMs), BigInt(id))
		};
		pending.set(id, awaiting);
		const checkDeadline = () => {
			const remainingMs = awaiting.budget.remainingMs();
			if (remainingMs <= 0) fail(awaiting.budget.unresponsive("deadline", operation, id));
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
				worker.service();
				const ack = Atomics.load(shared, leaseHeartbeatState.ack);
				if (ack === requestNumber && expiresAt > Date.now() && Atomics.load(shared, leaseHeartbeatState.status) === leaseHeartbeatState.ready) return;
				const remainingMs = remainingBudget.remainingMs();
				if (remainingMs <= 0) break;
				Atomics.wait(shared, leaseHeartbeatState.ack, ack, Math.min(25, remainingMs));
			}
			const error = remainingBudget.unresponsive("ack", "ack", requestNumber);
			fail(error);
			throw error;
		}
	};
}
//#endregion
export { startOpenClawStateLeaseTimer as n, startOpenClawStateLeaseHeartbeat as t };
