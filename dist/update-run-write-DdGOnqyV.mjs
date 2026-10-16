import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { n as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BuT3Q1bJ.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { n as isPublicUpdateFailureCode } from "./update-failure-public-codes-C2YOHbsK.mjs";
import { n as createUpdateErrorFact } from "./update-failure-facts-CetdnXr-.mjs";
import { t as finishUpdateRunRecord } from "./update-run-record-Cu3LgwJt.mjs";
import { a as updateRunStepsFromResultStep, r as isFailedUpdateStep } from "./update-run-step-BDxgGAu8.mjs";
import { n as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-ClzrehCM.mjs";
import { n as encodeRun, r as isRetainedStep } from "./update-run-codec-DCsNX4NZ.mjs";
import { c as readUpdateRunRecord, n as decodeRun } from "./update-run-read.kernel-D2osBKAZ.mjs";
//#region src/infra/update-run-verification.ts
function isUpdateRunVerificationConfirmed(verification) {
	return verification.serviceRunning === true && verification.versionMatch === true && verification.settled === true && verification.readyz === true && verification.channelsReady === true && verification.pluginErrors?.length === 0;
}
function recordUpdateRunVerificationRecord(record, verification, options = {}) {
	if (options.onlyIfRunning && record.status !== "running") return;
	record.verification = {
		...record.verification,
		...verification,
		...verification.pluginErrors ? { pluginErrors: verification.pluginErrors.slice(-32) } : {}
	};
	if (record.status === "running" && verification.serviceRunning === false) record.confirmedAtMs = null;
	if (isUpdateRunVerificationConfirmed(record.verification) && record.confirmedAtMs === null) record.confirmedAtMs = Date.now();
}
//#endregion
//#region src/infra/update-run-step-key.ts
const RELEASED_STEP_KEYS = /* @__PURE__ */ new Map([
	["package-install", "global update"],
	["package-install-omit-optional", "global update (omit optional)"],
	["git-fetch", "git fetch"],
	["git-fetch-tags", "git fetch tags"],
	["git-fetch-target-tag", "git fetch target tag"],
	["git-target-inspection-fetch", "git target inspection fetch"],
	["git-import-admitted-target", "git import admitted target"]
]);
function updateRunStepKey(step) {
	return RELEASED_STEP_KEYS.get(step) ?? step;
}
//#endregion
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
//#region src/infra/update-run-write.ts
const updateRunLedgerSchema = extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "update_runs", {
	endMarker: "ON update_runs(status, created_at_ms DESC, run_id);",
	errorMessage: "Update run schema markers are missing"
});
function upsertStep(record, input) {
	const step = {
		...input,
		step: updateRunStepKey(input.step)
	};
	const index = record.steps.findIndex((existing) => existing.step === step.step);
	if (index >= 0) record.steps[index] = {
		...record.steps[index],
		...step
	};
	else record.steps.push(step);
	while (record.steps.length > 128) {
		const disposable = record.steps.findIndex((entry) => !isRetainedStep(entry));
		if (disposable < 0) throw new Error("Update run retained steps exceed the step limit");
		record.steps.splice(disposable, 1);
	}
}
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
	const recovery = verification && constraint?.serviceRestartSafe === false ? constraint : observedRecovery;
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
	return mutateRun(runId, (record) => {
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
	}, options);
}
//#endregion
export { isRequiredUpdateRunStep as a, persistRun as c, upsertStep as d, normalizeUpdateFailureResult as f, recordUpdateRunVerificationRecord as h, finishUpdateRun as i, recordUpdateRunDiagnostics as l, isUpdateRunVerificationConfirmed as m, applyUpdateRunPhase as n, mutateRun as o, updateRunStepKey as p, applyUpdateRunStep as r, mutateRunInTransaction as s, UPDATE_RUN_BOOKKEEPING_TIMEOUT_MS as t, updateRunLedgerSchema as u };
