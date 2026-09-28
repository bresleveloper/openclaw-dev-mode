import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { c as getGatewaySuspendAdmissionPhase, j as waitForGatewayRestartFenceSettlement, m as onGatewaySuspendAdmissionChange, s as getGatewayRestartDrainSignal, u as isGatewayRestartDraining } from "./gateway-work-admission-CHv_0noy.mjs";
import "./ingress-retry-policy-B_OLaMKs.mjs";
import { n as createChannelIngressDrain } from "./ingress-drain-Drc4V_K5.mjs";
import { t as ChannelIngressUnavailableError } from "./ingress-unavailable-C-cec0bH.mjs";
//#region src/channels/message/ingress-monitor-tasks.ts
/** Join the monitor-owned task collection, including work added while awaiting it. */
async function waitForPending(read, reject = false) {
	for (;;) {
		const pending = [...read()];
		if (pending.length === 0) return;
		await (reject ? Promise.all(pending) : Promise.allSettled(pending));
	}
}
/** Serialize admission and claim work without deferring the first task. */
function createAdmissionClaimLock() {
	let admissionClaimLocked = false;
	const admissionClaimWaiters = [];
	return (task) => {
		const run = () => {
			admissionClaimLocked = true;
			let result;
			try {
				result = Promise.resolve(task());
			} catch (error) {
				result = Promise.reject(toErrorObject(error, "Channel ingress admission task failed"));
			}
			return result.finally(() => {
				const next = admissionClaimWaiters.shift();
				if (next) next();
				else admissionClaimLocked = false;
			});
		};
		if (!admissionClaimLocked) return run();
		return new Promise((resolve, reject) => {
			admissionClaimWaiters.push(() => {
				run().then(resolve, reject);
			});
		});
	};
}
//#endregion
//#region src/channels/message/ingress-monitor.ts
/** Shared durable channel-ingress admission, pump, retention, and shutdown lifecycle. */
const DEFAULT_APPEND_RETRY_DELAYS_MS = [
	0,
	100,
	300
];
/** Replay-guard retention defaults; changing a value requires a per-channel keyspace audit. */
const CHANNEL_INGRESS_RETENTION_DEFAULTS = Object.freeze({
	pruneIntervalMs: 36e5,
	completedTtlMs: 2592e6,
	completedMaxEntries: 2e4,
	failedTtlMs: 2592e6,
	failedMaxEntries: 2e4
});
/**
* Creates the shared monitor around a durable queue and ingress drain.
* Channel code keeps transport inspection, payload shape, and delivery policy.
*/
function createChannelIngressMonitor(options) {
	const now = options.now ?? Date.now;
	const waitForDeliveryIdleBeforeRepump = options.waitForDeliveryIdleBeforeRepump ?? false;
	const { pruneIntervalMs, ...pruneOptions } = options.retention === "standard" ? CHANNEL_INGRESS_RETENTION_DEFAULTS : {
		...CHANNEL_INGRESS_RETENTION_DEFAULTS,
		...options.retention
	};
	const shutdown = new AbortController();
	const drainAbortSignal = options.abortSignal ? AbortSignal.any([shutdown.signal, options.abortSignal]) : shutdown.signal;
	const activeDeliveries = /* @__PURE__ */ new Set();
	const activeInspections = /* @__PURE__ */ new Set();
	const deferredStartCapacityLimit = options.drain?.deferredLaneOccupancy === "release" ? options.drain.startLimit ?? 0 : 0;
	let deferredStartCapacity = 0;
	const deferredClaims = /* @__PURE__ */ new Set();
	const queueFactory = typeof options.queue === "function" ? options.queue : () => options.queue;
	let queue = typeof options.queue === "function" ? void 0 : options.queue;
	let drain;
	let running = false;
	let stopped = false;
	let requested = false;
	let pumping;
	let drainIdleWake;
	let drainIdleWakeRequested = false;
	let restartFenceWake;
	let releaseRestartFenceWake = () => {};
	let suspensionDrainPending = false;
	let unsubscribeSuspension;
	let pollTimer;
	let lastPrunedAt = 0;
	let admissionTail = Promise.resolve();
	const withAdmissionClaimLock = createAdmissionClaimLock();
	let stopTask;
	let lastReportedActive = false;
	const clearSuspensionSubscription = () => {
		suspensionDrainPending = false;
		unsubscribeSuspension?.();
		unsubscribeSuspension = void 0;
	};
	const reportError = (error) => {
		try {
			options.onError?.(error);
		} catch {}
	};
	const publishActivity = () => {
		const active = activeInspections.size + activeDeliveries.size > 0 || running && (requested || pumping !== void 0);
		if (active === lastReportedActive) return;
		lastReportedActive = active;
		try {
			options.onActivityChange?.(active);
		} catch (error) {
			reportError(error);
		}
	};
	const createStoppedError = () => options.createStoppedError?.() ?? /* @__PURE__ */ new Error("Channel ingress monitor is stopped.");
	const getQueue = () => queue ??= queueFactory();
	const ensureQueueAvailable = () => {
		try {
			getQueue();
		} catch (error) {
			throw new ChannelIngressUnavailableError(`Channel ingress queue is unavailable: ${formatErrorMessage(error)}`, { cause: error });
		}
	};
	const isAborted = () => drainAbortSignal.aborted;
	const inspect = options.inspectAsync ?? options.inspect;
	const waitForActiveDeliveries = () => waitForPending(() => activeDeliveries);
	const waitForPumpIdle = () => waitForPending(() => pumping ? [pumping] : [], true);
	const waitForDeferredClaims = () => waitForPending(() => deferredClaims);
	const getDrain = () => {
		drain ??= createChannelIngressDrain({
			...options.drain,
			queue: getQueue(),
			abortSignal: drainAbortSignal,
			now,
			retryPolicy: options.drain?.retryPolicy ?? {
				maxAttempts: 8,
				deadLetterMinAgeMs: 864e5
			},
			formatError: options.drain?.formatError ?? formatErrorMessage,
			dispatchClaimedEvent: async (claim, lifecycle) => {
				const inspection = (async () => {
					if (!running || isAborted() || lifecycle.abortSignal.aborted) {
						await lifecycle.onCancelled?.();
						return;
					}
					let decoded;
					if (options.payload.storage === "raw-event") {
						const stored = claim.payload;
						if (!stored || typeof stored.rawEvent !== "string") throw options.payload.createClaimError("invalid-version", claim);
						decoded = {
							version: stored.version,
							body: stored.rawEvent
						};
					} else decoded = options.payload.decode(claim.payload, { claim });
					if (decoded.version !== options.payload.version) throw options.payload.createClaimError("invalid-version", claim);
					const raw = options.payload.deserialize(decoded.body, { claim });
					const claimedLaneKey = claim.laneKey ?? options.drain?.deriveLaneKey?.(claim);
					const facts = await inspect(raw, {
						phase: "claim",
						claimedId: claim.id,
						claimedLaneKey
					});
					if (!running || isAborted() || lifecycle.abortSignal.aborted) {
						await lifecycle.onCancelled?.();
						return;
					}
					if (!facts || facts.eventId !== claim.id || facts.laneKey !== claimedLaneKey) throw options.payload.createClaimError("identity-mismatch", claim);
					return { raw };
				})();
				activeInspections.add(inspection);
				publishActivity();
				let prepared;
				try {
					prepared = await inspection;
				} finally {
					activeInspections.delete(inspection);
					if (!prepared) publishActivity();
				}
				if (!prepared) return { kind: "deferred" };
				const { raw } = prepared;
				let handedOff = false;
				let deferredHandoff = false;
				let releasedStartCapacity = false;
				let deliverySettled = false;
				const releaseStartCapacity = () => {
					if (releasedStartCapacity || deliverySettled || deferredStartCapacity >= deferredStartCapacityLimit) return;
					releasedStartCapacity = true;
					deferredStartCapacity += 1;
					requestDrain();
				};
				let resolveDeferredClaim = () => {};
				const deferredClaim = options.deferredClaims ? new Promise((resolve) => {
					resolveDeferredClaim = resolve;
				}) : void 0;
				let deferredClaimSettled = false;
				const settleDeferredClaim = () => {
					if (!deferredClaim || deferredClaimSettled) return;
					deferredClaimSettled = true;
					lifecycle.abortSignal.removeEventListener("abort", settleDeferredClaim);
					deferredClaims.delete(deferredClaim);
					resolveDeferredClaim();
				};
				if (options.deferredClaims === "settle-on-abort") {
					lifecycle.abortSignal.addEventListener("abort", settleDeferredClaim, { once: true });
					if (lifecycle.abortSignal.aborted) settleDeferredClaim();
				}
				const settleDeferredLifecycle = async (settle) => {
					handedOff = true;
					deferredHandoff = true;
					try {
						await settle();
						requestDrain();
					} finally {
						settleDeferredClaim();
					}
				};
				const wrappedLifecycle = {
					...lifecycle,
					admission: "exclusive",
					onAdopted: async () => {
						handedOff = true;
						try {
							await lifecycle.onAdopted();
							requestDrain();
						} finally {
							settleDeferredClaim();
						}
					},
					onDeferred: () => {
						handedOff = true;
						deferredHandoff = true;
						if (deferredClaim && !deferredClaimSettled) deferredClaims.add(deferredClaim);
						lifecycle.onDeferred();
						releaseStartCapacity();
					},
					onAdoptionFinalizing: () => {
						handedOff = true;
						deferredHandoff = true;
						if (deferredClaim && !deferredClaimSettled) deferredClaims.add(deferredClaim);
						lifecycle.onAdoptionFinalizing();
					},
					onFailed: (error) => settleDeferredLifecycle(() => lifecycle.onFailed?.(error)),
					onCancelled: () => settleDeferredLifecycle(() => lifecycle.onCancelled?.()),
					onAbandoned: () => settleDeferredLifecycle(() => lifecycle.onAbandoned())
				};
				const delivery = Promise.resolve().then(() => {
					if (!running || isAborted() || lifecycle.abortSignal.aborted) return wrappedLifecycle.onCancelled?.();
					return options.deliver(raw, wrappedLifecycle, claim);
				});
				activeDeliveries.add(delivery);
				publishActivity();
				let result;
				try {
					result = await delivery;
				} catch (error) {
					if (deferredHandoff && deferredClaim && !deferredClaimSettled) {
						await wrappedLifecycle.onFailed?.(error);
						return { kind: "deferred" };
					}
					if (isAborted() || lifecycle.abortSignal.aborted) return {
						kind: "failed-retryable",
						error
					};
					throw error;
				} finally {
					deliverySettled = true;
					activeDeliveries.delete(delivery);
					if (releasedStartCapacity) {
						releasedStartCapacity = false;
						deferredStartCapacity -= 1;
					}
					publishActivity();
				}
				if (result?.kind === "failed-retryable") {
					if (deferredHandoff && deferredClaim && !deferredClaimSettled) {
						await wrappedLifecycle.onFailed?.(result.error);
						return { kind: "deferred" };
					}
					return result;
				}
				if (result?.kind === "completed") {
					if (deferredHandoff) return { kind: "deferred" };
					return result;
				}
				if (result?.kind === "deferred") {
					if (!deferredHandoff) wrappedLifecycle.onDeferred();
					return { kind: "deferred" };
				}
				if (deferredHandoff) return { kind: "deferred" };
				if (isAborted() || lifecycle.abortSignal.aborted) return {
					kind: "failed-retryable",
					error: createStoppedError()
				};
				if (!handedOff) await wrappedLifecycle.onAdopted();
				return { kind: "completed" };
			}
		});
		return drain;
	};
	const pruneIfDue = async (owner) => {
		if (owner === "admission" !== pruneIntervalMs <= 0) return;
		const currentTime = now();
		if (owner === "pump" && currentTime - lastPrunedAt < pruneIntervalMs) return;
		await getQueue().prune({
			...pruneOptions,
			now: currentTime
		});
		lastPrunedAt = currentTime;
	};
	const scheduleDrainIdleWake = (activeDrain) => {
		if (drainIdleWake) {
			drainIdleWakeRequested = true;
			return;
		}
		drainIdleWakeRequested = false;
		const wake = activeDrain.waitForIdle();
		drainIdleWake = wake;
		wake.then(() => {
			if (drainIdleWake !== wake) return;
			const shouldRearm = drainIdleWakeRequested && running && !isAborted();
			drainIdleWake = void 0;
			drainIdleWakeRequested = false;
			if (shouldRearm) scheduleDrainIdleWake(activeDrain);
			requestDrain();
		}, (error) => {
			if (drainIdleWake === wake) {
				drainIdleWake = void 0;
				drainIdleWakeRequested = false;
			}
			reportError(error);
		});
	};
	const runPump = async () => {
		try {
			for (;;) {
				requested = false;
				await pruneIfDue("pump");
				if (!running || isAborted()) break;
				const activeDrain = getDrain();
				const { started } = await withAdmissionClaimLock(() => activeDrain.drainOnce({ shouldStop: () => !running || isAborted() || getGatewaySuspendAdmissionPhase() !== "accepting" || options.drain?.startLimit !== void 0 && activeDeliveries.size + activeInspections.size - deferredStartCapacity >= options.drain.startLimit }));
				if (waitForDeliveryIdleBeforeRepump) {
					await waitForActiveDeliveries();
					await activeDrain.waitForIdle();
				} else if (started > 0) scheduleDrainIdleWake(activeDrain);
				if (!running || isAborted() || !requested && (!waitForDeliveryIdleBeforeRepump || started === 0)) break;
			}
		} catch (error) {
			reportError(error);
		} finally {
			pumping = void 0;
			if (!running || isAborted()) requested = false;
			else if (requested) requestDrain();
			publishActivity();
		}
	};
	const scheduleRestartFenceWake = () => {
		if (restartFenceWake) return;
		const localWake = new Promise((resolve) => {
			releaseRestartFenceWake = resolve;
		});
		restartFenceWake = Promise.race([waitForGatewayRestartFenceSettlement(), localWake]).then(() => {
			restartFenceWake = void 0;
			releaseRestartFenceWake = () => {};
			requestDrain();
		});
	};
	drainAbortSignal.addEventListener("abort", () => {
		releaseRestartFenceWake();
		clearSuspensionSubscription();
	}, { once: true });
	const requestDrain = () => {
		if (!running || isAborted() || getGatewayRestartDrainSignal().aborted) {
			requested = false;
			releaseRestartFenceWake();
			publishActivity();
			return;
		}
		if (isGatewayRestartDraining()) {
			requested = true;
			scheduleRestartFenceWake();
			publishActivity();
			return;
		}
		if (getGatewaySuspendAdmissionPhase() !== "accepting") {
			suspensionDrainPending = true;
			requested = false;
			publishActivity();
			return;
		}
		suspensionDrainPending = false;
		requested = true;
		if (pumping) {
			publishActivity();
			return;
		}
		pumping = options.runPumpTask ? options.runPumpTask(runPump) : runPump();
		publishActivity();
	};
	const clearPollTimer = () => {
		clearInterval(pollTimer);
		pollTimer = void 0;
	};
	const pause = async () => {
		running = false;
		requested = false;
		releaseRestartFenceWake();
		clearPollTimer();
		publishActivity();
		await waitForPumpIdle();
	};
	const admitOnce = async (params) => {
		let lastError;
		for (const delayMs of options.appendRetryDelaysMs ?? DEFAULT_APPEND_RETRY_DELAYS_MS) {
			if (delayMs > 0) await sleep(delayMs);
			try {
				return await getQueue().enqueue(params.facts.eventId, params.payload, {
					receivedAt: params.receivedAt,
					laneKey: params.facts.laneKey
				});
			} catch (error) {
				lastError = error;
			}
		}
		if (lastError instanceof Error) throw lastError;
		throw new Error(lastError === void 0 ? "Channel ingress append failed without an error." : formatErrorMessage(lastError), { cause: lastError });
	};
	const assertAdmissionOpen = () => {
		if (stopped && options.admissionMode !== "durable-after-stop" || options.admissionMode === "while-running" && !running || options.abortSignal?.aborted && options.admissionMode !== "durable-after-stop") throw createStoppedError();
	};
	const admitRaw = async (raw, admitOptions) => {
		try {
			const facts = admitOptions.facts ?? await inspect(raw, { phase: "admission" });
			if (!facts) return { kind: "ignored" };
			admitOptions.pruneTask ??= pruneIfDue("admission");
			await admitOptions.pruneTask;
			const { receivedAt } = admitOptions;
			const body = options.payload.serialize(raw, {
				facts,
				receivedAt
			});
			const payload = options.payload.storage === "raw-event" ? {
				version: options.payload.version,
				rawEvent: body
			} : options.payload.encode({
				version: options.payload.version,
				body
			});
			const queueResult = await admitOnce({
				facts,
				payload,
				receivedAt
			});
			admitOptions.onDurablyAdmitted();
			await options.onDurableAdmission?.(raw, {
				facts,
				receivedAt,
				isNew: queueResult.kind === "accepted"
			});
			return {
				kind: "durable",
				queueResult
			};
		} catch (error) {
			await options.onAdmissionFailure?.(raw, error);
			throw error;
		}
	};
	const scheduleAdmission = (work) => {
		const admission = admissionTail.then(() => withAdmissionClaimLock(work));
		admissionTail = admission.then(() => void 0, () => void 0);
		return admission;
	};
	return {
		admit: async (raw, admitOptions) => {
			assertAdmissionOpen();
			const receivedAt = admitOptions?.receivedAt ?? now();
			let durablyAdmitted = false;
			try {
				return await scheduleAdmission(() => admitRaw(raw, {
					receivedAt,
					...admitOptions?.facts ? { facts: admitOptions.facts } : {},
					onDurablyAdmitted: () => {
						durablyAdmitted = true;
					}
				}));
			} finally {
				if (durablyAdmitted) requestDrain();
			}
		},
		admitBatch: async (rawEvents, admitOptions) => {
			assertAdmissionOpen();
			const receivedAt = admitOptions?.receivedAt ?? now();
			let durablyAdmitted = false;
			const sharedOptions = {
				receivedAt,
				onDurablyAdmitted: () => {
					durablyAdmitted = true;
				}
			};
			try {
				return await scheduleAdmission(async () => {
					const results = [];
					for (const raw of rawEvents) results.push(await admitRaw(raw, sharedOptions));
					return results;
				});
			} finally {
				if (durablyAdmitted) requestDrain();
			}
		},
		start: () => {
			if (running || stopped || isAborted()) return;
			ensureQueueAvailable();
			running = true;
			unsubscribeSuspension ??= onGatewaySuspendAdmissionChange((phase) => {
				if (!running) return;
				if (phase !== "accepting") {
					if (requested || pumping) {
						suspensionDrainPending = true;
						requested = false;
						publishActivity();
					}
					return;
				}
				if (suspensionDrainPending) requestDrain();
			});
			pollTimer = setInterval(requestDrain, options.pollIntervalMs);
			pollTimer.unref?.();
			requestDrain();
		},
		ensureQueueAvailable,
		requestDrain,
		pause,
		stop: () => {
			stopTask ??= (async () => {
				stopped = true;
				running = false;
				requested = false;
				clearSuspensionSubscription();
				releaseRestartFenceWake();
				clearPollTimer();
				publishActivity();
				await admissionTail;
				shutdown.abort(createStoppedError());
				await waitForPumpIdle();
				await waitForPending(() => activeInspections);
				if (options.waitForDeliveryIdleOnStop !== false) await waitForActiveDeliveries();
				drain?.dispose();
				if (options.waitForDeliveryIdleOnStop !== false) await drain?.waitForIdle();
				if (options.deferredClaims && options.deferredClaims !== "manual") await waitForDeferredClaims();
			})();
			return stopTask;
		},
		waitForIdle: async () => {
			for (;;) {
				await admissionTail;
				await waitForPumpIdle();
				await waitForPending(() => activeInspections);
				await waitForActiveDeliveries();
				await drain?.waitForIdle();
				await restartFenceWake;
				if (!pumping && activeInspections.size === 0 && activeDeliveries.size === 0 && !requested) return;
			}
		},
		waitForDeferredClaims,
		waitForPumpIdle,
		isRunning: () => running,
		isStopped: () => stopped
	};
}
//#endregion
export { createChannelIngressMonitor as n, CHANNEL_INGRESS_RETENTION_DEFAULTS as t };
