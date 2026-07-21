import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { p as resolveAgentIdFromSessionKey, u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { a as failTaskRunByRunId, i as createRunningTaskRun, n as completeTaskRunByRunId } from "./detached-task-runtime-BRur6lzE.js";
import { c as timeoutErrorMessage, i as normalizeCronRunErrorText } from "./execution-errors-BeXudclS.js";
import { t as resolveCronAgentSessionKey } from "./session-key-BpcpZT5I.js";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.js";
//#region src/cron/service/task-ledger.ts
/** Progress summary shown while a detached task ledger row represents an active cron run. */
const CRON_TASK_RUNNING_PROGRESS_SUMMARY = "Running cron job.";
//#endregion
//#region src/cron/service/task-runs.ts
/** Detached task-ledger integration for cron runs. */
/** Converts cron ids into bounded session-key path segments with a fallback for empty input. */
function normalizeCronLaneSegment(value, fallback) {
	return normalizeOptionalLowercaseString(value)?.replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || fallback;
}
/** Builds the main-session child key used to isolate one cron run's task transcript. */
function resolveMainSessionCronRunSessionKey(job, startedAt) {
	const explicitAgentId = job.agentId?.trim();
	return `agent:${normalizeAgentId(explicitAgentId || resolveAgentIdFromSessionKey(job.sessionKey))}:cron:${normalizeCronLaneSegment(job.id, "job")}:run:${normalizeCronLaneSegment(String(Math.max(0, Math.floor(startedAt))), "run")}`;
}
function resolveCronTaskChildSessionKey(params) {
	if (params.job.sessionTarget === "main") return resolveMainSessionCronRunSessionKey(params.job, params.startedAt);
	const explicitSessionKey = params.job.sessionKey?.trim();
	if (explicitSessionKey) return explicitSessionKey;
	if (params.job.sessionTarget !== "isolated") return;
	return resolveCronAgentSessionKey({
		sessionKey: `cron:${params.job.id}`,
		agentId: params.job.agentId ?? params.state.deps.defaultAgentId ?? "main"
	});
}
/** Creates a best-effort detached task ledger row for a cron run. */
function tryCreateCronTaskRun(params) {
	const runId = createCronExecutionId(params.job.id, params.startedAt);
	try {
		if (!createRunningTaskRun({
			runtime: "cron",
			sourceId: params.job.id,
			ownerKey: "",
			scopeKind: "system",
			childSessionKey: resolveCronTaskChildSessionKey(params),
			agentId: params.job.agentId,
			runId,
			label: params.job.name,
			task: params.job.name || params.job.id,
			deliveryStatus: "not_applicable",
			notifyPolicy: "silent",
			startedAt: params.startedAt,
			lastEventAt: params.startedAt,
			progressSummary: "Running cron job."
		})) {
			params.state.deps.log.warn({ jobId: params.job.id }, "cron: task ledger record was not persisted");
			return;
		}
		return runId;
	} catch (error) {
		params.state.deps.log.warn({
			jobId: params.job.id,
			error
		}, "cron: failed to create task ledger record");
		return;
	}
}
/** Completes or fails the detached task ledger row for a cron run when one exists. */
function tryFinishCronTaskRun(state, result) {
	if (!result.taskRunId) return;
	try {
		if (result.status === "ok" || result.status === "skipped") {
			completeTaskRunByRunId({
				runId: result.taskRunId,
				runtime: "cron",
				endedAt: result.endedAt,
				lastEventAt: result.endedAt,
				terminalSummary: result.summary ?? void 0
			});
			return;
		}
		failTaskRunByRunId({
			runId: result.taskRunId,
			runtime: "cron",
			status: normalizeCronRunErrorText(result.error) === timeoutErrorMessage() ? "timed_out" : "failed",
			endedAt: result.endedAt,
			lastEventAt: result.endedAt,
			error: result.status === "error" ? normalizeCronRunErrorText(result.error) : void 0,
			terminalSummary: result.summary ?? void 0
		});
	} catch (error) {
		state.deps.log.warn({
			runId: result.taskRunId,
			jobStatus: result.status,
			error
		}, "cron: failed to update task ledger record");
	}
}
//#endregion
export { CRON_TASK_RUNNING_PROGRESS_SUMMARY as a, tryFinishCronTaskRun as i, resolveMainSessionCronRunSessionKey as n, tryCreateCronTaskRun as r, normalizeCronLaneSegment as t };
