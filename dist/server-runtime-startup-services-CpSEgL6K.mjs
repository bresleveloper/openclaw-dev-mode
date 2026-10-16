import { F as resolveTimerTimeoutMs, g as isFutureDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-De0PJqUq.mjs";
import { a as resolveChannelRestartReason, r as evaluateChannelHealth } from "./channel-health-policy-CQLQKpCe.mjs";
//#region src/gateway/channel-health-monitor.ts
const log = createSubsystemLogger("gateway/health-monitor");
const DEFAULT_CHECK_INTERVAL_MS = 3e5;
const DEFAULT_MONITOR_STARTUP_GRACE_MS = 6e4;
const DEFAULT_COOLDOWN_CYCLES = 2;
const DEFAULT_MAX_RESTARTS_PER_HOUR = 10;
const CHANNEL_HEALTH_MONITOR_HANDOFF_TIMEOUT_MS = 5e3;
const ONE_HOUR_MS = 36e5;
function startChannelHealthMonitor(deps) {
	const { channelManager, cooldownCycles = DEFAULT_COOLDOWN_CYCLES, maxRestartsPerHour = DEFAULT_MAX_RESTARTS_PER_HOUR, abortSignal } = deps;
	const checkIntervalMs = resolveTimerTimeoutMs(deps.checkIntervalMs, DEFAULT_CHECK_INTERVAL_MS);
	const timing = {
		monitorStartupGraceMs: deps.timing?.monitorStartupGraceMs ?? DEFAULT_MONITOR_STARTUP_GRACE_MS,
		channelConnectGraceMs: deps.timing?.channelConnectGraceMs ?? 12e4,
		staleEventThresholdMs: deps.timing?.staleEventThresholdMs ?? 18e5
	};
	const scheduler = deps.scheduler.scope();
	const cooldownMs = cooldownCycles * checkIntervalMs;
	const restartRecords = /* @__PURE__ */ new Map();
	const startedAt = scheduler.now();
	let stopped = false;
	let abandonInFlightRestart = false;
	let activeCheck = null;
	const suppressedAccounts = /* @__PURE__ */ new Set();
	async function runCheckWork() {
		try {
			const now = scheduler.now();
			if (!isFutureDateTimestampMs(startedAt, { nowMs: now }) && now - startedAt < timing.monitorStartupGraceMs) return;
			if (channelManager.getAutostartSuppression() !== null) await channelManager.recoverAutostartSuppression(scheduler.signal);
			const snapshot = channelManager.getRuntimeSnapshot();
			const globalAutostartSuppression = channelManager.getAutostartSuppression();
			for (const [channelId, accounts] of Object.entries(snapshot.channelAccounts)) {
				if (!accounts || snapshot.reloadingChannels?.has(channelId)) continue;
				const autostartSuppressed = globalAutostartSuppression !== null || channelManager.isAmbientAutostartSuppressed(channelId);
				for (const [accountId, status] of Object.entries(accounts)) {
					if (stopped) return;
					if (!status) continue;
					if (!channelManager.isAccountListed(channelId, accountId)) continue;
					if (!channelManager.isHealthMonitorEnabled(channelId, accountId)) continue;
					if (channelManager.isManuallyStopped(channelId, accountId)) continue;
					const key = `${channelId}:${accountId}`;
					if (autostartSuppressed) {
						if (status.running !== true && !suppressedAccounts.has(key)) {
							log.info(`[${channelId}:${accountId}] health-monitor: channel autostart suppressed; treating as expected stopped`);
							suppressedAccounts.add(key);
						}
						continue;
					}
					suppressedAccounts.delete(key);
					const pendingRestartState = status.running !== true && status.restartPending === true && (status.reconnectAttempts ?? 0) === 0;
					const leftPendingRestart = status.running === true || status.restartPending !== true;
					const trackedRecord = restartRecords.get(key);
					if (trackedRecord?.pendingContinuationUsed && leftPendingRestart) trackedRecord.pendingContinuationUsed = false;
					const health = evaluateChannelHealth(status, {
						channelId,
						now,
						staleEventThresholdMs: timing.staleEventThresholdMs,
						channelConnectGraceMs: timing.channelConnectGraceMs
					});
					if (health.healthy) continue;
					if (health.reason === "terminal-disconnect" || health.reason === "blocked") {
						log.info(`[${channelId}:${accountId}] health-monitor: skipping restart, ${health.reason}`);
						continue;
					}
					if (channelManager.isAutoRestartScheduled(channelId, accountId)) continue;
					const record = restartRecords.get(key) ?? {
						lastRestartAt: 0,
						restartsThisHour: []
					};
					const continuingPendingRestart = pendingRestartState && record.pendingContinuationUsed !== true;
					if (!continuingPendingRestart && !isFutureDateTimestampMs(record.lastRestartAt, { nowMs: now }) && now - record.lastRestartAt <= cooldownMs) continue;
					record.restartsThisHour = record.restartsThisHour.filter((r) => !isFutureDateTimestampMs(r.at, { nowMs: now }) && now - r.at < ONE_HOUR_MS);
					if (!continuingPendingRestart && record.restartsThisHour.length >= maxRestartsPerHour) {
						log.warn(`[${channelId}:${accountId}] health-monitor: hit ${maxRestartsPerHour} restarts/hour limit, skipping`);
						continue;
					}
					const reason = resolveChannelRestartReason(status, health);
					log.info(`[${channelId}:${accountId}] health-monitor: restarting (reason: ${reason})`);
					if (continuingPendingRestart) record.pendingContinuationUsed = true;
					else {
						record.lastRestartAt = now;
						record.restartsThisHour.push({ at: now });
					}
					restartRecords.set(key, record);
					try {
						if (status.running) await channelManager.stopChannel(channelId, accountId, { manual: false });
						if (abandonInFlightRestart) return;
						if (!channelManager.isAccountListed(channelId, accountId)) continue;
						channelManager.resetRestartAttempts(channelId, accountId);
						await channelManager.startChannel(channelId, accountId);
					} catch (err) {
						log.error(`[${channelId}:${accountId}] health-monitor: restart failed: ${String(err)}`);
					}
				}
			}
		} catch (err) {
			if (!scheduler.signal.aborted) log.error(`health-monitor: check failed: ${String(err)}`);
		}
	}
	function runCheck() {
		activeCheck = runCheckWork().finally(() => {
			activeCheck = null;
			if (stopped) abortSignal?.removeEventListener("abort", shutdown);
		});
		return activeCheck;
	}
	function retire(abandonRestart) {
		stopped = true;
		abandonInFlightRestart ||= abandonRestart;
		scheduler.beginClose();
		if (!activeCheck) abortSignal?.removeEventListener("abort", shutdown);
	}
	const stop = () => retire(false);
	const shutdown = () => retire(true);
	const waitForIdle = async () => {
		const check = activeCheck;
		if (!check) return;
		if (!await settlesWithin(check, CHANNEL_HEALTH_MONITOR_HANDOFF_TIMEOUT_MS)) {
			shutdown();
			log.warn(`health-monitor handoff exceeded ${CHANNEL_HEALTH_MONITOR_HANDOFF_TIMEOUT_MS}ms; abandoning delayed restart`);
		}
	};
	if (abortSignal?.aborted) {
		stopped = true;
		abandonInFlightRestart = true;
	} else {
		abortSignal?.addEventListener("abort", shutdown, { once: true });
		scheduler.schedule({
			id: "channel-health-monitor",
			atMs: startedAt + resolveTimerTimeoutMs(timing.monitorStartupGraceMs, 0, 0),
			everyMs: checkIntervalMs,
			run: runCheck
		});
		log.info(`started (interval: ${Math.round(checkIntervalMs / 1e3)}s, startup-grace: ${Math.round(timing.monitorStartupGraceMs / 1e3)}s, channel-connect-grace: ${Math.round(timing.channelConnectGraceMs / 1e3)}s)`);
	}
	return {
		stop,
		shutdown,
		waitForIdle
	};
}
//#endregion
//#region src/gateway/server-runtime-startup-services.ts
/** Starts channel health monitoring unless process configuration suppresses channels. */
function startGatewayChannelHealthMonitor(params) {
	if (isChannelStartupSuppressedByEnvironment(params.env)) return null;
	return startChannelHealthMonitor({
		scheduler: params.scheduler,
		channelManager: params.channelManager
	});
}
//#endregion
export { startGatewayChannelHealthMonitor as t };
