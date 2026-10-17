import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { w as trimLogTail } from "./restart-sentinel-CWHFSDjo.mjs";
import { n as createUpdateErrorFact } from "./update-failure-facts-CetdnXr-.mjs";
import { a as runStep, t as MAX_LOG_CHARS } from "./update-runner-command-rYXXMsH4.mjs";
import { t as UpdateRequesterRevokedError } from "./update-requester-authority-sTeqCewg.mjs";
import { r as formatUpdateCleanupCommand } from "./update-maintenance-BAtM5r2e.mjs";
import fs from "node:fs/promises";
//#region src/infra/update-runner-git-cleanup.ts
const PREFLIGHT_CLEANUP_TIMEOUT_MS = 6e4;
/** Only reporting failed; no runtime or process-settlement verdict is implied. */
var GitCleanupReportingError = class extends AggregateError {
	constructor(primary, reportingFailures) {
		super([primary, ...reportingFailures], "Git update and cleanup reporting failed", { cause: primary });
	}
};
async function reportCleanupProgress(report, onReportingError) {
	try {
		await report();
	} catch (error) {
		const refusal = error instanceof Error ? error.cause : void 0;
		if (hasCommandProcessCleanupError(error) || error instanceof AggregateError) throw error;
		if (!(error instanceof UpdateRequesterRevokedError || refusal instanceof UpdateRequesterRevokedError)) onReportingError(error);
	}
}
async function repairPreflightCleanup(worktreeDir, preflightRoot) {
	try {
		await fs.rm(worktreeDir, {
			recursive: true,
			force: true,
			maxRetries: 3,
			retryDelay: 200
		});
		await fs.rm(preflightRoot, {
			recursive: true,
			force: true,
			maxRetries: 3,
			retryDelay: 200
		});
		return true;
	} catch {
		return false;
	}
}
async function cleanupGitPreflight(params, worktreeDir, preflightRoot) {
	const options = {
		...params.step("preflight-cleanup", [
			"git",
			"-C",
			params.gitRoot,
			"worktree",
			"remove",
			"--force",
			"--force",
			worktreeDir
		], params.gitRoot),
		runCommand: params.runCommand
	};
	const reportingFailures = [];
	const onReportingError = (error) => {
		reportingFailures.push(error);
		params.onCleanupReportingError?.(error);
	};
	const cleanupSignal = new AbortController().signal;
	const cleanupTimeoutMs = Math.min(options.timeoutMs ?? PREFLIGHT_CLEANUP_TIMEOUT_MS, PREFLIGHT_CLEANUP_TIMEOUT_MS);
	const runCleanupCommand = (argv, commandOptions) => options.runCommand(argv, {
		...commandOptions,
		signal: cleanupSignal,
		timeoutMs: cleanupTimeoutMs
	});
	const removeStep = await runStep({
		...options,
		progress: {
			...options.progress,
			onStepStart: (step) => reportCleanupProgress(() => options.progress?.onStepStart?.(step), onReportingError),
			onStepComplete: void 0
		},
		runCommand: runCleanupCommand,
		timeoutMs: cleanupTimeoutMs
	});
	if (removeStep.exitCode !== 0 && await repairPreflightCleanup(worktreeDir, preflightRoot)) {
		removeStep.exitCode = 0;
		const message = process.platform === "win32" ? "windows fallback cleanup removed preflight tree" : "fallback cleanup removed preflight tree";
		removeStep.stderrTail = trimLogTail([removeStep.stderrTail, message].filter(Boolean).join("\n"), MAX_LOG_CHARS);
	}
	await runCleanupCommand([
		"git",
		"-C",
		options.cwd,
		"worktree",
		"prune"
	], { cwd: options.cwd }).catch((error) => {
		if (hasCommandProcessCleanupError(error)) throw error;
		return null;
	});
	const removed = await fs.rm(preflightRoot, {
		recursive: true,
		force: true,
		maxRetries: 3,
		retryDelay: 200
	}).then(() => true, (error) => {
		if (hasCommandProcessCleanupError(error)) throw error;
		if (removeStep.exitCode === 0) removeStep.exitCode = 1;
		removeStep.stderrTail = trimLogTail([removeStep.stderrTail, formatErrorMessage(error)].filter(Boolean).join("\n"), MAX_LOG_CHARS);
		return false;
	});
	if (removeStep.exitCode !== 0) removeStep.advisory = {
		kind: "recoverable-maintenance",
		message: `Skipped preflight cleanup. Remove the retained temporary copy with: ${formatUpdateCleanupCommand(preflightRoot)}. Reason: ${removeStep.stderrTail || "temporary worktree removal failed"}`
	};
	await reportCleanupProgress(() => options.progress?.onStepComplete?.({
		...removeStep,
		index: options.stepIndex,
		total: options.totalSteps
	}), onReportingError);
	if (reportingFailures.length > 0) options.results?.push({
		name: "preflight-cleanup-reporting",
		command: "",
		cwd: options.cwd,
		durationMs: 0,
		exitCode: 0,
		advisory: {
			kind: "recoverable-maintenance",
			message: "Preflight cleanup reporting failed; cleanup was still attempted."
		},
		failureFacts: reportingFailures.map((error) => createUpdateErrorFact("preflight-cleanup-reporting", error, options.env))
	});
	return removed;
}
/** Settle owned artifacts before exposing either the update result or its failure. */
async function settleGitUpdateCleanup(update, cleanup, reportingFailures) {
	let outcome;
	try {
		outcome = { result: await update() };
	} catch (error) {
		outcome = { error };
	}
	let cleanupFailure;
	try {
		await cleanup();
	} catch (error) {
		cleanupFailure = { cause: error };
	}
	if (cleanupFailure) {
		if ("error" in outcome) throw new AggregateError([
			outcome.error,
			...reportingFailures,
			cleanupFailure.cause
		], "Git update and cleanup failed", { cause: outcome.error });
		throw cleanupFailure.cause;
	}
	if ("error" in outcome) {
		if (reportingFailures.length > 0) throw new GitCleanupReportingError(outcome.error, reportingFailures);
		throw outcome.error;
	}
	return outcome.result;
}
//#endregion
export { cleanupGitPreflight as n, settleGitUpdateCleanup as r, GitCleanupReportingError as t };
