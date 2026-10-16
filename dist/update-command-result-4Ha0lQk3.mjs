import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as isAbortError } from "./abort-signal-QqAmLWTl.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { r as formatUncaughtError, t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-CSOrFNcy.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { s as formatServiceInspectionReason } from "./service-inspection-error-Bsltcpi4.mjs";
import { d as resolveDaemonServiceInstallGuidance, i as formatDaemonServiceInstallCommand } from "./shared-DejcqFfy.mjs";
import { _ as FreeBsdPkgOwnershipError } from "./update-global-rkW-mKvG.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { f as isVerifiedUpdateRollback, i as UPDATE_FOREIGN_DESTINATION_REASON, l as formatUpdateActivationTimeoutGuidance, o as UPDATE_INSTALL_SKIP_GUIDANCE, r as UPDATE_ENVIRONMENT_FAILURE_REASONS } from "./update-outcome-BHX5xsqd.mjs";
import "./capability-consent-error-details-DqbomXex.mjs";
import { n as createUpdateErrorFact, r as createUpdateFailureFact } from "./update-failure-facts-CetdnXr-.mjs";
import { a as updateRunStepsFromResultStep, i as isUpdateGatewayReadinessPending, r as isFailedUpdateStep } from "./update-run-step-BDxgGAu8.mjs";
import { f as recordUpdateRunStep, g as UpdateRunAdmissionBusyError } from "./update-run-ledger-jBhhLo0P.mjs";
import { f as normalizeUpdateFailureResult, l as recordUpdateRunDiagnostics, o as mutateRun } from "./update-run-write-DdGOnqyV.mjs";
import { i as getUpdateRun } from "./update-run-reader-B7x8dkVs.mjs";
import { t as formatUpdateFailureFact } from "./update-failure-facts-format-Uhxv535Y.mjs";
import { c as updateRunReportInputFromResult, s as resolveUpdateRunVerifiedServingVersion } from "./update-run-report-C8yK_gib.mjs";
import { t as UpdateRequesterRevokedError } from "./update-requester-authority-CbCLnyCx.mjs";
import { s as markControlPlaneUpdateRestartSentinelFailure, u as writeControlPlaneUpdateRestartSentinel } from "./update-control-plane-sentinel-Du9790-7.mjs";
import { n as UpdatePreMutationError } from "./shared-CiAI6uii.mjs";
import { n as printResult } from "./progress-BdyrcKI6.mjs";
import { n as GatewayServiceUpdateOwnershipError } from "./update-command-service-plan-_baZk9PF.mjs";
import { n as loadUpdateRecovery } from "./update-run-recovery-iGTrAbe1.mjs";
import { t as GitCleanupReportingError } from "./update-runner-git-cleanup-CUL3zOzr.mjs";
import { r as formatErrorMessageForDisplay, t as attachErrorDiagnostic } from "./error-diagnostics-3wa3M_GE.mjs";
//#region src/cli/update-cli/update-recovery-guidance.ts
function resolveUnsafeUpdateRecoveryGuidance(reason, env = process.env) {
	const guidance = `Run \`${formatCliCommand("openclaw triage", env)}\` on this machine to open a coding agent that can diagnose and repair the installation.`;
	if (reason === "state-migration-started") return `${guidance} Update Doctor may have migrated state; keep the update installed and do not roll back code alone.`;
	return guidance;
}
function resolveUpdateResultNextAction(params) {
	const { result, env } = params;
	if (isUpdateGatewayReadinessPending(result) && result.reason !== "state-migrated-no-rollback") return `The readiness observation ended without confirmation. Leave the Gateway starting and keep recovery backups; check current progress with \`${formatCliCommand("openclaw gateway status --deep", env)}\`.`;
	if (result.reason === "dirty") return `Local changes prevented this update before installation. Your checkout was preserved. Commit your changes and retry, or run \`${formatCliCommand("openclaw triage", env)}\` for help.`;
	if (result.status === "skipped" && result.reason && Object.hasOwn(UPDATE_INSTALL_SKIP_GUIDANCE, result.reason)) return UPDATE_INSTALL_SKIP_GUIDANCE[result.reason];
	if (result.status === "error") {
		const doctorSettlement = result.steps.findLast((step) => step.name === "doctor process settlement");
		if (doctorSettlement && doctorSettlement.exitCode !== 0) return `${(doctorSettlement.failureFacts?.map((fact) => fact.message).filter(Boolean).join("; ") || doctorSettlement.stderrTail) ?? "Doctor process settlement could not be verified."} Keep the Gateway stopped while Doctor writers may still be running. Preserve the migrated state and recovery snapshots; after the recorded processes have stopped, run \`${formatCliCommand("openclaw update repair", env)}\`.`;
		if (result.reason === "state-migrated-no-rollback" && doctorSettlement?.exitCode === 0 && result.recovery?.serviceRestartSafe === true && result.recovery.service === "healthy") return `Doctor did not finish normally, but all tracked process groups stopped and the candidate Gateway is healthy on the preserved migrated state. Keep the recovery snapshots and run \`${formatCliCommand("openclaw update repair", env)}\` to finish maintenance.`;
		if (result.reason === "state-migrated-no-rollback" && result.steps.some((step) => step.name === "database rollback" && step.exitCode !== 0) && result.recovery?.serviceRestartSafe === true && result.recovery.service === "healthy") return `Rollback refused: ${result.rollbackOutcome?.reason ?? result.steps.findLast((step) => step.name === "database rollback")?.stderrTail ?? "restoring the backup would discard later writes"}. The Gateway is running on the preserved migrated state. Keep the recovery snapshots and run \`${formatCliCommand("openclaw update repair", env)}\` to finish maintenance.`;
		if (result.reason === "update-failed" && !result.recovery && (result.failedStep?.name === "requested" || result.failedStep?.name === "installation-inspection")) return `Update stopped before staging. Retry the same update command. If the failure persists, run \`${formatCliCommand("openclaw triage", env)}\` to inspect the recorded failure.`;
		if (result.reason === "update-activation-timeout") return formatUpdateActivationTimeoutGuidance((command) => formatCliCommand(command, env));
		if (result.reason === "rollback-project-changed") return `Other global packages changed after staging; automatic rollback was refused to preserve them. The new installation was left unchanged. Check \`${formatCliCommand("openclaw gateway status --deep", env)}\` before restarting it. ${resolveUnsafeUpdateRecoveryGuidance(void 0, env)}`;
		const reason = result.recovery?.serviceRestartSafe === false ? result.recovery.reason : void 0;
		const failure = truncateUtf16Safe(params.verificationFailure ?? result.reason ?? reason ?? "", 240);
		const runningVersion = truncateUtf16Safe(params.runningVersion ?? "", 120);
		const servingVersion = truncateUtf16Safe(params.verifiedServingVersion ?? "", 120);
		const state = servingVersion ? `Your Gateway is still serving ${servingVersion}; nothing to restore.${reason ? ` Restart remains unsafe (${reason}).` : ""}` : reason ? params.serviceRunning === true ? `The gateway is running${runningVersion ? ` ${runningVersion}` : ""} but did not pass verification (${failure}).` : `${params.serviceRunning === false ? "Managed gateway remains stopped because update recovery" : "Update recovery"} could not prove a runnable installation (${failure}).${params.serviceRunning === false ? " Keep the gateway stopped until the update succeeds." : ""}` : "";
		const configRefusal = result.steps.findLast((step) => step.name === "config-rollback")?.stderrTail;
		const failedStep = result.failedStep;
		const detail = result.reason && UPDATE_ENVIRONMENT_FAILURE_REASONS.has(result.reason) ? failedStep?.stderrTail : void 0;
		const foreignDestination = result.reason === UPDATE_FOREIGN_DESTINATION_REASON;
		return [
			detail,
			(foreignDestination || (result.mode === "npm" || result.mode === "pnpm" || result.mode === "bun") && (result.reason === "global-install-permission-denied" || failedStep !== void 0 && failedStep.exitCode !== 0 && !failedStep.advisory && /^package-(?:install|pack|stage|verify|swap|rollback|backup-retention|permissions)(?:-|$)/.test(failedStep.name) && /\beacces\b/i.test(failedStep.stderrTail ?? ""))) && (params.environment?.container ?? isContainerEnvironment()) ? `Detected ${foreignDestination ? "a foreign npm destination" : "package update permission failure"} inside a container. Pull or build an OpenClaw image with the target version, then recreate or redeploy the container with the same state/config mounts. In-container package changes are not durable.` : "",
			configRefusal,
			state,
			result.reason === "state-migrated-no-rollback" ? `Keep the new installation and recovery snapshots; do not roll back code alone. Run \`${formatCliCommand("openclaw update repair", env)}\` from the installed version to finish config and plugin maintenance.` : servingVersion ? `Fix ${truncateUtf16Safe(result.reason ?? "the update failure", 240)} then run \`${formatCliCommand("openclaw update", env)}\` again.` : void 0,
			reason === "state-migration-started" || !servingVersion && (reason || !detail) ? resolveUnsafeUpdateRecoveryGuidance(reason, env) : void 0
		].filter(Boolean).join(" ");
	}
	const command = (value) => formatCliCommand(value, env);
	if (result.reason === "not-git-install") return `This OpenClaw install isn't a git checkout, and the package manager couldn't be detected. Update via your package manager, then run \`${command("openclaw doctor")}\` and \`${command("openclaw gateway restart")}\`. Examples: \`npm i -g openclaw@latest\` or \`pnpm add -g openclaw@latest\`.`;
	if (result.status === "ok") {
		if (params.restart === false && result.postUpdate?.plugins?.changed) return `Plugins updated; Gateway restart skipped (--no-restart). Run \`${command("openclaw gateway restart")}\` to activate them in the running Gateway.`;
		return `After verifying your history, preview recovery rollback retirement with ${command("openclaw update cleanup --dry-run")} for state ${params.environment?.stateDir ?? resolveStateDir(env)}. Keep the same state/config overrides.`;
	}
}
//#endregion
//#region src/cli/update-cli/update-command-result.ts
function failUpdateCommandRun(error, run) {
	const options = { env: run.env };
	if (loadUpdateRecovery(run.runId, options)) return;
	const active = getUpdateRun(run.runId, options);
	if (active?.status !== "running") return;
	const step = active.steps.findLast((entry) => entry.status === "in_progress")?.step ?? active.phase;
	const fact = createUpdateErrorFact(step, error, run.env);
	recordUpdateRunDiagnostics(run.runId, { failure: {
		step,
		detail: fact.message,
		failureFacts: [fact]
	} }, defaultRuntime.error, options);
	if (!active.verification.rollbackOutcome) recordUpdateRunDiagnostics(run.runId, (recorded) => ({ rollbackOutcome: recorded.rollbackOutcome ?? (active.phase === "requested" ? {
		status: "not-needed",
		reason: "Update admission failed before package mutation"
	} : {
		status: "not-attempted",
		reason: "CLI unwind does not attempt package rollback after an unexpected exception"
	}) }), defaultRuntime.error, options);
	return fact;
}
function collectServiceInspectionFailureFacts(verdict) {
	return verdict?.kind === "unavailable" ? [createUpdateFailureFact({
		check: "managed-service",
		code: verdict.inspectionReason ?? "service-inspection-unavailable",
		message: verdict.inspectionReason && verdict.inspectionReason !== "windows-task-inspection-failed" ? formatServiceInspectionReason(verdict.inspectionReason) : verdict.message
	})] : void 0;
}
function recordServiceReconciliationWarning(result, env, message, port) {
	defaultRuntime.error(message);
	result.steps.push({
		name: "managed-service-reconciliation",
		command: formatDaemonServiceInstallCommand(env, port),
		cwd: result.root ?? "",
		durationMs: 0,
		exitCode: 0,
		advisory: {
			kind: "recoverable-maintenance",
			message
		}
	});
}
function recordServiceReconciliationWarnings(result, warnings, run, assertCurrent) {
	assertCurrent();
	const step = {
		name: "managed-service-reconciliation",
		command: "openclaw gateway install --force",
		cwd: result.root ?? "",
		durationMs: 0,
		exitCode: 0,
		warnings
	};
	result.steps.push(step);
	if (run) try {
		for (const row of updateRunStepsFromResultStep(step)) recordUpdateRunStep(run.runId, {
			...row,
			endedAtMs: Date.now()
		}, { env: run.env });
	} catch {
		assertCurrent();
		warnings.push("Could not record the service definition warning in update history.");
	}
}
function prepareUpdateServiceResult(params) {
	const verdict = params.preManagedServiceStop?.serviceUpdateVerdict;
	const serviceEnv = params.preManagedServiceStop?.serviceEnv ?? process.env;
	if (verdict?.kind === "unavailable") params.result.steps.push({
		name: "managed-service",
		command: formatCliCommand("openclaw gateway status --deep", serviceEnv),
		cwd: params.root,
		durationMs: 0,
		exitCode: 0,
		advisory: {
			kind: "recoverable-maintenance",
			message: verdict.message
		},
		failureFacts: collectServiceInspectionFailureFacts(verdict)
	});
	const shouldRestart = params.shouldRestart && params.opts.run?.completionOwner !== "gateway-restart" && (!params.coreAlreadyCurrent || params.preManagedServiceStop?.running === true);
	if (verdict?.kind === "owned" && verdict.requiresInstallRootRefresh && !shouldRestart) recordServiceReconciliationWarning(params.result, serviceEnv, `Gateway service still targets ${verdict.root}; the active installation is ${params.result.root ?? params.root}. Service reconciliation was skipped because restart is disabled or the service is stopped. ${resolveDaemonServiceInstallGuidance(void 0, serviceEnv, {
		stopped: params.preManagedServiceStop?.running === false,
		port: params.preManagedServiceStop?.servicePort
	})}`, params.preManagedServiceStop?.servicePort);
	return shouldRestart;
}
/** Terminal worker diagnostics do not participate in recovery decisions. */
function formatUpdateFinalizationError(error) {
	const contention = collectNestedErrorCandidates(error).find(isSqliteLockError);
	if (error && typeof error === "object" && contention instanceof Error) attachErrorDiagnostic(error, `SQLite contention call site:\n${formatUncaughtError(contention)}`);
	return formatErrorMessageForDisplay(error);
}
function primaryUpdateFailure(error) {
	const seen = /* @__PURE__ */ new Set();
	let current = error;
	while (current instanceof GitCleanupReportingError && current.cause !== void 0 && !seen.has(current)) {
		seen.add(current);
		current = current.cause;
	}
	return current;
}
function createUpdateCommandFailureResult(params) {
	const { failure, admission, phase, ...result } = params;
	const { detail } = failure;
	const cause = primaryUpdateFailure(failure.cause);
	const preMutationFailure = cause instanceof UpdatePreMutationError;
	const pkgOwnershipFailure = cause instanceof FreeBsdPkgOwnershipError;
	const admissionFailure = admission === true && cause instanceof GatewayServiceUpdateOwnershipError;
	const reason = cause instanceof UpdateRequesterRevokedError ? cause.code : preMutationFailure || pkgOwnershipFailure ? cause.reason : admissionFailure ? "managed-service-preflight" : "update-failed";
	const stepResult = preMutationFailure ? cause.stepResult : void 0;
	const failedStep = stepResult?.failedStep ?? {
		name: preMutationFailure || pkgOwnershipFailure || admissionFailure ? reason : phase ?? "update",
		command: "openclaw update",
		cwd: result.root ?? process.cwd(),
		durationMs: result.durationMs,
		exitCode: 1,
		...isAbortError(cause) ? { termination: "signal" } : {},
		...detail !== void 0 ? { stderrTail: detail } : {},
		...preMutationFailure && cause.recoverySteps ? { recoverySteps: cause.recoverySteps } : {},
		failureFacts: preMutationFailure || cause instanceof GatewayServiceUpdateOwnershipError ? cause.failureFacts : [createUpdateErrorFact(phase ?? "update", failure.cause)]
	};
	return {
		...result,
		status: "error",
		reason,
		failedStep,
		steps: stepResult?.failedStep ? stepResult.steps : [...stepResult?.steps ?? [], failedStep]
	};
}
/** Mutable exceptions cannot authorize recovery while command cleanup is unknown. */
async function resolveMutableUpdateFailure(params) {
	if (hasCommandProcessCleanupError(params.cause)) throw params.cause;
	const primary = primaryUpdateFailure(params.cause);
	if (primary instanceof UpdateCommandPendingRecoveryFailure) throw primary === params.cause ? primary : new UpdateCommandPendingRecoveryFailure(primary.result, formatErrorMessage(params.cause), { cause: params.cause });
	const failure = {
		cause: params.cause,
		detail: formatErrorMessage(params.cause)
	};
	defaultRuntime.error(failure.detail);
	let phase;
	if (params.run) try {
		const current = getUpdateRun(params.run.runId, { env: params.run.env });
		phase = current?.steps.findLast((step) => step.status === "in_progress")?.step ?? current?.phase;
	} catch {
		defaultRuntime.error("Warning: Update history could not be read; retaining the original failure without its recorded phase.");
	}
	return {
		failure,
		result: createUpdateCommandFailureResult({
			durationMs: params.durationMs,
			mode: params.mode,
			root: params.root,
			recovery: primary instanceof UpdatePreMutationError ? await params.originalRecovery() : {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed"
			},
			failure,
			phase
		})
	};
}
/** Report rejected read-only admission without creating a run or recovery diagnostics. */
async function withUpdateAdmissionReporting(opts, admit, mode = "unknown") {
	const startedAt = Date.now();
	try {
		return await admit();
	} catch (error) {
		if (error instanceof UpdateRunAdmissionBusyError) {
			const result = {
				status: "skipped",
				mode,
				reason: error.reason,
				steps: [],
				durationMs: Date.now() - startedAt,
				...opts.dryRun ? { dryRun: true } : {},
				notes: [error.message]
			};
			if (opts.json) defaultRuntime.writeJson(result);
			else defaultRuntime.log(theme.warn(error.message));
			return exitCliAfterOutput(defaultRuntime, result.mode === "finalize" ? 1 : 0);
		}
		if (error instanceof UpdateCommandPendingRecoveryFailure) return reportUpdateCommandPendingRecovery(error, opts);
		if (!(error instanceof GatewayServiceUpdateOwnershipError) && !(error instanceof FreeBsdPkgOwnershipError)) throw error;
		const message = error instanceof FreeBsdPkgOwnershipError ? error.message : `${error.message} Run \`openclaw gateway status --deep\` from the service's owning account before retrying.`;
		if (opts.json) defaultRuntime.error(message);
		await printResult(createUpdateCommandFailureResult({
			mode: "unknown",
			admission: true,
			failure: { cause: error },
			durationMs: 0
		}), opts, {
			readHistory: false,
			nextAction: message
		});
		return exitCliAfterOutput(defaultRuntime, 1);
	}
}
/** Unwind update ownership before diagnostics or an interactive agent can run. */
var UpdateCommandFailure = class extends Error {
	constructor(result, exitCode = 1, detail, options) {
		super(detail ?? result.reason ?? "Update failed", options);
		this.result = result;
		this.exitCode = exitCode;
		this.detail = detail;
		this.result = normalizeUpdateFailureResult(result, options?.cause);
		this.name = "UpdateCommandFailure";
		this.automaticTriage = options?.automaticTriage;
	}
};
/** A conservative pending outcome, never a grant of recovery or mutation authority. */
var UpdateCommandPendingRecoveryFailure = class extends UpdateCommandFailure {
	constructor(result, detail, options) {
		super({
			...result,
			status: "error",
			reason: result.status === "error" ? result.reason ?? "update-recovery-pending" : "update-recovery-pending",
			recovery: {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed"
			}
		}, 1, detail, options);
		this.name = "UpdateCommandPendingRecoveryFailure";
	}
};
async function reportUpdateCommandPendingRecovery(error, opts) {
	await printResult(error.result, opts, {
		readHistory: false,
		nextAction: error.detail
	});
	defaultRuntime.error(`Update recovery remains pending (${error.result.reason ?? "update-failed"}). Retained state and artifacts were left for the owning updater to reconcile; automatic restart and repair were not attempted.${error.detail ? `\n${error.detail}` : ""}`);
	return exitCliAfterOutput(defaultRuntime, error.exitCode);
}
/** Reporting-only marker: the outcome was recorded and printed; no follow-up triage. */
var UpdateCommandFinalizedRecoveryFailure = class extends UpdateCommandFailure {};
function mergeWindowsTaskRecoveryFailure(failure, recoveryError) {
	if (failure?.error instanceof UpdateCommandFailure) return { error: new UpdateCommandFailure({
		...failure.error.result,
		status: "error"
	}, 1, `${failure.error.message}; Windows autostart recovery: ${formatErrorMessage(recoveryError)}`, {
		cause: recoveryError,
		automaticTriage: failure.error.automaticTriage
	}) };
	return { error: failure ? new AggregateError([failure.error, recoveryError], `Update failed (${formatErrorMessage(failure.error)}) and Windows autostart recovery failed (${formatErrorMessage(recoveryError)})`, { cause: failure.error }) : recoveryError };
}
function resolveAutomaticUpdateTriage(result, detail, params) {
	const eligible = !isVerifiedUpdateRollback(result) && (params.mutationStarted || result.reason === "restart-unhealthy") && result.reason !== "service-revalidation-failed" && !(result.recovery?.serviceRestartSafe === false && result.recovery.reason === "rollback-checkout-dirty") && !result.postUpdate?.plugins?.npm.outcomes.some((outcome) => outcome.code === "PLUGIN_CAPABILITY_CONSENT_REQUIRED") && params.preManagedServiceStop?.serviceMutationAllowed !== false && !result.steps.some((step) => step.termination === "signal");
	const failedStep = result.steps.find(isFailedUpdateStep);
	const phase = result.reason ?? "update";
	return eligible ? {
		kind: "update",
		phase,
		error: detail ?? failedStep?.stderrTail ?? failedStep?.stdoutTail ?? phase,
		installationRoot: params.installKindChanged && result.mode === "git" ? params.root : result.root ?? params.root,
		expectedVersion: params.expectedVersion ?? result.after?.version ?? void 0,
		gateway: params.gateway
	} : void 0;
}
/** A fresh admission decision is data until its staging and executor owners settle. */
var UnreportedUpdateAdmissionOutcome = class extends Error {
	#report;
	get report() {
		return this.#report;
	}
	constructor(report, skipped) {
		super(report.message ?? report.reason);
		this.skipped = skipped;
		this.name = "UnreportedUpdateAdmissionOutcome";
		this.#report = report;
	}
};
async function writeControlPlaneUpdateRestartSentinelBestEffort(params) {
	if (!params.meta) return;
	try {
		await writeControlPlaneUpdateRestartSentinel({
			meta: params.meta,
			result: params.result
		}, params.env);
	} catch (err) {
		if (params.meta.completionOwner === "gateway-restart") throw err;
		const message = `Failed to write update.run restart sentinel: ${String(err)}`;
		if (params.jsonMode) defaultRuntime.error(message);
		else defaultRuntime.log(theme.warn(message));
	}
}
async function markControlPlaneUpdateRestartSentinelFailureBestEffort(params) {
	if (!params.meta) return;
	try {
		await markControlPlaneUpdateRestartSentinelFailure(params.reason, params.meta, params.env);
	} catch (err) {
		const message = `Failed to mark update.run restart sentinel failed: ${String(err)}`;
		if (params.jsonMode) defaultRuntime.error(message);
		else defaultRuntime.log(theme.warn(message));
	}
}
function recordUpdateResultNextAction(params, result, committed) {
	const run = params.opts.run;
	const env = run?.env ?? params.ownedManagedUpdateEnv ?? process.env;
	const environment = {
		container: isContainerEnvironment(),
		stateDir: resolveStateDir(env)
	};
	const resolveNextAction = (active) => {
		const { verification, steps } = updateRunReportInputFromResult(result, active);
		const failedVerification = steps.findLast((step) => (step.step === "gateway verification" || step.step === "gateway recovery verification") && step.status === "failed");
		return resolveUpdateResultNextAction({
			result: result.verification === void 0 ? result : {
				...result,
				recovery: verification.recovery ?? void 0
			},
			restart: params.coreAlreadyCurrent ? params.opts.restart : void 0,
			serviceRunning: verification.serviceRunning,
			runningVersion: verification.runningVersion,
			verifiedServingVersion: resolveUpdateRunVerifiedServingVersion(verification, steps.findLast((step) => step.step === "gateway recovery verification")),
			verificationFailure: failedVerification?.failureFacts?.length ? failedVerification.failureFacts.map(formatUpdateFailureFact).join("; ") : failedVerification?.detail,
			env,
			environment
		});
	};
	if (!run || committed) return resolveNextAction(committed);
	let nextAction;
	mutateRun(run.runId, (record) => {
		nextAction = resolveNextAction(record);
		if (record.status === "running") record.origin.nextAction = nextAction;
	}, { env: run.env });
	return nextAction;
}
//#endregion
export { resolveMutableUpdateFailure as _, collectServiceInspectionFailureFacts as a, formatUpdateFinalizationError as c, prepareUpdateServiceResult as d, recordServiceReconciliationWarning as f, resolveAutomaticUpdateTriage as g, reportUpdateCommandPendingRecovery as h, UpdateCommandPendingRecoveryFailure as i, markControlPlaneUpdateRestartSentinelFailureBestEffort as l, recordUpdateResultNextAction as m, UpdateCommandFailure as n, createUpdateCommandFailureResult as o, recordServiceReconciliationWarnings as p, UpdateCommandFinalizedRecoveryFailure as r, failUpdateCommandRun as s, UnreportedUpdateAdmissionOutcome as t, mergeWindowsTaskRecoveryFailure as u, withUpdateAdmissionReporting as v, writeControlPlaneUpdateRestartSentinelBestEffort as y };
