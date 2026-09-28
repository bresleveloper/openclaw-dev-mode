import "./heartbeat-vWflpIwS.mjs";
import { o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents } from "./heartbeat-config-BvP-hlUW.mjs";
import { t as HEARTBEAT_DECLARATION_PREFIX } from "./system-owned-declaration-CIFRO5mv.mjs";
import { n as resolveHeartbeatSchedulerSeed, t as resolveHeartbeatPhaseMs } from "./heartbeat-schedule-CLri8y1O.mjs";
import { isDeepStrictEqual } from "node:util";
import { setImmediate } from "node:timers/promises";
//#region src/cron/system-monitor-jobs.ts
function partitionSystemMonitors(jobs, resolveAgentId) {
	const retained = /* @__PURE__ */ new Map();
	const duplicates = [];
	for (const job of jobs) {
		const agentId = resolveAgentId(job);
		if (!agentId) continue;
		const current = retained.get(agentId);
		if (!current) retained.set(agentId, job);
		else if (job.updatedAtMs > current.updatedAtMs) {
			retained.set(agentId, job);
			duplicates.push({
				agentId,
				job: current
			});
		} else duplicates.push({
			agentId,
			job
		});
	}
	return {
		retained,
		duplicates
	};
}
//#endregion
//#region src/cron/heartbeat-monitor.ts
/** Canonical projection from heartbeat config to system-owned cron monitor jobs. */
function heartbeatMonitorDeclarationKey(agentId) {
	return `${HEARTBEAT_DECLARATION_PREFIX}${agentId}`;
}
function heartbeatMonitorAgentId(job) {
	const key = job.declarationKey;
	if (!key?.startsWith("heartbeat:") || job.payload.kind !== "heartbeat") return;
	return key.slice(10) || void 0;
}
/** Keeps declarative upserts scoped to the exact system-owned monitor. */
function heartbeatMonitorAddOptions(agentId) {
	return {
		enabledExplicit: true,
		systemOwned: true,
		matchesExisting: (job) => heartbeatMonitorAgentId(job) === agentId
	};
}
function heartbeatMonitorDeclarativeFields(job) {
	return {
		declarationKey: job.declarationKey,
		name: job.name,
		agentId: job.agentId,
		schedule: job.schedule,
		pacing: job.pacing,
		trigger: job.trigger,
		payload: job.payload,
		delivery: job.delivery,
		displayName: job.displayName,
		enabled: job.enabled,
		sessionTarget: job.sessionTarget,
		wakeMode: job.wakeMode
	};
}
/** Projects configured monitor state and its create/update/remove changes together. */
function resolveHeartbeatMonitorPlan(cfg, existingJobs, options = {}) {
	const { retained: existingByAgentId, duplicates } = partitionSystemMonitors(existingJobs, heartbeatMonitorAgentId);
	const schedulerSeed = resolveHeartbeatSchedulerSeed(options.schedulerSeed);
	const specs = resolveHeartbeatAgents(cfg).flatMap((agent) => {
		const configuredIntervalMs = resolveHeartbeatIntervalMs(cfg, void 0, agent.heartbeat);
		const existing = existingByAgentId.get(agent.agentId);
		const intervalMs = configuredIntervalMs ?? (existing?.schedule.kind === "every" ? existing.schedule.everyMs : void 0) ?? resolveHeartbeatIntervalMs(cfg, "30m", agent.heartbeat);
		if (!intervalMs) return [];
		return [{
			agentId: agent.agentId,
			input: {
				declarationKey: heartbeatMonitorDeclarationKey(agent.agentId),
				displayName: `Heartbeat (${agent.agentId})`,
				name: `heartbeat-${agent.agentId}`,
				agentId: agent.agentId,
				enabled: configuredIntervalMs !== null,
				schedule: {
					kind: "every",
					everyMs: intervalMs,
					anchorMs: resolveHeartbeatPhaseMs({
						schedulerSeed,
						agentId: agent.agentId,
						intervalMs
					})
				},
				payload: { kind: "heartbeat" },
				sessionTarget: "main",
				wakeMode: "next-heartbeat"
			}
		}];
	});
	const changes = duplicates.map(({ agentId, job }) => ({
		kind: "remove",
		agentId,
		job
	}));
	for (const spec of specs) {
		const existing = existingByAgentId.get(spec.agentId);
		if (!existing) {
			changes.push({
				kind: "create",
				...spec
			});
			continue;
		}
		existingByAgentId.delete(spec.agentId);
		if (!isDeepStrictEqual(heartbeatMonitorDeclarativeFields(existing), heartbeatMonitorDeclarativeFields(spec.input))) changes.push({
			kind: "update",
			...spec
		});
	}
	for (const [agentId, job] of existingByAgentId) changes.push({
		kind: "remove",
		agentId,
		job
	});
	return {
		specs,
		changes
	};
}
/** Applies the canonical heartbeat monitor plan while isolating per-row failures. */
async function applyHeartbeatMonitorJobs(params) {
	let jobs;
	try {
		jobs = await params.cron.list({ includeDisabled: true });
	} catch (error) {
		params.logger?.warn({ err: String(error) }, "cron-heartbeat: monitor inventory failed");
		return {
			ok: false,
			applied: [],
			failures: [{ error }]
		};
	}
	params.commitGuard?.();
	const { changes } = resolveHeartbeatMonitorPlan(params.cfg, jobs, { schedulerSeed: params.schedulerSeed });
	const applied = [];
	const failures = [];
	for (const change of changes) {
		await setImmediate();
		params.commitGuard?.();
		try {
			if (change.kind === "remove") await params.cron.remove(change.job.id, {
				systemOwned: true,
				...params.commitGuard ? { commitGuard: params.commitGuard } : {}
			});
			else await params.cron.add(change.input, {
				...heartbeatMonitorAddOptions(change.agentId),
				...params.commitGuard ? { commitGuard: params.commitGuard } : {}
			});
			applied.push(change);
		} catch (error) {
			params.commitGuard?.();
			failures.push({
				change,
				error
			});
			params.logger?.warn({
				agentId: change.agentId,
				err: String(error)
			}, change.kind === "remove" ? "cron-heartbeat: stale monitor cleanup failed" : "cron-heartbeat: monitor convergence failed");
		}
	}
	return {
		ok: failures.length === 0,
		applied,
		failures
	};
}
/** Gateway-facing reconciliation keeps the established compact result contract. */
async function reconcileHeartbeatMonitorJobs(params) {
	const { ok } = await applyHeartbeatMonitorJobs(params);
	return { ok };
}
//#endregion
export { partitionSystemMonitors as a, resolveHeartbeatMonitorPlan as i, heartbeatMonitorAddOptions as n, reconcileHeartbeatMonitorJobs as r, applyHeartbeatMonitorJobs as t };
