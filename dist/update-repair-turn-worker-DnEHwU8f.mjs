import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { p as withSynchronousArtifactPreservingStateSnapshot } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as createAgentCleanupScope } from "./run-cleanup-timeout-CjK4qQ1w.mjs";
import "./update-run-ledger-C3oL-g8r.mjs";
import { i as getUpdateRun } from "./update-run-reader-BOC3s3Sk.mjs";
import { n as createDelegatedUpdateRequesterAuthority, o as resolveManagedUpdateRequester, t as UpdateRequesterRevokedError } from "./update-requester-authority-BP771TSP.mjs";
import { n as withDelegatedUpdateCommandExecutor } from "./update-command-executor-DUq8yLzH.mjs";
import { n as runLocalUpdateRepairTurn, t as repairSummary } from "./update-repair-turn-BHhR_-wn.mjs";
import { isDeepStrictEqual } from "node:util";
import { performance } from "node:perf_hooks";
//#region src/infra/update-repair-turn-worker.ts
const log = createSubsystemLogger("update/repair");
async function runDelegatedUpdateRepairTurn(message, admissionEnv, parentSignal, onRoute) {
	const controller = new AbortController();
	const signal = AbortSignal.any([parentSignal, controller.signal]);
	const deadline = Date.now() + message.wallClockMs;
	const wallTimer = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("wall-clock-budget")), message.wallClockMs);
	const traceTimings = log.isEnabled("trace");
	const timings = {
		checks: 0,
		liveChecks: 0,
		fenceMs: 0,
		requesterMs: 0,
		runMs: 0,
		totalMs: 0
	};
	const measure = (phase, operation) => {
		if (!traceTimings) return operation();
		const started = performance.now();
		try {
			return operation();
		} finally {
			timings[phase] += performance.now() - started;
		}
	};
	try {
		return await withDelegatedUpdateCommandExecutor(message.executor, message.runId, message.target.installRoot, async (fence) => {
			fence.assertCurrent();
			const readCurrentRun = () => {
				const run = measure("runMs", () => getUpdateRun(message.runId, { env: admissionEnv }));
				if (!process.connected || run?.status !== "running" || run.phase !== "repairing") throw new Error("Repair no longer owns the update attempt.");
				if (!isDeepStrictEqual(run.origin.requester, message.requester)) throw new UpdateRequesterRevokedError();
				return run;
			};
			const requesterInput = resolveManagedUpdateRequester(readCurrentRun().origin.requester);
			const runtime = await import("./update-repair-agent.runtime.js");
			fence.assertCurrent();
			const requester = requesterInput ? await runtime.withUpdateRepairEnvironment(message.target, () => createDelegatedUpdateRequesterAuthority(requesterInput, message.runId, fence, admissionEnv)) : void 0;
			const assertAuthority = () => {
				const started = traceTimings ? performance.now() : 0;
				timings.checks += 1;
				try {
					measure("fenceMs", () => fence.assertCurrent());
					return withSynchronousArtifactPreservingStateSnapshot(() => {
						readCurrentRun();
						if (measure("requesterMs", () => requester?.isCurrent()) === false) throw new UpdateRequesterRevokedError();
						return true;
					}, { current: { env: admissionEnv } });
				} finally {
					if (traceTimings) timings.totalMs += performance.now() - started;
				}
			};
			const assertCurrent = () => {
				signal.throwIfAborted();
				return assertAuthority();
			};
			const assertTurnLive = () => {
				signal.throwIfAborted();
				timings.liveChecks += 1;
				if (!process.connected) throw new Error("Repair no longer owns the update attempt.");
				measure("fenceMs", () => fence.assertCurrent());
				return true;
			};
			assertCurrent();
			const selected = await runtime.withUpdateRepairEnvironment(message.target, () => runtime.prepareUpdateRepairInference(signal, Math.max(1, deadline - Date.now())));
			assertCurrent();
			if (!selected.ok) return {
				status: "unavailable",
				reason: repairSummary(selected.reason, message.target)
			};
			const { route, modelFallbacks } = selected;
			onRoute({
				model: route.model,
				provider: route.provider
			});
			const timeoutMs = Math.min(message.timeoutMs, deadline - Date.now());
			if (timeoutMs <= 0) throw new Error("wall-clock-budget");
			const turnTimer = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("per-turn-budget")), timeoutMs);
			const cleanup = createAgentCleanupScope();
			try {
				const result = await cleanup.run(() => runLocalUpdateRepairTurn({
					target: message.target,
					route,
					modelFallbacks,
					prompt: message.prompt,
					timeoutMs,
					maxToolCalls: message.maxToolCalls,
					signal,
					isCurrent: assertCurrent,
					isLive: assertTurnLive
				}));
				parentSignal.throwIfAborted();
				assertAuthority();
				if (cleanup.outcome === "uncertain") throw new Error("Update repair cleanup could not be confirmed.");
				return result.status === "completed" ? {
					...result,
					timedOut: result.timedOut || controller.signal.aborted
				} : result;
			} finally {
				clearTimeout(turnTimer);
			}
		});
	} catch (error) {
		return {
			status: "aborted",
			reason: repairSummary(error instanceof Error ? error.message : String(error), message.target)
		};
	} finally {
		clearTimeout(wallTimer);
		if (traceTimings) log.trace(`authority check timing ${JSON.stringify(timings)}`);
	}
}
//#endregion
export { runDelegatedUpdateRepairTurn };
