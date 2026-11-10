import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as formatUncaughtError, t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as isStateDatabaseMaintenanceContention } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as acquireWithWait } from "./acquire-with-wait-JZafJKyw.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { i as UPDATE_FOREIGN_DESTINATION_REASON, l as formatUpdateActivationTimeoutGuidance, o as UPDATE_INSTALL_SKIP_GUIDANCE, r as UPDATE_ENVIRONMENT_FAILURE_REASONS } from "./update-outcome-DLbo5ecI.mjs";
import { n as formatUpdateFailureFact } from "./update-failure-facts-format-DbAtk-ZC.mjs";
import { c as formatServiceInspectionReason } from "./service-inspection-error-ozNMOrIE.mjs";
import { n as createUpdateErrorFact, r as createUpdateFailureFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { r as formatErrorMessageForDisplay, t as attachErrorDiagnostic } from "./error-diagnostics-Cgksm9ND.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import { d as resolveDaemonServiceInstallGuidance, i as formatDaemonServiceInstallCommand } from "./shared-BiNxJvE7.mjs";
import { b as UpdatePreMutationError, v as SystemPackageOwnershipError } from "./update-global-BlXQRfes.mjs";
import { a as isUpdatePostInstallVerificationDeferred, i as isUpdateGatewayReadinessPending, o as updateRunStepsFromResultStep } from "./update-run-step-Db60sdKj.mjs";
import { c as mutateRun, d as recordUpdateRunDiagnostics, g as normalizeUpdateFailureResult } from "./update-run-write-Dd5ORe9V.mjs";
import { f as recordUpdateRunStep, g as UpdateRunAdmissionBusyError } from "./update-run-ledger-C3oL-g8r.mjs";
import { i as getUpdateRun } from "./update-run-reader-BOC3s3Sk.mjs";
import { c as updateRunReportInputFromResult, s as resolveUpdateRunVerifiedServingVersion } from "./update-run-report-rePuji8s.mjs";
import { t as UpdateRequesterRevokedError } from "./update-requester-authority-BP771TSP.mjs";
import { t as GitCleanupReportingError } from "./update-runner-git-cleanup-DohV8M13.mjs";
import { s as markControlPlaneUpdateRestartSentinelFailure, u as writeControlPlaneUpdateRestartSentinel } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import "./shared-DRiGAorf.mjs";
import { n as printResult } from "./progress-rcOXmnPk.mjs";
import { n as GatewayServiceUpdateOwnershipError } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { n as loadUpdateRecovery } from "./update-run-recovery-BUElUFkd.mjs";
import { r as classifyDoctorMaintenanceRefusal } from "./doctor-maintenance-inspection-D2Lw5Rm3.mjs";
//#region src/cli/update-cli/update-recovery-guidance.ts
function resolveUpdateResultNextAction(params) {
	const { result, env } = params;
	if (result.status === "skipped" && result.reason === "gateway-readiness-unverified") {
		const deferred = result.steps.find(isUpdatePostInstallVerificationDeferred)?.advisory;
		if (deferred) return deferred.message;
	}
	if (isUpdateGatewayReadinessPending(result) && !(result.recovery?.serviceRestartSafe === false && result.recovery.dataAtRisk)) return `The readiness observation ended without confirmation. Leave the Gateway starting and keep recovery backups; check current progress with \`${formatCliCommand("openclaw gateway status --deep", env)}\`.`;
	if (result.reason === "dirty") return `Local changes prevented this update before installation. Your checkout was preserved. Commit your changes and retry, or run \`${formatCliCommand("openclaw triage", env)}\` for help.`;
	if (result.status === "skipped" && result.reason && Object.hasOwn(UPDATE_INSTALL_SKIP_GUIDANCE, result.reason)) return UPDATE_INSTALL_SKIP_GUIDANCE[result.reason];
	if (result.status === "error") {
		const triageGuidance = `Run \`${formatCliCommand("openclaw triage", env)}\` on this machine to open a coding agent that can diagnose and repair the installation.`;
		const doctorSettlement = result.steps.findLast((step) => step.name === "doctor process settlement");
		if (result.recovery?.serviceRestartSafe === true && result.recovery.service === "healthy" && !result.recovery.packageRollbackVerified) {
			const refusal = result.rollbackOutcome?.reason;
			return `${refusal ? `Rollback refused: ${refusal}. ` : ""}The candidate Gateway is healthy and running on the preserved migrated state. Keep the recovery snapshots; stop the Gateway first (\`${formatCliCommand("openclaw gateway stop", env)}\`), then run \`${formatCliCommand("openclaw update repair", env)}\` to finish maintenance.`;
		}
		if (result.reason === "update-failed" && !result.recovery && (result.failedStep?.name === "requested" || result.failedStep?.name === "installation-inspection")) return `Update stopped before staging. Retry the same update command. If the failure persists, run \`${formatCliCommand("openclaw triage", env)}\` to inspect the recorded failure.`;
		if (result.reason === "update-activation-timeout") return formatUpdateActivationTimeoutGuidance((command) => formatCliCommand(command, env));
		if (result.reason === "rollback-project-changed") return `Other global packages changed after staging; automatic rollback was refused to preserve them. The new installation was left unchanged. Check \`${formatCliCommand("openclaw gateway status --deep", env)}\` before restarting it. ${triageGuidance}`;
		const hostLinkFailure = result.steps.some((step) => step.failureFacts?.some((fact) => fact.code === "host-owned-plugin-link"));
		const retentionGuidance = hostLinkFailure ? `A dependency link reaches OpenClaw-owned files that cannot be safely retained. Keep source files and backups; inspect the link in the local error and follow https://docs.openclaw.ai/cli/update#runtime-retention-failures. Do not skip runtime retention. After repairing the link, retry the update.` : void 0;
		const reason = result.recovery?.serviceRestartSafe === false ? result.recovery.reason : void 0;
		const failure = truncateUtf16Safe(params.verificationFailure ?? result.reason ?? reason ?? "", 240);
		const runningVersion = truncateUtf16Safe(params.runningVersion ?? "", 120);
		const servingVersion = truncateUtf16Safe(params.verifiedServingVersion ?? "", 120);
		const dataAtRisk = result.recovery?.serviceRestartSafe === false && result.recovery.dataAtRisk;
		const state = dataAtRisk ? `${doctorSettlement?.stderrTail ? `${doctorSettlement.stderrTail} ` : ""}Keep the Gateway stopped: data at risk (${dataAtRisk}). Keep the update installed and preserve recovery snapshots; do not roll back code alone. Run \`${formatCliCommand("openclaw update repair", env)}\` after ${dataAtRisk === "active-mutation" ? "the recorded processes have stopped" : "resolving this risk"}.` : servingVersion ? `Your Gateway is still serving ${servingVersion}; nothing to restore.${reason ? ` Restart remains unsafe (${reason}).` : ""}` : reason ? params.serviceRunning === true ? `The gateway is running${runningVersion ? ` ${runningVersion}` : ""} but did not pass verification (${failure}). Run \`${formatCliCommand("openclaw update repair", env)}\` and \`${formatCliCommand("openclaw gateway status --deep", env)}\`.` : `${params.serviceRunning === false ? "Managed gateway remains stopped because update recovery" : "Update recovery"} could not prove a runnable installation (${failure}). Run \`${formatCliCommand("openclaw update repair", env)}\` and \`${formatCliCommand("openclaw gateway status --deep", env)}\`.` : "";
		const configRefusal = result.steps.findLast((step) => step.name === "config-rollback")?.stderrTail;
		const failedStep = result.failedStep;
		const detail = result.reason && UPDATE_ENVIRONMENT_FAILURE_REASONS.has(result.reason) ? failedStep?.stderrTail : void 0;
		const foreignDestination = result.reason === UPDATE_FOREIGN_DESTINATION_REASON;
		return [
			detail,
			(foreignDestination || (result.mode === "npm" || result.mode === "pnpm" || result.mode === "bun") && (result.reason === "global-install-permission-denied" || failedStep !== void 0 && failedStep.exitCode !== 0 && !failedStep.advisory && /^package-(?:install|pack|stage|verify|swap|rollback|backup-retention|permissions)(?:-|$)/.test(failedStep.name) && /\beacces\b/i.test(failedStep.stderrTail ?? ""))) && (params.environment?.container ?? isContainerEnvironment()) ? `Detected ${foreignDestination ? "a foreign npm destination" : "package update permission failure"} inside a container. Pull or build an OpenClaw image with the target version, then recreate or redeploy the container with the same state/config mounts. In-container package changes are not durable.` : "",
			configRefusal,
			state,
			retentionGuidance,
			servingVersion && !hostLinkFailure ? `Fix ${truncateUtf16Safe(result.reason ?? "the update failure", 240)} then run \`${formatCliCommand("openclaw update", env)}\` again.` : void 0,
			!servingVersion && (reason || !detail) ? triageGuidance : void 0
		].filter(Boolean).join(" ");
	}
	const command = (value) => formatCliCommand(value, env);
	if (result.reason === "not-git-install") return `This OpenClaw install isn't a git checkout, and the package manager couldn't be detected. Update via your package manager, then run \`${command("openclaw doctor")}\` and \`${command("openclaw gateway restart")}\`. Examples: \`npm i -g openclaw@latest\` or \`pnpm add -g openclaw@latest\`.`;
	if (result.status === "ok") {
		if (result.recovery?.serviceRestartSafe === true && result.recovery.service === "healthy") return `Gateway recovery is healthy. Retained update warnings and backups need repair; run \`${command("openclaw update repair")}\`.`;
		if (params.restart === false && result.postUpdate?.plugins?.changed) return `Plugins updated; Gateway restart skipped (--no-restart). Run \`${command("openclaw gateway restart")}\` to activate them in the running Gateway.`;
		return `After confirming the update and your conversations are healthy, preview retained migration originals eligible for permanent cleanup with \`${command("openclaw update cleanup --dry-run")}\` for state \`${params.environment?.stateDir ?? resolveStateDir(env)}\`. Before applying cleanup, stop the Gateway first (\`${command("openclaw gateway stop")}\`). Use the same profile, state, and config settings.`;
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
/** Timing is diagnostic only: a lost history write never changes the update outcome. */
function recordServiceTimedStep(result, step, run) {
	result.steps.push(step);
	if (!run) return;
	const endedAtMs = Date.now();
	const startedAtMs = Math.max(0, endedAtMs - step.durationMs);
	try {
		for (const row of updateRunStepsFromResultStep(step)) recordUpdateRunStep(run.runId, {
			...row,
			startedAtMs,
			endedAtMs
		}, { env: run.env });
	} catch {}
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
	const refusal = classifyDoctorMaintenanceRefusal(failure.cause);
	const preMutationFailure = cause instanceof UpdatePreMutationError;
	const pkgOwnershipFailure = cause instanceof SystemPackageOwnershipError;
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
	if (refusal.kind === "data-at-risk") result.recovery = {
		serviceRestartSafe: false,
		reason: "runtime-verification-failed",
		dataAtRisk: refusal.reason
	};
	return {
		...result,
		status: "error",
		reason,
		failedStep,
		steps: stepResult?.failedStep ? stepResult.steps : [...stepResult?.steps ?? [], failedStep]
	};
}
function isUpdateStateReadContention(error) {
	return collectNestedErrorCandidates(error).some(isStateDatabaseMaintenanceContention) && classifyDoctorMaintenanceRefusal(error).kind !== "data-at-risk";
}
const withUpdateStateRead = (read, timeoutMs) => acquireWithWait({
	acquire: read,
	shouldRetry: isUpdateStateReadContention,
	deadlineMs: performance.now() + timeoutMs,
	pollIntervalMs: 250
});
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
			recovery: primary instanceof UpdatePreMutationError || isUpdateStateReadContention(params.cause) ? await params.originalRecovery() : {
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
		if (error instanceof UpdateRunAdmissionBusyError || error instanceof SystemPackageOwnershipError && error.owned) {
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
		if (!(error instanceof GatewayServiceUpdateOwnershipError) && !(error instanceof SystemPackageOwnershipError)) throw error;
		const message = error instanceof SystemPackageOwnershipError ? error.message : `${error.message} Run \`openclaw gateway status --deep\` from the service's owning account before retrying.`;
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
	}
};
/** A conservative pending outcome, never a grant of recovery or mutation authority. */
var UpdateCommandPendingRecoveryFailure = class extends UpdateCommandFailure {
	constructor(result, detail, options) {
		super({
			...result,
			status: "error",
			reason: result.status === "error" ? result.reason ?? "update-recovery-pending" : "update-recovery-pending",
			recovery: isUpdateStateReadContention(options?.cause) || result.recovery?.serviceRestartSafe === false ? result.recovery : {
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
	}, 1, `${failure.error.message}; Windows autostart recovery: ${formatErrorMessage(recoveryError)}`, { cause: recoveryError }) };
	return { error: failure ? new AggregateError([failure.error, recoveryError], `Update failed (${formatErrorMessage(failure.error)}) and Windows autostart recovery failed (${formatErrorMessage(recoveryError)})`, { cause: failure.error }) : recoveryError };
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
		defaultRuntime[params.jsonMode ? "error" : "log"](params.jsonMode ? message : theme.warn(message));
	}
}
async function markControlPlaneUpdateRestartSentinelFailureBestEffort(params) {
	if (!params.meta) return;
	try {
		await markControlPlaneUpdateRestartSentinelFailure(params.reason, params.meta, params.env);
	} catch (err) {
		const message = `Failed to mark update.run restart sentinel failed: ${String(err)}`;
		defaultRuntime[params.jsonMode ? "error" : "log"](params.jsonMode ? message : theme.warn(message));
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
			restart: params.opts.restart,
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
export { reportUpdateCommandPendingRecovery as _, collectServiceInspectionFailureFacts as a, withUpdateStateRead as b, formatUpdateFinalizationError as c, mergeWindowsTaskRecoveryFailure as d, prepareUpdateServiceResult as f, recordUpdateResultNextAction as g, recordServiceTimedStep as h, UpdateCommandPendingRecoveryFailure as i, isUpdateStateReadContention as l, recordServiceReconciliationWarnings as m, UpdateCommandFailure as n, createUpdateCommandFailureResult as o, recordServiceReconciliationWarning as p, UpdateCommandFinalizedRecoveryFailure as r, failUpdateCommandRun as s, UnreportedUpdateAdmissionOutcome as t, markControlPlaneUpdateRestartSentinelFailureBestEffort as u, resolveMutableUpdateFailure as v, writeControlPlaneUpdateRestartSentinelBestEffort as x, withUpdateAdmissionReporting as y };
