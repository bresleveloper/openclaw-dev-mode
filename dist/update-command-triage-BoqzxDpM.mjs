import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { f as isVerifiedUpdateRollback, s as classifyUpdateOutcome } from "./update-outcome-DLbo5ecI.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import "./update-post-core-context-D3kte0je.mjs";
import "./update-run-ledger-C3oL-g8r.mjs";
import { i as getUpdateRun } from "./update-run-reader-BOC3s3Sk.mjs";
import { r as sanitizeTriageUpdateFailure } from "./triage-update-YKF7SYYY.mjs";
import { l as writeTriageUpdateFailure } from "./update-failure-report-artifact-ZpnzvCW7.mjs";
import { i as resolveInstallationTarget } from "./installation-target-context-B9ZDUs_O.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { c as readControlPlaneUpdateSentinelMeta } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { p as resolveUpdateRoot } from "./shared-DRiGAorf.mjs";
import { t as formatInstallationTargetCommand } from "./installation-target-format-CiRghKkr.mjs";
import { _ as reportUpdateCommandPendingRecovery, i as UpdateCommandPendingRecoveryFailure, n as UpdateCommandFailure, r as UpdateCommandFinalizedRecoveryFailure } from "./update-command-result-BgqRj9_Z.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-D92bdO16.mjs";
import { c as select$1, r as confirm$1 } from "./configure.shared-zeOIE-aJ.mjs";
import { n as prepareUpdateFailureReport, r as preparePublicUpdateFailureIdentifiers, t as submitUpdateFailureReport } from "./update-failure-report-BHbWAxsD.mjs";
import { randomUUID } from "node:crypto";
import { isCancel } from "@clack/prompts";
//#region src/cli/update-cli/update-command-report.ts
/** Interactive, explicit consent flow for one final update failure report. */
function renderSubmissionResult(result, browserRequested) {
	if (result.status === "created") return [`Created GitHub issue: ${result.url}`, ...result.message ? [result.message] : []];
	if (result.status === "fallback") return [
		browserRequested ? result.message : `GitHub issue creation was unavailable: ${result.message}`,
		...browserRequested ? [`Prefilled issue: ${result.fallbackUrl}`] : [],
		`Saved sanitized report: ${result.savedReportPath}`
	];
	if (result.status === "retryable") return [result.message];
	return [
		result.message,
		...result.url ? [`Existing issue: ${result.url}`] : [],
		...browserRequested && result.fallbackUrl ? [`Existing prefilled issue: ${result.fallbackUrl}`] : []
	];
}
/** Offers report as a distinct interactive action; callers retain triage ownership. */
async function runInteractiveUpdateFailureAction(params) {
	let prepared;
	let browserAvailable = false;
	let reportPending = false;
	const stateDir = resolveStateDir(params.env);
	while (true) {
		const action = await select$1({
			message: params.rollbackCompleted ? "Update failed, but rollback completed successfully. Choose the next action" : "Choose the next action for this failed update",
			...params.rollbackCompleted ? { initialValue: "dismiss" } : {},
			options: [
				{
					value: "triage",
					label: "Diagnose update failure"
				},
				reportPending ? {
					value: "status",
					label: "Check report status"
				} : {
					value: "report",
					label: "Report update failure"
				},
				...browserAvailable ? [{
					value: "browser",
					label: "Report in browser"
				}] : [],
				{
					value: "dismiss",
					label: "Exit"
				}
			]
		});
		if (isCancel(action) || action === "dismiss") return "handled";
		if (action === "triage") return "triage";
		try {
			const result = params.result ?? {
				status: "error",
				mode: "unknown",
				steps: [],
				durationMs: 0
			};
			if (!prepared) {
				let recordedRun;
				try {
					recordedRun = getUpdateRun(params.attemptId, { env: params.env });
				} catch {}
				prepared = await prepareUpdateFailureReport({
					attemptId: params.attemptId,
					action: "cli",
					...params.error ? { error: params.error } : {},
					result,
					recordedRun,
					...result.after?.upstreamRef ? { target: result.after.upstreamRef } : {}
				}, {
					env: params.env,
					stateDir
				});
			}
			params.runtime.log("Sanitized update failure report preview:");
			params.runtime.log(prepared.body);
			const confirmed = await confirm$1({
				message: action === "browser" ? "Prepare a browser link to review and submit this report yourself?" : action === "status" ? "Check whether this report was submitted to openclaw/openclaw?" : "Submit this sanitized report to openclaw/openclaw now?",
				initialValue: false
			});
			if (isCancel(confirmed) || !confirmed) {
				params.runtime.log("Update failure report cancelled.");
				return "handled";
			}
			browserAvailable = false;
			const submitted = await submitUpdateFailureReport(prepared, prepared.previewDigest, {
				env: params.env,
				stateDir,
				...action === "browser" ? { publicationMode: "browser" } : action === "status" ? { publicationMode: "reconcile" } : { allowBrowserFallback: false }
			});
			reportPending = submitted.status === "pending";
			browserAvailable = prepared.browserFallback.status === "available" && (submitted.status === "retryable" || submitted.status === "fallback" || submitted.status === "duplicate" && Boolean(submitted.fallbackUrl));
			for (const line of renderSubmissionResult(submitted, action === "browser")) params.runtime.log(line);
			if (submitted.status === "created" || submitted.status === "duplicate" && submitted.url || action === "browser" && submitted.fallbackUrl) return "handled";
		} catch (error) {
			params.runtime.error(`Update failure report failed: ${formatErrorMessage(error)}`);
		}
	}
}
//#endregion
//#region src/cli/update-cli/update-command-triage.ts
async function withUpdateFailureTriage(opts, target, run) {
	const handleFailure = await prepareUpdateCommandFailureTriage(opts, target);
	try {
		await run();
	} catch (error) {
		await handleFailure(error);
	}
}
/** Capture repair code and operator context before replacing the installation. */
async function prepareUpdateCommandFailureTriage(opts, target) {
	const updateAttemptId = opts.run?.runId ?? randomUUID();
	const mode = opts.json ? "json" : !opts.yes && isTerminalInteractive() ? "interactive" : "non-interactive";
	if (mode === "interactive") await preparePublicUpdateFailureIdentifiers();
	const { prepareUpdateFailureTriage } = await import("./update-triage-CSYgnH_S.mjs");
	const runTriage = await prepareUpdateFailureTriage({
		mode,
		runtime: {
			...defaultRuntime,
			log: opts.json ? defaultRuntime.error : defaultRuntime.log
		},
		invocationCwd: opts.invocationCwd
	});
	return async (error) => {
		if (error instanceof ExitError) throw error;
		if (hasCommandProcessCleanupError(error)) throw error;
		const causes = collectNestedErrorCandidates(error);
		const finalized = causes.find((cause) => cause instanceof UpdateCommandFinalizedRecoveryFailure);
		if (finalized) return exitCliAfterOutput(defaultRuntime, finalized.exitCode);
		const pending = causes.find((cause) => cause instanceof UpdateCommandPendingRecoveryFailure);
		if (pending) return reportUpdateCommandPendingRecovery(pending, opts);
		const reportedFailure = error instanceof UpdateCommandFailure;
		if (reportedFailure && error.result.reason === "invalid-dev-target") return exitCliAfterOutput(defaultRuntime, error.exitCode);
		const rollbackCompleted = reportedFailure && isVerifiedUpdateRollback(error.result);
		if (rollbackCompleted && (mode !== "interactive" || target.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" || error.result.steps.some((step) => step.termination === "signal"))) return exitCliAfterOutput(defaultRuntime, error.exitCode);
		if ((!reportedFailure || classifyUpdateOutcome(error.result) === "failed") && !opts.dryRun && target.env["OPENCLAW_UPDATE_POST_CORE"] !== "1") {
			const failure = reportedFailure ? {
				result: error.result,
				...error.detail ? { error: error.detail } : {}
			} : {
				...target.failureResult ? { result: target.failureResult } : {},
				error: formatErrorMessage(error)
			};
			if (target.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1") try {
				const meta = await readControlPlaneUpdateSentinelMeta(target.env);
				if (!meta?.triageContextPath) throw new Error("Managed update triage context path is unavailable.", { cause: error });
				const updateResultPath = await writeTriageUpdateFailure(failure, {
					env: target.env,
					...meta?.triageContextPath ? { outputPath: meta.triageContextPath } : {}
				});
				defaultRuntime.error(`To start a repair agent, run ${formatInstallationTargetCommand([
					"openclaw",
					"triage",
					"--run",
					"--update-result",
					updateResultPath
				], resolveInstallationTarget(target.env), { env: target.env })}`);
			} catch (exportError) {
				const diagnostic = sanitizeTriageUpdateFailure({ error: formatErrorMessage(exportError) }, {
					env: target.env,
					stateDir: resolveStateDir(target.env)
				});
				defaultRuntime.error(`Managed update failure diagnostics could not be saved: ${diagnostic.error}`);
			}
			else {
				let nextAction = "triage";
				if (mode === "interactive") try {
					nextAction = await runInteractiveUpdateFailureAction({
						attemptId: updateAttemptId,
						env: opts.run?.env ?? target.env,
						...failure.error ? { error: failure.error } : {},
						...failure.result ? { result: failure.result } : {},
						...rollbackCompleted ? { rollbackCompleted: true } : {},
						runtime: defaultRuntime
					});
				} catch (reportError) {
					defaultRuntime.error(`Update failure report could not be prepared: ${formatErrorMessage(reportError)}`);
					nextAction = "handled";
				}
				if (nextAction === "triage") await runTriage({
					failure,
					target: mode === "interactive" ? target : {
						...target,
						nodeRunner: target.nodeRunner ?? resolveNodeRunner()
					},
					resolveRoot: resolveUpdateRoot
				});
			}
		}
		if (reportedFailure) exitCliAfterOutput(defaultRuntime, error.exitCode);
		throw error;
	};
}
//#endregion
export { withUpdateFailureTriage as n, prepareUpdateCommandFailureTriage as t };
