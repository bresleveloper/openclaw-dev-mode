import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { n as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-C_pcNU2t.mjs";
import { n as isPublicUpdateFailureCode } from "./update-failure-public-codes-DWhlI7xl.mjs";
import { n as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BuT3Q1bJ.mjs";
import { n as createUpdateErrorFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { t as finishUpdateRunRecord } from "./update-run-record-Chv9kKnY.mjs";
import { o as updateRunStepsFromResultStep, r as isFailedUpdateStep } from "./update-run-step-Db60sdKj.mjs";
import { n as updateRunStepKey, t as upsertStep } from "./update-run-step-upsert-CoZScFzu.mjs";
import { n as encodeRun } from "./update-run-codec-Guyb20ob.mjs";
import { c as readUpdateRunRecord, n as decodeRun } from "./update-run-read.kernel-C7evz-Ne.mjs";
//#region src/infra/update-failure-result.ts
/** Terminal outcomes need facts even when no command ran or its diagnostic is private. */
function completeUpdateFailureSummary(reason, failureFacts) {
	const code = reason?.trim() ? reason : "update-failed";
	return {
		reason: code,
		failureFacts: failureFacts?.some((fact) => isPublicUpdateFailureCode(fact.code)) ? failureFacts : [...(failureFacts ?? []).slice(0, 4), {
			check: "update",
			code: isPublicUpdateFailureCode(code) ? code : "update-failed"
		}]
	};
}
/** Normalize once before a terminal result leaves its owner, including history-free refusals. */
function normalizeUpdateFailureResult(result, cause) {
	if (result.status !== "error") return result;
	const failed = result.failedStep ?? result.steps.findLast(isFailedUpdateStep);
	const { reason, failureFacts } = completeUpdateFailureSummary(result.reason, failed?.failureFacts?.length ? failed.failureFacts : cause === void 0 ? void 0 : [createUpdateErrorFact("update", cause)]);
	const failedStep = {
		...failed ?? {
			name: "update",
			command: "openclaw update",
			cwd: result.root ?? "",
			durationMs: 0,
			exitCode: null
		},
		failureFacts
	};
	const failedIndex = failed ? result.steps.findLastIndex((step) => isFailedUpdateStep(step) && updateRunStepKey(step.name) === updateRunStepKey(failed.name)) : -1;
	return {
		...result,
		reason,
		...result.failedStep ? { failedStep } : {},
		steps: failedIndex >= 0 ? result.steps.map((step, index) => index === failedIndex ? failedStep : step) : [...result.steps, failedStep]
	};
}
//#endregion
//#region src/infra/update-run-gateway-stop.ts
function hasUpdateGatewayStopIntent(run) {
	const stopped = run.steps.some(({ step, status }) => step === "service-stop" && (status === "completed" || status === "in_progress" || status === "failed"));
	const managed = run.target.installationMethod === "managed-service" || run.steps.some(({ step, status }) => step === "managed-service update handoff" && status === "completed");
	return stopped || managed && (run.phase === "activating" || run.steps.some(({ step }) => step === "activating"));
}
/** Newest-first history: a later start retires an update's unfulfilled stop intent. */
function findUpdateGatewayStop(runs) {
	let started = false;
	for (const run of runs) {
		if (run.verification.settled === true) return;
		const stopped = hasUpdateGatewayStopIntent(run);
		started ||= run.verification.serviceRunning === true && (!stopped || run.verification.booted === true) || run.steps.some(({ step, status }) => [
			"service-start",
			"service-running",
			"managed-service-restart"
		].includes(step) && status === "completed");
		if (stopped) return {
			runId: run.runId,
			started
		};
	}
}
//#endregion
//#region src/infra/update-run-verification.ts
function isUpdateRunVerificationConfirmed(verification) {
	return verification.serviceRunning === true && verification.versionMatch === true && verification.settled === true && (verification.coreReady ?? (verification.readyz === true && verification.channelsReady === true)) && verification.pluginErrors?.length === 0;
}
function recordUpdateRunVerificationRecord(record, verification, options = {}) {
	if (options.onlyIfRunning && record.status !== "running") return;
	if (verification.serviceRunning === true && hasUpdateGatewayStopIntent(record)) upsertStep(record, {
		step: "service-running",
		status: "completed",
		endedAtMs: Date.now()
	});
	let observedVerification = verification;
	if (record.verification.noticeDelivered === true && verification.noticeDelivered === false) {
		observedVerification = { ...verification };
		delete observedVerification.noticeDelivered;
	}
	record.verification = {
		...record.verification,
		...verification.readyz !== void 0 && verification.coreReady === void 0 ? { coreReady: void 0 } : {},
		...observedVerification,
		...verification.pluginErrors ? { pluginErrors: verification.pluginErrors.slice(-32) } : {}
	};
	if (record.status === "running" && verification.serviceRunning === false) record.confirmedAtMs = null;
	if (isUpdateRunVerificationConfirmed(record.verification) && record.confirmedAtMs === null) record.confirmedAtMs = Date.now();
}
//#endregion
//#region src/infra/update-run-write.ts
const updateRunLedgerSchema = getOpenClawStateFeatureSchemaSql("update_runs", {
	endMarker: "ON update_runs(status, created_at_ms DESC, run_id);",
	errorMessage: "Update run schema markers are missing"
});
function applyUpdateRunPhase(record, phase, patch) {
	if (record.status !== "running") return;
	if (patch.origin) record.origin = {
		...record.origin,
		...patch.origin
	};
	if (patch.target) record.target = {
		...record.target,
		...patch.target
	};
	if (patch.before) record.before = {
		...record.before,
		...patch.before
	};
	if (patch.after) record.after = {
		...record.after,
		...patch.after
	};
	if (patch.trigger) record.trigger = patch.trigger;
	const repairsVerification = phase === "repairing" && record.phase === "verifying";
	const advances = UPDATE_RUN_PHASES.indexOf(phase) > UPDATE_RUN_PHASES.indexOf(record.phase);
	const resumesVerification = record.phase === "repairing" && record.steps.some((step) => step.step === "verifying");
	if (phase !== "finished" && (repairsVerification || advances && (!resumesVerification || phase === "verifying"))) {
		const now = Date.now();
		upsertStep(record, {
			step: record.phase,
			status: "completed",
			endedAtMs: now
		});
		record.phase = phase;
		upsertStep(record, {
			step: phase,
			status: "in_progress",
			startedAtMs: now,
			endedAtMs: void 0
		});
	}
	if (patch.step) upsertStep(record, patch.step);
}
function applyUpdateRunStep(record, { reason, ...step }) {
	if (record.status === "running") {
		upsertStep(record, step);
		if (reason !== void 0) record.reason = reason;
	}
}
function persistRun(db, record, options) {
	record.updatedAtMs = Math.max(Date.now(), record.updatedAtMs + 1);
	const recovery = record.verification.recovery;
	record.steps = record.steps.filter((step) => step.step !== "finalize:data-at-risk");
	if (recovery?.serviceRestartSafe === false && recovery.dataAtRisk) upsertStep(record, {
		step: "finalize:data-at-risk",
		status: "completed",
		failureFacts: [{
			check: "update-recovery",
			code: recovery.dataAtRisk
		}]
	});
	const row = encodeRun(record, options);
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("update_runs").set(row).where("run_id", "=", record.runId));
	return decodeRun(row);
}
function mutateRunInTransaction(db, runId, update, options, captureBefore) {
	const record = readUpdateRunRecord(db, runId);
	if (!record) throw new Error(`Unknown update run: ${runId}`);
	const before = JSON.stringify(record);
	captureBefore?.(structuredClone(record));
	update(record);
	return before === JSON.stringify(record) ? record : persistRun(db, record, options);
}
function mutateRun(runId, update, options, captureBefore) {
	return runExistingOpenClawStateWriteTransaction(({ db }) => mutateRunInTransaction(db, runId, update, options, captureBefore), options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.run",
		attributeUpdateWrite: options.attributeUpdateWrite,
		busyTimeoutMs: options.busyTimeoutMs
	});
}
const UPDATE_RUN_BOOKKEEPING_TIMEOUT_MS = 1e3;
const REQUIRED_UPDATE_RUN_STEPS = /* @__PURE__ */ new Set([
	...UPDATE_RUN_PHASES,
	"candidate-admission",
	"global update",
	"global update (omit optional)",
	"candidate-doctor-lint",
	"previous generation restoration",
	"post-update verification",
	"task-delivery-recovery",
	"openclaw doctor",
	"package rollback",
	"config rollback",
	"git-runtime-rollback"
]);
/** Recovery reads these receipts as well as phases and terminal outcomes. */
function isRequiredUpdateRunStep(step) {
	const key = updateRunStepKey(step.step);
	return REQUIRED_UPDATE_RUN_STEPS.has(key) || step.status === "failed" || step.reason !== void 0 || step.termination === "signal" || key.startsWith("finalize:") || key.startsWith("driver:") || key.startsWith("notice:") || key.startsWith("reconcile:") || key.startsWith("diagnostic:database ") || key.startsWith("git-rollback-");
}
function applyUpdateRunDiagnostics(record, diagnostics) {
	const { failure, verification, steps, recovery: observedRecovery, rollbackOutcome: observedRollback } = typeof diagnostics === "function" ? diagnostics(record.verification) : diagnostics;
	if (failure && record.status === "running") upsertStep(record, {
		...failure,
		status: "failed"
	});
	else if (failure && record.status === "failed") {
		const previous = record.steps.find((step) => step.step === updateRunStepKey(failure.step));
		if (previous?.status === "failed") upsertStep(record, {
			...previous,
			detail: previous.detail ?? failure.detail,
			exitCode: previous.exitCode ?? failure.exitCode,
			failureFacts: [...new Map([...previous.failureFacts ?? [], ...failure.failureFacts ?? []].map((fact) => [JSON.stringify(fact), fact])).values()].slice(0, 5)
		});
	}
	if (verification) {
		const { recovery, rollbackOutcome, booted, noticeDelivered, doctorHint } = record.verification;
		record.verification = {
			recovery,
			rollbackOutcome,
			booted,
			noticeDelivered,
			doctorHint
		};
		record.confirmedAtMs = null;
		for (const step of (steps ?? []).flatMap(updateRunStepsFromResultStep)) upsertStep(record, step);
	}
	const constraint = record.verification.recovery;
	const recovery = verification && constraint?.serviceRestartSafe === false ? !constraint.dataAtRisk && observedRecovery?.serviceRestartSafe === false && observedRecovery.dataAtRisk ? observedRecovery : constraint : observedRecovery;
	if (recovery || observedRollback || verification) recordUpdateRunVerificationRecord(record, {
		...verification,
		...verification ? record.verification : {},
		...recovery ? { recovery } : {},
		...observedRollback ? { rollbackOutcome: observedRollback } : {}
	});
}
/** Diagnostic capture cannot interrupt lifecycle work or replace its original outcome. */
function recordUpdateRunDiagnostics(runId, diagnostics, warn, options = {}) {
	try {
		if (typeof diagnostics !== "function" && !(diagnostics.failure || diagnostics.recovery || diagnostics.rollbackOutcome || diagnostics.verification)) return;
		return mutateRun(runId, (record) => applyUpdateRunDiagnostics(record, diagnostics), options);
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		const fact = createUpdateErrorFact("requested", error, options.env);
		warn(`Update diagnostics could not be recorded (${fact.code}): ${fact.message ?? "no error message"}`);
		return;
	}
}
function finishUpdateRun(runId, result, options = {}) {
	return mutateRun(runId, (record) => applyFinishUpdateRun(record, result), options);
}
function applyFinishUpdateRun(record, result) {
	if (record.status === "running") {
		const diagnostics = result.diagnostics;
		if (diagnostics) {
			applyUpdateRunDiagnostics(record, diagnostics);
			if (!diagnostics.verification) for (const step of (diagnostics.steps ?? []).flatMap(updateRunStepsFromResultStep)) upsertStep(record, step);
		}
		record.before = {
			...record.before,
			...result.before
		};
		const failed = record.steps.find((step) => step.status === "failed" && step.failureFacts?.length) ?? (result.status === "failed" ? record.steps.find((step) => step.step === record.phase) : void 0);
		finishUpdateRunRecord(record, result);
		if (result.status === "failed" || result.status === "rolled-back") {
			const summary = completeUpdateFailureSummary(record.reason, failed?.failureFacts);
			record.reason = summary.reason;
			if (failed) failed.failureFacts = summary.failureFacts;
			else upsertStep(record, {
				step: "update",
				status: "failed",
				failureFacts: summary.failureFacts
			});
		}
	}
}
//#endregion
export { applyUpdateRunStep as a, mutateRun as c, recordUpdateRunDiagnostics as d, updateRunLedgerSchema as f, normalizeUpdateFailureResult as g, findUpdateGatewayStop as h, applyUpdateRunPhase as i, mutateRunInTransaction as l, recordUpdateRunVerificationRecord as m, applyFinishUpdateRun as n, finishUpdateRun as o, isUpdateRunVerificationConfirmed as p, applyUpdateRunDiagnostics as r, isRequiredUpdateRunStep as s, UPDATE_RUN_BOOKKEEPING_TIMEOUT_MS as t, persistRun as u };
