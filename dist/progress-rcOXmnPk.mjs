import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as isStateDatabaseMaintenanceContention } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { n as formatUpdateFailureFact } from "./update-failure-facts-format-DbAtk-ZC.mjs";
import { n as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BuT3Q1bJ.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { o as toPublicUpdateRun, s as updateStepDiagnostics } from "./update-run-record-Chv9kKnY.mjs";
import { r as isFailedUpdateStep } from "./update-run-step-Db60sdKj.mjs";
import "./update-run-ledger-C3oL-g8r.mjs";
import { i as getUpdateRun, o as getUpdateRunForProgressAsync } from "./update-run-reader-BOC3s3Sk.mjs";
import { r as formatUpdateDoctorLintFinding } from "./update-doctor-lint-BSXy6tAC.mjs";
import { r as formatDurationPrecise } from "./format-duration-CyyGVUjR.mjs";
import { a as renderUpdateRunReport, c as updateRunReportInputFromResult } from "./update-run-report-rePuji8s.mjs";
import { u as writeUpdateRunReportArtifact } from "./update-failure-report-artifact-ZpnzvCW7.mjs";
import { spinner } from "@clack/prompts";
//#region src/cli/update-cli/progress.ts
const activeUpdateProgress = /* @__PURE__ */ new Map();
const UPDATE_PROGRESS_POLL_MS = 250;
const UPDATE_STEP_NOTICE_MS = 3e4;
function createUpdateProgress(enabled, run) {
	if (!enabled) return {
		progress: {},
		stop: () => {},
		suspend: () => {},
		resume: () => {},
		dispose: () => {}
	};
	let currentSpinner = null;
	let timer;
	let stepNotice;
	let currentRecord;
	let pendingRead;
	let polling = true;
	let observation = "active";
	const seenPhases = /* @__PURE__ */ new Set();
	const stop = () => {
		if (stepNotice) {
			clearInterval(stepNotice);
			stepNotice = void 0;
		}
		currentSpinner?.clear();
		currentSpinner = null;
	};
	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	};
	const pausePolling = () => {
		polling = false;
		clearTimer();
		pendingRead?.abort();
	};
	const renderRecord = (record) => {
		if (observation !== "active" || !run || !record) return;
		currentRecord = record;
		for (const phase of UPDATE_RUN_PHASES) {
			const recorded = record.steps.some((step) => step.step === phase && step.status !== "pending");
			if (!seenPhases.has(phase) && (recorded || phase === record.phase)) {
				seenPhases.add(phase);
				stop();
				defaultRuntime.log(`Phase: ${phase}`);
			}
		}
		if (record.status !== "running") clearTimer();
	};
	const finalize = (record, terminal = record?.status !== "running") => {
		try {
			renderRecord(record);
		} finally {
			if (terminal) {
				observation = "disposed";
				pausePolling();
				if (run && activeUpdateProgress.get(run.runId)?.finish === finalize) activeUpdateProgress.delete(run.runId);
			}
			stop();
		}
	};
	const poll = async () => {
		timer = void 0;
		if (!polling || pendingRead || observation !== "active" || !run) return;
		const controller = new AbortController();
		pendingRead = controller;
		try {
			const record = await getUpdateRunForProgressAsync(run.runId, { env: run.env }, controller.signal);
			if (!controller.signal.aborted) {
				if (!currentRecord || !record || record.updatedAtMs >= currentRecord.updatedAtMs) renderRecord(record);
				polling = record?.status === "running";
			}
		} catch (error) {
			if (!controller.signal.aborted && !isStateDatabaseMaintenanceContention(error)) {
				polling = false;
				defaultRuntime.error(`Update progress history unavailable: ${formatErrorMessage(error)}`);
			}
		} finally {
			pendingRead = void 0;
			if (polling && observation === "active") {
				timer = setTimeout(() => void poll(), UPDATE_PROGRESS_POLL_MS);
				timer.unref?.();
			}
		}
	};
	if (run) {
		poll();
		activeUpdateProgress.set(run.runId, {
			finish: finalize,
			pause: () => {
				pausePolling();
				stop();
			}
		});
	}
	return {
		progress: {
			onStepStart: (step, record) => {
				finalize(record ?? currentRecord, false);
				const label = currentRecord ? `${currentRecord.phase} — ${step.name}` : step.name;
				if (process.stdout.isTTY) {
					currentSpinner = spinner({ indicator: "timer" });
					currentSpinner.start(theme.accent(label));
				} else {
					defaultRuntime.log(`${label}...`);
					const startedAtMs = Date.now();
					stepNotice = setInterval(() => {
						defaultRuntime.log(`${label} — still running (${formatDurationPrecise(Date.now() - startedAtMs)})`);
					}, UPDATE_STEP_NOTICE_MS);
					stepNotice.unref?.();
				}
			},
			onStepComplete: (step, record) => {
				finalize(record ?? currentRecord, false);
				printStep(step);
			}
		},
		stop,
		suspend: () => {
			if (observation === "active") {
				observation = "suspended";
				currentRecord = void 0;
				pausePolling();
				stop();
			}
		},
		resume: () => {
			if (observation === "suspended") {
				observation = "active";
				polling = true;
				poll();
			}
		},
		dispose: () => finalize(currentRecord, true)
	};
}
function printStep(step) {
	const duration = theme.muted(`(${formatDurationPrecise(step.durationMs)})`);
	const termination = step.termination === "timeout" || step.termination === "no-output-timeout" ? " — timed out" : step.signal ? ` — interrupted (${step.signal})` : "";
	const statusIcon = step.advisory ? theme.warn("!") : !isFailedUpdateStep(step) ? theme.success("✓") : step.exitCode === null ? theme.warn("?") : theme.error("✗");
	defaultRuntime.log(`  ${statusIcon} ${step.name}${termination} ${duration}`);
	for (const finding of step.doctorLintFindings ?? []) defaultRuntime.log(`    ${formatUpdateDoctorLintFinding(finding)}`);
	if (step.advisory === void 0 && !isFailedUpdateStep(step)) return;
	if (!step.advisory && step.failureFacts?.length) for (const fact of step.failureFacts) defaultRuntime.log(`    ${theme.error(formatUpdateFailureFact(fact))}`);
	const color = step.advisory !== void 0 ? theme.warn : theme.error;
	if (step.advisory) defaultRuntime.log(`    ${color(step.advisory.message)}`);
	const tails = step.advisory ? [step.stdoutTail, step.stderrTail] : updateStepDiagnostics(step).tails;
	for (const output of tails) for (const line of (output ?? "").trimEnd().split("\n").slice(step.termination === "signal" ? -80 : -10)) if (line.trim()) defaultRuntime.log(`    ${color(line)}`);
}
async function printResult(result, opts, reportHints = {}) {
	const finalizeProgress = result.runId ? activeUpdateProgress.get(result.runId) : void 0;
	finalizeProgress?.pause();
	let run;
	let report;
	const readRun = result.runId && !reportHints.record && reportHints.readHistory !== false ? () => {
		try {
			return getUpdateRun(result.runId, { env: opts.run?.env });
		} catch (error) {
			defaultRuntime.error(`Update report history unavailable: ${formatErrorMessage(error)}`);
			return;
		}
	} : void 0;
	const renderReport = (current) => {
		run = reportHints.record ?? current;
		finalizeProgress?.finish(run);
		report = renderUpdateRunReport(updateRunReportInputFromResult(result, run), {
			...reportHints,
			mode: result.mode === "unknown" ? run?.target.kind : result.mode,
			markdownLimit: Infinity
		});
		return report;
	};
	const reportPath = await writeUpdateRunReportArtifact({
		result,
		report: renderReport,
		readRun,
		env: opts.run?.env,
		detached: reportHints.readHistory === false
	}).catch((error) => {
		defaultRuntime.error(`Update report could not be saved: ${formatErrorMessage(error)}`);
	});
	report ??= renderReport(readRun?.());
	if (opts.json) {
		defaultRuntime.writeJson({
			...result,
			...run ? { run: toPublicUpdateRun(run) } : {},
			reportPath
		});
		return;
	}
	defaultRuntime.log("");
	defaultRuntime.log(theme.heading(report.headline));
	if (reportPath) defaultRuntime.log(`Report: ${reportPath}`);
	for (const line of report.lines) defaultRuntime.log(line);
}
//#endregion
export { printResult as n, createUpdateProgress as t };
