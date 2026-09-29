import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-maXyqxro.mjs";
import { n as isAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { r as formatUncaughtError, t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { f as isVerifiedUpdateRollback, i as UPDATE_FOREIGN_DESTINATION_REASON, l as formatUpdateActivationTimeoutGuidance, o as UPDATE_INSTALL_SKIP_GUIDANCE, r as UPDATE_ENVIRONMENT_FAILURE_REASONS } from "./update-outcome-ZpL2Kt9B.mjs";
import "./capability-consent-error-details-CF5XfV3G.mjs";
import { n as createUpdateFailureFact, t as createUpdateErrorFact } from "./update-failure-facts-THF-vx3i.mjs";
import { o as formatServiceInspectionReason } from "./service-inspection-error-axo4k_qi.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.mjs";
import { l as writeControlPlaneUpdateRestartSentinel, o as markControlPlaneUpdateRestartSentinelFailure } from "./update-control-plane-sentinel-D6ewFI99.mjs";
import { a as recordUpdateRunDiagnostics } from "./update-run-write-rAL063vt.mjs";
import { i as updateRunStepsFromResultStep, n as isFailedUpdateStep, r as isUpdateGatewayReadinessPending } from "./update-run-step-ijjXM1mH.mjs";
import { f as recordUpdateRunPhase, h as recordUpdateRunStep, x as UpdateRunAdmissionBusyError } from "./update-run-ledger-CwAEg-5V.mjs";
import { r as getUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import { d as resolveDaemonServiceInstallGuidance, i as formatDaemonServiceInstallCommand } from "./shared-Ba-Zp0iU.mjs";
import { t as UpdateRequesterRevokedError } from "./update-requester-authority-DOtkGjU8.mjs";
import { k as FreeBsdPkgOwnershipError } from "./update-runner-command-DJ8Zpaha.mjs";
import { n as UpdatePreMutationError } from "./shared-Ca2ebFXK.mjs";
import { t as formatUpdateFailureFact } from "./update-failure-facts-format-Uhxv535Y.mjs";
import { s as updateRunReportInputFromResult } from "./update-run-report-Dh57tzMI.mjs";
import { n as printResult } from "./progress-e3kXKPyp.mjs";
import { n as GatewayServiceUpdateOwnershipError } from "./update-command-service-plan-B89pDfz8.mjs";
import { r as loadUpdateRecovery } from "./update-run-recovery-admission-CrH0cC4v.mjs";
import { r as formatErrorMessageForDisplay, t as attachErrorDiagnostic } from "./error-diagnostics-805LTf-V.mjs";
//#region src/cli/update-cli/update-recovery-guidance.ts
function resolveUnsafeUpdateRecoveryGuidance(reason, env = process.env) {
	const guidance = `Run \`${formatCliCommand("openclaw triage", env)}\` on this machine to open a coding agent that can diagnose and repair the installation.`;
	if (reason === "state-migration-started") return `${guidance} Update Doctor may have migrated state; keep the update installed and do not roll back code alone.`;
	return guidance;
}
function resolveUpdateResultNextAction(params) {
	const { result, env } = params;
	if (isUpdateGatewayReadinessPending(result)) return `The readiness observation ended without confirmation. Leave the Gateway starting and keep recovery backups; check current progress with \`${formatCliCommand("openclaw gateway status --deep", env)}\`.`;
	if (result.reason === "dirty") return `Local changes prevented this update before installation. Your checkout was preserved. Commit your changes and retry, or run \`${formatCliCommand("openclaw triage", env)}\` for help.`;
	if (result.status === "skipped" && result.reason && Object.hasOwn(UPDATE_INSTALL_SKIP_GUIDANCE, result.reason)) return UPDATE_INSTALL_SKIP_GUIDANCE[result.reason];
	if (result.status === "error") {
		if (result.reason === "update-failed" && !result.recovery && (result.failedStep?.name === "requested" || result.failedStep?.name === "installation-inspection")) return `Update stopped before staging. Retry the same update command. If the failure persists, run \`${formatCliCommand("openclaw triage", env)}\` to inspect the recorded failure.`;
		if (result.reason === "update-activation-timeout") return formatUpdateActivationTimeoutGuidance((command) => formatCliCommand(command, env));
		if (result.reason === "rollback-project-changed") return `Other global packages changed after staging; automatic rollback was refused to preserve them. The new installation was left unchanged. Check \`${formatCliCommand("openclaw gateway status --deep", env)}\` before restarting it. ${resolveUnsafeUpdateRecoveryGuidance(void 0, env)}`;
		const reason = result.recovery?.serviceRestartSafe === false ? result.recovery.reason : void 0;
		const failure = truncateUtf16Safe(params.verificationFailure ?? result.reason ?? reason ?? "", 240);
		const runningVersion = truncateUtf16Safe(params.runningVersion ?? "", 120);
		const state = reason ? params.serviceRunning === true ? `The gateway is running${runningVersion ? ` ${runningVersion}` : ""} but did not pass verification (${failure}).` : `${params.serviceRunning === false ? "Managed gateway remains stopped because update recovery" : "Update recovery"} could not prove a runnable installation (${failure}).${params.serviceRunning === false ? " Keep the gateway stopped until the update succeeds." : ""}` : "";
		const configRefusal = result.steps.findLast((step) => step.name === "config-rollback")?.stderrTail;
		const failedStep = result.failedStep;
		const detail = result.reason && UPDATE_ENVIRONMENT_FAILURE_REASONS.has(result.reason) ? failedStep?.stderrTail : void 0;
		const foreignDestination = result.reason === UPDATE_FOREIGN_DESTINATION_REASON;
		return [
			detail,
			(foreignDestination || (result.mode === "npm" || result.mode === "pnpm" || result.mode === "bun") && (result.reason === "global-install-permission-denied" || failedStep !== void 0 && failedStep.exitCode !== 0 && !failedStep.advisory && /^package-(?:install|pack|stage|verify|swap|rollback|backup-retention|permissions)(?:-|$)/.test(failedStep.name) && /\beacces\b/i.test(failedStep.stderrTail ?? ""))) && isContainerEnvironment() ? `Detected ${foreignDestination ? "a foreign npm destination" : "package update permission failure"} inside a container. Pull or build an OpenClaw image with the target version, then recreate or redeploy the container with the same state/config mounts. In-container package changes are not durable.` : "",
			configRefusal,
			state,
			reason || !detail ? resolveUnsafeUpdateRecoveryGuidance(reason, env) : void 0
		].filter(Boolean).join(" ");
	}
	const command = (value) => formatCliCommand(value, env);
	if (result.reason === "not-git-install") return `This OpenClaw install isn't a git checkout, and the package manager couldn't be detected. Update via your package manager, then run \`${command("openclaw doctor")}\` and \`${command("openclaw gateway restart")}\`. Examples: \`npm i -g openclaw@latest\` or \`pnpm add -g openclaw@latest\`.`;
	if (result.status === "ok") {
		if (params.restart === false && result.postUpdate?.plugins?.changed) return `Plugins updated; Gateway restart skipped (--no-restart). Run \`${command("openclaw gateway restart")}\` to activate them in the running Gateway.`;
		return `After verifying your history, preview recovery rollback retirement with ${command("openclaw update cleanup --dry-run")} for state ${resolveStateDir(env)}. Keep the same state/config overrides.`;
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
		message: verdict.inspectionReason ? formatServiceInspectionReason(verdict.inspectionReason) : verdict.message
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
function createUpdateCommandFailureResult(params) {
	const { failure, admission, phase, ...result } = params;
	const { cause, detail } = failure;
	const preMutationFailure = cause instanceof UpdatePreMutationError;
	const pkgOwnershipFailure = cause instanceof FreeBsdPkgOwnershipError;
	const admissionFailure = admission === true && cause instanceof GatewayServiceUpdateOwnershipError;
	const reason = cause instanceof UpdateRequesterRevokedError ? cause.code : preMutationFailure || pkgOwnershipFailure ? cause.reason : admissionFailure ? "managed-service-preflight" : "update-failed";
	const failedStep = {
		name: preMutationFailure || pkgOwnershipFailure || admissionFailure ? reason : phase ?? "update",
		command: "openclaw update",
		cwd: result.root ?? process.cwd(),
		durationMs: result.durationMs,
		exitCode: 1,
		...isAbortError(cause) ? { termination: "signal" } : {},
		...detail !== void 0 ? { stderrTail: detail } : {},
		...preMutationFailure && cause.recoverySteps ? { recoverySteps: cause.recoverySteps } : {},
		failureFacts: preMutationFailure || cause instanceof GatewayServiceUpdateOwnershipError ? cause.failureFacts : [createUpdateErrorFact(phase ?? "update", cause)]
	};
	return {
		...result,
		status: "error",
		reason,
		failedStep,
		steps: [failedStep]
	};
}
/** Mutable exceptions cannot authorize recovery while command cleanup is unknown. */
async function resolveMutableUpdateFailure(params) {
	if (hasCommandProcessCleanupError(params.cause) || params.cause instanceof UpdateCommandPendingRecoveryFailure) throw params.cause;
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
			recovery: params.cause instanceof UpdatePreMutationError ? await params.originalRecovery() : {
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
var UpdateCommandFinalizedRecoveryFailure = class extends UpdateCommandFailure {
	constructor(result) {
		super(result, 1);
	}
};
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
	constructor(report, skipped) {
		super(report.message ?? report.reason);
		this.report = report;
		this.skipped = skipped;
		this.name = "UnreportedUpdateAdmissionOutcome";
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
	const active = committed ?? (run ? getUpdateRun(run.runId, { env: run.env }) : void 0);
	const { verification, steps } = updateRunReportInputFromResult(result, active);
	const failedVerification = steps.findLast((step) => (step.step === "gateway verification" || step.step === "gateway recovery verification") && step.status === "failed");
	const nextAction = resolveUpdateResultNextAction({
		result: result.verification === void 0 ? result : {
			...result,
			recovery: verification.recovery ?? void 0
		},
		restart: params.coreAlreadyCurrent ? params.opts.restart : void 0,
		serviceRunning: verification.serviceRunning,
		runningVersion: verification.runningVersion,
		verificationFailure: failedVerification?.failureFacts?.length ? failedVerification.failureFacts.map(formatUpdateFailureFact).join("; ") : failedVerification?.detail,
		env: run?.env ?? params.ownedManagedUpdateEnv ?? process.env
	});
	if (run && active?.status === "running" && active.origin.nextAction !== nextAction) recordUpdateRunPhase(run.runId, active.phase, { origin: { nextAction } }, { env: run.env });
	return nextAction;
}
//#endregion
export { resolveMutableUpdateFailure as _, collectServiceInspectionFailureFacts as a, formatUpdateFinalizationError as c, prepareUpdateServiceResult as d, recordServiceReconciliationWarning as f, resolveAutomaticUpdateTriage as g, reportUpdateCommandPendingRecovery as h, UpdateCommandPendingRecoveryFailure as i, markControlPlaneUpdateRestartSentinelFailureBestEffort as l, recordUpdateResultNextAction as m, UpdateCommandFailure as n, createUpdateCommandFailureResult as o, recordServiceReconciliationWarnings as p, UpdateCommandFinalizedRecoveryFailure as r, failUpdateCommandRun as s, UnreportedUpdateAdmissionOutcome as t, mergeWindowsTaskRecoveryFailure as u, withUpdateAdmissionReporting as v, writeControlPlaneUpdateRestartSentinelBestEffort as y };
