import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { A as resolvePositiveTimerTimeoutMs, d as clampPositiveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { c as readErrorName, i as formatErrorMessage, t as collectErrorGraphCandidates } from "./errors-DCRXIYSQ.js";
import { n as sleepWithAbort, t as computeBackoff } from "./backoff-DPz-g2bN.js";
import { r as formatDurationPrecise } from "./format-duration-BrZ-AaEJ.js";
import "./error-runtime-Ck1CsJM-.js";
import "./number-runtime-DBLVDypr.js";
import "./runtime-env-oOti2yy7.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { a as isRecoverableTelegramNetworkError, t as TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS } from "./request-timeouts-CB0H7cNv.js";
import { t as drainPendingDeliveries } from "./delivery-queue-runtime-QZHG8tKo.js";
import "./ssrf-runtime-CZi-6iMr.js";
import { n as createTransportActivityStatusPatch, t as createConnectedChannelStatusPatch } from "./gateway-runtime-ArQFAZ7T.js";
import "./state-paths-DshOQl4X.js";
import { n as getTelegramRuntime } from "./runtime-B_f_VNpK.js";
import { c as writeTelegramUpdateOffset, l as normalizeTelegramStateAccountId, o as readTelegramUpdateOffset, r as deleteTelegramUpdateOffset } from "./update-offset-store-DeeaDJaf.js";
import { d as isTelegramMessageDispatchReplayForgetError } from "./message-dispatch-dedupe-C6uFvVMh.js";
import { R as withTelegramApiErrorLogging } from "./send-fyju8PqW.js";
import { a as runWithTelegramSpooledReplayUpdate, i as getTelegramSequentialKey, n as buildTelegramReplyFenceLaneKey, r as supersedeTelegramReplyFenceLane, t as createTelegramBot } from "./bot-Cnb256Pk.js";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";
import { Worker } from "node:worker_threads";
import { run } from "@grammyjs/runner";
//#region extensions/telegram/src/polling-liveness.ts
var TelegramPollingLivenessTracker = class {
	#lastGetUpdatesAt;
	#lastGetUpdatesActivityAt;
	#lastGetUpdatesStartedAt = null;
	#lastGetUpdatesFinishedAt = null;
	#lastGetUpdatesDurationMs = null;
	#lastGetUpdatesOutcome = "not-started";
	#lastGetUpdatesError = null;
	#lastGetUpdatesOffset = null;
	#inFlightGetUpdates = 0;
	#stallDiagLoggedAt = 0;
	constructor(options = {}) {
		this.options = options;
		this.#lastGetUpdatesAt = this.#now();
		this.#lastGetUpdatesActivityAt = this.#lastGetUpdatesAt;
	}
	get inFlightGetUpdates() {
		return this.#inFlightGetUpdates;
	}
	noteGetUpdatesStarted(payload, at = this.#now()) {
		this.#lastGetUpdatesAt = at;
		this.#lastGetUpdatesActivityAt = at;
		this.#lastGetUpdatesStartedAt = at;
		this.#lastGetUpdatesOffset = resolveGetUpdatesOffset(payload);
		this.#inFlightGetUpdates += 1;
		this.#lastGetUpdatesOutcome = "started";
		this.#lastGetUpdatesError = null;
	}
	noteGetUpdatesSuccess(result, at = this.#now()) {
		this.#lastGetUpdatesActivityAt = at;
		this.#lastGetUpdatesFinishedAt = at;
		this.#lastGetUpdatesDurationMs = this.#lastGetUpdatesStartedAt == null ? null : at - this.#lastGetUpdatesStartedAt;
		this.#lastGetUpdatesOutcome = Array.isArray(result) ? `ok:${result.length}` : "ok";
		this.options.onPollSuccess?.(at);
	}
	noteGetUpdatesSuccessCount(count, at = this.#now()) {
		this.#lastGetUpdatesActivityAt = at;
		this.#lastGetUpdatesFinishedAt = at;
		this.#lastGetUpdatesDurationMs = this.#lastGetUpdatesStartedAt == null ? null : at - this.#lastGetUpdatesStartedAt;
		const normalizedCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
		this.#lastGetUpdatesOutcome = `ok:${normalizedCount}`;
		this.options.onPollSuccess?.(at);
	}
	noteGetUpdatesError(err, at = this.#now()) {
		this.#lastGetUpdatesActivityAt = at;
		this.#lastGetUpdatesFinishedAt = at;
		this.#lastGetUpdatesDurationMs = this.#lastGetUpdatesStartedAt == null ? null : at - this.#lastGetUpdatesStartedAt;
		this.#lastGetUpdatesOutcome = "error";
		this.#lastGetUpdatesError = formatErrorMessage(err);
	}
	noteGetUpdatesFinished() {
		this.#inFlightGetUpdates = Math.max(0, this.#inFlightGetUpdates - 1);
	}
	noteGetUpdatesActivity(at = this.#now()) {
		this.#lastGetUpdatesActivityAt = at;
	}
	detectStall(params) {
		const now = params.now ?? this.#now();
		const activeElapsed = this.#inFlightGetUpdates > 0 && this.#lastGetUpdatesStartedAt != null ? now - this.#lastGetUpdatesActivityAt : 0;
		const idleElapsed = this.#inFlightGetUpdates > 0 ? 0 : now - (this.#lastGetUpdatesFinishedAt ?? this.#lastGetUpdatesAt);
		const elapsed = this.#inFlightGetUpdates > 0 ? activeElapsed : idleElapsed;
		if (elapsed <= params.thresholdMs) return null;
		if (this.#stallDiagLoggedAt && now - this.#stallDiagLoggedAt < params.thresholdMs / 2) return null;
		this.#stallDiagLoggedAt = now;
		return { message: `Polling stall detected (${this.#inFlightGetUpdates > 0 ? `active getUpdates stuck for ${formatDurationPrecise(elapsed)}` : `no completed getUpdates for ${formatDurationPrecise(elapsed)}`}); forcing restart. [diag ${this.formatDiagnosticFields("error")}]` };
	}
	formatDiagnosticFields(errorLabel) {
		const error = this.#lastGetUpdatesError && errorLabel ? ` ${errorLabel}=${this.#lastGetUpdatesError}` : "";
		return `inFlight=${this.#inFlightGetUpdates} outcome=${this.#lastGetUpdatesOutcome} startedAt=${this.#lastGetUpdatesStartedAt ?? "n/a"} finishedAt=${this.#lastGetUpdatesFinishedAt ?? "n/a"} durationMs=${this.#lastGetUpdatesDurationMs ?? "n/a"} offset=${this.#lastGetUpdatesOffset ?? "n/a"}${error}`;
	}
	#now() {
		return this.options.now?.() ?? Date.now();
	}
};
function resolveGetUpdatesOffset(payload) {
	if (!payload || typeof payload !== "object" || !("offset" in payload)) return null;
	const offset = payload.offset;
	return typeof offset === "number" ? offset : null;
}
//#endregion
//#region extensions/telegram/src/polling-status.ts
function createTelegramPollingStatusPublisher(setStatus) {
	return {
		notePollingStart() {
			setStatus?.({
				mode: "polling",
				connected: false,
				lastConnectedAt: null,
				lastEventAt: null,
				lastTransportActivityAt: null
			});
		},
		notePollSuccess(at = Date.now()) {
			setStatus?.({
				...createConnectedChannelStatusPatch(at),
				...createTransportActivityStatusPatch(at),
				mode: "polling",
				lastError: null
			});
		},
		notePollingError(error) {
			setStatus?.({
				mode: "polling",
				connected: false,
				lastError: error
			});
		},
		notePollingStop() {
			setStatus?.({
				mode: "polling",
				connected: false
			});
		}
	};
}
//#endregion
//#region extensions/telegram/src/polling-transport-state.ts
var TelegramPollingTransportState = class {
	#telegramTransport;
	#transportDirty = false;
	#disposed = false;
	constructor(opts) {
		this.opts = opts;
		this.#telegramTransport = opts.initialTransport;
	}
	markDirty() {
		this.#transportDirty = true;
	}
	acquireForNextCycle() {
		if (this.#disposed) return;
		const previous = this.#telegramTransport;
		const nextTransport = this.#transportDirty || !previous ? this.opts.createTelegramTransport?.() ?? previous : previous;
		if (this.#transportDirty && previous && nextTransport !== previous) {
			this.opts.log("[telegram][diag] closing stale transport before rebuild");
			this.#closeTransportAsync(previous, "stale-transport rebuild");
		}
		if (this.#transportDirty && nextTransport) this.opts.log("[telegram][diag] rebuilding transport for next polling cycle");
		this.#telegramTransport = nextTransport;
		this.#transportDirty = false;
		return nextTransport;
	}
	async dispose() {
		if (this.#disposed) return;
		this.#disposed = true;
		const transport = this.#telegramTransport;
		this.#telegramTransport = void 0;
		if (!transport) return;
		try {
			await transport.close();
		} catch (err) {
			this.opts.log(`[telegram][diag] failed to close transport during dispose: ${formatCloseError(err)}`);
		}
	}
	#closeTransportAsync(transport, context) {
		transport.close().catch((err) => {
			this.opts.log(`[telegram][diag] failed to close transport (${context}): ${formatCloseError(err)}`);
		});
	}
};
function formatCloseError(err) {
	if (err instanceof Error) return err.message;
	return String(err);
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-spool.ts
const SPOOL_VERSION = 1;
const TELEGRAM_INGRESS_SPOOL_PREFIX = "ingress-spool-";
const TELEGRAM_SPOOLED_UPDATE_FAILED_TTL_MS = 720 * 60 * 60 * 1e3;
const TELEGRAM_SPOOLED_UPDATE_FAILED_MAX_ENTRIES = 1e3;
const TELEGRAM_SPOOLED_UPDATE_PROCESS_ID = `${process.pid}:${randomUUID()}`;
function isValidUpdateId(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function resolveTelegramIngressSpoolDir(params) {
	const stateDir = resolveStateDir(params.env, os.homedir);
	return path.join(stateDir, "telegram", `${TELEGRAM_INGRESS_SPOOL_PREFIX}${normalizeTelegramStateAccountId(params.accountId)}`);
}
function resolveTelegramUpdateId(update) {
	if (!update || typeof update !== "object") return null;
	const value = update.update_id;
	return isValidUpdateId(value) ? value : null;
}
function spoolFileName(updateId) {
	return `${String(updateId).padStart(16, "0")}.json`;
}
function processingFileName(updateId) {
	return `${spoolFileName(updateId)}.processing`;
}
function queueEventId(updateId) {
	return String(updateId).padStart(16, "0");
}
function pendingPath(spoolDir, updateId) {
	return path.join(spoolDir, spoolFileName(updateId));
}
function processingPath(spoolDir, updateId) {
	return path.join(spoolDir, processingFileName(updateId));
}
function resolveQueueParts(spoolDir) {
	const basename = path.basename(spoolDir);
	return {
		accountId: normalizeTelegramStateAccountId(basename.startsWith(TELEGRAM_INGRESS_SPOOL_PREFIX) ? basename.slice(14) : basename),
		stateDir: basename.startsWith(TELEGRAM_INGRESS_SPOOL_PREFIX) && path.basename(path.dirname(spoolDir)) === "telegram" ? path.dirname(path.dirname(spoolDir)) : spoolDir
	};
}
function createTelegramIngressQueue(spoolDir) {
	const parts = resolveQueueParts(spoolDir);
	return getTelegramRuntime().state.openChannelIngressQueue({
		accountId: parts.accountId,
		stateDir: parts.stateDir
	});
}
async function pruneTelegramIngressQueue(queue, now) {
	await queue.prune({
		failedTtlMs: TELEGRAM_SPOOLED_UPDATE_FAILED_TTL_MS,
		failedMaxEntries: TELEGRAM_SPOOLED_UPDATE_FAILED_MAX_ENTRIES,
		...now === void 0 ? {} : { now }
	});
}
function processPidFromOwnerId(ownerId) {
	const pid = Number.parseInt(ownerId.split(":", 1)[0] ?? "", 10);
	return Number.isSafeInteger(pid) && pid > 0 ? pid : -1;
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
function isFreshClaimOwner(claim, options) {
	const now = options?.now ?? Date.now();
	const maxAgeMs = options?.maxAgeMs ?? 216e5;
	return now - claim.claimedAt < maxAgeMs;
}
function parseQueueRecord(spoolDir, record) {
	const payload = record.payload;
	if (payload.version !== SPOOL_VERSION || !isValidUpdateId(payload.updateId)) return null;
	return {
		updateId: payload.updateId,
		path: pendingPath(spoolDir, payload.updateId),
		update: payload.update,
		receivedAt: payload.receivedAt,
		attempts: record.attempts,
		...record.lastAttemptAt === void 0 ? {} : { lastAttemptAt: record.lastAttemptAt },
		...record.lastError === void 0 ? {} : { lastError: record.lastError }
	};
}
function parseQueueClaim(spoolDir, record) {
	const update = parseQueueRecord(spoolDir, record);
	if (!update) return null;
	return {
		...update,
		path: processingPath(spoolDir, update.updateId),
		pendingPath: pendingPath(spoolDir, update.updateId),
		claim: {
			processId: record.claim.ownerId,
			processPid: processPidFromOwnerId(record.claim.ownerId),
			claimedAt: record.claim.claimedAt,
			claimToken: record.claim.token
		}
	};
}
function spooledUpdateLaneKey(update, botInfo) {
	return getTelegramSequentialKey({
		update,
		...botInfo ? { me: botInfo } : {}
	});
}
function sortTelegramUpdates(updates) {
	return updates.toSorted((a, b) => a.updateId - b.updateId);
}
function queueMutationTarget(update) {
	const id = queueEventId(update.updateId);
	return update.claim?.claimToken ? {
		id,
		claim: { token: update.claim.claimToken }
	} : id;
}
function isTelegramSpooledUpdateClaimOwnedByOtherLiveProcess(claim, options) {
	return Boolean(claim.claim && claim.claim.processId !== TELEGRAM_SPOOLED_UPDATE_PROCESS_ID && claim.claim.processPid !== process.pid && isFreshClaimOwner(claim.claim, options) && processExists(claim.claim.processPid));
}
async function writeTelegramSpooledUpdate(params) {
	const updateId = resolveTelegramUpdateId(params.update);
	if (updateId === null) throw new Error("Telegram update missing numeric update_id.");
	const receivedAt = params.now ?? Date.now();
	const queue = createTelegramIngressQueue(params.spoolDir);
	await pruneTelegramIngressQueue(queue, params.now);
	await queue.enqueue(queueEventId(updateId), {
		version: SPOOL_VERSION,
		updateId,
		receivedAt,
		update: params.update
	}, {
		receivedAt,
		laneKey: params.laneKey ?? spooledUpdateLaneKey(params.update)
	});
	return updateId;
}
async function listTelegramSpooledUpdates(params) {
	return sortTelegramUpdates((await createTelegramIngressQueue(params.spoolDir).listPending({
		limit: params.limit ?? 100,
		orderBy: "id"
	})).flatMap((record) => {
		const update = parseQueueRecord(params.spoolDir, record);
		return update ? [update] : [];
	}));
}
async function deleteTelegramSpooledUpdate(update) {
	await createTelegramIngressQueue(path.dirname(update.path)).delete(queueMutationTarget(update));
}
async function claimNextTelegramSpooledUpdate(params) {
	const queue = createTelegramIngressQueue(params.spoolDir);
	const claimed = await queue.claimNext({
		ownerId: TELEGRAM_SPOOLED_UPDATE_PROCESS_ID,
		blockedLaneKeys: params.blockedLaneKeys,
		...params.candidateUpdateIds === void 0 ? {} : { candidateIds: [...params.candidateUpdateIds].map(queueEventId) },
		orderBy: "id",
		scanLimit: params.scanLimit,
		deriveLaneKey: (record) => spooledUpdateLaneKey(record.payload.update, params.botInfo)
	});
	if (!claimed) return null;
	const update = parseQueueClaim(params.spoolDir, claimed);
	if (update) return update;
	await queue.fail(claimed, {
		reason: "invalid-spooled-update",
		message: "Telegram spooled update payload was invalid."
	});
	return null;
}
async function releaseTelegramSpooledUpdateClaim(update, options) {
	await createTelegramIngressQueue(path.dirname(update.pendingPath)).release(queueMutationTarget(update), options);
}
async function refreshTelegramSpooledUpdateClaim(update, options) {
	const claimToken = update.claim?.claimToken;
	if (!claimToken) return false;
	return await createTelegramIngressQueue(path.dirname(update.pendingPath)).refreshClaim?.({
		id: queueEventId(update.updateId),
		claim: { token: claimToken }
	}, options) ?? false;
}
async function failTelegramSpooledUpdateClaim(params) {
	const queue = createTelegramIngressQueue(path.dirname(params.update.pendingPath));
	const failed = await queue.fail(queueMutationTarget(params.update), {
		reason: params.reason,
		message: params.message,
		...params.now === void 0 ? {} : { failedAt: params.now }
	});
	await pruneTelegramIngressQueue(queue, params.now);
	return failed;
}
async function listTelegramSpooledUpdateClaims(params) {
	return sortTelegramUpdates((await createTelegramIngressQueue(params.spoolDir).listClaims()).flatMap((claim) => {
		const update = parseQueueClaim(params.spoolDir, claim);
		return update ? [update] : [];
	}));
}
async function recoverStaleTelegramSpooledUpdateClaims(params) {
	const shouldRecover = params.shouldRecover;
	return await createTelegramIngressQueue(params.spoolDir).recoverStaleClaims({
		staleMs: params.staleMs ?? 216e5,
		...params.now === void 0 ? {} : { now: params.now },
		...shouldRecover ? { shouldRecover: async (claim) => {
			const update = parseQueueClaim(params.spoolDir, claim);
			return update ? await shouldRecover(update) : false;
		} } : {}
	});
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-worker.ts
const createTelegramIngressWorker = (options) => {
	const listeners = /* @__PURE__ */ new Set();
	const worker = new Worker(new URL("./telegram-ingress-worker.runtime.js", import.meta.url), { workerData: options });
	const taskPromise = new Promise((resolve, reject) => {
		worker.once("error", reject);
		worker.once("exit", (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(/* @__PURE__ */ new Error(`Telegram ingress worker exited with code ${code}`));
		});
	});
	worker.on("message", (message) => {
		for (const listener of listeners) listener(message);
	});
	return {
		onMessage(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		ackSpooledUpdate(requestId, result) {
			try {
				Reflect.apply(Reflect.get(worker, "postMessage"), worker, [{
					type: "spool-ack",
					requestId,
					result
				}]);
			} catch {}
		},
		async stop() {
			Reflect.apply(Reflect.get(worker, "postMessage"), worker, [{ type: "stop" }]);
			const timeout = setTimeout(() => {
				worker.terminate();
			}, 15e3);
			timeout.unref?.();
			try {
				await taskPromise.catch(() => void 0);
			} finally {
				clearTimeout(timeout);
			}
		},
		task() {
			return taskPromise;
		}
	};
};
//#endregion
//#region extensions/telegram/src/polling-session.ts
const TELEGRAM_POLL_RESTART_POLICY = {
	initialMs: 3e4,
	maxMs: 6e5,
	factor: 2,
	jitter: .2
};
const TELEGRAM_POLL_STOP_TIMEOUT_COOLDOWN_POLICY = {
	initialMs: 12e4,
	maxMs: 6e5,
	factor: 2,
	jitter: .2
};
const TELEGRAM_POLL_STOP_TIMEOUT_BURST_LIMIT = 2;
function createTelegramRestartBackoffState() {
	return {
		restartAttempts: 0,
		stopTimeoutBurst: 0,
		stopTimeoutCooldownAttempts: 0
	};
}
function resetTelegramRestartBackoffState(state) {
	state.restartAttempts = 0;
	state.stopTimeoutBurst = 0;
	state.stopTimeoutCooldownAttempts = 0;
}
function resolveTelegramRestartDelayMs(state, opts = {}) {
	state.restartAttempts += 1;
	let delayMs = computeBackoff(TELEGRAM_POLL_RESTART_POLICY, state.restartAttempts);
	let stopTimeoutSuffix = "";
	if (opts.stopTimedOut) {
		state.stopTimeoutBurst += 1;
		if (state.stopTimeoutBurst >= TELEGRAM_POLL_STOP_TIMEOUT_BURST_LIMIT) {
			state.stopTimeoutCooldownAttempts += 1;
			const cooldownMs = computeBackoff(TELEGRAM_POLL_STOP_TIMEOUT_COOLDOWN_POLICY, state.stopTimeoutCooldownAttempts);
			delayMs = Math.max(delayMs, cooldownMs);
			stopTimeoutSuffix = ` Stop timeout burst=${state.stopTimeoutBurst}; applying cooldown.`;
		}
	} else {
		state.stopTimeoutBurst = 0;
		state.stopTimeoutCooldownAttempts = 0;
	}
	return {
		delayMs,
		stopTimeoutSuffix
	};
}
const TELEGRAM_GET_UPDATES_CONFLICT_HINT = " Another OpenClaw gateway, script, or Telegram poller may be using this bot token; stop the duplicate poller or switch this account to webhook mode.";
const DEFAULT_POLL_STALL_THRESHOLD_MS = 12e4;
const MIN_POLL_STALL_THRESHOLD_MS = 3e4;
const MAX_POLL_STALL_THRESHOLD_MS = 6e5;
const POLL_WATCHDOG_INTERVAL_MS = 3e4;
const POLL_STOP_GRACE_MS = 15e3;
const ISOLATED_INGRESS_BACKLOG_STALL_MS = 25 * 6e4;
const TELEGRAM_SPOOLED_HANDLER_ABORT_GRACE_MS = 5e3;
const TELEGRAM_SPOOLED_HANDLER_TIMEOUT_ENV = "OPENCLAW_TELEGRAM_SPOOLED_HANDLER_TIMEOUT_MS";
const TELEGRAM_SPOOLED_DRAIN_START_LIMIT = 100;
const TELEGRAM_SPOOLED_DRAIN_SCAN_LIMIT = TELEGRAM_SPOOLED_DRAIN_START_LIMIT * 10;
const TELEGRAM_SPOOLED_CLAIM_REFRESH_INTERVAL_MS = 300 * 1e3;
const TELEGRAM_SPOOLED_CLAIM_HEALTH_GRACE_MS = 2 * TELEGRAM_SPOOLED_CLAIM_REFRESH_INTERVAL_MS;
const TELEGRAM_SPOOLED_SESSION_INIT_CONFLICT_RETRY_BASE_MS = 5e3;
const TELEGRAM_SPOOLED_SESSION_INIT_CONFLICT_RETRY_MAX_MS = 6e4;
const TELEGRAM_POLLING_CLIENT_TIMEOUT_FLOOR_SECONDS = Math.ceil(TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS / 1e3);
const MISSING_AGENT_HARNESS_ERROR_NAME = "MissingAgentHarnessError";
const MISSING_AGENT_HARNESS_MESSAGE_RE = /Requested agent harness "[^"]+" is not registered\./u;
const REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE = /reply session initialization conflicted for \S+/u;
function normalizeTelegramAccountId(accountId) {
	return accountId?.trim() || "default";
}
function resolveNonRetryableSpooledUpdateFailure(err) {
	for (const candidate of collectErrorGraphCandidates(err, (current) => [current.cause, current.error])) {
		const message = formatErrorMessage(candidate);
		if (isTelegramMessageDispatchReplayForgetError(candidate)) return {
			reason: "dispatch-dedupe-rollback-failed",
			message
		};
		if (readErrorName(candidate) === MISSING_AGENT_HARNESS_ERROR_NAME || MISSING_AGENT_HARNESS_MESSAGE_RE.test(message)) return {
			reason: "missing-agent-harness",
			message
		};
	}
	return null;
}
function resolveSpooledUpdateRetryDelayMs(update, now = Date.now()) {
	const attempts = update.attempts ?? 0;
	if (!update.lastError || !REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE.test(update.lastError) || update.lastAttemptAt === void 0 || attempts <= 0) return 0;
	const exponent = Math.min(attempts - 1, 8);
	const delayMs = Math.min(TELEGRAM_SPOOLED_SESSION_INIT_CONFLICT_RETRY_MAX_MS, TELEGRAM_SPOOLED_SESSION_INIT_CONFLICT_RETRY_BASE_MS * 2 ** exponent);
	return Math.max(0, update.lastAttemptAt + delayMs - now);
}
const waitForGracefulStop = async (stop) => {
	let timer;
	try {
		await Promise.race([stop(), new Promise((resolve) => {
			timer = setTimeout(resolve, POLL_STOP_GRACE_MS);
			timer.unref?.();
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
};
const waitForSpooledHandlerTaskSettlement = async (params) => {
	if (params.abortSignal?.aborted) return false;
	let timer;
	let removeAbortListener;
	try {
		return await Promise.race([params.task.then(() => true, () => true), new Promise((resolve) => {
			timer = setTimeout(() => resolve(false), params.timeoutMs);
			timer.unref?.();
			const abort = () => resolve(false);
			params.abortSignal?.addEventListener("abort", abort, { once: true });
			removeAbortListener = () => params.abortSignal?.removeEventListener("abort", abort);
		})]);
	} finally {
		if (timer) clearTimeout(timer);
		removeAbortListener?.();
	}
};
const resolvePollingStallThresholdMs = (value) => {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_POLL_STALL_THRESHOLD_MS;
	return Math.min(MAX_POLL_STALL_THRESHOLD_MS, Math.max(MIN_POLL_STALL_THRESHOLD_MS, Math.floor(value)));
};
const deferredSpooledUpdateClaimsByKey = /* @__PURE__ */ new Map();
function buildDeferredSpooledUpdateClaimKey(update) {
	return `${update.pendingPath}:${update.claim?.claimToken ?? update.claim?.processId ?? "claimed"}`;
}
const activeSpooledUpdateHandlersByLane = /* @__PURE__ */ new Map();
const spooledUpdateDrainHealthBySpool = /* @__PURE__ */ new Map();
function getSpooledUpdateDrainHealth(spoolDir) {
	const existing = spooledUpdateDrainHealthBySpool.get(spoolDir);
	if (existing) return existing;
	const created = { lastCompletedAt: Date.now() };
	spooledUpdateDrainHealthBySpool.set(spoolDir, created);
	return created;
}
function resolveSpooledUpdateHandlerTimeoutMs(params) {
	const candidates = [params.configured, Number(params.env?.[TELEGRAM_SPOOLED_HANDLER_TIMEOUT_ENV])];
	for (const candidate of candidates) {
		const timeoutMs = clampPositiveTimerTimeoutMs(candidate);
		if (timeoutMs !== void 0) return timeoutMs;
	}
	return ISOLATED_INGRESS_BACKLOG_STALL_MS;
}
function buildSpooledUpdateHandlerKey(params) {
	return `${params.spoolDir}\0${params.laneKey}`;
}
function isSpooledUpdateHandlerKeyForSpool(handlerKey, spoolDir) {
	return handlerKey.startsWith(`${spoolDir}\0`);
}
var TelegramPollingSession = class {
	#restartBackoffState = createTelegramRestartBackoffState();
	#webhookCleared = false;
	#forceRestarted = false;
	#activeRunner;
	#activeFetchAbort;
	#spooledUpdateHandlerKeys = /* @__PURE__ */ new Set();
	#deferredSpooledUpdateClaimKeys = /* @__PURE__ */ new Set();
	#transportState;
	#status;
	#stallThresholdMs;
	#spooledUpdateHandlerTimeoutMs;
	#spooledUpdateHandlerAbortGraceMs;
	#deliveryDrainInFlight = false;
	constructor(opts) {
		this.opts = opts;
		this.#transportState = new TelegramPollingTransportState({
			log: opts.log,
			initialTransport: opts.telegramTransport,
			createTelegramTransport: opts.createTelegramTransport
		});
		this.#status = createTelegramPollingStatusPublisher(opts.setStatus);
		this.#stallThresholdMs = resolvePollingStallThresholdMs(opts.stallThresholdMs);
		this.#spooledUpdateHandlerTimeoutMs = resolveSpooledUpdateHandlerTimeoutMs({
			...opts.isolatedIngress?.spooledUpdateHandlerTimeoutMs !== void 0 ? { configured: opts.isolatedIngress.spooledUpdateHandlerTimeoutMs } : {},
			env: process.env
		});
		this.#spooledUpdateHandlerAbortGraceMs = resolvePositiveTimerTimeoutMs(opts.isolatedIngress?.spooledUpdateHandlerAbortGraceMs, TELEGRAM_SPOOLED_HANDLER_ABORT_GRACE_MS);
	}
	get activeRunner() {
		return this.#activeRunner;
	}
	markForceRestarted() {
		this.#forceRestarted = true;
	}
	markTransportDirty() {
		this.#transportState.markDirty();
	}
	abortActiveFetch() {
		this.#activeFetchAbort?.abort();
	}
	async runUntilAbort() {
		this.#status.notePollingStart();
		try {
			while (!this.opts.abortSignal?.aborted) {
				const bot = await this.#createPollingBot();
				if (!bot) continue;
				const cleanupState = await this.#ensureWebhookCleanup(bot);
				if (cleanupState === "retry") continue;
				if (cleanupState === "exit") return;
				if ((this.opts.isolatedIngress?.enabled ? await this.#runIsolatedIngressCycle(bot) : await this.#runPollingCycle(bot)) === "exit") return;
			}
		} finally {
			await this.#transportState.dispose();
			this.#status.notePollingStop();
		}
	}
	#noteHealthyPollingCycle() {
		resetTelegramRestartBackoffState(this.#restartBackoffState);
	}
	async #waitBeforeRestart(buildLine, opts = {}) {
		const { delayMs, stopTimeoutSuffix } = resolveTelegramRestartDelayMs(this.#restartBackoffState, opts);
		const delay = formatDurationPrecise(delayMs);
		this.opts.log(`${buildLine(delay)}${stopTimeoutSuffix}`);
		try {
			await sleepWithAbort(delayMs, this.opts.abortSignal);
		} catch (sleepErr) {
			if (this.opts.abortSignal?.aborted) return false;
			throw sleepErr;
		}
		return true;
	}
	async #waitBeforeRetryOnRecoverableSetupError(err, logPrefix) {
		if (this.opts.abortSignal?.aborted) return false;
		if (!isRecoverableTelegramNetworkError(err, { context: "unknown" })) throw err;
		return this.#waitBeforeRestart((delay) => `${logPrefix}: ${formatErrorMessage(err)}; retrying in ${delay}.`);
	}
	#drainPendingDeliveriesAfterReconnect() {
		if (this.#deliveryDrainInFlight) return;
		if (!this.opts.config) return;
		this.#deliveryDrainInFlight = true;
		const accountId = normalizeTelegramAccountId(this.opts.accountId);
		const cfg = this.opts.config;
		drainPendingDeliveries({
			drainKey: `telegram:${accountId}`,
			logLabel: "Telegram reconnect drain",
			cfg,
			log: {
				info: (message) => this.opts.log(`[telegram][diag] ${message}`),
				warn: (message) => this.opts.log(`[telegram] ${message}`),
				error: (message) => this.opts.log(`[telegram] ${message}`)
			},
			selectEntry: (entry) => ({
				match: entry.channel === "telegram" && normalizeTelegramAccountId(entry.accountId) === accountId,
				bypassBackoff: false
			})
		}).catch((err) => {
			this.opts.log(`[telegram] reconnect delivery drain failed: ${formatErrorMessage(err)}`);
		}).finally(() => {
			this.#deliveryDrainInFlight = false;
		});
	}
	async #createPollingBot() {
		const fetchAbortController = new AbortController();
		this.#activeFetchAbort = fetchAbortController;
		const telegramTransport = this.#transportState.acquireForNextCycle();
		const persistedLastUpdateId = this.opts.getLastUpdateId();
		const updateOffset = {
			lastUpdateId: this.opts.isolatedIngress?.enabled ? null : persistedLastUpdateId,
			persistenceFloorUpdateId: persistedLastUpdateId,
			onUpdateId: this.opts.persistUpdateId
		};
		try {
			return createTelegramBot({
				token: this.opts.token,
				runtime: this.opts.runtime,
				proxyFetch: this.opts.proxyFetch,
				config: this.opts.config,
				accountId: this.opts.accountId,
				botInfo: this.opts.botInfo,
				fetchAbortSignal: fetchAbortController.signal,
				minimumClientTimeoutSeconds: TELEGRAM_POLLING_CLIENT_TIMEOUT_FLOOR_SECONDS,
				...updateOffset ? { updateOffset } : {},
				telegramTransport
			});
		} catch (err) {
			await this.#waitBeforeRetryOnRecoverableSetupError(err, "Telegram setup network error");
			if (this.#activeFetchAbort === fetchAbortController) this.#activeFetchAbort = void 0;
			return;
		}
	}
	async #ensureWebhookCleanup(bot) {
		if (this.#webhookCleared) return "ready";
		try {
			await withTelegramApiErrorLogging({
				operation: "deleteWebhook",
				runtime: this.opts.runtime,
				fn: () => bot.api.deleteWebhook({ drop_pending_updates: false })
			});
			this.#webhookCleared = true;
			return "ready";
		} catch (err) {
			if (isRecoverableTelegramNetworkError(err, { context: "unknown" })) {
				this.opts.log(`[telegram] deleteWebhook failed with a recoverable network error; continuing to polling so getUpdates can confirm webhook state: ${formatErrorMessage(err)}`);
				return "ready";
			}
			return await this.#waitBeforeRetryOnRecoverableSetupError(err, "Telegram webhook cleanup failed") ? "retry" : "exit";
		}
	}
	async #claimNextSpooledUpdate(params) {
		try {
			return await claimNextTelegramSpooledUpdate({
				spoolDir: params.spoolDir,
				blockedLaneKeys: params.blockedLaneKeys,
				botInfo: this.opts.botInfo,
				candidateUpdateIds: params.candidateUpdateIds,
				scanLimit: TELEGRAM_SPOOLED_DRAIN_SCAN_LIMIT
			});
		} catch (err) {
			this.opts.log(`[telegram][diag] spooled update claim failed; keeping pending updates for retry: ${formatErrorMessage(err)}`);
			return null;
		}
	}
	#startSpooledUpdateClaimRefresh(update, isDrainHealthy, onDrainUnhealthy) {
		let stopped = false;
		let refreshing = false;
		const refresh = async () => {
			if (stopped || refreshing) return;
			if (!isDrainHealthy()) {
				onDrainUnhealthy();
				stopped = true;
				clearInterval(timer);
				return;
			}
			refreshing = true;
			try {
				if (!await refreshTelegramSpooledUpdateClaim(update) && !stopped) {
					onDrainUnhealthy();
					stopped = true;
					clearInterval(timer);
				}
			} catch (err) {
				this.opts.log(`[telegram][diag] spooled update ${update.updateId} claim refresh failed: ${formatErrorMessage(err)}`);
				if (!stopped) {
					onDrainUnhealthy();
					stopped = true;
					clearInterval(timer);
				}
			} finally {
				refreshing = false;
			}
		};
		const timer = setInterval(() => {
			refresh();
		}, TELEGRAM_SPOOLED_CLAIM_REFRESH_INTERVAL_MS);
		timer.unref?.();
		return () => {
			if (stopped) return;
			stopped = true;
			clearInterval(timer);
		};
	}
	async #handleClaimedSpooledUpdate(params) {
		let replay;
		try {
			const update = params.update.update;
			replay = await runWithTelegramSpooledReplayUpdate(update, async () => {
				await params.bot.handleUpdate(update);
			});
		} catch (err) {
			params.stopClaimRefresh();
			await this.#releaseFailedSpooledUpdate({
				err,
				update: params.update
			});
			return false;
		}
		if (replay.deferredWork) {
			this.#registerDeferredSpooledUpdate({
				deferredWork: replay.deferredWork,
				laneKey: this.#spooledUpdateLaneKey(params.update),
				stopClaimRefresh: params.stopClaimRefresh,
				update: params.update
			});
			return true;
		}
		try {
			params.stopClaimRefresh();
			await deleteTelegramSpooledUpdate(params.update);
			return true;
		} catch (err) {
			this.opts.log(`[telegram][diag] spooled update ${params.update.updateId} completed but processing marker cleanup failed: ${formatErrorMessage(err)}`);
			return false;
		}
	}
	#registerDeferredSpooledUpdate(params) {
		const claimKey = buildDeferredSpooledUpdateClaimKey(params.update);
		const previous = deferredSpooledUpdateClaimsByKey.get(claimKey);
		if (previous) {
			if (previous.timer) clearTimeout(previous.timer);
			previous.stopClaimRefresh();
			deferredSpooledUpdateClaimsByKey.delete(claimKey);
		}
		let settled = false;
		const finish = async (result) => {
			if (settled) return;
			settled = true;
			if (state.timer) clearTimeout(state.timer);
			state.stopClaimRefresh();
			if (deferredSpooledUpdateClaimsByKey.get(claimKey) === state) deferredSpooledUpdateClaimsByKey.delete(claimKey);
			this.#deferredSpooledUpdateClaimKeys.delete(claimKey);
			if (result.kind === "failed-retryable") {
				if (state.timedOutMessage) {
					await this.#failTimedOutDeferredSpooledUpdate(state);
					return;
				}
				await this.#releaseFailedSpooledUpdate({
					err: result.error,
					update: params.update
				});
				return;
			}
			try {
				await deleteTelegramSpooledUpdate(params.update);
			} catch (err) {
				this.opts.log(`[telegram][diag] spooled update ${params.update.updateId} completed after buffered processing but processing marker cleanup failed: ${formatErrorMessage(err)}`);
			}
		};
		const state = {
			claimKey,
			laneKey: params.laneKey,
			task: params.deferredWork.task.then(finish, async (err) => {
				await finish({
					kind: "failed-retryable",
					error: err
				});
			}),
			update: params.update,
			updateId: params.update.updateId,
			stopClaimRefresh: params.stopClaimRefresh
		};
		state.timer = setTimeout(() => {
			const age = formatDurationPrecise(this.#spooledUpdateHandlerTimeoutMs);
			state.timedOutMessage = `Telegram isolated polling spool buffered processing timed out behind update ${params.update.updateId} on lane ${params.laneKey} after ${age}; marking the update failed, aborting active reply work, and keeping the claim out of retry while the buffered task settles.`;
			state.stopClaimRefresh();
			params.deferredWork.settle({
				kind: "failed-retryable",
				error: new Error(state.timedOutMessage)
			});
		}, this.#spooledUpdateHandlerTimeoutMs);
		state.timer.unref?.();
		deferredSpooledUpdateClaimsByKey.set(claimKey, state);
		this.#deferredSpooledUpdateClaimKeys.add(claimKey);
	}
	#isDeferredSpooledUpdateClaim(update) {
		return deferredSpooledUpdateClaimsByKey.has(buildDeferredSpooledUpdateClaimKey(update));
	}
	async #failTimedOutDeferredSpooledUpdate(state) {
		const message = state.timedOutMessage ?? `Telegram isolated polling spool buffered processing timed out behind update ${state.updateId} on lane ${state.laneKey}; marking the update failed.`;
		try {
			if (!await failTelegramSpooledUpdateClaim({
				update: state.update,
				reason: "handler-timeout",
				message
			})) {
				this.opts.log(`[telegram][diag] timed out buffered spooled update ${state.updateId} no longer had a processing marker to fail.`);
				this.#status.notePollingError(message);
				return;
			}
		} catch (err) {
			this.opts.log(`[telegram][diag] timed out buffered spooled update ${state.updateId} could not be marked failed: ${formatErrorMessage(err)}`);
			this.#status.notePollingError(message);
			return;
		}
		if (!supersedeTelegramReplyFenceLane(buildTelegramReplyFenceLaneKey({
			accountId: this.opts.accountId,
			sequentialKey: state.laneKey
		}))) this.opts.log(`[telegram][diag] timed out buffered spooled update ${state.updateId} had no active reply fence on lane ${state.laneKey}.`);
		this.opts.log(`[telegram] ${message}`);
		this.#status.notePollingError(message);
	}
	async #releaseFailedSpooledUpdate(params) {
		const nonRetryable = resolveNonRetryableSpooledUpdateFailure(params.err);
		if (nonRetryable) try {
			if (!await failTelegramSpooledUpdateClaim({
				update: params.update,
				reason: nonRetryable.reason,
				message: nonRetryable.message
			})) {
				this.opts.log(`[telegram][diag] spooled update ${params.update.updateId} failed with non-retryable ${nonRetryable.reason}, but no processing marker remained to dead-letter.`);
				return;
			}
			this.opts.log(`[telegram][diag] spooled update ${params.update.updateId} failed with non-retryable ${nonRetryable.reason}; dead-lettered: ${nonRetryable.message}`);
			return;
		} catch (failErr) {
			this.opts.log(`[telegram][diag] spooled update ${params.update.updateId} failed with non-retryable ${nonRetryable.reason}, but could not be dead-lettered: ${formatErrorMessage(failErr)}`);
		}
		try {
			await releaseTelegramSpooledUpdateClaim(params.update, { lastError: formatErrorMessage(params.err) });
		} catch (releaseErr) {
			this.opts.log(`[telegram][diag] spooled update ${params.update.updateId} failed and could not be requeued: ${formatErrorMessage(releaseErr)}`);
			return;
		}
		this.opts.log(`[telegram][diag] spooled update ${params.update.updateId} failed; keeping for retry: ${formatErrorMessage(params.err)}`);
	}
	async #waitForSpooledUpdateHandlers() {
		await Promise.allSettled([...[...this.#spooledUpdateHandlerKeys].map((handlerKey) => activeSpooledUpdateHandlersByLane.get(handlerKey)?.task).filter((task) => Boolean(task)), ...[...this.#deferredSpooledUpdateClaimKeys].map((claimKey) => deferredSpooledUpdateClaimsByKey.get(claimKey)?.task).filter((task) => Boolean(task))]);
	}
	#spooledUpdateLaneKey(update) {
		return this.#rawSpooledUpdateLaneKey(update.update);
	}
	#rawSpooledUpdateLaneKey(update) {
		return getTelegramSequentialKey({
			update,
			...this.opts.botInfo ? { me: this.opts.botInfo } : {}
		});
	}
	#activeSpooledUpdateHandlerKeysForSpool(spoolDir) {
		const handlerKeys = /* @__PURE__ */ new Set();
		for (const handlerKey of activeSpooledUpdateHandlersByLane.keys()) if (isSpooledUpdateHandlerKeyForSpool(handlerKey, spoolDir)) handlerKeys.add(handlerKey);
		return handlerKeys;
	}
	#activeSpooledUpdateLaneKeysForSpool(spoolDir) {
		const laneKeys = /* @__PURE__ */ new Set();
		for (const handlerKey of this.#activeSpooledUpdateHandlerKeysForSpool(spoolDir)) {
			const handler = activeSpooledUpdateHandlersByLane.get(handlerKey);
			if (handler) laneKeys.add(handler.laneKey);
		}
		return laneKeys;
	}
	async #drainSpooledUpdates(params) {
		const activeLaneKeys = this.#activeSpooledUpdateLaneKeysForSpool(params.spoolDir);
		await recoverStaleTelegramSpooledUpdateClaims({
			spoolDir: params.spoolDir,
			staleMs: 0,
			shouldRecover: (claim) => !this.#isDeferredSpooledUpdateClaim(claim) && !activeLaneKeys.has(this.#spooledUpdateLaneKey(claim)) && !isTelegramSpooledUpdateClaimOwnedByOtherLiveProcess(claim, { maxAgeMs: 18e5 })
		});
		const claimedLaneKeys = new Set((await listTelegramSpooledUpdateClaims({ spoolDir: params.spoolDir })).filter((claim) => !this.#isDeferredSpooledUpdateClaim(claim)).map((claim) => this.#spooledUpdateLaneKey(claim)));
		const updates = await listTelegramSpooledUpdates({
			spoolDir: params.spoolDir,
			limit: TELEGRAM_SPOOLED_DRAIN_SCAN_LIMIT
		});
		const candidateUpdateIds = updates.map((update) => update.updateId);
		const blockedByLane = /* @__PURE__ */ new Set();
		const retryDelayedLaneKeys = /* @__PURE__ */ new Set();
		for (const update of updates) {
			const laneKey = this.#spooledUpdateLaneKey(update);
			if (this.opts.abortSignal?.aborted) break;
			const handlerKey = buildSpooledUpdateHandlerKey({
				spoolDir: params.spoolDir,
				laneKey
			});
			if (activeSpooledUpdateHandlersByLane.has(handlerKey)) blockedByLane.add(handlerKey);
			if (resolveSpooledUpdateRetryDelayMs(update) > 0) retryDelayedLaneKeys.add(laneKey);
		}
		const blockedLaneKeys = new Set([
			...activeLaneKeys,
			...claimedLaneKeys,
			...retryDelayedLaneKeys
		]);
		let started = 0;
		while (started < TELEGRAM_SPOOLED_DRAIN_START_LIMIT) {
			if (this.opts.abortSignal?.aborted) break;
			const claimedUpdate = await this.#claimNextSpooledUpdate({
				blockedLaneKeys,
				candidateUpdateIds,
				spoolDir: params.spoolDir
			});
			if (!claimedUpdate) break;
			const laneKey = this.#spooledUpdateLaneKey(claimedUpdate);
			const handlerKey = buildSpooledUpdateHandlerKey({
				spoolDir: params.spoolDir,
				laneKey
			});
			if (activeSpooledUpdateHandlersByLane.has(handlerKey)) {
				blockedByLane.add(handlerKey);
				await releaseTelegramSpooledUpdateClaim(claimedUpdate, { lastError: "active Telegram spool handler already owns this lane" });
				blockedLaneKeys.add(laneKey);
				continue;
			}
			const stopClaimRefresh = this.#startSpooledUpdateClaimRefresh(claimedUpdate, params.isDrainHealthy, () => {
				if (!supersedeTelegramReplyFenceLane(buildTelegramReplyFenceLaneKey({
					accountId: this.opts.accountId,
					sequentialKey: laneKey
				}))) this.opts.log(`[telegram][diag] spooled update ${claimedUpdate.updateId} drain heartbeat expired without an active reply fence on lane ${laneKey}; stopping claim refresh.`);
			});
			const handler = this.#handleClaimedSpooledUpdate({
				bot: params.bot,
				stopClaimRefresh,
				update: claimedUpdate
			});
			const state = {
				handlerKey,
				laneKey,
				task: handler,
				update: claimedUpdate,
				updateId: claimedUpdate.updateId,
				startedAt: Date.now(),
				stopClaimRefresh
			};
			activeSpooledUpdateHandlersByLane.set(handlerKey, state);
			this.#spooledUpdateHandlerKeys.add(handlerKey);
			blockedLaneKeys.add(laneKey);
			handler.finally(() => {
				if (!deferredSpooledUpdateClaimsByKey.has(buildDeferredSpooledUpdateClaimKey(claimedUpdate))) state.stopClaimRefresh();
				if (activeSpooledUpdateHandlersByLane.get(handlerKey) === state) activeSpooledUpdateHandlersByLane.delete(handlerKey);
				this.#spooledUpdateHandlerKeys.delete(handlerKey);
			});
			started += 1;
		}
		return {
			blockedByLane,
			started
		};
	}
	#detectTimedOutSpooledHandler(blockedHandlerKeys) {
		const now = Date.now();
		let timedOut = null;
		for (const handlerKey of blockedHandlerKeys) {
			const handler = activeSpooledUpdateHandlersByLane.get(handlerKey);
			if (!handler || handler.timedOutAt !== void 0) continue;
			const ageMs = now - handler.startedAt;
			if (ageMs < this.#spooledUpdateHandlerTimeoutMs) continue;
			if (!timedOut || ageMs > timedOut.ageMs) timedOut = {
				handler,
				ageMs
			};
		}
		return timedOut;
	}
	async #recoverTimedOutSpooledHandler(blockedHandlerKeys) {
		const timedOutHandler = this.#detectTimedOutSpooledHandler(blockedHandlerKeys);
		if (!timedOutHandler) return null;
		const handler = timedOutHandler.handler;
		const activeHandler = activeSpooledUpdateHandlersByLane.get(handler.handlerKey);
		if (!activeHandler || activeHandler !== handler) return null;
		const age = formatDurationPrecise(timedOutHandler.ageMs);
		activeHandler.timedOutAt = Date.now();
		const message = `Telegram isolated polling spool handler timed out behind update ${handler.updateId} on lane ${handler.laneKey} after ${age}; marking the update failed, aborting active reply work, and restarting isolated ingress so later updates can drain.`;
		activeHandler.timeoutMessage = message;
		try {
			if (!await failTelegramSpooledUpdateClaim({
				update: handler.update,
				reason: "handler-timeout",
				message
			})) {
				this.opts.log(`[telegram][diag] timed out spooled update ${handler.updateId} no longer had a processing marker to fail.`);
				this.#status.notePollingError(message);
				return {
					handlerKey: handler.handlerKey,
					restart: false
				};
			}
		} catch (err) {
			this.opts.log(`[telegram][diag] timed out spooled update ${handler.updateId} could not be marked failed: ${formatErrorMessage(err)}`);
			this.#status.notePollingError(message);
			return {
				handlerKey: handler.handlerKey,
				restart: false
			};
		}
		if (!supersedeTelegramReplyFenceLane(buildTelegramReplyFenceLaneKey({
			accountId: this.opts.accountId,
			sequentialKey: handler.laneKey
		}))) this.opts.log(`[telegram][diag] timed out spooled update ${handler.updateId} had no active reply fence on lane ${handler.laneKey}; keeping the lane guarded until the handler stops.`);
		if (!await waitForSpooledHandlerTaskSettlement({
			task: handler.task,
			timeoutMs: this.#spooledUpdateHandlerAbortGraceMs,
			abortSignal: this.opts.abortSignal
		}) && activeSpooledUpdateHandlersByLane.get(handler.handlerKey) === activeHandler) {
			this.opts.log(`[telegram][diag] timed out spooled update ${handler.updateId} did not stop within ${formatDurationPrecise(this.#spooledUpdateHandlerAbortGraceMs)} after reply abort; keeping lane ${handler.laneKey} guarded.`);
			this.#status.notePollingError(message);
			return {
				handlerKey: handler.handlerKey,
				restart: false
			};
		}
		if (activeSpooledUpdateHandlersByLane.get(handler.handlerKey) === activeHandler) activeSpooledUpdateHandlersByLane.delete(handler.handlerKey);
		this.#spooledUpdateHandlerKeys.delete(handler.handlerKey);
		this.opts.log(`[telegram] ${message}`);
		this.#status.notePollingError(message);
		return {
			handlerKey: handler.handlerKey,
			restart: true
		};
	}
	async #runIsolatedIngressCycle(bot) {
		const ingress = this.opts.isolatedIngress;
		if (!ingress?.enabled) return this.#runPollingCycle(bot);
		try {
			await bot.init();
		} catch (err) {
			return await this.#waitBeforeRetryOnRecoverableSetupError(err, "Telegram bot init failed") ? "continue" : "exit";
		}
		const spoolDir = ingress.spoolDir ?? resolveTelegramIngressSpoolDir({ accountId: this.opts.accountId });
		const worker = (ingress.createWorker ?? createTelegramIngressWorker)({
			token: this.opts.token,
			accountId: this.opts.accountId,
			initialUpdateId: this.opts.getLastUpdateId(),
			spoolDir,
			apiRoot: ingress.apiRoot,
			timeoutSeconds: ingress.timeoutSeconds,
			network: ingress.network,
			proxy: ingress.proxy
		});
		let stopWorkerPromise;
		const stopWorker = () => {
			stopWorkerPromise ??= Promise.resolve(worker.stop()).then(() => void 0).catch(() => void 0);
			return stopWorkerPromise;
		};
		this.opts.log(`[telegram][diag] isolated polling ingress started spool=${spoolDir}`);
		const pollState = {
			startedAt: null,
			offset: null,
			outcome: "not-started",
			errorCode: null
		};
		const liveness = new TelegramPollingLivenessTracker();
		let consecutiveDrainFailures = 0;
		let restartRequested = false;
		let stalledRestart = false;
		let stopTimedOut = false;
		let forceCycleTimer;
		let forceCycleResolve;
		const forceCyclePromise = new Promise((resolve) => {
			forceCycleResolve = resolve;
		});
		const stalledBacklogKeys = /* @__PURE__ */ new Set();
		let requestImmediateDrain = () => void 0;
		let drainRequested = false;
		const unsubscribe = worker.onMessage((message) => {
			const ackSpooledUpdate = (requestId, result) => {
				try {
					worker.ackSpooledUpdate?.(requestId, result);
				} catch (err) {
					this.opts.log(`[telegram][diag] isolated polling worker ack failed: ${formatErrorMessage(err)}`);
				}
			};
			if (message.type === "poll-start") {
				liveness.noteGetUpdatesStarted({ offset: message.offset }, message.startedAt);
				pollState.startedAt = message.startedAt;
				pollState.offset = message.offset;
				pollState.outcome = "started";
				delete pollState.error;
				pollState.errorCode = null;
				return;
			}
			if (message.type === "poll-success") {
				liveness.noteGetUpdatesSuccessCount(message.count, message.finishedAt);
				liveness.noteGetUpdatesFinished();
				this.#noteHealthyPollingCycle();
				if (!restartRequested && stalledBacklogKeys.size === 0) this.#status.notePollSuccess(message.finishedAt);
				this.#drainPendingDeliveriesAfterReconnect();
				pollState.outcome = `ok:${message.count}`;
				return;
			}
			if (message.type === "poll-error") {
				liveness.noteGetUpdatesError(new Error(message.message), message.finishedAt);
				liveness.noteGetUpdatesFinished();
				pollState.outcome = "error";
				pollState.error = message.message;
				pollState.errorCode = message.errorCode ?? null;
				return;
			}
			if (message.type === "update") {
				writeTelegramSpooledUpdate({
					spoolDir,
					update: message.update,
					laneKey: this.#rawSpooledUpdateLaneKey(message.update)
				}).then((updateId) => {
					ackSpooledUpdate(message.requestId, {
						ok: true,
						updateId
					});
					requestImmediateDrain();
				}, (err) => {
					ackSpooledUpdate(message.requestId, {
						ok: false,
						message: formatErrorMessage(err)
					});
				});
				return;
			}
			if (message.type === "spooled") {
				liveness.noteGetUpdatesActivity();
				requestImmediateDrain();
			}
		});
		const stopOnAbort = () => {
			stopWorker();
		};
		this.opts.abortSignal?.addEventListener("abort", stopOnAbort, { once: true });
		const drainIntervalMs = Math.max(100, Math.floor(ingress.drainIntervalMs ?? 500));
		let drainActive = false;
		const drainHealth = getSpooledUpdateDrainHealth(spoolDir);
		const isDrainHealthy = () => Date.now() - drainHealth.lastCompletedAt <= TELEGRAM_SPOOLED_CLAIM_HEALTH_GRACE_MS;
		const stopBot = () => {
			return Promise.resolve(bot.stop()).then(() => void 0).catch(() => void 0);
		};
		const clearForceCycleTimer = () => {
			if (!forceCycleTimer) return;
			clearTimeout(forceCycleTimer);
			forceCycleTimer = void 0;
		};
		const requestStopForRestart = () => {
			if (restartRequested) return;
			restartRequested = true;
			stopWorker();
			if (!forceCycleTimer) forceCycleTimer = setTimeout(() => {
				if (this.opts.abortSignal?.aborted) return;
				this.opts.log(`[telegram] Isolated polling ingress stop timed out after ${formatDurationPrecise(POLL_STOP_GRACE_MS)}; forcing restart cycle.`);
				stopTimedOut = true;
				forceCycleResolve?.();
			}, POLL_STOP_GRACE_MS);
		};
		const drainOnce = async () => {
			if (restartRequested || this.opts.abortSignal?.aborted) return;
			if (drainActive) {
				drainRequested = true;
				return;
			}
			drainActive = true;
			drainRequested = false;
			let drainCompleted = false;
			try {
				const drain = await this.#drainSpooledUpdates({
					bot,
					isDrainHealthy,
					spoolDir
				});
				consecutiveDrainFailures = 0;
				for (const handlerKey of stalledBacklogKeys) if (!activeSpooledUpdateHandlersByLane.has(handlerKey) || !drain.blockedByLane.has(handlerKey)) stalledBacklogKeys.delete(handlerKey);
				for (const handlerKey of drain.blockedByLane) {
					const handler = activeSpooledUpdateHandlersByLane.get(handlerKey);
					if (handler?.timedOutAt === void 0) continue;
					stalledBacklogKeys.add(handlerKey);
					if (handler.timeoutMessage) this.#status.notePollingError(handler.timeoutMessage);
				}
				const timeoutCandidateHandlerKeys = this.#activeSpooledUpdateHandlerKeysForSpool(spoolDir);
				for (const handlerKey of drain.blockedByLane) timeoutCandidateHandlerKeys.add(handlerKey);
				const timedOutRecovery = await this.#recoverTimedOutSpooledHandler(timeoutCandidateHandlerKeys);
				if (timedOutRecovery?.restart) requestStopForRestart();
				else if (timedOutRecovery) stalledBacklogKeys.add(timedOutRecovery.handlerKey);
				drainCompleted = true;
			} catch (err) {
				consecutiveDrainFailures += 1;
				this.opts.log(`[telegram][diag] isolated polling spool drain failed (${consecutiveDrainFailures}): ${formatErrorMessage(err)}`);
			} finally {
				if (drainCompleted) drainHealth.lastCompletedAt = Date.now();
				drainActive = false;
				if (drainRequested && !restartRequested && !this.opts.abortSignal?.aborted) {
					drainRequested = false;
					drainOnce();
				}
			}
		};
		requestImmediateDrain = () => {
			drainOnce();
		};
		await drainOnce();
		const drainTimer = setInterval(() => {
			drainOnce();
		}, drainIntervalMs);
		drainTimer.unref?.();
		const watchdog = setInterval(() => {
			if (this.opts.abortSignal?.aborted || restartRequested) return;
			const stall = liveness.detectStall({ thresholdMs: this.#stallThresholdMs });
			if (!stall) return;
			this.#transportState.markDirty();
			stalledRestart = true;
			this.opts.log(`[telegram] ${stall.message}`);
			this.#status.notePollingError(stall.message);
			requestStopForRestart();
		}, POLL_WATCHDOG_INTERVAL_MS);
		watchdog.unref?.();
		try {
			try {
				await Promise.race([worker.task(), forceCyclePromise]);
				clearForceCycleTimer();
			} catch (err) {
				if (this.opts.abortSignal?.aborted) return "exit";
				const isConflict = pollState.errorCode === 409;
				if (isConflict) {
					this.#webhookCleared = false;
					this.#transportState.markDirty();
				} else if (pollState.error && !isRecoverableTelegramNetworkError(new Error(pollState.error), { context: "polling" })) {
					this.#status.notePollingError(pollState.error);
					throw new Error(pollState.error, { cause: err });
				}
				const message = isConflict ? `Telegram getUpdates conflict: ${pollState.error}.${TELEGRAM_GET_UPDATES_CONFLICT_HINT}` : formatErrorMessage(err);
				this.opts.log(`[telegram][diag] isolated polling ingress failed: ${message}`);
				this.#status.notePollingError(message);
				clearForceCycleTimer();
				return await this.#waitBeforeRestart((delay) => `Telegram isolated polling ingress failed; restarting in ${delay}.`) ? "continue" : "exit";
			}
			if (this.opts.abortSignal?.aborted) return "exit";
			if (restartRequested) {
				if (stalledRestart) this.opts.log(`[telegram][diag] isolated polling ingress finished reason=polling stall detected ${liveness.formatDiagnosticFields("error")}`);
				return await this.#waitBeforeRestart((delay) => `Telegram isolated polling ingress restart requested; restarting in ${delay}.`, { stopTimedOut }) ? "continue" : "exit";
			}
			const errorText = pollState.error ? ` error=${pollState.error}` : "";
			this.opts.log(`[telegram][diag] isolated polling ingress stopped outcome=${pollState.outcome} startedAt=${pollState.startedAt ?? "n/a"} offset=${pollState.offset ?? "n/a"}${errorText}`);
			return await this.#waitBeforeRestart((delay) => `Telegram isolated polling ingress stopped; restarting in ${delay}.`) ? "continue" : "exit";
		} finally {
			clearInterval(watchdog);
			clearInterval(drainTimer);
			clearForceCycleTimer();
			unsubscribe();
			this.opts.abortSignal?.removeEventListener("abort", stopOnAbort);
			await stopWorker();
			if (!restartRequested) {
				await drainOnce();
				await waitForGracefulStop(() => this.#waitForSpooledUpdateHandlers());
			}
			await waitForGracefulStop(stopBot);
		}
	}
	async #runPollingCycle(bot) {
		const liveness = new TelegramPollingLivenessTracker({ onPollSuccess: (finishedAt) => {
			this.#noteHealthyPollingCycle();
			this.#status.notePollSuccess(finishedAt);
			this.#drainPendingDeliveriesAfterReconnect();
		} });
		bot.api.config.use(async (prev, method, payload, signal) => {
			if (method !== "getUpdates") return await prev(method, payload, signal);
			liveness.noteGetUpdatesStarted(payload);
			try {
				const result = await prev(method, payload, signal);
				liveness.noteGetUpdatesSuccess(result);
				return result;
			} catch (err) {
				liveness.noteGetUpdatesError(err);
				throw err;
			} finally {
				liveness.noteGetUpdatesFinished();
			}
		});
		const runner = run(bot, this.opts.runnerOptions);
		this.opts.log(`[telegram][diag] polling cycle started ${liveness.formatDiagnosticFields()}`);
		this.#activeRunner = runner;
		const fetchAbortController = this.#activeFetchAbort;
		const abortFetch = () => {
			fetchAbortController?.abort();
		};
		if (this.opts.abortSignal && fetchAbortController) this.opts.abortSignal.addEventListener("abort", abortFetch, { once: true });
		let stopPromise;
		let stalledRestart = false;
		let forceCycleTimer;
		let forceCycleResolve;
		const forceCyclePromise = new Promise((resolve) => {
			forceCycleResolve = resolve;
		});
		const clearForceCycleTimer = () => {
			if (!forceCycleTimer) return;
			clearTimeout(forceCycleTimer);
			forceCycleTimer = void 0;
		};
		const stopRunner = () => {
			fetchAbortController?.abort();
			stopPromise ??= Promise.resolve(runner.stop()).then(() => void 0).catch(() => void 0);
			return stopPromise;
		};
		let stopBotPromise;
		const stopBot = () => {
			stopBotPromise ??= Promise.resolve(bot.stop()).then(() => void 0).catch(() => void 0);
			return stopBotPromise;
		};
		const stopOnAbort = () => {
			if (this.opts.abortSignal?.aborted) stopRunner();
		};
		let restartRequested = false;
		let stopTimedOut = false;
		const requestStopForRestart = () => {
			if (restartRequested) return;
			restartRequested = true;
			stopRunner();
			stopBot();
			if (!forceCycleTimer) forceCycleTimer = setTimeout(() => {
				if (this.opts.abortSignal?.aborted) return;
				this.opts.log(`[telegram] Polling runner stop timed out after ${formatDurationPrecise(POLL_STOP_GRACE_MS)}; forcing restart cycle.`);
				stopTimedOut = true;
				forceCycleResolve?.();
			}, POLL_STOP_GRACE_MS);
		};
		const watchdog = setInterval(() => {
			if (this.opts.abortSignal?.aborted || restartRequested) return;
			const stall = liveness.detectStall({ thresholdMs: this.#stallThresholdMs });
			if (stall) {
				this.#transportState.markDirty();
				stalledRestart = true;
				this.opts.log(`[telegram] ${stall.message}`);
				this.#status.notePollingError(stall.message);
				requestStopForRestart();
			}
		}, POLL_WATCHDOG_INTERVAL_MS);
		this.opts.abortSignal?.addEventListener("abort", stopOnAbort, { once: true });
		try {
			await Promise.race([runner.task(), forceCyclePromise]);
			clearForceCycleTimer();
			if (this.opts.abortSignal?.aborted) return "exit";
			const reason = stalledRestart ? "polling stall detected" : this.#forceRestarted ? "unhandled network error" : "runner stopped (maxRetryTime exceeded or graceful stop)";
			this.#forceRestarted = false;
			this.opts.log(`[telegram][diag] polling cycle finished reason=${reason} ${liveness.formatDiagnosticFields("error")}`);
			return await this.#waitBeforeRestart((delay) => `Telegram polling runner stopped (${reason}); restarting in ${delay}.`, { stopTimedOut }) ? "continue" : "exit";
		} catch (err) {
			this.#forceRestarted = false;
			if (this.opts.abortSignal?.aborted) throw err;
			const isConflict = isGetUpdatesConflict(err);
			if (isConflict) this.#webhookCleared = false;
			const isRecoverable = isRecoverableTelegramNetworkError(err, { context: "polling" });
			if (isRecoverable || isConflict) this.#transportState.markDirty();
			if (!isConflict && !isRecoverable) throw err;
			const reason = isConflict ? "getUpdates conflict" : "network error";
			const errMsg = formatErrorMessage(err);
			const conflictHint = isConflict ? TELEGRAM_GET_UPDATES_CONFLICT_HINT : "";
			this.opts.log(`[telegram][diag] polling cycle error reason=${reason} ${liveness.formatDiagnosticFields("lastGetUpdatesError")} err=${errMsg}${conflictHint}`);
			if (isConflict) this.#status.notePollingError(`Telegram ${reason}: ${errMsg}.${conflictHint}`);
			clearForceCycleTimer();
			return await this.#waitBeforeRestart((delay) => `Telegram ${reason}: ${errMsg};${conflictHint} retrying in ${delay}.`) ? "continue" : "exit";
		} finally {
			clearInterval(watchdog);
			clearForceCycleTimer();
			this.opts.abortSignal?.removeEventListener("abort", abortFetch);
			this.opts.abortSignal?.removeEventListener("abort", stopOnAbort);
			await waitForGracefulStop(stopRunner);
			await waitForGracefulStop(stopBot);
			this.#activeRunner = void 0;
			if (this.#activeFetchAbort === fetchAbortController) this.#activeFetchAbort = void 0;
		}
	}
};
const isGetUpdatesConflict = (err) => {
	if (!err || typeof err !== "object") return false;
	const typed = err;
	if ((typed.error_code ?? typed.errorCode) !== 409) return false;
	return normalizeLowercaseStringOrEmpty([
		typed.method,
		typed.description,
		typed.message
	].filter((value) => typeof value === "string").join(" ")).includes("getupdates");
};
//#endregion
export { TelegramPollingSession, deleteTelegramUpdateOffset, readTelegramUpdateOffset, writeTelegramUpdateOffset };
