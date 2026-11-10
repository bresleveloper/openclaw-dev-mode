import { n as createQueuedDiagnosticPhaseEmitter } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { performance } from "node:perf_hooks";
//#region src/agents/worktrees/preparation-timing.ts
const log = createSubsystemLogger("agents/worktrees");
const preparation = new AsyncLocalStorage();
function markManagedWorktreePreparation() {
	const current = preparation.getStore();
	if (current) current.enabled = true;
}
function setWorktreePreparationTemplate(template, details) {
	const current = preparation.getStore();
	if (current) {
		if (template) current.template = template;
		Object.assign(current.templateDetails, details);
	}
}
/** Nested phases are inclusive; only total measures the complete preparation once. */
function startWorktreePreparationPhase(phase) {
	const current = preparation.getStore();
	const startedAt = performance.now();
	if (current && current.activePhases++ === 0) current.coveredSince = startedAt;
	let finished = false;
	return () => {
		if (current && !finished) {
			const now = performance.now();
			current.phases[phase] = (current.phases[phase] ?? 0) + now - startedAt;
			if (--current.activePhases === 0) current.coveredMs += now - current.coveredSince;
			finished = true;
		}
	};
}
async function timeWorktreePreparationPhase(phase, run) {
	const finish = startWorktreePreparationPhase(phase);
	try {
		return await run();
	} finally {
		finish();
	}
}
async function withWorktreePreparationTiming(kind, run) {
	const startedAt = Date.now();
	const start = performance.now();
	const emit = createQueuedDiagnosticPhaseEmitter();
	const current = {
		enabled: kind === "managed",
		template: "unavailable",
		templateDetails: { reason: "not-requested" },
		phases: {},
		activePhases: 0,
		coveredSince: 0,
		coveredMs: 0
	};
	let outcome = "threw";
	try {
		const result = await preparation.run(current, run);
		outcome = "returned";
		return result;
	} finally {
		if (current.enabled) try {
			const end = performance.now();
			const durationMs = Math.round(end - start);
			const coveredMs = current.coveredMs + (current.activePhases ? end - current.coveredSince : 0);
			const unattributedMs = Math.round(Math.max(0, end - start - coveredMs));
			const phaseDurationsMs = Object.fromEntries(Object.entries(current.phases).map(([phase, duration]) => [phase, Math.round(duration)]));
			log.info("managed worktree preparation", {
				consoleMessage: `managed worktree preparation kind=${kind} template=${current.template} templateDetails=${JSON.stringify(current.templateDetails)} outcome=${outcome} durationMs=${durationMs} unattributedMs=${unattributedMs} phaseDurationsMs=${JSON.stringify(phaseDurationsMs)}`,
				kind,
				template: current.template,
				templateDetails: current.templateDetails,
				outcome,
				durationMs,
				unattributedMs,
				phaseDurationsMs
			});
			emit?.({
				name: "worktree.preparation",
				startedAt,
				endedAt: Date.now(),
				durationMs,
				details: {
					kind,
					template: current.template,
					...Object.fromEntries(Object.entries(current.templateDetails).map(([key, value]) => [`template.${key}`, value])),
					outcome,
					unattributedMs,
					...phaseDurationsMs
				}
			});
		} catch {}
	}
}
//#endregion
export { withWorktreePreparationTiming as a, timeWorktreePreparationPhase as i, setWorktreePreparationTemplate as n, startWorktreePreparationPhase as r, markManagedWorktreePreparation as t };
