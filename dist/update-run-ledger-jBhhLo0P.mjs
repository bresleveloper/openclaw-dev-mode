import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { n as readUpdateRunDriver, r as sameUpdateRunDriver, t as inspectUpdateRunDriver } from "./update-run-driver-k0LVIIq0.mjs";
import { t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { n as assertSqliteIntegrity, t as SqliteRepairableForeignKeyError } from "./sqlite-integrity-GtqcmwG3.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { l as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, o as withArtifactPreservingStateReads, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { s as isOpenClawStateWriteContentionError } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { i as isUnacknowledgedPackageOwnerRefusal, n as isAbandonedUpdateRun, t as finishUpdateRunRecord } from "./update-run-record-Cu3LgwJt.mjs";
import { n as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-ClzrehCM.mjs";
import { c as recordedUpdateRunDrivers, o as isStaleIdentitylessUpdateRun, r as inspectUpdateRepairDriverAdmission } from "./update-run-activity-CykyDahG.mjs";
import { n as encodeRun } from "./update-run-codec-DCsNX4NZ.mjs";
import { c as readUpdateRunRecord, n as decodeRun, r as hasStoredUpdateRecovery, t as canReconcileUpdateRunCandidates } from "./update-run-read.kernel-D2osBKAZ.mjs";
import { i as isUpdateRecoveryPending } from "./update-run-recovery-schema-e6yHe0bS.mjs";
import { t as inspectRecoveryRows } from "./update-run-recovery-store-CS8wUkZx.mjs";
import { a as isRequiredUpdateRunStep, c as persistRun, d as upsertStep, h as recordUpdateRunVerificationRecord, n as applyUpdateRunPhase, o as mutateRun, r as applyUpdateRunStep, s as mutateRunInTransaction, t as UPDATE_RUN_BOOKKEEPING_TIMEOUT_MS, u as updateRunLedgerSchema } from "./update-run-write-DdGOnqyV.mjs";
import "./update-run-reader-B7x8dkVs.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/infra/update-run-admission.ts
var UpdateRunAdmissionBusyError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.reason = "update-ledger-busy";
	}
};
function runUpdateRunAdmission(operation, options, contract) {
	if (options.database) throw new Error("Update run admission requires its own writable connection");
	const inspection = withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db, path }) => {
		try {
			assertSqliteIntegrity(db, path);
			return { repairable: void 0 };
		} catch (error) {
			if (!(error instanceof SqliteRepairableForeignKeyError)) throw error;
			return { repairable: error };
		}
	}, options);
	if (inspection) {
		if (inspection.repairable && !contract.recoverTaskDeliveryOrphans) throw inspection.repairable;
		try {
			return runExistingOpenClawStateWriteTransaction(({ db, recoveryChanges }) => operation(db, recoveryChanges), options, {
				schemaSql: contract.schemaSql,
				operationLabel: "update.run",
				busyTimeoutMs: contract.busyTimeoutMs,
				initializeAdditiveSchema: true,
				...inspection.repairable ? { recoverTaskDeliveryOrphans: true } : {}
			});
		} catch (error) {
			if (inspection.repairable) throw new Error(`${inspection.repairable.message} Update admission could not complete recovery: ${formatErrorMessage(error)}`, { cause: error });
			if (isOpenClawStateWriteContentionError(error)) throw new UpdateRunAdmissionBusyError("Update history is busy. Admission was deferred; previous history is unchanged. Retry `openclaw update` after the current database writer finishes.", { cause: error });
			throw error;
		}
	}
	return runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(contract.schemaSql);
		return operation(db, []);
	}, options, { operationLabel: "update.run" });
}
//#endregion
//#region src/infra/update-run-reconciliation.ts
function prepareReconciliation(options) {
	const captured = {
		...options,
		env: cloneEnvWithPlatformSemantics(options.env ?? process.env),
		...options.redactPaths ? { redactPaths: [...options.redactPaths] } : {}
	};
	const context = captureOpenClawStateWorkerContext(captured);
	captured.path = context.admission.databasePath;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		captured.signal?.throwIfAborted();
	};
	assertCurrent();
	return {
		options: captured,
		context,
		assertCurrent
	};
}
async function reconcileCandidates(candidates, selection, prepared) {
	prepared.assertCurrent();
	if (!canReconcileUpdateRunCandidates(candidates, selection) && selection.repairHistorySinceMs === void 0) return {
		current: candidates.map(({ record }) => record),
		reconciled: []
	};
	const { context, options, assertCurrent } = prepared;
	if (options.database || options.readOnly) throw new Error("Existing-state writes require their own tracked writable connection.");
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "updateRuns.reconcile",
		input: {
			candidates,
			selection,
			busyTimeoutMs: options.busyTimeoutMs,
			redactPaths: options.redactPaths
		}
	}), {
		existingOnly: true,
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
	if (!result) throw new Error("Update history disappeared before reconciliation");
	return result;
}
/** Select without write access, then reread eligibility under the existing-schema writer. */
async function reconcileAbandonedUpdateRunsAsync(input = {}, options = {}) {
	if (input.runIds?.length === 0) return [];
	const selection = {
		...input,
		...input.runIds ? { runIds: [...input.runIds] } : {}
	};
	const prepared = prepareReconciliation(options);
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(prepared.options, {
		type: "updateRuns.reconciliationCandidates",
		input: selection
	}, {
		context: prepared.context,
		signal: prepared.options.signal,
		preferIndependentWarmRead: true
	}));
	prepared.assertCurrent();
	if (!reply) return [];
	if (!reply.ok || reply.type !== "updateRuns.reconciliationCandidates") throw new Error("Unexpected update run reconciliation lookup result");
	return (await reconcileCandidates(reply.candidates, selection, prepared)).reconciled;
}
/** History remains readable when best-effort reconciliation cannot obtain write access. */
async function getUpdateRunWithReconciliationAsync(runId, options = {}) {
	const prepared = prepareReconciliation(options);
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(prepared.options, {
		type: "updateRuns.reconciliationCandidate",
		runId
	}, {
		context: prepared.context,
		signal: prepared.options.signal,
		preferIndependentWarmRead: true
	}));
	prepared.assertCurrent();
	if (!reply) return { run: void 0 };
	if (!reply.ok || reply.type !== "updateRuns.reconciliationCandidate") throw new Error("Unexpected update run reconciliation lookup result");
	if (!reply.candidate) return { run: void 0 };
	try {
		return { run: (await reconcileCandidates([reply.candidate], {}, prepared)).current[0] };
	} catch (error) {
		prepared.assertCurrent();
		return {
			run: reply.candidate.record,
			reconciliationError: formatErrorMessage(error)
		};
	}
}
//#endregion
//#region src/infra/update-run-ledger.ts
function createUpdateRun(input, options = {}) {
	const now = Date.now();
	const initial = {
		runId: input.runId ?? randomUUID(),
		createdAtMs: now,
		updatedAtMs: now,
		trigger: input.trigger,
		phase: "requested",
		status: "running",
		reason: null,
		origin: input.origin ?? {},
		target: input.target ?? {},
		before: input.before ?? {},
		after: {},
		steps: [{
			step: "requested",
			status: "in_progress",
			startedAtMs: now
		}],
		verification: {},
		repair: [],
		confirmedAtMs: null,
		finishedAtMs: null,
		downtimeMs: null
	};
	if (input.settlement) {
		upsertStep(initial, {
			step: "reconcile:settle",
			status: "completed",
			endedAtMs: now,
			detail: input.settlement.detail
		});
		finishUpdateRunRecord(initial, {
			status: "succeeded",
			reason: input.settlement.reason
		});
	}
	const row = encodeRun(initial, options);
	return runUpdateRunAdmission((db, recoveryChanges) => {
		const recordRecovery = (record) => {
			if (recoveryChanges.length > 0) upsertStep(record, {
				step: "task-delivery-recovery",
				status: "completed",
				startedAtMs: now,
				endedAtMs: Date.now(),
				detail: recoveryChanges.join("\n")
			});
			return record;
		};
		const existing = readUpdateRunRecord(db, row.run_id);
		if (existing) return recoveryChanges.length > 0 ? persistRun(db, recordRecovery(existing), options) : existing;
		if (input.supersedeStaleIdentityless && !input.runId && input.trigger === "cli") {
			const active = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("update_runs").selectAll().where("status", "=", "running").limit(2)).rows;
			const previous = active.length === 1 && active[0] ? decodeRun(active[0]) : void 0;
			if (previous && !hasStoredUpdateRecovery(db, previous.runId) && isStaleIdentitylessUpdateRun(previous)) {
				upsertStep(previous, {
					step: "reconcile:superseded",
					status: "failed",
					endedAtMs: now,
					detail: "operator-started-update-supersedes-inactive-identityless-run"
				});
				finishUpdateRunRecord(previous, {
					status: "failed",
					reason: "superseded"
				});
				persistRun(db, previous, options);
			}
		}
		const admittedRow = encodeRun(recordRecovery(decodeRun(row)), options);
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("update_runs").values(admittedRow));
		return decodeRun(admittedRow);
	}, options, {
		schemaSql: updateRunLedgerSchema,
		busyTimeoutMs: options.busyTimeoutMs,
		recoverTaskDeliveryOrphans: !input.preview
	});
}
/** Adoption is explicit: reading or reserving an existing run does not make this process its driver. */
function adoptUpdateRun(runId, options = {}) {
	const driver = readUpdateRunDriver();
	let identityUnavailable = false;
	const adopted = mutateRun(runId, (record) => {
		if (record.status !== "running") throw new Error(`Update run ${runId} is already ${record.status}; it cannot be adopted.`);
		if (!driver) {
			if (!record.steps.some((step) => step.step === "driver:identity-unavailable")) {
				upsertStep(record, {
					step: "driver:identity-unavailable",
					status: "completed",
					endedAtMs: Date.now()
				});
				identityUnavailable = true;
			}
			return;
		}
		const previousDrivers = [];
		for (const previous of recordedUpdateRunDrivers(record)) if (!sameUpdateRunDriver(previous, driver) && !previousDrivers.some((retained) => sameUpdateRunDriver(retained, previous)) && inspectUpdateRunDriver(previous) !== "dead") previousDrivers.push(previous);
		if (previousDrivers.length >= 8) throw new Error(`Update run ${runId} has too many live or unobservable drivers; adoption refused.`);
		const retained = record.origin.previousDrivers ?? [];
		if (record.origin.driver && sameUpdateRunDriver(record.origin.driver, driver) && record.steps.some((step) => step.step === "driver:adopted") && retained.length === previousDrivers.length && retained.every((previous, index) => {
			const next = previousDrivers[index];
			return next !== void 0 && sameUpdateRunDriver(previous, next);
		})) return;
		record.origin.driver = driver;
		record.origin.previousDrivers = previousDrivers.length ? previousDrivers : void 0;
		upsertStep(record, {
			step: "driver:adopted",
			status: "completed",
			endedAtMs: Date.now()
		});
	}, options);
	if (identityUnavailable) console.warn("[update] Driver identity recording is unavailable. The update will continue; this run requires explicit recovery if it stops reporting progress.");
	return adopted;
}
/** Retained orchestrators can renew their children; pruned identities cannot. */
function heartbeatUpdateRun(runId, driver, options = {}) {
	if (!driver) return;
	mutateRun(runId, (record) => {
		if (record.status === "running" && recordedUpdateRunDrivers(record).some((current) => sameUpdateRunDriver(current, driver))) record.updatedAtMs = Math.max(Date.now(), record.updatedAtMs + 1);
	}, options);
}
/** Record successful repair without changing the failed outcome; report only new acknowledgment. */
function acknowledgeAbandonedUpdateRun(runId, options = {}) {
	let acknowledged = false;
	mutateRun(runId, (record) => {
		if (isAbandonedUpdateRun(record) && !record.steps.some((step) => step.step === "reconcile:acknowledged")) {
			upsertStep(record, {
				step: "reconcile:acknowledged",
				status: "completed",
				endedAtMs: Date.now()
			});
			acknowledged = true;
		}
	}, options);
	return acknowledged;
}
function recordUpdateRunPhase(runId, phase, patch = {}, options = {}, captureBefore) {
	return mutateRun(runId, (record) => applyUpdateRunPhase(record, phase, patch), options, captureBefore);
}
function recordUpdateRunStep(runId, step, options = {}) {
	const required = isRequiredUpdateRunStep(step);
	const current = required ? options : {
		...options,
		busyTimeoutMs: Math.min(options.busyTimeoutMs ?? 1e3, UPDATE_RUN_BOOKKEEPING_TIMEOUT_MS)
	};
	try {
		return mutateRun(runId, (record) => applyUpdateRunStep(record, step), current);
	} catch (error) {
		if (required || !isSqliteLockError(error)) throw error;
		console.warn("[update] History database is locked; bookkeeping was not recorded. The update will continue.");
		return;
	}
}
function recordUpdateRunRepairContinuation(runId, inheritedRunId, options = {}) {
	mutateRun(runId, (record) => {
		const admission = inspectUpdateRepairDriverAdmission([record], inheritedRunId);
		if (admission.kind === "conflict") throw new Error(admission.message);
		const step = admission.kind === "continuation" ? "finalize:repair-continuation" : "finalize:repair-takeover";
		if (record.steps.some((entry) => entry.step === step)) return;
		upsertStep(record, {
			step,
			status: "completed",
			endedAtMs: Date.now(),
			detail: admission.kind === "continuation" ? `Repair continued within the owning update by PID ${process.pid}.` : `Repair took over Gateway activation by PID ${process.pid} under abandonment admission.`
		});
	}, options);
}
/** A terminal process diagnostic adds evidence without reopening the recorded outcome. */
function recordUpdateRunDiagnostic(runId, detail, options = {}, step = "finalize:exit") {
	return mutateRun(runId, (record) => {
		upsertStep(record, {
			step,
			status: "completed",
			endedAtMs: Date.now(),
			detail
		});
	}, options);
}
/** Correct the shipped refusal classification only after its install target was satisfied. */
function reconcilePackageOwnerRefusal(expected, options = {}) {
	if (!isUnacknowledgedPackageOwnerRefusal(expected)) return false;
	return runExistingOpenClawStateWriteTransaction(({ db }) => {
		const query = getNodeSqliteKysely(db).selectFrom("update_runs");
		const latest = executeSqliteQueryTakeFirstSync(db, query.selectAll().orderBy("created_at_ms", "desc").orderBy("run_id", "desc").limit(1));
		if (!latest || !isDeepStrictEqual(decodeRun(latest), expected) || executeSqliteQueryTakeFirstSync(db, query.select("run_id").where("status", "=", "running").limit(1)) || inspectRecoveryRows(db).some(({ record }) => record.runId === expected.runId || isUpdateRecoveryPending(record))) return false;
		mutateRunInTransaction(db, expected.runId, (record) => {
			record.status = "skipped";
			record.reason = "unmanaged-package-install";
			for (const step of record.steps) if (step.step === "requested") step.status = "skipped";
			upsertStep(record, {
				step: "reconcile:acknowledged",
				status: "completed",
				endedAtMs: Date.now()
			});
		}, options);
		return true;
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.run",
		busyTimeoutMs: options.busyTimeoutMs
	});
}
/** Close only this local preview, excluding recovery in the same stable-schema transaction. */
function finishInterruptedUpdatePreview(expected, options) {
	if (expected.status !== "running" || expected.phase !== "requested") throw new Error("Preview interruption requires an active admission");
	runExistingOpenClawStateWriteTransaction(({ db }) => {
		if (inspectRecoveryRows(db).some(({ record }) => record.runId === expected.runId || isUpdateRecoveryPending(record))) return;
		mutateRunInTransaction(db, expected.runId, (record) => {
			if (isDeepStrictEqual(record, expected)) finishUpdateRunRecord(record, {
				status: "skipped",
				reason: "interrupted"
			});
		}, options);
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.preview.interrupted"
	});
}
/** Caller holds fresh local admission and a live executor; retained recovery stays refused. */
function finishInterruptedUpdateBeforeActivation(expected, assertCurrent, options) {
	if (expected.status !== "running" || ![
		"requested",
		"staging",
		"validating"
	].includes(expected.phase)) throw new Error("Update interruption requires its live pre-activation transaction");
	const recoveryTable = "config_machine_state";
	const recoverySchema = extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, recoveryTable, {
		endMarker: ") STRICT;",
		errorMessage: "Interrupted update schema is unavailable."
	});
	assertCurrent();
	runExistingOpenClawStateWriteTransaction(({ db, path: pathname }) => {
		assertCurrent();
		if (executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("main.sqlite_schema").select("name").where("name", "=", recoveryTable))) assertSqliteSchemaContains(db, pathname, recoverySchema);
		if (!inspectRecoveryRows(db).some(({ record }) => record.runId === expected.runId || isUpdateRecoveryPending(record))) mutateRunInTransaction(db, expected.runId, (record) => {
			if (isDeepStrictEqual(record, expected)) finishUpdateRunRecord(record, {
				status: "failed",
				reason: "interrupted"
			});
		}, options);
		assertCurrent();
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.interrupted"
	});
}
function recordUpdateRunVerification(runId, verification, options = {}) {
	return mutateRun(runId, (record) => recordUpdateRunVerificationRecord(record, verification, options), options);
}
function recordUpdateRunRepairAttempt(runId, attempt, options = {}) {
	return mutateRun(runId, (record) => {
		if (record.status !== "running") return;
		record.repair = [...record.repair.filter((entry) => entry.attempt !== attempt.attempt), attempt].slice(-16);
	}, options);
}
//#endregion
export { finishInterruptedUpdatePreview as a, recordUpdateRunDiagnostic as c, recordUpdateRunRepairContinuation as d, recordUpdateRunStep as f, UpdateRunAdmissionBusyError as g, reconcileAbandonedUpdateRunsAsync as h, finishInterruptedUpdateBeforeActivation as i, recordUpdateRunPhase as l, getUpdateRunWithReconciliationAsync as m, adoptUpdateRun as n, heartbeatUpdateRun as o, recordUpdateRunVerification as p, createUpdateRun as r, reconcilePackageOwnerRefusal as s, acknowledgeAbandonedUpdateRun as t, recordUpdateRunRepairAttempt as u };
