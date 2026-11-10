import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { c as resolveSystemEventQueueKey } from "./system-event-ownership-DAgHWXZ1.mjs";
import { m as peekDeliverableSystemEventEntries } from "./system-events-Bf4ozS7L.mjs";
import "./config-B3oiWDlr.mjs";
import { a as setHeartbeatWakeHandler, d as isSessionEventWakePollDeferred, g as heartbeatLog, l as getSessionEventWakeAbortSignal, s as areSessionEventWakesEnabled, u as isRetryableSessionEventWakeReason } from "./heartbeat-wake-do575_JN.mjs";
import { a as resolveHeartbeatForWake, c as tryResolveAmbientHeartbeatAgentId, o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents, t as isHeartbeatOwnerUnresolved } from "./heartbeat-config-CNn1aX1c.mjs";
import { a as isConversationExecCompletion, c as isHeartbeatDeliveryAwarenessEvent } from "./heartbeat-events-filter-BpnzoyZw.mjs";
import { n as isConfiguredHeartbeatAgent, r as isTargetedUnscheduledWake } from "./heartbeat-wake-policy-QH_kNVaN.mjs";
//#region src/infra/heartbeat-cooldown.ts
const DEFAULT_MIN_WAKE_SPACING_MS = 3e4;
const DEFAULT_FLOOD_WINDOW_MS = 6e4;
const DEFAULT_FLOOD_THRESHOLD = 5;
function shouldDeferWake(input) {
	if (input.intent === "manual") return { defer: false };
	const floodDefer = checkFloodGuard(input);
	if (floodDefer) return floodDefer;
	if (input.intent === "immediate") return { defer: false };
	if (input.intent === "scheduled") return input.now < input.nextDueMs ? {
		defer: true,
		reason: "not-due",
		retryAtMs: input.nextDueMs
	} : { defer: false };
	if (input.lastRunStartedAtMs === void 0) return { defer: false };
	if (input.intent !== "task" && !input.retainedWork && !input.conversationTurn && input.now < input.nextDueMs) {
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
	if (input.lastRunStartedAtMs === void 0) return;
	const retryAtMs = input.lastRunStartedAtMs + DEFAULT_MIN_WAKE_SPACING_MS;
	return input.now < retryAtMs ? retryAtMs : void 0;
}
function checkFloodGuard(input) {
	if (!input.recentRunStarts || input.recentRunStarts.length < DEFAULT_FLOOD_THRESHOLD) return null;
	const windowStart = input.now - DEFAULT_FLOOD_WINDOW_MS;
	let inWindow = 0;
	for (let i = input.recentRunStarts.length - 1; i >= 0; i--) {
		const ts = input.recentRunStarts[i];
		if (ts === void 0 || ts < windowStart) break;
		inWindow += 1;
		if (inWindow === DEFAULT_FLOOD_THRESHOLD) return {
			defer: true,
			reason: "flood",
			retryAtMs: ts + DEFAULT_FLOOD_WINDOW_MS + 1
		};
	}
	return null;
}
function recordRunStart(buffer, ts) {
	buffer.push(ts);
	while (buffer.length > 6) buffer.shift();
}
//#endregion
//#region src/infra/heartbeat-runner-scheduler.ts
const loadHeartbeatExecution = createLazyRuntimeModule(() => import("./heartbeat-runner-run--OdzO9aY.mjs"));
function startHeartbeatRunner(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	const runOnce = opts.runOnce;
	const state = {
		cfg: opts.cfg ?? readRuntimeConfig(),
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
			now,
			nextDueMs: options.authoritativeScheduledTick ? now : agent.cooldownUntilMs,
			lastRunStartedAtMs: agent.lastRunStartedAtMs,
			recentRunStarts: agent.recentRunStarts,
			retainedWork: options.retainedWork,
			conversationTurn: options.conversationTurn
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
			const pendingEvents = execEventWake ? peekDeliverableSystemEventEntries(resolveSystemEventQueueKey(requestedSessionKey ?? "global", agentId)).filter((event) => !isHeartbeatDeliveryAwarenessEvent(event)) : [];
			const deferral = evaluateWakeDeferral(agent, now, reason, intent, {
				authoritativeScheduledTick,
				retainedWork,
				conversationTurn: pendingEvents.length > 0 && pendingEvents.every(isConversationExecCompletion)
			});
			if (deferral.defer) {
				if (deferral.reason !== "not-due" && agent.cooldownUntilMs <= now && (!execEventWake || authoritativeScheduledTick)) agent.cooldownUntilMs = now + (agent.intervalMs ?? 0);
				return { result: {
					status: "skipped",
					reason: deferral.reason,
					retryAtMs: deferral.retryAtMs
				} };
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
					deps: { runtime }
				};
				const execute = runOnce ?? (await loadHeartbeatExecution()).runHeartbeatOnce;
				if (state.stopped || opts.abortSignal?.aborted || wakeSignal?.aborted) return { result: {
					status: "skipped",
					reason: "preempted"
				} };
				if (!areSessionEventWakesEnabled()) return { result: {
					status: "skipped",
					reason: "disabled"
				} };
				res = await execute(runOptions);
			} catch (err) {
				const errMsg = formatErrorMessage(err);
				heartbeatLog.error(`heartbeat runner: runOnce threw unexpectedly: ${errMsg}`, {
					error: errMsg,
					agentId
				});
				recordRunBookkeeping(agent, now);
				return { result: {
					status: "failed",
					reason: errMsg
				} };
			}
			if (res.status === "skipped" && isSessionEventWakePollDeferred()) {
				recordRunBookkeeping(agent, now);
				return { result: res };
			}
			if (res.status === "skipped" && isRetryableSessionEventWakeReason(res.reason)) return {
				result: res,
				retryable: true
			};
			if (params.source === "exec-event" && res.status === "skipped" && res.reason === "no-pending-event") return { result: res };
			recordRunBookkeeping(agent, now);
			return { result: res };
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
			const { result } = await runOneAgent(targetAgent, true);
			return result.status === "ran" ? {
				status: "ran",
				durationMs: Date.now() - startedAt
			} : result;
		}
		const enrolledAgents = Array.from(state.agents.values()).filter((agent) => agent.intervalMs !== void 0);
		if (enrolledAgents.length === 0) return {
			status: "skipped",
			reason: "disabled"
		};
		const agentOutcomes = await Promise.all(enrolledAgents.map((agent) => runOneAgent(agent)));
		const ran = agentOutcomes.some(({ result }) => result.status === "ran");
		let firstFailure;
		let firstGuardSkip;
		for (const { result, retryable } of agentOutcomes) {
			if (retryable) return result;
			if (result.status === "failed") firstFailure ??= result;
			if (!ran && result.status === "skipped" && result.retryAtMs !== void 0 && (!firstGuardSkip || result.retryAtMs < (firstGuardSkip.retryAtMs ?? Infinity))) firstGuardSkip = result;
		}
		if (ran) return firstFailure ?? {
			status: "ran",
			durationMs: Date.now() - startedAt
		};
		return firstGuardSkip ?? firstFailure ?? agentOutcomes[0]?.result ?? {
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
