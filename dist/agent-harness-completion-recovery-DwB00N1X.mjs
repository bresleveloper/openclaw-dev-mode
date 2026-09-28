import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as loadExactSessionEntry } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { t as everySessionTranscriptUserInputFrom } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { p as getTasksByRunId } from "./task-registry.process-state-Cb_kvrmQ.mjs";
import { E as withTaskRegistryMutation, o as ensureTaskRegistryReady } from "./task-registry-state-Cibd1d5c.mjs";
import { i as updateTask } from "./task-registry-delivery-lKPvJ6ok.mjs";
import { h as normalizeInputProvenance } from "./input-provenance-C4tQegGN.mjs";
import { r as getTaskById } from "./task-registry-query-Bd-H3o4L.mjs";
import { a as createSessionWorkStartChangedError } from "./lifecycle-CQXOIBZ7.mjs";
import { o as getTaskByIdForOwner } from "./task-owner-access-LVQrPhRu.mjs";
//#region src/tasks/agent-harness-completion-recovery.ts
function isOwedHarnessTask(task) {
	return task.runtime === "subagent" && Boolean(task.taskKind) && (task.status === "succeeded" || task.status === "failed") && task.deliveryStatus === "pending" && Boolean(task.runId) && task.sourceId === task.runId;
}
/** Keep source cardinality scoped to the existing run index, including unfinished peers. */
function findSoleHarnessCompletionTask(params) {
	ensureTaskRegistryReady();
	const matches = getTasksByRunId(params.taskRunId).filter((task) => task.runtime === "subagent" && Boolean(task.taskKind) && task.runId === params.taskRunId && task.requesterSessionKey === params.requesterSessionKey && getTaskByIdForOwner({
		taskId: task.taskId,
		callerOwnerKey: params.requesterSessionKey,
		callerAgentId: params.requesterAgentId
	}));
	return matches.length === 1 && matches[0] ? getTaskById(matches[0].taskId) : void 0;
}
/** Called by the admitted host run, not by a provenance-only startup scan. */
function captureHarnessCompletionRecovery(params) {
	const provenance = normalizeInputProvenance(params.inputProvenance);
	if (!params.runId.startsWith("announce:") || provenance?.kind !== "inter_session" || provenance.sourceTool !== "agent_harness_task" || provenance.sourceChannel !== "internal" || !provenance.sourceSessionKey) return;
	const task = findSoleHarnessCompletionTask({
		taskRunId: provenance.sourceSessionKey,
		requesterSessionKey: params.sessionKey,
		requesterAgentId: params.agentId
	});
	if (!task || !isOwedHarnessTask(task)) return;
	return {
		taskId: task.taskId,
		taskStatus: task.status,
		taskRunId: provenance.sourceSessionKey,
		sourceRunId: params.runId,
		requesterSessionKey: params.sessionKey,
		requesterAgentId: params.agentId,
		sessionId: params.entry.sessionId,
		...params.entry.lifecycleRevision ? { lifecycleRevision: params.entry.lifecycleRevision } : {}
	};
}
/** A reset, replacement task, cancellation or different owner invalidates the saved join. */
function getOwedHarnessCompletionTask(claim, entry) {
	if (entry.sessionId !== claim.sessionId || entry.lifecycleRevision !== claim.lifecycleRevision) return;
	const task = findSoleHarnessCompletionTask(claim);
	return task && task.taskId === claim.taskId && task.status === claim.taskStatus && isOwedHarnessTask(task) ? task : void 0;
}
/** The exact source input must already be in this transcript, before any recovery input. */
function hasAdmittedHarnessCompletionInput(claim, messages, operationalRunId, priorRunIds = []) {
	const sources = messages.filter((message) => {
		const record = asOptionalRecord(message);
		const provenance = normalizeInputProvenance(record?.provenance);
		return record?.role === "user" && record.idempotencyKey === `${claim.sourceRunId}:user` && asOptionalRecord(record["__openclaw"])?.runId === claim.sourceRunId && provenance?.kind === "inter_session" && provenance.sourceChannel === "internal" && provenance.sourceTool === "agent_harness_task" && provenance.sourceSessionKey === claim.taskRunId;
	});
	if (sources.length !== 1) return false;
	const sourceIndex = messages.indexOf(sources[0]);
	const allowedRunIds = new Set([operationalRunId, ...priorRunIds].filter(Boolean));
	return messages.slice(sourceIndex + 1).every((message) => {
		const record = asOptionalRecord(message);
		if (record?.role !== "user") return true;
		const provenance = normalizeInputProvenance(record.provenance);
		const annotatedRunId = asOptionalRecord(record["__openclaw"])?.runId;
		const runId = typeof record.idempotencyKey === "string" ? [...allowedRunIds].find((id) => record.idempotencyKey === `${id}:user`) : annotatedRunId;
		return typeof runId === "string" && allowedRunIds.has(runId) && (annotatedRunId == null || annotatedRunId === runId) && provenance?.kind === "internal_system" && provenance.sourceTool === "main_session_restart_recovery" && provenance.sourceSessionKey === claim.requesterSessionKey;
	});
}
/** Exact source lookup is independent of the display tail used to choose recovery policy. */
function readAdmittedHarnessCompletionInput(params) {
	const scope = {
		agentId: params.claim.requesterAgentId,
		sessionKey: params.claim.requesterSessionKey,
		sessionId: params.entry.sessionId,
		storePath: params.storePath
	};
	const priorRunIds = (params.entry.restartRecoveryRuns ?? []).filter((run) => Boolean(run.lifecycleGeneration)).map((run) => run.runId);
	let source;
	return everySessionTranscriptUserInputFrom(scope, `${params.claim.sourceRunId}:user`, (message) => {
		if (source === void 0) {
			source = message;
			return hasAdmittedHarnessCompletionInput(params.claim, [source]);
		}
		return hasAdmittedHarnessCompletionInput(params.claim, [source, message], params.operationalRunId, priorRunIds);
	});
}
/** The existing admitted execution guard rechecks this before execution and delegated effects. */
function createHarnessCompletionSourceAssertion(params) {
	return () => {
		params.priorAssertion?.();
		const current = loadExactSessionEntry({
			agentId: params.claim.requesterAgentId,
			sessionKey: params.claim.requesterSessionKey,
			storePath: params.storePath,
			readConsistency: "latest"
		});
		if (!current || current.sessionKey !== params.claim.requesterSessionKey || !getOwedHarnessCompletionTask(params.claim, current.entry) || current.entry.restartRecoveryDeliveryRunId !== params.claim.sourceRunId && !readAdmittedHarnessCompletionInput({
			claim: params.claim,
			entry: current.entry,
			storePath: params.storePath,
			operationalRunId: current.entry.restartRecoveryDeliveryRunId
		})) throw createSessionWorkStartChangedError(params.claim.requesterSessionKey);
	};
}
/** Session receipt and task live in different stores. Recheck the exact receipt at the task commit. */
function settleHarnessCompletionTask(params) {
	return withTaskRegistryMutation(() => {
		const entry = params.readCurrentSession();
		if (!entry || !getOwedHarnessCompletionTask(params.claim, entry) || !params.hasQualifyingReceipt(entry)) return false;
		return updateTask(params.claim.taskId, { deliveryStatus: "delivered" }) !== null;
	}, () => false);
}
//#endregion
export { settleHarnessCompletionTask as a, readAdmittedHarnessCompletionInput as i, createHarnessCompletionSourceAssertion as n, getOwedHarnessCompletionTask as r, captureHarnessCompletionRecovery as t };
