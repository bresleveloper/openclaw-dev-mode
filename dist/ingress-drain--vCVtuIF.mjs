import { i as extractErrorCode, r as collectNestedErrorCandidates, u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as runOutsideAsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { i as getProcessStartTime } from "./pid-alive-CPS_shDt.mjs";
import { d as sleepWithAbort, n as computeBackoff } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import "./backoff-BrzXG7iD.mjs";
import { l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { g as retainGatewayRootWorkAdmissionContinuation, t as GatewayDrainingError, y as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-rc4ZgKq_.mjs";
import "./work-start-error-Dh9d0ImY.mjs";
import childProcess from "node:child_process";
import { randomUUID } from "node:crypto";
function readProcessStartTime(pid) {
	if (!Number.isSafeInteger(pid) || pid <= 0) return null;
	if (process.platform === "darwin") try {
		const startedAt = childProcess.execFileSync("/bin/ps", [
			"-o",
			"lstart=",
			"-p",
			String(pid)
		], {
			encoding: "utf8",
			env: {
				...process.env,
				LC_ALL: "C",
				TZ: "UTC"
			},
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			],
			timeout: 2e3,
			killSignal: "SIGKILL"
		}).trim();
		const startedAtMs = Date.parse(`${startedAt} UTC`);
		return Number.isFinite(startedAtMs) ? Math.floor(startedAtMs / 1e3) : null;
	} catch {
		return null;
	}
	return getProcessStartTime(pid);
}
const INGRESS_CLAIM_PROCESS_START_TIME = readProcessStartTime(process.pid);
const INGRESS_CLAIM_PROCESS_ID = createIngressDrainOwnerId();
/** Process-local live drain instance UUIDs (ownerId third field). */
const liveIngressDrainInstanceIds = /* @__PURE__ */ new Set();
function processPidFromOwnerId(ownerId) {
	const pid = Number.parseInt(ownerId.split(":", 1)[0] ?? "", 10);
	return Number.isSafeInteger(pid) && pid > 0 ? pid : -1;
}
/** Instance UUID from ownerId `pid:startToken:uuid`. */
function processInstanceIdFromOwnerId(ownerId) {
	return ownerId.split(":")[2] || null;
}
/** Mint a unique per-drain ownerId (`pid:startToken:uuid`). Caller registers via drain. */
function createIngressDrainOwnerId() {
	return [
		process.pid,
		INGRESS_CLAIM_PROCESS_START_TIME ?? "x",
		randomUUID()
	].join(":");
}
function registerLiveIngressDrainInstance(ownerId) {
	const instanceId = processInstanceIdFromOwnerId(ownerId);
	if (instanceId) liveIngressDrainInstanceIds.add(instanceId);
}
function deregisterLiveIngressDrainInstance(ownerId) {
	const instanceId = processInstanceIdFromOwnerId(ownerId);
	if (instanceId) liveIngressDrainInstanceIds.delete(instanceId);
}
/**
* True when a same-process drain instance still holds this ownerId.
* Recovery must not steal claims from a live peer drain on the same queue.
*/
function isLiveLocalIngressDrainOwner(ownerId) {
	const instanceId = processInstanceIdFromOwnerId(ownerId);
	return instanceId != null && liveIngressDrainInstanceIds.has(instanceId);
}
function parseOwnerStartToken(ownerId) {
	const parts = ownerId.split(":");
	if (parts.length === 2) return "existence-only";
	if (parts.length < 2) return;
	const startField = parts[1] ?? "";
	if (startField === "x") return "existence-only";
	const starttime = Number(startField);
	return Number.isSafeInteger(starttime) && starttime >= 0 ? starttime : void 0;
}
function processExists(pid) {
	if (!Number.isSafeInteger(pid) || pid <= 0) return false;
	try {
		process.kill(pid, 0);
		return true;
	} catch (err) {
		const code = err.code;
		return code !== "ESRCH" && code !== "EINVAL";
	}
}
function isFreshClaimOwner(claimedAt, options) {
	const now = options?.now ?? Date.now();
	const maxAgeMs = options?.maxAgeMs ?? 18e5;
	return now - claimedAt < maxAgeMs;
}
function isClaimOwnerProcessInstanceLive(ownerId, pid, options) {
	const exists = options?.processExists ?? processExists;
	const readStart = options?.readProcessStartTime ?? readProcessStartTime;
	if (!exists(pid)) return false;
	const startToken = parseOwnerStartToken(ownerId);
	if (startToken === void 0) return false;
	if (startToken === "existence-only") return true;
	const actualStart = readStart(pid);
	return actualStart === null || actualStart === startToken;
}
/** True when another live process still holds a fresh claim on this event. */
function isIngressClaimOwnedByOtherLiveProcess({ claim }, options) {
	const pid = processPidFromOwnerId(claim.ownerId);
	return claim.ownerId !== INGRESS_CLAIM_PROCESS_ID && pid !== process.pid && isFreshClaimOwner(claim.claimedAt, options) && isClaimOwnerProcessInstanceLive(claim.ownerId, pid, options);
}
/** True when a corrupt claimed row is still live-owned by this or another process. */
function isIngressCorruptClaimOwnedByOtherLiveProcess({ claim }, options) {
	if (claim.ownerId === INGRESS_CLAIM_PROCESS_ID) return isFreshClaimOwner(claim.claimedAt, options);
	const pid = processPidFromOwnerId(claim.ownerId);
	return pid !== process.pid && isFreshClaimOwner(claim.claimedAt, options) && isClaimOwnerProcessInstanceLive(claim.ownerId, pid, options);
}
//#endregion
//#region src/channels/message/ingress-drain-state.ts
var IngressAdoptionLostError = class extends Error {
	constructor(code) {
		super(`ingress adoption lost: ${code}`);
		this.name = "IngressAdoptionLostError";
		this.code = code;
	}
};
function isIngressAdoptionLostError(error) {
	return error instanceof IngressAdoptionLostError;
}
function isPreAdoptionState(state) {
	return (state.phase === "dispatching" || state.phase === "deferred") && !state.guillotined && !state.superseded;
}
function createIngressSettleOwner(state, removeActive) {
	let settlePromise;
	let settled = false;
	return async (fn) => {
		if (settled) return;
		if (settlePromise) {
			await settlePromise;
			return;
		}
		const settlement = createDeferredCore();
		settlePromise = settlement.promise;
		state.settlement = settlePromise;
		(async () => {
			try {
				await fn();
				state.settlementFailure = void 0;
				settled = true;
				state.phase = "settled";
				removeActive(state);
			} catch (error) {
				state.settlementFailure = isIngressAdoptionLostError(error) ? void 0 : { error };
				throw error;
			} finally {
				state.settlement = void 0;
			}
		})().then(settlement.resolve, settlement.reject);
		try {
			await settlePromise;
		} catch (err) {
			if (!hasSqliteWorkerOutcomeUnknown(err)) settlePromise = void 0;
			throw err;
		}
	};
}
function activeClaimKey(claim) {
	return `${claim.id}\0${claim.claim.token}`;
}
function resolveLaneKey(record, deriveLaneKey, reconcileStoredLaneKey) {
	const derivedLaneKey = deriveLaneKey?.(record);
	const storedLaneKey = record.laneKey;
	if (!reconcileStoredLaneKey || storedLaneKey === void 0 || derivedLaneKey === void 0 || storedLaneKey === derivedLaneKey) return derivedLaneKey ?? storedLaneKey ?? record.id;
	return reconcileStoredLaneKey(record, storedLaneKey, derivedLaneKey) ? derivedLaneKey : storedLaneKey;
}
function sortedKeys(keys) {
	return [...keys].toSorted((a, b) => a.localeCompare(b));
}
//#endregion
//#region src/channels/message/ingress-retry-policy.ts
/**
* Generic ingress retry backoff and dead-letter decisions.
*
* Channel-specific non-retryable classification stays out of core; pass it in.
*/
const DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS = 8;
const DEFAULT_INGRESS_RETRY_DEAD_LETTER_MIN_AGE_MS = 864e5;
const DEFAULT_INGRESS_RETRY_BASE_MS = 1e3;
const DEFAULT_INGRESS_RETRY_MAX_MS = 18e4;
/** Remaining backoff delay before a released event may be claimed again. */
function resolveIngressRetryDelayMs(event, config, now = Date.now()) {
	const baseMs = config?.baseMs ?? 1e3;
	const maxMs = config?.maxMs ?? 18e4;
	const attempts = event.attempts ?? 0;
	if (!event.lastError || event.lastAttemptAt === void 0 || attempts <= 0) return 0;
	const delayMs = computeBackoff({
		initialMs: baseMs,
		maxMs,
		factor: 2,
		jitter: 0
	}, Math.min(attempts, 9));
	return Math.max(0, event.lastAttemptAt + delayMs - now);
}
/**
* Dead-letter requires BOTH attempt floor and minimum age.
* Over-limit events keep retrying at the capped delay until age is met.
*/
function shouldDeadLetterRetryableIngressEvent(event, attempt, config, now = Date.now()) {
	const maxAttempts = config?.maxAttempts ?? 8;
	const deadLetterMinAgeMs = config?.deadLetterMinAgeMs ?? 864e5;
	return attempt >= maxAttempts && now - event.receivedAt >= deadLetterMinAgeMs;
}
/** Resolve release vs fail for a dispatch error using optional non-retryable hook. */
function resolveIngressFailureDisposition(params) {
	const now = params.now ?? Date.now();
	const maxAttempts = params.config?.maxAttempts ?? 8;
	const attempt = (params.event.attempts ?? 0) + 1;
	const message = params.formatError(params.err);
	const nonRetryable = params.resolveNonRetryableFailure?.(params.err) ?? null;
	if (nonRetryable) return {
		kind: "fail",
		reason: nonRetryable.reason,
		message: nonRetryable.message,
		attempt
	};
	const errorCodes = new Set(collectNestedErrorCandidates(params.err).map(extractErrorCode));
	const reason = errorCodes.has("SESSION_RESTART_RECOVERY_TOMBSTONE") ? "restart-recovery-tombstone" : attempt >= maxAttempts && errorCodes.has("SESSION_WORK_START_CHANGED") ? "session-start-conflict-retry-limit" : shouldDeadLetterRetryableIngressEvent(params.event, attempt, params.config, now) ? "retry-limit-exceeded" : void 0;
	return reason ? {
		kind: "fail",
		reason,
		message,
		attempt
	} : {
		kind: "release",
		attempt,
		message
	};
}
//#endregion
//#region src/channels/message/ingress-claim-writes.ts
/** Bounded claim-token-fenced writes for durable ingress settlement. */
/** Bounded tombstone write retries — wedged ownership beats silent double-dispatch. */
const INGRESS_TOMBSTONE_RETRY_MAX_ATTEMPTS = 8;
/**
* Claim-token fenced writes can throw OR return false when the lease was
* reclaimed. For complete, false is ownership loss (do not settle success).
* For release/fail, false means the row is already gone from this owner —
* treat as done so abandon races do not wedge.
*/
function createIngressWriter(options, { queue, now, formatError, log, isStopped }) {
	const commitClaimWriteWithRetry = async (params) => {
		let attempt = 0;
		for (;;) {
			if (attempt > 0 && isStopped()) throw new Error("ingress drain stopped during claim write");
			try {
				const committed = await params.write();
				if (!committed && params.falseMeansReclaimed) throw new IngressAdoptionLostError("reclaimed");
				return committed;
			} catch (err) {
				if (isIngressAdoptionLostError(err) || hasSqliteWorkerOutcomeUnknown(err)) throw err;
				attempt += 1;
				if (isStopped() || attempt >= INGRESS_TOMBSTONE_RETRY_MAX_ATTEMPTS) {
					if (attempt >= INGRESS_TOMBSTONE_RETRY_MAX_ATTEMPTS && !isStopped()) log(`ingress drain: ${params.label} write failed for event ${params.claim.id} after ${attempt} attempt(s); holding claim: ${formatError(err)}`);
					throw err;
				}
				const delayMs = Math.min(DEFAULT_INGRESS_RETRY_MAX_MS, DEFAULT_INGRESS_RETRY_BASE_MS * 2 ** (attempt - 1));
				const displayId = params.claim.id.replace(/^0+(?=\d)/, "") || params.claim.id;
				log(`ingress drain: ${params.label} retry ${attempt}/${INGRESS_TOMBSTONE_RETRY_MAX_ATTEMPTS} for event ${params.claim.id} in ${delayMs}ms: ${formatError(err)}`);
				if (params.label === "tombstone") log(`completion retry ${attempt} scheduled for event ${displayId}`);
				await sleepWithAbort(delayMs, options.abortSignal, { ref: false });
			}
		}
	};
	const completeClaimWithRetry = async (claim) => {
		await commitClaimWriteWithRetry({
			claim,
			label: "tombstone",
			write: () => queue.complete(claim),
			falseMeansReclaimed: true
		});
	};
	const releaseClaim = async (claim, releaseOptions) => {
		return await commitClaimWriteWithRetry({
			claim,
			label: "release",
			write: () => queue.release(claim, {
				...releaseOptions,
				releasedAt: now()
			}),
			falseMeansReclaimed: false
		});
	};
	const failClaim = async (claim, reason, message) => {
		return await commitClaimWriteWithRetry({
			claim,
			label: "dead-letter",
			write: () => queue.fail(claim, {
				reason,
				message,
				failedAt: now()
			}),
			falseMeansReclaimed: false
		});
	};
	return {
		completeClaimWithRetry,
		releaseClaim,
		failClaim
	};
}
//#endregion
//#region src/channels/message/ingress-drain-supersede.ts
/** Supersede every accepted pre-adoption claim on one lane, including released deferrals. */
async function supersedeActiveStatesIfNeeded(params) {
	const states = new Set([...params.activeByClaim.values()].filter((state) => state.laneKey === params.laneKey && isPreAdoptionState(state)));
	const laneOwner = params.laneOwnerByKey.get(params.laneKey);
	if (laneOwner && isPreAdoptionState(laneOwner)) states.add(laneOwner);
	let supersededAny = false;
	for (const pending of states) {
		const decision = await params.shouldSupersedePending?.(params.candidate, pending.claim);
		if (!(typeof decision === "function" ? decision() : decision)) continue;
		if (params.activeByClaim.get(activeClaimKey(pending.claim)) !== pending || !isPreAdoptionState(pending) || pending.occupiesLane && params.laneOwnerByKey.get(params.laneKey) !== pending) continue;
		pending.superseded = true;
		params.clearStallTimer(pending);
		pending.abortController.abort(/* @__PURE__ */ new Error("ingress-superseded"));
		try {
			await pending.settleOnce(() => params.completeClaim(pending.claim));
		} catch (error) {
			params.log(`ingress drain: failed to tombstone superseded event ${pending.eventId}: ${params.formatError(error)}`);
		}
		supersededAny = true;
	}
	return supersededAny && !params.laneOwnerByKey.has(params.laneKey);
}
//#endregion
//#region src/channels/message/ingress-drain.ts
/**
* Core-owned durable channel-ingress drain.
*
* Owns claim recovery, per-lane serialization, adoption-time complete, retry /
* dead-letter disposition, pre-adoption stall watchdog, and optional supersede.
*/
/** Default claim→adoption stall before applying the shared retry disposition. */
const DEFAULT_INGRESS_ADOPTION_STALL_MS = 3e5;
/** Creates a channel-agnostic durable ingress drain over an existing queue. */
function createChannelIngressDrain(options, retainOwnerUntilDispose = false) {
	const queue = options.queue;
	const ownerId = options.ownerId ?? createIngressDrainOwnerId();
	registerLiveIngressDrainInstance(ownerId);
	const adoptionStallTimeoutMs = options.adoptionStallTimeoutMs ?? 3e5;
	const claimLeaseMs = options.claimLeaseMs ?? 18e5;
	const now = options.now ?? Date.now;
	const formatError = options.formatError ?? formatErrorMessage;
	const orderBy = options.orderBy ?? "received";
	const scanLimit = Math.max(1, Math.floor(options.scanLimit ?? 100));
	const startLimit = options.startLimit ?? 32;
	const deferredLaneOccupancy = options.deferredLaneOccupancy ?? "hold";
	const activeByClaim = /* @__PURE__ */ new Map();
	const laneOwnerByKey = /* @__PURE__ */ new Map();
	let disposed = false;
	const log = (message) => {
		options.onLog?.(message);
	};
	const clearStallTimer = (state) => {
		if (state.stallTimer) {
			clearTimeout(state.stallTimer);
			state.stallTimer = void 0;
		}
	};
	const clearClaimRefresh = (state) => {
		if (state.claimRefreshTimer) {
			clearInterval(state.claimRefreshTimer);
			state.claimRefreshTimer = void 0;
		}
	};
	const abortActiveClaims = () => {
		if (!retainOwnerUntilDispose || disposed) deregisterLiveIngressDrainInstance(ownerId);
		const reason = disposed ? /* @__PURE__ */ new Error("ingress-drain-disposed") : toErrorObject(options.abortSignal?.reason, "ingress-drain-aborted");
		for (const state of activeByClaim.values()) if (state.phase === "dispatching" || state.phase === "deferred") {
			clearStallTimer(state);
			state.abortController.abort(reason);
		}
	};
	if (options.abortSignal?.aborted) abortActiveClaims();
	else options.abortSignal?.addEventListener("abort", abortActiveClaims, { once: true });
	const removeActive = (state) => {
		clearStallTimer(state);
		clearClaimRefresh(state);
		activeByClaim.delete(activeClaimKey(state.claim));
		if (laneOwnerByKey.get(state.laneKey) === state) laneOwnerByKey.delete(state.laneKey);
		state.occupiesLane = false;
	};
	const markLeaseReclaimed = (state) => {
		if (state.phase === "settled" || state.guillotined || state.superseded) return;
		state.guillotined = true;
		clearStallTimer(state);
		clearClaimRefresh(state);
		state.abortController.abort(/* @__PURE__ */ new Error("ingress claim lease reclaimed"));
	};
	const armClaimRefresh = (state) => {
		clearClaimRefresh(state);
		const intervalMs = Math.max(1, Math.floor(claimLeaseMs / 3));
		state.claimRefreshTimer = setInterval(() => {
			if (state.phase === "settled" || state.guillotined || state.superseded) {
				clearClaimRefresh(state);
				return;
			}
			if (!queue.refreshClaim) return;
			queue.refreshClaim(state.claim, { refreshedAt: now() }).then((refreshed) => {
				if (!refreshed) markLeaseReclaimed(state);
			}).catch(() => void 0);
		}, intervalMs);
		state.claimRefreshTimer.unref?.();
	};
	const isStopped = () => disposed || options.abortSignal?.aborted === true;
	const { completeClaimWithRetry, releaseClaim, failClaim } = createIngressWriter(options, {
		queue,
		now,
		formatError,
		log,
		isStopped
	});
	const applyFailureDisposition = async (claim, err) => {
		if (err instanceof GatewayDrainingError) {
			await releaseClaim(claim, { recordAttempt: false });
			return;
		}
		const disposition = resolveIngressFailureDisposition({
			err,
			event: claim,
			formatError,
			resolveNonRetryableFailure: options.resolveNonRetryableFailure,
			config: options.retryPolicy,
			now: now()
		});
		const committed = disposition.kind === "fail" ? await failClaim(claim, disposition.reason, disposition.message) : await releaseClaim(claim, { lastError: disposition.message });
		const displayId = claim.id.replace(/^0+(?=\d)/, "") || claim.id;
		if (!committed) {
			log(`spooled update ${displayId} settlement skipped: claim no longer owns the event`);
			return;
		}
		if (disposition.kind === "fail") {
			log(`spooled update ${displayId} failed with non-retryable ${disposition.reason}: ${disposition.message}; dead-lettered`);
			if (disposition.reason === "retry-limit-exceeded") log(`spooled update ${displayId} on lane ${claim.laneKey ?? displayId} reached retry limit after ${disposition.attempt} attempts; dead-lettered`);
			return;
		}
		log(`spooled update ${displayId} failed; keeping for retry: ${disposition.message}`);
	};
	const armStallWatchdog = (state) => {
		clearStallTimer(state);
		state.stallTimer = setTimeout(() => {
			if (state.phase !== "dispatching" && state.phase !== "deferred") return;
			const ageMs = now() - state.startedAt;
			const displayId = state.eventId.replace(/^0+(?=\d)/, "") || state.eventId;
			const message = `Channel ingress claim→adoption stalled for event ${displayId} on lane ${state.laneKey} after ${ageMs}ms; applying retry policy (handler-timeout).`;
			const timeoutError = new Error(message);
			state.guillotined = true;
			clearStallTimer(state);
			log(message);
			state.abortController.abort(timeoutError);
			state.settleOnce(() => applyFailureDisposition(state.claim, timeoutError)).catch((err) => {
				log(`ingress drain: failed to settle stalled event ${displayId}; holding claim: ${formatError(err)}`);
			});
		}, adoptionStallTimeoutMs);
		state.stallTimer.unref?.();
	};
	const releaseUnadopted = async (state, releaseOptions) => {
		if (!isPreAdoptionState(state)) return;
		clearStallTimer(state);
		await state.settleOnce(async () => {
			await releaseClaim(state.claim, releaseOptions);
		}).catch(() => void 0);
	};
	const readUnsettled = async () => queue.listUnsettled ? await queue.listUnsettled({ orderBy }) : {
		pending: await queue.listPending({
			limit: "all",
			orderBy
		}),
		claims: await queue.listClaims()
	};
	const createLifecycle = (state) => {
		return {
			abortSignal: state.abortController.signal,
			readLaneBacklog: async () => {
				const { pending, claims } = await readUnsettled();
				return [...pending.filter((row) => resolveIngressRetryDelayMs(row, options.retryPolicy, now()) <= 0), ...claims.filter((claim) => {
					const active = activeByClaim.get(activeClaimKey(claim));
					return !active || isPreAdoptionState(active) && (active.phase !== "deferred" || active.occupiesLane);
				})].filter((row) => row.id !== state.claim.id && resolveLaneKey(row, options.deriveLaneKey, options.reconcileStoredLaneKey) === state.laneKey).toSorted((left, right) => (orderBy === "received" ? left.receivedAt - right.receivedAt : 0) || Buffer.compare(Buffer.from(left.id), Buffer.from(right.id)));
			},
			onAdopted: async () => {
				if (state.guillotined) throw new IngressAdoptionLostError("guillotined");
				if (state.superseded) throw new IngressAdoptionLostError("superseded");
				if (state.phase === "adopted" || state.phase === "settled") return;
				state.phase = "adopted";
				clearStallTimer(state);
				await state.settleOnce(() => completeClaimWithRetry(state.claim));
			},
			onDeferred: () => {
				if (state.phase !== "dispatching") return;
				state.phase = "deferred";
				if (deferredLaneOccupancy === "release") {
					if (laneOwnerByKey.get(state.laneKey) === state) laneOwnerByKey.delete(state.laneKey);
					state.occupiesLane = false;
				}
			},
			onDeferredHeartbeat: () => {
				if ((state.phase === "dispatching" || state.phase === "deferred") && state.stallTimer) armStallWatchdog(state);
			},
			deferredHeartbeatIntervalMs: Math.max(1, Math.floor(adoptionStallTimeoutMs / 3)),
			onAdoptionFinalizing: () => {
				if (!isPreAdoptionState(state)) return;
				clearStallTimer(state);
			},
			onFailed: async (error) => {
				if (!isPreAdoptionState(state)) return;
				await state.settleOnce(() => applyFailureDisposition(state.claim, error));
			},
			onCancelled: async () => {
				await releaseUnadopted(state, { recordAttempt: false });
			},
			onAbandoned: async () => {
				await releaseUnadopted(state, { lastError: "turn-abandoned" });
			}
		};
	};
	const supersedeActiveIfNeeded = async (candidate, laneKey) => await supersedeActiveStatesIfNeeded({
		candidate,
		laneKey,
		activeByClaim,
		laneOwnerByKey,
		shouldSupersedePending: options.shouldSupersedePending,
		clearStallTimer,
		completeClaim: completeClaimWithRetry,
		formatError,
		log
	});
	const runClaimed = (claim, laneKey) => {
		const abortController = new AbortController();
		const state = {
			eventId: claim.id,
			laneKey,
			claim,
			abortController,
			startedAt: now(),
			phase: "dispatching",
			occupiesLane: true,
			guillotined: false,
			superseded: false,
			task: Promise.resolve(),
			settleOnce: async () => {}
		};
		state.settleOnce = createIngressSettleOwner(state, removeActive);
		activeByClaim.set(activeClaimKey(claim), state);
		laneOwnerByKey.set(laneKey, state);
		const lifecycle = createLifecycle(state);
		armStallWatchdog(state);
		armClaimRefresh(state);
		const releaseRootWork = retainGatewayRootWorkAdmissionContinuation();
		state.task = runOutsideAsyncWorkScope(async () => {
			try {
				const result = await (releaseRootWork ? options.dispatchClaimedEvent(claim, lifecycle) : runOutsideGatewayRootWorkAdmission(() => options.dispatchClaimedEvent(claim, lifecycle)));
				if (disposed) return;
				if (options.abortSignal?.aborted && result?.kind !== "completed" && result?.kind !== "failed-retryable") return;
				if (state.phase === "settled" || state.phase === "adopted") return;
				if (state.guillotined || state.superseded) return;
				if (result?.kind === "deferred") {
					lifecycle.onDeferred();
					return;
				}
				if (result?.kind === "failed-retryable") {
					clearStallTimer(state);
					await state.settleOnce(() => applyFailureDisposition(claim, result.error));
					return;
				}
				if (state.phase === "dispatching") await lifecycle.onAdopted();
			} catch (err) {
				if (isStopped() || state.phase === "settled") return;
				if (state.guillotined || state.superseded) return;
				if (state.phase === "adopted") {
					log(`ingress drain: post-adoption error for event ${claim.id} while claim held: ${formatError(err)}`);
					return;
				}
				clearStallTimer(state);
				await state.settleOnce(() => applyFailureDisposition(claim, err));
			} finally {
				releaseRootWork?.();
			}
		});
		return state;
	};
	const recoverStaleClaims = async () => {
		const activeLanes = new Set(laneOwnerByKey.keys());
		return await queue.recoverStaleClaims({
			staleMs: 0,
			now: now(),
			shouldRecover: (claim) => {
				if (activeByClaim.has(activeClaimKey(claim))) return false;
				if (isLiveLocalIngressDrainOwner(claim.claim.ownerId)) return false;
				return !isIngressClaimOwnedByOtherLiveProcess(claim, {
					maxAgeMs: claimLeaseMs,
					now: now()
				});
			},
			shouldRecoverCorrupt: (claim) => {
				if (claim.laneKey && activeLanes.has(claim.laneKey)) return false;
				if (isLiveLocalIngressDrainOwner(claim.claim.ownerId)) return false;
				return !isIngressCorruptClaimOwnedByOtherLiveProcess(claim, {
					maxAgeMs: claimLeaseMs,
					now: now()
				});
			}
		});
	};
	const drainOnce = async (drainOptions) => {
		if (disposed) return { started: 0 };
		const shouldStop = () => disposed || drainOptions?.shouldStop?.() === true || options.abortSignal?.aborted === true;
		await recoverStaleClaims();
		const { pending, claims } = await readUnsettled();
		const activeLaneKeys = new Set(laneOwnerByKey.keys());
		const claimedLaneKeys = new Set(claims.filter((claim) => {
			const state = activeByClaim.get(activeClaimKey(claim));
			return !(state?.phase === "deferred" && !state.occupiesLane && !state.guillotined && !state.superseded);
		}).map((claim) => resolveLaneKey(claim, options.deriveLaneKey, options.reconcileStoredLaneKey)));
		const retryDelayedLaneKeys = /* @__PURE__ */ new Set();
		const pendingLaneKeys = /* @__PURE__ */ new Set();
		const retryDelayed = new Uint8Array(pending.length);
		for (const [index, event] of pending.entries()) {
			const laneKey = resolveLaneKey(event, options.deriveLaneKey, options.reconcileStoredLaneKey);
			if (resolveIngressRetryDelayMs(event, options.retryPolicy, now()) > 0) {
				retryDelayed[index] = 1;
				if (!pendingLaneKeys.has(laneKey)) retryDelayedLaneKeys.add(laneKey);
			}
			pendingLaneKeys.add(laneKey);
		}
		const blockedLaneKeys = /* @__PURE__ */ new Set([
			...sortedKeys(activeLaneKeys),
			...sortedKeys(claimedLaneKeys),
			...sortedKeys(retryDelayedLaneKeys)
		]);
		for (const event of pending) {
			if (shouldStop()) break;
			const laneKey = resolveLaneKey(event, options.deriveLaneKey, options.reconcileStoredLaneKey);
			if (await supersedeActiveIfNeeded(event, laneKey)) blockedLaneKeys.delete(laneKey);
		}
		const candidateWindow = /* @__PURE__ */ new Map();
		let nextCandidateIndex = 0;
		const refillCandidateWindow = () => {
			for (const [id, laneKey] of candidateWindow) if (blockedLaneKeys.has(laneKey)) candidateWindow.delete(id);
			while (candidateWindow.size < scanLimit && nextCandidateIndex < pending.length) {
				const index = nextCandidateIndex;
				const event = pending[index];
				nextCandidateIndex += 1;
				if (retryDelayed[index] === 1) continue;
				const laneKey = resolveLaneKey(event, options.deriveLaneKey, options.reconcileStoredLaneKey);
				if (!blockedLaneKeys.has(laneKey)) candidateWindow.set(event.id, laneKey);
			}
		};
		let started = 0;
		while (started < startLimit) {
			if (shouldStop()) break;
			refillCandidateWindow();
			if (candidateWindow.size === 0) break;
			const claimed = await queue.claimNext({
				ownerId,
				blockedLaneKeys,
				orderBy,
				scanLimit,
				candidateIds: candidateWindow.keys(),
				deriveLaneKey: options.deriveLaneKey,
				...options.reconcileStoredLaneKey ? { reconcileStoredLaneKey: options.reconcileStoredLaneKey } : {}
			});
			if (!claimed) break;
			candidateWindow.delete(claimed.id);
			if (shouldStop()) {
				await queue.release(claimed, { recordAttempt: false });
				break;
			}
			const laneKey = resolveLaneKey(claimed, options.deriveLaneKey, options.reconcileStoredLaneKey);
			const existing = laneOwnerByKey.get(laneKey);
			if (existing && existing.phase !== "settled") {
				if (await supersedeActiveIfNeeded(claimed, laneKey)) blockedLaneKeys.delete(laneKey);
				if (laneOwnerByKey.has(laneKey)) {
					await queue.release(claimed, { recordAttempt: false });
					blockedLaneKeys.add(laneKey);
					continue;
				}
			}
			runClaimed(claimed, laneKey);
			blockedLaneKeys.add(laneKey);
			started += 1;
		}
		return { started };
	};
	function dispose(disposeOptions) {
		if (disposeOptions?.waitForSettlements) {
			if (!retainOwnerUntilDispose || !options.abortSignal?.aborted) return Promise.reject(/* @__PURE__ */ new Error("Joined ingress disposal requires an already-aborted retained owner"));
			return (async () => {
				for (;;) {
					const states = [...activeByClaim.values()];
					const settlements = states.flatMap((state) => state.settlement ? [state.settlement] : []);
					if (settlements.length === 0) {
						const failure = states.find((state) => state.settlementFailure)?.settlementFailure;
						if (failure) throw failure.error;
						dispose();
						return;
					}
					await Promise.allSettled(settlements);
				}
			})();
		}
		disposed = true;
		options.abortSignal?.removeEventListener("abort", abortActiveClaims);
		abortActiveClaims();
		const activeStates = Array.from(activeByClaim.values());
		for (const state of activeStates) removeActive(state);
	}
	return {
		recoverStaleClaims,
		drainOnce,
		activeLaneKeys: () => new Set(laneOwnerByKey.keys()),
		waitForIdle: async () => {
			const tasks = [...activeByClaim.values()].map((state) => state.task);
			await Promise.allSettled(tasks);
		},
		dispose
	};
}
//#endregion
export { isIngressAdoptionLostError as a, DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS as i, createChannelIngressDrain as n, INGRESS_CLAIM_PROCESS_ID as o, DEFAULT_INGRESS_RETRY_DEAD_LETTER_MIN_AGE_MS as r, processPidFromOwnerId as s, DEFAULT_INGRESS_ADOPTION_STALL_MS as t };
