import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { a as setHeartbeatWakeHandler, d as isSessionEventWakePollDeferred, l as getSessionEventWakeAbortSignal, s as areSessionEventWakesEnabled, u as isRetryableSessionEventWakeReason } from "./heartbeat-wake-bWS25cgK.mjs";
import { a as resolveHeartbeatForWake, c as tryResolveAmbientHeartbeatAgentId, o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents, t as isHeartbeatOwnerUnresolved } from "./heartbeat-config-BvP-hlUW.mjs";
import { a as heartbeatLog, n as isConfiguredHeartbeatAgent, r as isTargetedUnscheduledWake } from "./heartbeat-wake-policy-BPyPMTAu.mjs";
//#region src/infra/heartbeat-cooldown.ts
const DEFAULT_MIN_WAKE_SPACING_MS = 3e4;
const DEFAULT_FLOOD_WINDOW_MS = 6e4;
const DEFAULT_FLOOD_THRESHOLD = 5;
/**
* Decide whether an incoming wake should be deferred.
*
* The decision matrix:
*
* | Wake intent   | First wake (no prior run) | Subsequent wakes                       |
* |---------------|----------------------------|-----------------------------------------|
* | manual        | Run                        | Run (never deferred)                    |
* | immediate     | Run                        | Run (never deferred, except flood)      |
* | scheduled     | Defer if now < nextDueMs   | Defer if now < nextDueMs                |
* | task          | Run                        | Defer only within floor or on flood      |
* | event         | Run (bootstrap responsive) | Defer if now < nextDueMs OR within floor |
*
* Immediate is for documented wake-now delivery paths such as `openclaw system
* event --mode now`, task completion follow-ups, cron `--wake now`, and
* `/hooks/wake mode=now`. Event is for external/system notifications such as
* background exec exits, node notification changes, hook/cron next-heartbeat
* handoffs, ACP spawn stream updates, and retry wakes.
*
* Additional gates layered on top of the reason matrix:
*
*   1. **Minimum spacing floor** (`min-spacing`): even if `nextDueMs` has been
*      passed, defer if a run started within the last `minSpacingMs`. Catches
*      the race where a second wake arrives between `runOnce` returning and
*      `advanceAgentSchedule` updating `nextDueMs`.
*   2. **Flood guard** (`flood`): if `recentRunStarts` shows ≥ `floodThreshold`
*      runs within `floodWindowMs`, defer regardless of reason (except
*      `manual`-class immediate intent). Caller should also emit a single
*      warning log when this fires.
*/
function shouldDeferWake(input) {
	if (input.intent === "manual") return { defer: false };
	if (input.intent === "immediate") return checkFloodGuard(input) ?? { defer: false };
	if (input.intent === "task") {
		const floodDefer = checkFloodGuard(input);
		if (floodDefer) return floodDefer;
		const spacingRetryAtMs = resolveMinSpacingRetryAtMs(input);
		if (spacingRetryAtMs !== void 0) return {
			defer: true,
			reason: "min-spacing",
			retryAtMs: spacingRetryAtMs
		};
		return { defer: false };
	}
	const floodDefer = checkFloodGuard(input);
	if (floodDefer) return floodDefer;
	if (input.intent === "scheduled") return input.now < input.nextDueMs ? {
		defer: true,
		reason: "not-due",
		retryAtMs: input.nextDueMs
	} : { defer: false };
	if (input.lastRunStartedAtMs === void 0) return { defer: false };
	if (!input.retainedWork && input.now < input.nextDueMs) {
		const spacingRetryAtMs = resolveMinSpacingRetryAtMs(input);
		return {
			defer: true,
			reason: "not-due",
			retryAtMs: Math.min(input.nextDueMs, spacingRetryAtMs ?? input.nextDueMs)
		};
	}
	const spacingRetryAtMs = resolveMinSpacingRetryAtMs(input);
	if (spacingRetryAtMs !== void 0) return {
		defer: true,
		reason: "min-spacing",
		retryAtMs: spacingRetryAtMs
	};
	return { defer: false };
}
function resolveMinSpacingRetryAtMs(input) {
	const minSpacing = input.minSpacingMs ?? DEFAULT_MIN_WAKE_SPACING_MS;
	if (minSpacing <= 0 || input.lastRunStartedAtMs === void 0) return;
	const retryAtMs = input.lastRunStartedAtMs + minSpacing;
	return input.now < retryAtMs ? retryAtMs : void 0;
}
function checkFloodGuard(input) {
	const floodWindow = input.floodWindowMs ?? DEFAULT_FLOOD_WINDOW_MS;
	const floodThreshold = input.floodThreshold ?? DEFAULT_FLOOD_THRESHOLD;
	if (!input.recentRunStarts || input.recentRunStarts.length < floodThreshold || floodWindow <= 0) return null;
	const windowStart = input.now - floodWindow;
	let inWindow = 0;
	let thresholdOldestTs;
	for (let i = input.recentRunStarts.length - 1; i >= 0; i--) {
		const ts = input.recentRunStarts[i];
		if (ts === void 0 || ts < windowStart) break;
		inWindow += 1;
		if (inWindow === floodThreshold) thresholdOldestTs = ts;
	}
	return inWindow >= floodThreshold && thresholdOldestTs !== void 0 ? {
		defer: true,
		reason: "flood",
		retryAtMs: thresholdOldestTs + floodWindow + 1
	} : null;
}
/**
* Append a run-start timestamp to a bounded recent-runs buffer. Caller passes
* the previous buffer; this returns a new (mutated) buffer with the entry
* appended and trimmed to `floodThreshold + 1` entries (only the newest matter
* for flood detection).
*/
function recordRunStart(buffer, ts, floodThreshold = DEFAULT_FLOOD_THRESHOLD) {
	buffer.push(ts);
	const max = floodThreshold + 1;
	while (buffer.length > max) buffer.shift();
	return buffer;
}
//#endregion
//#region src/infra/heartbeat-runner-scheduler.ts
const loadHeartbeatExecution = createLazyRuntimeModule(() => import("./heartbeat-runner-run-DBzm7GJw.mjs"));
function startHeartbeatRunner(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	const runOnce = opts.runOnce;
	const state = {
		cfg: opts.cfg ?? getRuntimeConfig(),
		runtime,
		agents: /* @__PURE__ */ new Map(),
		stopped: false
	};
	const readCurrentConfig = opts.readCurrentConfig ?? (() => state.cfg);
	let initialized = false;
	const createAgentState = (agentId, now, heartbeat, intervalMs) => {
		const agent = state.agents.get(agentId) ?? {
			agentId,
			cooldownUntilMs: now,
			recentRunStarts: [],
			floodLoggedSinceLastRun: false
		};
		agent.heartbeat = heartbeat;
		agent.intervalMs = intervalMs;
		agent.cooldownUntilMs = agent.lastRunStartedAtMs === void 0 ? now : agent.lastRunStartedAtMs + (intervalMs ?? 0);
		return agent;
	};
	const evaluateWakeDeferral = (agent, now, reason, intent = "event", options = {}) => {
		const decision = shouldDeferWake({
			intent,
			reason,
			now,
			nextDueMs: options.authoritativeScheduledTick ? now : agent.cooldownUntilMs,
			lastRunStartedAtMs: agent.lastRunStartedAtMs,
			recentRunStarts: agent.recentRunStarts,
			retainedWork: options.retainedWork
		});
		if (decision.defer && decision.reason === "flood") {
			if (!agent.floodLoggedSinceLastRun) {
				heartbeatLog.warn("heartbeat: flood guard tripped, deferring wake", {
					agentId: agent.agentId,
					reason: reason ?? "(none)",
					recentRunCount: agent.recentRunStarts.length
				});
				agent.floodLoggedSinceLastRun = true;
			}
		}
		return decision;
	};
	const recordRunBookkeeping = (agent, now) => {
		agent.lastRunStartedAtMs = now;
		agent.cooldownUntilMs = now + (agent.intervalMs ?? 0);
		recordRunStart(agent.recentRunStarts, now);
		agent.floodLoggedSinceLastRun = false;
	};
	const updateConfig = (cfg) => {
		if (state.stopped) return;
		const now = Date.now();
		const prevEnabled = Array.from(state.agents.values()).some((agent) => agent.intervalMs !== void 0);
		const nextAgents = /* @__PURE__ */ new Map();
		const intervals = [];
		const enrolled = new Map(resolveHeartbeatAgents(cfg).map((agent) => [agent.agentId, agent]));
		for (const agentId of /* @__PURE__ */ new Set([...listAgentIds(cfg), ...enrolled.keys()])) {
			const agent = enrolled.get(agentId);
			const intervalMs = agent ? resolveHeartbeatIntervalMs(cfg, void 0, agent.heartbeat) : void 0;
			if (intervalMs) intervals.push(intervalMs);
			nextAgents.set(agentId, createAgentState(agentId, now, agent?.heartbeat, intervalMs ?? void 0));
		}
		state.cfg = cfg;
		state.agents = nextAgents;
		const nextEnabled = intervals.length > 0;
		if (!initialized || prevEnabled !== nextEnabled) {
			if (nextEnabled) heartbeatLog.info("heartbeat: started", { intervalMs: Math.min(...intervals) });
			else {
				heartbeatLog.info("heartbeat: disabled", { enabled: false });
				if (isHeartbeatOwnerUnresolved(cfg)) heartbeatLog.warn("heartbeat: multi-agent config has no ambient heartbeat owner; set agents.defaults.heartbeat.agentId or agents.defaults.systemAgent.agentId");
			}
		}
		initialized = true;
	};
	const run = async (params) => {
		if (state.stopped || !areSessionEventWakesEnabled()) return {
			status: "skipped",
			reason: "disabled"
		};
		const reason = params.reason;
		const wakeSignal = getSessionEventWakeAbortSignal();
		const intent = params.intent;
		const execEventWake = params.source === "exec-event";
		const requestedAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
		const requestedSessionKey = normalizeOptionalString(params.sessionKey);
		const requestedHeartbeat = params.heartbeat;
		const scheduledEveryMs = typeof params.scheduledEveryMs === "number" && Number.isSafeInteger(params.scheduledEveryMs) && params.scheduledEveryMs > 0 ? params.scheduledEveryMs : void 0;
		const authoritativeScheduledTick = scheduledEveryMs !== void 0;
		const requestedTasks = params.tasks ?? [];
		const retainedWork = params.retainedWork === true;
		const wakeConfig = readCurrentConfig();
		const requestedTargetAgentId = requestedAgentId ?? (requestedSessionKey ? resolveAgentIdFromSessionKey(requestedSessionKey) : void 0);
		const isInterval = reason === "interval";
		const startedAt = Date.now();
		const now = startedAt;
		const runOneAgent = async (agent, targeted = false) => {
			const { agentId } = agent;
			if (agent.intervalMs !== void 0 && scheduledEveryMs !== void 0) {
				agent.intervalMs = scheduledEveryMs;
				agent.heartbeat = {
					...agent.heartbeat,
					every: `${scheduledEveryMs}ms`
				};
			}
			const deferral = evaluateWakeDeferral(agent, now, reason, intent, {
				authoritativeScheduledTick,
				retainedWork
			});
			if (deferral.defer) {
				if (deferral.reason !== "not-due" && agent.cooldownUntilMs <= now && (!execEventWake || authoritativeScheduledTick)) agent.cooldownUntilMs = now + (agent.intervalMs ?? 0);
				return {
					ran: false,
					result: {
						status: "skipped",
						reason: deferral.reason,
						retryAtMs: deferral.retryAtMs
					}
				};
			}
			const useEnrolledHeartbeat = !targeted || (isInterval || authoritativeScheduledTick) && !requestedSessionKey && !requestedHeartbeat;
			let res;
			try {
				const runOptions = {
					cfg: wakeConfig,
					agentId,
					heartbeat: useEnrolledHeartbeat ? agent.heartbeat : resolveHeartbeatForWake({
						cfg: wakeConfig,
						agentId,
						configuredHeartbeat: agent.heartbeat,
						requestedHeartbeat,
						source: params.source
					}),
					source: params.source,
					intent,
					reason,
					...scheduledEveryMs !== void 0 ? { scheduledEveryMs } : {},
					...targeted ? { sessionKey: requestedSessionKey } : {},
					tasks: requestedTasks,
					deps: { runtime: state.runtime }
				};
				const execute = runOnce ?? (await loadHeartbeatExecution()).runHeartbeatOnce;
				if (state.stopped || opts.abortSignal?.aborted || wakeSignal?.aborted || !areSessionEventWakesEnabled()) return {
					ran: false,
					result: {
						status: "skipped",
						reason: "disabled"
					}
				};
				res = await execute(runOptions);
			} catch (err) {
				const errMsg = formatErrorMessage(err);
				heartbeatLog.error(`heartbeat runner: runOnce threw unexpectedly: ${errMsg}`, {
					error: errMsg,
					agentId
				});
				recordRunBookkeeping(agent, now);
				return {
					ran: false,
					result: {
						status: "failed",
						reason: errMsg
					}
				};
			}
			if (res.status === "skipped" && isSessionEventWakePollDeferred()) {
				recordRunBookkeeping(agent, now);
				return {
					ran: false,
					result: res
				};
			}
			if (res.status === "skipped" && isRetryableSessionEventWakeReason(res.reason)) return {
				ran: false,
				retryableSkip: res
			};
			if (params.source === "exec-event" && res.status === "skipped" && res.reason === "no-pending-event") return {
				ran: false,
				result: res
			};
			recordRunBookkeeping(agent, now);
			return {
				ran: res.status === "ran",
				result: res
			};
		};
		if (requestedSessionKey || requestedAgentId) {
			const targetAgentId = requestedTargetAgentId ?? tryResolveAmbientHeartbeatAgentId(wakeConfig);
			if (!targetAgentId) return {
				status: "skipped",
				reason: "disabled"
			};
			let targetAgent = state.agents.get(targetAgentId);
			if (targetAgent?.intervalMs === void 0) {
				if (!(requestedTargetAgentId !== void 0 && isConfiguredHeartbeatAgent(wakeConfig, requestedTargetAgentId) && isTargetedUnscheduledWake({
					source: params.source,
					intent,
					reason,
					agentId: requestedAgentId,
					sessionKey: requestedSessionKey
				}))) return {
					status: "skipped",
					reason: "disabled"
				};
			}
			if (!targetAgent) {
				targetAgent = createAgentState(targetAgentId, now);
				state.agents.set(targetAgentId, targetAgent);
			}
			const outcome = await runOneAgent(targetAgent, true);
			if (outcome.retryableSkip) return outcome.retryableSkip;
			return outcome.ran ? {
				status: "ran",
				durationMs: Date.now() - startedAt
			} : outcome.result ?? {
				status: "skipped",
				reason: "not-due"
			};
		}
		const enrolledAgents = Array.from(state.agents.values()).filter((agent) => agent.intervalMs !== void 0);
		if (enrolledAgents.length === 0) return {
			status: "skipped",
			reason: "disabled"
		};
		const agentOutcomes = await Promise.all(enrolledAgents.map((agent) => runOneAgent(agent)));
		let ran = false;
		let firstResult;
		let firstFailure;
		let firstGuardSkip;
		for (const outcome of agentOutcomes) {
			if (outcome.retryableSkip) return outcome.retryableSkip;
			ran ||= outcome.ran;
			firstResult ??= outcome.result;
			const result = outcome.result;
			if (result?.status === "failed") firstFailure ??= result;
			if (!ran && result?.status === "skipped" && result.retryAtMs !== void 0 && (!firstGuardSkip || result.retryAtMs < (firstGuardSkip.retryAtMs ?? Infinity))) firstGuardSkip = result;
		}
		if (ran) return firstFailure ?? {
			status: "ran",
			durationMs: Date.now() - startedAt
		};
		return firstGuardSkip ?? firstFailure ?? firstResult ?? {
			status: "skipped",
			reason: isInterval ? "not-due" : "disabled"
		};
	};
	const disposeWakeHandler = setHeartbeatWakeHandler(run);
	updateConfig(state.cfg);
	const cleanup = () => {
		if (state.stopped) return;
		state.stopped = true;
		opts.abortSignal?.removeEventListener("abort", cleanup);
		disposeWakeHandler();
	};
	if (opts.abortSignal?.aborted) cleanup();
	else opts.abortSignal?.addEventListener("abort", cleanup, { once: true });
	return {
		stop: cleanup,
		updateConfig
	};
}
//#endregion
export { startHeartbeatRunner as t };
