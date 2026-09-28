import { n as computeBackoff, s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as formatDurationPrecise } from "./format-duration-CeDWULoS.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import { d as isRecoverableTelegramNetworkError } from "./fetch-BZlDgFP3.mjs";
import { t as TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS } from "./request-timeouts-CO4jVbzH.mjs";
import { n as createTelegramIngressWorker } from "./telegram-ingress-worker-B9CslnTq.mjs";
import { t as drainPendingDeliveries } from "./delivery-queue-runtime-D5TE4FUs.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import { n as channelReadyPatch, o as createTransportActivityStatusPatch } from "./channel-status-patches-BS8oeT90.mjs";
import "./gateway-runtime-BCC8MoQW.mjs";
import { c as writeTelegramUpdateOffset, o as readTelegramUpdateOffset, r as deleteTelegramUpdateOffset } from "./update-offset-store-nORl6cFs.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-DUw1mOtG.mjs";
import { a as resolveTelegramUpdateId, i as resolveTelegramIngressSpoolDir } from "./bot-message-D3PTBgdd.mjs";
import { n as resolveTelegramAdoptionStallTimeoutMs, r as createTelegramBot, t as createTelegramTransportIngressMonitor } from "./telegram-ingress-drain-factory-BteJBliX.mjs";
//#region extensions/telegram/src/polling-liveness.ts
var TelegramPollingLivenessTracker = class {
	#lastGetUpdatesActivityMonotonicAt;
	#lastGetUpdatesStartedAt = null;
	#lastGetUpdatesStartedMonotonicAt = null;
	#lastGetUpdatesFinishedAt = null;
	#lastGetUpdatesDurationMs = null;
	#lastGetUpdatesOutcome = "not-started";
	#lastGetUpdatesError = null;
	#lastGetUpdatesOffset = null;
	#inFlightGetUpdates = 0;
	#stallDiagLoggedMonotonicAt = 0;
	#lastStallCheckMonotonicAt;
	#retryAfterUntilMonotonicAt = null;
	constructor(options = {}) {
		this.options = options;
		const monotonicNow = this.#monotonicNow();
		this.#lastGetUpdatesActivityMonotonicAt = monotonicNow;
		this.#lastStallCheckMonotonicAt = monotonicNow;
	}
	noteGetUpdatesStarted(payload, at = this.#now()) {
		const startedMonotonicAt = this.#monotonicNow();
		this.#retryAfterUntilMonotonicAt = null;
		this.#lastGetUpdatesActivityMonotonicAt = startedMonotonicAt;
		this.#lastGetUpdatesStartedAt = at;
		this.#lastGetUpdatesStartedMonotonicAt = startedMonotonicAt;
		this.#lastGetUpdatesFinishedAt = null;
		this.#lastGetUpdatesDurationMs = null;
		this.#lastGetUpdatesOffset = resolveGetUpdatesOffset(payload);
		this.#inFlightGetUpdates += 1;
		this.#lastGetUpdatesOutcome = "started";
		this.#lastGetUpdatesError = null;
	}
	noteGetUpdatesSuccessCount(count, at = this.#now()) {
		this.#noteGetUpdatesCompleted(at);
		const normalizedCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
		this.#lastGetUpdatesOutcome = `ok:${normalizedCount}`;
	}
	noteGetUpdatesError(err, at = this.#now(), retryAfterMs) {
		this.#noteGetUpdatesCompleted(at);
		if (retryAfterMs !== void 0 && Number.isFinite(retryAfterMs) && retryAfterMs > 0) this.#retryAfterUntilMonotonicAt = this.#monotonicNow() + retryAfterMs;
		this.#lastGetUpdatesOutcome = "error";
		this.#lastGetUpdatesError = formatErrorMessage(err);
	}
	noteGetUpdatesFinished() {
		this.#inFlightGetUpdates = Math.max(0, this.#inFlightGetUpdates - 1);
	}
	noteGetUpdatesActivity() {
		this.#lastGetUpdatesActivityMonotonicAt = this.#monotonicNow();
	}
	detectStall(params) {
		const monotonicNow = this.#monotonicNow();
		const checkGap = monotonicNow - this.#lastStallCheckMonotonicAt;
		this.#lastStallCheckMonotonicAt = monotonicNow;
		if (checkGap > params.thresholdMs * 2) {
			this.#lastGetUpdatesActivityMonotonicAt = monotonicNow;
			return null;
		}
		if (this.#inFlightGetUpdates === 0 && this.#retryAfterUntilMonotonicAt !== null && monotonicNow <= this.#retryAfterUntilMonotonicAt) return null;
		const elapsed = monotonicNow - this.#lastGetUpdatesActivityMonotonicAt;
		if (elapsed <= params.thresholdMs) return null;
		if (this.#stallDiagLoggedMonotonicAt && monotonicNow - this.#stallDiagLoggedMonotonicAt < params.thresholdMs / 2) return null;
		this.#stallDiagLoggedMonotonicAt = monotonicNow;
		return { message: `Polling stall detected (${this.#inFlightGetUpdates > 0 ? `active getUpdates stuck for ${formatDurationPrecise(elapsed)}` : `no completed getUpdates for ${formatDurationPrecise(elapsed)}`}); forcing restart. [diag ${this.formatDiagnosticFields("error")}]` };
	}
	formatDiagnosticFields(errorLabel) {
		const error = this.#lastGetUpdatesError && errorLabel ? ` ${errorLabel}=${this.#lastGetUpdatesError}` : "";
		return `inFlight=${this.#inFlightGetUpdates} outcome=${this.#lastGetUpdatesOutcome} startedAt=${this.#lastGetUpdatesStartedAt ?? "n/a"} finishedAt=${this.#lastGetUpdatesFinishedAt ?? "n/a"} durationMs=${this.#lastGetUpdatesDurationMs ?? "n/a"} offset=${this.#lastGetUpdatesOffset ?? "n/a"}${error}`;
	}
	#now() {
		return this.options.now?.() ?? Date.now();
	}
	#monotonicNow() {
		return this.options.monotonicNow?.() ?? performance.now();
	}
	#noteGetUpdatesCompleted(finishedAt) {
		const finishedMonotonicAt = this.#monotonicNow();
		this.#retryAfterUntilMonotonicAt = null;
		this.#lastGetUpdatesActivityMonotonicAt = finishedMonotonicAt;
		this.#lastGetUpdatesFinishedAt = finishedAt;
		this.#lastGetUpdatesDurationMs = this.#lastGetUpdatesStartedMonotonicAt == null ? null : finishedMonotonicAt - this.#lastGetUpdatesStartedMonotonicAt;
	}
};
function resolveGetUpdatesOffset(payload) {
	if (!payload || typeof payload !== "object" || !("offset" in payload)) return null;
	const offset = payload.offset;
	return typeof offset === "number" ? offset : null;
}
//#endregion
//#region extensions/telegram/src/polling-session-restart-policy.ts
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
			setStatus?.(channelReadyPatch({
				lastConnectedAt: at,
				lastEventAt: at,
				...createTransportActivityStatusPatch(at),
				mode: "polling"
			}));
		},
		notePollingRecovery() {
			setStatus?.({ lifecycle: "recovering" });
		},
		notePollingError(error, lifecycle) {
			setStatus?.({
				mode: "polling",
				connected: false,
				...lifecycle ? { lifecycle } : {},
				...lifecycle === "blocked" ? { terminalDisconnect: true } : {},
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
			this.opts.log(`[telegram][diag] failed to close transport during dispose: ${formatErrorMessage(err)}`);
		}
	}
	#closeTransportAsync(transport, context) {
		transport.close().catch((err) => {
			this.opts.log(`[telegram][diag] failed to close transport (${context}): ${formatErrorMessage(err)}`);
		});
	}
};
//#endregion
//#region extensions/telegram/src/polling-session.ts
const TELEGRAM_GET_UPDATES_CONFLICT_HINT = " Another OpenClaw gateway, script, or Telegram poller may be using this bot token; stop the duplicate poller or switch this account to webhook mode.";
const DEFAULT_POLL_STALL_THRESHOLD_MS = 12e4;
const MIN_POLL_STALL_THRESHOLD_MS = 3e4;
const TELEGRAM_DELIVERY_DRAIN_INTERVAL_MS = 5e3;
const MAX_POLL_STALL_THRESHOLD_MS = 6e5;
const POLL_WATCHDOG_INTERVAL_MS = 3e4;
const POLL_STOP_GRACE_MS = 15e3;
const TELEGRAM_POLLING_CLIENT_TIMEOUT_FLOOR_SECONDS = Math.ceil(TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS / 1e3);
function normalizeTelegramAccountId(accountId) {
	return accountId?.trim() || "default";
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
const resolvePollingStallThresholdMs = (value) => {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_POLL_STALL_THRESHOLD_MS;
	return Math.min(MAX_POLL_STALL_THRESHOLD_MS, Math.max(MIN_POLL_STALL_THRESHOLD_MS, Math.floor(value)));
};
var TelegramPollingSession = class {
	#restartBackoffState = createTelegramRestartBackoffState();
	#webhookCleared = false;
	#activeCycleAbort;
	#transportState;
	#status;
	#stallThresholdMs;
	#spooledUpdateHandlerTimeoutMs;
	#deliveryDrainInFlight = false;
	#nextDeliveryDrainAt = 0;
	constructor(opts) {
		this.opts = opts;
		this.#transportState = new TelegramPollingTransportState({
			log: opts.log,
			initialTransport: opts.telegramTransport,
			createTelegramTransport: opts.createTelegramTransport
		});
		this.#status = createTelegramPollingStatusPublisher(opts.setStatus);
		this.#stallThresholdMs = resolvePollingStallThresholdMs(opts.stallThresholdMs);
		this.#spooledUpdateHandlerTimeoutMs = resolveTelegramAdoptionStallTimeoutMs({
			...opts.ingress.spooledUpdateHandlerTimeoutMs !== void 0 ? { configured: opts.ingress.spooledUpdateHandlerTimeoutMs } : {},
			env: process.env
		});
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
				if (await this.#runPollingCycle(bot) === "exit") return;
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
		this.#status.notePollingRecovery();
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
	#maybeDrainPendingDeliveries(finishedAt) {
		if (finishedAt < this.#nextDeliveryDrainAt) return;
		this.#nextDeliveryDrainAt = finishedAt + TELEGRAM_DELIVERY_DRAIN_INTERVAL_MS;
		this.#drainPendingDeliveriesAfterReconnect();
	}
	#rearmPendingDeliveryDrain() {
		this.#nextDeliveryDrainAt = 0;
	}
	async #createPollingBot() {
		const cycleAbortController = new AbortController();
		this.#activeCycleAbort = cycleAbortController;
		const cycleAbortSignal = this.opts.abortSignal ? AbortSignal.any([this.opts.abortSignal, cycleAbortController.signal]) : cycleAbortController.signal;
		const telegramTransport = this.#transportState.acquireForNextCycle();
		const updateOffset = {
			lastUpdateId: null,
			persistenceFloorUpdateId: this.opts.getCommittedUpdateId()
		};
		try {
			return createTelegramBot({
				token: this.opts.token,
				runtime: this.opts.runtime,
				buildContext: this.opts.buildContext,
				dispatchReplyFromConfig: this.opts.dispatchReplyFromConfig,
				proxyFetch: this.opts.proxyFetch,
				config: this.opts.config,
				accountId: this.opts.accountId,
				ownerAgentId: this.opts.ownerAgentId,
				botInfo: this.opts.botInfo,
				...this.opts.abortSignal ? { fetchAbortSignal: this.opts.abortSignal } : {},
				...this.opts.abortSignal ? { accountAbortSignal: this.opts.abortSignal } : {},
				mediaAbortSignal: cycleAbortSignal,
				minimumClientTimeoutSeconds: TELEGRAM_POLLING_CLIENT_TIMEOUT_FLOOR_SECONDS,
				updateOffset,
				telegramTransport
			});
		} catch (err) {
			await this.#waitBeforeRetryOnRecoverableSetupError(err, "Telegram setup network error");
			if (this.#activeCycleAbort === cycleAbortController) this.#activeCycleAbort = void 0;
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
	async #runPollingCycle(bot) {
		const ingress = this.opts.ingress;
		const cycleAbortController = this.#activeCycleAbort;
		const abortMedia = () => {
			cycleAbortController?.abort();
		};
		try {
			await bot.init();
		} catch (err) {
			abortMedia();
			if (this.#activeCycleAbort === cycleAbortController) this.#activeCycleAbort = void 0;
			return await this.#waitBeforeRetryOnRecoverableSetupError(err, "Telegram bot init failed") ? "continue" : "exit";
		}
		const botInfo = bot.botInfo;
		const spoolDir = ingress.spoolDir ?? resolveTelegramIngressSpoolDir({ accountId: this.opts.accountId });
		const drainIntervalMs = Math.max(100, Math.floor(ingress.drainIntervalMs ?? 500));
		const ingressAbortSignal = cycleAbortController ? this.opts.abortSignal ? AbortSignal.any([cycleAbortController.signal, this.opts.abortSignal]) : cycleAbortController.signal : this.opts.abortSignal;
		const ingressMonitor = createTelegramTransportIngressMonitor({
			spoolDir,
			bot,
			accountId: this.opts.accountId,
			botInfo,
			adoptionStallTimeoutMs: this.#spooledUpdateHandlerTimeoutMs,
			pollIntervalMs: drainIntervalMs,
			...ingressAbortSignal ? { abortSignal: ingressAbortSignal } : {},
			onLog: (message) => this.opts.log(message),
			onError: (error) => this.opts.log(`[telegram][diag] isolated polling spool drain failed: ${formatErrorMessage(error)}`)
		});
		const worker = (ingress.createWorker ?? createTelegramIngressWorker)({
			token: this.opts.token,
			accountId: this.opts.accountId,
			initialUpdateId: this.opts.getCommittedUpdateId(),
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
		let restartRequested = false;
		let stalledRestart = false;
		let stopTimedOut = false;
		let forceCycleTimer;
		let forceCycleResolve;
		const forceCyclePromise = new Promise((resolve) => {
			forceCycleResolve = resolve;
		});
		const endCycle = () => {
			abortMedia();
		};
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
				if (!restartRequested) this.#status.notePollSuccess(message.finishedAt);
				this.#maybeDrainPendingDeliveries(message.finishedAt);
				pollState.outcome = `ok:${message.count}`;
				return;
			}
			if (message.type === "poll-error") {
				this.#rearmPendingDeliveryDrain();
				const retryAfterMs = message.errorCode === 429 && message.retryAfterMs !== void 0 && Number.isFinite(message.retryAfterMs) && message.retryAfterMs > 0 ? Math.min(message.retryAfterMs, MAX_POLL_STALL_THRESHOLD_MS) : void 0;
				liveness.noteGetUpdatesError(new Error(message.message), message.finishedAt, retryAfterMs);
				liveness.noteGetUpdatesFinished();
				pollState.outcome = "error";
				pollState.error = message.message;
				pollState.errorCode = message.errorCode ?? null;
				return;
			}
			if (message.type === "update") {
				const updateIdHint = resolveTelegramUpdateId(message.update) ?? "unknown";
				this.opts.log(`[telegram][diag] isolated polling worker update received updateId=${updateIdHint} queued=${message.queued}`);
				(async () => {
					const updateId = resolveTelegramUpdateId(message.update);
					if (updateId === null) {
						ackSpooledUpdate(message.requestId, {
							ok: false,
							message: "Telegram update missing numeric update_id."
						});
						return;
					}
					try {
						await ingressMonitor.admit(message.update);
						this.opts.log(`[telegram][diag] isolated polling update spooled updateId=${updateId}`);
					} catch (err) {
						this.opts.log(`[telegram] isolated polling update spool failed updateId=${updateIdHint}: ${formatErrorMessage(err)}`);
						ackSpooledUpdate(message.requestId, {
							ok: false,
							message: formatErrorMessage(err)
						});
						return;
					}
					const offsetPersistence = this.opts.persistUpdateId(updateId);
					Promise.resolve(offsetPersistence).catch((err) => {
						if (!this.opts.abortSignal?.aborted) this.opts.log(`[telegram] isolated polling offset persist failed updateId=${updateId}: ${formatErrorMessage(err)}`);
					});
					this.opts.log(`[telegram][diag] isolated polling offset queued updateId=${updateId}`);
					ackSpooledUpdate(message.requestId, {
						ok: true,
						updateId
					});
				})();
				return;
			}
			if (message.type === "spooled") {
				liveness.noteGetUpdatesActivity();
				ingressMonitor.requestDrain();
			}
		});
		const stopOnAbort = () => {
			endCycle();
			stopWorker();
		};
		this.opts.abortSignal?.addEventListener("abort", stopOnAbort, { once: true });
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
			endCycle();
			stopWorker();
			if (!forceCycleTimer) forceCycleTimer = setTimeout(() => {
				if (this.opts.abortSignal?.aborted) return;
				this.opts.log(`[telegram] Isolated polling ingress stop timed out after ${formatDurationPrecise(POLL_STOP_GRACE_MS)}; forcing restart cycle.`);
				stopTimedOut = true;
				forceCycleResolve?.();
			}, POLL_STOP_GRACE_MS);
		};
		ingressMonitor.start();
		const watchdog = setInterval(() => {
			if (this.opts.abortSignal?.aborted || restartRequested) return;
			const stall = liveness.detectStall({ thresholdMs: this.#stallThresholdMs });
			if (!stall) return;
			this.#transportState.markDirty();
			stalledRestart = true;
			this.opts.log(`[telegram] ${stall.message}`);
			this.#status.notePollingError(stall.message, "recovering");
			requestStopForRestart();
		}, POLL_WATCHDOG_INTERVAL_MS);
		watchdog.unref?.();
		try {
			try {
				await Promise.race([worker.task(), forceCyclePromise]);
				clearForceCycleTimer();
				endCycle();
			} catch (err) {
				if (this.opts.abortSignal?.aborted) return "exit";
				endCycle();
				const isConflict = pollState.errorCode === 409;
				if (isConflict) {
					this.#webhookCleared = false;
					this.#transportState.markDirty();
				} else if (pollState.error && !isRecoverableTelegramNetworkError(new Error(pollState.error), { context: "polling" })) {
					this.#status.notePollingError(pollState.error, pollState.errorCode === 401 || pollState.errorCode === 404 ? "blocked" : void 0);
					throw new Error(pollState.error, { cause: err });
				}
				const message = isConflict ? `Telegram getUpdates conflict: ${pollState.error}.${TELEGRAM_GET_UPDATES_CONFLICT_HINT}` : formatErrorMessage(err);
				this.opts.log(`[telegram][diag] isolated polling ingress failed: ${message}`);
				this.#status.notePollingError(message, "recovering");
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
			clearForceCycleTimer();
			unsubscribe();
			this.opts.abortSignal?.removeEventListener("abort", stopOnAbort);
			endCycle();
			await stopWorker();
			await waitForGracefulStop(() => ingressMonitor.stop());
			await ingressMonitor.waitForDeferredClaims();
			await waitForGracefulStop(stopBot);
			if (this.#activeCycleAbort === cycleAbortController) this.#activeCycleAbort = void 0;
		}
	}
};
//#endregion
export { TelegramPollingSession, deleteTelegramUpdateOffset, readTelegramUpdateOffset, writeTelegramUpdateOffset };
